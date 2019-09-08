const mongoose = require('mongoose');

const { Schema } = mongoose;
const reviewSchema = new Schema(
  {
    owner: Schema.Types.ObjectId /* ObjectId<User> */,
    event: Schema.Types.ObjectId /* ObjectId<Event> */,
    rating: Number /* “⭐” */,
    comment: { type: String },
    keeper: Schema.Types.ObjectId, /* ObjectId<User> */
  },
  {
    timestamps: true,
  },
);

const Review = mongoose('Review', reviewSchema);
module.exports = Review;
