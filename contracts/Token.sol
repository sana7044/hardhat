//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

//with the use of this import statement we can debug our code.
//This line gives us power to write the JS code in solidity.
import "hardhat/console.sol";

contract Token {
    string public name = "HardHat Tutorial";
    string public symbol = "HHT";

    //unsigned integer, no of token
    uint256 public totalSupply = 10000;
    //who is the owner of the Token.
    address public owner;

    //har ek address s associated ek balance hoga usko note karenge.
    //example : adress is 123->token is 100. address is 223->token is 150. means kidke pas kitna token hai.
    mapping(address => uint) balances;

    constructor() {
        //Jo bhi is contract ko deploy kar raha h usko ham pura token bhej de rahe hain.
        //jo deploy kar raha hai abhin k lye wo hi contract creator hai. To total supply uske hi pas hoga. uske bad wo chahe distribute kar de.
        balances[msg.sender] = totalSupply;
        //owner bhi usi ko bana denge
        owner = msg.sender;
    }

    //function to transfer tokens
    function transfer(address to, uint amount) external {
        //line to debug code
        console.log("**Sender balance is %s tokens:**", balances[msg.sender]);
        console.log(
            "**Sender is sending %s tokens to %s address**",
            amount,
            to
        );
        //here we will check require balance. Sender k pas itna balance hai bhi k ni jo wo transfer karne ka soch raha h.
        require(balances[msg.sender] >= amount, "Not Enough Tokens");

        //agar condition true h to sender k balance me s token deduce ho jyga
        balances[msg.sender] -= amount; //balances[msg.sender]=balances[msg.sender]-amount

        //jiske pas ye receive ho raha hai usme add kar rhe h balance
        balances[to] += amount;
    }

    //function to check the balance of any account
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
