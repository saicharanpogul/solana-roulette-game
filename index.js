import colorLog from "color-log";
import figlet from "figlet";
import inquirer from "inquirer";
import { getReturnAmount, totalAmtToBePaid, randomNumber } from "./helper.js";
import { balance, transferSOL, treasuryWallet, userWallet } from "./solana.js";
import chalk from "chalk";

figlet("Sol Stake", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  colorLog.log.success(data);
  const questions = [
    {
      type: "input",
      name: "stakeAmount",
      message: "Enter the amount you want to stake:",
      validate: function (value) {
        if (isNaN(value) === false && value > 0 && value < 2.5) {
          return true;
        }
        return "Please enter a number between 0 and 2.5";
      },
    },
    {
      type: "input",
      name: "ratio",
      message: "Enter the ratio you want to stake:",
      validate: function (value) {
        if (typeof value === "string" && value.length > 0) {
          const arr = value.split(":").map((str) => parseInt(str));
          if (arr.length === 2 && arr[0] === 1 && arr[1] > 0 && arr[1] < 3) {
            return true;
          }
        }
        return "Please enter valid ratio and less than 3x, e.g. 1:2, 1:2.5";
      },
    },
  ];

  const isReadyToPay = [
    {
      type: "confirm",
      name: "readyToPay",
      message: "Are you ready to pay? (Gas Fees: 0.000005 SOL approx)",
      validate: function (value) {
        if (value === true) {
          return true;
        }
        return false;
      },
    },
  ];

  const guessRandomNumber = {
    type: "input",
    name: "guess",
    message: "Please enter your guess number between 1 and 10:",
    validator: function (value) {
      if (isNaN(value) === false && value > 0 && value < 11) {
        return true;
      }
      return "Please enter a number between 1 and 10";
    },
  };

  console.log(chalk.yellowBright("The max biding amount is ＄2.5 SOL "));
  inquirer
    .prompt(questions)
    .then((answers) => {
      const { stakeAmount, ratio } = answers;
      const returnAmount = getReturnAmount(ratio);
      const totalAmtToBePaidIs = totalAmtToBePaid(stakeAmount, returnAmount);
      console.log(
        `You need to pay ${chalk.green(totalAmtToBePaidIs)} SOL to move forward`
      );
      inquirer.prompt(isReadyToPay).then(async (answers) => {
        const { readyToPay } = answers;
        if (readyToPay) {
          // transfer SOL to treasury from user
          colorLog.log.warn(`Transferring ${stakeAmount} SOL to treasury...`);
          const sig = await transferSOL(
            userWallet,
            treasuryWallet.publicKey,
            parseInt(stakeAmount)
          );
          colorLog.log.success("Transferring complete: " + sig);

          console.log(
            chalk.cyan(
              `You will get ${chalk.green(
                totalAmtToBePaidIs
              )} SOL back if you guess the correct number`
            )
          );
          const randomNumberIs = randomNumber(1, 10);
          // console.log(`The random number is ${chalk.green(randomNumberIs)}`);
          inquirer.prompt(guessRandomNumber).then(async (answers) => {
            const { guess } = answers;
            console.log(`The random number is ${chalk.green(randomNumberIs)}`);
            if (parseInt(guess) === randomNumberIs) {
              console.log(
                chalk.green(
                  `You guessed the correct number, you will get ${chalk.green(
                    totalAmtToBePaidIs
                  )} SOL back`
                )
              );

              // transfer winning SOL to user from treasury
              colorLog.log.warn(
                `Transferring ${totalAmtToBePaidIs} SOL to user...`
              );
              const sig = await transferSOL(
                treasuryWallet,
                userWallet.publicKey,
                totalAmtToBePaidIs
              );
              colorLog.log.success("Transferring complete: " + sig);
              colorLog.log.info(
                `You have ${await balance(userWallet.publicKey)} SOL`
              );
            } else {
              console.log(
                chalk.red(`You guessed the wrong number. Thanks for playing!`)
              );
            }
          });
        }
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        // Something else went wrong
        console.log("Something else went wrong");
      }
    });
});
