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
import EditPage from "./component/Edit";

const columns = ["", "プロジェクト", "報告日"];

const datas = [{ projectName: "", ReportDate: "" }];

const ProjectReportEntryPage = () => {
  const [state, setState] = React.useState(false);
  const [condition1, setCondition1] = React.useState("A");
  const [condition4, setCondition4] = React.useState("");
  const [condition5, setCondition5] = React.useState("");

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
    console.log(`${condition1} + ${condition4} + ${condition5}`);
  }, [condition1, condition4, condition5]);

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
          {/* ↓フィルター */}
          <div>
            <div>
              <input type="checkbox" onChange={changeHandler} />
              <label>終了分は除く</label>
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
                      <TableCell>{data.projectName}</TableCell>
                      <TableCell>{data.ReportDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
