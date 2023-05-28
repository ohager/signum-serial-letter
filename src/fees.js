const {Amount} = require('@signumjs/util')

const calculateSendFee =  (message) => {
  const estimatedFeeFactor = Math.max(1, Math.ceil(message.length / 184));
  return Amount.fromSigna(0.01).multiply(estimatedFeeFactor)
}

const calculateTotalFeeCosts = (recipients) => {
  return recipients.reduce((acc, r) => acc.add(calculateSendFee(r.msg || "")), Amount.Zero());
}

module.exports = {
  calculateSendFee,
  calculateTotalFeeCosts,
}
