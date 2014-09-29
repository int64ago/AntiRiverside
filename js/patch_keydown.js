//Refer: http://bbs.stuhome.net/forum.php?mod=viewthread&tid=1467113&extra=&page=4#post_25707336

document.getElementById("fastpostmessage").onkeydown = function(){
	var sigFlag = "Signature By Anti Riverside";
	var script = "\
		var textVal = $('fastpostform').message.value;\
		var sigVal = document.getElementById('i-signature').innerText;\
		if (textVal.indexOf('" + sigFlag + "') == -1)\
			$('fastpostform').message.value = textVal + sigVal;\
		fastpostvalidate($('fastpostform'));";
	seditor_ctlent(event, script);
};