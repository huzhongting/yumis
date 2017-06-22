$(function(){
    //add hover
	$(".userForm li,.loginForm li,#top ul .qq,#top ul .weixin,#nav li,#header dl,.listUl li,.formClass ul li").hover(function(){
	  $(this).addClass("hover");
	},function(){
	  $(this).removeClass("hover");
	})
	//
	$(".helpTipsIcon").hover(function(){
		var h=($(this).find(".helpTipsText").height()+17)*-1;
		$(this).css("background-position","-40px -100px");
		$(this).find(".helpTipsText").css("top",h);
	  $(this).find(".helpTipsText").show();
	  $(this).find(".helpTipsI").show();
	},function(){
		$(this).css("background-position","0 -100px");
	  $(this).find(".helpTipsText").hide();
	  $(this).find(".helpTipsI").hide();
	})
	//横条进度条，动画
	$(".progress").each(function(i){
		var dWidth=$(this).attr("data-width");
		$(this).find("tt").animate( { width: dWidth} , 1000 );
	});	
	
	/*----右侧浮动标签 start-----*/
    $('.floatBtn ul li').hover(function(){
    	var $what=$(this).children('.what');
    	$what.show();
    	$what.animate({width:'140px',left:'-140px'},120);
    	if($what.css('display')=='block'){
    		$(this).css('background-color','#2997dc');
    	}

    },function(){
    	var $what=$(this).children('.what');
    	$what.hide();
    	$what.animate({width:0,left:0},120);
    	if($what.css('display')=='none'){
    		$(this).css('background-color','#3db1fa');
    	}

    })
    /*-----右侧浮动标签 end*/

  /***返回顶端 start***/ 
  function backTop()
	{
		var winh = $(window).height();
		var $backToTopEle = $('<a class="backTop"><i></i></a>').appendTo($('body')).click(function() {
				$("html, body").animate({ scrollTop:0}, 120);
			}),
				$backToTopFun = function() {
					var st = $(document).scrollTop();       
					(st > 0)? $backToTopEle.show(): $backToTopEle.hide();
					//IE6涓嬬殑瀹氫綅
					if (!window.XMLHttpRequest) {
						$backToTopEle.css("top", st + winh - 142);
					}
			};
		$(window).bind("scroll", $backToTopFun);
	}
	backTop();
 	/***返回顶端 end***/ 
 	$(window).resize(function(){
 	})
	
	//倒计时
	$(".jsCountDown").each(function(index, element) {
	  var downTime=$(this).attr("data-time"),sysdate=$(this).attr("data-sysdate");
		countDown(downTime,$(this),sysdate)
	});
	
	
})
/**倒计时*/

function countDown(time,id,sysdate){
	var html="天";	
	var end_time = new Date(time).getTime(),//月份是实际月份-1
	sys_second = (end_time-new Date(sysdate).getTime())/1000;
	var timer = setInterval(function(){
		if (sys_second > 1) {
			sys_second -= 1;
			var day = Math.floor((sys_second / 3600) / 24);
			var hour = Math.floor((sys_second / 3600) % 24)+(day*24);
			var minute = Math.floor((sys_second / 60) % 60);
			var second = Math.floor(sys_second % 60);
			
			$(id).html(hour+"小时"+minute+"分"+second+"秒");
		} else { 
			clearInterval(timer);
		}
	}, 1000);
}
/**倒计时 end*/

//切换
function setTabAll(name,cursel,n){
	for(i=1;i<=n;i++){
		var menu=document.getElementById(name+i);
		var con=document.getElementById("gTab_"+name+"_"+i);
		if(menu){
			menu.className=((i==cursel)?"curr":"");
			//menu.style.display=((i==cursel)?"none":"block");
		}
		if(con){
			con.style.display=((i==cursel)?"block":"none");
		}		
	}
}


