"use client";

import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Button, FormControl, InputLabel, Select } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";

type DataType = {
  ID: string;
  pass: string;
  name: string;
  Furigana: string /*ふりがな*/;
  department: number /*部署*/;
  class: number /*社員区分*/;
  post: number /*役職*/;
  group: number /*グループ*/;
  // date1: Date /*入社日*/;
  // date2: Date /*退職日*/;
  acount: string /*アカウント*/;
  mail: string /*メールアドレス*/;
  postalCode: string /*郵便番号*/;
  address: string /*住所*/;
  homePhone: string /*電話番号*/;
  telhone: string /*携帯番号*/;
};

const SyainTouroku = () => {
  const { control, handleSubmit } = useForm<DataType>();
  const router = useRouter();

  const onSubmit = (data: DataType) => {
    console.log(data);
  };

  const clickHandler = () => {
    router.push("/pages/top");
  };

  return (
    <>
      <div>
        <Button
          variant="text"
          startIcon={<ExitToAppIcon />}
          onClick={clickHandler}
        >
          終了
        </Button>
      </div>
      <div className="h-screen w-screen flex justify-center items-center flex-col ">
        <div className="grid gap-y-10">
          <h1 className="text-5xl justify-self-center">社員登録</h1>
          {/* ↓社員番号、パスワード */}
          <div className="flex flex-row justify-between">
            <Controller
              name="ID"
              control={control}
              render={({ field }) => <TextField label="社員番号" {...field} />}
            />
            <Controller
              name="pass"
              control={control}
              render={({ field }) => (
                <TextField label="パスワード" {...field} />
              )}
            />
          </div>
          {/* ↓氏名、フリガナ、部署 */}
          <div className="flex flex-col gap-y-4">
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
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <InputLabel htmlFor="grouped-department-select">
                    部署
                  </InputLabel>
                  <Select
                    native
                    label="部署"
                    id="grouped-class-select"
                    {...field}
                  >
                    <option aria-label="None" />
                    <option value={1}>システム開発部</option>
                    <option value={2}>営業部</option>
                    <option value={3}>
                      ビジネスサポート部 リレーショングループ
                    </option>
                    <option value={4}>ビジネスサポート部 ユースウェア</option>
                    <option value={5}>ビジネスサポート部 技術部</option>
                    <option value={5}>ビジネスサポート部 業務部</option>
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/* ↓社員区分、役職、グループ */}
          <div className="flex flex-col gap-y-4">
            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <InputLabel htmlFor="grouped-class-select">
                    社員区分
                  </InputLabel>
                  <Select
                    native
                    label="社員区分"
                    id="grouped-class-select"
                    {...field}
                  >
                    <option aria-label="None" />
                    <option value={1}>正社員</option>
                    <option value={2}>契約社員</option>
                    <option value={3}>派遣社員</option>
                    <option value={4}>アルバイト</option>
                    <option value={5}>インターシップ</option>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="post"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <InputLabel htmlFor="grouped-post-select">役職</InputLabel>
                  <Select
                    native
                    label="役職"
                    id="grouped-class-select"
                    {...field}
                  >
                    <option aria-label="None" />
                    <option value={1}>常務</option>
                    <option value={2}>部長</option>
                    <option value={3}>マネージャー</option>
                    <option value={4}>主任</option>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <InputLabel htmlFor="grouped-rest-select">
                    休日グループ
                  </InputLabel>
                  <Select
                    native
                    label="休日グループ"
                    id="grouped-rest-select"
                    {...field}
                  >
                    <option aria-label="None" />
                    <option value={1}>Aグループ</option>
                    <option value={2}>Bグループ</option>
                    <option value={3}>運用Aグループ</option>
                    <option value={4}>運用Bグループ</option>
                    <option value={5}>その他</option>
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/* ↓入社日、退職日 */}
          {/* <div className="flex flex-row gap-x-10">
          <Controller
            name="date1"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoItem label="入社日">
                  <DatePicker {...field} />
                </DemoItem>
              </LocalizationProvider>
            )}
          />
          <Controller
            name="date2"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoItem label="退社日">
                  <DatePicker {...field} />
                </DemoItem>
              </LocalizationProvider>
            )}
          />
        </div> */}
          {/* ↓アカウント、メールアドレス*/}
          <div className="flex flex-col gap-y-4">
            <Controller
              name="acount"
              control={control}
              render={({ field }) => (
                <TextField label="アカウント" {...field} />
              )}
            />
            <Controller
              name="mail"
              control={control}
              render={({ field }) => (
                <TextField label="メールアドレス" {...field} />
              )}
            />
          </div>
          {/* ↓郵便番号、住所 */}
          <div className="flex flex-row justify-between">
            <div className="w-1/5">
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <TextField label="郵便番号" {...field} />
                )}
              />
            </div>
            <div className="w-4/5">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField label="住所" fullWidth {...field} />
                )}
              />
            </div>
          </div>
          {/* ↓電話番号、携帯番号 */}
          <div className="flex flex-row justify-between">
            <Controller
              name="homePhone"
              control={control}
              render={({ field }) => <TextField label="電話番号" {...field} />}
            />
            <Controller
              name="telhone"
              control={control}
              render={({ field }) => <TextField label="携帯番号" {...field} />}
            />
          </div>
          <div className="flex justify-around">
            <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
              登録
            </Button>
            <button className="border border-rose-600 rounded hover:bg-slate-100 text-rose-600 text-sm w-16">
              削除
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyainTouroku;
