"use client";
import { Button } from "@mui/material";
import { useForm, SubmitHandler, useFieldArray, Controller } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback, useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
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
  form1: {
    projectMember: string;
    mb_id: number
  }[];
  form2: {
    sn_id:number;
    task: number;
    work: string;
    start: string;
    finish: string;
    costs: string;
  }[];
};

const taskItems = ["A", "B", "C"];
const commonFormDesign = "border min-[1940px]:h-14 h-10 text-black rounded p-1";
const commonLabelDesign = "text-white flex flex-col";

function refreshShain(){

  setTimeout( ()=>{
    let styleElement = document.getElementById("func-style");

    if(styleElement){
      let styleString = "";
      let memberForm =  document.getElementById("form-member");
      if(memberForm){
        let memberInputs = memberForm.querySelectorAll("select")
        if(memberInputs.length > 0){
          memberInputs.forEach( ( el, index )=>{
            //@ts-ignore
            if(el.getAttribute("name") && el.getAttribute("name").includes("form1")){
              let inputElement:any = el;
              styleString += "#form-member option[value='" + inputElement.value + "']";
              if(index < (memberInputs.length - 1)){
                styleString += ",";
              }
            }
            
          } )
          styleString += "{display: none;}"
        }
  
      }
  
      styleElement.innerHTML = styleString;

    }
  }, 1 ) 
  
}

const EditPage = ({socket, projectId, loaded, setLoadedFunction, members, projectList}:any) => {
  const [files, setFiles] = useState<File[]>([]);
  const [document, setDocument] = useState<File[]>([]);
  const [sagyouNaiyou, setSagyouNaiyou] = useState(new Array<any>());
  const [mbList, setMbList] = useState(new Array<any>());

  const inputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, register, setValue } = useForm<FormType>({
    defaultValues: {
    },
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
    console.log(form2);
    socket.emit("project-update", {
      sessionID: localStorage.getItem("sessionID"),
      userID: localStorage.getItem("userID"),
      snList: sagyouNaiyou,
      mbList: mbList,
      project: p,
      members: form1,
      tasks: form2,
    })

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
          
          form1Remove();
          let mList = new Array<any>()
          s2.members.forEach((element:any, index:number)=> {
            form1Append({
              projectMember: "",
              mb_id: 0,
            })
            
            setValue(`form1.${index}.projectMember`,  element.shain_id)
            setValue(`form1.${index}.mb_id`,  element.mb_id)
            mList.push( element.mb_id )
          });

          setMbList(mList)

          refreshShain();
        }

        if(s2.sagyouNaiyou){
          
          form2Remove();
          let snList = new Array<any>()
          s2.sagyouNaiyou.forEach((element:any, index:number)=> {
            console.log(element)
            form2Append({
              sn_id: element.sn_id,
              task: element.task_id,
              work:  element.sagyou_naiyou,
              start:  element.kaishi_yotei_hi,
              finish: element.shuuryou_yotei_hi,
              costs:  element.yotei_kousuu,
            })
            setValue(`form2.${index}.sn_id`,  element.sn_id)
            setValue(`form2.${index}.task`,  element.task_id)
            setValue(`form2.${index}.work`,  element.sagyou_naiyou)
            setValue(`form2.${index}.start`,  element.kaishi_yotei_hi)
            setValue(`form2.${index}.finish`,  element.shuuryou_yotei_hi)
            setValue(`form2.${index}.costs`,  element.yotei_kousuu)
            snList.push(element.sn_id)
          })
          setSagyouNaiyou(snList);
        }

        setLoadedFunction(true);
      }

    };

    r();
    
  })

  return (
    <form
      className="px-8 pb-8 bg-[#556593] min-[1940px]:h-full h-max"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="edit-title">新規プロジェクト登録</h1>
      <div className="flex flex-col space-y-5">
        {/* フォーム1 */}
        <div className="flex justify-between">
          <label className="edit-label flex flex-col">
            顧客
            <select className="edit-form" {...register("customer")}>
              <option value="0"></option>
              <option value="1">123456789</option>
            </select>
          </label>
          <label className="edit-label flex flex-col">
            受注ルート
            <select className="edit-form" {...register("route")}>
              <option value="0"></option>
              <option value="1">123456789</option>
            </select>
          </label>
          <label className="edit-label flex flex-col">
            営業担当
            <select className="edit-form" {...register("pic")}
            >
              <option value="0"></option>
                {members.map((member: any, i:any) => (
                  <option value={member.id} key={i}>
                    {member.shimei}
                  </option>
                ))}
            </select>
          </label>
          <label className="edit-label flex flex-col">
            状態
            <select className="edit-form" {...register("state")}>
            <option value="0"></option>
              <option value="1">123456789</option>
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
              >
                <option value="0"></option>
                  {projectList.map((project: any, i:any) => (
                    <option value={project.id} key={i}>
                      {project.na}
                    </option>
                  ))}
              </select>
            </label>
            <label className="edit-label flex flex-col">
              プロジェクト名
               <input className="edit-form" {...register("projectName")} />
            </label>
            <label className="edit-label flex flex-col">
              プロジェクト概要
               <input className="edit-form" {...register("projectSummary")} />
            </label>
            <label className="edit-label flex flex-col">
              プロジェクト目標
              <input className="edit-form" {...register("projectGoal")} />
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
                <Controller
                    control={control}
                   
                    name="scheduledDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        dateFormat="yyyy/MM/dd"
                        className="edit-form"
                        selected={value}
                        onChange={onChange}
                        id="bDate"
                      />
                    )}  
                  />
              </label>
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                開始日
                <Controller
                    control={control}
                   
                    name="startDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        dateFormat="yyyy/MM/dd"
                        className="edit-form"
                        selected={value}
                        onChange={onChange}
                        id="bDate"
                      />
                    )}  
                  />
              </label>
              <label className="edit-label flex flex-col min-[1940px]:w-64 w-44">
                終了日
                <Controller
                    control={control}
                   
                    name="endDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        dateFormat="yyyy/MM/dd"
                        className="edit-form"
                        selected={value}
                        onChange={onChange}
                        id="bDate"
                      />
                    )}  
                  />
              </label>
            </div>
            <label className="edit-label flex flex-col">
              メモ（状況及び今後の予定）
              <input className="border text-black h-32"  {...register("memo")}/>
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
           
            <div className="w-auto p-2 flex flex-col gap-y-2 border" id="form-member">
              <style id="func-style"></style>
              {form1.map((form, index) => (
                <div className="flex " key={form.id} >
                  <select
                    {...register(`form1.${index}.projectMember`)}
                    className="w-full"
                    onChange={(e)=>{
                      form1[index].projectMember = e.target.value;
                      refreshShain()
                    }}
                  >
                    {members.map((member: any, i:number) => (
                      <option value={member.id} key={i}>
                        {member.shimei}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      form1Remove(index); 
                      refreshShain();}}
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
                  <div style={{display: "none"}}>
                      <input value={form1[index].mb_id} 
                      {...register(`form1.${index}.mb_id`)} />
                  </div>
                </div>
              ))}
              <button
                onClick={(e) =>{
                  e.preventDefault();
                  form1Append({
                    projectMember: "",
                    mb_id: 0,
                  })
                }
                  
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
                        onChange={(e)=>{
                          form2[index].task = parseInt( e.target.value )
                        }}
                      >
                        <option value={0}>
                        
                        </option>
                        {taskItems.map((item: string, i) => (
                          <option value={i + 1} key={i}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.work`)}
                        className="w-full min-[1940px]:h-14 h-10"
                        onChange={(e)=>{
                          form2[index].work = e.target.value;
                        }}
                      />
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.start`)}
                        className="w-full min-[1940px]:h-14 h-10"
                        onChange={(e)=>{
                          form2[index].start = e.target.value;
                        }}
                      />
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.finish`)}
                        className="w-full min-[1940px]:h-14 h-10"
                        onChange={(e)=>{
                          form2[index].finish = e.target.value;
                        }}
                      />
                    </td>
                    <td>
                      <input
                        {...register(`form2.${index}.costs`)}
                        className="w-full min-[1940px]:h-14 h-10"
                        onChange={(e)=>{
                          form2[index].costs = e.target.value;
                        }}
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
              onClick={(e) =>{
                e.preventDefault();
                form2Append({
                  sn_id: 0,
                  task: 0,
                  work: "",
                  start: "",
                  finish: "",
                  costs: "",
                })
              }
                
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
        <button className="edit-entry-button" 
          onClick={()=>{
            deleteProject();
          }}>
        削除
        </button>
      </div>
    </form>
  );
};

export default EditPage;
