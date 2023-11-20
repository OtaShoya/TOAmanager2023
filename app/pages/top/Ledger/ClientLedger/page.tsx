"use client";

import "react-datepicker/dist/react-datepicker.css";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import { Socket } from "socket.io-client";
import CheckBox from "@/components/atmos/CheckBox";

var socket: Socket;

const Page = () => {
  const changeHandler = () => {};
  return (
    <div className="flex h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex justify-between">
          <h1 className="text-4xl text-white font-bold">顧客台帳</h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
        </div>
        {/* ↓フォーム */}
        <form className="flex flex-col items-center mt-24">
          <CheckBox label="担当者も表示" onchange={changeHandler} />
          <button
            type="submit"
            className="border bg-white rounded-full hover:bg-slate-100 justify-self-center w-48 h-16 mt-4 text-[#556593] text-xl font-semibold"
          >
            顧客台帳作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
