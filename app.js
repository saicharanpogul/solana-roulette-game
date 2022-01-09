import console from "color-log";
import web3 from "@solana/web3.js";
import dotenv from "dotenv";
import { airdrop } from "./solana.js";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

// treasury account and balance
const treasuryWallet = web3.Keypair.fromSecretKey(
  Uint8Array.from(process.env.TREASURY_SECRET_KEY.split(","))
);
console.multi.keyValue(
  "TREASURY PUBLIC KEY",
  treasuryWallet.publicKey.toString()
);

const treasuryBalance = await connection.getBalance(treasuryWallet.publicKey);
console.multi.keyValue(
  "TREASURY BALANCE",
  parseInt(treasuryBalance) / web3.LAMPORTS_PER_SOL + " SOL"
);

// user1 account and balance
const user1Wallet = web3.Keypair.fromSecretKey(
  Uint8Array.from(process.env.USER1_SECRET_KEY.split(","))
);
console.multi.keyValue("USER1 PUBLIC KEY", user1Wallet.publicKey.toString());

const user1Balance = await connection.getBalance(user1Wallet.publicKey);
console.multi.keyValue(
  "USER1 BALANCE",
  parseInt(user1Balance) / web3.LAMPORTS_PER_SOL + " SOL"
);

// // user2 account and balance
// const user2Wallet = web3.Keypair.fromSecretKey(Uint8Array.from(process.env.USER2_SECRET_KEY.split(",")));
// console.multi.keyValue("USER2 PUBLIC KEY", user2Wallet.publicKey.toString())

// const user2Balance = (await connection.getBalance(user2Wallet.publicKey));
// console.multi.keyValue(
//   "USER2 BALANCE",
//   parseInt(user2Balance) / web3.LAMPORTS_PER_SOL + " SOL"
// );

// // user3 account and balance
// const user3Wallet = web3.Keypair.fromSecretKey(Uint8Array.from(process.env.USER3_SECRET_KEY.split(",")));
// console.multi.keyValue("USER3 PUBLIC KEY", user3Wallet.publicKey.toString())

// const user3Balance = (await connection.getBalance(user3Wallet.publicKey));
// console.multi.keyValue(
//   "USER3 BALANCE",
//   parseInt(user3Balance) / web3.LAMPORTS_PER_SOL + " SOL"
// );

// // user4 account and balance
// const user4Wallet = web3.Keypair.fromSecretKey(Uint8Array.from(process.env.USER4_SECRET_KEY.split(",")));
// console.multi.keyValue("USER4 PUBLIC KEY", user4Wallet.publicKey.toString())

// const user4Balance = (await connection.getBalance(user4Wallet.publicKey));
// console.multi.keyValue(
//   "USER4 BALANCE",
//   parseInt(user4Balance) / web3.LAMPORTS_PER_SOL + " SOL"
// );

// // user5 account and balance
// const user5Wallet = web3.Keypair.fromSecretKey(Uint8Array.from(process.env.USER5_SECRET_KEY.split(",")));
// console.multi.keyValue("USER5 PUBLIC KEY", user5Wallet.publicKey.toString())

// const user5Balance = (await connection.getBalance(user5Wallet.publicKey));
// console.multi.keyValue(
//   "USER5 BALANCE",
//   parseInt(user5Balance) / web3.LAMPORTS_PER_SOL + " SOL"
// );

// airdrop to 5 users
airdrop(user1Wallet.publicKey)
// airdrop(user2Wallet.publicKey)
// airdrop(user3Wallet.publicKey)
// airdrop(user4Wallet.publicKey)
// airdrop(user5Wallet.publicKey)
