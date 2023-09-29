"use client";
import React, {useEffect, useState} from "react";
import PopulatedTable from "../../src/modules/PopulatedTable/PopulatedTable";
import io, {Socket} from "socket.io-client";
let socket:Socket
var date = new Date("2023-08-21")
function testClick(){
    date.setMonth(date.getMonth() + 1);
    socket.emit('login', 
    {
        user: "adachi"
        ,password: "adachi"
    })
}

function logoutClick(){
    if(localStorage.getItem("sessionID")){
        socket.emit("logout", localStorage.getItem("sessionID") )
    }
}

function LoggedOrNot({logged}:any){
    
    if(logged === true){
        return (
            <div>
                <button onClick={logoutClick}>logout</button>
                <br/>
                <button> Prev </button>
                <button> Next </button>
                <br/>
                <table>
                    <thead>
                    <tr>
                        <th>日付</th>
                        <th>曜日</th>
                        <th>勤務区分</th>
                        <th>勤務形態</th>
                        <th>出社時刻</th>
                        <th>退社時刻</th>
                        <th>控除時間</th>
                        <th>勤務時間</th>
                        <th>残業時間</th>
                        <th>残業時間（深夜）</th>
                        <th>休出時間</th>
                        <th>作業時間合計</th>
                        <th>メモ</th>
                    </tr>
                    </thead>
                    <PopulatedTable beginingDate={date} />
                </table> 
            {/* <TestElemet/> */}
            
            </div>
            );
    }else if(logged === false){
        return (<button onClick={testClick}>login</button> );
    }

    return ( <div></div> );
}


export default function Page(){
    const [logged, setData]:any = useState([]);
    useEffect(() => { socketInitializer() }, [])
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io("http://localhost:3000/", {
            path: "/api/socket/socket.io",
            transports: ['polling'], 
            auth:{
                sessionID:  localStorage.getItem("sessionID"),
            }
        })
     
        socket.on('connect', () => {
            console.log('connected')
        })
     
        socket.on('logout', () => {
            localStorage.removeItem("sessionID");
            location.reload();
        })

        socket.on('isLoggedIn', () =>{
            setData(true)
        })

        socket.on('notLoggedIn', () =>{
            setData(false)
        })

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
            console.log(err)
        });

        socket.on("session", msg=>{
            localStorage.setItem("sessionID", msg.sessionID);
            // localStorage.setItem("userID", msg.userID);
            console.log(msg.sessionID)
            location.reload();
        });
        
    }
    return <LoggedOrNot  logged={logged} />
  
}