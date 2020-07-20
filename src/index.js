const yargs = require('yargs')
const {join} = require('path');
const {loadMessagingInfo} = require('./loadMessagingData')
const {bulkSend} = require('./bulkSend')

const args = yargs
  .usage('Usage: $0 [options]')
  .example('$0 -d ./customData.json', 'Sends a message according the info file')
  .alias('d', 'data')
  .nargs('d', 1)
  .describe('d', 'Loads data from file')
  .default('d', join(__dirname, '../messagingData.json'))
  .alias('t', 'test')
  .boolean('t')
  .describe('t', 'Runs without sending')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2020')
  .argv;

(async () => {
  try {
    const messagingInfo = loadMessagingInfo(args.d);
    await bulkSend({ ...messagingInfo, isDryRun : args.t })
  } catch (e) {
    console.error('Oh damn. This didn\'t work')
    console.error(e.message)
  }
})()
