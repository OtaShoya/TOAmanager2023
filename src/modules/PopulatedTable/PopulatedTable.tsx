"use client";
import React, {useState, useEffect} from "react";

const kyuukeiJikan = 1;
const sagyouJikan = 8;

var shinyaJi:Date = new Date();
shinyaJi.setUTCHours(22);
shinyaJi.setUTCMinutes(30);

function format(toFormat:number){
    return toFormat>9?toFormat:"0"+toFormat;
}

function getWeekDay(day:Number){
    switch(day){
        case 0:
            return "日";
        case 1:
            return "月";
        case 2:
            return "火";
        case 3:
            return "水";
        case 4:
            return "木";
        case 5:
            return "金";
        case 6:
            return "土";
        default:
            return "土";
    }
}

function SelectInput( {options, defaultOption}:any ){

    let def = 0;

    return(
        <select defaultValue={defaultOption}>
            { options.map((option:any, index:any)=>{
                if (option.id == defaultOption) {
                    def
                }
                return (
                        <option key={index} value={option.id} >{option.name}</option>
                    );
            }) }
        </select>
    )
}

class OptionElement{
    name!:string;
    id!:number;
}

async function fetchData(setDataf:any) {
    const res = await fetch("/api/db/",
    {
        method: "POST", 
        body: JSON.stringify(
            {
                type: "kinmu-list",
                id: localStorage.getItem("userID"),
            }
        ),
    });
    const d = await res.json();
    setDataf(d);
}

export default function PopulatedTable({ beginingDate}:any ){
    const [data, setData]:any = useState([]);
   
    useEffect(()=>{
        if(!loaded){
            fetchData(setData);
            loaded = true;
        }
    });

    let endDate = new Date(beginingDate.toString());
    endDate.setMonth(endDate.getMonth() + 1);
    var rows:Array<any> = [];

    if(!data.kinmuList){
        return "";
    }
    
    for(let date = new Date(beginingDate.toString());  date.getTime() < endDate.getTime(); date.setDate( date.getDate() + 1) ){
        
        let foundEl = data.kinmuList.find((el:any)=> {
            var fDate = new Date( el.hidsuke);
            return ( fDate.getDate() == date.getDate() && fDate.getMonth() == date.getMonth() && fDate.getFullYear() == date.getFullYear())
        })
        
        if(foundEl){
            rows.push(foundEl);
        }else{
            rows.push( { 
                hidsuke: new Date(date.toString()),
                kinmuKubun: 0,
                kinmuKeitai: 0,
                shusshaJikoku: new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
                taishaJikoku: new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
                koujyoJikan: 0,
                kinmuJikan: 0,
                kyuushutsuJikan: 0,
                sagyouJikanGoukei: 0,
                memo: ""
                });
        }

    }
    
    return  rows.map( (val:any, i, ar)=>
    {
        var taishaJikokuJikan = new Date(val.taishaJikoku).getUTCHours() +  new Date(val.taishaJikoku).getUTCMinutes()/60 ;
        var shusshaJikokuJikan = new Date(val.shusshaJikoku).getUTCHours() +  new Date(val.shusshaJikoku).getUTCMinutes()/60
        var kinmuJikan = taishaJikokuJikan - shusshaJikokuJikan - kyuukeiJikan;
        var zangyouJikan = kinmuJikan - sagyouJikan
        var zangyouJikanShinya = taishaJikokuJikan - (shinyaJi.getUTCHours() + shinyaJi.getUTCMinutes()/60);
        
        var sagyou = kinmuJikan + (val.koujyoJikan?val.koujyoJikan:0) - (val.kyuushutsuJikan?val.kyuukeiJikan:0);

        var opts:Array<OptionElement> =
        [
            {name: "", id: 0},
            {name: "A", id: 1},
            {name: "B", id: 2},
            {name: "C", id: 3},
            {name: "D", id: 4},
        ]
        
        var shusshaString = format(new Date(val.shusshaJikoku).getUTCHours())+ ":" + format(new Date(val.shusshaJikoku).getUTCMinutes());
        var taishaString = format( new Date(val.taishaJikoku).getUTCHours()) + ":" +format( new Date(val.taishaJikoku).getUTCMinutes());
        var styleString={  };
        
        if(shusshaString == taishaString){
            styleString={ backgroundColor: "#f99"};
        }

        return (
            <tr key={i}>
                {/* 日付 */}
                <td>{new Date(val.hidsuke).getFullYear()}/{format(new Date(val.hidsuke).getMonth() + 1)}/{format(new Date(val.hidsuke).getDate())}</td>
                {/* 曜日 */}
                <td>{getWeekDay(new Date(val.hidsuke).getDay())}</td>
                {/* 勤務区分 */}
                <td><SelectInput options={opts} defaultOption={val.kinmuKubun?val.kinmuKubun:0} /></td>
                {/* 勤務形態 */}
                <td><SelectInput options={opts} defaultOption={val.kinmuKeitai?val.kinmuKeitai:0} /></td>
                {/* 出社時刻 */}
                <td style={styleString}>{shusshaString == taishaString || shusshaString == "00:00"?"":shusshaString}</td>
                {/* 退社時刻 */}
                <td style={styleString}>{shusshaString == taishaString || taishaString == "00:00"?"":taishaString}</td>
                {/* 控除時間 */}
                <td>{val.koujyoJikan > 0?val.koujyoJikan.toFixed(2):""}</td>
                {/* 勤務時間 */}
                <td>{kinmuJikan > 0?kinmuJikan.toFixed(2):""}</td>
                {/* 残業時間 */}
                <td>{ zangyouJikan > 0? zangyouJikan.toFixed(2):""}</td>
                {/* 残業時間（深夜） */}
                <td>{zangyouJikanShinya > 0?zangyouJikanShinya.toFixed(2):""}</td>
                {/* 休出時間 */}
                <td>{val.kyuushutsuJikan>0?val.kyuushutsuJikan.toFixed(2):""}</td>
                {/* 作業時間合計 */}
                <td>{sagyou > 0?sagyou.toFixed(2):""}</td>
                {/* メモ */}
                <td>{val.memo}</td>
            </tr>
            );
    } );
}

let loaded = false;
