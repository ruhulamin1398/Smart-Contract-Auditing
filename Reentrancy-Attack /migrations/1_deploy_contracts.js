const Vulnerable = artifacts.require("Vulnerable");
const Attack = artifacts.require("Attack");

module.exports = async function (deployer) {
  await deployer.deploy(Vulnerable);
  const vulnerableInstance = await Vulnerable.deployed();
  await deployer.deploy(Attack, vulnerableInstance.address);
};
