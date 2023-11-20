"use client";

import ReloadButton from "@/components/molecule/RelodeButton";
import { Select } from "@mui/material";
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
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EditPage from "./Edit";
import AddPage from "./Add";
import { Socket } from "socket.io-client";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import CheckBox from "@/components/atmos/CheckBox";

const sessions = require("@/src/lib/sessions");
let socket: Socket;
var loaded: boolean = false;

const columns = ["", "氏名", "部署", "役職", "休日グループ"];
const formDesign = "border rounded-md p-5";

const bushoValues = [
  { value: "", label: "部署" },
  { value: "システム開発部", label: "システム開発部" },
  { value: "開発部", label: "開発部" },
  {
    value: "ビジネスサポート部 ユースウェア",
    label: "ビジネスサポート部 ユースウェア",
  },
  {
    value: "ビジネスサポート部 リレーショングループ",
    label: "ビジネスサポート部 リレーショングループ",
  },
  { value: "ビジネスサポート部 技術部", label: "ビジネスサポート部 技術部" },
  { value: "ビジネスサポート部 業務部", label: "ビジネスサポート部 業務部" },
];

const yakushokuValues = [
  { value: "", label: "役職" },
  { value: "正社員", label: "正社員" },
  { value: "契約社員", label: "契約社員" },
  {
    value: "派遣社員",
    label: "派遣社員",
  },
  {
    value: "アルバイト",
    label: "アルバイト",
  },
  { value: "インターンシップ", label: "インターンシップ" },
];

const kyuuzituValues = [
  { value: "", label: "休日グループ" },
  { value: "Aグループ", label: "Aグループ" },
  { value: "Bグループ", label: "Bグループ" },
  { value: "運用Aグループ", label: "運用Aグループ" },
  {
    value: "運用Bグループ",
    label: "運用Bグループ",
  },
];

const ShainTourokuPage = () => {
  const [state, setState] = React.useState(false);
  const [stateAdd, setStateAdd] = React.useState(false);
  const [datas, setDatas] = React.useState([
    { shimei: "", bushoId: "", yakushokuId: "", kyujitsuGroupId: "", id: "" },
  ]);
  const [uid, setUid] = React.useState(0);
  const [condition1, setCondition1] = React.useState("A");
  const [condition2, setCondition2] = React.useState("");
  const [condition3, setCondition3] = React.useState("");
  const [condition4, setCondition4] = React.useState("");
  const [condition5, setCondition5] = React.useState("");

  const toggleAddDrawer = (open: boolean) => {
    setStateAdd(open);
    loadShainList();
    // setState(!open);
  };
  const toggleDrawer = (open: boolean, id: number = 0) => {
    setState(open);
    loadShainList();
    // setStateAdd(!open);

    setUid(id);
  };
  const changeHandler = () => {
    if (condition1 === "A") {
      setCondition1("B");
    } else {
      setCondition1("A");
    }
  };

  const loadShainList = async () => {
    const res = await fetch("http://localhost:3000/api/db", {
      method: "POST",
      body: JSON.stringify({
        type: "shain-list",
      }),
    });

    let s = await res.json();

    if (s) {
      setDatas(s.shainList);
      loaded = true;
    }
  };

  React.useEffect(() => {
    if (!loaded) {
      socket = sessions.connectSession();
      sessions.socketInitializer(socket);

      socket.on("after-shain-add", () => {
        toggleAddDrawer(false);
      });

      loadShainList();
    }
    console.log(
      `${condition1} + ${condition2} + ${condition3} + ${condition4} + ${condition5}`
    );
  }, [condition1, condition2, condition3, condition4, condition5]);

  return (
    <div className="flex flex-row h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full mx-5 p-12 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">社員登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* ↓フィルター */}
          <div className="mt-10">
            <div className="flex items-center ">
              <CheckBox label="退職者も表示" onchange={changeHandler} />
            </div>
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <input
                  className={formDesign}
                  placeholder={columns[1]}
                  onChange={(e) => setCondition2(e.target.value)}
                />
                <select
                  className={formDesign}
                  onChange={(e) => setCondition3(e.target.value)}
                >
                  {bushoValues.map((busho, index) => (
                    <option key={index} value={busho.value}>
                      {busho.label}
                    </option>
                  ))}
                </select>
                <select
                  className={formDesign}
                  onChange={(e) => setCondition4(e.target.value)}
                >
                  {yakushokuValues.map((yakushoku, index) => (
                    <option key={index} value={yakushoku.value}>
                      {yakushoku.label}
                    </option>
                  ))}
                </select>
                <select
                  className={formDesign}
                  onChange={(e) => setCondition5(e.target.value)}
                >
                  {kyuuzituValues.map((kyuuzitu, index) => (
                    <option key={index} value={kyuuzitu.value}>
                      {kyuuzitu.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* ↓テーブル */}
          <div className="flex flex-col mt-3">
            <TableContainer
              component={Paper}
              className="border rounded-lg shadow-lg"
            >
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
                        <IconButton
                          onClick={() => toggleDrawer(true, parseInt(data.id))}
                        >
                          <PersonSearchIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{data.shimei}</TableCell>
                      <TableCell>
                        <Select
                          native
                          label="部署"
                          id="grouped-department-select"
                          value={data.bushoId}
                        >
                          <option aria-label="None" />
                          <option value={1}>システム開発部</option>
                          <option value={2}>営業部</option>
                          <option value={3}>
                            ビジネスサポート部 リレーショングループ
                          </option>
                          <option value={4}>
                            ビジネスサポート部 ユースウェア
                          </option>
                          <option value={5}>ビジネスサポート部 技術部</option>
                          <option value={5}>ビジネスサポート部 業務部</option>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select native label="" value={data.yakushokuId}>
                          <option aria-label="None" />
                          <option value={1}>常務</option>
                          <option value={2}>部長</option>
                          <option value={3}>マネージャー</option>
                          <option value={4}>主任</option>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select native label="" value={data.kyujitsuGroupId}>
                          <option aria-label="None" />
                          <option value={1}>Aグループ</option>
                          <option value={2}>Bグループ</option>
                          <option value={3}>運用Aグループ</option>
                          <option value={4}>運用Bグループ</option>
                          <option value={5}>その他</option>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex justify-between h-16 mt-5">
              <ReloadButton />
              <button
                className="border rounded-full hover:bg-slate-100 bg-white text-[#556593] w-40 h-16"
                onClick={() => toggleDrawer(true)}
              >
                新規追加
              </button>
            </div>
          </div>
        </div>
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <EditPage
            socket={socket}
            uid={uid}
            onClose={() => {
              toggleDrawer(false);
            }}
          />
        </Drawer>
        <Drawer
          anchor="right"
          open={stateAdd}
          onClose={() => toggleAddDrawer(false)}
        >
          <AddPage socket={socket} onClose={() => toggleAddDrawer(false)} />
        </Drawer>
      </div>
    </div>
  );
};

export default ShainTourokuPage;
