const businessStaffSchema = require('../models/businessStaff')
const businessStaffDal = {}

businessStaffDal.save = async (data) => {
    try {
        const bs = new businessStaffSchema(data)
        const result = await bs.save()
        if (result) {
            return { status: true, data: result }
        }
        return {
            status: false,
            data: result,
            message: 'Failed to save biz staff',
        }
    } catch (error) {
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

businessStaffDal.update = async (id, data) => {
    try {
        const result = await businessStaffSchema.findByIdAndUpdate(id, data, {
            new: true,
        })
        if (result) {
            return { status: true, data: result }
        }
        return {
            status: false,
            data: result,
            message: 'Failed to save biz staff',
        }
    } catch (error) {
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

businessStaffDal.findOne = async (businessId, userId) => {
    try {
        const result = await businessStaffSchema.findOne({ businessId, userId })
        return {
            status: result ? true : false,
            data: result,
        }
    } catch (error) {
        console.log('failed to find', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

businessStaffDal.findAllByBizId = async (businessId) => {
    try {
        let result = await businessStaffSchema.find({ businessId })
        return {
            status: result ? true : false,
            data: result,
        }
    } catch (error) {
        console.log('failed to find', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

businessStaffDal.delete = async (businessId, userId) => {
    try {
        const result = await businessStaffSchema.deleteOne({
            businessId,
            userId,
        })
        return {
            status: result ? true : false,
            data: result,
        }
    } catch (error) {
        console.log('failed to delete', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

module.exports = businessStaffDal
