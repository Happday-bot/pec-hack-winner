// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { supabase } from "./supabase"; // adjust path

// function SignUp() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // handle input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // EMAIL + PASSWORD SIGNUP
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.email || !form.password) {
//       alert("Please enter all fields.");
//       return;
//     }

//     setLoading(true);
//     // 1️⃣ Check if email already exists
//     const { data: existing, error: checkError } = await supabase
//       .from("profiles")
//       .select("id")
//       .eq("email", form.email)
//       .maybeSingle();

//     if (checkError) {
//       console.error(checkError);
//       return;
//     }

//     if (existing) {
//       alert("User already exists");
//       navigate("/signin");
//       return;
//     }

//     // 1️⃣ Create Supabase user
//     const { data, error } = await supabase.auth.signUp({
//       email: form.email,
//       password: form.password,
//     });

//     if (error) {
//       alert(error.message);
//       sessionStorage.clear();
//       setLoading(false);
//       return;
//     }else{
//       sessionStorage.setItem("signUpEmail", form.email);
//     }

//     const user = data.user;

//     // 2️⃣ Save profile data
//     const { data: profileData, error: profileError } = await supabase
//       .from("profiles")
//       .insert({
//         fullname: form.name,
//         email: form.email,
//       });

//     // Log full response for debugging
//     console.log("Supabase insert response:", { profileData, profileError });

//     if (profileError) {
//       alert("Error creating profile: " + profileError.message);
//       setLoading(false);
//       return; // Stop further execution
//     }

//     // If success
//     alert("Account created successfully!");
//     navigate("/profile-setup-basic");
//     setLoading(false);

//   };

//   // GOOGLE SIGN-IN
//   const signInWithGoogle = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: { redirectTo: "http://localhost:3000/auth/callback" },
//     });
//   };

//   // MICROSOFT SIGN-IN
//   const signInWithMicrosoft = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: "azure",
//       options: { redirectTo: "http://localhost:3000/auth/callback" },
//     });
//   };

//   return (
//     <div className="bg-white min-h-screen flex items-center justify-center">
//       <div className="bg-[#FEF9F2] p-20 rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-[#8B5E34]">
//         <h2 className="text-4xl font-bold text-center mb-10 text-[#8B5E34]">
//           Sign Up
//         </h2>

//         <form onSubmit={handleSubmit}>
//           {/* Full Name */}
//           <div className="mb-8">
//             <label className="block text-[#8B5E34] text-base font-semibold mb-3">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter your name"
//               value={form.name}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-5 px-6 text-lg text-[#8B5E34] bg-[#FEF9F2] focus:outline-none focus:ring-2 focus:ring-[#A47148]"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="mb-8">
//             <label className="block text-[#8B5E34] text-base font-semibold mb-3">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={form.email}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-5 px-6 text-lg text-[#8B5E34] bg-[#FEF9F2] focus:outline-none focus:ring-2 focus:ring-[#A47148]"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-10">
//             <label className="block text-[#8B5E34] text-base font-semibold mb-3">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={form.password}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-5 px-6 text-lg text-[#8B5E34] bg-[#FEF9F2] focus:outline-none focus:ring-2 focus:ring-[#A47148]"
//               required
//             />
//           </div>

//           {/* Signup Button */}
//           <div className="flex items-center justify-between mb-10">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`bg-gradient-to-r from-[#8B5E34] to-[#A47148] hover:scale-105 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform text-lg ${loading ? "opacity-60 cursor-not-allowed" : ""
//                 }`}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>

//             <Link
//               to="/signin"
//               className="inline-block align-baseline font-semibold text-base text-[#8B5E34] hover:text-[#A47148]"
//             >
//               Already have an account?
//             </Link>
//           </div>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-8">
//           <div className="flex-1 h-px bg-[#8B5E34]"></div>
//           <span className="px-4 text-[#8B5E34] font-semibold text-lg">OR</span>
//           <div className="flex-1 h-px bg-[#8B5E34]"></div>
//         </div>

//         {/* Google/Microsoft */}
//         <div className="space-y-5">
//           <button
//             onClick={signInWithGoogle}
//             className="w-full py-4 rounded-xl border-2 border-[#8B5E34] text-[#8B5E34] font-semibold text-lg bg-white hover:bg-[#F2E6D8] transition"
//           >
//             Sign up with Google
//           </button>

//           <button
//             onClick={signInWithMicrosoft}
//             className="w-full py-4 rounded-xl border-2 border-[#8B5E34] text-[#8B5E34] font-semibold text-lg bg-white hover:bg-[#F2E6D8] transition"
//           >
//             Sign up with Microsoft
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

function SignUp() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        general: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ name: "", email: "", password: "", general: "" });

        if (!form.name) {
            setErrors((prev) => ({ ...prev, name: "Full name is required" }));
            return;
        }

        if (!form.email) {
            setErrors((prev) => ({ ...prev, email: "Email is required" }));
            return;
        }

        if (!form.password) {
            setErrors((prev) => ({ ...prev, password: "Password is required" }));
            return;
        }

        setLoading(true);

        const { data: existing, error: checkError } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", form.email)
            .maybeSingle();

        if (checkError) {
            setErrors((prev) => ({
                ...prev,
                general: "Something went wrong. Try again.",
            }));
            setLoading(false);
            return;
        }

        if (existing) {
            setErrors((prev) => ({
                ...prev,
                general: "User already exists. Please sign in.",
            }));
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (error) {
            setErrors((prev) => ({ ...prev, general: error.message }));
            setLoading(false);
            sessionStorage.clear();
            return;
        } else {
            sessionStorage.setItem("signUpEmail", form.email);
        }

        const { error: profileError } = await supabase.from("profiles").insert({
            fullname: form.name,
            email: form.email,
        });

        if (profileError) {
            setErrors((prev) => ({
                ...prev,
                general: "Error creating profile. Try again.",
            }));
            setLoading(false);
            return;
        }

        navigate("/profile-setup-basic");
        setLoading(false);
    };

    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="bg-[#FEF9F2] p-20 rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-[#8B5E34]">
                <h2 className="text-4xl font-bold text-center mb-10 text-[#8B5E34]">
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="mb-8">
                        <label className="block text-[#8B5E34] font-semibold mb-3">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`shadow border rounded w-full py-5 px-6 text-lg bg-[#FEF9F2] focus:outline-none focus:ring-2
                ${errors.name
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-[#8B5E34] focus:ring-[#A47148]"
                                }`}
                        />
                        {errors.name && (
                            <div className="mt-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
                                <span className="font-bold">!</span>
                                <span>{errors.name}</span>

                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-8">
                        <label className="block text-[#8B5E34] font-semibold mb-3">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`shadow border rounded w-full py-5 px-6 text-lg bg-[#FEF9F2] focus:outline-none focus:ring-2
                ${errors.email
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-[#8B5E34] focus:ring-[#A47148]"
                                }`}
                        />
                        {errors.email && (
                            <div className="mt-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
                                <span className="font-bold">!</span>
                                <span>  {errors.email}</span>

                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-10">
                        <label className="block text-[#8B5E34] font-semibold mb-3">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`shadow border rounded w-full py-5 px-6 text-lg bg-[#FEF9F2] focus:outline-none focus:ring-2
                ${errors.password
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-[#8B5E34] focus:ring-[#A47148]"
                                }`}
                        />
                        {errors.password && (
                            <div className="mt-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
                                <span className="font-bold">!</span>
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    {/* General error (user exists or other) */}
                    {errors.general && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center text-sm w-full">
                            {errors.general}
                        </div>
                    )}


                    <div className="flex items-center justify-between mb-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-gradient-to-r from-[#8B5E34] to-[#A47148] text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform text-lg ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
                                }`}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>

                        <Link
                            to="/signin"
                            className="font-semibold text-[#8B5E34] hover:text-[#A47148]"
                        >
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;