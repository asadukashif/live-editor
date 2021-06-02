const ShareDB = require("sharedb");

ShareDB.types.register(require("rich-text").type);

let mongodb = require("sharedb-mongo")(
  "mongodb+srv://saad:pass12345@cluster0.xbvk9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

let backend = new ShareDB({ db: mongodb });

let connection = backend.connect();

module.exports.connection = connection;
module.exports.backend = backend;
