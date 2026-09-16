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

      const dayNumber = document.createElement("div");
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      const key = `${year}-${month}-${day}`;
      const savedNote = localStorage.getItem(key);

      if (savedNote) {
        const noteText = document.createElement("div");
        noteText.classList.add("note");
        noteText.textContent = savedNote;
        dayCell.appendChild(noteText);
      }

      dayCell.addEventListener("click", () => {
        const oldNote = localStorage.getItem(key) || "";
        const note = prompt("Enter event for this day:", oldNote);

        if (note !== null) {
          if (note.trim() === "") {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, note.trim());
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
