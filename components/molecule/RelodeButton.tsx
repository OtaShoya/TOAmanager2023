const ReloadButton = () => {
  return (
    <button
      className="text-blue-600 hover:text-sky-950"
      onClick={() => window.location.reload()}
    >
      再表示
    </button>
  );
};

export default ReloadButton;
