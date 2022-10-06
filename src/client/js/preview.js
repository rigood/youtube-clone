const file = document.getElementById("avatar");
const file2 = document.getElementById("thumb");
const file3 = document.getElementById("video");

const handleFile = (event) => {
  const input = event.target;

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = (event) => {
      let preview;
      if (input.id === "video") {
        preview = document.querySelector(".videoPreview");
        preview.src = event.target.result;
        preview.play();
      } else {
        preview = document.querySelector(".preview");
        preview.src = event.target.result;
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
};

if (file) {
  file.addEventListener("change", handleFile);
}

if (file2) {
  file2.addEventListener("change", handleFile);
}

if (file3) {
  file3.addEventListener("change", handleFile);
}
