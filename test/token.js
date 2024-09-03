//moka is a framework and chai is the library.
//importing chai library
// import { expect } from "chai";
//Token Contract is the name of the contract, we can write anything in that place.
describe("Token Contract", function () {
  //this line basically indicates that what we are going to test. Here we are testing the token is assigned to the owner so it is written in the constructor part of Token.sol.
  it("Deployment should assign the total supply of the tokens to the owner", async function () {
    const { expect } = await import("chai");
    const [owner] = await ethers.getSigners();
    //getSigners() is an object through which we can access the accounts. account's address, account's balances.
    console.log("Signers Object:", owner);

    //creating instance of our contract
    //getContractFactory is used to create the instance of our contract
    const Token = await ethers.getContractFactory("Token");

    //now we will deploy that instance. deploy karne ka jagah bhi hardhat hi dega.
    const hardhatToken = await Token.deploy();

    //now we will use balanceOf function that we have created in Token.sol contract
    const ownerBalance = await hardhatToken.balanceOf(owner.address); //ownerBalance=10000
    console.log("Owner Address:", owner.address);

    //using chai library
    //expect , as the name suggest that we have certain expectation that it should be like that
    // expect(await hardhatToken.totalSupply()).eq(ownerBalance).to.be.true; //totalSupply=100000
    expect((await hardhatToken.totalSupply()).eq(ownerBalance)).to.be.true;
  });
  it("Should transfer Tokens between accounts", async function () {
    const { expect } = await import("chai");
    //we are using addr1,addr2 here as we have to transfer from one account to another account. Those are provided by getSigners() object.
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();

    //Transfer 10 token from owner to addr1.
    await hardhatToken.transfer(addr1.address, 10);
    //assertion to validate
    expect((await hardhatToken.balanceOf(addr1.address)).eq(10)).to.be.true;

    //Now transfer 5 tokens from addr1 to addr2
    //connecting address1 so that we can transfer. we have to use connect as we are not directly transferring from owner.
    await hardhatToken.connect(addr1).transfer(addr2.address, 5);
    expect((await hardhatToken.balanceOf(addr2.address)).eq(5)).to.be.true;
  });
});
