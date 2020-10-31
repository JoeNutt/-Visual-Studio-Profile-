// Vars Set 
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  User = require("./models/user");
//Mongoose Config
mongoose
  .connect("mongodb://localhost:27017/visual_studio_profile", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
//Passport Config
app.use(
    require("express-session")({
      secret: "2997",
      resave: false,
      saveUninitialized: false,
    })
  );
  // Method Override Config
  app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Flash Config 
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    app.locals.moment = require('moment');
    next();
  });
  // Router Config 
  app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// Port Config 
app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
