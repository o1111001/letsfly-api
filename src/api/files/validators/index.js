const checkDirectory = (req, res, next) => {
  if (['users_avatars', 'chats_avatars', 'memberships_avatars', 'messages_files_private'].includes(req.params.directory)) return next();
  return res.status(422).send({ message: 'Wrong path' });
};

module.exports = {
  checkDirectory,
};
