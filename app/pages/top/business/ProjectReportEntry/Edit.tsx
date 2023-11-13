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
    <form
      className="px-4 pb-8 bg-[#556593] min-[1940px]:h-full h-max"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="edit-title">プロジェクト報告書登録</h1>
      <div className="space-y-8">
        {/* プロジェクト情報 */}
        <div className="border p-5 relative">
          <label className="absolute -top-3 left-6 bg-[#556593] text-white text-center w-48">
            プロジェクト情報
          </label>
          <div className="flex flex-col space-y-2 h-full px-10">
            <div className="flex justify-between items-center">
              {/* プロジェクト */}
              <div className="flex flex-col">
                <label className="text-white">プロジェクト</label>
                <select
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("projectName")}
                >
                  {projectNames.map((name, index) => (
                    <option value={index} key={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              {/* 報告日 */}
              <div className="flex flex-col">
                <label className="text-white">報告日</label>
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("date1")}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              {/* プロジェクト番号 */}
              <label className="flex flex-col text-white">
                プロジェクト番号
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50 text-black"
                  {...register("projectNo")}
                />
              </label>
              {/* 予算 */}
              <label className="flex flex-col text-white">
                予算
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("budget")}
                />
              </label>
              {/* 工数 */}
              <label className="flex flex-col text-white">
                工数
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("cost1")}
                />
              </label>
            </div>
            <div className="flex justify-between items-center">
              <label className="flex flex-col text-white">
                本稼働予定日
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("date2")}
                />
              </label>
              <label className="flex flex-col text-white">
                開始日
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("date3")}
                />
              </label>
              <label className="flex flex-col text-white">
                終了日
                <input
                  className="w-[240px] min-[1940px]:h-14 h-10 px-2 border border-white rounded bg-slate-50"
                  {...register("date4")}
                />
              </label>
            </div>
          </div>
        </div>
        {/* 作業時間 */}
        <div className="border p-5 relative items-center">
          <label className="absolute -top-3 left-6 bg-[#556593] text-white w-48 text-center">
            作業時間
          </label>
          <div className="h-full box-border flex flex-col">
            <label className="flex items-center justify-center my-3 text-white">
              集計期間
              <div className="flex ml-2 text-black space-x-2">
                <input className="border rounded" />
                <div className="text-white place-self-center">〜</div>
                <input className="border rounded" />
                <button className="border border-indigo-600 bg-indigo-600 text-white rounded-full ml-4 p-2">
                  作業報告から取込
                </button>
              </div>
            </label>
            {/* テーブル */}
            <table>
              <thead>
                <tr>
                  <th className="border w-[400px] text-white bg-indigo-600 ">
                    作業内容
                  </th>
                  <th className="border w-[400px] text-white bg-indigo-600">
                    担当
                  </th>
                  <th className="border w-[200px] text-white bg-indigo-600">
                    作業時間
                  </th>
                  <th className="border w-[200px] text-white bg-indigo-600">
                    備考
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {form1.map((form, index) => (
                  <tr key={form.id}>
                    <td>
                      <select
                        className="w-full min-[1940px]:h-14 h-10 px-2 border border-white bg-slate-50"
                        {...register(`form1.${index}.work`)}
                      >
                        {workOptions.map((option: string, i) => (
                          <option value={i} key={i}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="w-full min-[1940px]:h-14 h-10 px-2 border border-white bg-slate-50"
                        {...register(`form1.${index}.tantou`)}
                      >
                        {tantouOptions.map((option: string, i) => (
                          <option value={i} key={i}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="w-full min-[1940px]:h-14 h-10 px-2 border bg-slate-50"
                        {...register(`form1.${index}.workTime`)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="w-full min-[1940px]:h-14 h-10 px-2 border bg-slate-50"
                        {...register(`form1.${index}.bikou`)}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => form1Remove(index)}
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
              className="text-white bg-indigo-600 justify-self-center mt-3 rounded-lg w-20 py-2 place-self-center"
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
        <div className="border h-64 p-5 relative">
          <label className="absolute -top-3 left-6 bg-[#556593] text-white w-24 text-center">
            進捗
          </label>
          <table>
            <thead>
              <tr>
                {columns.map((column, i) => (
                  <th
                    className="border text-white bg-indigo-600 min-[1940px]:w-[150px] w-[140px]"
                    key={i}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 状況と予定 */}
        <div className="flex space-x-2">
          <div className="border h-64 p-5 w-1/2 relative">
            <label className="absolute -top-3 left-6 bg-[#556593] text-white w-24 text-center">
              状況
            </label>
            <textarea
              className="border border-indigo-600 h-full w-full p-2"
              rows={8}
              cols={30}
              {...register("situation")}
            />
          </div>
          <div className="border h-64 p-5 w-1/2 relative">
            <label className="absolute -top-3 left-6 bg-[#556593] text-white w-24 text-center">
              予定
            </label>
            <textarea
              className="border border-indigo-600 h-full w-full p-2"
              rows={8}
              cols={30}
              {...register("plans")}
            />
          </div>
        </div>
        {/* 登録ボタン */}
        <div className="flex justify-center">
          <button
            className="border border-indigo-600 bg-indigo-600 text-white rounded-full w-24 p-2 "
            type="submit"
          >
            登録
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPage;
