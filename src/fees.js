const {BurstValue} = require('@burstjs/util')
const {FeeQuantPlanck} = require('@burstjs/util');

const getSlotFee = slotIndex => FeeQuantPlanck * slotIndex

const calculateTotalFeeCosts = (messageCount, slotCount) => {

  const blockCount = Math.floor(messageCount / slotCount)
  const remainingSlots = messageCount % slotCount

  const seriesSum = n => (n*(n+1))/2

  const feePerBlock = blockCount > 0
    ? BurstValue.fromPlanck(FeeQuantPlanck.toString()).multiply(seriesSum(slotCount))
    : BurstValue.fromPlanck('0');

  const remainingFee = BurstValue.fromPlanck(FeeQuantPlanck.toString()).multiply(seriesSum(remainingSlots));

  return feePerBlock
    .multiply(blockCount)
    .add(remainingFee)
}

module.exports = {
  calculateTotalFeeCosts,
  getSlotFee
}
