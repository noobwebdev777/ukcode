const accountSchema = require('../models/account')
const accountSchemaV2 = require('../models/accountV2')
const accountDal = {}

accountDal.findAccountByPhone = async (phone) => {
    try {
        const res = await accountSchemaV2.findOne({
            phone: phone,
            deleted: false,
        })
        if (res) {
            return { status: true, data: res }
        }
        return { status: false, data: res }
    } catch (e) {
        console.log('failed to fetch account by phone', phone, e)
        return { status: false, data: e.message ? e.message : e }
    }
}

accountDal.saveUserV2 = async (data) => {
    try {
        let account = new accountSchemaV2(data)
        let result = await account.save()
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to save Users', error)
        if (error.code == '11000') {
            return {
                status: false,
                message: `${Object.keys(error.keyValue)[0]} is already taken`,
            }
        } else {
            return {
                status: false,
                message: error.message ? error.message : error,
            }
        }
    }
}

accountDal.saveUser = async (data) => {
    try {
        let account = new accountSchema(data)
        let result = await account.save()
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to save Users', error)
        if (error.code == '11000') {
            return {
                status: false,
                message: `${Object.keys(error.keyValue)[0]} is already taken`,
            }
        } else {
            return {
                status: false,
                message: error.message ? error.message : error,
            }
        }
    }
}

accountDal.findAccountByEmail = async (email) => {
    try {
        let result = await accountSchema.findOne({
            email: email,
            deleted: false,
        })
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.socialKey = async (socialKey) => {
    try {
        let result = await accountSchema.findOne({
            socialKey: socialKey,
            deleted: false,
        })
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findAccountByIdAndUpdateV2 = async (id, data) => {
    try {
        let result = await accountSchemaV2.findByIdAndUpdate(id, data, {
            new: true,
        })
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to save Users', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findAccountByIdAndUpdate = async (id, data) => {
    try {
        let result = await accountSchema.findByIdAndUpdate(id, data, {
            new: true,
        })
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to save Users', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findAccountByIdAndUpdateV2 = async (id, data) => {
    try {
        let result = await accountSchemaV2.findByIdAndUpdate(id, data, {
            new: true,
        })
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to save Users', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findAccountByToken = async (token) => {
    try {
        let result = await accountSchema.findOne({
            forgotPasswordToken: token,
            deleted: false,
        })
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findAccountByIdV2 = async (id) => {
    try {
        let result = await accountSchemaV2.findById(id)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findAccountById = async (id) => {
    try {
        let result = await accountSchema.findById(id)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findProfileById = async (id) => {
    try {
        let result = await accountSchema.findById(
            id,
            'name country phone email role secret showNotification emailNotification pushNotification country profile country address'
        )
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.findProfileByIdV2 = async (id) => {
    try {
        let result = await accountSchemaV2.findById(
            id,
            'name country phone email role secret showNotification emailNotification pushNotification country profile country address'
        )
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

accountDal.deleteAccountById = async (id) => {
    try {
        let result = await accountSchema.findByIdAndDelete(id)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

module.exports = accountDal
