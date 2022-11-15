import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const providerOptions = {
  alchemy: process.env.ALCHEMY_API_KEY,
  infura: process.env.INFURA_API_KEY,
  etherscan: process.env.ETHERSCAN_API_KEY,
};

function convertStringToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let i = 0; i < array.length; i++) {
    bytes32Array[i] = ethers.utils.formatBytes32String(array[i]);
  }
  return bytes32Array;
}

async function main() {
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
  const proposals = args.slice(2);

  if (proposals.length <= 0) throw new Error("Not enough arguments");
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  let ballotContract: Ballot;

  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = await ballotContractFactory.deploy(
    convertStringToBytes32(proposals)
  );

  await ballotContract.deployed();
  console.log(`The contract has been deployed at ${ballotContract.address}`);
  const chairperson = await ballotContract.chairperson();
  console.log(`The chairperson for this ballot is ${chairperson}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
