// ↓ 2023-1013 new page
"use client";

import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Box, Button, FormControl, InputLabel, Select } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
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
  const { control, handleSubmit, register } = useForm<DataType>();
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
    <div className="flex justify-center">
      <div className="grid gap-y-8 w-1/2">
        <h1 className="text-5xl text-center my-16">社員登録</h1>
        {/* ↓社員番号、パスワード */}
        <div className="flex justify-between">
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
        <div className="flex justify-between">
          <label className="edit-label flex flex-col">
            ドキュメントフォルダ
            <img src={photoSrc} alt="" />
            <input className="edit-form" value={photo[0]?.name} />
          </label>
          <Button
            className="ml-4 min-[1940px]:h-14 h-10"
            component="label"
            variant="contained"
            onClick={() => documentRef.current?.click()}
            startIcon={<CloudUploadIcon />}
          >
            UPLOAD FILE
          </Button>
          <input
            hidden
            ref={documentRef}
            type="file"
            //multiple
            onChange={onDocumentChange}
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
                <InputLabel htmlFor="grouped-class-select">社員区分</InputLabel>
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
                  <option value={5}>なし</option>
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
        <div className="flex justify-between">
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
        <div className="flex justify-between">
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
          {/* ↓ 2023-1013 Add Modal */}
          <button
            className="border border-rose-600 rounded hover:bg-slate-100 text-rose-600 text-sm w-16"
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
      </div>
    </div>
  );
};

export default EditPage;
