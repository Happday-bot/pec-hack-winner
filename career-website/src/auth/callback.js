/*import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleAuth() {
      // Get URL hash after # and parse it
      const hash = new URL(window.location.href).hash.substring(1); // remove #
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // Set session manually
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        sessionStorage.setItem("supabase_session", JSON.stringify({
          access_token,
          refresh_token,
        }));
        sessionStorage.setItem("isAuthenticated", "true");

        // Redirect to profile setup
        //navigate("/profile-setup-basic");
         navigate("AptitudeTestLanding");
      } else {
        console.error("OAuth tokens missing in URL hash");
        navigate("/signin");
      }
    }

    handleAuth();
  }, [navigate]);

  return <div className="text-center mt-20">Completing login...</div>;

  
}
*/

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        navigate("/signin");
        return;
      }

      if (!data.session) {
        navigate("/signin");
        return;
      }

      const user = data.session.user;
      const userEmail = user.email;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle();

      // Fetch interest
      const { data: interestData } = await supabase
        .from("interest")
        .select("*")
        .eq("student_id", userEmail)
        .maybeSingle();

      // Persist session
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("userName", profileData?.fullname || "User");
      sessionStorage.setItem("qualification", profileData?.qualification || "");

      // 🎯 FINAL SMART ROUTING
      if (profileData && interestData) {
        navigate("/dashboard"); // ✅ YOUR REQUIREMENT
      } else {
        navigate("/profile-setup-basic");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      Completing login...
    </div>
  );
}
