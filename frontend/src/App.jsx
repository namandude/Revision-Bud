import { useState } from "react";
import api from "./api/api";

import MessageBox from "./components/common/MessageBox";
import UploadSection from "./components/upload/UploadSection";
import TranscriptSection from "./components/transcript/TranscriptSection";
import SummarySection from "./components/summary/SummarySection";
import ChatSection from "./components/chat/ChatSection";
import FlashcardsSection from "./components/flashcards/FlashcardsSection";

import useClipboard from "./hooks/useClipboard";

const App = () => {
  // ================= UPLOAD =================
  const [file, setFile] = useState(null);
  const [examName, setExamName] = useState("");
  const [questionPdf, setQuestionPdf] = useState(null);

  // ================= EXAM IDS =================
  const [transcriptExamId, setTranscriptExamId] = useState("");
  const [summaryExamId, setSummaryExamId] = useState("");
  const [flashcardsExamId, setFlashcardsExamId] = useState("");
  const [chatExamId, setChatExamId] = useState("");

  // ================= DATA =================
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");

  // ================= LOADING =================
  const [uploadLoading, setUploadLoading] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [flashLoading, setFlashLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // ================= UI =================
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };
  const closeMessage = () => setMessage(null);
  const copy = useClipboard(showMessage);

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!file || !examName) {
      showMessage("Audio file and exam name required", "error");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("exam_name", examName);
    if (questionPdf) formData.append("question_pdf", questionPdf);

    try {
      const res = await api.post("/upload", formData);

      showMessage(
        `Upload successful! Save Exam ID:\n${res.data.exam_id}`,
        "success"
      );

      // auto-fill all exam IDs
      setTranscriptExamId(res.data.exam_id);
      setSummaryExamId(res.data.exam_id);
      setFlashcardsExamId(res.data.exam_id);
      setChatExamId(res.data.exam_id);

      setTranscript(res.data.transcript || "");
      setSummary("");
      setFlashcards([]);
      setChatHistory([]);
    } catch {
      showMessage("Upload failed", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // ================= FETCH TRANSCRIPT =================
  const fetchTranscript = async () => {
    if (!transcriptExamId) return;

    setTranscriptLoading(true);
    try {
      const res = await api.get(`/exam/${transcriptExamId}`);
      setTranscript(res.data.transcript || "");
      showMessage("Transcript loaded", "success");
    } catch {
      showMessage("Invalid Exam ID for Transcript", "error");
      setTranscript("");
    } finally {
      setTranscriptLoading(false);
    }
  };

  // ================= SUMMARY =================
  const fetchSummary = async () => {
    if (!summaryExamId) return;

    setSummaryLoading(true);
    try {
      const res = await api.post("/generate-summary", {
        exam_id: summaryExamId,
      });
      setSummary(res.data.summary || "");
      showMessage("Summary generated", "success");
    } catch {
      showMessage("Failed to generate summary", "error");
    } finally {
      setSummaryLoading(false);
    }
  };

  // ================= FLASHCARDS =================
  const handleFlashcards = async () => {
    if (!flashcardsExamId) return;

    setFlashLoading(true);
    try {
      const res = await api.post("/generate-flashcards", {
        exam_id: flashcardsExamId,
      });
      setFlashcards(res.data.flashcards || []);
      showMessage("Flashcards generated", "success");
    } catch {
      showMessage("Failed to generate flashcards", "error");
    } finally {
      setFlashLoading(false);
    }
  };

  // ================= CHAT =================
  const handleAsk = async () => {
    if (!chatExamId || !question.trim()) return;

    setChatLoading(true);
    try {
      const res = await api.post("/ask", {
        exam_id: chatExamId,
        question,
      });

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: res.data.answer },
      ]);
      setQuestion("");
    } catch {
      showMessage("Chat failed", "error");
    } finally {
      setChatLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <MessageBox message={message} type={messageType} onClose={closeMessage} />

      {/* UPLOAD */}
      <UploadSection
        file={file}
        setFile={setFile}
        examName={examName}
        setExamName={setExamName}
        questionPdf={questionPdf}
        setQuestionPdf={setQuestionPdf}
        loading={uploadLoading}
        onUpload={handleUpload}
      />

      {/* TRANSCRIPT */}
      <div className="bg-gray-800 p-4 rounded mt-6">
        <h3 className="font-bold mb-2">Transcript</h3>
        <input
          className="w-full p-2 rounded text-black"
          placeholder="Enter Exam ID for Transcript"
          value={transcriptExamId}
          onChange={(e) => setTranscriptExamId(e.target.value)}
        />
        <button
          onClick={fetchTranscript}
          className="mt-2 px-4 py-2 bg-blue-600 rounded"
        >
          Load Transcript
        </button>
      </div>

      {transcript && (
        <TranscriptSection
          transcript={transcript}
          setTranscript={setTranscript}
          onCopy={copy}
        />
      )}

      {/* SUMMARY */}
      <div className="bg-gray-800 p-4 rounded mt-6">
        <h3 className="font-bold mb-2">Summary</h3>
        <input
          className="w-full p-2 rounded text-black"
          placeholder="Enter Exam ID for Summary"
          value={summaryExamId}
          onChange={(e) => setSummaryExamId(e.target.value)}
        />
        <button
          onClick={fetchSummary}
          className="mt-2 px-4 py-2 bg-green-600 rounded"
        >
          Generate Summary
        </button>
      </div>

      {summary && <SummarySection summary={summary} onCopy={copy} />}

     {/* FLASHCARDS */}
<div className="bg-gray-800 p-4 rounded mt-6">
  <h3 className="font-bold mb-2">Flashcards</h3>

  <input
    className="w-full p-2 rounded text-black"
    placeholder="Enter Exam ID for Flashcards"
    value={flashcardsExamId}
    onChange={(e) => setFlashcardsExamId(e.target.value)}
  />

  <button
    onClick={handleFlashcards}
    disabled={flashLoading}
    className="mt-2 px-4 py-2 bg-yellow-600 rounded"
  >
    {flashLoading ? "Generating..." : "Generate Flashcards"}
  </button>
</div>

{flashcards.length > 0 && (
  <FlashcardsSection
    flashcards={flashcards}
    loading={flashLoading}
  />
)}


      {/* CHAT */}
     
<div className="bg-gray-800 p-4 rounded mt-6">
  <h3 className="font-bold mb-2">Q&A Chat</h3>

  <input
    className="w-full p-2 rounded text-black"
    placeholder="Enter Exam ID for Chat"
    value={chatExamId}
    onChange={(e) => setChatExamId(e.target.value)}
  />
</div>

<ChatSection
  chatHistory={chatHistory}
  question={question}
  setQuestion={setQuestion}
  onAsk={handleAsk}
  loading={chatLoading}
/>

    </div>
  );
};

export default App;

