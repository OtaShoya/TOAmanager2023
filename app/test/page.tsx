"use client";
import React, {useEffect, useState} from "react";
import PopulatedTable from "../../src/modules/PopulatedTable/PopulatedTable";
import io, {Socket} from "socket.io-client";
let socket:Socket
var date = new Date("2023-08-21")
function testClick(){
    date.setMonth(date.getMonth() + 1);
    socket.emit('input-change', "eee")
}

function logoutClick(){
    localStorage.removeItem("sessionID");
    location.reload();
}

function LoggedOrNot(){
    const [logged, setData]:any = useState([]);
    // var logged:boolean = false;
    useEffect(() => { 

        var da:boolean = false;
        if (localStorage.getItem("sessionID")){
            da = true;
        }
        setData(da) 

    }, [

    ])
    if(logged === true){
        return (
            <body>
                <button onClick={logoutClick}>logout</button>
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
                    <tbody>
                        <PopulatedTable beginingDate={date} />
                    </tbody>
                </table> 
            {/* <TestElemet/> */}
            
            </body>
            );
    }else if(logged === false){
        return (<button onClick={testClick}>login</button> );
    }

    return ( <div></div> );
}


export default function Page(){
 
    useEffect(() => { socketInitializer() }, [])
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io("http://localhost:3000/", {
            path: "/api/socket/socket.io",
          transports: ['polling'], 
          auth:{
            sessionID:  localStorage.getItem("sessionID"), //localStorage
          }
         })
        socket.on('connect', () => {
            console.log('connected')
            // localStorage.removeItem("sessionID");
        })
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
            console.log(err)
        });
        socket.on('update-input', msg => {
            console.log(msg);
          
        })
        socket.on("session", msg=>{
            localStorage.setItem("sessionID", msg.sessionID); //localStorage
            console.log(msg.sessionID)
            location.reload();
        });
        
    }
    return <LoggedOrNot  />
  
}