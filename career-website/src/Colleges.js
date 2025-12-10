import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState("");
  const [medium, setMedium] = useState("");
  const user_id = localStorage.getItem("user_id"); // Ensure user_id is stored in localStorage
  // Fetch colleges from backend
  useEffect(() => {
    fetch(`http://localhost:8000/eligible-colleges/${user_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch colleges");
        return res.json();
      })
      .then((data) => setColleges(data))
      .catch((err) => {
        console.error("Error fetching colleges:", err);
        setColleges([]);
      });
  }, []);

  // Filtered colleges
  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(search.toLowerCase()) &&
      (stream === "" || college.stream === stream) &&
      (medium === "" || college.medium === medium)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="text-center py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg gap-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="animate-bounce inline-grid">🎓</span> 
          Suggested Colleges for You
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Discover colleges that align with your goals and preferences.
        </p>
      </header>

      {/* Search + Filters */}
      <div className="mt-8 mb-8 flex flex-wrap items-center justify-between bg-white p-4 rounded-xl shadow">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div className="flex space-x-4 ml-6">
          <select
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          >
            <option value="">Stream</option>
            {[...new Set(colleges.map((c) => c.stream))].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
          >
            <option value="">Medium</option>
            {[...new Set(colleges.map((c) => c.medium))].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid gap-8 md:grid-cols-2 px-4">
        {filteredColleges.length === 0 ? (
          <p className="text-center col-span-2 text-gray-500">
            No colleges found.
          </p>
        ) : (
          filteredColleges.map((college) => (
            <div
              key={college._id}
              className={`flip-container ${
                selectedCollege?._id === college._id ? "flipped expanded" : ""
              }`}
            >
              <div className="flipper">
                {/* Front Card */}
                <div className="front p-6 border rounded-2xl shadow-lg bg-white hover:shadow-xl transition">
                  <h2 className="text-xl font-bold text-indigo-700">{college.name}</h2>
                  <p className="text-gray-600 mt-1">{college.address}</p>
                  <p className="mt-2"><strong>Degrees:</strong> {college.degrees?.length > 0 ? college.degrees.join(", ") : "N/A"}</p>
                  <p className="mt-2"><strong>Stream:</strong> {college.stream}</p>
                  <button
                    onClick={() => setSelectedCollege(college)}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
                  >
                    View More
                  </button>
                </div>

                {/* Back Card / Modal */}
                <div className="back relative p-6 bg-white shadow-xl rounded-2xl overflow-y-auto">
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="absolute top-4 right-4 text-gray-600 text-2xl font-bold hover:text-indigo-600"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl font-extrabold text-indigo-700 mb-4">{college.name}</h2>

                  <div className="space-y-3 text-gray-700">
                    <p><strong>Rank:</strong> {college.rank}</p>
                    <p><strong>Type:</strong> {college.type}</p>
                    <p><strong>Address:</strong> {college.address}</p>
                    <p><strong>Contact:</strong> {college.contact?.join(", ")}</p>
                    <p><strong>Email:</strong> {college.email?.join(", ")}</p>
                    <p><strong>Degrees:</strong> {college.degrees?.join(", ") || "N/A"}</p>
                    <p><strong>Stream:</strong> {college.stream}</p>
                    <p><strong>Medium:</strong> {college.medium}</p>
                    <p><strong>Eligibility:</strong> {college.eligible}</p>
                    {/* ✅ Fix cutoff rendering */}
<div className="mt-2">
  <p><strong>Cutoff (JEE Rank):</strong></p>
  <ul className="ml-4 list-disc">
    {Object.entries(college.cutoff?.jee_rank || {}).map(([cat, val]) => (
      <li key={cat}>{cat}: {val ?? "N/A"}</li>
    ))}
  </ul>

  <p className="mt-2"><strong>Cutoff (NEET Marks):</strong></p>
  <ul className="ml-4 list-disc">
    {Object.entries(college.cutoff?.neet_mark || {}).map(([cat, val]) => (
      <li key={cat}>{cat}: {val ?? "N/A"}</li>
    ))}
  </ul>

  <p className="mt-2"><strong>Cutoff (Board Marks %):</strong></p>
  <ul className="ml-4 list-disc">
    {Object.entries(college.cutoff?.board_marks || {}).map(([cat, val]) => (
      <li key={cat}>{cat}: {val ?? "N/A"}</li>
    ))}
  </ul>
</div>
                    
                    <p><strong>Duration:</strong> {college.duration}</p>
                    <p><strong>Admission Mode:</strong> {college.admissionMode}</p>
                    <p><strong>Admission Date:</strong> {college.admissionDate}</p>
                    <p><strong>Fees:</strong> {college.fees}</p>
                    <p><strong>Required Docs:</strong> {college.docs}</p>
                    <p><strong>Hostel:</strong> {college.hostel}</p>
                    <p><strong>Labs:</strong> {college.lab}</p>
                    <p><strong>Library:</strong> {college.lib}</p>
                    <p><strong>Network:</strong> {college.net}</p>
                    <p><strong>Food:</strong> {college.food}</p>
                    <p><strong>Transport:</strong> {college.transport}</p>
                    <p><strong>Sports:</strong> {college.sports}</p>
                    <p><strong>Disabled Facilities:</strong> {college.disable}</p>
                    <p><strong>Placements:</strong> {college.placements}</p>
                    <p><strong>Career:</strong> {college.career}</p>
                    <p><strong>Alumni:</strong> {college.alumini}</p>
                    <p><strong>Clubs:</strong> {college.clubs}</p>
                    <p><strong>Courses:</strong> {college.courses?.join(", ") || "N/A"}</p>
                    <p><strong>Course IDs:</strong> {college.courseid?.join(", ")}</p>
                    <p><strong>Rating:</strong> ⭐ {college.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Overlay */}
      {selectedCollege && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setSelectedCollege(null)}
        />
      )}

      {/* Flip Card CSS */}
      <style jsx>{`
        .flip-container {
          perspective: 1500px;
          height: 320px;
          position: relative;
        }
        .flipper {
          transition: 0.8s;
          transform-style: preserve-3d;
          height: 100%;
          width: 100%;
          position: relative;
        }
        .flip-container.flipped .flipper {
          transform: rotateY(180deg) scale(1.05);
        }
        .front,
        .back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .front {
          z-index: 2;
        }
        .back {
          transform: rotateY(180deg);
        }
        .flip-container.expanded {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 90vw !important;
          height: 90vh !important;
          z-index: 50;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}
