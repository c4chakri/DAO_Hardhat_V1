// src/constants.js
import daoFactoryAbi  from './contracts/DaoFactory.sol/DAOFactory.json';
import governanceTokenAbi from './contracts/GovernanceToken.sol/GovernanceToken.json';
import proposalAbi  from './contracts/Proposal.sol/Proposal.json';
import daoAbi  from './contracts/Dao.sol/DAO.json';
export const DAO_FACTORY_ADDRESS = "0xe716F3287eBf0A7ED2836A7179071a887b0C91d9";  // Replace with your deployed DAOFactory contract address
export const DAO_FACTORY_ABI = daoFactoryAbi.abi;
export const DAO_ABI = daoAbi.abi;
export const GOVERNANCE_TOKEN_ABI = governanceTokenAbi.abi;
export const PROPOSAL_ABI = proposalAbi.abi;
