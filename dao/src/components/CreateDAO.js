import React, { useState } from 'react';
import { getProvider, getFactoryContract } from '../utils/web3';
import { ethers } from 'ethers';
import DAOInteraction from './DAOInteraction';
const CreateDAO = () => {
  const [daoName, setDaoName] = useState('');
  const [daoAddress, setDaoAddress] = useState('');
  const createDAO = async () => {
    const provider = await getProvider();
    const factoryContract = await getFactoryContract(provider);
    
    // const tx = await daoFactoryContract.createDAO(
    //   name, // DAO name from the form
    //   "0xB92EF69165B3b379262872098e678A8515b315b5", // Replace with actual GovernanceToken address
    //   50, // Minimum Participation Percentage
    //   40, // Support Threshold
    //   86400, // Duration in seconds
    //   true, // Early execution allowed
    //   false, // Vote change allowed
    //   [[selectedAddress, ethers.parseEther("100")]], // Initial members
    //   false // Multi-signature DAO
    // );


    try {
      const tx = await factoryContract.createDAO(daoName,
        "0xB92EF69165B3b379262872098e678A8515b315b5", // Replace with actual GovernanceToken address
        50, // Minimum Participation Percentage
        40, // Support Threshold
        86400, // Duration in seconds
        true, // Early execution allowed
        false, // Vote change allowed
        [["0x744ffD0001f411D781B6df6B828C76d32B65076E", ethers.utils.parseEther("100")]], // Initial members
        false // Multi-signature DAO

      );

     const receipt = await tx.wait();
     console.log('Receipt:', receipt.logs[0].topics[2]);
     const daoAddress = "0x" + receipt.logs[0].topics[2].slice(-40);
     console.log('DAO Address:', daoAddress);
     setDaoAddress(daoAddress);
      alert('DAO created successfully!');
    } catch (error) {
      console.error('Error creating DAO:', error);
    }
  };

  return (
    <div>
      <h2>Create DAO</h2>
      <input 
        type="text" 
        value={daoName} 
        onChange={(e) => setDaoName(e.target.value)} 
        placeholder="DAO Name" 
      />
      <button onClick={createDAO}>Create DAO</button>
      {daoAddress && <DAOInteraction daoAddress={daoAddress} />}
    </div>
  );
};

export default CreateDAO;
