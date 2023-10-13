"use client";

import { useRouter } from "next/navigation";

const ExitButton = () => {
  const router = useRouter();
  const clickHandler = () => {
    router.push("/pages/top");
  };

  return (
    <button className="text-blue-600 hover:text-sky-950" onClick={clickHandler}>
      終了
    </button>
  );
};

export default ExitButton;
