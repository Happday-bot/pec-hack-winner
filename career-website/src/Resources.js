import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollText, Sparkles } from "lucide-react";


// STREAM ICONS (for 12th subjects)
const GradientIcons = {
  Science: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
      <span className="text-white text-2xl">🧪</span>
    </div>
  ),
  Commerce: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
      <span className="text-white text-2xl">💼</span>
    </div>
  ),
  Arts: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
      <span className="text-white text-2xl">🎨</span>
    </div>
  ),
  Default: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
      <span className="text-white text-2xl">📘</span>
    </div>
  ),
};

// COLLEGE BIG CATEGORY ICONS
const CollegeIcons = {
  CSE: "💻",
  NonCSE: "📐",
  Medical: "🩺",
  Law: "⚖️",
  Management: "📊",
  ArtsScience: "🎓",
};

// SAMPLE DATA
const completeData = {
  "12": { next: "12th" },
  college: { next: "college_categories" },

  "12th": {
    subjects: [
      {
        id: "botany",
        title: "Botany",
        language: "English",
        stream: "Science",
        resources: [{ id: "1", name: "Botany Vol 1", file: "/ebooks/botany_v1.pdf" }],
      },
      {
        id: "zoology",
        title: "Zoology",
        language: "Tamil",
        stream: "Science",
        resources: [{ id: "1", name: "Zoology Vol 1", file: "/ebooks/zoo.pdf" }],
      },
      {
        id: "physics",
        title: "Physics",
        language: "English",
        stream: "Science",
        resources: [{ id: "1", name: "Physics Vol 1", file: "/ebooks/phy.pdf" }],
      },
      {
        id: "accountancy",
        title: "Accountancy",
        language: "English",
        stream: "Commerce",
        resources: [{ id: "1", name: "Accountancy Guide", file: "/ebooks/acc.pdf" }],
      },
      {
        id: "history",
        title: "History",
        language: "Tamil",
        stream: "Arts",
        resources: [{ id: "1", name: "Indian History", file: "/ebooks/his.pdf" }],
      },
    ],
  },

  college_categories: {
    categories: [
      { id: "CSE", title: "CSE" },
      { id: "NonCSE", title: "Non-CSE" },
      { id: "Medical", title: "Medical" },
      { id: "Law", title: "Law" },
      { id: "Management", title: "Management" },
      { id: "ArtsScience", title: "Arts & Science" },
    ],
  },

  CSE: {
    subjects: [
      { id: "ds", title: "Data Structures", language: "English", stream: "Science", resources: [{ id: "1", name: "DSA Notes", file: "/ebooks/dsa.pdf" }] },
      { id: "dbms", title: "DBMS", language: "English", stream: "Science", resources: [{ id: "1", name: "DBMS Notes", file: "/ebooks/dbms.pdf" }] },
    ],
  },

  NonCSE: {
    subjects: [
      { id: "mech", title: "Mechanical Basics", language: "English", stream: "Science", resources: [{ id: "1", name: "Thermo Notes", file: "/ebooks/mech.pdf" }] },
    ],
  },

  Medical: {
    subjects: [
      { id: "anatomy", title: "Anatomy", language: "English", stream: "Science", resources: [{ id: "1", name: "Anatomy Notes", file: "/ebooks/ana.pdf" }] },
    ],
  },

  Law: {
    subjects: [
      { id: "criminal-law", title: "Criminal Law", language: "Arts", stream: "Arts", resources: [{ id: "1", name: "Criminal Law Guide", file: "/ebooks/law.pdf" }] },
    ],
  },

  Management: {
    subjects: [
      { id: "marketing", title: "Marketing", language: "Commerce", stream: "Commerce", resources: [{ id: "1", name: "Marketing Basics", file: "/ebooks/marketing.pdf" }] },
    ],
  },

  ArtsScience: {
    subjects: [
      { id: "psychology", title: "Psychology", language: "Arts", stream: "Arts", resources: [{ id: "1", name: "Psychology Notes", file: "/ebooks/psy.pdf" }] },
    ],
  },
};

export default function EBooks() {
  const heroRef = useRef(null);

  const [category, setCategory] = useState("12");
  const [selectedCollegeCat, setSelectedCollegeCat] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchSubject, setSearchSubject] = useState("");
  const [searchResource, setSearchResource] = useState("");
  const [language, setLanguage] = useState("All");

  const level = completeData[category]?.next;

  const subjects = selectedCollegeCat
    ? completeData[selectedCollegeCat].subjects
    : completeData[level]?.subjects || [];

  const filteredSubjects = subjects.filter((s) =>
    s.title.toLowerCase().includes(searchSubject.toLowerCase())
  );

  useEffect(() => {
    if (heroRef.current) {
      // Hero fade in
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      // Floating bubbles
      gsap.to(".floating-shape", {
        y: "-=20",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
        stagger: 0.3,
      });
    }

    
  }, []);

  useEffect(() => {
  setLanguage("All");
  setSearchResource(""); // optional: reset resource search too
}, [selectedSubject]);


  const handleBack = () => {
  // If inside a college subject (resources page), go directly to category list
  if (selectedSubject && selectedCollegeCat) {
    setSelectedSubject(null);
    setSelectedCollegeCat(null);
    return;
  }

  // Normal 12th behavior
  if (selectedSubject) {
    setSelectedSubject(null);
    return;
  }

  if (selectedCollegeCat) {
    setSelectedCollegeCat(null);
    return;
  }
};


  const handleCollegeClick = (catId) => {
  setSelectedCollegeCat(catId);

  // open first subject instantly (skip middle subject page)
  const firstSubject = completeData[catId]?.subjects?.[0];

  if (firstSubject) {
    setSelectedSubject(firstSubject);
  }
};


  return (
    <div className="flex flex-col min-h-screen font-[Poppins]">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600
        text-white py-20 px-6 md:px-16 rounded-b-3xl overflow-hidden shadow-lg"
      >
        {/* Floating shapes */}
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="flex justify-center items-center gap-3 text-4xl md:text-5xl font-extrabold">
            <span className="animate-bounce">📚</span>
            Explore E-Books
          </h1>
          <p className="mt-3 text-lg text-blue-100">
            Read, learn, and grow with a wide collection of digital books across multiple domains.
          </p>
        </div>

        <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20 animate-spin-slow" />
      </section>


      <main className="flex-grow bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          

          {/* SEARCH + CATEGORY */}
          {!selectedSubject && !selectedCollegeCat && (
            <div className="flex justify-between items-center gap-4 mb-8 flex-wrap">
              <input
                type="text"
                placeholder="Search subjects..."
                className="p-3 border rounded-lg w-60"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
              />

              <div className="flex items-center gap-3">
  <label className="font-medium text-gray-700">Category:</label>
  <select
    className="p-3 border rounded-lg w-48"
    value={category}
    onChange={(e) => {
      setCategory(e.target.value);
      setSelectedCollegeCat(null);
      setSelectedSubject(null);
    }}
  >
    <option value="12">12th</option>
    <option value="college">College</option>
  </select>
</div>
            </div>
          )}

          {/* BACK BUTTON */}
          {(selectedCollegeCat || selectedSubject) && (
            <button
              className="mb-6 px-4 py-2 bg-gray-200 rounded-lg"
              onClick={handleBack}
            >
              ← Back
            </button>
          )}

          {/* COLLEGE CATEGORY GRID */}
          {category === "college" && !selectedCollegeCat && !selectedSubject && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {completeData.college_categories.categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCollegeClick(cat.id)}
                  className="p-6 bg-white shadow rounded-xl hover:shadow-xl hover:scale-105 transition cursor-pointer flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl">
                    {CollegeIcons[cat.id]}
                  </div>
                  <h3 className="text-xl font-bold mt-4 text-center">{cat.title}</h3>
                </div>
              ))}
            </div>
          )}

          {/* SUBJECT LISTS */}
          {!selectedSubject && (
            <>
              {/* 12TH SUBJECTS → CARD VIEW */}
              {level === "12th" && !selectedCollegeCat && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSubjects.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub)}
                      className="p-6 bg-white shadow rounded-xl hover:shadow-xl hover:-translate-y-1 transition cursor-pointer flex flex-col items-center"
                    >
                      {GradientIcons[sub.stream] || GradientIcons.Default}
                      <h3 className="text-xl font-bold mt-4">{sub.title}</h3>
                    </div>
                  ))}

                  {filteredSubjects.length === 0 && (
                    <p className="text-gray-500">No subjects found.</p>
                  )}
                </div>
              )}

              {/* COLLEGE SUBJECTS → LIST VIEW */}
              {selectedCollegeCat && (
                <div className="space-y-4">
                  {filteredSubjects.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub)}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-gray-100 transition"
                    >
                      
                    </div>
                  ))}

                  {filteredSubjects.length === 0 && (
                    <p className="text-gray-500">No subjects found.</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* RESOURCES */}
{selectedSubject && (
  <div>
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <input
  type="text"
  placeholder="Search resources..."
  className="p-3 border rounded-lg w-100" // fixed width
  value={searchResource}
  onChange={(e) => setSearchResource(e.target.value)}
/>


      <select
        className="p-3 border rounded-lg w-40 ml-auto" // move to right
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="All">All Languages</option>
        <option value="English">English</option>
        <option value="Tamil">Tamil</option>
      </select>
    </div>

    <div className="space-y-4">
      {selectedSubject.resources
        .filter((r) => {
          const languageMatch = language === "All" || selectedSubject.language === language;
          const resourceMatch = r.name.toLowerCase().includes(searchResource.toLowerCase());
          return languageMatch && resourceMatch;
        })
        .map((res) => (
          <div key={res.id} className="p-4 bg-white shadow rounded-xl">
            <a
              href={res.file}
              target="_blank"
              className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 text-gray-800"
            >
              📄 {res.name}
            </a>
          </div>
        ))}

      {selectedSubject.resources.filter((r) => {
        const languageMatch = language === "All" || selectedSubject.language === language;
        const resourceMatch = r.name.toLowerCase().includes(searchResource.toLowerCase());
        return languageMatch && resourceMatch;
      }).length === 0 && (
        <p className="text-gray-500">No resources found.</p>
      )}
    </div>
  </div>
)}

        </div>
      </main>

      <footer className="bg-white text-center py-4 border-t">
        © 2025 Career Website
      </footer>
    </div>
  );
}
