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

type FormType = {
  work_class: string;
  work_status: number;
  start_time: number;
  end_time: number;
  deduction_time: number;
  rest_class: number;
  reason: string;
  work_time: string;
  overtime: string;
  overtime_late: string;
  rest_time: string;
  memo: string;
  total: number;
  forms: {
    project: number;
    work_detail: number;
    work_time2: string;
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

const timeTable = [
  ["08:00", "08:30", "09:00"],
  ["17:00", "17:30", "18:00"],
];

const EditPage = () => {
  const { control, handleSubmit, register, reset } = useForm<FormType>({
    defaultValues: {
      forms: [{ project: 0, work_detail: 0, work_time2: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "forms",
    control,
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log(data);
  };

  return (
    <Box sx={{ width: widthGroup.drawer }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-16">
          <h1 className="text-center">作業報告登録</h1>
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
                >
                  {timeTable[0].map((item: string, i) => (
                    <MenuItem value={i} key={i}>
                      {item}
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
                >
                  {timeTable[1].map((item: string, i) => (
                    <MenuItem value={i} key={i}>
                      {item}
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
              />
              <TextField
                {...register("overtime")}
                label={FormlabelGroup.overTime}
                variant={textBoxVariant}
                sx={{ width: widthGroup.defalut }}
              />
              <TextField
                {...register("overtime_late")}
                label={FormlabelGroup.overTimeLate}
                variant={textBoxVariant}
                sx={{ width: widthGroup.defalut }}
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
                    >
                      {Items[2].map((item: string, i) => (
                        <MenuItem value={i} key={i}>
                          {item}
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
                      {Items[2].map((item: string, i) => (
                        <MenuItem value={i} key={i}>
                          {item}
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
                    work_time2: "",
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
