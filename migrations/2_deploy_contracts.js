module.exports = function(deployer) {
  deployer.deploy(User);
  deployer.autolink();
  deployer.deploy(Provider);
};
