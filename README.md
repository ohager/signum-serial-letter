![npm](https://img.shields.io/npm/v/signum-serial-letter)

# signum-serial-letter
A small tool to send messages and amount in masses on [Signum Blockchain](https://signum.network)

## Installation

> You need Nodejs (Version >=16) installed

`npm i signum-serial-letter -g`

Now it should be available as CLI command, type:

`signum-serial-letter --version` 

## Usage 

The tools come with its built-in help. 

Just type `signum-serial-letter -h`

--------------
### Quick Start

Create a JSON file according to the [JSON File Format](#json-file-format)

Run `signum-serial-letter -d ./my-data.json`


#### Test Run 
Keep in mind, that sending messages costs you SIGNA.
So, better to test your serial letter on testnet before.
You can/should even run a dry run, without actually sending the messages using the `--test`/`-t` flag:

`signum-serial-letter -d ./my-data.json -t` or `signum-serial-letter --data ./my-data.json --test` 


------------


### JSON File Format

Before you can send data you need to prepare a JSON file to configure the Signum Node, the message and the recipient list.

Create a JSON file, e.g. `my-message-info.json` with the following fields:

```json
{
  "host": "http://localhost:8125", // node to use, ideally local node!
  "txPerBlock": 100, // how many transactions per block
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
      "to":  "S-QAJA-QW5Y-SWVP-4RVP4", // account address
      "msg": "just a message -no money"
    }
    // add more
  ]
}
```

> [Here is an example file](./data.example.json)


Instead of adding the recipients as JSON objects, it's possible to reference a CSV file with a list of recipients, messages and amounts.
The JSON of the `./my-message-info.json` would look like this 

```json
{
  "host": "http://localhost:8125",
  "txPerBlock": 100,
  "recipients": "./recipients.example.csv" // loads from a CSV file
}
```
> The path of the CSV file can be absolute or relative the the current working directory

### CSV Recipient File Format

The CSV file is of the following format

`<account>,<message>,<signa>`  - where `<message>` or `<signa>` are optional, but at least one of the field must exist

Example:

```csv
S-QAJA-QW5Y-SWVP-4RVP4,"some text",2.0
16107620026796983538,"another text",1.0
4382407931849532142,,1.0
7210b8941929030324540238450e985899989a7ad0267e0c76f668fde3b1016b,"only a message",
```

> Delimiter can be `,` or `;` - Double-Quotes `"` are optional - header is not allowed.

> Here is an [example JSON file](./data-csv.example.json) and [example CSV file](./recipients.example.csv)

### Chunked Sending

In case you want to send hundreds/thousands of messages you may up ending filling entire blocks just by your transactions. 
In that case it's possible to send messages in chunks/batches per block. The parameter `txPerBlock` determines 
how many transactions shall be executed per block. As an example, you can set `txPerBlock` to 100 and send to 1000 accounts. 
All transactions will be pushed to the nodes _mempool_, but by using the `referencedTransactionFullHash` feature from Signum the
effective submission will be split into chunks and subsequently sent over the next 10 blocks. 
