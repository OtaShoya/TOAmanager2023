"use client";
import React, {useEffect, useState} from "react";
import PopulatedTable from "../../src/modules/PopulatedTable/PopulatedTable";
import {Socket} from "socket.io-client";

const sessions =  require("../../src/lib/sessions");

let socket:Socket
var date = new Date("2023-08-21")
function loginClick(){
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

class LoggedIn extends React.Component{
    state = {
        date: date,
      }
    nextClick = (f:any)=> {
        date.setMonth(date.getMonth() + 1);
        this.setState({
            date: date, 
        })
    }
    
    prevClick = (f:any)=>{
        date.setMonth(date.getMonth() - 1);
        this.setState({
            date: date, 
        })
    }

    render(): React.ReactNode {

        return (
            <>
                <button onClick={logoutClick}>logout</button>
                <br/>
                <button onClick={this.prevClick}> Prev </button>
                <button onClick={this.nextClick}> Next </button>
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
            </>
            );
    }

}

function LoggedOrNot({logged}:any){
    
    if(logged === true){
        return (
            <div>
               <LoggedIn />
            </div>
            );
    }else if(logged === false){
        return (<button onClick={loginClick}>login</button> );
    }

    return ( <div></div> );
    
}

export default function Page(){
    
    const [logged, setData]:any = useState([]);
    
    useEffect(() => { 

        socket = sessions.connectSession();

        sessions.socketInitializer(socket);

        socket.on('session_found', msg =>{
            
            if(msg){
                setData(true)
            }else{
                setData(false)
            }
            
        });

        socket.on('after_logout', () => {
            location.reload();
        })

        socket.on("logged", msg =>{
            console.log(msg)
            if(msg === true){
                location.reload();
            }
        });

    }, [])

    return <LoggedOrNot  logged={logged} />
  
}