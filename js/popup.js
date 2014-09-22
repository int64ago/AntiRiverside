$(function(){
	var bg = chrome.extension.getBackgroundPage();
	if(bg.iMsgBoxNum == "0" && bg.iNoticeBoxNum == "0"){
		chrome.tabs.create({
			url: 'http://bbs.stuhome.net/'
		});
	}else{
		$("#i-message-box").text(bg.iMsgBoxNum);
		$("#i-notice-box").text(bg.iNoticeBoxNum);
	}
});
