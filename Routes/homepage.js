const express = require("express");
const { WRONG_METHOD } = require("../utils/errorCodes");
const router = express.Router();
const url = require("url");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");

router.get("/", (req, res) => {
  console.log(getCurrentUser());
  if (!req.session.username || !req.session.userid) {
    res.redirect("/login");
  }
  let data = {
    username: req.session.username,
    room: req.session.room,
  };
  res.render("chat", data);
});
router.post("/", (req, res) => {
  res.send(WRONG_METHOD);
});

module.exports = router;
