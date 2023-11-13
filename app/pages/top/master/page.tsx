"use client";

import Navigation, { subTitle } from "@/components/atmos/Drawer";
import { Socket } from "socket.io-client";
import React, { useEffect } from "react";
import BasicCard, { cardColors } from "@/components/atmos/Card";
import LoginAvatar from "@/components/atmos/Avatar";
const sessions = require("@/src/lib/sessions");

const pageTitles1 = [
  { label: "製品登録", url: "", tab: false },
  { label: "部署登録", url: "", tab: false },
  { label: "社員登録", url: "/pages/top/master/syaintouroku", tab: false },
];

const pageTitles2 = [
  { label: "業種登録", url: "", tab: false },
  { label: "カレンダー登録", url: "", tab: false },
  { label: "メール設定", url: "", tab: false },
];

let socket: Socket;

const MasterPage = () => {
  useEffect(() => {
    socket = sessions.connectSession();

    sessions.socketInitializer(socket);
  }, []);

  return (
    <div className="flex h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      {/* ↓2023-1019 デザイン変更 */}
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        <div className="flex justify-between">
          <h1 className="text-4xl text-white font-bold">マスタ保守</h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        <div className="grid grid-cols-1 gap-14">
          <div className="flex space-x-14">
            {pageTitles1.map((page, index) => (
              <BasicCard
                key={index}
                title={page.label}
                cardColor={cardColors[0].cardBg}
                buttonColor={cardColors[0].buttonBg}
                shadowColor={cardColors[0].shadow}
                url={page.url}
                openNewTab={false}
                image="/group1.png"
              />
            ))}
          </div>
          <div className="flex space-x-14">
            {pageTitles2.map((page, index) => (
              <BasicCard
                key={index}
                title={page.label}
                cardColor={cardColors[1].cardBg}
                buttonColor={cardColors[1].buttonBg}
                shadowColor={cardColors[1].shadow}
                url={page.url}
                openNewTab={false}
                image="/group2.png"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterPage;
