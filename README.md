# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

# Install dependencies

```
npm install
```

Try running some of the following tasks:

```shell
npx hardhat compile
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network bsctestnet
npx hardhat verify --network bsctestnet <MYNFT_CONTRACT_ADDRESS> "https://example-base-uri.com/api/"
npx hardhat verify --network bsctestnet <TOKEN_CHECK_CONTRACT_ADDRESS> <MYNFT_CONTRACT_ADDRESS>
```

# batch-transfer

## Make use of setApproval.ts to give approvals use below command:

```
npx hardhat run scripts/setApproval.ts --network bsctestnet
```

## Make use of interact script to do batch transfers, use below command:

```
npx hardhat run scripts/interact.ts --network bsctestnet
```

# Note to add environment variables before running the project:

export PRIVATE_KEY="0x867543............7865"
export PRIVATE_KEY_2="0x687543............7865"
export PRIVATE_KEY_3="0x926543............7865"
export PRIVATE_KEY_4="0x016543............7865"
export EXPLORER_KEY="KUYYTDGFGHHJJSAMPLEIY8TR56879YGF"
