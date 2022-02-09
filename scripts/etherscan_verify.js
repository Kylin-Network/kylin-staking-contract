const hre = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const { getSavedContractAddresses } = require('./utils');
let c = require('../deployments/deploymentConfig.json');

const ether = (amount) => {
    const weiString = ethers.utils.parseEther(amount.toString());
    return BigNumber.from(weiString);
  };

verify = async(addr, params) => {
    try {
        await hre.run("verify:verify", {
            address: addr,
            constructorArguments: params
        }); 
        console.log("Verify Done!");
    } catch (error) {
        if (error.message.toLowerCase().indexOf("already verified") == -1) {
            throw(error);
        } else {
            console.log("Already Verified");
        }
    }
}

main = async () => {
    const config = c[hre.network.name];
    if (hre.network.name == "local" && hre.network.name == "hardhat") {
        console.log("Local deploy no need to verify");
        return;
    }

    const tokenAddr = getSavedContractAddresses()[hre.network.name]["xtoken"];
    let params = ["Kylin Network Test", "tKYL"];
    await verify(tokenAddr, params);

    const rewardDistAddr = config["rewardDistAddr"];
    const poolCap = ether(config["poolCap"]);
    const stakeAddr = getSavedContractAddresses()[hre.network.name]["staking"];
    params = [rewardDistAddr, tokenAddr, tokenAddr, poolCap]
    await verify(stakeAddr, params);

    console.log("All verified");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error("Caught Error:", error);
  process.exit(1);
});
