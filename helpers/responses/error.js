const errResponse = error => ({
  message: error,
});

const sendError = (res, error) => {
  if (error instanceof Error) {
    console.error(error);
    return res.status(500).send(errResponse(error));
  }
  return res.status(422).send(errResponse(error));
};

module.exports = sendError;
