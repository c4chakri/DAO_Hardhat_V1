import React, { useState, useEffect } from 'react';
import { getProvider, getProposalContract } from '../utils/web3';

const Proposal = ({ proposalAddress }) => {
  const [proposalContract, setProposalContract] = useState(null);
  const [votingStatus, setVotingStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      const contract = await getProposalContract(proposalAddress, provider);
      setProposalContract(contract);
    };
    init();
  }, [proposalAddress]);

  const voteOnProposal = async (vote) => {
    try {
      const tx = await proposalContract.vote(vote);
      await tx.wait();
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };

  return (
    <div>
      <h2>Proposal</h2>
      <p>Current Voting Status: {votingStatus}</p>
      <button onClick={() => voteOnProposal(1)}>Vote Yes</button>
      <button onClick={() => voteOnProposal(2)}>Vote No</button>
    </div>
  );
};

export default Proposal;
