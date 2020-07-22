const {FeeQuantPlanck, BurstValue} = require('@burstjs/util');
const {calculateTotalFeeCosts} = require("../fees");

describe('fees', () => {
  it('should calculate single message fee as expected', () => {
    let costsValue = calculateTotalFeeCosts(1, 10);
    expect(costsValue.getPlanck()).toBe(FeeQuantPlanck.toString())
  })

  it('should calculate two message fees as expected', () => {
    let costsValue = calculateTotalFeeCosts(2, 10);
    const expectedCosts = BurstValue.fromPlanck(FeeQuantPlanck.toString()).multiply(3)
    expect(costsValue.getPlanck()).toBe(expectedCosts.getPlanck())
  })

  it('should calculate message fees for entire block as expected', () => {
    let costsValue = calculateTotalFeeCosts(10, 10);
    const expectedCosts = BurstValue.fromPlanck(FeeQuantPlanck.toString()).multiply(55)
    expect(costsValue.getPlanck()).toBe(expectedCosts.getPlanck())
  })

  it('should calculate message fees for multiple integral blocks as expected', () => {
    let costsValue = calculateTotalFeeCosts(20, 10);
    const expectedCosts = BurstValue.fromPlanck(FeeQuantPlanck.toString()).multiply(55*2)
    expect(costsValue.getPlanck()).toBe(expectedCosts.getPlanck())
  })

  it('should calculate message fees for multiple blocks as expected', () => {
    let costsValue = calculateTotalFeeCosts(23, 10);
    const expectedCosts = BurstValue
      .fromPlanck(FeeQuantPlanck.toString())
      .multiply(55*2)
      .add(BurstValue.fromPlanck((FeeQuantPlanck * 6).toString()))
    expect(costsValue.getPlanck()).toBe(expectedCosts.getPlanck())
  })
})
