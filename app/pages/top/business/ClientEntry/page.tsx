"use client";

import LoginAvatar from "@/components/atmos/Avatar";
import CheckBox from "@/components/atmos/CheckBox";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
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
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ReloadButton from "@/components/molecule/RelodeButton";
var socket: Socket;
const columns = ["", "50音", "顧客略称", "顧客正式名", "業種"];

const datas = [{ client: "", projectNo: "", projectName: "", progress: "" }];

const Page = () => {
  const [state, setState] = useState(false);
  const [condition1, setCondition1] = useState("A");
  const [condition2, setCondition2] = useState("A");
  const [condition3, setCondition3] = useState("");
  const [condition4, setCondition4] = useState("");
  const [condition5, setCondition5] = useState("");
  const [condition6, setCondition6] = useState("");
  const [condition7, setCondition7] = useState("");

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
    }
  };

  useEffect(() => {
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
          <h1 className="text-4xl text-white font-bold">顧客登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* フィルター */}
          <div className="mt-10">
            <div className="flex">
              <CheckBox
                label="担当顧客のみ"
                onchange={() => changeHandler(1)}
              />
              <CheckBox
                label="使用不可も含む"
                onchange={() => changeHandler(2)}
              />
            </div>
            <div className="flex space-x-3">
              <input
                className="border rounded-md"
                placeholder={columns[1]}
                onChange={(e) => setCondition3(e.target.value)}
              />
              <input
                className="border rounded-md"
                placeholder={columns[2]}
                onChange={(e) => setCondition4(e.target.value)}
              />
              <input
                className="border rounded-md"
                placeholder={columns[3]}
                onChange={(e) => setCondition5(e.target.value)}
              />
              <input
                className="border rounded-md"
                placeholder={columns[4]}
                onChange={(e) => setCondition6(e.target.value)}
              />
              <select
                className="border rounded-md"
                placeholder={columns[5]}
                onChange={(e) => setCondition7(e.target.value)}
              >
                <option value="">業種</option>
              </select>
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
        <Drawer
          anchor="right"
          open={state}
          onClose={() => toggleDrawer(false)}
        ></Drawer>
      </div>
    </div>
  );
};

export default Page;
