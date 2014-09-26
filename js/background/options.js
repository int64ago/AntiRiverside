
// Refer: https://code.google.com/p/riverside-plus/

var storage = 
{
	get: function(item){
		if(!item) //DEBUG
			console.storage("storage.get(undefined)");
		return localStorage.getItem(item);
	}, 
	set: function(item, newValue, syncable){
		if(!item || newValue == null) //DEBUG
			console.error("storage.set(undefined, undefined)");
		var oldValue = this.get(item);
		localStorage.setItem(item, newValue);
		if(this.useChromeStorage && syncable !== false){
			var items = {};
			items[item] = newValue;
			chrome.storage.sync.set(items);
			//NO notification required after sync.set since we handle
			//chrome.storage.onChanged
		}
		else if(this.onChanged && oldValue != newValue)
			this.onChanged(item, newValue, oldValue);
	}, 

	remove: function(item, syncable){
		if(!item) //DEBUG
			console.storage("storage.get(undefined)");
		var oldValue = localStorage[item];
		localStorage.removeItem(item);
		if(this.useChromeStorage && syncable !== false)
			chrome.storage.sync.remove(item);
		else if(this.onChanged && oldValue != undefined)
			this.onChanged(item, undefined, oldValue);
	}, 

	canSync : function(){
		return chrome.storage && chrome.storage.sync && 
		chrome.storage.onChanged;
	}, 

	useChromeStorage : false, 
	init : function(){
		//Initialization is necessary only when chrome.storage is used.
		if(!this.canSync())
			return;
		this.useChromeStorage = true;

		//Handling chrome.storage.onChanged to notify setting changes
		//Note that chrome.storage.onChanged will not fire if a `set` 
		//method is called with the same item value as before, which is
		//consistent with the behavior of storage.onChanged.
		//Note that this event will also fire if settings are changed
		//because of sync. That's why we listen for it.
		chrome.storage.onChanged.addListener(function(changes, namespace){
			if(namespace == "sync")
				for(var item in changes)
				{
					//Set items in localStorage so that new valued can be 
					//read
					localStorage.setItem(item, changes[item].newValue);
					this.onChanged && this.onChanged(item, 
						changes[item].newValue, changes[item].oldValue);
				}
			});
	}, 

	_fromBoolean: function(value, defaultValue){
		if(defaultValue) //defaults to true
			return value != "0" && value != "false";
		else //defaults to false
			return value == "1" || value == "true";
	}, 
	_toBoolean: function(value, defaultValue){
		if(defaultValue) //defaults to true
			return value ? "1" : "0";
		else //defaults to false
			return value ? "1" : "0";
	},

	_fromString: function(value, defaultValue){
		return value || defaultValue;
	}, 
	_toString: function(value, defaultValue){
		return value == defaultValue ? "" : value;
	},

	_fromDefaultEmptyArray: function(value){
		return value ? JSON.parse(value) : [];
	},
	_toDefaultEmptyArray: function(value){
		return (!value || value.length == 0) ? [] : 
		JSON.stringify(value);
	},

	_fromInteger: function(value, defaultValue){
		return value ? parseInt(value) : defaultValue;
	}, 
	_toInteger: function(value, defaultValue){
		return value == defaultValue ? null : value.toString();
	}
};

var Options =
{
	Domain: "bbs.stuhome.net",
	CurUser: "",
	init: function(){
		for(var sec in this.Properties){
			for(var opt in this.Properties[sec]){
				var item = this.Properties[sec][opt];
				item.value = this.get(item.key);
				console.log(item.value);
			}
		}
	},
	get: function(key){
		var item = this.Properties[key.split(".")[0]][key.split(".")[1]];
		var valueType = typeof(item.value);
		switch(valueType){
			case "boolean": {
				return storage._fromBoolean(storage.get(key), item.value);
			}
			case "string": {
				return storage._fromString(storage.get(key), item.value);
			}
			case "object": {
				return storage._fromDefaultEmptyArray(
					storage.get(key), item.value);
			}
			console.log("get wrong value type: " + valueType);
		};
	},
	set: function(key, newValue){ // typeof newValue == typeof item.value
		var item = this.Properties[key.split(".")[0]][key.split(".")[1]];
		var valueType = typeof(newValue);
		switch(valueType){
			case "boolean": {
				storage.set(key, storage._toBoolean(newValue), true);
				item.value = newValue;
				break;
			}
			case "string": {
				storage.set(key, storage._toString(newValue), true);
				item.value = newValue;
				break;
			}
			case "object": {
				storage.set(key, storage._toDefaultEmptyArray(newValue), true);
				item.value = newValue;
				break;
			}
			default: {
				console.log("set wrong value type: " + valueType);
			}
		};
	},
	Properties: {
		Basic: {
			ShowMsg: {
				key: "Basic.ShowMsg",
				value: true
			},
			ShowDeskMsg: {
				key: "Basic.ShowDeskMsg",
				value: false
			},
			Signature: {
				key: "Basic.Signature",
				value: ""
			}
		},
		Filter: {
			PostsByUsers: {
				key: "Filter.PostsByUsers",
				value: []
			},
			SignaturesOfUsers: {
				key: "Filter.SignaturesOfUsers",
				value: []
			},
			UsersFocused: {
				key: "Filter.UsersFocused",
				value: []
			}
		},
		Advance: {
			Backup: {
				key: "Advance.Backup",
				value: true
			},
			Markdown: {
				key: "Advance.Markdown",
				value: false
			}
		}
	}
};

storage.init();
Options.init();


function onOptionsMessage(message, sender, sendResponse)
{
	var response = {};
	if(message.optionNames)
	{
		if(message.optionNames.indexOf("Basic.Signature") != -1)
			response.Signature = Options.Properties.Basic.Signature.value;
		if(message.optionNames.indexOf("Filter.PostsByUsers") != -1)
			response.PostsByUsers = Options.Properties.Filter.PostsByUsers.value;
		if(message.optionNames.indexOf("Filter.SignaturesOfUsers") != -1)
			response.SignaturesOfUsers = Options.Properties.Filter.SignaturesOfUsers.value;
		if(message.optionNames.indexOf("Filter.UsersFocused") != -1)
			response.UsersFocused = Options.Properties.Filter.UsersFocused.value;
		if(message.optionNames.indexOf("Advance.Backup") != -1)
			response.Backup = Options.Properties.Advance.Backup.value;
		if(message.optionNames.indexOf("Advance.Markdown") != -1)
			response.Markdown = Options.Properties.Advance.Markdown.value;
		if(message.optionNames.indexOf("CurUser") != -1)
			response.CurUser = Options.CurUser;
	}
	console.log(response);
	sendResponse(response);
}

(chrome.extension.onMessage || chrome.extension.onRequest).addListener(
function(message, sender, sendResponse){
	if(message.name && message.name == "getOptions")
		onOptionsMessage(message, sender, sendResponse);
	else if(message.name && message.name == "backupInfo"){
		ShowBackupNotification(message.optionNames);
	}
});
