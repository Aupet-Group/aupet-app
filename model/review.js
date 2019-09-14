const mongoose = require('mongoose');
const User = require('../model/user');

const { Schema } = mongoose;
const reviewSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: User },
    event: { type: Schema.Types.ObjectId, ref: Event },
    rating: Number /* “⭐” */,
    comment: { type: String },
    keeper: { type: Schema.Types.ObjectId, ref: User },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
