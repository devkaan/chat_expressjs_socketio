const { Users, Log_Login, Count } = require("../Models/schemas");
const ip = require("ip");

const saveToLogLogin = async (result) => {
  const ipAdress = ip.address();
  const userid = result.userid;
  const time = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
  });

  let obj = { userid, ip: ipAdress, time };
  await new Log_Login(obj)
    .save()
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

module.exports = { saveToLogLogin };
