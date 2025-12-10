import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ScrollText } from "lucide-react"; // ✅ Added ScrollText

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState({}); // store which cards are open

  // Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:8000/scholarships")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setScholarships(data))
      .catch((err) => console.error("Error fetching scholarships:", err));

    fetch("http://localhost:8000/notifications")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Hero Section --- */}
<section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16 text-center shadow-lg">
  <div className="max-w-4xl mx-auto">
    <h1 className="flex justify-center items-center gap-3 text-4xl md:text-5xl font-extrabold mb-3">
      <ScrollText className="w-8 h-8 text-yellow-600 animate-bounce" />
      Scholarships
    </h1>
    <p className="text-lg opacity-90 max-w-2xl mx-auto">
      Explore scholarships that align with your academic goals and financial needs.
    </p>
  </div>
</section>


      {/* Main Content */}
      <main className="flex-grow">
        <div className="space-y-10 px-8 py-6 max-w-7xl mx-auto">
          {/* Scholarships Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Scholarships</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(scholarships) &&
                scholarships.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-6 border rounded-xl shadow-sm hover:shadow-md bg-white transition-shadow"
                  >
                    {/* Title Row */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(idx)}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {s.scholarship_name}
                      </h3>
                      {expanded[idx] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>

                    {/* Dates */}
                    <div className="mt-4 text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        {s.application?.start_date || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Last Date:</span>{" "}
                        {s.application?.end_date || "N/A"}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="mt-4">
                      <span className="font-medium">Benefits:</span>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                        <li>
                          Tuition Fee: ₹
                          {s.benefits?.tuition_fee_limit?.toLocaleString()}
                        </li>
                        <li>
                          Maintenance: ₹
                          {s.benefits?.maintenance_amount?.toLocaleString()}
                        </li>
                        {s.benefits?.other_benefits && (
                          <li>{s.benefits.other_benefits}</li>
                        )}
                      </ul>
                    </div>

                    {/* Expanded details */}
                    {expanded[idx] && (
                      <div className="mt-4 space-y-3 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Type:</span> {s.type} |{" "}
                          <span className="font-medium">By:</span>{" "}
                          {s.administered_by}
                        </p>

                        {/* Eligibility */}
                        <div>
                          <span className="font-medium">Eligibility:</span>
                          <ul className="list-disc list-inside">
                            <li>
                              Class: {s.eligibility?.min_class} –{" "}
                              {s.eligibility?.max_class}
                            </li>
                            {s.eligibility?.min_percentage && (
                              <li>
                                Minimum Percentage:{" "}
                                {s.eligibility.min_percentage}%
                              </li>
                            )}
                            <li>
                              Income Limit: ₹
                              {s.eligibility?.income_limit?.toLocaleString()}
                            </li>
                            <li>Category: {s.eligibility?.category}</li>
                            <li>Gender: {s.eligibility?.gender}</li>
                            <li>Domicile: {s.eligibility?.domicile}</li>
                            <li>
                              Disability Required:{" "}
                              {s.eligibility?.disability_required
                                ? "Yes"
                                : "No"}
                            </li>
                            {s.eligibility?.special_group && (
                              <li>
                                Special Group: {s.eligibility.special_group}
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Courses */}
                        <p>
                          <span className="font-medium">Courses Covered:</span>{" "}
                          {s.courses_covered?.join(", ")}
                        </p>

                        {/* Application Info */}
                        <div>
                          <p>
                            <span className="font-medium">Start Date:</span>{" "}
                            {s.application?.start_date || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Last Date:</span>{" "}
                            {s.application?.end_date || "N/A"}
                          </p>
                          <p className="italic text-gray-600">
                            {s.application?.timeline_notes}
                          </p>
                        </div>

                        {/* Documents */}
                        <div>
                          <span className="font-medium">Required Documents:</span>
                          <ul className="list-disc list-inside">
                            {s.application?.required_documents?.map(
                              (doc, i) => (
                                <li key={i}>{doc}</li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Seats */}
                        <p>
                          <span className="font-medium">Seats:</span> {s.seats}
                        </p>

                        {/* Apply Now */}
                        <a
                          href={s.application_portal}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Apply Now
                          </button>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 border-t border-gray-200 shadow-inner mt-auto">
        © 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
}

