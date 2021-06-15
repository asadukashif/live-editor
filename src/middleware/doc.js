const { connection, collection } = require("../config/sharedb");
const { v4 } = require("uuid");
const { langMap } = require("../config/langMap");
const Document = require("../models/Document");

const langStart = {
  python: 'print("Hello World")',
  "node-js": 'console.log("Hello World");',
  cpp: '#include <iostream>\n\nint main(int argc, char** argv) {\n\tstd::cout << "Hello World" << std::endl;\n}',
};

const fileNames = [
  "managementradio",
  "luckygather",
  "sheetcoach",
  "passionexciting",
  "choicesect",
  "seriouslycoalition",
  "chocolatesnowboard",
  "violationseat",
  "bladepanicky",
  "oughtpure",
  "cabinscript",
  "chipsexual",
  "moremention",
  "chordcostarican",
  "fromscratch",
  "hourchuckle",
  "wirewedding",
  "proteinweight",
  "chancenether",
  "whomdunbird",
  "effectivemangoes",
  "executivetable",
  "wellimmigrant",
  "shortlykefir",
  "roadafternoon",
  "chinesefrail",
  "fasthuddle",
  "pantyexpel",
  "paintauction",
  "majoritymutant",
  "regardlesscap",
  "babytamarin",
  "suicidetired",
  "springjowl",
  "quotawelfare",
  "treatmentimmodest",
  "anticipatepingpong",
  "loverpitcher",
  "tunnelrosary",
  "cultblueeyed",
  "campusarray",
  "bitmat",
  "addressdivvy",
  "preferencemission",
  "promotebullocks",
  "somewhereerror",
  "naturallyprime",
  "diverselazuli",
  "problemshrewdness",
  "englishcrave",
];

module.exports = {
  ensureDoc: (req, res, next) => {
    const docid = req.params.id;
    let doc = connection.get(collection, docid);

    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        return res.send("This document was not found");
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
      return res.send("We have not yet supported this language");
    }

    let doc = connection.get(collection, docid);

    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ content: langStart[lang] });
        Document.create({
          _id: docid,
          owner: req.user ? req.user.id : "guest",
          name: fileNames[Math.floor(Math.random() * fileNames.length)],
          language: lang,
        });

        req.params.docid = docid;
      } else {
        console.log("Document was already created");
        return;
      }
      next();
    });
  },
};
