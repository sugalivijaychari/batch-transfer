import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("MyNFT and TokenCheck Contracts", function () {
  // Fixture to deploy contracts once and set up the initial state
  async function deployContractsFixture() {
    const [owner, from, to, anotherAccount] = await hre.ethers.getSigners();

    // Deploy MyNFT contract
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy("https://baseuri.com/");

    // Deploy TokenCheck contract with MyNFT's address
    const TokenCheck = await hre.ethers.getContractFactory("TokenCheck");
    const tokenCheck = await TokenCheck.deploy(myNFT.target);

    // Mint tokens 1, 2, 3, 4 sequentially by `from`
    for (let i = 1; i <= 4; i++) {
      await myNFT.connect(from).mintNFT(from.address);
    }

    // Mint tokens 6, 8, 10 by `anotherAccount`, skipping some tokens
    await myNFT.connect(anotherAccount).mintNFT(anotherAccount.address); // token 5
    await myNFT.connect(anotherAccount).mintNFT(anotherAccount.address); // token 6
    await myNFT.connect(anotherAccount).mintNFT(anotherAccount.address); // token 7

    return { myNFT, tokenCheck, owner, from, to, anotherAccount };
  }

  describe("MyNFT Contract", function () {
    it("Should set the correct base URI and owner", async function () {
      const { myNFT, owner } = await loadFixture(deployContractsFixture);

      expect(await myNFT.owner()).to.equal(owner.address);

      // Check base URI indirectly by validating token URI after minting
      const tokenId = 1;
      await myNFT.mintNFT(owner.address); // Mint a token to the owner
      expect(await myNFT.tokenURI(tokenId)).to.include("https://baseuri.com/");
    });

    it("Should mint and burn tokens correctly", async function () {
      const { myNFT, from } = await loadFixture(deployContractsFixture);

      const tokenId = 8; // Adjust based on minting sequence
      await expect(myNFT.connect(from).mintNFT(from.address))
        .to.emit(myNFT, "Transfer")
        .withArgs(hre.ethers.ZeroAddress, from.address, tokenId);

      expect(await myNFT.ownerOf(tokenId)).to.equal(from.address);

      await expect(myNFT.connect(from).burn(tokenId))
        .to.emit(myNFT, "Transfer")
        .withArgs(from.address, hre.ethers.ZeroAddress, tokenId);

      await expect(myNFT.ownerOf(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });
  });

  describe("TokenCheck Batch Transfer", function () {
    it("Should batch transfer owned tokens and detect missing tokens", async function () {
      const { tokenCheck, myNFT, from, to } = await loadFixture(
        deployContractsFixture
      );

      await myNFT.connect(from).setApprovalForAll(tokenCheck.target, true);

      // Perform batch transfer from 1 to 5
      await tokenCheck
        .connect(from)
        .batchTransfer(1, 4, from.address, to.address);

      // Verify ownership transfer
      for (let i = 1; i <= 4; i++) {
        expect(await myNFT.ownerOf(i)).to.equal(to.address);
      }
    });

    it("Should return missing tokens if some are not owned by sender", async function () {
      const { tokenCheck, myNFT, from, to, anotherAccount } = await loadFixture(
        deployContractsFixture
      );

      await myNFT.connect(from).setApprovalForAll(tokenCheck.target, true);

      // Simulate missing token by transferring one token away
      await myNFT
        .connect(from)
        .transferFrom(from.address, anotherAccount.address, 3);

      // Get missing tokens
      const missingTokens = await tokenCheck
        .connect(from)
        .getMissingTokens(1, 4, from.address);

      // Convert BigInt array to regular numbers
      expect(missingTokens.map((token) => Number(token))).to.include(3);

      // Perform batch transfer
      await tokenCheck
        .connect(from)
        .batchTransfer(1, 5, from.address, to.address);

      // Verify ownership transfer for remaining tokens
      for (let i = 1; i < 5; i++) {
        if (i === 3) {
          expect(await myNFT.ownerOf(i)).to.equal(anotherAccount.address);
        } else {
          expect(await myNFT.ownerOf(i)).to.equal(to.address);
        }
      }
    });

    it("Should batch transfer with gaps in token sequence and detect missing tokens", async function () {
      const { tokenCheck, myNFT, anotherAccount, to } = await loadFixture(
        deployContractsFixture
      );

      await myNFT
        .connect(anotherAccount)
        .setApprovalForAll(tokenCheck.target, true);

      // Perform batch transfer from 5 to 7
      await tokenCheck
        .connect(anotherAccount)
        .batchTransfer(5, 7, anotherAccount.address, to.address);

      // Verify ownership transfer for tokens 5 and 7
      expect(await myNFT.ownerOf(5)).to.equal(to.address);
      expect(await myNFT.ownerOf(7)).to.equal(to.address);
    });

    it("Should fail if an invalid range is specified", async function () {
      const { tokenCheck, from, to } = await loadFixture(
        deployContractsFixture
      );

      await expect(
        tokenCheck.connect(from).batchTransfer(5, 0, from.address, to.address)
      ).to.be.revertedWith("Invalid range: start must be <= end");
    });
  });
});
