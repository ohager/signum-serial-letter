/* global describe, it, expect */
const {join} = require('path')
const {loadMessagingData} = require("../loadMessagingData");
describe('loadMessagingData', () => {
  it('should load correct file - json recipients', () => {
    const data = loadMessagingData(join(__dirname, "./testdata.json"));
    expect(data).toEqual({
      "host": "https://europe3.testnet.signum.network/",
      "maxTx": 10,
      "recipients": [
        {
          "to": "TS-QAJA-QW5Y-SWVP-4RVP4",
          "msg": "just a message -no money"
        },
        {
          "to": "16107620026796983538",
          "signa": 10.12
        },
        {
          "to": "TS-XSRG-TG5D-4S9B-5JDNT"
        }
      ]
    })
  })
  it('should load correct file - csv file reference', () => {
    const data = loadMessagingData(join(__dirname, "./testdata-csv.json"));
    expect(data).toEqual({
      "host": "https://europe3.testnet.signum.network/",
      "maxTx": 10,
      "recipients": [
        {
          "to": "TS-QAJA-QW5Y-SWVP-4RVP4",
          "msg": "some text"
        },
        {
          "to": "16107620026796983538",
          "msg": ""
        }
      ]
    })
  })
  it('should throw validation error for invalid file', () => {
    expect(() => loadMessagingData(join(__dirname, "./testdata-invalid.json"))).toThrow("")
  })
})
