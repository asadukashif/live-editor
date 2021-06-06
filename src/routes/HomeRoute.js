const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth")
const Document = require("../models/Document")

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("home.html");
});

router.get("/user/:id", ensureAuth, (req, res) => {
  if (req.user != req.params.id) {
    return res.send("You are not allowed to view this page")
  }
  
  Document.find({
    owner: req.params.id,
  }, (err, docs) => {
    console.log(err);
    console.log(docs);
  })

  res.render("document_new.html")
})

module.exports = router;
