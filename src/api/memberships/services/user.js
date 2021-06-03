const MembershipUser = require('../repositories/user');

const subscribeMembership = fields => MembershipUser.subscribe(fields);

module.exports = {
  subscribeMembership,
};
