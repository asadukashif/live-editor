const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
require("dotenv").config();

const PORT = process.env.PORT || 3000;
//passport config
require("./passport")(passport);

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "html");
app.use(express.static(path.join("src", "static")));

// session middleware
app.use(
  session({
    secret: "Jihad",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Nunjucks settings
nunjucks.configure(["src/views/", "src/static/"], {
  autoescape: false,
  express: app,
});

// server.listen(3000, () => {
//   console.log("Server running at http://localhost:3000");
// });

module.exports.app = app;
// module.exports.io = io;
