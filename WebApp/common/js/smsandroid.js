// JavaScript Document
var g_chat_sms_pbMatch = '';
var g_scroll_smsList = [];
var g_temp_smsList = [];
var g_send_message_btn_status = 0;
var g_scroll_smsList_status = 0;
var g_temp_pageIndex_status = 1;
var temp_sms_phone_chat_value = '';
var CHAT_SMS_CURBOX = 1;
var CHAT_SMS_SMSTAT = 4;
var g_smsFeature = null;
var g_sms_importenabled = null;
var g_sms_urlenabled = null;
var SMS_MAXPHONESIZE =50;
var pb_start=0;
var pb_end=0;
var g_sms_pageIndex = 1;
var g_sms_readCount = "";
var g_sms_maxphonesize = "";
var g_sms_sortType = 0;
var g_sms_ascending = 0;
var g_sms_unreadPreferred = 0;
var g_sms_recordMsgSum = 0;
var g_sms_simSum = 0;
var g_sms_localSum = 0;
var g_isCDMA = false;
var g_pbToSmsFlag = false;
var g_sendSuccessAndFailedFlag = false;
var g_numberValid = true;
var g_lang_edit = -1;
var SMS_CHAT_PGAE_URL = 'smsandroid.html';
var sms_systemBusy = 113018;
var g_convert_type = '';
var g_sms_totalSmsPage = 0;
var g_sms_curMsgSum = 0;
var g_sms_checkedList = "";
var g_sms_smsListArray = {
    pageindex : g_sms_pageIndex,
    readcount : g_sms_readCount
};
var g_sms_smsCount= {
    LocalUnread:0,
    LocalInbox:0,
    LocalOutbox:0,
    LocalDraft:0,
    LocalDeleted:0,
    SimUnread:0,
    SimInbox:0,
    SimOutbox:0,
    SimDraft:0,
    LocalMax:0,
    SimMax:0
};
var g_sms_NewMsg = '';
var g_sms_smsList = [];
var g_sms_android_store_status = "0/0";
var g_sms_smscharlang = false;
/*********************************************选择添加联系人****************************/
var g_PB_TIMEOUT_SHORT = 30000;
var g_pb_feature = {
    page_size: 15,
    max_record_size: 50,
    max_name_size: 0,
    max_phone_size: 0,
    max_email_size: 0,
    max_search_size: 0,
    max_group_size: 0,
    max_group_name_size: 0,
    export_csv_path: '',
    export_vcard_path: ''
};

var g_pb_local_contact_list_request = {
    GroupID: 0,
    PageIndex: g_pb_pageIndex,
    ReadCount: g_pb_feature.page_size,
    SaveType: 0,
    SortType: 1,
    Ascending: 1,
    KeyWord: ''
};
var g_pb_pageIndex = '';

var g_pb_contactListArray = [];
var g_pb_curContactSum=0;
var phonebook = [];

var g_Current_Phone_Number_chat = 0;
var g_sms_chatList = [];
var g_Current_Chat_Count = 0;
var g_sms_checkedList = "";
var g_isForward = 0;
var g_Current_content = null;

var vLocalShowContactList =
"<li value='%href%' style='border-bottom: solid 1px #b7b8b9;' class='linkmanInfo'>" +
"  <div id='contactName'><a title='%FormattedNameTwo%' herf='javascript:void(0);'>&nbsp;&nbsp;&nbsp;%FormattedNameTwo%</a></div>" +
"  <span id='contactNumberType'>&nbsp;&nbsp;&nbsp;%numberType%</span><div id='contactNumber'><a title='%phone%' herf='javascript:void(0);' style='color: gray;'>&nbsp;&nbsp;&nbsp;%phone%</a></div>" +
'</li>';
var pb_feature = null;
var html = null;
var displayInformations = null;
/*********************************************选择添加联系人****************************/
Date.prototype.Format = function(format) {
    var o = {
        "M+" : this.getMonth()+1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds()
    };
    var k;
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));
    }

    for(k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((''+ o[k]).length));
        }
    }
    return format;
};
//to show the sms store state and show the sms list
function sms_initPage() {
    sms_getBoxCount();
    sms_initBoxCount();
    if(g_sms_curMsgSum > 0) {
        sms_initSMS();
    } else {
        g_sms_curMsgSum = 0;
        g_sms_recordMsgSum = 0;
    }
}

function sms_initSMS() {
    sms_getBoxData();
    g_sms_recordMsgSum = g_sms_curMsgSum;
}

function sms_isValidatePageIndex(pageIndex) {
    var pattern = new RegExp("^\\+?[1-9][0-9]*$");
    var result = pattern.test(pageIndex);
    if(result) {
        if(pageIndex>g_sms_totalSmsPage) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function initChatPage(){
	if(g_lang_edit != '-1') {
        $("#sms_count").html("160(1)");
    } else {
        if(g_isCDMA) {
            $("#sms_count").html("160(1)");
        } else {
            if( 0 == g_smsFeature.smscharlang || "undefined" == typeof(g_smsFeature.smscharlang) ) {
                $("#sms_count").html("160(1)");
            } else {
                $("#sms_count").html("155(1)");
            }
        }
    }
}

function getChatHistory(){
		
	var sms_smsListArray = {
	    phone: g_Current_Phone_Number_chat,
	    pageindex : g_sms_totalSmsPage,
	    readcount: g_smsFeature.pagesize
	};
	sms_smsListArray.pageindex = g_sms_pageIndex;
       var msgCondition = object2xml("request",sms_smsListArray);
       saveAjaxData('api/sms/sms-list-phone',msgCondition, function($xml) {
       var ret = xml2object($xml);
       if (ret.type == "response") {
           if(ret.response.messages.message) {
		       g_sms_chatList=null;
               g_sms_chatList = [];
               if($.isArray(ret.response.messages.message)) {
                   g_sms_chatList = ret.response.messages.message;
               } else {
                   g_sms_chatList.push(ret.response.messages.message);
               }
               if(g_scroll_smsList_status == 0 || (g_send_message_btn_status ==1 && (g_scroll_smsList_status == 1))){
                   g_scroll_smsList = [];
                   g_scroll_smsList = g_scroll_smsList.concat(g_sms_chatList);              	
               }
		       if(g_Current_Chat_Count != g_sms_curMsgSum  || g_sms_pageIndex!=g_sms_pageIndex_last ||('0' != g_sms_NewMsg && "undefined" !=typeof(g_sms_NewMsg) && "" != g_sms_NewMsg)){
                   g_Current_Chat_Count = g_sms_curMsgSum;
			       g_sms_pageIndex_last = g_sms_pageIndex;
                   showChatHistory();
                   $('.sms_chat_list').scrollTop(parseInt($('.sms_chat_list')[0].scrollHeight,10)-parseInt($(".sms_chat_list").height(),10));
			       setChatSmsRead();
		       }			
           } else {
                log.error("SMS: get api/sms/sms-list-phone data error");
           }
       } else {
           log.error("SMS: get api/sms/sms-list-phone data error");
	       g_sms_chatList =null;
	       gotoPageWithoutHistory("smsandroid.html");
	       g_Current_Chat_Count =0;			 
			
       }
       }, {
           errorCB: function() {
            log.error("SMS: get api/sms/sms-list-phone file failed");
        }
    });

}

function chat_smsDelete(smsIndex) {
    cancelLogoutTimer();
    g_sms_checkedList = "";// be checked
    g_sms_checkedList+="<Index>"+smsIndex+"</Index>";
    var xmlstr = object2xml("request", g_sms_checkedList);
    saveAjaxData("api/sms/delete-sms",xmlstr, function($xml) {
        var ret = xml2object($xml);
        startLogoutTimer();
        if(isAjaxReturnOK(ret)) {
            sms_getBoxCount();
            getChatHistory();
        }else{
            showInfoDialog(common_failed);            
        }
    });
}
function chat_Forward(content){
	g_isForward=1;
	var forwardContent = content;
	sms_showSmsDialog();
    var buttonHtml = create_button_html(common_send,"pop_send", "pop_send") + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + create_button_html(common_cancel,"pop_Cancel","pop_Cancel");
    cancelLogoutTimer();
    $(".dialog_table_r").html(buttonHtml);
    ieRadiusBorder();
    $("#message_content").val(forwardContent);
    sms_contentChange(forwardContent);
    $("#recipients_number").focus().select();
}

// bind emement event
function sms_btnAddEvent() {
    $("#sms_table :checkbox").live("click", function() {
        var $allCheckBox = $("#sms_table :checkbox");
        var checkedCount ,allChecked;
        if(this == $allCheckBox[0]) {
            $allCheckBox.attr("checked",this.checked);
        } else {
            checkedCount = $allCheckBox.filter(":not(:first)").filter(":checked").length;
            allChecked = checkedCount+1 == $allCheckBox.length;
            $allCheckBox[0].checked = allChecked;
        }
        checkedCount = $allCheckBox.filter(":not(:first)").filter(":checked").length;
        if(checkedCount > 0){
            $('#sms_android_delete_blue').show();
            $('#sms_android_delete_grey').hide();
        }else{
            $('#sms_android_delete_blue').hide();
            $('#sms_android_delete_grey').show();
        }
    });
    //
    $("#sms_android_delete_blue").bind("click", function() {
        showConfirmDialog(common_confirm_delete_list_item, function() {
            sms_smsDelete();
            $('#sms_android_delete_blue').hide();
            $('#sms_android_delete_grey').show();
        }, function() {
        });
    });
    $("#jump_page").bind("click", function() {
        $.each($('.qtip-defaults'), function() {
            $(this).remove();
        });
        var pageIndex = $("#jump_page_index").val();

        if(sms_isValidatePageIndex(pageIndex)) {
            sms_pageNav(pageIndex);
        } else {
            showQtip("jump_page_index", sms_hint_wrong_page_num);
            $("#jump_page_index").select();
        }
    });
    $("#jump_page_chat").bind("click", function() {
        $.each($('.qtip-defaults'), function() {
            $(this).remove();
        });
        var pageIndex =$("#jump_page_index_chat").val();
			
        if(sms_isValidatePageIndex(pageIndex)) {
            sms_pageNav(pageIndex);
        } else {
            showQtip("jump_page_index_chat", sms_hint_wrong_page_num);
            $("#jump_page_index_chat").select();
        }
    });
    //
    if(false == g_sms_importenabled) {
        $("#import_btn").remove();
    } else {
        $("#import_btn").bind("click", function() {
            sms_importMessage();
        });
    }
}


function sms_init_info() {
    sms_initBoxCount();
    if((g_sms_curMsgSum > 0) && ((g_sms_recordMsgSum != g_sms_curMsgSum)|| ('0' != g_sms_NewMsg && "undefined" !=typeof(g_sms_NewMsg) && "" != g_sms_NewMsg))) {
        sms_initSMS();
    }
}
//
function sms_getBoxCount(option,callback_func) {
    if(option != null) {
        option = false;
    } else {
        option = true;        
    }
    getAjaxData("api/sms/sms-count", function($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {
            g_sms_smsCount = ret.response;
            g_sms_NewMsg  = ret.response.NewMsg;
        } else {
            log.error("SMS: get api/sms/sms-count data error");
        }
        g_sms_localSum = parseInt(g_sms_smsCount.LocalInbox, 10)
        +parseInt(g_sms_smsCount.LocalOutbox,10)
        +parseInt(g_sms_smsCount.LocalDraft,10)
        +parseInt(g_sms_smsCount.LocalDeleted,10);
        if('undefined' != typeof(g_sms_smsCount.SimUsed)) {
            g_sms_simSum = g_sms_smsCount.SimUsed;
        } else {
            g_sms_simSum = parseInt(g_sms_smsCount.SimInbox, 10)
            +parseInt(g_sms_smsCount.SimOutbox,10)
            +parseInt(g_sms_smsCount.SimDraft,10);
        }
        if(g_sms_localSum >= g_sms_smsCount.LocalMax && g_sms_smsCount.LocalMax > 0) {
            $("#fullMessage_tip_div").show();
        } else {
            $("#fullMessage_tip_div").hide();
        }          
        if(typeof callback_func == 'function') {
            callback_func();
        }
    }, {
        sync : option,
        errorCB: function() {
            log.error("SMS: get api/sms/sms-count file failed");
        }
    });
       
    if(-1 != window.location.href .lastIndexOf("smschat")){
        if(!g_module.pb_enabled){
            if($("#cur_box_type_android_chat").text() != g_Current_Phone_Number_chat){
                $('#cur_box_type_android_chat').text(g_Current_Phone_Number_chat);
            }
        }
        var sms_chat_inbox_count = {
            phone: g_Current_Phone_Number_chat
        };
        var msgCondition = object2xml("request",sms_chat_inbox_count);
        saveAjaxData('api/sms/sms-count-contact',msgCondition, function($xml) {
            var ret = xml2object($xml);
            if (ret.type == "response") {
                g_sms_curMsgSum = ret.response.count;
		    }
	    },{
            sync : true,
            errorCB: function() {
                log.error("SMS: get api/sms/sms-count-contact file failed");
            }
        });
	}else {
		if($("#cur_box_type_android").text() != sms_label_message){
            $("#cur_box_type_android").text(sms_label_message);	
        }
        getAjaxData("api/sms/sms-count-contact", function($xml) {
            var ret = xml2object($xml);
            if (ret.type == "response") {
                g_sms_curMsgSum = ret.response.count;
            }
        }, {
            sync : true,
            errorCB: function() {
                //showInfoDialog(common_error);
                log.error("SMS: get api/sms/sms-count-contact  failed");
            }
	    });
   }  
}

/*calculate inbox sms count and if there is sms in inbox or sentbox or draftbox ,then show the list
 * else give 'no message' tip
 */
function sms_initBoxCount() {
    var unread = 0,
    inbox = 0,
    outbox = 0,
    draftbox = 0;
    var android_sum = 0;
    unread = g_sms_smsCount.LocalUnread;
    inbox = g_sms_smsCount.LocalInbox;
    outbox = g_sms_smsCount.LocalOutbox;
    draftbox = g_sms_smsCount.LocalDraft;
    android_sum = parseInt(inbox,10)+parseInt(outbox,10)+parseInt(draftbox,10);
    g_sms_android_store_status = unread+"/"+android_sum;
    $('#label_android_status').text(g_sms_android_store_status);
    //
    if(g_sms_curMsgSum >0) {
        g_sms_totalSmsPage = Math.ceil(g_sms_curMsgSum/g_sms_smsListArray.readcount);
        g_sms_pageIndex = Math.min(g_sms_pageIndex,g_sms_totalSmsPage);
        var curSmsPage = g_sms_pageIndex+"/"+g_sms_totalSmsPage;
        $("#curSmsPage_chat").text(curSmsPage);
        $('#curSmsPage_phone_chat').text(curSmsPage);
        sms_createPageNav();
        sms_createPageNav_Chat();
        $(".sms_pagination div").show();
    } else {
        $("#sms_check_all").removeAttr("checked");
        $(".sms_list_tr").remove();
        $(".sms_pagination div").hide();
    }

}


//get current box(inbox/sendbox/draftbox) sms
function sms_getBoxData() {
    g_sms_smsListArray.pageindex = g_sms_pageIndex;
    var msgCondition = object2xml("request",g_sms_smsListArray);
    saveAjaxData('api/sms/sms-list-contact',msgCondition, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {
            if(ret.response.messages.message) {
                g_sms_smsList = [];
                if($.isArray(ret.response.messages.message)) {
                    g_sms_smsList = ret.response.messages.message;
                } else {
                    g_sms_smsList.push(ret.response.messages.message);
                }
                sms_initBoxList();
            } else {
                log.error("SMS: get api/sms/sms-list-contact data error");
            }
        } else {
            log.error("SMS: get api/sms/sms-list-contact data error");
        }
    }, {
        errorCB: function() {
            log.error("SMS: get api/sms/sms-list-contact file failed");
        }
    });
}

//crate dynamic table to show the sms list
function sms_initBoxList() {
    var boxListStr = "";
    var smsReadState = null;
    var tempContent = "";
    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    //
    var $preTr= $("#boxList_title"),
    $row = null,
    $cell_1 = null,$cell_2 = null,$cell_3 = null,$cell_4 = null,
    $pre = null;
    //
    $(".sms_list_tr").remove();
    var postObject = {};
    var contactsArray = [];
    // var tempPhone = '';
    $.each(g_sms_smsList, function(n,message) {
        switch(parseInt(message.smstype,10)) {
            case 7:
                message.content = sms_label_setting_usesreport  + common_colon + " " + common_success;
                break;
            case 8:
                message.content = sms_label_setting_usesreport  + common_colon + " " + common_failed;
                break;
            default:
                break;
        }
        if(g_sms_urlenabled) {
            tempContent = regURL( message.content );
        } else {
            tempContent= XSSResolveCannotParseChar(message.content);
        }
        smsReadState = "read_state"+ message.smstat;
        var msgDate = message.date;
        msgDate = new Date(msgDate.replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm:ss");

        var phoneArry=message.phone.split(";");

        var messagePhone = sms_enterPhone(phoneArry);
        if(messagePhone == '' || messagePhone == null){
            messagePhone = IDS_sms_phone_not_fill;	
        }
        var smsReadStatesID = 'smsReadStates' + message.index;
        $row  = $("<tr class='sms_list_tr'></tr>");
        $cell_1 = $("<td width='50' class='sms_td'></td>");
        $cell_1.append("<input type='checkbox' name='checkbox' value='"+messagePhone+"' />");
        $row.append($cell_1);
        //
        $cell_2 = $("<td  class='td_pl sms_phone_width'></td>");
        if(parseInt(message.unreadcount,10) > 0 && (message.smstat == CHAT_SMS_SMSTAT)){
            $cell_2.html("<table border='0' cellpadding='0' class='sms_msg' cellspacing='0'>"
            +"<tr>"
            +"<td class='sms_phone_number'>"+messagePhone
            +"<span>&nbsp;&nbsp;&nbsp;(&nbsp;"+message.unreadcount+"&nbsp;)</span>&nbsp;&nbsp;"
            +"<span class='chat_send_failed_icon'>&nbsp;</span>"
            +"</td></tr>"
            +"</table>");	
        }else if(parseInt(message.unreadcount,10) > 0 && (message.smstat != CHAT_SMS_SMSTAT)){
            $cell_2.html("<table border='0' cellpadding='0' class='sms_msg' cellspacing='0'>"
            +"<tr>"
            +"<td class='sms_phone_number'>"+messagePhone
            +"<span>&nbsp;&nbsp;&nbsp;(&nbsp;"+message.unreadcount+"&nbsp;)</span>"
            +"</td></tr>"
            +"</table>");	
        }else if(parseInt(message.unreadcount,10) <= 0 && (message.smstat == CHAT_SMS_SMSTAT)){
            $cell_2.html("<table border='0' cellpadding='0' class='sms_msg' cellspacing='0'>"
            +"<tr>"
            +"<td class='sms_phone_number'>"+messagePhone
            +"&nbsp;&nbsp;<span class='chat_send_failed_icon'>&nbsp;</span>"
            +"</td></tr>"
            +"</table>");	
        }else{
            $cell_2.html("<table border='0' cellpadding='0' class='sms_msg' cellspacing='0'>"
            +"<tr>"
            +"<td class='sms_phone_number'>"+messagePhone
            +"</td></tr>"
            +"</table>");	
        }
        $row.append($cell_2);
        //
        $cell_3 = $("<td  class='td_pl sms_content_width'></td>");
        $pre = $("<pre class='sms_content clr_blue_a'></pre>");
        if(tempContent.length != message.content.length) {
            $pre.html( tempContent );
        } else {
            $pre.text( tempContent );
        }
        $cell_3.html($pre);
        $row.append($cell_3);
        //
        $cell_4 = $("<td  class='td_pl sms_date_width'></td>");
        $cell_4.append("<label>"+msgDate+"</label>");
        $row.append($cell_4);
        $preTr.after($row);
        $preTr = $row;
        contactsArray.push(message.phone);
    });
    postObject = {
        Phone:contactsArray
    };

    var pb_sum=0;
    var pb_array=[];
    if(g_module.pb_enabled) {
        pb_start=0;
        pb_end=0;
        for(i=0;i<contactsArray.length;i++) {
            var    str=contactsArray[i].split(";");
            if(str.length<=50) {
                if((pb_sum+str.length)>50) {
                    pb_end=i;
                    i--;
                    postObject = {
                        Phone:pb_array
                    };
                    pb_match(postObject);

                    pb_sum=0;
                    pb_array=[];
                } else {
                    pb_sum+=str.length;
                    pb_array.push(contactsArray[i]);
                    if(i==contactsArray.length-1&&pb_sum==0) {
                        postObject = {
                            Phone:contactsArray[i]
                        };
                        pb_match(postObject);

                    } else if(i==contactsArray.length-1 && pb_sum!=0 && pb_sum<=50) {
                        postObject = {
                            Phone:pb_array
                        };
                        pb_end=i;
                        pb_match(postObject);

                    }

                }

            }

        }
    }
    $("#sms_check_all").removeAttr("checked");
}

function pb_match(postObject) {
    var postData = object2xml("request",postObject);
    saveAjaxData("api/pb/pb-match", postData, function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            var contactsName = ret.response.Name;
            if(contactsName) {
                var index = 0;
                var i = 0;
                var pb_phoneArry = null;
                var pb_contactsName = "";
                g_chat_sms_pbMatch = contactsName; 
                if($.isArray(contactsName)) {
                    for(i = pb_start; i <= pb_end; i++) {
                        if('' != $(".sms_phone_number").eq(i).text()) {
                            if((i+1) > pb_end) {
                                pb_start=pb_end;
                            }
                            pb_phoneArry=contactsName[index].split(";");
                            pb_contactsName=sms_enterPhone(pb_phoneArry);
                            $(".sms_phone_number").eq(i).html(spaceToNbsp(pb_contactsName));
                            index++;
                        }
                    }

                } else {
                    for(i = pb_start; i <= pb_end; i ++) {
                        if('' != $(".sms_phone_number").eq(i).text()) {
                            if((i+1) > pb_end) {
                                pb_start=pb_end;
                            }
                            pb_phoneArry=contactsName.split(";");
                            pb_contactsName=sms_enterPhone(pb_phoneArry);
                            $(".sms_phone_number").eq(i).html(spaceToNbsp(pb_contactsName));
                        }
                    }
                }
            }
        }
    }, {
        sync : true
    });
    postObject='';
}

function sms_enterPhone(str) {
    pb_contactsName="";
    for(j=0;j<str.length;j++) {
        str[j] = XSSResolveCannotParseChar(str[j]);
        if( j != str.length-1) {
            pb_contactsName+=str[j]+";"+"<br/>";
        } else {
            pb_contactsName+=str[j];
        }

    }
    return pb_contactsName;
}

//create the page navigate menu
function sms_createPageNav() {
    var page_number = "";
    var aContent = 0;
    //to begin or end href
    var pageBeginHref = "",
    pageLastHref = "";
    pageBeginHref = (g_sms_pageIndex==1)?"javascript:void(0);" : "javascript:sms_pageNav('first')";
    pageLastHref = (g_sms_pageIndex == g_sms_totalSmsPage)?"javascript:void(0);" : "javascript:sms_pageNav('last')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language) {
        $('#pageBegin_chat').attr('href', pageLastHref);
        $('#pageLast_chat').attr('href', pageBeginHref);
    } else {
        $('#pageBegin_chat').attr('href', pageBeginHref);
        $('#pageLast_chat').attr('href', pageLastHref);
    }
    //to previous or next page
    var prePageHref = "",
    nextPageHref = "";
    prePageHref = (g_sms_pageIndex==1)? "javascript:void(0);" : "javascript:sms_pageNav('prePage')";
    nextPageHref = (g_sms_pageIndex == g_sms_totalSmsPage)? "javascript:void(0);" : "javascript:sms_pageNav('nextPage')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language) {
        $('#prePage_chat').attr('href', nextPageHref);
        $('#nextPage_chat').attr('href', prePageHref);
    } else {
        $('#prePage_chat').attr('href', prePageHref);
        $('#nextPage_chat').attr('href', nextPageHref);
    }
    //
    var beginPage , endPage ,pageSize = 8;
    g_sms_pageIndex = parseInt(g_sms_pageIndex,10);
    if(g_sms_totalSmsPage > pageSize) {
        if(g_sms_pageIndex +pageSize/2 >=g_sms_totalSmsPage) {
            endPage = g_sms_totalSmsPage;
            beginPage = endPage - pageSize;
        } else if(g_sms_pageIndex <=pageSize/2) {
            beginPage = 1;
            endPage = beginPage +pageSize;
        } else {
            beginPage = g_sms_pageIndex>4?g_sms_pageIndex-4:1;
            endPage = g_sms_pageIndex +4> g_sms_totalSmsPage? g_sms_totalSmsPage:g_sms_pageIndex +4;
        }
    } else {
        beginPage = 1;
        endPage = g_sms_totalSmsPage;
    }
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language) {
        for(i=endPage;i>=beginPage;i--) {
            aHref = i==g_sms_pageIndex? " href=\"javascript:void(0);\"" : " href=\"javascript:sms_pageNav('"+i+"')\" style=\"text-decoration:underline\"";
            page_number += "<a "+aHref+">"+i+"</a>";
        }
    } else {
        for(i=beginPage;i<=endPage;i++) {
            aHref = i==g_sms_pageIndex? " href=\"javascript:void(0);\"" : " href=\"javascript:sms_pageNav('"+i+"')\" style=\"text-decoration:underline\"";
            page_number += "<a "+aHref+">"+i+"</a>";
        }
    }
    $("#page_num_chat").html(page_number);
}
function sms_createPageNav_Chat() {
    var page_number = "";
    var aContent = 0;
    //to begin or end href 
    var pageBeginHref = "",
    pageLastHref = "";
    pageBeginHref = (g_sms_pageIndex==1)?"javascript:void(0);" : "javascript:sms_pageNav('first')";
    pageLastHref = (g_sms_pageIndex == g_sms_totalSmsPage)?"javascript:void(0);" : "javascript:sms_pageNav('last')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language) {
        $('#pageBegin_phone_chat').attr('href', pageLastHref);
        $('#pageLast_phone_chat').attr('href', pageBeginHref);
    } else {
        $('#pageBegin_phone_chat').attr('href', pageBeginHref);
        $('#pageLast_phone_chat').attr('href', pageLastHref);
    }
    //to previous or next page
    var prePageHref = "",
    nextPageHref = "";
    prePageHref = (g_sms_pageIndex==1)? "javascript:void(0);" : "javascript:sms_pageNav('prePage')";
    nextPageHref = (g_sms_pageIndex == g_sms_totalSmsPage)? "javascript:void(0);" : "javascript:sms_pageNav('nextPage')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language) {
        $('#prePage_phone_chat').attr('href', nextPageHref);
        $('#nextPage_phone_chat').attr('href', prePageHref);
    } else {
        $('#prePage_phone_chat').attr('href', prePageHref);
        $('#nextPage_phone_chat').attr('href', nextPageHref);
    }
    //
    var beginPage , endPage ,pageSize = 4;
    g_sms_pageIndex = parseInt(g_sms_pageIndex,10);
    if(g_sms_totalSmsPage > pageSize) {
        if(g_sms_pageIndex +pageSize/2 >=g_sms_totalSmsPage) {
            endPage = g_sms_totalSmsPage;
            beginPage = endPage - pageSize;
        } else if(g_sms_pageIndex <=pageSize/2) {
            beginPage = 1;
            endPage = beginPage +pageSize;
        } else {
            beginPage = g_sms_pageIndex>2?g_sms_pageIndex-2:1;
            endPage = g_sms_pageIndex +2> g_sms_totalSmsPage? g_sms_totalSmsPage:g_sms_pageIndex +2;
        }
    } else {
        beginPage = 1;
        endPage = g_sms_totalSmsPage;
    }
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language) {
        for(i=endPage;i>=beginPage;i--) {
            aHref = i==g_sms_pageIndex? " href=\"javascript:void(0);\"" : " href=\"javascript:sms_pageNav('"+i+"')\" style=\"text-decoration:underline\"";
            page_number += "<a "+aHref+">"+i+"</a>";
        }
    } else {
        for(i=beginPage;i<=endPage;i++) {
            aHref = i==g_sms_pageIndex? " href=\"javascript:void(0);\"" : " href=\"javascript:sms_pageNav('"+i+"')\" style=\"text-decoration:underline\"";
            page_number += "<a "+aHref+">"+i+"</a>";
        }
    }
    $("#page_num_phone_chat").html(page_number);
}

//to change current page index then refresh the sms list
function sms_pageNav(to) {
    g_temp_pageIndex_status = g_sms_pageIndex;
    switch(to) {
        case "first":
            g_sms_pageIndex = 1;
            break;
        case "last":
            g_sms_pageIndex = g_sms_totalSmsPage;
            break;
        case "prePage":
            g_sms_pageIndex --;
            break;
        case "nextPage":
            g_sms_pageIndex ++;
            break;
        default:
            g_sms_pageIndex = to;
            break;
    }
    if(g_temp_pageIndex_status != g_sms_pageIndex){
        g_scroll_smsList_status = 0;    	
    }
    $(document).scrollTop(0);
    if(-1 != window.location.href.lastIndexOf("smschat")){
        sms_getBoxCount();
        sms_initBoxCount();
        getChatHistory();
    }else{
        sms_initPage();
    }
    $("#jump_page_index").val("");
    $("#jump_page_index_chat").val("");	
}

//function delete user checked sms
function sms_smsDelete() {
    cancelLogoutTimer();
    g_sms_checkedList = "<phone>";
    var beChecked = $("#sms_table :checkbox:gt(0):checked");
    beChecked.each( function() {
        var tempPhone = this.value;
        tempPhone = tempPhone.replace(/<br\/>/g, "");
        g_sms_checkedList += tempPhone+";";
    });
    g_sms_checkedList = g_sms_checkedList.substring(0,g_sms_checkedList.lastIndexOf(';'));
    g_sms_checkedList += "</phone>";
    var xmlstr = object2xml("request", g_sms_checkedList);
    saveAjaxData("api/sms/sms-delete-phone",xmlstr, function($xml) {
        var ret = xml2object($xml);
        startLogoutTimer();
        if(isAjaxReturnOK(ret)) {				
            sms_initPage();
        }
    });
}

//
function sms_importMessage() {
    if(g_sms_simSum == 0 ) {
        showInfoDialog(strid_sms_hint_import_none);
        return;
    }
    if(g_sms_localSum >= g_sms_smsCount.LocalMax) {
        showInfoDialog(strid_sms_hint_no_room);
        return;
    }
    $("#pop_confirm").die("click");
    $("#pop_Cancel").die("click");
    $(".dialog_close_btn").die("click");
    $(".wait_dialog_btn").die("click");
    $("#pop_OK").die("click");
    showConfirmDialog(strid_sms_hint_import_conform, function() {

        $(".dialog").remove();
        if(g_sms_simSum == 1) {
            showWaitingDialog(common_waiting, STRID_sms_message_importing_message);

        } else {
            showWaitingDialog(common_waiting, STRID_sms_message_importing_messages.replace("%d", g_sms_simSum));
        }
        var backupSim = {
            IsMove:0,
            Date : new Date().Format("yyyy-MM-dd hh:mm:ss")
        };

        var beforeLocalSum = g_sms_localSum;
        var xmlstr = object2xml("request",backupSim);
        saveAjaxData("api/sms/backup-sim",xmlstr, function($xml) {
            var ret = xml2object($xml);
            closeWaitingDialog();
            if(ret.type=='response') {
                if(  sms_systemBusy == ret.response.Code) {
                    showInfoDialog(common_system_busy);
                } else if("" != ret.response.FailNumber && "undefined" != ret.response.FailNumber &&
                "" != ret.response.sucNumber && "undefined" != ret.response.sucNumber) {

                    sms_getBoxCount();

                    var failNumber =  parseInt(ret.response.FailNumber, 10);
                    var sucNumber = parseInt(ret.response.SucNumber, 10);
                    showInfoDialog(sucNumber+" "+common_succeed +common_comma+ failNumber+" "+common_failed);
                }
            } else {
                showInfoDialog(common_failed);
            }
        }, {
            timeout : 300000,
            errorCB: function() {
                closeWaitingDialog();
                showInfoDialog(common_failed);
            }
        });
    }, function() {
    });
}

function sms_showWaitingDialog(tipTitle, tipContent, callback_func) {
    $("#div_wrapper").remove();
    var tab = "<table colspacing='0' cellspacing='0' id='wait_table' class='wait_table'>" +
    "<tr><td><div class='wait_table_header'><label class='wait_title clr_white'>" +
    tipTitle +
    "</label><span class='wait_dialog_btn' id='wait_dialog_btn clr_gray' ><canvas id='sessionSms_showWaitingCanvas' width='25px' height='25px'></canvas></span></div></td></tr>" +
    "<tr><td><div class='wait_table_content'><div class='wait_wrapper'><div class='wait_image'><img src='../res/waiting.gif' alt=''/></div><div class='wait_str'>" +
    tipContent +
    "</div></div></div></td>" +
    "</tr>" +
    "<tr>" +
    "<td><div class='wait_table_content_sms'>"+
    "<span class='button_wrapper pop_Cancel'>"+
    "<input id='pop_Cancel' class='button_dialog' type='button' value='"+common_cancel+"'/></span>"+
    "</div></td>"+
    "</tr>"+
    "</table>";
    var wait_div = "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>" + tab;
    $("body").append(wait_div);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)){
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("sessionSms_showWaitingCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)){
        $(".wait_title").css("margin-top","5");
        $(".wait_dialog_btn").css("margin-top","7px");
        $(".wait_table_header").css({"width":"383px","height":"26px"});
        $(".wait_table_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        var ahtml="<img src='../res/dialog_close_btn.png' title='' alt='' />";
        $(".wait_table_header span").append(ahtml);
    }else{
        var canvas = document.getElementById("sessionSms_showWaitingCanvas");
        draw(canvas);
    }
    reputPosition($("#wait_table"),$("#div_wrapper"));

    $("#wait_dialog_btn").bind("click", function() {
        closeWaitingDialog();
    });
    $("#pop_Cancel").live("click", function() {
        $("#wait_table, #div_wrapper").remove();
        if (typeof(callback_func) == "function") {
            callback_func();
        }
    });
}

//-------------------------------------------------------------------------------------------------------------
function sms_showSmsDialog() {
    $("#div_wrapper").remove();
    $("#sms_dialog").remove();

    g_content = null;
    var dialogHtml = "";
    if ($("#div_wrapper").size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog' id='sms_dialog'>";
    
    dialogHtml += "    <div class='sms_dialog_content'>";
    dialogHtml += "        <div class='sms_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + sms_label_message + "</span>";
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='sessionSms_showSmsCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += "        </div>";
    dialogHtml += "        <div class='sms_dialog_table'>";
    dialogHtml += "               <div class='sms_message'>";
    dialogHtml += "               <p  id = 'recipients_sender'>" + sms_label_recipients + common_colon + "</p>";
    dialogHtml += "               <div id='sms_number_wrapper'>";
    dialogHtml += "                   <div id='sms_number'>";    
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        dialogHtml += "                   <input type='text' id='recipients_number_pb' name='recipients_number_pb' value='' />";
        dialogHtml += "                   <img id='close_search_recipients_number' src='../res/-.png' alt='' style='display:none;'/>";
        dialogHtml += "                   <img id='search_recipients_number' src='../res/+.png' alt=''/>";
    }else {
        dialogHtml += "                   <input type='text' id='recipients_number' name='recipients_number' value='' />";
    }    
    dialogHtml += "                   </div>";
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        dialogHtml += "                   <div id='user_add_select' class='user_add_select'><ul id='list_contacts' ></ul></div>";
    }    
    dialogHtml += "               </div>";
    dialogHtml += "               <p>" + sms_label_content + common_colon + "</p>";
    dialogHtml += "               <textarea id='message_content'></textarea>";
    dialogHtml += "               <p id='sms_count'></p>";
    dialogHtml += "               </div>";
    dialogHtml += "        </div>";
    dialogHtml += "        <div class='sms_dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";

    dialogHtml += "              <span class='button_wrapper pop_send'>";
    dialogHtml += "                  <input id='pop_send' class='button_dialog' type='button' value='" + common_send + "'/></span>";
    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_save_to_drafts'>";
    dialogHtml += "                  <input id='pop_save_to_drafts' class='button_dialog' type='button' value='" + sms_label_save_to_drafts + "'/></span>";

    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel pop_common_cancel'>";
    dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='" + common_cancel + "'/></span>";

    dialogHtml += "            </div>";
    dialogHtml += "        </div>";
    dialogHtml += "    </div>";
    dialogHtml += "</div>";

    $(".body_bg").before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)){
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("sessionSms_showSmsCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)){
        $(".dialog_header_left").css("margin-top","5");
        $(".sms_dialog_header").css({"width":"609px","height":"29px"});
        $(".sms_dialog_header").corner("top 5px");
        $(".dialog_close_btn").css("top","7");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        var ahtml="<img src='../res/dialog_close_btn.png' title='' alt='' />";
        $(".sms_dialog_header a").append(ahtml);
    }else{      
        var canvas = document.getElementById("sessionSms_showSmsCanvas");
        draw(canvas);
    }
    if(g_lang_edit != '-1') {
        $("#sms_count").html("160(1)");
    } else {
        if(g_isCDMA) {
            $("#sms_count").html("160(1)");
        } else {
            if( 0 == g_smsFeature.smscharlang || "undefined" == typeof(g_smsFeature.smscharlang) ) {
                $("#sms_count").html("160(1)");
            } else {
                $("#sms_count").html("155(1)");
            }
        }

    }

    reputPosition($("#sms_dialog"),$("#div_wrapper"));

    disableTabKey();
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        $("#recipients_number_pb").attr("tabindex", "0");
    }else {
        $("#recipients_number").attr("tabindex", "0");
    }    
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        createList();
    }            
}

function  sms_changeNetwork() {
    if(g_net_mode_change==MACRO_NET_MODE_CHANGE) {
        if(g_net_mode_status==MACRO_NET_MODE_C) {
            g_isCDMA=true;
        } else if(g_net_mode_status==MACRO_NET_MODE_W) {
            g_isCDMA= false ;
        }
        if("undefined" != typeof($("#message_content").val())) {
            sms_contentChange($("#message_content").val());
        }
        resetNetModeChange();
    }
}

function sms_newMessage() {
    g_sms_length = 0;
    cancelLogoutTimer();
    sms_showSmsDialog();
    var buttonHtml = create_button_html(common_send,"pop_send", "pop_send") + "&nbsp;&nbsp;&nbsp;&nbsp;"
    + create_button_html(common_cancel,"pop_chat_Cancel","pop_chat_Cancel");
    $(".dialog_table_r").html(buttonHtml);
    ieRadiusBorder();
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        $("#recipients_number_pb").focus().select();
    }else {
        $("#recipients_number").focus().select();
    }    
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        $('#pop_send,#pop_chat_Cancel,.dialog_close_btn').live('click', function() {
            $('#user_add_select').hide();
            $('#search_recipients_number').show();
            $('#close_search_recipients_number').hide();
        });
    } else {
        $("#search_recipients_number").hide();
    }
}

// set sms read
function setSmsRead(currentSmsIndex) {
    $(g_sms_smsList).each( function(i) {
        if(g_sms_smsList[i].index == currentSmsIndex) {
            if(g_sms_smsList[i].smstat == 0) {
                var submitXmlObject = {
                    Index:currentSmsIndex
                };
                var submitData = object2xml("request", submitXmlObject);
                saveAjaxData("api/sms/set-read", submitData, function($xml) {
                    var ret = xml2object($xml);
                    if(isAjaxReturnOK(ret)) {
                        $("#smsReadStates"+currentSmsIndex).attr('class','msg_icon read_state1');
                    }
                });
            }
        }
    });
}

//-------------------------------------------------------------------------------------------------
var PAGE_HANDLE_FORWARD = '0';
var PAGE_HANDLE_REPLY = '1';
var PAGE_HANDLE_READ = '2';
var PAGE_HANDLE_CREATE = '3';
var PAGE_HANDLE_NULL = '4';
var SMS_TEXT_MODE_UCS2 =  0;
var SMS_TEXT_MODE_7BIT =  1;
var SMS_TEXT_MODE_8BIT =  2;
var ASCII_CODE    = 127;
var g_SMS_UCS2_MAX_SIZE;
var g_SMS_8BIT_MAX_SIZE;
var g_SMS_7BIT_MAX_SIZE;
var g_content = null;
var g_text_mode = SMS_TEXT_MODE_7BIT;
var g_sms_length = 0;
var g_sms_num = 1;
var g_ucs2_num = 0;
var g_station;
var GSM_7BIT_NUM = 128;
var SMS_STR_NUM = 620;
var EXTENSION_ASCII = 9;

var g_ext_7bit_tab = [
[20, 0x005E], [40, 0x007B], [41, 0x007D],
[47, 0x005C], [60, 0x005B], [61, 0x007E],
[62, 0x005D], [64, 0x007C], [101, 0x20AC]
];

var g_ext_7bit_tab_turkish = [
[13, 0x001D], [20, 0x005E],
[40, 0x007B], [41, 0x007D], [47, 0x005C], [60, 0x005B],
[61, 0x007E], [62, 0x005D], [64, 0x007C], [71, 0x011E],
[73, 0x0130], [83, 0x015E], [99, 0x00E7], [101, 0x20AC],
[103, 0x011F], [105, 0x0131], [115, 0x015F]
];

var g_ext_7bit_tab_spanish = [
[9, 0x00E7],  [20, 0x005E],
[40, 0x007B], [41, 0x007D], [47, 0x005C], [60, 0x005B],
[61, 0x007E], [62, 0x005D], [64, 0x007C], [65, 0x00C1],
[73, 0x00CD], [79, 0x00D3], [85, 0x00DA], [97, 0x00E1],
[101, 0x20AC], [105, 0x00ED], [111, 0x00F3], [117, 0x00FA]
];

var g_ext_7bit_tab_Portuguese = [
[5, 0x00EA], [9, 0x00E7],   [11, 0x00D4],
[12, 0x00F4], [14, 0x00C1], [15, 0x00E1],[18, 0x03A6],
[19, 0x0393], [20, 0x005E], [21, 0x03A9], [22, 0x03A0],
[23, 0x03A8], [24, 0x03A3], [25, 0x0398],
[31, 0x00CA], [40, 0x007B], [41, 0x007D], [47, 0x005C],
[60, 0x005B], [61, 0x007E], [62, 0x005D], [64, 0x007C],
[65, 0x00C0], [73, 0x00CD], [79, 0x00D3], [85, 0x00DA],
[91, 0x00C3], [92, 0x00D5], [97, 0x00C2], [101, 0x20AC],
[105, 0x00ED], [111, 0x00F3], [117, 0x00FA], [123, 0x00E3],
[124, 0x00F5], [127, 0x00E2]
];
var extension_char = 27;
var ENTER_CHAR = 10;
var CR_CHAR = 13;
var arrayGSM_7bit =
[
0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F,
0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F,
0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F,
0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F,
0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A, 0x7B, 0x7C, 0x7D, 0x7E, 0x7F
];
var arrayGSM_7DefaultTable =
[
0x0040, 0x00A3, 0x0024, 0x00A5, 0x00E8, 0x00E9, 0x00F9, 0x00EC, 0x00F2, 0x00C7, 0x000A, 0x00D8, 0x00F8, 0x000D, 0x00C5, 0x00E5,
0x0394, 0x005F, 0x03A6, 0x0393, 0x039B, 0x03A9, 0x03A0, 0x03A8, 0x03A3, 0x0398, 0x039E, 0x001B, 0x00C6, 0x00E6, 0x00DF, 0x00C9,
0x0020, 0x0021, 0x0022, 0x0023, 0x00A4, 0x0025, 0x0026, 0x0027, 0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F,
0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
0x00A1, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005A, 0x00C4, 0x00D6, 0x00D1, 0x00DC, 0x00A7,
0x00BF, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F,
0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 0x0079, 0x007A, 0x00E4, 0x00F6, 0x00F1, 0x00FC, 0x00E0
];

var arrayGSM_7ExtTable =
[
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0x000A, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
0x007C, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
];

/* Turkish National Language Single Shift Table */
var arrayGSM_7TurkishExtTable  =
[
/* 0       1       2       3      4       5       6       7       8       9       10      11      12      13      14      15 */
/* 0 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x000A, 0xFFFF, 0xFFFF, 0x001D, 0xFFFF, 0xFFFF,
/* 1 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 2 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
/* 3 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
/* 4 */0x007C, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x011E, 0xFFFF, 0x0130, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 5 */0xFFFF, 0xFFFF, 0xFFFF, 0x015E, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 6 */0xFFFF, 0xFFFF, 0xFFFF, 0x00E7, 0xFFFF, 0x20AC, 0xFFFF, 0x011F, 0xFFFF, 0x0131, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 7 */0xFFFF, 0xFFFF, 0xFFFF, 0x015F, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
];

/* Portuguese National Language Single Shift Table */
var arrayGSM_7PortugueseExtTable =
[
/* 0       1       2       3      4       5       6       7       8       9       10      11      12      13      14      15 */
/* 0 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00EA, 0xFFFF, 0xFFFF, 0xFFFF, 0x00E7, 0x000A, 0x00D4, 0x00F4, 0xFFFF, 0x00C1, 0x00E1,
/* 1 */0xFFFF, 0xFFFF, 0x03A6, 0x0393, 0x005E, 0x03A9, 0x03A0, 0x03A8, 0x03A3, 0x0398, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0x00CA,
/* 2 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
/* 3 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
/* 4 */0x007C, 0x00C0, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00CD, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00D3,
/* 5 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00DA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00C3, 0x00D5, 0xFFFF, 0xFFFF, 0xFFFF,
/* 6 */0xFFFF, 0x00C2, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF, 0xFFFF, 0x00ED, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00F3,
/* 7 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00FA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00E3, 0x00F5, 0xFFFF, 0xFFFF, 0x00E2
];

/* Spanish National Language Single Shift Table */
var arrayGSM_7SpanishExtTable =
[
/* 0       1       2       3      4       5       6       7       8       9       10      11      12      13      14      15 */
/* 0 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00E7, 0x000A, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 1 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 2 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
/* 3 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
/* 4 */0x007C, 0x00C1, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00CD, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00D3,
/* 5 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00DA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 6 */0xFFFF, 0x00E1, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF, 0xFFFF, 0x00ED, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00F3,
/* 7 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00FA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
];
var arrayGSM_7SpanishSpecialTable=[
/* 0 */0x00A2, 0x00C0, 0x00C1, 0x00C2, 0x00C3, 0x00C8, 0x00CA, 0x00CB, 0x00CC, 0x00CD, 0x00CE, 0x00CF, 0x00D0, 0x00D2, 0x00D3, 0x00D4,
/* 1 */0x00D5, 0x00D6, 0x00D9, 0x00DA, 0x00DB, 0x00DD, 0x00E1, 0x00E2, 0x00E3, 0x00E7, 0x00EA, 0x00EB, 0x00ED, 0x00EE, 0x00EF, 0x00F3,
/* 2 */0x00F4, 0x00F5, 0x00F6, 0x00FA, 0x00FB, 0x00FD, 0x00FF, 0x0102, 0x0104, 0x0105, 0x0106, 0x0107, 0x010C, 0x010D, 0x010E, 0x010F,
/* 3 */0x0111, 0x0114, 0x0118, 0x0119, 0x011B, 0x0132, 0x0133, 0x0139, 0x013D, 0x0141, 0x0142, 0x0143, 0x0144, 0x0147, 0x0148, 0x0154,
/* 4 */0x0155, 0x0158, 0x0159, 0x015A, 0x015B, 0x015E, 0x015F, 0x0160, 0x0161, 0x0162, 0x0163, 0x0164, 0x0165, 0x0168, 0x016E, 0x016F,
/* 5 */0x0179, 0x017A, 0x017B, 0x017C, 0x017D, 0x017E, 0x01CE, 0x01D4, 0x0490, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 6 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 7 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
];
function sms_isPhoneNumber(str) {
    var bRet = true;

    var rgExp = /^[+]{0,1}[*#0123456789]{1,20}$/;
    if (!(str.match(rgExp))) {
        bRet = false;
    }

    return bRet;
}

//check phone number validation
function sms_isSendNumber(str) {
    var bRet = true;
    var i = 0;
    var char_i;
    var num_char_i;
    if($.isArray(str)) {
        $(str).each( function(i) {
            bRet = sms_isPhoneNumber(str[i]);

        });
    } else {
        bRet = sms_isPhoneNumber(str);
    }
    return bRet;
}

function sms_sendNumberCheck() {
    sms_clearAllErrorLabel();
    var i = 0;
    var checkResult = true;
    var numbers;
    numbers = arguments[0];
    var hight = 0;
    g_numberValid = true;
    // maximum number
    if(numbers.length > g_sms_maxphonesize) {
        showErrorUnderTextbox("sms_number", sms_hint_maximum_number.replace("%d",g_sms_maxphonesize));
        //numbers more than 10;
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            $('#recipients_number_pb').focus().select();
        }else {
            $('#recipients_number').focus().select();
        }        
        checkResult = false;
        hight += 10;
    }

    for(i = 0;i<numbers.length;i++) {
        numbers[i] = $.trim(numbers[i]);
        if(false == sms_isSendNumber(numbers[i])) {
            showErrorUnderTextbox("sms_number", sms_hint_mobile_number_format);            
            if(g_contact_enabled == 1 && g_module.pb_enabled) {
                $('#recipients_number_pb').focus().select();
            }else {
                $('#recipients_number').focus().select();
            }
            hight = 110 + hight;
            $('#sms_number_wrapper').css({
                height : hight + 'px'
            });
            checkResult = false;
            g_numberValid = checkResult;
            return false;
        }
    }
    g_numberValid = checkResult;
    return checkResult;
}

function check_extension_ascii_for_char_number(str) {
    var i = 0;
    var char_i;
    var char_i_code;
    var k = 0;
    var extension_ascii_num = 0;
    var charLenAtFirstSMSEnd = 1;

    var ext_tab = g_ext_7bit_tab;
    var normal_max_len = 160;
    var long_max_len = 153;

    switch( g_smsFeature.smscharlang ) {
        case 0:
            ext_tab = g_ext_7bit_tab;
            break;
        case 1:
            ext_tab = g_ext_7bit_tab_turkish;
            break;
        case 2:
            ext_tab = g_ext_7bit_tab_spanish;
            break;
        case 3:
            ext_tab = g_ext_7bit_tab_Portuguese;
            break;
        default:
            break;
    }

    if( 0 == g_smsFeature.smscharlang || "undefined" == typeof(g_smsFeature.smscharlang) ) {
        normal_max_len = 160;
        long_max_len = 153;
    } else {
        normal_max_len = 155;
        long_max_len = 149;
    }

    for(i=0; i<str.length; i++) {
        var charLen = 1;
        char_i = str.charAt(i);
        char_i_code = char_i.charCodeAt();
        for(charLen=1,k = 0;k< ext_tab.length;k++) {
            if(char_i_code == ext_tab[k][1]) {
                charLen = 2;
                break;
            }
        }
        if(1 == charLen) {
            extension_ascii_num++;
        } else {
            if(1 == charLenAtFirstSMSEnd) {
                if( (long_max_len-1) == extension_ascii_num ) {
                    extension_ascii_num+=2;
                    charLenAtFirstSMSEnd=2;
                } else if(( (long_max_len*2-1) == extension_ascii_num)
                || ( (long_max_len*3-1) == extension_ascii_num )
                || ( (long_max_len*4-1) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            } else {
                if(( (long_max_len-1)*2 == extension_ascii_num)
                || (((long_max_len-1)*3+1) == extension_ascii_num)
                || (((long_max_len-1)*4+2) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            }
        }
    }
    if(extension_ascii_num > normal_max_len && 2 == charLenAtFirstSMSEnd) {
        extension_ascii_num++;
    }
    return extension_ascii_num;
}

function check_extension_ascii_for_char_number_new(str) {
    var i = 0;
    var char_i;
    var char_i_code;
    var k = 0;
    var extension_ascii_num = 0;
    var charLenAtFirstSMSEnd = 1;

    var ext_tab = g_ext_7bit_tab;
    var normal_max_len = 160;
    var long_max_len = 153;
    var ext_tab_ = '';
    var tab_7bit_ext = true;
    switch( g_smsFeature.smscharlang ) {
        case 0:
            ext_tab_ = g_ext_7bit_tab;
            break;
        case 1:
            ext_tab_ = g_ext_7bit_tab_turkish;
            break;
        case 2:
            ext_tab_ = g_ext_7bit_tab_spanish;
            break;
        case 3:
            ext_tab_ = g_ext_7bit_tab_Portuguese;
            break;
        default:
            break;
    }

    g_sms_smscharlang = false;

    for(i=0; i<str.length; i++) {
        tab_7bit_ext = true;
        var charLen = 1;
        char_i = str.charAt(i);
        char_i_code = char_i.charCodeAt();
        for(charLen=1,k = 0;k< ext_tab.length;k++) {
            if(char_i_code == ext_tab[k][1]) {
                charLen = 2;
                normal_max_len = 160;
                long_max_len = 153;

                tab_7bit_ext = false;
                break;
            }
        }
        if(tab_7bit_ext) {
            for(charLen=1,k = 0;k< ext_tab_.length;k++) {
                if(char_i_code == ext_tab_[k][1]) {
                    charLen = 2;

                    normal_max_len = 155;
                    long_max_len = 149;

                    g_sms_smscharlang = true;
                    break;
                }
            }
        }
        if(1 == charLen) {
            extension_ascii_num++;
        } else {
            if(1 == charLenAtFirstSMSEnd) {
                if( (long_max_len-1) == extension_ascii_num ) {
                    extension_ascii_num+=2;
                    charLenAtFirstSMSEnd=2;
                } else if(( (long_max_len*2-1) == extension_ascii_num)
                || ( (long_max_len*3-1) == extension_ascii_num )
                || ( (long_max_len*4-1) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            } else {
                if(( (long_max_len-1)*2 == extension_ascii_num)
                || (((long_max_len-1)*3+1) == extension_ascii_num)
                || (((long_max_len-1)*4+2) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            }
        }
    }
    if(extension_ascii_num > normal_max_len && 2 == charLenAtFirstSMSEnd) {
        extension_ascii_num++;
    }
    return extension_ascii_num;
}

function ucs2_number_check(str) {
    var i = 0;
    var char_i;
    var num_char_i;

    var j = 0;
    var flag;
    var ucs2_num_temp=0;
    var ext_Table = arrayGSM_7ExtTable;

    if (str.length ==0) {
        return 0;
    }

    switch( g_smsFeature.smscharlang ) {
        case 0:
            if("2" == g_convert_type) {
                ext_Table= arrayGSM_7SpanishExtTable;
            } else {
                ext_Table= arrayGSM_7ExtTable;
            }
            break;
        case 1:
            ext_Table = arrayGSM_7TurkishExtTable;
            break;
        case 2:
            ext_Table = arrayGSM_7SpanishExtTable;
            break;
        case 3:
            ext_Table = arrayGSM_7PortugueseExtTable;
            break;
        default:
            break;
    }

    for(i=0; i<str.length; i++) {
        flag = 0;
        char_i = str.charAt(i);
        num_char_i = char_i.charCodeAt();
        for(j = 0; j < GSM_7BIT_NUM; j++) {
            if ("2" == g_convert_type) {
                if (num_char_i == arrayGSM_7DefaultTable[j] ||
                (num_char_i == ext_Table[j] ||
                (num_char_i == arrayGSM_7SpanishSpecialTable[j]))) {
                    flag = 1;
                    break;
                }
            } else {
                if (num_char_i == arrayGSM_7DefaultTable[j] || (num_char_i == ext_Table[j] )) {
                    flag = 1;
                    break;
                }
            }
        }
        if (0 == flag) {
            ucs2_num_temp++;
        }
    }

    return ucs2_num_temp;
}

function CDMA_textmode_check(str) {
    var i = 0;
    var char_i;
    var num_char_i;
    var codeFormat = SMS_TEXT_MODE_7BIT;

    var ucs2_num_temp=0;

    if (str.length ==0) {
        return SMS_TEXT_MODE_7BIT;
    }

    for(i=0; i<str.length; i++) {
        char_i = str.charAt(i);
        num_char_i = char_i.charCodeAt();
        if((SMS_TEXT_MODE_7BIT == codeFormat)
        &&(0 <= num_char_i && 0x7F >= num_char_i)) {
            //7Bit
            codeFormat = SMS_TEXT_MODE_7BIT;
        } else if((SMS_TEXT_MODE_7BIT == codeFormat || SMS_TEXT_MODE_8BIT == codeFormat)
        &&(0x7F < num_char_i && 0xFF >= num_char_i)) {
            //8Bit
            codeFormat = SMS_TEXT_MODE_8BIT;
        } else if(0xFF < num_char_i) {
            //UCS2
            codeFormat = SMS_TEXT_MODE_UCS2;
            break;
        }
    }

    return codeFormat;
}

function sms_numberCheck(str) {
    var N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268=0;
    var N_or_Y_isCDMA_sms_hint_max_8bit_characters_532=0;
    var N_or_Y_isCDMA_sms_hint_max_ascii_characters_612=0;
    if (g_isCDMA) // CDMA
    {
        g_SMS_UCS2_MAX_SIZE = 260;//70+60+65+65;
        g_SMS_8BIT_MAX_SIZE = 540;//140+130+135+135;
        g_SMS_7BIT_MAX_SIZE = 620;//160+150+155+155;
        N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268 = sms_hint_max_ucs2_characters_268.replace(/268/, "260");
        N_or_Y_isCDMA_sms_hint_max_8bit_characters_532 = sms_hint_max_8bit_characters_532.replace(/532/, "540");
        N_or_Y_isCDMA_sms_hint_max_ascii_characters_612 = sms_hint_max_ascii_characters_612.replace(/612/, "620");
    } else {
        g_SMS_UCS2_MAX_SIZE = 268;//70+64+67+67;
        g_SMS_8BIT_MAX_SIZE = 532;//140+126+133+133;
        g_SMS_7BIT_MAX_SIZE = 612;//160+146+153+153;
        N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268 = sms_hint_max_ucs2_characters_268;
        N_or_Y_isCDMA_sms_hint_max_8bit_characters_532 = sms_hint_max_8bit_characters_532;
        N_or_Y_isCDMA_sms_hint_max_ascii_characters_612 = sms_hint_max_ascii_characters_612;
    }

    var sms_left_length;
    var sms_num;
    var temp_length;
    var temp_enter_number;
    var normal_max_len = 160;
    var long_max_len = 153;
    var err_info = null;

    temp_length = str.length;
    //temp_enter_number = check_enter_number_in_sms_content(str);
    //temp_length += temp_enter_number;
    if(SMS_TEXT_MODE_UCS2 == g_text_mode) {
        if (g_isCDMA) {
            normal_max_len = 70;
            long_max_len = 65;
        } else {
            normal_max_len = 70;
            long_max_len = 67;
        }

        if(temp_length > g_SMS_UCS2_MAX_SIZE) {
            err_info = N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268;
        }
    } else if (SMS_TEXT_MODE_8BIT == g_text_mode) {
        if (g_isCDMA) {
            normal_max_len = 140;
            long_max_len = 135;
        } else {
            normal_max_len = 140;
            long_max_len = 133;
        }

        if(temp_length > g_SMS_8BIT_MAX_SIZE) {
            err_info = N_or_Y_isCDMA_sms_hint_max_8bit_characters_532;
        }
    } else if (SMS_TEXT_MODE_7BIT == g_text_mode && !g_isCDMA )//GSM 7bit;
    {
        if(g_lang_edit == '-1') {
            temp_length = check_extension_ascii_for_char_number(str);
        } else {
            temp_length = check_extension_ascii_for_char_number_new(str);

        }

        if( g_lang_edit != '-1'&& !g_sms_smscharlang ) {
            normal_max_len = 160;
            long_max_len = 153;
            if(temp_length > g_SMS_7BIT_MAX_SIZE) {
                err_info = N_or_Y_isCDMA_sms_hint_max_ascii_characters_612;
            }
        } else if(g_lang_edit == '-1' && (0 == g_smsFeature.smscharlang || "undefined" == typeof(g_smsFeature.smscharlang)) ) {
            normal_max_len = 160;
            long_max_len = 153;
            if(temp_length > g_SMS_7BIT_MAX_SIZE) {
                err_info = N_or_Y_isCDMA_sms_hint_max_ascii_characters_612;
            }

        } else {
            normal_max_len = 155;
            long_max_len = 149;

            if(temp_length > long_max_len*4 ) {
                err_info = sms_hint_max_ascii_characters_596;
            }
        }

    } else if(SMS_TEXT_MODE_7BIT == g_text_mode && g_isCDMA) {
        normal_max_len = 160;
        long_max_len = 155;
        if(temp_length > long_max_len*4 ) {
            err_info = N_or_Y_isCDMA_sms_hint_max_ascii_characters_612;
        }
    }

    if( null != err_info ) {
        sms_clearAllErrorLabel();
        showErrorUnderTextbox("sms_count", err_info);
        g_sms_length = temp_length;
        button_enable("pop_send", "0");
    } else {
        button_enable("pop_send", "1");
        sms_clearAllErrorLabel();
    }

    if( temp_length <= normal_max_len ) {
        document.getElementById("sms_count").innerHTML = normal_max_len - temp_length + "(" + 1 + ")";
        sms_num = 1;
        if(temp_length <= 0) {
            g_content = str.substring(0);
        }
    } else if( (temp_length > normal_max_len ) && (temp_length <= long_max_len*4) ) {
        sms_num = parseInt(temp_length/long_max_len, 10)+1;

        if( 0 == (temp_length%long_max_len) ) {
            sms_num -= 1;
        }

        document.getElementById("sms_count").innerHTML = long_max_len*sms_num - temp_length + "(" + sms_num + ")";
    } else {
        var tmp =  parseInt((temp_length - long_max_len*4)/long_max_len, 10);
        var tmp2 = Math.floor(tmp);
        var tmp3 = (long_max_len*4 +(tmp2+1)*long_max_len) - temp_length;
        document.getElementById("sms_count").innerHTML =tmp3 + "(" + (tmp2+4+1)+ ")";
    }

    g_sms_num = sms_num;
    g_sms_length = temp_length;
}

function sms_contentDiffUCS2Num( str ) {
    var idx        = 0;
    var oldEndPos    = 0;
    var newEndPos  = 0;
    var minLen  = 0;
    var diffLen  = 0;
    var diffPos  = 0;
    var diffNum = 0;
    var diffOldNum   = 0;
    var diffNewNum = 0;

    //if input some char at first time
    if ( null == g_content  || 0 == g_content.length  ) {
        g_ucs2_num =  ucs2_number_check(str);
        return;
    }

    //if delete all content, reset g_ucs2_num
    if ( null == str || 0 == str.length ) {
        g_ucs2_num =0;
        return;
    }

    minLen = Math.min( str.length, g_content.length );

    //find different char position
    for( diffPos = 0; diffPos < minLen; ++diffPos ) {
        if( str.charAt( diffPos ).charCodeAt() != g_content.charAt( diffPos ).charCodeAt() ) {
            break;
        }
    }

    if( diffPos == minLen ) //add or delete char at tail of sms content
    {
        diffLen = str.length - g_content.length;
        if( diffLen > 0 ) //add
        {
            diffNum = ucs2_number_check( str.substring( diffPos ) );
        } else if( diffLen < 0 )// delete
        {
            diffNum = (-1) * ucs2_number_check( g_content.substring( diffPos ) );
        } else {
        }
    } else// add or delete char at middle or header of sms content
    {
        for( idx = 0, oldEndPos = g_content.length-1,newEndPos = str.length-1; idx < minLen && oldEndPos > diffPos && newEndPos > diffPos; ++idx, --oldEndPos,--newEndPos ) {
            if( str.charAt( newEndPos ).charCodeAt() != g_content.charAt( oldEndPos ).charCodeAt() ) {
                break;
            }
        }

        diffOldNum = ucs2_number_check( g_content.substring( diffPos, oldEndPos+1 ) );
        diffNewNum = ucs2_number_check( str.substring( diffPos, newEndPos+1 ) );

        diffNum = diffNewNum - diffOldNum;
    }

    g_ucs2_num += diffNum;
}

function sms_contentChange(str) {
    if(g_isCDMA) { //CDMA
        g_text_mode = CDMA_textmode_check(str);
    } else {  //GSM
        if( $.browser.msie ) {
            if(g_net_mode_type==MACRO_NET_DUAL_MODE && g_net_mode_change==MACRO_NET_MODE_CHANGE) {
                g_ucs2_num=ucs2_number_check(str);

            } else {
                sms_contentDiffUCS2Num( str );
            }
        } else {
            g_ucs2_num =  ucs2_number_check(str);
        }

        if (g_ucs2_num >0) {
            g_text_mode = SMS_TEXT_MODE_UCS2;
        } else {
            g_text_mode = SMS_TEXT_MODE_7BIT;
        }
    }

    sms_numberCheck(str);
    g_content = str;

}

function sms_contentCheck() {
    var checkResult = true;
    if(SMS_TEXT_MODE_UCS2 == g_text_mode) {
        if(g_sms_length > g_SMS_UCS2_MAX_SIZE) {
            sms_clearAllErrorLabel();
            showErrorUnderTextbox("sms_count", IDS_sms_hint_content_too_long); /*The max UCS2 characters of SMS message is 268 */
            $("#message_content").select();
            checkResult = false;
        }
    } else if(SMS_TEXT_MODE_7BIT == g_text_mode) {
        if(g_sms_length > g_SMS_7BIT_MAX_SIZE) {
            sms_clearAllErrorLabel();
            showErrorUnderTextbox("sms_count", IDS_sms_hint_content_too_long);/*The max ASCII characters of SMS message is 612 */
            $("#message_content").select();
            checkResult = false;
        }
    } else if(SMS_TEXT_MODE_8BIT == g_text_mode) {
        if(g_sms_length > g_SMS_8BIT_MAX_SIZE) {
            sms_clearAllErrorLabel();
            showErrorUnderTextbox("sms_count", IDS_sms_hint_content_too_long);/*The max ASCII characters of SMS message is 532 */
            $("#message_content").select();
            checkResult = false;
        }
    }
    return checkResult;
}

function check_lang_edit() {
    getAjaxData("api/sms/splitinfo-sms", function($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {

            g_lang_edit = ret.response.splitinfo;
            g_convert_type = ret.response.convert_type;

        }
    },{
        sync : true    	
    });
}

function main_executeBeforeDocumentReady() {
    getConfigData("config/sms/config.xml", function($xml) {
        g_smsFeature = _xml2feature($xml);
        g_sms_smsListArray.readcount = g_smsFeature.pagesize > 50 ? 50 : (g_smsFeature.pagesize);
        g_sms_maxphonesize=$.trim(g_smsFeature.maxphone);
        if(""==g_sms_maxphonesize||"undefined"== typeof(g_sms_maxphonesize)) {
            g_sms_maxphonesize=SMS_MAXPHONESIZE;
        }
        g_sms_importenabled = g_smsFeature.import_enabled == "1"?true:false;
        g_sms_urlenabled = g_smsFeature.url_enabled =="1"?true:false;
        g_isCDMA = g_smsFeature.cdma_enabled == "1"?true:false;
    }, {
        sync : true
    });

    redirectOnCondition(null, "smsandroid");
}

main_executeBeforeDocumentReady();
function createList() {
    $('#list_contacts').empty();
    g_pb_pageIndex = 1;
    pb_getConfig();
    pb_getLocalContactList();
}

var g_contact_enabled = null;
function get_contact() {
    getAjaxData('api/sms/sms-feature-switch', function($xml) {
        var ret = xml2object($xml);
        if(ret.type == 'response') {
            g_contact_enabled = ret.response.getcontactenable;
        }
    }, {
        sync: true
    });
}
get_contact();
//-------------------------------------------------------------------------------------------------
$(document).ready( function() {
    if( $.browser.msie && ($.browser.version == '7.0')){
        $('.sms_chat_list').css({'overflow-y': 'scroll'});    	
    }
    getMonitoringStatus();
    $('.sms_individual_list').hide();
    if(g_net_mode_status==MACRO_NET_MODE_C) {
        g_isCDMA=true;
    } else if(g_net_mode_status==MACRO_NET_MODE_W) {
        g_isCDMA= false ;
    }

    if(g_net_mode_type==MACRO_NET_DUAL_MODE) {
        addStatusListener('sms_changeNetwork()');
    }
    // sms_getBoxType();
    check_lang_edit();
    if(-1 != window.location.href .lastIndexOf("smschat")){
        $('#cur_box_type_android').hide();
        var start=window.location.href.lastIndexOf('+');
        var end=window.location.href.length;
        g_Current_Phone_Number_chat = window.location.href.substring(start+1,end);
        sms_getBoxCount();
        sms_initBoxCount();
        initChatPage();
	    getChatHistory();
	}else{
        $('#cur_box_type_android_chat').hide();
        sms_initPage();
    }
    if(g_module.pb_enabled) {
        getPhonebookContacts();
    }
    // to check new messages
    setInterval( function() {
        sms_getBoxCount(false,sms_init_info());
        if(-1 != window.location.href.lastIndexOf("smschat")){
            g_scroll_smsList_status = 1;   
            sms_getBoxCount();
            sms_initBoxCount();
            getChatHistory();
        }      
    }, g_feature.update_interval);
    sms_btnAddEvent();

    var smsIndex = -1;
    var scaIndex = null;
    // send phonebook sms
    function getPhonebookContacts() {
        var pb_contacts = getQueryStringByName("number");
        if(pb_contacts != null && pb_contacts.length > 0) {
            if(pb_contacts.match('%23')) {
                pb_contacts = pb_contacts.replace(/%23/g, '#');
            }
            g_pbToSmsFlag = true;
            sms_newMessage();
            if(g_contact_enabled == 1 && g_module.pb_enabled) {
                $("#recipients_number_pb").val(pb_contacts);
            }else {
                $("#recipients_number").val(pb_contacts);
            }            
            $("#message_content").focus();
        }
    }
    $("#sms_android_add").live("click", function() {
        sms_newMessage();
        smsIndex = -1;
    });
    $('#send_message_btn').bind('click', function() {
        g_send_message_btn_status = 1;
		if(!isButtonEnable("send_message_btn")) {
            return;
        }
        sms_createSms("Sent");
        $('#NewMessage_textarea').val('');
        initChatPage();
    });
	$('#cancel_new_message').bind('click', function() {
		gotoPageWithoutHistory("smsandroid.html");
	}); 
    $(".sms_list_tr").live("click", function( event ) {
        if("sms_raw_chkbox"== $(event.target).attr("id")){
            return;
        }
        if ( "sms_td" != $(event.target).attr("class")  && "sms_td" != $(event.target).parent().attr("class")) {
            var smsIndex = g_sms_smsList[$(".sms_list_tr").index(this)].index;
			$(g_sms_smsList).each( function(i) {
				if(g_sms_smsList[i].index == smsIndex) {
                    var tempPhone = g_sms_smsList[i].phone; 
					if(tempPhone.indexOf('+') != -1){
                        g_Current_Phone_Number =  tempPhone.substring(tempPhone.indexOf('+')+1, tempPhone.length);                                              
                    }else{
                        g_Current_Phone_Number = g_sms_smsList[i].phone;	
                    }
                }
			});
			var temp = ''
            if(g_Current_Phone_Number.length >= 132){
                temp = g_Current_Phone_Number.substring(0,132);
                temp = temp.substring(0,temp.lastIndexOf(';'));
                gotoPageWithoutHistory('smsandroid.html?smschat+'+temp);              	
            }else{
            gotoPageWithoutHistory('smsandroid.html?smschat+'+g_Current_Phone_Number);
            }       
        }
    });
    
    $(".sms_chat_list_tr").live("click", function( event ) {		
        if ( "sms_td" != $(event.target).attr("class")  && "sms_td" != $(event.target).parent().attr("class")) {
            var smsIndex = g_scroll_smsList[$(".sms_chat_list_tr").index(this)].index;
            $(g_scroll_smsList).each( function(i) {
                if(g_scroll_smsList[i].index == smsIndex) {
                    g_Current_content = g_scroll_smsList[i].content;
                }
            });
            if("chat_delete_icon"== $(event.target).attr("id")){
                showConfirmDialog(common_confirm_delete_list_item, function() {
                    chat_smsDelete(smsIndex);
                    g_send_message_btn_status = 1;
                }, function() {});
            }else if("chat_forward_icon"== $(event.target).attr("id")){
                chat_Forward(g_Current_content);
            }
        }
    });
    // function for create sms & save sms
    function sms_createDraftSms(btnValue) {
        sms_clearAllErrorLabel();
        var strPhoneNumber = '';
        var messageContent ="";
        messageContent = $.trim($("#message_content").val());
        if(btnValue == "Save"  && (sms_contentCheck())) {
            var scaValue = "";
            messageContent =  resolveXMLEntityReference(messageContent);

            var index = -1;
            var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var submitXmlObject = {
                Index:index,
                Phones: {
                    Phone:strPhoneNumber
                },
                Sca:scaValue,
                Content:messageContent,
                Length:messageContent.length,
                Reserved:g_text_mode,
                Date:now
            };
            var submitData = object2xml("request", submitXmlObject);
            if(btnValue == "Save") {
                clearDialog();
                saveAjaxData("api/sms/save-sms", submitData, function($xml) {
                    var ret = xml2object($xml);
                    if(isAjaxReturnOK(ret)) {
                        sms_initPage();
                    } else {
                        if(ret.type=='error') {
                            if(sms_systemBusy ==ret.error.code) {
                                showInfoDialog(common_system_busy);
                            } else {
                                showInfoDialog(common_failed);
                            }
                        } else {
                            showInfoDialog(common_failed);
                        }
                    }
                });
            } 
        }
    }
    
    function sms_createSms(btnValue) {
        sms_clearAllErrorLabel();
        var strPhoneNumber = '';
        var messageContent ="";
        if(-1!=window.location.href .lastIndexOf("smschat") && !g_isForward){
            g_isForward=0;
            strPhoneNumber = g_Current_Phone_Number_chat;
            messageContent = $("#NewMessage_textarea").val();
        }else{
            g_isForward=0;
            if(g_contact_enabled == 1 && g_module.pb_enabled) {
                strPhoneNumber = $.trim($("#recipients_number_pb").val());
            }else {
                strPhoneNumber = $.trim($("#recipients_number").val());
            }
            messageContent = $("#message_content").val();
        }
                

        // if last chacracter o phone number is ';', remove it
        if (strPhoneNumber.length > 0) {
            if (strPhoneNumber.lastIndexOf(";") == (strPhoneNumber.length - 1)) {
                strPhoneNumber = strPhoneNumber.substring(0, strPhoneNumber.length - 1);
                if(g_contact_enabled == 1 && g_module.pb_enabled) {
                    $("#recipients_number_pb").val(sendInformation);
                } else {
                    $("#recipients_number").val(strPhoneNumber);
                }
            }
        }
        if($("#message_content").val() == "") {
            g_sms_num = 1;
        }

        var PhoneArray = strPhoneNumber.split(";");
        var strSMSContent = $.trim($("#message_content").val());
        if(((btnValue == "Save" && (0 == strPhoneNumber.length && 0 != strSMSContent.length )) || sms_sendNumberCheck(PhoneArray)) && sms_contentCheck()) {
            var scaValue = "";
            messageContent =  resolveXMLEntityReference(messageContent);

            var index = -1;
            var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var submitXmlObject = {
                Index:index,
                Phones: {
                    Phone:PhoneArray
                },
                Sca:scaValue,
                Content:messageContent,
                Length:messageContent.length,
                Reserved:g_text_mode,
                Date:now
            };
            smsIndex = -1;
            var submitData = object2xml("request", submitXmlObject);
            if(btnValue == "Save") {
                clearDialog();
                saveAjaxData("api/sms/save-sms", submitData, function($xml) {
                    var ret = xml2object($xml);
                    if(isAjaxReturnOK(ret)) {
                        sms_initPage();
                    } else {
                        if(ret.type=='error') {
                            if(sms_systemBusy ==ret.error.code) {
                                showInfoDialog(common_system_busy);
                            } else {
                                showInfoDialog(common_failed);
                            }
                        } else {
                            showInfoDialog(common_failed);
                        }
                    }
                });
            } else {
                var refreshStatus;
                sms_showWaitingDialog(common_waiting,
                sms_hint_sending+"&nbsp;"+"1/" + g_sms_num*(PhoneArray.length));
                $(".wait_dialog_btn").show();
                $("#sms_dialog").remove();

                saveAjaxData("api/sms/send-sms", submitData, function($xml) {
                    //-------------------------------------------------------------------
                    var ret = xml2object($xml);
                    if(ret.type=='error') {
                        if(sms_systemBusy == ret.error.code) {
                            $("#wait_table").remove();
                            showInfoDialog(common_system_busy);

                        } else {
                            $("#wait_table").remove();
                            showInfoDialog(common_failed);
                        }
                    } else {
                        function getSendSmsStatus() {
                            getAjaxData("api/sms/send-status", function($xml) {
                                var ret = xml2object($xml);
                                ret = ret.response;
                                var sendTotalCount = ret.TotalCount;
                                var currentSendIndex = ret.CurIndex;
                                var currentSendPhone = ret.Phone;
                                var sendSuccessPhones = ret.SucPhone;
                                var sendFailPhones = ret.FailPhone;
                                var statusContent = sms_hint_sending + "&nbsp;" + currentSendIndex + "/" + sendTotalCount;

                                $(".wait_table_content .wait_str").html(statusContent);
                                if(currentSendPhone == "") {
                                    $("#wait_table").remove();
                                    clearInterval(refreshStatus);
                                    var successedArray = sendSuccessPhones.split(",");
                                    var successedTotal = successedArray.length;
                                    var failedArray = sendFailPhones.split(",");
                                    var failedTotal = failedArray.length;
                                    if(successedArray[successedTotal-1] == "") {
                                        successedArray.pop();
                                        successedTotal>0 ? successedTotal -= 1 : successedTotal = 0;
                                        $(".send_success_info").hide();
                                    }
                                    if(failedArray[failedTotal-1] == "") {
                                        failedArray.pop();
                                        failedTotal>0 ? failedTotal -= 1 : failedTotal = 0;
                                        $(".send_failed_info").hide();
                                    }

                                    var successDialogHtml = "<table id='sms_success_info'><tr><td><h1><span>"+
                                    successedTotal + "&nbsp;" + common_successfully +common_comma+"</span><span>" + failedTotal + "&nbsp;" + common_failed + "</span></h1></td>"+
                                    "</tr><tr><td height='27'></td></tr>";
                                    if(g_module.pb_enabled) {
                                        var postData = '';
                                        if(successedTotal >0) {
                                            successPhonesArry=sendSuccessPhones.replace(/,/g,";");
                                            postObject = {
                                                Phone:successPhonesArry
                                            };
                                            postData = object2xml("request",postObject);
                                            saveAjaxData("api/pb/pb-match", postData, function($xml) {
                                                var ret = xml2object($xml);
                                                if(ret.type == "response") {
                                                    var contactsName = ret.response.Name;
                                                    successDialogHtml += "<tr class='send_success_info'><td><table><tr><td rowspan='2' width='30' valign='top'><img onload = 'fixPNG(this)' src='../res/icon_sms_send_success.png' alt='' /></td>"+
                                                    "<td>" + sms_label_the_message_sent_successed + common_colon +
                                                    "</td></tr><tr><td class='success_phone_number'>" + spaceToNbsp(XSSResolveCannotParseChar(contactsName)).split(";").join("; ") + "</td></tr></table></td></tr><tr class='send_failed_info'><td height='21'></td></tr>";
                                                    g_sendSuccessAndFailedFlag = true;
                                                }
                                            }, {
                                                sync : true
                                            });
                                        }
                                        if(failedTotal >0) {
                                            failPhonesArry=sendFailPhones.replace(/,/g,";");
                                            postObject = {
                                                Phone:failPhonesArry
                                            };
                                            postData = object2xml("request",postObject);
                                            saveAjaxData("api/pb/pb-match", postData, function($xml) {
                                                var ret = xml2object($xml);
                                                if(ret.type == "response") {
                                                    var contactsName = ret.response.Name;
                                                    successDialogHtml += "<tr class='send_failed_info'><td><table><tr><td rowspan='2' width='30' valign='top'><img onload = 'fixPNG(this)' src='../res/icon_sms_send_failed.png' alt='' /></td>"+
                                                    "<td>" + sms_label_the_message_sent_failed + common_colon +
                                                    "</td></tr><tr><td  class='failed_phone_number'>" + spaceToNbsp(XSSResolveCannotParseChar(contactsName)).split(";").join("; ") + "</td></tr></table></td></tr>";
                                                    g_sendSuccessAndFailedFlag = true;
                                                }
                                            }, {
                                                sync : true
                                            });

                                        }

                                    } else {
                                        if(successedTotal >0) {
                                            successDialogHtml += "<tr class='send_success_info'><td><table><tr><td rowspan='2' width='30' valign='top'><img onload = 'fixPNG(this)' src='../res/icon_sms_send_success.png' alt='' /></td>"+
                                            "<td>" + sms_label_the_message_sent_successed + common_colon +
                                            "</td></tr><tr><td class='success_phone_number'>" + sendSuccessPhones.split(",").join("; ") + "</td></tr></table></td></tr><tr class='send_failed_info'><td height='21'></td></tr>";
                                            g_sendSuccessAndFailedFlag = true;
                                        }

                                        if(failedTotal >0) {
                                            successDialogHtml += "<tr class='send_failed_info'><td><table><tr><td rowspan='2' width='30' valign='top'><img onload = 'fixPNG(this)'  src='../res/icon_sms_send_failed.png' alt='' /></td>"+
                                            "<td>" + sms_label_the_message_sent_failed + common_colon +
                                            "</td></tr><tr><td  class='failed_phone_number'>" + sendFailPhones.split(",").join("; ") + "</td></tr></table></td></tr>";
                                            g_sendSuccessAndFailedFlag = true;
                                        }
                                    }
                                    successDialogHtml += "</table>";
                                    startLogoutTimer();
                                    call_dialog(common_note, successDialogHtml, common_ok, "pop_OK");
                                    $(".dialog_table").css("text-align","left");           
                                }
                            });
                        }

                        refreshStatus = setInterval(getSendSmsStatus, g_feature.update_interval);
                    }

                    //----------------------------------------------------------------------

                    function cancelSendSms() {
                        var cancelSend = 1;
                        var submitData = object2xml("request", cancelSend);

                        saveAjaxData("api/sms/cancel-send", submitData, function($xml) {
                            var ret = xml2object($xml);
                            clearInterval(refreshStatus);
                            $("#wait_table, #div_wrapper").remove();
                            if(isAjaxReturnOK(ret)) {
                                getSendSmsStatus();
                            }
                        });
                    }

                    $("#pop_Cancel").bind("click", function() {
                        if(!isButtonEnable("pop_Cancel")) {
                            return;
                        }
                        button_enable("pop_Cancel","0");
                        cancelSendSms();
                    });
                    $(".wait_dialog_btn").unbind("click").live("click", function() {
                        startLogoutTimer();
                        cancelSendSms();
                    });
                    $("#pop_OK, .dialog_close_btn").live("click", function() {
                        $("#wait_div, #div_wrapper").remove();
                        $(".dialog").remove();
                        if (true == g_pbToSmsFlag) {
                            sms_gotoSiminboxUrl('ok');
                        }
                        startLogoutTimer();
                    });
                }, {
                    errorCB: function() {
                        $("#wait_table").remove();
                        showInfoDialog(common_failed);
                    }
                });
            }
            scaIndex = null;
        }
    }

    // send sms
    $("#pop_send").live("click", function() {
        if(!isButtonEnable("pop_send")) {
            return;
        }
        editInformation();
        sms_createSms("Sent");
    });
    $("#pop_chat_Cancel").live("click", function() {
        var temp_phone_value = "";
        if(!isButtonEnable("pop_chat_Cancel")) {
            return;
        }
        // button_enable("pop_chat_Cancel","0");
        if(g_contact_enabled == 1 && g_module.pb_enabled){
            temp_phone_value = $.trim($('#recipients_number_pb').val());
        }else{
            temp_phone_value = $.trim($('#recipients_number').val());
        }
        sms_createDraftSms("Save");                                       
     });
    // clear sca value
    $(".pop_Cancel, .dialog_close_btn").live("click", function() {
        var sms_clearTimeout = 0;
        scaIndex = null;
        sms_clearAllErrorLabel();
        sms_clearTimeout = setTimeout( function() {
            clearTimeout(sms_clearTimeout);
            if (false == g_sendSuccessAndFailedFlag) {
                if (true == g_pbToSmsFlag) {
                    sms_gotoSiminboxUrl('cancel');
                }
            } else {
                g_sendSuccessAndFailedFlag = false;
            }
        }, 500);
        startLogoutTimer();
    });
    var sendInformation = '';
    function editInformation() {
        var judgeFlag = false;
        var sendInformations = '';
        sendInformation = $('#recipients_number_pb').val();
        if(sendInformation == '' || sendInformation == null) {
            judgeFlag = true;
            $('#recipients_number_pb').val('');
        }
        if(!judgeFlag) {
            var sendArray = sendInformation.split(';');
            $.each(sendArray, function(n,sendInformation) {
                if(sendInformation.indexOf('<') >= 0 && sendInformation.indexOf('>') >= 0) {
                    var index1 = sendInformation.lastIndexOf('<');
                    var index2 = sendInformation.lastIndexOf('>');
                    if(index1 < index2) {
                        sendInformation = sendInformation.substring(index1 + 1,index2);
                        sendInformations += (sendInformation + ';');
                    }
                } else {
                    sendInformations += (sendInformation + ';');
                }
            });
            sendInformations = sendInformations.substring(0,sendInformations.length - 1);
            $('#recipients_number_pb').val(sendInformations);
        }
    }

    $('#search_recipients_number').live('click', function() {

        displayInformations = $("#recipients_number_pb").val();
        if(displayInformations.lastIndexOf(';') != displayInformations.length - 1) {
            displayInformations = displayInformations + ';';
        }
        $('#search_recipients_number').hide();
        $('#close_search_recipients_number').show();
        $('.user_add_select').show();
        $('.error_message').hide();
        
        $('#recipients_number_pb').live('focus', function() {
            $('#user_add_select').hide();
            $('#search_recipients_number').show();
            $('#close_search_recipients_number').hide();
        });
        $('#close_search_recipients_number').live('click', function() {
            $('#user_add_select').hide();
            $('#search_recipients_number').show();
            $('#close_search_recipients_number').hide();
        });
        $('#message_content').live('click', function() {
            $('#user_add_select').hide();
            $('#search_recipients_number').show();
            $('#close_search_recipients_number').hide();
        });
    });
    $(".wait_dialog_btn").live("click", function() {
        var sms_clearTimeout = 0;
        sms_clearTimeout = setTimeout( function() {
            clearTimeout(sms_clearTimeout);
            if (false == g_sendSuccessAndFailedFlag) {
                if (true == g_pbToSmsFlag) {
                    sms_gotoSiminboxUrl('cancel');
                }
            } else {
                g_sendSuccessAndFailedFlag = false;
            }
        }, 500);
    });
    $("#message_content , #NewMessage_textarea").live("keydown keypress keyup focus change input", function(event) {
        if( $("#message_content").attr("readonly") ) {
            return;
        }
        if(("keydown" == event.type || "keypress" == event.type || "keyup" == event.type)
        && (37 == event.keyCode || 38 == event.keyCode || 39 == event.keyCode || 40 == event.keyCode)) {
            return;
        }
        if($(event.target).attr("id") == "message_content"){
            sms_contentChange($("#message_content").val());        	
        }
        if($(event.target).attr("id") == "NewMessage_textarea"){
            sms_contentChange($("#NewMessage_textarea").val());	
        }
    });
    $('.sms_chat_list').scroll(function(){
        var nScrollHight = 0;
        var nScrollTop = 0;  
        var nDivHight = parseInt($(".sms_chat_list").height(),10);
        nScrollHight = parseInt($(this)[0].scrollHeight,10);
        nScrollTop = parseInt($(this)[0].scrollTop,10);
        if(nScrollTop == 0){
            if(g_sms_pageIndex < g_sms_totalSmsPage){
                g_send_message_btn_status = 0;
                g_sms_pageIndex ++;
                sms_getBoxCount();
                sms_initBoxCount();
                getChatHistoryScrollAdd();
                $('.sms_chat_list').scrollTop((nScrollHight - nDivHight)/2);
            }
        }
    });
});

function getChatHistoryScrollAdd(){	
	var sms_smsListArray = {
	    phone: g_Current_Phone_Number_chat,
	    pageindex : g_sms_totalSmsPage,
	    readcount: g_smsFeature.pagesize
	};
	sms_smsListArray.pageindex = g_sms_pageIndex;
       var msgCondition = object2xml("request",sms_smsListArray);
       saveAjaxData('api/sms/sms-list-phone',msgCondition, function($xml) {
           var ret = xml2object($xml);
           if (ret.type == "response") {
               if(ret.response.messages.message) {
		           g_sms_chatList=null;
                   g_sms_chatList = [];
                   g_temp_smsList = [];
                   if($.isArray(ret.response.messages.message)) {
                       g_sms_chatList = ret.response.messages.message;
                   } else {
                       g_sms_chatList.push(ret.response.messages.message);
                   }
                   g_temp_smsList = g_temp_smsList.concat(g_sms_chatList);
                   g_scroll_smsList = g_temp_smsList.concat(g_scroll_smsList);
		           if(g_Current_Chat_Count != g_sms_curMsgSum  || g_sms_pageIndex!=g_sms_pageIndex_last ||('0' != g_sms_NewMsg && "undefined" !=typeof(g_sms_NewMsg) && "" != g_sms_NewMsg)){
                       g_Current_Chat_Count = g_sms_curMsgSum;
                       g_sms_pageIndex_last = g_sms_pageIndex;
                   }
                       showChatHistoryScrollAdd();
			           setChatSmsRead();
               } else {
                    log.error("SMS: get api/sms/sms-list-phone data error");
               }
           } else {
               log.error("SMS: get api/sms/sms-list-phone data error");
           }
       }, {
           errorCB: function() {
               log.error("SMS: get api/sms/sms-list-phone file failed");
           }
       });
}


function showChatHistoryScrollAdd(){
	$('.android_img_main').hide();
	g_showHistory = true;
	$('.sms_main_content').hide();
	$('.sms_individual_list').show();
    var $preTr= $("#boxList_title_chat"),$row = null;
	var tempContent = "";
	var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
	$.each(g_sms_chatList, function(n,message) {
		switch(parseInt(message.smstype,10)) {
			case 7:
				message.content = sms_label_setting_usesreport  + common_colon + " " + common_success;
				break;
			case 8:
				message.content = sms_label_setting_usesreport  + common_colon + " " + common_failed;
				break;
			default:
				break;
	   }
	   if(g_sms_urlenabled) {
	       tempContent = regURL( message.content );
	   } else {
	       tempContent= XSSResolveCannotParseChar(message.content);
	   }
	   var msgDate = message.date;
	   msgDate = new Date(msgDate.replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm:ss");
	   $row  = $("<div class='sms_chat_list_tr'></div>");
	   if(CHAT_SMS_CURBOX == message.curbox)	{
	      var html = "<div class='sms_chat_phone_sent'>"
		  +"<div class='sent_content_background'>"
	      +"<div class='sms_chat_phone_sent_content'> "
	      +"<pre class='sms_content_chat clr_blue_a'>"+tempContent+"</pre>"
	      +"</div>"
	      +"<div class='sms_chat_phone_sent_content'>";
	      if(CHAT_SMS_SMSTAT == message.smstat){
	          html += "<span class='chat_send_failed_icon'>&nbsp;</span>";
	      }
	      html += "<span class='chat_delete_icon' id='chat_delete_icon'>&nbsp;</span>"
	      +"<span class='chat_forward_icon' id='chat_forward_icon'>&nbsp;</span>"
		  +"<span>"+msgDate+"</span>"
	      +"</div></div><div class='sms_chat_sent_img'>&nbsp;&nbsp;</div>"
	      +"</div>";
	      $row.html(html);     
	   }else{
           $row.html("<div class='sms_chat_phone_recive'>"
           +"<div class='sms_chat_recive_img'>&nbsp;&nbsp;</div><div class='recive_content_background'>"
	       +"<div class='sms_chat_phone_recive_content'> "
	       +"<pre class='sms_content_chat clr_blue_a'>"+tempContent+"</pre>"
	       +"</div>"
	       +"<div class='sms_chat_phone_recive_content'>"
	       +"<span class='chat_delete_icon' id='chat_delete_icon'>&nbsp;</span>"
		   +"<span class='chat_forward_icon' id='chat_forward_icon'>&nbsp;</span>"
		   +"<span>"+msgDate+"</span>"
	       +"</div></div>"
	       +"</div>");
	   }
           $preTr.after($row);
           $preTr = $row;
	});	
}


function showChatHistory(){
	$('#cur_box_type_android_chat').text(g_Current_Phone_Number_chat); 
	if(g_module.pb_enabled){
		var postChatObject = {};
		var  chatArray = [];
		chatArray.push(g_Current_Phone_Number_chat);
		postChatObject = {
			Phone:chatArray
		};
		pb_match(postChatObject);
		$('#cur_box_type_android_chat').text(g_chat_sms_pbMatch);				
	}	
	$('.android_img_main').hide();
	g_showHistory = true;
	$('.sms_main_content').hide();
	$('.sms_individual_list').show();
    var $preTr= $("#boxList_title_chat"),$row = null;
	$(".sms_chat_list_tr").remove();
	var tempContent = "";
	var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
	$.each(g_sms_chatList, function(n,message) {
		switch(parseInt(message.smstype,10)) {
			case 7:
				message.content = sms_label_setting_usesreport  + common_colon + " " + common_success;
				break;
			case 8:
				message.content = sms_label_setting_usesreport  + common_colon + " " + common_failed;
				break;
			default:
				break;
	   }
	   if(g_sms_urlenabled) {
	       tempContent = regURL( message.content );
	   } else {
	       tempContent= XSSResolveCannotParseChar(message.content);
	   }
	   var msgDate = message.date;
	   msgDate = new Date(msgDate.replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm:ss");
	   $row  = $("<div class='sms_chat_list_tr'></div>");
	   if(CHAT_SMS_CURBOX == message.curbox)	{
          var html = "<div class='sms_chat_phone_sent'>"
		  +"<div class='sent_content_background'>"
	      +"<div class='sms_chat_phone_sent_content'> "
	      +"<pre class='sms_content_chat clr_blue_a'>"+tempContent+"</pre>"
	      +"</div>"
	      +"<div class='sms_chat_phone_sent_content'>";
	      if(CHAT_SMS_SMSTAT == message.smstat){
	          html += "<span class='chat_send_failed_icon'>&nbsp;</span>";
	      }
		  html += "<span class='chat_delete_icon' id='chat_delete_icon'>&nbsp;</span>"
	      +"<span class='chat_forward_icon' id='chat_forward_icon'>&nbsp;</span>"
		  +"<span>"+msgDate+"</span>"
	      +"</div></div><div class='sms_chat_sent_img'>&nbsp;&nbsp;</div>"
	      +"</div>";
	      $row.html(html);	        
	   }else{
           $row.html("<div class='sms_chat_phone_recive'>"
           +"<div class='sms_chat_recive_img'>&nbsp;&nbsp;</div><div class='recive_content_background'>"
	       +"<div class='sms_chat_phone_recive_content'> "
	       +"<pre class='sms_content_chat clr_blue_a'>"+tempContent+"</pre>"
	       +"</div>"
	       +"<div class='sms_chat_phone_recive_content'>"
	       +"<span class='chat_delete_icon' id='chat_delete_icon'>&nbsp;</span>"
		   +"<span class='chat_forward_icon' id='chat_forward_icon'>&nbsp;</span>"
		   +"<span>"+msgDate+"</span>"
	       +"</div></div>"
	       +"</div>");
	   }
           $preTr.after($row);
           $preTr = $row;
	});	
}

function setChatSmsRead() {
	var submitXmlObject ="";
	$(g_sms_chatList).each( function(i) {
		 if(g_sms_chatList[i].smstat == 0){
             submitXmlObject+="<Index>"+g_sms_chatList[i].index+"</Index>";
         }
    });
	var submitData = object2xml("request", submitXmlObject);
                saveAjaxData("api/sms/set-read", submitData, function($xml) {
                    var ret = xml2object($xml);
                    if(isAjaxReturnOK(ret)) {
                        //sms_initPage();
                       
                    }
                });
}

function  sms_clearAllErrorLabel() {
    clearAllErrorLabel();
    $('#sms_number_wrapper').css({
        height : '76px'
    });
}

function sms_gotoSiminboxUrl($case) {
    var sms_clearTimeout = 0;
    g_pbToSmsFlag = false;

    switch($case) {
        case 'ok':
        case 'cancel':
            if ($.browser.msie && ($.browser.version == '6.0')) {
                sms_clearTimeout = setTimeout( function() {
                    clearTimeout(sms_clearTimeout);
                    gotoPageWithoutHistory(SMS_CHAT_PGAE_URL);
                }, 500);
            } else {
                gotoPageWithoutHistory(SMS_CHAT_PGAE_URL);
            }
            break;
        default:
            break;
    }
}

//--------------------------------------------------------------------------------------------------------------------

function pb_showLocalContactList() {
    $.each(g_pb_contactListArray, function(n, phonebook) {
        html = vLocalShowContactList;
        html = pb_replace_showMobilePhone(html, phonebook);
        html = html.replaceString('%href%', n);
        $('#list_contacts').append(html);
        html = vLocalShowContactList;
        html = pb_replace_showHomePhone(html, phonebook);
        html = html.replaceString('%href%', n);
        $('#list_contacts').append(html);
        html = vLocalShowContactList;
        html = pb_replace_showWorkPhone(html, phonebook);
        html = html.replaceString('%href%', n);
        $('#list_contacts').append(html);
    });
    $('#user_add_select').append($('#list_contacts'));
    $('.linkmanInfo').unbind('click');
    $('.linkmanInfo').bind('click', function() {
        var userName=$.trim($(this).find('div').eq(0).text());
        var userPhone=$.trim($(this).find('div').eq(1).text());
        var displayInformation = userName + '<' + userPhone + '>';

        if(displayInformations.indexOf(displayInformation) < 0) {
            displayInformations += (displayInformation + ';');
        }
        $('#recipients_number_pb').val(displayInformations);
    });
}

function pb_replace_showMobilePhone(src, phonebook) {
    var dest = src;
    pb_getConfig();
    if (phonebook.MobilePhone) {
        if (phonebook.FormattedName) {
            g_pb_nameLength = utf8_strlen(phonebook.FormattedName);
            if(g_pb_nameLength <= g_pb_feature.max_name_size) {
                dest = dest.replaceString('%FormattedNameTwo%', resolveXMLEntityReference(phonebook.FormattedName).replace(/\s/g, '&nbsp;'));

            } else {
                g_pb_nameNumber = utf8_str_id(phonebook.FormattedName,g_pb_feature.max_name_size);
                afterSubstrName = (phonebook.FormattedName).substr(0,g_pb_nameNumber);
                dest = dest.replaceString('%FormattedNameTwo%', resolveXMLEntityReference(afterSubstrName).replace(/\s/g, '&nbsp;'));
            }
        } else {
            dest = dest.replaceString('%FormattedNameTwo%', '');
        }
        if(phonebook.MobilePhone.length <= g_pb_feature.max_phone_size) {
            dest = dest.replaceString('%phone%', XSSResolveCannotParseChar(phonebook.MobilePhone));
        } else {
            dest = dest.replaceString('%phone%', XSSResolveCannotParseChar((phonebook.MobilePhone).substr(0,g_pb_feature.max_phone_size)));
        }
        dest = dest.replaceString('%numberType%', 'MobilePhone:');
    } else {
        dest = '';
    }
    return dest;
}

function pb_replace_showHomePhone(src, phonebook) {
    var dest = src;
    pb_getConfig();
    if(phonebook.HomePhone) {
        if (phonebook.FormattedName) {
            g_pb_nameLength = utf8_strlen(phonebook.FormattedName);
            if(g_pb_nameLength <= g_pb_feature.max_name_size) {
                dest = dest.replaceString('%FormattedNameTwo%', resolveXMLEntityReference(phonebook.FormattedName).replace(/\s/g, '&nbsp;'));

            } else {
                g_pb_nameNumber = utf8_str_id(phonebook.FormattedName,g_pb_feature.max_name_size);
                afterSubstrName = (phonebook.FormattedName).substr(0,g_pb_nameNumber);
                dest = dest.replaceString('%FormattedNameTwo%', resolveXMLEntityReference(afterSubstrName).replace(/\s/g, '&nbsp;'));
            }
        } else {
            dest = dest.replaceString('%FormattedNameTwo%', '');
        }
        dest = dest.replaceString('%phone%', XSSResolveCannotParseChar(phonebook.HomePhone));
        dest = dest.replaceString('%numberType%', 'HomePhone:');
    } else {
        dest = '';
    }
    return dest;
}

function pb_replace_showWorkPhone(src, phonebook) {
    var dest = src;
    pb_getConfig();
    if(phonebook.WorkPhone) {
        if (phonebook.FormattedName) {
            g_pb_nameLength = utf8_strlen(phonebook.FormattedName);
            if(g_pb_nameLength <= g_pb_feature.max_name_size) {
                dest = dest.replaceString('%FormattedNameTwo%', resolveXMLEntityReference(phonebook.FormattedName).replace(/\s/g, '&nbsp;'));

            } else {
                g_pb_nameNumber = utf8_str_id(phonebook.FormattedName,g_pb_feature.max_name_size);
                afterSubstrName = (phonebook.FormattedName).substr(0,g_pb_nameNumber);
                dest = dest.replaceString('%FormattedNameTwo%', resolveXMLEntityReference(afterSubstrName).replace(/\s/g, '&nbsp;'));
            }
        } else {
            dest = dest.replaceString('%FormattedNameTwo%', '');
        }
        dest = dest.replaceString('%phone%', XSSResolveCannotParseChar(phonebook.WorkPhone));
        dest = dest.replaceString('%numberType%', 'WorkPhone:');
    } else {
        dest = '';
    }
    return dest;
}

function utf8_strlen(str) {
    var iLength = 0;
    var i = 0;
    for (i = 0; i < str.length; i++) {
        var value = str.charCodeAt(i);
        if (value < 0x080) {
            iLength += 1;
        } else if (value < 0x0800) {
            iLength += 2;
        } else {
            iLength += 3;
        }
    }
    return iLength;
}

function utf8_str_id(str,num) {
    var iLength = 0;
    var i = 0;
    for (i = 0; i < str.length; i++) {
        var value = str.charCodeAt(i);

        if (value < 0x080) {
            iLength += 1;
        } else if (value < 0x0800) {
            iLength += 2;
        } else {
            iLength += 3;
        }

        if(iLength > num) {
            break;
        }

    }
    return i;
}

function pb_getConfig() {
    if(pb_feature == null) {
        getConfigData('config/pb/config.xml', function($xml) {
            pb_feature = _xml2feature($xml);
            $.extend(g_pb_feature, pb_feature);
        }, {
            sync: true
        });
    }
}

function pb_getLocalContactList() {    
    var submitData = '';
    g_pb_local_contact_list_request.GroupID = 0;
    g_pb_local_contact_list_request.PageIndex = g_pb_pageIndex;
    g_pb_local_contact_list_request.ReadCount = g_pb_feature.max_record_size;
    g_pb_local_contact_list_request.KeyWord ='';

    submitData = object2xml('request', g_pb_local_contact_list_request);
    saveAjaxData('api/pb/pb-list', submitData, function($xml) {
        var ret = pb_local_xml2object($xml);
        if (ret.type == 'response') {
            g_pb_contactListArray = [];
            if (ret.response.Phonebooks.Phonebook) {
                if ($.isArray(ret.response.Phonebooks.Phonebook)) {
                    g_pb_contactListArray = ret.response.Phonebooks.Phonebook;                    
                } else {
                    g_pb_contactListArray.push(ret.response.Phonebooks.Phonebook);
                }
                pb_showLocalContactList();                
            } else {
                log.error('PB: post api/pb/pb-list file failed');
            }
            g_pb_curContactSum = ret.response.SumSize;
            checkPage();
        } else {
            log.error('PB: post api/pb/pb-list data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            log.error('PB: post api/pb/pb-list file failed');
        }
    });
}

function checkPage() {
    g_pb_totalPbPage = Math.ceil(g_pb_curContactSum / g_pb_local_contact_list_request.ReadCount);
    if(g_pb_pageIndex<g_pb_totalPbPage) {
        g_pb_pageIndex++;
        pb_getLocalContactList();
    }
}

/*
 * Local PhoneBook API For XML Transformation.
 */
function pb_local_xml2object($xml) {
    var obj = {};
    if ($xml.find('response').size() > 0) {
        var _response = pb_local_recursiveXml2Object($xml.find('response'));
        obj.type = 'response';
        obj.response = _response;
    } else if ($xml.find('error').size() > 0) {
        var _code = $xml.find('code').text();
        var _message = $xml.find('message').text();
        log.warn('MAIN : error code = ' + _code);
        log.warn('MAIN : error msg = ' + _message);
        obj.type = 'error';
        obj.error = {
            code: _code,
            message: _message
        };
    } else {
        obj.type = 'unknown';
    }
    return obj;
}

function pb_local_recursiveXml2Object($xml) {
    if ($xml.children().size() > 0) {
        var _obj = {};
        $xml.children().each( function() {
            if ('Field' != this.tagName) {
                var _childObj = ($(this).children().size() > 0) ?
                pb_local_recursiveXml2Object($(this)) : $(this).text();
                if (($(this).siblings().size() > 0) &&
                ($(this).siblings().get(0).tagName == this.tagName)) {
                    if (_obj[this.tagName] == null) {
                        _obj[this.tagName] = [];
                    }
                    _obj[this.tagName].push(_childObj);
                } else {
                    _obj[this.tagName] = _childObj;
                }
            } else {

                _obj[$(this).find('Name').text()] =
                $(this).find('Value').text();
            }
        });
        return _obj;
    } else {
        return $xml.text();
    }
}

String.prototype.replaceString = function(s1,s2) {
    var idx = 0;
    this.str = this;

    if ('%href%' == s1) {
        idx = this.str.indexOf(s1);
        if(idx >= 0) {
            this.str = this.str.substring(0, idx) + s2 + this.str.substr(idx+s1.length);
        }
    } else if (('%FormattedNameTwo%' == s1) || ('%GroupNameTwo%' == s1)) {
        idx = this.str.indexOf(s1);
        if (idx >= 0) {
            this.str = this.str.substring(0, idx) + s2 + this.str.substr(idx+s1.length);
        }
        idx = this.str.lastIndexOf(s1);
        if (idx >= 0) {
            this.str = this.str.substring(0, idx) + s2 + this.str.substr(idx+s1.length);
        }
    } else {
        idx = this.str.lastIndexOf(s1);
        if (idx > 0) {
            this.str = this.str.substring(0, idx) + s2 + this.str.substr(idx+s1.length);
        }
    }

    return this.str;
};