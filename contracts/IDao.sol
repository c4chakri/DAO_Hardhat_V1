// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IDAO {

    struct ProposalInfo {
        address deployedProposalAddress;
        address creator;
        string title;
        uint256 id;
    }
   struct DAOMember {
        address memberAddress;
        uint256 deposit;
    }
    function getAllProposals() external view returns (ProposalInfo[] memory);
    function depositToDAOTreasury(uint256 amount) external payable ;
    function withdrawFromDAOTreasury(uint256 amount) external ;
    
}