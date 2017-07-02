// JavaScript Document
var g_smsFeature = null;
var g_sms_importenabled = null;
var g_sms_urlenabled = null;
var SMS_BOXTYPE_LOCAL_INBOX = 1;
var SMS_BOXTYPE_LOCAL_SENT  = 2;
var SMS_BOXTYPE_LOCAL_DRAFT = 3;
var SMS_BOXTYPE_LOCAL_TRASH = 4;
var SMS_BOXTYPE_SIM_INBOX   = 5;
var SMS_BOXTYPE_SIM_SENT    = 6;
var SMS_BOXTYPE_SIM_DRAFT   = 7;
var SMS_BOXTYPE_MIX_INBOX   = 8;
var SMS_BOXTYPE_MIX_SENT    = 9;
var SMS_BOXTYPE_MIX_DRAFT   = 10;
var SMS_MAXPHONESIZE =50;
var SMS_BOXTYPE_INBOX   = SMS_BOXTYPE_LOCAL_INBOX;
var SMS_BOXTYPE_SENT    = SMS_BOXTYPE_INBOX + 1;
var SMS_BOXTYPE_DRAFT   = SMS_BOXTYPE_INBOX + 2;
var pb_start=0;
var pb_end=0;
var g_sms_boxType = SMS_BOXTYPE_INBOX;
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
var SIMINBOX_PGAE_URL = 'smsinbox.html';
var sms_systemBusy = 113018;
var g_convert_type = '';
var g_sms_totalSmsPage = 0;
var g_sms_curMsgSum = 0;
var g_pageRefresh = 0;
var g_pageIndex = '';
var g_sms_checkedList = "";
var g_sms_smsListArray = {
    PageIndex : g_sms_pageIndex,
    ReadCount:g_sms_readCount,
    BoxType:g_sms_boxType,
    SortType :g_sms_sortType,
    Ascending:g_sms_ascending,
    UnreadPreferred:g_sms_unreadPreferred
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
var bPhoneNumberFormatChange = false;
var beforeFormatChange='';

var g_sms_NewMsg = '';
var g_sms_smsList = new Array();
var g_sms_inbox_store_status = "0/0";
var g_sms_outbox_store_status = "0";
var g_sms_draftbox_store_status = "0";
var g_finishFlag = 0;
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
    if(!isButtonEnable("ref_msg_btn")) {
        return;
    }
    sms_getBoxCount();
    sms_initBoxCount();
    if(g_sms_curMsgSum > 0) {
        button_enable("ref_msg_btn","0");
        sms_initSMS();
    } else {
        g_sms_curMsgSum = 0;
        g_sms_recordMsgSum = 0;
    }
}

function sms_initSMS() {
    sms_getBoxData();
	//sms_getSmsData();
	setSmsBox(smsBoxType);
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

// bind emement event
function sms_btnAddEvent() {
    $("#sms_table :checkbox").live("click", function() {
        if(webui_mode == 'old' && !force_new_sms || webui_mode == 'new' && force_old_sms) {
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
            button_enable("del_msg_btn",checkedCount>0);
        } else {
            if(webui_mode == 'new' && !force_old_sms || webui_mode == 'old' && force_new_sms) {
	        var $allCheckBox = $("#sms_table :checkbox").filter(":checked");
                if ($allCheckBox.length == 0) {
                    button_enable("new_del_msg_btn","0");
                }
				else
				{
					button_enable("new_del_msg_btn","1");
				}
            }
        }
	
    });
    //
    $("#del_msg_btn").bind("click", function() {
        if(!isButtonEnable("del_msg_btn")) {
            return;
        }
        showConfirmDialog(common_confirm_delete_list_item, function() {
            sms_smsDelete();
        }, function() {
        });
    });
    /*$("#ref_msg_btn").bind("click",function()
     {
     sms_initPage();
     $("#jump_page_index").val("");
     });*/
    $("#jump_page").bind("click", function() {
        if (!isButtonEnable('jump_page')) {
                return;
        }
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
    //
    if(false == g_sms_importenabled) {
        $("#import_btn").remove();
    } else {
        $("#import_btn").bind("click", function() {
            if (!isButtonEnable('import_btn')) {
                return;
            }
            sms_importMessage();
        });
    }
}

//get the current sms type
function sms_getBoxType() {
    var msgType = {
        "smsinbox":SMS_BOXTYPE_INBOX,
        "smssent":SMS_BOXTYPE_SENT,
        "smsdrafts":SMS_BOXTYPE_DRAFT
    };
    g_sms_boxType = msgType[current_href];
    g_sms_smsListArray.BoxType = g_sms_boxType;
}

function sms_init_info() {
    sms_initBoxCount();
    if((g_sms_curMsgSum > 0) && ((g_sms_recordMsgSum != g_sms_curMsgSum)|| ('0' != g_sms_NewMsg && "undefined" !=typeof(g_sms_NewMsg) && "" != g_sms_NewMsg))) {
        sms_initSMS();    
        g_pageRefresh = 1;    
		setSmsBox(smsBoxType);
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
        //
        switch(g_sms_boxType) {
            case SMS_BOXTYPE_INBOX:
                $("#cur_box_type").text(sms_label_inbox);
                g_sms_curMsgSum = (g_sms_boxType == SMS_BOXTYPE_LOCAL_INBOX)? g_sms_smsCount.LocalInbox : g_sms_smsCount.SimInbox;
                break;
            case SMS_BOXTYPE_SENT:
                $("#cur_box_type").text(sms_label_sent);
                g_sms_curMsgSum = (g_sms_boxType == SMS_BOXTYPE_LOCAL_SENT)? g_sms_smsCount.LocalOutbox : g_sms_smsCount.SimOutbox;
                break;
            case SMS_BOXTYPE_DRAFT:
                $("#cur_box_type").text(sms_label_drafts);
                g_sms_curMsgSum = (g_sms_boxType == SMS_BOXTYPE_LOCAL_DRAFT)? g_sms_smsCount.LocalDraft : g_sms_smsCount.SimDraft;
                break;
            default:
                g_sms_curMsgSum = g_sms_smsCount.LocalInbox;
                break;
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
            //showInfoDialog(common_error);
            log.error("SMS: get api/sms/sms-count file failed");
        }
    });
}

/*calculate inbox sms count and if there is sms in inbox or sentbox or draftbox ,then show the list
 * else give 'no message' tip
 */
function sms_initBoxCount() {
    var unread = 0,
    inbox = 0,
    outbox = 0,
    draftbox = 0;
    if(SMS_BOXTYPE_INBOX == SMS_BOXTYPE_LOCAL_INBOX) {
        unread = g_sms_smsCount.LocalUnread;
        inbox = g_sms_smsCount.LocalInbox;
        outbox = g_sms_smsCount.LocalOutbox;
        draftbox = g_sms_smsCount.LocalDraft;
    } else {
        unread = g_sms_smsCount.SimUnread;
        inbox = g_sms_smsCount.SimUnread;
        outbox = g_sms_smsCount.SimOutbox;
        draftbox = g_sms_smsCount.SimDraft;
    }


	sms_getBoxCount();
   
    g_sms_inbox_store_status = unread+"/"+inbox;
    g_sms_outbox_store_status = outbox;
    g_sms_draftbox_store_status = draftbox;
    $("#label_inbox_status").text(g_sms_inbox_store_status);
    $("#label_sent_status").text(g_sms_outbox_store_status);
    $("#label_drafts_status").text(g_sms_draftbox_store_status);
    //
    if(g_sms_curMsgSum >0) {
        g_sms_totalSmsPage = Math.ceil(g_sms_curMsgSum/g_sms_smsListArray.ReadCount);
        g_sms_pageIndex = Math.min(g_sms_pageIndex,g_sms_totalSmsPage);
        var curSmsPage = g_sms_pageIndex+"/"+g_sms_totalSmsPage;
        $("#curSmsPage").text(curSmsPage);
        sms_createPageNav();
	//button_enable("pop_reply","1");	
	//button_enable("pop_forward","1");
        $(".sms_pagination div").show();
    } else {
	g_sms_totalSmsPage=0;  
	$("#curSmsPage").text('');  
	sms_createPageNav();
        $("#sms_check_all").removeAttr("checked");
        $(".sms_list_tr").remove();
        button_enable("del_msg_btn","0");
	//button_enable("new_del_msg_btn","0");
	//button_enable("pop_reply","0");	
	//button_enable("pop_forward","0");		
        //button_enable("ref_msg_btn","0");
        $(".sms_pagination div").show();
    }
    
    if(g_sms_smsCount.LocalInbox >0 && smsBoxType == 'received')
    {
    	button_enable("pop_reply","1");
    	button_enable("pop_forward","1");
    }
    else if(g_sms_smsCount.LocalInbox == 0 && smsBoxType == 'received')
    {
    	button_enable("pop_forward","0");
    	button_enable("pop_reply","0");
    }
    if( g_sms_smsCount.LocalOutbox >0 && smsBoxType == 'sent')
    {
    	button_enable("pop_forward","1");
    	button_enable("pop_reply","0");
    }
    else if( g_sms_smsCount.LocalOutbox == 0 && smsBoxType == 'sent')
    {
    	button_enable("pop_forward","0");
    	button_enable("pop_reply","0");
    }

}

//get current box(inbox/sendbox/draftbox) sms
function sms_getBoxData() {
    g_sms_smsListArray.PageIndex = g_sms_pageIndex;
    var msgCondition = object2xml("request",g_sms_smsListArray);
    saveAjaxData('api/sms/sms-list',msgCondition, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {
            if(ret.response.Messages.Message) {
                g_finishFlag = 1;
                g_sms_smsList = new Array();
                if($.isArray(ret.response.Messages.Message)) {
                    g_sms_smsList = ret.response.Messages.Message;
                } else {
                    g_sms_smsList.push(ret.response.Messages.Message);
                }
                sms_initBoxList();
            } else {
                // showInfoDialog(common_failed);
                log.error("SMS: get api/sms/sms-list data error");
            }
        } else {
            // showInfoDialog(common_failed);
            log.error("SMS: get api/sms/sms-list data error");
        }
    }, {
        errorCB: function() {
            // showInfoDialog(common_failed);
            if(g_finishFlag == 0) {
                sms_getBoxData();
                g_finishFlag = 1;
            }
            log.error("SMS: get api/sms/sms-list file failed");
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
    $.each(g_sms_smsList, function(n,message) {
        switch(parseInt(message.SmsType,10)) {
            case 7:
                message.Content = sms_label_setting_usesreport  + common_colon + " " + common_success;
                break;
            case 8:
                message.Content = sms_label_setting_usesreport  + common_colon + " " + common_failed;
                break;
            default:
                break;
        }
        if(g_sms_urlenabled) {
            tempContent = regURL( message.Content );
        } else {
            tempContent= XSSResolveCannotParseChar(message.Content);
        }
        smsReadState = "read_state"+ message.Smstat;
        smsReadState2 = "read_sta"+ message.Smstat;
        var msgDate = message.Date;
        msgDate = new Date(msgDate.replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm:ss");
        /*if(msgDate.substring(0,10)==now.substring(0,10))
         {
         msgDate = msgDate.substring(11);
         }
         else
         {
         msgDate = msgDate.substring(0,10);
         }*/
        var phoneArry=message.Phone.split(";");

        var messagePhone=sms_enterPhone(phoneArry);
        var smsReadStatesID = 'smsReadStates' + message.Index;
		var boldSms = "";
		if("undefined" != message && "undefined" != message.Smstat && 0 == message.Smstat){
			boldSms = "style='font-weight:bold'";
		}
        $row  = $("<tr class='sms_list_tr'"+ boldSms +"></tr>");
        //
        $cell_1 = $("<td width='50' class='sms_td'></td>");
        $cell_1.append("<input type='checkbox' name='checkbox' value='"+message.Index+"' />");
        $row.append($cell_1);
        //
        $cell_2 = $("<td  class='td_pl sms_phone_width'></td>");
        $cell_2.html("<table border='0' cellpadding='0' class='sms_msg' cellspacing='0'>"
        +"<tr>"
        +"<td><span  id='" + smsReadStatesID + "'  class='msg_icon "+smsReadState+" '>&nbsp;</span></td>"
        +"<td class='sms_phone_number "+ smsReadState2 +"'>"+messagePhone+"</td>"
        +"</tr>"
        +"</table>");
        $row.append($cell_2);
        //
        $cell_3 = $("<td  class='td_pl sms_content_width'></td>");
        $pre = $("<p class='sms_content clr_blue_a'></p>");
        if(tempContent.length != message.Content.length) {
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
        //
        $preTr.after($row);
        $preTr = $row;
        contactsArray.push(message.Phone);
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
    button_enable("del_msg_btn",'0');
    button_enable("new_del_msg_btn","0");
    button_enable("ref_msg_btn","1");

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
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
        $('#pageBegin').attr('href', pageLastHref);
        $('#pageLast').attr('href', pageBeginHref);
    } else {
        $('#pageBegin').attr('href', pageBeginHref);
        $('#pageLast').attr('href', pageLastHref);
    }
    //to previous or next page
    var prePageHref = "",
    nextPageHref = "";
    prePageHref = (g_sms_pageIndex==1)? "javascript:void(0);" : "javascript:sms_pageNav('prePage')";
    nextPageHref = (g_sms_pageIndex == g_sms_totalSmsPage)? "javascript:void(0);" : "javascript:sms_pageNav('nextPage')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
        $('#prePage').attr('href', nextPageHref);
        $('#nextPage').attr('href', prePageHref);
    } else {
        $('#prePage').attr('href', prePageHref);
        $('#nextPage').attr('href', nextPageHref);
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
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
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
    $("#page_num").html(page_number);
}

//to change current page index then refresh the sms list
function sms_pageNav(to) {
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
    //window.location.href="#";
    $(document).scrollTop(0);
    sms_initPage();
    $("#jump_page_index").val("");
}

//function delete user checked sms
function sms_smsDelete() {
    cancelLogoutTimer();
    g_sms_checkedList = "";// be checked
    var beChecked = $("#sms_table :checkbox:gt(0):checked");
    beChecked.each( function() {
        g_sms_checkedList+="<Index>"+this.value+"</Index>";
    });
    var xmlstr = object2xml("request", g_sms_checkedList);
    saveAjaxData("api/sms/delete-sms",xmlstr, function($xml) {
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
    "<tr><td><div class='wait_table_header'><label class='wait_title'>" +
    tipTitle +
    "</label><span class='wait_dialog_btn' id='wait_dialog_btn clr_gray' ><canvas id='sms_showWaitingCanvas' width='25px' height='25px'></canvas></span></div></td></tr>" +
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
        var canvas = document.getElementById("sms_showWaitingCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)){
		$(".wait_title").css("margin-top","5");
		$(".wait_dialog_btn").css("margin-top","7px");
		$(".wait_table_header").css({"width":"377px","height":"33px"});
		$(".wait_table_header").corner("top 5px");
		$(".button_wrapper").css('background', '#75ACD6');
		$(".button_wrapper").corner("3px");
		$(".button_wrapper input").css("padding-top","2px");
		var ahtml="<img src='../res/new_del.png' title='' alt='' />";
		$(".wait_table_header span").append(ahtml);
	}else{
		var canvas = document.getElementById("sms_showWaitingCanvas");
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
	dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='sms_showSmsCanvas' width='25px' height='25px'></canvas></a></span>";
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
        dialogHtml += "                   <input type='text' id='recipients_number' name='recipients_number' value='' onblur='checkNumberFormat()' />";
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
    
    /*$("#recipients_number").on("change paste keyup", function() {
  		phone_number_format(); 
	});*/

	$(".body_bg").before(dialogHtml);
	if($.browser.msie && (parseInt($.browser.version,10) == 9)){
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("sms_showSmsCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)){
		$(".dialog_header_left").css("margin-top","5");
		$(".sms_dialog_header").css({"width":"609px","height":"29px"});
		$(".sms_dialog_header").corner("top 5px");
		$(".dialog_close_btn").css("top","7");
		$(".button_wrapper").css('background', '#75ACD6');
		$(".button_wrapper").corner("3px");
		$(".button_wrapper input").css("padding-top","2px");
		var ahtml="<img src='../res/new_del.png' title='' alt='' />";
		$(".sms_dialog_header a").append(ahtml);
	}else{		
		var canvas = document.getElementById("sms_showSmsCanvas");
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
    + create_button_html(sms_label_save_to_drafts, "pop_save_to_drafts", "pop_save_to_drafts") + "&nbsp;&nbsp;&nbsp;&nbsp;"
    + create_button_html(common_cancel,"pop_Cancel","pop_Cancel");
    $(".dialog_table_r").html(buttonHtml);
    ieRadiusBorder();
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        $("#recipients_number_pb").focus().select();
    }else {
        $("#recipients_number").focus().select();
    }    
    if(g_contact_enabled == 1 && g_module.pb_enabled) {
        $('#pop_send,#pop_Cancel,.dialog_close_btn').live('click', function() {
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
        if(g_sms_smsList[i].Index == currentSmsIndex) {
            if(g_sms_smsList[i].Smstat == 0) {
                var submitXmlObject = {
                    Index:currentSmsIndex
                };
                var submitData = object2xml("request", submitXmlObject);
                saveAjaxData("api/sms/set-read", submitData, function($xml) {
                    var ret = xml2object($xml);
                    if(isAjaxReturnOK(ret)) {
                        //sms_initPage();
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
/* 1 */0x00D5, 0x00D6, 0x00D9, 0x00DA, 0x00DB, 0x00DD, 0x00DE, 0x00E1, 0x00E2, 0x00E3, 0x00E7, 0x00EA, 0x00EB, 0x00ED, 0x00EE, 0x00EF,
/* 2 */0x00F0, 0x00F3, 0x00F4, 0x00F5, 0x00F6, 0x00FA, 0x00FB, 0x00FD, 0x00FE, 0x00FF, 0x0102, 0x0104, 0x0105, 0x0106, 0x0107, 0x010C,
/* 3 */0x010D, 0x010E, 0x010F, 0x0111, 0x0114, 0x0118, 0x0119, 0x011B, 0x0132, 0x0133, 0x0139, 0x013D, 0x0141, 0x0142, 0x0143, 0x0144,
/* 4 */0x0147, 0x0148, 0x0154, 0x0155, 0x0158, 0x0159, 0x015A, 0x015B, 0x015E, 0x015F, 0x0160, 0x0161, 0x0162, 0x0163, 0x0164, 0x0165,
/* 5 */0x0168, 0x016E, 0x016F, 0x0179, 0x017A, 0x017B, 0x017C, 0x017D, 0x017E, 0x01CE, 0x01D4, 0x0490, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 6 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
/* 7 */0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
];
function sms_isPhoneNumber(str) {
    var bRet = true;
    //var remove_char = remove_char.replace(/[^a-zA-Z ]/g, "");

    var rgExp = /^[+]{0,1}[*#()-0123456789]{1,20}$/;
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

/*
 function check_enter_number_in_sms_content(str) {
 var i = 0;
 var char_i;
 var num_char_i;
 var enter_number = 0;

 for(i = 0; i < str.length; i++) {
 char_i = str.charAt(i);
 num_char_i = char_i.charCodeAt();
 if( num_char_i == ENTER_CHAR) {
 if( i == 0 ) {
 enter_number++;
 } else {
 char_i = str.charAt(i - 1);
 num_char_i = char_i.charCodeAt();
 if( num_char_i != CR_CHAR ) {
 enter_number++;
 }
 }
 }
 }
 return enter_number;
 }
 */
function sms_showContentCount(str) {
    g_sms_length = str.length;
    //g_sms_length += check_enter_number_in_sms_content(str);

    document.getElementById("sms_count").innerHTML = "(" + g_sms_length + ")";
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
        button_enable("pop_save_to_drafts", "0");
    } else {
        button_enable("pop_send", "1");
        button_enable("pop_save_to_drafts", "1");
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

/*
 function ucs2_number_change(str) {
 var i=0;
 var cmp_len_min =0;
 var diff_begin =0;
 var new_end =0;
 var old_end = 0;
 var ucs2_num_tmp=0;
 var new_ucs2_num =0;
 var old_ucs2_num =0;
 var char_i;
 var char_i_code;
 var char_i_old;
 var char_i_code_old;

 if (g_content == null) {
 g_ucs2_num =  ucs2_number_check(str);
 return;
 }

 if (str==null) {
 g_ucs2_num =0;
 return;
 }

 cmp_len_min = Math.min(str.length, g_content.length);
 if (cmp_len_min == 0) {
 g_ucs2_num =  ucs2_number_check(str);
 return;
 }

 for (i=0;i<cmp_len_min;i++) {
 char_i = str.charAt(i);
 char_i_code = char_i.charCodeAt();

 char_i_old = g_content.charAt(i);
 char_i_code_old = char_i_old.charCodeAt();

 if (char_i_code_old != char_i_code) {
 diff_begin = i;
 break;
 }
 }

 if (i == cmp_len_min) {
 diff_begin = cmp_len_min;
 }
 if (diff_begin == g_content.length) {
 if (g_content.length == str.length ) {
 return;
 } else {
 ucs2_num_tmp = ucs2_number_check(str.substring(diff_begin,str.length));
 g_ucs2_num = g_ucs2_num + ucs2_num_tmp;
 return ;
 }
 }
 if (diff_begin == str.length) {
 ucs2_num_tmp = ucs2_number_check(g_content.substring(diff_begin,g_content.length));
 g_ucs2_num = g_ucs2_num - ucs2_num_tmp;
 return ;
 }

 for (i = 0;i< cmp_len_min;i++) {

 char_i = str.charAt(str.length-1 -i);
 char_i_code = char_i.charCodeAt();

 char_i_old = g_content.charAt(g_content.length-1-i);
 char_i_code_old = char_i_old.charCodeAt();

 if (char_i_code_old != char_i_code) {
 new_end = str.length-1-i;
 old_end = g_content.length -1-i;
 break;
 }
 }

 if (new_end < diff_begin) {
 new_ucs2_num = 0;
 } else {
 new_ucs2_num = ucs2_number_check(str.substring(diff_begin,new_end +1));
 }

 if (old_end < diff_begin) {
 old_ucs2_num = 0;
 } else {
 old_ucs2_num = ucs2_number_check(g_content.substring(diff_begin,old_end+1));
 }
 g_ucs2_num = g_ucs2_num + (new_ucs2_num -old_ucs2_num );

 return ;
 }
 */
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
    });
}

function main_executeBeforeDocumentReady() {
    getConfigData("config/sms/config.xml", function($xml) {
        g_smsFeature = _xml2feature($xml);
        g_sms_smsListArray.ReadCount = g_smsFeature.pagesize > 50 ? 50 : (g_smsFeature.pagesize);
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

    redirectOnCondition(null, "smsinbox");
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

var vsim_status=0;
function initVsim() {
    getAjaxData("api/vsim/operateswitch-vsim", function($xml) {
        var vsim_info = xml2object($xml);
        if("response" == vsim_info.type) {
            var g_vsim_info = vsim_info.response;
            vsim_status = g_vsim_info.vsim_status;
        }

    }, {
        sync: true
    });
} 

function chang_menuli(){
    if(g_moduleswitch.vsim_enabled == 1) {
        initVsim();
        if (vsim_status != 2) {
            showInfoDialog(IDS_vsim_function_show);
            allButton_enable('0');
            $('input:not(#lang)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
        }
    }
}
//-------------------------------------------------------------------------------------------------
$(document).ready( function() {
    
    getMonitoringStatus();

    if(g_net_mode_status==MACRO_NET_MODE_C) {
        g_isCDMA=true;
    } else if(g_net_mode_status==MACRO_NET_MODE_W) {
        g_isCDMA= false ;
    }

    if(g_net_mode_type==MACRO_NET_DUAL_MODE) {
        addStatusListener('sms_changeNetwork()');
    }
    sms_getBoxType();
    check_lang_edit();
    sms_initPage();
    if(g_module.pb_enabled) {
        getPhonebookContacts();
    }
    // to check new messages
    setInterval( function() {

        sms_getBoxCount(false,sms_init_info());        
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
	function saveToDaftStartTimer(a){
		if(a!=0){
			setTimeout(function(){
				sms_createSms('Save');
				button_enable("pop_save_to_drafts","0");
			},LOGOUT_TIMEOUT_MAIN);
		}
        startLogoutTimer();
	}
    $("#message").live("click", function() {
        if (!isButtonEnable('message')) {
            return;
        }
        sms_newMessage();
        smsIndex = -1;
		saveToDaftStartTimer();
    });
    // show message
    function sms_showMessage(viewIndex) {

        sms_showSmsDialog();
        //smsIndex = $(".sms_td :input[type=checkbox]").eq(viewIndex).val();
        smsIndex = g_sms_smsList[viewIndex].Index;
        var buttonHtml = "";
        var isReadOnly = false;
        if(g_sms_boxType == SMS_BOXTYPE_INBOX) {
            buttonHtml += create_button_html(common_reply,"pop_reply", "pop_reply") + "&nbsp;&nbsp;&nbsp;&nbsp;";
            $('#recipients_sender').html( sms_label_sender + common_colon );
            $('#search_recipients_number').hide();
        }
        if(g_sms_boxType == SMS_BOXTYPE_DRAFT) {
            cancelLogoutTimer();
			saveToDaftStartTimer(0);
            if(g_contact_enabled == 1 && g_module.pb_enabled) {
                $("#recipients_number_pb").focus().select();
            }else {
                $("#recipients_number").focus().select();
            }            
            buttonHtml += create_button_html(common_send,"pop_send", "pop_send") + "&nbsp;&nbsp;&nbsp;&nbsp;";
            buttonHtml += create_button_html(sms_label_save_to_drafts, "pop_save_to_drafts", "pop_save_to_drafts") + "&nbsp;&nbsp;&nbsp;&nbsp;";
            if(g_contact_enabled == 1 && g_module.pb_enabled) {
                $('#pop_send,#pop_Cancel,.dialog_close_btn').live('click', function() {
                    $('#user_add_select').hide();
                    $('#search_recipients_number').show();
                    $('#close_search_recipients_number').hide();
                });
            } else {
                $("#search_recipients_number").hide();
            }
        }
        if(g_sms_boxType != SMS_BOXTYPE_DRAFT) {
            isReadOnly = true;
            if(g_contact_enabled == 1 && g_module.pb_enabled) {
                $("#recipients_number_pb").attr("readonly","readonly");
            }else {
                $("#recipients_number").attr("readonly","readonly");
            }
            $("#message_content").attr("readonly","readonly");
            buttonHtml +=  create_button_html(common_forward, "pop_forward", "pop_forward") + "&nbsp;&nbsp;&nbsp;&nbsp;";
            $('#search_recipients_number').hide();
        }
        buttonHtml +=  create_button_html(common_cancel,"pop_Cancel","pop_Cancel");
        $(".dialog_table_r").html(buttonHtml);
        ieRadiusBorder();
        
        $(g_sms_smsList).each( function(i) {
            if(g_sms_smsList[i].Index == smsIndex) {
                if(g_contact_enabled == 1 && g_module.pb_enabled) {
                    $("#recipients_number_pb").val(g_sms_smsList[i].Phone);
                }else {
                    $("#recipients_number").val(g_sms_smsList[i].Phone);
                }                
                $("#message_content").val(g_sms_smsList[i].Content);
                if(isReadOnly) {
                    sms_showContentCount( $("#message_content").val() );
                } else {
                    sms_contentChange($("#message_content").val());
                }

                scaIndex = i;
            }
        });
        setSmsRead(smsIndex);
    }

    $(".sms_list_tr").live("click", function( event ) {
        if(g_moduleswitch.vsim_enabled == 1 && vsim_status != 2) {
            return;
        }
        if ( "sms_td" != $(event.target).attr("class")  && "sms_td" != $(event.target).parent().attr("class")  ) {
            sms_showMessage( $(".sms_list_tr").index(this) );
			var e = $(event.target);
			while(1){
				if("sms_list_tr" == e.attr("class")){
					e.css("font-weight", "normal");
					return;
				}
				e = e.parent();
			}
        }
    });
    // show reply dialog
    $("#pop_reply").live("click", function() {
    
	if(!isButtonEnable("pop_reply")) {
            return;
        }
        var replyNumber = '';
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            replyNumber = $("#recipients_number_pb").val();
        }else {
            //replyNumber = $("#new_sms_text_title").val();
            replyNumber = document.getElementById("new_sms_text_title").innerText;
        } 
        var buttonHtml = create_button_html(common_send,"pop_send", "pop_send") + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + create_button_html(sms_label_save_to_drafts, "pop_save_to_drafts", "pop_save_to_drafts") + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + create_button_html(common_cancel,"pop_Cancel","pop_Cancel");
        cancelLogoutTimer();
		saveToDaftStartTimer();
        sms_showSmsDialog();
        $(".dialog_table_r").html(buttonHtml);
        ieRadiusBorder();
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            $("#recipients_number_pb").val(replyNumber);
        }else {
            $("#recipients_number").val(replyNumber);
	    checkNumberFormat();
        }        
        sms_contentChange($("#message_content").val());
        $("#message_content").focus().select();
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            $('#pop_send,#pop_Cancel,.dialog_close_btn').live('click', function() {
                $('#user_add_select').hide();
                $('#search_recipients_number').show();
                $('#close_search_recipients_number').hide();
            });
        } else {
            $("#search_recipients_number").hide();
        }
    });
    // show forward dialog
    $("#pop_forward").live("click", function() {
    	if(!isButtonEnable("pop_forward")) {
            return;
        }
        //var forwardContent = $("#message_content").val();
       var forwardContent = document.getElementById("new_sms_text_content").innerText;
        var buttonHtml = create_button_html(common_send,"pop_send", "pop_send") + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + create_button_html(sms_label_save_to_drafts, "pop_save_to_drafts", "pop_save_to_drafts") + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + create_button_html(common_cancel,"pop_Cancel","pop_Cancel");
        cancelLogoutTimer();
		saveToDaftStartTimer();
        sms_showSmsDialog();
        $(".dialog_table_r").html(buttonHtml);
        ieRadiusBorder();
        $("#message_content").val(forwardContent);
        sms_contentChange($("#message_content").val());
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            $("#recipients_number_pb").focus().select();
        }else {
            $("#recipients_number").focus().select();
        }        
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            $('#pop_send,#pop_Cancel,.dialog_close_btn').live('click', function() {
                $('#user_add_select').hide();
                $('#search_recipients_number').show();
                $('#close_search_recipients_number').hide();
            });
        } else {
            $("#search_recipients_number").hide();
        }
    });
    // function for create sms & save sms
    function sms_createSms(btnValue) {
        sms_clearAllErrorLabel();
        var strPhoneNumber = '';
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            strPhoneNumber = $.trim($("#recipients_number_pb").val());
        }else {
            strPhoneNumber = $.trim($("#recipients_number").val());
        }        
        var messageContent = $("#message_content").val();

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
            if(SMS_BOXTYPE_DRAFT == g_sms_boxType && smsIndex>-1) {
                index = smsIndex;
                smsIndex = -1;
            }
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
                        if(SMS_BOXTYPE_DRAFT == g_sms_boxType) {
                            sms_initPage();
                        }
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
                                                    "</td></tr><tr><td class='success_phone_number_sms'>" + spaceToNbsp(XSSResolveCannotParseChar(contactsName)).split(";").join("; ") + "</td></tr></table></td></tr><tr class='send_failed_info'><td height='21'></td></tr>";
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
                                            "</td></tr><tr><td class='success_phone_number_sms'>" + sendSuccessPhones.split(",").join("; ") + "</td></tr></table></td></tr><tr class='send_failed_info'><td height='21'></td></tr>";
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
                                    if(( SMS_BOXTYPE_SENT  == g_sms_boxType && successedTotal>0)
                                    ||( SMS_BOXTYPE_DRAFT == g_sms_boxType )) {
                                        button_enable("ref_msg_btn","1");
                                        sms_initPage(); //if send failed save to draft
                                    }
                                }//if end
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
        } else {
            button_enable("pop_save_to_drafts","1");
        }
    }

    // send sms
    $("#pop_send").live("click", function() {
        if(!isButtonEnable("pop_send")) {
            return;
        }
        editInformation();
        phone_number_format_reverse();
        sms_createSms("Sent");
	//refresh();
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
    // delete sms
    $("#pop_delete").live("click", function() {
        if(isButtonEnable("pop_delete")) {
            startLogoutTimer();
            button_enable("pop_delete","0");
            clearDialog();
            var submitXmlObject = {
                Index:smsIndex
            };
            var submitData = object2xml("request", submitXmlObject);
            saveAjaxData("api/sms/delete-sms", submitData, function($xml) {
                sms_initPage();
            });
        }
    });
    $("#pop_save_to_drafts").live("click", function() {
        if(!isButtonEnable("pop_save_to_drafts")) {
            return;
        }
        editInformation();
        startLogoutTimer();
        button_enable("pop_save_to_drafts","0");
        sms_createSms("Save");
        if (true == g_pbToSmsFlag && true == g_numberValid) {
            sms_gotoSiminboxUrl('save_to_drafts');
        }
        if(g_contact_enabled == 1 && g_module.pb_enabled) {
            $('#user_add_select').hide();
            $('#search_recipients_number').show();
            $('#close_search_recipients_number').hide();
        }
    });
    $("#message_content").live("keydown keypress keyup focus change input", function(event) {
        if( $("#message_content").attr("readonly") ) {
            return;
        }
        if(("keydown" == event.type || "keypress" == event.type || "keyup" == event.type)
        && (37 == event.keyCode || 38 == event.keyCode || 39 == event.keyCode || 40 == event.keyCode)) {
            return;
        }
        sms_numberCheck($("#message_content").val());
        sms_contentChange($("#message_content").val());
    });
    chang_menuli();
});
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
        case 'save_to_drafts':
            if ($.browser.safari) {
                sms_clearTimeout = setTimeout( function() {
                    clearTimeout(sms_clearTimeout);
                    gotoPageWithoutHistory(SIMINBOX_PGAE_URL);
                }, 500);
            } else {
                gotoPageWithoutHistory(SIMINBOX_PGAE_URL);
            }
            break;
        case 'ok':
        case 'cancel':
            if ($.browser.msie && ($.browser.version == '6.0')) {
                sms_clearTimeout = setTimeout( function() {
                    clearTimeout(sms_clearTimeout);
                    gotoPageWithoutHistory(SIMINBOX_PGAE_URL);
                }, 500);
            } else {
                gotoPageWithoutHistory(SIMINBOX_PGAE_URL);
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
            //showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-list data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            //showInfoDialog(common_failed);
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





function creatSmsContent() {
    if(webui_mode == 'new' && force_old_sms) {
        $('#new_smsmenu_list').detach();
        $('#new_sms_list').detach();
        $('#new_sms_text').detach();
    } else {
        if(webui_mode == 'old' && force_new_sms) {
            $('.content *').hide();
            $('.content').prepend($('#new_sms_text').detach().show());
            $('.content').prepend($('#new_sms_list').detach().show());
            $('.content').prepend($('#new_smsmenu_list').detach().attr('style', 'margin-left: 23px !important;').show());
        } else {
            $('#new_body').append($('#new_smsmenu_list').detach().show());
            $('#new_body').append($('#new_sms_list').detach().show());
            $('#new_body').append($('#new_sms_text').detach().show());
        }
    }
}
/*if(LANGUAGE_DATA.current_language == 'ru_ru'){
    var new_sms_num_tips1 = "У Вас ";
    var new_sms_num_tips2 = " сообщение";
}else{
    var new_sms_num_tips1 = "you have ";
    var new_sms_num_tips2 = " message";
}*/

function setSmsText() {
    $('#new_all_sms a').text(sms_lable_sms);
    $('#new_ussd a').text(ussd_label_ussd);

    $('#new_unread_sms a').text(new_unread_sms);
    $('#new_read_sms a').text(new_read_sms);

    if(LANGUAGE_DATA.current_language == 'ru_ru'){
        $('#new_received_sms a').text(IDS_msg_receive);
        $('#new_sent_sms a').text(msg_sent);
    }else{
        $('#new_received_sms a').text(IDS_msg_receive);
        $('#new_sent_sms a').text(msg_sent);
    }

    $('#message').attr('value', common_new_messages);
    $('#new_del_msg_btn').attr('value', common_delete);
    $('#pop_reply').attr('value', common_reply); 
    $('#pop_forward').attr('value', common_forward); 
}

function addSmsEvent() {
    $('#new_received_sms').click(function () {
        smsBoxType = 'received';
	g_sms_totalSmsPage=0;  
		g_sms_boxType=SMS_BOXTYPE_LOCAL_INBOX;
		g_sms_smsListArray.BoxType = g_sms_boxType;
        setSmsBox(smsBoxType);

        window.location.hash = smsBoxType;
        // return false;
    });
    $('#new_sent_sms').click(function () {
        smsBoxType = 'sent';
	g_sms_totalSmsPage=0;  
		g_sms_boxType=SMS_BOXTYPE_LOCAL_SENT;
		g_sms_smsListArray.BoxType = g_sms_boxType;
        setSmsBox('sent');

        window.location.hash = smsBoxType;
        // return false;
    });
    $('#new_unread_sms').click(function () {
        smsBoxType = 'unread';
        setSmsBox(smsBoxType);
        window.location.hash = smsBoxType;
        // return false;
    });
    $('#new_read_sms').click(function () {
        smsBoxType = 'read';
        setSmsBox(smsBoxType);
        window.location.hash = smsBoxType;
        // return false;
    });


    $('.new_sms_list_tr > *:not(.sms_td)').live('click', function () {
        var smsIndex = $(this).parent().find('.sms_td input').attr('value');
        $('.new_sms_list_tr .sms_phone_number:not(.read_sta0)').removeClass('red_color_font');
        $('.new_sms_list_tr .msg_icon:not(.read_state0)').removeClass('red_color_font');

        $(this).parent().attr('style', '');
        $(this).parent().find('.sms_phone_number').addClass('red_color_font');
        $(this).parent().find('.msg_icon').addClass('red_color_font');
        setSmsBox(smsBoxType, smsIndex);
        //sms_initSmsList(g_sms_smsList);
    });

    $('#select_all_sms').live('click', function () {
        var $allCheckBox = $("#sms_table :checkbox");
        $allCheckBox.attr("checked",this.checked);
	var $allCheckBox1 = $("#sms_table :checkbox").filter(":checked");
        if ($allCheckBox1.length == 0) {
            button_enable("new_del_msg_btn","0");
        }
	else
	{
		button_enable("new_del_msg_btn","1");
	}
    });
    
    button_enable("new_del_msg_btn","0");

    $("#new_del_msg_btn").live("click", function() {
        if(!isButtonEnable("new_del_msg_btn")) {
            return;
        }

        var $allCheckBox = $("#sms_table :checkbox").filter(":checked");
        if ($allCheckBox.length == 0) {
            showInfoDialog(new_sms_select_null);
            $('#select_all_sms').attr('checked', false);
            return;
        }

        showConfirmDialog(common_confirm_delete_list_item, function() {
            set_smsDelete();
        }, function() {
            $("#sms_check_all").removeAttr("checked");
        });
    });

    $('.new_sms_text_botton').live('click', function () {
        var index = $(this).next().text();
        if (!index) {return;}
        showConfirmDialog(common_confirm_delete_list_item, function() {

            sms_OnesmsDelete(index);
        }, function() {
        });
    });
}


function setSmsBox(smsType, Index) {
    // console.log(smsType);
    switch (smsType) {
        case 'received':
            var Box = 'LocalInbox',
                BoxType = 1;
		
            break;
        case 'sent':
            var Box = 'LocalOutbox',
                BoxType = 2;
		
            break;
        case 'unread':
            var Box = 'LocalInbox',
                BoxType = 1,
                Smstat = '0';
            break;
        case 'read':
            var Box = 'LocalInbox',
                BoxType = 1,
                Smstat = '1';
            break;
        default:
            return;
    }
    $('#select_all_sms').attr('checked', false);
    $('#new_all_sms + ul .red_color_font').removeClass('red_color_font');
    $('#new_' + smsType + '_sms a').addClass('red_color_font');
    $('#new_sms_class').text($('#new_' + smsType + '_sms a').text());
    getSmsCount(Box, BoxType, Smstat, Index);
}

function getSmsCount(Box, BoxType, Smstat, Index) {
    getAjaxData('api/sms/sms-count', function($xml) {
        var sms_ret = xml2object($xml);
        if ('response' == sms_ret.type) {
            var smsCount = parseInt(sms_ret.response[Box]);
            sms_getSmsData(smsCount, BoxType, Smstat, Index);
        }
    }, {
        sync: true
    });
}

function sms_getSmsData(smsCount, BoxType, Smstat, Index) {
    var g_sms_smsList = [];
    var g_sms_smsListArray = {
        PageIndex : 0,
        ReadCount: 50,
        BoxType: BoxType,
        SortType : 0,
        Ascending: 0,
        UnreadPreferred: 0
    };
    //var pageCount = parseInt(smsCount/50, 10) + 1;
    //for (var i = 1; i <= pageCount; i++) {
        g_sms_smsListArray.PageIndex = g_sms_pageIndex;
        var msgCondition = object2xml("request",g_sms_smsListArray);
        saveAjaxData('api/sms/sms-list',msgCondition, function($xml) {
            var ret = xml2object($xml);
            if (ret.type == "response") {
                if(ret.response.Messages.Message) {
                    if($.isArray(ret.response.Messages.Message)) {
                        Array.prototype.push.apply(g_sms_smsList, ret.response.Messages.Message);
                    } else {
                        g_sms_smsList.push(ret.response.Messages.Message);
                    }
                } else {
                    // showInfoDialog(common_failed);
                    log.error("SMS: get api/sms/sms-list data error");
                }
            } else {
                // showInfoDialog(common_failed);
                log.error("SMS: get api/sms/sms-list data error");
            }
        }, {
            sync: true
        });
    //}

    if (Smstat !== undefined) {
        for (var j=0; j<g_sms_smsList.length; j++) {
            if (g_sms_smsList[j].Smstat !== Smstat) {
                g_sms_smsList.splice(j, 1);
                j--;
            }
        }
    }

    if(g_sms_smsList.length>1){
        if(LANGUAGE_DATA.current_language == 'ru_ru'){
            new_sms_num_tips2 = " сообщений";
        }else{
            new_sms_num_tips2 = " messages";
        }
    }

    //$('#new_sms_number').text(new_sms_num_tips1 + ' ' + g_sms_smsList.length + ' ' + new_sms_num_tips2);
	if(g_pageRefresh == 1)
	{
		g_pageRefresh = 0;
		Index = g_pageIndex;
		sms_initSmsList(g_sms_smsList);
	    if (Index === undefined) {
	        if (g_sms_smsList.length > 0) {
	            setRightSmsText(g_sms_smsList[0]);
	        } else {
	            setRightSmsText(null);
	        }
	    } else {
	        for (var k=0; k<g_sms_smsList.length; k++) {
	            if (g_sms_smsList[k].Index === Index) {
	                setRightSmsText(g_sms_smsList[k]);
	                setOpenSmsRead(Index);
	                return;
	            }
	        }
	    }
	}
	g_pageIndex = Index;
    if (Index === undefined) {
        if (g_sms_smsList.length > 0) {
            setRightSmsText(g_sms_smsList[0]);
            setOpenSmsRead(g_sms_smsList[0]);
        } else {
            setRightSmsText(null);
        }
    } else {
        for (var k=0; k<g_sms_smsList.length; k++) {
            if (g_sms_smsList[k].Index === Index) {
                setRightSmsText(g_sms_smsList[k]);
                setOneSmsRead(Index);
                return;
            }
        }
    }
  

    sms_initSmsList(g_sms_smsList);
}

function setRightSmsText(sms) {
    if (sms) {
        $('#new_sms_text_index').text(sms.Index);
        $('#new_sms_text_title').text(sms.Phone);
        var msgDate = sms.Date;
        msgDate = new Date(msgDate.replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm:ss");
        $('#new_sms_text_data').text(msgDate);
        $('#new_sms_text_content').text(sms.Content);
    } else {
        $('#new_sms_text_index').text('');
        $('#new_sms_text_title').text('');
        $('#new_sms_text_data').text('');
        $('#new_sms_text_content').text('');
    }

}









function sms_initSmsList(g_sms_smsList) {

    var smsReadState = null;
    var tempContent = "";

    var $preTr= $("#new_boxList_title"),
        $row = null,
        $cell_1 = null,$cell_2 = null,$cell_3 = null,$cell_4 = null,
        $pre = null;
    //
    $(".new_sms_list_tr").remove();

  
    /**
    *message.Content单条信息内容
    *message.Smstat是否已查看
    *msgDate日期
    *messagePhone号码
    */

    $.each(g_sms_smsList, function(n,message) {
         
        switch(parseInt(message.Smstat,10)) {
            case 7:
                message.Content = sms_label_setting_usesreport  + common_colon + " " + common_success;
                break;
            case 8:
                message.Content = sms_label_setting_usesreport  + common_colon + " " + common_failed;
                break;
            default:
                break;
        }
        if (message.Content.length > 100) {
            message.Content = message.Content.slice(0, 100) + '...';
        }
        if(g_sms_urlenabled) {
            tempContent = regURL( message.Content );
        } else {
            tempContent= XSSResolveCannotParseChar(message.Content);
        }

        smsReadState = "read_state"+ message.Smstat;
        smsReadState2 = "read_sta"+ message.Smstat;
        var msgDate = message.Date;
        msgDate = new Date(msgDate.replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm:ss");
        var phoneArry=message.Phone.split(";");

        var messagePhone=sms_enterPhone(phoneArry);
        var smsReadStatesID = 'smsReadStates' + message.Index;
        var boldSms = "";
        if("undefined" != message && "undefined" != message.Smstat && 0 == message.Smstat){
            boldSms = "style='font-weight:bold'";
        }
        $row  = $("<tr class='new_sms_list_tr'" + boldSms + "></tr>");
        //
        $cell_1 = $("<td class='sms_td'></td>");
        $cell_1.append("<input type='checkbox' name='checkbox' value='"+message.Index+"' />");
        $row.append($cell_1);
        //
        $cell_2 = $("<td  class='td_pl sms_phone_width'></td>");
        $cell_2.html("<table border='0' cellpadding='0' class='sms_msg' cellspacing='0'>"
            +"<tr>"
            +"<td><span  id='" + smsReadStatesID + "'  class='msg_icon "+smsReadState+" '>&nbsp;</span></td>"
            +"<td class='sms_phone_number "+ smsReadState2 +"'>"+messagePhone+"</td>"
            +"</tr>"
            +"</table>");
        $row.append($cell_2);
        //
        $cell_4 = $("<td  class='td_pl sms_date_width'></td>");
        $cell_4.append("<label>"+msgDate+"</label>");
        $row.append($cell_4);
        //
        $cell_3 = $("<td  class='td_pl sms_content_width'></td>");
        $pre = $("<p class='sms_content clr_blue_a'></p>");
        if(tempContent.length != message.Content.length) {
            $pre.html( tempContent );
        } else {
            $pre.text( tempContent );
        }
        $cell_3.html($pre);
        $row.append($cell_3);

        $preTr.after($row);
        $preTr = $row;
    });

    $('.new_sms_list_tr:first .sms_phone_number').addClass('red_color_font');
    $('.new_sms_list_tr:first .msg_icon').addClass('red_color_font');
    $("#sms_check_all").removeAttr("checked");
}


var smsBoxType = '';
$(document).ready(function () {
    if(webui_mode == 'new' && !force_old_sms) {
        $('#wrapper').css('display', 'none');
    }
    creatSmsContent();
    if(webui_mode == 'new' && !force_old_sms || webui_mode == 'old' && force_new_sms) {
        setSmsText();
        addSmsEvent();

        if (window.location.hash === '') {
            window.location.hash = 'received';
        }
        smsBoxType = window.location.hash.slice(1);

        setSmsBox(smsBoxType);
    }
});

function set_smsDelete() {
    cancelLogoutTimer();
    g_sms_checkedList = "";// be checked
    var beChecked = $("#sms_table :checkbox").filter(":checked");
    beChecked.each( function() {
        g_sms_checkedList+="<Index>"+this.value+"</Index>";
    });
    var xmlstr = object2xml("request", g_sms_checkedList);
    saveAjaxData("api/sms/delete-sms",xmlstr, function($xml) {
        var ret = xml2object($xml);
        startLogoutTimer();
        if(isAjaxReturnOK(ret)) {
	button_enable("new_del_msg_btn","0");
            setSmsBox(smsBoxType);
        }
    });
   
}

function sms_OnesmsDelete(index) {
    g_sms_checkedList+="<Index>"+index+"</Index>";
    var xmlstr = object2xml("request", g_sms_checkedList);
    saveAjaxData("api/sms/delete-sms",xmlstr, function($xml) {
        var ret = xml2object($xml);
        startLogoutTimer();
        if(isAjaxReturnOK(ret)) {
            setSmsBox(smsBoxType);
        }
    });
}

function setOneSmsRead(smsIndex) {
    var submitXmlObject = {
        Index: smsIndex
    };
    var submitData = object2xml("request", submitXmlObject);
    saveAjaxData("api/sms/set-read", submitData, function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            //sms_initPage();
            $("#smsReadStates"+smsIndex).attr('class','msg_icon read_state1');
            $("#smsReadStates"+smsIndex).parent().next('td').attr('class','sms_phone_number read_sta1');
            setOpenSmsRead(smsIndex)
        }
    });
}
function setOpenSmsRead(smsIndex) {
            //sms_initPage();
        $("#smsReadStates"+smsIndex).attr('style', '');
	$("#smsReadStates"+smsIndex).parent().next('td').attr('class','sms_phone_number red_color_font');
        $("#smsReadStates"+smsIndex).parent().find('.msg_icon').addClass('red_color_font');
       
}
function checkNumberFormat()
{
var strPhoneNumber11 = document.getElementById("recipients_number");

	if(strPhoneNumber11.value=='')
	{
	return;
	}

	var strPhoneNumber1 = strPhoneNumber11.value;
	strPhoneNumber2 = '';
	var patt1 = /[-)+(]/g;
	
	if (strPhoneNumber1.length > 0) {
            if (strPhoneNumber1.lastIndexOf(";") == (strPhoneNumber1.length - 1)) {
                strPhoneNumber1 = strPhoneNumber1.substring(0, strPhoneNumber1.length - 1);
                $("#recipients_number").val(strPhoneNumber1);  
            }
        }
	
	var PhoneArray = strPhoneNumber1.split(";");
	var ret = sms_sendNumberCheck(PhoneArray);
	
	if(bPhoneNumberFormatChange == true)
	{
			for (var j = 0; j < PhoneArray.length; j++) {
                 	PhoneArray[j] = PhoneArray[j].replace(patt1, '');
            		}
	}
	
	
	if(ret==true)
	{
	phone_number_format();
	button_enable("pop_send","1");
	}
	else
	{
	button_enable("pop_send","0");
	}
	
	
}
function phone_number_format(){
	
	var strPhoneNumber11 = document.getElementById("recipients_number");
	var strPhoneNumber1 = strPhoneNumber11.value;
	bPhoneNumberFormatChange = true;
	strPhoneNumber2 = '';
	
	var PhoneArray = strPhoneNumber1.split(";");
	var patt1 = /[-)+(]/g;
	
	
	  /*if (strPhoneNumber1.length > 0) {
            if (strPhoneNumber1.lastIndexOf(";") == (strPhoneNumber1.length - 1)) {
                strPhoneNumber1 = strPhoneNumber1.substring(0, strPhoneNumber1.length - 1);
                if(g_contact_enabled == 1 && g_module.pb_enabled) {
                    $("#recipients_number_pb").val(sendInformation);
                } else {
                    $("#recipients_number").val(strPhoneNumber1);
                }
            }
        }
        PhoneArray = strPhoneNumber1;*/
	
	for(var i = 0; i < PhoneArray.length; i++)
	{
	var temp=PhoneArray[i];
	if(temp.length>9)
	{
	if(temp[0]=='+' && temp[1]=='7')
	{
	temp=temp.replace(patt1, '');
	PhoneArray[i] = temp.replace(patt1, '');
        c = { 1:'(',4:')',7:'-',9:'-' };
	strPhoneNumber3 = '';
	for (var j = 0; j < temp.length; j++) {
                 strPhoneNumber3  += (c[j] || '') + temp[j];
            }
	    strPhoneNumber3 = '+'+ strPhoneNumber3;
	    strPhoneNumber2 += strPhoneNumber3;
	    if(i!=(PhoneArray.length-1))
	    {
	    strPhoneNumber2  += ';';
	    }
	}
	else if(temp[0]=='8')
	{
	temp=temp.replace(patt1, '');
	PhoneArray[i] = temp.replace(patt1, '');
        c = { 1:'(',4:')',7:'-',9:'-' };
	
	for (j = 0; j < temp.length; j++) {
                 strPhoneNumber2  += (c[j] || '') + temp[j];
            }
	    if(i!=(PhoneArray.length-1))
	    {
	    strPhoneNumber2  += ';';
	    }
	}
	else if(temp[0]=='7')
	{
	temp=temp.replace(patt1, '');
	PhoneArray[i] = temp.replace(patt1, '');
        c = {0:'+',1:'(',4:')',7:'-',9:'-' };
	
	for (j = 0; j < temp.length; j++) {
                 strPhoneNumber2  += (c[j] || '') + temp[j];
            }
	    if(i!=(PhoneArray.length-1))
	    {
	    strPhoneNumber2  += ';';
	    }
	}
	else
	{
	/*temp=temp.replace(patt1, '');
	PhoneArray[i] = temp.replace(patt1, '');
        c = { 0:'(',3:')',6:'-',8:'-' };
	
	for (j = 0; j < temp.length; j++) {
                 strPhoneNumber2  += (c[j] || '') + temp[j];
            }
	    if(i!=(PhoneArray.length-1))
	    strPhoneNumber2  += ';';*/
	    
	    strPhoneNumber2 += temp;
		if(i!=(PhoneArray.length-1))
		{
	    	strPhoneNumber2  += ';';
	    	}
	 }   
	
	}
	else{
	strPhoneNumber2 += temp;
	if(i!=(PhoneArray.length-1))
	    strPhoneNumber2  += ';';
	}
	}
	
	strPhoneNumber11.value = strPhoneNumber2;
	
	
  }
	
function phone_number_format_reverse(){
	var strPhoneNumberAfterFormat = "";
	var patt1 = /[-)(]/g;
	if(bPhoneNumberFormatChange)
	{
		var strPhoneNumber11 = document.getElementById("recipients_number");
		var strPhoneNumber1 = strPhoneNumber11.value;
		
		var PhoneArray = strPhoneNumber1.split(";");
		//var strPhoneNumber2 = "";
		for(var i = 0; i < PhoneArray.length; i++)
		{
			var temp=PhoneArray[i];
			/*if(temp[0]=='+')
			{
			var temp1 = PhoneArray[i].replace(patt1, '');
			temp1='+'+ temp1;
		 	strPhoneNumberAfterFormat += temp1;
			}
			else
			{*/
		  	var numbers = PhoneArray[i].replace(patt1, '');
		 	strPhoneNumberAfterFormat += numbers;
			//}
			 
			 if(i!=(PhoneArray.length-1))
	    		strPhoneNumberAfterFormat  += ';';
		 	
		 }	
		 strPhoneNumber11.value  = strPhoneNumberAfterFormat;	
	}
	
}
