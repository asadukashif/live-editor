import express, { Application } from "express";
import nunjucks from "nunjucks";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import HomeRoute from "./routes/HomeRoute";

dotenv.config();
const PORT: number = parseInt(<string>process.env.PORT) || 3000;

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

app.set("view engine", "html");
app.use(express.static(__dirname + "/static/"));

// Nunjucks Settings
nunjucks.configure(["src/views/", "src/static/"], {
  autoescape: false,
  express: app,
});

// Routes
app.use("/", HomeRoute);

/* SocketIO Jazz */
io.on("connection", (socket: Socket) => {
  console.log("Connected to", socket.id);
  socket.emit("welcome", { message: "Welcome to the server" });
});

httpServer.listen(PORT);
console.log("Server is up at http://localhost:3000/");
