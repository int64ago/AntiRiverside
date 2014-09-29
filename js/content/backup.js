
// may used in future
jQuery.fn.nl2br = function(){
   return this.each(function(){
     jQuery(this).val().replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\n");
   });
};
function backupPost(aesPasswd){
	var authorId = null;
	$("#postlist > div[class!='pl']").each(function(){
		$(this).find(".pi strong").before("<strong><a id='post-backup' href='javascript:void(0);'>备份帖子</a></strong>");
		var pls = $(this).find(".pls"); // author info
		var plc = $(this).find(".plc"); // post info

		authorId == null? $(this).attr("id") : authorId;
		var curId = $(this).attr("id");

		var curUrl = (function(_this){
			var locHref = location.href;
			var lastPos = locHref.indexOf("#") == -1 ? locHref.length:locHref.indexOf("#");
			return locHref.substring(0, lastPos) + "#" + _this.attr("id");
		}($(this)));

		$(this).find("#post-backup").on("click", function(){
			var BackupInfo = {};
			BackupInfo.backupTime = (function(){
				var d = new Date();
				return d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() +
				" " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
			}());
			BackupInfo.subject = (curId == authorId? "" : "[Re]") + $("#thread_subject").text();
			BackupInfo.author = pls.find(".authi .xw1").text();
			BackupInfo.postTime = plc.find(".authi em span").attr("title");
			BackupInfo.postUrl = curUrl;
			// Get post text without quote
			BackupInfo.postText = plc.find(".pct .t_f").clone().find(".quote").remove().end().text();
			// For the problem of JSON.stringify, we replace [ ] with <-< >-> in code-text
			BackupInfo.postCode = "";
			var editp = plc.find(".editp");
			if(editp.length != 0){
				$.get(editp.attr("href"),function(data, status){
					var code = data.match(/<textarea name="message"[\s\S]*?>([\s\S]*?)<\/textarea>/);
					BackupInfo.postCode = code.length != 2? "":code[1];
					BackupInfo.postCode = BackupInfo.postCode.replace(/\[/g, "<-<");
					BackupInfo.postCode = BackupInfo.postCode.replace(/]/g, ">->");
					doBackup(BackupInfo);
				});
			}else{
				doBackup(BackupInfo);
			}

			function doBackup(info){
				var url = "http://riverside.sinaapp.com/up?uid=" + ContOptions.CurUser;
				console.log(url);
				var xhr = new XMLHttpRequest();
				xhr.open("POST", url, true);
				xhr.onreadystatechange = (function(){
					if(this.readyState == XMLHttpRequest.DONE){
						if(this.status == 200 && this.responseText != "checkfailed"){
							console.log(this.responseText);
							chrome.extension.sendMessage(
							{name: "backupInfo", optionNames: "备份成功:)"});
						}else{
							console.log(this.responseText);
							chrome.extension.sendMessage(
							{name: "backupInfo", optionNames: "备份【失败】！！！"});
						}
					}
				});
				var encrypted = CryptoJS.AES.encrypt(JSON.stringify(info), aesPasswd);
				xhr.send(encrypted);
			}
		});
	});
}