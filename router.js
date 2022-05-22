const express = require("express");
const router = express.Router();

const login = require("./Routes/login");
const homepage = require("./Routes/homepage");
const logout = require("./Routes/logout");
router.use("/logout", logout);
router.use("/", homepage);
router.use("/login", login);
