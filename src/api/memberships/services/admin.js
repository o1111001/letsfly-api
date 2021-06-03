const MembershipAdmin = require('../repositories/admin');
const { CustomError } = require('../../../helpers/errors');

const createMembership = fields => MembershipAdmin.create(fields);
const updateMembershipAvatar = (id, avatar) => MembershipAdmin.updateAvatar({ id, avatar });
const updateMembershipInfo = (id, fields) => MembershipAdmin.updateInfo({ id, ...fields });

const deleteMembership = async id => {
  const activeMemberships = await MembershipAdmin.activeMemberships(id);
  if (activeMemberships.length) {
    throw new CustomError('Membership has got active subscriptions', 409);
  }
  return MembershipAdmin.deleteMembership(id);
};

module.exports = {
  createMembership,
  updateMembershipAvatar,
  updateMembershipInfo,
  deleteMembership,
};
