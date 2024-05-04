const mongoose = require('mongoose')
let bcrypt = require('bcrypt');
let randomString = require("randomstring");

const accountSchema = mongoose.Schema({
  name: { type: String, default: null  },
  businessName: { type: String },
  country: { type: String, default: null },
  address: { type: String, default: null  },
  phone: { type: String, default: null  },
  profile: { type: String, default: null  },
  email: { type: String, index: true, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  socialKey: { type: String },
  socialLoginType: { type: String },
  type: { type: String, default: 'normal'},
  referralCode: { type: String },
  terms: { type: Boolean, required: true },
  role: { type: String, enum: ['customer', 'business', 'admin'], default: 'customer' },
  secret: { type: String },
  timeZone: { type: String },
  deiceToken: { type: String },
  showNotification: { type: Boolean, default: true },
  emailNotification: { type: Boolean, default: true },
  pushNotification: { type: Boolean, default: true },
  forgotPasswordToken: { type: String },
  forgotPasswordTokenExpiryTime: { type: Date },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  deleted: { type: Boolean, default: false }
}, { timestamps: true })

accountSchema.pre('save', async function (next)  {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  // if (this.socialKey) {
  //   this.socialKey = await bcrypt.hash(this.socialKey, 10)
  // }
  // if (this.socialKey) {
  //   this.socialLoginType = this.type
  // }
  this.secret =  randomString.generate();
  next()
})


module.exports = mongoose.model('account', accountSchema);