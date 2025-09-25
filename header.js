// header.js

function createFloatingHeader() {
    // Create header container
    const header = document.createElement('div');
    header.id = 'floatingHeader';
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.zIndex = '9999';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '10px 20px';
    header.style.backgroundColor = 'rgba(245,245,245,0.95)';
    header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    header.style.fontFamily = 'Arial, sans-serif';

    // Logo
    const logo = document.createElement('img');
    logo.src = 'assets/logo.png'; // <-- Replace with your logo path
    logo.alt = 'Bench Logo';
    logo.style.height = '50px';
    header.appendChild(logo);

    // Analog clock
    const canvas = document.createElement('canvas');
    canvas.id = 'analogClock';
    canvas.width = 80;
    canvas.height = 80;
    header.appendChild(canvas);

    // Digital clock
    const digital = document.createElement('div');
    digital.id = 'digitalTime';
    digital.style.fontSize = '18px';
    digital.style.fontFamily = 'monospace';
    header.appendChild(digital);

    // Username display
    const userDiv = document.createElement('div');
    userDiv.id = 'usernameDisplay';
    userDiv.style.fontSize = '16px';
    userDiv.style.marginLeft = '15px';
    header.appendChild(userDiv);

    document.body.appendChild(header);

    // Add top padding so page content is not hidden
    document.body.style.paddingTop = header.offsetHeight + 'px';

    // Start clocks
    startAnalogClock();
    startDigitalClock();

    // Load username from user.txt
    fetch('user.txt')
        .then(res => {
            if (!res.ok) throw new Error('user.txt not found');
            return res.text();
        })
        .then(data => {
            userDiv.textContent = `User: ${data}`;
        })
        .catch(err => {
            userDiv.textContent = 'User: N/A';
            console.error(err);
        });
}

// Analog clock
function startAnalogClock() {
    const canvas = document.getElementById('analogClock');
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function drawClock() {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    }

    setInterval(drawClock, 1000);

    function drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    function drawNumbers(ctx, radius) {
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (let num = 1; num <= 12; num++) {
            let ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius) {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6*60)) + (second * Math.PI / (360*60));
        drawHand(ctx, hour, radius * 0.5, 6);

        minute = (minute * Math.PI / 30) + (second * Math.PI / (30*60));
        drawHand(ctx, minute, radius * 0.8, 4);

        second = (second * Math.PI / 30);
        drawHand(ctx, second, radius * 0.9, 2, 'red');
    }

    function drawHand(ctx, pos, length, width, color='#333') {
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
}

// Digital clock
function startDigitalClock() {
    function updateTime() {
        const now = new Date();
        document.getElementById('digitalTime').textContent = now.toLocaleTimeString();
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// Initialize header after DOM is loaded
document.addEventListener('DOMContentLoaded', createFloatingHeader);
