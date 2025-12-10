// import React from "react";
// import { useNavigate } from "react-router-dom";

// const AptitudeLanding = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
//       <h1 className="text-3xl font-bold mb-6">Welcome to the Aptitude Test</h1>
//       <p className="text-gray-700 mb-6">Click below when you're ready to begin.</p>
//       <button
//         onClick={() => navigate("/test")}
//         className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
//       >
//         Take Aptitude Test
//       </button>
//     </div>
//   );
// };

// export default AptitudeLanding;


import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AptitudeLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const qualification = location.state?.qualification || "10"; // default to 10th if not passed

  const goToTest = () => {
    if (qualification === "10") {
      navigate("/test1");  // 10th test
    } else if (qualification === "12") {
      navigate("/test"); // 12th test
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Aptitude Test</h1>
      <p className="text-gray-700 mb-6">Click below when you're ready to begin.</p>
      <button
        onClick={goToTest}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Take Aptitude Test
      </button>
    </div>
  );
};

export default AptitudeLanding;

