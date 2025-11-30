import { useState } from "react"; 
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Download } from "lucide-react";

const AiFitness = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDownloadPlan = () => {
    if (!response || response.startsWith("AI Server Error")) {
      toast.error("No valid plan to download.");
      return;
    }
    let plainText = response
      .replace(/^[#]+\s*/gm, "")
      .replace(/\*\*+/g, "")
      .replace(/^\s*\*\s*/gm, " - ")
      .replace(
        /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ""
      );

    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `FitnessPlan_Clean_${new Date().toISOString().slice(0, 10)}.txt`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Plan downloaded!");
  };

  const getAIPlan = async () => {
    if (!height || !weight || !age || !goal) {
      toast.error("Please fill in all fields (height, weight, age, and goal).");
      return;
    }

    setLoading(true);
    setResponse("");
    setShowModal(true);

    try {
      const prompt = `
Height: ${height} cm, Weight: ${weight} kg, Age: ${age}, Goal: ${goal}.

**TASK**: Generate a concise and fully detailed fitness plan using Markdown. **STRICTLY USE ONLY '##' FOR HEADINGS** (avoid '###', '####' etc.). Fill in all calculations and details. Do not use generic placeholders.
      `;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
          import.meta.env.VITE_AI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) text = text.replace(/^(##\s*)\*\*([^\*]+)\*\*$/gm, "$1$2");

      setResponse(text || "⚠️ No content found in AI response.");
    } catch (err) {
      setResponse(`AI Server Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="mt-16 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          AI Fitness Coach
        </h1>

        <div className="flex flex-col gap-4">
          <input
            disabled={loading}
            type="number"
            min={0}
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            disabled={loading}
            type="number"
            min={0}
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            disabled={loading}
            type="number"
            min={0}
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            disabled={loading}
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
      </div>

      {/* Response Modal / Box */}
      {showModal && response && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/40 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl p-4 sm:p-6 shadow-lg max-h-[85vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
              <h2 className="text-xl font-bold text-yellow-700">
                ✅ Your Fitness Plan
              </h2>
              <button
                onClick={handleDownloadPlan}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                disabled={response.startsWith("AI Server Error")}
              >
                <Download size={16} /> Download Text
              </button>
            </div>
            <div className="text-gray-800 leading-relaxed text-sm p-2 sm:p-4 overflow-y-auto max-h-[70vh]">
              <ReactMarkdown>{response.replace(/\*\*\*/g, "**")}</ReactMarkdown>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiFitness;
