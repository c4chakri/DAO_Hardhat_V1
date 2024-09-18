const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai")
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
        const governanceTokenAddress = gtContract.getAddress(); // Use `.address`
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

        console.log("DAO Address:", await daoContract.getAddress());
        console.log("balance", await gtContract.balanceOf(addr1.address));
        console.log("min------", await daoContract.minimumParticipationPercentage());



        return { daoContract, addr1, addr2, addr3, addr4 };
    }

    describe("Deployment DAO", function () {
        it("Should deploy the DAO contract", async function () {
            const { gtContract } = await loadFixture(DeployGovernanceTokenFixture);
            const [addr1, addr2, addr3] = await ethers.getSigners();

            // GT Contract Details
            const name = await gtContract.name();
            const symbol = await gtContract.symbol();
            const owner = await gtContract.owner();
            const balance = await gtContract.balanceOf(addr1.address);

            console.log("GovernanceToken Details:", { name, symbol, owner, balance: balance.toString() });
        });

        it("should add members in Dao", async function () {
            const { daoContract, addr3 } = await loadFixture(DeployDAOFixture)

            const daoMembers = [
                [await addr3.getAddress(), ethers.parseEther("100")],
            ];
            const preCount = await daoContract.membersCount()
            await daoContract.addDAOMembers(daoMembers)
            const afterCount = await daoContract.membersCount()

            expect(preCount + BigInt(1)).to.equal(afterCount)



        })
        it("should create proposal", async function () {
            const { daoContract } = await loadFixture(DeployDAOFixture);
            const [user1, user2, user3] = await ethers.getSigners()

            //  check balance before minting to user3 address

            const gt = await ethers.getContractFactory("GovernanceToken")
            const gtContract = gt.attach(await daoContract.governanceTokenAddress())
            console.log("Balance of user3", await gtContract.balanceOf(user3.address));


            // set Daoaddrss in governane token

            await gtContract.setDAOAddress(daoContract.getAddress())


            var proposalId
            const title = "Increase Token Supply";
            const description = "This proposal aims to increase the token supply mint to 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
            const startTime = Math.floor(Date.now() / 1000); // Start time 1 hour from now
            const duration = 604800; // Duration in seconds (1 week)
            proposalId = await daoContract.proposalId()
            console.log("Current Proposal Id", proposalId);

            const actions = [["0x5FbDB2315678afecb367f032d93F642f64180aa3", 0, "0xe742806a0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc0000000000000000000000000000000000000000000000000000000000000384"]]            // Call the createProposal function
            // Creating proposal ie minting to "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"  900 tokens
            const tx = await daoContract.createProposal(
                title,
                description,
                startTime,
                duration,
                actions
            );



            console.log("Tx.........", tx.hash);
            proposalId = await daoContract.proposalId()
            console.log("Current Proposal Id", proposalId);

            const proposals = await daoContract.proposals(1)

            console.log(" Proposal 0", proposals[0]);
            const prop1 = proposals[0]
            const proposer = proposals[1]
            const propIns = await ethers.getContractFactory("Proposal")
            const proposalContract = propIns.attach(prop1)
            await gtContract.grantRole("0x262c70cb68844873654dc54487b634cb00850c1e13c785cd0d96a2b89b829472",prop1)
            console.log("creatorAddress", await proposalContract.creatorAddress());
            expect(await proposalContract.creatorAddress()).to.equal(proposer)
            const afterCount = await daoContract.membersCount()
            console.log(afterCount);


            //voting
            await proposalContract.connect(user1).vote(2) // No vote 2
            await proposalContract.connect(user2).vote(1) // Yes vote 1
            console.log("Yes votes", await proposalContract.yesVotes());
            console.log("No votes", await proposalContract.noVotes());
            //Approving
            console.log("is Approved ", await proposalContract.approved());
            console.log("is executed ", await proposalContract.executed());

            // execute
            await proposalContract.connect(user1).executeProposal()
            console.log("is executed ", await proposalContract.executed());
            console.log("Balance of user3", await gtContract.balanceOf(user3.address));
            console.log("");
            
            console.log("role",
                await gtContract.hasRole("0x262c70cb68844873654dc54487b634cb00850c1e13c785cd0d96a2b89b829472", user1.address)
            )
            console.log("role",
                await gtContract.hasRole("0x262c70cb68844873654dc54487b634cb00850c1e13c785cd0d96a2b89b829472", daoContract.getAddress())
            )
            console.log("role",
                await gtContract.hasRole("0x262c70cb68844873654dc54487b634cb00850c1e13c785cd0d96a2b89b829472", prop1)
            )
            console.log("proposal address",prop1);
            
        })
        // it("sholud interact with proposal", async function () {
        //     const { daoContract } = await loadFixture(DeployDAOFixture)
        //     const proposalId = await daoContract.proposals(0)
        //     console.log(" Proposal 0.......", proposalId);

        // })

    });
});
