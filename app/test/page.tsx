"use client";
import React, {useEffect, useState} from "react";
import PopulatedTable from "../../src/modules/PopulatedTable/PopulatedTable";
import {Socket} from "socket.io-client";
import EditPage from "./Edit"

const sessions =  require("../../src/lib/sessions");
// const report = require("../../src/lib/report");


let socket:Socket
var date = new Date("2023-08-21")

function downloadClick(){
    socket.emit("download", 
    {
        bDate: new Date('2023-09-6'),
        id: 1
    })
}

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

function updateClick(){
    if(localStorage.getItem("sessionID")){

        var bango:any = document.getElementById("n1");
        var password:any = document.getElementById("n2");
        var shimei:any = document.getElementById("n3");
        var furigana:any = document.getElementById("n4");

        console.log(password.value);

        socket.emit("update-shain", 
        {
            sessionID: localStorage.getItem("sessionID"),
            userID: localStorage.getItem("userID"),
            bango: bango.value ,
            password: password.value,
            shimei: shimei.value,
            furigana: furigana.value,
        })
    }
}
const setLoadedEdit = ()=>{

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
                <EditPage 
                 socket={socket}
                 projectList={[]}
                 kinmuId={1}
                 loaded={false}
                 setLoaded={setLoadedEdit}
                 date={new Date()}
                />
                {/* <table>
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
                </table>     */}
            </>
            );
    }

}

var loaded = false;

function LoggedOrNot({logged}:any){
    const [data, setData]:any = useState([]);
   
    useEffect(()=>{
        
        if(!loaded && logged === true){

            const r = async ()=>{
                const res =  await fetch("http://localhost:3000/api/db", 
                { 
                method: "POST", 
                body: JSON.stringify(
                    {
                        type: "shain-get",
                        id: localStorage.getItem("userID"),
                    }
                ),
                });
                let s = await res.json();
                if(s?.user){

                    var bango:any = document.getElementById("n1");
                    var password:any = document.getElementById("n2");
                    var shimei:any = document.getElementById("n3");
                    var furigana:any = document.getElementById("n4");

                    bango.value = s?.user?.bango;
                    password.value = s?.user?.password;
                    shimei.value = s?.user?.shimei;
                    furigana.value = s?.user?.furigana;

                    loaded = true;
                }
            }

            r();
            
        }

    })

    if(logged === true){

        return (
            <div>
                <input type="text" name="n1" id="n1"/>
                <input type="text" name="n2" id="n2"/>
                <input type="text" name="n3" id="n3" />
                <input type="text" name="n4" id="n4" />
                <button onClick={updateClick}>Update</button>
                <br/>
                <LoggedIn />
            </div>
            );
    }else if(logged === false){
        return (
                <div>
                    <button onClick={loginClick}>login</button> 
                    <br />
                    <button onClick={downloadClick}>report</button> 
                </div>
                );
    }

    return ( <div></div> );
    
}

function base64ToArrayBuffer(base64:string) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(byte:Uint8Array) {
    var blob = new Blob([byte], {type: "application/xlsx"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = "test.xlsx";
    link.download = fileName;
    link.click();
};

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
            if(msg === true){
                location.reload();
            }
        });

        socket.on("download", msg =>{
            saveByteArray(base64ToArrayBuffer(msg))
        });

    }, [])

    return <LoggedOrNot  logged={logged} />
  
}