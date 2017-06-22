/**
 * data 2015/8/13
 * name guohaobo
 */
$(function(){
    /**滚动标题**/
    var titleClass=$(".titleHeight");
    var	scrollTitle=$("#fixedTitle");
    if(scrollTitle.length != 0) {
        //滚动条事件
        $(window).on('scroll',function(){
            var scrollTop=$(document).scrollTop();
            if(scrollTop<=$("#absoluteTitle").eq(0).offset().top) {
                scrollTitle.addClass("disNone");
            } else {
                scrollTitle.removeClass("disNone");
                if (!window.XMLHttpRequest) {
                    $('.fixedTitleClass').css("top", scrollTop);
                }
            }
            $(titleClass).each(function(i){
                if(scrollTop>titleClass.eq(i).offset().top-100) {
                    scrollTitle.find("li").removeClass("curr");
                    scrollTitle.find("li").eq(i).addClass("curr");
                }
            });
        });
        //标题点击事件
        $(".scrollTitle li").click(function(){
            var showIndex=$(this).index();
            scrollTitle.find("li").removeClass("curr");
            $("#fixedTitle li").eq(showIndex).addClass("curr");
            var topH=titleClass.eq(showIndex).offset().top;
            $(document).scrollTop(topH-60);
        });
    }
    /**滚动标题 end**/

    // 购买页面的密码框效果
    $('#pay_password').hover(function(){$(this).addClass('hover')}, function(){$(this).removeClass('hover')});

    // 投标页面右侧投标初始化
    $("#borrowDetialAmount").text(format($("#borrowDetialAmount").text()));
    var userName = $("#borrowDetailUserName").text();
    if(userName.length > 0){
        userName = userName.substr(0,1)+"***";
        $("#borrowDetailUserName").text(userName);
    }
    var chehao = $("#chehao").text();
    if(chehao.length > 3){
        chehao = chehao.substr(0,4)+"***";
        $("#chehao").html(chehao);
    }

    //"我要投资"数据的异步请求
    $.ajax({
        url:getRootPath()+'/bid/tenderDetails',
        data:{
            bid : $("#borrowId").val(),
            uid : _UserId
        },
        type:'post',
        cache:false,
        dataType:'json',
        success:function(data) {
            initTenderDetails(data);
        },
        error:function() {
        	initTenderDetails(null);
        }
    });
});

//验证码
function getcode(){
	$("#identifying_pic_id").attr('src',getRootPath()+'/reg/getCode.jpg?nocache='+ new Date().getTime());
}

//登录验证
function verifyLogin(){
    $("#login_btn_id").bind("click", function() {
        var loginPasswordVal = $("#login_pass_word_id").val();
        var loginNameVal=$("#login_name_id").val();
        var loginCodeVal = $("#login_code_id").val();
        var errorId=$("#login_error_info_id");
        if(!loginNameVal) {
            errorId.show().html("请输入您的登录账户");
        } else if(!loginPasswordVal) {
            errorId.show().html("请输入您的登录密码");
        } else if(!loginCodeVal) {
        	errorId.show().html("请输入验证码");
        } else {
            //异步请求登录验证信息
            $.ajax({
                url:getRootPath()+'/login/loginAjax',
                data:{
                    userName :loginNameVal,
                    password :encode(loginPasswordVal),
                    loginCode : loginCodeVal
                },
                type:'post',
                cache:false,
                dataType:'json',
                success:function(data) {
                    if('0' == data.code){
                        $("#login_ajax").html(data.ucsynlogin);
                    	setTimeout("location.reload()",500);
                    } else {
                        errorId.show().html(data.msg);
                    }
                },
                error : function() {
                    errorId.show().html("登录异常，请稍后重试");
                }
            });
        }
    });
}

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
//                        var msgObj = JSON.parse(data.msg);
//                        if(msgObj.idnumber && msgObj.idnumber!=""){
//                            $("#error_text_id").html("<p>"+msgObj.idnumber+"</p>").show();
//                        }
//                        if(msgObj.tips && msgObj.tips!=""){
//                            $("#error_text_id").html("<p>"+msgObj.tips+"</p>").show();
//                        }
//                        $("#id_card_alert_box_id").addClass("disNone");
//                        $("#authenticationSuccessId").addClass("disNone");
//                        $("#authenticationErrorId").removeClass("disNone");
//                        $("#loadingId").addClass("disNone");
                    	
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

//重新认证
function formShow()
{
    $("#id_card_alert_box_id").removeClass("disNone");
    $("#authenticationSuccessId").addClass("disNone");
    $("#authenticationErrorId").addClass("disNone");
    $("#loadingId").addClass("disNone");
}

//认证成功-关闭弹窗
function closeDialogBox3(){
    window.top.art.dialog({id:"authenticationId"}).close();
}

//投资时弹出框
function showDialogBox(boxId){
    switch(boxId){
        case 1://登录弹出框
            var alertHtml=$("#alertLoginId").html();
            art.dialog({
                title:'登录验证',
                fixed:true,
                lock:true,
                content: alertHtml,
                init:function(){
                    verifyLogin();//登录验证
                }
            });
            break;
        case 2://手机认证弹出框
            var alertHtml=$("#alertMobileId").html();
            art.dialog({
                title:'手机认证',
                fixed:true,
                lock:true,
                content: alertHtml,
                init:function(){
                   // verifyLogin();//登录验证
                }
            });
            break;
        case 3://实名认证弹出框
            var alertHtml=$("#alertAuthenticationId").html();
            art.dialog({
                id:'authenticationId',
                title:'实名认证',
                fixed:true,
                lock:true,
                content: alertHtml,
                init:function(){
                    verifyAuthentication();//身份认证验证
                }
            });
            break;
        default:
            break;
    }
}

//立即投标点击事件
$("#tender_form_id").submit(function(){
        return verification();
});

//对投标输入框验证
function verification(){
    var _borrowerVal=$("#borrower_bid").val();
    var _tenderUidVal=$("#tender_uid").val();
    var tenderAmountVal = $("#tender_amount").val();
    var user = _UserId;
    if(user != null && user != ''){//登录状态
        if (tenderFormDo.mobileStatus == 0 && tenderFormDo.realStatus == 0) {//手机绑定且实名认证
        	if(verifyInputAmount()){//通过金额验证
        		return submitTenderForm();//提交"我要投资"表单
        	} else {
        		return false;
        	}
        } else if (tenderFormDo.mobileStatus != 0) {//未绑定手机
            showDialogBox(2);
            return false;
        } else if (tenderFormDo.realStatus != 0) {//未实名验证
            showDialogBox(3);
            return false;
        }
    } else {//未登录状态
        showDialogBox(1);
        return false;
    }
}

//验证输入金额
function verifyInputAmount(){
    var _minAmount=tenderFormDo.tenderMinAmount;//最小投标额
    var _maxAmount=tenderFormDo.tenderMaxAmount;//最大投标额
    var _tenderableAmount=tenderFormDo.tenderableAmount;//可投金额
    var tenderAmountVal = $("#tender_amount").val();//输入的金额
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if(tenderAmountVal != null
	    && tenderAmountVal != ''
	    && exp.test(tenderAmountVal)
	    && Number(tenderAmountVal) >= _minAmount
	    && Number(tenderAmountVal) <= _maxAmount
	    && Number(tenderAmountVal) <= _tenderableAmount) {//通过验证
	    return true;
    } else {
        //金额输入错误
        var errorInfo = '';
        if(tenderAmountVal == null || tenderAmountVal == ''){
            errorInfo = '投标金额不能为空!';
        } else if (exp.test(tenderAmountVal) && Number(tenderAmountVal) < _minAmount){
            if(_tenderableAmount < _minAmount){//可投金额小于最小限额
                return true;
            }
            errorInfo = '投标金额不能小于'+_minAmount+'元';
        } else if (exp.test(tenderAmountVal) && Number(tenderAmountVal) > _maxAmount) {
            errorInfo = '投标金额不能大于'+_maxAmount+'元!';
        } else if(exp.test(tenderAmountVal) && Number(tenderAmountVal) > _tenderableAmount){
            errorInfo = '投标金额不能大于可投金额!';
        } else {
            errorInfo = '请输入正确的投标金额!';
        }
        $("#input_error_id").html('<em>'+errorInfo+'</em>');
        return false;
    }
} 

var isSubmited = false;
//提交"我要投资"表单
function submitTenderForm(){
	if(isSubmited){
		return false;
	} else {
		isSubmited = true;
		return true;
	}
    
}

var tenderFormDo;
//初始化"我要投资"
function initTenderDetails(data){
    var tenderBalanceId= $("#tender_balance");
    var userBlanceId=$("#user_blance_id");
    var toubiaoBntId=$("#submit");
    var tipsErrorId=$("#profit_info_id");
    var tenderAllBtn=$("#tender_all_btn");
    var tenderAmountId=$("#tender_amount");
    var inputErrorId=$("#input_error_id");
    var tipsAmountId=$("#tips_amount_id");
    var backTopId=$("#back_to_top_id");
    var tenderFormId=$("#tender_form_id");
	if(data == null){//数据异常
        tenderAllBtn.remove();
        inputErrorId.remove();
        tenderAmountId.attr("disabled","disabled").val("系统繁忙");
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo").html("系统繁忙");
        backTopId.html("系统繁忙");
        tenderFormId.removeAttr("id");
        return;
	}
	
    tenderFormDo = data;
    var user = _UserId;
    $("#borrower_bid").val(data.bid);
    $("#bid_title_id").val(data.bidTitle);
    $("#tender_uid").val(data.uid);
    $("#tenderable_amount").html(formatMoney(data.tenderableAmount));
    if(data.awardAmount > 0){//滚动条奖励
    	var str_value = data.awardAmount<1?((data.awardAmount*100)+'%'):formatMoney(data.awardAmount)+'元';
    	$("#b_award_id").append('<span class="hot">奖'+str_value+'</span>');
    }
    if(user != null && user != ''){//已经登录
        tenderBalanceId.html(formatMoney(data.tenderBalance));
    } else {//没有登录
        userBlanceId.html('<p class="fr">请 <a href="javascript:showDialogBox(1)" class="aBlue">登录</a> 或 <a href="'+getRootPath()+'/reg/register.html" class="aBlue">注册</a> 后投资</a></p>');
    }
    //============================== 判断标属性 ==============================
    var isNormalBid = true;
    if(data.statusCode == 4){//已撤销
        isNormalBid = false
        tenderAllBtn.remove();
        inputErrorId.remove();
        tenderAmountId.attr("disabled","disabled").val("此标已被作废");
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo").html("标已作废");
        backTopId.html("标已作废");
        tenderFormId.removeAttr("id");
        return;
    }
    if(data.statusCode > 0){
        isNormalBid = false;
        tenderAllBtn.remove();
        tipsErrorId.remove();
        tenderAmountId.replaceWith('<div class="text"><i class="iMobile"></i>抢不到标？<a href="'+getRootPath()+'/ucenter/accountInfo.html" class="aBlue">赶紧开通自动投标 >></a></div>');
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo").html(data.statusDesc);
        backTopId.html(data.statusDesc);
        return;
    }
    if(data.isRookid && data.points != null && data.points > 100){//新手标&没有投标资格
        isNormalBid = false
        tenderAllBtn.remove();
        tenderAmountId.attr("disabled","disabled").val("您已不是新手了，把机会让给新人吧！");
        inputErrorId.removeAttr("id").html('每个新手只可享受累计 <em>1万</em>元的新手标总额度');
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo").html("新手独享福利");
        backTopId.html("新手独享福利");
    }
    if(data.isDirectional && data.amount != null && data.amount < data.rule){//定向标&没有投标资格
        isNormalBid = false
        tenderAllBtn.remove();
        tenderAmountId.attr("disabled","disabled").val("您的投标资格不足！");
        inputErrorId.removeAttr("id").html('总资产 <em>'+formatMoney(data.rule/10000)+'</em> 万元以上的用户才能投');
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo").html("定向标");
        backTopId.html("定向标");
    }
    if(data.isMobileTender){//手机标
        isNormalBid = false;
        tenderAllBtn.remove();
        tipsErrorId.remove();
        tenderAmountId.replaceWith('<div id="tender_amount" class="text"><i class="iMobile"></i>只能手机APP才能购买，<a href="'+getRootPath()+'/sys/special5.html" class="aBlue">下载App >></a></div>');
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo").html("手机独享标");
        backTopId.html("手机独享标");
    }
    if(data.startTime != null && data.startTime > 0){//定时标
        if(isNormalBid){
        	isNormalBid = false
            tenderAllBtn.remove();
            tipsErrorId.remove();
            tenderAmountId.replaceWith('<div id="tender_amount" class="text"><i class="iMobile"></i>投标尚未开始，<a href="'+getRootPath()+'/bid/tenderList" class="aBlue">查看其它标 >></a></div>');
        }
        toubiaoBntId.attr("disabled","disabled").attr("class","buttonClassNo");
        setInterval(timeDown,1000);
        backTopId.html("定时标");
        return;
    }
    
    if(isNormalBid){//普通标
        //移除全投按钮
        if(data.tenderBalance == null || data.tenderBalance < data.tenderMinAmount){
            tenderAllBtn.remove();
        }
        //失去焦点
        tenderAmountId.keyup(function() {
            var a = verifyInputAmount();
            if(a!=false) {
                var tenderAmountNum = Number(tenderAmountId.val());//输入的金额
                if(!isNaN(tenderAmountNum) && tenderAmountNum > 0){
                    inputErrorId.empty();
                    var amountNumber=formatMoney(profitCalculator(tenderFormDo.profitAmount, tenderAmountNum, tenderFormDo.totalAmount));
                    inputErrorId.html("到期收益 <em>"+amountNumber+"</em>元");
                }
            }
        });
        //定死投标金额
        if(data.tenderableAmount < data.tenderMinAmount){
        	tenderAllBtn.remove();
            tenderAmountId.val(data.tenderableAmount).attr("readonly","readonly");
            tipsErrorId.html("该标的收尾阶段，赶紧来收尾吧");
        }
        //最高限额
        if(data.tenderMaxAmount != null && data.tenderMaxAmount < data.totalAmount){
            tipsAmountId.html('最高可投 <em>'+formatMoney(data.tenderMaxAmount)+'</em> 元');
        }
        backTopId.html("立即投标");
    }
    //============================== 判断标属性 ==============================
}

//全部投资
function tenderAll(){
    if(tenderFormDo != null){
        var validAmount = Math.min(tenderFormDo.tenderableAmount, tenderFormDo.tenderMaxAmount, tenderFormDo.tenderBalance);//有效投资金额
        $("#tender_amount").val(validAmount);
        $("#input_error_id").empty();
        var validAmountNumber = formatMoney(profitCalculator(tenderFormDo.profitAmount, validAmount, tenderFormDo.totalAmount));
        $("#input_error_id").html("到期收益 <em>"+validAmountNumber+"</em>元");
    }
}

//到期收益计算器
function profitCalculator(profitAmount, tenderAmount, bidAmount){
	return (profitAmount*tenderAmount/bidAmount).toFixed(2);
}

var times = 0;//倒计时矫正
//倒计时功能
function timeDown() {
    var hh = Math.floor(tenderFormDo.startTime/3600);
    var mm = Math.floor((tenderFormDo.startTime%3600)/60);
    var ss = Math.floor(tenderFormDo.startTime%60);
    var showTime = '';
    if(hh>0){
        showTime += hh+'时';
    }
    if(mm>0){
        showTime += mm+'分';
    }
    showTime += ss+'秒';
    $("#submit").html(showTime);
    if (tenderFormDo.startTime > 0){
    	tenderFormDo.startTime--;
        times++;
        if(times%200==0){//200秒矫正一次倒计时
            $.ajax({
                url:getRootPath()+'/bid/tenderDetails',
                data:{
                    bid : $("#borrowId").val()
                },
                type:'post',
                cache:false,
                dataType:'json',
                success:function(data) {
                    tenderFormDo.startTime = data.startTime;
                }
            });
        }
    } else {
        location.reload();
    }
}
