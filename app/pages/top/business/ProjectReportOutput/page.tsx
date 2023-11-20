"use client";

import LoginAvatar from "@/components/atmos/Avatar";
import Navigation, { subTitle } from "@/components/atmos/Drawer";
import { useForm } from "react-hook-form";
import { Socket } from "socket.io-client";

var socket: Socket;

type DataType = {
  Project: string;
  TargetDate: any;
};

const labelDesign = "text-white text-2xl flex items-center";
const formDesign =
  "border rounded-full h-12 w-64 ml-4 p-5 text-center text-[#556593] bg-white";

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const initialDate = `${year}-${month}-${day}`;

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
    <div className="flex h-screen p-10 bg-[#556593]">
      <Navigation subTitles={subTitle} />
      <div className="w-full ml-5 p-12 space-y-10 rounded-lg bg-white/[.07]">
        {/* ↓ページタイトルとログイン情報 */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl text-white font-bold">
            プロジェクト報告書出力
          </h1>
          <LoginAvatar imgLabel="" imgUrl="" socket={socket} />
        </div>
        {/* ↓フォーム */}
        <form
          className="flex flex-col items-center mt-24"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col place-items-end space-y-4 border rounded-lg py-10 px-40">
            <label className={labelDesign}>
              プロジェクト
              <select className={formDesign} {...register("Project")}>
                <option value="aaaaa">aaaaa</option>
              </select>
            </label>
            <label className={labelDesign}>
              対象日
              <input
                type="date"
                className={formDesign}
                value={initialDate}
                {...register("TargetDate")}
              />
            </label>
          </div>
          <button
            type="submit"
            className="border bg-white rounded-full hover:bg-slate-100 justify-self-center w-48 h-16 mt-4 text-[#556593] text-xl font-semibold"
          >
            週間報告書作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
