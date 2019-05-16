const express = require("express")
const app = express()

const UsersDB = require("../models/users")


app.get("/users", (req, res) => {

  UsersDB.find({})
    .then((students) => {
      res.render("users_list", {title:"IronGrads - Grads", students: students });
    })
  });

module.exports = app