import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const CONTACT_ADDRESS = "0xb6430f17128E52c6b6Fe4Af4d5F622188CFEA01c";

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
  ballotContract = ballotContractFactory.attach(CONTACT_ADDRESS);

  console.log("querying winner");
  const winningProposal = await ballotContract.winningProposal();
  const winnerName = await ballotContract.winnerName();
  console.log(
    `The winning proposal ${winningProposal} the winnername is ${ethers.utils.parseBytes32String(
      winnerName
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
