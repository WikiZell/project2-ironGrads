const express = require("express")
const app = express()
const mongoose = require("mongoose")

const bcrypt = require('bcrypt');
const UsersDB = require("../models/users")
const TeachersDB = require("../models/teachers")

app.get("/auth", (req, res) => {
    res.render("auth",{title:"IronGrads - Account",layout: "main_no_nav_layout"});
  });

app.post("/auth/student-login", (req, res) => {
  //console.log("student-login",req.body)
  UsersDB.find({ email: req.body.email })
        .then((user) => {
            if (user.length == 0) {
                //No user in database
                res.status(200).send({status:"error",message:"User not registerd"})            
            } else {
                //User found proceed with authentication
                bcrypt.compare(req.body.password, user[0].password, function(err, equal) {
                    if(equal) {
                        //Password match
                        delete user[0].password
                        req.session.currentUser = user[0];
                        res.status(200).send({status:"success",message:"Logged in!"})
                    }else{
                        res.status(200).send({status:"error",message:"Invalid credentials"}) 
                    }
                })
                
            }
        })
        .catch((err) => {
            res.status(500).send({status:"error",message:"An error occured"})
        })
    
  });

app.post("/auth/student-signup", async (req, res) => {
  
  let newStudent = new UsersDB({
    email: req.body.email,
    password: req.body.password,
    github_link: req.body.github_link,
    facebook_link: req.body.facebook_link,
    linkedin_link: req.body.linkedin_link,
    fullname: req.body.fullname,
    surname: req.body.surname,
    country: req.body.country,
    subject: req.body.subject,
    age: req.body.age,
    languages: req.body.languages,
    description: req.body.description,
    profile_image: req.body.profile_image || "/assets/images/profile-picture-placeholder.png",
    hompage_link: req.body.hompage_link,
    phone_number: req.body.phone_number,
    email_contact: req.body.email_contact,
    role: "student",
    visible: "true"
  }, { versionKey: false })

  
  try {

    await UsersDB.find({ email: req.body.email }, (err, user) => {
      if (user.length > 0) {
        res.status(200).send({ status: "error", message: "User Already Exists" })
      } else {
        bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
          // Store hash in your password DB.
          if (err) throw new Error("hashing error")
          else {
            newStudent.password = hashedPassword
            UsersDB.create(newStudent)
              .then((user) => {
                res.status(200).send({ status: "success", message: "User Created" })
              })
          }
        });
      }
    })
  } catch (err) {
      res.status(500).send({status:"error",message:"An error occured"})
  }
    
  });

app.post("/auth/teacher-login", (req, res) => {
  //console.log("teacher-login",req.body)
  TeachersDB.find({ email: req.body.email })
        .then((user) => {
            if (user.length == 0) {
                //No user in database
                res.status(200).send({status:"error",message:"User not registerd"})            
            } else {
                //User found proceed with authentication
                bcrypt.compare(req.body.password, user[0].password, function(err, equal) {
                    if(equal) {
                        //Password match
                        delete user[0].password
                        req.session.currentUser = user[0];
                        res.status(200).send({status:"success",message:"Logged in!"})
                    }else{
                        res.status(200).send({status:"error",message:"Invalid credentials"}) 
                    }
                })
                
            }
        })
        .catch((err) => {
            res.status(500).send({status:"error",message:"An error occured"})
        })
    
  });

app.post("/auth/teacher-signup", async (req, res) => {
  
  let newTeacher = new TeachersDB({
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.fullname,
    surname: req.body.surname,
    subject: req.body.subject,
    profile_image: req.body.profile_image || "/assets/images/profile-picture-placeholder.png",
    position: req.body.position,
    role: "staff"
  }, { versionKey: false })
  
  try {

    await TeachersDB.find({ email: req.body.email }, (err, user) => {
      if (user.length > 0) {
        res.status(200).send({ status: "error", message: "User Already Exists" })
      } else {
        bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
          // Store hash in your password DB.
          if (err) throw new Error("hashing error")
          else {
            newTeacher.password = hashedPassword
            TeachersDB.create(newTeacher)
              .then((user) => {
                res.status(200).send({ status: "success", message: "User Created" })
              })
          }
        });
      }
    })
  } catch (err) {
      res.status(500).send({status:"error",message:"An error occured"})
  }
  

})






module.exports = app