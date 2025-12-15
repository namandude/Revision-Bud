const useClipboard = (showMessage) => {
  return (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showMessage("Copied!", "success"))
      .catch(() => showMessage("Copy failed", "error"));
  };
};

export default useClipboard;
