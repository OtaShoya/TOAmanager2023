import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  useForm,
  SubmitHandler,
  useController,
  UseControllerProps,
} from "react-hook-form";

type FormType = {
  clientNo: string;
  eigyoRute: string;
  clientOffcialNo: string;
  clientName: string;
  industry: string;
  hp: string;
  postNo: string;
  address: string;
  map: string;
  another: string;
  phoneNo: string;
  fax: string;
};

type CommonInputProps = UseControllerProps<FormType> & {
  width: string;
  label: string;
};

const madoguti = [
  "氏名",
  "フリガナ",
  "部署名",
  "役職",
  "備考",
  "メールアドレス",
  "電話番号",
  "携帯番号",
];

const dounyuu = [
  "製品",
  "製品名",
  "導入日",
  "価格",
  "保守期間",
  "保守料",
  "契約期間",
  "保守開始日",
  "保守終了日",
  "自動延長",
  "リモート保守",
  "メール通知",
  "備考",
  "プロジェクト",
];

const remote = ["接続先", "接続ツール", "ユーザ", "パスワード", "備考"];

const CommonInput = ({ control, name, width, label }: CommonInputProps) => {
  const { field } = useController({ control, name });
  const inputDesign = `${width} border rounded-lg`;

  return (
    <div className="flex flex-col">
      <label className="text-white">{label}</label>
      <input className={inputDesign} {...field} />
    </div>
  );
};

const AddPage = () => {
  const { handleSubmit, control } = useForm<FormType>();

  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log(data);
  };

  return (
    <form
      className="p-4 flex flex-col bg-[#556593] h-screen"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="edit-title">新規登録</h1>
      <div className="space-y-8">
        {/* フォーム */}
        <div className="grid grid-cols-2 gap-y-1">
          <CommonInput
            control={control}
            name="clientNo"
            width="w-48"
            label="顧客番号"
          />
          <CommonInput
            control={control}
            name="eigyoRute"
            width="w-48"
            label="営業ルート"
          />
          <CommonInput
            control={control}
            name="clientOffcialNo"
            width="w-48"
            label="顧客正式番号"
          />
          <CommonInput
            control={control}
            name="clientName"
            width="w-48"
            label="顧客略称"
          />
          <CommonInput
            control={control}
            name="industry"
            width="w-48"
            label="業種"
          />
          <CommonInput
            control={control}
            name="hp"
            width="w-48"
            label="ホームページ"
          />
          <CommonInput
            control={control}
            name="postNo"
            width="w-24"
            label="郵便番号"
          />
          <CommonInput
            control={control}
            name="address"
            width="w-72"
            label="住所"
          />
          <CommonInput control={control} name="map" width="w-24" label="地図" />
          <CommonInput
            control={control}
            name="another"
            width="w-72"
            label="備考"
          />
          <CommonInput
            control={control}
            name="phoneNo"
            width="w-48"
            label="連絡先"
          />
          <CommonInput control={control} name="fax" width="w-48" label="FAX" />
        </div>
        {/* 窓口 */}
        <div className="border p-5 relative">
          <label className="absolute -top-3 left-6 bg-[#556593] text-white w-24 text-center">
            窓口
          </label>
          <table className="w-full">
            <thead>
              <tr>
                {madoguti.map((column, i) => (
                  <th className="border bg-white text-[#556593]" key={i}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </table>
        </div>
        {/* 導入製品 */}
        <div className="border p-5 relative">
          <label className="absolute -top-3 left-6 bg-[#556593] text-white w-24 text-center">
            導入製品
          </label>
          <table className="w-full">
            <thead>
              <tr>
                {dounyuu.map((column, i) => (
                  <th className="border bg-white text-[#556593] px-2" key={i}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </table>
        </div>
        {/* リモート保守 */}
        <div className="border p-5 relative">
          <label className="absolute -top-3 left-6 bg-[#556593] text-white w-24 text-center">
            リモート保守
          </label>
          <table className="w-full">
            <thead>
              <tr>
                {remote.map((column, i) => (
                  <th className="border bg-white text-[#556593]" key={i}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </table>
        </div>
        <button className="text-[#556593] hover:text-white bg-white hover:bg-[#556593] border horver:border-white rounded-lg px-5 py-2 w-20 place-self-center">
          登録
        </button>
      </div>
    </form>
  );
};

export default AddPage;
