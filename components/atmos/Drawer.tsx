"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

type PropType = {
  subTitles: SubTitleType[];
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

const Navigation = ({ subTitles }: PropType) => {
  const router = useRouter();
  const clickHandler = (url: string) => {
    location.href = url;
  };

  const returnTop = () => {
    router.push("/pages/top");
  };

  return (
    <div className="flex flex-col justify-items-stretch rounded-lg bg-white/[.07] w-60 h-full">
      <button
        className="text-white text-2xl text-center pt-11"
        onClick={returnTop}
      >
        TOAmanager
      </button>
      <div className="h-full flex items-center justify-center">
        <ul className="grid grid-cols-1 gap-y-11">
          {subTitles.map((subTitle, index) => (
            <button key={index} onClick={() => clickHandler(subTitle.url)}>
              <li className="text-white text-xl hover:text-indigo-400 ">
                {subTitle.tabTitle}
              </li>
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
