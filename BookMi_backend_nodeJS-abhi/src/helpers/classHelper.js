let classHelper = new Object()

classHelper.getAllProject = async (reqData) => {
    return {
        _id: 1,
        className: 1,
        rating: 1,
        amountPer: 1,
        amount: 1,
        discountAmount: 1,
        discountPercentage: 1,
        description: 1,
        provideWhat: 1,
        language: 1,
        classFrequency: 1,
        imageUrl: 1,
        count: 1,
        statusFlag: 1,
        tutorId: 1,
        start_time: 1,
        end_time: 1,
        totalHours: 1,
        requirement: 1,
        forWho: 1,
        FAQ: 1,
        feedbacks: {
            name: 1,
            rating: 1,
            tutorRating: 1,
            platformRating: 1,
            feedbackDescription: 1
        },
        classRating: 1,
        createdAt: 1,
        updatedAt: 1,
        tutorDetails: {
            name: "$tutorDetails.name",
            profileUrl: "$tutorDetails.profileUrl",
            email: "$tutorDetails.email"
        },
        instituteDetails: {
            name: "$instituteDetails.instituteName",
            _id: "$instituteDetails._id",
            profileUrl: "$instituteDetails.profileUrl",
            email: "$instituteDetails.instituteEmail"
        },
        createdBy: {
            name: "$createdBy.name",
            email: "$createdBy.email"
        },
        updatedBy: {
            name: "$updatedBy.name",
            email: "$updatedBy.email"
        }
    }

}
classHelper.getByIdProject = async (reqData) => {
    return {
        _id: 1,
        className:  1,
        categoryId: 1,
        subCategoryId:1,
        rating: 1,
        amount: 1,
        amountPer: 1,
        description: 1,
        provideWhat: 1,
        discountAmount: 1,
        discountPercentage: 1,
        couponCode: 1,
        couponExpiry: 1,
        language: 1,
        classFrequency: 1,
        imageUrl: 1,
        statusFlag: 1,
        webinarLink:1,
        mainModeratorLink: 1,
        tutorId: 1,
        start_time: 1,
        end_time: 1,
        learnersNumber: 1,
        meetingId: 1,
        meetingUrl: 1,
        meetingPassword: 1,
        classType: 1,
        privateToPublic: 1,
        approval: 1,
        totalHours: 1,
        requirement: 1,
        forWho: 1,
        FAQ: 1,
        rejectedComments: 1,
        feedbacks: {
            name: 1,
            rating: 1,
            tutorRating: 1,
            platformRating: 1,
            feedbackDescription: 1
        },
        classRating: 1,
        tutorDetails: {
            _id: "$tutorDetails._id",
            name: "$tutorDetails.name",
            profileUrl: "$tutorDetails.profileUrl",
            email: "$tutorDetails.email"
        },
        instituteDetails: {
            name: "$instituteDetails.instituteName",
            _id: "$instituteDetails._id",
            profileUrl: "$instituteDetails.profileUrl",
            email: "$instituteDetails.instituteEmail"
        },
        createdBy: {
            name: "$createdBy.name",
            email: "$createdBy.email"
        },
        updatedBy: {
            name: "$updatedBy.name",
            email: "$updatedBy.email"
        },
        createdAt: 1,
        updatedAt: 1
    }

}

classHelper.getAllProjectForApproval = async (reqData) => {
    return {
        _id: 1,
        className:  1,
        categoryId: 1,
        subCategoryId:1,
        rating: 1,
        amount: 1,
        amountPer: 1,
        description: 1,
        provideWhat: 1,
        discountAmount: 1,
        discountPercentage: 1,
        couponCode: 1,
        couponExpiry: 1,
        language: 1,
        classFrequency: 1,
        imageUrl: 1,
        statusFlag: 1,
        tutorId: 1,
        start_time: 1,
        end_time: 1,
        learnersNumber: 1,
        meetingId: 1,
        meetingUrl: 1,
        meetingPassword: 1,
        classType: 1,
        privateToPublic: 1,
        approval: 1,
        totalHours: 1,
        requirement: 1,
        forWho: 1,
        FAQ: 1,
        webinarLink:1,
        mainModeratorLink: 1,
        rejectedComments: 1,
        tutorDetails: {
            _id: "$tutorDetails._id",
            name: "$tutorDetails.name",
            profileUrl: "$tutorDetails.profileUrl",
            email: "$tutorDetails.email"
        },
        instituteDetails: {
            name: "$instituteDetails.instituteName",
            _id: "$instituteDetails._id",
            profileUrl: "$instituteDetails.profileUrl",
            email: "$instituteDetails.instituteEmail"
        },
        createdBy: {
            name: "$createdBy.name",
            email: "$createdBy.email"
        },
        updatedBy: {
            name: "$updatedBy.name",
            email: "$updatedBy.email"
        },
        createdAt: 1,
        updatedAt: 1
    }

}


module.exports = classHelper;

