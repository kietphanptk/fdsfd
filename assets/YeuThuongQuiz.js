const textElement = document.getElementById("text");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const imgElement = document.getElementById("main-img");
const buttonContainer = document.getElementById("button-container");

function getParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

const dataEncoded = getParam("id");
if (dataEncoded) {
  try {
    const decoded = decodeURIComponent(escape(atob(dataEncoded)));
    const parsed = JSON.parse(decoded);
    if (parsed.text) textElement.innerText = parsed.text;
    if (parsed.words) fallingWords = parsed.words.split(",");
  } catch (e) {
    console.error("Lỗi giải mã dữ liệu:", e);
  }
}

let fallingWords = ["❤", "Anh yêu em", "Mãi yêu em", "Anh là của em"];

const noText = [
  "Thật sao em",
  "Em chắc chưa đó?",
  "Đừng làm vậy với anh",
  "Tim anh đang tan vỡ",
  "Anh sắp khóc rồi đó",
];

const noImgs = [
  "./assets/images/2.gif",
  "./assets/images/3.gif",
  "./assets/images/4.gif",
  "./assets/images/5.gif",
  "./assets/images/6.gif",
];

let noClickCount = 0;
let yesFontSize = 16;

noBtn.addEventListener("click", () => {
  if (noClickCount < noText.length) {
    imgElement.src = noImgs[noClickCount];
    noBtn.innerText = noText[noClickCount];
    noClickCount++;

    yesFontSize += 20;
    yesBtn.style.fontSize = yesFontSize + "px";
    yesBtn.style.padding =
      10 + noClickCount * 2 + "px " + (20 + noClickCount * 2) + "px";
  }

  if (noClickCount === noText.length) {
    setTimeout(() => (noBtn.style.display = "none"), 100);
  }
});

yesBtn.addEventListener("click", () => {
  textElement.style.display = "none";
  imgElement.style.display = "none";
  buttonContainer.style.display = "none";

  document.body.style.backgroundColor = "#121212";

  const starBackground = document.createElement("div");
  starBackground.id = "star-background";
  Object.assign(starBackground.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(18, 18, 18, 0.95)",
    zIndex: "-1",
    pointerEvents: "none",
    overflow: "hidden",
  });
  document.body.appendChild(starBackground);

  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + 1 + "px";
    const left = Math.random() * 100 + "vw";
    const top = Math.random() * 100 + "vh";
    const delay = Math.random() * 3 + "s";
    const duration = Math.random() * 2 + 1 + "s";
    star.style.cssText = `
          position: absolute;
          width: ${size};
          height: ${size};
          background: white;
          border-radius: 50%;
          left: ${left};
          top: ${top};
          opacity: 0;
          animation: starBlink ${duration} ease-in-out infinite;
          animation-delay: ${delay};
        `;
    starBackground.appendChild(star);
  }

  const layers = [
    { fontSize: 32, opacity: 1, duration: 4, positions: [] },
    { fontSize: 24, opacity: 0.8, duration: 5, positions: [] },
    { fontSize: 20, opacity: 0.7, duration: 6, positions: [] },
    { fontSize: 16, opacity: 0.6, duration: 7, positions: [] },
    { fontSize: 12, opacity: 0.5, duration: 8, positions: [] },
  ];

  function isPositionValid(positions, left) {
    return positions.every((pos) => Math.abs(pos - left) > 8);
  }

  const interval = setInterval(() => {
    const span = document.createElement("span");
    span.className = "falling-text";
    span.textContent =
      fallingWords[Math.floor(Math.random() * fallingWords.length)];

    const layerIndex = Math.floor(Math.random() * layers.length);
    const layer = layers[layerIndex];

    let left;
    let attempts = 0;
    do {
      left = Math.random() * 100;
      attempts++;
      if (attempts > 30) break;
    } while (!isPositionValid(layer.positions, left));

    layer.positions.push(left);

    // 👉 Thêm màu ngẫu nhiên
    const colors = ["#ff9e9e", "#f06292", "#85e4ff"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    span.style.left = left + "vw";
    span.style.fontSize = layer.fontSize + "px";
    span.style.opacity = layer.opacity;
    span.style.animationDuration = layer.duration + "s";
    span.style.color = randomColor;
    span.style.textShadow = "0 0 5px white";

    document.body.appendChild(span);

    setTimeout(() => {
      span.remove();
      const index = layer.positions.indexOf(left);
      if (index > -1) {
        layer.positions.splice(index, 1);
      }
    }, layer.duration * 1000 + 500);
  }, 100);
});
