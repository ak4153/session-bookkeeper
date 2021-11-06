//models
const User = require("../models/user");

//middleware
// const { authenticateUser } = require("../middleware");
module.exports.showLoginPage =
  ("/login",
  (req, res) => {
    res.render("users/login");
  });

module.exports.postLogin =
  ("/login",
  async (req, res) => {
    req.flash("success", "wecome back");
    const returnTo = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(returnTo);
  });

module.exports.showRegisterPage =
  ("/register",
  (req, res) => {
    res.render("users/register");
  });

module.exports.postRegister =
  ("/register",
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        username: username,
        email: email,
      });
      const newUser = await User.register(user, password);
      req.login(newUser, (e) => {
        if (e) return res.send(e);
        req.flash("success", `user has been created`);
        res.redirect("/");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/users/register");
    }
  });

module.exports.postLogout =
  ("/logout",
  (req, res) => {
    req.logout();
    req.flash("success", "Successfuly loggedout");
    res.redirect("/");
  });
