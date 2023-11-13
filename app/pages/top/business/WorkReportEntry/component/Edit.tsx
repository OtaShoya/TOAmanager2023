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
import { useForm, SubmitHandler, useFieldArray, set } from "react-hook-form";
import { memo, use, useEffect, useState } from "react";
import {formatN} from "@/src/lib/report";
import type { Kinmu, KinmuSagyouNaiyou } from "@/src/lib/database";


type FormType = {
  date:Date;
  work_class: string;
  work_status: number;
  start_time: number;
  end_time: number;
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
    project: number;
    work_detail: number;
    work_time2: number;
    ksn_id: number;
  }[];
};

const FormlabelGroup = {
  workClassName: "勤務区分",
  workStatusName: "勤務形態",
  startTime: "出社時間",
  endTime: "退社時間",
  deductionTime: "控除時間",
  restClass: "休暇種別",
  reason: "理由",
  workTime: "勤務時間",
  workTime2: "作業時間",
  overTime: "残業時間",
  overTimeLate: "残業時間（深夜）",
  restTime: "休出時刻",
  project: "プロジェクト",
  workDetail: "作業内容",
  memo: "メモ",
  total: "合計",
};

export const textBoxVariant: "filled" | "outlined" | "standard" = "outlined";

const buttonVariant: ("text" | "contained" | "outlined")[] = [
  "text",
  "contained",
  "outlined",
];

export const widthGroup = {
  drawer: 1500,
  default: 240,
  width1: 750,
  width2: 480,
};

const Items = [
  ["　", "休日", "勤務", "午前休", "午後休", "休暇", "休日出勤"],
  ["　", "通常", "出張", "直出", "直帰", "直出直帰", "テレワーク"],
  ["　", "有給休暇", "特別休暇", "代休", "欠勤"],
];

function populateTimes( bTime:Date, eTime:Date, timeIncriment:Date ){

  var arr = []
  for(var t = bTime; t < eTime; t.setMinutes( t.getMinutes() + timeIncriment.getMinutes() + timeIncriment.getHours() * 60 ) ){
    arr.push( 
    { 
      label: formatN( t.getHours() ) + ":" + formatN( t.getMinutes()) ,
      value: t.getHours() + (t.getMinutes()/60)
    });
  }
  return arr;

}

const EditPage = ({ socket, projectList, kinmuId, loaded, setLoaded, date }:any) => {
  
  const [workTime, setWorktime] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [overtimeLate, setOvertimeLate] = useState(0);
  const [workDetail, setWorkDetail] = useState([[{ id:0 , na: "" }]]);
  const [total, setTotal] = useState(0);
  const [ksnList, setKsnList] = useState(new Array<any>());

  const [projectSelected, setProjectSelected] = useState([]);
  const [workDetailSelected, setWorkDetailSelected] = useState([]);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [workClass, setWorkClass] = useState(0);
  const [workStatus, setWorkStatus] = useState(0);
  const [restClass, setRestClass] = useState(0);

  const { control, handleSubmit, register, reset, getValues, setValue } = useForm<FormType>({
    defaultValues: {
      forms: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "forms",
    control,
  });

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
        
        let startTimeDate = new Date( "2000-1-1 " + d.kinmu.shussha_jikoku);
        let endTimeDate = new Date( "2000-1-1 " + d.kinmu.taisha_jikoku);
        
        setValue("work_class", d.kinmu.kinmu_kubun);
        setWorkClass(d.kinmu.kinmu_kubun);

        setValue("work_status", d.kinmu.kinmu_keitai);
        setWorkStatus( d.kinmu.kinmu_keitai);

        setValue("start_time", startTimeDate.getHours() + startTimeDate.getMinutes()/60  );
        setStartTime( startTimeDate.getHours() + startTimeDate.getMinutes()/60  );

        setValue("end_time",   endTimeDate.getHours() + endTimeDate.getMinutes()/60 );
        setEndTime( endTimeDate.getHours() + endTimeDate.getMinutes()/60  );

        setValue("deduction_time", d.kinmu.koujyo_jikan);
      
        setValue("rest_class", d.kinmu.kyuuka_shubetsu);
        setRestClass( d.kinmu.kyuuka_shubetsu);

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
        
        setLoaded(true)
      }
     
    }

    fetchData();

  })

  const totalTime = ()=>{
    const f = getValues( "forms" );
    if(f && f?.length > 0){
      let total = 0;
      f.forEach((el:any)=>{
        total += parseInt( el.work_time2 )
      })
      return total
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
    
    console.log(upList)
    
    let kinmuK:Kinmu ={
      hidsuke: date,
      id: kinmuId,
      shusshaJikoku: new Date(Date.UTC(2000,0,0, (data.start_time - (data.start_time%1) ),  (data.start_time%1) * 60 ) ),
      taishaJikoku:  new Date(Date.UTC(2000,0,0, ( (data.end_time)  - (data.end_time%1)    ) , (data.end_time%1)   * 60) ),
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
      socket.emit("kinmu-update", {
        sessionID: localStorage.getItem("sessionID"),
        userID: localStorage.getItem("userID"),
        kinmu: kinmuK,
        ksnList: ksnList,
      })
    }
    

  };

  function updateTimes(){

    let endTimeElement:any = document.querySelector( "input[name='end_time']" );
    let startTimeElement:any = document.querySelector( "input[name='start_time']" );

    if(endTimeElement?.value && startTimeElement?.value){
      let e:number = endTimeElement.value;
      let s:number = startTimeElement.value
      let wt:number = (e >= 13? (e-1):e) - s;
      setWorktime( wt );
      setOvertime( (wt >= 9 || wt < 8)?(wt - 8):0 )
      setOvertimeLate( (e - 22.5 > 0)?e - 22.5:0 )
      //(wt - 8 >= 9 && wt - 8 < 8)?wt - 8:0
      //e - 22.5 > 0
    }

    
  }

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

  if(!loaded){
    return(  
    <Box sx={{ width: widthGroup.drawer }}>
      <div className="mt-16">
        <h1 className="text-center text-2xl">作業報告登録</h1>
      </div>
    </Box>)
  }
  
  setTimeout(()=>{updateTimes();}, 10)

  return (
    <Box sx={{ width: widthGroup.drawer }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-16">
          <h1 className="text-center text-2xl">作業報告登録</h1>
        </div>
        <div className="mt-8 ml-24 mr-24">
          <div className="grid gap-y-2.5">
            <div className="grid gap-y-2.5">
              <FormControl sx={{ width: widthGroup.default }}>
                <InputLabel>{FormlabelGroup.workClassName}</InputLabel>
                <Select
                  label={FormlabelGroup.workClassName}
                  value={workClass}
                  {...register("work_class")}
                  onChange={(e)=>{
                    setWorkClass( typeof e.target.value == "number"?e.target.value:0 )
                  }}
                >
                  {Items[0].map((item: string, i) => (
                    <MenuItem value={i} key={i}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: widthGroup.default }}>
                <InputLabel>{FormlabelGroup.workStatusName}</InputLabel>
                <Select
                  label={FormlabelGroup.workStatusName}
                  value={workStatus}
                  {...register("work_status")}
                  onChange={(e)=>{
                    setWorkStatus( typeof e.target.value == "number"?e.target.value:0 )
                  }}
                >
                  {Items[1]?.map((item, i) => (
                    <MenuItem value={i} key={i}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-row gap-x-8">
              <FormControl sx={{ width: widthGroup.default }}>
                <InputLabel>{FormlabelGroup.startTime}</InputLabel>
                <Select
                  label={FormlabelGroup.startTime}
                  value={ startTime }
                  {...register("start_time")}
                  onChange={(e)=>{
                    setStartTime( typeof e.target.value == "number"?e.target.value:0 )
                    setTimeout(()=>{updateTimes();}, 10)
                  }}
                >
                  {populateTimes( new Date( "2000-1-1 00:00" ),  new Date( "2000-1-1 23:59" ),  new Date( "2000-1-1 00:30" )).map((item: any, i) => (
                    <MenuItem value={item.value} key={i}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: widthGroup.default }}>
                <InputLabel>{FormlabelGroup.endTime}</InputLabel>
                <Select
                  label={FormlabelGroup.endTime}
                  value={ endTime }
                  
                  {...register("end_time")}
                  onChange={(e)=>{
                    setEndTime( typeof e.target.value == "number"?e.target.value:0  )
                    setTimeout(()=>{updateTimes();}, 10)
                  }}
                >
                  {populateTimes( new Date( "2000-1-1 00:00" ),  new Date( "2000-1-1 23:59" ),  new Date( "2000-1-1 00:15" )).map((item: any, i) => (
                    <MenuItem value={item.value} key={i}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                {...register("deduction_time")}
                label={FormlabelGroup.deductionTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.default }}
              />
            </div>
            <div className="grid gap-y-2.5">
              <FormControl sx={{ width: widthGroup.default }}>
                <InputLabel>{FormlabelGroup.restClass}</InputLabel>
                <Select
                  label={FormlabelGroup.restClass}
                  value={restClass}
                  {...register("rest_class")}
                  onChange={(e)=>{
                    setRestClass( typeof e.target.value == "number"?e.target.value:0 )
                  }}
                >
                  {Items[2].map((item: string, i) => (
                    <MenuItem value={i} key={i}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                {...register("reason")}
                label={FormlabelGroup.reason}
                variant={textBoxVariant}
                sx={{ width: widthGroup.width1 }}
              />
            </div>
            <div className="flex flex-row gap-x-8">
              <TextField
                {...register("work_time")}
                label={FormlabelGroup.workTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.default }}
                value={ workTime }
              />
              <TextField
                {...register("overtime")}
                label={FormlabelGroup.overTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.default }}
                value={overtime}
              />
              <TextField
                {...register("overtime_late")}
                label={FormlabelGroup.overTimeLate}
                variant={textBoxVariant}
                sx={{ width: widthGroup.default }}
                value={overtimeLate}
              />
              <TextField
                {...register("rest_time")}
                label={FormlabelGroup.restTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.default }}
              />
            </div>
          </div>
          <div className="mt-8">
            <label>作業内容</label>
            <div className="w-auto p-2 flex flex-col gap-y-2 border">
              {fields.map((field, index) => (
                <div className="flex flex-row" key={field.id}>
                  <FormControl sx={{ width: widthGroup.width1 }}>
                    <InputLabel>{FormlabelGroup.project}</InputLabel>
                    <Select
                      label={FormlabelGroup.project}
                      value={projectSelected[index]}
                      {...register(`forms.${index}.project`)}
                      onChange={(e)=>{
                        let event:any = e;
                        populateSagyouNaiyou(
                          index, 
                          event.explicitOriginalTarget.getAttribute("data-value"),
                          event.explicitOriginalTarget.parentElement.parentElement.parentElement.parentElement.querySelector(`input[name="forms.${index}.work_time2`).value,
                          event.explicitOriginalTarget.parentElement.parentElement.parentElement.parentElement.querySelector(`input[name="forms.${index}.ksn_id`).value);
                      }}
                    >
                      <MenuItem value={0}>
                      </MenuItem>

                      {projectList.map((item: any, i:any) => (
                        <MenuItem value={item.id} key={i}>
                          {item.na}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ width: widthGroup.width1 }}>
                    <InputLabel>{FormlabelGroup.workDetail}</InputLabel>
                    <Select
                      label={FormlabelGroup.workDetail}
                      defaultValue={workDetailSelected[index]}
                      {...register(`forms.${index}.work_detail`)}
                      onChange={
                        (e)=>{
                          let event:any = e;
                          let newWDS:any[] = workDetailSelected;
                          newWDS[index] =  event.explicitOriginalTarget.getAttribute("data-value");
                          //@ts-ignore
                          setWorkDetailSelected(newWDS);
                          setValue(`forms.${index}.work_detail`, event.explicitOriginalTarget.getAttribute("data-value") );
                          
                        }
                      }
                    >
                      <MenuItem value={0}>
                      </MenuItem>
                      { index < workDetail.length?  workDetail[index].map((item: any, i:any) => (
                        <MenuItem value={item.id} key={i}>
                          {item.na}
                        </MenuItem>
                      )): ( <MenuItem value={0}> </MenuItem>) }
                      

                    </Select>
                  </FormControl>
                  <TextField
                    {...register(`forms.${index}.work_time2`)}
                    label={FormlabelGroup.workTime2}
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                    onInput={(e)=>{
                     setTimeout(()=>{
                      //@ts-ignore
                      setTotal(totalTime());
                     }, 10) 
                    }}
                  />
                  <div style={{display: "none"}}>
                    <TextField
                      {...register(`forms.${index}.ksn_id`)}
                      variant={textBoxVariant}
                      sx={{ width: widthGroup.width2 }}
                    />
                  </div>
                  <Button onClick={() => remove(index)}>削除</Button>
                </div>
              ))}
              <Button
                onClick={
                  () =>{
                    
                    append({
                      project: 0,
                      work_detail: 0,
                      work_time2: 0,
                      ksn_id: 0,
                    })
                    
                  }
                }
              >
                追加
              </Button>
            </div>
          </div>
          <div className="mt-8">
            <TextField
              {...register("memo")}
              label={FormlabelGroup.memo}
              variant={textBoxVariant}
              sx={{ width: widthGroup.width1 }}
            />
            <TextField
              {...register("total")}
              label={FormlabelGroup.total}
              variant={textBoxVariant}
              value={total}
              sx={{ width: widthGroup.default }}
            />
          </div>
        </div>
        <div className="grid justify-items-center mt-8">
          <Button type="submit" variant={buttonVariant[2]}>
            登録
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default EditPage;
