// src/components/GovernanceToken.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { GOVERNANCE_TOKEN_ABI } from '../constants';
import { getProvider, getSigner } from '../utils/web3Provider';

const GovernanceToken = ({ tokenAddress }) => {
  const [balance, setBalance] = useState(0);

  const getBalance = async (address) => {
    try {
      const provider = getProvider();
      const tokenContract = new ethers.Contract(tokenAddress, GOVERNANCE_TOKEN_ABI, provider);
      
      const bal = await tokenContract.balanceOf(address);
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const mintTokens = async (recipient, amount) => {
    try {
      const signer = getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, GOVERNANCE_TOKEN_ABI, signer);
      
      const tx = await tokenContract.mint(recipient, ethers.parseEther(amount));
      await tx.wait();
      console.log(`Minted ${amount} tokens to ${recipient}`);

      // Update balance
      getBalance(recipient);
    } catch (error) {
      console.error("Error minting tokens:", error);
    }
  };

  return (
    <div>
      <h1>Governance Token</h1>
      <button onClick={() => mintTokens("0xRecipientAddress", "10")}>
        Mint 10 Tokens
      </button>
      <div>
        Balance: {balance} GT
      </div>
    </div>
  );
};

export default GovernanceToken;
