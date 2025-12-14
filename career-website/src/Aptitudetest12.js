import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabase";




const AptitudeTest = () => {
  const navigate = useNavigate();
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDKCXPAegphQzUEGR8kt_3dmTur1R_aUvQ", // explicitly added as requested
  });

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [finalText, setFinalText] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("qid, ques, A, B, C, D")
        .order("qid", { ascending: true }); // or order_no

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const mapped = data.map((q) => ({
        id: q.qid,              // 🔑 CRITICAL: mapping qid → id
        text: q.ques,
        options: [q.A, q.B, q.C, q.D],
      }));

      setQuestions(mapped);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading aptitude test…</p>
      </div>
    );
  }


  /* =======================
     ANSWER HANDLER
     ======================= */

  const handleAnswer = (choiceIndex) => {
    const letter = ["A", "B", "C", "D"][choiceIndex];
    const qid = questions[index].id;

    setAnswers({ ...answers, [qid]: letter });

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      // ✅ test completed
      setIsCompleted(true);
    }
  };

  /* =======================
     FINAL SUBMIT
     ======================= */

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      prompt_id: "CAREER_GUIDANCE_V4_DOMAIN_FILTERED",
      prompt: `You are a professional career guidance analyzer. Strictly adhere to the following steps and output format using ONLY the provided 'student_data' and the analysis key (A: Creative, B: Technical/Mechanical/Structured, C: Commerce/Finance/Management, D: Biological/Medical/Research):\n\n1. Tally the student's 'answers' (Q1-Q20) into the four clusters (A, B, C, D). Note Q14 and Q19 should be ignored if 'N/A' is used.\n\n2. Determine the *dominant cluster* (highest count).
      
      
      \n\n3. *CRITICAL STEP: Filter Outcome Recommendations.* 
  
      Select FIVE if standard 12th or THREE if standard 10th specializations for the 'final_outcome_recommendation' 
      from the 12th-grade list (['mech', 'civil', 'comp', 'aids', 'aiml', 'it', 'robotics', 'biomedical', 'biotechnology', 'cardiologist', 'mbbs', 'bba', 'bcom', 'chartered_accountant', 'law', 'fashion_design', 'animation']) if student is of class 12th else 
      from the 10th grade-list (['comp','Bio','Arts','Commerce','cultural sciences']). 
      
      The chosen fields *MUST* align with the dominant cluster *AND* be feasible based on the student's 'current_stream' as follows:\n    * *If current_stream is 'N/A' then the student has just completed class 10th grade so all the 10th grade-list is valid while if calss 12th then 'Science (PCM)' or 'Science (PCMB)':* All technical (B), creative (A), and limited science (D - focusing on B/D hybrids like Biomedical/Biotech) fields are valid. Pure Medical/Biological (like MBBS, Cardiologist, B.Sc. Pure Bio) are *ONLY* valid if PCMB stream is confirmed.\n    * *If current_stream is 'Commerce':* Only fields C and A (Business Law, Finance, Design Management) are valid.\n    * *If current_stream is 'Arts/Humanities':* Only fields A and C (Law, Design, Management) are valid.
      
      \n\n4. OUTPUT FORMAT (MANDATORY — NO DEVIATION ALLOWED)
Return ONLY valid JSON.
Do NOT include markdown, explanations, comments, or extra keys.
Do NOT rename any keys.
Do NOT nest or restructure objects differently.

The output MUST follow this EXACT schema:

{
  "student_id": "string",
  "tallied_answers": {
    "A": number,
    "B": number,
    "C": number,
    "D": number
  },
  "dominant_cluster_analysis": {
    "type": "A | B | C | D",
    "count": number,
    "description": "string"
  },
  "final_outcome_recommendation": [
    {
      "type": "A | B | C | D | A/C | C/A | B/D",
      "field": "string (must be from the allowed list)",
      "description": "string"
    }
  ],
  "justification": "string"
}

If you cannot comply with the schema, return an empty JSON object {}.`,

      student_data: {
        student_id: "STU1001",
        student_grade: "12th",
        current_stream: "Science (PCMB)",
        answers,
      },
    };

    console.log("Payload to Gemini:", payload);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: JSON.stringify(payload, null, 2),
              },
            ],
          },
        ],
      });

      // SDK gives you a clean accessor
      const rawText = response.text;
      console.log("Raw Gemini response text:", rawText);

      // Gemini often returns JSON as text → hard parse
      let parsed;
      try {
        // 1️⃣ Normalize text (remove BOM / invisible chars)
        const cleaned = rawText
          .replace(/^\uFEFF/, "")                 // remove BOM
          .replace(/```json|```/g, "")             // remove markdown fences
          .trim();

        // 2️⃣ Extract first valid JSON object
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error("No JSON object found in Gemini response");
        }

        // 3️⃣ Parse safely
        parsed = JSON.parse(jsonMatch[0]);

      } catch (err) {
        console.error("❌ Invalid JSON from Gemini");
        console.error("Reason:", err.message);
        console.log("🔍 Raw Gemini text:", rawText);
        return;
      }
      console.log("✅ Parsed Gemini response:", parsed);
      setFinalResult(parsed);
      const interests = parsed.final_outcome_recommendation.map(
        (rec) => rec.field
      );
      const { error } = await supabase
        .from("interest")
        .insert([
          {
            student_id: parsed.student_id,
            interest: {
              recommended_fields: interests,
            },
          },
        ]);

      if (error) {
        console.error("❌ Supabase insert failed:", error.message);
        return;
      }
    } catch (err) {
      console.error("Gemini error:", err);
      setFinalText("Unable to generate career analysis at this time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================
     FINAL RESULT SCREEN
     ======================= */

  if (finalResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl w-full space-y-8">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700">
              Career Aptitude Analysis
            </h2>
            <p className="text-gray-500 mt-1">
              Student ID:{" "}
              <span className="font-semibold">
                {finalResult.student_id}
              </span>
            </p>
          </div>

          {/* Dominant Cluster */}
          <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded">
            <h3 className="font-semibold mb-1">Dominant Cluster</h3>
            <p className="text-gray-700">
              Cluster{" "}
              <span className="font-bold text-green-700 text-lg">
                {finalResult.dominant_cluster_analysis.type}
              </span>{" "}
              with{" "}
              <span className="font-bold">
                {finalResult.dominant_cluster_analysis.count}
              </span>{" "}
              responses
            </p>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Recommended Career Paths
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {finalResult.final_outcome_recommendation.map((rec, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-blue-700 capitalize">
                      {rec.field.replace(/_/g, " ")}
                    </h4>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {rec.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Justification */}
          <div className="bg-gray-100 p-5 rounded-lg">
            <h3 className="font-semibold mb-2">Why these were chosen</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {finalResult.justification}
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => navigate("/courses")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Courses
            </button>
          </div>

        </div>
      </div>
    );
  }



  /* =======================
     QUESTION SCREEN
     ======================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full">
        <h2 className="text-sm text-gray-500 mb-2">
          Question {index + 1} / {questions.length}
        </h2>
        <h1 className="text-xl font-bold mb-6">{questions[index].text}</h1>

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
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
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
                  className={`px-4 py-2 rounded text-white ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
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
