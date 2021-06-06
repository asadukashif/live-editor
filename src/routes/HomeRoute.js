const router = require("express").Router();

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("home.html");
});

module.exports = router;
