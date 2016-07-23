# User-Provider dApp

Requires [Truffle 2.0](http://truffle.readthedocs.io/en/latest/getting_started/installation/) and NodeJS

Front end for Ethereum video tutorial from [shlomi zeltsinger](https://www.youtube.com/channel/UCi9Mf3veSDDIMdGGtPmPu1g) - @Shultzi. Model for a user to interact with a provider service, for instance, a client (user) registering an account with an electric company (provider). The provider can then set the debt of the user for services, and the user can pay that debt and unsubscribe when they have a 0 balance. The dApp also shows what addresses are available in the running `geth` node, balances, and some basic transaction information.

## Getting started

* Open two terminals (one for Truffle, the other for Geth)
* T1: `truffle compile`
* T2: `geth --testnet --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "eth,web3" console` (for example)
* Unlock your account for sending transactions (`personal.unlockAccount(eth.accounts[0])`) and enter password
* `truffle migrate` (Migrations, User, and Provider contracts deployed)

Now paste the Provider contract address into the `Register Provider` field and click send.

## Screenshot

![alt text](https://github.com/FugueWeb/user-provider/raw/master/app/images/screenshot.png "App Preview")

## Issues

* Note, I have tried the contract code in `Ethereum Wallet` (as per the tutorial) and everything works fine. Any issues lie with the `app.js` file that is trying to connect the front end with the `geth rpc` node.
* I receive the following warning when running `registerProvider()` : "Warning: a promise was created in a handler but was not returned from it." Essentially, the User is not registering with the Provider on the front end.
* I'm having trouble just reading the state of the User contract (to see if it is/is not registered with a Provider). [Truffle docs on this subject](http://truffle.readthedocs.io/en/latest/getting_started/contracts/). This seems like it should be straight forward, but I've had no luck and have even tried making a getter function to do this (which I suspect is redundant as I know this is unnecessary in `Ethereum Wallet`). Calling the getter in the User contract does not seem to return the correct state of the User object. For example, when the contracts are first deployed, the User is not registered with any Provider and thus has no debt. Therefore, the state of the User should be `[false, <timestamp>, 0]`. However, what I see in the console is `[false, BigNumber, BigNumber]`, which is the same thing I get after registering with the Provider (meaning that no change in state has occured). (I'm also not entirely clear on why it is returning [BigNumber](https://github.com/ethereum/wiki/wiki/JavaScript-API#a-note-on-big-numbers-in-web3js) for a `uint` timestamp (i.e., the second item in the array, which just calls the `now` function).
* I can't figure out how to create new Providers (i.e., to deploy new instances of Provider contracts). In `truffle`, this should be possible with `Provider.new().then(...)` but I am getting similar errors/warnings (and no new address of a deployed contract being returned).
* Ultimately, if I come to understand the above problems, I should have no difficulty ensuring how every other piece of functionality works, as these contracts hinge on the User speaking to the Provider, and vice versa.

