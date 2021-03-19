import express, { Application } from "express";
import nunjucks from "nunjucks";
import dotenv from "dotenv";

import HomeRoute from "./routes/HomeRoute";

dotenv.config();
const PORT: number = parseInt(<string>process.env.PORT) || 3000;

const app: Application = express();
app.set("view engine", "html");

// Nunjucks Settings
nunjucks.configure(["src/views/", "src/views/static/"], {
  autoescape: false,
  express: app,
});

// Routes
app.use("/", HomeRoute);

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}/`));
