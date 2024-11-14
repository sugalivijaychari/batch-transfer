import { ethers } from "hardhat";

async function main() {
  // Replace these addresses with the actual deployed addresses from Ignition output
  const myNFTAddress = "0x89AeB1c350E218C8A0f41768094B344867666d60";
  const tokenCheckAddress = "0xB03c28c39978F6c4698c7fd0025AD0dFa270cfC2";

  // Get contract instances
  const myNFT = await ethers.getContractAt("MyNFT", myNFTAddress);
  const tokenCheck = await ethers.getContractAt(
    "TokenCheck",
    tokenCheckAddress
  );

  // Set up test accounts
  const [account1, account2, account3, account4] = await ethers.getSigners();

  // Mint 5 NFTs to account1
  for (let i = 0; i < 5; i++) {
    const mintTx = await myNFT.connect(account1).mintNFT(account1.address);
    await mintTx.wait();
  }
  console.log("Minted 5 NFTs to account1:", account1.address);

  // Transfer NFT ID 3 from account1 to account3
  const transferTx = await myNFT
    .connect(account1)
    .transferFrom(account1.address, account2.address, 3);
  await transferTx.wait();
  console.log("Transferred NFT ID 3 from account1 to account2");

  // Batch transfer NFTs from 6 to 8 from account2 to account3
  const batchTransferTx = await tokenCheck
    .connect(account1)
    .batchTransfer(1, 5, account1.address, account3.address);
  await batchTransferTx.wait();
  console.log(
    "Batch transferred NFTs 1 to 5 from account1 to account3. Note that NFT 4 is missed."
  );

  // Attempt to batch transfer NFTs from 1 to 5 from account3 to account4
  const batchTransferWithMissingTokensTx = await tokenCheck
    .connect(account3)
    .batchTransferWithMissingTokens(1, 5, account3.address, account4.address);
  await batchTransferWithMissingTokensTx.wait();
  console.log(
    "Batch transferred NFTs 1 to 5 from account3 to account4. Note that NFT 4 is missed."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
