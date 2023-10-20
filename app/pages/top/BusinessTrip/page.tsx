"use client";

import Navigation, { subTitle } from "@/components/atmos/Drawer";
import { Socket } from "socket.io-client";
import React, { useEffect } from "react";
import BasicCard, { cardColors } from "@/components/atmos/Card";
const sessions = require("@/src/lib/sessions");

const pageTitles1 = [
  { label: "出張登録", url: "", tab: false },
  { label: "出張申請", url: "", tab: false },
  { label: "出張報告", url: "/pages/top/master/syaintouroku", tab: false },
  { label: "出張申請申請", url: "", tab: false },
  { label: "出張報告承認", url: "", tab: false },
];

let socket: Socket;

const BusinessTripPage = () => {
  useEffect(() => {
    socket = sessions.connectSession();

    sessions.socketInitializer(socket);
  }, []);

  return (
    <div className="flex flex-row h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} socket={socket} />
      {/* ↓2023-1019 デザイン変更 */}
      <div className="w-full mx-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        <h1 className="text-4xl text-white font-bold">出張</h1>
        <div className="flex flex-col space-y-14">
          <div className="flex flex-row space-x-14">
            {pageTitles1.map((page, index) => (
              <BasicCard
                key={index}
                title={page.label}
                cardColor={cardColors[0].cardBg}
                buttonColor={cardColors[0].buttonBg}
                shadowColor={cardColors[0].shadow}
                url={page.url}
                openNewTab={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTripPage;
