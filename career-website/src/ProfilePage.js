import React, { useState, useEffect } from "react";
import ProfileSetupBasic from "./ProfileSetupBasic";
import ProfileSetup10th from "./ProfileSetup10th";
import ProfileSetup12th from "./ProfileSetup12th";
import { supabase } from "./supabase";

export default function ProfileSettings() {
  const [qualification, setQualification] = useState("12");
  const [editSection, setEditSection] = useState(null);

  const [basicDone, setBasicDone] = useState(false);
  const [tenthDone, setTenthDone] = useState(false);
  const [twelfthDone, setTwelfthDone] = useState(false);
  const [twelfthData, setTwelfthData] = useState(null);
  const [twelfthExists, setTwelfthExists] = useState(false);
  const [tenthExists, setTenthExists] = useState(false);
  const [tenthData, setTenthData] = useState(null);

  const [basicProfile, setBasicProfile] = useState(null);



  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", "alfredsam2006@gmail.com")
        .single();

      if (error) {
        console.warn("No basic profile found in Supabase");
        setBasicDone(false);
        return;
      }

      // Map Supabase row → ProfileSetupBasic expected shape
      const mappedBasic = {
        firstName: data.first_name,
        middleName: data.middle_name,
        lastName: data.last_name,
        fullName: data.fullname,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dob: data.dob,
        qualification: data.qualification,
        stream: data.stream || null
      };

      setBasicProfile(mappedBasic);
      setBasicDone(true);

      // Sync qualification globally
      if (data.qualification) {
        sessionStorage.setItem("qualification", data.qualification);
        setQualification(data.qualification);
      }

      console.log("Supabase Basic Profile:", mappedBasic);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const check12thProfile = async () => {
      const { data, error } = await supabase
        .from("12th_profile_data")
        .select("*")
        .eq("email", "alfredsam2006@gmail.com")
        .maybeSingle();

      if (error) {
        console.warn("No 12th profile found");
        setTwelfthData(null);
        setTwelfthDone(false);
        setTwelfthExists(false);
        return;
      }
      console.log("Supabase 12th Profile found:", data);
      setTwelfthData(data);
      setTwelfthDone(!!data);
      setTwelfthExists(!!data);
    };

    check12thProfile();
  }, []);

  useEffect(() => {
    const check10thProfile = async () => {
      const { data, error } = await supabase
        .from("10th_profile_data")
        .select("*")
        .eq("email", "alfredsam2006@gmail.com")
        .maybeSingle();

      if (error || !data) {
        setTenthExists(false);
        setTenthData(null);
        return;
      }

      setTenthExists(true);
      setTenthData(data);
    };

    check10thProfile();
  }, []);




  // ---------- STRICT 10TH CHECK ----------
  const is10thComplete = () => {
    const raw = sessionStorage.getItem("profile10th");
    if (!raw) return false;
    const d = JSON.parse(raw);

    if (!d.medium || !d.compulsoryLanguage || !d.interest || !d.ambition) return false;
    if (!d.marks) return false;

    for (const key in d.marks) {
      if (!d.marks[key]) return false;
    }
    return true;
  };

  // ---------- STRICT 12TH CHECK ----------
  const is12thComplete = () => {
    const raw = sessionStorage.getItem("profile12th");
    if (!raw) return false;
    const d = JSON.parse(raw);

    if (!d.medium || !d.compulsoryLanguage || !d.stream || !d.interests || !d.ambition)
      return false;

    if (!Array.isArray(d.selectedSubjects) || d.selectedSubjects.length === 0)
      return false;

    for (const s of d.selectedSubjects) {
      if (!s.name || !s.marks) return false;
    }

    if ((d.stream === "PCM" || d.stream === "PCMB") && (!d.cutoff || d.cutoff <= 0))
      return false;

    return true;
  };

  // ---------- SYNC QUALIFICATION SAFELY ----------
  useEffect(() => {
    const basicRaw = sessionStorage.getItem("profileBasic");
    const basic = basicRaw ? JSON.parse(basicRaw) : null;

    if (basic?.qualification) {
      sessionStorage.setItem("qualification", basic.qualification);
      setQualification(basic.qualification);
    } else {
      setQualification(sessionStorage.getItem("qualification") || "12");
    }

    setBasicDone(!!basicRaw);
    setTenthDone(is10thComplete());
    setTwelfthDone(is12thComplete());
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Profile Setup Status</h2>

      <Section
        title="Profile Setup – Basic"
        done={basicDone}
        onClick={() => setEditSection(editSection === "basic" ? null : "basic")}
      />

      {editSection === "basic" && (
        <ProfileSetupBasic
          initialData={basicProfile}
          onComplete={() => {
            setBasicDone(true);
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
              email="alfredsam2006@gmail.com"
              onComplete={() => {
                setTenthExists(true);
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
            onClick={() => setEditSection(editSection === "12th" ? null : "12th")}
          />

          {editSection === "12th" && (
            <ProfileSetup12th
              initialData={twelfthData} email="alfredsam2006@gmail.com"
              onComplete={() => {
                setTwelfthDone(true);
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
