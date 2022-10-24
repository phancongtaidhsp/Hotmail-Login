const XLSX = require('xlsx');

ExportData = (row,thread) => {
  var workbook = XLSX.readFile(`${__dirname}/../extraResources/man${thread}\\output${thread}.xlsx`);
  

  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
  var data = XLSX.utils.sheet_to_json(worksheet);

  var item = {
    'mail': row[0],
    'pass': row[1],
    'newpass': row[2],
    'status': row[3],
    'proxy': row?.[4],
    "note": row?.[5]
  };

  data.push(item);

  var newWB = XLSX.utils.book_new();
  var newWS = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(newWB, newWS, "output");
  XLSX.writeFile(newWB,`${__dirname}/../extraResources/man${thread}\\output${thread}.xlsx`);
}

module.exports = ExportData;




