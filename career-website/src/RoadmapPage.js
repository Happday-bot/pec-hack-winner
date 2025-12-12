import React, { useState, useEffect, useRef } from "react";
import { XCircle } from "lucide-react";
import { Search, X, Sparkles } from "lucide-react";
import gsap from "gsap";



const RoadmapPage = ({ course, goBack }) => {
  const [roadmap, setRoadmap] = useState({});
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [requiredSkills, setRequiredSkills] = useState([]);
const [projects, setProjects] = useState([]);

  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
    gsap.to(".floating-shape", {
      y: "-=20",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
      stagger: 0.3,
    });
  }, []);
  useEffect(() => {
    // Full roadmap data for each career
    const fullRoadmap = {
      "Frontend Developer": {
        Beginner: [
          { id: "s1", title: "HTML & CSS Basics", desc: "Learn HTML & CSS fundamentals.", resources: [{ title: "MDN HTML", url: "https://developer.mozilla.org/", resource_type: "Docs" }] },
          { id: "s2", title: "JavaScript Basics", desc: "Understand JS variables, loops, DOM.", resources: [{ title: "Eloquent JS", url: "https://eloquentjavascript.net/", resource_type: "Book" }] },
        ],
        Intermediate: [
          { id: "s3", title: "React Basics", desc: "Props, state, hooks.", resources: [{ title: "React Docs", url: "https://reactjs.org/", resource_type: "Docs" }] },
          { id: "s12", title: "CSS Flex & Grid", desc: "Layout designs using flexbox and grid.", resources: [{ title: "CSS Tricks", url: "https://css-tricks.com/", resource_type: "Docs" }] },
        ],
        Advanced: [
          { id: "s4", title: "System Design", desc: "Learn scalable architecture.", resources: [{ title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", resource_type: "Repo" }] },
          { id: "s13", title: "Performance Optimization", desc: "Optimize web app performance.", resources: [{ title: "Web.dev", url: "https://web.dev/performance/", resource_type: "Docs" }] },
        ],
      },
      "Backend Developer": {
        Beginner: [
          { id: "s5", title: "Python / Java Basics", desc: "Fundamentals of backend programming.", resources: [{ title: "Python for Everyone", url: "https://example.com", resource_type: "Course" }] },
          { id: "s14", title: "REST APIs", desc: "Learn how to build RESTful APIs.", resources: [{ title: "REST API Tutorial", url: "https://restfulapi.net/", resource_type: "Docs" }] },
        ],
        Intermediate: [
          { id: "s15", title: "Authentication & Security", desc: "JWT, OAuth, and session management.", resources: [{ title: "Auth0 Docs", url: "https://auth0.com/docs", resource_type: "Docs" }] },
          { id: "s16", title: "Caching & Optimization", desc: "Use Redis and caching strategies.", resources: [{ title: "Redis Docs", url: "https://redis.io/docs", resource_type: "Docs" }] },
        ],
        Advanced: [
          { id: "s6", title: "Database Management", desc: "SQL, NoSQL DBs.", resources: [{ title: "PostgreSQL Docs", url: "https://postgresql.org", resource_type: "Docs" }] },
          { id: "s17", title: "Microservices Architecture", desc: "Design scalable microservices.", resources: [{ title: "Microservices Guide", url: "https://microservices.io/", resource_type: "Docs" }] },
        ],
      },
      "Data Scientist": {
        Beginner: [
          { id: "s18", title: "Python for Data", desc: "Learn Python basics for data analysis.", resources: [{ title: "Kaggle Python", url: "https://www.kaggle.com/learn/python", resource_type: "Course" }] },
          { id: "s19", title: "Data Visualization", desc: "Use Matplotlib and Seaborn.", resources: [{ title: "Seaborn Docs", url: "https://seaborn.pydata.org/", resource_type: "Docs" }] },
        ],
        Intermediate: [
          { id: "s7", title: "Statistics & Probability", desc: "Learn stats for data analysis.", resources: [{ title: "Khan Academy", url: "https://www.khanacademy.org/", resource_type: "Course" }] },
          { id: "s20", title: "Data Cleaning & Preprocessing", desc: "Handle missing data, outliers, normalization.", resources: [{ title: "Pandas Docs", url: "https://pandas.pydata.org/", resource_type: "Docs" }] },
        ],
        Advanced: [
          { id: "s21", title: "Machine Learning Models", desc: "Supervised and unsupervised learning.", resources: [{ title: "Scikit-Learn Docs", url: "https://scikit-learn.org/", resource_type: "Docs" }] },
          { id: "s22", title: "Deep Learning", desc: "Neural networks and CNNs.", resources: [{ title: "TensorFlow Docs", url: "https://tensorflow.org", resource_type: "Docs" }] },
        ],
      },
      "UI/UX Designer": {
        Beginner: [
          { id: "s8", title: "Figma Basics", desc: "Learn Figma for UI design.", resources: [{ title: "Figma Tutorial", url: "https://example.com", resource_type: "Video" }] },
          { id: "s23", title: "Color Theory & Typography", desc: "Learn design principles for UI.", resources: [{ title: "Design Basics", url: "https://example.com", resource_type: "Docs" }] },
        ],
        Intermediate: [
          { id: "s24", title: "Wireframing & Prototyping", desc: "Create interactive prototypes.", resources: [{ title: "Figma Docs", url: "https://help.figma.com/", resource_type: "Docs" }] },
          { id: "s25", title: "User Research", desc: "Conduct usability testing and surveys.", resources: [{ title: "NNG UX Research", url: "https://www.nngroup.com/", resource_type: "Docs" }] },
        ],
        Advanced: [
          { id: "s26", title: "Design Systems", desc: "Build scalable UI components.", resources: [{ title: "Material Design", url: "https://material.io/", resource_type: "Docs" }] },
          { id: "s27", title: "Advanced Interaction Design", desc: "Animations and micro-interactions.", resources: [{ title: "UX Collective", url: "https://uxdesign.cc/", resource_type: "Article" }] },
        ],
      },
      "Doctor": {
        Beginner: [
          { id: "s9", title: "Medical Basics", desc: "Biology & Anatomy fundamentals.", resources: [{ title: "MedlinePlus", url: "https://medlineplus.gov/", resource_type: "Docs" }] },
          { id: "s28", title: "Physiology Basics", desc: "Understand human body functions.", resources: [{ title: "Physiology Online", url: "https://www.physiology.org/", resource_type: "Docs" }] },
        ],
        Intermediate: [
          { id: "s29", title: "Pathology & Diagnosis", desc: "Learn common diseases and diagnostics.", resources: [{ title: "Pathology Guide", url: "https://example.com", resource_type: "Docs" }] },
          { id: "s30", title: "Medical Ethics", desc: "Understand patient care ethics.", resources: [{ title: "Ethics Resource", url: "https://example.com", resource_type: "Docs" }] },
        ],
        Advanced: [
          { id: "s31", title: "Advanced Clinical Practice", desc: "Specialist medical procedures.", resources: [{ title: "Clinical Docs", url: "https://example.com", resource_type: "Docs" }] },
          { id: "s32", title: "Research & Publications", desc: "Medical research and paper writing.", resources: [{ title: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/", resource_type: "Docs" }] },
        ],
      },
      "Machine Learning Engineer": {
        Beginner: [
          { id: "s33", title: "Python for ML", desc: "Python fundamentals for ML.", resources: [{ title: "Kaggle Python", url: "https://www.kaggle.com/learn/python", resource_type: "Course" }] },
          { id: "s34", title: "Linear Algebra & Calculus", desc: "Math foundation for ML.", resources: [{ title: "Khan Academy Math", url: "https://www.khanacademy.org/", resource_type: "Course" }] },
        ],
        Intermediate: [
          { id: "s10", title: "ML Algorithms", desc: "Supervised & Unsupervised learning.", resources: [{ title: "ML by Andrew Ng", url: "https://coursera.org", resource_type: "Course" }] },
          { id: "s35", title: "Data Preprocessing & Feature Engineering", desc: "Clean and transform data for models.", resources: [{ title: "Kaggle Docs", url: "https://www.kaggle.com/", resource_type: "Docs" }] },
        ],
        Advanced: [
          { id: "s11", title: "Deep Learning", desc: "Neural networks & CNNs.", resources: [{ title: "TensorFlow Docs", url: "https://tensorflow.org", resource_type: "Docs" }] },
          { id: "s36", title: "Deployment & MLOps", desc: "Deploy ML models in production.", resources: [{ title: "MLflow Docs", url: "https://mlflow.org/", resource_type: "Docs" }] },
        ],
      },
    };

    const careerExtras = {
  "Frontend Developer": {
    skills: [
      "HTML", "CSS", "JavaScript", "React", "Flexbox & Grid", "Responsive Design", "Version Control (Git)"
    ],
    projects: [
      "Portfolio Website", "E-commerce Website", "Landing Page Clone", "Interactive Quiz App"
    ]
  },
  "Backend Developer": {
    skills: [
      "Python / Java", "REST APIs", "Database Management", "Authentication", "Caching", "Microservices"
    ],
    projects: [
      "REST API for Todo App", "Blog API", "Authentication System", "E-commerce Backend"
    ]
  },
  "Data Scientist": {
    skills: [
      "Python", "Data Visualization", "Statistics", "Data Cleaning", "Machine Learning", "Deep Learning"
    ],
    projects: [
      "Sales Prediction Model", "Customer Segmentation", "Stock Price Prediction", "Image Classification"
    ]
  },
  "UI/UX Designer": {
    skills: [
      "Figma", "Wireframing", "Prototyping", "User Research", "Color Theory", "Typography", "Interaction Design"
    ],
    projects: [
      "Portfolio Redesign", "Mobile App Prototype", "Website Wireframe", "UI Case Study"
    ]
  },
  "Doctor": {
    skills: [
      "Anatomy", "Physiology", "Pathology", "Diagnostics", "Medical Ethics", "Clinical Practice"
    ],
    projects: [
      "Patient Case Study", "Medical Research Paper", "Clinical Observation Log"
    ]
  },
  "Machine Learning Engineer": {
    skills: [
      "Python", "Linear Algebra", "Calculus", "ML Algorithms", "Data Preprocessing", "Deep Learning", "Deployment"
    ],
    projects: [
      "ML Model Deployment", "Image Recognition App", "Recommendation System", "Time Series Forecasting"
    ]
  }
};


    setRoadmap(fullRoadmap[course.title] || {});
    setRequiredSkills(careerExtras[course.title]?.skills || []);
setProjects(careerExtras[course.title]?.projects || []);

  }, [course]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col relative">
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 md:px-16 rounded-b-3xl overflow-hidden shadow-lg"
      >
        <div className="floating-shape absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="floating-shape absolute -bottom-16 -right-12 w-48 h-48 bg-white/20 rounded-full"></div>
        <div className="floating-shape absolute top-12 right-32 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="floating-shape absolute top-8 left-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

        <button
          onClick={goBack}
          className="absolute left-14 top-1/2 -translate-y-1/2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100"
        >
          Back
        </button>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-center">{course.title}</h1>
    
        
        <Sparkles className="absolute top-10 right-10 w-16 h-16 text-white opacity-20 animate-spin-slow" />
      </section>
      

    <main className="flex-1 flex flex-col justify-center items-center px-6 py-10 max-w-5xl mx-auto mt-16 ">
  {/* ====== ROADMAP TITLE ====== */}
  <div className="w-full mb-7">
    <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-900">
      Roadmap for {course.title}
    </h2>
  </div>

  {/* ====== ROADMAP CARDS ====== */}
  {Object.keys(roadmap).length === 0 ? (
    <p className="text-gray-600 text-center">No roadmap found for this career.</p>
  ) : (
    Object.keys(roadmap).map((level) => (
      <div key={level} className="w-full mb-12">
        <h2 className="text-xl font-semibold mb-6 text-indigo-700 border-l-4 border-indigo-500 pl-3">
          {level} Level
        </h2>
        <div className="flex justify-center items-center gap-5 flex-wrap">
          {roadmap[level].map((node, index) => (
            <div key={node.id} className="flex items-center">
              <div
                className="p-5 w-56 h-48 bg-white rounded-2xl shadow hover:shadow-lg border border-indigo-100 cursor-pointer transition transform hover:-translate-y-1 flex flex-col justify-center items-center text-center"
                onClick={() => setSelectedSkill(node)}
              >
                <h3 className="font-bold text-indigo-700 mb-2">{node.title}</h3>
                <p className="text-gray-600 text-sm">{node.desc}</p>
              </div>

              {index < roadmap[level].length - 1 && (
                <svg className="mx-10" width="120" height="20" viewBox="0 0 120 20" fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="0" y1="10" x2="100" y2="10" />
                  <polyline points="100,5 115,10 100,15" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    ))
  )}

  {/* ====== REQUIRED SKILLS ====== */}
  {requiredSkills.length > 0 && (
    <div className="w-full mt-19 ">
      <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-900">
        Required Skills
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-8">
        {requiredSkills.map((skill, idx) => (
          <div
            key={idx}
            className="p-5 bg-indigo-100 rounded-xl shadow-lg text-center text-indigo-900 font-bold text-lg"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  )}

  {/* ====== PROJECTS ====== */}
  {projects.length > 0 && (
    <div className="w-full mt-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-900">
        Projects
      </h2>
      <div className="flex flex-wrap gap-5 justify-center mt-8">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="p-6 w-60 bg-indigo-50 rounded-2xl shadow-xl border-2 border-indigo-300 cursor-pointer text-center font-bold text-indigo-800 text-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            {project}
          </div>
        ))}
      </div>
    </div>
  )}
</main>



      {selectedSkill && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 p-6 overflow-y-auto z-50">
          <button
            onClick={() => setSelectedSkill(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-indigo-700 mb-4">{selectedSkill.title}</h2>
          <p className="text-gray-700 mb-6">{selectedSkill.desc}</p>

          <h3 className="text-lg font-semibold text-indigo-600 mb-3">Learning Resources</h3>
          {selectedSkill.resources.length > 0 ? (
            <ul className="space-y-3">
              {selectedSkill.resources.map((res, idx) => (
                <li key={idx} className="border p-3 rounded-lg hover:bg-indigo-50">
                  <p className="font-medium text-gray-800">{res.title}</p>
                  <p className="text-sm text-gray-500 mb-1">{res.resource_type}</p>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline">
                    Visit Resource
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No resources available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
