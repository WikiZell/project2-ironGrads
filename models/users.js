
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema({
    email: { type: String },
    password: { type: String },
    github_link: {type: String },
    facebook_link: {type: String},
    linkedin_link: {type: String},
    fullname: {type: String},
    surname: {type: String},
    country: {type: String},
    subject: {type: String},
    age: {type: Number},
    languages: {type: Array},
    description: {type: String},
    profle_image: {type: String},
    hompage_link: {type: String},
    phone_number: {type: String},
    email_contact: {type: String},
    reviews_ids: [{type: mongoose.Schema.Types.ObjectId, ref:"reviews"}]
  }, { versionKey: false })

module.exports = mongoose.model('users', usersSchema);