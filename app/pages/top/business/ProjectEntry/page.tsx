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
import EditPage from "./component/Edit";
import AddPage from "./component/Add";
import io, { Socket } from "socket.io-client";
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
    loadProjects();
    socket = sessions.connectSession();
    sessions.socketInitializer(socket);
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
    <div>
      <div className="p-12">
        <div>
          <ReloadButton />
          <ExitButton />
        </div>
        {/* ↓新規追加ボタンの作成 */}
        <div className="flex justify-end">
          <button
            onClick={() => toggleDrawer(true)}
            className="border rounded-md border-indigo-600 text-indigo-600 hover:bg-slate-100 justify-self-end w-24 h-8"
          >
            新規登録
          </button>
        </div>
        <div className="flex flex-col items-center mt-8">
          <div>
            <div>
              <input type="checkbox" onChange={() => changeHandler(1)} />
              <label>終了分は除く</label>
              <input type="checkbox" onChange={() => changeHandler(2)} />
              <label>担当プロジェクトのみ</label>
              <input type="checkbox" onChange={() => changeHandler(3)} />
              <label>担当顧客のみ</label>
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
        </div>
      </div>
      <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
        <AddPage socket={socket} projectList={datas} members={members}/>
      </Drawer>
      
      <Drawer anchor="right" open={stateEdit} onClose={() => toggleDrawerEdit(false, 0)}>
        <EditPage socket={socket} projectId={projectSelected} loaded={newLoaded} setLoadedFunction={setNewLoaded} projectList={datas} members={members}/>
      </Drawer>

    </div>
  );
};

export default ProjectEntryPage;
