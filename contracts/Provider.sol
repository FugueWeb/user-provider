import "./mortal.sol";
import "./User.sol";

contract Provider is mortal {

	string public providerName;
	string public providerDesc;

	function Provider (string _name, string _desc){
		providerName = _name;
		providerDesc = _desc;
	}

	// declare new User object and set debt
	function setDebt (address _userAddress, uint256 _debt) onlyOwner{
		User person = User(_userAddress);
		person.setDebt(_debt);
	}
}