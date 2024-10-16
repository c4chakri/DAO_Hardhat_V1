const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("DaoFactoryModule", (m) => {


  const lock = m.contract("DAOFactory");

  return { lock };
});
