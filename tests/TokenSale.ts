import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  TokenSale__factory,
  TokenSale,
  MyERC20__factory,
  MyERC20,
  MyERC721Token__factory,
  MyERC721Token,
} from "../typechain-types";

const TOKEN_ETH_RATIO = 1;
const NFT_PRICE = ethers.utils.parseEther("0.2");

describe("NFT Shop", async () => {
  let accounts: SignerWithAddress[];
  let tokenSaleContract: TokenSale;
  let paymentTokenContract: MyERC20;
  let nftTokenContract: MyERC721Token;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const erc20TokenFactory = new MyERC20__factory(accounts[0]);
    const erc721TokenFactory = new MyERC721Token__factory(accounts[0]);

    const tokenSaleContractFactory = new TokenSale__factory(accounts[0]);

    paymentTokenContract = await erc20TokenFactory.deploy();
    nftTokenContract = await erc721TokenFactory.deploy();

    await paymentTokenContract.deployed();
    await nftTokenContract.deployed();

    tokenSaleContract = await tokenSaleContractFactory.deploy(
      TOKEN_ETH_RATIO,
      NFT_PRICE,
      paymentTokenContract.address,
      nftTokenContract.address
    );

    await tokenSaleContract.deployed();
    const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE();
    const giveRoleTx1 = await paymentTokenContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    );
    await giveRoleTx1.wait();

    const giveRoleTx2 = await nftTokenContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    );
    await giveRoleTx2.wait();
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const ratio = await tokenSaleContract.ratio();
      expect(ratio).to.equal(TOKEN_ETH_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
      const ercTokenAddress = await tokenSaleContract.paymentToken();
      const erc20TokenFactory = new MyERC20__factory(accounts[0]);
      const erc20TokenContract = erc20TokenFactory.attach(ercTokenAddress);
      await expect(erc20TokenContract.totalSupply()).to.not.be.reverted;
      await expect(erc20TokenContract.balanceOf(accounts[0].address)).to.not.be
        .reverted;
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    const ETH_SENT = ethers.utils.parseEther("1");
    let balanceBefore: BigNumber;
    let gasCost: BigNumber;
    let balanceAfter: BigNumber;

    beforeEach(async () => {
      balanceBefore = await accounts[1].getBalance();

      const tx = await tokenSaleContract
        .connect(accounts[1])
        .purchaseTokens({ value: ETH_SENT });
      const receipt = await tx.wait();
      const gasUsage = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      gasCost = gasUsage.mul(gasPrice);
      balanceAfter = await accounts[1].getBalance();
    });

    it("charges the correct amount of ETH", async () => {
      const expectedBalance = balanceBefore.sub(ETH_SENT).sub(gasCost);
      const error = expectedBalance.sub(balanceAfter);
      expect(error).to.equal(0);
    });

    it("gives the correct amount of tokens", async () => {
      const balanceBN = await paymentTokenContract.balanceOf(
        accounts[1].address
      );
      expect(balanceBN).to.equal(ETH_SENT.div(TOKEN_ETH_RATIO));
    });

    describe("When a user burns an ERC20 at the Token contract", async () => {
      let gasCost: BigNumber;
      beforeEach(async () => {
        const allowTx = await paymentTokenContract
          .connect(accounts[1])
          .approve(tokenSaleContract.address, ETH_SENT.div(TOKEN_ETH_RATIO));
        const receiptAllow = await allowTx.wait();
        const gasUsageAllow = receiptAllow.gasUsed;
        const gasPriceAllow = receiptAllow.effectiveGasPrice;
        const burnTx = await tokenSaleContract
          .connect(accounts[1])
          .burnTokens(ETH_SENT.div(TOKEN_ETH_RATIO));
        const receiptBurn = await burnTx.wait();
        const gasUsageBurn = receiptBurn.gasUsed;
        const gasPriceBurn = receiptBurn.effectiveGasPrice;
        const gasCostAllow = gasUsageAllow.mul(gasPriceAllow);
        const gasCostBurn = gasUsageBurn.mul(gasPriceBurn);
        gasCost = gasCostAllow.add(gasCostBurn);
      });

      it("gives the correct amount of ETH", async () => {
        const balanceAfterBurn = await accounts[1].getBalance();
        const expectedBalance = balanceAfter.sub(gasCost).add(ETH_SENT);
        const error = expectedBalance.sub(balanceAfterBurn);
        expect(error).to.eq(0);
      });

      it("burns the correct amount of tokens", async () => {
        const balanceBN = await paymentTokenContract.balanceOf(
          accounts[1].address
        );
        expect(balanceBN).to.equal(0);
      });
    });

    describe("When a user purchase a NFT from the Shop contract", async () => {
      const NFT_ID = 42;
      let tokenBalanceBefore: BigNumber;

      beforeEach(async () => {
        tokenBalanceBefore = await paymentTokenContract.balanceOf(
          accounts[1].address
        );
        const allowTx = await paymentTokenContract
          .connect(accounts[1])
          .approve(tokenSaleContract.address, NFT_PRICE);
        await allowTx.wait();

        const purchaseTx = await tokenSaleContract
          .connect(accounts[1])
          .purchaseNFT(NFT_ID);
        await purchaseTx.wait();
      });
      it("charges the correct amount of tokens", async () => {
        const tokenBalanceAfter = await paymentTokenContract.balanceOf(
          accounts[1].address
        );
        const expectedTokenBalanceAfter = tokenBalanceBefore.sub(NFT_PRICE);
        expect(tokenBalanceAfter).to.equal(expectedTokenBalanceAfter);
      });
      it("gives the right NFT", async () => {
        const nftOwner = await nftTokenContract.ownerOf(NFT_ID);
        expect(nftOwner).to.equal(accounts[1].address);
      });

      it("updates the owner account correctly", async () => {
        throw new Error("Not implemented");
      });

      it("update the pool account correctly", async () => {
        throw new Error("Not implemented");
      });

      it("favors the pool with the rounding", async () => {
        throw new Error("Not implemented");
      });
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
