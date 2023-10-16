// ↓ 2023-1013 new page
"use client";

import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Box, Button, FormControl, InputLabel, Select } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import BasicModal from "@/components/atmos/Modal";
import { widthGroup } from "../../../business/WorkReportEntry/component/Edit";



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

const AddPage = ({socket, onClose}:any) => {
  const { control, handleSubmit } = useForm<DataType>();
  const [open, setOpen] = useState(false);

  const onSubmit = (data: DataType) => {
    console.log(data);

    let idIput: any = document.querySelector("input[name='ID']");
    let passInput: any = document.querySelector("input[name='pass']");
    let nameInput: any = document.querySelector("input[name='name']");
    let furinaganaInput: any = document.querySelector("input[name='Furigana']");

    let departmentInput: any = document.querySelector(
      "select[name='department']"
    );
    let classInput: any = document.querySelector("select[name='class']");
    let postInput: any = document.querySelector("select[name='post']");
    let groupInput: any = document.querySelector("select[name='group']");

    let accountInput: any = document.querySelector("input[name='acount']");
    let mailInput: any = document.querySelector("input[name='mail']");
    let postalCodeInput: any = document.querySelector(
      "input[name='postalCode']"
    );
    let addressInput: any = document.querySelector("input[name='address']");
    let homePhoneInput: any = document.querySelector("input[name='homePhone']");
    let telephoneInput: any = document.querySelector("input[name='telhone']");

    socket.emit("shain-add", {
      sessionID: localStorage.getItem("sessionID"),
      userID: localStorage.getItem("userID"),

      bango: idIput.value,
      password: passInput.value,
      shimei: nameInput.value,
      furigana: furinaganaInput.value,

      bushoId: departmentInput.value,
      shainKubunId: classInput.value,
      yakushokuId: groupInput.value,
      kyujitsuGroupId: postInput.value,

      account: accountInput.value,
      mailAddress: mailInput.value,
      yubinBango: postalCodeInput.value,
      jyuusho: addressInput.value,
      denwaBango: homePhoneInput.value,
      keitaiBango: telephoneInput.value,
    });

    // onClose()
  };

  const handleOpen = () => {
    setOpen(true);
  };

  let loaded: boolean = false;
  const [idValue, setIdValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [furiganaValue, setFuriganaValue] = useState("");
  const [departmentValue, setDepartmentValue] = useState("");

  const [classValue, setClassValue] = useState("");
  const [groupValue, setGroupValue] = useState("");
  const [postValue, setPostValue] = useState("");
  const [accountValue, setAccountValue] = useState("");
  const [mailValue, setMailValue] = useState("");
  const [postalCodeValue, setPostalCodeValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [homePhoneValue, setHomePhoneValue] = useState("");
  const [telephoneValue, setTelephoneValue] = useState("");

  return (
    <Box sx={{ width: widthGroup.drawer }}>
      <div className="flex justify-center">
        <div className="grid gap-y-8 w-1/2">
          <h1 className="text-5xl text-center my-16">社員登録</h1>
          {/* ↓社員番号、パスワード */}
          <div className="flex flex-row justify-between">
            <Controller
              name="ID"
              control={control}
              render={({ field }) => (
                <TextField
                  label="社員番号"
                  {...field}
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                />
              )}
            />
            <Controller
              name="pass"
              control={control}
              render={({ field }) => (
                <TextField
                  label="パスワード"
                  {...field}
                  value={passValue}
                  onChange={(e) => setPassValue(e.target.value)}
                />
              )}
            />
          </div>
          {/* ↓氏名、フリガナ、部署 */}
          <div className="flex flex-col gap-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  label="氏名"
                  {...field}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
              )}
            />
            <Controller
              name="Furigana"
              control={control}
              render={({ field }) => (
                <TextField
                  label="ふりがな"
                  {...field}
                  value={furiganaValue}
                  onChange={(e) => setFuriganaValue(e.target.value)}
                />
              )}
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
                    id="grouped-department-select"
                    {...field}
                    value={departmentValue}
                    onChange={(e) => setDepartmentValue(e.target.value)}
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
                    value={classValue}
                    onChange={(e) => setClassValue(e.target.value)}
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
                    id="grouped-post-select"
                    {...field}
                    value={postValue}
                    onChange={(e) => setPostValue(e.target.value)}
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
                    value={groupValue}
                    onChange={(e) => setGroupValue(e.target.value)}
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
          {/* ↓アカウント、メールアドレス*/}
          <div className="flex flex-col gap-y-4">
            <Controller
              name="acount"
              control={control}
              render={({ field }) => (
                <TextField
                  label="アカウント"
                  {...field}
                  value={accountValue}
                  onChange={(e) => setAccountValue(e.target.value)}
                />
              )}
            />
            <Controller
              name="mail"
              control={control}
              render={({ field }) => (
                <TextField
                  label="メールアドレス"
                  {...field}
                  value={mailValue}
                  onChange={(e) => setMailValue(e.target.value)}
                />
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
                  <TextField
                    label="郵便番号"
                    {...field}
                    value={postalCodeValue}
                    onChange={(e) => setPostalCodeValue(e.target.value)}
                  />
                )}
              />
            </div>
            <div className="w-4/5">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="住所"
                    fullWidth
                    {...field}
                    value={addressValue}
                    onChange={(e) => setAddressValue(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
          {/* ↓電話番号、携帯番号 */}
          <div className="flex flex-row justify-between">
            <Controller
              name="homePhone"
              control={control}
              render={({ field }) => (
                <TextField
                  label="電話番号"
                  {...field}
                  value={homePhoneValue}
                  onChange={(e) => setHomePhoneValue(e.target.value)}
                />
              )}
            />
            <Controller
              name="telhone"
              control={control}
              render={({ field }) => (
                <TextField
                  label="携帯番号"
                  {...field}
                  value={telephoneValue}
                  onChange={(e) => setTelephoneValue(e.target.value)}
                />
              )}
            />
          </div>
          {/* ↓ボタン */}
          <div className="flex justify-center space-x-8">
            <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
              登録
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default AddPage;
