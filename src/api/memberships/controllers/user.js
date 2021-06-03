const { responseCreator } = require('../../../helpers/responses');

const {
  subscribeMembership: subscribeMembershipService,
} = require('../services/user');


const subscribeMembership = async req => {
  const { id: userId } = req.locals;
  const {
    membershipId,
    period,
  } = req.body;

  const data = await subscribeMembershipService({
    userId,
    membershipId,
    period,
  });
  return responseCreator(data);
};

module.exports = {
  subscribeMembership,
};
