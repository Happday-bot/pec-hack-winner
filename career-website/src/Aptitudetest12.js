import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AptitudeTest = () => {
  // Local dummy question tree (replaces backend)
  const sampleQuestionTree = {
    Question1: "Do you enjoy problem solving?",
    Options: {
      Yes: {
        Question2: "Do you like working with numbers?",
        Options: {
          Yes: "Consider Engineering",
          No: "Consider Computer Science",
        },
      },
      No: {
        Question2: "Do you prefer reading and analysis?",
        Options: {
          Yes: "Consider Humanities",
          No: "Consider Vocational Courses",
        },
      },
    },
  };

  const [questionTree, setQuestionTree] = useState(sampleQuestionTree);
  const [currentNode, setCurrentNode] = useState(sampleQuestionTree);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [totalStartTime, setTotalStartTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [finalRecommendation, setFinalRecommendation] = useState(null);

  const navigate = useNavigate();

  const handleChoice = (option) => {
    const endTime = Date.now();
    const elapsed = (endTime - questionStart) / 1000;
    setAnswerTimes((prev) => [...prev, elapsed]);

    const nextNode = currentNode.Options?.[option];

    if (typeof nextNode === "string") {
      // Leaf node -> Finish
      const totalDuration = ((endTime - totalStartTime) / 1000).toFixed(2);
      setFinalRecommendation({
        recommendation: [nextNode],
        times: [...answerTimes, elapsed],
        total: totalDuration,
      });
    } else {
      // Continue to next question
      setCurrentNode(nextNode);
      setQuestionStart(Date.now());
    }
  };

  if (!questionTree) {
    return <div className="p-8 text-lg">⏳ Loading questionnaire...</div>;
  }

  if (finalRecommendation) {
    // No backend: simply log the recommendation and allow user to continue
    console.log("Local final recommendation:", finalRecommendation);
  }
  
  if (finalRecommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 Quiz Completed</h2>
          <p className="text-lg mb-3">
            ✅ Final Recommendation:{" "}
            <span className="font-bold text-blue-600">{finalRecommendation.recommendation}</span>
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Explore my Courses
          </button>
        </div>
      </div>
    );
  }

  // Current question
  const questionKey = Object.keys(currentNode).find((k) => k !== "Options");
  const question = currentNode[questionKey];
  const options = Object.keys(currentNode.Options || {});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 px-8 py-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{question}</h2>
          <div className="space-y-4">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt)}
                className="w-full bg-blue-100 text-blue-800 font-semibold py-3 px-4 rounded-lg hover:bg-blue-200 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AptitudeTest;

