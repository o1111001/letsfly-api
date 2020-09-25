const { responseCreator } = require('../../helpers/responses');
const { CustomError } = require('../../helpers/errors');
const { getChatIdByMembershipId } = require('../../services/memberships/helpers');

const {
  subscribeMembership: subscribeMembershipService,
} = require('../../services/memberships/user');

const {
  isMember,
} = require('../../services/chats/group/users');

const subscribeMembership = async req => {
  const { id: userId } = req.locals;
  const {
    membershipId,
    period,
  } = req.body;

  // const chatId = getChatIdByMembershipId(membershipId);
  // await isMember({ userId, chatId });

  await subscribeMembershipService({
    userId,
    membershipId,
    period,
  });
  return responseCreator({ membershipId });
};

module.exports = {
  subscribeMembership,
};
