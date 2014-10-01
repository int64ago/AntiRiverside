
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

// For some reasons, we don't block posts in homepage
function filterPosts(blackList){
	// In post
	$("#postlist > div[class!='pl']").each(function(){
		if($.inArray($(this).find(".xw1:first").text(), blackList) != -1)
			$(this).remove();
	});
	// In post list
	$("#threadlisttableid > tbody").each(function(){
		if($.inArray($(this).find("cite a:first").text(), blackList) != -1)
			$(this).remove();
	});
}