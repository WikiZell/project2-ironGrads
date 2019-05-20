
require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const helpers = require('./public/lib/helpers');
const mongoose = require("mongoose")
const Schema = mongoose.Schema


const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

const bcrypt     = require("bcrypt");
const saltRounds = 10;

var app = express();


app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main_layout",    
    partialsDir: __dirname + "/views/partials/",
    helpers: helpers
  })
);



app.set("view engine", ".hbs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(process.env.DATABASE_CONNECT, {useNewUrlParser: true}, (err)=> {
    if(!err)console.log("connected to database")
    else console.log("ERROR: Can't connect to database", err)
})

app.use(session({
    secret: process.env.cookie_secret,
    cookie: { maxAge: 96000000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
}));

app.use("/", require("./routes/index"))
app.use("/", userInfo, require("./routes/users"))
app.use("/", userInfo, require("./routes/staff"))
app.use("/", userInfo, require("./routes/user"))
app.use("/", require("./routes/logout"))
app.use("/", require("./routes/auth"))

function userInfo(req, res, next) {

    res.locals.currentUser = req.session.currentUser;
  
  next()
}

app.listen(process.env.PORT, () => {
    console.log("listening");
  });
  