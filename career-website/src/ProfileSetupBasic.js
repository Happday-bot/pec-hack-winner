// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "./supabase"; // adjust path

// export default function ProfileSetupBasic({ initialData, Email = null }) {
//   const navigate = useNavigate();

//   const emptyForm = {
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     dob: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     qualification: "",
//     gender: "",
//     Stream: ""
//   };

//   const [form, setForm] = useState(emptyForm);

//   useEffect(() => {
//     if (initialData) setForm({ ...emptyForm, ...initialData });
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleNext = async (e) => {
//     e.preventDefault();
//     const email = Email || sessionStorage.getItem("signUpEmail");
//     if (!email) return alert("Session expired. Please sign up again.");

//     const payload = {
//       email,
//       first_name: form.firstName,
//       middle_name: form.middleName,
//       last_name: form.lastName,
//       dob: form.dob,
//       phone: form.phone,
//       qualification: form.qualification,
//       gender: form.gender,
//       stream: form.Stream
//     };

//     sessionStorage.setItem("qualification", form.qualification);
//     sessionStorage.setItem("stream", form.Stream);

//     const { error } = await supabase
//       .from("profiles")
//       .update(payload)
//       .eq("email", email);

//     if (error) return alert("Failed to save profile. Try again.");

//     navigate("/aptitude-landing", { state: { qualification: form.qualification } });
//   };

//   return (
//     <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-10 border border-[#C7CBFF]">
//       <h1 className="text-2xl font-bold mb-8 text-center text-[#444EE7]">
//         Profile Setup – General Info
//       </h1>

//       <form onSubmit={handleNext}>
//         <div className="grid grid-cols-1 gap-y-6">

//           <Input
//             label="First Name *"
//             name="firstName"
//             value={form.firstName}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             label="Middle Name"
//             name="middleName"
//             value={form.middleName}
//             onChange={handleChange}
//           />

//           <Input
//             label="Last Name *"
//             name="lastName"
//             value={form.lastName}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             label="Date of Birth *"
//             type="date"
//             name="dob"
//             value={form.dob}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             label="Phone Number *"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             required
//           />

//           <Select
//             label="Qualification *"
//             name="qualification"
//             value={form.qualification}
//             onChange={handleChange}
//             options={[
//               { label: "Select Qualification", value: "" },
//               { label: "10th", value: "10" },
//               { label: "12th", value: "12" }
//             ]}
//           />

//           {form.qualification === "12" && (
//             <Select
//               label="Stream *"
//               name="Stream"
//               value={form.Stream}
//               onChange={handleChange}
//               options={[
//                 { label: "Select Stream", value: "" },
//                 { label: "PCMB", value: "PCMB" },
//                 { label: "PCM", value: "PCM" },
//                 { label: "PCB", value: "PCB" },
//                 { label: "Arts/Commerce", value: "Arts/Commerce" }
//               ]}
//             />
//           )}

//           <Select
//             label="Gender *"
//             name="gender"
//             value={form.gender}
//             onChange={handleChange}
//             options={[
//               { label: "Select Gender", value: "" },
//               { label: "Male", value: "male" },
//               { label: "Female", value: "female" },
//               { label: "Other", value: "other" }
//             ]}
//           />

//         </div>

//         <div className="text-center">
//           <button
//             type="submit"
//             className="mt-10 px-10 py-3 bg-gradient-to-r from-[#444EE7] to-[#6B74FF] text-white rounded-lg hover:opacity-90 transition"
//           >
//             Save & Continue
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// /* ---------- SMALL REUSABLE COMPONENTS ---------- */
// const Input = ({ label, ...props }) => (
//   <div className="flex flex-col">
//     <label className="mb-1 text-[#444EE7] font-medium mb-2">{label}</label>
//     <input {...props} className="border border-[#C7CBFF] rounded-lg p-2" />
//   </div>
// );

// const Select = ({ label, options, ...props }) => (
//   <div className="flex flex-col">
//     <label className="mb-1 text-[#444EE7] font-medium">{label}</label>
//     <select {...props} className="border border-[#C7CBFF] rounded-lg p-2">
//       {options.map(o => (
//         <option key={o.value} value={o.value}>{o.label}</option>
//       ))}
//     </select>
//   </div>
// );

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase"; // adjust path

export default function ProfileSetupBasic({ initialData, Email = null }) {
  const navigate = useNavigate();

  const emptyForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    phone: "",
    district: "",
    pincode: "",
    country: "India",
    qualification: "",
    gender: "",
    Stream: ""
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) setForm({ ...emptyForm, ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const email = Email || sessionStorage.getItem("signUpEmail");
    if (!email) return alert("Session expired. Please sign up again.");

    // --- Geolocation fetch on form submission using district + pincode + country ---
    let lat = null, lon = null;
    if (form.district && form.pincode) {
      const query = `${form.district} ${form.pincode} India`;
      console.log("Fetching geolocation for:", query);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
          {
            headers: {
              "User-Agent": "ProfileSetupApp/1.0 (your-email@example.com)"
            }
          }
        );

        const data = await response.json();
        if (data && data.length > 0) {
          lat = data[0].lat;
          lon = data[0].lon;
          console.log("Latitude:", lat, "Longitude:", lon);
        } else {
          console.log("No geolocation found for this district/pincode.");
        }
      } catch (err) {
        console.error("Failed to fetch lat/lon:", err);
      }
    }

    // --- Save profile to Supabase ---
    const payload = {
      email,
      first_name: form.firstName,
      middle_name: form.middleName,
      last_name: form.lastName,
      dob: form.dob,
      phone: form.phone,
      qualification: form.qualification,
      gender: form.gender,
      stream: form.Stream,
      latitude: lat,
      longitude: lon
    };

    sessionStorage.setItem("qualification", form.qualification);
    sessionStorage.setItem("stream", form.Stream);

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("email", email);

    if (error) return alert("Failed to save profile. Try again.");

    navigate("/aptitude-landing", { state: { qualification: form.qualification } });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-10 border border-[#C7CBFF]">
      <h1 className="text-2xl font-bold mb-8 text-center text-[#444EE7]">
        Profile Setup – General Info
      </h1>

      <form onSubmit={handleNext}>
        <div className="grid grid-cols-1 gap-y-6">

          <Input label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} required />
          <Input label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} />
          <Input label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} required />
          <Input label="Date of Birth *" type="date" name="dob" value={form.dob} onChange={handleChange} required />
          <Input label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} required />

          {/* District Input */}
          <Input
            label="District *"
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="Enter your district"
            required
          />

          {/* Pincode Input */}
          <Input
            label="Pincode *"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Enter your area PIN code"
            required
          />

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

          {form.qualification === "12" && (
            <Select
              label="Stream *"
              name="Stream"
              value={form.Stream}
              onChange={handleChange}
              options={[
                { label: "Select Stream", value: "" },
                { label: "PCMB", value: "PCMB" },
                { label: "PCM", value: "PCM" },
                { label: "PCB", value: "PCB" },
                { label: "Arts/Commerce", value: "Arts/Commerce" }
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

        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-10 px-10 py-3 bg-gradient-to-r from-[#444EE7] to-[#6B74FF] text-white rounded-lg hover:opacity-90 transition"
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
    <label className="mb-1 text-[#444EE7] font-medium mb-2">{label}</label>
    <input {...props} className="border border-[#C7CBFF] rounded-lg p-2" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-[#444EE7] font-medium">{label}</label>
    <select {...props} className="border border-[#C7CBFF] rounded-lg p-2">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
