import React, { useState, useEffect, useRef } from "react";
import { Award, Calendar, ExternalLink, Clock, Sparkles, ChevronRight, X, FileText, Timer, BookOpen, AlertCircle, CheckCircle, DollarSign, BarChart3, GraduationCap, Users, MapPin } from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function Examinations() {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  const [canAccess, setCanAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [exams, setExams] = useState([]);
  
  const [userData, setUserData] = useState({
    age: null,
    stream: null,
    qual: null,
    locations: [] 
  });

  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("Eligible");
  const [selectedExam, setSelectedExam] = useState(null);

  /* =========================================
     1. INIT: FETCH DATA (SMART FETCH)
     ========================================= */
  useEffect(() => {
    const init = async () => {
      try {
        const email = sessionStorage.getItem("userEmail") || sessionStorage.getItem("signUpEmail");
        
        if (!email) {
            setChecking(false);
            return;
        }

        // 1. Get Basic Info from Main Profile
        const { data: mainProfile, error: mainError } = await supabase
          .from("profiles")
          .select("dob, qualification")
          .eq("email", email)
          .maybeSingle();

        if (mainError || !mainProfile) {
          setCanAccess(false);
        } else {
          setCanAccess(true);
          
          // Determine Qualification
          let derivedQual = "10th";
          if (mainProfile.qualification && mainProfile.qualification.includes("12")) {
             derivedQual = "12th";
          }

          let derivedStream = null;
          let rawLocations = null;

          // 2. Fetch Details from Specific Table
          if (derivedQual === "12th") {
             const { data: profile12 } = await supabase
                .from("12th_profile_data")
                .select("stream, preferred_locations")
                .eq("email", email)
                .maybeSingle();
             
             if (profile12) {
                derivedStream = profile12.stream ? profile12.stream.trim().toUpperCase() : null;
                rawLocations = profile12.preferred_locations;
             }
          } else {
             // 10th Grade Fetch
             const { data: profile10 } = await supabase
                .from("10th_profile_data")
                .select("preferred_locations")
                .eq("email", email)
                .maybeSingle();
             
             if (profile10) {
                rawLocations = profile10.preferred_locations;
             }
          }

          // 3. Calculate Age
          let derivedAge = null;
          if (mainProfile.dob) {
            const dob = new Date(mainProfile.dob);
            const today = new Date();
            derivedAge = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
               derivedAge--;
            }
          }

          // 4. Parse Locations
          let userLocs = [];
          if (rawLocations) {
              if (Array.isArray(rawLocations)) {
                  userLocs = rawLocations;
              } else if (typeof rawLocations === 'string') {
                  userLocs = rawLocations.split(',').map(s => s.trim());
              }
          }

          setUserData({ age: derivedAge, qual: derivedQual, stream: derivedStream, locations: userLocs });

          // 5. Fetch Exams
          const { data: examData } = await supabase
            .from("examinations")
            .select("*")
            .order('exam_date', { ascending: true });

          setExams(examData || []);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setChecking(false);
      }
    };

    init();
  }, []);

  /* =========================================
     2. FILTER LOGIC
     ========================================= */
  const filteredExams = exams.filter((exam) => {
    // Search
    const matchesSearch = exam.name.toLowerCase().includes(searchName.toLowerCase()) || 
                          (exam.short_name && exam.short_name.toLowerCase().includes(searchName.toLowerCase()));
    if (!matchesSearch) return false;

    // --- GLOBAL LOCATION FILTER ---
    const examRegion = exam.region || "India";
    
    if (examRegion !== "India") {
        if (userData.locations.length > 0) {
            const isPreferred = userData.locations.some(
                loc => loc.toLowerCase() === examRegion.toLowerCase()
            );
            if (!isPreferred) return false; 
        } else {
            return false; 
        }
    }

    // --- "ELIGIBLE" TAB SPECIFIC LOGIC ---
    if (filterType === "Eligible") {
        
        // 1. Qualification Level
        if (userData.qual === "10th" && (exam.qual_level === "12th" || exam.qual_level === "Graduate")) return false;

        // 2. Stream Match (12th only)
        if (userData.qual === "12th") {
            if (userData.stream) {
                if (exam.allowed_streams && exam.allowed_streams.length > 0) {
                    const allowedUpper = exam.allowed_streams.map(s => s.toUpperCase());
                    
                    let isStreamMatch = allowedUpper.includes(userData.stream);

                    // PCMB Super Logic
                    if (userData.stream === 'PCMB') {
                        if (allowedUpper.includes('PCM') || 
                            allowedUpper.includes('PCB') || 
                            allowedUpper.includes('PCMB') ||
                            allowedUpper.includes('SCIENCE')) {
                            isStreamMatch = true;
                        }
                    }

                    if (!isStreamMatch) return false;
                }
            } else {
                if (exam.allowed_streams && exam.allowed_streams.length > 0) return false;
            }
        }

        // 3. Age Check (Only hide if TOO OLD)
        if (userData.age && exam.max_age && userData.age > exam.max_age) return false;
    }

    return true;
  });

  // --- STATUS UI HELPER ---
  const getStatus = (exam) => {
    // Qualification Status
    if (userData.qual === "10th" && (exam.qual_level === "12th" || exam.qual_level === "Graduate")) {
        return { text: "Future Goal", style: "bg-purple-100 text-purple-700 border-purple-200", icon: Sparkles };
    }
    if (userData.qual === "12th" && exam.qual_level === "Graduate") {
        return { text: "Future Goal", style: "bg-purple-100 text-purple-700 border-purple-200", icon: Sparkles };
    }

    // Age Status (Too Young)
    if (userData.age && exam.min_age && userData.age < exam.min_age) {
        const diff = exam.min_age - userData.age;
        return { text: `Eligible in ${diff} Yr${diff > 1 ? 's' : ''}`, style: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock };
    }

    // Date Status
    const now = new Date();
    const start = new Date(exam.application_start);
    const end = new Date(exam.application_end);

    if (now < start) return { text: "Upcoming", style: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar };
    if (now >= start && now <= end) {
        const diff = Math.ceil(Math.abs(end - now) / (1000 * 60 * 60 * 24));
        if (diff <= 7) return { text: `Closing in ${diff} days!`, style: "bg-red-100 text-red-700 border-red-200 font-bold", icon: Timer };
        return { text: "Applications Open", style: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle };
    }
    return { text: "Closed", style: "bg-gray-100 text-gray-500 border-gray-200", icon: AlertCircle };
  };

  /* =========================================
     3. RENDER
     ========================================= */
  useEffect(() => {
    if (heroRef.current) gsap.fromTo(heroRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
  }, [checking]);

  if (checking) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-[Poppins]">
      
      {!canAccess && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-2">Profile Incomplete</h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate("/profile")} className="bg-indigo-600 text-white px-5 py-2 rounded-lg">Go to Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header ref={heroRef} className="relative text-center py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg overflow-hidden rounded-b-3xl">
         {/* Floating shapes */}
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight flex items-center justify-center gap-4">
             <FileText className="w-10 h-10 md:w-14 md:h-14 text-yellow-300" /> 
             Entrance Exams
          </h1>
          {/* CLEANED UP HEADER TEXT */}
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
             {userData.stream ? `Curated for ${userData.stream} Students` : "Find exams matching your profile"}
          </p>
        </div>
        <Sparkles className="absolute top-10 right-10 w-16 h-16 opacity-20" />
        
      </header>

      {/* CONTROLS */}
      <div className="max-w-7xl mx-auto w-full px-6 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative flex-grow w-full md:w-auto">
             <input 
               type="text" 
               placeholder="Search exams (e.g. JEE, NDA)..." 
               value={searchName}
               onChange={(e) => setSearchName(e.target.value)}
               className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
             />
           </div>
           <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setFilterType("Eligible")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filterType === "Eligible" ? "bg-white shadow text-indigo-700" : "text-gray-500"}`}>For Me</button>
              <button onClick={() => setFilterType("All")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filterType === "All" ? "bg-white shadow text-indigo-700" : "text-gray-500"}`}>All Exams</button>
           </div>
        </div>
      </div>

      {/* EXAM GRID */}
      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
         {filteredExams.length === 0 ? (
            <div className="text-center py-20">
               <p className="text-gray-400 text-lg mb-4">No exams found matching your criteria.</p>
               <button onClick={() => setFilterType("All")} className="text-indigo-600 font-bold hover:underline">View all</button>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map(exam => {
                const status = getStatus(exam);
                const StatusIcon = status.icon;
                
                return (
                    <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
                        
                        {/* REGION BADGE */}
                        {exam.region && exam.region !== 'India' && (
                           <div className="absolute top-0 right-0 bg-gray-800 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1 z-10">
                              <MapPin className="w-3 h-3" /> {exam.region}
                           </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-110 transition">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${status.style}`}>
                                <StatusIcon className="w-3 h-3" /> {status.text}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-1">{exam.short_name || exam.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-4">{exam.provider}</p>
                        
                        <div className="space-y-3 mb-6 text-sm text-gray-600 flex-grow">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Age: <span className="font-bold text-gray-800">{exam.min_age}-{exam.max_age}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Exam: {new Date(exam.exam_date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <button onClick={() => setSelectedExam(exam)} className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                            View Details <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                );
                })}
            </div>
         )}
      </div>

      {/* DETAILED MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedExam(null)}></div>
           <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
              
              <div className="sticky top-0 bg-white border-b z-20">
                 <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 rounded-t-3xl text-white flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold">{selectedExam.name}</h2>
                            {selectedExam.region && selectedExam.region !== 'India' && (
                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                    <MapPin className="w-3 h-3"/> {selectedExam.region}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 opacity-90">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-medium">{selectedExam.short_name}</span>
                            <span className="text-sm">by {selectedExam.provider}</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedExam(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"><X className="w-6 h-6"/></button>
                 </div>
              </div>

              <div className="p-8 space-y-8">
                 {/* ELIGIBILITY BADGES */}
                 {selectedExam.allowed_streams && selectedExam.allowed_streams.length > 0 && (
                    <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-bold text-indigo-900 uppercase tracking-wide">Who Can Apply?</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedExam.allowed_streams.map(s => (
                                <span key={s} className="px-4 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm font-bold rounded-full shadow-sm">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                 )}

                 {/* STATS GRID */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                       <DollarSign className="w-6 h-6 text-green-500 mb-2" />
                       <span className="text-xs text-gray-400 uppercase font-bold">Fees</span>
                       <span className="text-lg font-bold text-gray-800">{selectedExam.fees}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                       <BarChart3 className="w-6 h-6 text-orange-500 mb-2" />
                       <span className="text-xs text-gray-400 uppercase font-bold">Difficulty</span>
                       <span className="text-lg font-bold text-gray-800">{selectedExam.difficulty}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                       <FileText className="w-6 h-6 text-blue-500 mb-2" />
                       <span className="text-xs text-gray-400 uppercase font-bold">Pattern</span>
                       <span className="text-sm font-bold text-gray-800 line-clamp-1" title={selectedExam.pattern}>{selectedExam.pattern}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                       <GraduationCap className="w-6 h-6 text-purple-500 mb-2" />
                       <span className="text-xs text-gray-400 uppercase font-bold">Age Limit</span>
                       <span className="text-lg font-bold text-gray-800">{selectedExam.min_age} - {selectedExam.max_age}</span>
                    </div>
                 </div>

                 {/* INFO SECTIONS */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-600"/> About Exam
                            </h3>
                            <p className="text-gray-600 leading-relaxed bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                                {selectedExam.description}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Syllabus Overview</h3>
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-900 text-sm font-medium">
                                {selectedExam.syllabus_hint || "Please refer to the official website for detailed syllabus."}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24">
                            <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-600"/> Important Dates
                            </h3>
                            <div className="space-y-4 relative">
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Applications Start</p>
                                    <p className="text-sm font-bold text-gray-800">{new Date(selectedExam.application_start).toLocaleDateString()}</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Applications End</p>
                                    <p className="text-sm font-bold text-gray-800">{new Date(selectedExam.application_end).toLocaleDateString()}</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Exam Date</p>
                                    <p className="text-sm font-bold text-gray-800">{new Date(selectedExam.exam_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* FOOTER */}
                 <div className="pt-6 border-t">
                    <a href={selectedExam.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition active:scale-95 shadow-xl shadow-gray-200 group">
                       Visit Official Website <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}