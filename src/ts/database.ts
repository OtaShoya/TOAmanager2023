const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

var db:any;
class Kinmu{
    id!: number|string|null;
    shainId!:number|string|null;
    hidsuke!:string|Date|null ; //date
    kinmuKubun!: number|string|null;
    kinmuKeitai!: number|string|null;//form
    shusshaJikoku!: string|Date|null;//momment of arrival
    taishaJikoku!: string|Date|null;//momment of departure
    koujyoJikan!: number|string|null;
    kyuushutsuJikan!: number|string|null;
    memo!:string|null;
}

class Shain{
    id!: number|string|null;
    bango!: number|string|null;
    password!: number|string|null;
    shimei!: string|null;
    furigana!: string|null;
    ryakushou!: string|null;//abreviation
    bushoId!: number|string|null; //post //Select
    shainKubunId!: number|string|null; //employee devision //Select
    yakushokuId!: number|string|null; //manegerial position //Select
    kyujitsuGroupId!: number|string|null; //day off group //Select
    shayouKeitaiBango!: string|null; //Company's cellphone number
    shayouKeitaiNaisenBango!: string|null; //Company's cellphone extension number
    nyuushaNichi!: Date|string|null; //day entering the company
    taishaNichi!: Date|string|null; //day of resignation
    account!: string|null;
    mailAddress!: string|null;
    yubinBango!: string|null; //mailNumber
    jyuusho!: string|null; //address
    denwaBango!: string|null; //phone Number
    keitaiBango!: string|null; //cellphone number
    inkan!: string|null; //stamp // data/image
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
        //+",youbi TEXT"
        +",kinmu_kubun TEXT"
        +",kinmu_keitai TEXT"
        +",shussha_jikoku TEXT"
        +",taisha_jikoku TEXT"
        +",koujyo_jikan REAL"
        // +",kinmu_jikan TEXT"
        // +",gingyou_ikan TEXT"
        // +",gingyou_jikan_shinya TEXT"
        +",kyuushutsu_jikan REAL"
        // +",sagyou_jikan_goukyou TEXT"
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
}

const loadDb = (dbLocation:string)=>{
    databaseLocation = path.join(__dirname, "../" + dbLocation)
    if(!fs.existsSync(databaseLocation)){
        fs.writeFileSync(databaseLocation, "");
        db = new sqlite3.Database(databaseLocation);
        createDb();
    }else{
        db = new sqlite3.Database(databaseLocation);
    }
}

const closeDb = ()=>{
    db.close();
}

const addKinmu = function(nKinmu:Kinmu){
    db.serialize(()=>{
        let stm = db.prepare(
            "INSERT INTO"
            +" kinmu"
            +"("
            +"shain_id "
            +",hidsuke "
            //+",youbi "
            +",kinmu_kubun "
            +",kinmu_keitai "
            +",shussha_jikoku "
            +",taisha_jikoku "
            +",koujyo_jikan "
            // +",kinmu_jikan "
            // +",gingyou_jikan"
            // +",gingyou_jikan_shinya "
            +",kyuushutsu_jikan "
            // +",sagyou_jikan_goukyou"
            +",memo"
            +")"
            +" VALUES"
            +"("
            +"$shain_id "
            +",date( $hidsuke )"
            //+",$youbi "
            +",$kinmu_kubun "
            +",$kinmu_keitai "
            +",time( $shussha_jikoku )"
            +",time( $taisha_jikoku ) "
            +",$koujyo_jikan "
            // +",time($kinmu_jikan) "
            // +",time($gingyou_jikan)"
            // +",time($gingyou_jikan_shinya) "
            +",$kyuushutsu_jikan"
            // +",time($sagyou_jikan_goukyou)s"
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
    });
}

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
}

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
                //statemet
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
                })
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
        +" WHERE id = $id"
        )
        stm.run({
            $kinmu_kubun: kinmu.kinmuKubun,
            $kinmu_keitai: kinmu.kinmuKeitai,
            $shussha_jikoku: kinmu.shusshaJikoku,
            $taisha_jikoku: kinmu.taishaJikoku,
            $koujyo_jikan: kinmu.koujyoJikan,
            $kyuushutsu_jikan: kinmu.kyuushutsuJikan,
            $memo: kinmu.memo,
            $id:  kinmu.id,
        })

        stm.finalize();

    });

}

module.exports = {
    Kinmu: Kinmu,
    Shain: Shain,
    loadDb: loadDb,
    createDb: createDb,
    // addShain: addShain,
    // getShain:  getShain,
    // deleteShain: deleteShain,
    addKinmu: addKinmu,
    getKinmuList: getKinmuList,
    deleteKinmu: deleteKinmu,
    closeDb: closeDb,
    updateKinmu: updateKinmu,
    // deleteDatabase: deleteDatabase,
}
