const router = require("express").Router();
const { createDoc, ensureDoc } = require("../middleware/doc");
const Document = require("../models/Document");

router.get("/new/:lang", createDoc, (req, res) => {
  res.redirect(`/document/${req.params.docid}`);
});

router.get("/:id/", ensureDoc, (req, res) => {
  Document.find(
    {
      _id: req.params.id,
    },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
      return res.render("document.html", {
        document: doc.length == 1 ? doc[0] : null,
      });
    }
  );
});

module.exports = router;
