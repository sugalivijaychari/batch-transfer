import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://bsc-testnet.infura.io/v3/18acc84c89ef4013922ac232a373b278"
  );

  // Set up the wallet with private key 1 from .env
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_3 || "", provider);

  // Replace with the deployed contract address and ABI
  const contractAddress = "0x89AeB1c350E218C8A0f41768094B344867666d60"; // Replace with your actual contract address
  const contractABI = [
    "function setApprovalForAll(address operator, bool approved) external",
  ]; // Replace with your actual ABI

  // Connect to the contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Set the operator address and approval status
  const operator = "0xB03c28c39978F6c4698c7fd0025AD0dFa270cfC2"; // Replace with the address to approve
  const approved = true;

  // Perform setApprovalForAll
  console.log(`Setting approval for operator: ${operator}`);
  const tx = await contract.setApprovalForAll(operator, approved);
  console.log("Transaction sent. Waiting for confirmation...");

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
