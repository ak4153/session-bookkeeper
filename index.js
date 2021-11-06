if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const dotEnv = require("dotenv");
const MongoDBStore = require("connect-mongo");

//ENV
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/ses";
const secret = process.env.SECRET || "secret";
//middleware

//models
const User = require("./models/user");
const Session = require("./models/session");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const port = process.env.PORT || 3000;

//set express to app
const app = express();

//engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

//statics
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/views/partials")));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/utils")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//mongosanitizer
app.use(mongoSanitize());

//flash session
const sessionOptions = {
  //store for mongo-connect > storing session cookies inside DB
  store: MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    collectionName: "SESSION_S",
  }),
  name: "SESSION_SS",
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    //will not be accessible from javascript Cross attack
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(flash());
app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//has to be defined after passport initialization
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//morgan status reporter
app.use(morgan("tiny"));

//routers
const sessionRouter = require("./routes/sessions");
app.use("/sessions", sessionRouter);
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

//routes
app.get("/", (req, res, next) => {
  try {
    res.render("home");
  } catch (err) {
    res.render("error", { errorTitle: err });
  }
});

//db
//"mongodb+srv://newuser:36987410@cluster0.3p3rz.mongodb.net/ses?retryWrites=true&w=majority"
const db = mongoose
  .connect(
    // "mongodb://127.0.0.1:27017/ses",
    dbUrl,
    { useNewUrlParser: true },
    { useCreateIndex: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(function (req, res, next) {
  res.status(404).render("error", { errorTitle: "No such page" });
});

app.use(function (err, req, res, next) {
  res.status(500).render("error", { errorTitle: err });
});

app.listen(port, () => {
  console.log("Listening on:" + port);
});
