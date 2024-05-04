const jwt = require('jsonwebtoken');
const accountDal = require("../dal/accountDal");
const jsonwebtoken = require('jsonwebtoken')
const config = require("../config/config");

const appHelper = new Object();

appHelper.randomString = async (length) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


appHelper.apiResponse = async (resStatusCode = 200, resStatus = true, resMessageKey = "", resData, count ,error) => {
  let res = {
    code: resStatusCode,
    status: resStatus,
    message: resMessageKey,
    data: resData,
    count: count,
    error: error
  }
  return JSON.parse(JSON.stringify(res));
}

appHelper.tokenValidator = async (token) => {
  let decoded = await jwt.decode(token);
  let accId = decoded.accId
  let findUser = await accountDal.findAccountById(accId);
  if (!findUser.status)
    return { status: false, message: 'no user found' };
  try {
    await jwt.verify(token, findUser.data.secret);
  } catch (err) {
    return { status: false, message: 'invalid secret' };
  }
  return { status: true, message: 'token verification success' };
}



module.exports = appHelper;
