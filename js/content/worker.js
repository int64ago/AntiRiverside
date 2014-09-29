

// Global content options
var ContOptions = {};

// Get options from background page
chrome.extension.sendMessage({name: "getOptions"},
	function(options){
		ContOptions = options;
		contentWorker();
		console.log(ContOptions);
	}
);

function contentWorker(){
	if(ContOptions.CurUser && ContOptions.CurUser != ""){
		ContOptions.Signature == "" || addSigature(ContOptions.Signature);
		ContOptions.Backup == "" || backupPost(ContOptions.Backup);
	}
}