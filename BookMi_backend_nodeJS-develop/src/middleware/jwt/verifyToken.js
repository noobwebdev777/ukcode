const jwt = require('jsonwebtoken');
const accDal = require("../../dal/accountDal");



let authorize = async (request, response, next) => {
  try {
    if (!request.headers['authorization'] && skipUrls(`${request.method} ${request.path} `)) {
      return next()
    }
    if (!request.headers['authorization'])
      return response.status(401).json({ message: "authorization token is required" });
    let decoded = jwt.decode(request.headers['authorization']);
    let findUser = await accDal.findProfileById(decoded.accId);
    if (!findUser.status)
      return response.status(401).json({ message: "unauthorized" });
    try {
      await jwt.verify(request.headers['authorization'], findUser.data.secret);
    } catch (err) {
      console.log("error =>" + err)
      return response.status(401).json({ message: "unauthorized" });
    }
    findUser.data.secret = null;
    request.user = findUser.data;
    next();
  } catch (error) {
    console.log(error.message);
    console.log(request.headers);
    response.status(500).send({ error: "error", message: "Something went-wrong" });
  }
}

let skipUrls = (reqUrl) => {
  let res
  let urls = [
    "GET /password_reset/*",
    "GET /file/*",
    "GET /pages/*",
    "POST /account/check/email",
    "POST /account/register",
    "POST /account/login",
    "POST /account/password/forgot",
    "POST /account/password_reset/*",
  ]
  for (const url of urls) {
    let expression = new RegExp(url);
    res = expression.test(reqUrl);
    if (res) {
      break;
    }
  }
  return res
}

module.exports = authorize;