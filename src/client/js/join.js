const pw = document.getElementById("password");
const pw2 = document.getElementById("password2");
const PwConfirmMsg = document.querySelector("#pw-confirm-msg");

const handleConfirmation = (event) => {
  if (pw.value && pw2.value) {
    if (pw.value !== pw2.value) {
      PwConfirmMsg.innerText = "비밀번호가 일치하지 않습니다.";
    } else {
      PwConfirmMsg.innerText = null;
    }
  } else {
    PwConfirmMsg.innerText = null;
  }
};

pw2.addEventListener("input", handleConfirmation);
