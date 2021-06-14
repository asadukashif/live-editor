const router = require("express").Router();
const { createDoc } = require("../middleware/doc");
const Document = require("../models/Document")

router.get("/new/:lang", createDoc, (req, res) => {
  res.redirect(`/document/${req.params.docid}`);
});

router.get("/:id/", (req, res) => {
  Document.find(
    {
      _id: req.params.id,
    },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
      if (doc.length != 1) {
        return res.send("The document does not exist");
      }
      return res.render("document.html", {
        document: doc[0],
      });
    }
  );
});

module.exports = router;
