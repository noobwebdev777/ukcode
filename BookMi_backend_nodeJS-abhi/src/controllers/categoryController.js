const categoryController = {}
const appHelper = require('../helpers/appHelper')
const categoryDal = require('../dal/categoryDal')

categoryController.createCategory = async (req) => {
    try {
        let createCategory = await categoryDal.saveCategory(req.body)
        if (!createCategory.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to save category',
                'failed to save category'
            )
        }
        return appHelper.apiResponse(200, true, 'success', createCategory.data)
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

categoryController.getAllCategory = async (req) => {
    try {
        let getAllCategory = await categoryDal.findCategory(req)
        if (!getAllCategory.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get category',
                'failed to get category'
            )
        }
        return appHelper.apiResponse(200, true, 'success', getAllCategory.data)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

categoryController.getCategoryDetails = async (req) => {
    try {
        let categoryId = req.params.categoryId
        let getCategoryDetails = await categoryDal.findCategoryDetails(
            categoryId
        )
        if (!getCategoryDetails.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get category details',
                'failed to get category details'
            )
        }
        return appHelper.apiResponse(
            200,
            true,
            'success',
            getCategoryDetails.data
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

categoryController.updateCategory = async (req) => {
    try {
        let categoryId = req.params.categoryId
        let reqBody = req.body
        let updateCategory = await categoryDal.findCategoryByIdAndUpdate(
            categoryId,
            reqBody
        )
        if (!updateCategory.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to get category details',
                'failed to get category details'
            )
        }
        return appHelper.apiResponse(200, true, 'success', updateCategory.data)
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

categoryController.deleteCategory = async (req) => {
    try {
        let categoryId = req.params.categoryId
        let deleteCategory = await categoryDal.deleteCategoryById(categoryId)
        if (!deleteCategory.status) {
            return appHelper.apiResponse(
                200,
                false,
                'failed to delete category',
                'failed to delete category'
            )
        }
        return appHelper.apiResponse(200, true, 'Category Deleted')
    } catch (error) {
        console.log(' Failed', error)
        return appHelper.apiResponse(
            500,
            false,
            error.message ? error.message : 'internal server error'
        )
    }
}

module.exports = categoryController
