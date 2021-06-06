const { connection } = require("../config/sharedb");
const { v4 } = require("uuid");
const { langMap } = require("../config/langMap")
const Document = require("../models/Document")


module.exports = {
  ensureDoc: (req, res, next) => {
    const docid = req.params.id;
    let doc = connection.get("docs", docid);

    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        req.params.docFound = false;
        
      } else {
        doc.language = "python";
        req.params.docFound = true;
      }
      next();
    });
  },
  
  createDoc: (req, res, next) => {
    const lang = req.params.lang;
    let docid;

    for (let langId in langMap) {
      if (langMap[langId] == lang) {
        docid = langId + "-" + v4();
      }
    }
    if (!docid) {
      return res.send("We have not yet supported this language")
    }

    let doc = connection.get("docs", docid);

    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ content: "Type something ..." });
        if (req.user) {
          console.log("User was present");
          console.log(req.user);
          Document.create({
            _id: docid,
            owner: req.user.id,
            name: "Untitled",
            language: lang,
          })
        }
        req.params.docid = docid;
      } else {
        console.log("Document was already created");
        return;
      }
      next();
    });
  },
};
