import React, { useState, useEffect } from "react";

export default function ProfileSetup10th({ onComplete, initialData }) {
  // 1️⃣ Empty structure (UPDATED)
  const emptyForm = {
    medium: "",
    compulsoryLanguage: "",
    selectedSubjects: [],
    marks: {},
    interest: "",
    ambition: "",
    otherAmbition: "",
  };

  // 2️⃣ State
  const [form, setForm] = useState(emptyForm);

  const [compulsorySubjects, setCompulsorySubjects] = useState([]);
  const [additionalSubjects, setAdditionalSubjects] = useState([]);
  const [interestSubjects, setInterestSubjects] = useState([]);
  const [ambitionOptions, setAmbitionOptions] = useState([]);

  // 3️⃣ Load dropdown data
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
      "Urdu",
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

  // 4️⃣ Load saved data for View/Edit
  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        selectedSubjects: initialData.selectedSubjects || [],
        marks: initialData.marks || {},
        otherAmbition: "",
      });
    }
  }, [initialData]);

  // 5️⃣ Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subject) => {
    setForm((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter((s) => s !== subject)
        : [...prev.selectedSubjects, subject],
    }));
  };

  const handleMarksChange = (subject, value) => {
    setForm((prev) => ({
      ...prev,
      marks: { ...prev.marks, [subject]: value },
    }));
  };

  // 6️⃣ Submit
  const handleFinish = (e) => {
    e.preventDefault();

    if (!form.medium) return alert("Please select a medium.");
    if (!form.compulsoryLanguage)
      return alert("Please select a compulsory language.");

    const allSubjects = [
      form.compulsoryLanguage,
      ...compulsorySubjects,
      ...form.selectedSubjects,
    ];

    for (const subj of allSubjects) {
      if (!form.marks[subj]) {
        return alert(`Please enter marks for ${subj}`);
      }
    }

    if (!form.interest) return alert("Please select your interest.");
    if (!form.ambition) return alert("Please select your ambition.");
    if (form.ambition === "Others" && !form.otherAmbition) {
      return alert("Please enter your ambition.");
    }

    const finalData = {
      ...form,
      ambition:
        form.ambition === "Others"
          ? form.otherAmbition
          : form.ambition,
    };

    delete finalData.otherAmbition;

    // ✅ Save only data
    sessionStorage.setItem("profile10th", JSON.stringify(finalData));

    if (onComplete) onComplete();

    alert("✅ Profile 10th details saved successfully!");
  };

  // 7️⃣ UI
  return (
    <div className="space-y-10 px-8 py-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">
        Profile Setup – 10th Details
      </h2>

      <form
        onSubmit={handleFinish}
        className="space-y-6 bg-white shadow-lg rounded-xl p-8"
      >
        {/* Medium */}
        <div>
          <label className="font-semibold">Medium *</label>
          <select
            name="medium"
            value={form.medium}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option>Urdu</option>
            <option>English</option>
            <option>Hindi</option>
            <option>Kashmiri</option>
            <option>Dogri</option>
          </select>
        </div>

        {/* Compulsory Language */}
        <div>
          <label className="font-semibold">
            Compulsory Language *
          </label>
          <select
            name="compulsoryLanguage"
            value={form.compulsoryLanguage}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option>Urdu</option>
            <option>Hindi</option>
            <option>Kashmiri</option>
            <option>Dogri</option>
          </select>
        </div>

        {/* Optional Subjects */}
        <div>
          <h3 className="font-semibold mb-2">
            Optional Subjects
          </h3>
          <div className="flex flex-wrap gap-2">
            {additionalSubjects.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => toggleSubject(subj)}
                className={`px-4 py-2 rounded-full border ${
                  form.selectedSubjects.includes(subj)
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Marks */}
        <div>
          <h3 className="font-semibold mb-2">Marks</h3>
          {[form.compulsoryLanguage, ...compulsorySubjects, ...form.selectedSubjects]
            .filter(Boolean)
            .map((subj) => (
              <div key={subj} className="flex gap-2 items-center">
                <span className="w-1/2 font-bold">
                  {subj}
                </span>
                <input
                  type="number"
                  value={form.marks[subj] || ""}
                  onChange={(e) =>
                    handleMarksChange(subj, e.target.value)
                  }
                  className="w-1/2 border p-2 rounded"
                />
              </div>
            ))}
        </div>

        {/* Interest */}
        <div>
          <label className="font-semibold">Interest *</label>
          <select
            name="interest"
            value={form.interest}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {interestSubjects.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Ambition */}
        <div>
          <label className="font-semibold">Ambition *</label>
          <select
            name="ambition"
            value={form.ambition}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {ambitionOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          {form.ambition === "Others" && (
            <input
              type="text"
              name="otherAmbition"
              value={form.otherAmbition}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-2"
              placeholder="Specify ambition"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save & Finish
        </button>
      </form>
    </div>
  );
}
