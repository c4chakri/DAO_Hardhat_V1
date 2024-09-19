const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DAO", function () {
    async function DeployGovernanceTokenFixture() {
        const [councilAddr, user1] = await ethers.getSigners();
        const name = "GTV";
        const symbol = "GT";
        const initialAddress = councilAddr.address; // Use `.address`
        const decimals = 10;

        const actions = {
            canMint: true,
            canBurn: true,
            canPause: false,
            canStake: true,
            canTransfer: true,
            canChangeOwner: false,
        };

        const gt = await ethers.getContractFactory("GovernanceToken");
        const gtContract = await gt.deploy(name, symbol, initialAddress, decimals, actions);

        console.log("GovernanceToken Address:", await gtContract.getAddress());

        return { gtContract };
    }

    async function DeployDAOFixture() {
        const { gtContract } = await loadFixture(DeployGovernanceTokenFixture);

        const [addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const governanceTokenAddress = await gtContract.getAddress(); // Use `.address`
        const minimumParticipationPercentage = "50";  // String format
        const supportThresholdPercentage = "40";  // String format
        const minimumDurationForProposal = "86400";  // String format (seconds)
        const earlyExecution = true;
        const canVoteChange = false;
        const isMultiSignDAO = false;

        const daoMembers = [
            [await addr1.getAddress(), ethers.parseEther("100")],
            [await addr2.getAddress(), ethers.parseEther("200")]
        ];

        const dao = await ethers.getContractFactory("DAO");
        const daoContract = await dao.deploy(
            governanceTokenAddress,
            minimumParticipationPercentage,
            supportThresholdPercentage,
            minimumDurationForProposal,
            earlyExecution,
            canVoteChange,
            daoMembers,
            isMultiSignDAO
        );



        return { daoContract, addr1, addr2, addr3, addr4 };
    }
    async function createMintAction(governanceTokenAddress, to, amount) {
        // Define the ABI for the mint function
        const abi = [
            "function mintSupply(address to, uint256 _amount)"
        ];

        // Create an interface for encoding the function call
        const iface = new ethers.Interface(abi);

        // Encode the function call
        const mintSupplyEncoded = iface.encodeFunctionData("mintSupply", [to, amount.toString()]);

        // Prepare the action array
        const actionMintSupply = [
            governanceTokenAddress, // Address of the contract
            0, // Value in wei to send (usually 0 for function calls)
            mintSupplyEncoded // Encoded function data
        ];

        // Log and return the result as an array

        return [actionMintSupply];
    }
    async function createBurnAction(governanceTokenAddress, from, amount) {
        // Define the ABI for the burn function
        const abi = [
            "function burnSupply(address from, uint256 _amount)"
        ];

        // Create an interface for encoding the function call
        const iface = new ethers.Interface(abi);

        // Encode the function call
        const burnSupplyEncoded = iface.encodeFunctionData("burnSupply", [from, amount.toString()]);

        // Prepare the action array
        const actionBurnSupply = [
            governanceTokenAddress, // Address of the contract
            0, // Value in wei to send (usually 0 for function calls)
            burnSupplyEncoded // Encoded function data
        ];

        // Log and return the result as an array
        return [actionBurnSupply];
    }
    async function createTransferAction(governanceTokenAddress, recipient, amount) {
        // Define the ABI for the transfer function
        const abi = [
            "function transfer(address recipient, uint256 amount) returns (bool)"
        ];

        // Create an interface for encoding the function call
        const iface = new ethers.Interface(abi);

        // Encode the function call
        const transferEncoded = iface.encodeFunctionData("transfer", [recipient, amount.toString()]);

        // Prepare the action array
        const actionTransfer = [
            governanceTokenAddress, // Address of the contract
            0, // Value in wei to send (usually 0 for function calls)
            transferEncoded // Encoded function data
        ];

        // Log and return the result as an array
        return [actionTransfer];
    }

    function createWithdrawAction(daoContractAddress, _to, amount) {
        const abi = [
            "function withdrawTokens(address _to, uint256 _amount)"
        ];

        const iface = new ethers.Interface(abi);
        // Use BigInt conversion if required for the amount
        const withdrawTokensEncoded = iface.encodeFunctionData("withdrawTokens", [_to, amount.toString()]);

        const actionWithdrawTokens = [
            daoContractAddress,
            0,
            withdrawTokensEncoded
        ];

        // Log and return JSON string
        // console.log("actionWithdrawTokens:", actionWithdrawTokens);
        return ([actionWithdrawTokens]);
    }



    describe("Deployment DAO", function () {
        it("Should returns the Governance contract data", async function () {
            const { gtContract } = await loadFixture(DeployGovernanceTokenFixture);
            const [addr1, addr2, addr3] = await ethers.getSigners();

            // GT Contract Details
            const name = await gtContract.name();
            const symbol = await gtContract.symbol();
            const owner = await gtContract.owner();

            console.log("GovernanceToken Details:", { name, symbol, owner });
        });

        it("should return DAO contract details", async function () {
            const { daoContract } = await loadFixture(DeployDAOFixture);
            const [addr1] = await ethers.getSigners();

            // DAO Contract Details
            const governanceTokenAddress = await daoContract.governanceTokenAddress();
            const DaoCreator = await daoContract.DaoCreator();
            const minimumParticipationPercentage = await daoContract.minimumParticipationPercentage();
            const supportThresholdPercentage = await daoContract.supportThresholdPercentage();
            const minimumDuration = await daoContract.minimumDuration();
            const earlyExecution = await daoContract.earlyExecution();
            const canVoteChange = await daoContract.canVoteChange();
            const isMultiSignDAO = await daoContract.isMultiSignDAO();
            const proposalId = await daoContract.proposalId();
            const membersCount = await daoContract.membersCount();

            console.log("DAO Contract Details:", {
                governanceTokenAddress,
                DaoCreator,
                minimumParticipationPercentage: minimumParticipationPercentage.toString(),
                supportThresholdPercentage: supportThresholdPercentage.toString(),
                minimumDuration: minimumDuration.toString(),
                earlyExecution,
                canVoteChange,
                isMultiSignDAO,
                proposalId: proposalId.toString(),
                membersCount: membersCount.toString(),
            });
        });


        /**
         * @dev This test case adds members in the DAO
         * - It adds one member with a balance of 100 ether
         * - It checks that the count of members has increased by one
         */

        it("should add members in DAO", async function () {
            const { daoContract, addr3 } = await loadFixture(DeployDAOFixture);

            const daoMembers = [
                [await addr3.getAddress(), ethers.parseEther("100")],
            ];

            const preCount = await daoContract.membersCount();
            await daoContract.addDAOMembers(daoMembers);
            const afterCount = await daoContract.membersCount();

            expect(preCount + BigInt(1)).to.equal(afterCount);
        });



        /**
                 * @dev This test case creates a proposal, votes, and executes it
                 * - It tests the full flow of the DAO
                 * - It first creates a proposal
                 * - Then it votes on the proposal
                 * - Finally, it executes the proposal
                 * - It also prints the balances of the users and the DAO
                 * - It prints the status of the proposal
                 * @param {Promise<void>} func function to be tested
                 */
        it("should create , vote and execute the proposal ", async function () {
            const { daoContract } = await loadFixture(DeployDAOFixture);
            const [user1, user2, user3] = await ethers.getSigners();

            // Check balance before minting to user3 address
            const gt = await ethers.getContractFactory("GovernanceToken");
            const gtContract = gt.attach(await daoContract.governanceTokenAddress());
            console.log("Balance of user3", await gtContract.balanceOf(user3.address));

            // Set DAO address in Governance Token
            await gtContract.setDAOAddress(daoContract.getAddress());

            const title = "Increase Token Supply";
            const description = "This proposal aims to increase the token supply mint to 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
            const startTime = Math.floor(Date.now() / 1000);
            const duration = 604800; // Duration in seconds (1 week)


            const actions = await createMintAction(await gtContract.getAddress(), user3.address, 50)


            // Creating proposal
            let proposalId = await daoContract.proposalId();
            console.log("Current Proposal Id", proposalId);

            const tx = await daoContract.createProposal(title, description, startTime, duration, actions);
            await tx.wait();

            proposalId = await daoContract.proposalId();
            console.log("Current Proposal Id", proposalId);

            const proposals = await daoContract.proposals(proposalId);
            console.log("Proposal Address:", proposals[0]);

            const proposalInstance = await ethers.getContractFactory("Proposal");
            const proposalContract = proposalInstance.attach(proposals[0]);

            // Grant roles
            await gtContract.grantRole("0x262c70cb68844873654dc54487b634cb00850c1e13c785cd0d96a2b89b829472", proposals[0]);

            expect(await proposalContract.creatorAddress()).to.equal(proposals[1]);

            // Voting
            await proposalContract.connect(user1).vote(2); // No vote
            await proposalContract.connect(user2).vote(1); // Yes vote

            console.log("Yes votes", await proposalContract.yesVotes());
            console.log("No votes", await proposalContract.noVotes());

            // Execute proposal
            await proposalContract.connect(user1).executeProposal();
            console.log("Executed:", await proposalContract.executed());
            console.log("Balance of user3", await gtContract.balanceOf(user3.address));
        });

        /**
         * @dev This test case deposits tokens in DAO
         * - User1 deposits 50 tokens
         * - Balance of user1 should be decreased by 50 tokens
         * - Balance of DAO should be increased by 50 tokens
         * - tokenDeposited mapping should be updated by 50 tokens
         * @param {Promise<void>} func function to be tested
         */
        it("should deposit tokens in DAO", async function () {
            const { daoContract } = await loadFixture(DeployDAOFixture)
            const [user1] = await ethers.getSigners();
            const gtContract = await ethers.getContractFactory("GovernanceToken");
            const gt = gtContract.attach(await daoContract.governanceTokenAddress());

            // Before deposit
            const initialUserBalance = await gt.balanceOf(user1.address);
            const initialDaoBalance = await gt.balanceOf(daoContract.getAddress());
            const daoDepositsBefore = await daoContract.tokenDeposited(user1.address);

            // Deposit 50 tokens
            const depositBal = BigInt(50);
            await gt.connect(user1).approve(daoContract.getAddress(), depositBal);
            await daoContract.connect(user1).depositTokens(depositBal);

            // After deposit
            const userBalanceAfter = await gt.balanceOf(user1.address);
            const daoBalanceAfter = await gt.balanceOf(daoContract.getAddress());
            const daoDepositsAfter = await daoContract.tokenDeposited(user1.address);

            // Calculations
            expect(userBalanceAfter).to.equal(initialUserBalance - depositBal);
            expect(daoBalanceAfter).to.equal(initialDaoBalance + depositBal);
            expect(daoDepositsAfter).to.equal(daoDepositsBefore + depositBal);
        })

        /**
         * @dev This test case should deposit and withdraw tokens from DAO
         * deposit 100 tokens
         * withdraw 50 tokens
         * @param {Promise<void>} func function to be tested
         */

        it("should deposit and  withdraw tokens from DAO", async function () {
            const { daoContract } = await loadFixture(DeployDAOFixture)
            const [user1] = await ethers.getSigners();
            const gtContract = await ethers.getContractFactory("GovernanceToken");
            const gt = gtContract.attach(await daoContract.governanceTokenAddress());
            const depositBal = BigInt(100);
            const withdrawBal = BigInt(50);
            const balance = await gt.balanceOf(user1.address);

            // Deposit
            await gt.connect(user1).approve(daoContract.getAddress(), depositBal);
            await daoContract.connect(user1).depositTokens(depositBal);
            // Calculation:
            // Before deposit: balance = 100
            // Deposit: 100
            // After deposit: balance = 100 - 100 = 0
            // daoDeposits = 100
            expect(await gt.balanceOf(user1.address)).to.equal(balance - depositBal);

            // Withdraw
            const daoDeposits = await daoContract.tokenDeposited(user1.address);
            expect(daoDeposits).to.equal(depositBal);
            await daoContract.connect(user1).withdrawTokens(user1.address, withdrawBal);

            // Calculation:
            // Before withdraw: balance = 0
            // Withdraw: 50
            // After withdraw: balance = 50
            // daoDeposits = 100 - 50 = 50
            expect(await gt.balanceOf(daoContract.getAddress())).to.equal(depositBal - withdrawBal);

            expect(await daoContract.tokenDeposited(user1.address)).to.equal(daoDeposits - withdrawBal);
        })

        it("should create a proposal for withdrawing tokens from DAO", async function () {
            const { daoContract } = await loadFixture(DeployDAOFixture)
            const [user1, user2] = await ethers.getSigners();
            const gtContract = await ethers.getContractFactory("GovernanceToken");
            const gt = gtContract.attach(await daoContract.governanceTokenAddress());
            const depositBal = BigInt(100);
            const withdrawBal = BigInt(50);
            const balance = await gt.balanceOf(user1.address);

            // Deposit
            await gt.connect(user1).approve(daoContract.getAddress(), depositBal);
            await daoContract.connect(user1).depositTokens(depositBal);
            console.log("Deposit Tokens", await daoContract.tokenDeposited(user1.address));

            // Calculation:
            // Before deposit: balance = 100
            // Deposit: 100
            // After deposit: balance = 100 - 100 = 0
            // daoDeposits = 100

            expect(await gt.balanceOf(user1.address)).to.equal(balance - depositBal);
            // Withdraw proposal
            const title = "Withdraw tokens from DAO";
            const description = "Withdraw tokens from DAO";
            const startTime = Math.floor(Date.now() / 1000);
            const duration = 604800; // Duration in seconds (1 week)
            const actions = createWithdrawAction(await daoContract.getAddress(), user1.address, withdrawBal);

            console.log("Action", actions);


            let proposalId = await daoContract.proposalId();
            console.log("Current Proposal Id", proposalId);
            const tx = await daoContract.createProposal(title, description, startTime, duration, actions);

            proposalId = await daoContract.proposalId();
            console.log("Current Proposal Id", proposalId);

            const proposals = await daoContract.proposals(proposalId);
            console.log("Proposal Address:", proposals[0]);
            // await gt.approve
            const proposalInstance = await ethers.getContractFactory("Proposal");
            const proposalContract = proposalInstance.attach(proposals[0]);
            expect(await proposalContract.creatorAddress()).to.equal(proposals[1]);

            // Voting
            await proposalContract.connect(user1).vote(1); // No vote
            await proposalContract.connect(user2).vote(1); // Yes vote

            console.log("Yes votes", await proposalContract.yesVotes());
            console.log("No votes", await proposalContract.noVotes());
            console.log("approved:", await proposalContract.approved());

            // Execution
            try {
                console.log("Deposit Tokens...........", await daoContract.tokenDeposited(user1.address));

                await proposalContract.connect(user1).executeProposal()
                console.log("Deposit Tokens...........", await daoContract.tokenDeposited(user1.address));
            } catch (error) {
                console.log("Error", error);
            }

        })

        // it("should create a proposal for withdrawing tokens from DAO", async function () {
        //     const withdrawFunAction = await createWithdrawAction("0x93f9b62443Ae731f817CA262f79921497dDA525E", BigInt(50));
        //     console.log("Withdraw Action", withdrawFunAction);
        // })

    });
});
