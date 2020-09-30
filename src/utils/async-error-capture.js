function asyncErrorCapture(fn) {
  return function internalHendler(req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}

module.exports = asyncErrorCapture;
