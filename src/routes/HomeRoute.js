const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth");
const Document = require("../models/Document");

router.get("/", (req, res) => {
  res.render("home.html");
});

router.get("/users/:id", ensureAuth, (req, res) => {
  if (req.user._id != req.params.id) {
    return res.send("You are not allowed to view this page");
  }

  Document.find(
    {
      owner: req.params.id,
    },
    (err, docs) => {
      if (err) {
        return res.send(
          "We are facing some technical issues! Apologies for any inconvience"
        );
      }
      return res.render("user_profile.html", {
        documents: docs,
      });
    }
  );
});

module.exports = router;
