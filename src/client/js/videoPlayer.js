const videoContainer = document.getElementById("video__container");
const videoOverlay = document.getElementById("video__overlay");
const video = document.getElementById("video");

const videoControls = document.getElementById("video__controls");
const timeline = document.getElementById("timeline");

const psBtn = document.getElementById("playPauseBtn");
const psIcon = psBtn.querySelector("i");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const volumeBtn = document.getElementById("volumeBtn");
const volumeIcon = volumeBtn.querySelector("i");
const volumeRange = document.getElementById("volumeRange");

const fullScreenBtn = document.getElementById("fullScreenBtn");

const commentInput = document.getElementById("commentInput");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handleOverlay = () => {
  if (videoOverlay.style.display === "block") {
    videoOverlay.style.display = "none";
  }
};

const handleKeyboard = (event) => {
  if (event.target === commentInput) {
    return;
  }
  // spacebar -> play/pause
  if (event.keyCode === 32) {
    event.preventDefault();
    handlePlayAndStop();
    handleControls();
  }
  // f, F -> enter fullscreen
  if (event.keyCode === 102 || event.keyCode === 70) {
    videoContainer.requestFullscreen();
    handleControls();
  }
  // Esc -> exit fullscreen
  if (event.keyCode === 27) {
    document.exitFullscreen();
    handleControls();
  }
};

const handleVideoClick = (event) => {
  handlePlayAndStop();
};

const handleEnded = () => {
  videoOverlay.style.display = "block";
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  psIcon.className = "fas fa-rotate-left";
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

// Set timeline and buttons
const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    volumeIcon.className = "fas fa-volume-mute";
  }
  if (value === "0") {
    volumeIcon.className = "fas fa-volume-mute";
    video.muted = true;
  } else {
    volumeIcon.className = "fas fa-volume-up";
  }
  video.volume = volumeValue = value;
};

const handleMuteBtn = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  volumeIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : Number(volumeValue) === 0 ? 0.5 : volumeValue;
  video.volume = volumeRange.value;
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

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

// Show, Hide videoControls
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseLeave = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleControls = () => {
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, 3000);
};

// Set Timeline
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

// Etc
video.addEventListener("ended", handleEnded);
document.addEventListener("keydown", handleKeyboard);
video.addEventListener("click", handleVideoClick);

// Set timeline and buttons
timeline.addEventListener("input", handleTimelineChange);
psBtn.addEventListener("click", handlePlayAndStop);
volumeBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeRange);
fullScreenBtn.addEventListener("click", handleFullscreen);

// Show, Hide videoControls
video.addEventListener("loadedmetadata", handleControls);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

// Set Timeline
video.addEventListener("canplay", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
handleLoadedMetadata();
