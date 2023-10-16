"use client";

import ExitButton from "@/components/molecule/ExitButton";
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
import CreateIcon from "@mui/icons-material/Create";
import EditPage from "./component/Edit";
import AddPage from "./component/Add";
import { Socket } from "socket.io-client";

const sessions = require("@/src/lib/sessions");
let socket: Socket;
var loaded:boolean = false;

const columns = ["", "氏名", "部署", "役職", "休日グループ"];

// let datas = [{ shimei: "", bushoId: "", yakushokuId: "", kyujitsuGroupId: "" }];

const ShainTourokuPage = () => {
  const [state, setState] = React.useState(false);
  const [stateAdd, setStateAdd] = React.useState(false);
  const [datas, setDatas]= React.useState([{ shimei: "", bushoId: "", yakushokuId: "", kyujitsuGroupId: "", id: "" }]);
  const [uid, setUid]= React.useState(0);
  const [condition1, setCondition1] = React.useState("A");
  const [condition4, setCondition4] = React.useState("");
  const [condition5, setCondition5] = React.useState("");
  const [condition6, setCondition6] = React.useState("");
  const [condition7, setCondition7] = React.useState("");

  const toggleAddDrawer = (open: boolean) => {
    setStateAdd(open);
    loadShainList();
    // setState(!open);
  };
  const toggleDrawer = (open: boolean, id:number=0) => {
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

    if(s){
      setDatas(s.shainList);
      loaded = true;
    }
    
    //  console.log(s)
    
  }

  React.useEffect(() => {
    if (!loaded) 
    {
      socket = sessions.connectSession();
      sessions.socketInitializer(socket);
      
      socket.on("after-shain-add", ()=>{
        toggleAddDrawer(false)
      })
     
      loadShainList();
     
    }
    console.log(
      `${condition1} + ${condition4} + ${condition5} + ${condition6} + ${condition7}`
    );
  }, [condition1, condition4, condition5, condition6, condition7]);

  return (
    <div>
      <div className="p-12">
        <div className="flex space-x-8">
          <ReloadButton />
          <ExitButton />
        </div>
        {/* ↓新規追加ボタンの作成 */}
        <div className="flex justify-end">
          <button
            onClick={() => toggleAddDrawer(true)}
            className="border rounded-md border-indigo-600 text-indigo-600 hover:bg-slate-100 justify-self-end w-24 h-8"
          >
            新規登録
          </button>
        </div>
        <div className="flex flex-col items-center mt-8">
          {/* ↓フィルター */}
          <div>
            <div>
              <input type="checkbox" onChange={changeHandler} />
              <label>退職者も表示</label>
            </div>
            <div className="">
              <input
                className="border"
                placeholder={columns[1]}
                onChange={(e) => setCondition4(e.target.value)}
              ></input>
              <input
                className="border"
                placeholder={columns[2]}
                onChange={(e) => setCondition5(e.target.value)}
              ></input>
              <input
                className="border"
                placeholder={columns[3]}
                onChange={(e) => setCondition6(e.target.value)}
              ></input>
              <input
                className="border"
                placeholder={columns[4]}
                onChange={(e) => setCondition7(e.target.value)}
              ></input>
            </div>
          </div>
          {/* ↓テーブル */}
          <div className="flex flex-row border mt-8">
            <TableContainer component={Paper} className="">
              <Table sx={{ maxWidth: 1920, minWidth: 1050 }}>
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
                        <IconButton onClick={() => toggleDrawer(true, parseInt( data.id))}>
                          <CreateIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{data.shimei}</TableCell>
                      <TableCell>
                        <Select  native
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
                          <option value={4}>ビジネスサポート部 ユースウェア</option>
                          <option value={5}>ビジネスサポート部 技術部</option>
                          <option value={5}>ビジネスサポート部 業務部</option>

                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          native
                          label=""
                          value={data.yakushokuId}
                        >
                          <option aria-label="None" />
                          <option value={1}>正社員</option>
                          <option value={2}>契約社員</option>
                          <option value={3}>派遣社員</option>
                          <option value={4}>アルバイト</option>
                          <option value={5}>インターシップ</option>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          native
                          label=""
                          value={data.kyujitsuGroupId}
                        >
                          <option aria-label="None" />
                          <option value={1}>常務</option>
                          <option value={2}>部長</option>
                          <option value={3}>マネージャー</option>
                          <option value={4}>主任</option>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
        <EditPage socket={socket} uid={uid} onClose={()=>{toggleDrawer(false)}}/>
      </Drawer>
      <Drawer anchor="right" open={stateAdd} onClose={() => toggleAddDrawer(false)}>
        <AddPage socket={socket} onClose={() => toggleAddDrawer(false)}/>
      </Drawer>
    </div>
  );
};

export default ShainTourokuPage;
