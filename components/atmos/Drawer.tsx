"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";

type PropType = {
  subTitles: SubTitleType[];
  socket: Socket;
};

type SubTitleType = {
  tabTitle: string;
  url: string;
};

export const subTitle = [
  { tabTitle: "通常業務", url: "/pages/top" },
  { tabTitle: "出張", url: "/pages/top/BusinessTrip" },
  { tabTitle: "各種フォルダ", url: "/pages/top/Folder" },
  { tabTitle: "WEBリンク", url: "/pages/top/WebLink" },
  { tabTitle: "各種帳票", url: "/pages/top/Ledger" },
  { tabTitle: "マスタ保守", url: "/pages/top/master" },
];

const Navigation = ({ subTitles, socket }: PropType) => {
  const router = useRouter();

  const clickHandler = (url: string) => {
    router.push(url);
  };

  const logout = () => {
    socket.emit("logout", localStorage.getItem("sessionID"));
    localStorage.removeItem("sessionID");
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-between rounded-lg bg-white/[.07] w-60 h-full relative">
      <h1 className="text-white text-2xl text-center pt-11">TOAmanager</h1>
      <ul className="grid grid-cols-1 gap-y-11">
        {subTitles.map((subTitle, index) => (
          <button key={index} onClick={() => clickHandler(subTitle.url)}>
            <li className="text-white text-xl hover:text-indigo-400">
              {subTitle.tabTitle}
            </li>
          </button>
        ))}
      </ul>
      <button onClick={logout} className="pb-11 text-white">
        終了
      </button>
    </div>
  );
};

export default Navigation;
