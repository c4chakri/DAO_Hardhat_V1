// src/components/DAOFactory.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, DAO_ABI } from '../constants';
import DAOCard from './DAOCard';

const DAOFactory = () => {
  const [daoName, setDaoName] = useState('');
  const [daoList, setDaoList] = useState([]);
  const [newDaoAddress, setNewDaoAddress] = useState(null);
  const handleInputChange = (e) => {
    setDaoName(e.target.value);
  };
  useEffect(() => {
    fetchAllDaos();
  }, []);

  
  const getProviderAndSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const getDao = async (daoId, daoFactoryContract) => {
    try {
      const dao = await daoFactoryContract.daos(daoId);
      return dao;
    } catch (error) {
      console.error(`Error fetching DAO with ID ${daoId}:`, error);
    }
  };

  const fetchAllDaos = async () => {
    try {
      const { signer } = await getProviderAndSigner();
      const daoFactoryContract = new ethers.Contract(DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, signer);

      const daoCount = await daoFactoryContract.daoId(); // Get total DAO count
      console.log("DAO count:", daoCount);

      const daos = [];
      for (let i = 1; i <= daoCount; i++) {
        const dao = await getDao(i, daoFactoryContract);
        console.log("one dao", dao);

        daos.push(dao);
      }
      setDaoList(daos);
    } catch (error) {
      console.error("Error fetching all DAOs:", error);
    }
  };

  const createDAO = async (name) => {
    try {
      const { signer } = await getProviderAndSigner();
      const daoFactoryContract = new ethers.Contract(DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, signer);

      // Ensure the user is connected to MetaMask
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Call createDAO function with the name from the form
      const tx = await daoFactoryContract.createDAO(
        name, // DAO name from the form
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
      console.log("DAO created:", receipt);

      const rawAddress = receipt.logs[0].topics[2];
      const daoAddress = "0x" + rawAddress.slice(-40);

      console.log("DAO Created at address:", daoAddress);
      setNewDaoAddress(daoAddress); // Store the new DAO address
      return daoAddress;
    } catch (error) {
      console.error("Error creating DAO:", error);
    }
  };

  const loadDao = async (e) => {
    e.preventDefault();
    try {
      const daoAddress = await await createDAO(daoName);
      setDaoName('');
      if (daoAddress) {
        const { signer } = await getProviderAndSigner();
        const daoContract = new ethers.Contract(daoAddress, DAO_ABI, signer);

        const governanceTokenAddress = await daoContract.governanceTokenAddress();
        console.log("Governance Token Address:", governanceTokenAddress);

      }
    } catch (error) {
      console.error("Error loading DAO:", error);
    }
  };

  return (
    <div>
      <h1>DAO Factory</h1>
      <form onSubmit={loadDao}>
        <label>
          Name:
          <input type="text" value={daoName} onChange={handleInputChange} placeholder='DAO Name' />
        </label>
        <input type="submit" value="create Dao" />
      </form>

      {/* <button onClick={loadDao}>Create New DAO</button> */}

      <div className="dao-list">
        {daoList.slice().reverse().map((dao, index) => (
          <DAOCard
            key={index}
            daoName={dao[0]}
            daoAddress={dao[1]} 
          />
        ))}
      </div>

      {newDaoAddress && (
        <DAOCard daoName="My New DAO" daoAddress={newDaoAddress} /> 
      )}
    </div>
  );
};

export default DAOFactory;
