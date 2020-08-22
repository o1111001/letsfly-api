const {
  banUser: banUserService,
  unBanUser: unBanUserService,
} = require('../../services/user/ban');

const response = bio => ({
  message: `Success`,
  data: {
    bio,
  },
});


const banUser = async req => {
  const { id: user } = req.locals;
  const { id: bannedUser } = req.body;
  const bio = await banUserService(user, bannedUser);
  return response(bio);
};

const unBanUser = async req => {
  const { id: user } = req.locals;
  const { id: bannedUser } = req.body;
  const bio = await unBanUserService(user, bannedUser);
  return response(bio);
};

module.exports = {
  banUser,
  unBanUser,
};
