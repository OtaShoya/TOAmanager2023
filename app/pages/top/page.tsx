import Navigation from "@/components/atmos/Drawer";

export const title = "東亜ソフト業務管理ソフト";

export const subTitle = [
  { tabTitle: "通常業務", url: "/pages/top/business" },
  { tabTitle: "出張", url: "" },
  { tabTitle: "各種フォルダ", url: "" },
  { tabTitle: "WEBリンク", url: "" },
  { tabTitle: "各種帳票", url: "" },
  { tabTitle: "マスタ保守", url: "/pages/top/master" },
];

const TopPage = () => {
  return (
    <>
      <Navigation title={title} subTitles={subTitle} label="ログオフ" />
    </>
  );
};

export default TopPage;
