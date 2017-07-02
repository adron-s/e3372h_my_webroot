var g_postfix = window.location.search;
var MACRO_PUK_UNLOCK_OPERATE = 4;
var send_request = {
    OperateType: MACRO_PUK_UNLOCK_OPERATE,
    CurrentPin: '',
    NewPin: '',
    PukCode: ''
};
var g_pukcode_flag = false;
var g_newpin_flag = false;
var g_retypenewpin_flag = false;

function main_beforeready() {
    if (g_postfix != null) {
        var length = g_postfix.length;
        var start = g_postfix.indexOf('?');
        if(checkPageExist(g_PageUrlTree, g_postfix.substring(start + 1, length))) {
            g_postfix = g_postfix.substring(start + 1, length) + '.html';
        } else {
            g_postfix = '';
        }
    } else {
        g_postfix = '';
    }
    if (g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
        HOME_PAGE_URL = 'quicksetup.html';
    }
}

main_beforeready();

function initPage() {
    button_enable('pukrequired_apply', '0');
    getAjaxData('api/pin/status', function($xml) {
        var status_ret = xml2object($xml);
        if (status_ret.type == 'response') {
            if (MACRO_PUK_REQUIRED == status_ret.response.SimState) {
                $('#remain_times').text(status_ret.response.SimPukTimes);
                if (1 > parseInt(status_ret.response.SimPukTimes, 10)) {
                    $('#input_puk').attr('disabled', 'disabled');
                    $('#input_newpin').attr('disabled', 'disabled');
                    $('#input_confirmPin').attr('disabled', 'disabled');
                    $('#puk_blocked').show();
                    $('#puk_blocked').html(dialup_help_puk_locked);
                } else {
                    $('#input_puk').removeAttr('disabled');
                    $('#input_newpin').removeAttr('disabled');
                    $('#input_confirmPin').removeAttr('disabled');
                    $('#input_puk').val('');                          //clean input control
                    $('#input_newpin').val('');
                    $('#input_confirmPin').val('');
                    $('#input_puk').focus();                          //set the focus
                }
            } else {
                if (!redirectOnCondition()) {
                    gotoPageWithoutHistory(HOME_PAGE_URL + window.location.search);
                }
            }
        }
    }, {
        sync:true
    });
    enableTabKey();
}

function pukValidateInput() {
    $('#puk_error').html('');
    $('#newpin_error').html('');
    $('#confirmPin_error').html('');
    var pukcode = $('#input_puk').val();
    var newpin = $('#input_newpin').val();
    var retypepin = $('#input_confirmPin').val();
    var pukpatrn = /^[0-9]{8}$/;
    var pinpatrn = /^[0-9]{4,8}$/;
    if ('' == pukcode) {
        $('#puk_error').html(dialup_hint_puk_code_valid_type).attr('class', 'error_message');
        $('#input_puk').focus();
        $('#input_puk').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else if (!pukpatrn.exec(pukcode)) {
        $('#puk_error').html(dialup_hint_puk_code_valid_type).attr('class', 'error_message');
        $('#input_puk').focus();
        $('#input_puk').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else {
        log.debug('Exception');
    }

    if ('' == newpin) {
        $('#newpin_error').html(dialup_hint_pin_code_valid_type).attr('class', 'error_message');
        $('#input_newpin').focus();
        $('#input_newpin').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else if (!pinpatrn.exec(newpin)) {
        $('#newpin_error').html(dialup_hint_pin_code_valid_type).attr('class', 'error_message');
        $('#input_newpin').focus();
        $('#input_newpin').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else {
        log.debug('Exception');
    }

    if ('' == retypepin) {
        $('#confirmPin_error').html(dialup_hint_pin_code_valid_type).attr('class', 'error_message');
        $('#input_confirmPin').focus();
        $('#input_confirmPin').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else if (!pinpatrn.exec(retypepin)) {
        $('#confirmPin_error').html(dialup_hint_pin_code_valid_type).attr('class', 'error_message');
        $('#input_confirmPin').focus();
        $('#input_confirmPin').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else if (newpin != retypepin) {
        $('#confirmPin_error').html(dialup_hint_confirm_and_new_same).attr('class', 'error_message');
        $('#input_newpin').focus();
        $('#input_newpin').val('');
        $('#input_confirmPin').val('');
        button_enable('pukrequired_apply', '0');
        return false;
    } else {
        log.debug('Exception');
    }
    return true;
}

function onApply() {
    $.each($('input'), function() {
        $(this).blur();
    });

    if (pukValidateInput()) {
        var pukcode = $('#input_puk').val();
        var newpin = $('#input_newpin').val();
        var retypepin = $('#input_confirmPin').val();

        send_request.PukCode = pukcode;
        send_request.CurrentPin = newpin;
        send_request.NewPin = newpin;

        var unlockpuk_xml = object2xml('request', send_request);
        button_enable('pukrequired_apply', '0');
        $('#input_puk').val('');
        $('#input_newpin').val('');
        $('#input_confirmPin').val('');
        saveAjaxData('api/pin/operate', unlockpuk_xml, function($xml) {
            var return_ret = xml2object($xml);
            if (isAjaxReturnOK(return_ret)) {
                log.debug('PUKREQUIRED : puk validate success.');
                showInfoDialog(common_success);
                if (!redirectOnCondition()) {
                    setTimeout( function() {
                        if (('.html' == g_postfix) || ('' == g_postfix)) {
                            gotoPageWithoutHistory(HOME_PAGE_URL);
                        } else {
                            gotoPageWithoutHistory(g_postfix);
                        }
                        return false;
                    }, 1500);
                }

            } else {
                showInfoDialog(puk_code_validate_failed);
                setTimeout( function() {
                    initPage();
                    return false;
                }, 1500);
            }
        },{
        	enc:true
        });
    }
}

$(document).ready( function() {
    $('#input_puk').focus();

    $('input').bind('keyup change input paste cut keydown', function() {
        if (($('#input_puk').val()).length >= 4 && ($('#input_newpin').val()).length >= 4 && ($('#input_confirmPin').val()).length >= 4) {
            button_enable('pukrequired_apply', '1');
        } else {
            button_enable('pukrequired_apply', '0');
        }
    });
    
     $('#pukrequired_apply').bind('click', function() {
        if (!isButtonEnable('pukrequired_apply')) {
            return;
        }
        
        if (getLoginStatus(onApply, 'pukrequired.html')) {
            onApply();
        }

    });
    
    if (1 == g_feature.continue_button) {
        $('#link_login').show();
    } else {
        $('#link_login').hide();
    }

    initPage();
    getLoginStatus();
    setLoginStatus('pukrequired.html');
    $('#link_login').click( function() {
        window.location = HOME_PAGE_URL;
    });
});