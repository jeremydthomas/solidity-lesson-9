import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };

  const provider = ethers.getDefaultProvider("goerli", options);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  console.log(`Your Wallet Balance is: ${balanceBN.toString()}`);

  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();

  console.log(`Contract deployed to: ${tokenContract.address}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
