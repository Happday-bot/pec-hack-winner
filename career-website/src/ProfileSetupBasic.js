import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetupBasic() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    aadhar: "",
    motherTongue: "",
    caste: "",
    income: "",
    gender: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
  };

  const user_id = localStorage.getItem("user_id");
  const handleNext = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`http://localhost:8000/student/${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log("Backend Response:", data);

    // Continue navigation logic
    if (form.qualification === "10") {
      localStorage.setItem("profileBasic", JSON.stringify(form));
      navigate("/profile-setup-10th");
    } else if (form.qualification === "12") {
      localStorage.setItem("profileBasic", JSON.stringify(form));
      navigate("/profile-setup-12th");
    } else {
      alert("Please select a valid qualification (10th or 12th).");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};


  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6">Profile Setup – General Info</h1>
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-gray-700">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label htmlFor="dob" className="text-gray-700">
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700">
              Email ID<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email ID"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="text-gray-700">
              Address<span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            ></textarea>
          </div>

          {/* Qualification */}
          <div className="flex flex-col">
            <label htmlFor="qualification" className="text-gray-700">
              Qualification<span className="text-red-500">*</span>
            </label>
            <select
              id="qualification"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">Select Qualification</option>
              <option value="10">10th</option>
              <option value="12">12th</option>
            </select>
          </div>

          {/* Aadhar */}
          <div className="flex flex-col">
            <label htmlFor="aadhar" className="text-gray-700">
              Aadhar Number<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              placeholder="Aadhar Number"
              value={form.aadhar}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Mother Tongue */}
          <div className="flex flex-col">
            <label htmlFor="motherTongue" className="text-gray-700">
              Mother Tongue<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="motherTongue"
              name="motherTongue"
              placeholder="Mother Tongue"
              value={form.motherTongue}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Caste */}
          <div className="flex flex-col">
            <label htmlFor="caste" className="text-gray-700">
              Caste<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="caste"
              name="caste"
              placeholder="Caste"
              value={form.caste}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Family's Income */}
          <div className="flex flex-col">
            <label htmlFor="income" className="text-gray-700">
              Family's Annual Income<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="income"
              name="income"
              placeholder="Annual Income"
              value={form.income}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        </div>

        {/*Gender*/}
        <div className="flex flex-col mt-4">
          <label htmlFor="gender" className="text-gray-700">
            Gender<span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}


