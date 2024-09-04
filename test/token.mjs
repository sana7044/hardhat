//moka is a framework and chai is the library.
//importing chai library
// import { expect } from "chai";
//Token Contract is the name of the contract, we can write anything in that place.
// describe("Token Contract", function () {
//   //this line basically indicates that what we are going to test. Here we are testing the token is assigned to the owner so it is written in the constructor part of Token.sol.
//   it("Deployment should assign the total supply of the tokens to the owner", async function () {
//     const { expect } = await import("chai");
//     const [owner] = await ethers.getSigners();
//     //getSigners() is an object through which we can access the accounts. account's address, account's balances.
//     console.log("Signers Object:", owner);

//     //creating instance of our contract
//     //getContractFactory is used to create the instance of our contract
//     const Token = await ethers.getContractFactory("Token");

//     //now we will deploy that instance. deploy karne ka jagah bhi hardhat hi dega.
//     const hardhatToken = await Token.deploy();

//     //now we will use balanceOf function that we have created in Token.sol contract
//     const ownerBalance = await hardhatToken.balanceOf(owner.address); //ownerBalance=10000
//     console.log("Owner Address:", owner.address);

//     //using chai library
//     //expect , as the name suggest that we have certain expectation that it should be like that
//     // expect(await hardhatToken.totalSupply()).eq(ownerBalance).to.be.true; //totalSupply=100000
//     expect((await hardhatToken.totalSupply()).eq(ownerBalance)).to.be.true;
//   });
//   it("Should transfer Tokens between accounts", async function () {
//     const { expect } = await import("chai");
//     //we are using addr1,addr2 here as we have to transfer from one account to another account. Those are provided by getSigners() object.
//     const [owner, addr1, addr2] = await ethers.getSigners();

//     const Token = await ethers.getContractFactory("Token");
//     const hardhatToken = await Token.deploy();

//     //Transfer 10 token from owner to addr1.
//     await hardhatToken.transfer(addr1.address, 10);
//     //assertion to validate
//     expect((await hardhatToken.balanceOf(addr1.address)).eq(10)).to.be.true;

//     //Now transfer 5 tokens from addr1 to addr2
//     //connecting address1 so that we can transfer. we have to use connect as we are not directly transferring from owner.
//     await hardhatToken.connect(addr1).transfer(addr2.address, 5);
//     expect((await hardhatToken.balanceOf(addr2.address)).eq(5)).to.be.true;
//   });
// });

//writing again to avoid code repetation
//we will be using the hooks provided by MOCH framework

// const {expect} = require("chai");
import { expect } from "chai";

describe("Token Contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  //Using beforeEach hook provided my MOcha framework
  //THe task of the beforeEach is that , while running any of the cases inside 'it' the lines written in before each will run. THen there should me no repeatation of code and reduce the line of code.
  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("Deployment Function", function () {
    //To test that the owner that are set inside the constructor in Token.sol is correct or not
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
    it("Should assign the total supply of token to the owner", async function () {
      //fir we will call balanceOf function to check the balance of the owner
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      const totalSupply = await hardhatToken.totalSupply();
      expect(await totalSupply.toString()).to.equal(ownerBalance.toString());
      //If we are not using To String() then it is throwung error as we are comparing bigNUmber and objects
      // expect(await hardhatToken.totalSupply()).to.eq(ownerBalance);
    });
  });
  describe("Transactions", function () {
    it("Should transfer token between accounts", async function () {
      //kis acc se transfer ho raha h ni mention kiya h means owner k acc s transfer ho raha h
      await hardhatToken.transfer(addr1.address, 5);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance.toNumber()).to.equal(5);

      await hardhatToken.connect(addr1).transfer(addr2.address, 5);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance.toNumber()).to.equal(5);
    });
    it("Should tell if the sender does not have enough Tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); // 10000

      try {
        await hardhatToken.connect(addr1).transfer(owner.address, 1);
        // If the transfer does not revert, fail the test
        expect.fail("Expected transaction to revert");
      } catch (error) {
        // Check if the revert reason matches the expected message
        expect(error.message).to.include("Not Enough Tokens");
      }

      // Verify the owner's balance remains unchanged
      expect(await hardhatToken.balanceOf(owner.address).toString()).to.equal(
        initialOwnerBalance.toString()
      );
    });
    it("Should Update Balance after Transfer", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      //transferring from owner to addr1
      await hardhatToken.transfer(addr1.address, 5);
      //transferring from owner to addr2
      await hardhatToken.transfer(addr2.address, 10);

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance.toString()).to.equal(
        (initialOwnerBalance - 15).toString()
      );

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance.toNumber()).to.equal(5);

      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance.toNumber()).to.equal(10).toString();
    });
  });
});
