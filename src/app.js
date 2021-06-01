var http = require("http");
var richText = require("rich-text");
var WebSocket = require("ws");
var WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const ShareDB = require("sharedb");
ShareDB.types.register(require("ot-text").type);
const { app, io } = require("./config/default");
const connectDB = require("./config/db");

// Connect to the database
connectDB();

var db = require("sharedb-mongo")(
  "mongodb+srv://saad:pass12345@cluster0.xbvk9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

ShareDB.types.register(richText.type);
var backend = new ShareDB({ db: db });

const router = require("express").Router();

router.get("/:id/", (req, res) => {
  createDoc("richtext");
  res.render("document.html");
});

app.use("/", require("./routes/HomeRoute"));
app.use("/document", router);
app.use("/auth", require("./routes/AuthRoute"));

// Create initial document then fire callback
function createDoc(docid) {
  var connection = backend.connect();
  var doc = connection.get("examples", docid);
  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{ insert: "Hi!" }], "rich-text");
      return;
    }
  });
}

var server = http.createServer(app);

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({ server: server });
wss.on("connection", function (ws) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

server.listen(8080);
console.log("Listening on http://localhost:8080");
