
function filterSignature(blackList){
	$("#postlist > div[class!='pl']").each(function(){
		var pls = $(this).find(".pls"); // author info
		var plc = $(this).find(".plc"); // post info
		var rapeUser = "请阅读新手导航";
		if($.inArray(pls.find(".xw1").text(), blackList) != -1 ||
			$(this).find(".sign").text().indexOf(rapeUser) != -1){
			$(this).find(".sign").attr({"style": "display:none;"});
		}
	});
}