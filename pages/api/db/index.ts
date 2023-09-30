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
                        db.loadDb(dataBaseConnectionStr);
                        db.checkCredentials(body.user, body.password).then(
                            (result:any)=>{
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
                    const kinmuListFunc = async ()=> {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getKinmuList(body.id).then( 
                            (v:any)=>{
                                res.status(200).json({kinmuList: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    kinmuListFunc();
                    break;
                }
            case "shain":
                {

                    const getShain = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getShain(body.id).then( 
                            (v:any)=>{
                                res.status(200).json({test: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                        
                    }
                    getShain();
                    break;
                    
                }
            case "kinmu-update":
                {
                    console.log("ees");
                    break;
                }
            default:
                break;
        }
    }

}
