const curlHelper = require('../helpers/curlHelper');

let google = new Object()

google.validateIdToken = async (token) => {
  let url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
  let headers = {
    'Content-Type': 'application/json'
  }
  let validate = await curlHelper.sendRequest('get', url, {}, headers);
  if (validate.isError) {
    return { status: false, message: 'invalid token', data: validate.body }
  }
  return { status: true, message: 'Token validation success', data: validate.body }
}


module.exports = google;