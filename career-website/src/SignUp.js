import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please enter all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.user_id);
        localStorage.setItem("user_id", responseData.user_id);
        alert("Account created successfully!");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", form.name); // store name
        navigate("/profile-setup-basic");
      } else {
        const errorData = await response.json();
        alert(`Failed to sign up: ${errorData.detail}`);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border rounded-lg"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white py-3 rounded-lg transition`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
