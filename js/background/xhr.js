
// Refer: https://code.google.com/p/riverside-plus/

// xhr.js
// Shared code for XMLHttpRequest used by other background scripts.

var XHR = {
	GetURL: function(pathname){
		//TODO What if Options.Domain.Force == false ?
		var pn = pathname || "/"; //defaults to the homepage
		return "http://" + Options.Domain + 
			(pn[0] == "/" ? "" : "/") + pn;
	}, 

	SendRequest: function (url_or_pathname, success_callback, fail_callback, extra){
		var xhr = new XMLHttpRequest();
		var url = (extra && extra.fullUrl) ? url_or_pathname : 
			this.GetURL(url_or_pathname);
		if(extra && extra.tag)
			xhr._tag = extra.tag;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = (function()
		{
			if(this.readyState == XMLHttpRequest.DONE)
			{
				if(this.status == 200 && this.responseText)
					success_callback && success_callback(this);
				else
					fail_callback && fail_callback(this);
			}
		});
		xhr.send();
	}, 
};

