var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = [
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
var MODIFYPASSWORD_SHOW = 108008;
var hilink_login_eable = 1;
var hilink_login_diable = 0;
var hilink_login_status = 0;
var hilink_show_checkbox = 1;
var encryption_mode = 0;
var passWordStrength = 0;
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += '==';
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += '=';
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function vilidatePassword() {
    clearAllErrorLabel();
    var currenPassword = $('#current_password').val();
    var newPassword = $('#new_password').val();
    var confirmPassword = $('#confirm_password').val();
    if ('' == currenPassword) {
        showErrorUnderTextbox('current_password', system_hint_current_password_empty);
        setTimeout( function() {
            $('#current_password').focus();
        },10);
        return false;
    } else if ('' == newPassword) {
        showErrorUnderTextbox('new_password', system_hint_new_password_empty);
        setTimeout( function() {
            $('#new_password').focus();
        },10);
        return false;
    } else if ('' == confirmPassword) {
        showErrorUnderTextbox('confirm_password', system_hint_new_confirm_password_empty);
        setTimeout( function() {
            $('#confirm_password').focus();
        },10);
        return false;
    } else if (checkInputChar(currenPassword) == false) {
        showErrorUnderTextbox('current_password', system_hint_wrong_password);
        $('#current_password').val('');
        setTimeout( function() {
            $('#current_password').focus();
        },10);
        return false;
    } else if (checkInputChar(newPassword) == false) {
        showErrorUnderTextbox('new_password', dialup_hilink_hint_password_invalidate);
        setTimeout( function() {
            $('#new_password').focus();
        },10);
        return false;
    } else if (true == hasSpaceOrTabAtHead(newPassword)) {
        showErrorUnderTextbox('new_password', input_cannot_begin_with_space);
        setTimeout( function() {
            $('#new_password').focus();
        },10);
        return false;
    } else if (true == hasSpaceOrTabAtHead(confirmPassword)) {
        showErrorUnderTextbox('confirm_password', input_cannot_begin_with_space);
        setTimeout( function() {
            $('#confirm_password').focus();
        },10);
        return false;
    } else if (newPassword == currenPassword) {
        showErrorUnderTextbox('new_password', IDS_common_same_password_error);
        setTimeout( function() {
            $('#new_password').focus();
        },10);
        return false;
    } else if (newPassword != confirmPassword) {
        showErrorUnderTextbox('confirm_password', IDS_modify_password_wrong_msg);
        $('#new_password').val('');
        $('#confirm_password').val('');
        setTimeout( function() {
            $('#new_password').focus();
        },10);
        return false;
    } else if (passWordStrength == MACRO_PASSWORD_LOW) {
        showErrorUnderTextbox('new_password', IDS_psw_login_remind);
        setTimeout( function() {
            $('#new_password').focus();
        },10);
        return false;
    } else {
        return true;
    }
}

function apply() {
    if (!isButtonEnable('apply_button')) {
        return;
    }
    clearAllErrorLabel();
    $('#new_password').focus();
    var bValid = vilidatePassword();
    if (bValid) {
        var username = 'admin';
        var currentPassword = $('#current_password').val();
        var newPassword = $('#new_password').val();
        if (true == g_scarm_login) {
            var request = {
                username: username,
                currentpassword: XSSResolveCannotParseChar(currentPassword),
                newpassword: XSSResolveCannotParseChar(newPassword)
            };
            var xmlstr = object2xml('request', request);
            button_enable('apply_button', '0');
            clearTimeout(g_decive_timer);
            clearTimeout(g_simcard_timer);
            saveAjaxData('api/user/password_scram', xmlstr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    button_enable('apply_button', '0');
                    $('#current_password').val('');
                    $('#new_password').val('');
                    $('#confirm_password').val('');
                    showInfoDialog(common_success);
                    setTimeout(userOut, 1000);
                } else if ('error' == ret.type) {
                    clearAllErrorLabel();
                    if (ret.error.code == MODIFYPASSWORD_SHOW) {
                        showErrorUnderTextbox('current_password', IDS_current_password_inputshow);
                        $('#current_password').val('');
                        $('#current_password').focus();
                    } else {
                        showErrorUnderTextbox('current_password', system_hint_wrong_password);
                        $('#current_password').val('');
                        $('#current_password').focus();
                    }
                }
            }, {
                enc:true,
                sync:true
            });
        } else {
            if(encryption_mode == 1 && $.isArray(g_requestVerificationToken) && g_requestVerificationToken.length > 0) {
                currentPassword = base64encode(SHA256(username + base64encode(SHA256(currentPassword)) + g_requestVerificationToken[0]));
            } else {
                currentPassword = base64encode(currentPassword);
            }
            newPassword = base64encode(newPassword);
            var request = {
                Username: username,
                CurrentPassword: XSSResolveCannotParseChar(currentPassword),
                NewPassword: XSSResolveCannotParseChar(newPassword),
                encryption_enable:encryption_mode
            };
            var xmlstr = object2xml('request', request);
            button_enable('apply_button', '0');
            saveAjaxData('api/user/password', xmlstr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    button_enable('apply_button', '0');
                    $('#current_password').val('');
                    $('#new_password').val('');
                    $('#confirm_password').val('');
                    showInfoDialog(common_success);
                    setTimeout(userOut, 1000);
                } else if ('error' == ret.type) {
                    clearAllErrorLabel();
                    if (ret.error.code == MODIFYPASSWORD_SHOW) {
                        showErrorUnderTextbox('current_password', IDS_current_password_inputshow);
                        $('#current_password').val('');
                        $('#current_password').focus();
                    } else {
                        showErrorUnderTextbox('current_password', system_hint_wrong_password);
                        $('#current_password').val('');
                        $('#current_password').focus();
                    }
                }
            },{
            enc:true,
            sync:true
            });
        }
    }
}
function setPWStrengthColor(PWStrength) {
    passWordStrength = PWStrength;
    if(MACRO_PASSWORD_LOW == PWStrength) {
        $('#psw_strength_low').css({
            "background-color": "red"
        });
        $('#psw_strength_mid, #psw_strength_hig').css({
            "background-color": "gray"
        });
    } else if(MACRO_PASSWORD_MID == PWStrength) {
        $('#psw_strength_mid').css({
            "background-color": "red"
        });
        $('#psw_strength_low, #psw_strength_hig').css({
            "background-color": "gray"
        });
    } else if(MACRO_PASSWORD_HIG == PWStrength) {
        $('#psw_strength_hig').css({
            "background-color": "red"
        });
        $('#psw_strength_mid, #psw_strength_low').css({
            "background-color": "gray"
        });
    } else {
        $('#psw_strength_low, #psw_strength_mid, #psw_strength_hig').css({
            "background-color": "gray"
        });
    }
}

function getPWRemindStatus() {
    getAjaxData('api/user/remind', function($xml) {
        var res = xml2object($xml);
        if ('response' == res.type) {
            if(hilink_login_status == 1 || hilink_show_checkbox == 1){
                $("#tr_psw_strength").show();
                if(1 == g_default_password_status){
                    $("#tr_psw_remind").hide();
                } else {
                    $("#tr_psw_remind").show();
                }
            }
            if("1" == res.response.remindstate) {
                $("#check_psw_modify_remind").attr('checked', 'checked');
            } else {
                $("#check_psw_modify_remind").removeAttr('checked');
            }
        }
    });
}

function currentPEncryption(){
    getAjaxData("api/user/password", function($xml) {
        var password_ret = xml2object($xml);
        if(password_ret.type == "response") {
            encryption_mode = password_ret.response.encryption_enable;
        }
    }, {
        sync: true
    });
}
function getHilinkLoginStatus() {
    getAjaxData('api/user/hilink_login', function($xml) {
        var res = xml2object($xml);
        if ('response' == res.type) {
            hilink_login_status = res.response.hilink_login;
            if(hilink_show_checkbox == 0){
                if(hilink_login_status == 0){
                    $(".apply_button").hide();
                    $("#tr_current_passwd").hide();
                    $("#tr_new_passwd").hide();
                    $("#tr_psw_strength").hide();
                    $("#tr_confirm_password").hide();
                    $("#tr_psw_remind").hide();    
                }
                $("#tr_login_eable").show();    
            }
            if(1 == res.response.hilink_login) {
                $("#login_eable").attr('checked', 'checked');
            } else {
                $("#login_eable").removeAttr('checked');
            }
        }
    },{
        sync:true
    });
}
function setHilinkLoginStatus(setStatus) {
    var submitData = {
        hilink_login:setStatus
    };
    var res = object2xml('request', submitData);
    saveAjaxData('api/user/hilink_login', res, function($xml) {
        var return_ret = xml2object($xml);
        if (isAjaxReturnOK(return_ret)) {
            showInfoDialog(common_success);
            setTimeout( function() {
            g_login_checking_flag = false;
            gotoPageWithoutHistory(HOME_PAGE_URL);}, 3000);
            log.debug('main : send setHilinkLoginStatus success.');
        }
    }, {
        sync: true
    });
}
$(document).ready( function() {
    getDefaultPass();
    if(g_default_password_status == 0) {
        showInfoDialog(IDS_default_password_note);
    } else {
        window.onload= function() {
            setTimeout( function() {
                $('#current_password').focus();
            }, 500);
        };
    }
    getConfigData('config/global/config.xml', function($xml) {
        hilink_show_checkbox = g_feature.login;
    }, {
        sync: true
    });
    $('#apply_button').click( function() {
        apply();
    });
    button_enable('apply_button', '0');

    $('input:not(.modify_password_checkbox)').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });
    $("#new_password").live("keydown keypress keyup focus change", function(event) {
        if(("keydown" == event.type || "keypress" == event.type || "keyup" == event.type)
        && (37 == event.keyCode || 38 == event.keyCode || 39 == event.keyCode || 40 == event.keyCode)) {
            return;
        }
        if($("#new_password").val().length > 0) {
            setPWStrengthColor(checkPWStrength($("#new_password").val()));
        } else {
            setPWStrengthColor(0);
        }
    });
    $('#check_psw_modify_remind').live('click', function() {
        if($('#check_psw_modify_remind').get(0).checked) {
            setPWRemindStatus(MACRO_PASSWORD_REMIND_OFF);
        } else {
            setPWRemindStatus(MACRO_PASSWORD_REMIND_ON);
        }
    });
    $('#login_eable').live('click', function() {
        if (g_login_checking_flag == true) {
            return;
        }
        g_login_checking_flag = true;
        if($('#login_eable').get(0).checked) {
            setHilinkLoginStatus(hilink_login_eable);
        } else {
            setHilinkLoginStatus(hilink_login_diable);
        }
    });
    currentPEncryption();
    getHilinkLoginStatus();
    setPWStrengthColor(0);
    getPWRemindStatus();
});
