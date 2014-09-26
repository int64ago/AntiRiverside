
// Refer: https://code.google.com/p/riverside-plus/

$(function(){
	var bg = chrome.extension.getBackgroundPage();
	var Options = bg.Options;

	var Update = {
		//"id of element":"key of storage"
		SwitchPairs: {
			"#i-show-msg": "Basic.ShowMsg",
			"#i-desktop-msg": "Basic.ShowDeskMsg",
			"#i-enable-markdown": "Advance.Markdown"
		},
		StringPairs: {
			"#i-reply-sig": "Basic.Signature",
			"#i-backup-post": "Advance.Backup"
		},
		ListPairs: {
			"#i-list-filter-post": "Filter.PostsByUsers",
			"#i-list-filter-sig": "Filter.SignaturesOfUsers",
			"#i-list-focus-user": "Filter.UsersFocused"
		},

		_switch: function(id, value){
			$(id).bootstrapSwitch("state", value);
		},
		_string: function(id, value){
			$(id).val(value);
		},
		_list_single: function(id, value){
			var addHtml = "";
			addHtml += '<li class="list-group-item">';
			addHtml += '<span class="username">' + value + '</span>';
			addHtml += '<span class="glyphicon \
						glyphicon-trash i-remove" title="删除"></span>';
			addHtml += '</li>';
			if(addHtml != "")
				$(addHtml).appendTo(id);
		},
		_list: function(id, value){
			for(var v in value){
				this._list_single(id, value[v]);
			}
		},

		allSwitches: function(){
			for(var id in this.SwitchPairs){
				this._switch(id, Options.get(this.SwitchPairs[id]));
			}
		},
		allStrings: function(){
			for(var id in this.StringPairs){
				this._string(id, Options.get(this.StringPairs[id]));
			}
		},
		allLists: function(){
			for(var id in this.ListPairs){
				this._list(id, Options.get(this.ListPairs[id]));
			}
		}
	};

	var OnChange = {
		_switch: function(id){
			$(id).on("switchChange.bootstrapSwitch", function(event, state){
				Options.set(Update.SwitchPairs[id], state);
			});
		},
		_string: function(id){
			$(id).on("input", function(){
				Options.set(Update.StringPairs[id], $(this).val());
			});
		},
		_list: function(id){
			//add
			var _button = $(id).parent().find(".i-add");
			var _input = $(id).parent().find("input");
			_button.click(function(){
				var inputValue = _input.val();
				if(inputValue != ""){
					var value = Options.get(Update.ListPairs[id]);
					if(value.indexOf(inputValue) == -1){
						value.push(inputValue);
						//FIXME not listened after adding
						Update._list_single(id, inputValue);
						Options.set(Update.ListPairs[id], value);
					}else{
						//TODO a warning message?
					}
					_input.val("");
				}
			});

			//del
			$(id).find(".i-remove").click(function(){
				$(this).parent().remove();
				var value = Options.get(Update.ListPairs[id]);
				var userName = $(this).parent().find(".username").val();
				value.splice(value.indexOf(userName), 1);
				Options.set(Update.ListPairs[id], value);
			});
		},

		allSwitches: function(){
			for(var id in Update.SwitchPairs){
				this._switch(id);
			}
		},
		allStrings: function(){
			for(var id in Update.StringPairs){
				this._string(id);
			}
		},
		allLists: function(){
			for(var id in Update.ListPairs){
				this._list(id);
			}
		}
	};

	(function(){ //init
		$("[name='my-checkbox']").bootstrapSwitch(); //init switches
		Update.allSwitches();
		Update.allStrings();
		Update.allLists();
		OnChange.allSwitches();
		OnChange.allStrings();
		OnChange.allLists();
	})();
});