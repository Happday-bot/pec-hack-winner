import React, { useState, useEffect } from "react";
import { ArrowRight, XCircle } from "lucide-react";

const RoadmapPage = ({ course, goBack }) => {
  const [roadmap, setRoadmap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        // ✅ Use roadmap_id if exists, fallback to hardcoded test ID
        const roadmapId = course;
        const res = await fetch(`http://localhost:8000/roadmap/${roadmapId}`);
        if (!res.ok) throw new Error("Failed to fetch roadmap");
        const data = await res.json();

        console.log("Fetched roadmap data:", data);
        console.log("RoadmapId data:", data);

        const structuredRoadmap = {};
        if (data && Array.isArray(data.skill_levels)) {

          data.skill_levels.forEach((lvl) => {
            const level = lvl.level || "Other";
            if (!structuredRoadmap[level]) structuredRoadmap[level] = [];

            lvl.skills.forEach((skill) => {
              const resources = [];

              // Handle 'learning_resources'
              if (skill.learning_resources) {
                Object.values(skill.learning_resources).forEach((arr) =>
                  arr.forEach((r) =>
                    resources.push({
                      title: r.title,
                      url: r.url,
                      resource_type: r.resource_type || "Resource",
                    })
                  )
                );
              }

              // Handle 'resources' (docs, videos, courses, books)
              if (skill.resources) {
                Object.values(skill.resources).forEach((arr) =>
                  arr.forEach((r) =>
                    resources.push({
                      title: r.title,
                      url: r.url,
                      resource_type: r.resource_type || "Resource",
                    })
                  )
                );
              }

              structuredRoadmap[level].push({
                id: skill._id,
                title: skill.name,
                desc: skill.description,
                resources,
              });
            });
          });
        }

        setRoadmap(structuredRoadmap);
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-700">
        Loading roadmap...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-6 shadow-md relative">
        <button
          onClick={goBack}
          className="absolute left-14 top-1/2 -translate-y-1/2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100"
        >
          Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {course.title || "Learning Roadmap"}
        </h1>
        <p className="text-center text-indigo-100 mt-2 max-w-2xl mx-auto">
          {course.description || ""}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-10 max-w-5xl mx-auto">
        <div className="space-y-16 w-full">
          {Object.keys(roadmap).length === 0 && (
            <p className="text-gray-600 text-center">No roadmap found.</p>
          )}

          {Object.keys(roadmap).map((level) => (
            <div key={level} className="w-full">
              <h2 className="text-xl font-semibold mb-8 text-indigo-700 border-l-4 border-indigo-500 pl-3">
                {level} Level
              </h2>

              <div className="flex justify-center items-center gap-6 flex-wrap">
                {roadmap[level].map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    <div
                      className="p-5 w-56 bg-white rounded-2xl shadow hover:shadow-lg border border-indigo-100 cursor-pointer transition transform hover:-translate-y-1"
                      onClick={() => setSelectedSkill(node)}
                    >
                      <h3 className="font-bold text-indigo-700 mb-2">{node.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">{node.desc}</p>
                    </div>

                    {index < roadmap[level].length - 1 && (
                      <ArrowRight className="mx-4 text-indigo-400 w-6 h-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sidebar */}
      {selectedSkill && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 p-6 overflow-y-auto z-50">
          <button
            onClick={() => setSelectedSkill(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-indigo-700 mb-4">
            {selectedSkill.title}
          </h2>
          <p className="text-gray-700 mb-6">{selectedSkill.desc}</p>

          <h3 className="text-lg font-semibold text-indigo-600 mb-3">Learning Resources</h3>
          {selectedSkill.resources.length > 0 ? (
            <ul className="space-y-3">
              {selectedSkill.resources.map((res, idx) => (
                <li key={idx} className="border p-3 rounded-lg hover:bg-indigo-50">
                  <p className="font-medium text-gray-800">{res.title}</p>
                  <p className="text-sm text-gray-500 mb-1">{res.resource_type}</p>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Visit Resource
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No resources available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;

