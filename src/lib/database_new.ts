import {PoolClient, Pool} from "pg";


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



class KinmuSagyouNaiyou{
    id?:number;
    kinmuId?: number|null;
    projectId?: number|null;
    taskId?: number;
    sagyouNaiyou?: string;
    sagyouNaiyouId?: string|null;
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
    kyuukaShubetsu?:number;
    kyuukaRiyu?:string;
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
    shashin?: ArrayBuffer;
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


var pool:Pool = new Pool(
    {
        host: "192.168.4.180",
        port:  5432,
        database: "toamgr",
        user: "postgres",
        password: "postgres"
    }
);


function convertDate(date:any, utc = 9){
    let respDate:Date|null = null;
    if(date){
        respDate = new Date( date );
        respDate = new Date( respDate.setHours( respDate.getHours() + utc ) );
    }
    return respDate;
}


// const initDb = ()=>{
//     pool
// }
const loadDb = ()=>{
    // const connect = async ()=>{
    //     db = await pool.connect()
    // }
    // connect();
}   


//shain
const getShainList = function(){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect()
            try{
                await db.query('BEGIN');
                const res = await db.query(
                    "SELECT"
                    +" 社員ＩＤ as id"
                    +",氏名 as shimei"
                    +",部署ＩＤ as busho_id"
                    +",役職ＩＤ as yakushoku_id"
                    +",休日グループ as kyujitsu_group_id"
                    +" FROM" 
                    +" 社員マスタ"
                    ,
                    []
                );
                
                var e:Array<any> = [];
                if(res.rows){
                    
                    res.rows.forEach( (element:any) => {
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
                
                await db.query('COMMIT');
            }catch(e){
                await db.query('ROLLBACK')
                throw e
            }finally{
                db.release();
            }
        }
        queryFunc();
    })
};

const getShain = function(id:number){
    return new Promise((resolve, reject)=>{ 
       
        const queryFunc = async ()=>{
            var db = await pool.connect()
            try{
                await db.query('BEGIN');
                const res = await db.query(
                    "SELECT" 
                    +" 社員番号 as bango"
                    +",パスワード as  password"
                    +",氏名 as shimei"
                    +",フリガナ as furigana"
                    +",略称 as ryakushou"
                    +",部署ＩＤ as busho_id"
                    +",社員区分 as shain_kubun_id"
                    +",役職ＩＤ as yakushoku_id"
                    +",休日グループ as kyujitsu_group_id"
                    +",社用携帯番号 as shayou_keitai_bango"
                    +",社用携帯内線番号 as shayou_keitai_naisen_bango"
                    +",入社日 as nyuusha_nichi"
                    +",退職日 as taisha_nichi"
                    +",アカウント as account"
                    +",メールアドレス as  mail_address"
                    +",郵便番号 as yubin_bango"
                    +",住所 as jyuusho"
                    +",電話番号 as denwa_bango"
                    +",携帯番号 as keitai_bango"
                    +",印影 as inkan"
                    +" FROM"
                    +" 社員マスタ"
                    +" WHERE"
                    +" 社員ＩＤ = $1"
                    ,
                    [
                        id
                    ]
                );
                resolve(res.rows[0]);

                await db.query('COMMIT');
            } catch(e) {
                await db.query('ROLLBACK')
                throw e
            }finally{
                db.release();
            }

            
        }
        
        queryFunc();
        
    })
};

const updateShain = function(shain:Shain){
    return new Promise((resolve, reject)=>{ 

        const queryFunc = async ()=>{
            
            var db = await pool.connect()
            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "UPDATE" 
                    + " 社員マスタ"
                    +" SET"
                    +" 社員番号 = $1"
                    +",パスワード = $2"
                    +",氏名 = $3 "
                    +",フリガナ = $4 "
                    // +",ryakushou = $ryakushou "
                    +",部署ＩＤ = $5 "
                    +",社員区分 = $6 "
                    +",役職ＩＤ = $7 "
                    +",休日グループ = $8 "
                    // +",社用携帯番号 = $社用携帯番号 "   
                    // +",社用携帯内線番号 = $社用携帯内線番号 "
                    // +",入社日 = $入社日 "
                    // +",退職日 = $退職日 "
                    +",アカウント = $9 "
                    +",メールアドレス = $10 "
                    +",郵便番号 = $11 "
                    +",住所 = $12 "
                    +",電話番号 = $13 "
                    +",携帯番号= $14"
                    // +",印影 = $印影 "
                    +" WHERE 社員ＩＤ = $15",
                    [
                        shain.bango,
                        shain.password,
                        shain.shimei,
                        shain.furigana,
                        shain.bushoId,
                        shain.shainKubunId,
                        shain.yakushokuId,
                        shain.kyujitsuGroupId,
                        shain.account,
                        shain.mailAddress,
                        shain.yubinBango,
                        shain.jyuusho,
                        shain.denwaBango,
                        shain.keitaiBango,
                        shain.id
                    ]
                )

                await db.query('COMMIT');
            }catch(e){
                await db.query('ROLLBACK');
                throw e;
            }finally{
                db.release();
                resolve("");
            }

        }

        queryFunc();
    });

};

const addShain = (shain:Shain)=>{
    return new Promise((resolve, reject)=>{ 
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "INSERT INTO"
                + " 社員マスタ"
                +" ("
                +" 社員番号"
                +",パスワード"
                +",氏名 "
                +",フリガナ"
                // +",ryakushou "
                +",部署ＩＤ "
                +",社員区分"
                +",役職ＩＤ"
                +",休日グループ "
                // +",社用携帯番号"   
                // +",社用携帯内線番号"
                // +",入社日 "
                // +",退職日 "
                +",アカウント"
                +",メールアドレス"
                +",郵便番号"
                +",住所"
                +",電話番号 "
                +",携帯番号"
                // +",印影"
                + " )"
                + " VALUES"
                +" ("
                +" $1"
                +",$2"
                +",$3 "
                +",$4"
                // +",$ryakushou "
                +",$5 "
                +",$6"
                +",$7"
                +",$8 "
                // +",社用携帯番号"   
                // +",社用携帯内線番号"
                // +",入社日 "
                // +",退職日 "
                +",$9"
                +",$10"
                +",$11"
                +",$12"
                +",$13 "
                +",$14"
                // +",$印影"
                + " )",
                [
                    shain.bango,
                    shain.password,
                    shain.shimei,
                    shain.furigana,
                    shain.bushoId,
                    shain.shainKubunId,
                    shain.yakushokuId,
                    shain.kyujitsuGroupId,
                    shain.account,
                    shain.mailAddress,
                    shain.yubinBango,
                    shain.jyuusho,
                    shain.denwaBango,
                    shain.keitaiBango,
                ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
        queryFunc();
    })
}

const deleteShain = (id:number) =>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res =  await db.query(
                "DELETE FROM"
                +" 社員マスタ"
                +" WHERE"
                +" 社員ＩＤ = $1",
                [
                    id
                ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
        queryFunc();
    });
}

const checkCredentials = function(user:string, password:string){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "SELECT" 
                    +" 社員ＩＤ as id"
                    +",社員番号 as bango"
                    +",休日グループ as kyujitsu_group_id"
                    +" FROM"
                    +" 社員マスタ"
                    +" WHERE"
                    +" 社員番号 = $1"
                    +" and"
                    +" パスワード = $2",
                    [
                        user,
                        password,
                    ]
                )

                await db.query('COMMIT');
                if(res.rows){
                    resolve(res.rows[0])
                }else{
                    resolve(null)
                }

           }catch(e){
               await db.query('ROLLBACK');
               resolve("");
               throw e;
               
           }finally{
               db.release();
               
           }
        }
        queryFunc();
    });
};

//project
const getProjectList = ()=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "SELECT"
                    +" プロジェクトＩＤ as id"
                    +",顧客ＩＤ as kokyaku_id"
                    +",プロジェクト番号 as bangou"
                    +",プロジェクト名 as na"
                    +",状態 as jyoutai_id"
                    +" FROM" 
                    +" プロジェクトヘッダ"
                    ,
                    []
               )
               resolve(res.rows);
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
              
           }
        }
        queryFunc();
    });
}

const getProject = (id:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "SELECT" 
                    +" 顧客ＩＤ as kokyaku_id"
                    +",状態 as jyoutai_id"
                    +",営業担当ＩＤ as eigyou_tantou_id"
                    +",ルートＩＤ as jyuchuu_route_id"
                    +",プロジェクト番号 as bangou"
                    +",親プロジェクトＩＤ as oya_project_id"
                    +",プロジェクト名 as na"
                    +",プロジェクト概要 as gaiyou"
                    +",プロジェクト目標 as mokuhyou"
                    +",予算 as yosa"
                    +",工数 as cousuu"
                    +",経費 as keihi"
                    +",稼働予定日 as honkadou_youtei_hi"
                    +",開始日 as kashibi"
                    +",終了日 as shuuryobi"
                    +",メモ as memo"
                    // +",mitsumori_file"
                    // +",document_folder"
                    +",プロジェクト終了報告  as shuuryu_houkoku"
                    +" FROM"
                    +" プロジェクトヘッダ"
                    +" WHERE"
                    +" プロジェクトＩＤ = $1",
                    [
                        id,
                    ]
               )

                if(res.rows){
                    resolve(res.rows[0])
                }else{
                    resolve(null)
                }
               await db.query('COMMIT');
            }catch(e){
               await db.query('ROLLBACK');
               throw e;
            }finally{
               db.release();
               
           }
        }
        queryFunc();
    });
}

const addProject = ( project:Project )=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "INSERT INTO"
                +" プロジェクトヘッダ"
                +"("
                +" 顧客ＩＤ "
                +",状態 "
                +",営業担当ＩＤ "
                +",ルートＩＤ "
                +",プロジェクト番号 "
                +",親プロジェクトＩＤ "
                +",プロジェクト名 "
                +",プロジェクト概要 "
                +",プロジェクト目標 "
                +",予算 "
                +",工数 "
                +",経費 "
                +",稼働予定日 "
                +",開始日 "
                +",終了日 "
                +",メモ "
                // +",mitsumori_file"
                // +",document_folder"
                +",プロジェクト終了報告 "
                +")"
                +" VALUES"
                +"("
                +" $1"
                +",$2"
                +",$3"
                +",$4"
                +",$5"
                +",$6"
                +",$7"
                +",$8"
                +",$9"
                +",$10"
                +",$11"
                +",$12"
                +",$13"
                +",$14"
                +",$15"
                +",$16"
                // +",$mitsumori_file"
                // +",$document_folder"
                +",$17"
                +")"
                +" RETURNING"
                +" プロジェクトＩＤ"
                ,
                [
                    project.kokyakuId,
                    project.jyoutaiId,
                    project.eigyouTantouId,
                    project.jyuchuuRouteId,
                    project.bangou,
                    project.oyaProjectId,
                    project.na,
                    project.gaiyou,
                    project.mokuhyou,
                    project.yosa,
                    project.cousuu,
                    project.keihi,
                    project.honkadouYoteiHi,
                    project.kashibi,
                    project.shuuryoubi,
                    project.memo,
                    // $mitsumori_file: project.mitsumoriFile,
                    // $document_folder: project.documentFolder,
                    project.shuuryuHoukoku,
                ]
               )
               if(res.rows){
                    console.log(res.rows)
                    resolve(res.rows[0].プロジェクトＩＤ);
               }else{
                    resolve(0);
               }
               
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               
           }
        }
	queryFunc();
    });
}

const updateProject = ( project:Project )=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "UPDATE"
                +" プロジェクトヘッダ"
                +" SET"
                +" 顧客ＩＤ = $1"
                +",状態 = $2"
                +",営業担当ＩＤ = $3"
                +",ルートＩＤ = $4"
                +",プロジェクト番号 = $5"
                +",親プロジェクトＩＤ = $6"
                +",プロジェクト名 = $7"
                +",プロジェクト概要 = $8"
                +",プロジェクト目標 = $9"
                +",予算 = $10"
                +",工数 = $11"
                +",経費 = $12"
                +",稼働予定日 = $13"
                +",開始日 = $14"
                +",終了日 = $15"
                +",メモ = $16"
                // +",mitsumori_file = $mitsumori_file"
                // +",document_folder = $document_folder"
                +",プロジェクト終了報告 = $17"
                +" where"
                +" プロジェクトＩＤ = $18",
                [
                    project.kokyakuId,
                    project.jyoutaiId,
                    project.eigyouTantouId,
                    project.jyuchuuRouteId,
                    project.bangou,
                    project.oyaProjectId,
                    project.na,
                    project.gaiyou,
                    project.mokuhyou,
                    project.yosa,
                    project.cousuu,
                    project.keihi,
                    project.honkadouYoteiHi,
                    project.kashibi,
                    project.shuuryoubi,
                    project.memo,
                    // $mitsumori_file: project.mitsumoriFile,
                    // $document_folder: project.documentFolder,
                    project.shuuryuHoukoku,
                    project.id
                ]
               )
                
               console.log(project.memo)
                
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const deleteProject = (id:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "Delete from"
                +" プロジェクトヘッダ"
                +" where"
                +" プロジェクトＩＤ = $1",
                [
                    id
                ]
               );

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}

//project--member
//remove mb_id
const getProjectMembers = (projectId:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "SELECT"
                    //redo
                    +" プロジェクトメンバＩＤ as mb_id"
                    +",プロジェクトメンバＩＤ as shain_id"
                    +" from" 
                    +" プロジェクトメンバ"
                    +" where"
                    +" プロジェクトＩＤ = $1",
                    [
                        projectId,
                    ]
               )
               resolve(res.rows);
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               
           }
        }
	queryFunc();
    });
}

const addProjectMember = (member:any, projectId:any)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "INSERT INTO"
                    +" プロジェクトメンバ"
                    +"("
                    +"プロジェクトメンバＩＤ"
                    +",プロジェクトＩＤ"
                    +")"
                    +" VALUES"
                    +"("
                    +"$1"
                    +",$2" 
                    +")",
                    [
                        member.shainId,
                        projectId,
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const updateProjectMember = (member:any, projectId:any)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "UPDATE"
                    +" プロジェクトメンバ"
                    +" SET"
                    +" プロジェクトメンバＩＤ = $1"
                    +" where "
                    +" プロジェクトメンバＩＤ = $2"
                    +" AND"
                    +" プロジェクトＩＤ = $3",
                    [
                        member.shainId,
                        member.id,
                        projectId
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const cleanProjectMembers = (projectId:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "DELETE FROM"
                +" プロジェクトメンバ"
                +" where"
                +" プロジェクトＩＤ = $1",
                [
                    projectId
                ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}

const deleteProjectMembers = (shainId:number, project_id:number )=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "DELETE FROM"
                    +" プロジェクトメンバ"
                    +" where"
                    +" プロジェクトメンバＩＤ = $1"
                    +" AND "
                    +" プロジェクトＩＤ = $2",
                    [
                        shainId,
                        project_id
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}



//project--detail add 作業内容インデックス
const getProjectSagyouNaiyou = (projectId:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "SELECT"
                    +" 連番 as sn_id"
                    +",タスクＩＤ as task_id"
                    +",作業内容 as sagyou_naiyou"
                    +",開始予定日 as kaishi_yotei_hi"
                    +",終了予定日 as shuuryou_yotei_hi"
                    +",予定工数 as yotei_kousuu"
                    +" from" 
                    +" プロジェクト明細"
                    +" where"
                    +" プロジェクトＩＤ = $1"
                    +" ORDER BY"
                    +" 連番 ASC"
                    ,
                    [
                        projectId
                    ]
               )
               resolve(res.rows);
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
           }
        }
	    queryFunc();
    });
}

const addProjectSagyouNaiyou = (sagyouNaiyou:any, projectId:number, pos:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "INSERT INTO"
                    +" プロジェクト明細"
                    +"("
                    +" プロジェクトＩＤ"
                    +",タスクＩＤ"
                    +",作業内容"
                    +",作業内容インデックス"
                    +",開始予定日"
                    +",終了予定日"
                    +",予定工数"
                    +",連番"
                    +")"
                    +" VALUES"
                    +"("
                    +" $1"
                    +",$2" 
                    +",$3" 
                    +",$4" 
                    +",$5"
                    +",$6" 
                    +",$7"
                    +",$8"
                    +")",
                    [
                        projectId,
                        sagyouNaiyou.task,
                        sagyouNaiyou.work,
                        sagyouNaiyou.task + "-" + sagyouNaiyou.work,
                        sagyouNaiyou.start == ""? null : new Date(sagyouNaiyou.start) ,
                        sagyouNaiyou.finish == ""? null : new Date(sagyouNaiyou.finish),
                        sagyouNaiyou.costs == ""? null : parseFloat(sagyouNaiyou.costs),
                        pos,
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const updateProjectSagyouNaiyou = (sagyouNaiyou:any, projectId:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "UPDATE" 
                    +" プロジェクト明細"
                    +" SET"
                    +" タスクＩＤ = $1 "
                    +",作業内容 = $2 "
                    +",開始予定日 = $3 "
                    +",終了予定日 = $4"
                    +",予定工数 = $5"
                    +",作業内容インデックス =$6"
                    +" WHERE"
                    +" 連番 = $7"
                    +" AND"
                    +" プロジェクトＩＤ = $8",
                    [
                        sagyouNaiyou.task,
                        sagyouNaiyou.work,
                        sagyouNaiyou.start,
                        sagyouNaiyou.finish,
                        sagyouNaiyou.costs,-
                        sagyouNaiyou.task + "" + sagyouNaiyou.work,
                        sagyouNaiyou.sn_id,
                        projectId,
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const cleanProjectSagyouNaiyou = (projectId:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "DELETE FROM"
                +" プロジェクト明細"
                +" where"
                +" プロジェクトＩＤ = $1",
                [
                    projectId
                ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}

const deleteProjectSagyouNaiyou = (sgId:number, project_id:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "DELETE FROM"
                    +" プロジェクト明細"
                    +" where"
                    +" 連番 = $1"
                    +" and"
                    +" プロジェクトＩＤ = $2",
                    [
                        sgId,
                        project_id
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });   
}

//Kinmu

const getKinmu = function (id:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "select"
                    +" 作業報告書ＩＤ as id"
                    +",勤務区分 as kinmu_kubun"
                    +",勤務形態 as kinmu_keitai"
                    +",出社時刻 as shussha_jikoku"
                    +",退社時刻 as taisha_jikoku"
                    +",控除時間 as koujyo_jikan"
                    +",休出時間 as kyuushutsu_jikan"
                    +",休暇種別 as kyuuka_shubetsu"
                    +",休暇事由 as kyuuka_riyu"
                    +",メモ as memo"
                    +",日付 as hidsuke"
                    +" from"
                    +" 作業報告書ヘッダ"
                    +" where"
                    +" 作業報告書ＩＤ = $1",
                    [
                        id
                    ]
               )
               if(res.rows){
                    resolve(res.rows[0])
                }else{
                    resolve(null)
                }
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               
           }
        }
	    queryFunc();
    });
}

const getKinmuList = function(id:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "SELECT"
                    +" 作業報告書ＩＤ as id"
                    // +",shain_id"
                    +",日付 as hidsuke"
                    +",勤務区分 as kinmu_kubun"
                    +",勤務形態 as kinmu_keitai"
                    +",出社時刻 as shussha_jikoku"
                    +",退社時刻 as taisha_jikoku"
                    +",控除時間 as koujyo_jikan"
                    +",休出時間 as kyuushutsu_jikan"
                    +",メモ as memo"
                    +" FROM" 
                    +" 作業報告書ヘッダ"
                    +" WHERE"
                    +" 社員ＩＤ = $1"
                    // +" AND"
                    // +" 日付 >= '2023-10-03'::date"
                    +" order by"
                    +" 日付",
                    [
                        id
                    ]
                )
                
                var e:Array<Kinmu> = [];
                
                
                if(res.rows[0]){
                     res.rows.forEach(element => {
                        
                        var kinmu:Kinmu = {
                            id: element.id,
                            shainId: id,
                            hidsuke: element.hidsuke,
                            kinmuKubun: element.kinmu_kubun,
                            kinmuKeitai: element.kinmu_keitai,
                            shusshaJikoku: convertDate("2000-01-01 " + element.shussha_jikoku),
                            taishaJikoku: convertDate("2000-01-01 " + element.taisha_jikoku),
                            koujyoJikan: element.koujyo_jikan,
                            kyuushutsuJikan: element.kyuushutsu_jikan,
                            memo: element.memo,
                        };
                        e.push(kinmu)
                    });
                }

                resolve(e);

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               
           }
        }
	    queryFunc();
    });
}

const addKinmu = function(nKinmu:Kinmu){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "INSERT INTO"
                +" 作業報告書ヘッダ"
                +"("
                +"社員ＩＤ "
                +",日付 "
                +",勤務区分 "
                +",勤務形態 "
                +",出社時刻 "
                +",退社時刻 "
                +",控除時間 "
                +",休出時間 "
                +",休暇種別"
                +",休暇事由"
                +",メモ"
                +")"
                +" VALUES"
                +"("
                +"$1 "
                +",$2 "
                +",$3 "
                +",$4 "
                +",$5::timestamp"
                +",$6::timestamp"
                +",$7 "
                +",$8"
                +",$9"
                +",$10"
                +",$11"
                +")"
                +" RETURNING"
                +" 作業報告書ＩＤ"
                ,
                
                [
                    nKinmu.shainId
                    ,nKinmu.hidsuke
                    ,nKinmu.kinmuKubun != ""? nKinmu.kinmuKubun : null
                    ,nKinmu.kinmuKeitai != ""? nKinmu.kinmuKeitai : null
                    ,nKinmu.shusshaJikoku
                    ,nKinmu.taishaJikoku
                    ,nKinmu.koujyoJikan != ""? nKinmu.koujyoJikan : 0
                    ,nKinmu.kyuushutsuJikan != ""? nKinmu.kyuushutsuJikan : 0
                    ,nKinmu.kyuukaShubetsu 
                    ,nKinmu.kyuukaRiyu
                    ,nKinmu.memo
                ]
               )
                if(res.rows){
                    resolve(res.rows[0].作業報告書ＩＤ);
                }else{
                    resolve(0)
                }
               
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
              
           }
        }
	queryFunc();
    });
}

const updateKinmu = function(kinmu:Kinmu){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "UPDATE" 
                    +" 作業報告書ヘッダ"
                    +" SET"
                    +" 勤務区分 = $1"
                    +",勤務形態 = $2"
                    +",出社時刻 = $3::timestamp"
                    +",退社時刻 = $4::timestamp"
                    +",控除時間 = $5 "
                    +",休出時間 = $6"
                    +",休暇種別 = $7"
                    +",休暇事由 = $8"
                    +",メモ = $9"
                    +" WHERE  作業報告書ＩＤ =  $10"
                    ,
                    [
                        kinmu.kinmuKubun != ""? kinmu.kinmuKubun : null,
                        kinmu.kinmuKeitai != ""? kinmu.kinmuKeitai : null,
                        kinmu.shusshaJikoku,
                        kinmu.taishaJikoku,
                        kinmu.koujyoJikan != ""? kinmu.koujyoJikan : 0,
                        kinmu.kyuushutsuJikan != ""? kinmu.kyuushutsuJikan : 0,
                        kinmu.kyuukaShubetsu,
                        kinmu.kyuukaRiyu,
                        kinmu.memo,
                        kinmu.id,
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const deleteKinmu = function(id:Number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "DELETE"
                +" FROM" 
                +" 作業報告書ヘッダ"
                +" WHERE"
                +" 作業報告書ＩＤ = $1", 
                [
                    id
                ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

//kinmu--detail 作業内容インデックス and info
const getKinmuSagyouNaiyouList = function(kinmuId:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                "Select"
                +" 連番 as id"
                +",作業報告書ＩＤ as kinmu_id"
                +",プロジェクトＩＤ as project_id"
                +",作業内容インデックス as sagyou_naiyou_id"
                +",作業時間 as sagyou_jikan"
                +" from"
                +" 作業報告書明細"
                +" where 作業報告書ＩＤ = $1"
                +" ORDER BY"
                +" 連番 ASC"
                ,
                [
                    kinmuId,
                ]
               )
               resolve(res.rows);
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               
           }
        }
	    queryFunc();
    });
}

const getProjectListKinmu = ()=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "SELECT"
                    +" プロジェクトヘッダ.プロジェクトＩＤ as id"
                    +",プロジェクト名 as na"
                    +",作業内容インデックス as sagyou_naiyou_id" //作業内容インデックス プロジェクト明細.連番
                    +",プロジェクト明細.連番 as sagyou_naiyou_pos" 
                    +",作業内容 as sagyou_naiyou_na"
                    +" FROM" 
                    +" プロジェクトヘッダ"
                    +" left join"
                    +" プロジェクト明細"
                    +" on"
                    +" プロジェクトヘッダ.プロジェクトＩＤ = プロジェクト明細.プロジェクトＩＤ"
                    +" ORDER BY"
                    +" プロジェクトヘッダ.プロジェクトＩＤ DESC"
                    +",プロジェクト明細.連番"
                )
                var e:Array<any> = [];
                
                if(res.rowCount && res.rowCount > 0){
                    var rows = res.rows;
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
                            position: element.sagyou_naiyou_pos,
                        });
                      
                    });
                    e.push(proj);
                }

                resolve(e);


               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               
           }
        }
	queryFunc();
    })
}

const addKinmuSagyouNaiyou = function(kSagyouNaiyou:KinmuSagyouNaiyou, kinmuId:number, pos:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "INSERT INTO"
                    +" 作業報告書明細"
                    +"("
                    +" 作業報告書ＩＤ "
                    +",プロジェクトＩＤ "
                    +",タスクＩＤ"
                    +",作業内容"
                    +",作業内容インデックス "
                    +",作業時間 "
                    +",連番"
                    +")"
                    +" VALUES"
                    +"("
                    +" $1 "
                    +",$2 "
                    +",$3 "
                    +",$4 "
                    +",$5 "
                    +",$6 "
                    +",$7"
                    +")",
                    [
                        kinmuId,
                        kSagyouNaiyou.projectId,
                        kSagyouNaiyou.taskId,
                        kSagyouNaiyou.sagyouNaiyou,
                        kSagyouNaiyou.sagyouNaiyouId,
                        // kSagyouNaiyou.taskId + "-" + kSagyouNaiyou.sagyouNaiyou,
                        kSagyouNaiyou.sagyouJikan,
                        pos,
                    ]
               )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	    queryFunc();
    });
}

const updateKinmuSagyouNaiyou = function(kSagyouNaiyou:KinmuSagyouNaiyou, kinmuId:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

               const res = await db.query(
                    "UPDATE" 
                    + " 作業報告書明細"
                    +" SET"
                    +" プロジェクトＩＤ = $1 "
                    +",タスクＩＤ = $2"
                    +",作業内容 = $3"
                    +",作業内容インデックス = $4"
           
                    +",作業時間 = $5"
                    +" WHERE"
                    +" 作業報告書ＩＤ = $6"
                    +" AND"
                    +" 連番 = $7"
                    ,
                    [
                        kSagyouNaiyou.projectId,
                        kSagyouNaiyou.taskId,
                        kSagyouNaiyou.sagyouNaiyou,
                        kSagyouNaiyou.sagyouNaiyouId,
                        kSagyouNaiyou.sagyouJikan,
                        kinmuId,
                        kSagyouNaiyou.id,

                    ]
                )
                

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}

const deleteKinmuSagyouNaiyou = function(id:number, kinmuId:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "DELETE FROM"
                    +" 作業報告書明細"
                    +" WHERE"
                    +" 作業報告書ＩＤ = $1"
                    +" AND"
                    +" 連番 = $2"
                    ,
                    [
                        kinmuId,
                        id
                    ]

                )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}

const cleanKinmuSagyouNaiyou =  function(kinmuId:number){
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    "DELETE FROM"
                    +" 作業報告書明細"
                    +" WHERE"
                    +" 作業報告書ＩＤ = $kinmuId"
                    ,
                    [
                        kinmuId
                    ]
                )

               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    });
}
//report
const getSagyouNaiyou = (beginDate:Date, endDate:Date, shainId:number)=>{
    return new Promise((resolve, reject)=>{
        const queryFunc = async ()=>{
            var db = await pool.connect();

            try{
                await db.query('BEGIN');

                const res = await db.query(
                    'Select'
                    +' プロジェクトヘッダ.プロジェクト番号 as bangou'
                    +',プロジェクトヘッダ.プロジェクト名 as na'
                    +',プロジェクトヘッダ.プロジェクトＩＤ as id'
                    +' from'
                    +' 作業報告書明細'
                    +' left join'
                    +' プロジェクトヘッダ on 作業報告書明細.プロジェクトＩＤ = プロジェクトヘッダ.プロジェクトＩＤ'
                    +' left join'
                    +' 作業報告書ヘッダ on 作業報告書明細.作業報告書ＩＤ = 作業報告書ヘッダ.作業報告書ＩＤ'
                    +' where'
                    +' 作業報告書ヘッダ.日付 BETWEEN $1::date AND $2::date'
                    +' and'
                    +' 作業報告書ヘッダ.社員ＩＤ = $3'
                    +' group by プロジェクトヘッダ.プロジェクト番号',
                    [
                        beginDate,
                        endDate,
                        shainId,
                    ]
                )
                var pjList:Array<ProjectItem> = new Array<ProjectItem>();
                var projectI:ProjectItem;
                if(res.rows){
                    res.rows.forEach( (pj)=>{
                        projectI = new ProjectItem()
                        projectI.bango = pj.bangou;
                        projectI.na = pj.na;
                        projectI.sakugyoNaiyouList = new Array<sakugyoNaiyouItem>();
                        projectI.id = pj.id
    
                        pjList.push(projectI)
                        
                    } )
                }
                
                resolve(pjList);
                
               await db.query('COMMIT');
           }catch(e){
               await db.query('ROLLBACK');
               throw e;
           }finally{
               db.release();
               resolve("");
           }
        }
	queryFunc();
    })
}

module.exports = {
   

    loadDb: loadDb,
    
    // initDb: initDb,

    //shain
    getShain:  getShain,
    getShainList: getShainList,
    checkCredentials: checkCredentials,
    addShain: addShain, 
    updateShain: updateShain,
    //TO TEST:
    deleteShain: deleteShain,

    //project
    getProjectList: getProjectList,
    getProject: getProject,
    addProject: addProject,
    //project--members
    getProjectMembers: getProjectMembers,
    addProjectMember: addProjectMember,
    //project--detail
    getProjectSagyouNaiyou: getProjectSagyouNaiyou,
    addProjectSagyouNaiyou: addProjectSagyouNaiyou,
    updateProject: updateProject,
    updateProjectMember: updateProjectMember,
    updateProjectSagyouNaiyou: updateProjectSagyouNaiyou,
    deleteProjectMembers: deleteProjectMembers,
    deleteProjectSagyouNaiyou: deleteProjectSagyouNaiyou,
    deleteProject: deleteProject,
    cleanProjectMembers: cleanProjectMembers,
    cleanProjectSagyouNaiyou: cleanProjectSagyouNaiyou,

    //Kinmu
    getKinmuList: getKinmuList,
    getKinmu: getKinmu,
    getKinmuSagyouNaiyouList: getKinmuSagyouNaiyouList,
    getProjectListKinmu: getProjectListKinmu,
    addKinmu: addKinmu,
    addKinmuSagyouNaiyou: addKinmuSagyouNaiyou,
    updateKinmu: updateKinmu,
    updateKinmuSagyouNaiyou: updateKinmuSagyouNaiyou,
    deleteKinmuSagyouNaiyou: deleteKinmuSagyouNaiyou,
    //TO TEST: 
    deleteKinmu: deleteKinmu,
    cleanKinmuSagyouNaiyou: cleanKinmuSagyouNaiyou,
   
    
}