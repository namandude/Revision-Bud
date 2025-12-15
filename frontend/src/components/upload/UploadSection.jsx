// const UploadSection = ({ file, setFile, loading, onUpload }) => {
//   return (
//     <div className="bg-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-3xl text-center">
//       <h1 className="text-4xl font-bold mb-4">🧠 AI Lecture Summary</h1>

//       <div className="border-2 border-dashed border-purple-500 rounded-xl p-6 relative">
//         <input
//           type="file"
//           accept="audio/*"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="absolute inset-0 opacity-0 cursor-pointer"
//         />
//         {file ? `Selected: ${file.name}` : "Click or Drag Audio File"}
//       </div>

//       <button
//         onClick={onUpload}
//         disabled={loading || !file}
//         className="mt-6 px-8 py-4 bg-purple-600 rounded-full font-bold disabled:opacity-50"
//       >
//         {loading ? "Processing..." : "Upload & Analyze"}
//       </button>
//     </div>
//   );
// };

// export default UploadSection;
const UploadSection = ({
  file,
  setFile,
  examName,
  setExamName,
  questionPdf,
  setQuestionPdf,
  loading,
  onUpload,
}) => {
  return (
    <div className="bg-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🧠 AI Exam Generator
      </h1>

      {/* Exam Name */}
      <input
        type="text"
        placeholder="Exam Name (e.g. JEE Physics)"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
        className="w-full p-3 mb-4 rounded-xl bg-gray-900 border border-gray-700"
      />

      {/* Audio Upload */}
      <div className="border-2 border-dashed border-purple-500 rounded-xl p-4 mb-4 text-center relative">
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {file ? file.name : "Upload Audio / Video"}
      </div>

      {/* Question Bank PDF */}
      <div className="border-2 border-dashed border-blue-500 rounded-xl p-4 text-center relative">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setQuestionPdf(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {questionPdf ? questionPdf.name : "Upload Question Bank PDF"}
      </div>

      <button
        onClick={onUpload}
        disabled={loading || !file || !examName}
        className="w-full mt-6 py-3 bg-purple-600 rounded-full font-bold"
      >
        {loading ? "Processing..." : "Create Exam Workspace"}
      </button>
    </div>
  );
};

export default UploadSection;
