import { useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from 'react-hot-toast';


const AiFitness = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIPlan = async () => {
    if (!height || !weight || !age || !goal) {
      toast.error("⚠️ Please fill in all fields (height, weight, age, and goal).");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const prompt = `
      Height: ${height} cm, Weight: ${weight} kg, Age: ${age}, Goal: ${goal}

      TASK: Generate a concise fitness plan using Markdown. Strictly limit the response size.

      FORMAT:
      ## 🎯 Fitness Summary
      * **BMI**: [BMI]
      * **Calories**: [Goal Calories]

      ## 🏋️ 3-Day Workout Plan
      * **Day 1 (Push)**: [3 exercises]
      * **Day 2 (Pull)**: [3 exercises]
      * **Day 3 (Legs)**: [3 exercises]

      ## 🍎 Diet Focus
      * [Point 1]
      * [Point 2]
      * [Point 3]
      `;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
          import.meta.env.VITE_AI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );
      <ReactMarkdown>{response.replace(/\*\*\*/g, '**')}</ReactMarkdown>
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      setResponse(text || "⚠️ No content found in AI response.");
    } catch (err) {
      setResponse(`❌ AI Server Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="mt-16 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">

        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          AI Fitness Coach <span className="text-yellow-500">🏋️</span>
        </h1>

        {/* INPUT CARD */}
        <div className="flex flex-col gap-4">

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <input
            type="text"
            placeholder="Goal (Lose 5kg, Build Muscle...)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <button
            onClick={getAIPlan}
            disabled={loading}
            className={`p-3 font-bold rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </div>

        {/* RESPONSE BOX */}
        {response && (
  <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-yellow-500 shadow-md">
    <h2 className="text-xl font-bold text-yellow-700 mb-3 pb-2 border-b">
      ✅ Your Fitness Plan
    </h2>
    <div className="text-gray-800 leading-relaxed text-sm max-h-64 overflow-y-auto">
      <ReactMarkdown>{response.replace(/\*\*\*/g, '**')}</ReactMarkdown>
    </div>
    
  </div>
)}
      </div>
    </div>
  );
};

export default AiFitness;
