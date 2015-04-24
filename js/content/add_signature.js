
function htmltoubb(str){
	str = str.replace(/<p[^>\/]*\/>/ig,'\n');
	str = str.replace(/\son[\w]{3,16}\s?=\s*([\'\"]).+?\1/ig,'');
	str = str.replace(/<hr[^>]*>/ig,'[hr]');
	str = str.replace(/<(sub|sup|u|strike|b|i|pre)>/ig,'[$1]');
	str = str.replace(/<\/(sub|sup|u|strike|b|i|pre)>/ig,'[/$1]');
	str = str.replace(/<(\/)?strong>/ig,'[$1b]');
	str = str.replace(/<(\/)?em>/ig,'[$1i]');
	str = str.replace(/<(\/)?blockquote([^>]*)>/ig,'[$1quote]');
	str = str.replace(/<img[^>]*smile=\"(\d+)\"[^>]*>/ig,'[s:$1]');
	str = str.replace(/<img[^>]*src=[\'\"\s]*([^\s\'\"]+)[^>]*>/ig,'[img]'+'$1'+'[/img]');
	str = str.replace(/<a[^>]*href=[\'\"\s]*([^\s\'\"]*)[^>]*>(.+?)<\/a>/ig,'[url=$1]'+'$2'+'[/url]');
	str = str.replace(/<[^>]*?>/ig, '');
	str = str.replace(/&amp;/ig, '&');
	str = str.replace(/&lt;/ig, '<');
	str = str.replace(/&gt;/ig, '>');
	str = str.replace(/&nbsp;/ig, ' ');
	return str;
}

function addSigature(privateSig, hasSignature){
	// To let signature stay the bottom, marginTop is a must but not best...
	var marginTopLen = 9 + (privateSig.split('\n').length < 6?(6-privateSig.split('\n').length):0);
	var marginTop = Array(marginTopLen).join("\n");
	var sigContent = '------------------------------------------ Signature By Anti Riverside ----------------------------------------------';
	var commonSig = '[i][size=1][color=#c0c0c0]' + sigContent + '[/color][/size][/i]';
	var signature = marginTop + commonSig + '\n' + privateSig;

	$("#postlist > div[class!='pl']").each(function(){
		$(this).find(".fastre").after("<a class='sofabackup' href='javascript:void(0);'>沙发的责任</a>");
	});

	$(".sofabackup").on("click", function(){
		var postID = $(this).parents('table').parent().attr('id');
		var urlWithoutHash = window.location.origin + window.location.pathname + window.location.search;
		var backupContent = '[color=#c0c0c0]<!--[/color]\n';
		backupContent += htmltoubb($(this).parents('tbody').find('.t_f').html());
		if(backupContent.indexOf(sigContent) != -1){
			backupContent = backupContent.substring(0, backupContent.indexOf(sigContent) - '[i]'.length)
		}
		backupContent = backupContent.replace(/(\s*$)/g, '');
		backupContent += '\n\n[color=#c0c0c0]-->[/color]';
		backupContent += '\n[url=' + urlWithoutHash + '#' + postID + ']原帖[/url]';
		console.log(backupContent);
		fastpostmessage.value = backupContent;
		fastpostsubmit.click();
		chrome.extension.sendMessage({
			name: "sofaBackupInfo",
			optionNames: "天呐！你真棒！！"
		});
		window.scrollTo('0', '999999');
	});

	if(!hasSignature)
		return;
	// Add a none display area for signature,
	// for we need to get the value during posting
	$("#fastpostmessage").before("<span id='i-signature' style='display:none;'>" + signature + "</span>");

	// This's a inline-script to modify the javascript function in content,
	// then it can add the signature when posting by ctrl+enter
	var script = document.createElement('script');
	script.src = chrome.runtime.getURL('js/patch_keydown.js');
	document.body.appendChild(script);

	// Add a button beside the default quick-reply button
	$("#postlist > div[class!='pl']").each(function(){
		$(this).find(".fastre").before("<a class='sigfastre' href='javascript:void(0);'>带签名回复</a>");
	});

	var bindSigReply = function(){
		$(".sigfastre").on("click", function(){
			$.get($(this).siblings(".fastre").attr("href"),
				function(data, status){
					$("#fastpostform input[name='noticeauthor']").remove();
					$("#fastpostform input[name='noticetrimstr']").remove();
					$("#fastpostform input[name='noticeauthormsg']").remove();
					var quoteText = data.match(/<div class="quote">[\s\S]*?<\/div>/);
					var noticeAuthor = data.match(/<input type="hidden" name="notice[\s\S]*?>/g);
					for(var i = 0; i < noticeAuthor.length; ++i){
						$("#fastpostform input[name='formhash']").before(noticeAuthor[i]);
					}
					$(".plc .quote").remove();
					$(".plc #fastpostreturn").before(quoteText);
					window.scrollTo('0', '999999'); // Scroll to the end
					$('#fastpostmessage').focus();
				});
		});
	};
	bindSigReply();

	// Rebind when having new posts
	$(document).on('DOMNodeInserted', function(e) {
		if(e.target.id.indexOf("post_") != -1){
			$(e.target).find(".fastre").before("<a class='sigfastre' href='javascript:void(0);'>带签名回复</a>");
			bindSigReply();
		}
	});

	//FIXME this's some problems with jquery, so native js here 
	document.getElementById("fastpostsubmit").onmouseover = function(){
		var postMessage = document.getElementById("fastpostmessage");
		var value = postMessage.value;
		if(value.indexOf("Signature By Anti Riverside") == -1){
			value += signature;
			postMessage.value = value;
		}
	};
}
