"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Hidden,
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
    projectMember: string;
    mb_id: number;
  }[];
  forms2: {
    sn_id: number;
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

const EditPage = ({ socket, projectId, loaded, setLoadedFunction, members, projectList}:any) => {
  const [files, setFiles] = useState<File[]>([]);
  const [document, setDocument] = useState<File[]>([]);
  const [selectedProject, setProject] = useState(
    {
    });
  const inputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, register, reset, setValue, resetField } = useForm<FormType>({
    defaultValues: selectedProject,
  });
  const deleteProject = ()=>{
      socket.emit("project-delete", {
        sessionID: localStorage.getItem("sessionID"),
        userID: localStorage.getItem("userID"),
        id: projectId,
      })
  }
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
    // let p = new Project();
    var honkadouYoteiHi;
    var kashibi;
    var shuuryoubi;
    if(data.scheduledDate){
      honkadouYoteiHi = data.scheduledDate.toDateString()
    }
    if(data.startDate){
      kashibi = data.startDate.toDateString()
    }
    if(data.endDate){
      shuuryoubi = data.endDate.toDateString()
    }
    let p:Project = {
      id: projectId,
      kokyakuId: data.customer,
      eigyouTantouId: data.pic,
      jyoutaiId: data.state,
      jyuchuuRouteId: data.route,
      bangou: data.projectNo,
      oyaProjectId: data.projectPar,
      na: data.projectName,
      gaiyou: data.projectSummary,
      mokuhyou: data.projectGoal,
      yosa: data.budget,
      cousuu: data.costs1,
      keihi: data.expenses,
      honkadouYoteiHi: honkadouYoteiHi,
      kashibi:  kashibi,
      shuuryoubi: shuuryoubi,
      memo: data.memo,
      mitsumoriFile: "",
      documentFolder: "",
      shuuryuHoukoku: "",
    }
    socket.emit("project-update", {
      sessionID: localStorage.getItem("sessionID"),
      userID: localStorage.getItem("userID"),
     
      project: p,
      members: forms,
      tasks: forms2,
    })

    // console.log(forms2);
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

  useEffect(()=>{

    const r = async () => {

      if(loaded){
        return;
      }

      const res2 = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        body: JSON.stringify({
          type: "project-get",
          id: projectId
        }),
      });

      let s2 = await res2.json();

      if(s2?.project){
        setValue("customer", s2.project.kokyaku_id);
        setValue("route", s2.project.jyuchuu_route_id);
        setValue("pic", s2.project.eigyou_tantou_id);
        setValue("state", s2.project.jyoutai_id);
        setValue("projectNo", s2.project.bangou)
        setValue("projectPar", s2.project.oya_project_id)
        setValue("projectName", s2.project.na)
        setValue("projectSummary", s2.project.gaiyou)
        setValue("projectGoal", s2.project.mokuhyou)
        setValue("budget",  s2.project.yosa); //yosan
        setValue("costs1",  s2.project.cousuu);
        setValue("expenses", s2.project.keihi);
        setValue("scheduledDate", new Date(s2.project.honkadou_youtei_hi));
        setValue("startDate", new Date(s2.project.kashibi));
        setValue("endDate", new Date(s2.project.shuuryobi));
        setValue("memo", s2.project.memo)
        setValue("file1", "")
        setValue("file2", "")

        if(s2.members){
          
          formsRemove();
          
          s2.members.forEach((element:any, index:number)=> {
            formsAppend({
              projectMember: "",
              mb_id: 0,
            })
            
            setValue(`forms.${index}.projectMember`,  element.shain_id)
            setValue(`forms.${index}.mb_id`,  element.mb_id)
            
          });
          refreshShain();
        }

        if(s2.sagyouNaiyou){
          
          forms2Remove();

          s2.sagyouNaiyou.forEach((element:any, index:number)=> {
            forms2Append({
              sn_id: element.sn_id,
              task: element.task_id,
              work:  element.sagyou_naiyou,
              start:  element.kaishi_yotei_hi,
              finish: element.shuuryou_yotei_hi,
              costs:  element.yotei_kousuu,
            })
            setValue(`forms2.${index}.sn_id`,  element.sn_id)
            setValue(`forms2.${index}.task`,  element.task_id)
            setValue(`forms2.${index}.work`,  element.sagyou_naiyou)
            setValue(`forms2.${index}.start`,  element.kaishi_yotei_hi)
            setValue(`forms2.${index}.finish`,  element.shuuryou_yotei_hi)
            setValue(`forms2.${index}.costs`,  element.yotei_kousuu)
          })
        }

        setLoadedFunction(true);
      }

    };

    r();
    
  })

  return (
    <Box sx={{ width: widthGroup.drawer, p: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center text-2xl mt-16 my-8">
          更新プロジェクト登録
        </h1>
        <div className="flex justify-end space-x-4">
          <button className="border border-indigo-600 hover:bg-slate-100 rounded-md w-16" onClick={()=>{
            deleteProject();
          }}>
            削除
          </button>
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
                {members.map((member: any, i: any) => (
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
                        defaultValue={form.projectMember}
                        {...register(`forms.${index}.projectMember`)}
                        onChange={(e:any)=>{
                          forms[index].projectMember =  e.explicitOriginalTarget.getAttribute("data-value")
                        }}
                      >
                        {members.map((member: any, i: any) => (
                          <MenuItem value={member.id} key={i}>
                            {member.shimei}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button onClick={() => {formsRemove(index); refreshShain(); } }>削除</Button>
                    <div style={{display: "none"}}>
                        <TextField value={forms[index].mb_id} 
                        {...register(`forms.${index}.mb_id`)} />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() =>
                    formsAppend({
                      projectMember: "",
                      mb_id: 0,
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
                      defaultValue={form2.task}
                      {...register(`forms2.${index}.task`)}
                      onChange={(e:any)=>{
                        forms2[index].task =  e.explicitOriginalTarget.getAttribute("data-value")
                      }}
                    >
                      {taskItems.map((item: string, i) => (
                        <MenuItem value={i} key={i}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                 
                  <TextField
                   defaultValue={forms2[index].sn_id}
                    {...register(`forms2.${index}.sn_id`)} 
                    value={forms2[index].sn_id}
                    style={{display: "none"}}
                    />
                 
                  <TextField
                    {...register(`forms2.${index}.work`)}
                    label="作業内容"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                    onChange={(e:any)=>{
                      forms2[index].work =  e.target.value
                    }}
                  />
                  <TextField
                    {...register(`forms2.${index}.start`)}
                    label="開始予定日"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                    onChange={(e:any)=>{
                      forms2[index].start =  e.target.value
                    }}
                  />
                  <TextField
                    {...register(`forms2.${index}.finish`)}
                    label="終了予定日"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                    onChange={(e:any)=>{
                      forms2[index].finish =  e.target.value
                    }}
                  />
                  <TextField
                    {...register(`forms2.${index}.costs`)}
                    label="予定工数"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                    onChange={(e:any)=>{
                      forms2[index].costs = e.target.value
                    }}
                  />
                  <Button onClick={() =>{forms2Remove(index);}}>削除</Button>
                </div>
              ))}
              <Button
                onClick={() =>
                  forms2Append({
                    sn_id: 0,
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
