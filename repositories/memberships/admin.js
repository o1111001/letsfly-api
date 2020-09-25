const { db } = global;
const { CustomError } = require('../../helpers/errors');

const create = async fields => {
  const {
    name,
    description,
    amount,
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
    .returning('id');

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
  console.log(members);
  return members;
};

const updateInfo = fields => {
  const {
    id,
    name,
    description,
    price,
  } = fields;

  return db('chats_memberships')
    .update({
      name,
      description,
      price,
    })
    .where({ id });
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
