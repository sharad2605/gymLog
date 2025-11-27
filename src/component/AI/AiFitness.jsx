import { useState } from "react"; 
import ReactMarkdown from "react-markdown";
import toast from 'react-hot-toast';
import { Download } from "lucide-react";

const AiFitness = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // 💡 UPDATED FUNCTION: Markdown symbols ko saaf karke TXT download karega
  const handleDownloadPlan = () => {
    if (!response || response.startsWith('❌ AI Server Error')) {
      toast.error("No valid plan to download.");
      return;
    }

    let plainText = response;

    // 1. Headings (##) aur unke aas paas ke spaces ko remove karna
    // Example: "## 🎯 Fitness Summary" -> "Fitness Summary"
    plainText = plainText.replace(/^[#]+\s*/gm, ''); 

    // 2. Bold markers (**) ko remove karna
    // Example: "**BMI**" -> "BMI"
    plainText = plainText.replace(/\*\*+/g, ''); 

    // 3. List markers (* ) ko ek simple ' - ' se replace karna
    // Example: "* BMI: value" -> " - BMI: value"
    plainText = plainText.replace(/^\s*\*\s*/gm, ' - ');
    
    // 4. Emojis ko remove karna, taaki TXT file aur clean dikhe (optional)
    plainText = plainText.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');


    // Download the cleaned text
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FitnessPlan_Clean_${new Date().toISOString().slice(0, 10)}.txt`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Plan downloaded!");
  };


  const getAIPlan = async () => {
    // ... (Input checks and loading setup)
    if (!height || !weight || !age || !goal) {
      toast.error("⚠️ Please fill in all fields (height, weight, age, and goal).");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const prompt = `
      Height: ${height} cm, Weight: ${weight} kg, Age: ${age}, Goal: ${goal}.

      **TASK**: Generate a concise and fully detailed fitness plan using Markdown. **STRICTLY USE ONLY '##' FOR HEADINGS** (avoid '###', '####' etc.). Fill in all calculations and details. Do not use generic placeholders.

      **FORMAT**:
      ## 🎯 Fitness Summary
      * **BMI**: [Calculate and state the BMI value and category].
      * **Goal Calories**: [Estimate TDEE and recommend a specific calorie goal/range].

      ## 🏋️ 3-Day Workout Plan
      * **Day 1 (Push)**: [Exercise 1 name, Sets x Reps], [Exercise 2 name, Sets x Reps], [Exercise 3 name, Sets x Reps]
      * **Day 2 (Pull)**: [Exercise 1 name, Sets x Reps], [Exercise 2 name, Sets x Reps], [Exercise 3 name, Sets x Reps]
      * **Day 3 (Legs)**: [Exercise 1 name, Sets x Reps], [Exercise 2 name, Sets x Reps], [Exercise 3 name, Sets x Reps]

      ## 🍎 Diet Focus
      * [Key Diet Tip 1 with detail]
      * [Key Diet Tip 2 with detail]
      * [Key Diet Tip 3 with detail]
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

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      // This line is now only for UI display consistency, not strictly needed for download
      if (text) {
          text = text.replace(/^(##\s*)\*\*([^\*]+)\*\*$/gm, '$1$2');
      }

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
        <div className="flex flex-col gap-4">
          <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
            <input type="text" placeholder="Goal (Lose 5kg, Build Muscle...)" value={goal} onChange={(e) => setGoal(e.target.value)} className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
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
    <div className="flex justify-between items-center mb-3 pb-2 border-b">
        <h2 className="text-xl font-bold text-yellow-700">
          ✅ Your Fitness Plan
        </h2>
        {/* DOWNLOAD BUTTON */}
        <button
          onClick={handleDownloadPlan}
          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
          disabled={response.startsWith('❌')}
        >
          <Download size={16} /> Download Text
        </button>
    </div>
    
    {/* UI DISPLAY: Simple scrolling box, font size is 'text-sm' */}
    <div className="text-gray-800 leading-relaxed text-sm max-h-96 overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg"> 
        <ReactMarkdown>{response.replace(/\*\*\*/g, '**')}</ReactMarkdown>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default AiFitness;