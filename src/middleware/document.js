const { connection } = require("../config/sharedb");
const { v4 } = require("uuid");

module.exports = {
  ensureDoc: (req, res, next) => {
    const docid = req.params.id;
    let doc = connection.get("docs", docid);

    doc.fetch(function (err) {
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
    let doc = connection.get("docs", docid);
    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ content: "Type something ..." });
        req.params.docid = docid;
      } else {
        console.log("Document was already created");
        return;
      }
      next();
    });
  },
};
