const videoContainer = document.getElementById("video__container");
const likeBtn = document.querySelector(".fa-heart");
const subscribeBtn = document.getElementById("subscribeBtn");

const { id } = videoContainer.dataset;

const showLike = (count) => alert(`이 동영상의 좋아요 개수 ${count}개`);
const showSubscribe = (count) => alert(`이 유튜버의 총 구독자 수 ${count}명`);

const toggleLike = async (event) => {
  event.preventDefault();
  const response = await fetch(`/api/videos/${id}/like`, {
    method: "POST",
  });
  if (response.status === 200) {
    const { result, count } = await response.json();
    styleLike(result);
    showLike(count);
  }
};

const toggleSubscribe = async (event) => {
  event.preventDefault();
  const response = await fetch(`/api/videos/${id}/subscribe`, {
    method: "POST",
  });
  if (response.status === 200) {
    const { result, count } = await response.json();
    styleSubscribe(result);
    showSubscribe(count);
  }
  if (response.status === 401) {
    alert("🤣 본인 계정은 구독할 수 없어요.");
  }
};

const styleLike = (result) => {
  if (result === true) {
    likeBtn.style.color = "#065fd4"; // blue
  } else {
    likeBtn.style.color = "#1b1b1b"; // black
  }
};

const styleSubscribe = (result) => {
  if (result === true) {
    subscribeBtn.style.background = "#e5e5e5"; // lightgray
    subscribeBtn.style.color = "black";
    subscribeBtn.innerText = "구독중";
  } else {
    subscribeBtn.style.background = "#ff0000"; // red
    subscribeBtn.style.color = "white";
    subscribeBtn.innerText = "구독";
  }
};

const initLike = async () => {
  const response = await fetch(`/api/videos/${id}/init-like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    const { result } = await response.json();
    styleLike(result);
  }
};

const initSubscribe = async () => {
  const response = await fetch(`/api/videos/${id}/init-subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    const { result } = await response.json();
    styleSubscribe(result);
  }
  if (response.status === 204) {
    return;
  }
};

initLike();
initSubscribe();

likeBtn.addEventListener("click", toggleLike);
if (subscribeBtn) {
  subscribeBtn.addEventListener("click", toggleSubscribe);
}
