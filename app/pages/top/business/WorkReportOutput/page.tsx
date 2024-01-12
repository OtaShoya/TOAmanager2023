"use client";

import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import Navigation from "@/components/atmos/Sidebar";
import LoginAvatar from "@/components/atmos/Avatar";
import { Socket } from "socket.io-client";

var socket: Socket;
const sessions = require("@/src/lib/sessions");

type DataType = {
  user: string;
  TargetDate: any;
};

const labelDesign = "text-white text-2xl";
const formDesign =
  "border rounded-full h-12 w-64 ml-4 px-5 text-center text-[#556593] bg-white";

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const initialDate = `${year}-${month}-${day}`;

function base64ToArrayBuffer(base64: string) {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

function saveByteArray(byte: Uint8Array, fileName: string) {
  var blob = new Blob([byte], { type: "application/xlsx" });
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  // var fileName = "test.xlsx";
  link.download = fileName;
  link.click();
}

function downloadClick() {
  let shainSelect: any = document.getElementById("grouped-shain-select");
  let dateInput: any = document.getElementById("bDate");
  socket.emit("download-week", {
    sessionID: localStorage.getItem("sessionID"),
    userID: localStorage.getItem("userID"),
    name: shainSelect.children[shainSelect.selectedIndex].text,
    tgDate: dateInput.value,
    id: shainSelect.value,
  });
}

const Page = () => {
  const { register, handleSubmit, control } = useForm<DataType>({
    defaultValues: {
      TargetDate: initialDate,
    },
  });
  const [datas, setDatas] = useState([
    {
      shimei: "　　　",
      bushoId: "",
      yakushokuId: "",
      kyujitsuGroupId: "",
      id: "",
    },
  ]);
  const loadShainList = async () => {
    const res = await fetch("http://localhost:3000/api/db", {
      method: "POST",
      body: JSON.stringify({
        type: "shain-list",
      }),
    });

    let resObj = await res.json();

    if (resObj) {
      setDatas(resObj.shainList);
    }
  };

  const onSubmit = (data: DataType) => {
    console.log(data);
  };
  useEffect(() => {
    socket = sessions.connectSession();

    sessions.socketInitializer(socket);

    socket.on("download", (msg) => {
      let shainSelect: any = document.getElementById("grouped-shain-select");
      let dateInput: any = document.getElementById("bDate");
      saveByteArray(
        base64ToArrayBuffer(msg),
        shainSelect.children[shainSelect.selectedIndex].text +
          " - " +
          dateInput.value +
          ".xlsx"
      );
    });
    loadShainList();
  }, []);
  return (
    <div className="page-base">
      <Navigation />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">作業報告出力</h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
        </div>
        {/* ↓フォーム */}
        <form
          className="flex flex-col items-center mt-24"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col place-items-end space-y-4 border rounded-lg py-10 px-40">
            <label htmlFor="grouped-shain-select" className={labelDesign}>
              社員
              <select
                id="grouped-shain-select"
                className={formDesign}
                {...register("user")}
              >
                <option aria-label="None" />
                {datas.map((data, index) => {
                  return (
                    <option value={data.id} key={index}>
                      {" "}
                      {data.shimei}{" "}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className={labelDesign}>
              対象日
              <input
                type="date"
                className={formDesign}
                id="bDate"
                {...register("TargetDate")}
              />
            </label>
          </div>
          <button
            type="submit"
            className="border bg-white rounded-full hover:bg-slate-100 justify-self-center w-48 h-16 mt-4 text-[#556593] text-xl font-semibold"
            onClick={downloadClick}
          >
            週間報告書作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
