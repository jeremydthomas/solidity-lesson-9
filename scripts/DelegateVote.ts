import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = "0xb6430f17128E52c6b6Fe4Af4d5F622188CFEA01c";
const DELEGATE_ADDRESS = "0x162Bd1aBF0FaDdEee640fAd2c3a3dA6F015a6a3e";

async function main() {
  const providerOptions = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };

  const provider = ethers.getDefaultProvider("goerli", providerOptions);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();

  console.log(
    `connected to the account of address ${
      signer.address
    } with balance ${balanceBN.toString()} \n This account has a balance of  ${balanceBN.toString()} Wei`
  );

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = ballotContractFactory.attach(CONTRACT_ADDRESS);

  console.log("delegating vote");
  const delegateVoteTx = await ballotContract.delegate(DELEGATE_ADDRESS, {
    gasLimit: 210000,
  });
  const delegateVoteReceipt = await delegateVoteTx.wait();
  console.log(`Your vote has been delegated: ${delegateVoteReceipt}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
