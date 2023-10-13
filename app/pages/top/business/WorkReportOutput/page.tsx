"use client";

import ExitButton from "@/components/molecule/ExitButton";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DataType = {
  user: string;
  TargetDate: any;
};

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
    <div className="p-2.5">
      <div>
        <ExitButton />
      </div>
      <form
        className="flex flex-col place-items-center gap gap-y-4 mt-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row ">
          <label>社員：</label>
          <input type="text" className="border" {...register("user")} />
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
              />
            )}
          />
        </div>
        <button
          type="submit"
          className="border border-blue-600 rounded-md hover:bg-slate-100 justify-self-center w-48 h-16 mt-4 text-blue-600"
        >
          週間報告書作成
        </button>
      </form>
    </div>
  );
};

export default Page;
