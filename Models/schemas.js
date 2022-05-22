const mongoose = require("mongoose");
const { Schema } = mongoose;
const countObj = { users: 1, posts: 1, reports: 1 };

const userSchema = new Schema({
  userid: {
    type: Number,
    require: true,
    unique: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  userpass: {
    type: String,
    require: false,
    unique: false,
  },
  starCount: {
    type: Number,
    require: true,
    default: 1,
  },
  permissions: {
    type: Array,
    default: [
      "CAN_SEND_MESSAGE",
      "CAN_JOIN_ROOM",
      "CAN_SEND_EMOJI",
      "CAN_LOGIN",
    ],
  },
  guest: {
    type: Boolean,
  },
  ip: {
    type: String,
    required: true,
  },
});

const log_login_schema = new Schema({
  userid: {
    type: Number,
    require: true,
    unique: false,
  },
  ip: {
    type: String,
    required: true,
    unique: false,
    /// eğer sadece farklı ip ise burası 'unique: true' olacak
  },
  time: {
    type: String,
  },
});

const countSchema = new Schema({
  userCount: {
    type: Number,
    unique: true,
    default: countObj.users,
  },
  roomCount: {
    type: Number,
    unique: true,
    default: countObj.posts,
  },
  roleCount: {
    type: Number,
    unique: true,
    default: countObj.reports,
  },
});

const Users = mongoose.model("User", userSchema);
const Log_Login = mongoose.model("Log_Login", log_login_schema);
const Count = mongoose.model("Count", countSchema);

module.exports = {
  Users,
  Log_Login,
  Count,
};
