const SUPABASE_URL = "https://axgewhvvcrafpndvojjh.supabase.co";
const SUPABASE_KEY = "sb_publishable_QTzdQqZXFeKvMZ2OZP24RA_9ocTNGa_";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentDate = new Date();
  let events = {};

  function getDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  async function loadEvents() {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*");

    if (error) {
      console.error("Error loading events:", error);
      return;
    }

    events = {};

    data.forEach(item => {
      events[item.event_date] = item.event_text;
    });

    buildCalendar();
  }

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
      dayNumber.classList.add("day-number");
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      const today = new Date();

      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dayCell.classList.add("today");
      }

      const eventDate = getDateString(year, month, day);
      const savedNote = events[eventDate];

      if (savedNote) {
        const noteText = document.createElement("div");
        noteText.classList.add("note");
        noteText.textContent = savedNote;
        dayCell.appendChild(noteText);
      }

      dayCell.addEventListener("click", async () => {
        const currentNote = events[eventDate] || "";

        const note = prompt(
          "Enter event for this day:",
          currentNote
        );

        if (note === null) return;

        if (note.trim() === "") {
          const { error } = await supabase
            .from("calendar_events")
            .delete()
            .eq("event_date", eventDate);

          if (error) {
            console.error("Error deleting event:", error);
            alert("Could not delete event.");
            return;
          }

          delete events[eventDate];
        } else {
          const { error } = await supabase
            .from("calendar_events")
            .upsert(
              {
                event_date: eventDate,
                event_text: note.trim()
              },
              {
                onConflict: "event_date"
              }
            );

          if (error) {
            console.error("Error saving event:", error);
            alert("Could not save event.");
            return;
          }

          events[eventDate] = note.trim();
        }

        buildCalendar();
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

  loadEvents();
});
