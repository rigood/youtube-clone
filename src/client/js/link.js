const avatar = document.querySelectorAll(".video-mixin__avatar");

const handleClick = (event) => {
  event.preventDefault();
  const authorId = event.target.dataset.id;
  location.href = `/users/${authorId}`;
};

avatar.forEach((i) => i.addEventListener("click", handleClick));
