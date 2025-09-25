document.addEventListener('DOMContentLoaded', () => {
  // ---------------- Floating Header ----------------
  const header = document.createElement('div');
  header.style.position = 'fixed';
  header.style.top = '0';
  header.style.left = '0';
  header.style.width = '100%';
  header.style.zIndex = '9999';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.backgroundColor = 'peachpuff'; // peach background
  header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  header.style.padding = '10px 20px';
  header.style.fontFamily = 'Arial, sans-serif';

  // Logo
  const logo = document.createElement('png');
  logo.src = 'assets/Logo.png'; // adjust path
  logo.alt = 'Logo';
  logo.style.height = '50px';
  header.appendChild(logo);

  // Right section: clocks and username
  const rightDiv = document.createElement('div');
  rightDiv.style.display = 'flex';
  rightDiv.style.alignItems = 'center';
  rightDiv.style.gap = '15px';

  // Analog Clock
  const canvas = document.createElement('canvas');
  canvas.id = 'analogClock';
  canvas.width = 60;
  canvas.height = 60;
  rightDiv.appendChild(canvas);

  // Digital Clock
  const digital = document.createElement('div');
  digital.id = 'digitalTime';
  digital.style.fontSize = '24px'; // bigger font
  digital.style.fontFamily = 'monospace';
  rightDiv.appendChild(digital);

  // Username display
  const userDiv = document.createElement('div');
  userDiv.id = 'usernameDisplay';
  userDiv.style.fontSize = '16px';
  rightDiv.appendChild(userDiv);

  header.appendChild(rightDiv);
  document.body.appendChild(header);

  // ---------------- Analog Clock ----------------
  const ctx = canvas.getContext('2d');
  const radius = canvas.height / 2;
  ctx.translate(radius, radius);

  function drawClock() {
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTicks(ctx, radius);
    drawTime(ctx, radius);
  }

  function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  function drawNumbers(ctx, radius) {
    ctx.font = radius * 0.15 + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num <= 12; num++) {
      let ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.78);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.78);
      ctx.rotate(-ang);
    }
  }

  function drawTicks(ctx, radius) {
    for (let i = 0; i < 60; i++) {
      let ang = i * Math.PI / 30;
      ctx.beginPath();
      ctx.lineWidth = (i % 5 === 0) ? 2 : 1;
      ctx.moveTo(0, -radius * 0.9);
      ctx.lineTo(0, -radius * 0.85);
      ctx.strokeStyle = '#333';
      ctx.rotate(ang);
      ctx.stroke();
      ctx.rotate(-ang);
    }
  }

  function drawTime(ctx, radius) {
    const now = new Date();
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();

    drawHand(ctx, (hour + minute / 60 + second / 3600) * Math.PI / 6, radius * 0.5, 4);
    drawHand(ctx, (minute + second / 60) * Math.PI / 30, radius * 0.75, 3);
    drawHand(ctx, second * Math.PI / 30, radius * 0.85, 1, 'red');
  }

  function drawHand(ctx, pos, length, width, color = '#333') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  setInterval(drawClock, 1000);
  drawClock();

  // ---------------- Digital Clock ----------------
  function updateDigitalClock() {
    const now = new Date();
    digital.textContent = now.toLocaleTimeString();
  }
  updateDigitalClock();
  setInterval(updateDigitalClock, 1000);

  // ---------------- Users ----------------
  const users = {};
  fetch('users.txt')
    .then(res => res.text())
    .then(text => {
      text.split('\n').forEach(line => {
        const [id, name] = line.split(',');
        if (id && name) users[id.trim()] = name.trim();
      });
      userDiv.textContent = Users Loaded: ${Object.keys(users).length};
    })
    .catch(err => {
      userDiv.textContent = 'User file not found';
      console.error(err);
    });

  const idInput = document.getElementById('idNumber');
  const nameInput = document.getElementById('name');
  if (idInput && nameInput) {
    idInput.addEventListener('input', () => {
      const id = idInput.value.trim();
      nameInput.value = users[id] || '';
    });
  }
});
