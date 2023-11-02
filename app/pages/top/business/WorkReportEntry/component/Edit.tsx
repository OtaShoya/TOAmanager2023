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
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { use, useEffect, useState } from "react";
import {formatN} from "@/src/lib/report";

type FormType = {
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
  defalut: 240,
  width1: 750,
  width2: 480,
};

const Items = [
  ["", "休日", "勤務", "午前休", "午後休", "休暇", "休日出勤"],
  ["", "通常", "出張", "直出", "直帰", "直出直帰", "テレワーク"],
  ["有給休暇", "特別休暇", "代休", "欠勤"],
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





const EditPage = ({ projectList }:any) => {
  
  const [workTime, setWorktime] = useState(0)
  const [overtime, setOvertime] = useState(0)
  const [overtimeLate, setOvertimeLate] = useState(0)
  const [workDetail, setWorkDetail] = useState([{ id:0 , na: "" }])

  const { control, handleSubmit, register, reset, getValues } = useForm<FormType>({
    defaultValues: {
      forms: [{ project: 0, work_detail: 0, work_time2: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "forms",
    control,
  });

  // useEffect(()=>{

  //   async function fetchData() {
  //     const res = await fetch("/api/db/",
  //     {
  //         method: "POST", 
  //         body: JSON.stringify(
  //             {
  //                 type: "project-list-kinmu",

  //             }
  //         ),
  //     });
  //     const d = await res.json();
  //     // setDatas(d.kinmuList);
  //   }

  //   fetchData();

  // })
  const totalTime = ()=>{
    const f = getValues( "forms" );
    if(f && f?.length > 0){
      let total = 0;
      f.forEach((el:any)=>{
        total += el.work_time2
      })
      return total
    }

  }
  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log(data);
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

  const populateSagyouNaiyou = (projectId:number)=>{
   
    
    let foundEl = projectList.find( (el:any)=>{
        return el.id == projectId
    } );
    

    if(foundEl){
      setWorkDetail( foundEl.sagyouNaiyouList );
    }

  }

  return (
    <Box sx={{ width: widthGroup.drawer }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-16">
          <h1 className="text-center text-2xl">作業報告登録</h1>
        </div>
        <div className="mt-8 ml-24 mr-24">
          <div className="grid gap-y-2.5">
            <div className="grid gap-y-2.5">
              <FormControl sx={{ width: widthGroup.defalut }}>
                <InputLabel>{FormlabelGroup.workClassName}</InputLabel>
                <Select
                  label={FormlabelGroup.workClassName}
                  defaultValue=""
                  {...register("work_class")}
                >
                  {Items[0].map((item: string, i) => (
                    <MenuItem value={i} key={i}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: widthGroup.defalut }}>
                <InputLabel>{FormlabelGroup.workStatusName}</InputLabel>
                <Select
                  label={FormlabelGroup.workStatusName}
                  defaultValue=""
                  {...register("work_status")}
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
              <FormControl sx={{ width: widthGroup.defalut }}>
                <InputLabel>{FormlabelGroup.startTime}</InputLabel>
                <Select
                  label={FormlabelGroup.startTime}
                  defaultValue=""
                  {...register("start_time")}
                  onChange={()=>{
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
              <FormControl sx={{ width: widthGroup.defalut }}>
                <InputLabel>{FormlabelGroup.endTime}</InputLabel>
                <Select
                  label={FormlabelGroup.endTime}
                  defaultValue=""
                  
                  {...register("end_time")}
                  onChange={()=>{
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
                sx={{ width: widthGroup.defalut }}
              />
            </div>
            <div className="grid gap-y-2.5">
              <FormControl sx={{ width: widthGroup.defalut }}>
                <InputLabel>{FormlabelGroup.restClass}</InputLabel>
                <Select
                  label={FormlabelGroup.restClass}
                  defaultValue=""
                  {...register("rest_class")}
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
                sx={{ width: widthGroup.defalut }}
                value={ workTime }
              />
              <TextField
                {...register("overtime")}
                label={FormlabelGroup.overTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.defalut }}
                value={overtime}
              />
              <TextField
                {...register("overtime_late")}
                label={FormlabelGroup.overTimeLate}
                variant={textBoxVariant}
                sx={{ width: widthGroup.defalut }}
                value={overtimeLate}
              />
              <TextField
                {...register("rest_time")}
                label={FormlabelGroup.restTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.defalut }}
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
                      defaultValue=""
                      {...register(`forms.${index}.project`)}
                      onChange={(e)=>{
                        let event:any = e;
                        populateSagyouNaiyou(event.explicitOriginalTarget.getAttribute("data-value"));
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
                      defaultValue=""
                      {...register(`forms.${index}.work_detail`)}
                     
                    >
                      <MenuItem value={0}>
                      </MenuItem>
                      {workDetail.map((item: any, i:any) => (
                        <MenuItem value={item.id} key={i}>
                          {item.na}
                        </MenuItem>
                      ))}
                      

                    </Select>
                  </FormControl>
                  <TextField
                    {...register(`forms.${index}.work_time2`)}
                    label={FormlabelGroup.workTime2}
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <Button onClick={() => remove(index)}>削除</Button>
                </div>
              ))}
              <Button
                onClick={() =>
                  append({
                    project: 0,
                    work_detail: 0,
                    work_time2: 0,
                  })
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
              sx={{ width: widthGroup.defalut }}
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
