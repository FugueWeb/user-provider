
contract mortal {

	address public owner;

	function mortal(){
		owner = msg.sender;
	}

	modifier onlyOwner {
		if (msg.sender != owner){
			throw;
		} else {
			_
		}
	}

	function kill() onlyOwner{
		suicide(owner);
	}
}

contract User is mortal {

	string public userName;

	function User(string _name) {
		userName = _name;
	}

	struct Service {
		bool active;
		uint lastUpdate;
		uint256 debt;
	}

	// array of Service structs
	mapping(address => Service) public services;

	function registerProvider(address _providerAddress) onlyOwner {
		services[_providerAddress] = Service({
			active: true,
			lastUpdate: now,
			debt: 0
		});
	}

	// only Provider can call this function
	function setDebt(uint256 _debt){
		if (services[msg.sender].active){
			services[msg.sender].lastUpdate = now;
			services[msg.sender].debt = _debt;
			} else {
				throw;
		}
	}

	function payToProvider(address _providerAddress){
		_providerAddress.send(services[_providerAddress].debt);
	}

	function unsubscribe(address _providerAddress){
		if(services[_providerAddress].debt == 0){
			services[_providerAddress].active = false;
			} else {
				throw;
		}
	}
}

contract Provider is mortal {

	string public providerName = "defaultName";
	string public providerDesc = "defaultDescription";

	function Provider (string _name, string _desc){
		providerName = _name;
		providerDesc = _desc;
	}

	function getProviderInfo() returns (string a, string b) {
		a = providerName;
		b = providerDesc;
	}

	// declare new User object and set debt
	function setDebt (address _userAddress, uint256 _debt) onlyOwner{
		User person = User(_userAddress);
		person.setDebt(_debt);
	}
}