function generateLink() {
  const donateBox = document.getElementById("donateBox");
  const linkOutput = document.getElementById("resultLink");
  const qrBox = document.getElementById("qrBox");
  const qrContainer = document.getElementById("qrcode");
  const downloadQRButton = document.getElementById("downloadQRButton");

  donateBox.style.display = "block";
  linkOutput.innerHTML = "";
  qrBox.style.display = "none";
  qrContainer.innerHTML = "";
  downloadQRButton.style.display = "none";

  const text = document.getElementById("mainText").value.trim();
  const words = document.getElementById("fallWords").value.trim();

  if (!text) {
    alert("Vui lòng nhập nội dung chính!");
    donateBox.style.display = "none";
    return;
  }

  const dataObj = {
    text: text,
    words: words,
  };

  const jsonStr = JSON.stringify(dataObj);
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));

  const baseURL = location.origin + location.pathname.replace(/[^/]*$/, "");
  const fullURL = `${baseURL}index.html?id=${encodeURIComponent(base64)}`;
  setTimeout(() => {
    donateBox.style.display = "none";
    linkOutput.innerHTML = `
          <p style="text-align: center;">✅ Link đã được tạo:</p>
          <div class="link-row">
            <button onclick="copyLink()" class="copy-btn">Copy</button>
            <input type="text" id="finalLink" value="${fullURL}" readonly />
          </div>
          <button onclick="generateQR('${fullURL}')" class="generate-btn" style="margin-top:15px;">Tạo mã QR</button>
        `;
  }, 1000);
}

function copyLink() {
  const input = document.getElementById("finalLink");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Link đã được sao chép!");
}

function generateQR(link) {
  const qrBox = document.getElementById("qrBox");
  const qrContainer = document.getElementById("qrcode");
  const downloadQRButton = document.getElementById("downloadQRButton");

  qrContainer.innerHTML = "";

  const tempDiv = document.createElement("div");
  new QRCode(tempDiv, {
    text: link,
    width: 300,
    height: 300,
    colorDark: "#f15b6a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  setTimeout(() => {
    const qrCanvas = tempDiv.querySelector("canvas");
    if (!qrCanvas) {
      alert("Không tạo được QR code!");
      return;
    }

    const qrSize = 120;
    const canvasSize = 300;
    const qrX = (canvasSize - qrSize) / 2;
    const qrY = (canvasSize - qrSize) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = "./assets/images/heart1.png";

    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, canvasSize, canvasSize);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      qrContainer.innerHTML = "";
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.maxWidth = "320px";
      qrContainer.appendChild(canvas);
      qrBox.style.display = "block";
      qrBox.scrollIntoView({ behavior: "smooth" });
      downloadQRButton.style.display = "inline-block";
    };

    bgImg.onerror = () => {
      alert("Không tải được ảnh nền. Kiểm tra lại link hoặc thử ảnh khác.");
    };
  }, 100);
}

function downloadQRWithBackground() {
  const qrContainer = document.getElementById("qrcode");
  const qrCanvas = qrContainer.querySelector("canvas");

  if (!qrCanvas) {
    alert("❗ Vui lòng tạo mã QR trước khi tải trước đã!");
    return;
  }

  const link = document.createElement("a");
  link.download = "qr.png";
  link.href = qrCanvas.toDataURL("image/png");
  link.click();
}
