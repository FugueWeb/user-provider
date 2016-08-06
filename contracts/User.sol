import "./mortal.sol";

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
		if(services[_providerAddress].active){
			throw;
		}

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
			services[_providerAddress].lastUpdate = now;
			} else {
				throw;
		}
	}
}