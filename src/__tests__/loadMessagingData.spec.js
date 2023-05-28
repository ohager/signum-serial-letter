/* global describe, it, expect */
const {join} = require('path')
const {loadMessagingData} = require("../loadMessagingData");
describe('loadMessagingData', () => {
  it('should load correct file - json recipients', () => {
    const data = loadMessagingData(join(__dirname, "./testdata.json"));
    expect(data).toEqual({
      "host": "https://europe3.testnet.signum.network/",
      "txPerBlock": 10,
      "recipients": [
        {
          "to": "2402520554221019656",
          "msg": "just a message -no money"
        },
        {
          "to": "16107620026796983538",
          "signa": 10.12
        },
        {
          "to": "4382407931849532142"
        }
      ]
    })
  })
  it('should load correct file - csv file reference', () => {
    const data = loadMessagingData(join(__dirname, "./testdata-csv.json"));
    expect(data).toEqual({
      "host": "https://europe3.testnet.signum.network/",
      "txPerBlock": 10,
      "recipients": [
        {
          "to": "2402520554221019656",
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
