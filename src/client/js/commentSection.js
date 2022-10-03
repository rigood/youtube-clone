const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteBtn");
const commentsCount = document.getElementById("commentsCount");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.addEventListener("click", handleDelete);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  const countValue = Number(commentsCount.innerText) + 1;
  commentsCount.innerText = countValue;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const removeComment = (id) => {};

const handleDelete = async (event) => {
  event.preventDefault();

  const videoId = videoContainer.dataset.id;
  const commentId = event.target.parentElement.dataset.id;

  console.log(`✅비디오id : ${videoId}, 코멘트id:  ${commentId}`);

  const response = await fetch(`/api/videos/${videoId}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    event.target.parentElement.remove();
    const countValue = Number(commentsCount.innerText) - 1;
    commentsCount.innerText = countValue;
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
  deleteBtn.forEach((btn) => btn.addEventListener("click", handleDelete));
}
