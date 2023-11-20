"use client";

import Navigation, { subTitle } from "@/components/atmos/Drawer";
import { Socket } from "socket.io-client";
import React, { useEffect } from "react";
import BasicCard, { cardColors } from "@/components/atmos/Card";
import LoginAvatar from "@/components/atmos/Avatar";
const sessions = require("@/src/lib/sessions");

const pageTitles1 = [
  { label: "Cybozu", url: "https://z0bq8.cybozu.com/o/", tab: true },
  { label: "ホームページ", url: "https://www.toasoft.co.jp/", tab: true },
  {
    label: "Mattermost",
    url: "https://devops.toasoft.co.jp:4343/landing#/",
    tab: true,
  },
];

const pageTitles2 = [
  {
    label: "奉行クラウド\n勤怠管理",
    url: "https://id.obc.jp/xj03vlx6mem1/",
    tab: true,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/people/%E6%9D%B1%E4%BA%9C%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE/100067750847874/",
    tab: true,
  },
  {
    label: "Knowledge",
    url: "http://knowledge.toasoft.co.jp:8080/knowledge/open.knowledge/list",
    tab: true,
  },
];

const pageTitles3 = [
  {
    label: "NextCloud",
    url: "https://nc.toasoft.co.jp/index.php/login",
    tab: true,
  },
];

let socket: Socket;

const WebLinkPage = () => {
  useEffect(() => {
    socket = sessions.connectSession();

    sessions.socketInitializer(socket);
  }, []);

  return (
    <div className="flex h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      {/* ↓2023-1019 デザイン変更 */}
      <div className="w-full mx-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        <div className="flex justify-between">
          <h1 className="text-4xl text-white font-bold">Webリンク</h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
        </div>
        <div className="flex flex-col space-y-14">
          <div className="flex space-x-14">
            {pageTitles1.map((page, index) => (
              <BasicCard
                key={index}
                title={page.label}
                cardColor={cardColors[0].cardBg}
                buttonColor={cardColors[0].buttonBg}
                shadowColor={cardColors[0].shadow}
                url={page.url}
                openNewTab={true}
                image="/group1.png"
              />
            ))}
          </div>
          <div className="flex space-x-14 whitespace-pre">
            {pageTitles2.map((page, index) => (
              <BasicCard
                key={index}
                title={page.label}
                cardColor={cardColors[1].cardBg}
                buttonColor={cardColors[1].buttonBg}
                shadowColor={cardColors[1].shadow}
                url={page.url}
                openNewTab={true}
                image="/group2.png"
              />
            ))}
          </div>
          <div className="flex space-x-14">
            {pageTitles3.map((page, index) => (
              <BasicCard
                key={index}
                title={page.label}
                cardColor={cardColors[2].cardBg}
                buttonColor={cardColors[2].buttonBg}
                shadowColor={cardColors[2].shadow}
                url={page.url}
                openNewTab={true}
                image="/group3.png"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebLinkPage;
