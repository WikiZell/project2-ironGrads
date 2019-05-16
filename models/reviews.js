const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewsSchema = new Schema({
    review: { type: String },
    teacher_id: {type: mongoose.Schema.Types.ObjectId, ref:"teachers"},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:"users"}
  }, { versionKey: false })

module.exports = mongoose.model('reviews', reviewsSchema);