
function htmltoubb(str){
	str = str.replace(/<br[^>]*>/ig,'\n');
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

function addSigature(privateSig){
	// To let signature stay the bottom, marginTop is a must but not best...
	var marginTopLen = 9 + (privateSig.split('\n').length < 6?(6-privateSig.split('\n').length):0);
	var marginTop = Array(marginTopLen).join("\n");
	var commonSig = "[i][size=1][color=#c0c0c0]------------------------------------------ Signature By Anti Riverside ----------------------------------------------[/color][/size][/i]";
	var signature = marginTop + commonSig + '\n' + privateSig;

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

	$("#postlist > div[class!='pl']").each(function(){
		$(this).find(".fastre").before("<a class='sofabackup' href='javascript:void(0);'>沙发的责任</a>");
	});

	$(".sofabackup").on("click", function(){2
		var backupContent = '[size=1][color=#c0c0c0]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>BEGIN<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[/color][/size]\n';
		backupContent += htmltoubb($(this).parents('tbody').find('.t_f').html());
		backupContent += '\n[size=1][color=#c0c0c0]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[/color][/size]';
		console.log(backupContent);
		fastpostmessage.value = backupContent;
		fastpostsubmit.click();
		alert('天呐！你真棒！!');
		window.scrollTo('0', '999999');
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
