const mongoose = require('mongoose')

const deviceSchema = mongoose.Schema({
  deviceType: { type: String },
  deviceId: { type: String },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref:'account' },
},{ timestamps: true })


module.exports = mongoose.model('device', deviceSchema);