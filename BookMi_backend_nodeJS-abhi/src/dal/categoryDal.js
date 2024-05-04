const categorySchema = require('../models/category')
const categoryDal = {}

categoryDal.saveCategory = async (data) => {
    try {
        let category = new categorySchema(data)
        let result = await category.save()
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
                data: error.message ? error.message : error,
            }
        }
    }
}

categoryDal.findCategory = async () => {
    try {
        let result = await categorySchema
            .aggregate()
            .match({ delete: false })
            .sort({ createdAt: 1 })
            .lookup({
                from: 'services',
                localField: '_id',
                foreignField: 'category',
                as: 'services',
            })
            .exec()
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

categoryDal.findCategoryDetails = async (id) => {
    try {
        let result = await categorySchema.findById(id)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

categoryDal.findCategoryByIdAndUpdate = async (id, data) => {
    try {
        let result = await categorySchema.findByIdAndUpdate(id, data, {
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

categoryDal.deleteCategoryById = async (id) => {
    try {
        let result = await categorySchema.findByIdAndDelete(id)
        if (result) {
            return { status: true, data: result }
        }
        return { status: false, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

categoryDal.searchCategories = async (req) => {
    try {
        let reqQuery = req.query
        let query = [{ delete: false }]
        if (reqQuery.keyword) {
            let value = String(reqQuery.keyword).replace(
                /([.*+?=^!:${}()|[\]\/\\])/g,
                '\\$1'
            )
            query.push({ name: { $regex: '.*' + value + '.*', $options: 'i' } })
        }
        let result = await categorySchema
            .aggregate()
            .match({ $and: query })
            .limit(10)
            .exec()
        return { status: true, data: result }
    } catch (error) {
        console.log('failed to fetch clogs', error)
        return { status: false, data: error.message ? error.message : error }
    }
}

module.exports = categoryDal
