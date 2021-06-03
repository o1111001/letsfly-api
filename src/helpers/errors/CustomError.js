class CustomError extends Error {
  constructor(message, status = 200) {
    super();
    this.message = message;
    this.status = status;
  }
}

module.exports = CustomError;
