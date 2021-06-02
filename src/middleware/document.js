const { connection } = require("../config/sharedb")
const { v4 } = require("uuid");

module.exports = {
  fetchDoc: (req, res, next) => {
    // var connection = backend.connect();
    const docid = req.params.id
    // const docid = "richtext"
    let doc = connection.get('examples', docid);
    doc.fetch(function(err) {
      if (err) throw err;
      if (doc.type === null) {
        req.params.docFound = false;
      } else {
        req.params.docFound = true;
      }
      next();
    });
  },
  createDoc: (req, res, next) => {
    const docid = v4();

    let doc = connection.get('examples', docid);
    doc.fetch(function(err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create([{insert: 'Hi!'}], 'rich-text');
        //res.status(404).send(`No document with id ${docid} was found`);
        req.params.docid = docid; 
      }
      else {
        console.log("Document was already created");
        return;
      }
      next();
    });
  }
}