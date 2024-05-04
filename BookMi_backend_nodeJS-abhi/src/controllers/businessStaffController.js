const appHelper = require('../helpers/appHelper')
const accountControllerV2 = require('../controllers/accountControllerV2')
const businessStaffDal = require('../dal/businessStaffDal')
const Joi = require('joi')
const businessStaffController = {}

const AddBusinessStaffRequestSchema = Joi.object({
    data: Joi.array().items(
        Joi.object({
            id: Joi.string().optional(),
            businessId: Joi.string(),
            name: Joi.string(),
            phone: Joi.string(),
            gender: Joi.string().valid('m', 'f'),
        })
    ),
})

const RemoveBusinessStaffRequestSchema = Joi.object({
    businessId: Joi.string(),
    userId: Joi.string(),
})

// add new businessStaff, create their userAccount if not exists
businessStaffController.add = async (req) => {
    const body = req.body
    const validated = AddBusinessStaffRequestSchema.validate(body)
    console.log('validated', validated.value)
    if (validated.error) {
        return appHelper.apiResponse(
            400,
            false,
            validated.error.details.join(', '),
            undefined
        )
    }
    let resp = []
    for (const item of validated.value.data) {
        // fetch user account by phone
        let account = await accountControllerV2.getAccountByPhone(item.phone)
        let userId = account?.data?._id ?? ''
        let staffExists = false
        let createNewAcct = false
        let id = ''

        // find if business staff exists
        if (userId !== '') {
            const existing = await businessStaffDal.findOne(
                item.businessId,
                userId
            )
            staffExists =
                existing.status && (existing?.data?.userId ?? '') !== ''
        }
        if (account.data === null) {
            createNewAcct = true
        }

        // create new account
        if (createNewAcct) {
            account = await accountControllerV2.createAccountByPhone(
                item.phone,
                item.name,
                'staff'
            )
            if (!account.status) {
                return appHelper.apiResponse(500, false, account?.message ?? '')
            }
            userId = account.data._id
        }

        console.log('staffExists', staffExists)

        // add businessStaff
        if (!staffExists) {
            const savedBizStaff = await businessStaffDal.save({
                name: item.name,
                businessId: item.businessId,
                userId: userId,
                gender: item.gender,
            })

            if (!savedBizStaff.status) {
                return appHelper.apiResponse(500, false, account?.message ?? '')
            }

            console.log('savedStaff', savedBizStaff)

            id = savedBizStaff.data._id
        }

        // staff exists, update details
        if (staffExists) {
            id = item?.id ?? ''
            if (id !== '') {
                const result = await businessStaffDal.update(id, {
                    name: item.name,
                    gender: item.gender,
                })
                console.log('update result', result)
                if (!result.status) {
                    return appHelper.apiResponse(
                        500,
                        false,
                        result?.message ?? ''
                    )
                }
            }
        }
        resp.push({
            _id: id,
            businessId: item.businessId,
            userId,
            name: item.name,
            phone: item.phone,
            gender: item.gender,
        })
    }

    return appHelper.apiResponse(200, true, 'ok', resp)
}

businessStaffController.getSingleStaffOfBusinessByUserIdInternal = async (
    businessId,
    userId
) => {
    if (businessId === '' || userId === '') {
        return null
    }

    try {
        const staff = await businessStaffDal.findOne(businessId, userId)
        return {
            status: staff.status,
            data: staff.data,
        }
    } catch (error) {
        console.log('failed to fetch single staff of biz', userId, businessId)
    }
}

businessStaffController.getAllStaffsOfBusinessInternal = async (bizId) => {
    if (bizId === '') {
        return null
    }
    try {
        const staffs = await businessStaffDal.findAllByBizId(bizId)
        if (!staffs.status) {
            console.log(
                'failed to query db to get all staffs of biz',
                bizId,
                staffs?.data ?? ''
            )
            return null
        }
        // {phone: '9999999999', name: '9999999999'}
        const response = []
        for (const staff of staffs.data) {
            const acct = await accountControllerV2.getAccountByUserId(
                staff.userId
            )
            if (acct.status) {
                const { phone, name } = acct.data
                const { _id, businessId, userId, gender } = staff
                response.push({ _id, businessId, userId, gender, phone, name })
            }
        }
        return response
    } catch (error) {
        console.log('error in fetching all staffs by biz', bizId, error)
        return null
    }
}

businessStaffController.getAllStaffsOfBusiness = async (query) => {
    const { businessId: bizId } = query
    if (bizId === '') {
        return appHelper.apiResponse(
            400,
            false,
            'businessId query param required',
            undefined
        )
    }
    try {
        const staffs = await businessStaffDal.findAllByBizId(bizId)
        if (!staffs.status) {
            console.log(
                'failed to query db to get all staffs of biz',
                bizId,
                staffs?.data ?? ''
            )
            return appHelper.apiResponse(
                500,
                false,
                'failed to fetch staff list',
                undefined
            )
        }
        // {phone: '9999999999', name: '9999999999'}
        const response = []
        for (const staff of staffs.data) {
            const acct = await accountControllerV2.getAccountByUserId(
                staff.userId
            )
            if (acct.status) {
                const { phone } = acct.data
                const { _id, userId, gender, name } = staff
                response.push({ _id, userId, phone, name, gender })
            }
        }
        return appHelper.apiResponse(200, true, '', response)
    } catch (error) {
        console.log('error in fetching all staffs by biz', bizId, error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

businessStaffController.delete = async (body) => {
    const validated = RemoveBusinessStaffRequestSchema.validate(body)
    if (validated.error) {
        return appHelper.apiResponse(
            400,
            false,
            validated.error.details.join(', '),
            undefined
        )
    }
    const { businessId, userId } = validated.value
    try {
        const result = await businessStaffDal.delete(businessId, userId)
        if (!result.status) {
            return appHelper.apiResponse(
                500,
                false,
                'failed to remove staff from business'
            )
        }
        return appHelper.apiResponse(200, true, 'ok', undefined)
    } catch (error) {
        console.log(
            'error in removing staff from biz',
            businessId,
            userId,
            error
        )
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

module.exports = businessStaffController
