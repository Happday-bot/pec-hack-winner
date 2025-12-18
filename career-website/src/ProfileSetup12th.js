import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup12th({ onComplete, initialData, email }) {
  const navigate = useNavigate();

  /* ================= OPTIONS ================= */
  const allSubjects = [
    "English",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Computer Science",
    "Business Studies",
    "Accountancy",
    "Economics",
    "Computer Application",
  ];

  const streamOptions = ["PCMB", "PCM", "PCB", "Arts", "Commerce"];

  const interestSubjects = [
    "Science",
    "Mathematics",
    "ComputerScience",
    "Arts",
    "Commerce",
  ];

  const ambitionOptions = [
    "Doctor",
    "Engineer",
    "Teacher",
    "Scientist",
    "Lawyer",
    "Artist",
    "Entrepreneur",
    "Others",
  ];

  /* ================= STATE ================= */
  const emptyForm = {
    medium: "",
    compulsoryLanguage: "",
    stream: "",
    interest: "",
    ambition: "",
    otherAmbition: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  /* ================= LOAD EXISTING DATA ================= */
  useEffect(() => {
    if (!initialData) return;

    setForm({
      medium: initialData.medium || "",
      compulsoryLanguage: initialData.Language || "",
      stream: initialData.stream || "",
      interest: initialData.interest || "",
      ambition: initialData.ambition || "",
      otherAmbition:
        initialData.ambition &&
        !ambitionOptions.includes(initialData.ambition)
          ? initialData.ambition
          : "",
    });

    setSelectedSubjects(initialData.subjects || []);
  }, [initialData]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.some((s) => s.name === subject)
        ? prev.filter((s) => s.name !== subject)
        : [...prev, { name: subject, marks: "" }]
    );
  };

  const handleMarksChange = (index, value) => {
    const updated = [...selectedSubjects];
    updated[index].marks = value;
    setSelectedSubjects(updated);
  };

  /* ================= SUBMIT ================= */
  const handleFinish = async (e) => {
    e.preventDefault();

    if (
      !form.medium ||
      !form.compulsoryLanguage ||
      !form.stream ||
      !form.interest ||
      !form.ambition
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (selectedSubjects.length === 0) {
      alert("Select at least one subject");
      return;
    }

    for (const s of selectedSubjects) {
      if (!s.marks) {
        alert(`Enter marks for ${s.name}`);
        return;
      }
    }

    if (!email) {
      alert("Email missing. Please login again.");
      return;
    }

    const payload = {
      medium: form.medium,
      Language: form.compulsoryLanguage,
      stream: form.stream,
      subjects: selectedSubjects,
      interest: form.interest,
      ambition:
        form.ambition === "Others" ? form.otherAmbition : form.ambition,
      email,
    };

    const { error } = await supabase
      .from("12th_profile_data")
      .upsert(payload, { onConflict: "email" });

    if (error) {
      console.error(error);
      alert("❌ Failed to save 12th profile");
      return;
    }

    /* ===== STORE FOR APTITUDE & COURSES ===== */
    sessionStorage.setItem("qualification", "12th");
    sessionStorage.setItem("interest", form.interest);
    sessionStorage.setItem("stream", form.stream);
    sessionStorage.setItem("profileCompleted", "true");

    alert("✅ 12th profile saved successfully!");

    onComplete?.(payload);

    navigate("/dashboard"); // aptitude test
  };

  /* ================= UI ================= */
  return (
    <form
      onSubmit={handleFinish}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold">Profile Setup – 12th</h2>

      {/* Medium */}
      <select
        name="medium"
        value={form.medium}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Medium *</option>
        <option>English</option>
        <option>Urdu</option>
        <option>Hindi</option>
      </select>

      {/* Language */}
      <select
        name="compulsoryLanguage"
        value={form.compulsoryLanguage}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Language *</option>
        <option>English</option>
        <option>Urdu</option>
        <option>Hindi</option>
      </select>

      {/* Stream */}
      <select
        name="stream"
        value={form.stream}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Stream *</option>
        {streamOptions.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* Subjects */}
      <h3 className="font-semibold">Subjects</h3>
      <div className="flex flex-wrap gap-2">
        {allSubjects.map((sub) => (
          <button
            type="button"
            key={sub}
            onClick={() => toggleSubject(sub)}
            className={`px-4 py-2 rounded-full ${
              selectedSubjects.some((s) => s.name === sub)
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
            onChange={(e) => handleMarksChange(i, e.target.value)}
            className="w-1/2 border p-2 rounded"
          />
        </div>
      ))}

      {/* Interest */}
      <select
        name="interest"
        value={form.interest}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Interest *</option>
        {interestSubjects.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>

      {/* Ambition */}
      <select
        name="ambition"
        value={form.ambition}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Ambition *</option>
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


