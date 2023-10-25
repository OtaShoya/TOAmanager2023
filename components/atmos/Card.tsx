"use client";
import Link from "next/link";
import * as React from "react";
type PropsType = {
  title: string;
  cardColor: string;
  buttonColor: string;
  shadowColor: string;
  url: string;
  openNewTab: boolean;
};

export const cardColors = [
  {
    cardBg: "bg-[#EDDBFF]",
    buttonBg: "bg-[#AC6FE9]",
    shadow: "shadow-purple-400/50",
  },
  {
    cardBg: "bg-[#FFEBE3]",
    buttonBg: "bg-[#FFAA88]",
    shadow: "shadow-orange-300/50",
  },
  {
    cardBg: "bg-[#DCF0FF]",
    buttonBg: "bg-[#94D1FF]",
    shadow: "shadow-cyan-100/50",
  },
];

const BasicCard = ({
  title,
  cardColor,
  buttonColor,
  shadowColor,
  url,
  openNewTab,
}: PropsType) => {
  const buttonStyle = `${buttonColor} border rounded-full w-14 h-14 mb-3 self-end`;
  const cardStyle = `${cardColor} border rounded-lg w-80 h-44 shadow-2xl ${shadowColor}`;

  return (
    <div className={cardStyle}>
      <div className="flex flex-row h-full">
        {/* ↓画像配置 */}
        <div className="border border-indig-600 w-1/2"></div>
        <div className="w-1/2 flex flex-col justify-between items-center p-3">
          <h1 className="text-lg text-center font-bold">{title}</h1>
          {openNewTab ? (
            <a href={url} target="_blank">
              <button className={buttonStyle} />
            </a>
          ) : (
            <Link href={url}>
              <button className={buttonStyle} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicCard;
