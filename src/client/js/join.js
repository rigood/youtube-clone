const pw = document.getElementById("password");
const pwConfirmation = document.getElementById("passwordConfirmation");
const PwConfirmMsg = document.querySelector(".pw-confirm-msg");

const handleConfirmation = (event) => {
  if (pw.value && pwConfirmation.value) {
    if (pw.value !== pwConfirmation.value) {
      PwConfirmMsg.innerText = "비밀번호가 일치하지 않습니다.";
    } else {
      PwConfirmMsg.innerText = null;
    }
  } else {
    PwConfirmMsg.innerText = null;
  }
};

pw.addEventListener("input", handleConfirmation);
pwConfirmation.addEventListener("input", handleConfirmation);
