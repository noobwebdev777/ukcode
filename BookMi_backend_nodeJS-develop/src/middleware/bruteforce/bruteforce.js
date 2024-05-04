/* HANDLE BRUTE FORCE ON LOGIN */
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore();

const handleStoreError = function (error) {
  throw {
    message: error.message,
    parent: error.parent
  };
}

const failCallback = function (req, res, next, nextValidRequestDate) {
  res.status(429);
  return res.send({
    type: "error",
    message: "You've made too many failed attempts in a short period of time, please try again"
  })
};

const loginBruteForce = new ExpressBrute(store, {
  freeRetries: 3,
  minWait: 1 * 60 * 1000, // 1 minutes
  maxWait: 60 * 60 * 1000, // 1 hour,
  failCallback: failCallback,
  handleStoreError: handleStoreError
});

module.exports = loginBruteForce