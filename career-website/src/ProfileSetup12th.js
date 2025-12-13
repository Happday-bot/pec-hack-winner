import React, { useState, useEffect } from "react";

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
        : [...prev, { name: subject, marks: "" }]
    );
  };

  const handleMarksChange = (index, value) => {
    const updated = [...selectedSubjects];
    updated[index].marks = value;
    setSelectedSubjects(updated);
  };

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
        Save & Finish
      </button>
    </form>
  );
}
