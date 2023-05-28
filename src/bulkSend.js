const {LedgerClientFactory, AttachmentMessage} = require('@signumjs/core')
const {generateMasterKeys} = require('@signumjs/crypto')
const {prompt} = require('inquirer')
const chunk = require('lodash.chunk')
const {calculateSendFee, calculateTotalFeeCosts} = require('./fees')
const {Amount} = require("@signumjs/util");

const ChunkSize = 10

const askForPassphrase = async () => prompt([
  {
    type: 'password',
    name: 'passphrase',
    message: 'Enter your passphrase to confirm (Leave empty to abort)',
    default: ''
  }
])

const drySend = () => Promise.resolve()

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
  const chunks = chunk(recipients, ChunkSize);
  let chunkCount = 0
  let progress = 0;
  let referencedTransactionFullHash = ""
  for (const chunkedRecipients of chunks) {
    const batch = chunkedRecipients
      .filter(recipient => recipient.msg || recipient.signa)
      .map(recipient => {
          if (isDryRun) {
            return drySend()
          }
          const message = recipient.msg || ""
          const sendFee = calculateSendFee(message)
          const amountToSend = Amount.fromSigna(recipient.signa || "0")
          if (amountToSend.equals(Amount.Zero()) && message) {
            return ledger.message.sendMessage({
              recipientId: recipient.to,
              senderPublicKey: publicKey,
              senderPrivateKey: signPrivateKey,
              feePlanck: sendFee.getPlanck(),
              message,
              messageIsText: true,
              referencedTransactionFullHash
            })
          }

          if (amountToSend.greater(Amount.Zero())) {
            const attachment = message ? new AttachmentMessage({
              message,
              messageIsText: true
            }) : undefined

            return ledger.transaction.sendAmountToSingleRecipient({
              recipientId: recipient.to,
              senderPublicKey: publicKey,
              senderPrivateKey: signPrivateKey,
              feePlanck: sendFee.getPlanck(),
              amountPlanck: amountToSend.getPlanck(),
              attachment,
              referencedTransactionFullHash
            })
          }

          return drySend()
        }
      )
    progress += batch.length
    const pendingTransactions = await Promise.all(batch)

    // to chain transactions in blocks, we get the last successful submitted transactions fullHash
    // that way next pending transaction will be executed only when previous tx were confirmed by the network
    const lastPendingTransactionIndex = pendingTransactions.lastIndexOf( tx => tx.fullHash)
    if(lastPendingTransactionIndex !== -1){
      referencedTransactionFullHash = pendingTransactions[lastPendingTransactionIndex]
    }
    console.info(`[Chunk ${++chunkCount}]: Sent ${progress} of ${totalMessages} messages`)
  }
}

module.exports = {
  bulkSend
}
