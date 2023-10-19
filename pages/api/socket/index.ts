import type { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import fs from "fs";

import { weekReport, ProjectItem, sakugyoNaiyouItem } from '@/src/lib/report';

class Shain{
  id!: number|string|null;
  bango!: number|string|null;
  password!: number|string|null;
  shimei!: string|null;
  furigana!: string|null;
  ryakushou!: string|null;//abreviation
  bushoId!: number|string|null; //post //Select
  shainKubunId!: number|string|null; //employee devision //Select
  yakushokuId!: number|string|null; //manegerial position //Select
  kyujitsuGroupId!: number|string|null; //day off group //Select
  shayouKeitaiBango!: string|null; //Company's cellphone number
  shayouKeitaiNaisenBango!: string|null; //Company's cellphone extension number
  nyuushaNichi!: Date|string|null; //day entering the company
  taishaNichi!: Date|string|null; //day of resignation
  account!: string|null;
  mailAddress!: string|null;
  yubinBango!: string|null; //mailNumber
  jyuusho!: string|null; //address
  denwaBango!: string|null; //phone Number
  keitaiBango!: string|null; //cellphone number
  inkan!: string|null; //stamp // data/image
}

const db = require("@/src/lib/database.ts")
var dataBaseConnectionStr:string = "../../../../db.sqlite3";

const randomId = function (length = 20) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

class SessionStore{
    
  sessions:Map<string, any>;

  constructor() {
    this.sessions = new Map();
  }
  
  removeSession(id:string){
    this.sessions.delete(id);
  }

  findSession(id:string) {
    return this.sessions.get(id);
  }
  
  saveSession(id:string, session:any) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return this.sessions.keys();
  }
}

const sessionStore: SessionStore = new SessionStore();

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    // console.log('Socket is already running')
  } else {
    // console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });

    res.socket.server.io = io;

    io.use((socket: any, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        socket.sessionID = sessionID;
      }
      next();
    });

    io.on("connection", (socket: any) => {
      if (socket.sessionID && sessionStore.findSession(socket.sessionID)) {
        socket.emit("session_found", true);
      } else {
        socket.emit("session_found", false);
      }

      socket.on("logout", (msg: string) => {
        sessionStore.removeSession(msg);
        socket.emit("session_logout", "");
        socket.emit("after_logout", "");
      });

      socket.on("login", (msg: any) => {
        const login = async () => {
          let logged = false;

          const res = await fetch("http://localhost:3000/api/db", {
            method: "POST",
            body: JSON.stringify({
              type: "login",
              user: msg.user,
              password: msg.password,
            }),
          });
          
          const d = await res.json();
          if (d?.id) {
            socket.sessionID = randomId() + randomId() + randomId();
            socket.userID = d?.id;
            sessionStore.saveSession(socket.sessionID, socket.userID);
            logged = true;
            await socket.emit("session_created", {
              sessionID: socket?.sessionID,
              userID: socket?.userID,
            });
          }
          socket.emit("logged", logged);
        };

        login();
      });

      socket.on("update-kinmu", (msg: any) => {
        if (sessionStore.findSession(msg.sessionID) == msg.userID) {
          console.log("ok");
        }
      })

      socket.on("shain-update", (msg:any)=>{
        
        if( sessionStore.findSession( msg.sessionID ) == msg.userID )
        {
         
            var shain:Shain = new Shain();
            
            shain.id = msg.id;

            shain.bango = msg.bango;
            shain.password = msg.password;
            shain.shimei = msg.shimei;
            shain.furigana = msg.furigana;

            shain.bushoId = msg.bushoId;
            shain.shainKubunId = msg.shainKubunId;
            shain.yakushokuId = msg.yakushokuId;
            shain.kyujitsuGroupId = msg.kyujitsuGroupId;
   
            shain.account = msg.account;
            shain.mailAddress = msg.mailAddress;
            shain.yubinBango = msg.yubinBango;
            shain.jyuusho = msg.jyuusho;
            shain.denwaBango = msg.denwaBango;
            shain.keitaiBango = msg.keitaiBango;

            const r = async ()=>{
              const res =  await fetch("http://localhost:3000/api/db", 
              { 
                method: "POST", 
                body: JSON.stringify(
                  {
                    type: "shain-update",
                    shain: shain,
                  }
                ),
              });
            }
            
            r();

            console.log("ok");
        }
      })

      socket.on("shain-add", (msg:any)=>{
        
        if( sessionStore.findSession( msg.sessionID ) == msg.userID )
        {
         
            var shain:Shain = new Shain();
            
            shain.id = msg.userID;

            shain.bango = msg.bango;
            shain.password = msg.password;
            shain.shimei = msg.shimei;
            shain.furigana = msg.furigana;

            shain.bushoId = msg.bushoId;
            shain.shainKubunId = msg.shainKubunId;
            shain.yakushokuId = msg.yakushokuId;
            shain.kyujitsuGroupId = msg.kyujitsuGroupId;
   
            shain.account = msg.account;
            shain.mailAddress = msg.mailAddress;
            shain.yubinBango = msg.yubinBango;
            shain.jyuusho = msg.jyuusho;
            shain.denwaBango = msg.denwaBango;
            shain.keitaiBango = msg.keitaiBango;

            const r = async ()=>{
              const res =  await fetch("http://localhost:3000/api/db", 
              { 
                method: "POST", 
                body: JSON.stringify(
                  {
                    type: "shain-add",
                    shain: shain,
                  }
                ),
              });
              socket.emit("after-shain-add")
            }
            
            r();

            
        }
      })

      socket.on("shain-delete", (msg:any)=>{
        
        if( sessionStore.findSession( msg.sessionID ) == msg.userID )
        {
          const r = async ()=>{
            const res =  await fetch("http://localhost:3000/api/db", 
            { 
              method: "POST", 
              body: JSON.stringify(
                {
                  type: "shain-delete",
                  id: msg.userID,
                }
              ),
            });
          }
          
          r();

          socket.emit("after-shain-delete")
        }
      })

      socket.on("download-week", (msg:any)=>{

        const weekReportFunction = async ()=>{

          var bd =  new Date(msg.tgDate)
          if(bd.getDay() > 0){
            bd.setDate( bd.getDate() - (bd.getDay() - 1) );
          }else{
            bd.setDate( bd.getDate() - 6 );
          }
          
          var ed = new Date(bd)
          ed.setDate(ed.getDate() + 6)

          const res =  await fetch("http://localhost:3000/api/db", 
          { 
            method: "POST", 
            body: JSON.stringify(
              {
                type: "shuu-sakugyou-houkoku",
                beginDate: new Date(bd),
                endDate: new Date(ed),
                shainId: msg.id,
              }
            ),
          });
          let pl = await res.json();
          await weekReport("./temp.xlsx", msg.name, new Date(bd), pl.projectList).then((msg)=>{

            const imgFile = fs.readFileSync("./temp.xlsx");
            const imgBase64 = Buffer.from(imgFile).toString('base64');
         
            socket.emit("download", imgBase64 )
          });
          
        }
      
        weekReportFunction();

        
        
        
      })
      
    })

  }

  res.end();
};

export default SocketHandler;
