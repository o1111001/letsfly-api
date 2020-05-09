const checkFolder = (req, res, next) => {
  if (['avatars'].includes(req.params.folder)) return next();
  return res.status(422).send({ message: 'Wrong path' });
};

module.exports = {
  checkFolder,
};
