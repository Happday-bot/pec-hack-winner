import React, { useState, useRef, useEffect } from "react";
import { Search, Sparkles, MapPin, Building2, GraduationCap } from "lucide-react";
import gsap from "gsap";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function Colleges() {
  /* ===============================
     1. STATE MANAGEMENT
     =============================== */
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(""); // Changed from Stream to Domain
  const [selectedMedium, setSelectedMedium] = useState("");
  
  // User Data
  const [userPreferences, setUserPreferences] = useState([]); 
  const [userStream, setUserStream] = useState(null); // Student's 12th Stream (PCM, PCB)

  const [selectedCollege, setSelectedCollege] = useState(null);
  
  const heroRef = useRef(null);
  const navigate = useNavigate();

  /* ===============================
     2. CHECK ACCESS & FETCH DATA
     =============================== */
  useEffect(() => {
    const init = async () => {
      try {
        // A. Identify User
        const rawQual = sessionStorage.getItem("qualification");
        const email = sessionStorage.getItem("userEmail") || sessionStorage.getItem("signUpEmail");
        
        const qualification = rawQual === "10" || rawQual === "10th" ? "10" 
                            : rawQual === "12" || rawQual === "12th" ? "12" : null;

        if (!qualification || !email) {
          setCanAccess(false);
          setChecking(false);
          return;
        }

        // B. Fetch User Profile
        const table = qualification === "10" ? "10th_profile_data" : "12th_profile_data";
        
        // Dynamically build query: 12th graders need 'stream' column fetched
        let queryColumns = "preferred_locations";
        if (qualification === "12") {
            queryColumns += ", stream";
        }
        
        const { data: profile, error: profileError } = await supabase
          .from(table)
          .select(queryColumns) 
          .eq("email", email)
          .maybeSingle();

        if (profileError || !profile) {
          console.error("Profile Error:", profileError);
          setCanAccess(false);
        } else {
          setCanAccess(true);
          
          // --- PREFERENCES LOGIC ---
          let prefs = [];
          if (profile.preferred_locations && Array.isArray(profile.preferred_locations)) {
             prefs = profile.preferred_locations;
          } else if (profile.preferred_locations && typeof profile.preferred_locations === 'object') {
             prefs = Object.values(profile.preferred_locations);
          }
          setUserPreferences(prefs);

          // --- STREAM LOGIC (Student's Background) ---
          if (qualification === "12" && profile.stream) {
            setUserStream(profile.stream); 
          }

          // --- FETCH COLLEGES ---
          let query = supabase.from("colleges").select("*");

          // Filter by State Preference (Database Level)
          if (prefs.length > 0) {
            query = query.in("state", prefs);
          }

          const { data: collegeData, error: collegeError } = await query;
          
          if (collegeError) console.error("Error fetching colleges:", collegeError);
          else setColleges(collegeData || []);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setChecking(false);
        setLoading(false);
      }
    };

    init();
  }, []);

  /* ===============================
     3. ELIGIBILITY MAPPING (Stream -> Domains)
     =============================== */
  const getEligibleDomains = (studentStream) => {
    if (!studentStream) return []; 

    const s = studentStream.toUpperCase();

    const map = {
      // PCM Student -> Eligible for these Domains
      "PCM": ["Engineering", "Science", "Design", "Management", "Law", "Arts", "Commerce"], 
      "PCB": ["Medical", "Science", "Design", "Management", "Law", "Arts"], 
      "PCMB": ["Engineering", "Medical", "Science", "Design", "Management", "Law", "Arts", "Commerce"], 
      "COMMERCE": ["Commerce", "Management", "Law", "Arts", "Design"], 
      "ARTS": ["Arts", "Law", "Design", "Management"] 
    };

    return map[s] || [];
  };

  /* ===============================
     4. ANIMATION
     =============================== */
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
  }, [loading]);

  /* ===============================
     5. FILTERING & SORTING
     =============================== */
  let filteredColleges = colleges.filter((college) => {
    // A. Search
    const matchesSearch = college.name.toLowerCase().includes(search.toLowerCase()) || 
                          college.district?.toLowerCase().includes(search.toLowerCase());
    
    // B. Dropdown Filters (Domain & Medium)
    // Note: 'college.stream' in DB actually stores the Domain (Engineering, Medical)
    const matchesDomain = selectedDomain ? college.stream === selectedDomain : true;
    const matchesMedium = selectedMedium ? college.medium === selectedMedium : true;

    // C. 12th Grade ELIGIBILITY FILTER
    let isEligible = true;
    if (userStream) {
       const eligibleDomains = getEligibleDomains(userStream);
       // Check if the College's Domain (college.stream) is in the Student's allowed list
       if (eligibleDomains.length > 0 && !eligibleDomains.includes(college.stream)) {
         isEligible = false;
       }
    }

    return matchesSearch && matchesDomain && matchesMedium && isEligible;
  });

  // SORTING
  if (userPreferences.length > 0) {
    filteredColleges.sort((a, b) => {
      const indexA = userPreferences.indexOf(a.state);
      const indexB = userPreferences.indexOf(b.state);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  // Dynamic Dropdowns
  // college.stream represents the Domain (Engineering, Medical)
  const availableDomains = [...new Set(colleges.map(c => c.stream).filter(Boolean))];
  
  const validDropdownDomains = userStream 
      ? availableDomains.filter(d => getEligibleDomains(userStream).includes(d))
      : availableDomains;

  const uniqueMediums = [...new Set(colleges.map(c => c.medium).filter(Boolean))];

  /* ===============================
     6. RENDER
     =============================== */
  if (checking) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold">Checking access...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {!canAccess && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Profile Incomplete</h2>
            <p className="text-gray-600 mb-6">
              To view colleges based on your preferences, please complete your profile setup first.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate("/profile")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition">
                Go to Profile
              </button>
              <button onClick={() => navigate("/dashboard")} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section ref={heroRef} className="bg-indigo-600 text-white py-20 px-6 rounded-b-[3rem] shadow-xl text-center relative overflow-hidden">
         {/* Floating shapes */}
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>
        <Sparkles className="absolute top-10 right-10 w-12 h-12 text-white/20 animate-spin-slow" />
        <div className="relative z-10 max-w-4xl mx-auto">
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
            Suggested Colleges <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
          </h1>

          <p className="text-lg opacity-90">
            {userStream 
              ? `Showing eligible colleges for ${userStream} students in your preferred locations.`
              : userPreferences.length > 0 
                 ? `Showing top institutes in ${userPreferences.join(", ")}.`
                 : "Discover institutes that align with your career goals."}
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* UPDATED DROPDOWN: DOMAIN */}
          <select 
            className="w-full md:w-48 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="">All Eligible Domains</option>
            {validDropdownDomains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            className="w-full md:w-48 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={selectedMedium}
            onChange={(e) => setSelectedMedium(e.target.value)}
          >
            <option value="">All Mediums</option>
            {uniqueMediums.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20 text-indigo-600 font-bold">Loading colleges...</div>
        ) : filteredColleges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
            <p className="text-gray-400 font-medium text-lg">
               {userStream 
                 ? `No eligible colleges found for ${userStream} in your preferred locations.` 
                 : "No colleges found matching your criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college) => (
              <div key={college.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    {/* Display Domain Tag */}
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {college.stream} 
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <MapPin className="w-3 h-3" /> {college.district}, {college.state}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{college.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{college.address}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">Degrees:</span> {college.degrees?.slice(0, 3).join(", ")}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 mt-auto">
                  <button
                    onClick={() => setSelectedCollege(college)}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCollege(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-20">
              <h2 className="text-2xl font-bold text-gray-800 pr-8">{selectedCollege.name}</h2>
              <button onClick={() => setSelectedCollege(null)} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-indigo-50 p-5 rounded-2xl grid grid-cols-2 gap-4 text-sm">
                <div><span className="block text-gray-500 font-bold uppercase text-xs">Rank</span><span className="font-semibold text-gray-800">{selectedCollege.rank || "N/A"}</span></div>
                <div><span className="block text-gray-500 font-bold uppercase text-xs">Type</span><span className="font-semibold text-gray-800">{selectedCollege.type}</span></div>
                <div><span className="block text-gray-500 font-bold uppercase text-xs">Rating</span><span className="font-semibold text-gray-800">{selectedCollege.rating ? `${selectedCollege.rating}/5` : "N/A"}</span></div>
                <div><span className="block text-gray-500 font-bold uppercase text-xs">Location</span><span className="font-semibold text-gray-800">{selectedCollege.district}, {selectedCollege.state}</span></div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Courses</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCollege.degrees?.map((deg, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{deg}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Admission</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><span className="font-bold text-gray-800">Mode:</span> {selectedCollege.admission_mode}</li>
                    <li><span className="font-bold text-gray-800">Exam:</span> {selectedCollege.eligible}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Details</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><span className="font-bold text-gray-800">Fees:</span> {selectedCollege.fees}</li>
                    <li><span className="font-bold text-gray-800">Hostel:</span> {selectedCollege.hostel}</li>
                  </ul>
                </div>
              </div>

              {selectedCollege.cutoff && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Cutoffs</h3>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm">
                     {Object.entries(selectedCollege.cutoff).map(([exam, details]) => (
                        <div key={exam} className="mb-2">
                          <span className="font-bold uppercase text-indigo-600">{exam.replace('_', ' ')}: </span>
                          <span className="text-gray-700">{typeof details === 'object' ? Object.entries(details).map(([cat, val]) => `${cat}: ${val}`).join(', ') : details}</span>
                        </div>
                     ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}