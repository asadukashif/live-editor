import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.use("/", (req: Request, res: Response) => {
  res.render("home/home.html", { title: "Home Page" });
});

export default router;
