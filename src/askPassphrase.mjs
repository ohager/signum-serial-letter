/**
 * Just a helper function to ask for the account id/address
 */
import * as inquirer from "inquirer";

function askSendInformation() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'passphrase',
        message: 'Please enter your passphrase?'
      }
    ])
}
