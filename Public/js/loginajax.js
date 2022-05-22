const button = document.querySelector(".btn");
const form = $("form");
const inputDivs = document.querySelector(".input-divs");
const userpassDiv = document.querySelector(".userpass-div");

let bool = true;
const login = () => {
  if (!bool) return false;
  bool = false;
  if (!form) return "error";
  const divUsername = document.querySelector("#username");
  const divUserpass = document.querySelector("#userpass");
  const divRoom = document.querySelector("#room");
  const username = divUsername.value;
  const userpass = divUserpass ? divUserpass.value : null;
  const room = divRoom ? divRoom.value : null;
  const data = { username, userpass, room };
  //   console.log(data);
  $.post("/login", data, (res) => {
    // the codes that under this line gotta be func.
    if (res && typeof res === "object") {
      res = res.data;
      if (res.success) {
        if (res.guest || res.success === 2) {
          window.location = "/";
        } else {
          divUsername.textContent = res.username;
          userpassDiv.style.display = "block";
          divUserpass.value = "";
        }
      } else if (res.error === 1) {
        Swal.fire({
          title: "Hata!",
          text: res.message,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      } else if (res.info) {
        // ? INFO
      } else if (res.warning) {
        // TODO WARNING
      }
    }
    bool = true;
  });
  return true;
};

button.addEventListener("click", login);
