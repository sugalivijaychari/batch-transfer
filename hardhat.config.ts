import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bsctestnet: {
      url: "https://bsc-testnet.infura.io/v3/18acc84c89ef4013922ac232a373b278",
      chainId: 97,
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY_2 &&
        process.env.PRIVATE_KEY_3 &&
        process.env.PRIVATE_KEY_4
          ? [
              process.env.PRIVATE_KEY,
              process.env.PRIVATE_KEY_2,
              process.env.PRIVATE_KEY_3,
              process.env.PRIVATE_KEY_4,
            ]
          : [],
    },
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/18acc84c89ef4013922ac232a373b278",
      chainId: 137,
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY_2 &&
        process.env.PRIVATE_KEY_3 &&
        process.env.PRIVATE_KEY_4
          ? [
              process.env.PRIVATE_KEY,
              process.env.PRIVATE_KEY_2,
              process.env.PRIVATE_KEY_3,
              process.env.PRIVATE_KEY_4,
            ]
          : [],
    },
    polygonAmoy: {
      url: "https://polygon-amoy.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      chainId: 80001, // Assuming chainId for Amoy, replace with actual if different
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY_2 &&
        process.env.PRIVATE_KEY_3 &&
        process.env.PRIVATE_KEY_4
          ? [
              process.env.PRIVATE_KEY,
              process.env.PRIVATE_KEY_2,
              process.env.PRIVATE_KEY_3,
              process.env.PRIVATE_KEY_4,
            ]
          : [],
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.EXPLORER_KEY, // Replace with your actual API key
    },
  },
};

export default config;
