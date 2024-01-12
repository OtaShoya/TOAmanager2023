// ↓ 2023-1013 new page
"use client";

import { useForm } from "react-hook-form";
import { Socket } from "socket.io-client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import BasicModal from "@/components/atmos/Modal";

function _arrayBufferToBase64(buffer: any) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

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

const EditPage = ({ socket, uid, onClose }: any) => {
  const { handleSubmit, register } = useForm<DataType>();
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<File[]>([]);
  const [photoSrc, setPhotoSrc] = useState("");
  const documentRef = useRef<HTMLInputElement>(null);
  const onDocumentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files == null) return;
      setPhoto([]);
      const documents = Array.from(e.target.files);
      setPhoto((current) => current.concat(documents));
      if (documentRef.current) documentRef.current.value = "";
      console.log(e.target.files);
      if (e.target.files.length > 0) {
        e.target.files[0].arrayBuffer().then((v) => {
          setPhotoSrc("data:image/jpg;base64," + _arrayBufferToBase64(v));
        });
      }
    },
    []
  );
  const delFunction = () => {
    const r = async () => {
      const res = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        body: JSON.stringify({
          type: "shain-delete",
          id: uid,
        }),
      });
    };
    r();
    onClose();
    setOpen(false);
  };

  const onSubmit = (data: DataType) => {
    console.log(photo);

    if (photo.length > 0) {
      photo[0].arrayBuffer().then(
        (v) => {
          console.log(_arrayBufferToBase64(v));
        }
        //data:image/jpg;base64,
      );
    }

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

    const ei = async () => {
      let s = await photo[0].arrayBuffer().then((v) => {
        return _arrayBufferToBase64(v);
      });

      socket.emit("shain-update", {
        sessionID: localStorage.getItem("sessionID"),
        userID: localStorage.getItem("userID"),

        id: uid,

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
  
        // shashin: s,
      });
    };

    ei();
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

  useEffect(() => {
    const r = async () => {
      const res = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        body: JSON.stringify({
          type: "shain-get",
          id: uid,
        }),
      });
      let s = await res.json();
      if (s?.user) {
        setIdValue(s?.user?.bango);
        setPassValue(s?.user?.password);
        setNameValue(s?.user?.shimei);
        setFuriganaValue(s?.user?.furigana);
        setDepartmentValue(s?.user?.busho_id);

        setClassValue(s?.user?.shain_kubun_id);
        setGroupValue(s?.user?.kyujitsu_group_id);
        setPostValue(s?.user?.yakushoku_id);
        setAccountValue(s?.user?.account);
        setMailValue(s?.user?.mail_address);
        setPostalCodeValue(s?.user?.yubin_bango);
        setAddressValue(s?.user?.jyuusho);
        setHomePhoneValue(s?.user?.denwa_bango);
        setTelephoneValue(s?.user?.keitai_bango);

        console.log(s?.user?.shashin);
        // setPhotoSrc( "data:image/jpg;base64," + _arrayBufferToBase64(s?.user?.shashin) );
        // s?.user?.shashin.arrayBuffer().then( (v:any)=>{

        //
        // })
      }
    };

    r();
  }, []);

  return (
    <form className="edit-base" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="edit-title">社員登録</h1>
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
      <div className="flex justify-center space-x-8 mt-4">
        <button className="mt-2 edit-entry-button" type="submit">
          登録
        </button>
        {/* ↓ 2023-1013 Add Modal */}
        <button
          className="mt-2 text-white bg-red-500 hover:bg-red-800 border rounded-lg w-20 py-2"
          onClick={handleOpen}
        >
          削除
        </button>
        <BasicModal
          text="削除します。よろしいですか？"
          label1="キャンセル"
          label2="削除"
          open={open}
          setOpen={setOpen}
          doAction={delFunction}
        />
      </div>
    </form>
  );
};

export default EditPage;
