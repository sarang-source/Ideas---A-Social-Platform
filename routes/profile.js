const express =require('express');
const User = require('../models/user');
const { isAuthenticated } = require('./feedup');
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// Middlewares
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));


// Endpoint
router.get("/",isAuthenticated, (req,res)=>{
    let user = req.user;
    let name = user.name;
    res.render("profile", { first_name: name.first_name, last_name: name.last_name, email: user.email, dob: user.dob , gender: user.gender});
})
router.post("/name",isAuthenticated, async(req,res)=>{
    const {first_name, last_name } = req.body;
    if(first_name.length >= 1 && last_name.length >= 1){
        const user = await User.findByIdAndUpdate(req.user.id,({
            name: {first_name, last_name},
        }))
        return res.render("profile",{ first_name: req.user.name.first_name, last_name: req.user.name.last_name, email: req.user.email, dob: req.user.dob , gender: req.user.gender, alert:"Updated" });
    }
    else{
        res.render("profile",{ first_name: req.user.name.first_name, last_name: req.user.name.last_name, email: req.user.email, dob: req.user.dob , gender: req.user.gender, alert:"* Don't leave space empty" })
    }
})
router.post("/gender",isAuthenticated, async (req,res)=>{
    const { gender } = req.body;
    let user = await User.findByIdAndUpdate(req.user.id,({
        gender: gender,
    }));
    res.render("profile",{ first_name: req.user.name.first_name, last_name: req.user.name.last_name, email: req.user.email, dob: req.user.dob , gender: req.user.gender, gender_alert: "Updated Successfully"});
})
router.post("/password",isAuthenticated, async (req,res)=>{
    const { password, newpassword } = req.body;
    const isMatch = await bcrypt.compare(password,req.user.password);
    if(!isMatch) return res.render("profile",{first_name: req.user.name.first_name, last_name: req.user.name.last_name, email: req.user.email, dob: req.user.dob , gender: req.user.gender, pass_alert:"* Old password didn't match"});
    else if (password != newpassword){
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await User.findByIdAndUpdate(req.user.id,({
                password: hashedPassword,
            }))
            return res.render("profile",{first_name: req.user.name.first_name, last_name: req.user.name.last_name, email: req.user.email, dob: req.user.dob , gender: req.user.gender, pass_alert: "Updated Successfully"});
        }
    res.render("profile",{ first_name: req.user.name.first_name, last_name: req.user.name.last_name, email: req.user.email, dob: req.user.dob , gender: req.user.gender, pass_alert: "*New password is same as Old Password"})
})


module.exports = router;