// header.js
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
  header.style.backgroundColor = 'rgba(245,245,245,0.95)';
  header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  header.style.padding = '10px 20px';
  header.style.fontFamily = 'Arial, sans-serif';

  // Logo
  const logo = document.createElement('png');
  logo.src = 'assets/logo.png'; // <-- Adjust path if needed
  logo.alt = 'Bench Logo';
  logo.style.height = '50px';
  header.appendChild(logo);

  // Analog Clock
  const canvas = document.createElement('canvas');
  canvas.id = 'analogClock';
  canvas.width = 60;
  canvas.height = 60;
  header.appendChild(canvas);

  // Digital Clock
  const digital = document.createElement('div');
  digital.id = 'digitalTime';
  digital.style.fontSize = '16px';
  digital.style.fontFamily = 'monospace';
  header.appendChild(digital);

  // Username display
  const userDiv = document.createElement('div');
  userDiv.id = 'usernameDisplay';
  userDiv.style.marginLeft = '15px';
  userDiv.style.fontSize = '16px';
  header.appendChild(userDiv);

  document.body.appendChild(header);

  // ---------------- Clocks ----------------
  startAnalogClock();
  startDigitalClock();

  function startAnalogClock() {
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function drawClock() {
      ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
      drawFace();
      drawNumbers();
      drawTime();
    }

    function drawFace() {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#333';
      ctx.fill();
    }

    function drawNumbers() {
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

    function drawTime() {
      const now = new Date();
      let hour = now.getHours() % 12;
      let minute = now.getMinutes();
      let second = now.getSeconds();

      drawHand((hour + minute/60 + second/3600) * Math.PI/6, radius*0.5, 4);
      drawHand((minute + second/60) * Math.PI/30, radius*0.8, 3);
      drawHand(second * Math.PI/30, radius*0.9, 1, 'red');
    }

    function drawHand(pos, length, width, color='#333') {
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
  }

  function startDigitalClock() {
    function update() {
      const now = new Date();
      digital.textContent = now.toLocaleTimeString();
    }
    update();
    setInterval(update, 1000);
  }

  // ---------------- Load users.txt ----------------
  const users = {};
  fetch('users.txt')
    .then(res => {
      if (!res.ok) throw new Error('users.txt not found');
      return res.text();
    })
    .then(text => {
      text.split('\n').forEach(line => {
        const [id, name] = line.split(',');
        if (id && name) users[id.trim()] = name.trim();
      });
      userDiv.textContent = `Loaded ${Object.keys(users).length} users`;
    })
    .catch(err => {
      userDiv.textContent = 'User file not found';
      console.error(err);
    });

  // ---------------- Auto-fill name ----------------
  const idInput = document.getElementById('idNumber');
  const nameInput = document.getElementById('name');

  if (idInput && nameInput) {
    idInput.addEventListener('input', () => {
      const id = idInput.value.trim();
      nameInput.value = users[id] || '';
    });
  }

  // ---------------- Log & Summary ----------------
  const lastStatusTimestamps = {};
  let logs = JSON.parse(localStorage.getItem("logs")) || [];
  let summaryData = JSON.parse(localStorage.getItem("summary")) || {};

  // Functions used by buttons
  window.markStatus = function(status) {
    const name = nameInput.value;
    const id = idInput.value.trim();
    if (!name || !id) { alert("Enter valid ID from users.txt"); return; }

    const now = new Date();
    const key = `${name}_${id}`;

    const logEntry = { name, id, status, timestamp: now.toLocaleString(), duration: '-' };

    const lastEntry = lastStatusTimestamps[key];
    if (lastEntry && lastEntry.status !== status) {
      const diffMs = Math.abs(now - lastEntry.time);
      const diffMin = Math.round(diffMs/60000);
      logEntry.duration = diffMin;
      delete lastStatusTimestamps[key];
    } else {
      lastStatusTimestamps[key] = { status, time: now };
    }

    logs.push(logEntry);
    localStorage.setItem("logs", JSON.stringify(logs));
    addRow(logEntry);
    generateSummary();
    clearForm();
  };

  function addRow(log) {
    const tbody = document.querySelector('#logTable tbody');
    const row = tbody.insertRow();
    row.insertCell(0).innerText = log.name;
    row.insertCell(1).innerText = log.id;
    row.insertCell(2).innerText = log.status;
    row.insertCell(3).innerText = log.timestamp;
    row.insertCell(4).innerText = log.duration || '-';
  }

  window.clearForm = function() {
    idInput.value = '';
    nameInput.value = '';
    idInput.focus();
  };

  window.saveAsTxt = function() {
    let txt = '--- IN/OUT Log ---\n';
    document.querySelectorAll('#logTable tr').forEach(row => {
      const cols = row.querySelectorAll('th, td');
      txt += Array.from(cols).map(c => c.innerText).join('\t') + '\n';
    });
    txt += '\n--- Summary ---\n';
    document.querySelectorAll('#summaryTable tr').forEach(row => {
      const cols = row.querySelectorAll('th, td');
      txt += Array.from(cols).map(c => c.innerText).join('\t') + '\n';
    });
    const blob = new Blob([txt], {type:'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'INOUT_Log.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.generateSummary = function() {
    const userLogs = {};
    logs.forEach(log => {
      const key = `${log.name}_${log.id}`;
      if (!userLogs[key]) userLogs[key] = [];
      userLogs[key].push({status: log.status, time: new Date(log.timestamp)});
    });

    summaryData = {};
    for (const key in userLogs) {
      const sorted = userLogs[key].sort((a,b)=>a.time-b.time);
      let totalMinutes=0, sessions=0;
      for (let i=0;i<sorted.length-1;i++){
        const a=sorted[i], b=sorted[i+1];
        if(a.status!==b.status){
          const diff = Math.round(Math.abs(b.time-a.time)/60000);
          totalMinutes+=diff;
          sessions++;
          i++;
        }
      }
      summaryData[key]={name:key.split('_')[0], id:key.split('_')[1], total:totalMinutes, count:sessions};
    }
    localStorage.setItem("summary", JSON.stringify(summaryData));
    renderSummary();
  };

  function renderSummary() {
    const tbody = document.querySelector('#summaryTable tbody');
    tbody.innerHTML='';
    for(const key in summaryData){
      const data = summaryData[key];
      const row = tbody.insertRow();
      row.insertCell(0).innerText = data.name;
      row.insertCell(1).innerText = data.id;
      row.insertCell(2).innerText = data.total;
      row.insertCell(3).innerText = data.count;
    }
  }

  window.clearHistory = function(){
    if(confirm("Clear all logs and summary?")){
      logs=[]; summaryData={};
      localStorage.removeItem("logs");
      localStorage.removeItem("summary");
      document.querySelector('#logTable tbody').innerHTML='';
      document.querySelector('#summaryTable tbody').innerHTML='';
    }
  };

  // Load saved logs on start
  logs.forEach(log=>addRow(log));
  renderSummary();

});
