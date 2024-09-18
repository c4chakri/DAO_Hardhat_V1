const daoMembers = [
    { memberAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",deposit:"100"},
    { memberAddress: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", deposit :"100" }
];
const membersArray = daoMembers.map(member => [member.memberAddress, member.deposit]);
console.log(membersArray);

// console.log(daoMembers[0]);
// for (let i = 0; i < daoMembers.length; i++) {
//      memberAddress = daoMembers[i].memberAddress;
//      deposit = daoMembers[i].deposit;
//      console.log(memberAddress);
//      console.log(deposit);
     
     
// }