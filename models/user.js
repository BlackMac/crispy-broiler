const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const userSchema = new mongoose.Schema({
  account: {
    email: {
      type: String,
      required: true,
      index: { unique: true },
      match: [/^\w+([\.-]?[\w\+]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: false
    },
    activationcode: {
      type: String,
      required: false,
      index: { unique: true },
      default: () => {
        return crypto.randomBytes(10).toString('hex');
      }
    },
    created: {
      type: Date,
      default: new Date()
    }
  },
  name: {
    type: String,
    required: false
  }
});

userSchema.query.byActivationCode = function(activationcode) { 
  return this.findOne({ "account.activationcode": activationcode }); 
};

userSchema.query.byEmail = function(email) { 
  return this.findOne({ "account.email": email }); 
};

userSchema.statics.findByLoginData = async function(username, password, next) {
  var user = this;
  const hash = await bcrypt.hash(password, SALT_WORK_FACTOR)
  console.log(hash);
  next(this.findOne({ "account.email": username , "account.password": hash})); 
};

userSchema.methods.activate = function(activationcode, password, cb) {
  if (this.account.activationcode === activationcode) {
    this.account.password = password
  }
};

userSchema.pre('save', async function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('account.password')) return next();
  // generate a salt
  const hash = await bcrypt.hash(user.account.password, SALT_WORK_FACTOR)
  user.account.password = hash;
  next();
});

module.exports = mongoose.model('User', userSchema);