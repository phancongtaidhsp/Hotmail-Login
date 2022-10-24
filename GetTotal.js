const XLSX = require('xlsx');

const GetTotal = (thread) => {
  var workbook = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\output${thread}.xlsx`);

  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
  var data = XLSX.utils.sheet_to_json(worksheet);
  return data.length;

}
module.exports = GetTotal;