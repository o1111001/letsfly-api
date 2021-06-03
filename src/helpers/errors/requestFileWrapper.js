module.exports = asyncRequestHandler => async (req, res, next) => {
  try {
    const { readStream, size } = await asyncRequestHandler(req);
    res.set({
      'accept-ranges': 'bytes',
      'Content-Length': size,
      'Content-Range': `bytes 0-${size}/${size}`,
    });
    return readStream.pipe(res);
  } catch (error) {
    return next(error);
  }
};
