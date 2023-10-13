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
import { Socket } from "socket.io-client";

const sessions = require("@/src/lib/sessions");
let socket: Socket;
var loaded:boolean = false;

const columns = ["", "氏名", "部署", "役職", "休日グループ"];

const datas = [{ userName: "", affiliation: "", post: "", restGroup: "" }];

const ShainTourokuPage = () => {
  const [state, setState] = React.useState(false);
  const [stateAdd, setStateAdd] = React.useState(false);
  const [condition1, setCondition1] = React.useState("A");
  const [condition4, setCondition4] = React.useState("");
  const [condition5, setCondition5] = React.useState("");
  const [condition6, setCondition6] = React.useState("");
  const [condition7, setCondition7] = React.useState("");

  const toggleAddDrawer = (open: boolean) => {
    setStateAdd(open);
    // setState(!open);
  };
  const toggleDrawer = (open: boolean) => {
    setState(open);
    // setStateAdd(!open);
  };
  const changeHandler = () => {
    if (condition1 === "A") {
      setCondition1("B");
    } else {
      setCondition1("A");
    }
  };

  React.useEffect(() => {

    if (!loaded) {
      socket = sessions.connectSession();
      sessions.socketInitializer(socket);
      loaded = true;
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
                        <IconButton onClick={() => toggleDrawer(true)}>
                          <CreateIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{data.userName}</TableCell>
                      <TableCell>{data.affiliation}</TableCell>
                      <TableCell>{data.post}</TableCell>
                      <TableCell>{data.restGroup}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
        <EditPage socket={socket}/>
      </Drawer>
      <Drawer anchor="right" open={stateAdd} onClose={() => toggleAddDrawer(false)}>
        <AddPage socket={socket}/>
      </Drawer>
    </div>
  );
};

export default ShainTourokuPage;
