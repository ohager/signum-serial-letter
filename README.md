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

Before you can send data you need to prepare a json file to configure the Signum Node, the message and the recipient list.

Create a Json file, e.g. `my-message-info.json` with the following fields:

```json
{
  "host": "https://europe3.testnet.signum.network", // use the right host address
  "message": "<Your message here>", 
  "maxTx": 10,
  "recipients": [
    // add account ids or addresses here
  ]
}
```

Then run `signum-serial-letter -d ./my-message-info.json`

Keep in mind, that sending messages costs you SIGNA. 
So, better to test your serial letter on testnet before. 
You can/should even run a dry run, without actually sending the messages using the `--test` flag:

`signum-serial-letter -d ./my-message-info.json --test`

Happy Spamming!
