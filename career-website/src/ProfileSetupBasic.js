import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase"; // adjust path

export default function ProfileSetupBasic({ initialData, Email }) {
  const navigate = useNavigate();

  // ---------- EMPTY STRUCTURE ----------
  const emptyForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    qualification: "",
    gender: "",
    Stream: ""
  };

  // ---------- STATE ----------
  const [form, setForm] = useState(emptyForm);

  // ---------- LOAD SAVED DATA (VIEW / EDIT) ----------
  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [initialData]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    // const email = sessionStorage.getItem("signUpEmail");
    const email = Email || sessionStorage.getItem("signedUpEmail")
    if (!email) {
      alert("Session expired. Please sign up again.");
      return;
    }
    e.preventDefault();

    const payload = {
      email: email,
      first_name: form.firstName,
      middle_name: form.middleName,
      last_name: form.lastName,
      dob: form.dob,
      phone: form.phone,
      qualification: form.qualification,
      gender: form.gender,
      stream: form.Stream
    };
    sessionStorage.setItem("qualification",form.qualification)
    sessionStorage.setItem("stream",form.Stream)
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("email", email);

    if (error) {
      console.error("❌ Profile save failed:", error.message);
      alert("Failed to save profile. Try again.");
      return;
    }

    // 👉 Continue flow (unchanged)
    navigate("/aptitude-landing", {
      state: { qualification: form.qualification }
    });
  };


  // ---------- UI ----------
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-10">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Profile Setup – General Info
      </h1>

      <form onSubmit={handleNext}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            <Input label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} required />
            <Input label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} />
            <Input label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
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

            <Select
              label="Stream *"
              name="Stream"
              value={form.Stream}
              onChange={handleChange}
              options={[
                { label: "Select Stream", value: "" },
                { label: "PCMB", value: "PCMB" },
                { label: "PCM", value: "PCM" },
                { label: "Atrs/Commerce", value: "Arts/Commerce" }
              ]}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-10 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- SMALL REUSABLE COMPONENTS ---------- */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <input {...props} className="border rounded-lg p-2" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <select {...props} className="border rounded-lg p-2">
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);
