import type { NextApiRequest, NextApiResponse } from 'next'

import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

const db = require("../../../src/lib/database.ts")
var dataBaseConnectionStr:string = "../../../../db.sqlite3";


const randomId = function(length = 6) {
  return Math.random().toString(36).substring(2, length+2);
};

class SessionStore{
    
    sessions:Map<string, string>;

    constructor() {
      this.sessions = new Map();
    }
  
    findSession(id) {
      return this.sessions.get(id);
    }
  
    saveSession(id, session) {
      this.sessions.set(id, session);
    }
  
    findAllSessions() {
      return [...this.sessions.values()];
    }
}

const sessionStore:SessionStore = new SessionStore();

const SocketHandler = (req, res) => {
  
  // const session = getSession(req, res);

  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    console.log(req.body);
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(
      httpServer, 
      {
        path: "/api/socket"
      }
    );

    res.socket.server.io = io;

    io.use((socket:any, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
          socket.sessionID = sessionID;
          return next();
        }
  
      }
      // const username = socket.handshake.auth.username;
      // if (!username) {
      //   return next(new Error("invalid username"));
      // }
      // create new session
      // socket.sessionID = randomId();
      // socket.userID = "ss";
      // sessionStore.saveSession(socket.sessionID, socket.userID)
      next();
    });
    io.on('connection', (socket:any) => {

      // socket.emit("session", {
      //   sessionID: socket?.sessionID,
      //   userID: socket?.userID,
      // });

      socket.on('input-change', msg => {
        console.log(socket?.sessionID)
        // const ss = async()=>{
        //   const s =  await fetch("http://localhost:3000/api/test/1", 
        //   { 
        //     method: "POST", 
        //     body: JSON.stringify(
        //       {
        //       }
        //     ),
        //   });
        //   socket.emit('update-input', await s.json());
        // }
        // ss();
        
        const ss = async()=>{
          const res =  await fetch("http://localhost:3000/api/db", 
          { 
            method: "POST", 
            body: JSON.stringify(
              {
                type: "login",
                user: "adachi",
                password: "adachi",
              }
            ),
          });
          const d = await res.json();
          console.log(d);
          if(d?.id){
            socket.sessionID = randomId();
            socket.userID = d?.id;
            sessionStore.saveSession(socket.sessionID, socket.userID)
            socket.emit("session", 
            {
              sessionID: socket?.sessionID,
              userID: socket?.userID,
            })
          }
        }

        ss();

        return socket.sessionID;

      })
      
    })

  }
  res.end()
}

export default SocketHandler