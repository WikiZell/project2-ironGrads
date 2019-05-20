const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const UsersDB = require("../models/users")
const TeachersDB = require("../models/teachers")
const ReviewsDB = require("../models/reviews")

app.get("/staff/edit", (req, res) => {
    res.render("./staff/edit_profile", { title: `Edit Profile - ${req.session.currentUser.fullname} ${req.session.currentUser.surname}`, "staff": req.session.currentUser});
});

app.get("/staff/grades-reviews", async (req, res) => {
  UsersDB.find({}).then(students => {
    res.render("./staff/grades_reviews", {
        title: `Grades & Reviews`,
        students: students,
        layout: false
      })
  });
});

app.get("/staff/modal-user-detail", (req, res) => {
    
    let myId = mongoose.Types.ObjectId(req.session.currentUser._id);
    let studentId = mongoose.Types.ObjectId(req.query.id);

    UsersDB.find({ _id: studentId })
      .select(["-password"])
      .populate({
        path: "reviews_ids",
        populate: [{
          path: "teacher_id",
          match: { _id: myId },
          select: "-password"
        },{
        path: "user_id",
        match: { _id: studentId },
        select: "-password"}
    ]
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

        res.render("./staff/modal_user_details", {
          title: `Profile - ${student.fullname} ${student.surname}`,
          student: student,
          contacts: contacts,
          reviews: student.reviews_ids[0],
          layout: false
        });
      });
});

app.get("/staff/add-review", async (req, res, next) => {

    let studentId = mongoose.Types.ObjectId(req.query.student_id),
        teacherId = mongoose.Types.ObjectId(req.query.teacher_id),
        reviewId = (req.query.review_id) ? mongoose.Types.ObjectId(req.query.review_id) : null;

    if (!reviewId) {
        /* New Review */
        let newReview = new ReviewsDB(
            {
                review: req.query.new_review,
                teacher_id: teacherId,
                user_id: studentId
            },
            { versionKey: false }
        );

        try {
            await ReviewsDB.create(newReview, (err, response) => {
                if(err){
                    return next(err)
                }

                UsersDB.findOneAndUpdate({ _id: studentId }, {$addToSet: { reviews_ids: newReview._id } }, { new: true, useFindAndModify: false }, (err, res) => {
                    if(err){
                      return next(err)
                    }
                  })

                /* let newResult = JSON.parse(JSON.stringify(response)); */
                res.status(200).json({ status: "success", message: "Review Created!", data: response});
            });

        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
        }
    } else {
        /* Update review */
        try {
            await ReviewsDB.findOneAndUpdate(
                { _id: reviewId },
                { review: req.query.new_review },
                { new: true, useFindAndModify: false },
                (err, result) => {
                    let newResult = JSON.parse(JSON.stringify(result));
                    res.status(200).json({ status: "success", message: "Review Updated!" });
                }
            );
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
        }
    }
});

/* Delete review */
app.get("/staff/remove-review", async (req, res, next) => {

    let studentId = mongoose.Types.ObjectId(req.query.student_id),
        teacherId = mongoose.Types.ObjectId(req.query.teacher_id),
        reviewId = (req.query.review_id) ? mongoose.Types.ObjectId(req.query.review_id) : null;

    if (reviewId) {        
        try {
            await ReviewsDB.deleteOne({ _id: reviewId }, (err, response) => {
                if(err){
                    return next(err)
                }

                UsersDB.findOneAndUpdate({ _id: studentId }, {$pull: { reviews_ids: reviewId } }, { new: true, useFindAndModify: false }, (err, res) => {
                    if(err){
                      return next(err)
                    }
                  })

                
                res.status(200).json({ status: "success", message: "Review Removed!", data: response});
            });

        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
        }
    } else{
        res.status(500).json({ status: "error", message: "Server Error" });
    }

});


/* /user/update-login */
app.post("/staff/update-login", async (req, res, next) => {

    let myId = mongoose.Types.ObjectId(req.session.currentUser._id);

    let updateUser = {
        email: req.body.email,
        password: req.body.password,
        new_password: req.body.new_password
        }

    TeachersDB.find({ email: req.body.email })
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
                                TeachersDB.updateOne({ _id: myId },{ $set: { "password" : new_password_hashed } }, (err,result) => {
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

            }
        })
        .catch((err) => {
            res.status(500).json({"status":"error","message":"An error occured"})
        })



})

// update-profile
app.get("/staff/update-profile", async (req, res) => {
    
    

    let updateStaff = {          
          fullname: req.query.fullname,
          surname: req.query.surname,
          subject: req.query.subject,          
          languages: req.query.position
        }
      

      //console.log(updateStudent)
       let myId = mongoose.Types.ObjectId(req.session.currentUser._id);
       

      try {
          await TeachersDB.findOneAndUpdate({_id: myId},updateStaff,{new:true,useFindAndModify:false}, (err, result) => {
              
              let newResult = JSON.parse(JSON.stringify(result))
              delete newResult.password;

              req.session.currentUser = result;

              res.status(200).json({"status":"success","message":"Profile updated!"})           
          })
        } catch (err) {
          res.status(500).json({"status":"error","message":"Server Error"})
        }

});

module.exports = app