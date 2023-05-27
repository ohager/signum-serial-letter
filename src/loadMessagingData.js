const {readFileSync} = require('fs');
const Validator = require('fastest-validator');
const {Address} = require("@signumjs/core");

const schemaSameMessage = {
  host: {type: "url"},
  message: {type: "string", min: 1, max: 1000},
  maxTx: {type: "number", min: 1, max: 1020},
  recipients: [
    { // accounts
      type: "array", empty: false, unique: true, items: {
        type: 'string', empty: false, min: 10, max: 26
      }
    },
    { // filename
      type: 'string', empty: false
    }
  ]
};


const schemaMultiMessage = {
  host: {type: "url"},
  maxTx: {type: "number", min: 1, max: 1020},
  recipients: [
    { // accounts
      type: "array", empty: false, unique: true, items: {
        type: 'object', empty: false, props: {
          to: {type: 'string', empty: false, min: 10, max: 26},
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

function parseSameMessageData(json) {
  const result = new Validator().validate(json, schemaSameMessage)
  if (result !== true) {
    console.error(result)
    throw new Error('Parsing failed')
  }

  let recipients = []
  if(typeof json.recipients === "string"){
    // read csv file
    recipients = []
  }
  else {
    recipients = dedupeAndUnifyRecipients(json.recipients);
  }

  return {
    ...json,
    recipients
  };
}

function parseMulitMessageData(json) {
  const result = new Validator().validate(json, schemaMultiMessage)
  if (result !== true) {
    console.error(result)
    throw new Error('Parsing failed')
  }

  let recipients = []
  if(typeof json.recipients === "string"){
    // read csv file
    recipients = []
  }
  else {
    recipients = dedupeAndUnifyRecipients(json.recipients);
  }

  return {
    ...json,
    recipients
  };
}
const loadMessagingInfo = (filePath) => {
  try {
    console.info(`Loading ${filePath}...`)
    const jsonStr = readFileSync(filePath).toString('utf-8');
    const json = JSON.parse(jsonStr);
    if (json.message) {
      return parseSameMessageData(json)
    }

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
