import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import RoadmapPage from "./RoadmapPage";

const CareerPathways = () => {
  const [careerData, setCareerData] = useState({ categories: [], data: {} });
  const [allCareers, setAllCareers] = useState([]);
  const [myCareers, setMyCareers] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    fetch(`http://localhost:8000/career/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setMyCareers(data.mycareers || []);
        setAllCareers(data.all_careers || []);
      })
      .catch((err) => console.error("Error fetching careers:", err));
  }, []);

  // regroup data whenever filter changes
  useEffect(() => {
    const careers = selectedFilter === "interest" ? myCareers : allCareers;

    const grouped = {};
    careers.forEach((career) => {
      const category = career.streams?.[0] || "Other";

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({
        id: career._id,
        roadmap: career.roadmap,
        title: career.title,
        description: career.description || "Details not available",
        required_courses: career.required_courses || [],
        raw: career,
      });
    });

    const categories = Object.keys(grouped);
    setCareerData({ categories, data: grouped });
    if (categories.length > 0) setActiveTab(categories[0]);
  }, [selectedFilter, myCareers, allCareers]);

  const handleCareerClick = (career) => {
    console.log("Selected career for roadmap:", career);
    setSelectedCareer(career);
  };

  if (selectedCareer) {
    return (
      <RoadmapPage
        course={selectedCareer}
        goBack={() => setSelectedCareer(null)}
      />
    );
  }

  const filteredCareers =
    careerData.data[activeTab]
      ?.filter((career) =>
        career.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 text-gray-900 flex flex-col font-sans">
      <header className="text-center py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="text-indigo-200 animate-bounce inline-block">🚀</span>
          Career Pathways for You
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Explore potential job roles and career growth opportunities.
        </p>
      </header>

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

        {/* Filter Toggle */}
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
                  {filter === "interest" ? "Based on My Interests" : "All"}
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
                  key={career.id}
                  className="p-5 bg-indigo-50 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => handleCareerClick(career.roadmap)}
                >
                  <h3 className="font-bold text-xl text-indigo-700 mb-2">
                    {career.title}
                  </h3>
                  <p className="text-gray-700 mb-3">{career.description}</p>
                  {career.required_courses.length > 0 && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-indigo-600 mb-2">
                        Required Courses:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {career.required_courses.map((course, idx) => (
                          <li key={idx} className="text-gray-700">
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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

