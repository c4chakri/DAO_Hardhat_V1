import React, { useState, useEffect } from 'react';
import { getProvider, getDAOContract } from '../utils/web3';

const DAOInteraction = ({ daoAddress }) => {
  const [daoContract, setDaoContract] = useState(null);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
  /**
   * Initialize the DAO contract using the provided DAO address.
   * @function init
   * @async
   * @returns {undefined}
   */
    const init = async () => {
      const provider = await getProvider();
      const contract = await getDAOContract(daoAddress, provider);
      setDaoContract(contract);
      // getProposals();
    };
    init();
  }, [daoAddress]);
  console.log("daoAddress", daoAddress);
  

  const getProposals = async () => {
    if (!daoContract) {
      console.log("DAO contract is not initialized");
      return;
    }
  
    console.log("daoContract", daoContract);
  
    try {
      const proposalCount = await daoContract.proposalId(); // Assuming your DAO contract has a proposalCount() function
      console.log("Total Proposals:", proposalCount.toString());
  
      let proposalsArray = [];
  
      // Fetch each proposal by its index (starting from 1)
      for (let i = 1; i <= proposalCount; i++) {
        const proposal = await daoContract.proposals(i); // Fetch proposal by index
        console.log("Proposal:", proposal);
  
        const formattedProposal = {
          deployedProposalAddress: proposal[0],
          creator: proposal[1],
          title: proposal[2],
          id: proposal[3].toString() // Convert uint256 to string for readability
        };
  
        proposalsArray.push(formattedProposal);
      }
  
      // Set all fetched proposals in the state
      setProposals(proposalsArray);
  
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };
  
  // getProposals();

  const createProposal = async (proposalDescription) => {
    try {
      const title = "Increase Token Supply";
      const description = "This proposal aims to increase the token supply mint to 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
      const startTime = Math.floor(Date.now() / 1000);
      const duration = 604800; // Duration in seconds (1 week)
      const actionId = 0;
      const actions = [["0x05367ed7B7488139A03458F96a491f7e06b7D65d",0,"0xe742806a0000000000000000000000004b20993bc481177ec7e8f571cecae8a9e22c02db0000000000000000000000000000000000000000000000000000000000000384"]]



      const tx = await daoContract.createProposal(proposalDescription, description, startTime, duration,actionId, actions);
      await tx.wait();
      alert('Proposal created successfully!');
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  return (
    <div>
      <h2>Interact with DAO</h2>
      <input 
        type="text" 
        placeholder="Proposal Description" 
        onChange={(e) => createProposal(e.target.value)} 
      />
      <button onClick={() => createProposal()}>Create Proposal</button>
      <button onClick={() => getProposals()}>Get Proposals</button>
      <h3>Proposals</h3>
      {/* <ul>
        {proposals.map((proposal, index) => (
          <li key={index}>{proposal}</li>
        ))}
      </ul> */}

{
  proposals && proposals.length > 0 ? (
    proposals.map((proposal, index) => (
      <div key={index}>
        <p><strong>Proposal ID:</strong> {proposal.id}</p>
        <p><strong>Title:</strong> {proposal.title}</p>
        <p><strong>Creator:</strong> {proposal.creator}</p>
        <p><strong>Deployed Proposal Address:</strong> {proposal.deployedProposalAddress}</p>
      </div>
    ))
  ) : (
    <p>No proposals found.</p>
  )
}
    </div>
  );
};

export default DAOInteraction;
