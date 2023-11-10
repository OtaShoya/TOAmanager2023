// ↓ 2023-1013 new page

"use client";

import ExitButton from "@/components/molecule/ExitButton";
import ReloadButton from "@/components/molecule/RelodeButton";
import * as React from "react";
import {
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import EditPage from "./Edit";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import { Socket } from "socket.io-client";
import CheckBox from "@/components/atmos/CheckBox";
let socket: Socket;
const columns = ["", "プロジェクト", "報告日"];

const datas = [{ projectName: "", ReportDate: "" }];
const formDesign = "border rounded-md p-5";

const ProjectReportEntryPage = () => {
  const [state, setState] = React.useState(false);
  const [condition1, setCondition1] = React.useState("A");
  const [condition2, setCondition2] = React.useState("");
  const [condition3, setCondition3] = React.useState("");

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  const changeHandler = () => {
    if (condition1 === "A") {
      setCondition1("B");
    } else {
      setCondition1("A");
    }
  };

  React.useEffect(() => {
    console.log(`${condition1} + ${condition2} + ${condition3}`);
  }, [condition1, condition2, condition3]);

  return (
    <div className="flex h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full mx-5 p-12 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex justify-between">
          <h1 className="text-4xl text-white font-bold">
            プロジェクト報告書登録
          </h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        <div className="flex flex-col justify-center max-w-[1920]">
          {/* ↓フィルター */}
          <div className="mt-10">
            <div className="flex items-center">
              <CheckBox label="終了分を除く" onchange={changeHandler} />
            </div>
            <div className="flex space-x-3">
              <input
                className={formDesign}
                placeholder={columns[1]}
                onChange={(e) => setCondition2(e.target.value)}
              />
              <input
                className={formDesign}
                placeholder={columns[2]}
                onChange={(e) => setCondition3(e.target.value)}
              />
            </div>
          </div>
          {/* ↓テーブル */}
          <div className="mt-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1050 }}>
                <TableHead>
                  <TableRow>
                    {columns.map((column, i) => (
                      <TableCell key={i}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <IconButton onClick={() => toggleDrawer(true)}>
                          <CreateIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{data.projectName}</TableCell>
                      <TableCell>{data.ReportDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="h-16 mt-5">
              <ReloadButton />
            </div>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
        <EditPage />
      </Drawer>
    </div>
  );
};

export default ProjectReportEntryPage;
