import type { NextApiRequest, NextApiResponse } from 'next'
import { ProjectItem, sakugyoNaiyouItem } from '@/src/lib/report';
const db = require("@/src/lib/database.ts")

var dataBaseConnectionStr:string = "../../../db.sqlite3";
if(process.env.NODE_ENV != "development"){
    dataBaseConnectionStr = "../../db.sqlite3";
}

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
                                        id: result.id,
                                        bango: result.bango,
                                        kyujitsuGroup: result.kyujitsu_group_id,
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
            //kinmu
            case "kinmu-add":{
                const kinmuAdd = async ()=> {
                    db.loadDb(dataBaseConnectionStr);
                    // console.log(body.kinmu);
                    const ser = await db.addKinmu(body.kinmu).then( 
                        (v:any)=>{
                            
                            if(body.kinmu.sagyouNaiyou.length > 0){
                                let p = new Promise((resolve, reject)=>{
                                    body.kinmu.sagyouNaiyou.forEach( (element:any, index:number) => {

                                        const addKSN = async () => {
                                            await db.addKinmuSagyouNaiyou( element, v )
                                        }
                                        addKSN();
                                    });
                                    resolve("")
                                })
                                p.then((val)=>{
                                    res.status(200).json({added: true});
                                    res.end();
                                    db.closeDb(dataBaseConnectionStr);
                                } )
                            }else{
                                res.status(200).json({added: true});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            }   

                          
                        } 
                    );
                    
                }
                kinmuAdd();
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
                                // db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    kinmuListFunc();
                    break;
                }
            case "kinmu-update":
                {
                    
                    const kinmuUpdate = async ()=> {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.updateKinmu(body.kinmu).then( 
                            (v:any)=>{
                              return v
                            } 
                            
                        );

                           
                        if(body.kinmu.sagyouNaiyou.length > 0){
                            
                            let deleteList = body.ksnList.filter( (el:any)=>{
                                return (body.kinmu.sagyouNaiyou.find( (ell:any)=>ell.id == el ) == undefined)
                            } ) 
                            
                            await body.kinmu.sagyouNaiyou.forEach( (element:any, index:number) => {

                                const addKSN = async () => {
                                    
                                    if(element.id == 0){
                                        await db.addKinmuSagyouNaiyou( element, body.kinmu.id )
                                    }else{
                                        await db.updateKinmuSagyouNaiyou( element )
                                    }
                                  
                                }
                                addKSN();
                            });
                            //deleteKinmuSagyouNaiyou

                            await deleteList.forEach((element:any) => {
                                const deleteMember = async () => {
                                    await db.deleteKinmuSagyouNaiyou( element ) 
                                }
                                deleteMember()
                            });
                            
                        }

                        res.status(200).json({updated: true});
                        res.end();
                        db.closeDb(dataBaseConnectionStr);

                    }
                    kinmuUpdate()
                    break;
                }
            case "kinmu-get":
                {
                    

                    const getKinmu = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        const kinmuRes = await db.getKinmu(body.id).then( 
                            (v:any)=>{
                               return v;
                            } 
                        );

                        // const snList = await db.getKinmuSagyouNaiyouList(body.id).then( 
                        //     (v:any)=>{
                        //         return v;
                        //     } 
                        // );

                        const snList:any[] = [];
                        res.status(200).json({
                            kinmu: kinmuRes, 
                            sagyouNaiyouList: snList
                        });
                        res.end();
                        // db.closeDb(dataBaseConnectionStr);

                    }
                    getKinmu();
                    break;
                }
            //shain
            case "shain-list":
                {
                    const shainListFunc = async ()=> {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getShainList().then( 
                            (v:any)=>{
                                res.status(200).json({shainList: v});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    shainListFunc();
                   
                    break;
                }
            case "shain-get":
                {
                    const getShain = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getShain(body.id).then( 
                            (v:any)=>{
                                res.status(200).json({user: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    getShain();
                    break; 
                }
            case "shain-update":
                {
                    const updateShain = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        // console.log(body?.shain);
                        const ser = await db.updateShain(body.shain).then( 
                            (v:any)=>{
                                res.status(200).json({user: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    updateShain();
                    break;
                }
            case "shain-add":
                {
                    const addShain = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.addShain(body.shain).then( 
                            (v:any)=>{
                                res.status(200).json({added: true});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    addShain();
                    break;
                }
            case "shain-delete":
                {
                    const deleteShain = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        
                        const ser = await db.deleteShain(body.id).then( 
                            (v:any)=>{
                                res.status(200).json({deleted: true});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    deleteShain();
                    break;
                }
            //project
            case "project-add":
                {
                    const addProjectf = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        await db.addProject(body.project).then( 
                            (v:any)=>{
                                if(body.members.length > 0){
                                    body.members.forEach( (element:any, index:number) => {

                                        const addMembers = async () => {
    
                                            await db.addProjectMember( {shainId: element.projectMember}, v )
                                        }
                                        addMembers();
                                    });
                                }
                               
                                if(body.tasks.length > 0){
                                    body.tasks.forEach( (element:any, index:number) =>{

                                        const addTasks = async () => {
    
                                            await db.addProjectSagyouNaiyou( element, v)
    
                                        }
                                        addTasks();
    
                                    } )
                                }
                                
                        
                            } 
                        );

                        res.status(200).json({added: true});
                        res.end();
                        db.closeDb(dataBaseConnectionStr);
                        
                    }
                    addProjectf();
                    break;
                }
            case "project-list":
                {
                    const getProjectListF = async ()=>{
                        db.loadDb(dataBaseConnectionStr);
                        await db.getProjectList().then( 
                            (v:any)=>{
                              
                                res.status(200).json({projectList: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }

                    getProjectListF();

                    break;
                }
            case "project-list-e":
                {
                    const getProjectListF = async ()=>{
                        db.loadDb(dataBaseConnectionStr);
                        await db.getProjectList().then( 
                            (v:any)=>{
                              
                                res.status(200).json({projectList: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                        
                    }

                    getProjectListF();

                    break;
                    
                }
            case "project-delete":
                {

                    const deleteProject = async () => {
                        
                        db.loadDb(dataBaseConnectionStr);
                        await db.deleteProject(body.id).then(
                         
                            (v:any)=>{
                                db.cleanProjectMembers(body.id);
                                db.cleanProjectSagyouNaiyou(body.id);
                                res.status(200).json({deleted: true});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);

                            } 
                        )

                    }
                    deleteProject();
                    break;
                }
            case "project-get":
                {
                    const getProject = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        const project = await db.getProject(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );
                        const members = await db.getProjectMembers(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );
                        
                        const sagyouNaiyou = await db.getProjectSagyouNaiyou(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );

                        res.status(200).json({project: project, members: members, sagyouNaiyou: sagyouNaiyou});
                        res.end();
                        db.closeDb(dataBaseConnectionStr);

                    }
                    getProject();
                    break; 
                }
            case "project-update":
                {
                    const updateProject = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        const project = await db.updateProject(body.project).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );

                        if(body.members.length > 0){
                            
                            let deleteList = body.mbList.filter( (el:any)=>{
                                return (body.members.find( (ell:any)=>ell.mb_id == el ) == undefined)
                            } ) 
                            
                            await body.members.forEach( (element:any, index:number) => {

                                const addMembers = async () => {
                                    
                                    if(element.mb_id == 0){
                                        await db.addProjectMember( {shainId: element.projectMember}, body.project.id)
                                    }else{
                                        await db.updateProjectMember( {mb_id: element.mb_id, shainId: element.projectMember})
                                    }
                                  
                                }
                                addMembers();
                            });

                            await deleteList.forEach((element:any) => {
                                const deleteMember = async () => {
                                    await db.deleteProjectMembers( element ) 
                                }
                                deleteMember()
                            });

                        }
                       
                        if(body.tasks.length > 0){       
                            
                            let deleteList = body.snList.filter( (el:any)=>{
                                return (body.tasks.find( (ell:any)=>ell.sn_id == el ) == undefined)
                            } ) 

                            // console.log(deleteList);
                            
                            await body.tasks.forEach( (element:any, index:number) =>{    
                                const addTasks = async () => {
                                    if(element.sn_id == 0){
                                        await db.addProjectSagyouNaiyou( element, body.project.id)
                                    }else{
                                        await db.updateProjectSagyouNaiyou( element )
                                    }
                                    
                                }
                                addTasks();
                            } )

                            await deleteList.forEach((element:any) => {
                                const deleteTasks = async () => {
                                    await db.deleteProjectSagyouNaiyou( element ) 
                                }
                                deleteTasks()
                            });

                        }

                        res.status(200).json({updated: true});
                        res.end();
                        db.closeDb(dataBaseConnectionStr);
                    }
                    updateProject()

                    break;
                }
            case "project-list-kinmu":
                {
                    const getProjectListF = async ()=>{
                        db.loadDb(dataBaseConnectionStr);
                        await db.getProjectListKinmu().then( 
                            (v:any)=>{
                              
                                res.status(200).json({projectList: v});
                                res.end();
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                        
                    }

                    getProjectListF();

                    break;
                }
            case "shuu-sagyou-houkoku":
                {
                    const kinmuListFunc = async ()=> {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getSagyouNaiyou(body.beginDate, body.endDate, body.shainId).then( 
                            (v:any)=>{
                                res.status(200).json({projectList: v});
                                res.end();
                                // console.log(v);
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                        
                    }
                    kinmuListFunc();
                    // db.getSagyouNaiyou(body.beginDate, body.endDate, body.shainId).then(
                    //     (v:any)=>{
                    //         console.log(v)
                    //     }
                    // )
                    break
                }
            default:
                break;
        }
    }else{
        res.status(400).end();
    }
}