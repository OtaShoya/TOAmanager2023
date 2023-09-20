import type { NextApiRequest, NextApiResponse } from 'next'

// var edge = require("edge-js")

const db = require("../../../src/ts/database.ts")

var dataBaseConnectionStr:string = "../../../../db.sqlite3";

export default function hadler(req:NextApiRequest, res:NextApiResponse) 
{
    const { pid } = req.query;
    
    async function t() {
        db.loadDb(dataBaseConnectionStr);
        const ser = await db.getKinmuList(pid).then( (v)=>{
            db.closeDb(dataBaseConnectionStr);
            res.status(200).json({test: v})
            return v;
        } );
        return ser;
    }

    t()
    // const edge = require("edge-js");
    // var ss = edge.func({
    //     assemblyFile: "ClassLibrary1.dll",
    //     typeName: 'ClassLibrary1.TestController',
    //     methodName: 'GetTest'
    // });
    // ss("s", (err, result)=>{
    //     if(err) throw err
    //     console.log(result);
    // });
}