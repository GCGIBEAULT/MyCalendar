const SUPABASE_URL = "https://axgewhvvcrafpndvojjh.supabase.co";
const SUPABASE_KEY = "sb_publishable_QTzdQqZXFeKvMZ2OZP24RA_9ocTNGa_";

document.addEventListener("DOMContentLoaded", async () => {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  let currentDate = new Date();
  let events = {};

  function isoDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  // Copy old laptop appointments into Supabase.
  async function migrateOldAppointments() {
    const oldAppointments = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Old calendar format was YEAR-ZEROBASEDMONTH-DAY
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(key)) {
        const text = localStorage.getItem(key);

        if (!text || !text.trim()) continue;

        const [year, oldMonth, day] = key.split("-").map(Number);

        const eventDate =
          `${year}-${String(oldMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        oldAppointments.push({
          event_date: eventDate,
          event_text: text.trim()
        });
      }
    }

    if (oldAppointments.length === 0) return;

    const { error } = await supabaseClient
      .from("calendar_events")
      .upsert(oldAppointments, {
        onConflict: "event_date",
        ignoreDuplicates: true
      });

    if (error) {
      console.error("Migration error:", error);
      alert("Your old appointments could not be copied.");
    }
  }

  async function loadEvents() {
    const { data, error } = await supabaseClient
      .from("calendar_events")
      .select("event_date,event_text");

    if (error) {
      console.error(error);
      alert("Calendar could not connect to Supabase.");
      return;
    }

    events = {};

    data.forEach(row => {
      events[row.event_date] = row.event_text;
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

      const eventDate = isoDate(year, month, day);
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
          const { error } = await supabaseClient
            .from("calendar_events")
            .delete()
            .eq("event_date", eventDate);

          if (error) {
            alert("Could not delete event.");
            return;
          }

          delete events[eventDate];
        } else {
          const { error } = await supabaseClient
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

  await migrateOldAppointments();
  await loadEvents();
});
