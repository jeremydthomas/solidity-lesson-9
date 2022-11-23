import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const PROPOSALS = ["red", "green", "blue"];

function convertStringToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let i = 0; i < array.length; i++) {
    bytes32Array[i] = ethers.utils.formatBytes32String(array[i]);
  }
  return bytes32Array;
}

const TOKEN_CONTRACT = "0x18785Bd1006D5D6Bb2D3930b421cB3EB7ebd77e5";
const VOTING_POWER = 1;

async function main() {
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };
  const account = await ethers.getDefaultProvider("goerli", options);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(account);

  const tokenBallotContractFactory = new TokenizedBallot__factory(signer);
  const tokenBallotContract = await tokenBallotContractFactory.deploy(
    convertStringToBytes32(PROPOSALS),
    TOKEN_CONTRACT,
    VOTING_POWER,
    { gasLimit: 1000000000 }
  );
  await tokenBallotContract.deployed();

  console.log("TokenSale contract deployed to: ", tokenBallotContract.address);

  const erc20TokenContractFactory = new MyToken__factory(signer);
  const erc20TokenContract = erc20TokenContractFactory.attach(TOKEN_CONTRACT);
  const MINTER_ROLE = await erc20TokenContract.MINTER_ROLE();
  const grantRoleTx = await erc20TokenContract.grantRole(
    MINTER_ROLE,
    tokenBallotContract.address
  );
  await grantRoleTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
