const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  type: { type: String, enum: ['website', 'class', 'course', 'webinar', 'workshop', 'teacher', 'platform'], required: true },
  typeRefId: { type: mongoose.ObjectId },
  answers: [{
    questionId: { type: mongoose.ObjectId, required: true },
    answerText: { type: String },
    answerRating: { type: Number, default: 0, max: [5, "rating should not exceeds 5"] },
    answerOption: { type: Boolean },
  }],
  userId: { type: mongoose.ObjectId },
  tutorId: { type: mongoose.ObjectId },
  name: { type: String },
  email: { type: String , required: true},


  rating: { type: Number, default: 0,  max: [5, "rating should not exceeds 5"] },
  tutorRating: { type: Number, default: 0, max: [5, "tutor rating should not exceeds 5"] },
  platformRating: { type: Number, default: 0, max: [5, "tutor rating should not exceeds 5"] },
  feedbackDescription: { type: String }
}, { timestamps: true })



module.exports = mongoose.model('feedback', feedbackSchema);