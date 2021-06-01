const router = require("express").Router();
const { fetchCreateDoc } = require("../middleware/document");
const { v4 } = require("uuid");

router.get("/", (req, res) => {
  res.redirect(`/document/${v4()}`);
});

router.get("/new", (req, res) => {
  res.render("document_new", {
    user: req.user,
  });
});

// // Create initial document then fire callback
// function createDoc(docid) {
//   // var connection = backend.connect();
//   var doc = connection.get('examples', docid);
//   doc.fetch(function(err) {
//     if (err) throw err;
//     if (doc.type === null) {
//       doc.create([{insert: 'Hi!'}], 'rich-text');
//       return;
//     }
//   });
// }

router.get(
  "/:id/", fetchCreateDoc ,(req, res) => {
    res.render("document.html");
  }
);

module.exports = router;
