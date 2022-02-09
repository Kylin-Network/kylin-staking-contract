const { BigNumber } = require("@ethersproject/bignumber");
const hre = require("hardhat");
const { getSavedContractAddresses, deploy_ct, load_ct } = require('./utils');
let c = require('../deployments/deploymentConfig.json');

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

async function main() {
  const config = c[hre.network.name];

  await deploy_ct("ERC20Mock", "xtoken", ["Kylin Network Test", "tKYL"], false);

  const rewardDistAddr = config["rewardDistAddr"];
  const tokenAddr = getSavedContractAddresses()[hre.network.name]["xtoken"];
  const poolCap = ether(config["poolCap"]);
  await deploy_ct("StakingRewards", "staking", [rewardDistAddr, tokenAddr, tokenAddr, poolCap], false)

  console.log("Done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
