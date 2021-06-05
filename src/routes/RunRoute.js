const router = require("express").Router();

router.post("/", (req, res) => {
  console.log("Received a request");
  code = req.body;

  res.send(JSON.stringify("{ r: Recieved the code}"))
  
});

module.exports = router;
