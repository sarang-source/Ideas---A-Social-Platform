const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require('../models/user');



// Middlewares
router.use(express.urlencoded({ extended: true }));


router.get("/", (req, res) => {
    res.render("login")
})
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    console.log({ email, password });
    let users = await User.findOne({ email });

    if (!users) return res.redirect("signup");

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) return res.render("login", { email, message: "Incorrect Password" });

    const token = jwt.sign({ _id: users._id }, "thesecretisindeedasecret");

    res.cookie("token", token, {
        httpOnly: true, 
        // expires: new Date(Date.now() + 50 * 10000)
    });
    res.redirect("/feedup");
})

module.exports = router;