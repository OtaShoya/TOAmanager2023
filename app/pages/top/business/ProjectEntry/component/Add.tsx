"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm, SubmitHandler, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  widthGroup,
  textBoxVariant,
} from "../../WorkReportEntry/component/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/src/lib/database";

type FormType = {
  customer: number;
  route: number;
  pic: number;
  state: number;
  projectNo: string;
  projectPar: number;
  projectName: string;
  projectSummary: string;
  projectGoal: string;
  budget: number;
  costs1: number;
  expenses: number;
  scheduledDate: Date;
  startDate: Date;
  endDate: Date;
  memo: string;
  file1: string;
  file2: string;
  forms: {
    projectMember: number;
  }[];
  forms2: {
    task: string;
    work: string;
    start: string;
    finish: string;
    costs: string;
  }[];
};

const taskItems = ["A", "B", "C"];

function refreshShain(){

  setTimeout( ()=>{
    let styleElement = document.getElementById("func-style");

    if(styleElement){
      let styleString = "";
      let memberForm =  document.getElementById("form-member");
      if(memberForm){
        let memberInputs = memberForm.querySelectorAll("input.MuiSelect-nativeInput")
        if(memberInputs.length > 0){
          memberInputs.forEach( ( el, index )=>{
  
            let inputElement:any = el;
            styleString += ".MuiList-root .MuiMenuItem-root[data-value='" + inputElement.value + "']";
            if(index < (memberInputs.length - 1)){
              styleString += ",";
            }
          } )
          styleString += "{display: none;}"
        }
  
      }
  
      styleElement.innerHTML = styleString;

    }
  }, 1 ) 
  
}

const EditPage = ({ socket, members, projectList}:any) => {
  const [files, setFiles] = useState<File[]>([]);
  const [document, setDocument] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, register, reset } = useForm<FormType>({
    defaultValues: {
      // forms: [{ projectMember: 0 }],
      // forms2: [
      //   {
      //     task: "",
      //     work: "",
      //     start: "",
      //     finish: "",
      //     costs: "",
      //   },
      // ],
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
    
    let p:Project = {
      kokyakuId: data.customer,
      jyoutaiId: data.state,
      eigyouTantouId: data.pic,
      jyuchuuRouteId: data.route,
      bangou: data.projectNo,
      oyaProjectId: data.projectPar,
      na: data.projectName,
      gaiyou: data.projectSummary,
      mokuhyou: data.projectGoal,
      yosa: data.budget,
      cousuu: data.costs1,
      keihi: data.expenses,
      honkadouYoteiHi: data.scheduledDate.toDateString(),
      kashibi:  data.startDate.toDateString(),
      shuuryoubi: data.endDate.toDateString(),
      memo: data.memo,
      mitsumoriFile: "",
      documentFolder: "",
      shuuryuHoukoku: "",
    }
    console.log( data.forms);
    socket.emit("project-add", {
      sessionID: localStorage.getItem("sessionID"),
      userID: localStorage.getItem("userID"),
      project: p,
      members: data.forms,
      tasks: data.forms2,
    })


  };

  const {
    fields: forms,
    append: formsAppend,
    remove: formsRemove,
  } = useFieldArray({
    name: "forms",
    control,
  });

  const {
    fields: forms2,
    append: forms2Append,
    remove: forms2Remove,
  } = useFieldArray({
    name: "forms2",
    control,
  });

  // useEffect(()=>{

  //   const r = async () => {

  //     if(loaded){
  //       return;
  //     }

  //   };

  //   r();
    
  // })

  return (
    <Box sx={{ width: widthGroup.drawer, p: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center text-2xl mt-16 my-8">
          新規プロジェクト登録
        </h1>
        <div className="flex justify-end space-x-4">
          {/* <button className="border border-indigo-600 hover:bg-slate-100 rounded-md w-16">
            削除
          </button> */}
          <button
            type="submit"
            className="border border-indigo-600 hover:bg-slate-100 rounded-md w-16"
          >
            登録
          </button>
        </div>
        <div className="border border-indigo-600 p-8 mt-2 flex flex-col space-y-4">
          <div className="flex flex-row justify-center">
            <div className="flex flex-row items-center basis-2/5">
              <label className="text-indigo-600 w-auto">顧客</label>
              <select
                className="border border-indigo-600 ml-2 h-8 w-10/12"
                {...register("customer")}
              >
                <option value="0"></option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
                <option value="4">D</option>
              </select>
            </div>
            <div className="flex flex-row items-center basis-2/6">
              <label className="text-indigo-600">受注ルート</label>
              <select
                className="border border-indigo-600 ml-2 h-8 w-9/12"
                {...register("route")}
              >
                <option value="0"></option>
                <option value="1">123456789</option>
              </select>
            </div>
            <div className="flex flex-row items-center basis-1/6">
              <label className="text-indigo-600">営業担当</label>
              <select
                className="border border-indigo-600 ml-2 h-8 w-1/2"
                {...register("pic")}
              >
                <option value="0"></option>
                {members.map((member: any, i:any) => (
                  <option value={member.id} key={i}>
                    {member.shimei}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row items-center basis-1/6">
              <label className="text-indigo-600">状態</label>
              <select
                className="border border-indigo-600 ml-2 h-8 w-1/2"
                {...register("state")}
              >
                <option value="0"></option>
                <option value="1">123456789</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col space-y-4 w-3/4">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-indigo-600">プロジェクト番号</label>
                  <input
                    className="border border-indigo-600  w-3/4 ml-4 h-8"
                    {...register("projectNo")}
                  />
                </div>
                <div>
                  <label className="text-indigo-600">
                    親プロジェクト&emsp;
                  </label>
                  <select
                    className="border border-indigo-600 w-3/4 ml-4 h-8"
                    {...register("projectPar")}
                  >
                    <option value="0"></option>
                    {projectList.map((project: any, i:any) => (
                      <option value={project.id} key={i}>
                        {project.na}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-indigo-600">
                    プロジェクト名&emsp;
                  </label>
                  <input
                    className="border border-indigo-600 w-3/4 ml-4 h-8"
                    {...register("projectName")}
                  />
                </div>
                <div>
                  <label className="text-indigo-600">プロジェクト概要</label>
                  <input
                    className="border border-indigo-600 w-3/4 ml-4 h-8"
                    {...register("projectSummary")}
                  />
                </div>
                <div>
                  <label className="text-indigo-600">プロジェクト目標</label>
                  <input
                    className="border border-indigo-600 w-3/4 ml-4 h-8"
                    {...register("projectGoal")}
                  />
                </div>
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-row">
                    <label className="text-indigo-600">予算</label>
                    <input
                      className="border border-indigo-600 ml-4"
                      {...register("budget")}
                    />
                  </div>
                  <div className="flex flex-row">
                    <label className="text-indigo-600">工数</label>
                    <input
                      className="border border-indigo-600 ml-4"
                      {...register("costs1")}
                    />
                  </div>
                  <div className="flex flex-row">
                    <label className="text-indigo-600">経費</label>
                    <input
                      className="border border-indigo-600 ml-4"
                      {...register("expenses")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-indigo-600">本稼働予定日</label>
                    <Controller
                      control={control}
                      name="scheduledDate"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          dateFormat="yyyy/MM/dd"
                          selected={value}
                          onChange={onChange}
                          className="border"
                          id="bDate"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-indigo-600">開始日</label>
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          dateFormat="yyyy/MM/dd"
                          selected={value}
                          onChange={onChange}
                          className="border"
                          id="bDate"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-indigo-600">終了日</label>
                    <Controller
                      control={control}
                      name="endDate"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          dateFormat="yyyy/MM/dd"
                          selected={value}
                          onChange={onChange}
                          className="border"
                          id="bDate"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <label className="text-indigo-600">
                  メモ（状況及び今後の予定）
                </label>
                <input className="border border-indigo-600 h-32 w-3/4"></input>
              </div>
              <div className="flex flex-row">
                <label className="text-indigo-600">
                  見積りファイル&emsp;&emsp;&emsp;
                </label>
                <div className="border border-indigo-600 ml-4 w-1/2">
                  {files[0]?.name}
                </div>
                <Button
                  className="ml-4"
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
              <div className="flex flex-row">
                <label className="text-indigo-600">ドキュメントフォルダ</label>
                <div className="border border-indigo-600 ml-4 w-1/2">
                  {document[0]?.name}
                </div>
                <Button
                  className="ml-4"
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
              <label>プロジェクトメンバー</label>
              <div className="w-auto p-2 flex flex-col gap-y-2 border" id="form-member">
                {forms.map((form, index) => (
                  <div className="flex flex-row" key={form.id}>
                    <style id="func-style"></style>
                    <FormControl sx={{ width: widthGroup.width1 }}>
                      <InputLabel>メンバー</InputLabel>
                      <Select
                        label="メンバー"
                        defaultValue={0}
                        {...register(`forms.${index}.projectMember`)}
                        onChange={(e)=>{ refreshShain() }}
                      >
                        {members.map((member: any, i:any) => (
                          <MenuItem value={member.id} key={i}>
                            {member.shimei}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button onClick={() => {formsRemove(index); refreshShain(); } }>削除</Button>
                  </div>
                ))}
                <Button
                  onClick={() =>
                    formsAppend({
                      projectMember: 0,
                    })
                  }
                >
                  追加
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label>作業内容</label>
            <div className="w-auto p-2 flex flex-col gap-y-2 border">
              {forms2.map((form2, index) => (
                <div className="flex flex-row" key={form2.id}>
                  <FormControl sx={{ width: widthGroup.width1 }}>
                    <InputLabel>タスク</InputLabel>
                    <Select
                      label="タスク"
                      defaultValue=""
                      {...register(`forms2.${index}.task`)}
                    >
                      {taskItems.map((item: string, i) => (
                        <MenuItem value={i} key={i}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    {...register(`forms2.${index}.work`)}
                    label="作業内容"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <TextField
                    {...register(`forms2.${index}.start`)}
                    label="開始予定日"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <TextField
                    {...register(`forms2.${index}.finish`)}
                    label="終了予定日"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <TextField
                    {...register(`forms2.${index}.costs`)}
                    label="予定工数"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <Button onClick={() =>{forms2Remove(index);}}>削除</Button>
                </div>
              ))}
              <Button
                onClick={() =>
                  forms2Append({
                    task: "",
                    work: "",
                    start: "",
                    finish: "",
                    costs: "",
                  })
                }
              >
                追加
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Box>
  );
};

export default EditPage;
