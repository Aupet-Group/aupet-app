const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  name: { type: String },
  lastName: { type: String },
  username: { type: String },
  phone: Number,
  mobile: Number,
  secondaryPhone: Number,
  address: [{
    street: { type: String },
    number: Number,
    zipcode: Number,
    location: { type: String },
  }],
  img: { type: String },
},

{
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
