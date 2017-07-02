var g_postfix = window.location.search;
var simPageVar = {
    SIMPin: ''
};

var SIM_STATUS_LOCKED = 1;
var SIM_LOCK_VERSION_5= '5';
var simlock_4_status = false;
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
    button_enable('simlock_button_apply', '0');

    getAjaxData('api/pin/simlock', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (SIM_STATUS_LOCKED == ret.response.SimLockEnable) {
                $('#label_SimlockTimes').text(ret.response.SimLockRemainTimes);
                if (parseInt(ret.response.SimLockRemainTimes, 10) < 1) {
                    $('#input_simunlock').attr('disabled', 'disabled');
                }else {
            $('#input_simunlock').removeAttr('disabled');
                    $('#input_simunlock').val('');
                    $('#input_simunlock').focus();
                }
                if ('undefined' != typeof(ret.response.SimLockVersion) && SIM_LOCK_VERSION_5 == ret.response.SimLockVersion) {
                    simlock_4_status = true;
                    $('#input_simunlock').attr('maxlength','16');
                } else {
                    simlock_4_status = false;
                    $('#input_simunlock').attr('maxlength','8');
                }
            }else {
                gotoPageWithoutHistory(HOME_PAGE_URL + window.location.search);
            }
        }
    }, {
            sync:true
	});
}

function simLockValidateInput() {
    var pin_val = $('#input_simunlock').val();
    var patrn_simlock_3 = /^[0-9]{8}$/;
    var patrn_simlock_4 = /^[A-Za-z0-9]{16}$/;
    var patrn = '';
    var prompt_str = '';
    if (simlock_4_status == true) {
        patrn = patrn_simlock_4;
        prompt_str = dialup_hint_simlock_code_valid_type_1;
    } else {
        patrn = patrn_simlock_3;
        prompt_str = dialup_hint_simlock_code_valid_type;
    }
    if (pin_val == '' || pin_val == ' ' || pin_val == null) {
        $('#simunlock_error').html(dialup_hint_password_empty).attr('class', 'error_message');
        $('#input_simunlock').focus();
        $('#input_simunlock').val('');
        button_enable('simlock_button_apply', '0');
        return false;
    }else if (!patrn.exec(pin_val)) {
        $('#simunlock_error').html(prompt_str).attr('class', 'error_message');
        $('#input_simunlock').focus();
        $('#input_simunlock').val('');
        button_enable('simlock_button_apply', '0');
        return false;
    }else {
        $('#simunlock_error').html('');
        return true;
    }
}

function onApply() {
    $.each($('input'), function() {
        $(this).blur();
    });
    if (!isButtonEnable('simlock_button_apply')) {
        return;
    }

    if (simLockValidateInput()) {
        var sim_pin = $('#input_simunlock').val();
        var request = {
            SimLockCode: sim_pin
        };
        var wps_xml = object2xml('request', request);

        button_enable('simlock_button_apply', '0');
        $('#input_simunlock').val('');
        saveAjaxData('api/pin/verify-simlock', wps_xml, function($xml) {
            var return_ret = xml2object($xml);
            if (isAjaxReturnOK(return_ret)) {
                log.debug('SIMLOCKREQUIRED : simlock validate success.');
                if (!redirectOnCondition()) {
                    if (('.html' == g_postfix) || ('' == g_postfix)) {
                        gotoPageWithoutHistory(HOME_PAGE_URL);
                    }else {
                        gotoPageWithoutHistory(g_postfix);
                    }
                }    
            }else {
                showInfoDialog(sim_lock_validate_failed);
                setTimeout(function() {
                    initPage();
                    return false;
                }, 1500);
            }
        },{
        	enc:true
        });
    }
}

$(document).ready(function() {
    $('#input_simunlock').focus();

    $('#input_simunlock').bind('keyup change input paste cut keydown', function() {
        if(simlock_4_status == true) {
            if (($(this).val()).length >= 16) {
                button_enable('simlock_button_apply', '1');
            } else {
                button_enable('simlock_button_apply', '0');
            }
        } else {
            if (($(this).val()).length >= 8) {
                button_enable('simlock_button_apply', '1');
            } else {
                button_enable('simlock_button_apply', '0');
            }
        }
    });
    
    $('#simlock_button_apply').bind('click', function() {
        if (!isButtonEnable('simlock_button_apply')) {
            return;
        }
        
        if (getLoginStatus(onApply, 'simlockrequired.html')) {
                onApply();
            }
        
    });
    
    if (1 == g_feature.continue_button) {
        $('#link_login').show();
    } else {
        $('#link_login').hide();
    }    
    $("#device_locked_title").hide();
    $("#device_locked_content").hide();
    $("#device_locked_but").hide();
    $("#unlock_device").show();
    $("#unlock_device_title").show();
    $("#unlock_device_content").show();
    $("#unlock_device_but").show();
    initPage();
    getLoginStatus();
    setLoginStatus('simlockrequired.html');
    $('#link_login').click( function() {
        window.location = HOME_PAGE_URL;
    });
        $('#link_logins').click( function() {
        window.location = HOME_PAGE_URL;
    });
});
