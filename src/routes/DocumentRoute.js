const router = require("express").Router();
const { fetchDoc, createDoc } = require("../middleware/document");
const { v4 } = require("uuid");

router.get("/", (req, res) => {
  res.redirect(`/document/new/${v4()}`);
});

router.get("/new", createDoc ,(req, res) => {
  res.redirect(`/document/${req.params.docid}`);
});

router.get(
  "/:id/", fetchDoc ,(req, res) => {
    if (req.params.docFound) {
      return res.render("document.html");
    } else {
      res.send("Could not find the document");;
    }
  }
);

module.exports = router;
