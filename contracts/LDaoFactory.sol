// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LDAOFactory {
    struct DAOInfo {
        string name;
        address daoAddress;
        address daoCreator;
        address governanceAddress;
    }

    function appendToFactory(
        mapping(uint256 => DAOInfo) storage daos,
        uint256 daoId,
        string memory _name,
        address _dao,
        address _governance
    ) internal {
        DAOInfo storage dao = daos[daoId];
        dao.name = _name;
        dao.daoAddress = _dao;
        dao.daoCreator = msg.sender;
        dao.governanceAddress = _governance;
    }

    function getAllDaos(mapping(uint256 => DAOInfo) storage daos, uint256 daoId) 
        internal 
        view 
        returns (DAOInfo[] memory) 
    {
        DAOInfo[] memory allDaos = new DAOInfo[](daoId);

        for (uint256 i = 0; i < daoId; i++) {
            allDaos[i] = daos[i];
        }

        return allDaos;
    }
}
