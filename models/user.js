const mongoose = require("mongoose");

// Mongoose
mongoose.connect("mongodb://localhost:27017", {
    dbName: "Ideas",
}).then(() => console.log("Database connected"))
    .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
    name: Object,
    gender: String,
    dob: String,
    email: String,
    password: String,
})

const User = mongoose.model("User", userSchema)
module.exports = User