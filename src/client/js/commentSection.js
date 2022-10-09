const videoContainer = document.getElementById("video__container");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".comment__delete");
const commentsCount = document.getElementById("commentsCount");
const cancelBtn = document.getElementById("commentCancel");
const commentInput = document.getElementById("commentInput");

const addComment = (text, commentId, authorId, avatarUrl, nickname, createdAt) => {
  const commentList = document.getElementById("commentList");

  const commentMixin = document.createElement("li");
  commentMixin.dataset.id = commentId;
  commentMixin.className = "comment__mixin";

  const commentAvatarLink = document.createElement("a");
  commentAvatarLink.href = `/users/${authorId}`;

  const commentAvatar = document.createElement("img");
  commentAvatar.className = "comment__avatar";
  commentAvatar.src = avatarUrl;

  commentAvatarLink.appendChild(commentAvatar);

  const commentContents = document.createElement("div");
  commentContents.className = "comment__contents";

  const commentMeta = document.createElement("div");
  commentMeta.className = "comment__meta";

  const commentAuthor = document.createElement("a");
  commentAuthor.className = "comment__author";
  commentAuthor.innerText = nickname;
  commentAuthor.href = `/users/${authorId}`;

  const commentDate = document.createElement("span");
  commentDate.className = "comment__date";
  commentDate.innerText = createdAt;

  commentMeta.appendChild(commentAuthor);
  commentMeta.appendChild(commentDate);

  const commentText = document.createElement("p");
  commentText.className = "comment__text";
  commentText.innerText = text;

  const commentBtns = document.createElement("div");
  commentBtns.className = "comment__btns";

  const commentLike = document.createElement("button");
  commentLike.classList.add("comment__like", "tooltip-target");
  const iLike = document.createElement("i");
  iLike.classList.add("fas", "fa-thumbs-up");
  const tooltipLike = document.createElement("span");
  tooltipLike.className = "tooltip";
  tooltipLike.innerText = "좋아요";
  commentLike.appendChild(iLike);
  commentLike.appendChild(tooltipLike);

  const commentDislike = document.createElement("button");
  commentDislike.classList.add("comment__dislike", "tooltip-target");
  const iDislike = document.createElement("i");
  iDislike.classList.add("fas", "fa-thumbs-down");
  const tooltipDislike = document.createElement("span");
  tooltipDislike.className = "tooltip";
  tooltipDislike.innerText = "싫어요";
  commentDislike.appendChild(iDislike);
  commentDislike.appendChild(tooltipDislike);

  const commentDelete = document.createElement("button");
  commentDelete.classList.add("comment__delete", "tooltip-target");
  commentDelete.addEventListener("click", handleDelete);
  const iDelete = document.createElement("i");
  iDelete.classList.add("fas", "fa-trash-can");
  const tooltipDelete = document.createElement("span");
  tooltipDelete.className = "tooltip";
  tooltipDelete.innerText = "삭제";
  commentDelete.appendChild(iDelete);
  commentDelete.appendChild(tooltipDelete);

  commentBtns.appendChild(commentLike);
  commentBtns.appendChild(commentDislike);
  commentBtns.appendChild(commentDelete);

  commentContents.appendChild(commentMeta);
  commentContents.appendChild(commentText);
  commentContents.appendChild(commentBtns);

  commentMixin.appendChild(commentAvatarLink);
  commentMixin.appendChild(commentContents);

  commentList.prepend(commentMixin);

  const countValue = Number(commentsCount.innerText) + 1;
  commentsCount.innerText = countValue;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const text = commentInput.value;
  const videoId = videoContainer.dataset.id;
  console.log("💚💚💚💚💚text, videoId", text, videoId);

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  console.log("💚💚💚💚💚response", response);

  if (response.status === 201) {
    commentInput.value = "";
    const { newCommentId, authorId, authorAvatarUrl, authorNickname, createdAt } = await response.json();
    addComment(text, newCommentId, authorId, authorAvatarUrl, authorNickname, createdAt);
  }
};

const handleDelete = async (event) => {
  event.preventDefault();

  const videoId = videoContainer.dataset.id;

  let li;
  if (event.target.tagName === "I") {
    li = event.target.parentElement.parentElement.parentElement.parentElement;
  } else if (event.target.tagName === "BUTTON") {
    li = event.target.parentElement.parentElement.parentElement;
  }

  const commentId = li.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    li.remove();
    const countValue = Number(commentsCount.innerText) - 1;
    commentsCount.innerText = countValue;
  }
};

const handleCancel = (event) => {
  event.preventDefault();
  commentInput.value = "";
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
