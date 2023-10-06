"use client";

import Navigation from "@/components/atmos/Drawer";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export const title = "東亜ソフト業務管理ソフト";

export const subTitle = [
  { tabTitle: "通常業務", url: "/pages/top" },
  { tabTitle: "出張", url: "" },
  { tabTitle: "各種フォルダ", url: "" },
  { tabTitle: "WEBリンク", url: "" },
  { tabTitle: "各種帳票", url: "" },
  { tabTitle: "マスタ保守", url: "/pages/top/master" },
];

const pageTitles = [
  { label: "製品登録", url: "" },
  { label: "部署登録", url: "" },
  { label: "メール設定", url: "" },
  { label: "社員登録", url: "/pages/top/master/syaintouroku" },
  { label: "業種登録", url: "" },
  { label: "カレンダー登録", url: "" },
];
const MasterPage = () => {
  const router = useRouter();

  const clickHandler = (url: string) => {
    router.push(url);
  };

  return (
    <div className="h-screen">
      {/* タイトルスペース */}
      <div className="h-40 border border-indigo-600"></div>
      <div className="flex flex-row h-full">
        <div className="w-72">
          <Navigation title={title} subTitles={subTitle} label="ログオフ" />
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="grid gap-4 grid-cols-3">
            {pageTitles.map((page, index) => (
              <Button
                variant="outlined"
                onClick={() => clickHandler(page.url)}
                key={index}
              >
                {page.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterPage;
