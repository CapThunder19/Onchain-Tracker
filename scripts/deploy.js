const hre = require("hardhat");

async function main() {
    const chain = await hre.ethers.getContractFactory("Supplychain");
    const supplychain = await chain.deploy();
    await supplychain.waitForDeployment();
    const address = await supplychain.getAddress();
    console.log("Supplychain deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });