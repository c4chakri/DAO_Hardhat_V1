// DAOCard.js
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const DAOCard = ({ daoAddr, DAO_ABI }) => {
  const [daoDetails, setDaoDetails] = useState({
    governanceTokenAddress: '',
    daoCreator: '',
    minimumParticipationPercentage: 0,
    supportThresholdPercentage: 0,
    minimumDuration: 0,
    earlyExecution: false,
    canVoteChange: false,
    isMultiSignDAO: false,
    proposalId: 0,
    membersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDaoDetails = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const daoContract = new ethers.Contract(daoAddr, DAO_ABI, signer);

        const governanceTokenAddress = await daoContract.governanceTokenAddress();
        const daoCreator = await daoContract.DaoCreator();
        const minimumParticipationPercentage =String( await daoContract.minimumParticipationPercentage());
        const supportThresholdPercentage = String(await daoContract.supportThresholdPercentage());
        const minimumDuration = String(await daoContract.minimumDuration());
        const earlyExecution = await daoContract.earlyExecution();
        const canVoteChange = await daoContract.canVoteChange();
        const isMultiSignDAO = await daoContract.isMultiSignDAO();
        const proposalId = String(await daoContract.proposalId());
        const membersCount = String(await daoContract.membersCount());

        setDaoDetails({
          governanceTokenAddress,
          daoCreator,
          minimumParticipationPercentage,
          supportThresholdPercentage,
          minimumDuration,
          earlyExecution,
          canVoteChange,
          isMultiSignDAO,
          proposalId,
          membersCount,
        });
      } catch (error) {
        console.error('Error fetching DAO details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDaoDetails();
  }, [daoAddr, DAO_ABI]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dao-card">
      <h2>DAO Details</h2>
      <div>
        <strong>Governance Token Address:</strong> {daoDetails.governanceTokenAddress}
      </div>
      <div>
        <strong>DAO Creator:</strong> {daoDetails.daoCreator}
      </div>
      <div>
        <strong>Minimum Participation Percentage:</strong> {daoDetails.minimumParticipationPercentage}%
      </div>
      <div>
        <strong>Support Threshold Percentage:</strong> {daoDetails.supportThresholdPercentage}%
      </div>
      <div>
        <strong>Minimum Duration:</strong> {daoDetails.minimumDuration} seconds
      </div>
      <div>
        <strong>Early Execution Allowed:</strong> {daoDetails.earlyExecution ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Vote Change Allowed:</strong> {daoDetails.canVoteChange ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Is Multi-Signature DAO:</strong> {daoDetails.isMultiSignDAO ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Proposal ID:</strong> {daoDetails.proposalId}
      </div>
      <div>
        <strong>Members Count:</strong> {daoDetails.membersCount}
      </div>
    </div>
  );
};

export default DAOCard;
