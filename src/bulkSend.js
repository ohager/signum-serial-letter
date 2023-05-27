const {LedgerClientFactory} = require('@signumjs/core')
const {generateMasterKeys} = require('@signumjs/crypto')
const {prompt} = require('inquirer')
const chunk = require('lodash.chunk')
const {calculateSendFee, calculateTotalFeeCosts} = require('./fees')

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

const bulkSend = async ({host, recipients, message, maxTx, isDryRun}) => {

  const ledger = LedgerClientFactory.createClient({
    nodeHost: host
  });
  const totalMessages = recipients.length

  const totalCosts = calculateTotalFeeCosts(message, totalMessages)
  const minimumBlocksNeeded = Math.ceil(totalMessages / maxTx)
  console.info('Used Host:', host)
  console.info(`You are about to send to ${totalMessages} accounts.`)
  console.info(`This will cost you ${totalCosts.getSigna()} SIGNA`)
  console.info(`There will be at maximum ${maxTx} tx per block`)
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
  const sendFee = calculateSendFee(message)
  const chunks = chunk(recipients, ChunkSize);
  let progress = 0;
  for (const chunkedRecipients of chunks) {
    const batch = chunkedRecipients
      .map(recipientId =>
        isDryRun
          ? drySend()
          : ledger.message.sendMessage({
            recipientId,
            senderPublicKey: publicKey,
            senderPrivateKey: signPrivateKey,
            feePlanck: sendFee.getPlanck(),
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
