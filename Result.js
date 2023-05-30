const XLSX = require('xlsx');

const result = (thread) => {
  var wbOutput = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\output${thread}.xlsx`);

  var fnOuput = wbOutput.SheetNames[0];
  /* Get worksheet */
  var wsOuput = wbOutput.Sheets[fnOuput];
  var dataOutput = XLSX.utils.sheet_to_json(wsOuput);
  var ketqua = dataOutput.filter(item => {
    if(item['status'] === 'done') return true;
    else return false;
  })
  
  var wbKetQua = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\ketqua${thread}.xlsx`);
  var fnKetQua = wbKetQua.SheetNames[0];
  /* Get worksheet */
  var wsKetQua = wbKetQua.Sheets[fnKetQua];
  var dataKetQua = XLSX.utils.sheet_to_json(wsKetQua);
  dataKetQua.push(...ketqua);
  var wbKQ = XLSX.utils.book_new();
  if(dataKetQua.length > 0)
  var wsKQ = XLSX.utils.json_to_sheet(dataKetQua);
  XLSX.utils.book_append_sheet(wbKQ, wsKQ, "ketqua");
  XLSX.writeFile(wbKQ,`${__dirname}/../extraResources/man${thread}\\ketqua${thread}.xlsx`);

  var dataFail = dataOutput.filter(item => {
    if(item['status'] == 'fail') return true;
    else return false;
  })

  if(dataFail.length > 0){
    var wbFail1 = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\fail${thread}.xlsx`);

    var fnFail1 = wbFail1.SheetNames[0];
    /* Get worksheet */
    var wsFail1 = wbFail1.Sheets[fnFail1];
    var dtFail1 = XLSX.utils.sheet_to_json(wsFail1);
    dtFail1.push(...dataFail);
    var wbf1 = XLSX.utils.book_new();
    var wsf1 = XLSX.utils.json_to_sheet(dtFail1);
    XLSX.utils.book_append_sheet(wbf1, wsf1, "fail");
    XLSX.writeFile(wbf1,`${__dirname}/../extraResources/man${thread}\\fail${thread}.xlsx`);
  }


  var dataRestoreImap = dataOutput.filter(item => {
    if(item['status'] == 'restoreimap') return true;
    else return false;
  })

  if(dataRestoreImap.length > 0){
    var wbRestoreImap = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\restoreimap${thread}.xlsx`);

    var fnRestoreImap = wbRestoreImap.SheetNames[0];
    /* Get worksheet */
    var wsRestoreImap = wbRestoreImap.Sheets[fnRestoreImap];
    var dtRestoreImap = XLSX.utils.sheet_to_json(wsRestoreImap);
    dtRestoreImap.push(...dataRestoreImap);
    var wbf1 = XLSX.utils.book_new();
    var wsf1 = XLSX.utils.json_to_sheet(dtRestoreImap);
    XLSX.utils.book_append_sheet(wbf1, wsf1, "restoreimap");
    XLSX.writeFile(wbf1,`${__dirname}/../extraResources/man${thread}\\restoreimap${thread}.xlsx`);
  }


  var wbData = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\data${thread}.xlsx`);
  var fnData = wbData.SheetNames[0];
  /* Get worksheet */
  var wsData = wbData.Sheets[fnData];
  var dtData = XLSX.utils.sheet_to_json(wsData);
  var dataFail = dataOutput.filter(item => {
    if(item['status'] !== 'done' && item['status'] !== 'fail' && item['status'] !== "restoreimap") return true;
    else return false;
  })
  var dtDataFiltered = dtData.slice(dataOutput.length);
  dtDataFiltered.push(...dataFail);

  if(dtDataFiltered.length < 1){
    dtDataFiltered.push({
      'mail': '',
      'pass': '',
      'newpass': '',
      'status': '',
      'proxy': '',
      "note": ''
    })
  }
  
  var wbDt = XLSX.utils.book_new();
  var wsDt = XLSX.utils.json_to_sheet(dtDataFiltered);
  XLSX.utils.book_append_sheet(wbDt, wsDt, "data");
  XLSX.writeFile(wbDt,`${__dirname}/../extraResources/man${thread}\\data${thread}.xlsx`);

  var wbOutput = XLSX.utils.book_new();
  var wsOutput = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(wbOutput, wsOutput, "output");
  XLSX.writeFile(wbOutput,`${__dirname}/../extraResources/man${thread}\\output${thread}.xlsx`);

}


module.exports = result;