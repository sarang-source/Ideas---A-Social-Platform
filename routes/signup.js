const express = require('express');
const router = express.Router();
const notifier = require("node-notifier");
const bcrypt = require("bcrypt");


// const mongoose = require("mongoose");
const User = require('../models/user');

// Middlewares
router.use(express.urlencoded({ extended: true }));


router.get("/", (req, res) => {
    res.render("signup")
})
router.post("/", async (req, res) => {

    const { first_name, last_name, gender, dob, email, password } = req.body;

    let users = await User.findOne({ email })
    if (users) {
        notifier.notify({
            title: "User Already Exists",
            message: "You are now redirected to login page."
        })
        return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    users = await User.create({
        name: { first_name, last_name },
        gender,
        dob,
        email,
        password: hashedPassword,
    })

    notifier.notify({
        title: "Signed Up",
        message: "You are Signed Up. You are now redirected to login page."
    })

    res.redirect("/login")
})


module.exports = router;