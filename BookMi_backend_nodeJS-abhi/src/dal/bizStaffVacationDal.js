const businessStaffVacationSchema = require('../models/businessStaffVacation')
const dayjs = require('dayjs')
const { bus } = require('nodemon/lib/utils')
const bizStaffVacationDal = {}

const getEod = () => dayjs().endOf('day')

bizStaffVacationDal.getActiveVacationsOfStaff = async (businessId, userId) => {
    try {
        const now = Date.now()
        const eod = getEod()
        const res = await businessStaffVacationSchema
            .find({
                businessId,
                userId,
            })
            .or([{ start: { $gte: now } }, { end: { $lte: eod } }])
        if (res) {
            return { status: true, data: res }
        }
        return { status: false, data: res }
    } catch (e) {
        console.log('failed to fetch active vacations of staff', e)
        return { status: false, data: e.message ? e.message : e }
    }
}

bizStaffVacationDal.addVacationTillEod = async (businessId, userId) => {
    return bizStaffVacationDal.addVacation(
        businessId,
        userId,
        dayjs().valueOf(),
        getEod()
    )
}

bizStaffVacationDal.getVacationForStartAndEnd = async (
    businessId,
    userId,
    start,
    end
) => {
    try {
        const result = await businessStaffVacationSchema.findOne({
            businessId,
            userId,
            start,
            end,
        })
        return {
            status: result !== null ? true : false,
            data: result,
        }
    } catch (e) {
        console.log('failed to fetch active vacations of staff', e)
        return { status: false, data: e.message ? e.message : e }
    }
}

bizStaffVacationDal.addVacation = async (businessId, userId, start, end) => {
    try {
        const data = new businessStaffVacationSchema({
            businessId,
            userId,
            start,
            end,
        })
        const result = await data.save()
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to save vacation', error)
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

bizStaffVacationDal.getVacationsOnDate = async (businessId, dateInMs) => {
    try {
        // console.log('dateInMs', dateInMs)
        // console.log('businessId', businessId)
        const res = await businessStaffVacationSchema.find({
            businessId,
            end: { $gte: dateInMs },
        })
        if (res) {
            return { status: true, data: res }
        }
        return { status: false, data: res }
    } catch (e) {
        console.log('failed to fetch active vacations of staff', e)
        return { status: false, data: e.message ? e.message : e }
    }
}

bizStaffVacationDal.delete = async (id) => {
    try {
        let result = await businessStaffVacationSchema.findByIdAndDelete(id)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to delete biz staff vacation', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

module.exports = bizStaffVacationDal
