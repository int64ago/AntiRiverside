$(function(){
	var bg = chrome.extension.getBackgroundPage();
	if(bg.iMsgBoxNum == "0" && bg.iNoticeBoxNum == "0"){
		chrome.tabs.create({
			url: bg.Options.Properties.Root
		});
	}else{
		$("#i-message-box").text(bg.iMsgBoxNum);
		$("#i-notice-box").text(bg.iNoticeBoxNum);
	}
});
