let accountValidator = new Object()
const Joi = require('joi');

accountValidator.normalLoginValidator = async (reqData) => {
  const loginValidator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required().valid('customer', 'business'),
    type: Joi.string().required().valid('normal')
  }).unknown(true);
  const validation = await loginValidator.validate(reqData);
  if (validation.error) {
    return { status: false, code: 400, message: 'invalid request payload', data: validation.error.details[0].message }
  }
  return { status: true, code: 200, message: 'all validations passed', data: validation.data }
}
accountValidator.socialLoginValidator = async (reqData) => {
  const loginValidator = Joi.object({
    email: Joi.string().allow(null),
    socialKey: Joi.string().required(),
    role: Joi.string().required().valid('customer', 'business'),
    type: Joi.string().required().valid('google', 'facebook', 'apple'),
    deviceDetails:Joi.object({
      deviceType: Joi.string().required().valid('IOS', 'ANDROID'),
      deviceId: Joi.string().required(),
    }).required()
  }).unknown(true);
  const validation = await loginValidator.validate(reqData);
  if (validation.error) {
    return { status: false, code: 400, message: 'invalid request payload', data: validation.error.details[0].message }
  }
  return { status: true, code: 200, message: 'all validations passed', data: validation.data }
}

accountValidator.checkEmail = async (reqData) => {
  const emailValidator = Joi.object({
    email: Joi.string().required(),
  }).unknown(false);
  const validation = await emailValidator.validate(reqData);
  if (validation.error) {
    return { status: false, code: 400, message: 'invalid request payload', data: validation.error.details[0].message }
  }
  return { status: true, code: 200, message: 'all validations passed', data: validation.data }
}

accountValidator.deviceDataValidation = async (reqData) => {
  const validator = Joi.object({
    deviceDetails:Joi.object({
      deviceType: Joi.string().required().valid('IOS', 'ANDROID'),
      deviceId: Joi.string().required(),
    }).required()
  }).unknown(true);
  const validation = await validator.validate(reqData);
  if (validation.error) {
    return { status: false, code: 400, message: 'invalid request payload', data: validation.error.details[0].message }
  }
  return { status: true, code: 200, message: 'all validations passed', data: validation.data }
}

accountValidator.register = async (reqData) => {
  const register = Joi.object({
    name: Joi.string(),
    businessName: Joi.string(),
    country: Joi.string(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    terms: Joi.boolean().required().invalid(false),
    role: Joi.string().required().valid('customer', 'business'),
    deviceDetails:Joi.object({
      deviceType: Joi.string().required().valid('IOS', 'ANDROID'),
      deviceId: Joi.string().required(),
    }).required()
  }).unknown(false);
  const validation = await register.validate(reqData);
  if (validation.error) {
    return { status: false, code: 400, message: 'invalid request payload', data: validation.error.details[0].message }
  }
  return { status: true, code: 200, message: 'all validations passed', data: validation.data }
}

module.exports = accountValidator;

