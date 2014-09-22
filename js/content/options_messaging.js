
// Refer: https://code.google.com/p/riverside-plus/

// options_messaging.js
// Send messages to the background page 

function getOptions(names, responseCallback){
	(chrome.extension.sendMessage || chrome.extension.sendRequest)(
		{name: "getOptions", optionNames: names}, responseCallback);
}
getOptions([
	"Basic.Signature", "Filter.PostsByUsers",
	"Filter.SignaturesOfUsers", "Filter.UsersFocused",
	"Advance.Backup", "Advance.Markdown"
	], function(options){
		//console.log(options);
		if(options.Signature != "")
			addSigature(options.Signature);
		//other options
	}
);

