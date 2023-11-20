"use client";

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import {formatN} from "@/src/lib/report";
import type { Kinmu, KinmuSagyouNaiyou } from "@/src/lib/database";

type FormType = {
  work_class: string;
  work_status: number;
  start_time: string;
  end_time: string;
  deduction_time: number;
  rest_class: number;
  reason: string;
  work_time: number;
  overtime: number;
  overtime_late: number;
  rest_time: string;
  memo: string;
  total: number;
  forms: {
    ksn_id: number;
    project: number;
    work_detail: number;
    work_time2: number;
  }[];
};

const Items = [
  ["", "休日", "勤務", "午前休", "午後休", "休暇", "休日出勤"],
  ["", "通常", "出張", "直出", "直帰", "直出直帰", "テレワーク"],
  ["", "有給休暇", "特別休暇", "代休", "欠勤"],
];

const timeTable = [
  "00:00",
  "08:00",
  "08:30",
  "09:00",
  "13:00",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "22:00",
  "22:15",
  "22:30",
  "22:45",
  "23:00",
];
function populateTimes( bTime:Date, eTime:Date, timeIncriment:Date ){

  var arr = []
  for(var t = bTime; t < eTime; t.setMinutes( t.getMinutes() + timeIncriment.getMinutes() + timeIncriment.getHours() * 60 ) ){
    arr.push( 
    { 
      label: formatN( t.getHours() ) + ":" + formatN( t.getMinutes()) ,
      value: formatN( t.getHours() ) + ":" + formatN( t.getMinutes()) , //t.getHours() + (t.getMinutes()/60)
    });
  }
  return arr;

}

const EditPage = ({socket, projectList, kinmuId, loaded, setLoaded, date }:any ) => {
  
  // const [workTime, setWorktime] = useState(0);
  // const [overtime, setOvertime] = useState(0);
  // const [overtimeLate, setOvertimeLate] = useState(0);
  const [workDetail, setWorkDetail] = useState([[{ id:0 , na: "" }]]);
  // const [total, setTotal] = useState(0);
  const [ksnList, setKsnList] = useState(new Array<any>());

  const [projectSelected, setProjectSelected] = useState([]);
  const [workDetailSelected, setWorkDetailSelected] = useState([]);
  
  //?
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  // 

  // const [workClass, setWorkClass] = useState(0);
  // const [workStatus, setWorkStatus] = useState(0);
  // const [restClass, setRestClass] = useState(0);
  
  const { control, handleSubmit, register, getValues, setValue } =
    useForm<FormType>({
      defaultValues: {
        forms: [],
      },
    });

  const { fields, append, remove, update } = useFieldArray({
    name: "forms",
    control,
  });


  const populateSagyouNaiyou = (index:number, projectId:number, workHour:any, id:number, workDetailId:number = 0)=>{

    let foundEl = projectList.find( (el:any)=>{
        return el.id == projectId
    } );
    if(foundEl){

      let newArray = workDetail;
      newArray[index] = foundEl.sagyouNaiyouList ;
      setWorkDetail( newArray ); 

      update(index, {
        project: projectId, 
        work_detail: workDetailId,
        work_time2: workHour,
        ksn_id: id,
      })
      let newP = projectSelected;
      //@ts-ignore
      newP[index] = projectId;
      setProjectSelected(newP);
        
      setValue(`forms.${index}.project`, projectId);
      

      let newWDS:any[] = workDetailSelected;
      newWDS[index] = workDetailId;
      //@ts-ignore
      setWorkDetailSelected(newWDS);
      setValue(`forms.${index}.work_detail`, workDetailId);
    }

  }

  useEffect(()=>{
    

    async function fetchData() {
      
      if(kinmuId == 0 || loaded){ 
        setLoaded(true)
        return; 
      }

      const res = await fetch("/api/db/",
      {
          method: "POST", 
          body: JSON.stringify(
              {
                id: kinmuId,
                type: "kinmu-get",
              }
          ),
      });
      const d = await res.json();
      if(d){
       
        let startTimeDate = new Date( "1970-1-1 " + d.kinmu.shussha_jikoku);
        let endTimeDate = new Date( "1970-1-1 " + d.kinmu.taisha_jikoku);
        console.log(startTimeDate.getHours());

        setValue("work_class", d.kinmu.kinmu_kubun);
        // setWorkClass(d.kinmu.kinmu_kubun);

        setValue("work_status", d.kinmu.kinmu_keitai);
        // setWorkStatus( d.kinmu.kinmu_keitai);

        setValue("start_time", formatN( startTimeDate.getHours() ) + ":" + formatN( startTimeDate.getMinutes() ) );
        // setStartTime( startTimeDate.getHours() + ":" + startTimeDate.getMinutes() );

        setValue("end_time",   formatN(  endTimeDate.getHours() ) + ":" + formatN(  endTimeDate.getMinutes()));
        // setEndTime( endTimeDate.getHours() + ":" +  endTimeDate.getMinutes()  );

        setValue("deduction_time", d.kinmu.koujyo_jikan);
      
        setValue("rest_class", d.kinmu.kyuuka_shubetsu);
        // setRestClass( d.kinmu.kyuuka_shubetsu);

        setValue("rest_time", d.kinmu.kyuushutsu_jikan );

        setValue("reason", d.kinmu.kyuuka_riyu)

        setValue("memo", d.kinmu.memo);
        if (d.sagyouNaiyouList?.length > 0){
          console.log(d.sagyouNaiyouList)
          remove();
          let snList = new Array<any>();
          d.sagyouNaiyouList.forEach((element:any, index:number)=> {
            
            append({
              ksn_id: element.id,
              project: element.project_id,
              work_detail: element.sagyou_naiyou_id,
              work_time2: element.sagyou_jikan
            })
            
            // setValue(`forms.${index}.ksn_id`,  element.id);
            // setValue(`forms.${index}.project`,  element.project_id);
            // setValue(`forms.${index}.work_detail`,  element.sagyou_naiyou_id);
            // setValue(`forms.${index}.work_time2`,  element.sagyou_jikan);
            let newPS:any[] = projectSelected;
            newPS[index] = element.project_id;
            //@ts-ignore
            setProjectSelected(newPS)

            // let newWDS:any[] = workDetailSelected;
            // newWDS[index] = element.sagyou_naiyou_id;
            // //@ts-ignore
            // setWorkDetailSelected(newWDS)

            populateSagyouNaiyou(index, element.project_id,  element.sagyou_jikan, element.id, element.sagyou_naiyou_id)
            

            snList.push( element.id );
            
          });
          setKsnList(snList);
        }
        setTimes(startTimeDate, endTimeDate)
        setLoaded(true)
      }
     
    }

    fetchData();

  })

  const hiru = new Date("1970-1-1 " + "12:00");
  const t4 = new Date("1970-1-1 " + "19:00");
  const t5 = new Date("1970-1-1 " + "19:30");
  const t6 = new Date("1970-1-1 " + "22:00");
  const t7 = new Date("1970-1-1 " + "22:30");
  let D3 = 0;
  let lateTime = 0;

  // 勤務時間と残業時間を算出する関数（退出時間が更新された時）
  const getEndTimes = (e: string) => {
    const D1 = new Date("1970-1-1 " + getValues("start_time"));
    let D2 = new Date("1970-1-1 " + e);
    setTimes(D1, D2);
  };

  // 勤務時間と残業時間を算出する関数（出社時間が更新された時）
  const getStartTimes = (e: string) => {
    const D1 = new Date("1970-1-1 " + e);
    let D2 = new Date("1970-1-1 " + getValues("end_time"));
    setTimes(D1, D2);
  };

  const setTimes = (D1: Date, D2: Date)=>{
    if (D2.getTime() > D1.getTime()) {
      // 19:00より前
      if (D2 <= t4) {
        D3 = (D2.getTime() - D1.getTime()) / (60 * 60 * 1000);
        // 19:01 ~ 19:30の間
      } else if (D2 > t4 && D2 <= t5) {
        D2 = new Date("1970-1-1 " + "19:00");
        D3 = (D2.getTime() - D1.getTime()) / (60 * 60 * 1000);
        // 19:31 ~ 22:00の間
      } else if (D2 > t5 && D2 <= t6) {
        D3 = (D2.getTime() - D1.getTime()) / (60 * 60 * 1000) - 0.5;
        // 22:01 ~ 22:30の間
      } else if (D2 > t6 && D2 <= t7) {
        D2 = new Date("1970-1-1 " + "22:00");
        D3 = (D2.getTime() - D1.getTime()) / (60 * 60 * 1000) - 0.5;
        // 22:31 ~
      } else if (D2 > t7) {
        D3 = (D2.getTime() - D1.getTime()) / (60 * 60 * 1000) - 1;
        lateTime = (D2.getTime() - t7.getTime()) / (60 * 60 * 1000);
      }
      if(D2.getHours() > hiru.getHours() ){
        D3 -= 1;
      }


      if (D3 != 0) {
        setValue("work_time", D3);
        if (D3 > 8) {
          setValue("overtime", D3 - 8);
          console.log(D3);
          if (lateTime > 0) {
            setValue("overtime_late", lateTime);
          } else {
            setValue("overtime_late", 0);
          }
        } else {
          setValue("overtime", 0);
        }
      }
    }
  }

  const onSubmit: SubmitHandler<FormType> = (data) => {
 

    let upList:Array<KinmuSagyouNaiyou>  = []
    data.forms.forEach( (val)=>{
      upList.push({
        id: val.ksn_id,
        kinmuId: kinmuId,
        projectId: val.project,
        sagyouNaiyouId: val.work_detail,
        sagyouJikan: val.work_time2,
      })
    } )
       
    let startTimeArr = data.start_time.split(":");
    let endTimeArr = data.end_time.split(":");
    let kinmuK:Kinmu ={
      hidsuke: date,
      id: kinmuId,
      shusshaJikoku: startTimeArr.length > 1? new Date( Date.UTC(2000, 0, 0 , parseInt( startTimeArr[0]), parseInt( startTimeArr[1])) ): null,
      taishaJikoku:  endTimeArr.length > 1? new Date( Date.UTC(2000, 0, 0 , parseInt( endTimeArr[0]), parseInt( endTimeArr[1])) ): null,
      kinmuKubun: data.work_class,
      kinmuKeitai: data.work_status,
      koujyoJikan: data.deduction_time,
      memo: data.memo,
      kyuushutsuJikan : data.rest_time,
      kyuukaShubetsu: data.rest_class,
      kyuukaRiyu: data.reason,
      shainId: localStorage.getItem("userID"),
      sagyouNaiyou: upList,
    } 
   
    if(kinmuId == 0){
      socket.emit("kinmu-add", {
        sessionID: localStorage.getItem("sessionID"),
        userID: localStorage.getItem("userID"),
        kinmu: kinmuK,
      })
    }else{
      // console.log(data);
      socket.emit("kinmu-update", {
        sessionID: localStorage.getItem("sessionID"),
        userID: localStorage.getItem("userID"),
        kinmu: kinmuK,
        ksnList: ksnList,
      })
    }

  };

  return (
    <form
      className=" bg-[#556593] h-full px-24 pb-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="edit-title">作業報告登録</h1>
      {/* フォーム */}
      <div className="space-y-3">
        <div className="flex gap-x-8">
          <label className="text-white flex flex-col">
            勤務区分
            <select
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("work_class")}
            >
              {Items[0].map((item: string, i) => (
                <option value={i} key={i}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-white flex flex-col">
            勤務形態
            <select
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("work_status")}
            >
              {Items[1].map((item: string, i) => (
                <option value={i} key={i}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-x-8">
          <label className="text-white flex flex-col">
            出社時間
            <select
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("start_time")}
              onChange={(e) => getStartTimes(e.target.value)}
            >
              {populateTimes( new Date( "2000-1-1 00:00" ),  new Date( "2000-1-1 23:59" ),  new Date( "2000-1-1 00:30" )).map((time, i) => (
                <option value={time.value} key={i}>
                  {time.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-white flex flex-col">
            退社時間
            <select
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("end_time")}
              onChange={(e) => getEndTimes(e.target.value)}
            >
              {populateTimes( new Date( "2000-1-1 00:00" ),  new Date( "2000-1-1 23:59" ),  new Date( "2000-1-1 00:15" )).map((time, i:any) => (
                <option value={time.value} key={i}>
                  {time.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-white flex flex-col">
            控除時間
            <input
              type="text"
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("deduction_time")}
            />
          </label>
        </div>
        <div className="grid gap-y-5">
          <label className="text-white flex flex-col">
            休暇種別
            <select
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("rest_class")}
            >
              {Items[2].map((item: string, i) => (
                <option value={i} key={i}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-white flex flex-col">
            控除時間
            <input
              type="text"
              className="w-[750px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("reason")}
            />
          </label>
        </div>
        <div className="flex gap-x-8">
          <label className="text-white flex flex-col">
            勤務時間
            <input
              type="text"
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("work_time")}
            />
          </label>
          <label className="text-white flex flex-col">
            残業時間
            <input
              type="text"
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("overtime")}
            />
          </label>
          <label className="text-white flex flex-col">
            残業時間（深夜）
            <input
              type="text"
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("overtime_late")}
            />
          </label>
          <label className="text-white flex flex-col">
            休出時間
            <input
              type="text"
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("deduction_time")}
            />
          </label>
        </div>
        <label className="text-white inline-block">
          作業内容
          <div className="p-2 flex flex-col border">
            <table className="border-spacing-0 border-collapse">
              <thead className="block">
                <tr>
                  <th className="border w-[350px] text-white bg-sky-600">
                    プロジェクト
                  </th>
                  <th className="border w-[350px] text-white bg-sky-600">
                    作業内容
                  </th>
                  <th className="border w-[200px] text-white bg-sky-600">
                    作業時間
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="block overflow-y-scroll h-64">
                {fields.map((field, index) => (
                  <tr key={field.id} className="text-black">
                    <td className="p-0">
                      <select
                        className="w-[350px] min-[1940px]:h-14 h-10 border border-sky-600 bg-slate-50"
                        {...register(`forms.${index}.project`)}
                        onChange={(e)=>{
                          let event:any = e;
                          console.log(event.target.value)
                          populateSagyouNaiyou(
                            index, 
                            event.target.value,
                            event.target.parentElement.parentElement.parentElement.parentElement.querySelector(`input[name="forms.${index}.work_time2`).value,
                            event.target.parentElement.parentElement.parentElement.parentElement.querySelector(`input[name="forms.${index}.ksn_id`).value);
                        }}
                      >
                        <option value={0}></option>
                        {projectList.map((item: any, i:any) => (
                          <option value={item.id} key={i}>
                            {item.na}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-0">
                      <select
                        className="w-[350px] min-[1940px]:h-14 h-10 border border-sky-600 bg-slate-50"
                        {...register(`forms.${index}.work_detail`)}
                      >
                      <option value={0}></option>
                        { index < workDetail.length && workDetail[index] &&  workDetail[index].length > 0?  workDetail[index].map((item: any, i:any) => (
                          <option value={item.id} key={i}>
                            {item.na}
                          </option>
                        )): ( <option value={0}> </option>) }
                      </select>
                    </td>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-[200px] min-[1940px]:h-14 h-10 border border-sky-600 bg-slate-50"
                        {...register(`forms.${index}.work_time2`)}
                      />
                    </td>
                    <div style={{display: "none"}}>
                      <input
                        {...register(`forms.${index}.ksn_id`)}
                      />
                    </div>
                    <td>
                      <button
                        className="text-white hover:text-blue-900 ml-2"
                        onClick={() => remove(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
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
              className="mt-2 text-[#556593] hover:text-white bg-white hover:bg-[#556593] border hover:border-white rounded-lg w-20 py-2 place-self-center"
              onClick={(e) =>{
                e.preventDefault();
                append({
                  ksn_id: 0,
                  project: 0,
                  work_detail: 0,
                  work_time2: 0,
                })
              }
                
              }
            >
              追加
            </button>
          </div>
        </label>
        <div className="flex gap-x-8">
          <label className="text-white flex flex-col">
            メモ
            <input
              type="text"
              className="w-[750px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("memo")}
            />
          </label>
          <label className="text-white flex flex-col">
            会計
            <input
              type="text"
              className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
              {...register("deduction_time")}
            />
          </label>
        </div>
        {/* 登録ボタン */}
        <button type="submit" className="edit-entry-button">
          登録
        </button>
      </div>
    </form>
  );
};

export default EditPage;
