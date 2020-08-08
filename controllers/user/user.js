const { user: {
  banUser: banUserService,
  unBanUser: unBanUserService,
  findName: findNameService,
  findUsername: findUsernameService,
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

const findName = async (req, res) => {
  try {
    const { name } = req.params;
    const { id } = req.locals;
    const data = await findNameService(id, name);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

const findUsername = async (req, res) => {
  try {
    const { name } = req.params;
    const { id } = req.locals;
    const data = await findUsernameService(id, name);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  banUser,
  unBanUser,
  findName,
  findUsername,
};
