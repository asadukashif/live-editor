const http = require("http");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const { app } = require("./config/app");
const connectDB = require("./config/mongodb");
const { backend } = require("./config/sharedb");
require("dotenv").config();

// Connect to the database
connectDB();

let server = http.createServer(app);

// Connect any incoming WebSocket connection to ShareDB
let wss = new WebSocket.Server({ server: server });
wss.on("connection", function (ws) {
  let stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

server.listen(process.env.PORT);
console.log(`Listening on http://localhost:${process.env.PORT}`);
