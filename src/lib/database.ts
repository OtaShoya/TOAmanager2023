import { sakugyoNaiyouItem, ProjectItem } from "@/src/lib/report";

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

var db:any;

class KinmuSakugyouNaiyou{
    kinmuDate?: Date|null;
    projectId?: number|null;
    sakugyouNaiyouId?: number|null;
    sakugyouJikan?: number|null;
}

class Kinmu{
    id?: number|string|null;
    shainId?:number|string|null;
    hidsuke?:string|Date|null ; //date
    kinmuKubun?: number|string|null;
    kinmuKeitai?: number|string|null;//form
    shusshaJikoku?: string|Date|null;//momment of arrival
    taishaJikoku?: string|Date|null;//momment of departure
    koujyoJikan?: number|string|null;
    kyuushutsuJikan?: number|string|null;
    memo?:string|null;

    sakugyouNaiyou?:Array<KinmuSakugyouNaiyou>|null;
}

class Shain{
    id?: number|string|null;
    bango?: number|string|null;
    password?: number|string|null;
    shimei?: string|null;
    furigana?: string|null;
    ryakushou?: string|null;//abreviation
    bushoId?: number|string|null; //post //Select
    shainKubunId?: number|string|null; //employee devision //Select
    yakushokuId?: number|string|null; //manegerial position //Select
    kyujitsuGroupId?: number|string|null; //day off group //Select
    shayouKeitaiBango?: string|null; //Company's cellphone number
    shayouKeitaiNaisenBango?: string|null; //Company's cellphone extension number
    nyuushaNichi?: Date|string|null; //day entering the company
    taishaNichi?: Date|string|null; //day of resignation
    account?: string|null;
    mailAddress?: string|null;
    yubinBango?: string|null; //mailNumber
    jyuusho?: string|null; //address
    denwaBango?: string|null; //phone Number
    keitaiBango?: string|null; //cellphone number
    inkan?: string|null; //stamp // data/image
}

class Project{
    id?:number
    kokakuId?:number //client
    jyuchuuRootId?:number //accepting order root
    bangou?:string
    oyaProjectId?:number //parent project
    na?:string
    gaiyou?:string //Project outline
    mokuhyou?:string //project objective
    yosa?:number //budget
    cousuu?:number //man-hours
    keihi?:number //cost
    honkadouYoteiHi?:string //day of actual opration
    kashibi?:string //starting day
    shuuryoubi?:string //end day
    memo?:string
    mitsumoriFile?:string //stimate file
    documentFolder?:string
    shuuryuHoukoku?:String //end report
}

class ProjectSakugyouNaiyou{

    id?:number
    protectId?:number
    taskId?:number
    sakugyouNaiyou?:string
    kaishiYoteiHi?:string
    shuuryouYoteiHu?:string
    yoteiKousuu?:string 

}

var bushoList = {};
var shainKubunList = {};
var yakushoku = {};
var kyujitsuGroup = {};

var databaseLocation;

const createDb = ()=>{
   db.serialize(()=>{
    //create empleyee table
    db.run(
        "CREATE TABLE"
        +" shain"
        +"("
        +"id INTEGER PRIMARY KEY"
        +",bango TEXT"
        +",password TEXT"
        +",shimei TEXT"
        +",furigana TEXT"
        +",ryakushyou TEXT"
        +",busho_id INTEGER"
        +",shain_kubun_id INTEGER"
        +",yakushoku_id INTEGER"
        +",kyujitsu_group_id INTEGER"
        +",shayou_keitai_bango TEXT"
        +",shayou_keitai_naisen_bango TEXT"
        +",nyuusha_nichi TEXT"
        +",taisha_nichi TEXT"
        +",account TEXT"
        +",mail_address TEXT"
        +",yubin_bango TEXT"
        +",jyuusho TEXT"
        +",denwa_bango TEXT"
        +",keitai_bango TEXT"
        +",inkan BLOB"
        +")"
    );
    //create workday table
    db.run(
        "CREATE TABLE"
        +" kinmu"
        +"("
        +"id INTEGER PRIMARY KEY"
        +",shain_id INTEGER"
        +",hidsuke TEXT UNIQUE"
        +",kinmu_kubun TEXT"
        +",kinmu_keitai TEXT"
        +",shussha_jikoku TEXT"
        +",taisha_jikoku TEXT"
        +",koujyo_jikan REAL"
        +",kyuushutsu_jikan REAL"
        +",memo TEXT"
        +")"
    );
    //create post table
    db.run(
        "CREATE TABLE"
        +" busho"
        +"("
        +"id INTEGER PRIMARY KEY"
        +",namae TEXT"
        +")"
    );
    //create employee devision table
    db.run(
        "CREATE TABLE"
        +" shain_kubun"
        +"("
        +"id INTEGER PRIMARY KEY"
        +",namae TEXT"
        +")"
    );
    //create manegerial position table
    db.run(
        "CREATE TABLE"
        +" yakushoku"
        +"("
        +"id INTEGER PRIMARY KEY"
        +",namae TEXT"
        +")"
    );
   //create day off group table
    db.run(
        "CREATE TABLE"
        +" kyujitsu_group_id"
        +"("
        +"id INTEGER PRIMARY KEY"
        +",namae TEXT"
        +")"
    );
   })
};

const loadDb = (dbLocation:string)=>{
    databaseLocation = path.join(__dirname, "../" + dbLocation)
    if(!fs.existsSync(databaseLocation)){
        fs.writeFileSync(databaseLocation, "");
        db = new sqlite3.Database(databaseLocation);
        createDb();
    }else{
        db = new sqlite3.Database(databaseLocation);
    }
};

const closeDb = ()=>{
    db.close();
};

const addKinmu = function(nKinmu:Kinmu){
    db.serialize(()=>{
        let stm = db.prepare(
            "INSERT INTO"
            +" kinmu"
            +"("
            +"shain_id "
            +",hidsuke "
            +",kinmu_kubun "
            +",kinmu_keitai "
            +",shussha_jikoku "
            +",taisha_jikoku "
            +",koujyo_jikan "
            +",kyuushutsu_jikan "
            +",memo"
            +")"
            +" VALUES"
            +"("
            +"$shain_id "
            +",date( $hidsuke )"
            +",$kinmu_kubun "
            +",$kinmu_keitai "
            +",time( $shussha_jikoku )"
            +",time( $taisha_jikoku ) "
            +",$koujyo_jikan "
            +",$kyuushutsu_jikan"
            +",$memo"
            +")"
            )
        stm.run({
            $shain_id: nKinmu.shainId
            ,$hidsuke: nKinmu.hidsuke
            ,$kinmu_kubun: nKinmu.kinmuKubun
            ,$kinmu_keitai: nKinmu.kinmuKeitai
            ,$shussha_jikoku: nKinmu.shusshaJikoku
            ,$taisha_jikoku: nKinmu.taishaJikoku
            ,$koujyo_jikan: nKinmu.koujyoJikan
            ,$kyuushutsu_jikan: nKinmu.kyuushutsuJikan
            ,$memo: nKinmu.memo
        })
        stm.finalize();

        nKinmu?.sakugyouNaiyou?.forEach( (v, index, arr)=>{

            let stm = db.prepare(
                "INSERT INTO"
                +" kinmu_sakugyou_naiyou"
                +"("
                +"kinmu_date "
                +",project_id "
                +",sakugyou_naiyou_id "
                +",sakugyou_jikan "
                +")"
                +" VALUES"
                +"("
                +"$kinmu_id "
                +",$project_id "
                +",$sakugyou_naiyou_id "
                +",$sakugyou_jikan "
                +")"
                )
            stm.run({
                $kinmu_date : v.kinmuDate
                ,$project_id: v.projectId
                ,$sakugyou_naiyou_id: v.sakugyouNaiyouId
                ,$sakugyou_jikan: v.sakugyouJikan
            })
            stm.finalize();

        } )

    });
};

const deleteKinmu = function(id:Number){
    db.serialize(()=>{
        db.run(
            "DELETE"
            +" FROM" 
            +" kinmu"
            +" WHERE"
            +" id = $id", 
            {$id: id}
        )
    })
};

function convertDate(date:any, utc = 9){
    let respDate:Date|null = null;
    if(date){
        respDate = new Date( date );
        respDate = new Date( respDate.setHours( respDate.getHours() + utc ) );
    }
    return respDate;
}

const getKinmuList = function(id:number){
    return new Promise((resolve, reject)=>{
       
        db.serialize(()=>{
            db.all( 
                //statement
                "SELECT"
                +" id"
                +",shain_id"
                +",hidsuke"
                +",kinmu_kubun"
                +",kinmu_keitai"
                +",DATETIME(shussha_jikoku) as shussha_jikoku"
                +",DATETIME(taisha_jikoku) as taisha_jikoku"
                +",koujyo_jikan"
                +",kyuushutsu_jikan"
                +",memo"
                +" FROM" 
                +" kinmu"
                +" WHERE"
                +" shain_id = $id"
                +" order by"
                +" hidsuke" 
                ,
                //parameter
                {$id: id},
                //callbacks
                (err:any, rows:any)=>{
                    var e:Array<Kinmu> = [];
                    if(rows){
                        
                        let dt = new Date();
                        rows.forEach( (element:any) => {
                            
                            let shussha_jikoku_dt =  convertDate(element.shussha_jikoku);
                            let taisha_jikoku_dt =  convertDate(element.taisha_jikoku);

                            var kinmu:Kinmu = new Kinmu();
                            kinmu.id = element.id;
                            kinmu.shainId = element.shain_id;
                            kinmu.hidsuke = element.hidsuke;
                            //element.youbi;
                            kinmu.kinmuKubun =element.kinmu_kubun;
                            kinmu.kinmuKeitai = element.kinmu_keitai;
                            kinmu.shusshaJikoku = shussha_jikoku_dt ;
                            kinmu.taishaJikoku = taisha_jikoku_dt;
                            kinmu.koujyoJikan = element.koujyo_jikan;
                            kinmu.kyuushutsuJikan = element.kyuushutsu_jikan ;
                            kinmu.memo = element.memo;
                            // console.log(kinmu.hidsuke);
                            e.push(kinmu)
    
                        });
                    }
                    resolve(e)
                }
            )
        })
    })
};

const updateKinmu = function(kinmu:Kinmu){
    // console.log(kinmu.id)
    db.serialize(()=>{
        
        var stm = db.prepare(
        "UPDATE" 
        + " kinmu"
        +" SET"
        +" kinmu_kubun = $kinmu_kubun "
        +",kinmu_keitai = $kinmu_keitai "
        +",shussha_jikoku = time( $shussha_jikoku )"
        +",taisha_jikoku = time( $taisha_jikoku ) "
        +",koujyo_jikan = $koujyo_jikan "
        +",kyuushutsu_jikan = $kyuushutsu_jikan"
        +",memo = $memo"
        +" WHERE hidsuke = $hidsuke"
        )
        stm.run({
            $kinmu_kubun: kinmu.kinmuKubun,
            $kinmu_keitai: kinmu.kinmuKeitai,
            $shussha_jikoku: kinmu.shusshaJikoku,
            $taisha_jikoku: kinmu.taishaJikoku,
            $koujyo_jikan: kinmu.koujyoJikan,
            $kyuushutsu_jikan: kinmu.kyuushutsuJikan,
            $memo: kinmu.memo,
            $hidsuke:  kinmu.hidsuke,
        })

        stm.finalize();


        kinmu?.sakugyouNaiyou?.forEach( (v, index, array)=>{
            
            let stmt = db.prepare(
                "UPDATE" 
                + " kinmu_sakugyou_naiyou"
                +" SET"
                +" kinmu_date = $kinmu_date "
                +",project_id = $project_id "
                +",sakugyou_naiyou_id = $sakugyou_naiyou_id "
                +",sakugyou_jikan = $sakugyou_jikan"
                +" WHERE id = $id"
                )
            stmt.run({
                $kinmu_date: v.kinmuDate,
                $project_id: v.projectId,
                $sakugyou_naiyou_id: v.sakugyouNaiyouId,
                $sakugyou_jikan: v.sakugyouJikan,
                $id:  kinmu.id,
            })
            stmt.finalize();



        })

    });

};

const checkCredentials = function(user:string, password:string){
    return new Promise((resolve, reject)=>{ 
        db.serialize(()=>{
            db.get(
            "SELECT" 
            +" id"
            +" FROM"
            +" shain"
            +" WHERE"
            +" bango = $bango"
            +" and"
            +" password = $password"
            ,
            {
                $bango: user,
                $password: password
            },
            (err:any, row:any)=>{
                if(err)console.log(err);
                resolve(row);
            }) 
        })
    })
};

const getShain = function(id:number){
    return new Promise((resolve, reject)=>{ 
        db.serialize(()=>{
            db.get(
            "SELECT" 
            +" bango"
            +",password"
            +",shimei"
            +",furigana"
            +",ryakushyou"
            +",busho_id"
            +",shain_kubun_id"
            +",yakushoku_id"
            +",kyujitsu_group_id"
            +",shayou_keitai_bango"
            +",shayou_keitai_naisen_bango"
            +",nyuusha_nichi"
            +",taisha_nichi"
            +",account"
            +",mail_address"
            +",yubin_bango"
            +",jyuusho"
            +",denwa_bango"
            +",keitai_bango"
            +",inkan"
            +" FROM"
            +" shain"
            +" WHERE"
            +" id = $id"
            ,
            {
                $id: id
            },
            (err:any, row:any)=>{
                if(err)console.log(err);
                resolve(row);
            }) 
        })
    })
};

const updateShain = function(shain:Shain){
    return new Promise((resolve, reject)=>{ 
        db.serialize(()=>{

            var stm = db.prepare(
            "UPDATE" 
            + " shain"
            +" SET"
            +" bango = $bango"
            +",password = $password "
            +",shimei = $shimei "
            +",furigana = $furigana "

            // +",ryakushou = $ryakushou "
            +",busho_id = $busho_id "
            +",shain_kubun_id = $shain_kubun_id "
            +",yakushoku_id = $yakushoku_id "
            +",kyujitsu_group_id = $kyujitsu_group_id "
            // +",shayou_keitai_bango = $shayou_keitai_bango "   
            // +",shayou_keitai_naisen_bango = $shayou_keitai_naisen_bango "
            // +",nyuusha_nichi = $nyuusha_nichi "
            // +",taisha_nichi = $taisha_nichi "
            +",account = $account "
            +",mail_address = $mail_address "
            +",yubin_bango = $yubin_bango "
            +",jyuusho = $jyuusho "
            +",denwa_bango = $denwa_bango "
            +",keitai_bango = $keitai_bango "
            // +",inkan = $inkan "

            +" WHERE id = $id"
            )
            stm.run({
                $bango: shain.bango,
                $password: shain.password,
                $shimei: shain.shimei,
                $furigana: shain.furigana,

                // $ryakushou: shain.ryakushou,
                $busho_id: shain.bushoId,
                $shain_kubun_id: shain.shainKubunId,
                $yakushoku_id: shain.yakushokuId,
                $kyujitsu_group_id: shain.kyujitsuGroupId,
                // $shayou_keitai_bango: shain.shayouKeitaiBango,
                // $shayou_keitai_naisen_bango: shain.shayouKeitaiNaisenBango,
                // $nyuusha_nichi: shain.nyuushaNichi,
                // $taisha_nichi: shain.taishaNichi,
                $account: shain.account,
                $mail_address: shain.mailAddress,
                $yubin_bango: shain.yubinBango,
                $jyuusho: shain.jyuusho,
                $denwa_bango: shain.denwaBango,
                $keitai_bango: shain.keitaiBango,
                // $inkan: shain.inkan,
                            
                $id:  shain.id,
            })

            stm.finalize();
            resolve("");
        });
    });

};

const addShain = (shain:Shain)=>{
    return new Promise((resolve, reject)=>{ 
        let stm = db.prepare(
        "INSERT INTO"
        + " shain"
        +" ("
        +" bango"
        +",password"
        +",shimei "
        +",furigana"
        // +",ryakushou "
        +",busho_id "
        +",shain_kubun_id"
        +",yakushoku_id"
        +",kyujitsu_group_id "
        // +",shayou_keitai_bango"   
        // +",shayou_keitai_naisen_bango"
        // +",nyuusha_nichi "
        // +",taisha_nichi "
        +",account"
        +",mail_address"
        +",yubin_bango"
        +",jyuusho"
        +",denwa_bango "
        +",keitai_bango"
        // +",inkan"
        + " )"
        + " VALUES"
        +" ("
        +" $bango"
        +",$password"
        +",$shimei "
        +",$furigana"
        // +",$ryakushou "
        +",$busho_id "
        +",$shain_kubun_id"
        +",$yakushoku_id"
        +",$kyujitsu_group_id "
        // +",shayou_keitai_bango"   
        // +",shayou_keitai_naisen_bango"
        // +",nyuusha_nichi "
        // +",taisha_nichi "
        +",$account"
        +",$mail_address"
        +",$yubin_bango"
        +",$jyuusho"
        +",$denwa_bango "
        +",$keitai_bango"
        // +",$inkan"
        + " )"
        )
        stm.run({
            $bango: shain.bango,
            $password: shain.password,
            $shimei: shain.shimei,
            $furigana: shain.furigana,

            // $ryakushou: shain.ryakushou,
            $busho_id: shain.bushoId,
            $shain_kubun_id: shain.shainKubunId,
            $yakushoku_id: shain.yakushokuId,
            $kyujitsu_group_id: shain.kyujitsuGroupId,
            // $shayou_keitai_bango: shain.shayouKeitaiBango,
            // $shayou_keitai_naisen_bango: shain.shayouKeitaiNaisenBango,
            // $nyuusha_nichi: shain.nyuushaNichi,
            // $taisha_nichi: shain.taishaNichi,
            $account: shain.account,
            $mail_address: shain.mailAddress,
            $yubin_bango: shain.yubinBango,
            $jyuusho: shain.jyuusho,
            $denwa_bango: shain.denwaBango,
            $keitai_bango: shain.keitaiBango,
            // $inkan: shain.inkan,
        })
        stm.finalize();
        resolve("");
    })
}

const deleteShain = (id:number) =>{
    return new Promise((resolve, reject) =>{
        let stm = db.prepare(
        "DELETE FROM"
        +" shain"
        +" WHERE"
        +" id = $id"
        )

        stm.run({
            $id: id
        })

        stm.finalize();
        resolve("");
    })
}

const getSakugyouNaiyou = (beginDate:Date, endDate:Date, shainId:number)=>{
    return new Promise((resolve, reject)=>{ 
    
        var projectI:ProjectItem;

        db.serialize(()=>{
            db.all( 
                //statement
                'Select'
                +' project.bangou as bangou'
                +',project.na as na'
                +',project.id as id'
                +' from'
                +' kinmu_sakugyou_naiyou'
                +' left join'
                +' project on kinmu_sakugyou_naiyou.project_id = project.id'
                +' left join'
                +' kinmu on kinmu_sakugyou_naiyou.kinmu_id = kinmu.id'
                +' where'
                +' kinmu.hidsuke BETWEEN date($begin_date) AND date($end_date)'
                +' and'
                +' kinmu.shain_id = $shain_id'
                +' group by project.bangou'
                ,
                //parameter
                {
                    $begin_date: beginDate,
                    $end_date: endDate,
                    $shain_id: shainId
                },
                //callbacks
                (err:any, pjRows:Array<any>)=>{
                    var pjList:Array<ProjectItem> = new Array<ProjectItem>();
                    pjRows.forEach( (pj)=>{
                        projectI = new ProjectItem()
                        projectI.bango = pj.bango;
                        projectI.na = projectI.na
                        projectI.sakugyoNaiyouList = new Array<sakugyoNaiyouItem>();
                        db.all( 
                            'Select'
                            +' project_sakugyou_naiyou.sakugyou_naiyou as sakugyou_naiyou'
                            +',kinmu_sakugyou_naiyou.sakugyou_jikan as sakugyou_jikan'
                            +',kinmu.hidsuke as hidsuke'
                            +' from'
                            +' kinmu_sakugyou_naiyou'
                            +' left join'
                            +' project_sakugyou_naiyou on kinmu_sakugyou_naiyou.sakugyou_naiyou_id = project_sakugyou_naiyou.id'
                            +' left join kinmu on kinmu_sakugyou_naiyou.kinmu_id = kinmu.id'
                            +' where'
                            +' kinmu_sakugyou_naiyou.project_id = $project_id'
                            +' and'
                            +' kinmu.hidsuke BETWEEN date($begin_date) AND date($end_date)'
                            +' and kinmu.shain_id = $shain_id'
                            +' order by project_sakugyou_naiyou.sakugyou_naiyou'
                            , {
                                $project_id: pj.id,
                                $begin_date: beginDate,
                                $end_date: endDate,
                                $shain_id: shainId
                            }
                            , ((err:any, sgRows:Array<any>)=>{
                                let si:sakugyoNaiyouItem = new sakugyoNaiyouItem();
                                si.shuu = new Array<number>();
                                var oldTitle = sgRows[0].sakugyou_naiyou;
                                sgRows.forEach( (sg)=>{
                                    if(sgRows[0].sakugyou_naiyou != oldTitle){
                                        projectI.sakugyoNaiyouList?.push(si);
                                        si = new sakugyoNaiyouItem();
                                        si.shuu = new Array<number>();
                                    }
                                    sg[new Date(sg.hidsuke).getDay()] = sg.sakugyou_jikan;
                                } )
                                projectI.sakugyoNaiyouList?.push(si);
                              
                            }) 
                        )
                        pjList.push(projectI)   
                    } )
                   resolve(pjList);
                }
            )
        })
        
    });

}

module.exports = {
    Kinmu: Kinmu,
    Shain: Shain,
    loadDb: loadDb,
    createDb: createDb,
    addShain: addShain,
    updateShain: updateShain,
    getShain:  getShain,
    deleteShain: deleteShain,
    addKinmu: addKinmu,
    getKinmuList: getKinmuList,
    deleteKinmu: deleteKinmu,
    closeDb: closeDb,
    updateKinmu: updateKinmu,
    checkCredentials: checkCredentials,
    // deleteDatabase: deleteDatabase,
    getSakugyouNaiyou: getSakugyouNaiyou,
}

export {Kinmu , Shain}