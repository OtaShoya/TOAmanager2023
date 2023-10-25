const ReloadButton = () => {
  return (
    <button
      className="border rounded-full hover:bg-slate-100 bg-white text-[#556593] w-40 h-full"
      onClick={() => window.location.reload()}
    >
      再表示
    </button>
  );
};

export default ReloadButton;
