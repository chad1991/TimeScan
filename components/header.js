// Digital Clock
function updateDigitalClock() {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('digitalClock').textContent = now.toLocaleTimeString([], options);
}
setInterval(updateDigitalClock, 1000);
updateDigitalClock();

// Analog Clock setup
const canvas = document.getElementById('analogClock');
const ctx = canvas.getContext('2d');
const radius = canvas.height / 2;
ctx.translate(radius, radius);

function drawClock() {
  ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
  drawFace(ctx, radius);
  drawMarkers(ctx, radius);
  drawHands(ctx, radius);
}
function drawFace(ctx, radius) { /* draws clock face and center */ }
function drawMarkers(ctx, radius) { /* draws hour markers */ }
function drawHands(ctx, radius) { /* draws hour, minute, second hands */ }
function drawHand(ctx, pos, length, width, color = '#333') { /* helper for hands */ }

setInterval(drawClock, 1000);
drawClock();
