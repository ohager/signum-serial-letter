const {composeApi, ApiSettings} = require('@burstjs/core')
const {BurstValue} = require('@burstjs/util')
const {generateMasterKeys} = require('@burstjs/crypto')
const {prompt} = require('inquirer')
const chunk = require('lodash.chunk')

const askForPassphrase = async () => prompt([
  {
    type: 'password',
    name: 'passphrase',
    message: 'Enter your passphrase to confirm (Leave empty to abort)',
    default: ''
  }
])

const drySend = () =>
  new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

const bulkSend = async ({host, recipients, message, isDryRun}) => {

  const api = composeApi(new ApiSettings(host));
  const {standard} = await api.network.suggestFee();
  const totalMessages = recipients.length

  const fee = standard.toString(10);
  const totalCosts = BurstValue.fromPlanck(fee).multiply(totalMessages);
  console.info(`You are about to send to ${totalMessages} accounts.`)
  console.info(`This will cost you approx. ${totalCosts.toString()}`)
  console.info('Used Host:', host)
  if (isDryRun) {
    console.info('Dry Run is active - nothing will be sent!')
  }
  console.info('--------------------------------------\n')
  const {passphrase} = await askForPassphrase()

  if (passphrase.trim().length === 0) {
    console.info('Aborted')
    return
  }

  console.info('Ok. There we go...')
  const {publicKey, signPrivateKey} = generateMasterKeys(passphrase);
  const chunks = chunk(recipients, 10);
  let progress = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunkedRecipients = chunks[i];
    const batch = chunkedRecipients
      .map(recipientId => isDryRun
        ? drySend()
        : api.message.sendMessage({
          recipientId,
          senderPublicKey: publicKey,
          senderPrivateKey: signPrivateKey,
          deadline: 60 * 6,
          feePlanck: fee,
          message,
          messageIsText: true,
        })
      )
    progress += batch.length
    await Promise.all(batch)
    console.info(`Sent ${progress} of ${totalMessages} messages`)
  }
}

module.exports = {
  bulkSend
}
