import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabase";

const AptitudeTest = () => {
  const navigate = useNavigate();

  // 🔐 Gemini API (COMMENT THIS BEFORE FINAL COMMIT)
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyD4ZQJ3sEpCf_zIQLYlpajZ0QX36mUWtHc",
  });

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  /* =========================
     FETCH QUESTIONS
  ========================= */
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("qid, ques, A, B, C, D")
        .order("qid", { ascending: true });

      if (error) {
        console.error("❌ Question fetch error:", error);
        return;
      }

      const mapped = data.map(q => ({
        id: q.qid,
        text: q.ques,
        options: [q.A, q.B, q.C, q.D],
      }));

      setQuestions(mapped);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  /* =========================
     ANSWER HANDLER
  ========================= */
  const handleAnswer = (choiceIndex) => {
    const letter = ["A", "B", "C", "D"][choiceIndex];
    const qid = questions[index].id;

    setAnswers(prev => ({ ...prev, [qid]: letter }));

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setIsCompleted(true);
    }
  };

  /* =========================
     FINAL SUBMIT
  ========================= */
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const qualification = sessionStorage.getItem("qualification"); // 10th / 12th
    const stream = sessionStorage.getItem("stream") || "N/A";
    const email =
      sessionStorage.getItem("userEmail") ||
      sessionStorage.getItem("signUpEmail");

    if (!email) {
      alert("❌ Email not found. Please login again.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      prompt_id: "CAREER_GUIDANCE_V4_DOMAIN_FILTERED",
      prompt: `You are a professional career guidance analyzer. Strictly adhere to the following steps and output format using ONLY the provided 'student_data' and the analysis key (A: Creative, B: Technical/Mechanical/Structured, C: Commerce/Finance/Management, D: Biological/Medical/Research):

1. Tally the student's 'answers' (Q1-Q20) into the four clusters (A, B, C, D). Note Q14 and Q19 should be ignored if 'N/A' is used.

2. Determine the dominant cluster (highest count).

3. CRITICAL STEP: Filter Outcome Recommendations.

Select FIVE if standard 12th or THREE if standard 10th specializations for the 'final_outcome_recommendation'
from the 12th-grade list (['mech','civil','comp','aids','aiml','it','robotics','biomedical','biotechnology','cardiologist','mbbs','bba','bcom','chartered_accountant','law','fashion_design','animation'])
or from the 10th grade-list (['comp','Bio','Arts','Commerce','cultural sciences']).

Respect stream constraints strictly.

4. OUTPUT FORMAT (MANDATORY)

Return ONLY valid JSON. No markdown. No explanations.

{
  "tallied_answers": { "A": number, "B": number, "C": number, "D": number },
  "dominant_cluster_analysis": {
    "type": "A | B | C | D",
    "count": number,
    "description": "string"
  },
  "final_outcome_recommendation": [
    {
      "type": "A | B | C | D | A/C | C/A | B/D",
      "field": "string",
      "description": "string"
    }
  ],
  "justification": "string"
}

If invalid, return {}.`,
      student_data: {
        student_grade: sessionStorage.getItem("qualification"),
        current_stream: sessionStorage.getItem("stream") || "N/A",
        answers,
      },
    };


    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: JSON.stringify(payload) }],
          },
        ],
      });

      const rawText = response.text;

      // 🧹 Clean Gemini output
      const cleaned = rawText
        .replace(/```json|```/g, "")
        .replace(/[^\x20-\x7E]/g, "")
        .trim();

      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON from Gemini");

      const parsed = JSON.parse(match[0]);
      setFinalResult(parsed);

      const recommendedFields =
        parsed.final_outcome_recommendation?.map(r => r.field) || [];

      /* =========================
         SAVE TO SUPABASE
      ========================= */
      const { error } = await supabase
        .from("interest")
        .upsert(
          {
            student_id: email,
            interest: {
              recommended_fields: recommendedFields,
            },
          },
          { onConflict: "student_id" }
        );

      if (error) {
        console.error("❌ Supabase insert error:", error);
        alert("Failed to save aptitude result");
        setIsSubmitting(false);
        return;
      }

      sessionStorage.setItem("aptitudeDone", "true");

    } catch (err) {
      console.error("❌ Aptitude error:", err);
      alert("Unable to analyze aptitude now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading aptitude test…
      </div>
    );
  }

  /* =========================
     RESULT SCREEN
  ========================= */
  if (finalResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-center mb-4">
            Aptitude Result
          </h2>

          <ul className="space-y-3">
            {finalResult.final_outcome_recommendation.map((r, i) => (
              <li key={i} className="border p-3 rounded">
                <strong>{r.field}</strong>
                <p className="text-sm">{r.description}</p>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/courses")}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded"
          >
            Go to Courses
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     QUESTION UI
  ========================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full">
        <h2 className="text-sm text-gray-500 mb-2">
          Question {index + 1} / {questions.length}
        </h2>

        <h1 className="text-xl font-bold mb-6">
          {questions[index].text}
        </h1>

        <div className="space-y-4">
          {questions[index].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 rounded-lg"
            >
              {opt}
            </button>
          ))}
        </div>

        {isCompleted && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setConfirm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Submit Test
            </button>
          </div>
        )}

        {confirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center">
              <p className="mb-4">Confirm submission?</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setConfirm(false)}>Cancel</button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-600"
                    }`}
                >
                  {isSubmitting ? "Analyzing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeTest;
