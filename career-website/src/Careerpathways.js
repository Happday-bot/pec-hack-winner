import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoadmapPage from "./RoadmapPage";

gsap.registerPlugin(ScrollTrigger);

const CareerPathways = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  const [careerData, setCareerData] = useState({ categories: [], data: {} });
  const [allCareers, setAllCareers] = useState([]);
  const [myCareers, setMyCareers] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
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
    // Only basic career info on Career page
    const sampleAllCareers = [
      {
        _id: "c101",
        title: "Frontend Developer",
        description: "Build user interfaces using HTML, CSS and JavaScript frameworks.",
        streams: ["Engineering"],
      },
      {
        _id: "c104",
        title: "Backend Developer",
        description: "Build and maintain server-side logic, databases, and API integrations.",
        streams: ["Engineering"],
      },
      {
        _id: "c102",
        title: "Data Scientist",
        description: "Work with data, models and analytics to derive insights.",
        streams: ["Arts & Science"],
      },
      {
        _id: "c105",
        title: "UI/UX Designer",
        description: "Design user-friendly digital experiences using design tools and principles.",
        streams: ["Arts & Science"],
      },
      {
        _id: "c106",
        title: "Doctor",
        description: "Diagnose illnesses and provide medical treatment.",
        streams: ["Medical"],
      },
      {
        _id: "c107",
        title: "Machine Learning Engineer",
        description: "Build predictive ML models and production-ready AI systems.",
        streams: ["Engineering"],
      },
    ];

    setAllCareers(sampleAllCareers);
    setMyCareers([sampleAllCareers[0]]);
  }, []);

  useEffect(() => {
    const careers = selectedFilter === "interest" ? myCareers : allCareers;
    const grouped = {};
    careers.forEach((career) => {
      const category = career.streams?.[0] || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(career);
    });
    const categories = Object.keys(grouped);
    setCareerData({ categories, data: grouped });
    if (categories.length > 0) setActiveTab(categories[0]);
  }, [selectedFilter, myCareers, allCareers]);

  const handleCareerClick = (career) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedCareer(career); // pass entire career object
  };

  if (selectedCareer) {
    return <RoadmapPage course={selectedCareer} goBack={() => setSelectedCareer(null)} />;
  }

  const filteredCareers =
    careerData.data[activeTab]?.filter((career) =>
      career.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 text-gray-900 flex flex-col font-sans">
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 md:px-16 rounded-b-3xl overflow-hidden shadow-lg"
      >
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="text-indigo-200 animate-bounce inline-block">🚀</span>
            Career Pathways for You
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Explore potential job roles and career growth opportunities.
          </p>
        </div>
        <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20 animate-spin-slow" />
      </section>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-xl mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow flex p-1 space-x-2">
            {["interest", "all"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedFilter === filter
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-100"
                }`}
              >
                {filter === "interest" ? "Based on My Interests" : "All Eligible Careers"}
              </button>
            ))}
          </div>
        </div>

        <section className="w-full max-w-5xl bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
          <div className="flex overflow-x-auto space-x-3 mb-6 pb-2 border-b">
            {careerData.categories.map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredCareers.length > 0 ? (
              filteredCareers.map((career) => (
                <div
                  key={career._id}
                  ref={addToRefs}
                  className="p-5 bg-indigo-50 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => handleCareerClick(career)}
                >
                  <h3 className="font-bold text-xl text-indigo-700 mb-2">{career.title}</h3>
                  <p className="text-gray-700 mb-3">{career.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No careers found.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-indigo-50 text-gray-600 text-center py-4 mt-auto border-t">
        &copy; 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
};

export default CareerPathways;
