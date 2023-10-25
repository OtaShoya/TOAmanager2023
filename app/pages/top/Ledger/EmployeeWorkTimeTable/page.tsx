"use client";

import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import LoginAvatar from "@/components/atmos/Avatar";
import { Socket } from "socket.io-client";

var socket: Socket;

type DataType = {
  user: string;
  TargetDate: any;
};

const labelDesign = "text-white text-2xl";
const formDesign =
  "border rounded-full h-12 w-64 ml-4 p-5 text-center text-[#556593] bg-white";

const initialDate = new Date();

const Page = () => {
  const { register, handleSubmit, control } = useForm<DataType>({
    defaultValues: {
      TargetDate: initialDate,
    },
  });

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
          <div className="flex flex-col place-items-start space-y-4 border rounded-lg py-10 px-40">
            <div className="flex flex-row">
              <label className={labelDesign}>
                対象日
                <input type="date" className={formDesign} />
                <input type="date" className={formDesign} />
              </label>
            </div>
            <label className={labelDesign}>
              社員
              <input type="text" className={formDesign} {...register("user")} />
            </label>
            <label className={labelDesign}>
              部署
              <input
                type="date"
                className={formDesign}
                {...register("TargetDate")}
              />
            </label>
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
