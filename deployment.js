// deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const AdvancedToken = await ethers.getContractFactory("AdvancedToken");
    const advancedToken = await AdvancedToken.deploy("AdvancedToken", "AT", 1000000); // Example max supply: 1000000
  
    console.log("AdvancedToken deployed to:", advancedToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  