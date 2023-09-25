"use client";

import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useState } from "react";

type DataType = {
  ID: string;
  pass: string;
  name: string;
  Furigana: string /*ふりがな*/;
  department: string /*部署*/;
  class: string /*社員区分*/;
  post: string /*役職*/;
  group: string /*グループ*/;
  date1: string /*入社日*/;
  date2: string /*退職日*/;
  acount: string /*アカウント*/;
  mail: string /*メールアドレス*/;
  postalCode: string /*郵便番号*/;
  address: string /*住所*/;
  homePhone: string /*電話番号*/;
  perPhone: string /*携帯番号*/;
};

const SyainTouroku = () => {
  const { control, handleSubmit } = useForm<DataType>();
  const [text, setText] = useState("");

  const onSubmit = (data: DataType) => {
    console.log(data);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <h1>社員登録</h1>
      <div>
        <Controller
          name="ID"
          control={control}
          render={({ field }) => <TextField label="社員番号" {...field} />}
        />
        <Controller
          name="pass"
          control={control}
          render={({ field }) => <TextField label="パスワード" {...field} />}
        />
      </div>
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextField label="氏名" {...field} />}
        />
        <Controller
          name="Furigana"
          control={control}
          render={({ field }) => <TextField label="ふりがな" {...field} />}
        />
      </div>
      <div></div>
      <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
        編集する
      </Button>
    </div>
  );
};

export default SyainTouroku;
