var USSD_RETURN_RESULT = 2001;
var USSD_OUT_TIME = 2003;
var USSD_HAVE_USSD_DIALOG = 1;
var USSD_HAVE_NOT_USSD_DIALOG = 0;
var g_ussd_preconfig = '';
var g_ussd_postconfig = '';
var g_ussd_btnStr = '';
var g_ussd_currentFun = null;
var g_ussd_chargeLimitText = '*0123456789#';
var g_ussd_generalLimitText = '*0123456789#';
var g_ussd_generalCommandList = [];
var g_ussd_timeout = false;
var g_ussd_timer_maxDialog = null;
var balance_html = '';
var general_html = '';
var g_ussd_sms_number = '';
var g_ussd_send_type = '';
var g_ussd_status_timer = '';
//muilvalue
var g_ussd_muilvalue_timeout = '';
var MACRO_USSD_TIMER = 2 * 60 * 1000;
var g_ussd_timer_muilvale = null;
var g_ussd_dialogstatus_finished = true;
var g_multi_config_list = null;
var vsim_status=0;

redirectOnCondition(null, 'ussd');
//get value g_ussd_preconfig&g_ussd_postconfig...
function ussd_initVar() {

    getConfigData('config/ussd/prepaidussd.xml', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            g_ussd_preconfig = ret.config.USSD;
        } else {
            log.error('USSD: get data configurations/prepaidussd.xml error');
        }
    }, {
        sync: true
    });


    getConfigData('config/ussd/postpaidussd.xml', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            g_ussd_postconfig = ret.config.USSD;
        } else {
            log.error('USSD: get data configurations/postpaidussd.xml error');
        }
    }, {
        sync: true
    });
}

ussd_initVar();



//fun inint_show list
function ussd_show_ActivateInternetService(value)
{
    $('.ussd_content > div').hide();
    $('#cur_ussd_type').text(ussd_label_ActivateInternetService_title);
    ussd_getDialogStatus();
    ussd_activateInternetService(value);
    $('#fun_activateInternetService').show();
    chang_menuli();
}

function ussd_show_BalanceInquiry(value)
{
    $('.ussd_content > div').hide();
    $('#cur_ussd_type').text(ussd_label_BalanceInquiry_title);
    ussd_getDialogStatus();
    $("#fun_balanceInquiry > *").remove();
    ussd_balanceInquiry(value);
    $('#fun_balanceInquiry').show();
    chang_menuli();
}

function ussd_show_Charge(value)
{
    $('.ussd_content > div').hide();
    $('#cur_ussd_type').text(ussd_label_Charge_title);
    ussd_getDialogStatus();
    $("#fun_charge > *").remove();
    ussd_charge(value);
    $('#fun_charge').show();
    chang_menuli();
}

function ussd_show_General(value)
{
    $('.ussd_content > div').hide();
    $('#cur_ussd_type').text(ussd_label_Universal_title);
    ussd_getDialogStatus();
    general_html = '';
    $('#general_result_table').html(general_html);
    g_ussd_generalCommandList.length = 0;
    ussd_general(value);
    $('#fun_general').show();
    $('#general_command_select_input').focus();
    chang_menuli();
}

//fun first page
function ussd_initShow() {

    switch (g_ussdLeftmenu[0])
    {
        case 'preactivate_internet_service':
            ussd_show_ActivateInternetService(g_ussd_preconfig.ActivateInternetService);
        break;
        case 'prebalanceInquiry':
            ussd_show_BalanceInquiry(g_ussd_preconfig.BalanceInquiry);
        break;
        case 'precharge':
            ussd_show_Charge(g_ussd_preconfig.Charge);
        break;
        case 'pregeneral':
            ussd_show_General(g_ussd_preconfig.General);
        break;
        case 'postactivate_internet_service':
            ussd_show_ActivateInternetService(g_ussd_postconfig.ActivateInternetService);
        break;
        case 'postbalanceInquiry':
            ussd_show_BalanceInquiry(g_ussd_postconfig.BalanceInquiry);
        break;
        case 'postcharge':
            ussd_show_Charge(g_ussd_postconfig.Charge);
        break;
        case 'postgeneral':
            ussd_show_General(g_ussd_postconfig.General);
        break;
        default:
        break;
    }
}

 //prepaid click
function ussd_initPreClick() {

   $('#pre_service_title').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#pre_service_title').addClass('subClick');
        ussd_show_ActivateInternetService(g_ussd_preconfig.ActivateInternetService);
    });

    $('#pre_fun_balanceInquiry').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#pre_fun_balanceInquiry').addClass('subClick');
        ussd_show_BalanceInquiry(g_ussd_preconfig.BalanceInquiry);
    });

    $('#pre_fun_charge').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#pre_fun_charge').addClass('subClick');
        //show error info
        clearAllErrorLabel();
        ussd_show_Charge(g_ussd_preconfig.Charge);
    });

    $('#pre_fun_general').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#pre_fun_general').addClass('subClick');

        //show error info
        clearAllErrorLabel();
        ussd_show_General(g_ussd_preconfig.General);
    });
}

//postpaid click
function ussd_initPostClick() {
    $('#post_service_title').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#post_service_title').addClass('subClick');
        ussd_show_ActivateInternetService(g_ussd_postconfig.ActivateInternetService);
    });

    $('#post_fun_balanceInquiry').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#post_fun_balanceInquiry').addClass('subClick');
        ussd_show_BalanceInquiry(g_ussd_postconfig.BalanceInquiry);
    });

    $('#post_fun_charge').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#post_fun_charge').addClass('subClick');

        //show error info
        clearAllErrorLabel();
        ussd_show_Charge(g_ussd_postconfig.Charge);
    });

    $('#post_fun_general').live('click', function() {
        $('#ussd_setting_menu li').removeClass('subClick');
        $('#post_fun_general').addClass('subClick');

        //show error info
        clearAllErrorLabel();
        ussd_show_General(g_ussd_postconfig.General);
    });

}

//fun sms and multi global variable init
function ussd_sms_multi_init(index)
{
    index = parseInt(index, 10); 
    g_ussd_send_type = '';
    g_ussd_sms_number = '';
    g_ussd_muilvalue_timeout = '0';
    $.each(g_multi_config_list, function(n, value) {
        if (index == n) {
            if ('undefined' != typeof(value.Type)) {
                g_ussd_send_type = value.Type.toLocaleLowerCase();
                g_ussd_sms_number = value.Number;
            } else {
                g_ussd_send_type = '';
                g_ussd_sms_number = '';
            }
            if ('undefined' != typeof(value.timeout)) {
                g_ussd_muilvalue_timeout = value.timeout;
            }else {
                g_ussd_muilvalue_timeout = '0';
            }
        }
    });

    
}

// fun ActivateInternetService
function ussd_activateInternetService(value) {
    var config_list = [];
    if (value.Items) {
        if (value.Items.Item) {
            if ($.isArray(value.Items.Item)) {
                config_list = value.Items.Item;
            } else {
                config_list.push(value.Items.Item);
            }
        }
    }
    if (0 == config_list.length) {
        return;
    }

    g_multi_config_list = config_list;
    $('#activate_internet_service_description').html(regURL(eval(value.Description)));
    var subTr = '';

    /*
     * create select
     */
    var selectHtml = '';
    selectHtml = "<select id='activate_internet_service_select'>";

    $.each(config_list, function(n, value) {
        selectHtml += "<option value='" + $.trim(value.Command) + "'>" + eval(value.Subject).replace('%d', '1') + '</option>';
    });
    selectHtml += '</select>';

    /*
     * create button
     */
    var btnHTML = '';
    btnHTML = create_button_html(eval(config_list[0].Action), 'ActivateInternetServiceBtn', 'ActivateInternetServiceBtn');

    subTr += "<tr><td height='36'><label>" + selectHtml + '<label></td>';
    subTr += '<td class=\"align_right\">' + btnHTML + '</td></tr>';

    $('#activate_internet_service table').html(subTr);
    ieRadiusBorder();
    /*
     * define button action
     */
    $('#ActivateInternetServiceBtn').bind('click', function() {
        ussd_sendCommand('ActivateInternetService',
        $('#activate_internet_service_select').val(),
        'CodeType');
    });
}

//fun BalanceInquiry
function ussd_balanceInquiry(value) {
    
    var config_list = [];
    if ($.isArray(value.Items.Item)) {
        config_list = value.Items.Item;
    } else {
        config_list.push(value.Items.Item);
    }
    if (0 == config_list.length) {
        return;
    }
    g_multi_config_list = config_list;
    $.each(config_list, function(n, value) {
        var balance_html = "<div class='ussd_extend_border'><p><label id=" + "balance_inquiry_description" + n + "></label></p>";
        balance_html += ' <div class="ussd_concent"> ';
        balance_html += ' <div class="ussd_left_concent" >';
        balance_html += ' <label id=' + "balance_inquiry_result" + n + '></label></div>';
        balance_html += ' <div class="ussd_right_concent" id=' + "balance_inquiry_action" + n + '></div> ';
        balance_html += ' </div><div style="clear:both;float:none"></div></div>';

        $('#fun_balanceInquiry').append(balance_html);

        var funName = 'BalanceInquiry' + n;
        var descriptionId = '#balance_inquiry_description' + n;
        var funId = '#BalanceInquiry' + n;
        var actionId = '#balance_inquiry_action' + n;

        $(descriptionId).text(eval(value.Description));
        ussd_creatBtn(funName, $.trim(value.Command), value.Action, funId);
        $(actionId).html(g_ussd_btnStr);
        ieRadiusBorder();
        
    });
}

//fun Charge
function ussd_charge(value) {
    var config_list = [];
    if ($.isArray(value.Items.Item)) {
        config_list = value.Items.Item;
    } else {
        config_list.push(value.Items.Item);
    }
    if (0 == config_list.length) {
        return;
    }
    g_multi_config_list = config_list;
    $.each(config_list, function(n, value) {
        var charge_html = "<div class='ussd_extend_border'><p><label id=" + "charge_description" + n + "></label></p>";
        charge_html += ' <table cellpadding="0" cellspacing="0" border="0" width="500"> ';
        charge_html += ' <tr><td>';
        charge_html += ' <input type="text" id=' + "charge_command" + n + ' maxlength="40" class="charge_command_style"/>';
        charge_html += ' </td><td height="40" class="align_right" id=' + "charge_action" + n + '></td>';
        charge_html += ' </tr><tr><td colspan="2">';
        charge_html += '<input type="hidden" id=' + "charge_hint" + n +' /></td> ';
        charge_html += '</tr></table></div>';

        $('#fun_charge').append(charge_html);

        var funName = 'Charge' + n;
        var descriptionId = '#charge_description' + n;
        var funId = '#Charge' + n;
        var actionId = '#charge_action' + n;
        var commandId = '#charge_command' + n;

        $(descriptionId).text(eval(value.Description));
        $(commandId).val(value.Command);
        ussd_creatBtn(funName, $.trim(value.Command), value.Action, funId, value.LimitText);
        $(actionId).html(g_ussd_btnStr);
        ieRadiusBorder();
    });
}


//fun General
function ussd_general(value) {
    g_ussd_send_type = '';
    g_ussd_sms_number = '';
    g_ussd_muilvalue_timeout = '0';

    $('#general_title').text(eval(value.Title));
    $('#general_description').text(eval(value.Description));
    g_ussd_generalLimitText = $.trim(value.LimitText);
    insertGeneralCommandList();

    //
    ussd_creatBtn('General', value.Command, value.Action, 'general_btn');
    $('#general_action').html(g_ussd_btnStr);
    ieRadiusBorder();
}

//
function ussd_creatBtn(funName, content, action, btnId, LimitText) {
    g_ussd_btnStr = "<span class='button_wrapper ' id='span_" + btnId + "' onclick = \"javascript:ussd_sendCommand('" + funName + "','" + content + "','CodeType', '" + LimitText + "');return false;\">";
    g_ussd_btnStr += "<input id='" + btnId + "'  class='button_dialog' type='button' value='" + eval(action) + "' /></span>";
}

function ussd_checkChargeCommand(Content, LimitText, extendNumber) {
    var reg = null;
    if (LimitText != '') {
    try {
            reg = new RegExp(LimitText);
            if (reg.exec(Content) != Content) {
                showErrorUnderTextbox('charge_hint' + extendNumber, ussd_label_hint_wrong_command,'charge_error_msgId_' + extendNumber);
                $('#charge_command').focus().select();
                $('.button_wrapper input').removeClass('disable_btn');
                $('.button_wrapper input').addClass('button_dialog');
                return false;
            }
    } catch (exception) {
        log.error(exception);
        showErrorUnderTextbox('charge_hint' + extendNumber, ussd_label_hint_wrong_command,'charge_error_msgId_' + extendNumber);
        $('#charge_command').focus().select();
        $('.button_wrapper input').removeClass('disable_btn');
        $('.button_wrapper input').addClass('button_dialog');
        return false;
    }

    }
    return true;
}

function ussd_checkGeneralCommand(Content) {
    var reg = null;
    if (g_ussd_generalLimitText != '') {
        try {
        reg = new RegExp(g_ussd_generalLimitText);
        if (reg.exec(Content) != Content) {
            showErrorUnderTextbox('general_hint', ussd_label_hint_wrong_command);
            $('#general_command_select').select();
            $('.button_wrapper input').removeClass('disable_btn');
            $('.button_wrapper input').addClass('button_dialog');
            return false;
        }

        } catch (exception) {
            log.error(exception);
            showErrorUnderTextbox('general_hint', ussd_label_hint_wrong_command);
            $('#general_command_select').select();
            $('.button_wrapper input').removeClass('disable_btn');
            $('.button_wrapper input').addClass('button_dialog');
            return false;
        }
    }
    return true;
}
//
function resolveXMLEntityReference(xmlStr)
{
    return xmlStr.replace(/(\<|\>|\&|\'|\")/g,
                          function($0, $1)
                          {
                              return{
                                  '<' : '&lt;'
                                , '>' : '&gt;'
                                , '&' : '&amp;'
                                , "'" : '&#39;'
                                , '\"': '&quot;'
                              }[$1];
                          }
                         );
}

Date.prototype.Format = function(format) {
    var o = {
        'M+' : this.getMonth() + 1,
        'd+' : this.getDate(),
        'h+' : this.getHours(),
        'm+' : this.getMinutes(),
        's+' : this.getSeconds()
    };
    var k;
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

//send Common by sms
function sendCommonBySms(Content, CodeType) {
    clearInterval(g_ussd_status_timer);
    var messageContent = resolveXMLEntityReference(Content);
    var now = new Date().Format('yyyy-MM-dd hh:mm:ss');
    var scaValue = '';
    var submitXmlObject = {
        Index: -1,
        Phones: {
            Phone: g_ussd_sms_number
        },
        Sca: scaValue,
        Content: messageContent,
        Length: messageContent.length,
        Reserved: 0,
        Date: now,
        SendType: 1
    };

    var submitData = object2xml('request', submitXmlObject);

    saveAjaxData('api/sms/send-sms', submitData);
    showInfoDialog(ussd_info_dialog_to_sms);
    g_ussd_status_timer = setInterval(function() {
        ussd_getDialogStatus();
    },g_feature.update_interval);
}

function ussdDialogStatusFinished() {
    closeWaitingDialog();
    g_ussd_currentFun = null;
    g_ussd_dialogstatus_finished = true;
}

function ussdTimeOutByGetResult() {
    g_ussd_timeout = false;
    g_ussd_timer_maxDialog = setTimeout(function() {
        g_ussd_timeout = true;
        ussdDialogStatusFinished();
        showInfoDialog(common_timeout);
        ussd_releaseUssdDialog();
    }, MACRO_USSD_TIMER);
}

//send Common by ussd
function sendCommonByUssd(Content, CodeType) {
    //
    if ('0' == g_ussd_muilvalue_timeout) {
        g_ussd_muilvalue_timeout = '';
    }
    var send = {
        content: Content,
        codeType: CodeType,
        timeout: g_ussd_muilvalue_timeout
    };
    var ussdSend = object2xml('request', send);
    showWaitingDialog(common_waiting, IDS_ussd_label_wait_response);
    g_ussd_dialogstatus_finished = false;
    $('#wait_dialog_btn').show().bind('click', function() {
        g_ussd_timeout = true;
        clearTimeout(g_ussd_timer_maxDialog);
        clearTimeout(g_ussd_timer_muilvale);
        ussd_releaseUssdDialog();
        g_ussd_dialogstatus_finished = true;
        g_ussd_currentFun = null;
    });
    saveAjaxData('api/ussd/send', ussdSend, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (isAjaxReturnOK(ret)) {
                if(g_ussd_muilvalue_timeout != '') {
                    g_ussd_muilvalue_timeout = parseInt(g_ussd_muilvalue_timeout, 10);
                }                
                if (g_ussd_muilvalue_timeout > 0) {
                    g_ussd_timer_muilvale = setTimeout(function() {
                        ussdTimeOutByGetResult();
                        ussd_getResult();
                    }, g_ussd_muilvalue_timeout * 1000);
                } else {
                    ussdTimeOutByGetResult();
                    ussd_getResult();
                }
                startLogoutTimer();
            } else {
                sendCommandFailed();
            }
        } else if (ret.error.code == '111022') {//network nonsupport
            closeWaitingDialog();
            g_ussd_dialogstatus_finished = true;
            showInfoDialog(IDS_security_pin_code_management);
        } else  //failed
        {
            sendCommandFailed();
        }
    }, {
        errorCB: function(XMLHttpRequest, textStatus) {
            sendCommandFailed();
        }
    });
    //
    function sendCommandFailed() {
        ussdDialogStatusFinished();
        $('.button_wrapper input').removeClass('disable_btn');
        $('.button_wrapper input').addClass('button_dialog');
        showInfoDialog(common_failed);
        startLogoutTimer();
    }

}

//
function ussd_sendCommand(funName, Content, CodeType, LimitText) {
    if ($('.button_wrapper input').hasClass('disable_btn')) {
        return;
    } else {
        $('.button_wrapper input').removeClass('button_dialog');
        $('.button_wrapper input').addClass('disable_btn');
    }
    cancelLogoutTimer();
    //clearAllErrorLabel();
    var checkContent = 0;
    var indexOfChecked = -1;
    var indexStr = '';
    if ('General' == funName) {
        clearAllErrorLabel();
        Content = $.trim($('#general_command_select').sVal());
        checkContent = Content;
        //
        if (Content == null || Content == '') {
            showErrorUnderTextbox('general_hint', ussd_label_hint_wrong_command);
            $('#general_command_select').select();
            $('.button_wrapper input').removeClass('disable_btn');
            $('.button_wrapper input').addClass('button_dialog');
            return;
        } else {
            if (false == ussd_checkGeneralCommand(Content)) {
                return;
            }
        }
        g_ussd_currentFun = funName;
        Content = XSSResolveCannotParseChar(Content);
        $('#general_command_select').sVal(null);
        general_html += "<tr><td class='general_status'>" + common_sent + common_colon;
        general_html += "</td><td><div class='general_content'>" + Content + '</div></td></tr>';
        $('#general_result_table').html(general_html);
        var lastTrH = $('#general_result_table tr:last').height();
        var tableH = $('#general_result_table').height();
        $('#general_result').scrollTop(tableH - lastTrH);
    } else if ('ActivateInternetService' == funName) {
        clearAllErrorLabel();
        checkContent = Content;
        g_ussd_currentFun = funName;
        var obj =document.getElementById("activate_internet_service_select")
        indexOfChecked = obj.selectedIndex;
        ussd_sms_multi_init(indexOfChecked);
        if (checkContent == null || checkContent == '') {
            showErrorUnderTextbox('activate_internet_service_select', ussd_label_hint_wrong_command);
            $('.button_wrapper input').removeClass('disable_btn');
            $('.button_wrapper input').addClass('button_dialog');
            return;
        }
    } else if (funName.indexOf('BalanceInquiry') > -1){
        checkContent = Content;
        g_ussd_currentFun = funName;
        indexStr = funName.substring('BalanceInquiry'.length);
        ussd_sms_multi_init(indexStr);
        if (checkContent == null || checkContent == '') {
            showErrorUnderTextbox('balance_inquiry_description' + indexStr, ussd_label_hint_wrong_command, 'balance_error_msgId_' + indexStr);
            $('.button_wrapper input').removeClass('disable_btn');
            $('.button_wrapper input').addClass('button_dialog');
            return;
        } else {
            $('#balance_error_msgId_' + indexStr).parent().remove();
        }
    } else if (funName.indexOf('Charge') > -1) {
        indexStr = funName.substring('Charge'.length);
        Content = $.trim($('#charge_command' + indexStr).val());
        checkContent = Content;
        Content = Content.replace(/[\[\]]/g, '');
        g_ussd_currentFun = funName;
        ussd_sms_multi_init(indexStr);
        if (checkContent == null || checkContent == '') {
            showErrorUnderTextbox('charge_hint' + indexStr, ussd_label_hint_wrong_command, 'charge_error_msgId_' + indexStr);
            $('.button_wrapper input').removeClass('disable_btn');
            $('.button_wrapper input').addClass('button_dialog');
            return;
        } else {
            $('#charge_error_msgId_' + indexStr).parent().remove();
            if (false == ussd_checkChargeCommand(Content, LimitText, indexStr)) {
                return;
            }
        }
    } else {
        clearAllErrorLabel();
    }

    if (40 < checkContent.length) {
        showInfoDialog(IDS_ussd_label_illegal_command_hint);
        return;
    }
    if ('sms' == g_ussd_send_type) {
        sendCommonBySms(Content, CodeType);
    } else {
        sendCommonByUssd(Content, CodeType);
    }
}

//
function ussd_getResult() {
    if (g_ussd_timeout == true) {
        return;
    }
    //
    getAjaxData('api/ussd/get', function($xml) {
        if (g_ussd_timeout == true) {
            return;
        }
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            ret = $.trim(ret.response.content);
            ret = XSSResolveCannotParseChar(ret);
            ret = ret.replace(/[\n|\r]/g, '<br/>');
            if (ret.length == 0) {
                ret = common_failed;
            }
            if ('General' == g_ussd_currentFun) {
                var lastTrH = $('#general_result_table tr:last').height();

                general_html += "<tr class='general_result'><td class='general_status clr_cyan'>";
                general_html += dialup_label_received + common_colon + "</td><td><pre class='general_content clr_cyan'>";
                general_html += ret + '</pre></td></tr>';
                $('#general_result_table').html(general_html);

                var tableH = $('#general_result_table').height();
                lastTrH += $('#general_result_table tr:last').height();
                $('#general_result').scrollTop(tableH - lastTrH);
            } else if (g_ussd_currentFun.indexOf('BalanceInquiry') > -1) {
                var indexStr = '';
                indexStr = g_ussd_currentFun.substring('BalanceInquiry'.length);
                balance_html = "<pre class = 'ussd_info_result'>" + ret + '</pre>';
                $('#balance_inquiry_result' + indexStr).html(balance_html);
            } else {
                var infoDialog = "<pre style='white-space: pre-wrap; word-wrap: break-word'>" + ret + "</pre>";
                clearTimeout(g_ussd_timer_maxDialog);
                ussdDialogStatusFinished();
                showInfoDialog(infoDialog);
                return;
            }
            //
            clearTimeout(g_ussd_timer_maxDialog);
            ussdDialogStatusFinished();
        } else {
            if (ret.error.code == '111019') {//no response from network
                setTimeout(ussd_getResult, g_feature.update_interval);
            } else if (ret.error.code == '111020') {//network timeout error
                clearTimeout(g_ussd_timer_maxDialog);
                ussdDialogStatusFinished();
                ussd_releaseUssdDialog();
                showInfoDialog(common_timeout);
            } else {
                clearTimeout(g_ussd_timer_maxDialog);
                ussdDialogStatusFinished();
                showInfoDialog(common_failed);
                log.error('USSD:get api/ussd/get data error');
            }
        }

    }, {
        errorCB: function() {
            clearTimeout(g_ussd_timer_maxDialog);
            ussdDialogStatusFinished();
            showInfoDialog(common_failed);
            log.error('USSD:get api/ussd/get file failed');
        }
    });
}

// to check if there is ussd dialog
function ussd_getDialogStatus(haveDialogFun, noDialogFun) {
    getAjaxData('api/ussd/status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (ret.response.result == USSD_HAVE_USSD_DIALOG) {
                if (false == g_ussd_dialogstatus_finished) {
                    $('.button_wrapper input').removeClass('disable_btn');
                    $('.button_wrapper input').addClass('disable_btn');
                }
                if (typeof(haveDialogFun) == 'function') {
                    haveDialogFun();
                }

            } else {
                if (true == g_ussd_dialogstatus_finished) {
                    if(g_moduleswitch.vsim_enabled == 1 && vsim_status != 2) {
                        $('.button_wrapper input').removeClass('disable_btn');
                        $('.button_wrapper input').addClass('disable_btn');
                    } else {
                        $('.button_wrapper input').removeClass('disable_btn');
                        $('.button_wrapper input').addClass('button_dialog');
                    }
                }
                if (typeof(noDialogFun) == 'function') {
                    noDialogFun();
                }
            }
        }
    });
}

//release USSD dialog   (api/ussd/release)
function ussd_releaseUssdDialog() {
    getAjaxData('api/ussd/release', function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            g_ussd_currentFun = null;
            if(g_moduleswitch.vsim_enabled == 1 && vsim_status != 2) {
                $('.button_wrapper input').removeClass('disable_btn');
                $('.button_wrapper input').addClass('disable_btn');
            } else {
                $('.button_wrapper input').removeClass('disable_btn');
                $('.button_wrapper input').addClass('button_dialog');
            }
        } else {
            //showInfoDialog(common_failed);
            log.debug('USSD:<release> not return response');
        }
    }, {
        //sync:true,
        errorCB: function() {
            log.debug('USSD:<release> file is not find');
        }
    });
}

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
        if (vsim_status != 2) {
            $('.button_wrapper input').removeClass('button_dialog');
            $('.button_wrapper input').addClass('disable_btn');
            $('input:not(#lang)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
        }
    }
}
$(document).ready(function() {
    isCGIWorks = getGeneralCGICommandList(true);

	if(g_moduleswitch.vsim_enabled == 1) {
		initVsim();
	}
    ussd_initPreClick();
    ussd_initPostClick();

    ussd_initShow();

    ussd_releaseUssdDialog();
    g_ussd_status_timer = setInterval(function() {
        ussd_getDialogStatus();
    },g_feature.update_interval);
    startLogoutTimer();
    if(g_moduleswitch.vsim_enabled == 1) {
        if (vsim_status != 2) {
            showInfoDialog(IDS_vsim_function_show);
        }
    }
});
function creatUssdContent() {
    if(webui_mode == 'new' && force_old_ussd) {
        $('#new_smsmenu_list').detach();
        $('#new_ussd_command').detach();
        $('#new_ussd_receive').detach();
    } else {
        if(webui_mode == 'old' && force_new_ussd) {
            $('.content').empty();
            $('.content').append($('#new_smsmenu_list').detach().attr('style', 'margin-left: 28px !important;').show());
            $('.content').append($('#new_ussd_command').detach().show());
            $('.content').append($('#new_ussd_receive').detach().show());
        } else {
            $('#new_body').append($('#new_smsmenu_list').detach().show());
            $('#new_body').append($('#new_ussd_command').detach().show());
            $('#new_body').append($('#new_ussd_receive').detach().show());
        }
    }

    if(webui_mode == 'new' && !force_old_ussd || webui_mode == 'old' && force_new_ussd) {
        clearAllErrorLabel();
        ussd_show_General(g_ussd_preconfig.General);
    }
}
var new_unread_sms = "New";//中文 未读
var new_read_sms = "Read";

if ( LANGUAGE_DATA.current_language =="ru_ru"){ 
    var new_ussd_command_title = "Введите команду*";
    var new_ussd_select_tip = "*Ввод можно осуществить с помощью клавиатуры";
    var new_ussd_sent_balance = "узнать баланс";
    var new_ussd_sent_linit = "узнать остаток";
    var new_ussd_sent_num = "узнать свой номер";    
    var new_ussd_receive_title = " Полезные команды";
	var new_ussd_error_input = "Внимание! Неверный USSD-код. Проверьте его и повторите попытку.";
}else{
    var new_ussd_command_title = "Enter the command";
    var new_ussd_select_tip = "* Keyboard can be used ";
    var new_ussd_sent_balance = "check the balance";
    var new_ussd_sent_linit = "check available limit";
    var new_ussd_sent_num = "show my number";
    var new_ussd_receive_title = "Useful commands";
	var new_ussd_error_input = "Warning USSD code is incorrect. Please check the code and try again.";
}
function setUssdText() {
    $('#new_all_sms a').text(sms_lable_sms);
    $('#new_ussd a').text(ussd_label_ussd);

    $('#new_unread_sms a').text(new_unread_sms);
    $('#new_read_sms a').text(new_read_sms);
    $('#new_received_sms a').text(IDS_msg_receive);
    $('#new_sent_sms a').text(msg_sent);

    $('#new_ussd_command_title').text(new_ussd_command_title);
    $('#new_ussd_select_tip').text(new_ussd_select_tip);
    $('#new_ussd_sent').attr('value', common_sent);
    $('#new_ussd_command_reply > span:first').text(common_reply);

    $('#new_ussd_receive_title').text(new_ussd_receive_title);
}

function addUssdEvent() {
    $('#new_ussd_command_select span').live('click', function () {
        var command = $('#general_command_select').sVal();
        command = command ? command : '';
        var userPush = $(this).attr('value');
        $('#general_command_select').sVal(command + userPush);
    });

    $('#new_ussd_sent').live('click', function () {
        var command = $('#general_command_select').sVal();
        command = command ? command : '';
        var ussd_error_first = command.substring(0,1);
        var ussd_error_last = command.substring(command.length,command.lastIndexOf('#'));
        var ussd_error_center = command.substring(1,(command.length-1));
        if (/^(\*|\#|[0-9])+$/.test(command)) {
          if( (command.length > 2 && (ussd_error_first == '*') && (ussd_error_last == '#') ) || (command.length == 1 &&  (ussd_error_first != '*' && ussd_error_last != '#') ) )  {
                 ussd_sendCommand('General','undefined','CodeType', 'undefined');
            }else{
                 showInfoDialog(new_ussd_error_input);
            }
        } else {
            showInfoDialog(new_ussd_error_input);
            // $('#general_command_select').sVal('');
        }

    });

    $('#new_ussd_receive_content > div').live('click', function () {
        $('#general_command_select').sVal($(this).attr('data'));
    });
}


$(document).ready(function () {
    if(webui_mode == 'new' && !force_old_ussd) {
        $('#wrapper').css('display', 'none');
    }

    creatUssdContent();
    if(webui_mode == 'new' && !force_old_ussd || webui_mode == 'old' && force_new_ussd) {
        setUssdText();
        addUssdEvent();
    }
});

var isCGIWorks = false; 

if(typeof(localStorage.ussd_generalCommandList) == 'undefined') {
	localStorage.ussd_generalCommandList = JSON.stringify([]);
}
if(typeof(localStorage.ussd_generalRemovedDefaultCommandList) == 'undefined') {
	localStorage.ussd_generalRemovedDefaultCommandList = JSON.stringify([]);
}

if(LANGUAGE_DATA.current_language == 'ru_ru') {
	var ussd_label_command = 'Команда';
	var ussd_label_remove = 'Удалить';
	var ussd_label_click_to_remove = 'Щелкните для удаления';
	var ussd_label_add_command = 'Добавить USSD-команду';
	var ussd_label_remove_command = 'Удалить USSD-команду';
	var ussd_label_save_to_modem = 'Сохранить в модем (иначе в браузер)';
	var ussd_label_remove_default_commands_from_modem = 'Удалять предустановленные команды из модема (иначе из браузера)';
} else {
	var ussd_label_command = 'Command';
	var ussd_label_remove = 'Remove';
	var ussd_label_click_to_remove = 'Click to remove';
	var ussd_label_add_command = 'Add USSD command';
	var ussd_label_remove_command = 'Remove USSD command';
	var ussd_label_save_to_modem = 'Save to modem (differently to browser)';
	var ussd_label_remove_default_commands_from_modem = 'Remove default commands from modem (differently from browser)';
}

function addGeneralCommand(Name, Command) {
	var ussdArray = JSON.parse(localStorage.ussd_generalCommandList);
	ussdArray.push({'Name': Name, 'Command': Command});
	localStorage.ussd_generalCommandList = JSON.stringify(ussdArray);
	insertGeneralCommandList();
}

function addGeneralCGICommand(Name, Command) {
	var general_cgi_command_list = getGeneralCGICommandList();
	var ussdArray = general_cgi_command_list.add_cmd_list;
	ussdArray.push({'Name': Name, 'Command': Command});
	saveGeneralCGICommandList(general_cgi_command_list);
	insertGeneralCommandList();
}

function addGeneralCommandDialog() {
	call_dialog(ussd_label_add_command, '<table width="570" border="0" cellpadding="0" cellspacing="0"><tr><td height="32">' + common_name + common_colon + '</td><td><input class="input_style" id="input_new_ussd_name" size="20"/></td></tr><tr><td height="32">' + ussd_label_command + common_colon + '</td><td><input class="input_style" id="input_new_ussd_command" size="20"/></td></tr><tr id="tr_new_ussd_cgi" style="display:none;"><td height="32" colspan="2"><input id="input_new_ussd_cgi" type="checkbox"> ' + ussd_label_save_to_modem + '</td></tr></table>', common_add, 'pop_Add', common_close, 'pop_Close');
	if (isCGIWorks)
		$('#tr_new_ussd_cgi').show();
	else
		$('#tr_new_ussd_cgi').hide();
	$('#pop_Add').click(function() {
		if($('#input_new_ussd_cgi').prop('checked')) {
			addGeneralCGICommand($('#input_new_ussd_name').val(), $('#input_new_ussd_command').val());
		} else {
			addGeneralCommand($('#input_new_ussd_name').val(), $('#input_new_ussd_command').val());
		}
		$('#input_new_ussd_name').val('');
		$('#input_new_ussd_command').val('');

	});
	$('#pop_Close').click(clearDialog);
}

function removeGeneralCommand(n) {
	var ussdArray = JSON.parse(localStorage.ussd_generalCommandList);
	ussdArray.splice(n, 1);
	localStorage.ussd_generalCommandList = JSON.stringify(ussdArray);
	$('#remove_ussd_list').html(removeGeneralCommandList(true));
	insertGeneralCommandList();
}

function removeGeneralCGICommand(n) {
	var general_cgi_command_list = getGeneralCGICommandList();
	var ussdArray = general_cgi_command_list.add_cmd_list;
	ussdArray.splice(n, 1);
	saveGeneralCGICommandList(general_cgi_command_list);
	$('#remove_ussd_list').html(removeGeneralCommandList(true));
	insertGeneralCommandList();
}

function removeGeneralDefaultCommand(n, cgi) {
	if(cgi === true) {
		var general_cgi_command_list = getGeneralCGICommandList();
		var removedUSSDArray = general_cgi_command_list.rem_def_cmd_list; 
	} else {
		var removedUSSDArray = JSON.parse(localStorage.ussd_generalRemovedDefaultCommandList);
	}
	removedUSSDArray.push(n);
	if(cgi === true) {
		saveGeneralCGICommandList(general_cgi_command_list);
	} else {
		localStorage.ussd_generalRemovedDefaultCommandList = JSON.stringify(removedUSSDArray);
	}
	$('#remove_ussd_list').html(removeGeneralCommandList(true));
	insertGeneralCommandList();
}

function removeGeneralCommandDialog() {
	call_dialog(ussd_label_remove_command, '<p><b>' + ussd_label_click_to_remove + common_colon + '</b></p>' + removeGeneralCommandList() + '<br><div id="div_remove_default_ussd_cgi" style="display:none;"><input id="input_remove_default_ussd_cgi" type="checkbox"> ' + ussd_label_remove_default_commands_from_modem + '</div>', common_close, 'pop_Close');
	removeGeneralCommandDialogCGIFlagCheck();
	$('#pop_Close').click(clearDialog);
}

function removeGeneralCommandList(update) {
	var ussdList = '<ul id="remove_ussd_list">';
	$.each(getGeneralCommandList(JSON.parse(JSON.stringify(g_ussd_preconfig.General))), function(n, subValue) {
        	if(subValue.Type == 'default') {
			ussdList += '<li><a href="javascript:removeGeneralDefaultCommand(' + subValue.n + ', $(\'#input_remove_default_ussd_cgi\').prop(\'checked\'));void(0);">' + subValue.Name + '</a>';
		} else if(subValue.Type == 'cgi') {
			ussdList += '<li><a href="javascript:removeGeneralCGICommand(' + subValue.n + ');void(0);">' + subValue.Name + '</a>';
		} else if(subValue.Type == 'localStorage') {
			ussdList += '<li><a href="javascript:removeGeneralCommand(' + subValue.n + ');void(0);">' + subValue.Name + '</a>';
		}
	});
	ussdList += '</ul>';
	if(update === true) 
		removeGeneralCommandDialogCGIFlagCheck();
	return ussdList;
}

function removeGeneralCommandDialogCGIFlagCheck() {
	var general_cgi_command_list = getGeneralCGICommandList();
	if (isCGIWorks)
		$('#div_remove_default_ussd_cgi').show();
	else
		$('#div_remove_default_ussd_cgi').hide();
	if (general_cgi_command_list.rem_def_cmd_list.length != 0)
		$('#input_remove_default_ussd_cgi').attr('checked', true);

	if (general_cgi_command_list.rem_def_cmd_list.length != 0 || JSON.parse(localStorage.ussd_generalRemovedDefaultCommandList).length != 0)
		$('#input_remove_default_ussd_cgi').attr('disabled', true);
}

function getGeneralCommandList(value) {
	var config_list = [];
	var general_cgi_command_list = getGeneralCGICommandList();
	if(LANGUAGE_DATA.current_language == 'ru_ru' && value.RussianMenu) {
		if(webui_mode == 'old' && !force_new_ussd || webui_mode == 'new' && force_old_ussd || !value.RussianNewMenu) {
			makeGeneralDefaultCommandList(value.RussianMenu, config_list, general_cgi_command_list);
		} else {
			makeGeneralDefaultCommandList(value.RussianNewMenu, config_list, general_cgi_command_list);
		}
	} else {
		if(webui_mode == 'old' && !force_new_ussd || webui_mode == 'new' && force_old_ussd || !value.NewMenu) {
			makeGeneralDefaultCommandList(value.Menu, config_list, general_cgi_command_list);
		} else {
			makeGeneralDefaultCommandList(value.NewMenu, config_list, general_cgi_command_list);
		}
	}
	$.each(general_cgi_command_list.add_cmd_list, function(n, subValue) {
		config_list.push(formatGeneralCommandList(subValue, 'cgi', n));
	});
	$.each(JSON.parse(localStorage.ussd_generalCommandList), function(n, subValue) {
		config_list.push(formatGeneralCommandList(subValue, 'localStorage', n));
	});
	return config_list;
}

function getGeneralCGICommandList(test) {
	var USSD_command;
	if(test === true) {
		USSD_command = false;
		$.ajax({
			type: "GET",
			url: "/ussd_cmd_list.json",
			success: function(data, textStatus, jqXHR) {
				if (typeof(data.config) != 'undefined')
					USSD_command = true;
			},
			dataType: "json",
			async: false
		});
	} else {
		USSD_command = {add_cmd_list: [], rem_def_cmd_list: []};
		$.ajax({
			type: "GET",
			url: "/ussd_cmd_list.data.json",
			success: function(data, textStatus, jqXHR) {
				if (typeof(data.config) != 'undefined')
					USSD_command = data.config;
			},
			dataType: "json",
			async: false
		});
	}
	return USSD_command;
}

function saveGeneralCGICommandList(USSD_command) {
	$.ajax({
		type: "POST",
		url: "http://" + location.hostname + ":5080/cgi-bin/ussd.cgi?cmd=save_list",
		data: JSON.stringify({'config': USSD_command}),
		processData: false,
		dataType: "json",
		async: false
	});
}

function makeGeneralDefaultCommandList(valueMenu, config_list, general_cgi_command_list) {
	if(general_cgi_command_list.rem_def_cmd_list.length != 0) {
		$.each(general_cgi_command_list.rem_def_cmd_list, function(n, subValue) {
			valueMenu.MenuItem.splice(subValue, 1);
		});
	} else {
		$.each(JSON.parse(localStorage.ussd_generalRemovedDefaultCommandList), function(n, subValue) {
			valueMenu.MenuItem.splice(subValue, 1);
		});
	}
	if (valueMenu) {
		if (valueMenu.MenuItem) {
			if ($.isArray(valueMenu.MenuItem)) {
				$.each(valueMenu.MenuItem, function(n, subValue) {
					config_list.push(formatGeneralCommandList(subValue, 'default', n));
				});
			} else {
				config_list.push(formatGeneralCommandList(valueMenu.MenuItem, 'default', n));
			}
		}
	}
}

function formatGeneralCommandList(subValue, Type, n) {
	subValue.Command = $.trim(subValue.Command);//.substring(0,40);
	subValue.Name = $.trim(subValue.Name);
	if (subValue.Name.length == 0) {
		if(subValue.Command.length == 0) {
			subValue.Name = null;
		} else {
			subValue.Name = subValue.Command;
		}
	} else {
		if(subValue.Command.length != 0) {
			if(webui_mode == 'new' && !force_old_ussd || webui_mode == 'old' && force_new_ussd) {
				subValue.Name = subValue.Command + ' - ' + subValue.Name;
			} else {
				if(webui_mode == 'old' && !force_new_ussd || webui_mode == 'new' && force_old_ussd) {
					subValue.Name = subValue.Name + ' (' + subValue.Command + ')';
				}
			}
		}
	}
	subValue.Type = Type;
	subValue.n = n;
	return subValue;
}

function insertGeneralCommandList() {
	g_ussd_generalCommandList.length = 0;
	$.each(getGeneralCommandList(JSON.parse(JSON.stringify(g_ussd_preconfig.General))), function(n, subValue) {
		g_ussd_generalCommandList.push([subValue.Command, subValue.Name]);
	});
	g_ussd_generalCommandList.push([addGeneralCommandDialog, common_add]);
	g_ussd_generalCommandList.push([removeGeneralCommandDialog, ussd_label_remove]);
	$('#general_command_select').createSelect({
		maxlength: 40,
		direction_up: true,
		onlyread: false,
	maxheight: 240
	});
	if(webui_mode == 'old' && !force_new_ussd || webui_mode == 'new' && force_old_ussd) {
		$('#general_command_select').createOptions(g_ussd_generalCommandList);
	}
	$('#new_ussd_receive_content').empty();
	$.each(g_ussd_generalCommandList, function(n, subValue) {
		if(typeof(subValue[0]) != 'function') {
			$('#new_ussd_receive_content').append('<div data="' + subValue[0] + '">' + subValue[1] + '</div>');
		} else {
			$('#new_ussd_receive_content').append('<div id="new_ussd_receive_content_' + n + '">' + subValue[1] + '</div>')
			$('#new_ussd_receive_content_' + n).click(subValue[0]);
		}
	});
}
