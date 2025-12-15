const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const typeClasses = {
    error: "bg-red-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg text-white relative ${typeClasses[type]}`}>
        <p className="font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
