var ethers = require('ethers');
const {shell} = require('electron')
const {dialog} = require('electron').remote
const clipboardy = require('clipboardy');
var fs = require('fs');
var numeral = require('numeral');
var moment = require('moment');


var providers = ethers.providers;
var Wallet = ethers.Wallet;

var myWallet;

var tokenBalance = 0;
var ethBalance = 0;
var version = "0.2.2";


// Connecting to Infura provider (working)
// const NETWORK = "homestead";
// const PROJECT_ID = "3a0bde1254514ca3a4f536ecdd311913" // Replace this with your own Project ID
// const provider = new ethers.providers.InfuraProvider(NETWORK, {'infura': PROJECT_ID});


// Connecting to a Etherscan provider (working)
// const provider = new ethers.providers.EtherscanProvider("ropsten", "R7R3Z7MMTMQC7J7H8NCNDX2UAAUPP9RU2X"); // Replace this with your own API KEY

// Connecting to Infura provider (working)
// const provider = new ethers.providers.InfuraProvider("ropsten", "3a0bde1254514ca3a4f536ecdd311913"); // Replace this with your own Project ID


					
					let provider = new ethers.providers.EtherscanProvider("homestead", "3IZW2XJER9QZ7KGHMHMTVW6UDXQ96DPVAE");


					$('#providerselector').on('change',function(){
						
						if ( $(this).val()==="etherscan") {
							provider = new ethers.providers.EtherscanProvider("homestead", "KKCRSY1MNV21HCZZS6M7DQEHDU8SGA85Q3");
						} else if ( $(this).val()==="infura") {
							provider = new ethers.providers.InfuraProvider("homestead", "5e8ec0b4a0464ceba6c18d669185594c"); 
						} else if ( $(this).val()==="infura2") {
							provider = new ethers.providers.InfuraProvider("homestead", "365c9144d1e44d1f8c1b8685d5c31ebb"); 
						}else if ( $(this).val()==="etherscan2") {
							provider = new ethers.providers.EtherscanProvider("homestead", "3IZW2XJER9QZ7KGHMHMTVW6UDXQ96DPVAE"); 
						}
                       window.provider = provider;

					});


var tokenContract;


var TOKEN_ADDRESS = '0xc98a910ede52e7d5308525845f19e17470dbccf7' //wilc mainnet contract address
// var TOKEN_ADDRESS = '0xf4f690befd90286964d6e85713272d5e692801e0' //wilc ropsten contract address


const TOKEN_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"burnAmount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"upgrade","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"upgradeAgent","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"upgradeMaster","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getUpgradeState","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"canUpgrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalUpgraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"agent","type":"address"}],"name":"setUpgradeAgent","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isToken","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"BURN_ADDRESS","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"master","type":"address"}],"name":"setUpgradeMaster","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_totalSupply","type":"uint256"},{"name":"_decimals","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Upgrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"agent","type":"address"}],"name":"UpgradeAgentSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"burner","type":"address"},{"indexed":false,"name":"burnedAmount","type":"uint256"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);



function OpenEtherScan(transactionHash) {
  shell.openExternal('https://etherscan.io/tx/'+transactionHash)
}

function OpenGithubRepo() {
  shell.openExternal('https://github.com/PlusBitPos/wilc-wallet')
}

function OpenTelegram() {
  shell.openExternal('https://t.me/PlusbitWallet')	
}

function OpenTwitter() {
  shell.openExternal('https://twitter.com/PlusBitPos')	
}

function OpenGithubReleases() {
  shell.openExternal('https://github.com/PlusBitPos/wilc-wallet/releases')
}

function OpenHunterGithub() {
  shell.openExternal('https://github.com/PlusBitPos')
}

function OpenMyEtherWallet() {
  shell.openExternal('https://www.myetherwallet.com/create-wallet')
}


function CheckForUpdates() {
  var versionFile = "https://raw.githubusercontent.com/hunterlong/storj-wallet/master/VERSION";
  $.get(versionFile, function(data, status){
      var verCheck = data.replace(/^\s+|\s+$/g, '');
        if (version != verCheck) {
          alert("There's a new Update for WILC Wallet! New Version: "+data);
          OpenGithubReleases();
        } else {
          alert("You have the most current version");
        }
    });
}


setInterval(function() {
    if (myWallet) updateBalance();
}, 90000);


function backbutton() {
    $("#keystoreupload").attr("class", "hidden");
    $("#privatekey").attr("class", "hidden");
	$("#mnemonicupload").attr("class", "hidden");
	
    document.getElementById('kapat').style.display='block';
    document.getElementById('keystorewalletpass').value = '';
    document.getElementById('privatepass').value = '';
    document.getElementById("privatekeyerror").style.display = "none";
    document.getElementById("mnemonicerror").style.display = "none";
    document.getElementById('mnemonicwords').value = '';
    document.getElementById("keystorejsonerror").style.display = "none";
    document.getElementById("openkeystorebtn").style.display = "inline";
    document.getElementById("testid").style.display = "none";
    $("#keystorebtn").html("Open");
    document.getElementById("keystorebtn").disabled = true;

}

function UseKeystore() {
	
	if (navigator.onLine) {
    document.getElementById('kapat').style.display='none';
    $("#keystoreupload").attr("class", "");
    } else {
    $('#interneterrorModal').modal('show');
	document.getElementById('kapat').style.display='block';
    }
}

function UsePrivateKey() {
	if (navigator.onLine) {
    document.getElementById('kapat').style.display='none';
    $("#privatekey").attr("class", "");
    } else {
    $('#interneterrorModal').modal('show');
	document.getElementById('kapat').style.display='block';
    }   
}
   

function UseMnemonic() {
    if (navigator.onLine) {
    document.getElementById('kapat').style.display='none';
    $("#mnemonicupload").attr("class", "");
    } else {
    $('#interneterrorModal').modal('show');
	document.getElementById('kapat').style.display='block';
    }
}


function CopyAddress() {
  clipboardy.writeSync(myWallet.address);
  $(".notify").toggleClass("dactive");
  $("#notifyType").html("Address Copied: " + myWallet.address);
  
  setTimeout(function(){
    $(".notify").removeClass("dactive");
  },1000);
}


function ShowPkey() { 
      clipboardy.writeSync(myWallet.privateKey);
   	  $(".notify").toggleClass("dactive");
      $("#notifyType").html("Private Key Copied: " + myWallet.privateKey);
  
  setTimeout(function(){
    $(".notify").removeClass("dactive");
  },1000);
}

function CloseAcc() {
  window.location.reload();
  
}

function CloseApp() {
    window.close()
}

//qr code popover alanı başladı
const qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 150,
	height : 150
});

function makeQrcode(e) {	
	e.attr("data-address", myWallet.address);
	qrcode.makeCode(e.attr("data-address"));
}
jQuery(document).ready(function(){

	jQuery("[data-toggle='popover']").popover(
		options={
			content: jQuery("#qrcode"),
			html: true // important! popover html content (tag: "#qrcode") which contains an image
		}
	);

	jQuery("[data-toggle='popover']").on("show.bs.popover", function(e) {
		makeQrcode(jQuery(this));
		jQuery("#qrcode").show();
	});
});
//qr code popover alanı bitti


function updateBalance() {
    var address = myWallet.address;
    $(".myaddress").html(address);

    provider.getBalance(address).then(function(balance) {
        var etherString = ethers.utils.formatEther(balance);
        console.log("ETH Balance: " + etherString);
		console.log(provider);
		
        var n = parseFloat(etherString);
        var ethValue = n.toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            {
                minimumFractionDigits: 8
            }
        );
		
        var messageEl = $('#ethbal');
      	var getNumber = ethValue.replace(',', '.');
        // ethBalance = parseFloat(getNumber);
		 ethBalance = parseFloat(etherString);
		messageEl.html(getNumber);
		console.log("Available ETH : " + getNumber);
    });

    
	var callPromise = tokenContract.functions.balanceOf(address);
	console.log(tokenContract);
		
	// getNumber = null;
    callPromise.then(function(result) {
        var trueBal = result[0].toString(10);
        var messageEl = $('#storjbal');
        var n = trueBal * 0.00000001;
        console.log("WILC Balance: " + n);
        var atyxValue = n.toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            {
                minimumFractionDigits: 8
            }
        );

        var string = numeral(n).format('0,0.00000000');
        
		
		// var getNumber = atyxValue.replace(',', '.');
        tokenBalance = (n);
		// tokenBalance = parseFloat(n);
        $(".storjspend").html(string);     		
		messageEl.html(string);
		console.log("WILC Full Balance: " + string);

    });

}


   
function LoadTransaction () {
	
	var apiadress = myWallet.address;	
	var apicontract = TOKEN_ADDRESS;
	var apitxlist = 'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress='+apicontract+'&address='+apiadress+'&page=1&offset=20&sort=desc&apikey=3IZW2XJER9QZ7KGHMHMTVW6UDXQ96DPVAE';			
			

	// setInterval(function() {
			
			
	fetch(apitxlist).then(
	res=> {
		res.json().then (
		
		  data=> {
			     console.log("Number of WILC transaction: " + data.result.length); 
			   if(data.result.length > 0) {
				  $(".container").attr("class", "container"); //if WILC Tx available, it brings table html
				} 
			  else {
				  console.log("bunu okuyorsan length = 0, no WILC transaction");
				  $(".nodata").attr("class", "nodata"); //if WILC Tx empty, it brings warning html
				}
				
				  var temp = "";
				  var ikon = "";
				  
				 
				  data.result.forEach((u)=>{
					 
					  var to = u.to.toString();
					  var from = u.from.toString();
					  var addr = String(myWallet.address).toLowerCase(); 				  
					  								  	
	                       if (to === from) {
		                        ikon = '<i class="fas fa-exchange-alt fa-2x" style="color:blue" title="Self Transaction"></i>';
	                       } else if(addr === from && addr !== to) {
		                        ikon = '<i class="fas fa-arrow-circle-up fa-2x" style="color:#E9223A" title="Sent"></i>';
	                       } else if(addr === to && addr !== from) {
		                        ikon = '<i class="fas fa-arrow-circle-down fa-2x" style="color:#05c0a5" title="Received"></i>';
	                       } else ikon = 'No Data';
	
			
					  temp += "<tr>"
					  temp += "<td>" + ikon + "</td>";
					  temp += "<td>" + u.hash + "</td>";
					  temp += "<td>" + (u.value /100000000).toFixed(8) + "</td>";
					  temp += "<td>" + u.from + "</td>";
					  temp += "<td>" + u.to + "</td>";
					  temp += "<td>" + moment.unix(u.timeStamp).format("LLL") + "</td></tr>";
				  });
				  
				  document.getElementById("wilctxnresults").innerHTML = temp;
		                  }  
		           )
	        }
      )

	  
// }, 60000);
}    

function SuccessAccess() {
    $(".options").hide();
	$(".createwalletarea").hide();
    $(".walletInput").hide();
    $("#addressArea").attr("class", "addressArea");
	$("#closeArea").attr("class", "closeArea");
	$("#walletActions").attr("class", "walletActions");
	$("#tokensbalance").attr("class", "tokensbalance");
	
	$('#showqr').attr('data-original-title', myWallet.address); //qr code title için gerekli
	
	LoadTransaction (); 
	
}

//------------------------------------------------
var keyFile;
function OpenKeystoreFile() {

    dialog.showOpenDialog(function (fileNames) {
          keyFile = fileNames[0];
		  
		  if(keyFile === undefined){
                  console.log("No file selected");
				  document.getElementById("keystorebtn").disabled = true;
 
          } else{
				  console.log("File selected: " + keyFile);
				  $(".test").html('<i class="fas fa-check-circle"></i> File uploaded');
		          document.getElementById("openkeystorebtn").style.display = "none";
                  document.getElementById("testid").style.display = "inline";
				  document.getElementById("keystorebtn").disabled = false;	 
                }
      });
}

//------------------------------------------------
function callback(progress) {
    $("#keystorebtn").html("Decrypting: " + parseInt(progress * 100) + "%" );
    console.log("Decrypting: " + parseInt(progress * 100) + "% complete");
    process.stdout.write("Decrypting: " + parseInt(progress * 100) + "% complete\r");
}

//------------------------------------------------
function UnlockWalletKeystore() {
 const ethers = require('ethers');
 var password = $("#keystorewalletpass").val();
 
 
if (password!=''){
		try
            {
                var buffer = fs.readFileSync(keyFile);
                let encwallet = JSON.parse(buffer);
                console.log(encwallet);
                var json = JSON.stringify(encwallet);
                console.log(json);
	
			
				ethers.Wallet.fromEncryptedJson(json, password, callback).then(function(wallet) {
	            myWallet = wallet;
                SuccessAccess();
				updateBalance();
				console.log("Opened Address: " + wallet.address);
				console.log(wallet.privateKey);			
               }).catch (e => {
                    // console.error(e);
			        $("#keystorejsonerror").html('<i class="fas fa-exclamation-circle"></i> Invalid Wallet Password')
                    $("#keystorejsonerror").show();
			        $("#keystorebtn").html("Open");
			        document.getElementById('keystorewalletpass').value = '';	
					document.getElementById("openkeystorebtn").style.display = "inline";
					document.getElementById("testid").style.display = "none";
					document.getElementById("keystorebtn").disabled = true;
					
			         setTimeout(function(){
                     $("#keystorejsonerror").hide();
                     },3000);
			
			         })
			}
 
            catch {
            
                $("#keystorejsonerror").html('<i class="fas fa-exclamation-circle"></i> Invalid Json File, try with correct file')
                    $("#keystorejsonerror").show();
			        $("#keystorebtn").html("Open");
			        document.getElementById('keystorewalletpass').value = '';
					document.getElementById("openkeystorebtn").style.display = "inline";
					document.getElementById("testid").style.display = "none";
					document.getElementById("keystorebtn").disabled = true;
				setTimeout(function(){
                     $("#keystorejsonerror").hide();
                     },3000);
					 
            }
} 

else { 
        $("#keystorejsonerror").html('<i class="fas fa-exclamation-circle"></i> Enter Wallet Password')
        $("#keystorejsonerror").show();
        $("#keystorebtn").html("Open");
        
		setTimeout(function(){
        $("#keystorejsonerror").hide();
        },2000);	
}

}

//------------------------------------------------
function OpenPrivateKey() {
    var key = $("#privatepass").val();
    if (key.substring(0, 2) !== '0x') {
        key = '0x' + key;
    };
	
    if (key != '' && key.match(/^(0x)?[0-9A-fa-f]{64}$/)) {
        try {
            myWallet = new Wallet(key);
            console.log("Opened: " + myWallet.address)
			console.log("Pkey: " + myWallet.privateKey)

			
        } catch (e) {
            console.error(e);
			      
        }
		
        SuccessAccess();
        updateBalance();
    } 
	
	else {
      $("#privatekeyerror").show();
	  $("#privatekeyerror").html('<i class="fas fa-exclamation-circle"></i> Invalid or Empty Private Key')
  
        setTimeout(function(){
        $("#privatekeyerror").hide();
        },2000);
        
		document.getElementById('privatepass').value = '';
    }

}

//------------------------------------------------
function UnlockMnemonic() {
var mnemonic = $("#mnemonicwords").val();

if (mnemonic!=''){	
try {
               let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
               mnemonicWallet.provider = provider;
               myWallet = mnemonicWallet;
			   console.log('wordlist===>', mnemonicWallet);
			   SuccessAccess();
               updateBalance(); 
               console.log("Opened Address: " + mnemonicWallet.address);
			   console.log(mnemonicWallet.privateKey);
			   
			   
	
               
} catch (e) {
            // console.error(e);
			$("#mnemonicerror").html('<i class="fas fa-exclamation-circle"></i> Invalid Mnemonic Phrase');
            $("#mnemonicerror").show();
			
			
		setTimeout(function(){
        $("#mnemonicerror").hide();
        },2000);
		
		document.getElementById('mnemonicwords').value = '';
            }
                         
} 

else {
        $("#mnemonicerror").html('<i class="fas fa-exclamation-circle"></i> Enter Mnemonic Words')
        $("#mnemonicerror").show(); 
        setTimeout(function(){
        $("#mnemonicerror").hide();
        },2000);
     }

}


function reject() {
  $("#keystorejsonerror").html("Incorrect Password for Keystore Wallet")
  $("#keystorejsonerror").show();
  $("#keystorebtn").prop("disabled", false);
  $("#keystorebtn").html("Open");
}


function ConfirmButton(elem) {
    $(elem).html("CONFIRM")
    $(elem).attr("class", "btn btn-success")
}

function checkButton(spendable, btn) {
	const send = $("#send_ether_amount");
	const to = $('#send_ether_to').val();
		
	btn.prop("disabled", !(send.val() <= spendable && spendable >= 0 && send.val() != '' && to !='') );

}

// function GetEthGas() {
	
	// var to = $('#send_ether_to').val();
    // var price = $("#ethgasprice").val();
    // var gaslimit = 21000;
    // var txfee = price * gaslimit;
    // $("#ethtxfee").val((txfee * 0.000000001).toFixed(8));
	
	// var send = $("#send_ether_amount");
	// var fee = $("#ethtxfee").val();
	// var spendable = ethBalance - fee;
	
	// checkButton(spendable, $("#sendethbutton"));

    // UpdateAvailableETH();
    // return false;
// }

function GetEthAddress() {
	 var send = $("#send_ether_amount");
	 var to = $('#send_ether_to').val();
	 var fee = $("#ethtxfee").val();
	 var spendable = ethBalance - fee;
	 
	checkButton(spendable, $("#sendethbutton"));

}

function CheckETHAvailable() {
	var to = $('#send_ether_to').val();
	var send = $("#send_ether_amount");
	var fee = $("#ethtxfee").val();
	var spendable = ethBalance - fee;
	
	checkButton(spendable, $("#sendethbutton"));
	
}

function clearInputField() {
	$("#sendethbutton").prop("disabled", true);
	$("#sendtokenbutton").prop("disabled", true);
	$("#send_ether_amount").val("");
	$("#send_ether_to").val("");
	$("#send_amount_token").val("");
	$("#send_to_token").val("");
	document.getElementById("averagegas").selected = true;
	document.getElementById("averagegas1").selected = true;
}

var lastTranx;

function SendEthereum(callback) {
    var fee = $("#ethtxfee").val();
    var to = $('#send_ether_to').val();
    var amount = $('#send_ether_amount').val();
	var amountWei = ethers.utils.parseEther(amount);
	try {
		var targetAddress = ethers.utils.getAddress(to);
		} catch (error) {
		   $('#ethermodal').modal('hide');
		   $('#txnerrorModal').modal('show');
		   clearInputField();
		  return;
        }	
	
    $("#sendethbutton").prop("disabled", true);
    var price = parseInt($("#ethgasprice").val()) * 1000000000;
	  console.log(targetAddress);
	  console.log(amountWei);
	  console.log(price);

	var transaction = {
            to: targetAddress,
            value: amountWei,
            gasLimit: 21000,
            gasPrice: price,

        };
	
    if (to != '' && amount != '' && parseFloat(amount) <= ethBalance) {
	
    myWallet = myWallet.connect(provider); 	
	myWallet.sendTransaction(transaction).then(function(transactionHash) {
       console.log(transactionHash); 
	   console.log(transactionHash.hash);
	        $('#ethermodal').modal('hide');
            $(".txidLink").html(transactionHash.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+transactionHash.hash+"')");
            $("#senttxamount").html(amount);
			$("#txgasfee").html(fee);
			$("#txfromaddress").html(myWallet.address);
            $("#txtoaddress").html(to);
            $("#txtype").html("ETH");
            $('#trxsentModal').modal('show');
            // updateBalance();	
			setTimeout(updateBalance, 30000); //opsiyonel, eğer çabuk değişim görmek istiyorsan kullan			
});
	 
	        clearInputField();

  } 
}

// function GetTokenGas() {
	// var send = $("#send_amount_token");
    // var price = $("#tokengasprice").val();
    // var gaslimit = 65000;
    // var txfee = price * gaslimit;
    // $("#tokentxfee").val((txfee * 0.000000001).toFixed(8));
		
		// if (ethBalance > $("#tokentxfee").val() && ethBalance > 0 && send.val() <= tokenBalance && tokenBalance >= 0 && send.val() != '' && $('#send_to_token').val() !='') {
        // $("#sendtokenbutton").prop("disabled", false);
		// } else {
			// $("#sendtokenbutton").prop("disabled", true);
		// }
    
	// UpdateTokenFeeETH();
    // return false;

// }
				
function GetTokenAddress() {
	 var send = $("#send_amount_token");
	 var to = $('#send_to_token').val();
	 if (ethBalance > $("#tokentxfee").val() && ethBalance > 0 && send.val() <= tokenBalance && tokenBalance >= 0 && send.val() != '' && to !='') {
        $("#sendtokenbutton").prop("disabled", false);
		} else {
		$("#sendtokenbutton").prop("disabled", true);
		}
}

function CheckTokenAvailable() {
	var send = $("#send_amount_token");
	var fee = $("#tokentxfee").val();
	
    if (ethBalance > fee && ethBalance > 0 && send.val() <= tokenBalance && tokenBalance >= 0 && send.val() != '' && $('#send_to_token').val() !='') {
        $("#sendtokenbutton").prop("disabled", false);
    } else {
        $("#sendtokenbutton").prop("disabled", true);
    }
	
}

function SendToken(callback) {
	var fee = $("#tokentxfee").val();
    var to = $('#send_to_token').val();
    var amount = $('#send_amount_token').val();
    $("#sendtokenbutton").prop("disabled", true);
    var price = parseInt($("#tokengasprice").val()) * 1000000000;

    if (to != '' && amount != '' && parseFloat(amount) <= tokenBalance) {
        try {
		var targetAddress = ethers.utils.getAddress(to);
		} catch (error) {
		   $('#storjmodal').modal('hide');
		   $('#txnerrorModal').modal('show');
		   clearInputField();
		  return;
        }	
		
		myWallet = myWallet.connect(provider); // without this line, myWallet doesn't have a provider object attached to it
		
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, myWallet);
        tokenContract.transfer(targetAddress, (parseFloat(amount) * 100000000), {
            gasPrice: price,
            gasLimit: 65000,
        }).then(function(transactionHash) {
            console.log(transactionHash);
            $('#storjmodal').modal('hide')
            $(".txidLink").html(transactionHash.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+transactionHash.hash+"')");
            $("#senttxamount").html(amount);
			$("#txgasfee").html(fee);
			$("#txfromaddress").html(myWallet.address);
            $("#txtoaddress").html(to);
            $("#txtype").html("WILC");
            $('#trxsentModal').modal('show');
		    // updateBalance();
			setTimeout(updateBalance, 30000); //opsiyonel, eğer çabuk değişim görmek istiyorsan kullan
        }); 
		        setTimeout(LoadTransaction, 60000);
			
    }
		        clearInputField();
                

}


function UpdateAvailableETH() {
     var apigasfee = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=KKCRSY1MNV21HCZZS6M7DQEHDU8SGA85Q3';			
			
	
	fetch(apigasfee).then(res=> {
		res.json().then (data=> {
			
			var lowfee = data.result.SafeGasPrice;
			var mediumfee = data.result.ProposeGasPrice;
			var fastfee = data.result.FastGasPrice;
			
			var lowqwei = ((lowfee * 0.000000001)*21000).toFixed(8);
			var mediumqwei = ((mediumfee * 0.000000001)*21000).toFixed(8);
			var fastqwei = ((fastfee * 0.000000001)*21000).toFixed(8);
			
			console.log("LOW QWEI: " + lowfee); 
			console.log("MEDIUM QWEI: " + mediumfee); 
			console.log("FAST QWEI: " + fastfee); 
			
			console.log("LOW FEE: " + lowqwei); 
			console.log("MEDIUM FEE: " + mediumqwei); 
			console.log("FAST FEE: " + fastqwei); 
			
			document.getElementById("ethgasprice").value = mediumfee;
			document.getElementById("ethtxfee").value = mediumqwei;
			var fee = $("#ethtxfee").val();
			var available = ethBalance - fee;
			$(".ethspend").html(available.toFixed(8));
			
			CheckETHAvailable()
				
			document.getElementById('selectid2').addEventListener('change', function (e) {
			  if (e.target.value === "1") {
				document.getElementById("ethgasprice").value = lowfee;
				document.getElementById("ethtxfee").value = lowqwei;
				var fee = $("#ethtxfee").val();
				var available = ethBalance - fee;
				$(".ethspend").html(available.toFixed(8));
				CheckETHAvailable()				
			  } else if (e.target.value === "2") {
				document.getElementById("ethgasprice").value = mediumfee;
				document.getElementById("ethtxfee").value = mediumqwei;
				var fee = $("#ethtxfee").val();
				var available = ethBalance - fee;
				$(".ethspend").html(available.toFixed(8));	
				CheckETHAvailable()
			  } else if (e.target.value === "3") {
				document.getElementById("ethgasprice").value = fastfee;
				document.getElementById("ethtxfee").value = fastqwei;
				var fee = $("#ethtxfee").val();
				var available = ethBalance - fee;
				$(".ethspend").html(available.toFixed(8));
				CheckETHAvailable()				
			  }
			});
		})
	})
	
	
	
}


function UpdateTokenFeeETH() {
    var apigasfee = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=KKCRSY1MNV21HCZZS6M7DQEHDU8SGA85Q3';			
			
	
	fetch(apigasfee).then(res=> {
		res.json().then (data=> {
			
			var lowfee = data.result.SafeGasPrice;
			var mediumfee = data.result.ProposeGasPrice;
			var fastfee = data.result.FastGasPrice;
			
			var lowqwei = ((lowfee * 0.000000001)*65000).toFixed(8);
			var mediumqwei = ((mediumfee * 0.000000001)*65000).toFixed(8);
			var fastqwei = ((fastfee * 0.000000001)*65000).toFixed(8);
			
			console.log("LOW QWEI: " + lowfee); 
			console.log("MEDIUM QWEI: " + mediumfee); 
			console.log("FAST QWEI: " + fastfee); 
			
			console.log("LOW FEE: " + lowqwei); 
			console.log("MEDIUM FEE: " + mediumqwei); 
			console.log("FAST FEE: " + fastqwei); 
			
			document.getElementById("tokengasprice").value = mediumfee;
			document.getElementById("tokentxfee").value = mediumqwei;
			var fee = $("#tokentxfee").val();
			var available = ethBalance - fee;
			$(".ethavailable").each(function(){
			  $(this).html(available.toFixed(8));
			});
			CheckTokenAvailable()
				
			document.getElementById('selectid').addEventListener('change', function (e) {
			  if (e.target.value === "1") {
				document.getElementById("tokengasprice").value = lowfee;
				document.getElementById("tokentxfee").value = lowqwei;
				var fee = $("#tokentxfee").val();
				var available = ethBalance - fee;
				$(".ethavailable").each(function(){
				  $(this).html(available.toFixed(8));
				});
				CheckTokenAvailable()				
			  } else if (e.target.value === "2") {
				document.getElementById("tokengasprice").value = mediumfee;
				document.getElementById("tokentxfee").value = mediumqwei;
				var fee = $("#tokentxfee").val();
				var available = ethBalance - fee;
				$(".ethavailable").each(function(){
				  $(this).html(available.toFixed(8));
				});	
				CheckTokenAvailable()
			  } else if (e.target.value === "3") {
				document.getElementById("tokengasprice").value = fastfee;
				document.getElementById("tokentxfee").value = fastqwei;
				var fee = $("#tokentxfee").val();
				var available = ethBalance - fee;
				$(".ethavailable").each(function(){
				  $(this).html(available.toFixed(8));
				});
				CheckTokenAvailable()				
			  }
			});
		})
	})
}






