import type { NextApiRequest, NextApiResponse } from "next";
import type { Kinmu, Shain } from "../../../src/lib/database";
import { ProjectItem, sakugyoNaiyouItem } from "@/src/lib/report";
const db = require("@/src/lib/database.ts");
var dataBaseConnectionStr: string = "../../../db.sqlite3";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST" && req.body) {
    var body = JSON.parse(req.body);
    switch (body?.type) {
      case "login": {
        const loginFunc = async () => {
          db.loadDb(dataBaseConnectionStr);
          db.checkCredentials(body.user, body.password).then((result: any) => {
            db.closeDb(dataBaseConnectionStr);
            if (result) {
              res.status(200).json({
                id: result.id,
              });
            } else {
              res.status(400).json({
                error: result,
              });
            }
            res.end();
          });
        };

        loginFunc();
        break;
      }
      case "kinmu-list": {
        const kinmuListFunc = async () => {
          db.loadDb(dataBaseConnectionStr);
          const ser = await db.getKinmuList(body.id).then((v: any) => {
            res.status(200).json({ kinmuList: v });
            res.end();
            db.closeDb(dataBaseConnectionStr);
          });
        };
        kinmuListFunc();
        break;
      }
      case "kinmu-update": {
        console.log("ees");
        break;
      }
      case "shain-list": {
        const shainListFunc = async () => {
          db.loadDb(dataBaseConnectionStr);
          const ser = await db.getShainList().then((v: any) => {
            console.log(v);
            res.status(200).json({ shainList: v });
            res.end();
            db.closeDb(dataBaseConnectionStr);
          });
        };
        shainListFunc();

        break;
      }
      case "shain-get": {
        const getShain = async () => {
          db.loadDb(dataBaseConnectionStr);
          const ser = await db.getShain(body.id).then((v: any) => {
            res.status(200).json({ user: v });
            res.end();
            db.closeDb(dataBaseConnectionStr);
          });
        };
        getShain();
        break;
      }
      case "shain-update": {
        const updateShain = async () => {
          db.loadDb(dataBaseConnectionStr);
          console.log(body?.shain);
          const ser = await db.updateShain(body.shain).then((v: any) => {
            res.status(200).json({ user: v });
            res.end();
            db.closeDb(dataBaseConnectionStr);
          });
        };
        updateShain();
        break;
      }
      case "shain-add": {
        const addShain = async () => {
          db.loadDb(dataBaseConnectionStr);
          const ser = await db.addShain(body.shain).then((v: any) => {
            res.status(200).json({ added: true });
            res.end();
            db.closeDb(dataBaseConnectionStr);
          });
        };
        addShain();
        break;
      }
      case "shain-delete": {
        const deleteShain = async () => {
          db.loadDb(dataBaseConnectionStr);

          const ser = await db.deleteShain(body.id).then((v: any) => {
            res.status(200).json({ deleted: true });
            res.end();
            db.closeDb(dataBaseConnectionStr);
          });
        };
        deleteShain();
        break;
      }
      case "shuu-sakugyou-houkoku":
        const kinmuListFunc = async () => {
          db.loadDb(dataBaseConnectionStr);
          const ser = await db
            .getSakugyouNaiyou(body.beginDate, body.endDate, body.shainId)
            .then((v: any) => {
              // res.status(200).json({projectList: v});
              // res.end();
              console.log(v);
              db.closeDb(dataBaseConnectionStr);
            });
        };
        kinmuListFunc();
        db.getSakugyouNaiyou(body.beginDate, body.endDate, body.shainId).then(
          (v: any) => {
            console.log(v);
          }
        );
        break;
      default:
        break;
    }
  } else {
    res.status(400).end();
  }
}
