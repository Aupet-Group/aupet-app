const mongoose = require('mongoose');

const { Schema } = mongoose;
const petSchema = new Schema({
  owner: Schema.Types.ObjectId, /* ObjectId<User>  */
  petType: String,
  petWeight: Number,
  petName: String,
  petAge: Number,
  petImg: [String],
  event: Schema.Types.ObjectId, /* ObjectId<Event>}, */
},
{
  timestamps: true,
});

const Pet = mongoose('Pet', petSchema);
module.exports = Pet;
