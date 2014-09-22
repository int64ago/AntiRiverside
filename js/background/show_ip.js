

function updatePopupTitle(){
	XHR.SendRequest("/home.php?mod=space&do=profile", function(xhr){
		var ip = xhr.responseText.match(/上次访问 IP<\/em>(\d+\.\d+\.\d+\.\d+):\d+/);
		chrome.browserAction.setTitle({title: ip[1]});
	});
}

window.setTimeout(updatePopupTitle(), 5 * 1000);