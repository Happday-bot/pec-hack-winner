import React, { useState, useRef, useEffect } from "react";
import { BookOpen, TrendingUp, Award, Hash, Layers, Sparkles } from "lucide-react";
import gsap from "gsap";

const SuggestedCourses = ({ name = "User" }) => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  const [selectedFilter, setSelectedFilter] = useState("interest");
const [searchTerm, setSearchTerm] = useState("");

  const sampleCareerMap = {
    c1: "Software Engineer",
    c2: "Frontend Developer",
    c3: "Backend Developer",
    c4: "Data Scientist",
    c5: "Doctor",
    c6: "Nurse",
    c7: "Teacher",
  };

  const sampleCourses = [
  { _id: "101", course: "B.Sc Computer Science", demand: 1, stream: "Arts & Science", degree: "Bachelors", courseCode: "CS101", careerId: ["c1", "c2"] },
  { _id: "102", course: "B.Tech Computer Engineering", demand: 1, stream: "Engineering", degree: "B.Tech", courseCode: "CE201", careerId: ["c1", "c3"] },
  { _id: "103", course: "B.Sc Nursing", demand: 0, stream: "Medical", degree: "Bachelors", courseCode: "NB301", careerId: ["c6"] },
  { _id: "104", course: "B.A English Literature", demand: 0, stream: "Arts & Science", degree: "Bachelors", courseCode: "EL401", careerId: ["c7"] },
  { _id: "105", course: "B.Tech Mechanical Engineering", demand: 1, stream: "Engineering", degree: "B.Tech", courseCode: "ME501", careerId: ["c1", "c3"] },
  { _id: "106", course: "B.Sc Biotechnology", demand: 1, stream: "Applied Science", degree: "Bachelors", courseCode: "BT601", careerId: ["c4"] },
  { _id: "107", course: "MBBS", demand: 1, stream: "Medical", degree: "Doctorate", courseCode: "MD701", careerId: ["c5"] },
  { _id: "108", course: "B.Ed in Science Education", demand: 0, stream: "Teacher Training", degree: "Bachelors", courseCode: "TE801", careerId: ["c7"] },
  { _id: "109", course: "M.Sc Data Science", demand: 1, stream: "Arts & Science", degree: "Masters", courseCode: "DS901", careerId: ["c4", "c1"] },
  { _id: "110", course: "Diploma in Nursing", demand: 1, stream: "Medical", degree: "Diploma", courseCode: "DN1001", careerId: ["c6"] },
  { _id: "111", course: "M.Tech Artificial Intelligence", demand: 1, stream: "Engineering", degree: "Masters", courseCode: "AI1101", careerId: ["c2", "c3"] },
  { _id: "112", course: "B.Sc Psychology", demand: 0, stream: "Arts & Science", degree: "Bachelors", courseCode: "PS1201", careerId: ["c7"] },
  { _id: "113", course: "B.A Music", demand: 0, stream: "Arts & Science", degree: "Bachelors", courseCode: "MU1301", careerId: ["c7"] },
  { _id: "114", course: "M.Sc Nursing", demand: 1, stream: "Medical", degree: "Masters", courseCode: "MN1401", careerId: ["c6"] },
];


  const [recommendedCourses] = useState(sampleCourses);
  const [isLoading] = useState(false);
  const [demandFilter, setDemandFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [careerFilter, setCareerFilter] = useState("");
  const [careerMap] = useState(sampleCareerMap);

  const streamOptions = ["Arts & Science", "Engineering", "Medical", "Applied Science", "Teacher Training"];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setDemandFilter("");
    setStreamFilter("");
    setCareerFilter("");
  };

  const getFilteredCourses = () => {
  return recommendedCourses.filter((course) => {
    let matches = true;

    // Search filter
    if (searchTerm)
      matches =
        matches &&
        course.course.toLowerCase().includes(searchTerm.toLowerCase());

    // Demand filter
    if (demandFilter === "high")
      matches = matches && course.demand === 1;

    // Stream filter
    if (streamFilter)
      matches = matches && course.stream === streamFilter;

    // Career filter
    if (careerFilter)
      matches =
        matches &&
        course.careerId &&
        course.careerId.some((id) => careerMap[id] === careerFilter);

    return matches;
  });
};



  const filteredCourses = getFilteredCourses();

  const renderCourses = () =>
    filteredCourses.map((course) => (
      <div
        key={course._id}
        ref={addToRefs}
        className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow transition transform cursor-pointer border border-gray-100 flex flex-col justify-between min-h-[200px] hover:shadow-lg hover:-translate-y-0.5 opacity-0"
      >
        {course.demand === 1 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 font-semibold">
            ✅ Demand
          </span>
        )}
        <div>
          <h4 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            {course.course}
          </h4>
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-blue-500" />
              Stream: {course.stream || "N/A"}
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-blue-500" />
              Degree: {course.degree || "N/A"}
            </div>
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-blue-500" />
              Course Code: {course.courseCode || "N/A"}
            </div>
          </div>
        </div>
      </div>
    ));

  useEffect(() => {
    // Hero animation
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
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
    // Animate course cards on every filter change
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.2, // stagger one by one
      }
    );
  }, [filteredCourses]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 md:px-16 rounded-b-3xl overflow-hidden shadow-lg"
      >
    

        {/* Floating shapes */}
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="animate-bounce inline-grid">🎯</span> Suggested Courses for You
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Explore courses based on your qualification and interests.
          </p>
        </div>
        <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20 animate-spin-slow" />
      </section>
      {/* Search Bar */}
<div className="flex justify-center mt-10 px-6">
  <div className="relative w-full max-w-xl">
    <input
      type="text"
      placeholder="Search courses..."
      className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 shadow-md border border-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Search icon */}
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      🔍
    </span>
  </div>
</div>


      {/* Filter buttons */}
      <div className="flex justify-center mt-10">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg flex p-2 space-x-4">
          <button
            onClick={() => handleFilterChange("interest")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedFilter === "interest" ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Based on My Interests
          </button>
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedFilter === "all" ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Eligible Courses
          </button>
        </div>
      </div>

      {/* Dropdown filters */}
      <div className="sticky top-2 z-30 flex justify-center mt-10 px-6 space-x-40">
        <select value={demandFilter} onChange={(e) => setDemandFilter(e.target.value)} className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700">
          <option value="">All</option>
          <option value="high">Demand</option>
        </select>

        <select value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)} className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700">
          <option value="">All Streams</option>
          {streamOptions.map((stream, i) => (
            <option key={i} value={stream}>{stream}</option>
          ))}
        </select>

        <select value={careerFilter} onChange={(e) => setCareerFilter(e.target.value)} className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700">
          <option value="">All Careers</option>
          {Object.values(careerMap).map((career, i) => (
            <option key={i} value={career}>{career}</option>
          ))}
        </select>
      </div>

      {/* Courses */}
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-12">
        {isLoading ? (
          <div className="text-center text-gray-500 animate-pulse">Loading courses...</div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{renderCourses()}</div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <TrendingUp className="mx-auto w-12 h-12 text-gray-400 mb-3" />
            No courses found for the selected filters.
          </div>
        )}
      </main>

      <footer className="bg-gray-100 text-gray-600 text-center py-6 mt-auto border-t">
        © 2025 Career Advisor • Crafted with 💙
      </footer>
    </div>
  );
};

export default SuggestedCourses;
