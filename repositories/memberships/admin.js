const { db } = global;
const { CustomError } = require('../../helpers/errors');
const promisify = require('../../helpers/promisify');

const create = async fields => {
  const {
    name,
    description,
    price: amount,
    chatId,
    avatar,
  } = fields;

  const [{ id }] = await db('chats_memberships')
    .insert({
      name,
      description,
      amount,
      chatId,
      avatar,
      type: 'paid',
    })
    .returning(['id']);

  return id;
};

const updateAvatar = fields => {
  const {
    id,
    avatar,
  } = fields;

  return db('chats_memberships')
    .update({
      avatar,
    })
    .where({ id });
};

const getMembers = async membersList => {
  const { rows: [{ members }] } = await db.raw(`
    select coalesce(array_agg(distinct cmu."userId"), '{}') as "members"
    from chats_memberships_users cmu
    where cmu."chatMembershipId" in (??)
    and cmu."endedAt" > now()
  `, [membersList]);
  return members;
};

const updateInfo = async fields => {
  const trx = await promisify(db.transaction.bind(db));
  try {
    const {
      id,
      name,
      description,
      amount,
      avatar,
    } = fields;
    const [{ type }] = await trx('chats_memberships')
      .update({
        name,
        description,
        amount,
        avatar,
      })
      .where({ id })
      .returning(['id', 'type']);

    if (type !== 'paid' && amount !== 0) {
      await trx.rollback();
    }
    await trx.commit();
    return;
  } catch (error) {
    console.error(error);
    await trx.rollback();

  }

};

const deleteMembership = id => db('chats_memberships')
  .update({ isDeleted: true })
  .where({ id });

const activeMemberships = membershipId => db('chats_memberships_users')
  .where({ membershipId });

const getChatIdByMembershipId = membershipId => db('chats_memberships')
  .select('chatId')
  .where({ id: membershipId })
  .limit(1);

const getChatIdByLink = async link => {
  const [{ id }] = await db('chats')
    .where({ link })
    .select('id')
    .limit(1);
  return id;
};

const isFreeName = ({ membershipId, chatId, name }) => {
  const query = db('chats_memberships').count('name').where({ chatId, name });
  if (membershipId) return query.andWhereNot({ membershipId });
  return query;
};

module.exports = {
  create,
  updateAvatar,
  updateInfo,
  deleteMembership,
  activeMemberships,
  getChatIdByMembershipId,
  getChatIdByLink,
  isFreeName,
  getMembers,
};
