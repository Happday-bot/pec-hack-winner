import React, { useState, useEffect } from "react";
<<<<<<< HEAD

export default function ProfileSetup12th({ onComplete, initialData }) {
  const allSubjects = [
    "English","Physics","Chemistry","Mathematics","Biology",
    "Computer Science","Human Development","Clothing for the Family",
    "Extension Education","Business Studies","Accountancy",
    "Economics","Business Maths","Computer Application"
  ];

  const streamOptions = ["PCMB","PCM","PCB","Arts","Commerce"];
  const interestSubjects = ["Science","Mathematics","SocialScience","Languages","ComputerScience","Arts","Commerce"];
  const ambitionOptions = ["Doctor","Engineer","Teacher","Scientist","Lawyer","Artist","Entrepreneur","Others"];

  const emptyForm = {
    medium: "",
    compulsoryLanguage: "",
    stream: "",
    interests: "",
    ambition: "",
    otherAmbition: "",
    cutoff: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Load data only for View/Edit
  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
      setSelectedSubjects(initialData.selectedSubjects || []);
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleSubject = subject => {
    setSelectedSubjects(prev =>
      prev.some(s => s.name === subject)
        ? prev.filter(s => s.name !== subject)
=======
import { supabase } from "./supabase";

/* ================= CONSTANTS ================= */

const allSubjects = [
  "English", "Physics", "Chemistry", "Mathematics", "Biology",
  "Computer Science", "Business Studies", "Accountancy", "Economics"
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh","Puducherry", "Chandigarh"
];


const streamOptions = ["PCMB", "PCM", "PCB", "Commerce", "Arts"];

const interestSubjects = [
  "Science", "Mathematics", "ComputerScience", "SocialScience", "Languages", "Arts", "Commerce"
];

const ambitionOptions = [
  "Doctor", "Engineer", "Scientist", "Lawyer", "Entrepreneur", "Designer", "Others"
];

const emptyForm = {
  medium: "",
  compulsoryLanguage: "",
  stream: "",
  interest: "",
  ambition: "",
  otherAmbition: "",
  neetScore: "",
  jeeScore: "",
  preferredLocations: ["", "", "", "", ""] // restored location array
};

/* ================= COMPONENT ================= */

export default function ProfileSetup12th({ onComplete, initialData, email }) {
  const [form, setForm] = useState(emptyForm);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  /* ================= LOAD EXISTING DATA ================= */
  useEffect(() => {
    if (!initialData) return;

    setForm({
      ...emptyForm,
      medium: initialData.medium || "",
      compulsoryLanguage: initialData.Language || "",
      stream: initialData.stream || "",
      interest: initialData.interest || "",
      ambition: ambitionOptions.includes(initialData.ambition) ? initialData.ambition : "Others",
      otherAmbition: !ambitionOptions.includes(initialData.ambition) ? initialData.ambition : "",
      neetScore: initialData.neet_score || "",
      jeeScore: initialData.jee_score || "",
      preferredLocations: initialData.preferred_locations || ["", "", "", "", ""]
    });

    setSelectedSubjects(initialData.subjects || []);
  }, [initialData]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.some((s) => s.name === subject)
        ? prev.filter((s) => s.name !== subject)
>>>>>>> cb29118a9f1f6dd734f81014b3acdc9451e76667
        : [...prev, { name: subject, marks: "" }]
    );
  };

  const handleMarksChange = (index, value) => {
    const updated = [...selectedSubjects];
    updated[index].marks = value;
    setSelectedSubjects(updated);
  };

<<<<<<< HEAD
  const handleFinish = e => {
    e.preventDefault();

    if (!form.medium || !form.compulsoryLanguage || !form.stream || !form.interests || !form.ambition) {
      return alert("Please fill all required fields");
    }

    if (selectedSubjects.length === 0) {
      return alert("Select at least one subject");
    }

    for (const s of selectedSubjects) {
      if (!s.marks) return alert(`Enter marks for ${s.name}`);
    }

    const maths = Number(selectedSubjects.find(s => s.name === "Mathematics")?.marks || 0);
    const physics = Number(selectedSubjects.find(s => s.name === "Physics")?.marks || 0);
    const chemistry = Number(selectedSubjects.find(s => s.name === "Chemistry")?.marks || 0);

    const finalData = {
      ...form,
      ambition: form.ambition === "Others" ? form.otherAmbition : form.ambition,
      cutoff: maths + physics + chemistry,
      selectedSubjects
    };

    delete finalData.otherAmbition;

    // ✅ SAVE ONLY DATA
    sessionStorage.setItem("profile12th", JSON.stringify(finalData));
    sessionStorage.setItem("stream", form.stream);

    if (onComplete) onComplete();
    alert("✅ 12th profile saved successfully!");
  };

  return (
    <form onSubmit={handleFinish} className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold">Profile Setup – 12th</h2>

      <select name="medium" value={form.medium} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Medium *</option>
        <option>English</option><option>Urdu</option><option>Hindi</option>
      </select>

      <select name="compulsoryLanguage" value={form.compulsoryLanguage} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Language *</option>
        <option>Urdu</option><option>Hindi</option>
      </select>

      <select name="stream" value={form.stream} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Stream *</option>
        {streamOptions.map(s => <option key={s}>{s}</option>)}
      </select>

      <h3 className="font-semibold">Subjects</h3>
      <div className="flex flex-wrap gap-2">
        {allSubjects.map(sub => (
          <button
            type="button"
            key={sub}
            onClick={() => toggleSubject(sub)}
            className={`px-4 py-2 rounded-full ${
              selectedSubjects.some(s => s.name === sub)
                ? "bg-green-600 text-white"
                : "border"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {selectedSubjects.map((s, i) => (
        <div key={i} className="flex gap-2">
          <span className="w-1/2 font-bold">{s.name}</span>
          <input
            type="number"
            value={s.marks}
            onChange={e => handleMarksChange(i, e.target.value)}
            className="w-1/2 border p-2 rounded"
          />
        </div>
      ))}

      <select name="interests" value={form.interests} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Interest *</option>
        {interestSubjects.map(i => <option key={i}>{i}</option>)}
      </select>

      <select name="ambition" value={form.ambition} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Ambition *</option>
        {ambitionOptions.map(a => <option key={a}>{a}</option>)}
      </select>

      {form.ambition === "Others" && (
        <input
          type="text"
          name="otherAmbition"
          value={form.otherAmbition}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Specify ambition"
        />
      )}

      <button className="bg-blue-600 text-white px-6 py-2 rounded">
=======
  // Restored: Handle changes for the 5 location inputs
  const handleLocationChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.preferredLocations];
      updated[index] = value;
      return { ...prev, preferredLocations: updated };
    });
  };

  /* ================= SUBMIT ================= */

  const handleFinish = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!form.medium || !form.compulsoryLanguage || !form.stream || !form.interest || !form.ambition) {
      alert("Please fill all required fields");
      return;
    }

    if (selectedSubjects.length === 0) {
      alert("Select at least one subject");
      return;
    }

    // Ensure at least 3 locations are filled (optional rule, you can remove if needed)
    const filledLocations = form.preferredLocations.filter((l) => l.trim() !== "");
    if (filledLocations.length < 3) {
      alert("Please enter at least 3 preferred locations");
      return;
    }

    const finalData = {
      email: email,
      medium: form.medium,
      Language: form.compulsoryLanguage,
      stream: form.stream,
      interest: form.interest,
      subjects: selectedSubjects, 
      ambition: form.ambition === "Others" ? form.otherAmbition : form.ambition,
      neet_score: form.neetScore ? parseFloat(form.neetScore) : null,
      jee_score: form.jeeScore ? parseFloat(form.jeeScore) : null,
      preferred_locations: form.preferredLocations // Saving full array [city1, city2...]
    };

    console.log("Saving data to 12th_profile_data:", finalData);

    try {
      const { error } = await supabase
        .from("12th_profile_data")
        .upsert(finalData, { onConflict: "email" });

      if (error) throw error;

      alert("✅ 12th profile saved successfully");
      if (onComplete) onComplete(finalData);
    } catch (err) {
      console.error("Save error:", err);
      alert(`❌ Failed to save profile: ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={handleFinish}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Profile Setup – 12th</h2>

      {/* Medium & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="medium"
          value={form.medium}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Medium *</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Urdu</option>
        </select>

        <select
          name="compulsoryLanguage"
          value={form.compulsoryLanguage}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Language *</option>
          <option>Hindi</option>
          <option>Urdu</option>
        </select>
      </div>

      {/* Stream Selection */}
      <select
        name="stream"
        value={form.stream}
        onChange={handleChange}
        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Stream *</option>
        {streamOptions.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* Subjects Selection */}
      <div>
        <h3 className="font-semibold mb-2">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {allSubjects.map((sub) => (
            <button
              type="button"
              key={sub}
              onClick={() => toggleSubject(sub)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedSubjects.some((s) => s.name === sub)
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 border hover:bg-gray-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Marks Input */}
      {selectedSubjects.length > 0 && (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-500">Enter Marks:</p>
          {selectedSubjects.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-1/2 text-sm font-bold text-gray-700">{s.name}</span>
              <input
                type="number"
                value={s.marks}
                onChange={(e) => handleMarksChange(i, e.target.value)}
                placeholder="Marks"
                className="w-1/2 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Interest & Ambition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="interest"
          value={form.interest}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Interest *</option>
          {interestSubjects.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>

        <select
          name="ambition"
          value={form.ambition}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Ambition *</option>
          {ambitionOptions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {form.ambition === "Others" && (
        <input
          type="text"
          name="otherAmbition"
          value={form.otherAmbition}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Specify ambition"
        />
      )}

      {/* Restored Preferred Locations */}
      <div>
  <h3 className="font-semibold mb-2">Preferred Locations (Top 5 States)</h3>
  <div className="space-y-3">
    {form.preferredLocations.map((loc, index) => (
      <select
        key={index}
        value={loc}
        onChange={(e) => handleLocationChange(index, e.target.value)}
        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select State {index + 1}</option>
        {indianStates.map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
    ))}
  </div>
</div>

      {/* NEET & JEE Scores (All Streams) */}
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      NEET Score
    </label>
    <input
      type="number"
      name="neetScore"
      value={form.neetScore}
      onChange={handleChange}
      placeholder="If applicable"
      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      JEE Score
    </label>
    <input
      type="number"
      name="jeeScore"
      value={form.jeeScore}
      onChange={handleChange}
      placeholder="If applicable"
      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
</div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition shadow-md">
>>>>>>> cb29118a9f1f6dd734f81014b3acdc9451e76667
        Save & Finish
      </button>
    </form>
  );
}