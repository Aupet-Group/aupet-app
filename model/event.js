const mongoose = require('mongoose');
const User = require('../model/user');
const Pet = require('../model/pet');

const { Schema } = mongoose;
const eventSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: User }, /* ObjectId<User> */
    title: { type: String },
    description: { type: String } ,
    creationEventDate: { type: Date, default: Date.now()},
    initialDateTime: Date,
    finalDateTime: Date,
    pet: [{ type: Schema.Types.ObjectId, ref: Pet }],
    address: {
        street: String,
        number: Number,
        zipcode: Number,
        location: String,
      },
    keeper: { type: Schema.Types.ObjectId, ref: User }, /* [ObjectId]<User> */

  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
