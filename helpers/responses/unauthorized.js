const errResponse = error => ({
  message: error,
});

const sendUnauthorized = (res, error) => {
  if (error instanceof Error) {
    console.error(error);
    return res.status(500).send(errResponse(error));
  }
  return res.status(403).send(errResponse(error));
};

module.exports = sendUnauthorized;
