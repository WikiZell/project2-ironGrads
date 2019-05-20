const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const UsersDB = require("../models/users")
const TeachersDB = require("../models/teachers")
const multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    }
  })
const upload = multer({ storage: storage })


app.get("/user/detail", (req, res) => {
    
    let studentId = mongoose.Types.ObjectId(req.query.id);
    UsersDB.find({ _id: studentId })
      .select(["-password"])
      .populate({
        path: "reviews_ids",
        populate: { path: "teacher_id" }
      })
      .then(student => {
        student = student[0];

        let contacts = {
          homepage_link: student.homepage_link,
          phone_number: student.phone_number,
          email_contact: student.email_contact,
          facebook_link: student.facebook_link,
          github_link: student.github_link,
          linkedin_link: student.linkedin_link
        };
        
        res.render("user_details", {
          title: `Profile - ${student.fullname} ${student.surname}`,
          student: student,
          contacts: contacts,
          reviews: student.reviews_ids
        });
      });
});


app.get("/user/edit", (req, res) => {
    res.render("edit_profile", { title: `Edit Profile - ${req.session.currentUser.fullname} ${req.session.currentUser.surname}`, "student": req.session.currentUser}); 
});


// update-profile
app.get("/user/update-profile", async (req, res) => {
    
    

      let updateStudent = {
            github_link: req.query.github_link,
            facebook_link: req.query.facebook_link,
            linkedin_link: req.query.linkedin_link,
            fullname: req.query.fullname,
            surname: req.query.surname,
            country: req.query.country,
            subject: req.query.subject,
            age: req.query.age,
            languages: req.query.languages,
            description: req.query.description,
            hompage_link: req.query.hompage_link,
            phone_number: req.query.phone_number,
            email_contact: req.query.email_contact
          }
        

        //console.log(updateStudent)
         let myId = mongoose.Types.ObjectId(req.session.currentUser._id);
         

        try {
            await UsersDB.findOneAndUpdate({_id: myId},updateStudent,{new:true,useFindAndModify:false}, (err, result) => {
                
                let newResult = JSON.parse(JSON.stringify(result))
                delete newResult.password;

                req.session.currentUser = result;

                res.status(200).json({"status":"success","message":"Profile updated!"})           
            })
          } catch (err) {

            res.status(500).json({"status":"error","message":"Server Error"})
          }

});

/* Toggle Visibility to current user */
app.get("/user/toggle-visibility", async (req, res) => {
    
       let myId = mongoose.Types.ObjectId(req.session.currentUser._id),
           isVisible;

           isVisible = (req.query.visible == "true") ? "false" : "true"

        

      try {
          await UsersDB.findOneAndUpdate({_id: myId},{ "visible" : isVisible },{new:true,useFindAndModify:false}, (err, result) => {

            req.session.currentUser = result;
            res.status(200).send(result)           
          })
        } catch (err) {

          res.status(500).send(err)
        }

});


/* /user/update-login */
app.post("/user/update-login", async (req, res, next) => {

    let myId = mongoose.Types.ObjectId(req.session.currentUser._id);

    let updateUser = {
        email: req.body.email,
        password: req.body.password,
        new_password: req.body.new_password
        }
        
    UsersDB.find({ email: req.body.email })
    .then((user) => {
      
            if (user.length > 0) {              
                //Username available -> compare old password
                //User found proceed with authentication
                bcrypt.compare(updateUser.password, req.session.currentUser.password, function(err, equal) {                    
                    if(equal) {                        
                        //Password match
                        //update with new password
                        
                        bcrypt.hash(updateUser.new_password, 10, function (err, new_password_hashed) {
                            // Store hash in your password DB.
                            if (err) throw new Error("hashing error")
                            try {
                                UsersDB.updateOne({ _id: myId },{ $set: { "password" : new_password_hashed } }, (err,result) => {
                                if(err){
                                    return next(err)
                                  }
                                  req.session.currentUser.password = new_password_hashed;
                                  res.status(200).json({"status":"success","message":"Credentials Updated"})
                                    });                                
                             } catch (err) {
                                res.status(200).json({"status":"error","message":"Server Error"})
                             }
                        });                       
                        
                    }else{                        
                        res.status(200).json({"status":"error","message":"Invalid password"}) 
                    }
                })

            }else{
              res.status(200).json({"status":"error","message":"An error occured"}) 
            }
        })
        .catch((err) => {
            res.status(500).json({"status":"error","message":"An error occured"})
        })
})

/* upload photo /user/change-profile-image */

app.post("/user/change-profile-image",upload.single('profile_image'), async (req, res, next) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    if(req.session.currentUser.role == "staff"){
        /* Staff upload */
        let myId = mongoose.Types.ObjectId(req.session.currentUser._id);
        try {
            await TeachersDB.findOneAndUpdate({_id: myId},{ "profile_image" : req.file.path },{new:true,useFindAndModify:false}, (err, result) => {
                
            let newResult = JSON.parse(JSON.stringify(result));
            delete newResult.password;
            req.session.currentUser = result;
            res.status(200).send(newResult);           
            })
          } catch (err) {
  
            res.status(500).send(err)
          }

    }else{
        /* Student upload */
        let myId = mongoose.Types.ObjectId(req.session.currentUser._id);
        try {
            console.log(req.file)
            await UsersDB.findOneAndUpdate({_id: myId},{ "profile_image" : req.file.path },{new:true,useFindAndModify:false}, (err, result) => {
              let newResult = JSON.parse(JSON.stringify(result))
              delete newResult.password;
              req.session.currentUser = result;
              res.status(200).send(newResult)           
            })
          } catch (err) {
  
            res.status(500).send(err)
          }

    }



  })


module.exports = app