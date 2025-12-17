// import React, { useEffect, useState } from "react";
// import { supabase } from "./supabase";

// export default function SuggestedCourses() {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const email =
//     sessionStorage.getItem("userEmail") ||
//     sessionStorage.getItem("signUpEmail");

//   const qualification = sessionStorage.getItem("qualification"); // "10th" | "12th"

//   /* ==============================
//      FETCH DATA
//      ============================== */
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!email || !qualification) {
//         setError("Missing profile details.");
//         setLoading(false);
//         return;
//       }

//       // 1️⃣ fetch interests
//       const { data: interestRow, error: iErr } = await supabase
//         .from("interest")
//         .select("interest")
//         .eq("student_id", email)
//         .single();

//       if (iErr || !interestRow?.interest?.recommended_fields) {
//         setError("No interests found.");
//         setLoading(false);
//         return;
//       }

//       const interestKeys = interestRow.interest.recommended_fields;

//       // 2️⃣ fetch course mapping
//       const { data: mapped, error: cErr } = await supabase
//         .from("course_mapping")
//         .select("*")
//         .eq("qualification", qualification)
//         .in("interest_key", interestKeys);

//       if (cErr) {
//         setError("Failed to load courses.");
//         setLoading(false);
//         return;
//       }

//       setCourses(mapped || []);
//       setLoading(false);
//     };

//     fetchData();
//   }, [email, qualification]);

//   /* ==============================
//      GROUPING
//      ============================== */

//   const grouped = courses.reduce((acc, c) => {
//     // For 10th → group by STREAM
//     // For 12th → group by DOMAIN
//     const key =
//       qualification === "10th"
//         ? c.stream || c.domain
//         : c.domain;

//     if (!acc[key]) acc[key] = [];
//     acc[key].push(c);
//     return acc;
//   }, {});

//   /* ==============================
//      UI STATES
//      ============================== */
//   if (loading) {
//     return <div className="p-10 text-gray-500">Loading courses…</div>;
//   }

//   if (error) {
//     return <div className="p-10 text-red-600">{error}</div>;
//   }

//   if (!courses.length) {
//     return <div className="p-10 text-gray-600">No recommendations available.</div>;
//   }

//   /* ==============================
//      RENDER
//      ============================== */
//   return (
//     <div className="max-w-6xl mx-auto px-6 py-10">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-10">
//         Recommended Courses for You
//       </h1>

//       {Object.entries(grouped).map(([groupTitle, items]) => {
//         const diplomaCourses = items.filter(i => i.level === "diploma");

//         return (
//           <div key={groupTitle} className="mb-14">
//             {/* STREAM / DOMAIN TITLE */}
//             <h2 className="text-2xl font-semibold mb-6">
//               {groupTitle}
//             </h2>

//             {/* DIPLOMA / DEGREE CARDS */}
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {items.map(course => (
//                 <div
//                   key={course.id}
//                   className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
//                 >
//                   <h3 className="text-lg font-bold mb-2">
//                     {course.course_title}
//                   </h3>

//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Domain:</strong> {course.domain}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     Based on your interest:{" "}
//                     <span className="capitalize">
//                       {course.interest_key}
//                     </span>
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* EXTRA INFO ONLY FOR 10TH */}
//             {qualification === "10th" && diplomaCourses.length > 0 && (
//               <div className="mt-6 text-sm text-indigo-700 font-medium">
//                 If pursuing 12th →
//                 <span className="ml-2 text-gray-700">
//                   Choose related stream based on this interest
//                 </span>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

/* =========================================
   STREAM → DOMAIN ELIGIBILITY (12th ONLY)
   ========================================= */
const STREAM_DOMAIN_MAP = {
  PCMB: ["Engineering", "Science"],
  PCM: ["Engineering", "Science"],
  PCB: ["Medical", "Science"],
  Commerce: ["Commerce", "Management"],
  Arts: ["Arts", "Law", "Design"]
};

export default function SuggestedCourses() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("interest"); // interest | eligible
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email =
    sessionStorage.getItem("userEmail") ||
    sessionStorage.getItem("signUpEmail");

  const qualification = sessionStorage.getItem("qualification"); // "10th" | "12th"
  const stream = sessionStorage.getItem("stream"); // PCMB / PCM / Arts etc

  /* =========================================
     FETCH COURSES
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

      /* ---------- BASED ON INTEREST ---------- */
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

      /* ---------- APPLY LOGIC ---------- */
      if (activeTab === "interest") {
        query = query.in("interest_key", interestKeys);
      }

      /* ---------- 12th ELIGIBLE LOGIC (FIXED) ---------- */
      if (qualification === "12th" && activeTab === "eligible") {
        const allowedDomains = STREAM_DOMAIN_MAP[stream] || [];

        if (!allowedDomains.length) {
          setCourses([]);
          setLoading(false);
          return;
        }

        query = query.in("domain", allowedDomains);
      }

      const { data, error } = await query;

      if (error) {
        setError("Failed to load courses.");
        setLoading(false);
        return;
      }

      setCourses(data || []);
      setLoading(false);
    };

    fetchCourses();
  }, [email, qualification, stream, activeTab]);

  /* =========================================
     GROUPING
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

  if (!courses.length) {
    return (
      <div className="p-10 text-gray-600">
        No courses available for this selection.
      </div>
    );
  }

  /* =========================================
     RENDER
     ========================================= */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🎓 Recommended Courses for You
      </h1>

      {/* TABS */}
      <div className="flex gap-4 mb-10">
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

      {/* COURSE GROUPS */}
      {Object.entries(groupedCourses).map(([groupTitle, items]) => {
        const diplomaCourses = items.filter(i => i.level === "diploma");

        return (
          <div key={groupTitle} className="mb-16">
            {/* GROUP TITLE */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {groupTitle}
            </h2>

            {/* COURSES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(course => (
                <div
                  key={course.id}
                  className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold mb-2">
                    {course.course_title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Domain:</strong> {course.domain}
                  </p>

                  <p className="text-xs text-gray-500">
                    Based on your interest:{" "}
                    <span className="capitalize">
                      {course.interest_key}
                    </span>
                  </p>
                </div>
              ))}

              {/* ---------- INFORMATIONAL CARD (10th ONLY) ---------- */}
              {qualification === "10th" &&
                activeTab === "interest" &&
                diplomaCourses.length > 0 && (
                  <div className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-6 flex flex-col justify-center">
                    <h4 className="font-bold text-indigo-700 mb-2">
                      After 12th – {groupTitle}
                    </h4>
                    <p className="text-sm text-gray-700">
                      You can also choose <strong>{groupTitle}</strong> in 12th
                      and later pursue degree-level programs in this domain.
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
    </div>
  );
}

