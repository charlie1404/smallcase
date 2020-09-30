const httpStatus = require('http-status');
const APIError = require('../utils/api-error');

function injectUser(req, res, next) {
  try {
    /*
      In ideal case we would need to validate session token (JWT)
      get payload from it or fetch/contruct user/session object and pass for further handlers

      but for now mocking user object and paasing along, can be changed if needed later
    */

    const user = {
      email: 'xyz@abcmail.com',
      username: 'evil_pegahsus',
    };

    res.locals.user = user;
    next();
  } catch (error) {
    throw new APIError('Error validatiting session', httpStatus.UNAUTHORIZED, true);
  }
}

module.exports = injectUser;
