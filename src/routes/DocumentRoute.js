const router = require("express").Router();
const { v4 } = require("uuid");

router.get("/", (req, res) => {
  res.redirect(`/document/new/${v4()}`);
});

router.get("/getting-started", (req, res) => {
  res.render("document_new.html", {
    user: req.user,
  });
});

router.get("new/:id/", (req, res) => {
  res.render("document.html");
});

module.exports = router;
