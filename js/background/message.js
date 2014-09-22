
// Refer: https://code.google.com/p/riverside-plus/

//for updating popup.html
var iMsgBoxNum = "0";
var iNoticeBoxNum = "0";

function UpdateBrowserAction(state, badge)
{
	badge = Options.Properties.Basic.ShowMsg.value ? badge: "";
	chrome.browserAction.setBadgeText({text: badge || ""});
	state && chrome.browserAction.setIcon({path: state == "online" ? 
		"images/icon19.png" : "images/grey.png"});
}

function UpdateMessageCount()
{
	XHR.SendRequest("/home.php?mod=space&do=pm", function(xhr){
		var user = xhr.responseText.match(/访问我的空间/);
		var notice = xhr.responseText.match(/提醒\((\d+)\)/);
		var pm = xhr.responseText.match(/<strong class="xi1">\((\d+)\)<\/strong>/);
		console.log("user:" + user);
		console.log("notice:" + notice);
		console.log("pm:" + pm);
		iMsgBoxNum = pm? pm[1]:"0";
		iNoticeBoxNum = notice? notice[1]:"0";
		if(notice || pm)
		{
			var num = (notice?parseInt(notice[1]):0) + (pm?parseInt(pm[1]):0);
			UpdateBrowserAction("online", num.toString());
			Options.Properties.Basic.ShowDeskMsg.value && 
				ShowMessageNotification(num.toString());
		}else if(user){
			UpdateBrowserAction("online");
		}else
			UpdateBrowserAction("offline", "?");
	}, function(){
		UpdateBrowserAction("network-error", "×");
	});
}

//TODO notify as a list
function ShowMessageNotification(extra){
	var options = {
		type : "basic",
		title : "友情提示",
		message: "您有" + extra + "条未读消息",
		iconUrl : "images/icon48.png"
	};
	chrome.notifications.clear("water", function(wasCleared){
		//console.log("is cleared? "+ wasCleared);
	});
	chrome.notifications.create("water", options, function(){
		//console.log("notifications");
	});
}

chrome.notifications.onClicked.addListener(function(id){
	chrome.notifications.clear(id, function(wasCleared){
		//console.log("is cleared? "+ wasCleared);
	});
	chrome.tabs.create({
		url: 'http://bbs.stuhome.net/home.php?mod=space&do=pm'
	});
});

//TODO timeInterval can be set by user
var timeInterval = 1000 * 10;
UpdateMessageCount(); // update at beginning
window.setInterval(UpdateMessageCount, timeInterval);