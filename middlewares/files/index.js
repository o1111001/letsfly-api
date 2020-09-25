const checkFolder = (req, res, next) => {
  if (['avatars', 'audio', 'video', 'another', 'photo', 'audio_messages', 'chats_avatars', 'memberships'].includes(req.params.folder)) return next();
  return res.status(422).send({ message: 'Wrong path' });
};

module.exports = {
  checkFolder,
};
