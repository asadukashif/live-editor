const router = require("express").Router();
const { ensureDoc, createDoc } = require("../middleware/doc");
const { v4 } = require("uuid");

router.get("/new/", (req, res) => {
  res.render("create_new.html");
});

router.get("/new/:lang", createDoc, (req, res) => {
  res.redirect(`/document/${req.params.docid}`);
});

router.get("/:id/", ensureDoc, (req, res) => {
  if (req.params.docFound) {
    return res.render("document.html");
  } else {
    return res.send("Could not find the document");
  }
});

module.exports = router;
