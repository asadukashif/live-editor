const ShareDB = require("sharedb");
require("dotenv").config();

const collection = "docs";

ShareDB.types.register(require("rich-text").type);

let mongodb = require("sharedb-mongo")(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let backend = new ShareDB({ db: mongodb });

let connection = backend.connect();

module.exports.connection = connection;
module.exports.backend = backend;
module.exports.collection = collection;
