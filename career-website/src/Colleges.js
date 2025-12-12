import React, { useState, useRef, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import gsap from "gsap";

export default function Colleges() {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const modalRef = useRef(null);
  const [closing, setClosing] = useState(false);

  cardsRef.current = [];

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

const sampleColleges = [
  {
    _id: "col1",
    name: "St. Theresa's Institute of Technology",
    address: "123 Main St, Springfield",
    degrees: ["B.Tech", "M.Tech"],
    stream: "Engineering",
    medium: "English",
    rank: "A1",
    type: "Private",
    contact: ["+1-555-0100"],
    email: ["admissions@sttheresa.edu"],
    eligible: "JEE/Board",
    cutoff: { jee_rank: { General: 15000 }, neet_mark: {}, board_marks: { PCB: 85 } },
    duration: "4 years",
    admissionMode: "Entrance",
    admissionDate: "2026-06-01",
    fees: "₹1,00,000 per year",
    docs: "10th, 12th certificates",
    hostel: "Available",
    lab: "Well-equipped",
    lib: "Extensive",
    net: "Good",
    food: "Cafeteria",
    transport: "Buses",
    sports: "Facilities available",
    disable: "Yes",
    placements: "80%",
    career: "Software Engineer",
    alumini: "Active",
    clubs: "Coding Club, Robotics",
    courses: ["Computer Science", "Information Technology"],
    courseid: ["CS101", "IT102"],
    rating: 4.2,
  },
  {
    _id: "col2",
    name: "Greenfield Medical College",
    address: "45 Health Ave, Metropolis",
    degrees: ["MBBS", "B.Sc Nursing"],
    stream: "Medical",
    medium: "English",
    rank: "A2",
    type: "Public",
    contact: ["+1-555-0200"],
    email: ["info@greenfieldmed.edu"],
    eligible: "NEET/Board",
    cutoff: { jee_rank: {}, neet_mark: { General: 560 }, board_marks: {} },
    duration: "5 years",
    admissionMode: "Merit",
    admissionDate: "2026-07-15",
    fees: "₹2,00,000 per year",
    docs: "NEET score, 12th marksheet",
    hostel: "Available",
    lab: "Clinical labs",
    lib: "Medical library",
    net: "Good",
    food: "Mess",
    transport: "Limited",
    sports: "Limited",
    disable: "Yes",
    placements: "60%",
    career: "Doctor",
    alumini: "Established",
    clubs: "Health Club",
    courses: ["MBBS", "B.Sc Nursing"],
    courseid: ["MB101", "NS201"],
    rating: 4.6,
  },
  {
    _id: "col3",
    name: "Sunrise Arts College",
    address: "78 Art Lane, Harmony City",
    degrees: ["BA", "MA"],
    stream: "Arts",
    medium: "English",
    rank: "B1",
    type: "Private",
    contact: ["+1-555-0300"],
    email: ["contact@sunrisearts.edu"],
    eligible: "Board",
    cutoff: { jee_rank: {}, neet_mark: {}, board_marks: { Arts: 75 } },
    duration: "3 years",
    admissionMode: "Merit",
    admissionDate: "2026-05-10",
    fees: "₹50,000 per year",
    docs: "10th, 12th marksheets",
    hostel: "Not Available",
    lab: "N/A",
    lib: "Art Library",
    net: "Moderate",
    food: "Cafeteria",
    transport: "Limited",
    sports: "Basic facilities",
    disable: "Yes",
    placements: "50%",
    career: "Artist, Designer",
    alumini: "Active",
    clubs: "Music Club, Drama Club",
    courses: ["Fine Arts", "Design"],
    courseid: ["FA101", "DS102"],
    rating: 4.0,
  },
  {
    _id: "col4",
    name: "National Law Academy",
    address: "22 Justice Street, Capital City",
    degrees: ["LLB", "LLM"],
    stream: "Law",
    medium: "English",
    rank: "A3",
    type: "Public",
    contact: ["+1-555-0400"],
    email: ["admissions@nla.edu"],
    eligible: "CLAT",
    cutoff: { jee_rank: {}, neet_mark: {}, board_marks: {} },
    duration: "5 years",
    admissionMode: "Entrance",
    admissionDate: "2026-08-01",
    fees: "₹1,50,000 per year",
    docs: "CLAT score, 12th marksheet",
    hostel: "Available",
    lab: "N/A",
    lib: "Law Library",
    net: "Good",
    food: "Mess",
    transport: "Available",
    sports: "Available",
    disable: "Yes",
    placements: "70%",
    career: "Lawyer",
    alumini: "Established",
    clubs: "Debate Club",
    courses: ["LLB", "LLM"],
    courseid: ["LLB101", "LLM201"],
    rating: 4.5,
  },
  {
    _id: "col5",
    name: "Global Business School",
    address: "10 Corporate Blvd, Metro City",
    degrees: ["BBA", "MBA"],
    stream: "Management",
    medium: "English",
    rank: "B2",
    type: "Private",
    contact: ["+1-555-0500"],
    email: ["info@globalbs.edu"],
    eligible: "CAT/XAT/Board",
    cutoff: { jee_rank: {}, neet_mark: {}, board_marks: { Commerce: 80 } },
    duration: "3 years",
    admissionMode: "Entrance",
    admissionDate: "2026-06-20",
    fees: "₹1,20,000 per year",
    docs: "10th, 12th marksheets, CAT/XAT",
    hostel: "Available",
    lab: "Computer Lab",
    lib: "Business Library",
    net: "Good",
    food: "Cafeteria",
    transport: "Available",
    sports: "Gym",
    disable: "Yes",
    placements: "75%",
    career: "Manager, Analyst",
    alumini: "Active",
    clubs: "Entrepreneurship Club",
    courses: ["Business Administration", "Finance"],
    courseid: ["BBA101", "MBA201"],
    rating: 4.3,
  },
  {
    _id: "col6",
    name: "Tech Innovators Institute",
    address: "5 Innovation Road, Silicon Valley",
    degrees: ["B.Tech", "M.Tech", "PhD"],
    stream: "Engineering",
    medium: "English",
    rank: "A2",
    type: "Private",
    contact: ["+1-555-0600"],
    email: ["admissions@techinnovators.edu"],
    eligible: "JEE/Board",
    cutoff: { jee_rank: { General: 12000 }, neet_mark: {}, board_marks: {} },
    duration: "4 years",
    admissionMode: "Entrance",
    admissionDate: "2026-06-15",
    fees: "₹1,50,000 per year",
    docs: "10th, 12th certificates",
    hostel: "Available",
    lab: "Advanced Labs",
    lib: "Technical Library",
    net: "Excellent",
    food: "Cafeteria",
    transport: "Buses",
    sports: "Facilities available",
    disable: "Yes",
    placements: "85%",
    career: "Software Engineer, Researcher",
    alumini: "Active",
    clubs: "Robotics Club, AI Club",
    courses: ["Computer Science", "AI & ML", "Electronics"],
    courseid: ["CS201", "AI301", "EC101"],
    rating: 4.7,
  }
];

  const [colleges, setColleges] = useState(sampleColleges);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState("");
  const [medium, setMedium] = useState("");

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(search.toLowerCase()) &&
      (stream === "" || college.stream === stream) &&
      (medium === "" || college.medium === medium)
  );

  useEffect(() => {
    // Hero animation
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Floating shapes
    gsap.to(".floating-shape", {
      y: "-=20",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
      stagger: 0.3,
    });
  }, []);

  useEffect(() => {
    // Animate cards only once on mount
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, []);

  const closeModal = () => {
    if (!modalRef.current) return;
    setClosing(true);

    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: () => {
        setSelectedCollege(null);
        setClosing(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 md:px-16 rounded-b-3xl overflow-hidden shadow-lg">
        {/* Floating shapes */}
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="animate-bounce inline-grid">🎓</span> Suggested Colleges for You
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">Discover colleges that align with your goals and preferences.</p>
        </div>
        <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20 animate-spin-slow" />
      </section>

      {/* Search + Filters */}
      <div className="mt-8 mb-8 flex flex-wrap items-center justify-between bg-white p-4 rounded-xl shadow max-w-[1830px] w-[98%] mx-auto">
        <div className="relative w-120 w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
        <div className="flex space-x-4 ml-6 mt-2 md:mt-0">
          <select className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400" value={stream} onChange={(e) => setStream(e.target.value)}>
            <option value="">Stream</option>
            {[...new Set(colleges.map((c) => c.stream))].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400" value={medium} onChange={(e) => setMedium(e.target.value)}>
            <option value="">Medium</option>
            {[...new Set(colleges.map((c) => c.medium))].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 justify-items-center items-start">
        {filteredColleges.length === 0 ? (
          <p className="text-center col-span-2 text-gray-500">No colleges found.</p>
        ) : (
          filteredColleges.map((college) => (
            <div key={college._id} ref={addToRefs} className="w-full max-w-xl relative">
              <div className="p-4 border rounded-2xl shadow-lg bg-white hover:shadow-xl transition w-full">
                <h2 className="text-xl font-bold text-indigo-700">{college.name}</h2>
                <p className="text-gray-600 mt-1">{college.address}</p>
                <p className="mt-2"><strong>Degrees:</strong> {college.degrees?.join(", ") || "N/A"}</p>
                <p className="mt-2"><strong>Stream:</strong> {college.stream}</p>
                <button
                  onClick={() => setSelectedCollege(college)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
                >
                  View More
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedCollege && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={closeModal}
          />
          <div
            ref={modalRef}
            className={`fixed top-1/2 left-1/2 w-[90vw] h-[90vh] bg-white shadow-2xl rounded-2xl p-6 overflow-y-auto z-50 transform -translate-x-1/2 -translate-y-1/2`}
            style={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 text-2xl font-bold hover:text-indigo-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold text-indigo-700 mb-4">{selectedCollege.name}</h2>
            <p><strong>Address:</strong> {selectedCollege.address}</p>
            <p><strong>Degrees:</strong> {selectedCollege.degrees.join(", ")}</p>
            <p><strong>Stream:</strong> {selectedCollege.stream}</p>
            <p><strong>Medium:</strong> {selectedCollege.medium}</p>
            <p><strong>Rank:</strong> {selectedCollege.rank}</p>
            <p><strong>Type:</strong> {selectedCollege.type}</p>
            <p><strong>Contact:</strong> {selectedCollege.contact.join(", ")}</p>
            <p><strong>Email:</strong> {selectedCollege.email.join(", ")}</p>
            <p><strong>Eligible Exams:</strong> {selectedCollege.eligible}</p>
            <p><strong>Cutoff:</strong> JEE - {selectedCollege.cutoff.jee_rank.General || "N/A"}, NEET - {selectedCollege.cutoff.neet_mark.General || "N/A"}</p>
            <p><strong>Duration:</strong> {selectedCollege.duration}</p>
            <p><strong>Admission Mode:</strong> {selectedCollege.admissionMode}</p>
            <p><strong>Fees:</strong> {selectedCollege.fees}</p>
            <p><strong>Hostel:</strong> {selectedCollege.hostel}</p>
            <p><strong>Labs:</strong> {selectedCollege.lab}</p>
            <p><strong>Library:</strong> {selectedCollege.lib}</p>
            <p><strong>Placements:</strong> {selectedCollege.placements}</p>
            <p><strong>Career:</strong> {selectedCollege.career}</p>
            <p><strong>Clubs:</strong> {selectedCollege.clubs}</p>
          </div>
        </>
      )}
    </div>
  );
}
