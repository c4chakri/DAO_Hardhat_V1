
import React, { useState } from 'react';
import DAOFactory from './components/DAOFactory';
import GovernanceToken from './components/GovernanceToken';
import ConnectWallet from './components/ConnectWallet';

function App() {
  const [userAddress, setUserAddress] = useState(null);

  const handleConnect = (address) => {
    setUserAddress(address);
  };

  return (
    <div className="App">
      <ConnectWallet onConnect={handleConnect} />
      {userAddress && (
        <>
          <DAOFactory userAddress={userAddress} />
          <GovernanceToken userAddress={userAddress} tokenAddress="0xB92EF69165B3b379262872098e678A8515b315b5" />
        </>
      )}
    </div>
  );
}

export default App;
