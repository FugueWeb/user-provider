var accounts;
var account;
var balance;
var user;
var provider;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
  document.getElementById("status").style.color = "green";
};

function setAddress() {
  document.getElementById("c_address").innerHTML = Provider.deployed_address;
  document.getElementById("a_address").innerHTML = User.deployed_address;

}

function userFunction(arg){

  var sendToAddress;

  switch(arg) {
      case "registerProvider":
          sendToAddress = document.getElementById("registerProviderText").value;
          user.registerProvider(sendToAddress, {from:accounts[0]}).then(function(result){
            console.log(result);
            transactionReceipt(result, "User registered with provider - Tx: " + result);
            getUserServices();
            refreshBalances();
          }).catch(function(error){
            console.log(error);
            setStatus(error);
          });;
          break;
      case "payToProvider":
          sendToAddress = document.getElementById("payProviderText").value;
          console.log(sendToAddress);
          user.payToProvider(sendToAddress, {from: accounts[0]}).then(function(result){
            console.log(result);
            transactionReceipt(result, "User paid provider - Tx: " + result);
          }).catch(function(error){
            console.log(error);
            setStatus(error);
          });
          break;
      case "unsubscribe":
          sendToAddress = document.getElementById("unsubscribeText").value;
          user.unsubscribe(sendToAddress, {from: accounts[0]}).then(function(result){
            console.log(result);
            transactionReceipt(result, "User unsubscribed - Tx: " + result);
          }).catch(function(error){
            console.log(error);
            setStatus(error);
          });
          break;
      default:
          console.log("Error with User contract");
  }
}

// function createProvider(){
//   var providerName = document.getElementById("providerName").value;
//   var providerDescription = document.getElementById("providerDescription").value;
//   console.log(providerName, providerDescription);

//   Provider.new(providerName, providerDescription, {from:accounts[0]}).then(function(instance){
//     console.log(instance);
//     transactionReceipt(instance, "New Provider contract deployed at " + instance.address);
//   }).catch(function(error){
//     console.log(error);
//   });
// }

function setDebt(){
  var userDebtAddr = document.getElementById("setDebtAddr").value;
  var userDebt = document.getElementById("debtAmount").value;
  console.log(userDebtAddr, userDebt);

  Provider.deployed().setDebt(userDebtAddr, userDebt, {from:accounts[0]}).then(function(result){
    console.log(result);
    transactionReceipt(result, "New Provider contract deployed at " + result);
  }).catch(function(error){
    console.log(error);
  });
}

function refreshBalances() {
  document.getElementById("c_balance").innerHTML = web3.fromWei(web3.eth.getBalance(Provider.deployed_address), "ether").toFixed(5);
  document.getElementById("a_balance").innerHTML = web3.fromWei(web3.eth.getBalance(document.getElementById("a_address").innerHTML), "ether").toFixed(5);
  document.getElementById("cb_balance").innerHTML = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), "ether").toFixed(5)+ " ETH";
};

function transactionDetails(text) {
  var tableData = "<tr><td>" + text + "</td></tr>";
  document.getElementById("transaction-table").innerHTML += tableData;
};

function transactionReceipt(result, text){
  console.log(result);
  setStatus("Transaction complete!");
  refreshBalances();
  transactionDetails(text);
}

function killContract(){
  var selectBox = document.getElementById('select-box');
  var selectedAddr = selectBox.options[selectBox.selectedIndex].text;
  console.log(selectedAddr);
  mortal.deployed().kill({from: selectedAddr}).then(function(result){
    console.log(result);
  });
}

function killSwitch(){
  if(document.getElementById('killbutton').disabled){
    document.getElementById('killbutton').disabled = false;
  }else {
    document.getElementById('killbutton').disabled = true;
  }
}

function getUserServices(){
  var userServices = user.getUserServices.call(User.deployed_address, {from:account})
  .then(function(userData){
    console.log(userData);
  }).catch(function(error){
    console.log(error);
  });
}

function getProviderInfo(){
  var providerInfo = provider.getProviderInfo.call(Provider.deployed_address, {from:account})
  .then(function(data){
    console.log(data);
  }).catch(function(error){
    console.log(error);
  });
}

window.onload = function() {
  user = User.deployed();
  provider = Provider.deployed();

  web3.eth.getAccounts(function(err, accs) {
    console.log(accs);

    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    for (var i = 0; i < accs.length; i++) {
      document.getElementById("select-box").innerHTML += '<option>' + accs[i] + '</option>'
    }

    accounts = accs;
    account = accounts[0];

    getUserServices();
    getProviderInfo();
    setAddress();
    refreshBalances();
  });

  web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval |= 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txnHash);
            if (receipt == null) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };

    return new Promise(function (resolve, reject) {
        transactionReceiptAsync(txnHash, resolve, reject);
    });
  };
}
