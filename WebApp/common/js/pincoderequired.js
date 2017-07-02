var g_postfix = window.location.search;
var MACRO_PIN_OPERATE_VALIDATE = 0;
var MACRO_PIN_OPERATE_DISABLE = 2;
var PUK_REQUIRED_PAGE = 'pukrequired.html';
var g_simSavePinEnnable = 0;

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
    button_enable('pinrequired_button_apply', '0');
    button_enable('link_login', '1');
    getAjaxData('api/pin/status', function($xml) {
        var pincode_validate_ret = xml2object($xml);
        if (pincode_validate_ret.type == 'response') {
            if (MACRO_PUK_REQUIRED == pincode_validate_ret.response.SimState) {
                gotoPageWithoutHistory(PUK_REQUIRED_PAGE + window.location.search);
            } else if (MACRO_PIN_READY == pincode_validate_ret.response.SimState) {
                gotoPageWithoutHistory(HOME_PAGE_URL + window.location.search);
            } else if (MACRO_PIN_REQUIRED == pincode_validate_ret.response.SimState) {
                $('#pinrequired_input_pin').val('');
                $('#pinrequired_input_pin').focus();
                $('#label_SimPINTimes').text(pincode_validate_ret.response.SimPinTimes);
                readSimsavepinenable();
               
            } else {
                if (!redirectOnCondition()) {
                    gotoPageWithoutHistory(HOME_PAGE_URL + window.location.search);
                }
            }
        }
    }, {
        sync:true
    });
    flag_focus = true;
}

function readSimsavepinenable() {
    getAjaxData('api/pin/save-pin', function($xml) {
        var ret = xml2object($xml);
        if(ret.type == 'response') {
            g_simSavePinEnnable = ret.response.simsavepinenable;            
        }else {
            getAjaxData('api/device/basic_information', function($xml) {
                ret = xml2object($xml);
                if(ret.type == 'response') {
                    g_simSavePinEnnable = ret.response.sim_save_pin_enable;
                }
            },{
                sync:true
            });
        }
        if(g_simSavePinEnnable == 0 || g_simSavePinEnnable == 1 ) {
            $('#simsavepinenable').text(IDS_pincoderequired_pin_disable_pin);
        } else if(g_simSavePinEnnable == 2) {
            $('#simsavepinenable').text(dialup_hilink_label_save_pin_code);
        } else {
            $('#simsavepinenable').text(IDS_pincoderequired_pin_disable_pin);
        }
    });
}

function pinValidateInput() {
    $('#pinrequired_error').html('');
    var pincode = $('#pinrequired_input_pin').val();
    var patrn = /^[0-9]{4,8}$/;
    if ('' == pincode) {
        $('#pinrequired_error').html(dialup_hint_pin_code_valid_type).attr('class', 'error_message');
        $('#pinrequired_input_pin').focus();
        $('#pinrequired_input_pin').val('');
        button_enable('pinrequired_button_apply', '0');
        return false;
    } else if (!patrn.exec(pincode)) {
        //showErrorUnderTextbox("pinrequired_error", dialup_hint_pin_code_valid_type);
        $('#pinrequired_error').html(dialup_hint_pin_code_valid_type).attr('class', 'error_message');
        $('#pinrequired_input_pin').focus();
        $('#pinrequired_input_pin').val('');
        button_enable('pinrequired_button_apply', '0');
        return false;
    } else {
        return true;
    }
}

function pinreq_validate_savePin(validate_req, simSavepinStatus) {
    button_enable('pinrequired_button_apply', '0');
    button_enable('link_login', '0');
    var savepin_code_req = {
        SimSavepinStatus: simSavepinStatus,
        SimSavepinPIN: validate_req.CurrentPin,
        simsavepinenable: g_simSavePinEnnable
    };
    var validate_xml = object2xml('request', validate_req);
    saveAjaxData('api/pin/operate', validate_xml, function($xml) {
        var validate_ret = xml2object($xml);
        if (isAjaxReturnOK(validate_ret)) {
            log.debug('PINREQUIRED : pin validate success');

            var savepin_xml = object2xml('request', savepin_code_req);
            saveAjaxData('api/pin/save-pin', savepin_xml, function($xml) {
                log.debug('PINREQUIRED : save pin success');
            }, {
                sync:true,
            	enc:true
            });

            if (!redirectOnCondition()) {
                if (('.html' == g_postfix) || ('' == g_postfix)) {
                    gotoPageWithoutHistory(HOME_PAGE_URL);
                } else {
                    gotoPageWithoutHistory(g_postfix);
                }
                return false;
            }
        } else {
            closeWaitingDialog();
            showInfoDialog(common_failed);
            setTimeout( function() {
                initPage();
            }, 500);
        }
    }, {
        sync:true,
    	enc:true
    });

}

function onApply() {
    
    $.each($('input'), function() {
        $(this).blur();
        flag_focus = true;
    });
    if (pinValidateInput()) {
        var simSavepinStatus = $('#pinrequired_checkbox_savepin').get(0).checked ? 1 : 0;
        var simSavepinPIN = $('#pinrequired_input_pin').val();
        var validate_req = {
            OperateType: MACRO_PIN_OPERATE_VALIDATE,
            CurrentPin: simSavepinPIN,
            NewPin: '',
            PukCode: ''
        };
        $('#pinrequired_input_pin').val('');
       
        pinreq_validate_savePin(validate_req, simSavepinStatus);
    }
}



//check pin code has been validated or not
function checkPinCodeValidated() {
    button_enable('pinrequired_button_apply', '0');

    getAjaxData('api/pin/status', function($xml) {
        var pincode_validate_ret = xml2object($xml);
        if (pincode_validate_ret.type == 'response') {
            if (MACRO_PUK_REQUIRED == pincode_validate_ret.response.SimState) {
                gotoPageWithoutHistory(PUK_REQUIRED_PAGE + window.location.search);
            } else if (MACRO_PIN_READY == pincode_validate_ret.response.SimState) {
                showInfoDialog(pin_has_been_validated);
                setTimeout( function() {
                    if (('.html' == g_postfix) || ('' == g_postfix)) {
                        gotoPageWithoutHistory(HOME_PAGE_URL);
                    } else {
                        gotoPageWithoutHistory(g_postfix);
                    }
                    return false;
                }, 1500);
            } else {
                onApply();
            }
        } else {
            showInfoDialog(pin_code_validate_failed);
            setTimeout( function() {
                initPage();
                return false;
            }, 1500);
        }
    });
}
var userAgents = navigator.userAgent.toLowerCase();
$(document).ready( function() {

    $('#save_setting').html(IDS_pincoderequired_pin_disable_pin + common_colon);
    $('#pinrequired_input_pin').focus();

    $('#pinrequired_input_pin').bind('keyup change input paste cut keydown', function() {
        if (($(this).val()).length >= 4) {
            button_enable('pinrequired_button_apply', '1');
        } else {
            button_enable('pinrequired_button_apply', '0');
        }
    });
    $('#pinrequired_button_apply').click( function() {
        if (!isButtonEnable('pinrequired_button_apply')) {
            return;
        }
        
        if (getLoginStatus(checkPinCodeValidated, 'pincoderequired.html')) {
            checkPinCodeValidated();
        }

    });
    if (1 == g_feature.continue_button) {
        $('#link_login').show();
    } else {
        $('#link_login').hide();
    }
    initPage();
    getLoginStatus();
    if((userAgents.indexOf('trident') > 0) && ($.browser.version == '10.0' || $.browser.version == '11.0')) {
        $("#pop_login").attr('tabindex','3');
    }
    setLoginStatus('pincoderequired.html');
    $('#link_login').click( function() {
        window.location = HOME_PAGE_URL;
    });
	 $('#link_login').bind('click', function() {
        if (!isButtonEnable('pinrequired_button_apply')) {
            return;
        }
        
        if (getLoginStatus(checkPinCodeValidated, 'pincoderequired.html')) {
            checkPinCodeValidated();
        }

    });
});
