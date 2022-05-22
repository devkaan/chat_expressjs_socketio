const express = require("express");
const router = express.Router();
const { WRONG_METHOD } = require("../utils/errorCodes");

router.get("/", (req, res) => {
  //
  req.session.destroy();
  res.redirect("/login");
});
router.post("/", (req, res) => {
  res.send(WRONG_METHOD);
});

module.exports = router;
