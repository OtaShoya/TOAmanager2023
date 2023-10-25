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
import EditPage from "./component/Edit";
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
  "border rounded-full hover:bg-slate-100 bg-white text-[#556593] w-40 h-full";

const WorkReportEntry = () => {
  const [state, setState] = React.useState(false);
  const [date, setDate] = React.useState("");

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const entryDate = () => {};

  const reportOutput = () => {};

  return (
    <div className="flex flex-row h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">作業報告登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        {/* ↓年月日選択と各ボタン */}
        <div className="flex flex-row justify-between">
          <input
            type="month"
            value={date}
            className="text-lg border rounded-lg h-16 p-5"
            onChange={(e) => changeHandler(e)}
          />
          <div className="space-x-4">
            <ReloadButton />
            <button className={buttonDesign} onClick={entryDate}>
              休日登録
            </button>
            <button className={buttonDesign} onClick={reportOutput}>
              週間報告書登録
            </button>
          </div>
        </div>
        {/* ↓テーブル */}
        <div className="flex justify-center">
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
        </div>
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <EditPage />
        </Drawer>
      </div>
    </div>
  );
};

export default WorkReportEntry;
