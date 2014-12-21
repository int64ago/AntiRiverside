

function addSigature(privateSig){
	// To let signature stay the bottom, marginTop is a must but not best...
	var marginTop = "\n\n\n\n\n\n\n";
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
