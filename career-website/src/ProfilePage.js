import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  // Local dummy profile data (replaces backend)
  const sampleProfile = {
    name: "John Doe",
    email: "john@example.com",
    qualification: "12",
    stream: "Science",
    income: "500000",
    interests: ["Mathematics", "Physics"],
    ambition: "Software Engineer",
    dob: "2006-01-15",
  };

  const [profile, setProfile] = useState(sampleProfile);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(sampleProfile);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    let value = e.target.value;

    // Convert comma separated values to array
    if (Array.isArray(form[e.target.name])) {
      value = e.target.value.split(",").map((x) => x.trim());
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Save profile (local only, no backend)
  const handleSave = () => {
    setProfile(form);
    setEditMode(false);
    console.log("Profile updated locally:", form);
  };

  // UI rendering (no loading state needed with local data)
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No profile found.</p>
      </div>
    );
  }

  // Build profile display
  const profileDetails = [];
  Object.keys(profile).forEach((key) => {
    let value = profile[key];

    // Format qualification
    if (key === "qualification") {
      value = value === "10" ? "10th" : value === "12" ? "12th" : value;
    }

    // Format income
    if (key === "income") {
      value = `₹${Number(value).toLocaleString()}`;
    }

    // Format arrays
    if (Array.isArray(value)) {
      value = value.join(", ");
    }

    // Format objects
    if (value && typeof value === "object" && !Array.isArray(value)) {
      value = JSON.stringify(value, null, 2);
    }

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    profileDetails.push(
      <div key={key}>
        <strong>{label}: </strong> {value}
      </div>
    );
  });

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

      {editMode ? (
        <form className="space-y-4">
          {Object.keys(form).map((key) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            const isArray = Array.isArray(form[key]);
            const type =
              key === "dob" ? "date" : key === "income" ? "number" : "text";

            return (
              <div key={key}>
                <label className="font-semibold text-gray-700">{label}</label>
                <input
                  type={type}
                  name={key}
                  value={
                    isArray ? form[key].join(", ") : form[key] || ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>
            );
          })}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="space-y-4">{profileDetails}</div>

          <button
            onClick={() => setEditMode(true)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>

          <button
            onClick={handleBack}
            className="ml-4 mt-6 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
