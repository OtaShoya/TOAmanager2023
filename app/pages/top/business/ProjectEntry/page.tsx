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
import AddPage from "./component/Add";
import { Edit } from "@mui/icons-material";

var socket: Socket;
const sessions = require("@/src/lib/sessions");
const columns = ["", "顧客", "プロジェクト番号", "プロジェクト名", "状態"];

// const datas = [{ client: "", projectNo: "", projectName: "", progress: "" }];

const ProjectEntryPage = () => {
  const [state, setState] = React.useState(false);
  const [stateEdit, setStateEdit] = React.useState(false);
  const [projectSelected, setProjectSelected] = React.useState(0);
  const [newLoaded, setNewLoaded] = React.useState(false);
  const [members, setMembers] = React.useState();//[{shimei: "", id: 0}]
  const [datas, setDatas] = React.useState([{ id:0, kokyakuId: "", bangou: "", na: "", jyoutaiId: "" }]);//
  const [condition1, setCondition1] = React.useState("A");
  const [condition2, setCondition2] = React.useState("A");
  const [condition3, setCondition3] = React.useState("A");
  const [condition4, setCondition4] = React.useState("");
  const [condition5, setCondition5] = React.useState("");
  const [condition6, setCondition6] = React.useState("");
  const [condition7, setCondition7] = React.useState("");

  const toggleDrawer = (open: boolean) => {
    setState(open);
    setNewLoaded(false);
    loadProjects();
  };

  const toggleDrawerEdit = (open: boolean, id: number) => {
    if(open && id == 0){return;}
    setStateEdit(open);
    setProjectSelected(id);
    setNewLoaded(false);
    loadProjects();
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

  const loadProjects = async () =>{

    const res:any = await fetch("http://localhost:3000/api/db",
    {
      method: "POST",
      body: JSON.stringify({
        type: "project-list",
      }),
    })

    let s = await res.json();
    setDatas(s.projectList);

  }

  React.useEffect(() => {
   
    socket = sessions.connectSession();
    sessions.socketInitializer(socket);
    loadProjects();
    socket.on("after-project-add", (msg)=>{
      toggleDrawer(false)
    })
    socket.on("after-project-update", (msg)=>{
      toggleDrawerEdit(false, 0)
    })
    socket.on("after-project-delete", (msg)=>{
      toggleDrawerEdit(false, 0)
    })
    const r = async()=>{
      const res = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        body: JSON.stringify({
          type: "shain-list",
        }),
      });
  
      let s = await res.json();
      
      if(s?.shainList){
        setMembers(s.shainList);
      }
    }
    r()
   

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
                  {
                  datas.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <IconButton onClick={() => toggleDrawerEdit(true, data.id)}>
                          <CreateIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{data.kokyakuId}</TableCell>
                      <TableCell>{data.bangou}</TableCell>
                      <TableCell>{data.na}</TableCell>
                      <TableCell>{data.jyoutaiId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="flex justify-between h-16 mt-5 w-96">
            <ReloadButton />
            <button
                className="border rounded-full hover:bg-slate-100 bg-white text-[#556593] w-40 h-16"
                onClick={() => toggleDrawer(true)}
              >
              新規追加
            </button>
          </div>
        </div>
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <AddPage socket={socket} projectList={datas} members={members}/>
        </Drawer>    
        <Drawer anchor="right" open={stateEdit} onClose={() => toggleDrawerEdit(false, 0)}>
          <EditPage socket={socket} projectId={projectSelected} loaded={newLoaded} setLoadedFunction={setNewLoaded} projectList={datas} members={members}/>
        </Drawer>
      </div>
      

    </div>
  );
};

export default ProjectEntryPage;
