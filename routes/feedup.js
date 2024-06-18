const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");



// const mongoose = require("mongoose");
const User = require('../models/user');
const io = require('../app');



// Middlewares
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));


const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token, "thesecretisindeedasecret")
        req.user = await User.findById(decoded._id)
        next();
    }
    else {
        res.redirect("login");
    }

}


const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})



// Endpoints
router.get("/",isAuthenticated, (req,res)=>{
    let user = req.user
    let name = user.name
    res.render("feedup", {first_name: name.first_name, last_name:name.last_name});
})

// Sends data to client
router.post("/fetch",isAuthenticated, (req,res)=>{
    // let userr = JSON.stringify(userData)
    let userData = req.user
    console.log(userData)
    res.send(userData)
})
router.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.redirect("/");
});


module.exports = {
    blog: router,
    isAuthenticated: isAuthenticated,
}