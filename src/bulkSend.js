const {composeApi, ApiSettings} = require('@burstjs/core')
const {generateMasterKeys} = require('@burstjs/crypto')
const {prompt} = require('inquirer')
const chunk = require('lodash.chunk')
const {getSlotFee, calculateTotalFeeCosts} = require('./fees')

const ChunkSize = 10

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

const bulkSend = async ({host, recipients, message, maxSlots, isDryRun}) => {

  const api = composeApi(new ApiSettings(host));
  const totalMessages = recipients.length

  const totalCosts = calculateTotalFeeCosts(totalMessages, maxSlots)
  const minimumBlocksNeeded = Math.ceil(totalMessages/maxSlots)
  console.info('Used Host:', host)
  console.info(`You are about to send to ${totalMessages} accounts.`)
  console.info(`This will cost you approx. ${totalCosts.toString()}`)
  console.info(`Messages will at maximum occupy ${maxSlots} slots per Block`)
  console.info(`Message delivery needs at least ${minimumBlocksNeeded} blocks (approx. ${minimumBlocksNeeded * 4} minutes)`)
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
  const chunks = chunk(recipients, ChunkSize);
  let progress = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunkedRecipients = chunks[i];
    const batch = chunkedRecipients
      .map(recipientId => {
          progress += 1
          const fee = getSlotFee(progress % maxSlots)

          console.log('fee', fee)

          return isDryRun
            ? drySend()
            : api.message.sendMessage({
              recipientId,
              senderPublicKey: publicKey,
              senderPrivateKey: signPrivateKey,
              feePlanck: fee,
              message,
              messageIsText: true,
            })
        }
      )
    progress += batch.length
    await Promise.all(batch)
    console.info(`Sent ${progress} of ${totalMessages} messages`)
  }
}

module.exports = {
  bulkSend
}
