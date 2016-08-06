module.exports = function(deployer) {
  deployer.deploy(mortal);
  deployer.deploy(User);
  deployer.autolink();
  deployer.deploy(Provider);

};
