
// This html is compressed, you should format it before reading
var viewTemplate = '<ul class="timeline" id="none" ><li class="i-direction"><div class="timeline-badge"><b><i class="i-order">1</i></b></div><div class="timeline-panel"><div class="timeline-heading"><h4 class="timeline-title">测试标题</h4><p><small class="text-muted"><i class="glyphicon glyphicon-time"></i> <span class="i-post-time">2014-09-25 23:23:45</span> <i class="glyphicon glyphicon-user"></i> <span class="i-user">测试用户</span> <a class="i-link" href="#" target="_blank" title="原文链接"><i class="glyphicon glyphicon-link"></i></a></small></p></div><div class="timeline-body"><p class="i-text" style="display:inline">测试文本</p><p class="i-code" style="display:none">测试代码</p><hr><div class="btn-group"><button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown"><span class="i-select">文本模式</span><span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a class="i-text-select" href="#">文本模式</a></li><li><a class="i-code-select" href="#" data-toggle="tooltip" data-placement="left" title="只对您的帖子有效">代码模式</a></li><li class="divider"></li><li><a class="i-copypaste" href="#">复制</a></li></ul></div> <span class="label label-success" style="display:none"> 复制成功 </span><span><i class="i-backup-time">2014-09-21 23:23:43</i></span></div></div></li></ul>';
var bg = chrome.extension.getBackgroundPage();

(function(argument){
	var url = "http://riverside.sinaapp.com/down?uid=" + bg.Options.Properties.CurUser;
	$.get(url, function(data, status){
		var links = JSON.parse(data);

		// Get left space and show
		var getLimitUrl = "http://riverside.sinaapp.com/limit?uid=" + bg.Options.Properties.CurUser;
		$.get(getLimitUrl, function(data, status){
			if(data == "0"){
				$("#i-space").text("unlimited");
			}else{
				var leftSpace = parseInt(data) - links.length;
				if(leftSpace < 0) leftSpace = 0;
				$("#i-space").text(leftSpace);
			}
		});

		// Get all backup posts from http://riverside.qiniudn.com/#link
		for(var link in links){
			(function(_link){
				var linkUrl = "http://riverside.qiniudn.com/" + links[_link];
				$.get(linkUrl, function(data, status){
					data = CryptoJS.AES.decrypt(data, bg.Options.Properties.Backup).toString(CryptoJS.enc.Utf8);
					// See content/backup.js for the reason
					data = data.replace(/<-</g, "[").replace(/>->/g, "]");
					var linkData = JSON.parse(data);
					var id = 't' + linkUrl.substring("http://riverside.qiniudn.com/".length).replace(".", "0");
					var curUrlLast = location.href.indexOf("#") == -1? location.href.length: location.href.indexOf("#");
					var curTagUrl = location.href.substring(0, curUrlLast) + "#" + id;
					var templateObj = $(viewTemplate);

					templateObj.attr({"id": id});
					templateObj.find(".i-text-select").attr({"href": curTagUrl});
					templateObj.find(".i-code-select").attr({"href": curTagUrl});
					templateObj.find(".i-copypaste").attr({"href": curTagUrl});

					templateObj.find(".timeline-title").text(linkData.subject);
					templateObj.find(".i-post-time").text(linkData.postTime);
					templateObj.find(".i-backup-time").text(linkData.backupTime);
					templateObj.find(".i-user").text(linkData.author);
					templateObj.find(".i-link").attr({"href": linkData.postUrl});
					templateObj.find(".i-text").text(linkData.postText);
					templateObj.find(".i-code").text(linkData.postCode);
					templateObj.find(".i-order").text(_link);
					if(_link % 2 == 0)
						templateObj.find(".i-direction").attr({"class": "i-direction timeline-inverted"});
					// Insert to main page
					$(".page-header").after(templateObj);
					listenUpdate(id);
				});
			}(link));
		}
	});
}());

function copyTextToClipboard(text) {
	var copyFrom = document.createElement("textarea");
	copyFrom.textContent = text;
	var body = document.getElementsByTagName('body')[0];
	body.appendChild(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	body.removeChild(copyFrom);
}

function listenUpdate(id){
	id = "#" + id;
	$(id).find(".i-copypaste").on("click", function(){
		var selectVal = $(id).find(".i-select").text();
		var text = "";
		if(selectVal == "文本模式"){
			text = $(id).find(".i-text").text();
		}else{
			text = $(id).find(".i-code").text();
		}
		copyTextToClipboard(text);
		$(id).find(".label-success").fadeIn(1000).fadeOut(2000);
	});
	$(id).find(".i-text-select").on("click", function(){
		$(id).find(".i-code").attr({"style": "display:none"});
		$(id).find(".i-text").attr({"style": "display:inline"});
		$(id).find(".i-select").text("文本模式");
	});
	$(id).find(".i-code-select").on("click", function(){
		$(id).find(".i-text").attr({"style": "display:none"});
		$(id).find(".i-code").attr({"style": "display:inline"});
		$(id).find(".i-select").text("代码模式");
	});
}