import React, { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import { Sparkles } from "lucide-react";

/* =========================================
   STREAM → DOMAIN ELIGIBILITY (12th ONLY)
   (Approved static rule)
========================================= */
const STREAM_DOMAIN_MAP = {
  PCMB: ["Engineering", "Science"],
  PCM: ["Engineering", "Science"],
  PCB: ["Medical", "Science"],
  Commerce: ["Commerce", "Management"],
  Arts: ["Arts", "Law", "Design"]
};

export default function SuggestedCourses() {
  const heroRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("all");
  const [activeTab, setActiveTab] = useState("interest"); // interest | eligible
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email =
    sessionStorage.getItem("userEmail") ||
    sessionStorage.getItem("signUpEmail");

  const qualification = sessionStorage.getItem("qualification"); // 10th | 12th
  const stream = sessionStorage.getItem("stream"); // PCMB / PCM / Arts

  /* =========================================
     FETCH CAREERS (FOR DROPDOWN)
  ========================================= */
  useEffect(() => {
    const fetchCareers = async () => {
      const { data } = await supabase
        .from("careers")
        .select("id, name")
        .order("name");

      setCareers(data || []);
    };

    fetchCareers();
  }, []);

  /* =========================================
     FETCH COURSES (CORE LOGIC – UNCHANGED)
  ========================================= */
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");

      if (!email || !qualification) {
        setError("Profile details missing.");
        setLoading(false);
        return;
      }

      let interestKeys = [];

      /* ---------- INTEREST LOGIC (UNCHANGED) ---------- */
      if (activeTab === "interest") {
        const { data: interestRow, error: iErr } = await supabase
          .from("interest")
          .select("interest")
          .eq("student_id", email)
          .single();

        if (iErr || !interestRow?.interest?.recommended_fields) {
          setError("No interests found.");
          setLoading(false);
          return;
        }

        interestKeys = interestRow.interest.recommended_fields;
      }

      /* ---------- BASE QUERY ---------- */
      let query = supabase
        .from("course_mapping")
        .select("*")
        .eq("qualification", qualification);

      /* ---------- APPLY INTEREST ---------- */
      if (activeTab === "interest") {
        query = query.in("interest_key", interestKeys);
      }

      /* ---------- 12th ELIGIBLE LOGIC ---------- */
      if (qualification === "12th" && activeTab === "eligible") {
        const allowedDomains = STREAM_DOMAIN_MAP[stream] || [];
        if (!allowedDomains.length) {
          setCourses([]);
          setLoading(false);
          return;
        }
        query = query.in("domain", allowedDomains);
      }

      const { data, error: cErr } = await query;

      if (cErr) {
        setError("Failed to load courses.");
        setLoading(false);
        return;
      }

      let finalCourses = data || [];

      /* =========================================
         CAREER FILTER (ORDER FIXED – UNCHANGED)
      ========================================= */
      if (selectedCareer !== "all") {
        const { data: mappings } = await supabase
          .from("course_career_mapping")
          .select("course_id")
          .eq("career_id", selectedCareer);

        const allowedCourseIds = (mappings || []).map(m => m.course_id);

        finalCourses = finalCourses.filter(c =>
          allowedCourseIds.includes(c.id)
        );
      }

      setCourses(finalCourses);
      setLoading(false);
    };

    fetchCourses();
  }, [email, qualification, stream, activeTab, selectedCareer]);

  /* =========================================
     GROUPING (UNCHANGED)
  ========================================= */
  const groupedCourses = courses.reduce((acc, course) => {
    const key =
      qualification === "10th"
        ? course.stream || course.domain
        : course.domain;

    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});

  /* =========================================
     UI STATES
  ========================================= */
  if (loading) {
    return <div className="p-10 text-gray-500">Loading courses…</div>;
  }

  if (error) {
    return <div className="p-10 text-red-600">{error}</div>;
  }

  /* =========================================
     RENDER
  ========================================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">

      {/* ===== BIG HERO BANNER (CAREER PAGE STYLE) ===== */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600
                   text-white py-20 px-6 md:px-16
                   rounded-b-3xl overflow-hidden shadow-lg"
      >
        {/* floating shapes */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            🎓 Suggested Courses for You
          </h1>
          <p className="text-lg opacity-90">
            Based on your interests and eligibility
          </p>
        </div>

        <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20" />
      </section>

      {/* ===== CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ===== TABS + CAREER FILTER ===== */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-12">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("interest")}
              className={`px-6 py-2 rounded-full font-medium ${
                activeTab === "interest"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Based on My Interests
            </button>

            <button
              onClick={() => setActiveTab("eligible")}
              className={`px-6 py-2 rounded-full font-medium ${
                activeTab === "eligible"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All Eligible Courses
            </button>
          </div>

          {/* CAREER DROPDOWN */}
          <select
            value={selectedCareer}
            onChange={e => setSelectedCareer(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Careers</option>
            {careers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ===== COURSE GROUPS ===== */}
        {Object.entries(groupedCourses).map(([groupTitle, items]) => {
          const diplomaCourses = items.filter(i => i.level === "diploma");

          return (
            <div key={groupTitle} className="mb-16">
              <h2 className="text-2xl font-semibold mb-6">
                {groupTitle}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(course => (
                  <div
                    key={course.id}
                    className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {course.course_title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Domain: {course.domain}
                    </p>

                    <p className="text-xs text-gray-500">
                      Based on your interest: {course.interest_key}
                    </p>
                  </div>
                ))}

                {/* INFORMATIONAL CARD – 10TH ONLY */}
                {qualification === "10th" &&
                  activeTab === "interest" &&
                  diplomaCourses.length > 0 && (
                    <div className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-6 flex flex-col justify-center">
                      <h4 className="font-bold text-indigo-700 mb-2">
                        After 12th – {groupTitle}
                      </h4>
                      <p className="text-sm text-gray-700">
                        You can choose <strong>{groupTitle}</strong> in 12th
                        and later pursue degree-level programs.
                      </p>
                      <p className="text-xs text-indigo-600 mt-2">
                        Informational Path (No action required)
                      </p>
                    </div>
                  )}
              </div>
            </div>
          );
        })}

        {!courses.length && (
          <div className="text-gray-600 text-center mt-10">
            No courses available for this selection.
          </div>
        )}
      </div>
    </div>
  );
}
