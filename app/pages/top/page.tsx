"use client";
import Navigation from "@/components/atmos/Drawer";
import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export const title = "東亜ソフト業務管理ソフト";

export const subTitle = [
  { tabTitle: "通常業務", url: "" },
  { tabTitle: "出張", url: "" },
  { tabTitle: "各種フォルダ", url: "" },
  { tabTitle: "WEBリンク", url: "" },
  { tabTitle: "各種帳票", url: "" },
  { tabTitle: "マスタ保守", url: "/pages/top/master" },
];

var socket: Socket;
const sessions = require("../../../src/lib/sessions");

const pageTitles = [
  { label: "作業報告登録", url: "/pages/top/business/WorkReportEntry" },
  { label: "作業報告出力", url: "" },
  { label: "プロジェクト報告書登録", url: "" },
  { label: "プロジェクト報告書出力", url: "" },
  { label: "プロジェクト登録", url: "" },
  { label: "引合物件一覧表出力", url: "" },
  { label: "顧客登録", url: "" },
  { label: "サポート一覧出力", url: "" },
];

const TopPage = () => {
  const [data, setData]: any = useState([]);
  // const router = useRouter();
  const router = useRouter();

  const clickHandler = (url: string) => {
    router.push(url);
  };

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
      <div className="h-screen">
        {/* タイトルスペース */}
        <div className="h-40 border border-indigo-600"></div>
        <div className="flex flex-row h-full">
          <div className="w-72">
            <Navigation
              title={title}
              subTitles={subTitle}
              label="ログオフ"
              socket={socket}
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="grid gap-4 grid-cols-3">
              {pageTitles.map((page, index) => (
                <Button
                  variant="outlined"
                  onClick={() => clickHandler(page.url)}
                  key={index}
                >
                  {page.label}
                </Button>
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
