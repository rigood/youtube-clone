const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".comment-delBtn");
const commentsCount = document.getElementById("commentsCount");

const addComment = (text, id, avatarUrl, nickname, createdAt) => {
  const commentList = document.getElementById("commentList");

  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "comment-box";

  const commentAvatar = document.createElement("div");
  commentAvatar.className = "comment-avatar";

  const commentAvatarImg = document.createElement("img");
  commentAvatarImg.className = "comment-avatar-img";
  commentAvatarImg.src = avatarUrl.startsWith("http") ? avatarUrl : "/" + avatarUrl;

  commentAvatar.appendChild(commentAvatarImg);

  const commentContents = document.createElement("div");
  commentContents.className = "comment-contents";

  const commentMeta = document.createElement("div");
  commentMeta.className = "comment-meta";

  const commentAuthor = document.createElement("span");
  commentAuthor.className = "comment-author";
  commentAuthor.innerText = nickname;

  const commentDate = document.createElement("span");
  commentDate.className = "comment-date";
  commentDate.innerText = createdAt;

  commentMeta.appendChild(commentAuthor);
  commentMeta.appendChild(commentDate);

  const commentInput = document.createElement("div");
  commentInput.classList.add("comment-input", "comment-input-btn");

  const commentText = document.createElement("p");
  commentText.innerText = text;

  const commentDelBtn = document.createElement("button");
  commentDelBtn.className = "comment-delBtn";
  commentDelBtn.addEventListener("click", handleDelete);

  const i = document.createElement("i");
  i.classList.add("fas", "fa-trash-can");

  commentDelBtn.appendChild(i);

  commentInput.appendChild(commentText);
  commentInput.appendChild(commentDelBtn);

  commentContents.appendChild(commentMeta);
  commentContents.appendChild(commentInput);

  newComment.appendChild(commentAvatar);
  newComment.appendChild(commentContents);

  commentList.prepend(newComment);

  const countValue = Number(commentsCount.innerText) + 1;
  commentsCount.innerText = countValue;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const commentInput = document.getElementById("commentInput");
  const text = commentInput.value;
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
    commentInput.value = "";
    const { newCommentId, avatarUrl, nickname, createdAt } = await response.json();
    addComment(text, newCommentId, avatarUrl, nickname, createdAt);
  }
};

const removeComment = (id) => {};

const handleDelete = async (event) => {
  event.preventDefault();

  const videoId = videoContainer.dataset.id;

  const commentTarget = event.target.parentElement.parentElement.parentElement.parentElement;
  const commentId = commentTarget.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    commentTarget.remove();
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
