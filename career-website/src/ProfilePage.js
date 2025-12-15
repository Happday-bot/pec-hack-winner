// import React, { useState, useEffect, useCallback, use } from "react";
// import ProfileSetupBasic from "./ProfileSetupBasic";
// import ProfileSetup10th from "./ProfileSetup10th";
// import ProfileSetup12th from "./ProfileSetup12th";
// import { supabase } from "./supabase";

// console.log(sessionStorage.getItem("userEmail"));
// const EMAIL = sessionStorage.getItem("userEmail") || sessionStorage.getItem("signUpEmail")

// export default function ProfileSettings() {
//   const [qualification, setQualification] = useState(null);
//   const [editSection, setEditSection] = useState(null);

//   const [basicDone, setBasicDone] = useState(false);
//   const [tenthExists, setTenthExists] = useState(false);
//   const [twelfthExists, setTwelfthExists] = useState(false);

//   const [basicProfile, setBasicProfile] = useState(null);
//   const [tenthData, setTenthData] = useState(null);
//   const [twelfthData, setTwelfthData] = useState(null);

//   // ---------------- BASIC PROFILE ----------------
//   const fetchBasicProfile = useCallback(async () => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("email", EMAIL)
//       .maybeSingle();
  
//     console.log("Fetched Basic Profile:", data, error);

//     if (error || !data) {
//       setBasicDone(false);
//       setBasicProfile(null);
//       return;
//     }

//     const mapped = {
//       firstName: data.first_name,
//       middleName: data.middle_name,
//       lastName: data.last_name,
//       fullName: data.fullname,
//       email: data.email,
//       phone: data.phone,
//       gender: data.gender,
//       dob: data.dob,
//       qualification: data.qualification,
//       stream: data.stream || null
//     };

//     setBasicProfile(mapped);
//     setQualification(data.qualification);
//     console.log("Qualification set to:", data.qualification);
//     setBasicDone(true);
//   }, []);

//   // ---------------- 10TH ----------------
//   const fetch10thProfile = useCallback(async () => {
//     const { data } = await supabase
//       .from("10th_profile_data")
//       .select("*")
//       .eq("email", EMAIL)
//       .maybeSingle();

//     setTenthExists(!!data);
//     setTenthData(data || null);
//   }, []);

//   // ---------------- 12TH ----------------
//   const fetch12thProfile = useCallback(async () => {
//     const { data } = await supabase
//       .from("12th_profile_data")
//       .select("*")
//       .eq("email", EMAIL)
//       .maybeSingle();

//     setTwelfthExists(!!data);
//     setTwelfthData(data || null);
//   }, []);

//   // ---------------- INITIAL LOAD ----------------
//   useEffect(() => {
//     fetchBasicProfile();
//   }, [fetchBasicProfile]);

//   useEffect(() => {
//     fetch10thProfile();
//     fetch12thProfile();
//   }, [fetch10thProfile, fetch12thProfile]);

//   return (
//     <div className="max-w-5xl mx-auto mt-10">
//       <h2 className="text-xl font-bold mb-4">Profile Setup Status</h2>

//       {/* ---------- BASIC ---------- */}
//       <Section
//         title="Profile Setup – Basic"
//         done={basicDone}
//         onClick={() =>
//           setEditSection(editSection === "basic" ? null : "basic")
//         }
//       />

//       {editSection === "basic" && (
//         <ProfileSetupBasic
//           initialData={basicProfile}
//           Email={EMAIL}
//           onComplete={async () => {
//             await fetchBasicProfile(); // 🔥 CRITICAL FIX
//             setEditSection(null);
//           }}
//         />
//       )}

//       {/* ---------- 10TH ---------- */}
//       {qualification === "10" && (
//         <>
//           <Section
//             title="Profile Setup – 10th"
//             done={tenthExists}
//             onClick={() =>
//               setEditSection(editSection === "10th" ? null : "10th")
//             }
//           />

//           {editSection === "10th" && (
//             <ProfileSetup10th
//               initialData={tenthData}
//               email={EMAIL}
//               onComplete={async () => {
//                 await fetch10thProfile();
//                 setEditSection(null);
//               }}
//             />
//           )}
//         </>
//       )}

//       {/* ---------- 12TH ---------- */}
//       {qualification === "12" && (
//         <>
//           <Section
//             title="Profile Setup – 12th"
//             done={twelfthExists}
//             onClick={() =>
//               setEditSection(editSection === "12th" ? null : "12th")
//             }
//           />

//           {editSection === "12th" && (
//             <ProfileSetup12th
//               initialData={twelfthData}
//               email={EMAIL}
//               complete={fetch12thProfile}
//               onComplete={async () => {
//                 await fetch12thProfile();
//                 setEditSection(null);
//               }}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// const Section = ({ title, done, onClick }) => (
//   <div className="flex justify-between items-center mb-3">
//     <span>{done ? "✔" : "🔒"} {title}</span>
//     <button onClick={onClick} className="text-blue-600 font-semibold">
//       {done ? "View / Edit" : "Complete Now"}
//     </button>
//   </div>
// );


import React, { useState, useEffect, useCallback } from "react";
import ProfileSetupBasic from "./ProfileSetupBasic";
import ProfileSetup10th from "./ProfileSetup10th";
import ProfileSetup12th from "./ProfileSetup12th";
import { supabase } from "./supabase";

const EMAIL =
  sessionStorage.getItem("userEmail") ||
  sessionStorage.getItem("signUpEmail");

export default function ProfileSettings() {
  // ---------- CORE STATE ----------
  console.log(sessionStorage.getItem("qualification"));
  const [qualification, setQualification] = useState(sessionStorage.getItem("qualification") || null);
  const [updateflag, setUpdateflag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState(null);

  // ---------- STATUS FLAGS ----------
  const [basicDone, setBasicDone] = useState(false);
  const [tenthExists, setTenthExists] = useState(false);
  const [twelfthExists, setTwelfthExists] = useState(false);

  // ---------- DATA ----------
  const [basicProfile, setBasicProfile] = useState(null);
  const [tenthData, setTenthData] = useState(null);
  const [twelfthData, setTwelfthData] = useState(null);

  // ---------- BASIC ----------
  const fetchBasicProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", EMAIL)
      .maybeSingle();

    if (error || !data) {
      setBasicDone(false);
      setBasicProfile(null);
      setQualification(null);
      return;
    }

    setBasicProfile({
      firstName: data.first_name,
      middleName: data.middle_name,
      lastName: data.last_name,
      fullName: data.fullname,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dob: data.dob,
      qualification: sessionStorage.getItem("qualification"),
      stream: data.stream || null,
    });
    console.log("Qualification from basic profile:", data.qualification);
    if(updateflag){
      setBasicProfile({firstName: data.first_name,
      middleName: data.middle_name,
      lastName: data.last_name,
      fullName: data.fullname,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dob: data.dob,
      qualification: data.qualification,
      stream: data.stream || null,})
      setQualification(data.qualification);
    }
    setUpdateflag(true);
    setBasicDone(true);
  }, []);

  // ---------- 10TH ----------
  const fetch10thProfile = useCallback(async () => {
    const { data } = await supabase
      .from("10th_profile_data")
      .select("*")
      .eq("email", EMAIL)
      .maybeSingle();

    setTenthExists(!!data);
    setTenthData(data || null);
  }, []);

  // ---------- 12TH ----------
  const fetch12thProfile = useCallback(async () => {
    const { data } = await supabase
      .from("12th_profile_data")
      .select("*")
      .eq("email", EMAIL)
      .maybeSingle();

    setTwelfthExists(!!data);
    setTwelfthData(data || null);
  }, []);

  // ---------- BOOTSTRAP ----------
  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      await fetchBasicProfile();
      await Promise.all([fetch10thProfile(), fetch12thProfile()]);
      setLoading(false);
    };

    bootstrap();
  }, [fetchBasicProfile, fetch10thProfile, fetch12thProfile]);

  // ---------- LOADING GATE ----------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 text-gray-600">
        Initializing profile context…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Profile Setup Status</h2>

      {/* ---------- BASIC ---------- */}
      <Section
        title="Profile Setup – Basic"
        done={basicDone}
        onClick={() =>
          setEditSection(editSection === "basic" ? null : "basic")
        }
      />

      {editSection === "basic" && (
        <ProfileSetupBasic
          initialData={basicProfile}
          Email={EMAIL}
          onComplete={async () => {
            await fetchBasicProfile();
            setEditSection(null);
          }}
        />
      )}

      {/* ---------- 10TH ---------- */}
      {qualification === "10" && (
        <>
          <Section
            title="Profile Setup – 10th"
            done={tenthExists}
            onClick={() =>
              setEditSection(editSection === "10th" ? null : "10th")
            }
          />

          {editSection === "10th" && (
            <ProfileSetup10th
              initialData={tenthData}
              email={EMAIL}
              onComplete={async () => {
                await fetch10thProfile();
                setEditSection(null);
              }}
            />
          )}
        </>
      )}

      {/* ---------- 12TH ---------- */}
      {qualification === "12" && (
        <>
          <Section
            title="Profile Setup – 12th"
            done={twelfthExists}
            onClick={() =>
              setEditSection(editSection === "12th" ? null : "12th")
            }
          />

          {editSection === "12th" && (
            <ProfileSetup12th
              initialData={twelfthData}
              email={EMAIL}
              onComplete={async () => {
                await fetch12thProfile();
                setEditSection(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

const Section = ({ title, done, onClick }) => (
  <div className="flex justify-between items-center mb-3">
    <span>{done ? "✔" : "🔒"} {title}</span>
    <button onClick={onClick} className="text-blue-600 font-semibold">
      {done ? "View / Edit" : "Complete Now"}
    </button>
  </div>
);
