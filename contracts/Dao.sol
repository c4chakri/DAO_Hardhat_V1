// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proposal} from "./Proposal.sol";
import {GovernanceToken, ReentrancyGuard, Ownable,AccessControl} from "./gtDemo.sol";
import {IDAO} from "./IDao.sol";

contract DAO is IDAO, ReentrancyGuard {
    address public immutable governanceTokenAddress;
    address public immutable DaoCreator;
    uint8 public minimumParticipationPercentage;
    uint8 public supportThresholdPercentage;
    uint256 public minimumDuration;
    bool public earlyExecution;
    bool public canVoteChange;
    bool public isMultiSignDAO;
    uint256 public proposalId;
    uint256 public membersCount;

    mapping(address => uint256) public treasuryBalance;
    mapping(uint256 => ProposalInfo) public proposals;
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public isDAOMember;
    mapping(address => uint256) public tokenDeposited;
    mapping (address=> bool) public isProposal;
    bytes32 private constant PROPOSAL_ROLE = keccak256("TOKEN_PROPOSAL");
    
    error DAOBlacklistedAddress();
    error DAONotADaoMember();
    error DAOInsufficientBalance();
    error DAOInvalidAmount();
    error DepositsMisMatch(uint256 expected, uint256 actual);
    error DAOInsufficientAllowanceGovernanceToken();
    error DAOUnAuthorizedInteraction();
    modifier notBlacklisted(address account) {
        if (blacklisted[account]) revert DAOBlacklistedAddress();
        _;
    }

    modifier canInteractWithDAO(address account) {
        require(isDAOMember[account], DAONotADaoMember());
        if (blacklisted[account]) revert DAOBlacklistedAddress();
        _;
    }
    struct GovData {
        string name;
        string symbol;
        address initialAddress;
        uint8 decimals;
        GovernanceToken.smartContractActions actions;
    }

    constructor(
        address _governanceTokenAddress,
        uint8 _minimumParticipationPercentage,
        uint8 _supportThresholdPercentage,
        uint32 _minimumDurationForProposal,
        bool _earlyExecution,
        bool _canVoteChange,
        DAOMember[] memory _daoMembers,
        bool _isMultiSignDAO
    ) {
        governanceTokenAddress = _governanceTokenAddress;
        minimumParticipationPercentage = _minimumParticipationPercentage;
        supportThresholdPercentage = _supportThresholdPercentage;
        minimumDuration = _minimumDurationForProposal;
        earlyExecution = _earlyExecution;
        canVoteChange = _canVoteChange;
        isMultiSignDAO = _isMultiSignDAO;
        DaoCreator = msg.sender;
        setDaoAddressToGovernanceToken();
        addDAOMembers(_daoMembers);
    }

    function addDAOMembers(DAOMember[] memory members) public {
        require(_onlyDao(), DAONotADaoMember());
        GovernanceToken _governanceToken = GovernanceToken(
            governanceTokenAddress
        );
        for (uint256 i = 0; i < members.length; i++) {
            address memberAddress = members[i].memberAddress;
            uint256 deposit = members[i].deposit;

            if (!isDAOMember[memberAddress]) {
                isDAOMember[memberAddress] = true;
                ++membersCount;

                if (!isMultiSignDAO) {
                    _governanceToken.mintSupply(memberAddress, deposit);
                }
            }
        }
    }

    function createProposal(
        string memory _title,
        string memory _description,
        uint32 _startTime,
        uint32 _duration,
        uint8 _actionId,
        Proposal.Action[] memory _actions
    ) public canInteractWithDAO(msg.sender) returns (address) {
        ++proposalId;
        Proposal newProposal = new Proposal(
            address(this),
            msg.sender,
            _title,
            _description,
            _startTime,
            _duration,
            _actions,
            governanceTokenAddress,
            minimumParticipationPercentage,
            supportThresholdPercentage,
            earlyExecution
        );

        proposals[proposalId] = ProposalInfo({
            deployedProposalAddress: address(newProposal),
            creator: msg.sender,
            title: _title,
            id: proposalId
        });
        isProposal[address(newProposal)] = true;

        if (_actionId <= uint8(ActionType.DaoSetting)) {
            ActionType action = ActionType(_actionId);
            if (action == ActionType.Mint) {
                setProposalRole(address(newProposal));
            }
        }
        return proposals[proposalId].deployedProposalAddress;
    }

    function setProposalRole(address proposalAddress) internal {
        GovernanceToken governanceToken = GovernanceToken(
            governanceTokenAddress
        );
        governanceToken.setProposalRole(proposalAddress);
    }

    function setDaoAddressToGovernanceToken() internal {
        GovernanceToken _govToken = GovernanceToken(governanceTokenAddress);
        _govToken.setDAOAddress(address(this));
    }

    function _onlyDao() private view notBlacklisted(msg.sender) returns (bool) {
        if (membersCount == 0) {
            return true;
        } else {
            return (isDAOMember[msg.sender]);
        }
    }

    function getProposalInfo(uint256 _proposalId)
        external
        view
        returns (ProposalInfo memory)
    {
        return proposals[_proposalId];
    }

    function getAllProposals() external view returns (ProposalInfo[] memory) {
        ProposalInfo[] memory proposalsArr = new ProposalInfo[](proposalId);
        for (uint256 i = 0; i < proposalId; i++) {
            ProposalInfo storage prop = proposals[i];
            proposalsArr[i] = prop;
        }
        return proposalsArr;
    }

    function depositToDAOTreasury(uint256 _amount)
        external
        payable
        canInteractWithDAO(msg.sender)
    {
        if (msg.value != _amount) {
            revert DepositsMisMatch({expected: _amount, actual: msg.value});
        }
        treasuryBalance[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function withdrawFromDAOTreasury(uint256 amount)
        external
        nonReentrant
        canInteractWithDAO(msg.sender)
    {
        require(amount > 0, DAOInvalidAmount());
        require(
            treasuryBalance[msg.sender] >= amount,
            DAOInsufficientBalance()
        );
        treasuryBalance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function depositTokens(uint256 _amount) external {
        GovernanceToken _govToken = GovernanceToken(governanceTokenAddress);
        uint256 balance = _govToken.balanceOf(msg.sender);
        uint256 allowance = _govToken.allowance(msg.sender, address(this));
        require(
            allowance >= _amount,
            DAOInsufficientAllowanceGovernanceToken()
        );
        if (balance >= _amount) {
            tokenDeposited[msg.sender] += _amount;
            bool success = _govToken.transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            require(success, "Token transfer failed");
        }
    }

    function withdrawTokens(address _to, uint256 _amount)
        external
        nonReentrant
    {
        // require( isProposal[msg.sender],DAOUnAuthorizedInteraction());
        //  require(_onlyDao(), DAONotADaoMember());
        GovernanceToken _govToken = GovernanceToken(governanceTokenAddress);
        uint256 balance = _govToken.balanceOf(address(this));
        uint256 depBal = tokenDeposited[_to];

        require(depBal >= _amount, "not enough balance");
        if (balance >= depBal && _amount <= balance) {
            tokenDeposited[_to] -= _amount;
            _govToken.transfer(_to, _amount);
        }
    }

    function getDAOTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function setToBlacklist(address _account)
        external
        canInteractWithDAO(msg.sender)
    {
        blacklisted[_account] = true;
    }

    function setToUnBlacklist(address _account)
        external
        canInteractWithDAO(msg.sender)
    {
        blacklisted[_account] = false;
    }

    function canInteract(address _account)
        external
        view
        canInteractWithDAO(_account)
        returns (bool)
    {
        return true;
    }
}
