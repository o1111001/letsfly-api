const MembershipUser = require('../../repositories/memberships/user');
const { CustomError } = require('../../helpers/errors');

const subscribeMembership = fields => MembershipUser.subscribe(fields);

module.exports = {
  subscribeMembership,
};
