#!/usr/bin/env node

const yargs = require('yargs')
const {loadMessagingInfo} = require('./loadMessagingData')
const {bulkSend} = require('./bulkSend')

const args = yargs
  .scriptName('signum-serial-letter')
  .usage('Usage: $0 [options]')
  .example('$0 -d ./customData.json', 'Sends a message according the info file')
  .alias('d', 'data')
  .nargs('d', 1)
  .describe('d', 'Loads data from file')
  .default('d', './messagingData.json')
  .alias('t', 'test')
  .boolean('t')
  .describe('t', 'Runs without sending')
  .help('h')
  .alias('h', 'help')
  .epilog('Made without 🧠 by ohager')
  .epilog('Donate SIGNA to S-9K9L-4CB5-88Y5-F5G4Z - or use alias: ohager ')
  .epilog('SNS: https://code.ohager@signum')
  .argv;

(async () => {
  try {
    const messagingInfo = loadMessagingInfo(args.d);
    await bulkSend({ ...messagingInfo, isDryRun : args.t })
  } catch (e) {
    console.error('Oh damn. This didn\'t work')
    console.error(e)
  }
})()
