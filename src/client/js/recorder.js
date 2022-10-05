import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const video = document.getElementById("preview");
const actionBtn = document.getElementById("actionBtn");
const actionIcon = actionBtn.querySelector("i");
const actionLabel = actionBtn.querySelector("span");
const headerAvatar = document.querySelector(".header__avatar");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.disabled = true;
  actionIcon.classList.remove("fa-download");
  actionIcon.classList.add("fa-spinner");
  actionIcon.classList.add("fa-beat");
  actionLabel.innerText = "다운로드 중";

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.addEventListener("click", handleStart);
  actionBtn.disabled = false;
  actionIcon.classList.remove("fa-spinner");
  actionIcon.classList.remove("fa-beat");
  actionIcon.classList.add("fa-video");
  actionLabel.innerText = "녹화하기";
  video.controls = false;
  init();
};

const handleStop = () => {
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  actionIcon.classList.remove("fa-beat");
  actionIcon.classList.remove("fa-video");
  actionIcon.classList.add("fa-download");
  actionLabel.innerText = "다운로드";
  recorder.stop();
};

const handleStart = () => {
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);
  actionIcon.classList.add("fa-beat");
  actionLabel.innerText = "녹화 종료";
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.controls = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  headerAvatar.style.display = "none";
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
