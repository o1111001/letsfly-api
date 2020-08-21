const {
  findName: findNameService,
  findUsername: findUsernameService,
} = require('../../services/user/find');

const { sendError } = require('../../helpers/responses');

const response = bio => ({
  message: `Success`,
  data: {
    bio,
  },
});


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
  findName,
  findUsername,
};
