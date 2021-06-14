const { connection, collection } = require("../config/sharedb");
const { v4 } = require("uuid");
const { langMap } = require("../config/langMap");
const Document = require("../models/Document");

const langStart = {
  python: 'print("Hello World")',
  "node-js": 'console.log("Hello World");',
  cpp: '#include <iostream>\r\n\r\nclass Box\r\n{\r\n  int length, width;\r\n\r\npublic:\r\n  Box(int l, int w) : length(l), width(w)\r\n  {\r\n    std::cout << "Box has been created!" << std::endl;\r\n  }\r\n\r\n  int GetPerimeter()\r\n  {\r\n    return 2 * (length + width);\r\n  }\r\n\r\n  int GetArea()\r\n  {\r\n    return length * width;\r\n  }\r\n\r\n  ~Box()\r\n  {\r\n    std::cout << "Box has been destroyed!" << std::endl;\r\n  }\r\n};\r\n\r\nint main()\r\n{\r\n  Box b(12, 1);\r\n  std::cout << "Area: " << b.GetArea() << std::endl;\r\n  std::cout << "Perimeter: " << b.GetPerimeter() << std::endl;\r\n}\r\n',
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
      return res.send("We have not yet supported this language");
    }

    let doc = connection.get(collection, docid);

    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ content: langStart[lang] });
        if (req.user) {
          Document.create({
            _id: docid,
            owner: req.user.id,
            name: fileNames[Math.floor(Math.random() * fileNames.length)],
            language: lang,
          });
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
