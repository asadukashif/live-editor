const ShareDB = require("sharedb");
ShareDB.types.register(require("ot-text").type);
const WebSocket = require("ws");
const WebSocketJSONStream = require("websocket-json-stream");
const { app, io } = require("./config/default");
const connectDB = require("./config/db");
const Document = require("./models/Document");
const http = require("http");

// Connect to the database
connectDB();
const router = require("express").Router();

router.get(
  "/:id/",
  (res, req, next) => {
    // Create the document if it hasn't been already
    // const sharedoc = shareconn.get('docs', res.query.doc || 'default')
    console.log("Going to get the document");
    const sharedoc = shareconn.get("docs", "saad_test"); // collection, id
    console.log("Passed getting the document");
    sharedoc.fetch(function(err) {
      if (err) throw err;
      if (sharedoc.type === null) {
        sharedoc.create([{insert: 'Hi!'}], 'text', callback);
        return;
      }
    });
    next();
  },
  (req, res) => {
    res.render("document.html");
  }
);

// router.get(
//   "/:id/",
//   (res, req, next) => {
//     // Create the document if it hasn't been already
//     // const sharedoc = shareconn.get('docs', res.query.doc || 'default')
//     console.log("Going to get the document");
//     const sharedoc = shareconn.get("docs", "saad_test"); // collection, id
//     console.log("Passed getting the document");
//     if (sharedoc.data == null) {
//       console.log("Going for creating the document");
//       try {
//         sharedoc.create("", "text");
//         console.log("Successfully created the document");
//       } catch (err) {
//         console.log("Could Not create document!!");
//         const sc = shareconn.get("docs", "saad_test");
//         console.log(sc.data);
//       }
//     }
//     next();
//   },
//   (req, res) => {
//     res.render("document.html");
//   }
// );

app.use("/", require("./routes/HomeRoute"));
app.use("/document", router);
app.use("/auth", require("./routes/AuthRoute"));

// io.on("connection", socket => {
//   console.log("Connected");
//   socket.on("get-document", async documentID => {
//     socket.join(documentID);
//     let document = await findOrCreateDocument(documentID);
//     socket.emit("load-document", document.data);

//     socket.on("send-changes", delta => {
//       socket.broadcast.to(documentID).emit("receive-changes", delta)
//     })

//     socket.on("save-document", async data => {
//       await Document.findByIdAndUpdate(documentID, { data })
//     })
//   })
// })

// async function findOrCreateDocument(id) {
//   if (id == null) return;

//   const document = await Document.findById(id);
//   if (document) return document;
//   return await Document.create({
//     _id: id,
//     data: ''
//   })
// }

// app.use((res, req, next) => {
//   // Create the document if it hasn't been already
//   // const sharedoc = shareconn.get('docs', res.query.doc || 'default')
//   console.log("Going to get the document");
//   const sharedoc = shareconn.get("docs", "test_doc"); // collection, id
//   console.log("Passed getting the document");
//   if (sharedoc.data == null) {
//     console.log("Going for creating the document");
//     sharedoc.create("", "text");
//     console.log("Successfully created the document");
//   }
//   next();
// });

// Socket IO Server
const anchors = {};
const names = {};

io.on("connection", (client) => {
  const id = client.id;
  names[id] = String.fromCharCode(
    Math.floor("A".charCodeAt(0) + Math.random() * 26)
  );
  anchors[id] = [0, 0];

  // send client its id and anchor and names obj
  client.emit("initialize", { anchors, names });

  client.on("anchor-update", (msg) => {
    // set anchors[id]
    anchors[id] = msg;
    io.emit("anchor-update", { id, anchor: anchors[id] });
  });

  io.emit("id-join", { id, name: names[id], anchor: anchors[id] });

  // Remove id info and update clients
  // TODO: This doesn't seem to always get called
  // Mashing resfresh on a page seems to leave lingering
  // connections that eventually close
  client.on("disconnect", () => {
    console.log("left", id);
    delete names[id];
    delete anchors[id];
    io.emit("id-left", { id });
  });
});

// Share DB
var sharedb = require("sharedb-mongo")(
  "mongodb+srv://saad:pass12345@cluster0.xbvk9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
const share = new ShareDB({ db: sharedb });
const shareconn = share.connect();
const shareserver = http.createServer();
const sharewss = new WebSocket.Server({ server: shareserver });
sharewss.on("connection", (client) =>
  share.listen(new WebSocketJSONStream(client))
);
shareserver.listen(8080);

console.log(`ShareDB listening on port 8080`);
