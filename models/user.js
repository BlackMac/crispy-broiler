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

userSchema.methods.activate = function(activationcode, password, cb) {
  if (this.account.activationcode === activationcode) {
    this.account.password = password
  }
};

userSchema.pre('save', async function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.account.isModified('.password')) return next();
  
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.account.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.account.password = hash;
        next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);