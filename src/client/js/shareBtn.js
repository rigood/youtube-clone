const shareBtn = document.querySelector(".fa-share");

const handleShare = (event) => {
  event.preventDefault();
  url = location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert(`😀 링크 복사 완료 😀\n${url}`);
  });
};

shareBtn.addEventListener("click", handleShare);
