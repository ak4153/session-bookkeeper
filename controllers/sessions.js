//models
const User = require("../models/user");
const Session = require("../models/session");
const { joiSessionSchema } = require("../schemas");

//functions
const { calculatePrice, returnAllSessions } = require("../prices");

module.exports.showMonths = (req, res) => {
  res.render("sessions/months");
};

module.exports.showSessionsPerMonth = async (req, res) => {
  const sessions = await Session.find({
    date: {
      $gte: `${req.params.year}-${req.params.month}-01`,
      $lte: `${req.params.year}-${req.params.month}-31`,
    },
    owner: req.user,
  });
  res.render("sessions/sessions", { sessions });
};

module.exports.showAddSessionPage = (req, res) => {
  const allSessions = returnAllSessions();
  console.log(allSessions);
  res.render("sessions/add", { allSessions });
};

module.exports.addSession = async (req, res) => {
  var count = 0;
  console.log(req.body.session);
  if (typeof req.body.session.name === "object") {
    const { name, date } = req.body.session;

    req.body.session.name.forEach(async (ses) => {
      count = count + 1;
      const pricedSession = calculatePrice(ses);
      const { price } = pricedSession;
      const session = new Session({
        name: ses,
        price: price,
        date: date,
        owner: req.user,
      });
      await session.save();
    });
  }
  if (typeof req.body.session.name === "string") {
    const { name, date } = req.body.session;
    const pricedSession = calculatePrice(name);
    const { price } = pricedSession;

    const session = new Session({
      name: name,
      price: price,
      date: date,
      owner: req.user,
    });
    await session.save();
    count = count + 1;
  }
  console.log(count);
  req.flash("success", `${count} Session(s) added`);
  res.redirect("/sessions/months");
};

module.exports.deleteSession = async (req, res) => {
  const returnTo = req.originalUrl;
  console.log(returnTo);
  await Session.findByIdAndRemove(req.params.sessionId);
  req.flash("success", "Session has been removed");
  res.redirect(`/sessions/months/${req.params.month}/${req.params.year}`);
};
