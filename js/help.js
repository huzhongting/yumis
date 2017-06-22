$(function(){
		// RenderNav();
	$(".help_QA_item").click(function(){
		$(this).addClass("help_QA_item--on").siblings().removeClass("help_QA_item--on");	
	})

	$("#help-type-list .help_type_item").click(function() {
		$(this).addClass("help_type_item--on").siblings().removeClass("help_type_item--on");
		var itemNum = $(this).attr('item-num');
		var showDivClass = '.help_bd-' + itemNum;
		$(showDivClass).addClass('help_bd--on').siblings('.help_bd').removeClass("help_bd--on");
		$(showDivClass).find('.help_QA_item').eq(0).addClass('help_QA_item--on').siblings().removeClass('help_QA_item--on');
	});
})