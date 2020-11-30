const { db } = global;

const promisify = require('../../helpers/promisify');
const { CustomError } = require('../../helpers/errors');
class Chat {
  get(id) {
    return new Promise((resolve, reject) => {
      db('chats')
        .where({
          id,
        })
        .andWhereRaw('"isDeleted" is not true')
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  async getChatIdByLink(link) {
    const [data] = await db('chats')
      .select('id')
      .where({ link })
      .andWhereRaw('"isDeleted" is not true');
    return data;

  }
  async getMainChatInfo(id, trx) {
    const data = await (trx || db).raw(`
    select 
      ch.id as "chatId",
      ch."name",
      ch."type",
      ch."description",
      ch."link",
      ch."avatar"
    from chats ch where id = ?`,
    [id]);
    return data.rows[0];

  }

  async getMessages({ userId = 0, chatId }, { limit = 25, offset = 0 }, trx) {
    const data = await (trx || db).raw(`
    select
      
      m."id",
      m."senderId",
      m."text",
      (select a."key" from attachments a where a.id = m."attachmentId") as "attachment",
      (select a.resolution from attachments a where a.id = m."attachmentId") as "resolution",
      (select a.duration from attachments a where a.id = m."attachmentId") as "duration",
      (select a.waveform from attachments a where a.id = m."attachmentId") as "waveform",
      (select a."originalName" from attachments a where a.id = m."attachmentId") as "originalName",

      m."createdAt",
      m."type",
      (
        select array_agg(json_build_object(
          'id', cm2.id,
          'type', cm2."type",
          'avatar', cm2.avatar,
          'name', cm2."name"
        )) as "memberships" from chats_memberships cm2
        join chats_memberships_messages cmm2 on cmm2."chatMembershipId" = cm2.id
        where cmm2."messageId" = m.id
      )
      
    from messages m
    join chats_memberships_messages cmm on cmm."messageId" = m.id 
    join chats_memberships cm on cm.id = cmm."chatMembershipId" 
    where cm."chatId" = ?
    and (
      (select ca."adminId" from chats_admins ca where ca."chatId" = cm."chatId" and ca."adminId" = ?)::boolean
      or (? != 0  and cm.id in (select cmu."chatMembershipId" from chats_memberships_users cmu where cmu."userId" = ?))
      or (? = 0 and cm."type" = 'standard')


    )
    group by m.id
    order by m.id desc
    limit ?
    offset ?
    `, [chatId, userId, userId, userId, userId, limit, offset],
    );

    const { rows: firstMessageData } = await (trx || db).raw(`
    select
      
      m."id"
    from messages m
    join chats_memberships_messages cmm on cmm."messageId" = m.id 
    join chats_memberships cm on cm.id = cmm."chatMembershipId" 
    where cm."chatId" = ?
    and (
      (select ca."adminId" from chats_admins ca where ca."chatId" = cm."chatId" and ca."adminId" = ?)::boolean
      or (? != 0  and cm.id in (select cmu."chatMembershipId" from chats_memberships_users cmu where cmu."userId" = ?))
      or (? = 0 and cm."type" = 'standard')
    )
    order by m.id asc
    limit 1
    `, [chatId, userId, userId, userId, userId],
    );

    const firstMessage = firstMessageData && firstMessageData.length && firstMessageData[0].id;
    const list = data.rows;

    const hasMore = firstMessage && list.length && (firstMessage !== list[list.length - 1].id);
    return { hasMore, messages: list };
  }

  getFull(link, userId) {
    return new Promise((resolve, reject) => {
      db.raw(`
      select 
      id, 
      "type",
      "name",
      description,
      link,
      avatar,
      (select ca."adminId" from chats_admins ca where ca."adminId" = ? and ca."chatId" = ch.id)::boolean as "isAdmin",
      (
        select count(distinct cmu."userId") from chats_memberships_users cmu where cmu."chatMembershipId" in (
          select cm.id from chats_memberships cm where cm."chatId" = ch.id
        )
      ) as "subscribers",
      (
        select 
      	array_agg(json_build_object(
          'id', cm.id, 
          'name', cm."name", 
          'description', cm."description", 
          'avatar', cm."avatar", 
          'amount', cm."amount", 
          'type', cm."type",
          'subscribe', (
          	select json_build_object('endedAt', cmu."endedAt") 
          	from chats_memberships_users cmu 
          	where cmu."chatMembershipId" = cm.id
          	and cmu."userId" = ?
          	and cmu."createdAt" < now() 
            and cmu."endedAt" > now()
            order by cmu."endedAt" desc
            limit 1
          )
        )) 
        from chats_memberships cm
        where cm."chatId" = ch.id
      ) as "memberships",
      (
        select json_build_object('id', cm.id, 'name', cm.name, 'amount', cm.amount, 'type', cm.type) 
        from chats_memberships cm 
        where cm."chatId" = ch.id 
        and cm.type = 'standard' limit 1
      ) as "standardMembership"
      from chats ch
      where ch."link" = ?
      `,
      [userId, userId, link])
        .then(res => {
          resolve(res.rows[0]);
        })
        .catch(err => reject(err));
    });
  }

  async create({ name, description, avatar, link, type }, usersList, adminId) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [ chatId ] = await trx('chats')
        .insert({ name, description, avatar, link, type })
        .returning('id');
      const [chatMembershipId] = await trx('chats_memberships')
        .insert({
          name: 'personal',
          chatId,
          amount: 0,
          type: 'standard',
        })
        .returning('id');

      let message;

      if (type === 'group') {
        const [{ id: messageId }] = await trx('messages')
          .insert({
            senderId: -1,
            text: 'Chat has been created',
          })
          .returning(['id']);
        await trx('chats_memberships_messages')
          .insert({
            messageId,
            chatMembershipId,
          });

        message = {
          attachment: null,
          chatId,
          chatType: 'group',
          count: 0,
          createdAt: new Date(),
          isRead: true,
          senderId: -1,
          text: 'Chat has been created',
          type: 'text',
          opponent: {
            avatar: null,
            description,
            id: chatId,
            link,
            name,
            type,
          },
        };
      }

      if (usersList.length || adminId) {
        const users = await trx('users')
          .whereIn('id', adminId ? [...usersList, adminId] : usersList)
          .select(
            'id AS userId',
            trx.raw('? AS ??', [chatMembershipId, 'chatMembershipId']),
            trx.raw('? AS ??', [0, 'amount']),
            trx.raw(`'infinity'::timestamp AS ??`, ['endedAt']),
          );

        await trx('chats_memberships_users')
          .insert(users);
      }

      if (adminId) {
        await trx('chats_admins')
          .insert({
            adminId,
            chatId,
          });
      }

      await trx.commit();
      return message || { chatId, chatMembershipId };
    } catch (e) {
      console.error(e);
      await trx.rollback('Internal server error');
      throw new CustomError('Internal server error', 500);
    }
  }

  deleteChat(id) {
    return db('chats')
      .update({ isDeleted: true })
      .where({ id });
  }

  join(fields) {
    return new Promise((resolve, reject) => {
      db('chats_users')
        .insert(fields)
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  updateAvatar(id, avatar) {
    return db('chats')
      .update({ avatar })
      .where({ id });
  }

  update(id, fields) {
    return db('chats')
      .update(fields)
      .where({ id });
  }

  isMember({ userId, chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_users')
        .where({
          userId,
          chatId,
        })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }
  async getChatByMessageId(messageId) {
    const [data] = await db
      .select('chats.id as chatId', 'chats.type')
      .from('chats')
      .rightJoin('chats_memberships', 'chats.id', 'chats_memberships.chatId')
      .rightJoin('chats_memberships_messages', 'chats_memberships.id', 'chats_memberships_messages.chatMembershipId')
      .where({ messageId })
      .limit(1);
    return data;
  }

  subcribe(chatId, userId) {
    return db('chats_users')
      .insert({
        chatId,
        userId,
      });
  }


  async privateSubscribe(chatId, userId, period) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [{ price }] = await trx('chats')
        .select('price')
        .where({ id: chatId })
        .limit(1);

      const [{ balance: userBalance }] = await trx('user_balance')
        .where({ userId })
        .limit(1);

      if (userBalance < price * period) {
        throw 'Inefficient balance';
      }

      const [{ adminId }] = await trx('chats_admins')
        .select('adminId')
        .where({ chatId })
        .limit(1);

      const { rows: [{ userPaid, adminGet, endedAt }] } = await trx
        .raw(`
          insert into chat_subscriptions 
          ("userId", "chatId", "amount", "createdAt", "endedAt")
          values
          (?, ?, ?, now(), now() + (interval '30 days') * ?)
          returning amount as "userPaid", amount / 2 as "adminGet", "endedAt"
        `, [userId, chatId, period * price, period]);

      await trx('user_balance')
        .where({ userId: adminId })
        .increment({
          balance: adminGet,
        });

      await trx('user_balance')
        .where({ userId })
        .decrement({
          balance: userPaid,
        });

      await trx.commit();
      return { chatId, endedAt };
    } catch (e) {
      console.error(e);
      await trx.rollback('Internal server error');
    }
  }
  async leave(chatMembershipId, userId) {
    const trx = await promisify(db.transaction.bind(db));
    try {

      const [{ type, chatId }] = await trx('chats_memberships').select(['type', 'chatId']).where({ id: chatMembershipId });
      if (type === 'standard') {
        await db('chats_memberships_users')
          .where({
            chatMembershipId,
            userId,
          })
          .del();
      }

      const { messages, hasMore } = await this.getMessages({ userId, chatId }, {}, trx);
      const opponent = await this.getMainChatInfo(chatId, trx);
      await trx.commit();
      return { messages, opponent, hasMore };
    } catch (error) {
      console.error(error);
      await trx.rollback('Internal server error');
    }
  }

  declineInvite(chatId, invitedUserId) {
    return db('invitations_for_subscription')
      .where({
        chatId,
        invitedUserId,
      })
      .del();
  }
  async getMembers({ chatId }) {
    const { rows: [{ users }] } = await db.raw(`
      select array_agg(distinct cmu."userId") users
      from chats_memberships_users cmu
      left join chats_memberships cm on cm.id = cmu."chatMembershipId"
      left join chats c on c.id = cm."chatId"
      where c.id = ?
    `, [chatId]);
    return users;
  }



  countUnReadMessagesInChat({ chatId, userId }) {
    return new Promise((resolve, reject) => {
      db.raw(`
        select count(*)::int as "count" from messages pm
        where 
        pm."chatId" = ? 
        and pm.id > (
          select max(m.id)
          from messages m
          left join messages_is_read mir on m.id = mir."messageId" and mir."userId" = ?
          where 
          m."chatId" = pm."chatId"
          and  mir."isRead" is true
          group by m.id
          order by m.id desc 
          limit 1
        )
      `,
      [chatId, userId])
        .then(res => resolve(res.rows[0]))
        .catch(err => reject(err));
    });
  }

  getInitFiles(type, details) {
    const personal = ({ user1, user2 }) => db.raw(
      `
      select 
      a."type", 
      a."key",
      a."duration",
      a."filename",
      m."senderId" as "sender",
      m."createdAt" as "createdAt"
      from attachments a
      left join messages m on m."attachmentId" = a.id 
      left join chats_memberships_messages cmm on cmm."messageId" = m.id 
     	where cmm."chatMembershipId" = (
     	select cm.id as "chatMembershipId"
	      from chats_memberships cm
	      join chats ch on ch.id = cm."chatId"
	      join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
        where cmu."userId" in (?, ?)
        and ch.type = 'personal'
	      group by cm.id
	      having count(cm.id) = 2
	      limit 1
       )
       order by m."createdAt" desc

      `,
      [user1, user2],
    );

    const publicChat = ({ chatId, userId }) => db.raw(
      `
        select 
          a."type", 
          a."key",
          a."duration",
          a."filename",
          m."senderId" as "sender",
          m."createdAt" as "createdAt"
        from attachments a
        join messages m on m."attachmentId" = a.id 
        join chats_memberships_messages cmm on cmm."messageId" = m.id 
        join chats_memberships cm on cm.id = cmm."chatMembershipId"
        where cm."chatId" = ?
        and (
          (select ca."adminId" from chats_admins ca where ca."chatId" = cm."chatId" and ca."adminId" = ?)::boolean
          or (? != 0  and cm.id in (select cmu."chatMembershipId" from chats_memberships_users cmu where cmu."userId" = ? and cmu."endedAt" > now()))
          or (? = 0 and cm."type" = 'standard')
        )
      `,
      [chatId, userId, userId, userId, userId],
    );

    const defineSubquery = {
      personal: personal(details),
      group: publicChat(details),

    };

    return new Promise((resolve, reject) => {
      db.raw(
        `with files as (?) select 
        (select json_build_object(
          'count', count(type)::int,
          'list', array_agg(
            json_build_object(
              'key', key,
              'duration', duration,
              'sender', "sender",
              'filename', "filename",
              'createdAt', "createdAt"
            )
          )
        ) as "media" from files where type = 'photo' or type = 'video'),
        (select json_build_object(
          'count', count(type)::int,
          'list', array_agg(
            json_build_object(
              'key', key,
              'sender', "sender",
              'duration', duration,
              'filename', "filename",
              'createdAt', "createdAt"

            )
          )
        ) as "audio" from files where type = 'music'),
        (select json_build_object(
          'count', count(type)::int,
          'list', array_agg(
            json_build_object(
              'key', key,
              'sender', "sender",
              'duration', duration,
              'filename', "filename",
              'createdAt', "createdAt"

            )
          )
        ) as "audio_message" from files where type = 'audio_message'),
        (select json_build_object(
          'count', count(type)::int,
          'list', array_agg(
            json_build_object(
              'key', key,
              'sender', "sender",
              'filename', "filename",
              'createdAt', "createdAt"

            )
          )
        ) as "file" from files where type = 'another')
        `,
        [defineSubquery[type]],
      )
        .then(result => {
          resolve(result.rows[0]);
        })
        .catch(err => reject(err));
    });
  }



  readMessages(type, details) {
    const personal = ({ userId, messageId }) => db.raw(
      `
      select
        ?,
        ?,
        true
      `,
      [userId, messageId],
    );

    const defineSubquery = {
      personal: personal(details),
      group: personal(details),
    };

    return new Promise((resolve, reject) => {
      db.raw(
        `
        insert into messages_is_read ("userId", "messageId", "isRead") ?
        `,
        [defineSubquery[type]],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  getFilesFromChat(type, fileType, details) {


    const getFileType = {
      'media': ['photo', 'video'],
      'audio': ['audio'],
      'files': ['another'],
      'audio_message': ['audio_message'],
    };
    const personal = ({ user1, user2 }) => db.raw(
      `
      select cm.id
      from chats_memberships cm
      join chats ch on ch.id = cm."chatId"
      join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
      where cmu."userId" in (?, ?)
      and ch.type = 'personal'
      group by cm.id
      having count(cm.id) = 2
      limit 1
      `,
      [user1, user2],
    );

    const defineSubquery = {
      personal: personal(details),
    };
    return new Promise((resolve, reject) => {
      db.raw(
        `select
          a."id",
          a."type",
          a."duration",
          a."createdAt",
          a."key",
          m."senderId",
          m.id as "messageId"
        from "attachments" a
        left join messages m on m."attachmentId" = a.id
        left join chats_memberships_messages cmm on cmm."messageId" = m.id
        where cmm."chatMembershipId" = (?) and a."type" = ANY(?)
        order by a."createdAt" desc`,
        [defineSubquery[type], getFileType[fileType]],
      )
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }

  addAdmin({ adminId, chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_admins')
        .insert({
          adminId,
          chatId,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  isAdmin({ adminId, chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_admins')
        .where({
          adminId,
          chatId,
        })
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }
  isChatAdminByLink({ adminId, link }) {
    return new Promise((resolve, reject) => {
      db('chats_admins')
        .where({
          adminId,
          link,
        })
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  getAdmins(chatId) {
    return db('chats_admins')
      .where({
        chatId,
      });
  }

  getSubscribers(chatId) {
    return new Promise((resolve, reject) => {
      db
        .raw(`
        select 
        coalesce(array_agg(cs."userId"), '{}') as "users"
        from chats_users  cs
        where cs."chatId" = ?
      `, [chatId])
        .then(result => resolve(result.rows[0].users))
        .catch(err => reject(err));
    });
  }

  getPrivateSubscribers(chatId) {
    return new Promise((resolve, reject) => {
      db
        .raw(`
        select
        coalesce(array_agg(cs."userId"), '{}') as "users"
        from chat_subscriptions cs
        where cs."chatId" = ? and cs."endedAt" > now()
      `, [chatId])
        .then(result => resolve(result.rows[0].users))
        .catch(err => reject(err));
    });
  }

  getContactsInChat({ chatId, userId }) {
    return new Promise((resolve, reject) => {
      db.raw(`
      select 
        c."userId",
        c."displayedFirstName",
        c."displayedLastName",
        cu."userId"::boolean as "isMember"
      from contacts c
      left join chats_users cu on cu."userId" = c.contact and cu."chatId" = ?
      where c."userId" = ?
    `, [chatId, userId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  getContactsForNewChat({ userId, link }) {
    return new Promise((resolve, reject) => {
      db.raw(`
      select
        c."contact" as "id",
        c."displayedFirstName",
        c."displayedLastName",
        cmu."userId"::boolean as "isAlreadyMember"
      from contacts c 
      left join chats_memberships_users cmu on cmu."userId" = c."contact"
      left join chats_memberships cm on cm.id = cmu."chatMembershipId"
      left join chats ch on ch.id = cm."chatId" and ch."link" = ?
      where c."userId" = ?
      group by c.contact, c."displayedFirstName", c."displayedLastName", cmu."userId" 
    `, [link, userId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }


  isFreeLink({ id, link }) {
    return new Promise((resolve, reject) => {
      db('chats')
        .where({
          link,
        })
        .andWhereNot({
          id,
        })
        .then(result => resolve(!result.length))
        .catch(err => reject(err));
    });
  }

  activeSubscriptions(chatId) {
    return db('chats_subscriptions')
      .where({ chatId })
      .andWhere('endedAt', '<', Date.now());
  }

  async createInvites(chatId, usersList) {
    return db('invitations_for_subscription')
      .insert(
        await db('users')
          .whereIn('id', usersList)
          .select('id as userId', db.raw('? AS ??', [chatId, 'chatId'])),
      );
  }

  async joinUsers({ link, usersList }) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [{ id: chatId }] = await db('chats')
        .where({ link })
        .select('id');

      const [{ users: duplicatedUsers }] = await db('chats_users')
        .where({ chatId })
        .select(db.raw('ARRAY_AGG("userId") as users'));


      const users =  await db('users')
        .whereIn('id', usersList)
        .andWhere('id', 'not in', duplicatedUsers)
        .select('id as userId', db.raw('? AS ??', [chatId, 'chatId']));

      await db('chats_users')
        .insert(users);

      await trx.commit();
      return;
    } catch (error) {
      await trx.rollback('Internal server error');
      throw new CustomError('Internal server error', 500);
    }

  }

  getAll({ userId }) {
    return new Promise((resolve, reject) => {
      db.raw(
        `with messages_list as (
          select 

          max(m."id") as "messageId",
          max(cm."chatId") as "chatId",
          max(cm."id") as "chatMembershipId"
          
          from messages m
          join chats_memberships_messages cmm on cmm."messageId" = m.id
          join chats_memberships cm on cm.id = cmm."chatMembershipId"
          join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
          
          where (select ca."adminId" from chats_admins ca where ca."chatId" = cm."chatId" and ca."adminId" = ?)::boolean -- check admin status
          or cm.id in (select cmu."chatMembershipId" from chats_memberships_users cmu where cmu."userId" = ? and cmu."endedAt" > now())
          or (m."senderId" = -1 and ( 
              select c2.id from chats c2
              join chats_memberships cm2 on cm2."chatId" = c2.id
              join chats_memberships_users cmu2 on cmu2."chatMembershipId" = cm2.id
              where cmu2."userId" = ? and c2.id = cm."chatId"
              group by c2."id"
            ) ::boolean
          )
          group by cm."chatId" 
          
        ) select
          ml."chatId",
          m."text",
          m."createdAt",
          m."type",
          (select a."key" from attachments a where a.id =  m."attachmentId") as "attachment",
          m."senderId",
          c."type" as "chatType",
          (select count(*)::int from messages_is_read mir where mir."messageId" = ml."messageId" and mir."userId" != ? )::boolean as "isRead",
          (
            case
            when c.type = 'personal'
              then (
                select json_build_object(
                'id', u1.id,
                'username',  u1."username",
                'firstName',  u1."firstName",
                'lastName',  u1."lastName",
                'email',  u1."email",
                'phone',  u1."phone",
                'about',  u1."about",
                'avatar',  u1."avatar",
                'isOnline',  u1."isOnline",
                'lastOnline',  u1."lastOnline",
                'displayedName', (select concat(c."displayedFirstName", ' ', c."displayedLastName") from contacts c where (c."userId" = ? and c.contact = u1.id) )
              ) as "info" from users u1 where id = (
                select cmu."userId" from chats_memberships_users cmu where cmu."chatMembershipId" = ml."chatMembershipId" and cmu."userId" != ?
              )	
              )
              when c.type = 'group'
              then (
                select json_build_object(
                'id', ch.id,
                'name', ch."name",
                'type', ch."type",
                'description', ch."description",
                'link', ch."link",
                'avatar', ch."avatar"
              ) as "info" from chats ch where id = ml."chatId"
              )
            end
          ) as opponent,
          (
            with is_read as (
              select distinct cmm."messageId" as "id", mir."isRead" from messages m2
              join chats_memberships_messages cmm on cmm."messageId" = m2.id

              join chats_memberships cm on cm.id = cmm."chatMembershipId" 
              join messages_is_read mir on mir."messageId" = cmm."messageId" and mir."userId" = ?
              where cm."chatId" = c.id and m2."senderId" != ?
            ) select count(ir.id)::int
            from is_read ir
            where ir.id > (
              select 
              (
                case
                when (select count(id)::int from is_read ir where ir."isRead")::boolean
                then (
                  select ir.id
                  from is_read ir
                  where ir."isRead" is true
                  order by ir.id desc
                  limit 1
                ) else (
                  select -1
                ) end
              )
            )
            and m."senderId" != ?
          ) as "count"
          from messages_list ml
          left join messages m on m.id = ml."messageId"
          left join chats c on c.id = ml."chatId"
          order by m."createdAt" desc                                                                                                                                                                                                                                                                                                     
        `,
        Array(9).fill(userId),
      )
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }


}


module.exports = new Chat();
