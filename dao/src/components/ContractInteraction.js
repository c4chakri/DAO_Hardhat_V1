// src/ContractInteraction.js
import React, { useState } from "react";
import { ethers } from "ethers";
import abi from './daoFactoryABI.json'; // import your DAO contract ABI
import bytecode from './bytecode.json'; // import your DAO contract bytecode

const ContractInteraction = () => {
  const [daoAddress, setDaoAddress] = useState(null);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const deployContract = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Define contract factory using ABI and bytecode
        const factory = new ethers.ContractFactory(abi, bytecode, signer);

        // Customize constructor parameters for your DAO contract
        const governanceTokenAddress = "0x0000000000000000000000000000000000000000"; // replace with actual token address
        const tokenFactory = "0x327a13414869FEd5aFF56862929c9c831d5d5265"; // replace with actual token factory address
        const governanceTokenParams = {
          name: "MyGovernanceToken",
          symbol: "MGT",
          creator: await signer.getAddress(),
        };
        const minimumParticipationPercentage = 10;
        const supportThresholdPercentage = 60;
        const minimumDurationForProposal = 3600; // in seconds
        const earlyExecution = true;
        const canVoteChange = false;
        const daoMembers = [
          { memberAddress: await signer.getAddress(), deposit: 1000 },
        ]; // example DAO member
        const isMultiSignDAO = false;

        // Deploy the contract with constructor parameters
        const contract = await factory.deploy(
          governanceTokenAddress,
          tokenFactory,
          governanceTokenParams,
          minimumParticipationPercentage,
          supportThresholdPercentage,
          minimumDurationForProposal,
          earlyExecution,
          canVoteChange,
          daoMembers,
          isMultiSignDAO
        );

        setTxHash(contract.deployTransaction.hash);

        // Wait for the contract to be deployed
        await contract.deployed();

        setDaoAddress(contract.address);
        console.log("DAO Contract deployed at:", contract.address);
      } else {
        setError("MetaMask is not installed!");
      }
    } catch (err) {
        console.log(err);
        
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>DAO Contract Deployment</h2>
      <button onClick={deployContract}>Deploy DAO Contract</button>
      {txHash && <p>Transaction Hash: {txHash}</p>}
      {daoAddress && <p>Contract Address: {daoAddress}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ContractInteraction;
