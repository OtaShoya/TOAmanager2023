"use client";

import ExitButton from "@/components/molecule/ExitButton";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Select, InputLabel, FormControl } from "@mui/material";

const sessions = require("@/src/lib/sessions");
let socket: Socket;

type DataType = {
  user: string;
  TargetDate: any;
};



const initialDate = new Date();

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

function saveByteArray(byte:Uint8Array, fileName:string) {
  var blob = new Blob([byte], {type: "application/xlsx"});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  // var fileName = "test.xlsx";
  link.download = fileName;
  link.click();
};



function downloadClick(){

  let shainSelect:any = document.getElementById("grouped-shain-select");
  let dateInput:any = document.getElementById("bDate");
  socket.emit("download-week", 
  {
    sessionID: localStorage.getItem("sessionID"),
    userID: localStorage.getItem("userID"),
    name: shainSelect.children[shainSelect.selectedIndex].text,
    tgDate: dateInput.value,
    id: shainSelect.value
  })
}

const Page = () => {
  const { register, handleSubmit, control } = useForm<DataType>({
    defaultValues: {
      TargetDate: initialDate,
    },
  });
  const [datas, setDatas]= useState([{ shimei: "　　　", bushoId: "", yakushokuId: "", kyujitsuGroupId: "", id: "" }]);
  const loadShainList = async () => {
    const res = await fetch("http://localhost:3000/api/db", {
      method: "POST",
      body: JSON.stringify({
        type: "shain-list",
      }),
    });

    let resObj = await res.json();

    if(resObj){
      setDatas(resObj.shainList);
    }
    
  }

  const onSubmit = (data: DataType) => {
    console.log(data);
  };
  useEffect(() => {
    socket = sessions.connectSession();

    sessions.socketInitializer(socket);

    socket.on("download", msg =>{
      let shainSelect:any = document.getElementById("grouped-shain-select");
      let dateInput:any = document.getElementById("bDate");
      saveByteArray(base64ToArrayBuffer(msg), shainSelect.children[shainSelect.selectedIndex].text + " - " + dateInput.value + ".xlsx");
    });
    loadShainList();
  }, []);
  return (
    <div className="p-2.5">
      <div>
        <ExitButton />
      </div>
      <form
        className="flex flex-col place-items-center gap gap-y-4 mt-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row ">
        <FormControl>
        <InputLabel htmlFor="grouped-shain-select">
        社員
                  </InputLabel>
          <Select  native
                  label="社員"
                  id="grouped-shain-select"
                  >
                          <option aria-label="None" />
                          {datas.map((data, index) => {
                            return (
                              
                              <option value={data.id} key={index}> {data.shimei} </option>
                              
                            )
                          })}
          </Select>
        </FormControl>
        </div>
        <div className="flex flex-row">
          <label>対象日:</label>
          {/* <input type="text" className="border" {...register("TargetDate")} /> */}
          <Controller
            control={control}
            name="TargetDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={value}
                onChange={onChange}
                className="border"
                id="bDate"
              />
            )}
          />
        </div>
        <button
          type="submit"
          className="border border-blue-600 rounded-md hover:bg-slate-100 justify-self-center w-48 h-16 mt-4 text-blue-600"
          onClick={downloadClick}
        >
          週間報告書作成
        </button>
      </form>
    </div>
  );
};

export default Page;
