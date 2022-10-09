const likeBtn = document.querySelector(".fa-heart");
const shareBtn = document.querySelector(".fa-share");
const subscribeBtn = document.getElementById("subscribeBtn");

const handleLike = (event) => {
  event.preventDefault();
  alert("❤ 좋아요 감사합니다 ❤");
};

const handleShare = (event) => {
  event.preventDefault();
  url = location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert(`😀 링크 복사 완료 😀\n${url}`);
  });
};

const handleSubscribe = (event) => {
  event.preventDefault();
  alert("🎁 구독 해주셔서 감사합니다 🎁");
};

likeBtn.addEventListener("click", handleLike);
shareBtn.addEventListener("click", handleShare);
subscribeBtn.addEventListener("click", handleSubscribe);
