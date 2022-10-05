const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".comment__delBtn");
const commentsCount = document.getElementById("commentsCount");
const cancelBtn = document.getElementById("commentCancel");
const commentInputBox = document.getElementById("commentInputBox");

const addComment = (text, id, avatarUrl, nickname, createdAt) => {
  const commentList = document.getElementById("commentList");

  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "comment__box";

  const commentAvatar = document.createElement("div");
  commentAvatar.className = "comment__avatar";

  const commentAvatarImg = document.createElement("img");
  commentAvatarImg.className = "comment__avatar-img";
  commentAvatarImg.src = avatarUrl.startsWith("http") ? avatarUrl : "/" + avatarUrl;

  commentAvatar.appendChild(commentAvatarImg);

  const commentContents = document.createElement("div");
  commentContents.className = "comment__contents";

  const commentMeta = document.createElement("div");
  commentMeta.className = "comment__meta";

  const commentAuthor = document.createElement("span");
  commentAuthor.className = "comment__author";
  commentAuthor.innerText = nickname;

  const commentDate = document.createElement("span");
  commentDate.className = "comment__date";
  commentDate.innerText = createdAt;

  commentMeta.appendChild(commentAuthor);
  commentMeta.appendChild(commentDate);

  const commentInput = document.createElement("div");
  commentInput.classList.add("comment__input", "comment__input--with--btn");

  const commentText = document.createElement("p");
  commentText.innerText = text;

  const commentDelBtn = document.createElement("button");
  commentDelBtn.className = "comment__delBtn";
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

  const text = commentInputBox.value;
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
    commentInputBox.value = "";
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

const handleCancel = (event) => {
  event.preventDefault();
  commentInputBox.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
  deleteBtn.forEach((btn) => btn.addEventListener("click", handleDelete));
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", handleCancel);
}
