"use client"
import Navigation from "@/components/atmos/Drawer";
import React, {useEffect, useState} from "react";
import io, {Socket} from "socket.io-client";
export const title = "東亜ソフト業務管理ソフト";
import { useRouter } from "next/navigation";

export const subTitle = [
  { tabTitle: "通常業務", url: "/pages/top/business" },
  { tabTitle: "出張", url: "" },
  { tabTitle: "各種フォルダ", url: "" },
  { tabTitle: "WEBリンク", url: "" },
  { tabTitle: "各種帳票", url: "" },
  { tabTitle: "マスタ保守", url: "/pages/top/master" },
];

var socket:Socket;
const sessions = require("../../../src/lib/sessions")

const TopPage = () => {
  const [data, setData]:any = useState([])
  // const router = useRouter();

  useEffect(() => { 
    
    socket = sessions.connectSession();
    sessions.socketInitializer(socket);

    socket.on("session_found", msg => {
      if(msg === true){
        setData({socket: socket, session_found: msg})
      }else{
        location.href = "/pages/login";
        // router.push("/pages/login")
      }
    })
    
  }, [])

  if(data?.session_found === true){
    return (
      <>
        <Navigation title={title} subTitles={subTitle} label="ログオフ"  socket={data.socket}/>
      </>
    );
  }
  return(
    <>
    </>
   )
  
};

export default TopPage;
