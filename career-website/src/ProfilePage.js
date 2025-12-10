import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8000/profile/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setProfile(data);
        setForm(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBack = (e) => {
    navigate("/dashboard");
  };

  // Save profile to backend
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/profile-submit/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No profile data found.</p>
      </div>
    );
  }

  // Build display JSX elements
  const profileDetails = [];
  Object.keys(profile).forEach((key) => {
    let value = profile[key];

    if (key === "qualification") {
      value = value === "10" ? "10th" : value === "12" ? "12th" : value;
    }
    if (key === "income") {
      value = `₹${Number(value).toLocaleString()}`;
    }

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    profileDetails.push(
  <div key={key}>
    <strong>{label}:</strong>{" "}
    {value && typeof value === "object" ? JSON.stringify(value) : value}
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
            const type =
              key === "dob" ? "date" : key === "income" ? "number" : "text";

            return (
              <div key={key} className="flex flex-col">
                <label className="text-gray-700 font-semibold">{label}</label>
                <input
                  type={type}
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            );
          })}

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-gray-700">
          {profileDetails}
          <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}


