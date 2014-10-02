
// Refer: https://code.google.com/p/riverside-plus/

$(function(){
	var bg = chrome.extension.getBackgroundPage();
	var Options = bg.Options;

	var Update = {
		SwitchPairs: {
			"#i-show-msg": "ShowMsg",
			"#i-desktop-msg": "ShowDeskMsg"
		},
		StringPairs: {
			"#i-reply-sig": "Signature",
			"#i-backup-post": "Backup"
		},
		ListPairs: {
			"#i-list-filter-post": "PostsByUsers",
			"#i-list-filter-sig": "SignaturesOfUsers",
			"#i-list-focus-user": "UsersFocused"
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


	(function(){
		$("[name='my-checkbox']").bootstrapSwitch(); //init switches
		Update.allSwitches();
		Update.allStrings();
		Update.allLists();
		OnChange.allSwitches();
		OnChange.allStrings();
		OnChange.allLists();
		$("#i-to-cloud").on("click", function(){
			if(Options.Properties.CurUser == ""){
				alert("无法同步！可能是【未登录】");
				return;
			}
			var aesPasswd = Options.get("Backup");
			if(aesPasswd == ""){
				alert("无法同步！可能是【未设置密钥】");
				return;
			}
			var localSettings = {};
			localSettings.ShowMsg = Options.get("ShowMsg");
			localSettings.ShowDeskMsg = Options.get("ShowDeskMsg");
			localSettings.Signature = Options.get("Signature");
			localSettings.PostsByUsers = Options.get("PostsByUsers");
			localSettings.SignaturesOfUsers = Options.get("SignaturesOfUsers");
			localSettings.UsersFocused = Options.get("UsersFocused");
			var url = "http://riverside.sinaapp.com/tosetting?uid=" + Options.Properties.CurUser;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.onreadystatechange = (function(){
				if(this.readyState == XMLHttpRequest.DONE && this.status == 200){
					console.log(this.responseText);
				}
			});
			var encrypted = CryptoJS.AES.encrypt(JSON.stringify(localSettings), aesPasswd);
			xhr.send(encrypted);
		});
		$("#i-from-cloud").on("click", function(){
			if(Options.Properties.CurUser == ""){
				alert("无法同步！可能是【未登录】");
				return;
			}
			var aesPasswd = Options.get("Backup");
			if(aesPasswd == ""){
				alert("无法同步！可能是【未设置密钥】");
				return;
			}
			var settingUrl = "http://riverside.sinaapp.com/fromsetting?uid=" + Options.Properties.CurUser;
			$.get(settingUrl, function(_data, _status){
				if(_data == "nosetting"){
					alert("无法同步！可能是【从未上传过配置】");
				}else{
					var dataUrl = "http://riverside.qiniudn.com/" + _data;
					$.get(dataUrl, function(data, status){
						try{
							data = CryptoJS.AES.decrypt(data, aesPasswd).toString(CryptoJS.enc.Utf8);
							var cloudSettings = JSON.parse(data);
						}catch(e){
							console.log(e.name + ":" + e.message);
							alert("无法同步！可能是【密钥错误】");
							return;
						}
						Options.set("ShowMsg", cloudSettings.ShowMsg);
						Options.set("ShowDeskMsg", cloudSettings.ShowDeskMsg);
						Options.set("Signature", cloudSettings.Signature);
						Options.set("PostsByUsers", cloudSettings.PostsByUsers);
						Options.set("SignaturesOfUsers", cloudSettings.SignaturesOfUsers);
						Options.set("UsersFocused", cloudSettings.UsersFocused);
						location.reload();
					}).fail(function(){
						alert("无法同步！可能是【服务器错误】");
					});
				}
			});
		});
	})();
});