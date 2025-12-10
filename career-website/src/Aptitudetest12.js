import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AptitudeTest = () => {
  const [questionTree, setQuestionTree] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [totalStartTime, setTotalStartTime] = useState(null);
  const [questionStart, setQuestionStart] = useState(null);
  const [finalRecommendation, setFinalRecommendation] = useState(null);

  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const stream = localStorage.getItem("stream");

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/questions/12/${stream}`);
        const data = await res.json();
        const tree = data.question_bank[0].question_tree;
        setQuestionTree(tree);
        setCurrentNode(tree);
        setTotalStartTime(Date.now());
        setQuestionStart(Date.now());
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err);
      }
    };
    fetchQuestions();
  }, []);

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

  if(finalRecommendation){
    // Send to FastAPI backend
    console.log("🚀 Sending final recommendation to backend:", finalRecommendation);
fetch(`http://localhost:8000/submit/12/${user_id}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(finalRecommendation)
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to submit recommendation");
    }
    return response.json();
  })
  .then(data => {
    console.log("✅ Sent to backend successfully:", data);
  })
  .catch(error => {
    console.error("❌ Error sending to backend:", error);
  });
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

