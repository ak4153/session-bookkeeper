const express = require("express");
const router = express.Router();
//controllers
const sessionsController = require("../controllers/sessions");

//middleware
const {
  ensureLoggedIn,
  validateSession,
  asyncWrapper,
} = require("../middleware");

router
  .route("/add")
  .get(ensureLoggedIn, sessionsController.showAddSessionPage)
  .post(
    ensureLoggedIn,
    validateSession,
    asyncWrapper(sessionsController.addSession)
  );

router.get("/months/", ensureLoggedIn, sessionsController.showMonths);

router.get(
  "/months/:month/:year",
  ensureLoggedIn,
  asyncWrapper(sessionsController.showSessionsPerMonth)
);

router.delete(
  "/months/:month/:year/:sessionId/delete",
  asyncWrapper(sessionsController.deleteSession)
);

module.exports = router;
