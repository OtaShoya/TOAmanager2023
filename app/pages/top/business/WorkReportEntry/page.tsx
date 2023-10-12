"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Drawer, IconButton, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import CachedIcon from "@mui/icons-material/Cached";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CreateIcon from "@mui/icons-material/Create";
import EditPage from "./component/Edit";

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

const label = "ビジネスサポート部 リレーショングループ";

const WorkReportEntry = () => {
  const router = useRouter();
  const [state, setState] = React.useState(false);

  const clickHandler = () => {
    router.push("/pages/top");
  };

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  return (
    <>
      <div>
        <Button variant="text" startIcon={<CachedIcon />}>
          再表示
        </Button>
        <Button variant="text" startIcon={<EditCalendarIcon />}>
          休日登録
        </Button>
        <Button variant="text" startIcon={<FileUploadIcon />}>
          週間報告書出力
        </Button>
        <Button
          variant="text"
          startIcon={<ExitToAppIcon />}
          onClick={clickHandler}
        >
          終了
        </Button>
      </div>
      <div className="flex items-end justify-center space-x-4 mt-8">
        <TextField label="社員番号" />
        <div className="flex flex-col">
          <label>{label}</label>
          <TextField />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <TableContainer component={Paper} className="w-11/12 ">
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
    </>
  );
};

export default WorkReportEntry;
