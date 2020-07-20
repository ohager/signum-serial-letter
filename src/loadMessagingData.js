const {readFileSync} = require('fs');
const {isBurstAddress} = require('@burstjs/util')
const {convertAddressToNumericId} = require('@burstjs/util');
const Validator = require('fastest-validator');

const schema = {
  host: {type: "url"},
  message: {type: "string", min: 3, max: 1000},
  recipients: {
    type: "array", empty: false, unique: true, items: {
      type: 'string', empty: false, min: 10, max: 26
    }
  }
};

const AccountIdRegex = /^\d{10,25}$/

const unifyRecipientAddresses = (recipients) => {
  return recipients.map(r => {
    let id = r
    if(r.startsWith('BURST')){
      if(!isBurstAddress(r)) throw new Error(`Invalid Address ${r}`)
      id = convertAddressToNumericId(r)
    }
    if(!AccountIdRegex.test(id)){
      throw new Error(`Invalid Address ${id}`)
    }
    return id
  })
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

    const recipients = unifyRecipientAddresses(json.recipients);

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
