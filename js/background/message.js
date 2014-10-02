
// Refer: https://code.google.com/p/riverside-plus/

//For updating popup title
var iMsgBoxNum = "0";
var iNoticeBoxNum = "0";
var iFocusPostBox = new Array();
var iMessagesBox = new Array();

function getMessages(){
	iMessagesBox = [];
	var url = Options.Properties.Root + "home.php?mod=space&do=pm&filter=newpm";
	$.get(url, function(data, status){
		var messages = data.match(/(\d+)" target="_blank" class="xw1">([\s\S]+?)<\/a>/g);
		for(var msg in messages){
			var detail = messages[msg].match(/(\d+)" target="_blank" class="xw1">([\s\S]+?)<\/a>/i);
			iMessagesBox[detail[1]] = detail[2];
		}
	});
}

function getFocusPosts(){
	var patt = /(<div id="framebZWlst_center"[\s\S]+<\/div>)<div id="framebZWlst_right"/;
	iFocusPostBox = [];
	$.get(Options.Properties.Root, function(data, status){
		var divObj = data.match(patt)[1];
		var tidList = new Array();
		var newList = new Array();
		var oldList = Options.get("TidList");
		$(divObj).find("li").each(function(){
			var tid = $(this).find(">a").attr("href").match(/tid=(\d+)/)[1];
			tidList.push(tid);
			var author = $(this).find("em a").text();
			// If the author of tid from homepage is not included
			// in TidList, we add it(author&tid&title) into iFocusPostBox
			// for showing later
			if($.inArray(author, Options.Properties.UsersFocused) != -1){
				if($.inArray(tid, oldList) == -1){
					var title = $(this).find(">a").attr("title");
					iFocusPostBox.push({
						"tid": tid,
						"author": author,
						"text": title
					});
				}

			}
		});
		// If tid in TidList not in tidList from homepage,
		// remove it from the TidList
		for(var tid_i in oldList){
			if($.inArray(oldList[tid_i], tidList) != -1)
				newList.push(oldList[tid_i]);
		}
		Options.set("TidList", newList);
	});

}

function UpdateBrowserAction(state, badge){
	badge = Options.Properties.ShowMsg ? badge: "";
	chrome.browserAction.setBadgeText({text: badge || ""});
	state && chrome.browserAction.setIcon({path: state == "online" ? 
		"images/icon19.png" : "images/grey.png"});
}

function UpdateMessageCount(){
	getMessages();
	var url = Options.Properties.Root + "home.php?mod=space&do=pm";
	$.get(url, function(data, status){
		var user = data.match(/avatar\.php\?uid=(\d+)/);
		var notice = data.match(/提醒\((\d+)\)/);
		var pm = data.match(/<strong class="xi1">\((\d+)\)<\/strong>/);
		console.log("user:" + user + " notice:" + notice + " pm:" + pm);
		Options.Properties.CurUser = user? user[1]:"";
		iMsgBoxNum = pm? pm[1]:"0";
		iNoticeBoxNum = notice? notice[1]:"0";
		if(notice || pm || iFocusPostBox.length != 0)
		{
			var num = (notice?parseInt(notice[1]):0) + (pm?parseInt(pm[1]):0) + iFocusPostBox.length;
			UpdateBrowserAction("online", num.toString());
			Options.Properties.ShowDeskMsg && ShowMessageNotification(num.toString());
		}else if(user){
			UpdateBrowserAction("online");
		}else{
			UpdateBrowserAction("offline", "?");
		}
	}).fail(function(){
		UpdateBrowserAction("network-error", "×");
	});
}

//TODO Notify as a list
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

function ShowBackupNotification(result){
	var options = {
		type : "basic",
		title : "备份消息",
		message: result,
		iconUrl : "images/icon48.png"
	};
	chrome.notifications.clear("backup", function(wasCleared){
		//console.log("is cleared? "+ wasCleared);
	});
	chrome.notifications.create("backup", options, function(){
		//console.log("notifications");
	});
}

chrome.notifications.onClicked.addListener(function(id){
	chrome.notifications.clear(id, function(wasCleared){
		//console.log("is cleared? "+ wasCleared);
	});
	if(id == "water"){
		chrome.notifications.clear("water", function(wasCleared){});
		//chrome.tabs.create({
		//	url: Options.Properties.Root + "home.php?mod=space&do=pm"
		//});
	}else if(id == "backup"){
		chrome.tabs.create({
			url: chrome.extension.getURL("backup.html")
		});		
	}
});

// Update at beginning
UpdateMessageCount();
getFocusPosts();

window.setInterval(UpdateMessageCount, 10 * 1000);
window.setInterval(getFocusPosts, 15 * 1000);