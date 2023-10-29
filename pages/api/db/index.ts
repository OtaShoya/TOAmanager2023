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
            case "kinmu-update":
                {
                    
                    break;
                }
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
    
                                            await db.addProjectSakugyouNaiyou( element, v)
    
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
            case "project-delete":
                {

                    const deleteProject = async () => {
                        
                        db.loadDb(dataBaseConnectionStr);
                        await db.deleteProject(body.id).then(
                         
                            (v:any)=>{
                                console.log(body.id);
                                db.cleanProjectMembers(body.id);
                                db.cleanProjectSakugyouNaiyou(body.id);
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
                        
                        const sakugyouNaiyou = await db.getProjectSakugyouNaiyou(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );

                        res.status(200).json({project: project, members: members, sakugyouNaiyou: sakugyouNaiyou});
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
                        await db.cleanProjectMembers(body.project.id)
                        if(body.members.length > 0){
                            
                            await body.members.forEach( (element:any, index:number) => {

                                const addMembers = async () => {

                                    await db.addProjectMember( {shainId: element.projectMember}, body.project.id)
                                }
                                addMembers();
                            });
                        }
                        await db.cleanProjectSakugyouNaiyou(body.project.id)
                        if(body.tasks.length > 0){
                            
                            await body.tasks.forEach( (element:any, index:number) =>{
                                
                                const addTasks = async () => {
                                    
                                    await db.addProjectSakugyouNaiyou( element, body.project.id)

                                }
                                addTasks();

                            } )
                        }
                        // const members = await db.updateProjectMembers(body.member).then( 
                        //     (v:any)=>{
                        //         return v;
                        //     } 
                        // );
                        
                        // const sakugyouNaiyou = await db.updateProjectSakugyouNaiyou(body.sakugyouNaiyou).then( 
                        //     (v:any)=>{
                        //         return v;
                        //     } 
                        // );

                        res.status(200).json({updated: true});
                        res.end();
                        db.closeDb(dataBaseConnectionStr);
                    }
                    updateProject()

                    break;
                }
            case "shuu-sakugyou-houkoku":
                {
                    const kinmuListFunc = async ()=> {
                        db.loadDb(dataBaseConnectionStr);
                        const ser = await db.getSakugyouNaiyou(body.beginDate, body.endDate, body.shainId).then( 
                            (v:any)=>{
                                res.status(200).json({projectList: v});
                                res.end();
                                // console.log(v);
                                db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                        
                    }
                    kinmuListFunc();
                    // db.getSakugyouNaiyou(body.beginDate, body.endDate, body.shainId).then(
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