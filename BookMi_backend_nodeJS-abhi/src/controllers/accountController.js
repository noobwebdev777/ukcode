const accountController = {}
const appHelper = require('../helpers/appHelper')
const accDal = require('../dal/accountDal')
const bookingDal = require('../dal/bookingDal')
const businessDal = require('../dal/businessDal')
const businessServiceDal = require('../dal/businessServiceDal')
const commentDal = require('../dal/commentDal')
const deviceDal = require('../dal/deviceDal')
const fileDal = require('../dal/fileDal')
const likeDal = require('../dal/likeDal')
const offerDal = require('../dal/offerDal')
const reviewDal = require('../dal/reviewDal')
const emailNotification = require('../notification/emailNotification')
const validator = require('../validators/accountValidator')
const bcrypt = require('bcrypt')
let randomString = require('randomstring')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

accountController.login = async (req) => {
    try {
        let reqBody = req.body
        if (!reqBody.type) {
            return appHelper.apiResponse(
                200,
                false,
                'Login type is required',
                undefined,
                'Login type is required'
            )
        }
        let loginData
        switch (reqBody.type) {
            case 'normal':
                loginData = await normalLogin(req)
                break
            case 'google':
                loginData = await socialLogin(req)
                break
            case 'facebook':
                loginData = await socialLogin(req)
                break
            case 'apple':
                loginData = await socialLogin(req)
                break
            default:
                return appHelper.apiResponse(
                    200,
                    false,
                    'Invalid login type',
                    undefined,
                    'Invalid login type'
                )
        }
        if (!loginData.status) {
            return appHelper.apiResponse(
                200,
                false,
                loginData.message,
                loginData.data
            )
        }
        return appHelper.apiResponse(
            200,
            true,
            loginData.message,
            loginData.data
        )
    } catch (error) {
        console.log('login failed with error', error)
        return appHelper.apiResponse(
            500,
            false,
            'failed to login',
            error.message ? error.message : error
        )
    }
}

accountController.register = async (req) => {
    try {
        let payload = req.body
        // const validatePayload = await validator.register(payload);
        // if (!validatePayload.status) {
        //   return appHelper.apiResponse(200, false, "Invalid payload", validatePayload.data);
        // }
        let userExistValidation = await accDal.findAccountByEmail(payload.email)
        if (userExistValidation.status) {
            return appHelper.apiResponse(200, true, 'Please Login to continue')
        }
        let saveUserData = await accDal.saveUser(payload)
        if (!saveUserData.status) {
            return appHelper.apiResponse(200, false, saveUserData.message)
        }
        if (payload.deviceDetails) {
            let devicePayload = payload.deviceDetails
            devicePayload.accountId = saveUserData._id
            // await mailNotify.welcomeEmail(req.body)
            await deviceDal.saveDeviceIfNotExists(devicePayload)
        }
        return appHelper.apiResponse(
            200,
            true,
            'Register Success',
            saveUserData.data
        )
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.checkEmail = async (req) => {
    try {
        let payload = req.body
        const validatePayload = await validator.checkEmail(payload)
        if (!validatePayload.status) {
            return appHelper.apiResponse(
                200,
                false,
                'Invalid payload',
                validatePayload.data
            )
        }
        let userExistValidation = await accDal.findAccountByEmail(payload.email)
        if (userExistValidation.status) {
            return appHelper.apiResponse(200, true, 'Please Login to continue')
        }
        return appHelper.apiResponse(200, false, 'Please Register to continue')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.forgotPassword = async (req) => {
    try {
        let payload = req.body
        const validatePayload = await validator.checkEmail(payload)
        if (!validatePayload.status) {
            return appHelper.apiResponse(
                200,
                false,
                'Invalid payload',
                validatePayload.data
            )
        }
        let userExistValidation = await accDal.findAccountByEmail(payload.email)
        if (!userExistValidation.status) {
            return appHelper.apiResponse(
                200,
                true,
                'Please Follow your email to reset your password'
            )
        }
        let email = userExistValidation.data.email
        let accountId = userExistValidation.data._id
        let expiryTime = new Date()
        let token = await randomString.generate()
        expiryTime.setMinutes(expiryTime.getMinutes() + 15)
        let updatePayload = {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiryTime: expiryTime,
        }
        let resetPass = await accDal.findAccountByIdAndUpdate(
            accountId,
            updatePayload
        )
        if (!resetPass.status) {
            return appHelper.apiResponse(500, false, 'something went wrong')
        }
        let mailPayload = {
            to: email,
            token: token,
            accountId: accountId,
        }
        await emailNotification.forgotPasswordEmail(mailPayload)
        return appHelper.apiResponse(
            200,
            true,
            'Please Follow your email to reset your password'
        )
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.forgotPasswordUsingToken = async (req) => {
    try {
        let accountId = req.user._id
        let reqBody = req.body
        if (!reqBody.currentPassword || !reqBody.newPassword) {
            return appHelper.apiResponse(
                200,
                false,
                'Current Password and New Password is required to perform the operation '
            )
        }

        if (reqBody.currentPassword === reqBody.newPassword) {
            return appHelper.apiResponse(
                200,
                false,
                'Current Password and New Password should not be same'
            )
        }
        let userExistValidation = await accDal.findAccountById(accountId)
        if (!userExistValidation.status) {
            return appHelper.apiResponse(200, false, 'Invalid User')
        }
        let comparePassword = await bcrypt.compare(
            reqBody.currentPassword,
            userExistValidation.data.password
        )
        if (!comparePassword) {
            return appHelper.apiResponse(200, false, 'Invalid Current password')
        }
        let hashedPassword = await bcrypt.hash(reqBody.newPassword, 10)
        let resetPass = await accDal.findAccountByIdAndUpdate(accountId, {
            password: hashedPassword,
        })
        if (!resetPass.status) {
            return appHelper.apiResponse(500, false, 'something went wrong')
        }
        return appHelper.apiResponse(200, true, 'Success')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.resetPassword = async (req) => {
    try {
        let token = req.params.token
        let accountId = req.params.accountId
        let reqBody = req.body
        if (reqBody.password1 != reqBody.password2) {
            return appHelper.apiResponse(
                200,
                false,
                'password and confirm password does not match'
            )
        }
        let data = await accDal.findAccountByToken(token)
        if (!data.status) {
            return appHelper.apiResponse(200, false, 'Invalid Token')
        }
        if (accountId != data.data._id.toString()) {
            return appHelper.apiResponse(200, false, 'Invalid Token')
        }
        if (data.data.forgotPasswordTokenExpiryTime < new Date().getTime()) {
            return appHelper.apiResponse(200, false, 'Token Expired')
        }
        let hashedPassword = await bcrypt.hash(reqBody.password1, 10)
        let resetPass = await accDal.findAccountByIdAndUpdate(accountId, {
            password: hashedPassword,
        })
        if (!resetPass.status) {
            return appHelper.apiResponse(500, false, 'something went wrong')
        }
        return appHelper.apiResponse(200, true, 'Success')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.getMyProfileDetails = async (req) => {
    try {
        req.user.secret = undefined
        let profileData = req.user
        return appHelper.apiResponse(200, true, 'Success', profileData)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.updateMyProfile = async (req) => {
    try {
        let accountId = req.user._id
        let reqBody = req.body
        let payload = {
            address: reqBody.address,
            profile: reqBody.profile,
            showNotification: reqBody.showNotification,
            emailNotification: reqBody.emailNotification,
            pushNotification: reqBody.pushNotification,
            name: reqBody.name,
            country: reqBody.country,
            phone: reqBody.phone,
        }
        let updateProfile = await accDal.findAccountByIdAndUpdateV2(
            accountId,
            JSON.parse(JSON.stringify(payload))
        )
        if (!updateProfile.status) {
            return appHelper.apiResponse(500, false, 'something went wrong')
        }
        return appHelper.apiResponse(200, true, 'Success', updateProfile)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.updateMyPassword = async (req) => {
    try {
        let email = req.user.email
        let accountId = req.user._id
        let expiryTime = new Date()
        let token = await randomString.generate()
        expiryTime.setMinutes(expiryTime.getMinutes() + 15)
        let updatePayload = {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiryTime: expiryTime,
        }
        let resetPass = await accDal.findAccountByIdAndUpdate(
            accountId,
            updatePayload
        )
        if (!resetPass.status) {
            return appHelper.apiResponse(500, false, 'something went wrong')
        }
        let mailPayload = {
            to: email,
            token: token,
            accountId: accountId,
        }
        await emailNotification.forgotPasswordEmail(mailPayload)
        return appHelper.apiResponse(
            200,
            true,
            'Please Follow your email to reset your password'
        )
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

accountController.deleteAccount = async (req) => {
    try {
        let accountId = req.user._id
        let deleteUserAccount = await accDal.deleteAccountById(accountId)
        let deleteUserBookings = await bookingDal.deleteAllBookingForUser(
            accountId
        )
        let deleteUserBusiness = await businessDal.deleteAllBusinessForUser(
            accountId
        )
        let deleteUserBusinessServices =
            await businessServiceDal.deleteAllBusinessServicesForUser(accountId)
        let deleteUserComments = await commentDal.deleteAllCommentForUser(
            accountId
        )
        let deleteUserDevice = await deviceDal.deleteAllDevicesForUser(
            accountId
        )
        let deleteUserFiles = await fileDal.deleteAllFileForUser(accountId)
        let deleteUserLikes = await likeDal.deleteAllLikesForUser(accountId)
        let deleteUserOffers = await offerDal.deleteAllOffersForUser(accountId)
        let deleteUserReviews = await reviewDal.deleteAllReviewsForUser(
            accountId
        )
        return appHelper.apiResponse(200, true, 'Account deleted successfully')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

const normalLogin = async (req) => {
    let reqBody = req.body
    // const validatePayload = await validator.normalLoginValidator(reqBody);
    // if (!validatePayload.status) {
    //   return { status: false, message: "Invalid payload", data: validatePayload.data };
    // }
    let findUser = await accDal.findAccountByEmail(reqBody.email)
    if (!findUser.status) {
        return { status: false, message: 'Please Register to continue' }
    }
    if (reqBody.type != findUser.data.type) {
        return {
            status: false,
            message: `Account is already exist using ${findUser.data.type} login`,
        }
    }
    if (reqBody.role != findUser.data.role) {
        return {
            status: false,
            message: `${findUser.data.role} account cannot be used as ${reqBody.role} account`,
        }
    }
    let comparePassword = await bcrypt.compare(
        reqBody.password,
        findUser.data.password
    )
    if (!comparePassword) {
        return { status: false, message: 'Invalid username / password' }
    }
    let role = findUser.data.role
    if (reqBody.deviceDetails && (role === 'customer' || role === 'business')) {
        const validatePayload = await validator.deviceDataValidation(reqBody)
        if (!validatePayload.status) {
            return {
                status: false,
                message: 'Invalid payload',
                data: validatePayload.data,
            }
        }
        let devicePayload = reqBody.deviceDetails
        devicePayload.accountId = findUser.data._id
        await deviceDal.saveDeviceIfNotExists(devicePayload)
    }
    let jwtPayload = {
        accId: findUser.data._id,
    }
    let token = await jwt.sign(jwtPayload, config.jwtSecret, {})
    if (!token) {
        return { status: false, message: 'failed to generate token' }
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
    return { status: true, message: 'login successful', data: response }
}

const socialLogin = async (req) => {
    try {
        let reqBody = req.body
        // const validatePayload = await validator.socialLoginValidator(reqBody);
        // if (!validatePayload.status) {
        //   return { status: false, message: "Invalid payload", data: validatePayload.data };
        // }
        let user
        if (reqBody.type === 'apple' && !reqBody.email) {
            user = await accDal.socialKey(reqBody.socialKey)
        } else {
            user = await accDal.findAccountByEmail(reqBody.email)
        }
        if (user.status && reqBody.type != user.data.type) {
            return {
                status: false,
                message: `Account is already exist using ${user.data.type} login`,
            }
        }
        if (user.status && reqBody.role != user.data.role) {
            return {
                status: false,
                message: `${user.data.role} account cannot be used as ${reqBody.role} account`,
            }
        }
        if (!user.status) {
            if (!reqBody.email) {
                return {
                    status: false,
                    message: `Email is required to register your account`,
                }
            }
            let payload = {
                email: reqBody.email,
                terms: true,
                name: reqBody.name,
                type: reqBody.type,
                role: reqBody.role ? reqBody.role : 'user',
                socialKey: reqBody.socialKey,
                socialLoginType: reqBody.type,
                password: `${Date.now()}`,
            }
            user = await accDal.saveUser(payload)
            if (!user.status) {
                return { status: false, message: user.message }
            }
        }
        if (reqBody.socialKey != user.data.socialKey) {
            return { status: false, message: 'Invalid Social key' }
        }
        let role = user.data.role
        if (
            reqBody.deviceDetails &&
            (role === 'customer' || role === 'business')
        ) {
            let devicePayload = reqBody.deviceDetails
            devicePayload.accountId = user.data._id
            await deviceDal.saveDeviceIfNotExists(devicePayload)
        }
        let jwtPayload = {
            accId: user.data._id,
        }
        let token = await jwt.sign(jwtPayload, config.jwtSecret, {})
        if (!token) {
            return { status: false, message: 'failed to generate token' }
        }
        let response = {
            token: token,
            accountData: {
                _id: user.data._id,
                name: user.data.name,
                phone: user.data.phone,
                email: user.data.email,
                role: user.data.role,
                profile: user.data.profile,
                country: user.data.country,
            },
        }
        return { status: true, message: 'login successful', data: response }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = accountController
