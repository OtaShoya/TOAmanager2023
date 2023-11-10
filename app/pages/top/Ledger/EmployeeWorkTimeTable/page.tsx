"use client";

import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import { Socket } from "socket.io-client";

var socket: Socket;

type DataType = {
  user: string;
  busho: string;
  Date1: string;
  Date2: string;
};

const labelDesign = "text-white text-2xl justify-self-end";
const formDesign =
  "border rounded-full h-12 w-64 ml-4 p-5 text-center text-[#556593] bg-white";

const Page = () => {
  const { register, handleSubmit } = useForm<DataType>();

  const onSubmit = (data: DataType) => {
    console.log(data);
  };

  return (
    <div className="flex flex-row h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">
            社員別作業時間集計表
          </h1>
          <LoginAvatar imgLabel="" imgUrl="" loginId="adachi" socket={socket} />
        </div>
        {/* ↓フォーム */}
        <form
          className="flex flex-col items-center mt-24"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="border rounded-md min-[1940px]:w-1/5 w-2/5 p-5 space-y-8 my-14">
            <div className="flex h-10">
              <div className="w-1/4">
                <div className="text-center text-white text-2xl">対象日</div>
              </div>
              <div className="w-3/4 flex justify-between items-center">
                <input
                  type="date"
                  className="h-full rounded-lg px-1"
                  {...register("Date1")}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>

                <input
                  type="date"
                  className="h-full rounded-lg px-1"
                  {...register("Date2")}
                />
              </div>
            </div>
            <div className="flex items-center h-10">
              <div className="text-center text-white text-2xl w-1/4">社員</div>
              <input
                className="w-3/4 h-full rounded-lg"
                {...register("user")}
              />
            </div>
            <div className="flex items-center h-10">
              <div className="text-center text-white text-2xl w-1/4">部署</div>
              <input
                className="w-3/4 h-full rounded-lg"
                {...register("busho")}
              />
            </div>
          </div>
          <button
            type="submit"
            className="border bg-white rounded-full hover:bg-slate-100 justify-self-center h-16 px-5 mt-4 text-[#556593] text-xl font-semibold"
          >
            社員別作業時間集計表作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
