//Refer: http://bbs.stuhome.net/forum.php?mod=viewthread&tid=1467113&extra=&page=4#post_25707336

document.getElementById("fastpostmessage").onkeydown = function(){
	seditor_ctlent(event,
		'$(\'fastpostform\').message.value = $(\'fastpostform\').message.value + document.getElementById(\'i-signature\').innerText; fastpostvalidate($(\'fastpostform\'));');
};