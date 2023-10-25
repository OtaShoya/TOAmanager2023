import ExcelJS from "exceljs";
import fs from "fs";
import { get } from "http";

class sakugyoNaiyouItem {
  constructor() {
    this.shuu = new Array<number>();
  }
  name?: string;
  shuu!: Array<number>;
}

class ProjectItem {
  constructor() {
    this.sakugyoNaiyouList = new Array<sakugyoNaiyouItem>();
  }
  id?: number;
  bango?: string;
  na?: string;
  sakugyoNaiyouList?: Array<sakugyoNaiyouItem>;
}

function styleCells(row: ExcelJS.Row, isProjectRow: boolean = false) {
  for (let i = 1; i <= 12; i++) {
    var e = row.findCell(i);

    const borderStyle: Partial<ExcelJS.Border> = {
      style: "thin",
    };
    if (e) {
      e.style = {
        border: {
          bottom: borderStyle,
          right: borderStyle,
          left: borderStyle,
          top: borderStyle,
        },
        font: {
          size: 10,
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFFFF" },
        },
        numFmt: "0.00",
      };

      if (isProjectRow) {
        e.style.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDDDDDD" },
        };
      }
    }
  }
}

function format(toFormat: number) {
  return toFormat > 9 ? toFormat : "0" + toFormat;
}

const weekReport = (
  path: string,
  na: string,
  initialDate: Date,
  pll: Array<ProjectItem>
): Promise<void> => {
  // fs.copyFile("./new.xlsx", )

  var workbook = new ExcelJS.Workbook();
  return workbook.xlsx.readFile("./template.xlsx").then(() => {
    const template = workbook.worksheets[0];

    //test

    //test end

    // workbook.xlsx.readFile("./template.xlsx").then( ()=>{ //path
    let shhetTitle =
      initialDate.getFullYear() +
      "." +
      format(initialDate.getMonth() + 1) +
      "." +
      format(initialDate.getDate());
    let sheet = workbook.getWorksheet(shhetTitle);
    let endDate = new Date(initialDate);

    endDate.setDate(endDate.getDate() + 6);

    sheet = template;
    sheet.name = shhetTitle;

    //initial fields
    var nameCell = sheet.getCell("A5");
    var startDateCell = sheet.getCell("C5");
    var endDateCell = sheet.getCell("C6");

    nameCell.value = na;
    startDateCell.value =
      "自　" +
      initialDate.getFullYear() +
      "年　" +
      format(initialDate.getMonth() + 1) +
      "月　" +
      format(initialDate.getDate()) +
      "日";
    startDateCell.style.font = { size: 13 };
    endDateCell.value =
      "至　" +
      endDate.getFullYear() +
      "年　" +
      format(endDate.getMonth() + 1) +
      "月　" +
      format(endDate.getDate()) +
      "日";

    //dates
    initialDate.setHours(12);

    for (let i = 0; i < 7; i++) {
      let letter;

      switch (i) {
        case 0: {
          letter = "D";
          break;
        }
        case 1: {
          letter = "E";
          break;
        }
        case 2: {
          letter = "F";
          break;
        }
        case 3: {
          letter = "G";
          break;
        }
        case 4: {
          letter = "H";
          break;
        }
        case 5: {
          letter = "I";
          break;
        }
        case 6: {
          letter = "J";
          break;
        }
      }

      var cCell = sheet.getCell(letter + "8");

      var l = new Date(initialDate);

      l.setDate(l.getDate() + i);

      cCell.value = l;
    }

    var ins = 10;
    var insertI = ins;
    var first = true;

    pll.forEach((item, index, arr) => {
      //Values map => [ "PJ番号","PJ名","作　業　内　容","月","火","水","木","金","土","日", "合計", "PJ合計" ]
      var projectRow;
      if (!sheet) {
        return;
      }
      if (first) {
        projectRow = sheet.getRow(insertI);
        first = false;
      } else {
        projectRow = sheet.insertRow(
          insertI,
          [item.bango, item.na, "", "", "", "", "", "", "", "", "", ""],
          "o"
        );
      }

      projectRow.commit();
      insertI++;
      var pjGoukei = 0;
      item.sakugyoNaiyouList?.forEach((sakugyouItem) => {
        var goukei = sakugyouItem.shuu.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );
        pjGoukei += goukei;
        if (!sheet) {
          return;
        }
        var rr = sheet.insertRow(
          insertI,
          [
            "",
            "",
            sakugyouItem.name,
            sakugyouItem.shuu[0] > 0 ? sakugyouItem.shuu[0] : "",
            sakugyouItem.shuu[1] > 0 ? sakugyouItem.shuu[1] : "",
            sakugyouItem.shuu[2] > 0 ? sakugyouItem.shuu[2] : "",
            sakugyouItem.shuu[3] > 0 ? sakugyouItem.shuu[3] : "",
            sakugyouItem.shuu[4] > 0 ? sakugyouItem.shuu[4] : "",
            sakugyouItem.shuu[5] > 0 ? sakugyouItem.shuu[5] : "",
            sakugyouItem.shuu[6] > 0 ? sakugyouItem.shuu[6] : "",
            goukei,
            "",
          ],
          "o"
        );

        styleCells(rr);

        rr.commit();

        insertI++;
      });
      projectRow.values = [
        item.bango,
        item.na,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        pjGoukei,
      ];

      styleCells(projectRow, true);
      projectRow.commit();
    });

    var goukeiRow = sheet.getRow(insertI);
    var zangyouRow = sheet.getRow(insertI + 1);

    for (let i = 4; i <= 11; i++) {
      var goukeiCell = goukeiRow.findCell(i);
      var zangyouCell = zangyouRow.findCell(i);
      if (goukeiCell) {
        var letter = "D";
        switch (i) {
          case 4: {
            letter = "D";
            break;
          }
          case 5: {
            letter = "E";
            break;
          }
          case 6: {
            letter = "F";
            break;
          }
          case 7: {
            letter = "G";
            break;
          }
          case 8: {
            letter = "H";
            break;
          }
          case 9: {
            letter = "I";
            break;
          }
          case 10: {
            letter = "J";
            break;
          }
          case 11: {
            letter = "K";
            break;
          }
        }
        goukeiCell.value = {
          formula: "SUM(" + letter + ins + ":" + letter + (insertI - 1) + ")",
          result: "",
          date1904: false,
        };
        if (i < 11 && zangyouCell) {
          zangyouCell.value = {
            formula:
              "IF(" +
              letter +
              insertI +
              "=0,0," +
              letter +
              insertI +
              "-IF(OR(" +
              letter +
              "$7=2," +
              letter +
              "$7=3),4,IF(" +
              letter +
              "$7=1,8,0)))",
            result: "",
            date1904: false,
          };
        }
      }
    }

    return workbook.xlsx.writeFile(path);
  });
  // })
};
module.exports = {
  weekReport: weekReport,
};

export { weekReport, ProjectItem, sakugyoNaiyouItem };
