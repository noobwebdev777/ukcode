const axios =require('axios');
const config = require('../config/config');




const requestMethod = (_method, _endpoint, _options, _body) => {
  let methodObj;
  if (_method === 'post') {
    methodObj = axios.post(_endpoint, _body, _options)
  } else if (_method === 'get') {
    methodObj = axios.get(_endpoint, _options)
  } else if (_method === 'put') {
    methodObj = axios.put(_endpoint, _body, _options)
  } else if (_method === 'patch') {
    methodObj = axios.patch(_endpoint, _body, _options)
  } else if (_method === 'delete') {
    methodObj = axios.delete(_endpoint, _options)
  } else {
    methodObj = axios.post(_endpoint, _body, _options)
  }
  return methodObj
}


  exports.sendRequest= async (_method, _endpoint,  _body, headers) => {
    try {
      const options = {
        headers : headers
      }
      const responseObject = await requestMethod(_method, _endpoint, options, _body)
      return {
        headers: responseObject.headers ? responseObject.headers : {},
        body: responseObject.data ? responseObject.data : {},
        status: responseObject.status ? responseObject.status : "",
        statusText: responseObject.statusText ? responseObject.statusText : "",
        isError: false
      };
    } catch (error) {
      return {
        headers: error.response.headers ? error.response.headers : {},
        body: error.response.data ? error.response.data : {},
        status: error.response.status ? error.response.status : "",
        statusText: error.response.statusText ? error.response.statusText : "",
        isError: true
      };
    }
  }
