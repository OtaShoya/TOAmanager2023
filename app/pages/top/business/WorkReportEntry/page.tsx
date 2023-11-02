"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Drawer, IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import EditPage from "./component/Edit";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import io, { Socket } from "socket.io-client";
import ReloadButton from "@/components/molecule/RelodeButton";


var socket: Socket;

var loaded = false;

const sessions = require("@/src/lib/sessions")
const kyuukeiJikan = 1;
const sagyouJikan = 8;

var beginingDate = new Date("2023-08-21");//"2023-08-21"

var shinyaJi:Date = new Date();
shinyaJi.setUTCHours(22);
shinyaJi.setUTCMinutes(30);

class OptionElement{
  name!:string;
  id!:number;
}

function format(toFormat:number){
  return toFormat>9?toFormat:"0"+toFormat;
}

function getWeekDay(day:Number){
  switch(day){
      case 0:
          return "日";
      case 1:
          return "月";
      case 2:
          return "火";
      case 3:
          return "水";
      case 4:
          return "木";
      case 5:
          return "金";
      case 6:
          return "土";
      default:
          return "";
  }
}

const columns = [
  "",
  "日付",
  "曜日",
  "勤務形態",
  "出社時刻",
  "退社時刻",
  "控除時刻",
  "勤務時刻",
  "残業時刻",
  "残業時刻（深夜）",
  "休出時刻",
  "作業時間合計",
  "メモ",
];



const buttonDesign =
  "border rounded-full hover:bg-slate-100 bg-white text-[#556593] w-40 h-full";

const WorkReportEntry = () => {
  const [state, setState] = React.useState(false);
  const [date, setDate] = React.useState("");
  const [datas, setDatas] = React.useState( [] );
  const [projects, setProjects] = React.useState([{
    id: 0,
    na: "",
    sagyouNaiyou: new Array<any>(),
  }])
  React.useEffect(()=>{
    socket = sessions.connectSession();
    sessions.socketInitializer(socket);
    
    async function fetchData() {

      if(loaded){
        return
      }

      const res = await fetch("/api/db/",
      {
          method: "POST", 
          body: JSON.stringify(
              {
                type: "kinmu-list",
                id: localStorage.getItem("userID"),
              }
          ),
      });
      const d = await res.json();
      setDatas(d.kinmuList);

      const res2 = await fetch("/api/db/",
      {
          method: "POST", 
          body: JSON.stringify(
              {
                  type: "project-list-kinmu",

              }
          ),
      });
      const d2 = await res2.json();
      
      setProjects(d2.projectList)
      
      if(d || d2){
        loaded = true;
      }
      // setDatas(d.kinmuList);

    }
    
    fetchData()

  })

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const entryDate = () => {};

  const reportOutput = () => {};


  const Rows = ()=>{
    let endDate = new Date(beginingDate.toString());
    endDate.setMonth(endDate.getMonth() + 1);
    var rows:Array<any> = [];

    if(!datas){
      return "";
    }
    
    for(let date = new Date(beginingDate.toString());  date.getTime() < endDate.getTime(); date.setDate( date.getDate() + 1) ){
        
        let foundEl = datas.find((el:any)=> {
            var fDate = new Date( el.hidsuke);
            return ( fDate.getDate() == date.getDate() && fDate.getMonth() == date.getMonth() && fDate.getFullYear() == date.getFullYear())
        })
        
        if(foundEl){
            rows.push(foundEl);
        }else{
            rows.push( { 
                hidsuke: new Date(date.toString()),
                kinmuKubun: 0,
                kinmuKeitai: 0,
                shusshaJikoku: new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
                taishaJikoku: new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
                koujyoJikan: 0,
                kinmuJikan: 0,
                kyuushutsuJikan: 0,
                sagyouJikanGoukei: 0,
                memo: ""
                });
        }

    }

    return  rows.map((val:any, index:any)=>{

      var taishaJikokuJikan = new Date(val.taishaJikoku).getUTCHours() +  new Date(val.taishaJikoku).getUTCMinutes()/60 ;
      var shusshaJikokuJikan = new Date(val.shusshaJikoku).getUTCHours() +  new Date(val.shusshaJikoku).getUTCMinutes()/60;7
      var kinmuJikan = (taishaJikokuJikan >= 13? (taishaJikokuJikan-kyuukeiJikan):taishaJikokuJikan) - shusshaJikokuJikan;
      var zangyouJikan = kinmuJikan - sagyouJikan
      var zangyouJikanShinya = taishaJikokuJikan - (shinyaJi.getUTCHours() + shinyaJi.getUTCMinutes()/60);
      
      var sagyou = kinmuJikan + (val.koujyoJikan?val.koujyoJikan:0) - (val.kyuushutsuJikan?val.kyuukeiJikan:0);

      var opts:Array<OptionElement> =
      [
          {name: "", id: 0},
          {name: "A", id: 1},
          {name: "B", id: 2},
          {name: "C", id: 3},
          {name: "D", id: 4},
      ]
      
      var shusshaString = format(new Date(val.shusshaJikoku).getUTCHours())+ ":" + format(new Date(val.shusshaJikoku).getUTCMinutes());
      var taishaString = format( new Date(val.taishaJikoku).getUTCHours()) + ":" +format( new Date(val.taishaJikoku).getUTCMinutes());
      var styleString={  };
      
      if(shusshaString == taishaString){
          styleString={ backgroundColor: "#f99"};
      }

      return(
        <TableRow>
          <TableCell>
            <IconButton onClick={() => toggleDrawer(true)}>
              <CreateIcon />
            </IconButton>
          </TableCell>
              {/* 日付 */}
               <TableCell>{new Date(val.hidsuke).getFullYear()}/{format(new Date(val.hidsuke).getMonth() + 1)}/{format(new Date(val.hidsuke).getDate())} </TableCell>
              {/* 曜日 */}
               <TableCell>{getWeekDay(new Date(val.hidsuke).getDay())} </TableCell>
              {/* 勤務区分
               <TableCell>{val.kinmuKubun?val.kinmuKubun:0} </TableCell> */}
              {/* 勤務形態 */}
               <TableCell>{ val.kinmuKeitai?val.kinmuKeitai:0} </TableCell>
              {/* 出社時刻 */}
              <TableCell>{shusshaString == taishaString || shusshaString == "00:00"?"":shusshaString} </TableCell>
              {/* 退社時刻 */}
              <TableCell>{shusshaString == taishaString || taishaString == "00:00"?"":taishaString} </TableCell>
              {/* 控除時間 */}
               <TableCell>{val.koujyoJikan > 0?val.koujyoJikan.toFixed(2):""} </TableCell>
              {/* 勤務時間 */}
               <TableCell>{kinmuJikan > 0?kinmuJikan.toFixed(2):""} </TableCell>
              {/* 残業時間 */}
               <TableCell>{ zangyouJikan > 0? zangyouJikan.toFixed(2):""} </TableCell>
              {/* 残業時間（深夜） */}
               <TableCell>{zangyouJikanShinya > 0?zangyouJikanShinya.toFixed(2):""} </TableCell>
              {/* 休出時間 */}
               <TableCell>{val.kyuushutsuJikan>0?val.kyuushutsuJikan.toFixed(2):""} </TableCell>
              {/* 作業時間合計 */}
               <TableCell>{sagyou > 0?sagyou.toFixed(2):""} </TableCell>
              {/* メモ */}
               <TableCell>{val.memo} </TableCell>
        </TableRow>
      )

    })

  }

  return (
    <div className="flex flex-row h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">作業報告登録</h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        {/* ↓年月日選択と各ボタン */}
        <div className="flex flex-row justify-between">
          <input
            type="month"
            value={date}
            className="text-lg border rounded-lg h-16 p-5"
            onChange={(e) => changeHandler(e)}
          />
          <div className="space-x-4">
            <ReloadButton />
            <button className={buttonDesign} onClick={entryDate}>
              休日登録
            </button>
            <button className={buttonDesign} onClick={reportOutput}>
              週間報告書登録
            </button>
          </div>
        </div>
        {/* ↓テーブル */}
        <div className="flex justify-center" style={{maxHeight: "calc(100% - 180px)"}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column, i) => (
                    <TableCell key={i}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>

                <Rows/>

              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
          <EditPage projectList={projects} />
        </Drawer>
      </div>
    </div>
  );
};

export default WorkReportEntry;
