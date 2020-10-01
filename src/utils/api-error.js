// could have simply used status but added this as dep because this makes less gogling around,
// it doed take time to recall what does a 418 mean,
// and why i am teapot is not a good choice for return status
const httpStatus = require('http-status');

// Standard structure of error used
class APIError extends Error {
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message);
    this.status = status;
    this.isPublic = isPublic;
  }
}

module.exports = APIError;
