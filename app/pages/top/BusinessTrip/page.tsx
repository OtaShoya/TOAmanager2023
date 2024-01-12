"use client";

import Navigation from "@/components/atmos/Sidebar";
import { Socket } from "socket.io-client";
import React, { useEffect } from "react";
import BasicCard, { cardColors } from "@/components/atmos/Card";
import LoginAvatar from "@/components/atmos/Avatar";
const sessions = require("@/src/lib/sessions");

const pageTitles1 = [
  { label: "出張登録", url: "", tab: false },
  { label: "出張申請", url: "", tab: false },
  { label: "出張報告", url: "/pages/top/master/syaintouroku", tab: false },
];

const pageTitles2 = [
  { label: "出張申請承認", url: "", tab: false },
  { label: "出張報告承認", url: "", tab: false },
];

let socket: Socket;

const BusinessTripPage = () => {
  useEffect(() => {
    socket = sessions.connectSession();
    sessions.socketInitializer(socket);
  }, []);

  return (
    <div className="page-base">
      <Navigation />
      {/* ↓2023-1019 デザイン変更 */}
      <div className="page-main_area">
        <div className="flex justify-between">
          <h1 className="page-title">出張</h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
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

export default BusinessTripPage;
