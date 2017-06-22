$(function(){
	
	$("#photoList li").hover(function(){
  		$(this).addClass("curr");
	},function(){
		 $(this).removeClass("curr");
	})

	var indexN=0;
	$("#photoList li").each(function(index, element) {
     $(this).click(function(){
		  indexN=index;
				var srcU=$(this).find("img").attr("src");
				$("#photoAlbum").show();
				$("#bigImgId").attr("src",srcU);
			})
  });
	 
	
	$("#photoAlbum .close").click(function(){
	  $("#photoAlbum").hide();
	})
	blackBg();
	function blackBg(){	
		var windowW=$(window).width(),
				windowH=$(window).height();
		$("#photoAlbum .blackBg").width(windowW).height(windowH);
		$("#photoAlbum .bigImg").css("top",(windowH-750)/2);
	}
	$(window).resize(function(){
		blackBg();
	})

	var lengthN=$("#photoList li").length;
	$("#photoAlbum .left").click(function(){
		if(indexN>0)
		{
			indexN--;
		}
		else
		{
			indexN=lengthN-1;
		}	
		var srcL=$("#photoList li").eq(indexN).find("img").attr("src");
	  $("#bigImgId").attr("src",srcL);
	})
	$("#photoAlbum .right").click(function(){
		if(indexN<lengthN-1)
		{		
			indexN++;
		}
		else
		{
			indexN=0;
		}
		var srcL=$("#photoList li").eq(indexN).find("img").attr("src");
	  $("#bigImgId").attr("src",srcL);
	})
})