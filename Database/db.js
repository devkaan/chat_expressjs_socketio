const mongoose = require("mongoose");
require("dotenv").config();
const { Users, Count, countObj } = require("../Models/schemas");
const { DBUSERNAME, DBUSERPASS, DBNAME } = process.env;
const dbURL = `mongodb+srv://${DBUSERNAME}:${DBUSERPASS}@cluster0.plzbe.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.info("connected to db");
    // For Create Count Schema FOR userid
    await new Count(countObj)
      .save()
      .then(() => {})
      .catch(() => {});
    // find user

    // const result = await Users.find({ username : "kaan" });
    // console.log(result);

    // insert user

    // const user = new Users({
    // 	userid: 1,
    // 	username: "kaan",
    // 	userpass: "123",
    // 	starCount: 10,
    // 	permissions: ["ADMIN"],
    // 	ip: "::1",
    // });
    // const saveResult = await new Users(user).save();
    // console.log(saveResult);

    // delete user

    // const deleteResult = await Users.findOneAndDelete({userid:1});
    // console.log(deleteResult);
  })
  .catch((err) => {
    console.error("DB_ERROR");
    throw err;
  });
