import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  textBoxVariant,
  widthGroup,
} from "../../WorkReportEntry/component/Edit";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type FormTypes = {
  projectName: string; //プロジェクト
  date1: string; //報告日
  projectNo: string; //プロジェクト番号
  budget: string; //予算
  cost1: string; //工数
  date2: string; //本稼働予定日
  date3: string; //開始日
  date4: string; //終了日
  situation: string; //状況
  plans: string; //予定
  form1: {
    work: string; //作業内容
    tantou: string; //担当
    workTime: string; //作業内容
    bikou: string; //備考
  }[];
};

const projectNames: string[] = ["A", "B", "C"];
const workOptions: string[] = ["A", "B", "C"];
const tantouOptions: string[] = ["A", "B", "C"];
const columns: string[] = [
  "作業内容",
  "開始予定日",
  "終了予定日",
  "開始日",
  "終了日",
  "予定工数",
  "累積時間",
  "進捗率",
  "備考",
];

const EditPage = () => {
  const { control, handleSubmit, register } = useForm<FormTypes>({
    defaultValues: {
      form1: [{ work: "", tantou: "", workTime: "", bikou: "" }],
    },
  });

  const {
    fields: form1,
    append: form1Append,
    remove: form1Remove,
  } = useFieldArray({
    name: "form1",
    control,
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    console.log(data);
  };

  return (
    <Box sx={{ width: widthGroup.drawer }}>
      <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-24 space-y-8">
          {/* 登録ボタン */}
          <div className="flex justify-end">
            <button
              className="border border-indigo-600 bg-indigo-600 text-white rounded-full w-24 p-2"
              type="submit"
            >
              登録
            </button>
          </div>
          {/* プロジェクト情報 */}
          <div className="border border-indigo-600 h-96 p-5 relative">
            <label className="absolute -top-3 left-6 bg-white w-48 text-center">
              プロジェクト情報
            </label>
            <div className="flex flex-col justify-between space-y-2 h-full">
              <div className="flex justify-between items-center border h-1/3">
                <label className="flex">
                  プロジェクト
                  <select
                    className="w-96 border border-indigo-600 ml-2"
                    {...register("projectName")}
                  >
                    {projectNames.map((name, index) => (
                      <option value={index} key={index}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  報告日
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("date1")}
                  />
                </label>
              </div>
              <div className="flex justify-between items-center border h-1/3">
                <label className="flex">
                  プロジェクト番号
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("projectNo")}
                  />
                </label>
                <label className="flex">
                  予算
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("budget")}
                  />
                </label>
                <label>
                  工数
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("cost1")}
                  />
                </label>
              </div>
              <div className="flex justify-between items-center border h-1/3">
                <label className="flex">
                  本稼働予定日
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("date2")}
                  />
                </label>
                <label>
                  開始日
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("date3")}
                  />
                </label>
                <label>
                  終了日
                  <input
                    className="border border-indigo-600 ml-2"
                    {...register("date4")}
                  />
                </label>
              </div>
            </div>
          </div>
          {/* 作業時間 */}
          <div className="border border-indigo-600 p-5 relative items-center">
            <label className="absolute -top-3 left-6 bg-white w-48 text-center">
              作業時間
            </label>
            <div className="h-full box-border flex flex-col">
              <label className="flex justify-center my-3">
                集計期間
                <div className="flex flex-row ml-2">
                  <input className="border"></input>
                  <div>〜</div>
                  <input className="border"></input>
                  <button className="border border-indigo-600 bg-indigo-600 text-white rounded-full ml-4 p-2">
                    作業報告から取込
                  </button>
                </div>
              </label>
              {form1.map((form, index) => (
                <div className="flex flex-row " key={form.id}>
                  <FormControl sx={{ width: widthGroup.width1 }}>
                    <InputLabel>作業内容</InputLabel>
                    <Select
                      label="作業内容"
                      defaultValue=""
                      {...register(`form1.${index}.work`)}
                    >
                      {workOptions.map((option: string, i) => (
                        <MenuItem value={i} key={i}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ width: widthGroup.width1 }}>
                    <InputLabel>担当</InputLabel>
                    <Select
                      label="担当"
                      defaultValue=""
                      {...register(`form1.${index}.tantou`)}
                    >
                      {tantouOptions.map((option: string, i) => (
                        <MenuItem value={i} key={i}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    {...register(`form1.${index}.workTime`)}
                    label="作業時間"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <TextField
                    {...register(`form1.${index}.bikou`)}
                    label="備考"
                    variant={textBoxVariant}
                    sx={{ width: widthGroup.width2 }}
                  />
                  <button onClick={() => form1Remove(index)} className="w-20">
                    削除
                  </button>
                </div>
              ))}
              <button
                className="text-indigo-600 justify-self-center my-3"
                onClick={() =>
                  form1Append({
                    work: "",
                    tantou: "",
                    workTime: "",
                    bikou: "",
                  })
                }
              >
                追加
              </button>
            </div>
          </div>
          {/* 進捗 */}
          <div className="border border-indigo-600 h-96 p-5 relative">
            <label className="absolute -top-3 left-6 bg-white w-24 text-center">
              進捗
            </label>
            <div className="border h-full flex flex-row">
              <TableContainer component={Paper} className="">
                <Table sx={{ minWidth: 1050 }}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column, i) => (
                        <TableCell key={i}>{column}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody></TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* 状況と予定 */}
          <div className="flex flex-row space-x-2">
            <div className="border border-indigo-600 h-96 p-5 w-1/2 relative">
              <label className="absolute -top-3 left-6 bg-white w-24 text-center">
                状況
              </label>
              <textarea
                className="border border-black h-full w-full"
                rows={8}
                cols={30}
                {...register("situation")}
              />
            </div>
            <div className="border border-indigo-600 h-96 p-5 w-1/2 relative">
              <label className="absolute -top-3 left-6 bg-white w-24 text-center">
                予定
              </label>
              <textarea
                className="border border-black h-full w-full"
                rows={8}
                cols={30}
                {...register("plans")}
              />
            </div>
          </div>
        </div>
      </form>
    </Box>
  );
};

export default EditPage;
