// src/components/ConnectWallet.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = ({ onConnect }) => {
  const [account, setAccount] = useState(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        onConnect(accounts[0]);
      } catch (error) {
        console.error("MetaMask connection error:", error);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask extension.');
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
      onConnect(accounts[0] || null);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [onConnect]);

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectMetaMask}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default ConnectWallet;
