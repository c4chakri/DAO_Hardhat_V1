require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
    },
    Mobius: {
      url: "https://mobius-besu-rpc.gov-cloud.ai/",
      accounts: [`54ddf1f17f88df264b97ed7112cab703876d26e081990308a3381bfbf884578a`]
    }
  },
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "": ["ast"],
          "*": [
            "abi", 
            "metadata", 
            "devdoc", 
            "userdoc", 
            "storageLayout", 
            "evm.legacyAssembly", 
            "evm.bytecode", 
            "evm.deployedBytecode", 
            "evm.methodIdentifiers", 
            "evm.gasEstimates", 
            "evm.assembly"
          ]
        }
      }
    }
  }
};
