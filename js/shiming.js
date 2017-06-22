	//身份认证验证
	function verifyAuthentication(){
	    $("#id_card_btn_id").bind("click", function() {
	        var realNamedVal = $("#real_name_id").val();
	        var realCardVal=$("#id_card_id").val();
	        var errorId=$("#id_card_error_info_id");
	        if(!realNamedVal) {
	            errorId.html("请输入您的真实姓名").show();
	        } else if(!realCardVal) {
	            errorId.html("请输入您的身份证号码").show();
	        } else if(!checkIdcard(realCardVal)) {
	            errorId.html("您的身份证号码输入不正确").show();
	        } else if(!Age(realCardVal)) {
	            errorId.html(" 身份证号年龄需大于18岁").show();
	        }
	        else{
	            //验证身份合法性
	            $.ajax({
	                type: "post",
	                url: getRootPath()+"/ucenter/checkIdCardNum",
	                data: {
	                    "userName" : realNamedVal,
	                    "idNumber" : realCardVal
	                },
	                async : false,
	                dataType: "json",
	                beforeSend:function(XMLHttpRequest){
	                    $("#id_card_error_info_id").addClass("disNone");
	                    $("#authenticationSuccessId").addClass("disNone");
	                    $("#authenticationErrorId").addClass("disNone");
	                    $("#loadingId").removeClass("disNone");
	                },
	                success: function(data){
	                    if(data.success){
	                        $.ajax({
	                            url:getRootPath()+'/bid/updateIdCard',
	                            data:{
	                                realName : realNamedVal,
	                                idCardNum : realCardVal
	                            },
	                            type:'post',
	                            cache:false,
	                            dataType:'json',
	                            success:function(data) {
	                                if('1' == data.code){
	                                    $("#id_card_alert_box_id").addClass("disNone");
	                                    $("#authenticationSuccessId").removeClass("disNone");
	                                    $("#authenticationErrorId").addClass("disNone");
	                                    $("#loadingId").addClass("disNone");
	                                } else {
	                                    $("#id_card_alert_box_id").addClass("disNone");
	                                    $("#authenticationSuccessId").addClass("disNone");
	                                    $("#authenticationErrorId").removeClass("disNone");
	                                    $("#loadingId").addClass("disNone");
	                                }
	                            },
	                            error:function() {
	                                $("#error_text_id").html("实名认证出现异常，请稍后重试").show();
	                                $("#id_card_alert_box_id").addClass("disNone");
	                                $("#authenticationSuccessId").addClass("disNone");
	                                $("#authenticationErrorId").removeClass("disNone");
	                                $("#loadingId").addClass("disNone");
	                            }
	                        });
	                    } else {
//	                        var msgObj = JSON.parse(data.msg);
//	                        if(msgObj.idnumber && msgObj.idnumber!=""){
//	                            $("#error_text_id").html("<p>"+msgObj.idnumber+"</p>").show();
//	                        }
//	                        if(msgObj.tips && msgObj.tips!=""){
//	                            $("#error_text_id").html("<p>"+msgObj.tips+"</p>").show();
//	                        }
//	                        $("#id_card_alert_box_id").addClass("disNone");
//	                        $("#authenticationSuccessId").addClass("disNone");
//	                        $("#authenticationErrorId").removeClass("disNone");
//	                        $("#loadingId").addClass("disNone");
	                    	
	                    	$("#error_text_id").html("<p>"+"实名认证失败"+"</p>").show();
	                    	$("#error_text_id").html("<p>"+"认证失败，实名认证信息有误或今日认证次数超过3次。"+"</p>").show();
	                    	$("#id_card_alert_box_id").addClass("disNone");
	                    	$("#authenticationSuccessId").addClass("disNone");
	                    	$("#authenticationErrorId").removeClass("disNone");
	                    	$("#loadingId").addClass("disNone");
	                        return false;
	                    }
	                },
	                error:function() {
	                    $("#error_text_id").html("身份验证出现异常，请稍后重试").show();
	                    $("#id_card_alert_box_id").addClass("disNone");
	                    $("#authenticationSuccessId").addClass("disNone");
	                    $("#authenticationErrorId").removeClass("disNone");
	                    $("#loadingId").addClass("disNone");
	                }
	            });

	        }
	    });
	}
	
	//投资时弹出框
	function showDialogBox(){
	    var alertHtml=$("#alertAuthenticationId").html();
	    art.dialog({
	        id:'authenticationId',
	        title:'尚未检测到您的身份',
	        fixed:true,
	        lock:true,
	        content: alertHtml,
	        init:function(){
	            verifyAuthentication();//身份认证验证
	        }
	    });
    }