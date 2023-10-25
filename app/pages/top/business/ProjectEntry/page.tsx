"use client";

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
import EditPage from "./component/Edit";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import { Socket } from "socket.io-client";
import CheckBox from "@/components/atmos/CheckBox";
import ReloadButton from "@/components/molecule/RelodeButton";
var socket: Socket;
const columns = ["", "顧客", "プロジェクト番号", "プロジェクト名", "状態"];

const datas = [{ client: "", projectNo: "", projectName: "", progress: "" }];

const ProjectEntryPage = () => {
  const [state, setState] = React.useState(false);
  const [condition1, setCondition1] = React.useState("A");
  const [condition2, setCondition2] = React.useState("A");
  const [condition3, setCondition3] = React.useState("A");
  const [condition4, setCondition4] = React.useState("");
  const [condition5, setCondition5] = React.useState("");
  const [condition6, setCondition6] = React.useState("");
  const [condition7, setCondition7] = React.useState("");

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  const changeHandler = (no: number) => {
    switch (no) {
      case 1:
        if (condition1 === "A") {
          setCondition1("B");
        } else {
          setCondition1("A");
        }
        break;
      case 2:
        if (condition2 === "A") {
          setCondition2("B");
        } else {
          setCondition2("A");
        }
        break;
      case 3:
        if (condition3 === "A") {
          setCondition3("B");
        } else {
          setCondition3("A");
        }
    }
  };

  React.useEffect(() => {
    console.log(
      `${condition1} + ${condition2} + ${condition3} + ${condition4} + ${condition5} + ${condition6} + ${condition7}`
    );
  }, [
    condition1,
    condition2,
    condition3,
    condition4,
    condition5,
    condition6,
    condition7,
  ]);

  return (
    <div className="flex flex-row h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">プロジェクト登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* フィルター */}
          <div className="w-2/3 mt-10">
            <div className="flex">
              <CheckBox
                label="終了分は除く"
                onchange={() => changeHandler(1)}
              />
              <CheckBox
                label="担当プロジェクトのみ"
                onchange={() => changeHandler(2)}
              />
              <CheckBox
                label="担当顧客のみ"
                onchange={() => changeHandler(3)}
              />
            </div>
            <div className="flex space-x-3">
              <select
                className="border rounded-md"
                placeholder={columns[1]}
                onChange={(e) => setCondition4(e.target.value)}
              >
                <option value="">顧客</option>
              </select>
              <input
                className="border rounded-md"
                placeholder={columns[2]}
                onChange={(e) => setCondition5(e.target.value)}
              />
              <input
                className="border rounded-md"
                placeholder={columns[3]}
                onChange={(e) => setCondition6(e.target.value)}
              />
              <select
                className="border rounded-md"
                placeholder={columns[4]}
                onChange={(e) => setCondition7(e.target.value)}
              >
                <option value="">状態</option>
              </select>
            </div>
          </div>
          {/* ↓テーブル */}
          <div className=" w-2/3 mt-3">
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
                      <TableCell>{data.client}</TableCell>
                      <TableCell>{data.projectNo}</TableCell>
                      <TableCell>{data.projectName}</TableCell>
                      <TableCell>{data.progress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="h-16 mt-5">
            <ReloadButton />
          </div>
        </div>
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <EditPage />
        </Drawer>
      </div>
    </div>
  );
};

export default ProjectEntryPage;
