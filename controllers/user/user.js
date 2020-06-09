const { user: {
  banUser: banUserService,
  unBanUser: unBanUserService,
} } = require('../../services/user');

const { sendError } = require('../../helpers/responses');

const response = bio => ({
  message: `Success`,
  data: {
    bio,
  },
});


const banUser = async (req, res) => {
  try {
    const { id: user } = req.locals;
    const { id: bannedUser } = req.body;
    const bio = await banUserService(user, bannedUser);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

const unBanUser = async (req, res) => {
  try {
    const { id: user } = req.locals;
    const { id: bannedUser } = req.body;
    const bio = await unBanUserService(user, bannedUser);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  banUser,
  unBanUser,
};
