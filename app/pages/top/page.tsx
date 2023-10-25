"use client";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import BasicCard, { cardColors } from "@/components/atmos/Card";
import LoginAvatar from "@/components/atmos/Avatar";
var socket: Socket;
const sessions = require("@/src/lib/sessions");

const TopPage = () => {
  const [data, setData]: any = useState([]);

  const pageTitles1 = [
    {
      label: "作業報告登録",
      url: "/pages/top/business/WorkReportEntry",
      tab: false,
    },
    {
      label: "作業報告出力",
      url: "/pages/top/business/WorkReportOutput",
      tab: false,
    },
  ];

  const pageTitles2 = [
    {
      label: "プロジェクト\n報告書登録",
      url: "/pages/top/business/ProjectReportEntry",
      tab: false,
    },
    {
      label: "プロジェクト\n報告書出力",
      url: "/pages/top/business/ProjectReportOutput",
      tab: false,
    },
    {
      label: "プロジェクト\n登録",
      url: "/pages/top/business/ProjectEntry",
      tab: false,
    },
  ];

  const pageTitles3 = [
    { label: "引合物件一覧表\n出力", url: "", tab: false },
    { label: "顧客登録", url: "/pages/top/business/ClientEntry", tab: false },
    { label: "サポート一覧\n出力", url: "", tab: false },
  ];

  useEffect(() => {
    socket = sessions.connectSession();
    sessions.socketInitializer(socket);

    socket.on("session_found", (msg: any) => {
      if (msg === true) {
        setData({ socket: socket, session_found: msg });
      } else {
        location.href = "/pages/login";
        // router.push("/pages/login")
      }
    });
  }, []);

  if (data?.session_found === true) {
    return (
      <div className="flex flex-row h-screen p-10 bg-[#556593]">
        <Navigation subTitles={subTitle} />
        {/* ↓2023-1019 デザイン変更 */}
        <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
          <div className="flex flex-row justify-between">
            <h1 className="text-4xl text-white font-bold">通常業務</h1>
            <LoginAvatar
              imgLabel=""
              imgUrl=""
              loginId="adachi"
              socket={socket}
            />
          </div>
          <div className="grid grid-cols-1 gap-14">
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
            <div className="flex flex-row space-x-14 whitespace-pre">
              {pageTitles2.map((page, index) => (
                <BasicCard
                  key={index}
                  title={page.label}
                  cardColor={cardColors[1].cardBg}
                  buttonColor={cardColors[1].buttonBg}
                  shadowColor={cardColors[1].shadow}
                  url={page.url}
                  openNewTab={false}
                />
              ))}
            </div>
            <div className="flex flex-row space-x-14 whitespace-pre">
              {pageTitles3.map((page, index) => (
                <BasicCard
                  key={index}
                  title={page.label}
                  cardColor={cardColors[2].cardBg}
                  buttonColor={cardColors[2].buttonBg}
                  shadowColor={cardColors[2].shadow}
                  url={page.url}
                  openNewTab={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

export default TopPage;
