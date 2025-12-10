// import React, { useState, useEffect } from "react";
// import { BookOpen, TrendingUp, Award, Hash, Layers } from "lucide-react";
// import axios from "axios";

// const SuggestedCourses = () => {
//   const [selectedFilter, setSelectedFilter] = useState("interest");
//   const [recommendedCourses, setRecommendedCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hoveredId, setHoveredId] = useState(null);

//   const [demandFilter, setDemandFilter] = useState("");
//   const [streamFilter, setStreamFilter] = useState("");
//   const [careerFilter, setCareerFilter] = useState("");

//   const streamOptions = [
//     "Arts & Science",
//     "Engineering",
//     "Medical",
//     "Applied Science",
//     "Teacher Training",
//   ];

//   const careerOptions = [
//     "Software Engineer",
//     "Frontend Developer",
//     "Backend Developer",
//     "Data Scientist",
//     "Doctor",
//     "Nurse",
//     "Teacher",
//   ];

//   // const careerIdToName = {
//   //   "68cc12fdd4cee0d4b5ad14e9": "Software Engineer",
//   //   "68cc12f8d4cee0d4b5ad14e8": "Frontend Developer",
//   //   1: "Backend Developer",
//   //   4: "Data Scientist",
//   // };
//   const user_id = localStorage.getItem("user_id");
//   const fetchCourses = async (filterType = "interest") => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:8000/course/${user_id}`);
//       const courses =
//         filterType === "interest" ? res.data.my_course : res.data.eligible_course;
//       setRecommendedCourses(courses);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setRecommendedCourses([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const handleFilterChange = (filter) => {
//     setSelectedFilter(filter);
//     setDemandFilter("");
//     setStreamFilter("");
//     setCareerFilter("");
//     fetchCourses(filter);
//   };

//   const getFilteredCourses = () => {
//   return recommendedCourses.filter((course) => {
//     let matches = true;
//     if (demandFilter === "high") matches = matches && course.demand === 1;

//     // only apply stream filter when selectedFilter === "all"
//     if (selectedFilter === "all" && streamFilter) {
//       matches = matches && course.stream === streamFilter;
//     }

//     if (careerFilter)
//       matches =
//         matches &&
//         course.careerId &&
//         course.careerId.some((id) => careerIdToName[id] === careerFilter);

//     return matches;
//   });
// };


//   const filteredCourses = getFilteredCourses();

//   const renderCourses = () => {
//     const items = [];
//     filteredCourses.forEach((course) => {
//       items.push(
//         <div
//           key={course._id || course.id}
//           onMouseEnter={() => setHoveredId(course._id || course.id)}
//           onMouseLeave={() => setHoveredId(null)}
//           className={`relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow transition transform cursor-pointer border border-gray-100 flex flex-col justify-between min-h-[200px] ${
//             hoveredId === (course._id || course.id)
//               ? "shadow-xl -translate-y-1"
//               : "hover:shadow-lg hover:-translate-y-0.5"
//           }`}
//         >
//           {/* Demand Tag */}
//           {course.demand === 1 && (
//             <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 font-semibold">
//               ✅ Demand
//             </span>
//           )}

//           <div>
//             {/* Course Title */}
//             <h4 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
//               <BookOpen className="w-5 h-5 text-indigo-600" />
//               {course.course}
//             </h4>

//             {/* Additional Details */}
//             <div className="text-sm text-gray-500 space-y-1">
//               <div className="flex items-center gap-3">
//                 <Layers className="w-4 h-4 text-blue-500" />
//                 Stream: {course.stream || "N/A"}
//               </div>
//               <div className="flex items-center gap-3">
//                 <Award className="w-4 h-4 text-blue-500" />
//                 Degree: {course.degree || "N/A"}
//               </div>
//               <div className="flex items-center gap-3">
//                 <Hash className="w-4 h-4 text-blue-500" />
//                 Course Code: {course.courseCode || "N/A"}
//               </div>
//             </div>
//           </div>

         
//           {/* Possible Careers (on hover) */}
//           {hoveredId === (course._id || course.id) && (
//             <div className="mt-4 transition-all duration-300 bg-white p-2 rounded-lg shadow-inner">
//               <h5 className="font-semibold text-gray-700 mb-2">
//                 Possible Careers:
//               </h5>
//               {course.careerId && course.careerId.length > 0 ? (
//                 <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//                   {(() => {
//                     const careerItems = [];
//                     course.careerId.forEach((id, i) => {
//                       careerItems.push(
//                         <li key={i}>{careerIdToName[id] || "Unknown Career"}</li>
//                       );
//                     });
//                     return careerItems;
//                   })()}
//                 </ul>
//               ) : (
//                 <p className="text-sm text-gray-500 italic">
//                   No careers assigned yet
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       );
//     });
//     return items;
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
//       <header className="text-center py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
//           <span className="animate-bounce inline-grid">🎯</span> 
//           Suggested Courses for You
//         </h1>
//         <p className="text-lg opacity-90 max-w-2xl mx-auto">
//           Explore courses based on your qualification and interests.
//         </p>
//       </header>

//       {/* Filter buttons */}
//       <div className="flex justify-center mt-10">
//         <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg flex p-2 space-x-4">
//           <button
//             onClick={() => handleFilterChange("interest")}
//             className={`px-6 py-2 rounded-full font-medium transition ${
//               selectedFilter === "interest"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             Based on My Interests
//           </button>
//           <button
//             onClick={() => handleFilterChange("all")}
//             className={`px-6 py-2 rounded-full font-medium transition ${
//               selectedFilter === "all"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             All Eligible Courses
//           </button>
//         </div>
//       </div>

//       {/* Dropdown filters */}
//       <div className="sticky top-2 z-30 flex justify-center mt-10 px-6 space-x-40">
//         <select
//           value={demandFilter}
//           onChange={(e) => setDemandFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
//         >
//           <option value="">All</option>
//           <option value="high">Demand</option>
//         </select>

//         <select
//           value={streamFilter}
//           onChange={(e) => setStreamFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
//         >
//           <option value="">All Streams</option>
//           {streamOptions.map((stream, i) => (
//             <option key={i} value={stream}>
//               {stream}
//             </option>
//           ))}
//         </select>

//         <select
//           value={careerFilter}
//           onChange={(e) => setCareerFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
//         >
//           <option value="">All Careers</option>
//           {careerOptions.map((career, i) => (
//             <option key={i} value={career}>
//               {career}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Courses */}
//       <main className="flex-1 px-6 md:px-12 lg:px-20 py-12">
//         {isLoading ? (
//           <div className="text-center text-gray-500 animate-pulse">
//             Loading courses...
//           </div>
//         ) : filteredCourses.length > 0 ? (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
//             {renderCourses()}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 mt-10">
//             <TrendingUp className="mx-auto w-12 h-12 text-gray-400 mb-3" />
//             No courses found for the selected filters.
//           </div>
//         )}
//       </main>

//       <footer className="bg-gray-100 text-gray-600 text-center py-6 mt-auto border-t">
//         © 2025 Career Advisor • Crafted with 💙
//       </footer>
//     </div>
//   );
// };

// export default SuggestedCourses;

// import React, { useState, useEffect, useCallback } from "react";
// import { BookOpen, TrendingUp, Award, Hash, Layers } from "lucide-react";
// import axios from "axios";

// const SuggestedCourses = () => {
//   const [selectedFilter, setSelectedFilter] = useState("interest");
//   const [recommendedCourses, setRecommendedCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hoveredId, setHoveredId] = useState(null);

//   const [demandFilter, setDemandFilter] = useState("");
//   const [streamFilter, setStreamFilter] = useState("");
//   const [careerFilter, setCareerFilter] = useState("");

//   const [careerMap, setCareerMap] = useState({}); // ✅ Dynamic career map

//   const streamOptions = [
//     "Arts & Science",
//     "Engineering",
//     "Medical",
//     "Applied Science",
//     "Teacher Training",
//   ];

//   const user_id = localStorage.getItem("user_id");

//   // const fetchCourses = async (filterType = "interest") => {
//   //   setIsLoading(true);
//   //   try {
//   //     const res = await axios.get(`http://localhost:8000/course/${user_id}`);
//   //     const courses =
//   //       filterType === "interest" ? res.data.my_course : res.data.eligible_course;
//   //     setRecommendedCourses(courses);
//   //   } catch (err) {
//   //     console.error("Error fetching courses:", err);
//   //     setRecommendedCourses([]);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const fetchCourses = useCallback(async (filterType = "interest") => {
//   setIsLoading(true);
//   try {
//     const res = await axios.get(`http://localhost:8000/course/${user_id}`);
//     const courses =
//       filterType === "interest" ? res.data.my_course : res.data.eligible_course;
//     setRecommendedCourses(courses);
//   } catch (err) {
//     console.error("Error fetching courses:", err);
//     setRecommendedCourses([]);
//   } finally {
//     setIsLoading(false);
//   }
// }, [user_id]);
//   // ✅ Fetch courses and career map dynamically
//   useEffect(() => {
//     fetchCourses();

//     const fetchCareers = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/careers");
//         // Convert array to map {id: name}
//         const map = {};
//         res.data.forEach((career) => {
//           map[career._id] = career.name;
//         });
//         setCareerMap(map);
//       } catch (err) {
//         console.error("Error fetching careers:", err);
//       }
//     };

//     fetchCareers();
//   }, [fetchCourses]);

//   const handleFilterChange = (filter) => {
//     setSelectedFilter(filter);
//     setDemandFilter("");
//     setStreamFilter("");
//     setCareerFilter("");
//     fetchCourses(filter);
//   };

//   const getFilteredCourses = () => {
//     return recommendedCourses.filter((course) => {
//       let matches = true;
//       if (demandFilter === "high") matches = matches && course.demand === 1;

//       if (selectedFilter === "all" && streamFilter) {
//         matches = matches && course.stream === streamFilter;
//       }

//       if (careerFilter)
//         matches =
//           matches &&
//           course.careerId &&
//           course.careerId.some((id) => careerMap[id] === careerFilter);

//       return matches;
//     });
//   };

//   const filteredCourses = getFilteredCourses();

//   const renderCourses = () => {
//     const items = [];
//     filteredCourses.forEach((course) => {
//       items.push(
//         <div
//           key={course._id || course.id}
//           onMouseEnter={() => setHoveredId(course._id || course.id)}
//           onMouseLeave={() => setHoveredId(null)}
//           className={`relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow transition transform cursor-pointer border border-gray-100 flex flex-col justify-between min-h-[200px] ${
//             hoveredId === (course._id || course.id)
//               ? "shadow-xl -translate-y-1"
//               : "hover:shadow-lg hover:-translate-y-0.5"
//           }`}
//         >
//           {/* Demand Tag */}
//           {course.demand === 1 && (
//             <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 font-semibold">
//               ✅ Demand
//             </span>
//           )}

//           <div>
//             {/* Course Title */}
//             <h4 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
//               <BookOpen className="w-5 h-5 text-indigo-600" />
//               {course.course}
//             </h4>

//             {/* Additional Details */}
//             <div className="text-sm text-gray-500 space-y-1">
//               <div className="flex items-center gap-3">
//                 <Layers className="w-4 h-4 text-blue-500" />
//                 Stream: {course.stream || "N/A"}
//               </div>
//               <div className="flex items-center gap-3">
//                 <Award className="w-4 h-4 text-blue-500" />
//                 Degree: {course.degree || "N/A"}
//               </div>
//               <div className="flex items-center gap-3">
//                 <Hash className="w-4 h-4 text-blue-500" />
//                 Course Code: {course.courseCode || "N/A"}
//               </div>
//             </div>
//           </div>

//           {/* Possible Careers (on hover) */}
//           {hoveredId === (course._id || course.id) && (
//             <div className="mt-4 transition-all duration-300 bg-white p-2 rounded-lg shadow-inner">
//               <h5 className="font-semibold text-gray-700 mb-2">
//                 Possible Careers:
//               </h5>
//               {course.careerId && course.careerId.length > 0 ? (
//                 <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//                   {course.careerId.map((id, i) => (
//                     <li key={i}>{careerMap[id] || "Unknown Career"}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-sm text-gray-500 italic">
//                   No careers assigned yet
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       );
//     });
//     return items;
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
//       <header className="text-center py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
//           <span className="animate-bounce inline-grid">🎯</span> 
//           Suggested Courses for You
//         </h1>
//         <p className="text-lg opacity-90 max-w-2xl mx-auto">
//           Explore courses based on your qualification and interests.
//         </p>
//       </header>

//       {/* Filter buttons */}
//       <div className="flex justify-center mt-10">
//         <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg flex p-2 space-x-4">
//           <button
//             onClick={() => handleFilterChange("interest")}
//             className={`px-6 py-2 rounded-full font-medium transition ${
//               selectedFilter === "interest"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             Based on My Interests
//           </button>
//           <button
//             onClick={() => handleFilterChange("all")}
//             className={`px-6 py-2 rounded-full font-medium transition ${
//               selectedFilter === "all"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             All Eligible Courses
//           </button>
//         </div>
//       </div>

//       {/* Dropdown filters */}
//       <div className="sticky top-2 z-30 flex justify-center mt-10 px-6 space-x-40">
//         <select
//           value={demandFilter}
//           onChange={(e) => setDemandFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
//         >
//           <option value="">All</option>
//           <option value="high">Demand</option>
//         </select>

//         <select
//           value={streamFilter}
//           onChange={(e) => setStreamFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
//         >
//           <option value="">All Streams</option>
//           {streamOptions.map((stream, i) => (
//             <option key={i} value={stream}>
//               {stream}
//             </option>
//           ))}
//         </select>

//         <select
//           value={careerFilter}
//           onChange={(e) => setCareerFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
//         >
//           <option value="">All Careers</option>
//           {Object.values(careerMap).map((career, i) => (
//             <option key={i} value={career}>
//               {career}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Courses */}
//       <main className="flex-1 px-6 md:px-12 lg:px-20 py-12">
//         {isLoading ? (
//           <div className="text-center text-gray-500 animate-pulse">
//             Loading courses...
//           </div>
//         ) : filteredCourses.length > 0 ? (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
//             {renderCourses()}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 mt-10">
//             <TrendingUp className="mx-auto w-12 h-12 text-gray-400 mb-3" />
//             No courses found for the selected filters.
//           </div>
//         )}
//       </main>

//       <footer className="bg-gray-100 text-gray-600 text-center py-6 mt-auto border-t">
//         © 2025 Career Advisor • Crafted with 💙
//       </footer>
//     </div>
//   );
// };

// export default SuggestedCourses;

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, TrendingUp, Award, Hash, Layers } from "lucide-react";
import axios from "axios";

const SuggestedCourses = () => {
  const [selectedFilter, setSelectedFilter] = useState("interest");
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [demandFilter, setDemandFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [careerFilter, setCareerFilter] = useState("");

  const [careerMap, setCareerMap] = useState({});

  const streamOptions = [
    "Arts & Science",
    "Engineering",
    "Medical",
    "Applied Science",
    "Teacher Training",
  ];

  const user_id = localStorage.getItem("user_id");

  const fetchCourses = useCallback(async (filterType = "interest") => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/course/${user_id}`);
      const courses =
        filterType === "interest" ? res.data.my_course : res.data.eligible_course;
      setRecommendedCourses(courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setRecommendedCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchCourses();

    const fetchCareers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/careers");
        const map = {};
        res.data.forEach((career) => {
          map[career._id] = career.name;
        });
        setCareerMap(map);
      } catch (err) {
        console.error("Error fetching careers:", err);
      }
    };

    fetchCareers();
  }, [fetchCourses]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setDemandFilter("");
    setStreamFilter("");
    setCareerFilter("");
    fetchCourses(filter);
  };

  const getFilteredCourses = () => {
    return recommendedCourses.filter((course) => {
      let matches = true;
      if (demandFilter === "high") matches = matches && course.demand === 1;

      if (selectedFilter === "all" && streamFilter) {
        matches = matches && course.stream === streamFilter;
      }

      if (careerFilter)
        matches =
          matches &&
          course.careerId &&
          course.careerId.some((id) => careerMap[id] === careerFilter);

      return matches;
    });
  };

  const filteredCourses = getFilteredCourses();

  const renderCourses = () => {
    return filteredCourses.map((course) => (
      <div
        key={course._id || course.id}
        className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow transition transform cursor-pointer border border-gray-100 flex flex-col justify-between min-h-[200px] hover:shadow-lg hover:-translate-y-0.5"
      >
        {/* Demand Tag */}
        {course.demand === 1 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 font-semibold">
            ✅ Demand
          </span>
        )}

        <div>
          {/* Course Title */}
          <h4 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            {course.course}
          </h4>

          {/* Additional Details */}
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="text-center py-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="animate-bounce inline-grid">🎯</span> Suggested Courses for You
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Explore courses based on your qualification and interests.
        </p>
      </header>

      {/* Filter buttons */}
      <div className="flex justify-center mt-10">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg flex p-2 space-x-4">
          <button
            onClick={() => handleFilterChange("interest")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedFilter === "interest"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Based on My Interests
          </button>
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedFilter === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Eligible Courses
          </button>
        </div>
      </div>

      {/* Dropdown filters */}
      <div className="sticky top-2 z-30 flex justify-center mt-10 px-6 space-x-40">
        <select
          value={demandFilter}
          onChange={(e) => setDemandFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
        >
          <option value="">All</option>
          <option value="high">Demand</option>
        </select>

        <select
          value={streamFilter}
          onChange={(e) => setStreamFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
        >
          <option value="">All Streams</option>
          {streamOptions.map((stream, i) => (
            <option key={i} value={stream}>
              {stream}
            </option>
          ))}
        </select>

        <select
          value={careerFilter}
          onChange={(e) => setCareerFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border shadow-sm bg-white/90 backdrop-blur text-gray-700"
        >
          <option value="">All Careers</option>
          {Object.values(careerMap).map((career, i) => (
            <option key={i} value={career}>
              {career}
            </option>
          ))}
        </select>
      </div>

      {/* Courses */}
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-12">
        {isLoading ? (
          <div className="text-center text-gray-500 animate-pulse">
            Loading courses...
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
            {renderCourses()}
          </div>
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
