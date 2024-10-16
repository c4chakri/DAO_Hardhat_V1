
// import React, { useState } from 'react';
// import DAOFactory from './components/DAOFactory';
// // import GovernanceToken from './components/GovernanceToken';
// import ConnectWallet from './components/ConnectWallet';
// import ContractInteraction from './components/ContractInteraction';
// function App() {
//   const [userAddress, setUserAddress] = useState(null);

//   const handleConnect = (address) => {
//     setUserAddress(address);
//   };

//   return (
//     <div className="App">
//       <ConnectWallet onConnect={handleConnect} />
//       {userAddress && (
//         <>
//           <div className="App">
//             <h1>DAO Contract Deployment with Besu and MetaMask</h1>
//             {/* <ContractInteraction /> */}
//             <DAOFactory/>
//           </div>
//           {/* <DAOFactory userAddress={userAddress} /> */}
//           {/* <GovernanceToken userAddress={userAddress} tokenAddress="0xB92EF69165B3b379262872098e678A8515b315b5" /> */}
//         </>
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import CreateDAO from './components/CreateDAO';
import DAOInteraction from './components/DAOInteraction';
import Proposal from './components/Proposal';
const App = () => {
  const [daoAddress, setDaoAddress] = useState('');
  const [proposalAddress, setProposalAddress] = useState('');
  return (
    <div className="App">
      <CreateDAO />
      
     <div>
        <h2>Enter DAO Address to Interact:</h2>
        <input 
          type="text" 
          value={daoAddress} 
          onChange={(e) => setDaoAddress(e.target.value)} 
          placeholder="DAO Address" 
        />
        {daoAddress && <DAOInteraction daoAddress={daoAddress} />}
      </div> 

      <div>
        <h2> Enter Proposal address</h2>
        <input type="text"
          value={proposalAddress}
          onChange={(e) => setProposalAddress(e.target.value)}
          placeholder="Proposal Address"
        />
        {proposalAddress && <Proposal proposalAddress={proposalAddress} />}
        
      </div>
    </div>
  );
};

export default App;
