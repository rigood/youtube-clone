const handleFilter = () => {
  const hashtags = document.querySelector(".home__filter").getElementsByTagName("a");
  const length = hashtags.length;
  const url = location.host;
  const pathname = location.pathname;

  for (i = 0; i < length; i++) {
    if (hashtags[i].href.split(url)[1] === pathname) {
      hashtags[i].classList.add("selected");
    }
  }
};

window.addEventListener("DOMContentLoaded", handleFilter);
