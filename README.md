# signum-serial-letter
A small tool to send messages in masses on [Signum Blockchain](https://signum.network)

## Installation

> You need Nodejs (Version >=16) installed

`npm i signum-serial-letter -g`

Now it should be available as CLI command, type:

`signum-serial-letter --version` 

## Usage 

The tools come with its built-in help. 

Just type `signum-serial-letter -h`

Before you can send data you need to prepare a JSON file to configure the Signum Node, the message and the recipient list.

Create a JSON file, e.g. `my-message-info.json` with the following fields:

```json
{
  "host": "https://europe3.testnet.signum.network/",
  "maxTx": 10,
  "recipients": [
    {
      "to":  "c213e4144ba84af94aae2458308fae1f0cb083870c8f3012eea58147f3b09d4a", // pub key
      "msg": "Your text here",
      "signa": 20.12
    },
    {
      "to":  "16107620026796983538", // account id
      "signa": 10.12 // send signa only
    },
    {
      "to":  "TS-QAJA-QW5Y-SWVP-4RVP4", // account address
      "msg": "just a message -no money"
    }
    // add more
  ]
}
```

Instead of adding the recipients as JSON objects, it's possible to reference a CSV file with a list of recipients, messages and amounts.
The JSON of the `./my-message-info.json` would look like this 

```json
{
  "host": "https://europe3.testnet.signum.network/",
  "maxTx": 10,
  "recipients": "./recipients.example.csv" // loads from a CSV file
}
```
> The path of the CSV file can be absolute or relative the the current working directory

The CSV file is of the following format

`<account>,<message>,<signa>`  - where `<message>` or `<signa>` are optional, but at least one of the field must exist

Example:

```csv
TS-QAJA-QW5Y-SWVP-4RVP4,"some text",2.0
16107620026796983538,"another text",1.0
4382407931849532142,,1.0
7210b8941929030324540238450e985899989a7ad0267e0c76f668fde3b1016b,"only a message",
```

> Delimiter can be `,` or `;` - Double-Quotes `"` are optional - header is not allowed.

Then run `signum-serial-letter -d ./my-message-info.json`

Keep in mind, that sending messages costs you SIGNA. 
So, better to test your serial letter on testnet before. 
You can/should even run a dry run, without actually sending the messages using the `--test` flag:

`signum-serial-letter -d ./my-message-info.json --test`

Happy Spamming!
