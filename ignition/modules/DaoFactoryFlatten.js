const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("DaoFactory_v2Module", (m) => {


    const lock = m.contract("DAOFactory_v2", [], { gasLimit: 6000000 }); // Adjust gas limit if needed

    return { lock };
});
