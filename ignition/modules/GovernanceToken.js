const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GovernanceTokenModule", (m) => {
  const name = "GTV";
  const symbol = "GT";
  const councilAddr = "0xcd801F16F87841444040b2F2A93bb9235053e00c"; // Use the new council address
  const decimals = 10;

  const actions = {
    canMint: true,
    canBurn: true,
    canPause: false,
    canStake: true,
    canTransfer: true,
    canChangeOwner: false,
  };

  // Deploy the GovernanceToken contract
  const newGtContract = m.contract("GovernanceToken", [name, symbol, councilAddr, decimals, actions]);

  return { newGtContract };
});
