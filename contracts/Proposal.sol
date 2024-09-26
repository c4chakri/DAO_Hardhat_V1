// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./IProposal.sol";
import "./Dao.sol";

contract Proposal is IProposal {
    address internal daoAddress;
    address public creatorAddress;
    address public governanceTokenAddress;

    string public proposalTitle;
    string public proposalDescription;

    uint256 public yesVotes;
    uint256 public noVotes;
    uint256 public abstainVotes;
    uint32 public startTime;
    uint32 public endTime;

    uint8 public status;
    uint8 public minimumParticipationPercentage;
    uint8 public supportThresholdPercentage;

    bool public executed;
    bool public approved;
    bool public earlyExecution;

    DAO public dao;
    Action[] public actions;

    mapping(address => bool) public hasVoted;

    error InvalidVoteType(string expected, uint256 actual);
    modifier canVote() {
        require(
            dao.canInteract(msg.sender),
            "DAO : You are not a member of the dao"
        );
        require(status > 0, "Proposal not exist");
        require(!executed, "Proposal already executed");
        require(!hasVoted[msg.sender], "Already voted");
        require(block.timestamp >= startTime, "Voting has not started yet");
        require(block.timestamp <= endTime, "Voting has ended");
        _;
    }
    modifier canExecute() {
        require(
            dao.canInteract(msg.sender),
            "DAO : only DAO people can execute"
        );
        require(!executed, "Proposal already executed");
        require(approved, "Proposal not yet approved");
        _;
    }

    constructor(
        address _daoAddress,
        address _creatorAddress,
        string memory _title,
        string memory _description,
        uint32 _startTime,
        uint32 _duration,
        Action[] memory _actions,
        address _governanceTokenAddress,
        uint8 _minimumParticipationPercentage,
        uint8 _supportThresholdPercentage,
        bool _earlyExecution
    ) {
        daoAddress = _daoAddress;
        dao = DAO(daoAddress);
        creatorAddress = _creatorAddress;
        proposalTitle = _title;
        proposalDescription = _description;
        startTime = _startTime;
        endTime = startTime + _duration;
        governanceTokenAddress = _governanceTokenAddress;
        minimumParticipationPercentage = _minimumParticipationPercentage;
        supportThresholdPercentage = _supportThresholdPercentage;
        earlyExecution = _earlyExecution;
        status = 1;

        for (uint8 i = 0; i < _actions.length; i++) {
            actions.push(_actions[i]);
        }
    }

    function _getVotingUnits(address account) private view returns (uint256) {
        if (dao.isMultiSignDAO()) {
            return 1;
        } else {
            ERC20Votes erc20 = ERC20Votes(governanceTokenAddress);
            return erc20.balanceOf(account);
        }
    }

    function vote(uint8 _voteOption) external canVote {
    uint256 votes = _getVotingUnits(msg.sender);
    require(votes > 0, "No voting power");

    if (_voteOption == 1) {
        yesVotes += votes;
    } else if (_voteOption == 2) {
        noVotes += votes;
    } else if (_voteOption == 3) {
        abstainVotes += votes;
    } else {
        revert InvalidVoteType({
            expected: "1 or 2 or 3",
            actual: _voteOption
        });
    }

    hasVoted[msg.sender] = true;

    if (dao.isMultiSignDAO()) {
        uint256 totalMembers = dao.membersCount();
        // uint256 totalVotes = yesVotes + noVotes + abstainVotes;
        uint256 yesVotesPercentage = (yesVotes * (100)) / totalMembers;

        if (yesVotesPercentage >= supportThresholdPercentage) {
            approved =
                (earlyExecution || block.timestamp >= endTime) &&
                yesVotes > noVotes;
            status = 2; // Approved
        } else {
            approved = false;
        }
    } else {
        // Token-based DAO logic
        uint256 totalSupply = ERC20Votes(governanceTokenAddress).totalSupply();
        require(totalSupply > 0, "Total supply must be greater than zero");

        uint256 totalVotes = yesVotes + noVotes + abstainVotes;
        uint256 tokenParticipation = (totalVotes * (100)) / (totalSupply);

        uint256 yesVotesPercentage = (yesVotes * (100)) / totalVotes;

        if (
            yesVotesPercentage >= supportThresholdPercentage &&
            tokenParticipation >= minimumParticipationPercentage
        ) {
            approved =
                (earlyExecution || block.timestamp >= endTime) &&
                yesVotes > noVotes;
            status = 2; // Approved
        } else {
            approved = false;
        }
    }
}


    function executeProposal() external {
        require(!executed, "Proposal already executed");
        require(approved, "Proposal not yet approved");

        executed = true;
        status = 3; //executed
        for (uint256 i = 0; i < actions.length; i++) {
            Action memory action = actions[i];
            (bool success, ) = action.to.call{value: action.value}(action.data);
            require(success, "Action execution failed");
        }
    }
}
