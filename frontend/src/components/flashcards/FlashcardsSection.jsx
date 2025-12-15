import { useState } from "react";

const FlashcardsSection = ({ flashcards = [], onGenerate, loading }) => {
  const [revealedCards, setRevealedCards] = useState({});

  const toggleAnswer = (index) => {
    setRevealedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="bg-gray-700 p-6 rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-4">🎴 Flashcards</h2>

      <button
        onClick={onGenerate}
        disabled={loading}
        className="px-4 py-2 bg-yellow-600 rounded-lg font-bold disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>

      <div className="space-y-4 mt-4">
        {flashcards.length === 0 && (
          <p className="text-gray-300">No flashcards yet</p>
        )}

        {flashcards.map((card, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg">
            <p className="font-semibold">{card.question}</p>

            {revealedCards[i] && (
              <p className="mt-2 text-gray-300">{card.answer}</p>
            )}

            <button
              onClick={() => toggleAnswer(i)}
              className="mt-2 text-yellow-400 underline"
            >
              {revealedCards[i] ? "Hide" : "Show"} Answer
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashcardsSection;
