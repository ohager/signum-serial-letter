/* global describe, it, expect */
const {loadCSVFile} = require("../loadCSVFile");
const {join} = require('path')
describe('loadCSVFile', () => {
  it('should load correct file - 3 receiver', () => {
    const recipients = loadCSVFile(join(__dirname, "./recipients.1.csv"));
    expect(recipients).toHaveLength(5)
    expect(recipients).toEqual([
      {
        "to": "TS-QAJA-QW5Y-SWVP-4RVP4",
        "msg": "some text",
        "signa": 2
      },
      {
        "to": "TS-QAJA-QW5Y-SWVP-4RVP4",
        "msg": "some text"
      },
      {
        "to": "16107620026796983538",
        "msg": "another text",
        "signa": 1
      },
      {
        "to": "16107620026796983538",
        "msg": "",
        "signa": 1
      },
      {
        "to": "16107620026796983538",
        "msg": ""
      }
    ])
  })
})
