// 支付方式切换
    var require="liandong";
    var fromName="#payForm3";
    function changeTab(){
        $(this).addClass("curr").siblings().removeClass("curr");
        $("#bankSelect .bankH").eq($(this).index()).show().siblings().hide();
        $("#bankSelect").find("label").removeClass("curr");
        $("#member .czUl h4").hide();
    }
    $("#bankTitle label").click(function(){
      $(fromName)[0].reset();
      if($(this).index()<2){
        $(this).addClass("curr").siblings().removeClass("curr");
        $("#bankSelect .bankH").eq($(this).index()).show().siblings().hide();
        $("#bankSelect").find("label").removeClass("curr");
        $("#member .czUl h4").hide();
      }
      else{
        $("#member .czUl h4").hide();
        $(this).addClass("curr").siblings().removeClass("curr");
        if(require=="liandong"){
          changeTab();
          $("#bank3").show();
          $("#bank4").hide();
        }else{
          changeTab();
          $("#bank3").hide();$("#bank4").show();
        }
      }
      var payMethod=$("#bankTitle label.curr").attr("id");
      $("#bankThirdType").val(payMethod);
      $("#bankCode").val("");

    });

    // 银行图标被选中的效果
    $('#bankSelect label').click(function(){
        var bankId=$(this).attr("id");
        $("#bankCode").val(bankId);
        $(this).addClass('curr').siblings().removeClass('curr');       
        bankselected=$("#bankSelect label.curr").attr("id")
        $("#bankCode").val(bankselected);
        if(bankselected.length!=0) {$("#backCodeError").css("display","none")}
      })
   

    // 快捷支付银行卡和银行信息切换
    $("#bank3 label").click(function(){
      var bankName=$(this).attr("title");
      $(".bankName").text(bankName);
      $("#bank3").hide();
      $(".bankForm").show();
      $("#member .czUl h4").show();
    });
    $(".bankForm .changeBank").click(function(){
      $("#bankCode").val("");
      $("#bank3").show();
      $(".bankForm").hide();
      $("#member .czUl h4").hide();
      $("#bankSelect").find("label").removeClass("curr");
    });

    // 银行卡输入放大显示效果
    $("#bankCodeNumber").focus(function(evt){                  
        if(this.value.length>0){
          a(this);
          d(this);
        }
    })
    $("#bankCodeNumber").keyup(function(evt){
      
        if(this.value.length==0){
          e();
        }else{
          a(this);
        }
        d(this);
    })
    $("#bankCodeNumber").blur(function(evt){
      e();
      this.value=this.value
    })
    $("#undateBank").click(function(){
      $(this).remove();
      $("#bankCodeNumber").removeAttr("disabled").addClass("inputTextCurr").val("").focus();
    })
               
    //计算div的left和top，显示div
    function a(evt){
      $("#bankKhTips").show();
    }
    //隐藏div
    function e(){
      $("#bankKhTips").hide();
    }
    //控制div里显示的数字
    function d(e){
      var i = e.value;
      i=$.trim(i);
      var h=i.substring(0,4);
      i=i.substring(4);
      while(i&&i.length>0){
        h+=" "+i.substring(0,4);
        i=i.substring(4)
      }
      $("#bankKhTips").html(h);
    }
                
var formValid={
  bankCodeValid :function(id,tipId){
    var bankCode=$.trim($(id).val());
    var reg_card = /^[0-9]{15,19}$/;
	  if(bankCode=='' || !reg_card.test(bankCode))
	  {
	  	$(tipId).addClass("nnotOk").removeClass("ok");
	  	$(tipId).text('银行卡号不对').show();
		return false;
	  }else{
	    $(tipId).addClass("ok").removeClass("nnotOk");
	    $(tipId).text("").show();
	    return true;
	 }
  },
  mobileValid : function(id,tipId){
    var flag=false;
     mobile=$.trim($(id).val());
        if(mobile.length==0){
          $(tipId).text('手机号码不能为空').show();
          $(tipId).removeClass('ok').addClass("nnotOk");
          $("#getCode").attr("disabled","disabled").addClass("noBut");
        } 
        else{
          var verify=/^(13|15|18|14|17)[0-9]{9}$/;
          var vm=verify.test(mobile);
          if(vm){
              $(tipId).text("").show();
              $(tipId).addClass("ok").removeClass("nnotOk");
              $("#getCode").removeAttr("disabled").removeClass("noBut");
              flag=true;
            }else{
              $(tipId).text("手机号码格式不正确").show();
              $(tipId).removeClass('ok').addClass("nnotOk");
              $("#getCode").attr("disabled","disabled");
            }
        }
    return flag;
  },
  mobileCodeValid :function(id,tipId){
    var flag=false;
    var mobileCode=$.trim($(id).val());
      if(mobileCode.length==0){ 
          $(tipId).addClass("nnotOk").removeClass("ok");
          $(tipId).text('请输入短信验证码!').show();
        } else if(mobileCode.length==6)
        {
          $(tipId).addClass("ok").removeClass("nnotOk");
          $(tipId).text("").show();
          flag=true;
        }
    return flag;
  },
  amountValid : function(id,tipId,bankThirdType){
	  var bankThirdType=$(bankThirdType).val();
	  var exp = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	  $(tipId).text('');
	 if(bankThirdType=="LiandongPay"){
		 var amount=$.trim($(id).val());
		 if(!amount){
			 $(tipId).addClass("nnotOk").removeClass("ok");
	         $(tipId).text('请输入金额!').show();
 			return false;
		 }else{
			 if(exp.test(amount)){
				 if(amount>2000000){
					 $(tipId).addClass("nnotOk").removeClass("ok");
			         $(tipId).text('充值金额不能超过200万!').show();
		 			return false;
				 }else if(amount<50) {
					 $(tipId).addClass("nnotOk").removeClass("ok");
			         $(tipId).text('充值金额50起充!').show();
		 			return false;
				 }else {
					 $(tipId).addClass("ok").removeClass("nnotOk");
					 $(tipId).text('').show();
					 return true;
				}
	 		 }else {
	 			$(tipId).addClass("nnotOk").removeClass("ok");
		        $(tipId).text('输入有误!').show();
		        return false;
			}
		 }
	 }else{
		 var amount=$.trim($(id).val());
		 if(amount.length==0){
			 $(tipId).addClass("nnotOk").removeClass("ok");
	         $(tipId).text('请输入金额!').show();
 			return false;
		 }else{
			 if(exp.test(amount)){
				 if(amount>2000000){
					 $(tipId).addClass("nnotOk").removeClass("ok");
			         $(tipId).text('充值金额不能超过200万!').show();
		 			return false;
				 }else if(amount<0.01) {
					 $(tipId).addClass("nnotOk").removeClass("ok");
			         $(tipId).text('充值金额不小于0.01!').show();
		 			return false;
				 }else{
					 $(tipId).addClass("ok").removeClass("nnotOk");
					 $(tipId).text('').show();
					 return true;
				 }
	 		 }else {
	 			$(tipId).addClass("nnotOk").removeClass("ok");
		        $(tipId).text('输入有误!').show();
		        return false;
			}
		 }
	 }
  },
  bankValid : function(id,tipId){
	var flag = false;
	var mobileCode = $.trim($(id).val());
	if (mobileCode.length == 0) {
		$(tipId).addClass("nnotOk").removeClass("ok");
		$(tipId).text('请选择银行卡!').show();
	} else  {
		flag = true;
	}
	return flag;
  }
}
// 身份证不能为空验证   
    $("#bankCodeNumber").blur(function(){
      
      formValid.bankCodeValid("#bankCodeNumber","#bt");

    });                
// 手机号码与按钮效果
    var mobile;
    $(".phoneNum").blur(function(){
        formValid.mobileValid("#phoneNum","#tp");
    });

// 验证码不能为空
    $("#mobileCode").blur(function(){
      formValid.mobileCodeValid("#mobileCode","#ct");
    });
    
    function downTime(){
      $("#getCode").attr("disabled","disabled");
      var at=30;
      var MyTime = setInterval(function(){
        if(at>0){
          at--;
          $("#getCode").val(at+"秒后重新获取").addClass("noBut");
        } 
        else if(at==0)
        {
          $("#getCode").val("重获验证码").removeAttr("disabled").removeClass("noBut");
          $("#phoneNum").removeAttr("disabled");
          clearInterval(MyTime);    
        }
      } , 1000);     
    }
