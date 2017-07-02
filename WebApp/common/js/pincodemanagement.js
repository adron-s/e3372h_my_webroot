

// JavaScript Document
/**************Pin Code Management Page Function***************/
var g_pinCofig = null;
var g_pinValidate = 0;
var vsim_status=0;

function isOptionEnable(option_id) {
    var flag = false;
    $('#' + option_id).parent('li').hasClass('disable_item') ? flag = false : flag = true;
    return flag;
}

function dispalyModify(){
    var button_id = '';
            clearAllErrorLabel();
            $('#pin_code').val('');
            $('#pin_code').focus();
            if (!isOptionEnable('pin_modify'))
            {
               $('#list_menu').slideUp(100);
               return false;
            }
            var modify_info = "<tr id='modify_new'><td>" + dialup_label_new_pin + common_colon + '</td>';
            modify_info += "<td><input type='password' autocomplete='off' id='newPin' name='newPin' maxlength='8' class='input_style' value=''/></td></tr>";
            modify_info += "<tr id='modify_confirm'><td>" + dialup_label_confirm_pin + common_colon + '</td>';
            modify_info += "<td><input type='password' autocomplete='off' id='confirmPin' maxlength='8' name='confirmPin' class='input_style' value=''/></td></tr>";
            $('tr').remove('#modify_new');
            $('tr').remove('#modify_confirm');
            $('tr:odd').after(modify_info);
            modify_info = '';
            $('.button_wrapper input').attr('id', 'modify_apply');
            button_id = $('.button_wrapper input').attr('id');
            button_enable(button_id, '0');
            $('input').live('keyup change input paste cut keydown', function() {
                if ('undefined' != typeof($('#pin_code').val()) && ($('#pin_code').val()).length >= 4 &&
                    'undefined' != typeof($('#newPin').val()) && ($('#newPin').val()).length >= 4 &&
                    'undefined' != typeof($('#confirmPin').val()) && ($('#confirmPin').val()).length >= 4)
                {
                    button_enable(button_id, '1');
                }
                else
                {
                    button_enable(button_id, '0');
                }
            });
}
function pcm_exchange_modifyOrDisable() {
    var button_id = '';
    $('#pin_code_select').change(function() {
        if ($('#pin_code_select').val() == common_modify)
        {		
            dispalyModify();
        }

        if ($('#pin_code_select').val() == common_disable)
        {
            clearAllErrorLabel();
            $('#pin_code').val('');
            $('#pin_code').focus();
            if (!isOptionEnable('pin_disable'))
            {
                $('#list_menu').slideUp(100);
                return false;
            }
            $('tr').remove('#modify_new');
            $('tr').remove('#modify_confirm');
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');
            button_id = $('.button_wrapper input').attr('id');
            button_enable(button_id, '0');
            $('input').live('keyup change input paste cut keydown', function() {
                if (($(this).val()).length >= 4)
                {
                     button_enable(button_id, '1');
                }
                else
                {
                    button_enable(button_id, '0');
                }
            });
        }

        if ($('#pin_code_select').val() == common_enable)
        {
            if (!isOptionEnable('pin_enable'))
            {
                $('#list_menu').slideUp(100);
                return false;
            }
            $('tr').remove('#modify_new');
            $('tr').remove('#modify_confirm');
            $('#pin_code').focus();
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');
            button_id = $('.button_wrapper input').attr('id');
            $('input').live('change input paste cut keydown', function() {
                button_enable(button_id, '1');
            });
        }

        if ($('#pin_code_select').val() == dialup_label_validate)
        {
            if (!isOptionEnable('pin_enable'))
            {
                $('#list_menu').slideUp(100);
                return false;
            }
            $('tr').remove('#modify_new');
            $('tr').remove('#modify_confirm');
            $('#pin_code').focus();
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');
            button_id = $('.button_wrapper input').attr('id');
            $('input').live('change input paste cut keydown', function() {
                button_enable(button_id, '1');
            });
        }
    });
}

function pcm_getPinStatus(touchElement, _select) {

    var button_id = $('.button_wrapper input').attr('id');
    button_enable(button_id, '0');
    $('input').bind('keyup change input paste cut keydown', function() {
        if (($(this).val()).length >= 4)
        {
            button_enable(button_id, '1');
        }
        else
        {
            button_enable(button_id, '0');
        }
    });

    // pin_status data is get from redirect.js
    if (pin_status.SimState == MACRO_NO_SIM_CARD)
    {
        gotoPageWithoutHistory('nocard.html');
    }
    else
    {
        //Get deferent select items from defrence PinOptStates
        var option_items;
        $('.' + _select).html('');
        if ((pin_status.PinOptState == MACRO_PIN_DISABLE) && (pin_status.SimState == MACRO_PIN_READY))
        {
            if (g_pinCofig.config.pin_enable == '1')
            {
                option_items += "<option value='"+ common_enable +"'><a id='pin_enable' href='javascript:void();'>" + common_enable + '</a></option>';
            }
            $('.' + _select).append(option_items);
            setTimeout(function() {
                    $('#pin_code_select').val(common_enable);
                }, 1);
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');

        }
        if (pin_status.PinOptState == MACRO_PIN_VALIDATE)
        {
            if (g_pinCofig.config.pin_disable == '1')
            {
                option_items += "<option value='"+ common_disable +"'><a id='pin_disable' href='javascript:void();'>" + common_disable + '</a></option>';
            }
            if (g_pinCofig.config.pin_modify == '1')
            {
                option_items += "<option value='"+ common_modify +"'><a id='pin_modify' href='javascript:void();'>" + common_modify + '</a></option>';
            }
            $('.' + _select).append(option_items);
            setTimeout(function() {
                    $('#pin_code_select').val(common_disable);
                }, 1);
			if((g_pinCofig.config.pin_disable == '0') && (g_pinCofig.config.pin_modify == '1'))
			{
			    dispalyModify();
				setTimeout(function() {
                    $('#pin_code_select').val(common_modify);
                }, 1);
			}			
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');
        }
        if (pin_status.PinOptState == MACRO_CPIN_FAIL)
        {
            if (g_pinValidate == '1')
            {
                option_items = "<option value='"+ dialup_label_validate +"'><a id='pin_validate' href='javascript:void();'>" + dialup_label_validate + '</a></option>';
            }
            $('.' + _select).append(option_items);
            setTimeout(function() {
                    $('#pin_code_select').val(dialup_label_validate);
                }, 1);
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');
        }
        if (pin_status.SimState == MACRO_PIN_REQUIRED)
        {
            if (g_pinValidate == '1')
            {
                option_items = "<option value='"+ dialup_label_validate +"'><a href='javascript:void();'>" + dialup_label_validate + '</a></option>';
            }
            $('.' + _select).append(option_items);
            setTimeout(function() {
                    $('#pin_code_select').val(dialup_label_validate);
                }, 1);
            $('.button_wrapper input').attr('id', 'pinmanagerment_apply');
        }

        //Load function for exchange modify or disable states
        pcm_exchange_modifyOrDisable();
    }
}

function getPinEnable() {
    getConfigData('config/pincode/config.xml', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config')
        {
            g_pinCofig = ret;
            pcm_getPinStatus('pin_code_select', 'input_select');
        }
    });
}

function pcm_checkPukRequired() {
    getAjaxData('api/pin/status', function($xml) {
        var pinstatus_ret = xml2object($xml);
        if (pinstatus_ret.type == 'response')
        {
            pin_status.SimState = pinstatus_ret.response.SimState;
            pin_status.PinOptState = pinstatus_ret.response.PinOptState;
            pin_status.SimPinTimes = pinstatus_ret.response.SimPinTimes;
            pin_status.SimPukTimes = pinstatus_ret.response.SimPukTimes;

            //Load remaining times
            $('.remainingtime').html(pin_status.SimPinTimes);

            if (MACRO_PUK_REQUIRED == pinstatus_ret.response.SimState)
            {
                log.debug('REDIRECT : SimState == MACRO_PUK_REQUIRED, redirect to pukrequired.html');
                gotoPageWithoutHistory('pukrequired.html');

            }
        }
        getPinEnable();
        //pcm_getPinStatus("pin_code_select", "input_select");
    });
}

function pcm_validateOriPin() {
    //Original pin code
    var button_id = $('.button_wrapper input').attr('id');
    var pin_val = $('#pin_code').val();
    var patrn = /^[0-9]{4,8}$/;
    if (pin_val == '' || pin_val == ' ' || pin_val == null)
    {
        showErrorUnderTextbox('pin_code', dialup_hint_pin_code_valid_type, 'ori_pin_wrong');
        $('#pin_code').val('');
        $('#pin_code').focus();
        button_enable(button_id, '0');
        return false;
    }
    else if (!patrn.exec(pin_val))
    {
        showErrorUnderTextbox('pin_code', dialup_hint_pin_code_valid_type, 'ori_pin_wrong');
        $('#pin_code').val('');
        $('#pin_code').focus();
        button_enable(button_id, '0');
        return false;
    }
    else
    {
        button_enable(button_id, '1');
        return true;
    }
}

function pcm_validateNewPin() {
    var button_id = $('.button_wrapper input').attr('id');
    var new_pin = $('#newPin');
    var pin_val = new_pin.val();
    var patrn = /^[0-9]{4,8}$/;
    if (pin_val == '' || pin_val == ' ' || pin_val == null)
    {
        showErrorUnderTextbox('newPin', dialup_hint_pin_code_valid_type, 'new_pin_wrong');
        new_pin.val('');
        new_pin.focus();
        button_enable(button_id, '0');
        return false;
    }
    else if (!patrn.exec(pin_val))
    {
        showErrorUnderTextbox('newPin', dialup_hint_pin_code_valid_type, 'new_pin_wrong');
        new_pin.val('');
        new_pin.focus();
        button_enable(button_id, '0');
        return false;
    }
    else
    {
        button_enable(button_id, '1');
        return true;
    }
}

function pcm_validateConfirmPin() {
    var button_id = $('.button_wrapper input').attr('id');
    var confirmPin = $('#confirmPin');
    var newPin = $('#newPin');
    var pin_val = confirmPin.val();
    var patrn = /^[0-9]{4,8}$/;
    if (pin_val == '' || pin_val == ' ' || pin_val == null)
    {
        showErrorUnderTextbox('confirmPin', dialup_hint_pin_code_valid_type, 'confirm_pin_wrong');
        confirmPin.val('');
        confirmPin.focus();
        button_enable(button_id, '0');
        return false;
    }
    else if (!patrn.exec(pin_val))
    {
        showErrorUnderTextbox('confirmPin', dialup_hint_pin_code_valid_type, 'confirm_pin_wrong');
        confirmPin.val('');
        confirmPin.focus();
        button_enable(button_id, '0');
        return false;
    }
    else if (pin_val != $('#newPin').val())
    {
        showErrorUnderTextbox('confirmPin', dialup_hint_confirm_and_new_same, 'confirm_pin_wrong');
        newPin.val('');
        confirmPin.val('');
        newPin.focus();
        button_enable(button_id, '0');
        return false;
    }
    else
    {
        button_enable(button_id, '1');
        return true;
    }
}

function pcm_opreatFailed() {
    getAjaxData('api/pin/status', function($xml) {
        var pinstatus_ret = xml2object($xml);
        if (pinstatus_ret.type == 'response')
        {
            pin_status.SimState = pinstatus_ret.response.SimState;
            pin_status.PinOptState = pinstatus_ret.response.PinOptState;
            pin_status.SimPinTimes = pinstatus_ret.response.SimPinTimes;
            pin_status.SimPukTimes = pinstatus_ret.response.SimPukTimes;

            if (MACRO_PUK_REQUIRED == pinstatus_ret.response.SimState)
            {
                log.debug('REDIRECT : SimState == MACRO_PUK_REQUIRED, redirect to pukrequired.html');
                gotoPageWithoutHistory('pukrequired.html');

            }
            else
            {
                $('#pin_code').val('');
                $('#newPin').val('');
                $('#confirmPin').val('');
                $('.remainingtime').html(pin_status.SimPinTimes);
                $('#pin_code').blur();
                flag_focus = true;
                setTimeout(function() {$('#pin_code').focus();}, 2500);
            }
        }
    });
}

function pcm_postOperate() {
    $.each($('input'), function() {
        $(this).blur();
    });
    var newPin = '';
    var currentPin = '';
    var operateType = '';


    if ($('#pin_code').val() != '' && $('#pin_code').val() != ' ' && $('#pin_code').val() != null)
    {
        currentPin = $('#pin_code').val();
    }
    if ($('#newPin').val() != '' && $('#newPin').val() != ' ' && $('#newPin').val() != null)
    {
        newPin = $('#newPin').val();
    }

    switch ($('#pin_code_select').val())
    {
        case common_modify:
            operateType = '3';
            break;
        case common_disable:
            operateType = '2';
            break;
        case common_enable:
            operateType = '1';
            break;
        case dialup_label_validate:
            operateType = '0';
            break;
        default:
            operateType = '4';
            break;
    }

        var request = {
        OperateType: operateType,
        CurrentPin: currentPin,
        NewPin: newPin,
        PukCode: ''
    };
        $('#pin_code').val('');
        $('#newPin').val('');
        $('#confirmPin').val('');
    var requestStr = object2xml('request', request);
    saveAjaxData('api/pin/operate', requestStr, function($xml) {
        var return_ret = xml2object($xml);
        if (isAjaxReturnOK(return_ret))
        {
            showInfoDialog(common_success);
            setTimeout(function() {
                refresh();
                return false;
                }, 1500);
        }
        else
        {
            // pin code validate failed
            showInfoDialog(pin_code_validate_failed);
            pcm_opreatFailed();
            $('#pin_code').focus();
            enableTabKey();
        }
    },{
    	enc:true
    });
    button_enable('pinmanagerment_apply', '0');
    button_enable('modify_apply', '0');
}

function pcm_initPage()
{
    pcm_checkPukRequired();
    $('#pin_code').focus();
    $('#modify_apply').live('click', function() {
        if (isButtonEnable('modify_apply'))
        {
            clearAllErrorLabel();
            var oriPinValidate = false;
            var newPinValidate = false;
            var confirmPinValidate = false;

            oriPinValidate = pcm_validateOriPin();

            if (oriPinValidate)
            {
                newPinValidate = pcm_validateNewPin();
            }

            if (newPinValidate)
            {
                confirmPinValidate = pcm_validateConfirmPin();
            }

            if (oriPinValidate && newPinValidate && confirmPinValidate)
            {
                pcm_postOperate();
            }
            else
            {
                button_enable('modify_apply', '0');
            }
        }
    });

    $('#pinmanagerment_apply').live('click', function() {
        if (!isButtonEnable('pinmanagerment_apply'))
        {
            return;
        }
        clearAllErrorLabel();
        var oriPinValidate = pcm_validateOriPin();
        if (oriPinValidate)
        {
            pcm_postOperate();
        }
        else
        {
            button_enable('pinmanagerment_apply', '0');
        }
    });

     getMonitoringStatus();
}
function initNetMode(){
        getGMonitoringStatus();
        if((g_net_mode_type == MACRO_NET_DUAL_MODE && MACRO_SIM_STATUS_ROMSIM == G_MonitoringStatus.response.SimStatus && g_net_mode_status == MACRO_NET_MODE_C) || (g_net_mode_type == MACRO_NET_SINGLE_MODE && MACRO_SIM_STATUS_ROMSIM == G_MonitoringStatus.response.SimStatus)) {
            $('#pin_code_select').attr('disabled', 'disabled');
            $('#pin_code').attr('disabled', 'disabled');
            $('#newPin').attr('disabled', 'disabled');
            $('#confirmPin').attr('disabled', 'disabled');
            $('#pinmanagerment_apply').attr('disabled', 'disabled');
            if( "undefined"!=typeof($('#pin_code_disabled').val())&&''!=typeof($('#pin_code_disabled').val())){
             $("#pin_code_disabled").remove();
            }
              $(".maintitle").after("<div id='pin_code_disabled'></br><span>"+IDS_security_pin_code_management +"</span></div>");
        } else {
            $('#pin_code_select').removeAttr('disabled');
            $('#pin_code').removeAttr('disabled');
            $('#newPin').removeAttr('disabled');
            $('#confirmPin').removeAttr('disabled');
            $('#pinmanagerment_apply').removeAttr('disabled');
            $('#pin_code_disabled').remove();
            pcm_initPage();
        }
}
function checkSimStatus() {
    if (g_net_mode_change ==  MACRO_NET_MODE_CHANGE) {
        initNetMode();
        resetNetModeChange();
    }
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
redirectOnCondition(null, 'pincodemanagement');
$(document).ready(function() {
    pcm_initPage();
    initNetMode();
    addStatusListener('checkSimStatus ()');
    if(g_moduleswitch.vsim_enabled == 1) {
        initVsim();
        if (vsim_status != 2) {
            button_enable('pinmanagerment_apply', '0');
            $('input:not(#lang)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
            showInfoDialog(IDS_vsim_function_show);
        }

    }
});