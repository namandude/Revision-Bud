import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SummarySection = ({ summary, onCopy }) => {
  return (
    <section className="bg-gray-700 p-6 rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-2">🧠 AI Summary</h2>

      <button
        onClick={() => onCopy(summary)}
        className="mb-2 px-4 py-2 bg-gray-600 rounded-lg"
      >
        Copy
      </button>

      <div className="bg-gray-900 p-4 rounded-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {summary}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default SummarySection;
