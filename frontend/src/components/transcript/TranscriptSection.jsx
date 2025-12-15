const TranscriptSection = ({ transcript, setTranscript, onCopy }) => {
  return (
    <section className="bg-gray-700 p-6 rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-2">📝 Transcript</h2>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full h-40 p-4 bg-gray-900 rounded-lg"
      />

      <button
        onClick={() => onCopy(transcript)}
        className="mt-2 px-4 py-2 bg-gray-600 rounded-lg"
      >
        Copy
      </button>
    </section>
  );
};

export default TranscriptSection;
