const mongoose = require('mongoose');

const { Schema } = mongoose;
const eventSchema = new Schema(
  {
    owner: Schema.Types.ObjectId /* ObjectId<User> */,
    title: String,
    description: String,
    creationEventDate: Date.now(),
    initialDateTime: Date,
    finalDateTime: Date,
    location: {
      /* This is a copy owner adresss */
      address: {
        street: String,
        number: Number,
        zipcode: Number,
        city: String,
      },
      keeper: Schema.Types.ObjectId,
    }, /* [ObjectId]<User> */

  },
  {
    timestamps: true,
  },
);

const Event = mongoose('Event', eventSchema);
module.exports = Event;
