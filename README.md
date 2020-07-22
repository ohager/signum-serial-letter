# burst-serial-letter
A small tool to send Burstcoin messages in masses

## Installation

> You need Nodejs (Version >=14) installed

`npm i burst-serial-letter -g'

Now it should be available as CLI command, type:

`burst-serial-letter --version` 

## Usage 

The tools comes with its built-in help. 

Just type `burst-serial-letter -h`

Before you can send data you need to prepare a json file to set up
the Burst Node, the message and the recipient list.

Create a Json file, e.g. `my-message-info.json` with the following fields:

```json
{
  "host": "https://testnet-2.burst-alliance.org:6876", // use the right host address
  "message": "<Your message here>", 
  "maxSlots": 10,
  "recipients": [
    // add account ids or addresses here
  ]
}
```

Then run `burst-serial-letter -d ./my-message-info.json`

Keep in mind, that sending messages costs you BURST. 
So, better to test your serial letter on testnet before. 
You can/should even run a dry run, without actually sending the messages using the `--test` flag:

`burst-serial-letter -d ./my-message-info.json --test`

Happy Spamming!

## About Slot System

Burst uses a [slot-based prioritization mechanism](https://burstwiki.org/en/slot-based-transaction-fees/#slots) to determine which transactions have preference over others.
Here we use it to influence the delivery time of messages. If you are willing to pay higher fees, you can stuff more messages in one block (up to 1020), such that the messages will delivered faster.
In the json file you can adjust the `maxSlots` size. The higher the value the more messages will be stuffed into a block.

The following example shows how `maxSlots` affects costs and delivery times. 

__maxSlots = 5__
```
Loading ./messagingData.json...
Used Host: https://wallet.burst-alliance.org:8125
You are about to send to 237 accounts.
This will cost you approx. Ƀ 5.2038
Messages will at maximum occupy 5 slots per Block
Message delivery needs at least 48 blocks (approx. 192 minutes)
```

__maxSlots = 10__
```
Loading ./messagingData.json...
Used Host: https://wallet.burst-alliance.org:8125
You are about to send to 237 accounts.
This will cost you approx. Ƀ 9.50355
Messages will at maximum occupy 10 slots per Block
Message delivery needs at least 24 blocks (approx. 96 minutes)
```

__maxSlots = 50__
```
Loading ./messagingData.json...
Used Host: https://wallet.burst-alliance.org:8125
You are about to send to 237 accounts.
This will cost you approx. Ƀ 42.65205
Messages will at maximum occupy 50 slots per Block
Message delivery needs at least 5 blocks (approx. 20 minutes)
Dry Run is active - nothing will be sent!
```

__maxSlots = 100__
```
Loading ./messagingData.json...
Used Host: https://wallet.burst-alliance.org:8125
You are about to send to 237 accounts.
This will cost you approx. Ƀ 79.40205
Messages will at maximum occupy 100 slots per Block
Message delivery needs at least 3 blocks (approx. 12 minutes)
```

__maxSlots = 250__
```
Loading ./messagingData.json...
Used Host: https://wallet.burst-alliance.org:8125
You are about to send to 237 accounts.
This will cost you approx. Ƀ 207.29205
Messages will at maximum occupy 250 slots per Block
Message delivery needs at least 1 blocks (approx. 4 minutes)
```


   
> Keep in mind, that the given values are estimates only, as other transactions might have higher fees than yours, and though eventually pushes your messages to next block 
