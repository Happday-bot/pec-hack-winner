import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";

export default function Examinations() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = "http://localhost:8000/examination"; // replace with your backend

    const fetchExams = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch exam data");

        const data = await response.json();

        // Optional: add shortName if not present
        data.forEach((exam) => {
          if (!exam.shortName && exam.short_name) exam.shortName = exam.short_name;
        });

        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading)
    return <div className="text-center py-20 text-xl text-gray-700">Loading exams...</div>;

  if (error)
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
<header className="text-center py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
  <div className="max-w-5xl mx-auto">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 flex justify-center items-center gap-3">
      <span className="animate-bounce inline-block">📝</span>
      Examinations
    </h1>
    <p className="text-lg opacity-90 max-w-2xl mx-auto mt-3">
      Stay informed with exams tailored to your career path.
    </p>
  </div>
</header>


      {/* Main content */}
      <div className="flex-1 space-y-10 px-8 py-10 max-w-7xl mx-auto">
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            {exams.map((exam, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* Exam Title */}
                <h3 className="text-xl font-bold mb-3 text-indigo-700 flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-500" />
                  {exam.shortName || exam.name}
                </h3>

                {/* Provider */}
                {exam.provider && (
                  <p className="mb-2 text-gray-700">
                    <strong>Provider:</strong> {exam.provider}
                  </p>
                )}

                {/* Eligibility */}
                {exam.eligibility && (
                  <div className="mb-3 text-gray-700 leading-relaxed">
                    <strong>Eligibility:</strong>
                    <ul className="list-disc ml-5 mt-1">
                      {exam.eligibility.domicile_required && (
                        <li>Domicile: {exam.eligibility.domicile_required}</li>
                      )}
                      {exam.eligibility.education_required && (
                        <li>Education: {exam.eligibility.education_required}</li>
                      )}
                      {exam.eligibility.age_limits && (
                        <li>
                          Age Limits: {exam.eligibility.age_limits.min} -{" "}
                          {exam.eligibility.age_limits.max} years
                        </li>
                      )}
                      {exam.eligibility.other_requirements && (
                        <li>Other: {exam.eligibility.other_requirements}</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Paper Pattern */}
                {exam.paper_pattern && (
                  <p className="mb-2 text-gray-700">
                    <strong>Exam Pattern:</strong> {exam.paper_pattern}
                  </p>
                )}

                {/* Application Timeline */}
                {exam.application_timeline && (
                  <p className="mb-2 text-gray-700">
                    <strong>Application:</strong>{" "}
                    {new Date(exam.application_timeline.start_date).toLocaleDateString()} -{" "}
                    {new Date(exam.application_timeline.end_date).toLocaleDateString()}
                  </p>
                )}

                {/* Exam Date */}
                {exam.exam_date && (
                  <p className="mb-2 text-gray-700">
                    <strong>Exam Date:</strong> {new Date(exam.exam_date).toLocaleDateString()}
                  </p>
                )}

                {/* Career Prospects */}
                {exam.career_prospects && (
                  <div className="text-gray-700">
                    <strong>Career Opportunities:</strong>
                    {exam.career_prospects.description && (
                      <p>{exam.career_prospects.description}</p>
                    )}
                    {exam.career_prospects.job_roles && (
                      <ul className="list-disc ml-5 mt-1">
                        {exam.career_prospects.job_roles.map((role, i) => (
                          <li key={i}>{role}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Official Website */}
                {exam.official_website && (
                  <p className="mt-2 text-blue-600 hover:underline">
                    <a href={exam.official_website} target="_blank" rel="noopener noreferrer">
                      Official Website
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 border-t border-gray-200 shadow-inner">
        © 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
}


