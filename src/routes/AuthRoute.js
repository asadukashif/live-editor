const router = require("express").Router();
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc Authenticate with google
// @route GET /auth/google
router.get(
  "/google",
  ensureGuest,
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/google/callback",

  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/github/", ensureGuest, passport.authenticate("github"));

router.get(
  "/github/callback",
  ensureGuest,
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

// @desc Logout the user
// @route GET /auth/logout
router.get("/logout", ensureAuth, (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
