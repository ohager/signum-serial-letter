const {calculateTotalFeeCosts} = require("../fees");

describe('calculateTotalFeeCosts', () => {
  it('should calculate single message fee as expected - 1 receiver', () => {
    let costsValue = calculateTotalFeeCosts("Simple message", 1);
    expect(costsValue.getSigna()).toBe('0.01')
  })
  it('should calculate single message fee as expected - 5 receivers', () => {
    let costsValue = calculateTotalFeeCosts("Simple message", 5);
    expect(costsValue.getSigna()).toBe('0.05')
  })
  it('should calculate single message fee as expected - 1 receiver, 200 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(200), 1);
    expect(costsValue.getSigna()).toBe('0.02')
  })
  it('should calculate single message fee as expected - 5 receivers, 200 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(200), 5);
    expect(costsValue.getSigna()).toBe('0.1')
  })
  it('should calculate single message fee as expected - 1 receiver, 400 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(400), 1);
    expect(costsValue.getSigna()).toBe('0.03')
  })
  it('should calculate single message fee as expected - 5 receivers, 400 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(400), 5);
    expect(costsValue.getSigna()).toBe('0.15')
  })
  it('should calculate single message fee as expected - 1 receiver, 600 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(600), 1);
    expect(costsValue.getSigna()).toBe('0.04')
  })
  it('should calculate single message fee as expected - 5 receivers, 600 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(600), 5);
    expect(costsValue.getSigna()).toBe('0.2')
  })
  it('should calculate single message fee as expected - 1 receiver, 800 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(800), 1);
    expect(costsValue.getSigna()).toBe('0.05')
  })
  it('should calculate single message fee as expected - 5 receivers, 800 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(800), 5);
    expect(costsValue.getSigna()).toBe('0.25')
  })
  it('should calculate single message fee as expected - 1 receiver, 1000 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(1000), 1);
    expect(costsValue.getSigna()).toBe('0.06')
  })
  it('should calculate single message fee as expected - 5 receivers, 1000 bytes message', () => {
    let costsValue = calculateTotalFeeCosts("x".repeat(1000), 5);
    expect(costsValue.getSigna()).toBe('0.3')
  })
})
