// import React, { useState, useEffect } from "react";
// import { supabase } from "./supabase";

// export default function ProfileSetup12th({ onComplete, initialData, email }) {

//   console.log("ProfileSetup12th initialData:", initialData);
//   const allSubjects = [
//     "English", "Physics", "Chemistry", "Mathematics", "Biology",
//     "Computer Science", "Human Development", "Clothing for the Family",
//     "Extension Education", "Business Studies", "Accountancy",
//     "Economics", "Business Maths", "Computer Application"
//   ];

//   const streamOptions = ["PCMB", "PCM", "PCB", "Arts", "Commerce"];
//   const interestSubjects = ["Science", "Mathematics", "SocialScience", "Languages", "ComputerScience", "Arts", "Commerce"];
//   const ambitionOptions = ["Doctor", "Engineer", "Teacher", "Scientist", "Lawyer", "Artist", "Entrepreneur", "Others"];

//   const emptyForm = {
//     medium: "",
//     compulsoryLanguage: "",
//     stream: "",
//     interest: "",
//     ambition: "",
//     otherAmbition: "",
//     cutoff: ""
//   };

//   const [form, setForm] = useState(emptyForm);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);

//   // Load data if initialData exists
//   useEffect(() => {
//     if (initialData) {
//       setForm({ ...emptyForm, ...initialData });
//       setSelectedSubjects(initialData.selectedSubjects || []);
//     }
//   }, [initialData]);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const toggleSubject = subject => {
//     setSelectedSubjects(prev =>
//       prev.some(s => s.name === subject)
//         ? prev.filter(s => s.name !== subject)
//         : [...prev, { name: subject, marks: "" }]
//     );
//   };

//   const handleMarksChange = (index, value) => {
//     const updated = [...selectedSubjects];
//     updated[index].marks = value;
//     setSelectedSubjects(updated);
//   };

//   const handleFinish = async e => {
//     e.preventDefault();

//     if (!form.medium || !form.compulsoryLanguage || !form.stream || !form.interest || !form.ambition) {
//       return alert("Please fill all required fields");
//     }

//     if (selectedSubjects.length === 0) {
//       return alert("Select at least one subject");
//     }

//     for (const s of selectedSubjects) {
//       if (!s.marks) return alert(`Enter marks for ${s.name}`);
//     }

//     if (!email) {
//       return alert("Email is required");
//     }

//     const finalData = {
//       medium: form.medium,
//       Language: form.compulsoryLanguage, // matches DB column
//       stream: form.stream,
//       subjects: selectedSubjects,        // JSON
//       interest: form.interest,
//       ambition: form.ambition === "Others" ? form.otherAmbition : form.ambition,
//       email // email from parent
//     };

//     const { error } = await supabase
//       .from("12th_profile_data")
//       .upsert(finalData, { onConflict: "email" });

//     if (error) {
//       console.error("Supabase upsert error:", error);
//       alert("❌ Failed to save 12th profile");
//       return;
//     }

//     if (onComplete) onComplete();
//     alert("✅ 12th profile saved successfully!");
//   };

//   return (
//     <form onSubmit={handleFinish} className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
//       <h2 className="text-2xl font-bold">Profile Setup – 12th</h2>

//       <select name="medium" value={form.medium} onChange={handleChange} className="w-full border p-2 rounded">
//         <option value="">Medium *</option>
//         <option>English</option><option>Urdu</option><option>Hindi</option>
//       </select>

//       <select name="compulsoryLanguage" value={form.compulsoryLanguage} onChange={handleChange} className="w-full border p-2 rounded">
//         <option value="">Language *</option>
//         <option>Urdu</option><option>Hindi</option>
//       </select>

//       <select name="stream" value={form.stream} onChange={handleChange} className="w-full border p-2 rounded">
//         <option value="">Stream *</option>
//         {streamOptions.map(s => <option key={s}>{s}</option>)}
//       </select>

//       <h3 className="font-semibold">Subjects</h3>
//       <div className="flex flex-wrap gap-2">
//         {allSubjects.map(sub => (
//           <button
//             type="button"
//             key={sub}
//             onClick={() => toggleSubject(sub)}
//             className={`px-4 py-2 rounded-full ${selectedSubjects.some(s => s.name === sub)
//                 ? "bg-green-600 text-white"
//                 : "border"
//               }`}
//           >
//             {sub}
//           </button>
//         ))}
//       </div>

//       {selectedSubjects.map((s, i) => (
//         <div key={i} className="flex gap-2">
//           <span className="w-1/2 font-bold">{s.name}</span>
//           <input
//             type="number"
//             value={s.marks}
//             onChange={e => handleMarksChange(i, e.target.value)}
//             className="w-1/2 border p-2 rounded"
//           />
//         </div>
//       ))}

//       <select name="interest" value={form.interest} onChange={handleChange} className="w-full border p-2 rounded">
//         <option value="">Interest *</option>
//         {interestSubjects.map(i => <option key={i}>{i}</option>)}
//       </select>

//       <select name="ambition" value={form.ambition} onChange={handleChange} className="w-full border p-2 rounded">
//         <option value="">Ambition *</option>
//         {ambitionOptions.map(a => <option key={a}>{a}</option>)}
//       </select>

//       {form.ambition === "Others" && (
//         <input
//           type="text"
//           name="otherAmbition"
//           value={form.otherAmbition}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           placeholder="Specify ambition"
//         />
//       )}

//       <button className="bg-blue-600 text-white px-6 py-2 rounded">
//         Save & Finish
//       </button>
//     </form>
//   );
// }


import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function ProfileSetup12th({ onComplete, initialData, email, complete }) {
  console.log("ProfileSetup12th initialData:", initialData);

  const allSubjects = [
    "English", "Physics", "Chemistry", "Mathematics", "Biology",
    "Computer Science", "Human Development", "Clothing for the Family",
    "Extension Education", "Business Studies", "Accountancy",
    "Economics", "Business Maths", "Computer Application"
  ];

  const streamOptions = ["PCMB", "PCM", "PCB", "Arts", "Commerce"];
  const interestSubjects = ["Science", "Mathematics", "SocialScience", "Languages", "ComputerScience", "Arts", "Commerce"];
  const ambitionOptions = ["Doctor", "Engineer", "Teacher", "Scientist", "Lawyer", "Artist", "Entrepreneur", "Others"];

  const emptyForm = {
    medium: "",
    compulsoryLanguage: "",
    stream: "",
    interest: "",
    ambition: "",
    otherAmbition: "",
    cutoff: "",
     neetScore: "",     // ✅ NEW
  jeeScore: "",      // ✅ NEW
    preferredLocations: ["", "", "", "", ""], // NEW
  };

  const [form, setForm] = useState(emptyForm);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Map Supabase keys → component form keys
  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        medium: initialData.medium || "",
        compulsoryLanguage: initialData.Language || "", // map Language → compulsoryLanguage
        stream: initialData.stream || "",
        interest: initialData.interest || "",
        ambition: initialData.ambition || "",
        otherAmbition: initialData.ambition && !ambitionOptions.includes(initialData.ambition) ? initialData.ambition : "",
        cutoff: initialData.cutoff || "",
        neetScore: initialData.neet_score || "",   // ✅ NEW
  jeeScore: initialData.jee_score || "",     // ✅ NEW
        preferredLocations: initialData.preferred_locations || ["", "", "", "", ""],
      });

      // Map subjects
      setSelectedSubjects(initialData.subjects || []);
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

  const handleLocationChange = (index, value) => {
  setForm(prev => {
    const updated = [...prev.preferredLocations];
    updated[index] = value;
    return { ...prev, preferredLocations: updated };
  });
};


  const handleFinish = async e => {
    e.preventDefault();

    if (!form.medium || !form.compulsoryLanguage || !form.stream || !form.interest || !form.ambition) {
      return alert("Please fill all required fields");
    }

    if (selectedSubjects.length === 0) {
      return alert("Select at least one subject");
    }

    for (const s of selectedSubjects) {
      if (!s.marks) return alert(`Enter marks for ${s.name}`);
    }

    if (!email) {
      return alert("Email is required");
    }

    const finalData = {
      medium: form.medium,
      Language: form.compulsoryLanguage, // map back to DB column
      stream: form.stream,
      subjects: selectedSubjects,
      interest: form.interest,
      ambition: form.ambition === "Others" ? form.otherAmbition : form.ambition,
      neet_score: form.neetScore || null,   // ✅ NEW
  jee_score: form.jeeScore || null,     // ✅ NEW
        preferred_locations: form.preferredLocations, // ✅ ADD THIS
      email // from parent
    };
    const filledLocations = form.preferredLocations.filter(
  loc => loc.trim() !== ""
);

if (filledLocations.length < 3) {
  return alert("Please enter at least 3 preferred locations.");
}


    const { error } = await supabase
      .from("12th_profile_data")
      .upsert(finalData, { onConflict: "email" });

    if (error) {
      console.error("Supabase upsert error:", error);
      alert("❌ Failed to save 12th profile");
      return;
    }

    if (onComplete) onComplete(finalData);
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
            className={`px-4 py-2 rounded-full ${selectedSubjects.some(s => s.name === sub)
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

      <select name="interest" value={form.interest} onChange={handleChange} className="w-full border p-2 rounded">
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
    {/* Preferred Locations */}
<div>
  <h3 className="font-semibold mb-2">
    Preferred Locations (Any 3 Required)
  </h3>

  <div className="space-y-2">
    {form.preferredLocations.map((loc, index) => (
      <input
        key={index}
        type="text"
        value={loc}
        onChange={(e) => handleLocationChange(index, e.target.value)}
        className="w-full border p-2 rounded"
        placeholder={`Preferred Location ${index + 1}${index < 3 ? " *" : ""}`}
      />
    ))}
  </div>
</div>
{/* NEET / JEE (Optional) */}
<div className="space-y-4">

  {/* NEET */}
  <div className="flex items-center gap-4">
    <label className="w-32 font-semibold">
      NEET Score
    </label>
    <input
      type="number"
      name="neetScore"
      value={form.neetScore}
      onChange={handleChange}
      className="flex-1 border p-2 rounded"
      placeholder="If applicable"
    />
  </div>

  {/* JEE */}
  <div className="flex items-center gap-4">
    <label className="w-32 font-semibold">
      JEE Score
    </label>
    <input
      type="number"
      name="jeeScore"
      value={form.jeeScore}
      onChange={handleChange}
      className="flex-1 border p-2 rounded"
      placeholder="If applicable"
    />
  </div>

</div>



      <button className="bg-blue-600 text-white px-6 py-2 rounded">
        Save & Finish
      </button>
    </form>
  );
}
