require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
