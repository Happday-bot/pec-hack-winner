import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AptitudeLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const qualification =
    location.state?.qualification ||
    localStorage.getItem("qualification") ||
    "10";

    useEffect(() => {
  const isProfileCompleted = localStorage.getItem("profileBasicCompleted");

  if (!isProfileCompleted) {
    navigate("/profile-setup-basic");
  }

  localStorage.setItem("qualification", qualification);
}, [qualification, navigate]);

  useEffect(() => {
    localStorage.setItem("qualification", qualification);
  }, [qualification]);

  const goToTest = () => {
    const targetRoute = qualification === "10" ? "/test1" : "/test";

    navigate(targetRoute);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Aptitude Test
        </h1>

        <p className="text-gray-600 mb-8">
          Get ready to challenge your logical and analytical skills.
        </p>

        <button
          onClick={goToTest}
          className="w-full py-3 text-lg font-semibold text-white rounded-xl
                     bg-gradient-to-r from-blue-600 to-indigo-600
                     shadow-md hover:shadow-lg hover:scale-[1.02]
                     transition-all duration-300"
        >
          Start Test
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Qualification:{" "}
          <span className="font-semibold">{qualification}th Standard</span>
        </p>
      </div>
    </div>
  );
};

export default AptitudeLanding;
