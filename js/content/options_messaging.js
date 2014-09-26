
// Refer: https://code.google.com/p/riverside-plus/

// options_messaging.js
// Send messages to the background page 

function getOptions(names, responseCallback){
	(chrome.extension.sendMessage || chrome.extension.sendRequest)(
		{name: "getOptions", optionNames: names}, responseCallback);
}
var curUser = "";
getOptions([
	"Basic.Signature", "Filter.PostsByUsers",
	"Filter.SignaturesOfUsers", "Filter.UsersFocused",
	"Advance.Backup", "Advance.Markdown", "CurUser"
	], function(options){
		curUser = options.CurUser;
		//console.log(options);
		if(options.CurUser != "" && options.Signature != "")
			addSigature(options.Signature);
		if(options.CurUser != "" && options.Backup != "")
			backupPost(options.Backup);
		//other options
	}
);

