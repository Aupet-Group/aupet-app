const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    name: { type: String },
    lastName: { type: String },
    username: { type: String },
    phone: { type: String },
    mobile: { type: String },
    secondaryPhone: { type: String },
    address: [
      {
        street: { type: String },
        number: Number,
        zipcode: Number,
        location: { type: String },
      },
    ],
    img: { type: String },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    owner: { type: Boolean, default: false },
    keeper: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
module.exports = User;
