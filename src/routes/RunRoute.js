const router = require("express").Router();

router.post("/", (req, res) => {
  console.log("Received a request");
  console.log(req.body);
  
});

module.exports = router;
