const Joi = require('joi')
const appHelper = require('../helpers/appHelper')
const dal = require('../dal/bizStaffVacationDal')
const bsvController = {}

const AddVacationReqSchema = Joi.object({
    businessId: Joi.string().required(),
    userId: Joi.string().required(),
    start: Joi.string().required(),
    end: Joi.string().required(),
})

bsvController.add = async (body) => {
    try {
        const validated = AddVacationReqSchema.validate(body)
        if (validated.error) {
            return appHelper.apiResponse(
                400,
                false,
                validated.error.details.map((o) => o.message).join(', '),
                undefined
            )
        }
        const { businessId, userId, start, end } = validated.value
        const existing = await dal.getVacationForStartAndEnd(
            businessId,
            userId,
            start,
            end
        )
        if (existing.status && existing.data !== null) {
            return appHelper.apiResponse(
                304,
                false,
                'already existing',
                undefined
            )
        }
        const result = await dal.addVacation(businessId, userId, start, end)
        return appHelper.apiResponse(
            result.status ? 200 : 500,
            result.status,
            '',
            result.data
        )
    } catch (error) {
        return appHelper.apiResponse(500, false, 'server error', undefined)
    }
}

const AddEodVacationReqSchema = Joi.object({
    businessId: Joi.string().required(),
    userId: Joi.string().required(),
})

bsvController.addEod = async (body) => {
    try {
        const validated = AddEodVacationReqSchema.validate(body)
        if (validated.error) {
            return appHelper.apiResponse(
                400,
                false,
                validated.error.details.map((o) => o.message).join(', '),
                undefined
            )
        }
        const { businessId, userId } = validated.value
        const result = await dal.addVacationTillEod(businessId, userId)
        return appHelper.apiResponse(
            result.status ? 200 : 500,
            result.status,
            '',
            result.data
        )
    } catch (error) {
        return appHelper.apiResponse(500, false, 'server error', undefined)
    }
}

bsvController.getVacationOfStaff = async (query) => {
    try {
        const { businessId, userId } = query
        if (businessId === '' || userId === '') {
            return appHelper.apiResponse(
                400,
                false,
                'businessId and userId cannot be empty',
                undefined
            )
        }
        const result = await dal.getActiveVacationsOfStaff(businessId, userId)
        return appHelper.apiResponse(
            result.status ? 200 : 500,
            result.status,
            '',
            result.data
        )
    } catch (error) {
        return appHelper.apiResponse(500, false, 'server error', undefined)
    }
}

bsvController.getVacationsOnDate = async (query) => {
    try {
        const { businessId, date } = query
        if (businessId === '') {
            return appHelper.apiResponse(
                400,
                false,
                'businessId and userId cannot be empty',
                undefined
            )
        }
        const result = await dal.getVacationsOnDate(businessId, parseInt(date))
        return appHelper.apiResponse(
            result.status ? 200 : 500,
            result.status,
            '',
            result.data
        )
    } catch (error) {
        return appHelper.apiResponse(500, false, 'server error', undefined)
    }
}

const DeleteVacationReqSchema = Joi.object({
    vacationId: Joi.string().required(),
})

bsvController.deleteVacation = async (body) => {
    try {
        const validated = DeleteVacationReqSchema.validate(body)
        if (validated.error) {
            return appHelper.apiResponse(
                400,
                false,
                validated.error.details.map((o) => o.message).join(', '),
                undefined
            )
        }
        const { vacationId } = validated.value
        const result = await dal.delete(vacationId)
        return appHelper.apiResponse(
            result.status ? 200 : 500,
            result.status,
            '',
            result.data
        )
    } catch (error) {
        return appHelper.apiResponse(500, false, 'server error', undefined)
    }
}

module.exports = bsvController
