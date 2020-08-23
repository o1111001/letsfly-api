const {
  findName: findNameService,
  findUsername: findUsernameService,
} = require('../../services/user/find');

const response = bio => ({
  message: `Success`,
  data: {
    bio,
  },
});


const findName = async req => {
  const { name } = req.params;
  const { id } = req.locals;
  const data = await findNameService(id, name);
  return response(data);
};

const findUsername = async req => {
  const { name } = req.params;
  const { id } = req.locals;
  const data = await findUsernameService(id, name);
  return response(data);
};

module.exports = {
  findName,
  findUsername,
};
