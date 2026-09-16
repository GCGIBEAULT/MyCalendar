document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentDate = new Date();

  function buildCalendar() {
    calendar.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("empty");
      calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDate; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("day");
      dayCell.textContent = day;

      const today = new Date();
      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dayCell.classList.add("today");
      }

      const savedNote = localStorage.getItem(`${year}-${month}-${day}`);
      if (savedNote) {
        const noteDot = document.createElement("div");
        noteDot.classList.add("note-dot");
        dayCell.appendChild(noteDot);
      }

      dayCell.addEventListener("click", () => {
        const note = prompt("Enter note for this day:", savedNote || "");
        if (note !== null) {
          if (note.trim() === "") {
            localStorage.removeItem(`${year}-${month}-${day}`);
          } else {
            localStorage.setItem(`${year}-${month}-${day}`, note);
          }
          buildCalendar();
        }
      });

      calendar.appendChild(dayCell);
    }
  }

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    buildCalendar();
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    buildCalendar();
  });

  buildCalendar();
});
