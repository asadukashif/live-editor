const router = require("express").Router();

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("home.html", {
    user: req.user
  });
});

module.exports = router;
