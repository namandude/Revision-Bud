import ReactMarkdown from "react-markdown";

const ChatSection = ({
  chatHistory,
  question,
  setQuestion,
  onAsk,
  loading,
}) => {
  return (
    <section className="bg-gray-700 p-6 rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-4">💬 Q&A Chatbot</h2>

      <div className="space-y-3 max-h-64 overflow-y-auto bg-gray-900 p-4 rounded-lg">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "text-right" : ""}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800"
          placeholder="Ask a question..."
        />
        <button
          onClick={onAsk}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 rounded-lg font-bold"
        >
          Ask
        </button>
      </div>
    </section>
  );
};

export default ChatSection;
