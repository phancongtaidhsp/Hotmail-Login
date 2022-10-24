const XLSX = require('xlsx');

function getData(thread){
  var workbook = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\data${thread}.xlsx`);

  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
  var data = XLSX.utils.sheet_to_json(worksheet);
  var result = [];
  for(const item of data){
    let keys = Object.keys(item);
    let temp = [];
    for(const key of keys){
      temp.push(item[key])
    }
    result.push(temp);
  }
  return result;
}

module.exports = getData;
