import type { NextApiRequest, NextApiResponse } from 'next'

import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

const db = require("../../../src/lib/database.ts")
var dataBaseConnectionStr:string = "../../../../db.sqlite3";

const randomId = function(length = 20) {
  return Math.random().toString(36).substring(2, length+2);
};

class SessionStore{
    
    sessions:Map<string, string>;

    constructor() {
      this.sessions = new Map();
    }
    
    removeSession(id){
      this.sessions.delete(id);
    }

    findSession(id) {
      return this.sessions.get(id);
    }
    
    saveSession(id, session) {
      this.sessions.set(id, session);
    }
  
    findAllSessions() {
      return [...this.sessions.keys()];
    }
}

const sessionStore:SessionStore = new SessionStore();

const SocketHandler = (req, res) => {

  if (res.socket.server.io) {
    // console.log('Socket is already running')
  } else {
    // console.log('Socket is initializing')
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
        socket.sessionID = sessionID;
      }
      next();
    });
    
    io.on('connection', (socket:any) => {
      
      if(socket.sessionID && sessionStore.findSession(socket.sessionID)){
        socket.emit('session_found', true);
      } else{
        socket.emit('session_found', false);
      }
      
      socket.on('logout', msg =>{
        sessionStore.removeSession(msg);
        socket.emit("session_logout", "")
        socket.emit("after_logout", "");
      });
      
      socket.on('login', msg => {
        
        const login = async()=>{
          
          let logged = false;

          const res =  await fetch("http://localhost:3000/api/db", 
          { 
            method: "POST", 
            body: JSON.stringify(
              {
                type: "login",
                user: msg.user,
                password: msg.password,
              }
            ),
          });
          const d = await res.json();
          if(d?.id){
            socket.sessionID = randomId() + randomId() + randomId();
            socket.userID = d?.id;
            sessionStore.saveSession(socket.sessionID, socket.userID)
            logged = true;
            await socket.emit("session_created", 
            {
              sessionID: socket?.sessionID,
              userID: socket?.userID,
            })
          }
          socket.emit("logged", logged);
        }

        login();

      })
      
      socket.on('update-kinmu', msg =>{
        if( sessionStore.findSession( msg.sessionID ) == msg.userID )
        {
            console.log("ok");
        }
      })
      
    })

  }

  res.end()
}

export default SocketHandler