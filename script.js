const calendar = document.getElementById('calendar');

const year = new Date().getFullYear();
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function buildCalendar() {
  months.forEach((month, m) => {
    const monthLabel = document.createElement('div');
    monthLabel.className = 'month-label';
    monthLabel.textContent = month;
    calendar.appendChild(monthLabel);

    const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    daysOfWeek.forEach(d => {
      const dow = document.createElement('div');
      dow.className = 'dow';
      dow.textContent = d;
      calendar.appendChild(dow);
    });

    const firstDay = new Date(year, m, 1).getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'day blank';
      calendar.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const div = document.createElement('div');
      div.className = 'day';
      div.textContent = day;

      div.onclick = () => {
        const note = prompt(`Note for ${month} ${day}, ${year}`);
        if (note !== null) {
          localStorage.setItem(`${year}-${m+1}-${day}`, note);
        }
      };

      calendar.appendChild(div);
    }
  });
}

buildCalendar();
