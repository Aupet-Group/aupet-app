const mongoose = require('mongoose');
const User = require('../model/user');

const { Schema } = mongoose;
const petSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: User }, /* ObjectId<User> the owner */
  petType: { type: String },
  petWeight: Number,
  petName: { type: String },
  petAge: Number,
  petImg: [{ type: String }],
},
{
  timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
