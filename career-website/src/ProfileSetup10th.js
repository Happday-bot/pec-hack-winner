import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup10th() {
  const navigate = useNavigate();
  console.log("localStorage");
  const userId = localStorage.getItem("userId"); // Must be saved during signup/login

  const [form, setForm] = useState({
    medium: "",
    compulsoryLanguage: "",
    selectedSubjects: [],
    marks: {},
    interest: "",
    ambition: "",
    otherAmbition: "",
  });

  const [compulsorySubjects, setCompulsorySubjects] = useState([]);
  const [additionalSubjects, setAdditionalSubjects] = useState([]);
  const [interestSubjects, setInterestSubjects] = useState([]);
  const [ambitionOptions, setAmbitionOptions] = useState([]);

  useEffect(() => {
    setCompulsorySubjects([
      "General English",
      "Mathematics",
      "Social Science",
      "Economics, Disaster Management and Road Safety Education",
      "Science",
    ]);
    setAdditionalSubjects([
      "Computer Science",
      "Sanskrit",
      "Dogri",
      "Bhoti",
      "Punjabi",
      "Persian",
      "Kashmiri",
      "Arabic",
      "Urudu",
      "Hindi",
    ]);
    setInterestSubjects([
      "Science",
      "Mathematics",
      "SocialScience",
      "Languages",
      "ComputerScience",
      "Arts",
      "Commerce",
    ]);
    setAmbitionOptions([
      "Doctor",
      "Engineer",
      "Teacher",
      "Scientist",
      "Lawyer",
      "Artist",
      "Entrepreneur",
      "Others",
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "interest" && /\s/.test(value)) {
      alert(`Please enter only one word for ${name}.`);
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const toggleSubject = (subject) => {
    const updated = form.selectedSubjects.includes(subject)
      ? form.selectedSubjects.filter((s) => s !== subject)
      : [...form.selectedSubjects, subject];
    setForm({ ...form, selectedSubjects: updated });
  };

  const handleMarksChange = (subject, value) => {
    setForm({ ...form, marks: { ...form.marks, [subject]: value } });
  };

  const handleFinish = async (e) => {
    e.preventDefault();

    if (!userId) return alert("User ID not found. Please login again.");
    if (!form.medium) return alert("Please select a medium of study.");
    if (!form.compulsoryLanguage) return alert("Please select a compulsory language.");

    const allSubjects = [form.compulsoryLanguage, ...compulsorySubjects, ...form.selectedSubjects];
    for (const subj of allSubjects) {
      if (!form.marks[subj]) return alert(`Please enter marks for ${subj}.`);
    }

    if (!form.interest) return alert("Please select your interest subject.");
    if (!form.ambition) return alert("Please select your ambition.");

    const finalAmbition = form.ambition === "Others" ? form.otherAmbition : form.ambition;
    if (form.ambition === "Others" && !form.otherAmbition) return alert("Please enter your ambition.");

    const profileData = { ...form, ambition: finalAmbition };
    delete profileData.otherAmbition;

    try {
      const response = await fetch(`http://localhost:8000/profile-10th/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        alert("✅ Profile details saved successfully!");
        navigate("/aptitude-landing", { state: { qualification: "10" } });
      } else {
        alert("❌ Error saving profile: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Failed to save profile. Try again.");
    }
  };

  return (
    <div className="space-y-10 px-8 py-6 max-w-3xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold mb-6">Profile Setup – 10th Details</h2>
        <form onSubmit={handleFinish} className="space-y-6 bg-white shadow-lg rounded-xl p-8">
          {/* Medium */}
          <div>
            <label className="block mb-1 font-semibold">
              Medium of Study <span className="text-red-500">*</span>
            </label>
            <select name="medium" value={form.medium} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="">Select Medium of Study</option>
              <option>Urdu</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Kashmiri</option>
              <option>Dogri</option>
            </select>
          </div>

          {/* Compulsory Language */}
          <div>
            <label className="block mb-1 font-semibold">
              First Compulsory Language <span className="text-red-500">*</span>
            </label>
            <select
              name="compulsoryLanguage"
              value={form.compulsoryLanguage}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select First Compulsory Language</option>
              <option>Urdu</option>
              <option>Hindi</option>
              <option>Kashmiri</option>
              <option>Dogri</option>
            </select>
          </div>

          {/* Optional Subjects */}
          <section>
            <h3 className="font-semibold mb-2">Select Your Optional Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {additionalSubjects.map((subj, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleSubject(subj)}
                  className={`px-4 py-2 rounded-full border font-semibold transition ${
                    form.selectedSubjects.includes(subj)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </section>

          {/* Marks Input */}
          <section>
            <h3 className="font-semibold mb-2">Enter Your Marks</h3>
            <div className="mt-4 space-y-2">
              {[form.compulsoryLanguage, ...compulsorySubjects, ...form.selectedSubjects].map((subj, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <p className="w-1/2 p-2 font-bold">{subj}</p>
                  <input
                    type="number"
                    placeholder="Marks"
                    value={form.marks[subj] || ""}
                    onChange={(e) => handleMarksChange(subj, e.target.value)}
                    className="w-1/2 border rounded-lg p-2"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Interest */}
          <section>
            <label className="block mb-1 font-semibold">Your Interest Subject <span className="text-red-500">*</span></label>
            <select name="interest" value={form.interest} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="">Select Your Interest Subject</option>
              {interestSubjects.map((subj, idx) => (
                <option key={idx}>{subj}</option>
              ))}
            </select>
          </section>

          {/* Ambition */}
          <section>
            <label className="block mb-1 font-semibold">Your Ambition <span className="text-red-500">*</span></label>
            <select name="ambition" value={form.ambition} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="">Select Your Ambition</option>
              {ambitionOptions.map((amb, idx) => (
                <option key={idx}>{amb}</option>
              ))}
            </select>
            {form.ambition === "Others" && (
              <input
                type="text"
                name="otherAmbition"
                value={form.otherAmbition}
                onChange={handleChange}
                placeholder="Please specify your ambition"
                className="w-full border rounded-lg p-2 mt-2"
              />
            )}
          </section>

          <div>
            <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save & Finish
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}


