const {readFileSync} = require("fs");

function unquote(str) {
  return str.replace(/"/g, "")
}


// very naive csv file loader implementation
function loadCSVFile(filePath){
  try{
    console.info(`Reading CSV file: ${filePath}...`)
    const csvStr = readFileSync(filePath).toString('utf-8');
    const lines = csvStr.split(/\r?\n/)
    const recipients = []
    for(let l of lines){
      const [to, msg, signa] = unquote(l).split(/[;,]/g)
      if(to){
        recipients.push({to, msg, signa: signa ? parseFloat(signa) : undefined})
      }
    }
    console.info(`Successfully read ${lines.length} lines and ${recipients.length} recipients.`)
    return recipients
  } catch(e){
    console.error("Failed parsing CSV file: ", filePath)
    throw e
  }
}

module.exports = {
  loadCSVFile
}
