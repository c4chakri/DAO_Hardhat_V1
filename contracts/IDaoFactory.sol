// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./GovernanceToken.sol";
import "./Dao.sol";

interface IDAOFactory {
    struct DAOInfo {
        string name;
        address daoAddress;
        address daoCreator;
        address governanceAddress;
    }

    function daoId() external view returns (uint32);

    function daos(uint32 id) external view returns (
        string memory name,
        address daoAddress,
        address daoCreator,
        address governanceAddress
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
    ) external returns (address);

    function getAllDaos() external view returns (DAOInfo[] memory);
}
   