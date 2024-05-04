const accountControllerV2 = {}
const appHelper = require('../helpers/appHelper')
const accDal = require('../dal/accountDal')
const deviceDal = require('../dal/deviceDal')
const validator = require('../validators/accountValidator')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const config = require('../config/config')
const axios = require('axios')
const staffIdList = require('../../staffIdList')
const _ = require('lodash')
const adminEmailList = require('../../adminEmailList')

const validRolesForDeviceCheckInLogin = ['business', 'customer', 'staff']

const LoginWithOtplessRequestSchema = Joi.object({
    token: Joi.string(),
    state: Joi.string(),
    role: Joi.string()
        .valid('customer', 'business', 'admin', 'staff')
        .default('customer'),
    os: Joi.string().valid('ios', 'android'),
    deviceId: Joi.string().default(''),
})

const LoginWithStaffIdForBizAppSchema = Joi.object({
    phone: Joi.string(),
    staffId: Joi.string(),
    role: Joi.string()
        .valid('customer', 'business', 'admin', 'staff')
        .default('customer'),
    os: Joi.string().valid('ios', 'android'),
    deviceId: Joi.string().default(''),
})

const LoginWithGoogleAuthTokenSchema = Joi.object({
    googleAuthToken: Joi.string(),
})

const getEmailFromGoogleToken = async (token) => {
    try {
        const resp = await axios.get(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' +
                token
        )
        return _.get(resp.data, 'email', '')
    } catch (e) {
        console.log('Failed to get user info from google', e)
        return null
    }
}

accountControllerV2.loginWithGoogle = async (body) => {
    const validated = LoginWithGoogleAuthTokenSchema.validate(body)

    if (validated.error) {
        return appHelper.apiResponse(
            400,
            false,
            validated.error.details.map((o) => o.message).join(', '),
            undefined
        )
    }
    const { googleAuthToken } = validated.value
    const adminEmail = await getEmailFromGoogleToken(googleAuthToken)
    if (adminEmail === null || adminEmail.length === 0) {
        return appHelper.responses.unauthorised
    }
    const adminPhone = _.get(adminEmailList, adminEmail, '')
    if (adminPhone.length === 0) {
        return appHelper.responses.unauthorised
    }
    return appHelper.responses.ok
}

const FCMTokenUpdateReqSchema = Joi.object({
    os: Joi.string(),
    deviceId: Joi.string(),
    accountId: Joi.string()
});
accountControllerV2.saveFcmToken = async (body) => {
    try {
        const validated = FCMTokenUpdateReqSchema.validate(body)
        const devicePayload = {
            deviceType: validated.value.os,
            deviceId: validated.value.deviceId,
            accountId: validated.value.accountId
        }
        await deviceDal.saveDeviceIfNotExists(devicePayload)
        return appHelper.apiResponse(200, true);
    } catch (error) {
        console.log('failed to save fcm token', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }

}

/**
 * checks if the passed otpless token & state are valid,
 * if valid creates account if required & responds with jwt token & account data
 * @param body
 * @returns {Promise<*|{data: *, message: string, status: boolean}>}
 */
accountControllerV2.loginWithOtpless = async (body) => {
    const validated = LoginWithOtplessRequestSchema.validate(body)
    if (validated.error) {
        return appHelper.apiResponse(
            400,
            false,
            validated.error.details.map((o) => o.message).join(', '),
            undefined
        )
    }
    const { token, state } = validated.value
    try {
        const url = 'https://api.otpless.app/v1/client/user/session/userdata'
        const headers = {
            'Content-Type': 'application/json',
            appId: process.env.OTPLESS_APP_ID,
            appSecret: process.env.OTPLESS_APP_SECRET,
        }
        const body = { token, state }
        const resp = await axios.post(url, body, { headers })
        console.log('otpless api call resp', resp.data)

        // if otpless details are validated
        if (resp.status === 200) {
            const name = resp.data?.data?.name ?? ''
            const phone = (resp.data?.data?.mobile ?? '').slice(-10)
            if (phone !== '') {
                // fetch account by phone
                let accountQuery = await accountControllerV2.getAccountByPhone(
                    phone
                )
                let findUser = accountQuery

                // if account not exists, create new account
                if (
                    !accountQuery.status ||
                    (accountQuery.data?._id ?? '') === ''
                ) {
                    const creationResult =
                        await accountControllerV2.createAccountByPhone(
                            phone,
                            name,
                            validated.value.role
                        )
                    if (creationResult === null) {
                        return appHelper.apiResponse(500, false, saved.message)
                    }
                    findUser = creationResult
                }

                if (
                    validRolesForDeviceCheckInLogin.includes(
                        validated.value.role
                    )
                ) {
                    const validatedDevice =
                        await validator.deviceDataValidation({
                            deviceDetails: {
                                deviceType: validated.value.os,
                                deviceId: validated.value.deviceId,
                            },
                        })
                    if (!validatedDevice.status) {
                        return {
                            status: false,
                            message: 'Invalid payload',
                            data: validatedDevice.data,
                        }
                    }
                    const devicePayload = {
                        deviceType: validated.value.os,
                        deviceId: validated.value.deviceId,
                        accountId: findUser.data._id
                    }
                    await deviceDal.saveDeviceIfNotExists(devicePayload)
                }

                const jwtPayload = {
                    accId: findUser.data._id,
                }
                const token = jwt.sign(jwtPayload, config.jwtSecret)
                if (!token) {
                    return appHelper.apiResponse(
                        500,
                        false,
                        'Failed to generate token',
                        undefined
                    )
                }
                let response = {
                    token: token,
                    accountData: {
                        _id: findUser.data._id,
                        name: findUser.data.name,
                        phone: findUser.data.phone,
                        email: findUser.data.email,
                        role: findUser.data.role,
                        profile: findUser.data.profile,
                        country: findUser.data.country,
                    },
                }

                // respond success
                return appHelper.apiResponse(
                    200,
                    true,
                    'login successful',
                    response
                )
            }
        }

        // respond failure
        return appHelper.apiResponse(
            401,
            false,
            error.message ? error.message : 'invalid data'
        )
    } catch (error) {
        console.log('failed to login with otpless', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

/**
 * checks if the passed otpless token & state are valid,
 * if valid creates account if required & responds with jwt token & account data
 * @param body
 * @returns {Promise<*|{data: *, message: string, status: boolean}>}
 */
accountControllerV2.loginWithStaffIdForBizApp = async (body) => {
    const validated = LoginWithStaffIdForBizAppSchema.validate(body)
    if (validated.error) {
        return appHelper.apiResponse(
            400,
            false,
            validated.error.details.map((o) => o.message).join(', '),
            undefined
        )
    }
    const { phone, staffId } = validated.value
    if (!staffIdList.includes(staffId) || phone === '') {
        return appHelper.apiResponse(401, false, 'unauthorised', undefined)
    }
    try {
        // fetch account by phone
        let accountQuery = await accountControllerV2.getAccountByPhone(phone)
        console.log('accountQuery', accountQuery)
        let findUser = accountQuery

        // if account not exists, create new account
        if (!accountQuery.status || (accountQuery.data?._id ?? '') === '') {
            const creationResult =
                await accountControllerV2.createAccountByPhone(
                    phone,
                    name,
                    validated.value.role
                )
            if (creationResult === null) {
                return appHelper.apiResponse(
                    500,
                    false,
                    creationResult?.message ?? ''
                )
            }
            findUser = creationResult
        }

        if (validRolesForDeviceCheckInLogin.includes(validated.value.role)) {
            const validatedDevice = await validator.deviceDataValidation({
                deviceDetails: {
                    deviceType: validated.value.os,
                    deviceId: validated.value.deviceId,
                },
            })
            if (!validatedDevice.status) {
                return {
                    status: false,
                    message: 'Invalid payload',
                    data: validatedDevice.data,
                }
            }
            const devicePayload = {
                deviceType: validated.value.os,
                deviceId: validated.value.deviceId,
            }
            devicePayload.accountId = findUser.data._id
            await deviceDal.saveDeviceIfNotExists(devicePayload)
        }

        const jwtPayload = {
            accId: findUser.data._id,
        }
        const token = jwt.sign(jwtPayload, config.jwtSecret)
        if (!token) {
            return appHelper.apiResponse(
                500,
                false,
                'Failed to generate token',
                undefined
            )
        }
        let response = {
            token: token,
            accountData: {
                _id: findUser.data._id,
                name: findUser.data.name,
                phone: findUser.data.phone,
                email: findUser.data.email,
                role: findUser.data.role,
                profile: findUser.data.profile,
                country: findUser.data.country,
            },
        }

        // respond success
        return appHelper.apiResponse(200, true, 'login successful', response)
    } catch (error) {
        console.log('failed to login with staff id for biz', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

const saveEmailReqSchema = Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().default(''),
})

accountControllerV2.saveEmail = async (req) => {
    const body = req.body
    try {
        const validated = saveEmailReqSchema.validate(body)
        console.log('validated', validated)
        if (validated.error) {
            return appHelper.apiResponse(
                400,
                false,
                validated.error.details.map((o) => o.message).join(', '),
                undefined
            )
        }
        const userId = validated.value.userId
        const email = validated.value.email
        const name = validated.value.name
        console.log('name>>>', name);
        // save to db
        await accDal.findAccountByIdAndUpdateV2(userId, { email, name })
        return appHelper.apiResponse(200, true, 'ok', undefined)
    } catch (e) {
        console.log('failed to save email ', e, req)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountControllerV2.getAccountByPhone = (phone) => {
    return accDal.findAccountByPhone(phone)
}

accountControllerV2.getAccountByUserId = (userId) => {
    return accDal.findAccountByIdV2(userId)
}

accountControllerV2.createAccountByPhone = async (
    phone,
    name = '',
    role = 'customer'
) => {
    const saved = await accDal.saveUserV2({
        name,
        phone,
        role,
    })
    if (!saved.status) {
        console.log('failed to register user', saved)
    }
    return saved
}

module.exports = accountControllerV2
