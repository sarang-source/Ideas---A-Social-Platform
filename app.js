const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const server = require("http").createServer(app);
const io = require("socket.io")(server);

module.exports = io



// Routes
const { blog } = require("./routes/feedup");
app.use("/feedup",blog);
const login = require("./routes/login");
app.use("/login",login);
const signup = require("./routes/signup");
app.use("/signup",signup);
const profile = require("./routes/profile");
app.use("/profile",profile);



// Middlewares
app.use(express.static("public"));



// Ejs
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));

// Endpoints
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/about", (req, res) => {
    res.render("index")
})
app.get("/contact", (req, res) => {
    res.render("index")
})
app.get("/portfolio-sarang",(req,res)=>{
    res.render("portfolio-sarang")
})
app.get("/portfolio-nikhil",(req,res)=>{
    res.render("portfolio-nikhil")
})
app.get("/portfolio-sanskar",(req,res)=>{
    res.render("portfolio-sanskar")
})


// app.get("/login", (req, res) => {
//     res.render("login")
// })
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     console.log({ email, password });
//     let users = await User.findOne({ email });

//     if (!users) return res.redirect("signup");

//     const isMatch = await bcrypt.compare(password, users.password);

//     if (!isMatch) return res.render("login", { email, message: "Incorrect Password" });

//     const token = jwt.sign({ _id: users._id }, "thesecretisindeedasecret");

//     exports.users = users;

//     res.cookie("token", token, {
//         httpOnly: true, expires: new Date(Date.now() + 50 * 10000)
//     });
//     res.redirect("/feedup");
// })

// app.get("/feedup", isAuthenticated, (req, res) => {
//     res.render("feedup");
// });

// app.get("/logout", (req, res) => {
//     res.cookie("token", null, {
//         httpOnly: true,
//         expires: new Date(Date.now())
//     });
//     res.redirect("/");
// });

// app.get("/signup", (req, res) => {
//     res.render("signup")
// })
// app.post("/signup", async (req, res) => {

//     const { first_name, last_name, gender, dob, email, password } = req.body;

//     let users = await User.findOne({ email })
//     if (users) {
//         return res.redirect("/login");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     users = await User.create({
//         name: { first_name, last_name },
//         gender,
//         dob,
//         email,
//         password: hashedPassword,
//     })

//     notifier.notify({
//         title: "Signed Up",
//         message: "You are Signed Up. Please login to Ideas"
//     })

//     res.redirect("/login")
// })


// Start the Server
server.listen(port, () => {
    // console.log(`Server started sucesfully at port ${port}`)
    console.log(`Server started sucesfully at  http://localhost:3000`);
})