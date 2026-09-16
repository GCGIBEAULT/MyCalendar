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

    // Empty spaces before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("empty");
      calendar.appendChild(emptyCell);
    }

    // Build each day
    for (let day = 1; day <= lastDate; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("day");

      const dayNumber = document.createElement("div");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      // Highlight today's date
      const today = new Date();

      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dayCell.classList.add("today");
      }

      // Saved appointment/note
      const key = `${year}-${month}-${day}`;
      const savedNote = localStorage.getItem(key);

      if (savedNote) {
        const noteText = document.createElement("div");
        noteText.classList.add("note");
        noteText.textContent = savedNote;
        dayCell.appendChild(noteText);
      }

      // Click a date to add or edit an appointment
      dayCell.addEventListener("click", () => {
        const currentNote = localStorage.getItem(key) || "";

        const note = prompt(
          "Enter event for this day:",
          currentNote
        );

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

  // Previous month
  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    buildCalendar();
  });

  // Next month
  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    buildCalendar();
  });

  buildCalendar();
});
