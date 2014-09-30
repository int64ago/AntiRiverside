
var bg = chrome.extension.getBackgroundPage();
$(function(){
	if(bg.iMsgBoxNum == "0" && bg.iNoticeBoxNum == "0"){
		chrome.tabs.create({
			url: bg.Options.Properties.Root
		});
	}else{
		$("#i-message-box").text(bg.iMsgBoxNum);
		$("#i-notice-box").text(bg.iNoticeBoxNum);
		if(bg.iMessagesBox.length){
			var from = "";
			for(var msg in bg.iMessagesBox)
				from += "[" + bg.iMessagesBox[msg] + "]";
			$("#i-message-box").parent().attr({"title": from});
		}else{
			$("#i-message-box").parent().attr({"title": "无消息"});
		}
	}
	$(".i-remove").on("click", function(){
		var item = $(this).parent().find("span");
		if(item.attr("id") == "i-message-box"){
			for(var key in bg.iMessagesBox){
				makeMessageAsRead(key);
				bg.UpdateMessageCount();
			}
		}else if(item.attr("id") == "i-notice-box"){
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