module.exports = asyncRequestHandler => async (req, res, next) => {
  try {
    const result = await asyncRequestHandler(req);
    return res.send(result);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
