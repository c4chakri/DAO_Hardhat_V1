# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npm i 
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
```


```shell
gaian@gaian:~/Gaian/DAO_Hardhat$ npx hardhat test


  DAO
    Deployment DAO
GovernanceToken Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
GovernanceToken Details: {
  name: 'GTV',
  symbol: 'GT',
  owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
}
      ✔ Should returns the Governance contract data (2181ms)
DAO Contract Details: {
  governanceTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  DaoCreator: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  minimumParticipationPercentage: '50',
  supportThresholdPercentage: '40',
  minimumDuration: '86400',
  earlyExecution: true,
  canVoteChange: false,
  isMultiSignDAO: false,
  proposalId: '0',
  membersCount: '2'
}
      ✔ should return DAO contract details (77ms)
      ✔ should add members in DAO
Balance of user3 0n
Actions [
  [
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    0,
    '0xe742806a0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc0000000000000000000000000000000000000000000000000000000000000032'
  ]
]
Current Proposal Id 0n
MINTING Proposal created................................
Current Proposal Id 1n
Proposal Address: 0xCafac3dD18aC6c6e92c921884f9E4176737C052c
Yes votes 200000000000000000000n
No votes 100000000000000000000n
Executed: true
Balance of user3 50n
      ✔ MINTING PROPOSAL : should create , vote and execute  (70ms)
      ✔ should deposit tokens in DAO (41ms)
      ✔ should deposit and  withdraw tokens from DAO (57ms)
Deposit Tokens 100n
Current Proposal Id 0n
WITHDRAWING proposal created...............................
Current Proposal Id 1n
Proposal Address: 0xCafac3dD18aC6c6e92c921884f9E4176737C052c
Yes votes 299999999999999999900n
No votes 0n
approved: true
Before execution of deposit Tokens ........... 100n
Execution of withdawing bal...... 50n
Executed : true
After execution of deposit Tokens........... 50n
      ✔ WITHDRAW PROPOSAL: should create a proposal for withdrawing tokens from DAO (125ms)
o1 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
id 1 0n
DAO 1 Contract Details: {
  governanceTokenAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  DaoCreator: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  minimumParticipationPercentage: '50',
  supportThresholdPercentage: '40',
  minimumDuration: '86400',
  earlyExecution: true,
  canVoteChange: false,
  isMultiSignDAO: false,
  proposalId: '0',
  membersCount: '2'
}
DAO 2 Contract Details: {
  governanceTokenAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  DaoCreator: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  minimumParticipationPercentage: '50',
  supportThresholdPercentage: '40',
  minimumDuration: '86400',
  earlyExecution: true,
  canVoteChange: false,
  isMultiSignDAO: false,
  proposalId: '0',
  membersCount: '2'
}
DAO 1 Proposal Id 0n
Current Proposal Id 0n
MINTING Proposal created DAO 1 Proposal 1................................
Current Proposal Id 1n
Proposal Address at......: 0xb14D33721D921fA72Eae56EfE9149caF7C7f2736
Yes votes 200000000000000000000n
No votes 100000000000000000000n
Executed: true
Balance of user3 50n
      ✔ DAO FACTORY : sholud intract with DAO Factory contract (191ms)


  8 passing (3s)
```
# DAO_Hardhat_V1
