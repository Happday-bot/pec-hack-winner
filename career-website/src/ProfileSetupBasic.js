import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function ProfileSetupBasic({ initialData }) {
  const navigate = useNavigate();

  // ---------- EMPTY STRUCTURE ----------
  const emptyForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    phone: "",
    qualification: "",
    gender: "",
    stream: ""
  };

  // ---------- STATE ----------
  const [form, setForm] = useState(emptyForm);

  // ---------- LOAD SAVED DATA ----------
  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [initialData]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      // 🔁 Clear stream if switched to 10th
      if (name === "qualification" && value === "10") {
        return { ...prev, qualification: value, stream: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();

    const email = sessionStorage.getItem("signUpEmail");
    if (!email) {
      alert("Session expired. Please sign up again.");
      return;
    }

    const payload = {
      email,
      first_name: form.firstName,
      middle_name: form.middleName,
      last_name: form.lastName,
      dob: form.dob,
      phone: form.phone,
      qualification: form.qualification,
      gender: form.gender,
      stream: form.qualification === "12" ? form.stream : null
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("email", email);

    if (error) {
      console.error("❌ Profile save failed:", error.message);
      alert("Failed to save profile. Try again.");
      return;
    }

    navigate("/aptitude-landing", {
      state: { qualification: form.qualification }
    });
  };

  // ---------- UI ----------
  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-10">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Profile Setup – General Info
      </h1>

      <form onSubmit={handleNext} className="flex flex-col gap-6">
        <Input label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} required />
        <Input label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} />
        <Input label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} required />
        <Input label="Date of Birth *" type="date" name="dob" value={form.dob} onChange={handleChange} required />
        <Input label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} required />

        <Select
          label="Qualification *"
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          options={[
            { label: "Select Qualification", value: "" },
            { label: "10th", value: "10" },
            { label: "12th", value: "12" }
          ]}
        />

        {/* ✅ SHOW ONLY IF 12TH */}
        {form.qualification === "12" && (
          <Select
            label="Stream *"
            name="stream"
            value={form.stream}
            onChange={handleChange}
            options={[
              { label: "Select Stream", value: "" },
              { label: "PCMB", value: "PCMB" },
              { label: "PCM", value: "PCM" },
              { label: "Arts / Commerce", value: "Arts/Commerce" }
            ]}
          />
        )}

        <Select
          label="Gender *"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={[
            { label: "Select Gender", value: "" },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" }
          ]}
        />

        <button
          type="submit"
          className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1">{label}</label>
    <input {...props} className="border rounded-lg p-2" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1">{label}</label>
    <select {...props} className="border rounded-lg p-2">
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
