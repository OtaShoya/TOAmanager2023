import type { NextApiRequest, NextApiResponse } from 'next'
import { ProjectItem, sakugyoNaiyouItem } from '@/src/lib/report';
const db = require("@/src/lib/database.ts")
const dbTest = require("@/src/lib/database_new.ts")

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
                       
                        dbTest.checkCredentials(body.user, body.password).then(
                            (result:any)=>{
                                // db.closeDb(dataBaseConnectionStr);
                                
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
                    // db.loadDb(dataBaseConnectionStr);
                    // console.log(body.kinmu);
                    const ser = await dbTest.addKinmu(body.kinmu).then( 
                        (v:any)=>{
                            
                            if(body.kinmu.sagyouNaiyou.length > 0){
                                let p = new Promise((resolve, reject)=>{
                                    body.kinmu.sagyouNaiyou.forEach( (element:any, index:number) => {

                                        const addKSN = async () => {
                                            await dbTest.addKinmuSagyouNaiyou( element, v, index + 1)
                                        }
                                        addKSN();
                                    });
                                    resolve("")
                                })
                                p.then((val)=>{
                                    res.status(200).json({added: true});
                                    res.end();
                                    // db.closeDb(dataBaseConnectionStr);
                                } )
                            }else{
                                res.status(200).json({added: true});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);
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
                        const ser = await dbTest.getKinmuList(body.id).then( 
                            (v:any)=>{
                                // console.log(v)
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
                        await dbTest.updateKinmu(body.kinmu).then( 
                            (v:any)=>{
                              return v
                            } 
                            
                        );

                        if(body.ksnList.length > body.kinmu.sagyouNaiyou.length){
                            await body.ksnList.forEach(
                                (el:any, index:number)=>{
                                    if(index > body.kinmu.sagyouNaiyou.length - 1){
                                        dbTest.deleteKinmuSagyouNaiyou(index + 1, body.kinmu.id)
                                    }
                                }
                            )
                        }
                         
                        if(body.kinmu.sagyouNaiyou.length > 0){


                            await body.kinmu.sagyouNaiyou.forEach( (element:any, index:number) => {

                                const addKSN = async () => {
                                    
                                    if(index > body.ksnList.length - 1)
                                    {
                                       
                                        await dbTest.addKinmuSagyouNaiyou( element, body.kinmu.id, index + 1 )
                                    }else{
                                        element.id = index + 1;
                                        await dbTest.updateKinmuSagyouNaiyou( element, body.kinmu.id  )
                                    }
                                  
                                }
                                addKSN();
                            });
                            //deleteKinmuSagyouNaiyou

                       
                            
                        }

                        res.status(200).json({updated: true});
                        res.end();
                    }
                    kinmuUpdate()
                    break;
                }
            case "kinmu-get":
                {
                    

                    const getKinmu = async () => {
                        // db.loadDb(dataBaseConnectionStr);
                        const kinmuRes = await dbTest.getKinmu(body.id).then( 
                            (v:any)=>{
                               return v;
                            } 
                        );

                        const snList = await dbTest.getKinmuSagyouNaiyouList(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );

                        // const snList:any[] = [];
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
                        // db.loadDb(dataBaseConnectionStr);
                        const ser = await dbTest.getShainList().then( 
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
                       
                        const ser = await dbTest.getShain(body.id).then( 
                            (v:any)=>{
                                res.status(200).json({user: v});
                                res.end();
                                // dbTest.closeDb();
                            } 
                        );
                    }
                    getShain();
                    break; 
                }
            case "shain-update":
                {
                    const updateShain = async () => {
                        // db.loadDb(dataBaseConnectionStr);
                        // console.log(body?.shain);
                        const ser = await dbTest.updateShain(body.shain).then( 
                            (v:any)=>{
                                res.status(200).json({user: v});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }
                    updateShain();
                    break;
                }
            case "shain-add":
                {
                    const addShain = async () => {
                        // db.loadDb(dataBaseConnectionStr);
                        const ser = await dbTest.addShain(body.shain).then( 
                            (v:any)=>{
                                res.status(200).json({added: true});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);
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
                        // db.loadDb(dataBaseConnectionStr);
                        await dbTest.addProject(body.project).then( 
                            (v:any)=>{
                                if(body.members.length > 0){
                                    body.members.forEach( (element:any, index:number) => {

                                        const addMembers = async () => {
    
                                            await dbTest.addProjectMember( {shainId: element.projectMember}, v )
                                        }
                                        addMembers();
                                    });
                                }
                               
                                if(body.tasks.length > 0){
                                    body.tasks.forEach( (element:any, index:number) =>{

                                        const addTasks = async () => {
    
                                            await dbTest.addProjectSagyouNaiyou( element, v, index + 1)
    
                                        }
                                        addTasks();
    
                                    } )
                                }
                                
                        
                            } 
                        );

                        res.status(200).json({added: true});
                        res.end();
                        // db.closeDb(dataBaseConnectionStr);
                        
                    }
                    addProjectf();
                    break;
                }
            case "project-list":
                {
                    const getProjectListF = async ()=>{
                        
                        await dbTest.getProjectList().then( 
                            (v:any)=>{
                              
                                res.status(200).json({projectList: v});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);
                            } 
                        );
                    }

                    getProjectListF();

                    break;
                }
            case "project-delete":
                {

                    const deleteProject = async () => {
                        
                        // db.loadDb(dataBaseConnectionStr);
                        await dbTest.deleteProject(body.id).then(
                         
                            (v:any)=>{
                                dbTest.cleanProjectMembers(body.id);
                                dbTest.cleanProjectSagyouNaiyou(body.id);
                                res.status(200).json({deleted: true});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);

                            } 
                        )

                    }
                    deleteProject();
                    break;
                }
            case "project-get":
                {
                    const getProject = async () => {
                        
                        const project = await dbTest.getProject(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );
                        const members = await dbTest.getProjectMembers(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );
                        
                        const sagyouNaiyou = await dbTest.getProjectSagyouNaiyou(body.id).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );

                        res.status(200).json({project: project, members: members, sagyouNaiyou: sagyouNaiyou});
                        res.end();
                    }
                    getProject();
                    break; 
                }
            case "project-update":
                {
                    const updateProject = async () => {
                        db.loadDb(dataBaseConnectionStr);
                        await dbTest.updateProject(body.project).then( 
                            (v:any)=>{
                                return v;
                            } 
                        );

                        if( body.mbList.length > 0){
                            body.mbList.forEach( (el:any)=>{
                                if(body.members.find( (ell:any)=>ell.projectMember == el ) == undefined){
                                    const deleteMember = async () => {
                                        await dbTest.deleteProjectMembers( el, body.project.id ) 
                                    }
                                    deleteMember();
                                }
                            } )
                        }
                        
                        if(body.members.length > 0){
                            await body.members.forEach( (element:any, index:number) => {

                                const addMembers = async () => {
                                    
                                    if(body.mbList.find( (ell:any)=> element.projectMember == ell) == undefined){
                                        await dbTest.addProjectMember( {shainId: element.projectMember}, body.project.id)
                                    }
                                    
                                }
                                addMembers();
                            });
                        }
   
                        // let deleteList = body.snList.filter( (el:any)=>{
                        //     return (body.tasks.find( (ell:any)=>ell.sn_id == el ) == undefined)
                        // } ) 
                     

                        if( body.snList.length > body.tasks.length  ){
                            await  body.snList.forEach((element:any, index:number) =>{ 
                                
                                if( index > (body.tasks.length - 1) ){
                                    console.log(index + 1);
                                    const deleteTasks = async () => {
                                        await dbTest.deleteProjectSagyouNaiyou( index + 1, body.project.id) 
                                    }
                                    deleteTasks()
                                }
                            })
                        }
                        if(body.tasks.length > 0){       

                            await body.tasks.forEach( (element:any, index:number) =>{    
                                const addTasks = async () => {
                                    if(index > (body.snList.length - 1) ){
                                        
                                        await dbTest.addProjectSagyouNaiyou( element, body.project.id, index + 1)

                                    }else{
                                        element.sn_id = index + 1;
                                        await dbTest.updateProjectSagyouNaiyou( element, body.project.id)
                                    }
                                }
                                addTasks();
                            } )

                           

                        }

                        // await deleteList.forEach((element:any) => {
                        //     const deleteTasks = async () => {
                        //         await dbTest.deleteProjectSagyouNaiyou( element, body.project.id) 
                        //     }
                        //     deleteTasks()
                        // });
                        res.status(200).json({updated: true});
                        res.end();
                        // db.closeDb(dataBaseConnectionStr);
                    }
                    updateProject()

                    break;
                }
            case "project-list-kinmu":
                {
                    const getProjectListF = async ()=>{
                        // db.loadDb(dataBaseConnectionStr);
                        await dbTest.getProjectListKinmu().then( 
                            (v:any)=>{
                                res.status(200).json({projectList: v});
                                res.end();
                                // db.closeDb(dataBaseConnectionStr);
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
                {
                    res.status(400).end();
                }
                break;
        }
    }else{
        res.status(400).end();
    }
}