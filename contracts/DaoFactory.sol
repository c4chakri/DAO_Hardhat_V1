// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Dao.sol";
import "./IDaoFactory.sol";
import "./gtDemo.sol";

contract DAOFactory is IDAOFactory {
    uint32 public daoId;
    mapping(uint32 => DAOInfo) public daos;
    event DAOCreated(
        uint32 daoId,
        address daoAddress,
        string daoName,
        address creator
    );

    function createDAO(
        string memory daoName,
        address governanceTokenAddress,
        uint8 minimumParticipationPercentage,
        uint8 supportThresholdPercentage,
        uint32 minimumDuration,
        bool earlyExecution,
        bool canVoteChange,
        DAO.DAOMember[] memory _daoMembers,
        bool isMultiSignDAO
    ) external returns (address) {
        // Increment daoId before creating the new DAO
        daoId++;

        DAO newDAO = new DAO(
            governanceTokenAddress,
            minimumParticipationPercentage,
            supportThresholdPercentage,
            minimumDuration,
            earlyExecution,
            canVoteChange,
            _daoMembers,
            isMultiSignDAO
        );

        // Store DAO information
        appendToFactory(daoName, address(newDAO), governanceTokenAddress);
        emit DAOCreated(daoId, address(newDAO), daoName, msg.sender);

        return address(newDAO);
    }

    function appendToFactory(
        string memory _name,
        address _dao,
        address _governance
    ) private {
        DAOInfo storage dao = daos[daoId]; // Use the incremented daoId
        dao.name = _name;
        dao.daoAddress = _dao;
        dao.daoCreator = msg.sender;
        dao.governanceAddress = _governance;
    }

    function getAllDaos() external view returns (DAOInfo[] memory) {
        uint32 currentDaoId = daoId;
        DAOInfo[] memory allDaos = new DAOInfo[](currentDaoId);

        for (uint32 i = 1; i <= currentDaoId; i++) {
            // Start from 1 if daoId is 1-indexed
            allDaos[i - 1] = daos[i]; // Adjust for zero-based indexing in the array
        }

        return allDaos;
    }
    
}
