const express = require("express")
const app = express()
const mongoose = require("mongoose")

const UsersDB = require("../models/users")


app.get("/user/detail", (req, res) => {
    
    let studentId = mongoose.Types.ObjectId(req.query.id);
    UsersDB.find({ _id: studentId }).select(["-password"])
        .then((student) => {
            
            console.log(student)
            /* res.render("users_list", { title: "IronGrads - Grads", students: students }); */
        })
});

module.exports = app