import type { NextApiRequest, NextApiResponse } from 'next'

const db = require("../../../src/lib/database.ts")
var dataBaseConnectionStr:string = "../../../db.sqlite3";

export default function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method == "POST" && req.body){
        var body = JSON.parse(req.body);
        switch (body?.type) {
            case "login":
                {
                    const loginFunc = async ()=>{
                        //change that on final database
                        db.loadDb("../" + dataBaseConnectionStr);

                        db.checkCredentials(body.user, body.password).then(
                            (result)=>{
                                db.closeDb(dataBaseConnectionStr);
                                
                                if(result){
                                    res.status(200).json({
                                        id: result.id
                                    })
                                }else{
                                    res.status(400).json({
                                        error: result
                                    });
                                }
                                res.end();
                            }
                        );
                    };
                   
                    loginFunc();
                    break;
                }
            case "kinmu-list":
                {
                    async function kinmuListFunc() {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getKinmuList(body.id).then( 
                            (v)=>{
                                // console.log(v)
                                
                                res.status(200).json({test: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                        
                    }
                    kinmuListFunc();
                    break;
                }
            default:
                break;
        }
    }

}
