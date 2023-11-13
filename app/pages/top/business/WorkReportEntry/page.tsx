"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Drawer, IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import EditPage from "./Edit";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import io, { Socket } from "socket.io-client";
import ReloadButton from "@/components/molecule/RelodeButton";

var socket: Socket;

const columns = [
  "",
  "日付",
  "曜日",
  "勤務形態",
  "出社時刻",
  "退社時刻",
  "控除時刻",
  "勤務時刻",
  "残業時刻",
  "残業時刻（深夜）",
  "休出時刻",
  "作業時間合計",
  "メモ",
];

const buttonDesign =
  "border rounded-full hover:bg-slate-100 bg-white text-[#556593] w-40 h-full inline-flex items-center justify-center";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

const WorkReportEntry = () => {
  const [state, setState] = React.useState(false);
  const [date, setDate] = React.useState(`${year}-${month}`);

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    console.log(e.target.value);
  };

  const entryDate = () => {};

  const reportOutput = () => {};

  return (
    <div className="flex h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex justify-between">
          <h1 className="text-4xl text-white font-bold">作業報告登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        {/* ↓年月日選択と各ボタン */}
        <div className="flex justify-between">
          <input
            type="month"
            value={date}
            className="text-lg border rounded-lg h-16 p-5"
            onChange={(e) => changeHandler(e)}
          />
          <div className="space-x-4">
            <ReloadButton />
            <button className={buttonDesign} onClick={entryDate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              休日登録
            </button>
            <button className={buttonDesign} onClick={reportOutput}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                />
              </svg>
              週間報告書出力
            </button>
          </div>
        </div>
        {/* ↓テーブル */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {columns.map((column, i) => (
                  <TableCell key={i}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <IconButton onClick={() => toggleDrawer(true)}>
                    <CreateIcon />
                  </IconButton>
                </TableCell>
                <TableCell>2023/10/04</TableCell>
                <TableCell>水</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <EditPage />
        </Drawer>
      </div>
    </div>
  );
};

export default WorkReportEntry;
