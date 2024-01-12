// ↓ 2023-1013 new page
"use client";

import { useForm } from "react-hook-form";
import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { AnyAaaaRecord } from "dns";

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

const AddPage = ({ socket, onClose }: any) => {
  const { handleSubmit, register } = useForm<DataType>();

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
      yakushokuId: postInput.value,
      kyujitsuGroupId: groupInput.value,

      account: accountInput.value,
      mailAddress: mailInput.value,
      yubinBango: postalCodeInput.value,
      jyuusho: addressInput.value,
      denwaBango: homePhoneInput.value,
      keitaiBango: telephoneInput.value,
    });

    // onClose()
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
    <form className="edit-base" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="edit-title">社員登録</h1>
      {/* ↓社員番号、パスワード */}
      <div className="flex justify-between">
        <label className="text-white flex flex-col">
          社員番号
          <input
            className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={idValue}
            {...register("ID")}
            onChange={(e) => setIdValue(e.target.value)}
          />
        </label>
        <label className="text-white flex flex-col">
          パスワード
          <input
            className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={passValue}
            {...register("pass")}
            onChange={(e) => setPassValue(e.target.value)}
          />
        </label>
      </div>
      <div className="flex flex-col gap-y-4">
        {/* 氏名 */}
        <label className="text-white flex flex-col">
          氏名
          <input
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={nameValue}
            {...register("name")}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </label>
        {/* ふりがな */}
        <label className="text-white flex flex-col">
          ふりがな
          <input
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={furiganaValue}
            {...register("Furigana")}
            onChange={(e) => setFuriganaValue(e.target.value)}
          />
        </label>
        {/* 部署 */}
        <label className="text-white flex flex-col">
          部署
          <select
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            {...register("department")}
            value={departmentValue}
            onChange={(e) => setDepartmentValue(e.target.value)}
          >
            <option aria-label="None" />
            <option value={1}>システム開発部</option>
            <option value={2}>営業部</option>
            <option value={3}>ビジネスサポート部 リレーショングループ</option>
            <option value={4}>ビジネスサポート部 ユースウェア</option>
            <option value={5}>ビジネスサポート部 技術部</option>
            <option value={5}>ビジネスサポート部 業務部</option>
          </select>
        </label>
        {/* 社員区分 */}
        <label className="text-white flex flex-col">
          社員区分
          <select
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            {...register("class")}
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
          >
            <option aria-label="None" />
            <option value={1}>正社員</option>
            <option value={2}>契約社員</option>
            <option value={3}>派遣社員</option>
            <option value={4}>アルバイト</option>
            <option value={5}>インターシップ</option>
          </select>
        </label>
        {/* 役職 */}
        <label className="text-white flex flex-col">
          役職
          <select
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            {...register("post")}
            value={postValue}
            onChange={(e) => setPostValue(e.target.value)}
          >
            <option aria-label="None" />
            <option value={1}>常務</option>
            <option value={2}>部長</option>
            <option value={3}>マネージャー</option>
            <option value={4}>主任</option>
            <option value={5}>なし</option>
          </select>
        </label>
        {/* 休日グループ */}
        <label className="text-white flex flex-col">
          休日グループ
          <select
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            {...register("group")}
            value={groupValue}
            onChange={(e) => setGroupValue(e.target.value)}
          >
            <option aria-label="None" />
            <option value={1}>Aグループ</option>
            <option value={2}>Bグループ</option>
            <option value={3}>運用Aグループ</option>
            <option value={4}>運用Bグループ</option>
            <option value={5}>その他</option>
          </select>
        </label>
        {/* アカウント */}
        <label className="text-white flex flex-col">
          アカウント
          <input
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={accountValue}
            {...register("acount")}
            onChange={(e) => setAccountValue(e.target.value)}
          />
        </label>
        {/* メールアドレス */}
        <label className="text-white flex flex-col">
          メールアドレス
          <input
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={mailValue}
            {...register("mail")}
            onChange={(e) => setMailValue(e.target.value)}
          />
        </label>
      </div>
      {/* ↓郵便番号、住所 */}
      <div className="flex gap-x-4">
        <div className="w-1/5">
          <label className="text-white flex flex-col">
            郵便番号
            <input
              className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              type="text"
              value={postalCodeValue}
              {...register("postalCode")}
              onChange={(e) => setPostalCodeValue(e.target.value)}
            />
          </label>
        </div>
        <div className="w-4/5">
          <label className="text-white flex flex-col">
            住所
            <input
              className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              type="text"
              value={addressValue}
              {...register("address")}
              onChange={(e) => setAddressValue(e.target.value)}
            />
          </label>
        </div>
      </div>
      {/* ↓電話番号、携帯番号 */}
      <div className="flex gap-x-4">
        <label className="text-white flex flex-col">
          電話番号
          <input
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={homePhoneValue}
            {...register("homePhone")}
            onChange={(e) => setHomePhoneValue(e.target.value)}
          />
        </label>
        <label className="text-white flex flex-col">
          携帯番号
          <input
            className="min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
            type="text"
            value={telephoneValue}
            {...register("telhone")}
            onChange={(e) => setTelephoneValue(e.target.value)}
          />
        </label>
      </div>
      {/* ↓ボタン */}
      <div className="flex justify-center">
        <button
          className="mt-10 text-[#556593] hover:text-white bg-white hover:bg-[#556593] border hover:border-white rounded-lg w-20 py-2"
          type="submit"
        >
          登録
        </button>
      </div>
    </form>
  );
};

export default AddPage;
