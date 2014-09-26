
//The html is compressed, you should format it before reading
var viewTemplate = '<ul class="timeline"><li class="i-direction"><div class="timeline-badge"><b><i class="i-order">1</i></b></div><div class="timeline-panel"><div class="timeline-heading"><h4 class="timeline-title">测试标题</h4><p><small class="text-muted"><i class="glyphicon glyphicon-time"></i> <span class="i-post-time">2014-09-25 23:23:45</span> <i class="glyphicon glyphicon-user"></i> <span class="i-user">测试用户</span> <a class="i-link" href="#" target="_blank" title="原文链接"><i class="glyphicon glyphicon-link"></i></a></small></p></div><div class="timeline-body"><p class="i-text" style="display:inline">测试文本</p><p class="i-code" style="display:none">测试代码</p><hr><div class="btn-group"><button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown"><span class="i-select">文本模式</span><span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a class="i-text-select" href="#">文本模式</a></li><li><a class="i-code-select" href="#" data-toggle="tooltip"              data-placement="left" title="只对帖子作者有效">代码模式</a></li><li class="divider"></li><li><a class="i-copypaste" href="#">复制</a></li></ul></div><span class="label label-success" style="display:none">复制成功</span><span><i class="i-backup-time">2014-09-21 23:23:43</i></span></div></div></li></ul>';
var bg = chrome.extension.getBackgroundPage();
(function(argument){
	//var templateObj = $(viewTemplate);
	var url = "http://riverside.sinaapp.com/down?uid=" + bg.Options.CurUser;
	$.get(url, function(data, status){
		var links = JSON.parse(data);
		console.log(links);

		//get left space
		var getLimitUrl = "http://riverside.sinaapp.com/limit?uid=" + bg.Options.CurUser;
		$.get(getLimitUrl, function(data, status){
			if(data == "0"){
				$("#i-space").text("unlimited");
			}else{
				var leftSpace = parseInt(data) - links.length;
				if(leftSpace < 0) leftSpace = 0;
				$("#i-space").text(leftSpace);
			}
		});
		// http://riverside.qiniudn.com/<username>#link
		for(var link in links){
			(function(_link){
				var linkUrl = "http://riverside.qiniudn.com/" + links[_link];
				$.get(linkUrl, function(data, status){
					var linkData = JSON.parse(data);
					var templateObj = $(viewTemplate);
					templateObj.find(".timeline-title").text(linkData.subject);
					templateObj.find(".i-post-time").text(linkData.postTime);
					templateObj.find(".i-backup-time").text(linkData.backupTime);
					templateObj.find(".i-user").text(linkData.author);
					templateObj.find(".i-link").attr({"href": linkData.postUrl});
					templateObj.find(".i-text").text(linkData.postText);
					templateObj.find(".i-code").text(linkData.postCode);
					templateObj.find(".i-order").text(_link);
					console.log(_link);
					if(_link % 2 == 0)
						templateObj.find(".i-direction").attr({"class": "i-direction timeline-inverted"});
					// insert to main page
					$(".page-header").after(templateObj);
				});
			}(link));
		}
	});
}());