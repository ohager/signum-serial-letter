const {Amount} = require('@signumjs/util')

const calculateSendFee =  (message) => {
  const estimatedFeeFactor = Math.max(1, Math.ceil(message.length / 184));
  return Amount.fromSigna(0.01).multiply(estimatedFeeFactor)
}

const calculateTotalFeeCosts = (message, messageCount) => {
  return calculateSendFee(message).clone().multiply(messageCount);
}

module.exports = {
  calculateSendFee,
  calculateTotalFeeCosts,
}
