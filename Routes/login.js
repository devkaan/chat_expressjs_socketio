const express = require("express");
const router = express.Router();
const { Users, Count } = require("../Models/schemas");
const { saveToLogLogin } = require("../utils/database");
const {
  NULL_USERNAME,
  USER_NOT_FOUND,
  NULL_USERPASS,
  USERPASS_IS_WRONG,
} = require("../utils/errorCodes");

router.get("/", (req, res) => {
  if (!req.session.username) {
    return res.render("login");
  }
  return res.redirect("/");
});

router.post("/", async (req, res) => {
  const { username, userpass, room } = req.body;
  const data = { username, room };
  data.success = 0;
  data.error = 0;
  data.info = 0;
  data.warning = 0;
  data.guest = 0;
  console.info({ username, userpass, room });
  if (username) {
    const result = await Users.findOne({ username });
    if (result) {
      data.username = username;
      data.starCount = result.starCount;
      // ? LOGIN_LOG
      if (result.userpass) {
        // NOT_GUEST
        data.guest = 0;
        if (userpass) {
          // ENTERED_USERPASS
          if (userpass === "_") {
            data.success = 1;
          } else if (userpass === result.userpass) {
            req.session.username = username;
            req.session.userid = result.userid;
            req.session.room = room;
            data.success = 2;
            data.guest = 0;
          } else if (userpass !== result.userpass) {
            data.error = 1;
            data.message = USERPASS_IS_WRONG;
          }
        } else {
          // DID_NOT_ENTERED_USERPASS
          data.error = 1;
          data.message = NULL_USERPASS;
        }
      } else {
        // GUEST
        data.guest = 1;
      }
    } else {
      data.error = 1;
      data.message = USER_NOT_FOUND;
    }
  } else {
    data.error = 1;
    data.message = NULL_USERNAME;
  }
  return res.json({ data });
});

module.exports = router;
