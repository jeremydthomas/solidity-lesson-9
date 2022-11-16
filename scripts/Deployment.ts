import { ethers } from "hardhat";
import { MyERC20__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const accounts = await ethers.getSigners();
  const erc20TokenFactory = new MyERC20__factory(accounts[0]);
  const erc20TokenContract = await erc20TokenFactory.deploy();
  await erc20TokenContract.deployed();
  console.log(`ERC20 Token deployed to: ${erc20TokenContract.address}`);
  const totalSupply = await erc20TokenContract.totalSupply();
  console.log(` The Total supply of this contract is: ${totalSupply}`);
  const balanceOfAccount0 = await erc20TokenContract.balanceOf(
    accounts[0].address
  );
  console.log(`Balance of account 0 is: ${balanceOfAccount0}`);

  const mintTx = await erc20TokenContract.mint(accounts[0].address, 10);
  await mintTx.wait();
  const transferTx = await erc20TokenContract.transfer(accounts[1].address, 1);
  await transferTx.wait();
  const balanceOfAccount0After = await erc20TokenContract.balanceOf(
    accounts[0].address
  );
  console.log(
    `Balance of account 0 is: ${balanceOfAccount0After} after the transfer`
  );

  const balanceOfAccount1 = await erc20TokenContract.balanceOf(
    accounts[1].address
  );
  console.log(`Balance of account 1 is: ${balanceOfAccount1}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
