// Express is capable of capturing error is handler is sync, but gets real ugly when it returns promise
// simply attaching .catch to async handlers and passing in next() to express error handler

function asyncErrorCapture(fn) {
  return function internalHendler(req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}

module.exports = asyncErrorCapture;
