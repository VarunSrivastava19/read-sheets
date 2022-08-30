import Sheets from 'node-sheets';
import { store } from './store';
import { authData } from './auth';
import { mapColToApi } from './utils';
const gs = new Sheets.default(store["SHEET_ID"]);

/**
 * tables.header =[ 'numId', 'name', 'clg', 'prfs' ]
 * tables.rows = [ {}, {} ]
 * table.rows[N] = { header[N]: {value: , stringValue: } }
 */

const sheet1 = [];
const sheet2 = [];
const ranges = ["Sheet1!A:D", "Sheet2!A:B"];
ranges.forEach((range)=> {
  gs.authorizeJWT(authData)
    .then(()=> gs.tables(range))
    .then((tables)=> {
      const sheetMaps = [];
      let rows = tables.rows;
      rows.forEach(
        (row) => {
          const sheetDataInstance = {};
          Object.keys(row).forEach(
            prop => {
              // {mapColToApi[prop]: row[prop]["value"]};
              sheetDataInstance[mapColToApi[prop]] = row[prop]["value"];
            }
          )
          console.log(sheetDataInstance); //DONE:TODO: MERGE TWO MAPS TOGETHER
          sheetDataInstance.hasOwnProperty('desig') ? sheet2.push(sheetDataInstance) : sheet1.push(sheetDataInstance); 
        }
      )
      for(let i = 0; i < sheet1.length; i++) {
        let sheetData = {};
        for(let j = 0; j < sheet2.length; j++) {
          if(sheet1[i]["numId"] == sheet2[j]["numId"]) {
            sheetData = {...sheet1[i], ...sheet2[i]};
          }
        }
        sheetMaps.push(sheetData);
      }
      console.log(sheetMaps); // TODO: ITERATE OVER THIS LIST & POST TO ZOHO CRM
    })
    .catch((e)=>console.log(e));
});
// gs.authorizeJWT(authData)
//   .then(()=> gs.tables("Sheet1!A:D"))
//   .then((table)=>{
//     // console.log(table.headers);
//     // console.log(table.formats);
//     console.log(table.rows)
//   })
//   .catch((e)=> console.log(e));