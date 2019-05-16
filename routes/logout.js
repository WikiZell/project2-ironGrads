const express = require("express")
const app = express()

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        //res.clearCookie("loggedIn")
        if (err) res.redirect("/")
        else res.redirect("/")
    })
});

module.exports = app