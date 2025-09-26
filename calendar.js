let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar(month = currentMonth, year = currentYear) {
  const calendarBox = document.getElementById("calendar-box");

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let table = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <button onclick="prevMonth()" style="padding:5px 10px;">◀</button>
      <h3 style="margin:0;">${months[month]} ${year}</h3>
      <button onclick="nextMonth()" style="padding:5px 10px;">▶</button>
    </div>
    <div style="text-align:center; margin-bottom:10px;">
      <button onclick="goToday()" style="padding:5px 15px; background:#eee; border:1px solid #ccc; border-radius:5px;">Today</button>
    </div>
    <table style="width:100%; text-align:center; border-collapse: collapse;">
      <tr>
        <th>Sun</th><th>Mon</th><th>Tue</th>
        <th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
      </tr><tr>
  `;

  for (let i = 0; i < firstDay; i++) {
    table += "<td></td>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const today = new Date();
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    table += `<td style="padding:5px; border:1px solid #ddd; ${
      isToday ? "background:#ffcccc; font-weight:bold;" : ""
    }">${day}</td>`;

    if ((firstDay + day) % 7 === 0 && day !== daysInMonth) {
      table += "</tr><tr>";
    }
  }

  table += "</tr></table>";
  calendarBox.innerHTML = table;
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
}

function goToday() {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  generateCalendar(currentMonth, currentYear);
}

document.addEventListener("DOMContentLoaded", () => {
  generateCalendar();
});
