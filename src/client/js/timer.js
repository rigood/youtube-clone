const seconds = document.querySelector(".seconds");

setInterval(function () {
  seconds.innerText = Number(seconds.innerText) - 1;
}, 1000);

setTimeout(function () {
  location.href = "/";
}, 4900);
