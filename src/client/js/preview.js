const file = document.getElementById("avatar");

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

file.addEventListener("change", handleFile);
