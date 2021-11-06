const Joi = require("joi");
const { joiSessionSchema } = require("./schemas");

module.exports.ensureLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signed-in");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.blockLoggedIn = (req, res, next) => {
  var flag = false;
  if (req.path === "/login") flag = true;
  if (req.path === "/register") flag = true;
  if (req.isAuthenticated() && req.path === "/login" && flag) {
    req.flash("error", "Already Logged-in");
    return res.redirect("/");
  }
  next();
};

module.exports.validateSession = (req, res, next) => {
  const { error } = joiSessionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new Error(msg);
    // return console.log(msg);
  } else next();
};

module.exports.asyncWrapper = function (func) {
  return function (req, res, next) {
    func(req, res, next).catch(next);
  };
};
