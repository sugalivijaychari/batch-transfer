// ./ignition/modules/MyNFTModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyNFTModule", (m) => {
  const deployer = m.getAccount(0);
  const baseURI = "https://example.com/api/";

  // Deploy MyNFT contract with baseURI
  const myNFT = m.contract("MyNFT", [baseURI], { from: deployer });

  // Deploy TokenCheck contract, passing in MyNFT's address
  const tokenCheck = m.contract("TokenCheck", [myNFT], { from: deployer });

  return { myNFT, tokenCheck };
});
