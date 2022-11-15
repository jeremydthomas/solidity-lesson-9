import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

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

  const args = process.argv;
  const params = args.slice(2);
  const contractAddress = params[0];
  const targetAddress = params[1];

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = ballotContractFactory.attach(contractAddress);

  const tx = await ballotContract.giveRightToVote(targetAddress);
  const receipt = await tx.wait();
  console.log(`Transaction receipt: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
