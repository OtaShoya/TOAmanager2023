"use client";

import LoginAvatar from "@/components/atmos/Avatar";
import CheckBox from "@/components/atmos/CheckBox";
import Navigation from "@/components/atmos/Sidebar";
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
import AddIcon from "@mui/icons-material/Add";
import EditPage from "./Edit";
import AddPage from "./Add";

var socket: Socket;
const columns = ["", "50音", "顧客略称", "顧客正式名", "顧客番号", "業種"];
const industries = [
  "農業,林業",
  "漁業",
  "鉱業,採石業,砂利採取業",
  "建設業",
  "製造業",
  "電気・ガス・熱供給・水造業",
  "情報通信業",
  "運輸業,郵便業",
  "卸売業,小売業",
  "金融業,保険業",
  "不動産業,物品賃貸業",
  "学術研究,専門・技術業",
  "宿泊業,飲食サービス業",
  "生活関連サービス,娯楽業",
  "教育,学習支援業",
  "医療,福祉",
  "複合サービス業",
  "サービス業",
  "公務",
  "その他",
];

const datas = [{ client: "", projectNo: "", projectName: "", progress: "" }];
const formDesign = "border rounded-md p-5 min-[1940px]:w-72 w-52";

const Page = () => {
  const [state, setState] = useState(false);
  const [stateAdd, setStateAdd] = useState(false);
  const [condition1, setCondition1] = useState("A");
  const [condition2, setCondition2] = useState("A");
  const [condition3, setCondition3] = useState("");
  const [condition4, setCondition4] = useState("");
  const [condition5, setCondition5] = useState("");
  const [condition6, setCondition6] = useState("");
  const [condition7, setCondition7] = useState("");

  const toggleAddDrawer = (open: boolean) => {
    setStateAdd(open);
  };

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
    <div className="page-base">
      <Navigation />
      <div className="w-full ml-5 p-12 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex justify-between">
          <h1 className="text-4xl text-white font-bold">顧客登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
        </div>
        <div className="flex flex-col">
          {/* フィルター */}
          <div className="flex justify-between items-end mt-10">
            <div>
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
                  className={formDesign}
                  placeholder={columns[1]}
                  onChange={(e) => setCondition3(e.target.value)}
                />
                <input
                  className={formDesign}
                  placeholder={columns[2]}
                  onChange={(e) => setCondition4(e.target.value)}
                />
                <input
                  className={formDesign}
                  placeholder={columns[3]}
                  onChange={(e) => setCondition5(e.target.value)}
                />
                <input
                  className={formDesign}
                  placeholder={columns[4]}
                  onChange={(e) => setCondition6(e.target.value)}
                />
                <select
                  className={formDesign}
                  placeholder={columns[5]}
                  onChange={(e) => setCondition7(e.target.value)}
                >
                  <option value="" disabled selected className="hidden">
                    業種
                  </option>
                  {industries.map((label, index) => (
                    <option key={index} value={index}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="bg-sky-300 hover:bg-sky-600 text-white text-xl font-semibold rounded-full px-5 h-12 flex items-center"
              onClick={() => toggleAddDrawer(true)}
            >
              <AddIcon />
              新規登録
            </button>
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
        {/* editページ */}
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <EditPage />
        </Drawer>
        {/* addページ */}
        <Drawer
          anchor="right"
          open={stateAdd}
          onClose={() => toggleAddDrawer(false)}
        >
          <AddPage />
        </Drawer>
      </div>
    </div>
  );
};

export default Page;
