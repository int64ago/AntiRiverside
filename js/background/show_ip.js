

function updateIP(){
	var url = Options.Properties.Root + "home.php?mod=space&do=profile";
	$.get(url, function(data, status){
		var ip = data.match(/上次访问 IP<\/em>(\d+\.\d+\.\d+\.\d+):\d+/);
		chrome.browserAction.setTitle({title: ip[1]});
	});
}

window.setInterval(updateIP(), 55 * 1000);