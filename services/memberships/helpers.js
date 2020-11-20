const MembershipAdmin = require('../../repositories/memberships/admin');

const getChatIdByMembershipId = membershipId => MembershipAdmin.getChatIdByMembershipId(membershipId);
const getChatIdByLink = membershipId => MembershipAdmin.getChatIdByLink(membershipId);
const isFreeName = async (chatId, name) => {
  const [{ count }] = await MembershipAdmin.isFreeName({ chatId, name });
  return !+count;
};

module.exports = {
  getChatIdByMembershipId,
  getChatIdByLink,
  isFreeName,
};
