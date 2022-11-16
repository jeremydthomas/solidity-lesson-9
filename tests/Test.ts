import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC20, MyERC20__factory } from "../typechain-types";

const PROPOSALS = ["chocolate", "vanilla", "strawberry"];

function convertStringToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let i = 0; i < array.length; i++) {
    bytes32Array[i] = ethers.utils.formatBytes32String(array[i]);
  }
  return bytes32Array;
}

describe("basic tests for understanding ERC20", async () => {
  let accounts;
  let erc20TokenContract: MyERC20;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const erc20TokenFactory = new MyERC20__factory(accounts[0]);
    erc20TokenContract = await erc20TokenFactory.deploy();
    await erc20TokenContract.deployed();
  });

  it("should have zero total supply at deployment", async () => {
    const totalSupply = await erc20TokenContract.totalSupply();
    expect(totalSupply).to.equal(0);
  });

  it("triggers the transfer event with the address of the sender when sending transactions", async () => {
    const mintTx = await erc20TokenContract.mint(accounts[0].address, 10);
    await mintTx.wait();
    const transferTx = await erc20TokenContract.transfer(
      accounts[1].address,
      1
    );
    await transferTx.wait();
    expect(transferTx).to.emit(erc20TokenContract, "Transfer");
  });
});
