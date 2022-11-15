// import { ethers } from "ethers";
// import { Ballot, Ballot__factory } from "../typechain-types";
// import * as dotenv from "dotenv";
// dotenv.config();

// const CONTRACT_ADDRESS = "0xb6430f17128E52c6b6Fe4Af4d5F622188CFEA01c";

// async function main() {
//   const providerOptions = {
//     alchemy: process.env.ALCHEMY_API_KEY,
//     infura: process.env.INFURA_API_KEY,
//     etherscan: process.env.ETHERSCAN_API_KEY,
//   };

//   const provider = ethers.getDefaultProvider("goerli", {
//     alchemy: process.env.ALCHEMY_API_KEY,
//     infura: process.env.INFURA_API_KEY,
//     etherscan: process.env.ETHERSCAN_API_KEY,
//   });
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
//   const signer = wallet.connect(provider);
//   const balanceBN = await signer.getBalance();

//   console.log(
//     `connected to the account of address ${
//       signer.address
//     } with balance ${balanceBN.toString()} \n This account has a balance of  ${balanceBN.toString()} Wei`
//   );

//   let ballotContract: Ballot;
//   const ballotContractFactory = new Ballot__factory(signer);
//   ballotContract = ballotContractFactory.attach(CONTRACT_ADDRESS);

//   const args = process.argv;
//   const params = args.slice(2);
//   const proposalIndex = params[0];

//   console.log("casting vote");
//   const proposals = await ballotContract.proposals;
//   for (let index = 0; index < proposals.length; index++) {
//     console.log(proposals[index]);
//   }
//   const castVoteReceipt = await proposals.wait();
//   console.log(`Transaction receipt: ${castVoteReceipt.transactionHash}`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
