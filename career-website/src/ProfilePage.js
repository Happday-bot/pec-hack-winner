// import React, { useState, useEffect, useCallback, useRef } from "react";
// import ProfileSetupBasic from "./ProfileSetupBasic";
// import ProfileSetup10th from "./ProfileSetup10th";
// import ProfileSetup12th from "./ProfileSetup12th";
// import { supabase } from "./supabase";



// export default function ProfileSettings() {
//   const [EMAIL, setEmail] = useState(
//     () =>
//       sessionStorage.getItem("userEmail") ||
//       sessionStorage.getItem("signUpEmail")
//   );
//   console.log("ProfileSettings initialized with EMAIL:", EMAIL);

//   const TOTAL_SYNC_CALLS = 3;

//   const [syncCount, setSyncCount] = useState(0);
//   const isBootstrappingRef = useRef(false);

//   // ---------- CORE ----------
//   const [qualification, setQualification] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editSection, setEditSection] = useState(null);

//   // ---------- FLAGS ----------
//   const [basicDone, setBasicDone] = useState(false);
//   const [tenthExists, setTenthExists] = useState(false);
//   const [twelfthExists, setTwelfthExists] = useState(false);

//   // ---------- DATA ----------
//   const [basicProfile, setBasicProfile] = useState(null);
//   const [tenthData, setTenthData] = useState(null);
//   const [twelfthData, setTwelfthData] = useState(null);

//   /* ===============================
//      HARD RESET ON USER CHANGE
//      =============================== */
//   const resetStateForUser = () => {
//     setLoading(true);
//     setSyncCount(0);

//     setBasicDone(false);
//     setTenthExists(false);
//     setTwelfthExists(false);

//     setBasicProfile(null);
//     setTenthData(null);
//     setTwelfthData(null);

//     setQualification(null);
//     setEditSection(null);
//   };


//   /* ===============================
//      FETCHERS
//      =============================== */

//   const fetchBasicProfile = useCallback(async () => {
//     try {
//       const { data } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("email", EMAIL)
//         .maybeSingle();

//       if (!data) return;

//       setBasicProfile({
//         firstName: data.first_name,
//         middleName: data.middle_name,
//         lastName: data.last_name,
//         fullName: data.fullname,
//         email: data.email,
//         phone: data.phone,
//         gender: data.gender,
//         dob: data.dob,
//         qualification: data.qualification,
//         stream: data.stream || null,
//       });

//       setQualification(data.qualification);
//       setBasicDone(true);
//     } finally {
//       if (isBootstrappingRef.current) {
//         setSyncCount((p) => p + 1);
//         console.log("Basic profile fetched");
//       }
//     }
//     console.log("fetchBasicProfile completed")
//   }, [EMAIL]);

//   const fetch10thProfile = useCallback(async () => {
//     try {
//       const { data } = await supabase
//         .from("10th_profile_data")
//         .select("*")
//         .eq("email", EMAIL)
//         .maybeSingle();

//       setTenthExists(!!data);
//       setTenthData(data || null);
//     } finally {
//       if (isBootstrappingRef.current) {
//         setSyncCount((p) => p + 1);
//         console.log("10th profile fetched");
//       }
//     }
//   }, [EMAIL]);

//   const fetch12thProfile = useCallback(async () => {
//     try {
//       const { data } = await supabase
//         .from("12th_profile_data")
//         .select("*")
//         .eq("email", EMAIL)
//         .maybeSingle();

//       setTwelfthExists(!!data);
//       setTwelfthData(data || null);
//     } finally {
//       if (isBootstrappingRef.current) {
//         setSyncCount((p) => p + 1);
//         console.log("12th profile fetched");
//       }
//     }
//   }, [EMAIL]);

//   /* ===============================
//      BOOTSTRAP (EMAIL IS KEY)
//      =============================== */
//   useEffect(() => {
//   if (!EMAIL) return;

//   const bootstrap = async () => {
//     resetStateForUser();
//     setLoading(true);

//     try {
//       await Promise.all([
//         fetchBasicProfile(),
//         fetch10thProfile(),
//         fetch12thProfile()
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   bootstrap();
// }, [EMAIL, fetchBasicProfile, fetch10thProfile, fetch12thProfile]);


//   // /* ===============================
//   //    SYNC EXIT
//   //    =============================== */
//   // useEffect(() => {
//   //   if (syncCount >= TOTAL_SYNC_CALLS && loading) {
//   //     isBootstrappingRef.current = false;
//   //     setLoading(false);
//   //   }
//   // }, [syncCount, loading]);

//   /* ===============================
//      LOADING
//      =============================== */
//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto mt-10 text-gray-600">
//         Initializing profile context…
//       </div>
//     );
//   }

//   /* ===============================
//      RENDER
//      =============================== */
//   return (
//     <div className="max-w-5xl mx-auto mt-10">
//       <h2 className="text-xl font-bold mb-4">Profile Setup Status</h2>

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
//             await fetchBasicProfile();
//             setEditSection(null);
//           }}
//         />
//       )}

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

// /* ===============================
//    SECTION
//    =============================== */
// const Section = ({ title, done, onClick }) => (
//   <div className="flex justify-between items-center mb-3">
//     <span>{done ? "✔" : "🔒"} {title}</span>
//     <button onClick={onClick} className="text-blue-600 font-semibold">
//       {done ? "View / Edit" : "Complete Now"}
//     </button>
//   </div>
// );


import React, { useState, useEffect, useCallback, useRef } from "react";
import ProfileSetupBasic from "./ProfileSetupBasic";
import ProfileSetup10th from "./ProfileSetup10th";
import ProfileSetup12th from "./ProfileSetup12th";
import { supabase } from "./supabase";

export default function ProfileSettings() {
  const [EMAIL, setEmail] = useState(
    () =>
      sessionStorage.getItem("userEmail") ||
      sessionStorage.getItem("signUpEmail")
  );

  const isBootstrappingRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState(null);

  const [qualification, setQualification] = useState(null);

  const [basicDone, setBasicDone] = useState(false);
  const [tenthExists, setTenthExists] = useState(false);
  const [twelfthExists, setTwelfthExists] = useState(false);

  const [basicProfile, setBasicProfile] = useState(null);
  const [tenthData, setTenthData] = useState(null);
  const [twelfthData, setTwelfthData] = useState(null);

  // Reset all state when user changes
  const resetStateForUser = () => {
    setLoading(true);

    setBasicDone(false);
    setTenthExists(false);
    setTwelfthExists(false);

    setBasicProfile(null);
    setTenthData(null);
    setTwelfthData(null);

    setQualification(null);
    setEditSection(null);
  };

  // --------- FETCHERS ---------
  const fetchBasicProfile = useCallback(async () => {
    if (!EMAIL) return;

    try {
      console.log("Fetching basic profile for EMAIL:", EMAIL);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", EMAIL)
        .maybeSingle();

      console.log("Fetched basic profile data:", data, "Error:", error);

      if (error) {
        console.error("Error fetching basic profile:", error);
        return;
      }

      if (data) {
        setBasicProfile({
          firstName: data.first_name,
          middleName: data.middle_name,
          lastName: data.last_name,
          fullName: data.fullname,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          qualification: data.qualification,
          stream: data.stream || null,
        });

        setQualification(String(data.qualification));
        setBasicDone(true);
      }
    } catch (err) {
      console.error("Unexpected error fetching basic profile:", err);
    }
  }, [EMAIL]);

  const fetch10thProfile = useCallback(async () => {
    if (!EMAIL) return;

    try {
      const { data, error } = await supabase
        .from("10th_profile_data")
        .select("*")
        .eq("email", EMAIL)
        .maybeSingle();

      if (error) {
        console.error("Error fetching 10th profile:", error);
        return;
      }

      setTenthExists(!!data);
      setTenthData(data || null);
    } catch (err) {
      console.error("Unexpected error fetching 10th profile:", err);
    }
  }, [EMAIL]);

  const fetch12thProfile = useCallback(async () => {
    if (!EMAIL) return;

    try {
      const { data, error } = await supabase
        .from("12th_profile_data")
        .select("*")
        .eq("email", EMAIL)
        .maybeSingle();

      if (error) {
        console.error("Error fetching 12th profile:", error);
        return;
      }

      setTwelfthExists(!!data);
      setTwelfthData(data || null);
    } catch (err) {
      console.error("Unexpected error fetching 12th profile:", err);
    }
  }, [EMAIL]);

  // --------- BOOTSTRAP ---------
  useEffect(() => {
    if (!EMAIL) return;

    const bootstrap = async () => {
      resetStateForUser();
      isBootstrappingRef.current = true;
      setLoading(true);

      await Promise.all([
        fetchBasicProfile(),
        fetch10thProfile(),
        fetch12thProfile(),
      ]);

      setLoading(false);
      isBootstrappingRef.current = false;
    };

    bootstrap();
  }, [EMAIL, fetchBasicProfile, fetch10thProfile, fetch12thProfile]);

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

/* --------------------- SECTION COMPONENT --------------------- */
const Section = ({ title, done, onClick }) => (
  <div className="flex justify-between items-center mb-3">
    <span>{done ? "✔" : "🔒"} {title}</span>
    <button onClick={onClick} className="text-blue-600 font-semibold">
      {done ? "View / Edit" : "Complete Now"}
    </button>
  </div>
);
