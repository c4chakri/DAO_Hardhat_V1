const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DAOV1Module", (m) => {
    // Initialize parameters for the DAO
    const _governanceTokenAddress = "0x413B3B8B1D02C7760d9d83993A15E14a09Ba8Bce";
    const _GovernanceTokenParams = {
        name: "MyGovernanceToken",
        symbol: "MGT",
        creator: "0x0000000000000000000000000000000000000000",
    };
    
    const _minimumParticipationPercentage = 50; // Set to 50 as per your previous input
    const _supportThresholdPercentage = 50; // Set to 50 as per your previous input
    const _minimumDurationForProposal = 50; // Duration in seconds
    const _earlyExecution = true;
    const _canVoteChange = false;
    
    const _daoMembers = [
        { memberAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", deposit: 200 },
        { memberAddress: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", deposit: 100 }
    ];
    
    const _isMultiSignDAO = false;

    // Deploy the DAOV1 contract
    const newDaoContract = m.contract("DAOV1", [
        _governanceTokenAddress,
        _GovernanceTokenParams,
        _minimumParticipationPercentage,
        _supportThresholdPercentage,
        _minimumDurationForProposal,
        _earlyExecution,
        _canVoteChange,
        _daoMembers,
        _isMultiSignDAO
    ]);

    return { newDaoContract };
});
