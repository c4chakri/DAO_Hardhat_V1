// src/utils/web3Provider.js
import { ethers } from 'ethers';

export const getProvider = () => {
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_INFURA_URL);
  console.log("Provider:", provider);
  
  return provider;
};

export const getSigner = () => {
  const provider = getProvider();
  const signer = new ethers.Wallet("54ddf1f17f88df264b97ed7112cab703876d26e081990308a3381bfbf884578a", provider);
  console.log("Signer:", signer);
  
  return signer;
};
