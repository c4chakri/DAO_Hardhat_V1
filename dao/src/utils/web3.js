import { ethers } from 'ethers';
import DAOFactoryABI from '../abi/DAOfactory.json';
import DAOABI from '../abi/DAO.json';
import ProposalABI from '../abi/Proposal.json';

const FACTORY_ADDRESS = '0xe716F3287eBf0A7ED2836A7179071a887b0C91d9';

export const getProvider = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return provider;
  } else {
    console.error('Install MetaMask.');
  }
};

export const getFactoryContract = async (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, DAOFactoryABI, signer);
};

export const getDAOContract = async (daoAddress, provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(daoAddress, DAOABI, signer);
};

export const getProposalContract = async (proposalAddress, provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(proposalAddress, ProposalABI, signer);
};
