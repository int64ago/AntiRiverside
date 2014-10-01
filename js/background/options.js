
// Refer: https://code.google.com/p/riverside-plus/

var Storage = {
	getBoolean: function(key, defaultValue){
		var value = localStorage.getItem(key);
		if(!value) return defaultValue;
		return value == "true"? true: false;
	},
	setBoolean: function(key, value){
		localStorage.setItem(key, value.toString());
	},

	getString: function(key, defaultValue){
		var value = localStorage.getItem(key);
		if(!value) return defaultValue;
		return value;
	},
	setString: function(key, value){
		localStorage.setItem(key, value);
	},

	getArray: function(key, defaultValue){
		var value = localStorage.getItem(key);
		if(!value) return defaultValue;
		return JSON.parse(value);
	},
	setArray: function(key, value){
		localStorage.setItem(key, JSON.stringify(value));
	}
};

var Options =
{
	init: function(){
		for(key in this.Properties)
			this.Properties[key] = this.get(key);
	},
	get: function(key){
		var valueType = typeof(this.Properties[key]);
		switch(valueType){
			case "boolean": {
				return Storage.getBoolean(key, this.Properties[key]);
			}
			case "string": {
				return Storage.getString(key, this.Properties[key]);
			}
			case "object": {
				return Storage.getArray(key, this.Properties[key]);
			}
			default: {
				console.log("Get wrong value type: " + valueType);
			}
		};
	},
	set: function(key, newValue){
		var valueType = typeof(newValue);
		switch(valueType){
			case "boolean": {
				Storage.setBoolean(key, newValue);
				this.Properties[key] = newValue;
				break;
			}
			case "string": {
				Storage.setString(key, newValue);
				this.Properties[key] = newValue;
				break;
			}
			case "object": {
				Storage.setArray(key, newValue);
				this.Properties[key] = newValue;
				break;
			}
			default: {
				console.log("Set wrong value type: " + valueType);
			}
		};
	},
	Properties: {
		// Basic
		ShowMsg: true, ShowDeskMsg: false, Signature: "",
		// Filter
		PostsByUsers: [], SignaturesOfUsers: [], UsersFocused: [],
		// Advance
		Backup: "", Markdown: false,
		// Others
		CurUser: "", Root: "http://bbs.stuhome.net/", TidList: []
	}
};

Options.init();

chrome.extension.onMessage.addListener(
	function(message, sender, sendResponse){
		if(message.name && message.name == "getOptions"){
			sendResponse(Options.Properties);
		}else if(message.name && message.name == "backupInfo"){
			ShowBackupNotification(message.optionNames);
		}else if(message.name && message.name == "addTidList"){
			var list = Options.get("TidList");
			list.push(message.optionNames);
			Options.set("TidList", list);
		}
	}
);