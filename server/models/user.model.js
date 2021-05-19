const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: 'Please enter a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    isAdmin: {
      type: Boolean,
      required: [
        true,
        'Please specify if this user should have administrative privileges',
      ],
    },
  },
  { timestamps: true }
);

UserSchema.virtual('confirmPassword')
  .get(() => this._confirmPassword)
  .set((value) => (this._confirmPassword = value));

UserSchema.pre('validate', function (next) {
  if (this.password !== this._confirmPassword) {
    this.invalidate('confirmPassword', 'Passwords do not match');
  }
  next();
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;
    next();
  });
});

module.exports.User = mongoose.model('User', UserSchema);
