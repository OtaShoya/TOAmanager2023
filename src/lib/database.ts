import { title } from "process";

// import { sakugyoNaiyouItem, ProjectItem } from "@/src/lib/report";
class sakugyoNaiyouItem{
    name?: string;
    shuu!:Array<number>;
 
}


class ProjectItem{
    id?:number;
    bango?:string;
    na?:string;
    sakugyoNaiyouList?:Array<sakugyoNaiyouItem>;
}

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

var db:any;

class KinmuSagyouNaiyou{
    kinmuDate?: Date|null;
    projectId?: number|null;
    sagyouNaiyouId?: number|null;
    sagyouJikan?: number|null;
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

    sagyouNaiyou?:Array<KinmuSagyouNaiyou>|null;
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
    kokyakuId?:number //client
    eigyouTantouId?:number
    jyoutaiId?:number
    jyuchuuRouteId?:number //accepting order root
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

class ProjectSagyouNaiyou{

    id?:number
    protectId?:number
    taskId?:number
    sagyouNaiyou?:string
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

        nKinmu?.sagyouNaiyou?.forEach( (v, index, arr)=>{

            let stm = db.prepare(
                "INSERT INTO"
                +" kinmu_sagyou_naiyou"
                +"("
                +"kinmu_date "
                +",project_id "
                +",sagyou_naiyou_id "
                +",sagyou_jikan "
                +")"
                +" VALUES"
                +"("
                +"$kinmu_id "
                +",$project_id "
                +",$sagyou_naiyou_id "
                +",$sagyou_jikan "
                +")"
                )
            stm.run({
                $kinmu_date : v.kinmuDate
                ,$project_id: v.projectId
                ,$sagyou_naiyou_id: v.sagyouNaiyouId
                ,$sagyou_jikan: v.sagyouJikan
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

const getShainList = function(){
    return new Promise((resolve, reject)=>{
       
        db.serialize(()=>{
            db.all( 
                //statement
                "SELECT"
                +" id"
                +",shimei"
                +",busho_id"
                +",yakushoku_id"
                +",kyujitsu_group_id"
                +" FROM" 
                +" shain"
                ,
                //parameter
                {},
                //callbacks
                (err:any, rows:any)=>{
                    var e:Array<any> = [];
                    if(rows){

                        rows.forEach( (element:any) => {
                            e.push({
                                id: element.id,
                                shimei: element.shimei,
                                bushoId: element.busho_id,
                                yakushokuId: element.yakushoku_id,
                                kyujitsuGroupId: element.kyujitsu_group_id,
                            })
    
                        });
                    }
                    resolve(e)
                }
            )
        })
    })
};

const getKinmuList = function(id:number){
    return new Promise((resolve, reject)=>{
       
        db.serialize(()=>{
            db.all( 
                //statement
                "SELECT"
                +" id"
                // +",shain_id"
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

                            var kinmu:Kinmu = {
                                id: element.id,
                                shainId: element.shain_id,
                                hidsuke: element.hidsuke,
                                kinmuKubun: element.kinmu_kubun,
                                kinmuKeitai: element.kinmu_keitai,
                                shusshaJikoku: shussha_jikoku_dt,
                                taishaJikoku: taisha_jikoku_dt,
                                koujyoJikan: element.koujyo_jikan,
                                kyuushutsuJikan: element.kyuushutsu_jikan,
                                memo: element.memo,
                            };
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

const getKinmu = function (id:number){
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{ 
            db.get(
            "select"
            +" id"
            +",kinmu_kubun"
            +",kinmu_keitai"
            +",shussha_jikoku"
            +",taisha_jikoku"
            +",koujyo_jikan"
            +",kyuushutsu_jikan"
            +",memo"
            +",hidsuke"
            +" from"
            +" kinmu"
            +" where"
            +" id = $id",
            {
                $id: id
            },
            (err:any, row:any)=>{
                if(err)console.log(err);
                resolve(row);
            }
            )
        })
    })
}

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


        kinmu?.sagyouNaiyou?.forEach( (v, index, array)=>{
            
            let stmt = db.prepare(
                "UPDATE" 
                + " kinmu_sagyou_naiyou"
                +" SET"
                +" kinmu_date = $kinmu_date "
                +",project_id = $project_id "
                +",sagyou_naiyou_id = $sagyou_naiyou_id "
                +",sagyou_jikan = $sagyou_jikan"
                +" WHERE id = $id"
                )
            stmt.run({
                $kinmu_date: v.kinmuDate,
                $project_id: v.projectId,
                $sagyou_naiyou_id: v.sagyouNaiyouId,
                $sagyou_jikan: v.sagyouJikan,
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

const addProject = ( project:Project )=>{
    return new Promise((resolve, reject)=>{     
        let stm = db.prepare(
            "INSERT INTO"
            +" project"
            +"("
            +" kokyaku_id "
            +",jyoutai_id"
            +",eigyou_tantou_id"
            +",jyuchuu_route_id"
            +",bangou"
            +",oya_project_id"
            +",na"
            +",gaiyou"
            +",mokuhyou"
            +",yosa"
            +",cousuu"
            +",keihi"
            +",honkadou_youtei_hi"
            +",kashibi"
            +",shuuryobi"
            +",memo"
            +",mitsumori_file"
            +",document_folder"
            +",shuuryu_houkoku"
            +")"
            +" VALUES"
            +"("
            +" $kokyaku_id"
            +",$jyoutai_id"
            +",$eigyou_tantou_id"
            +",$jyuchuu_route_id"
            +",$bangou"
            +",$oya_project_id"
            +",$na"
            +",$gaiyou"
            +",$mokuhyou"
            +",$yosa"
            +",$cousuu"
            +",$keihi"
            +",date($honkadou_youtei_hi)"
            +",$kashibi"
            +",$shuuryobi"
            +",$memo"
            +",$mitsumori_file"
            +",$document_folder"
            +",$shuuryu_houkoku"
            +")"
            
        )
        stm.run({
            $kokyaku_id: project.kokyakuId,
            $jyoutai_id: project.jyoutaiId,
            $eigyou_tantou_id: project.eigyouTantouId,
            $jyuchuu_route_id: project.jyuchuuRouteId,
            $bangou: project.bangou,
            $oya_project_id: project.oyaProjectId,
            $na: project.na,
            $gaiyou: project.gaiyou,
            $mokuhyou: project.mokuhyou,
            $yosa: project.yosa,
            $cousuu: project.cousuu,
            $keihi: project.keihi,
            $honkadou_youtei_hi: project.honkadouYoteiHi,
            $kashibi: project.kashibi,
            $shuuryobi: project.shuuryoubi,
            $memo: project.memo,
            $mitsumori_file: project.mitsumoriFile,
            $document_folder: project.documentFolder,
            $shuuryu_houkoku: project.shuuryuHoukoku,
        },  function(error:any) {

            stm.finalize();
            // @ts-ignore
            resolve(this.lastID)
        })
    
    })
}

const updateProject = ( project:Project )=>{
    return new Promise((resolve, reject)=>{ 
        let stm = db.prepare(
            "UPDATE"
            +" project"
            +" SET"
            +" kokyaku_id = $kokyaku_id"
            +",jyoutai_id = $jyoutai_id"
            +",eigyou_tantou_id = $eigyou_tantou_id"
            +",jyuchuu_route_id = $jyuchuu_route_id"
            +",bangou = $bangou"
            +",oya_project_id = $oya_project_id"
            +",na = $na"
            +",gaiyou = $gaiyou"
            +",mokuhyou = $mokuhyou"
            +",yosa = $yosa"
            +",cousuu = $cousuu"
            +",keihi = $keihi"
            +",honkadou_youtei_hi = $honkadou_youtei_hi"
            +",kashibi = $kashibi"
            +",shuuryobi = $shuuryobi"
            +",memo = $memo"
            +",mitsumori_file = $mitsumori_file"
            +",document_folder = $document_folder"
            +",shuuryu_houkoku = $shuuryu_houkoku"
            +" where"
            +" id = $id"
            
        )
        stm.run({
            $kokyaku_id: project.kokyakuId,
            $jyoutai_id: project.jyoutaiId,
            $eigyou_tantou_id: project.eigyouTantouId,
            $jyuchuu_route_id: project.jyuchuuRouteId,
            $bangou: project.bangou,
            $oya_project_id: project.oyaProjectId,
            $na: project.na,
            $gaiyou: project.gaiyou,
            $mokuhyou: project.mokuhyou,
            $yosa: project.yosa,
            $cousuu: project.cousuu,
            $keihi: project.keihi,
            $honkadou_youtei_hi: project.honkadouYoteiHi,
            $kashibi: project.kashibi,
            $shuuryobi: project.shuuryoubi,
            $memo: project.memo,
            $mitsumori_file: project.mitsumoriFile,
            $document_folder: project.documentFolder,
            $shuuryu_houkoku: project.shuuryuHoukoku,
            $id: project.id,
        },  function(error:any) {

            stm.finalize();
            // @ts-ignore
            resolve("")
        })
    
    })
}

const deleteProject = (id:number)=>{
    return new Promise( (resolve, reject)=>{
        db.serialize(()=>{
            let stm = db.prepare(
                "Delete from"
                +" project"
                +" where"
                +" id = $id"
            );
            stm.run({
                $id: id
            });
            stm.finalize();
            resolve("");
        })
    } )
}

const getProjectList = ()=>{
    return new Promise((resolve, reject)=>{
        db.all( 
            //statement
            "SELECT"
            +" id"
            +",kokyaku_id"
            +",bangou"
            +",na"
            +",jyoutai_id"
            +" FROM" 
            +" project"
            ,
            //parameter
            {},
            //callbacks
            (err:any, rows:any)=>{
                var e:Array<any> = [];
                if(rows){
                   
                    rows.forEach( (element:any) => {
                        e.push({
                            id: element.id,
                            kokyakuId: element.kokyaku_id,
                            bangou: element.bangou,
                            na: element.na,
                            jyoutaiId: element.jyoutai_id,
                        })
                    });
                    
                }
                resolve(e)
            }
        )
    })
}

// "SELECT project.id as id, na, project_sagyou_naiyou.id as sagyou_naiyou_id, sagyou_naiyou as sagyou_naiyou_na from project left join project_sagyou_naiyou on project.id = project_sagyou_naiyou.project_id;"
const getProjectListKinmu = ()=>{
    return new Promise((resolve, reject)=>{
        db.all( 
            //statement
            "SELECT"
            +" project.id as id"
            +",na"
            +",project_sagyou_naiyou.id as sagyou_naiyou_id"
            +",sagyou_naiyou as sagyou_naiyou_na"
            +" FROM" 
            +" project"
            +" left join"
            +" project_sagyou_naiyou"
            +" on"
            +" project.id = project_sagyou_naiyou.project_id"
            ,
            //parameter
            {},
            //callbacks
            (err:any, rows:any)=>{
                var e:Array<any> = [];
                if(rows.length > 0){
                    let oldId= rows[0].id;
                    let proj = {
                        id: rows[0].id,
                        na: rows[0].na,
                        sagyouNaiyouList: Array<any>(),

                    }
                    rows.forEach( (element:any, index:number) => {
                        
                        if( oldId !=  element.id){
                           e.push(proj);
                           proj = {
                            id: element.id,
                            na: element.na,
                            sagyouNaiyouList: Array<any>(),
                           };
                           oldId = element.id;
                        }
                        proj.sagyouNaiyouList.push({
                            id: element.sagyou_naiyou_id,
                            na: element.sagyou_naiyou_na,
                        });
                      
                    });
                    e.push(proj);
                }
                resolve(e)
            }
        )
    })
}

const cleanProjectMembers = (projectId:number)=>{
    return new Promise((resolve, reject)=>{

        db.serialize(()=>{
            let stm = db.prepare(
                "DELETE FROM"
                +" project_member"
                +" where"
                +" project_id = $project_id"
            );
    
            stm.run({
                $project_id: projectId,
            })
    
            stm.finalize()
            resolve("")
        })

    })
}

const cleanProjectSagyouNaiyou = (projectId:number)=>{
    return new Promise((resolve, reject)=>{

        db.serialize(()=>{
            let stm = db.prepare(
                "DELETE FROM"
                +" project_sagyou_naiyou"
                +" where"
                +" project_id = $project_id"
            );
    
            stm.run({
                $project_id: projectId,
            })
    
            stm.finalize()
            resolve("")
        })

    })
}

const addProjectMember = (member:any, projectId:any)=>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{

            let stm = db.prepare(
                "INSERT INTO"
                +" project_member"
                +"("
                +" shain_id"
                +",project_id"
                +")"
                +" VALUES"
                +"("
                +"$shain_id"
                +",$project_id" 
                +")"
            );
    
            stm.run({
                $shain_id: member.shainId,
                $project_id: projectId,
            }, (err:any)=>{
                stm.finalize();
                resolve("");
            })
        })
    })
}

const updateProjectMember = (member:any)=>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{

            let stm = db.prepare(
                "UPDATE"
                +" project_member"
                +" SET"
                +" shain_id = $shain_id"
                +" where "
                +" id = $mb_id"
            );
    
            stm.run({
                $shain_id: member.shainId,
                $mb_id: member.mb_id,
            }, (err:any)=>{
                stm.finalize();
                resolve("");
            })
    
        })
    })
}


const addProjectSagyouNaiyou = (sagyouNaiyou:any, projectId:number)=>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{

            let stm = db.prepare(
                "INSERT INTO"
                +" project_sagyou_naiyou"
                +"("
                +" project_id"
                +",task_id"
                +",sagyou_naiyou"
                +",kaishi_yotei_hi"
                +",shuuryou_yotei_hi"
                +",yotei_kousuu"
                +")"
                +" VALUES"
                +"("
                +" $project_id"
                +",$task_id" 
                +",$sagyou_naiyou" 
                +",date($kaishi_yotei_hi)" 
                +",date($shuuryou_yotei_hi)"
                +",$yotei_kousuu" 
                +")"
            );
    
            stm.run({
                $project_id: projectId,
                $task_id: sagyouNaiyou.task,
                $sagyou_naiyou: sagyouNaiyou.work,
                $kaishi_yotei_hi: sagyouNaiyou.start,
                $shuuryou_yotei_hi: sagyouNaiyou.finish,
                $yotei_kousuu: sagyouNaiyou.costs,
            }, (err:any)=>{
                stm.finalize();
                resolve("");
            })
    
        })
    })
}

const updateProjectSagyouNaiyou = (sagyouNaiyou:any)=>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{
            const stm = db.prepare( 
                "UPDATE" 
                + " project_sagyou_naiyou"
                +" SET"
                +" task_id = $task_id "
                +",sagyou_naiyou = $sagyou_naiyou "
                +",kaishi_yotei_hi = $kaishi_yotei_hi "
                +",shuuryou_yotei_hi = $shuuryou_yotei_hi"
                +",yotei_kousuu = $yotei_kousuu"
                +" WHERE id = $sn_id"
             )

            stm.run(
            {
                $task_id: sagyouNaiyou.task,
                $sagyou_naiyou:  sagyouNaiyou.work,
                $kaishi_yotei_hi: sagyouNaiyou.start,
                $shuuryou_yotei_hi: sagyouNaiyou.finish,
                $yotei_kousuu: sagyouNaiyou.costs,
                $sn_id: sagyouNaiyou.sn_id,
            })
            stm.finalize();
            resolve("");
        })
    })
}



const getProject = (id:number)=>{
    return new Promise((resolve, reject)=>{ 
        db.serialize(()=>{
            db.get(
            "SELECT" 
            +" kokyaku_id "
            +",jyoutai_id"
            +",eigyou_tantou_id"
            +",jyuchuu_route_id"
            +",bangou"
            +",oya_project_id"
            +",na"
            +",gaiyou"
            +",mokuhyou"
            +",yosa"
            +",cousuu"
            +",keihi"
            +",honkadou_youtei_hi"
            +",kashibi"
            +",shuuryobi"
            +",memo"
            +",mitsumori_file"
            +",document_folder"
            +",shuuryu_houkoku"
            +" FROM"
            +" project"
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
}

const getProjectMembers = (projectId:number)=>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{
            db.all(
            "SELECT"
            +" id as mb_id"
            +",shain_id"
            +" from" 
            +" project_member"
            +" where"
            +" project_id = $project_id"
            ,
            {
                $project_id: projectId
            },
            (err:any, rows:any)=>{
                if(err)console.log(err);
                resolve(rows);
            }) 
        })
    })
}

const getProjectSagyouNaiyou = (projectId:number)=>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{
            db.all(
            "SELECT"
            +" id as sn_id"
            +",task_id"
            +",sagyou_naiyou"
            +",kaishi_yotei_hi"
            +",shuuryou_yotei_hi"
            +",yotei_kousuu"
            +" from" 
            +" project_sagyou_naiyou"
            +" where"
            +" project_id = $project_id"
            ,
            {
                $project_id: projectId
            },
            (err:any, rows:any)=>{
                if(err)console.log(err);
                resolve(rows);
            }) 
        })
    })


   
}

const getSagyouNaiyou = (beginDate:Date, endDate:Date, shainId:number)=>{
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
                +' kinmu_sagyou_naiyou'
                +' left join'
                +' project on kinmu_sagyou_naiyou.project_id = project.id'
                +' left join'
                +' kinmu on kinmu_sagyou_naiyou.kinmu_id = kinmu.id'
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
                        projectI.bango = pj.bangou;
                        projectI.na = pj.na;
                        projectI.sakugyoNaiyouList = new Array<sakugyoNaiyouItem>();
                        projectI.id = pj.id

                        pjList.push(projectI)
                        
                    } )
                    resolve(pjList);
                }
            )
        })
        
    }).then( (v:any)=>{
        return new Promise((resolve, reject)=>{
            const ss = async ()=>{
                var pjList:Array<ProjectItem> = new Array<ProjectItem>();
                if (v.length < 1){
                    resolve(v)
                }
                await v.forEach((projectI:any, index:number, array:any)=>{
                    db.all( 
                        'Select'
                        +' project_sagyou_naiyou.sagyou_naiyou as sagyou_naiyou'
                        +',kinmu_sagyou_naiyou.sagyou_jikan as sagyou_jikan'
                        +',kinmu.hidsuke as hidsuke'
                        +' from'
                        +' kinmu_sagyou_naiyou'
                        +' left join'
                        +' project_sagyou_naiyou on kinmu_sagyou_naiyou.sagyou_naiyou_id = project_sagyou_naiyou.id'
                        +' left join kinmu on kinmu_sagyou_naiyou.kinmu_id = kinmu.id'
                        +' where'
                        +' kinmu_sagyou_naiyou.project_id = $project_id'
                        +' and'
                        +' kinmu.hidsuke BETWEEN date($begin_date) AND date($end_date)'
                        +' and kinmu.shain_id = $shain_id'
                        +' order by project_sagyou_naiyou.sagyou_naiyou'
                        , {
                            $project_id: projectI.id,
                            $begin_date: beginDate,
                            $end_date: endDate,
                            $shain_id: shainId
                        }
                        , ((err:any, sgRows:Array<any>)=>{
                            let si:sakugyoNaiyouItem = new sakugyoNaiyouItem();
                            si.shuu = [0,0,0,0,0,0,0];
                            
                            var projectI2 = new ProjectItem()
                            projectI2.bango = projectI.bango;
                            projectI2.na = projectI.na;
                            projectI2.sakugyoNaiyouList = new Array<sakugyoNaiyouItem>();
                            projectI2.id = projectI.id

                            if(sgRows.length > 0){

                                var oldTitle = sgRows[0].sagyou_naiyou;
                                si.name = sgRows[0].sagyou_naiyou;

                                sgRows.forEach( (sg)=>{
    
                                    if(sg.sagyou_naiyou != oldTitle){
                                        projectI2.sakugyoNaiyouList?.push(si);
                                        si = new sakugyoNaiyouItem();
                                        si.shuu = [0,0,0,0,0,0,0];
                                        si.name = sg.sagyou_naiyou;
                                        oldTitle = sg.sagyou_naiyou ;
                                    }
                                    
                                    
                                    let posdate = new Date(sg.hidsuke).getDay() - 1
                                    if(posdate < 0){
                                        posdate = 6;
                                    }
                                    si.shuu[posdate] = sg.sagyou_jikan;
    
                                } )
                                
                                projectI2.sakugyoNaiyouList?.push(si);
                              
                                pjList.push(projectI2);
                                
                            }
                            
                            if (index + 1 == array.length){
                                resolve(pjList)
                            }
                            
                        }) 
                    )
                })
            }
           
            ss()
           
        })
    } );
}

module.exports = {
    Kinmu: Kinmu,
    Shain: Shain,
    Project: Project,
    loadDb: loadDb,
    createDb: createDb,
    addShain: addShain,
    updateShain: updateShain,
    getShain:  getShain,
    getShainList: getShainList,
    deleteShain: deleteShain,
    addKinmu: addKinmu,
    getKinmuList: getKinmuList,
    deleteKinmu: deleteKinmu,
    closeDb: closeDb,
    updateKinmu: updateKinmu,
    checkCredentials: checkCredentials,
    // deleteDatabase: deleteDatabase,
    getSagyouNaiyou: getSagyouNaiyou,
    addProject: addProject,
    deleteProject: deleteProject,
    getProjectList: getProjectList,
    cleanProjectMembers: cleanProjectMembers,
    cleanProjectSagyouNaiyou: cleanProjectSagyouNaiyou,
    addProjectMember: addProjectMember,
    addProjectSagyouNaiyou: addProjectSagyouNaiyou,
    getProject: getProject,
    getProjectSagyouNaiyou: getProjectSagyouNaiyou,
    getProjectMembers: getProjectMembers,
    updateProject: updateProject,
    getProjectListKinmu: getProjectListKinmu,
    updateProjectSagyouNaiyou: updateProjectSagyouNaiyou,
}

export {Kinmu , Shain, Project}