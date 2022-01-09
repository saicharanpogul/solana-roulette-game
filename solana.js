import console from "color-log";
import web3 from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet", "confirmed")
);

export const airdrop = async (publicKey) => {
  try {
    const airdropSig = await connection.requestAirdrop(
      publicKey,
      2 * web3.LAMPORTS_PER_SOL
    );
    console.log.warn(
      `Airdropping 2 SOL to ${publicKey.toString().slice(0, 6)}...`
    );
    await connection.confirmTransaction(airdropSig);
    console.log.success(
      `Airdrop to ${publicKey.toString().slice(0, 6)} complete`
    );
  } catch (err) {
    console.log.error(err);
  }
};

export const balance = async (publicKey) => {
  try {
    return (await connection.getBalance(publicKey)) / web3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.log.error(error);
  }
};

export const transferSOL = async (from, to, amount) => {
  try {
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: new web3.PublicKey(from.publicKey.toString()),
        toPubkey: to,
        lamports: web3.LAMPORTS_PER_SOL * amount,
      })
    );
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
    );
    return signature;
  } catch (error) {
    console.log.error(error);
  }
};

export const treasuryWallet = web3.Keypair.fromSecretKey(
  Uint8Array.from(process.env.TREASURY_SECRET_KEY.split(","))
);

export const userWallet = web3.Keypair.fromSecretKey(
  Uint8Array.from(process.env.USER1_SECRET_KEY.split(","))
);
