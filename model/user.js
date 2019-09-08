const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  lastName: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: [],
  email: { type: String },
  address: [{
    street: { type: String },
    number: Number,
    zipcode: Number,
    city: String,
  }],
  img: { type: String },
},

{
  timestamps: true,
});

const User = mongoose('User', userSchema);
module.exports = User;
