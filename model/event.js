const mongoose = require('mongoose');
const User = require('../model/user');
const Pet = require('../model/pet');

const { Schema } = mongoose;
const eventSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: User },
    title: { type: String },
    description: { type: String },
    creationEventDate: { type: Date, default: Date.now },
    initialDateTime: Date,
    start: String,
    finalDateTime: Date,
    end: String,
    pet: [{ type: Schema.Types.ObjectId, ref: Pet }],
    petType: String,
    address: {
      street: String,
      number: Number,
      zipcode: Number,
      location: String,
    },
    candidates: [{ type: Schema.Types.ObjectId, ref: User }],
    enrolled: { type: Boolean, default: undefined },
    keeper: { type: Schema.Types.ObjectId, ref: User },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
