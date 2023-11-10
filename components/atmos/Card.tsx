"use client";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type PropsType = {
  title: string;
  cardColor: string;
  buttonColor: string;
  shadowColor: string;
  url: string;
  openNewTab: boolean;
  image: string;
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
  image,
}: PropsType) => {
  const buttonStyle = `${buttonColor} border rounded-full w-14 h-14 mb-3 self-end flex justify-center items-center`;
  const cardStyle = `${cardColor} border rounded-lg w-80 min-[1940px]:h-44 h-44 shadow-2xl ${shadowColor}`;

  return (
    <div className={cardStyle}>
      <div className="flex h-full">
        {/* ↓画像配置 */}
        <div className="border border-indig-600 w-1/2 rounded-full">
          <Image
            src={image}
            alt=""
            width={159}
            height={174}
            // sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between items-center p-3">
          <h1 className="text-lg text-center font-bold">{title}</h1>
          {openNewTab ? (
            <a href={url} target="_blank">
              <button className={buttonStyle} />
            </a>
          ) : (
            <Link href={url}>
              <button className={buttonStyle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicCard;
