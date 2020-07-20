const yargs = require('yargs')
const {join} = require('path');
const {loadMessagingInfo} = require('./loadMessagingData')

const args = yargs
  .usage('Usage: $0 [options]')
  .example('$0 -d ./customData.json', 'Sends a message according the info file')
  .alias('d', 'data')
  .nargs('d', 1)
  .describe('d', 'Loads data from file')
  .default('d', join(__dirname, '../messagingData.json'))
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2020')
  .argv;

(async () => {
  try {
    const messagingInfo = loadMessagingInfo(args.d);
    return Promise.resolve()
  } catch (e) {
    console.error('Oh damn. This didn\'t work')
    console.error(e.message)
  }
})()
