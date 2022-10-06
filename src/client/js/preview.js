const file = document.getElementById("avatar");
const file2 = document.getElementById("thumb");

const handleFile = (event) => {
  const input = event.target;

  // 이미지 파일이 있는 경우
  if (input.files && input.files[0]) {
    // FileReader 인스턴스 생성
    const reader = new FileReader();

    // 이미지 로드 되면
    reader.onload = (event) => {
      const preview = document.querySelector(".preview");
      preview.src = event.target.result;
    };

    // reader 이미지 읽기
    reader.readAsDataURL(input.files[0]);
  }
};

if (file) {
  file.addEventListener("change", handleFile);
}

if (file2) {
  file2.addEventListener("change", handleFile);
}
