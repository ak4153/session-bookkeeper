//models
const User = require("../models/user");

const passport = require("passport");

//controller
const usersController = require("../controllers/users");

//middleware
const { blockLoggedIn } = require("../middleware");

const express = require("express");
const router = express.Router();

router.get("/logout", usersController.postLogout);

router
  .route("/login")
  .get(blockLoggedIn, usersController.showLoginPage)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    usersController.postLogin
  );

router
  .route("/register")
  .get(blockLoggedIn, usersController.showRegisterPage)
  .post(usersController.postRegister);

module.exports = router;
