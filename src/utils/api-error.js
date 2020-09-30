const httpStatus = require('http-status');

class APIError extends Error {
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message);
    this.status = status;
    this.isPublic = isPublic;
  }
}

module.exports = APIError;
