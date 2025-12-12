import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const TimelineTracker = () => {
  const heroRef = useRef(null);

  // Floating + Fade-in Hero Animation
  useEffect(() => {
    if (heroRef.current) {
      // Hero fade in
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      // Floating bubbles
      gsap.to(".floating-shape", {
        y: "-=20",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
        stagger: 0.3,
      });
    }
  }, []);

  // -----------------------------
  // Existing Timeline Tracker Code
  // -----------------------------
  const sampleEvents = [
    {
      _id: "1",
      title: "Sample Exam",
      date: "2025-12-15T09:00:00Z",
      event_type: "Exam",
      source_name: "School",
    },
    {
      _id: "2",
      title: "Scholarship Deadline",
      date: "2025-12-20T23:59:00Z",
      event_type: "Deadline",
      source_name: "Scholarship Board",
    },
  ];

  const [upcomingEvents, setUpcomingEvents] = useState(
    sampleEvents.map((event) => {
      const dateObj = new Date(event.date);
      const dateKey = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
      return { ...event, dateKey };
    })
  );

  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    { name: "January", month: 0 },
    { name: "February", month: 1 },
    { name: "March", month: 2 },
    { name: "April", month: 3 },
    { name: "May", month: 4 },
    { name: "June", month: 5 },
    { name: "July", month: 6 },
    { name: "August", month: 7 },
    { name: "September", month: 8 },
    { name: "October", month: 9 },
    { name: "November", month: 10 },
    { name: "December", month: 11 },
  ];

  const today = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const currentMonth = months[currentMonthIndex];

  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrent: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isCurrent: true });
    }
    let nextDay = 1;
    while (days.length % 7 !== 0) {
      days.push({ day: nextDay++, isCurrent: false });
    }
    return days;
  };

  const days = getCalendarDays(today.getFullYear(), currentMonth.month);

  const dateKey = (day, isCurrent) =>
    isCurrent
      ? `${today.getFullYear()}-${String(currentMonth.month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`
      : "other";

  const dayCell = (isCurrent, hasEvent, isActive, isToday) => ({
    borderRadius: "12px",
    padding: "14px 0",
    border: isCurrent
      ? hasEvent
        ? isActive
          ? "2px solid #2563eb"
          : "1px dashed rgba(37, 99, 235, 0.4)"
        : "1px dashed rgba(37, 99, 235, 0.2)"
      : "1px solid rgba(200,200,200,0.3)",
    backgroundColor: isActive ? "#2563eb" : isToday ? "#bfdbfe" : "#fff",
    color: isActive ? "#fff" : hasEvent ? "#1e40af" : "rgba(120,120,120,0.6)",
    fontWeight: hasEvent ? "600" : "400",
    fontSize: "15px",
    transition: "all 0.3s ease",
    cursor: hasEvent ? "pointer" : "default",
    opacity: hasEvent ? 1 : 0.5,
    position: "relative",
  });

  const dailySummaries = {};
  upcomingEvents.forEach((event) => {
    dailySummaries[event.dateKey] = event.title;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ⭐⭐⭐ BLUE HEADER WITH FLOATING SHAPES ⭐⭐⭐ */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 md:px-16 rounded-b-3xl overflow-hidden shadow-lg"
      >
        {/* Floating shapes */}
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 flex justify-center items-center gap-3">
            <span className="animate-bounce text-yellow-300 text-5xl">📅</span>
            Timeline Tracker
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Stay on top of your events and deadlines with an interactive timeline.
          </p>
        </div>
      </section>

      {/* BODY */}
      <div className="flex flex-1 p-8 gap-6">
        {/* Calendar Section */}
        <main className="flex-1">
          <div className="bg-gradient-to-r from-sky-200 to-blue-400 rounded-2xl p-8 shadow flex flex-col">
            {/* Month selector */}
            <div className="flex justify-center mb-6 gap-3 flex-wrap">
              {months.map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentMonthIndex(i);
                    setHoveredDate(null);
                    setSelectedDate(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentMonthIndex === i
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-800"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Calendar Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "10px",
                textAlign: "center",
                flexGrow: 1,
                minHeight: "400px",
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name) => (
                <div key={name} style={{ fontWeight: "700", opacity: 0.8 }}>
                  {name}
                </div>
              ))}

              {days.map((d, i) => {
                const key = dateKey(d.day, d.isCurrent);
                const hasEvent = d.isCurrent && dailySummaries[key] !== undefined;
                const isToday =
                  d.isCurrent &&
                  d.day === today.getDate() &&
                  currentMonthIndex === today.getMonth();
                const isActive =
                  selectedDate === key
                    ? true
                    : hoveredDate === key && selectedDate !== key;

                return (
                  <div
                    key={i}
                    style={dayCell(d.isCurrent, hasEvent, isActive, isToday)}
                    onMouseEnter={() => hasEvent && setHoveredDate(key)}
                    onMouseLeave={() => setHoveredDate(null)}
                    onClick={() => hasEvent && setSelectedDate(key)}
                  >
                    {d.day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Summary */}
          <div className="mt-6 bg-white border-2 border-blue-300 rounded-2xl p-6 shadow">
            <h3 className="text-blue-900 font-bold mb-2 text-lg">Daily Summary</h3>
            <p className="text-gray-700 text-sm">
              {selectedDate && dailySummaries[selectedDate]
                ? dailySummaries[selectedDate]
                : hoveredDate && dailySummaries[hoveredDate]
                ? dailySummaries[hoveredDate]
                : "Hover over or click a date to see the event."}
            </p>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 bg-white rounded-xl shadow p-5 border border-gray-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            📌 Upcoming Events
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded shadow-sm"
              >
                <p className="font-semibold text-blue-800">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {event.event_type}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Source: {event.source_name}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 border-t border-gray-200 mt-auto">
        &copy; 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
};

export default TimelineTracker;
