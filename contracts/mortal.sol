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