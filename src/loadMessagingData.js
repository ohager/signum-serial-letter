const {readFileSync} = require('fs');
const Validator = require('fastest-validator');
const {Address} = require("@signumjs/core");

const schema = {
  host: {type: "url"},
  message: {type: "string", min: 3, max: 1000},
  maxTx: {type: "number", min: 1, max: 1020},
  recipients: {
    type: "array", empty: false, unique: true, items: {
      type: 'string', empty: false, min: 10, max: 26
    }
  }
};


const dedupeAndUnifyRecipients = (recipients) => {
  const receivers = new Set()
  for (let r of recipients) {
    try {
      const a = Address.create(r)
      receivers.add(a.getNumericId())
    } catch (e) {
      console.warn(`Invalid address: ${r} -ignored`)
    }
  }
  return Array.from(receivers);
}

const loadMessagingInfo = (filePath) => {
  try {
    console.info(`Loading ${filePath}...`)
    const jsonStr = readFileSync(filePath).toString('utf-8');
    const json = JSON.parse(jsonStr);
    const result = new Validator().validate(json, schema)
    if (result !== true) {
      console.error(result)
      throw new Error('Parsing failed')
    }

    const recipients = dedupeAndUnifyRecipients(json.recipients);

    return {
      ...json,
      recipients
    };
  } catch (e) {
    console.error(e.message)
    throw new Error('Parsing failed')
  }
}

module.exports = {
  loadMessagingInfo
}
