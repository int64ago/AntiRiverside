
var bg = chrome.extension.getBackgroundPage();
$(function(){
	if(bg.iMsgBoxNum == "0" && bg.iNoticeBoxNum == "0" && bg.iFocusPostBox.length == 0){
		chrome.tabs.create({
			url: bg.Options.Properties.Root
		});
	}else{
		$("#i-message-box").text(bg.iMsgBoxNum);
		$("#i-notice-box").text(bg.iNoticeBoxNum);
		if(bg.iNoticeBoxNum != "0")
			$("#i-notice-box").parent().attr({"title": "点击查看"});
		// Update user list as a title
		if(bg.iMessagesBox.length){
			var from = "";
			for(var msg in bg.iMessagesBox)
				from += "[" + bg.iMessagesBox[msg] + "]";
			$("#i-message-box").parent().attr({"title": from});
		}else{
			$("#i-message-box").parent().attr({"title": "无消息"});
		}
		if(bg.iFocusPostBox.length){
			for(var msg in bg.iFocusPostBox){
				var tid = bg.iFocusPostBox[msg]["tid"];
				var author = bg.iFocusPostBox[msg]["author"];
				var text = bg.iFocusPostBox[msg]["text"];
				var url = bg.Options.Properties.Root + "forum.php?mod=viewthread&tid=" + tid;
				var temp = '<a class="i-focus" title="_author" href="_url">_text</a><br>';
				temp = temp.replace("_author", author).replace("_url", url).replace("_text", text);
				$("hr").after(temp);
			}
		}
		$(".i-focus").on("click", function(){
			var tid = $(this).attr("href").match(/tid=(\d+)/)[1];
			chrome.extension.sendMessage({name: "addTidList", optionNames: tid});
			bg.getFocusPosts();
			$(this).remove();
			chrome.tabs.create({
				url: $(this).attr("href")
			});
		});
	}
	$(".i-remove").on("click", function(){
		var item = $(this).parent().find("span");
		if(item.attr("id") == "i-message-box"){
			$("#i-message-box").text("0");
			for(var key in bg.iMessagesBox){
				makeMessageAsRead(key);
				bg.UpdateMessageCount();
			}
		}else if(item.attr("id") == "i-notice-box"){
			$("#i-notice-box").text("0");
			makeNoticeAsRead();
			bg.UpdateMessageCount();
		}
	});
});

function makeMessageAsRead(uid){
	var url = bg.Options.Properties.Root +
				"home.php?mod=space&do=pm&subop=view&touid=" + uid;
	$.get(url, function(data, status){});
}

function makeNoticeAsRead(){
	var readList = ["post", "at", "pcomment", "activity", "reward", "goods"];
	for(var list in readList){
		var url = bg.Options.Properties.Root +
					"home.php?mod=space&do=notice&view=mypost&type=" +
					readList[list];
		$.get(url, function(data, status){});
	}
}