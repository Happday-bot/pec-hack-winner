import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase"; // adjust path

function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Sign in via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if it's the email confirmation issue
        if (error.message.toLowerCase().includes("email not confirmed")) {
          alert("Please verify your signup in your email before signing in.");
        } else {
          alert("Login failed: " + error.message);
        }
        return;
      }
      console.log("Login successful:", data);
      // 2️⃣ Optional: fetch user profile
      // 2️⃣ Get user's name from Auth user_metadata
      const user = data.user;
      const userName = user?.user_metadata?.full_name || "User";
      console.log("Logged in user name:", userName);
      // 3️⃣ Set local storage / state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", userName);

      onLogin?.(); // callback if any
      navigate("/dashboard");
    } catch (err) {
      console.log("Unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-[#FEF9F2] p-20 rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-[#8B5E34]">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#8B5E34]">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-[#8B5E34] text-base font-semibold mb-3">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-5 px-6 text-lg text-[#8B5E34] bg-[#FEF9F2] focus:outline-none focus:ring-2 focus:ring-[#A47148]"
              required
            />
          </div>

          <div className="mb-10">
            <label className="block text-[#8B5E34] text-base font-semibold mb-3">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-5 px-6 text-lg text-[#8B5E34] bg-[#FEF9F2] focus:outline-none focus:ring-2 focus:ring-[#A47148]"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-gradient-to-r from-[#8B5E34] to-[#A47148] hover:scale-105 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform text-lg"
              type="submit"
            >
              Sign In
            </button>

            <Link
              to="/signup"
              className="inline-block align-baseline font-semibold text-base text-[#8B5E34] hover:text-[#A47148]"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
