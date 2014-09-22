

function addSigature(privateSignature){
	var commonSignature = "[size=3][i]个性签名[/i][/size][i][size=1][color=#c0c0c0] ——> By Anti Riverside[/color][/size][/i]";
	document.getElementById("fastpostsubmit").onmouseover = function(){
		var postMessage = document.getElementById("fastpostmessage");
		var value = postMessage.value;
		if(value.indexOf("By Anti Riverside") == -1){
			value += "\n\n\n\n\n\n" + commonSignature.replace("个性签名", privateSignature);
			postMessage.value = value;
		}
	};
}
