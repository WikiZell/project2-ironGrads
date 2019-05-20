
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const teachersSchema = new Schema({
    email: { type: String },
    password: { type: String },
    fullname: { type: String },
    surname: { type: String },
    subject: { type: String },
    profile_image: {type: String},
    position: {type: String},
    role: {type: String},
    reviews_ids: [{type: mongoose.Schema.Types.ObjectId, ref:"reviews"}]
  }, { versionKey: false })

module.exports = mongoose.model('teachers', teachersSchema);