const calendar = document.getElementById('calendar');

function buildCalendar() {
    const daysInMonth = 30; 
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        day.textContent = i;
        calendar.appendChild(day);
    }
}

buildCalendar();
