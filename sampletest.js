// AdvancedToken.test.js
const { expect } = require("chai");

describe("AdvancedToken", function () {
  let AdvancedToken;
  let advancedToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    AdvancedToken = await ethers.getContractFactory("AdvancedToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    advancedToken = await AdvancedToken.deploy("AdvancedToken", "AT", 1000000); // Example max supply: 1000000
    await advancedToken.deployed();
  });

  it("Should mint tokens correctly and reflect in balance", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    expect(await advancedToken.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should not mint tokens beyond maximum supply", async function () {
    await expect(advancedToken.connect(owner).mint(addr1.address, 1000001)).to.be.revertedWith(
      "Exceeds maximum supply"
    );
  });

  it("Should allow users to burn tokens and reflect reduced total supply", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    await advancedToken.connect(addr1).burn(50);
    expect(await advancedToken.totalSupply()).to.equal(950);
  });

  it("Should allow tokens to be locked and unlocked correctly", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    await advancedToken.connect(owner).lockTokens(addr1.address, 50, 3600); // Locking 50 tokens for 1 hour
    expect(await advancedToken.lockedBalanceOf(addr1.address)).to.equal(50);
    await new Promise((r) => setTimeout(r, 3600 * 1000)); // Wait for 1 hour
    await advancedToken.connect(addr1).unlockTokens();
    expect(await advancedToken.lockedBalanceOf(addr1.address)).to.equal(0);
  });

  it("Should not allow locked tokens to be transferred", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    await advancedToken.connect(owner).lockTokens(addr1.address, 50, 3600); // Locking 50 tokens for 1 hour
    await expect(advancedToken.connect(addr1).transfer(addr2.address, 50)).to.be.revertedWith(
      "Cannot transfer locked tokens"
    );
  });
});
