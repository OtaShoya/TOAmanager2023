"use client";
import { Button } from "@mui/material";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback, useRef, useState } from "react";

type FormType = {
  custmer: string;
  route: string;
  pic: string;
  state: string;
  projectNo: string;
  projectPar: string;
  projectName: string;
  projectSummary: string;
  projectGoal: string;
  budget: string;
  costs1: string;
  expenses: string;
  scheduledDate: string;
  startDate: string;
  endDate: string;
  memo: string;
  file1: string;
  file2: string;
  form1: {
    projectMenber: string;
  }[];
  form2: {
    task: string;
    work: string;
    start: string;
    finish: string;
    costs: string;
  }[];
};

const menbers = ["太田翔哉", "chiago"];
const taskItems = ["A", "B", "C"];

const EditPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [document, setDocument] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, register } = useForm<FormType>({
    defaultValues: {
      form1: [{ projectMenber: "" }],
      form2: [
        {
          task: "",
          work: "",
          start: "",
          finish: "",
          costs: "",
        },
      ],
    },
  });

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files == null) return;
      setFiles([]);
      const files = Array.from(e.target.files);
      setFiles((current) => current.concat(files));
      if (inputRef.current) inputRef.current.value = "";
    },
    []
  );

  const onDocumentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files == null) return;
      setDocument([]);
      const documents = Array.from(e.target.files);
      setDocument((current) => current.concat(documents));
      if (documentRef.current) documentRef.current.value = "";
    },
    []
  );

  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log(data);
  };

  const {
    fields: form1,
    append: form1Append,
    remove: form1Remove,
  } = useFieldArray({
    name: "form1",
    control,
  });

  const {
    fields: form2,
    append: form2Append,
    remove: form2Remove,
  } = useFieldArray({
    name: "form2",
    control,
  });

  return (
    <form
      className="px-8 pb-8 bg-[#556593] min-[1940px]:h-full h-max"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="edit-title">プロジェクト詳細</h1>
      <div className="flex flex-col space-y-5">
        {/* フォーム1 */}
        <div className="flex justify-between">
          <label className="edit-label flex flex-col">
            顧客
            <select className="edit-form" {...register("custmer")}>
              <option value="">123456789</option>
            </select>
          </label>
          <label className="edit-label flex flex-col">
            受注ルート
            <select className="edit-form" {...register("route")}>
              <option value="">123456789</option>
            </select>
          </label>
          <label className="edit-label flex flex-col">
            営業担当
            <select className="edit-form" {...register("pic")}>
              <option value="">123456789</option>
            </select>
          </label>
          <label className="edit-label flex flex-col">
            状態
            <select className="edit-form" {...register("state")}>
              <option value="">123456789</option>
            </select>
          </label>
        </div>
        <div className="flex">
          {/* フォーム2 */}
          <div className="flex flex-col space-y-5 w-3/4 mr-3">
            <label className="edit-label flex flex-col">
              プロジェクト番号
              <input className="edit-form" {...register("projectNo")} />
            </label>
            <label className="edit-label flex flex-col">
              親プロジェクト
              <select
                className="edit-form"
                {...register("projectPar")}
              ></select>
            </label>
            <label className="edit-label flex flex-col">
              プロジェクト名
              <select
                className="edit-form"
                {...register("projectName")}
              ></select>
            </label>
            <label className="edit-label flex flex-col">
              プロジェクト概要
              <select
                className="edit-form"
                {...register("projectSummary")}
              ></select>
            </label>
            <label className="edit-label flex flex-col">
              プロジェクト目標
              <select
                className="edit-form"
                {...register("projectGoal")}
              ></select>
            </label>
            <div className="flex justify-between">
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                予算
                <input className="edit-form" {...register("budget")} />
              </label>
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                工数
                <input className="edit-form" {...register("costs1")} />
              </label>
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                経費
                <input className="edit-form" {...register("expenses")} />
              </label>
            </div>
            <div className="flex justify-between">
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                本稼働予定日
                <input className="edit-form" />
              </label>
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                開始日
                <input className="edit-form" />
              </label>
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                終了日
                <input className="edit-form" />
              </label>
            </div>
            <label className="edit-label flex flex-col">
              メモ（状況及び今後の予定）
              <input className="border rounded text-black h-32" />
            </label>
            <div className="flex items-end">
              <label className="edit-label flex flex-col">
                見積りファイル
                <input
                  type="text"
                  className="border min-[1940px]:h-14 h-10 text-black rounded p-1"
                  value={files[0]?.name}
                />
              </label>
              <Button
                className="ml-4 min-[1940px]:h-14 h-10"
                component="label"
                variant="contained"
                onClick={() => inputRef.current?.click()}
                startIcon={<CloudUploadIcon />}
              >
                UPLOAD FILE
              </Button>
              <input
                hidden
                ref={inputRef}
                type="file"
                //multiple
                onChange={onFileInputChange}
              />
            </div>
            <div className="flex items-end">
              <label className="edit-label flex flex-col">
                ドキュメントフォルダ
                <input className="edit-form" value={document[0]?.name} />
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
          </div>
          {/* ↓プロジェクトメンバー */}
          <div className="w-1/4">
            <label className="text-white place-items-center justify-self-center">
              プロジェクトメンバー
            </label>
            <div className="w-auto p-2 flex flex-col gap-y-2 border">
              {form1.map((form, index) => (
                <div className="flex" key={form.id}>
                  <select
                    {...register(`form1.${index}.projectMenber`)}
                    className="w-full"
                  >
                    {menbers.map((menber: string, i) => (
                      <option value={i} key={i}>
                        {menber}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => form1Remove(index)}
                    className="text-white bg-indigo-600 w-12 inline-flex items-center justify-center border"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  form1Append({
                    projectMenber: "",
                  })
                }
                className="text-white bg-indigo-600 rounded w-20 py-1 place-self-center"
              >
                追加
              </button>
            </div>
          </div>
        </div>
        {/* テーブル */}
        <div>
          <label className="text-white">作業内容</label>
          <div className="w-auto p-2 flex flex-col gap-y-2 border">
            <table>
              <thead>
                <tr>
                  <th className="border min-[1940px]:w-[400px] w-[200px] text-white bg-indigo-600 ">
                    タスク
                  </th>
                  <th className="border min-[1940px]:w-[400px] w-[240px] text-white bg-indigo-600 ">
                    作業内容
                  </th>
                  <th className="border min-[1940px]:w-[150px] w-[100px] text-white bg-indigo-600 ">
                    開始予定日
                  </th>
                  <th className="border min-[1940px]:w-[150px] w-[100px] text-white bg-indigo-600 ">
                    狩猟予定日
                  </th>
                  <th className="border min-[1940px]:w-[150px] w-[100px] text-white bg-indigo-600 ">
                    予定工数
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {form2.map((form, index) => (
                  <tr key={form.id}>
                    <td>
                      <select
                        className="w-full min-[1940px]:h-14 h-10"
                        {...register(`form2.${index}.task`)}
                      >
                        {taskItems.map((item: string, i) => (
                          <option value={i} key={i}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.work`)}
                        className="w-full min-[1940px]:h-14 h-10"
                      />
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.start`)}
                        className="w-full min-[1940px]:h-14 h-10"
                      />
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.finish`)}
                        className="w-full min-[1940px]:h-14 h-10"
                      />
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.costs`)}
                        className="w-full min-[1940px]:h-14 h-10"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => form2Remove(index)}
                        className="text-white bg-indigo-600 w-10 inline-flex items-center justify-center border"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-8 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() =>
                form2Append({
                  task: "",
                  work: "",
                  start: "",
                  finish: "",
                  costs: "",
                })
              }
              className="text-white bg-indigo-600 rounded w-20 py-1 place-self-center"
            >
              追加
            </button>
          </div>
        </div>
        {/* 追加ボタン */}
        <button type="submit" className="edit-entry-button">
          登録
        </button>
      </div>
    </form>
  );
};

export default EditPage;
