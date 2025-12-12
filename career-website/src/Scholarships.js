import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ScrollText, Sparkles } from "lucide-react";
import gsap from "gsap";

export default function Scholarships() {
  const heroRef = useRef(null);

  const [scholarships, setScholarships] = useState([]);
  const [expanded, setExpanded] = useState({});

  // SEARCH + FILTER states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStream, setSelectedStream] = useState("All Stream");
  const [selectedCriteria, setSelectedCriteria] = useState("All Criteria");

  const streams = ["All Stream", "Engineering", "Medical", "Arts", "Science", "Law", "Management"];
  const specialCriteria = [
    "All Criteria",
    "Women's College",
    "Minority/Community Based",
    "Central Government",
    "State Government",
    "Income-Based",
    "Disability-Based",
    "Merit-Based"
  ];

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
  // Load dummy data
  useEffect(() => {
    const dummyScholarships = [
      {
        scholarship_name: "Post Matric Scholarship for SC Students",
        type: "Minority/Community Based",
        administered_by: "Ministry of Social Justice & Empowerment",
        benefits: { tuition_fee_limit: 50000, maintenance_amount: 8000 },
        eligibility: { min_class: 11, max_class: "UG/PG", income_limit: 250000, category: "SC", gender: "Any", domicile: "India", disability_required: false },
        courses_covered: ["Engineering", "Medical", "Arts", "Science"],
        application: { start_date: "2025-01-05", end_date: "2025-03-30", required_documents: ["Caste Certificate", "Income Certificate", "Aadhar"] },
        seats: 10000,
        application_portal: "https://scholarships.gov.in",
      },
      {
        scholarship_name: "Inspire Scholarship (SHE)",
        type: "Merit-Based",
        administered_by: "Department of Science & Technology",
        benefits: { tuition_fee_limit: 0, maintenance_amount: 80000 },
        eligibility: { min_class: 12, max_class: "UG", min_percentage: 85, category: "General", gender: "Any", domicile: "India" },
        courses_covered: ["B.Sc", "M.Sc", "Research"],
        application: { start_date: "2025-01-15", end_date: "2025-03-01", required_documents: ["Aadhar", "Marksheet", "Bank Passbook"] },
        seats: 12000,
        application_portal: "https://online-inspire.gov.in",
      },
      {
        scholarship_name: "National Means Cum Merit Scholarship (NMMS)",
        type: "Income-Based",
        administered_by: "Ministry of Education",
        benefits: { tuition_fee_limit: 0, maintenance_amount: 12000 },
        eligibility: { min_class: 9, max_class: 12, income_limit: 350000, category: "Any", gender: "Any", domicile: "India" },
        courses_covered: ["School Education"],
        application: { start_date: "2025-06-01", end_date: "2025-08-10", required_documents: ["Income Certificate", "School ID"] },
        seats: 1000,
        application_portal: "https://scholarships.gov.in",
      },
      {
        scholarship_name: "Disability Scholarship for Engineering Students",
        type: "Disability-Based",
        administered_by: "Department of Empowerment of Persons with Disabilities",
        benefits: { tuition_fee_limit: 40000, maintenance_amount: 15000 },
        eligibility: { min_class: 12, max_class: "UG", income_limit: 500000, category: "Any", gender: "Any", domicile: "India", disability_required: true },
        courses_covered: ["Engineering", "B.E", "B.Tech"],
        application: { start_date: "2025-02-01", end_date: "2025-04-30", required_documents: ["Disability Certificate", "Marksheet"] },
        seats: 500,
        application_portal: "https://disability.scholarships.in",
      },
      {
        scholarship_name: "Post Matric Scholarship for SC Students",
        type: "Minority/Community Based",
        administered_by: "Ministry of Social Justice & Empowerment",
        benefits: { tuition_fee_limit: 50000, maintenance_amount: 8000 },
        eligibility: { min_class: 11, max_class: "UG/PG", income_limit: 250000, category: "SC", gender: "Any", domicile: "India", disability_required: false },
        courses_covered: ["Engineering", "Medical", "Arts", "Science"],
        application: { start_date: "2025-01-05", end_date: "2025-03-30", required_documents: ["Caste Certificate", "Income Certificate", "Aadhar"] },
        seats: 10000,
        application_portal: "https://scholarships.gov.in",
      },
      {
        scholarship_name: "Inspire Scholarship (SHE)",
        type: "Merit-Based",
        administered_by: "Department of Science & Technology",
        benefits: { tuition_fee_limit: 0, maintenance_amount: 80000, other_benefits: "Annual Scholarship for Science stream" },
        eligibility: { min_class: 12, max_class: "UG", min_percentage: 85, category: "General", gender: "Any", domicile: "India" },
        courses_covered: ["B.Sc", "M.Sc", "Research"],
        application: { start_date: "2025-01-15", end_date: "2025-03-01", required_documents: ["Aadhar", "Marksheet", "Bank Passbook"] },
        seats: 12000,
        application_portal: "https://online-inspire.gov.in",
      },
      {
        scholarship_name: "State Government Engineering Scholarship",
        type: "Engineering",
        administered_by: "State Education Department",
        benefits: { tuition_fee_limit: 60000, maintenance_amount: 10000 },
        eligibility: { min_class: 12, max_class: "UG", min_percentage: 80, income_limit: 400000, category: "Any", gender: "Any", domicile: "Tamil Nadu" },
        courses_covered: ["B.E", "B.Tech"],
        application: { start_date: "2025-05-01", end_date: "2025-07-30", required_documents: ["Marksheet", "Income Certificate", "Community Certificate"] },
        seats: 3000,
        application_portal: "https://tn.gov.in/scholarships",
      },
      {
        scholarship_name: "National Means Cum Merit Scholarship (NMMS)",
        type: "Income-Based",
        administered_by: "Ministry of Education",
        benefits: { tuition_fee_limit: 0, maintenance_amount: 12000 },
        eligibility: { min_class: 9, max_class: 12, income_limit: 350000, category: "Any", gender: "Any", domicile: "India" },
        courses_covered: ["School Education"],
        application: { start_date: "2025-06-01", end_date: "2025-08-10", required_documents: ["Income Certificate", "School ID"] },
        seats: 1000,
        application_portal: "https://scholarships.gov.in",
      },
      {
        scholarship_name: "National Scheme of Incentive for Girls",
        type: "Women's College",
        administered_by: "Ministry of Women & Child Development",
        benefits: { tuition_fee_limit: 20000, maintenance_amount: 20000 },
        eligibility: { min_class: 9, max_class: 12, income_limit: 250000, category: "Any", gender: "Female", domicile: "India" },
        courses_covered: ["School Education"],
        application: { start_date: "2025-04-01", end_date: "2025-06-15", required_documents: ["Birth Certificate", "Income Certificate"] },
        seats: 5000,
        application_portal: "https://scholarships.gov.in",
      },
      {
        scholarship_name: "Central Government Law Scholarship",
        type: "Merit-Based",
        administered_by: "Central Government Department of Education",
        benefits: { tuition_fee_limit: 40000, maintenance_amount: 10000 },
        eligibility: { min_class: 12, max_class: "UG", min_percentage: 75, category: "Any", gender: "Any", domicile: "India" },
        courses_covered: ["Law"],
        application: { start_date: "2025-03-01", end_date: "2025-05-30", required_documents: ["Marksheet", "Aadhar"] },
        seats: 2500,
        application_portal: "https://centralgov.scholarships.in",
      },
      
    ];

    setScholarships(dummyScholarships);
  },
   []);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  

  // FILTERED SCHOLARSHIPS
  const filteredScholarships = scholarships
    .filter((s) => s.scholarship_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((s) => (selectedStream === "All Stream" ? true : s.courses_covered.includes(selectedStream)))
    .filter((s) => {
      switch (selectedCriteria) {
        case "All Criteria":
          return true;
        case "Women's College":
          return s.eligibility.gender === "Female";
        case "Minority/Community Based":
          return ["SC", "ST", "OBC", "Minority"].includes(s.eligibility.category);
        case "Central Government":
          return s.administered_by.includes("Central");
        case "State Government":
          return s.administered_by.includes("State");
        case "Income-Based":
          return !!s.eligibility.income_limit;
        case "Disability-Based":
          return s.eligibility.disability_required;
        case "Merit-Based":
          return !!s.eligibility.min_percentage;
        default:
          return true;
      }
    });

  return (
    <div className="flex flex-col min-h-screen">
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
                 <h1 className="flex justify-center items-center gap-3 text-4xl md:text-5xl font-extrabold mb-3">
            <ScrollText className="w-8 h-8 text-yellow-600 animate-bounce" />
            Scholarships
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Explore scholarships that align with your academic goals and financial needs.
          </p>
              </div>
      
              <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20 animate-spin-slow" />
            </section>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="space-y-10 px-8 py-6 max-w-7xl mx-auto">
          <section>
            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2 md:px-4 mb-6">
              <input
                type="text"
                placeholder="Search scholarships..."
                className="border border-gray-300 rounded-lg p-2 w-[230px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="border border-gray-300 rounded-lg p-2 w-[230px]" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                {streams.map((stream, i) => (
                  <option key={i} value={stream}>{stream}</option>
                ))}
              </select>
              <select className="border border-gray-300 rounded-lg p-2 w-[230px]" value={selectedCriteria} onChange={(e) => setSelectedCriteria(e.target.value)}>
                {specialCriteria.map((crit, i) => (
                  <option key={i} value={crit}>{crit}</option>
                ))}
              </select>
            </div>

            {/* SCHOLARSHIP CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map((s, idx) => (
                <div key={idx} className="p-6 border rounded-xl shadow-sm hover:shadow-md bg-white transition-shadow">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(idx)}>
                    <h3 className="text-xl font-bold text-indigo-700">{s.scholarship_name}</h3>
                    {expanded[idx] ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                  </div>

                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Start Date:</span> {s.application?.start_date || "N/A"}</p>
                    <p><span className="font-medium">Last Date:</span> {s.application?.end_date || "N/A"}</p>
                  </div>

                  <div className="mt-4">
                    <span className="font-medium">Benefits:</span>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                      <li>Tuition Fee: ₹{s.benefits?.tuition_fee_limit?.toLocaleString()}</li>
                      <li>Maintenance: ₹{s.benefits?.maintenance_amount?.toLocaleString()}</li>
                      {s.benefits?.other_benefits && <li>{s.benefits.other_benefits}</li>}
                    </ul>
                  </div>

                  {expanded[idx] && (
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                      <p><span className="font-medium">Type:</span> {s.type} | <span className="font-medium">By:</span> {s.administered_by}</p>

                      <div>
                        <span className="font-medium">Eligibility:</span>
                        <ul className="list-disc list-inside">
                          <li>Class: {s.eligibility?.min_class} – {s.eligibility?.max_class}</li>
                          {s.eligibility?.min_percentage && <li>Minimum Percentage: {s.eligibility.min_percentage}%</li>}
                          <li>Income Limit: ₹{s.eligibility?.income_limit?.toLocaleString()}</li>
                          <li>Category: {s.eligibility?.category}</li>
                          <li>Gender: {s.eligibility?.gender}</li>
                          <li>Domicile: {s.eligibility?.domicile}</li>
                          <li>Disability Required: {s.eligibility?.disability_required ? "Yes" : "No"}</li>
                        </ul>
                      </div>

                      <p><span className="font-medium">Courses Covered:</span> {s.courses_covered?.join(", ")}</p>

                      <div>
                        <span className="font-medium">Required Documents:</span>
                        <ul className="list-disc list-inside">{s.application?.required_documents?.map((doc, i) => <li key={i}>{doc}</li>)}</ul>
                      </div>

                      <p><span className="font-medium">Seats:</span> {s.seats}</p>

                      <a href={s.application_portal} target="_blank" rel="noopener noreferrer">
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Apply Now</button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-100 text-gray-600 text-center py-4 border-t border-gray-200 shadow-inner mt-auto">
        © 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
}
