const {readFileSync} = require('fs');
const {join, isAbsolute} = require('path');
const {cwd} = require('process')
const Validator = require('fastest-validator');
const {Address} = require("@signumjs/core");
const {loadCSVFile} = require("./loadCSVFile");

const schema = {
  host: {type: "url"},
  txPerBlock: {type: "number", min: 1, max: 1020},
  recipients: [
    { // accounts
      type: "array", empty: false, unique: true, items: {
        type: 'object', empty: false, props: {
          to: {type: 'string', empty: false, min: 10, max: 64},
          msg: {type: 'string', empty: false, min: 1, max: 1000, optional: true},
          signa: {type: "number", optional: true, positive: true}
          // we might expand to token and quantity
        }
      }
    },
    { // filename
      type: 'string', empty: false
    }
  ]
};

const dedupeAndUnifyRecipients = (recipients) => {
  const receivers = new Map()
  for (let r of recipients) {
    try {
      const a = Address.create(r.to)
      r.to = a.getNumericId();
      receivers.set(r.to, r)
    } catch (e) {
      console.warn(`Invalid address: ${r} -ignored`)
    }
  }
  return Array.from(receivers.values());
}

const loadMessagingData = (filePath) => {
  try {
    console.info(`Loading ${filePath}...`)
    const jsonStr = readFileSync(filePath).toString('utf-8');

    const json = JSON.parse(jsonStr);
    const result = new Validator().validate(json, schema)
    if (result !== true) {
      console.error(result)
      throw new Error(`Parsing failed: [${result.map( e => e.message)}]`)
    }
    let recipients = json.recipients;
    if(typeof json.recipients === "string"){
      // read csv file
      const filePath = isAbsolute(json.recipients) ? json.recipients : join(cwd(), json.recipients);
      recipients = loadCSVFile(filePath);
    }
    recipients = dedupeAndUnifyRecipients(recipients);

    return {
      ...json,
      recipients
    };
  } catch (e) {
    console.error(e.message)
    throw e;
  }
}

module.exports = {
  loadMessagingData
}
