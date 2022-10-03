const videoContainer = document.getElementById("videoContainer");
const videoContainerOverlay = document.getElementById("videoContainerOverlay");
const video = document.querySelector("video");
const videoControls = document.getElementById("videoControls");
const psBtn = videoControls.querySelector("#playPauseBtn");
const psIcon = psBtn.querySelector("i");
const volumeBtn = videoControls.querySelector("#volume");
const volumeIcon = volumeBtn.querySelector("i");
const volumeRange = videoControls.querySelector("#volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const textarea = document.getElementById("textarea");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handleOverlay = () => {
  if (videoContainerOverlay.style.display === "block") {
    videoContainerOverlay.style.display = "none";
  }
};

const handlePlayAndStop = () => {
  handleOverlay();
  if (video.paused) {
    video.play();
    psIcon.className = "fas fa-pause";
  } else {
    video.pause();
    psIcon.className = "fas fa-play";
  }
};

const handleSound = () => {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = volumeValue;
    volumeIcon.className = "fas fa-volume-up";
  } else {
    video.muted = true;
    volumeRange.value = 0;
    volumeIcon.className = "fas fa-volume-mute";
  }
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    volumeIcon.className = "fas fa-volume-mute";
  }
  if (value === "0") {
    volumeIcon.className = "fas fa-volume-off";
  } else {
    volumeIcon.className = "fas fa-volume-up";
  }
  video.volume = volumeValue = value;
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleKeyboard = (event) => {
  // spacebar -> pause
  if (event.target !== textarea && event.keyCode === 32) {
    handlePlayAndStop();
  }
  // f, F -> enter fullscreen
  if (event.target !== textarea && (event.keyCode === 102 || event.keyCode === 70)) {
    video.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
  // Esc -> exit fullscreen
  if (event.target !== textarea && event.keyCode === 27) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  }
};

const handleVideoClick = (event) => {
  handlePlayAndStop();
};

const handleEnded = () => {
  videoContainerOverlay.style.display = "block";
  psIcon.className = "fas fa-rotate-left";
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handleVideoClick);
video.addEventListener("ended", handleEnded);
psIcon.addEventListener("click", handlePlayAndStop);
volumeIcon.addEventListener("click", handleSound);
volumeRange.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
document.addEventListener("keyup", handleKeyboard);
