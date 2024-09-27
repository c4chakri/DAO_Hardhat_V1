// src/components/DAOFactory.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, DAO_ABI } from '../constants';
import { getProvider, getSigner } from '../utils/web3Provider';
import DAOCard from './DAOCard'; // Import DAOCard component

const DAOFactory = () => {
  const [daoList, setDaoList] = useState([]);
  const [newDaoAddress, setNewDaoAddress] = useState(null); // Store the new DAO address

  const getDAOs = async () => {
    try {
      const provider = getProvider();
      const daoFactoryContract = new ethers.Contract(DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, provider);
      
      // Fetch all DAOs using getAllDaos()
      const daos = await daoFactoryContract.getAllDaos();
      console.log("DAOs:", daos);
      setDaoList(daos); // Update the DAO list state
    } catch (error) {
      console.error("Error fetching DAOs:", error);
    }
  };

  const createDAO = async () => {
    try {
      // Ensure the user is connected to MetaMask
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const daoFactoryContract = new ethers.Contract(DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, signer);
  
      const tx = await daoFactoryContract.createDAO(
        "My New DAO",
        "0xB92EF69165B3b379262872098e678A8515b315b5", // Replace with actual GovernanceToken address
        50, // Minimum Participation Percentage
        40, // Support Threshold
        86400, // Duration in seconds
        true, // Early execution allowed
        false, // Vote change allowed
        [[selectedAddress, ethers.parseEther("100")]], // Initial members
        false // Multi-signature DAO
      );
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      const rawaddress = receipt.logs[0].topics[2];
      const address = "0x" + rawaddress.slice(-40);
      console.log("DAO Created at address:", address);
      setNewDaoAddress(address); // Store the new DAO address
      return address;
    } catch (error) {
      console.error("Error creating DAO:", error);
    }
  };

  const loadDao = async () => {
    try {
      const daoAddr = await createDAO(); // Call createDAO to create a new DAO
      if (daoAddr) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const daoContract = new ethers.Contract(daoAddr, DAO_ABI, signer);
        const governanceTokenAddress = await daoContract.governanceTokenAddress();
        console.log("Governance Token Address:", governanceTokenAddress);
        
        // Optionally, fetch and log other DAO details here
      }
    } catch (error) {
      console.error("Error loading DAO:", error);
    }
  };

  useEffect(() => {
    getDAOs(); // Fetch DAOs on component mount
  }, []);

  return (
    <div>
      <h1>DAO Factory</h1>
      <button onClick={loadDao}>Create New DAO</button>
      <button onClick={getDAOs}>Get DAOs</button>
      <h2>All DAOs:</h2>
      <ul>
        {daoList.map((dao, index) => (
          <li key={index}>{dao}</li>
        ))}
      </ul>

      {newDaoAddress && (
        <DAOCard daoAddr={newDaoAddress} DAO_ABI={DAO_ABI} /> // Render the DAOCard with new DAO address
      )}
    </div>
  );
};

export default DAOFactory;
