import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup12th() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const allSubjects = [
    "English", "Physics", "Chemistry", "Mathematics", "Biology",
    "Computer Science", "Human Development", "Clothing for the Family",
    "Extension Education", "Business Studies", "Accountancy",
    "Economics", "Business Maths", "Computer Application"
  ];
  const streamOptions = ["PCMB", "PCM", "PCB", "Arts", "Commerce"];
  const interestSubjects = [
    "Science", "Mathematics", "SocialScience", "Languages",
    "ComputerScience", "Arts", "Commerce"
  ];

  const ambitionOptions = [
    "Doctor", "Engineer", "Teacher", "Scientist", "Lawyer",
    "Artist", "Entrepreneur", "Others"
  ];

  const [form, setForm] = useState({
    medium: "",
    compulsoryLanguage: "",
    stream: "",
    interests: "",
    ambition: "",
    otherAmbition: "",
    jeerank: "",
    neetrank: "",
    cutoff: ""
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubjectClick = (subjectName) => {
    if (selectedSubjects.some((s) => s.name === subjectName)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s.name !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, { name: subjectName, marks: "" }]);
    }
  };

  const handleMarksChange = (index, value) => {
    const updated = [...selectedSubjects];
    updated[index].marks = value;
    setSelectedSubjects(updated);
  };

  const handleFinish = (e) => {
    e.preventDefault();

    if (!form.medium) return alert("Please select a medium of study.");
    if (!form.compulsoryLanguage) return alert("Please select a compulsory language.");
    if (!form.interests) return alert("Please select your interest subject.");
    if (!form.ambition) return alert("Please select your ambition.");
    if (!form.stream) return alert("Please select your stream.");

    for (const subj of selectedSubjects) {
      if (!subj.marks) return alert(`Please enter marks for ${subj.name}`);
    }

    const mathsMarks = selectedSubjects.find(s => s.name === "Mathematics")?.marks || 0;
    const physicsMarks = selectedSubjects.find(s => s.name === "Physics")?.marks || 0;
    const chemistryMarks = selectedSubjects.find(s => s.name === "Chemistry")?.marks || 0;

    const calculatedCutoff = Number(mathsMarks) + Number(physicsMarks) + Number(chemistryMarks);

    setForm(prev => ({ ...prev, cutoff: calculatedCutoff }));
    localStorage.setItem("stream", form.stream);

    alert("Form validation complete! No backend used.");

    navigate("/aptitude-landing", { state: { qualification: "12" } });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6">Profile Setup – 12th Details</h1>
      <form onSubmit={handleFinish}>

        {/* Medium */}
        <label className="block mb-1 font-semibold">
          Medium of Study <span className="text-red-500">*</span>
        </label>
        <select
          name="medium"
          value={form.medium}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        >
          <option value="">Select Medium of Study</option>
          <option>English</option>
          <option>Urdu</option>
          <option>Hindi</option>
          <option>Kashmiri</option>
          <option>Dogri</option>
        </select>

        {/* Compulsory Language */}
        <label className="block mb-1 font-semibold">
          First Compulsory Language <span className="text-red-500">*</span>
        </label>
        <select
          name="compulsoryLanguage"
          value={form.compulsoryLanguage}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        >
          <option value="">Select First Compulsory Language</option>
          <option>Urdu</option>
          <option>Hindi</option>
          <option>Kashmiri</option>
          <option>Dogri</option>
        </select>

        {/* Stream */}
        <label className="block mb-1 font-semibold">
          Stream <span className="text-red-500">*</span>
        </label>
        <select
          name="stream"
          value={form.stream}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        >
          <option value="">Select Stream</option>
          {streamOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        {/* Optional Subjects */}
        <h2 className="font-semibold mb-2">Select Your Optional Subjects</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {allSubjects.map((subjectName) => {
            const isSelected = selectedSubjects.some((s) => s.name === subjectName);
            return (
              <button
                key={subjectName}
                type="button"
                onClick={() => handleSubjectClick(subjectName)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? "bg-green-600 text-white"
                    : "border border-gray-400 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {subjectName}
              </button>
            );
          })}
        </div>

        {/* Marks Entry */}
        <div className="space-y-4 mb-6">
          {selectedSubjects.length > 0 ? (
            selectedSubjects.map((subj, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <p className="w-1/2 p-2 font-bold">{subj.name}</p>
                <input
                  type="number"
                  placeholder="Marks"
                  value={subj.marks}
                  onChange={(e) => handleMarksChange(index, e.target.value)}
                  className="w-1/2 border rounded-lg p-2"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Select subjects above to enter marks.</p>
          )}
        </div>

        {/* JEE Rank */}
        <label className="block mb-1 font-semibold">JEE Rank</label>
        <input
          type="number"
          name="jeerank"
          value={form.jeerank}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        />

        {/* NEET Rank */}
        <label className="block mb-1 font-semibold">NEET Mark</label>
        <input
          type="number"
          name="neetrank"
          value={form.neetrank}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        />

        {/* Cutoff */}
        <label className="block mb-1 font-semibold">
          Cutoff (Maths + Physics + Chemistry)
        </label>
        <input
          type="number"
          name="cutoff"
          value={form.cutoff}
          readOnly
          className="w-full border rounded-lg p-2 mb-6 bg-gray-100"
        />

        {/* Interests */}
        <label className="block mb-1 font-semibold">
          Your Interest Subject <span className="text-red-500">*</span>
        </label>
        <select
          name="interests"
          value={form.interests}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        >
          <option value="">Select your Interest Subject</option>
          {interestSubjects.map((subj) => (
            <option key={subj}>{subj}</option>
          ))}
        </select>

        {/* Ambition */}
        <label className="block mb-1 font-semibold">
          Your Ambition <span className="text-red-500">*</span>
        </label>
        <select
          name="ambition"
          value={form.ambition}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-6"
        >
          <option value="">Select your Ambition</option>
          {ambitionOptions.map((amb) => (
            <option key={amb}>{amb}</option>
          ))}
        </select>

        {form.ambition === "Others" && (
          <input
            type="text"
            name="otherAmbition"
            value={form.otherAmbition}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mb-6"
          />
        )}

        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save & Continue (No Backend)
        </button>
      </form>
    </div>
  );
}
