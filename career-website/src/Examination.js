import React, { useState, useEffect, useRef } from "react";
import { Award } from "lucide-react";
import gsap from "gsap";

export default function Examinations() {
  const heroRef = useRef(null);

  const sampleExams = [
    {
      shortName: "JEE",
      name: "Joint Entrance Examination",
      provider: "National Testing Agency (NTA)",
      eligibility: { domicile_required: "Indian citizen", education_required: "12th pass", age_limits: { min: 17, max: 25 }, other_requirements: "Qualified at 75% in 12th" },
      paper_pattern: "Multiple choice, 300 marks, 3 hours",
      application_timeline: { start_date: "2026-01-01", end_date: "2026-02-01" },
      exam_date: "2026-04-15",
      career_prospects: { description: "Gateway to top engineering colleges in India", job_roles: ["Software Engineer", "Civil Engineer", "Mechanical Engineer"] },
      official_website: "https://jeemain.nta.ac.in",
      domain: "Engineering"
    },
    {
      shortName: "NEET",
      name: "National Eligibility cum Entrance Test",
      provider: "National Testing Agency (NTA)",
      eligibility: { domicile_required: "Indian citizen", education_required: "12th pass (PCB)", age_limits: { min: 17, max: 25 }, other_requirements: "Qualified at 50% in 12th" },
      paper_pattern: "Multiple choice, 720 marks, 3 hours",
      application_timeline: { start_date: "2026-02-01", end_date: "2026-03-01" },
      exam_date: "2026-05-17",
      career_prospects: { description: "Gateway to medical and dental colleges", job_roles: ["Doctor", "Dentist", "Nurse", "Pharmacist"] },
      official_website: "https://neet.nta.ac.in",
      domain: "Medical"
    },
    {
      shortName: "GATE",
      name: "Graduate Aptitude Test in Engineering",
      provider: "IITs and IISc",
      eligibility: { domicile_required: "Indian citizen or international", education_required: "Bachelor's in Engineering/Technology", age_limits: { min: 20, max: 30 }, other_requirements: "Final year students eligible" },
      paper_pattern: "Multiple choice + numerical, 100 marks, 3 hours",
      application_timeline: { start_date: "2026-08-01", end_date: "2026-09-01" },
      exam_date: "2026-11-10",
      career_prospects: { description: "Gateway to postgraduate engineering programs and PSUs", job_roles: ["Research Engineer", "Software Engineer", "Design Engineer"] },
      official_website: "https://gate.iitb.ac.in",
      domain: "Engineering"
    },
  ];

  const [exams] = useState(sampleExams);
  const [searchName, setSearchName] = useState("");
  const [searchDomain, setSearchDomain] = useState("All Stream");

  const domains = ["All Stream", "Engineering", "Medical", "Law", "Management", "Arts", "Science"];

  const filteredExams = exams.filter((exam) => {
    const nameMatch = exam.name.toLowerCase().includes(searchName.toLowerCase());
    const domainMatch = searchDomain === "All Stream" || exam.domain === searchDomain;
    return nameMatch && domainMatch;
  });

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
      gsap.to(".floating-shape", { y: "-=20", repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut", stagger: 0.3 });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-[Poppins]">
      {/* HEADER */}
      <header ref={heroRef} className="relative text-center py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg overflow-hidden rounded-b-3xl">
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 flex justify-center items-center gap-3">
            <span className="animate-bounce inline-block">📝</span> Examinations
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mt-3">
            Stay informed with exams tailored to your career path.
          </p>
        </div>
      </header>

      {/* SEARCH BARS */}
      
<div className="flex items-center justify-between mt-8 px-20 max-w-[1600px] mx-auto w-full">

  {/* LEFT - SEARCH */}
  <input
    type="text"
    placeholder="Search by exam name..."
    className="border border-gray-300 rounded-lg p-2 w-[250px]"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
  />

  {/* RIGHT - DROPDOWN */}
  <select
    className="border border-gray-300 rounded-lg p-2 w-[250px]"
    value={searchDomain}
    onChange={(e) => setSearchDomain(e.target.value)}
  >
    {domains.map((d) => (
      <option key={d} value={d}>{d}</option>
    ))}
  </select>

</div>


      {/* MAIN CONTENT */}
<div className="flex-1 space-y-10 px-8 py-10 max-w-[1600px] mx-auto">
  <section>
    <div className="flex flex-wrap justify-center gap-8">
      {filteredExams.map((exam, idx) => (
        <div
  key={idx}
  className="p-8 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 
             w-full md:w-[45rem] lg:w-[45rem]"
>




          <h3 className="text-xl font-bold mb-3 text-indigo-700 flex items-center gap-2">
            <Award className="text-xl font-bold text-indigo-700" />
            {exam.shortName || exam.name}
          </h3>

          {exam.provider && <p className="mb-2 text-gray-700"><strong>Provider:</strong> {exam.provider}</p>}

          {exam.eligibility && (
            <div className="mb-3 text-gray-700 leading-relaxed">
              <strong>Eligibility:</strong>
              <ul className="list-disc ml-5 mt-1">
                {exam.eligibility.domicile_required && <li>Domicile: {exam.eligibility.domicile_required}</li>}
                {exam.eligibility.education_required && <li>Education: {exam.eligibility.education_required}</li>}
                {exam.eligibility.age_limits && <li>Age Limits: {exam.eligibility.age_limits.min} - {exam.eligibility.age_limits.max} years</li>}
                {exam.eligibility.other_requirements && <li>Other: {exam.eligibility.other_requirements}</li>}
              </ul>
            </div>
          )}

          {exam.paper_pattern && <p className="mb-2 text-gray-700"><strong>Exam Pattern:</strong> {exam.paper_pattern}</p>}

          {exam.application_timeline && <p className="mb-2 text-gray-700"><strong>Application:</strong> {new Date(exam.application_timeline.start_date).toLocaleDateString()} - {new Date(exam.application_timeline.end_date).toLocaleDateString()}</p>}

          {exam.exam_date && <p className="mb-2 text-gray-700"><strong>Exam Date:</strong> {new Date(exam.exam_date).toLocaleDateString()}</p>}

          {exam.career_prospects && (
            <div className="text-gray-700">
              <strong>Career Opportunities:</strong>
              {exam.career_prospects.description && <p>{exam.career_prospects.description}</p>}
              {exam.career_prospects.job_roles && (
                <ul className="list-disc ml-5 mt-1">
                  {exam.career_prospects.job_roles.map((role, i) => <li key={i}>{role}</li>)}
                </ul>
              )}
            </div>
          )}

          {exam.official_website && (
            <p className="mt-2 text-blue-600 hover:underline">
              <a href={exam.official_website} target="_blank" rel="noopener noreferrer">Official Website</a>
            </p>
          )}
        </div>
      ))}
    </div>
  </section>
</div>



      {/* FOOTER */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 border-t border-gray-200 shadow-inner">
        © 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
}
