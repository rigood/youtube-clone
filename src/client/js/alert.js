const likeBtn = document.querySelector(".fa-heart");
const subscribeBtn = document.getElementById("subscribeBtn");

const handleLike = (event) => {
  event.preventDefault();
  const ok = confirm("🙏 로그인 후 좋아요 버튼을 누를 수 있습니다.\n😊 확인 버튼을 누르시면 로그인 페이지로 이동합니다.");
  if (ok) {
    location.href = "/login";
  }
};

const handleSubscribe = (event) => {
  event.preventDefault();
  const ok = confirm("🙏 로그인 후 구독 하실 수 있습니다.\n😊 확인 버튼을 누르시면 로그인 페이지로 이동합니다.");
  if (ok) {
    location.href = "/login";
  }
};

likeBtn.addEventListener("click", handleLike);
subscribeBtn.addEventListener("click", handleSubscribe);
