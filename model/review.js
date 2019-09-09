const mongoose = require('mongoose');
const User = require('../model/user');

const { Schema } = mongoose;
const reviewSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: User } /* ObjectId<User> */,
    event: { type: Schema.Types.ObjectId, ref: Event } /* ObjectId<Event> */,
    rating: Number /* “⭐” */,
    comment: { type: String },
    keeper: { type: Schema.Types.ObjectId, ref: User }, /* ObjectId<User> */
  },
  {
    timestamps: true,
  },
);

const Review = mongoose('Review', reviewSchema);
module.exports = Review;
