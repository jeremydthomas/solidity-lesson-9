import { MyToken__factory } from "../typechain-types";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TEST_MINT_VALUE = ethers.utils.parseEther("10");

const CONTRACT_ADDRESS = "0x18785Bd1006D5D6Bb2D3930b421cB3EB7ebd77e5";
const JACOB_ADDRESS = "0x14436b97836b662aa32d902e2BDc4c2dB65Fed8A";
const IANS_ADDRESS = "0xEC6AaA2a0061C329C2864082E0d706f2D9664c49";
const JEREMYS_ADDRESS = "0x63b534BA7aD89A768ae11CABa79f24E46ddd9550";

async function main() {
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };
  const account = await ethers.getDefaultProvider("goerli", options);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(account);
  //const balanceBN = await signer.getBalance();
  //console.log(`Your Wallet Balance is: ${balanceBN.toString()}`);

  const contractFactory = new MyToken__factory(signer);
  const contract = contractFactory.attach(CONTRACT_ADDRESS);

  let ianTokenBalance = await contract.balanceOf(IANS_ADDRESS);
  console.log(
    `Before the mint, Ian has ${ianTokenBalance} decimals of balance`
  );
  let ianVotePower = await contract.getVotes(IANS_ADDRESS);
  console.log(`Before the mint, Jacob has ${ianVotePower} decimals of power`);
  let jacobTokenBalance = await contract.balanceOf(JACOB_ADDRESS);
  console.log(
    `Before the mint, Jacob has ${jacobTokenBalance} decimals of balance`
  );
  let jacobVotePower = await contract.getVotes(JACOB_ADDRESS);
  console.log(`Before the mint, Jacob has ${jacobVotePower} decimals of power`);
  let jeremyTokenBalance = await contract.balanceOf(JEREMYS_ADDRESS);
  console.log(
    `Before the mint, Jeremy has ${jeremyTokenBalance} decimals of balance`
  );
  let jeremyVotePower = await contract.getVotes(JEREMYS_ADDRESS);
  console.log(
    `Before the mint, Jeremy has ${jeremyVotePower} decimals of power`
  );

  const mintTx1 = await contract.mint(IANS_ADDRESS, TEST_MINT_VALUE);
  await mintTx1.wait();
  const mintTx2 = await contract.mint(JACOB_ADDRESS, TEST_MINT_VALUE);
  await mintTx2.wait();
  const mintTx3 = await contract.mint(JEREMYS_ADDRESS, TEST_MINT_VALUE);
  await mintTx3.wait();

  ianTokenBalance = await contract.balanceOf(IANS_ADDRESS);
  console.log(`After the mint, Ian has ${ianTokenBalance} decimals of balance`);
  ianVotePower = await contract.getVotes(IANS_ADDRESS);
  console.log(`After the mint, Ian has ${ianVotePower} decimals of power`);

  jacobTokenBalance = await contract.balanceOf(JACOB_ADDRESS);
  console.log(
    `After the mint, Jacob has ${ianTokenBalance} decimals of balance`
  );
  jacobVotePower = await contract.getVotes(JACOB_ADDRESS);
  console.log(`After the mint, Jacob has ${jacobVotePower} decimals of power`);

  jeremyTokenBalance = await contract.balanceOf(JEREMYS_ADDRESS);
  console.log(
    `After the mint, Jeremy has ${ianTokenBalance} decimals of balance`
  );
  jeremyVotePower = await contract.getVotes(JEREMYS_ADDRESS);
  console.log(
    `After the mint, Jeremy has ${jeremyVotePower} decimals of power`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
