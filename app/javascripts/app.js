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
  document.getElementById("p_address").innerHTML = Provider.deployed().address;
  document.getElementById("u_address").innerHTML = User.deployed().address;

}

function userFunction(arg){

  var sendToAddress;

  switch(arg) {
      case "registerProvider":
          sendToAddress = document.getElementById("registerProviderText").value;
          user.registerProvider(sendToAddress, {from:accounts[0]}).then(function(result){
            console.log(result);
            transactionReceipt(result, "User registered with provider - Tx: " + result);
            setStatus("Transaction complete!");
            checkUserStatus();
            refreshBalances();
          }).catch(function(error){
            console.log(error);
            setStatus('');
            transactionReceipt(null, '<span class="error">Error registering User. You may already be registered to Provider. See console</span>');
          });;
          break;
      case "payToProvider":
          sendToAddress = document.getElementById("payProviderText").value;
          console.log(sendToAddress);
          user.payToProvider(sendToAddress, {from: accounts[0]}).then(function(result){
            console.log(result);
            transactionReceipt(result, "User paid provider - Tx: " + result);
            checkUserStatus();
            refreshBalances();
          }).catch(function(error){
            console.log(error);
            setStatus('');
            transactionReceipt(null, '<span class="error">Error paying Provider. See console</span>');
          });
          break;
      case "unsubscribe":
          sendToAddress = document.getElementById("unsubscribeText").value;
          user.unsubscribe(sendToAddress, {from: accounts[0]}).then(function(result){
            console.log(result);
            transactionReceipt(result, "User unsubscribed - Tx: " + result);
            setStatus("Transaction complete!");
            checkUserStatus();
          }).catch(function(error){
            console.log(error);
            setStatus('');
            transactionReceipt(null, '<span class="error">Error unsubscribing User. You may have debt to Provider. See console</span>');
          });
          break;
      default:
          console.log("Error with User contract");
  }
}

function timeConverter(UNIX_timestamp){
  if (UNIX_timestamp == 0){
    return null;
  }
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
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

  provider.setDebt(userDebtAddr, userDebt, {from:accounts[0]}).then(function(result){
    console.log(result);
    transactionReceipt(result, "Provider set user debt. Tx: " + result);
    setStatus("Transaction complete!");
    checkUserStatus();
  }).catch(function(error){
    console.log(error);
  });
}

function checkUserStatus() {
  user.services(provider.address).then(function(result){
    console.log(result)
    var formattedTime = timeConverter(result[1]);
    transactionReceipt(result, "User registered with provider: <strong>" + result[0] + "</strong> | Last update: <strong>" + formattedTime + "</strong> | Debt: <strong>" + result[2]) + "</strong>";
  }).catch(function(error){
    console.log(error);
  });
}

function checkProviderStatus() {
  provider.providerName().then(function(result){
    console.log(result)
    //transactionReceipt(result, "User registered with provider: <strong>" + result[0] + "</strong> | Last update: <strong>" + formattedTime + "</strong> | Debt: <strong>" + result[2]) + "</strong>";
  }).catch(function(error){
    console.log(error);
  });
}

function refreshBalances() {
  document.getElementById("p_balance").innerHTML = web3.fromWei(web3.eth.getBalance(Provider.deployed().address), "ether").toFixed(5);
  document.getElementById("u_balance").innerHTML = web3.fromWei(web3.eth.getBalance(User.deployed().address), "ether").toFixed(5);
  document.getElementById("cb_balance").innerHTML = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), "ether").toFixed(5)+ " ETH";
};

function transactionDetails(text) {
  var tableData = "<tr><td>" + text + "</td></tr>";
  document.getElementById("transaction-table").innerHTML += tableData;
};

function transactionReceipt(result, text){
  console.log(result);
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

    checkUserStatus();
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
