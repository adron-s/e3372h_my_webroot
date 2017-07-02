var passWordStrength = 0;
var encryption_mode = 0;
var g_quicksetup_wifiBasicData = [];
var g_quicksetup_wifiSecurityData = [];
var g_quicksetup_saveDataOK = false;
var g_quicksetup_saveWlanDataOK = false;
var g_quicksetup_savePasswordOK = false;
var g_quicksetup_nochangepwd_saveDataOK = false;
var QUICKSETUP_WIFIAUTHMODE_AUTO = 'AUTO';
var QUICKSETUP_WIFIAUTHMODE_OPEN = 'OPEN';
var QUICKSETUP_WIFIAUTHMODE_SHARE = 'SHARE';
var QUICKSETUP_WIFIAUTHMODE_WPA_PSK = 'WPA-PSK';
var QUICKSETUP_WIFIAUTHMODE_WPA2_PSK = 'WPA2-PSK';
var QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var QUICKSETUP_WIFIBASICENCRYPMODE_NONE = 'NONE';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP = 'WEP';
var g_backup_pwd = [];
var g_quicksetup = '';
var QUICK_SETUP_STEP1 = 1;
var QUICK_SETUP_STEP2 = 2;
var QUICK_SETUP_STEP3 = 3;
var SETUP_STEP1_WLAN = 1;
var SETUP_STEP2_UPDATE = 2;
var SETUP_STEP3_PASSWORD = 3;
var MODIFYPASSWORD_SHOW = 108008;
var g_auto_update_ret = '';
var COMMON_WEP_PASSWORD_VALUE = "*****";
var supportFeatureSwitch_flag = false;
function quicksetup_initPage_wifi() {
    getAjaxData('api/wlan/security-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_quicksetup_wifiSecurityData = ret.response;
        }
    }, {
        sync: true
    });
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_quicksetup = ret.response;
        }
    }, {
        sync: true
    });
    var wifiBasicData_oldSingle = {
        'WifiSsid' : g_quicksetup.WifiSsid,
        'WifiEnable' : g_quicksetup.WifiEnable,
        'WifiAuthmode' : g_quicksetup_wifiSecurityData.WifiAuthmode,
        'WifiWepKey1' : g_quicksetup_wifiSecurityData.WifiWepKey1,
        'WifiBasicencryptionmodes' : g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes,
        'WifiWpapsk' : g_quicksetup_wifiSecurityData.WifiWpapsk
    };
    $('.editordisable').removeAttr('disabled');
    $("#ssid_wifiName").val(wifiBasicData_oldSingle.WifiSsid);
    if (QUICKSETUP_WIFIAUTHMODE_AUTO == wifiBasicData_oldSingle.WifiAuthmode ||
    QUICKSETUP_WIFIAUTHMODE_OPEN == wifiBasicData_oldSingle.WifiAuthmode ||
    QUICKSETUP_WIFIAUTHMODE_SHARE == wifiBasicData_oldSingle.WifiAuthmode) {
        $('#div_ssid_encrypt_way1').show();
        $('#div_ssid_encrypt_way2').hide();
        $('#ssid_neworkKey1').val(wifiBasicData_oldSingle.WifiWepKey1);
        if (QUICKSETUP_WIFIBASICENCRYPMODE_NONE == wifiBasicData_oldSingle.WifiBasicencryptionmodes) {
            $('#ssid_network_key').hide();
        } else if (QUICKSETUP_WIFIBASICENCRYPMODE_WEP == wifiBasicData_oldSingle.WifiBasicencryptionmodes) {
            $('#ssid_network_key').show();
        }
    } else {
        $('#div_ssid_encrypt_way2').show();
        $('#div_ssid_encrypt_way1').hide();
        $('#ssid_wpa_key').val(wifiBasicData_oldSingle.WifiWpapsk);
    }
    if (wifiBasicData_oldSingle.WifiEnable == 0) {
        $('.editordisable').attr('disabled','disabled');
    }
    g_quicksetup_wifiBasicData.push(wifiBasicData_oldSingle);
}
function quicksetup_initPage_wifiMultiSSID() {
    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_quicksetup_wifiBasicData = CreateArray(ret.response.Ssids.Ssid);
            $(g_quicksetup_wifiBasicData).each( function(i) {
                var backup = {};
                backup.WifiWpapsk = g_quicksetup_wifiBasicData[i].WifiWpapsk;
                backup.WifiWepKey1 = g_quicksetup_wifiBasicData[i].WifiWepKey1;
                g_backup_pwd.push(backup);
                delete  g_quicksetup_wifiBasicData[i].WifiWep128Key1;
                delete  g_quicksetup_wifiBasicData[i].WifiWep128Key2;
                delete  g_quicksetup_wifiBasicData[i].WifiWep128Key3;
                delete  g_quicksetup_wifiBasicData[i].WifiWep128Key4;
            });
            showData(g_quicksetup_wifiBasicData[0]);
        }
    }, {
        sync: true
    });
}

function showData(data) {
    $('.editordisable').removeAttr('disabled');
    $("#ssid_wifiName").val(data.WifiSsid);
    if (QUICKSETUP_WIFIAUTHMODE_AUTO == data.WifiAuthmode ||
    QUICKSETUP_WIFIAUTHMODE_OPEN == data.WifiAuthmode ||
    QUICKSETUP_WIFIAUTHMODE_SHARE == data.WifiAuthmode) {
        $('#div_ssid_encrypt_way1').show();
        $('#div_ssid_encrypt_way2').hide();
        $('#ssid_neworkKey1').val(data.WifiWepKey1);
        if (QUICKSETUP_WIFIBASICENCRYPMODE_NONE == data.WifiBasicencryptionmodes) {
            $('#ssid_network_key').hide();
        } else if (QUICKSETUP_WIFIBASICENCRYPMODE_WEP == data.WifiBasicencryptionmodes) {
            $('#ssid_network_key').show();
        }
    } else {
        $('#div_ssid_encrypt_way2').show();
        $('#div_ssid_encrypt_way1').hide();
        $('#ssid_wpa_key').val(data.WifiWpapsk);
    }
    if (data.WifiEnable == 0) {
        $('.editordisable').attr('disabled','disabled');
    }
}

function refreshData() {
    if(g_quicksetup_wifiBasicData[0].WifiEnable != '0') {
        g_quicksetup_wifiBasicData[0].WifiSsid = $.trim($("#ssid_wifiName").val());
        if(QUICKSETUP_WIFIAUTHMODE_AUTO == g_quicksetup_wifiBasicData[0].WifiAuthmode ||
        QUICKSETUP_WIFIAUTHMODE_OPEN == g_quicksetup_wifiBasicData[0].WifiAuthmode ||
        QUICKSETUP_WIFIAUTHMODE_SHARE == g_quicksetup_wifiBasicData[0].WifiAuthmode) {
            g_quicksetup_wifiBasicData[0].WifiWepKey1 = $("#ssid_neworkKey1").val();
        } else {
            g_quicksetup_wifiBasicData[0].WifiWpapsk = $("#ssid_wpa_key").val();
        }
    }
}


function quicksetup_initPageData() {
    if(true == supportFeatureSwitch_flag) {
        quicksetup_initPage_wifiMultiSSID();
    } else if (!g_module.multi_ssid_enabled) {
        quicksetup_initPage_wifi();
    } else {
        quicksetup_initPage_wifiMultiSSID();
    }
    if(g_auto_update_enable == '1'){
        if (g_setup_wizard_page == '1') {
            $('input[name="update_selection"]').get(0).checked = true;
        } else {
            if (g_auto_update_ret.auto_update == '1') {
                $('input[name="update_selection"]').get(0).checked = true;
            } else {
                $('input[name="update_selection"]').get(1).checked = true;
            }
        }
        $('#auto_update_notes').text(IDS_common_updateDialog_radioE5);
        var quick_setup_step = IDS_wizard_quick_setup_step;
        var step1 = quick_setup_step.replace("%d",QUICK_SETUP_STEP1).replace("%e",QUICK_SETUP_STEP3);
        var step2 = quick_setup_step.replace("%d",QUICK_SETUP_STEP2).replace("%e",QUICK_SETUP_STEP3);
        var step3 = quick_setup_step.replace("%d",QUICK_SETUP_STEP3).replace("%e",QUICK_SETUP_STEP3);
        $('#step_1').text(step1);
        $('#step_2').text(step2);
        $('#step_3').text(step3);
        if (g_default_password_status == 1) {
            step1 = quick_setup_step.replace("%d",QUICK_SETUP_STEP1).replace("%e",QUICK_SETUP_STEP2);
            step2 = quick_setup_step.replace("%d",QUICK_SETUP_STEP2).replace("%e",QUICK_SETUP_STEP2);
            $('#step_1').text(step1);
            $('#step_2').text(step2);
            $('#Wlan_no_finish_button').show();
            $('#Update_finish_button').show();
        }
        if (g_default_password_status == 0) {
            $('#Wlan_no_finish_button').show();
            $('#Update_no_finish_button').show();
        }
    } else {
        var quick_setup_step = IDS_wizard_quick_setup_step;
        var step1 = quick_setup_step.replace("%d",QUICK_SETUP_STEP1).replace("%e",QUICK_SETUP_STEP1);
        $('#step_1').text(step1);
        $('#Wlan_finish_button').show();
    }

}
function quicksetup_validateSsid(ssid) {
    var errMsg = null;
    var name = $.trim($('#' + ssid + '_wifiName').val());
    if(g_wifiFeatureSwitch.chinesessid_enable == '1') {
        errMsg = checkInputSsidNameValid(ssid + '_wifiName',name);
    } else {
        errMsg = validateSsid(name);
    }
    if (common_ok != errMsg) {
        showErrorUnderTr(ssid + '_wifiName_error_msg',errMsg);
        $('#' + ssid + '_wifiName').focus();
        $('#' + ssid + '_wifiName').select();
        return false;
    } else {
        return true;
    }
}

function quicksetup_validateNeworkKeyPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;
    if (0 == pwdVal.length) {
        errMsg = dialup_hint_password_empty;
    } else if (hasSpaceOrTabAtHead(pwdVal)) {
        errMsg = input_cannot_begin_with_space;
    } else if (5 == pwdVal.length || 13 == pwdVal.length) {
        if(g_wifiFeatureSwitch.chinesessid_enable == '1') {
            if (!checkInputSsidPasswordValid(pwdVal)) {
                errMsg = wlan_hint_ssid_valid_char_new;
            } else {
                ret = true;
            }
        } else {
            if (!checkInputChar(pwdVal)) {
                errMsg = wlan_hint_wep_key_valid_type;
            } else {
                ret = true;
            }
        }
    } else {
        errMsg = wlan_hint_64_or_128_bit_key;
    }
    if (!ret) {
        showErrorUnderTr(password + '_error',errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }
    return ret;
}

function quicksetup_validateWpaPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;
    if (0 == pwdVal.length) {
        errMsg = dialup_hint_password_empty;
    } else if (hasSpaceOrTabAtHead(pwdVal)) {
        errMsg = input_cannot_begin_with_space;
    } else if (pwdVal.length >= 8 && pwdVal.length <= 63) {
        if(g_wifiFeatureSwitch.chinesessid_enable == '1') {
            if (!checkInputSsidPasswordValid(pwdVal)) {
                errMsg = wlan_hint_ssid_valid_char_new;
            } else {
                ret = true;
            }
        } else {
            if (!checkInputChar(pwdVal)) {
                errMsg = wlan_hint_wps_psk_valid_char;
            } else {
                ret = true;
            }
        }
    } else {
        errMsg = wlan_hint_wps_psk_valid_type;
    }
    if (!ret) {
        showErrorUnderTr(password + '_error',errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }
    return ret;
}

function quicksetup_ValidateWifiSecurity(ssid) {
    var authmode = g_quicksetup_wifiBasicData[0].WifiAuthmode;
    if (authmode == QUICKSETUP_WIFIAUTHMODE_WPA_PSK ||
    authmode == QUICKSETUP_WIFIAUTHMODE_WPA2_PSK ||
    authmode == QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK) {
        if (!quicksetup_validateWpaPwd(ssid + '_wpa_key')) {
            return false;
        }
    } else if (authmode == QUICKSETUP_WIFIAUTHMODE_AUTO ||
    authmode == QUICKSETUP_WIFIAUTHMODE_OPEN ||
    authmode == QUICKSETUP_WIFIAUTHMODE_SHARE) {
        var encryptionmode = g_quicksetup_wifiBasicData[0].WifiBasicencryptionmodes;
        if (encryptionmode == QUICKSETUP_WIFIBASICENCRYPMODE_NONE) {
            return true;
        } else {
            if (!quicksetup_validateNeworkKeyPwd(ssid + '_neworkKey1')) {
                return false;
            }
        }
    }
    return true;
}

function quicksetup_settings(step) {
    startLogoutTimer();
    clearAllErrorLabel();
    showSetupStep(step);
}
function showSetupStep(step) {
    var i;
    for (i = 1; i <= 3; i++) {
        $('#quicksetup' + i).css('display', 'none');
    }
    $('#quicksetup' + step).css('display', 'block');
}

function quicksetup_postData_wifi() {
    g_quicksetup_saveWlanDataOK = true;
    g_quicksetup_nochangepwd_saveDataOK = true;
    g_quicksetup.WifiSsid = g_quicksetup_wifiBasicData[0].WifiSsid;
    g_quicksetup.WifiRestart = 0;
    g_quicksetup_wifiSecurityData.WifiAuthmode = g_quicksetup_wifiBasicData[0].WifiAuthmode;
    g_quicksetup_wifiSecurityData.WifiWpaencryptionmodes = g_quicksetup_wifiBasicData[0].WifiWpaencryptionmodes;
    g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes = g_quicksetup_wifiBasicData[0].WifiBasicencryptionmodes;
    g_quicksetup_wifiSecurityData.WifiRestart = 1;
    if(("AUTO" == g_quicksetup_wifiSecurityData.WifiAuthmode
    || "OPEN" == g_quicksetup_wifiSecurityData.WifiAuthmode
    || "SHARE" == g_quicksetup_wifiSecurityData.WifiAuthmode)
    && ("WEP" == g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes)) {
        g_quicksetup_wifiSecurityData.WifiWepKey1 = g_quicksetup_wifiBasicData[0].WifiWepKey1;
        g_quicksetup_wifiSecurityData.WifiWepKeyIndex = "1";
    } else {
        g_quicksetup_wifiSecurityData.WifiWpapsk = g_quicksetup_wifiBasicData[0].WifiWpapsk;
    }

    var xmlstr_settings = object2xml('request', g_quicksetup);
    saveAjaxData('api/wlan/basic-settings', xmlstr_settings, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
            g_quicksetup_saveWlanDataOK = false;
            g_quicksetup_nochangepwd_saveDataOK = false;
        }
        var xmlstr_security = object2xml('request', g_quicksetup_wifiSecurityData);
        saveAjaxData('api/wlan/security-settings', xmlstr_security, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret)) {
                g_quicksetup_saveDataOK = false;
                g_quicksetup_saveWlanDataOK = false;
            g_quicksetup_nochangepwd_saveDataOK = false;
            }
        }, {
            enc:true
        });
    });
}

function quicksetup_postData_wifiMultiSSID() {
    var postData = {};
    var enpstring = '';
    g_quicksetup_saveWlanDataOK = true; 
    g_quicksetup_nochangepwd_saveDataOK = true;
    $(g_quicksetup_wifiBasicData).each( function(i) {
        g_quicksetup_wifiBasicData[i].WifiSsid = wifiSsidResolveCannotParseChar(g_quicksetup_wifiBasicData[i].WifiSsid);
        if(g_backup_pwd[i].WifiWpapsk == g_quicksetup_wifiBasicData[i].WifiWpapsk) {
            delete g_quicksetup_wifiBasicData[i].WifiWpapsk;
        } else {
            g_quicksetup_wifiBasicData[i].WifiWpapsk = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_quicksetup_wifiBasicData[i].WifiWpapsk));
            enpstring += 'WifiWpapsk,';
        }
        if(g_backup_pwd[i].WifiWepKey1 == g_quicksetup_wifiBasicData[i].WifiWepKey1) {
            delete g_quicksetup_wifiBasicData[i].WifiWepKey1;
        } else {
            g_quicksetup_wifiBasicData[i].WifiWepKey1 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_quicksetup_wifiBasicData[i].WifiWepKey1));
            enpstring += 'WifiWepKey1,';
        }
        delete g_quicksetup_wifiBasicData[i].MixWifiWpapsk;
        delete g_quicksetup_wifiBasicData[i].WifiWepKey2;
        delete g_quicksetup_wifiBasicData[i].WifiWepKey3;
        delete g_quicksetup_wifiBasicData[i].WifiWepKey4;
    });
    var enptype = false;
    if(enpstring != '') {
        enptype = true;
    }
    postData = {
        Ssids: {
            Ssid: g_quicksetup_wifiBasicData
        },
        WifiRestart: 1
    };
    var xmlStr_set = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr_set, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
            g_quicksetup_saveWlanDataOK = false; 
            g_quicksetup_nochangepwd_saveDataOK = false;
        }
    }, {
        sync:true,
        enp:enptype,
        enpstring:enpstring
    });
}

function updateCookie() {
    g_set_cookie_flag = true;
    getAjaxData('api/monitoring/status', function($xml) {
    }, {
        sync:true
    });
}

function quicksetup_login() {
    updateCookie();
    var psd = $('#new_password').val();
    refreshToken();
    if (true == g_scarm_login) {
        var scram = CryptoJS.SCRAM();
        var firstNonce = scram.nonce().toString();
        var firstPostData = {
            username: 'admin',
            firstnonce: firstNonce,
            mode: RSA_LOGIN_MODE
        };
        var firstXml = object2xml('request', firstPostData);
        saveAjaxData('api/user/challenge_login', firstXml, function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_scarm_salt = CryptoJS.enc.Hex.parse(ret.response.salt);
                var iter = ret.response.iterations;
                var finalNonce = ret.response.servernonce;
                var authMsg = firstNonce + "," + finalNonce + "," + finalNonce;
                var saltPassword = scram.saltedPassword(psd,g_scarm_salt,iter);
                saltPassword = saltPassword.toString();
                var clientKey = scram.clientKey(CryptoJS.enc.Hex.parse(saltPassword));
                clientKey = clientKey.toString();
                var serverKey = scram.serverKey(CryptoJS.enc.Hex.parse(saltPassword));
                serverKey = serverKey.toString();
                var clientProof = scram.clientProof(psd, g_scarm_salt, iter, authMsg);
                clientProof = clientProof.toString();
                var finalPostData = {
                    clientproof: clientProof,
                    finalnonce: finalNonce
                };
                var finalXml = object2xml('request', finalPostData);
                saveAjaxData('api/user/authentication_login', finalXml, function($xml) {
                    ret = xml2object($xml);
                    if (ret.type == 'response') {
                        var serverProof = scram.serverProof(psd, g_scarm_salt, iter, authMsg);
                        serverProof = serverProof.toString();
                        if (ret.response.serversignature == serverProof) {
                            var publicKey = ret.response.rsan;
                            var publicKeySignature = scram.signature(CryptoJS.enc.Hex.parse(publicKey), CryptoJS.enc.Hex.parse(serverKey));
                            publicKeySignature = publicKeySignature.toString();
                            if (ret.response.rsapubkeysignature == publicKeySignature) {
                                g_encPublickey.e = ret.response.rsae;
                                g_encPublickey.n = ret.response.rsan;
                                storagePubkey(g_encPublickey.n,g_encPublickey.e);
                                quicksetup_postData();
                            } else {
                                g_quicksetup_saveDataOK = false;
                            }
                        } else {
                            g_quicksetup_saveDataOK = false;
                        }
                    } else {
                        g_quicksetup_saveDataOK = false;
                    }
                });
            } else {
                g_quicksetup_saveDataOK = false;
            }
        });
    } else {
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_password_type = ret.response.password_type;
            }
        }, {
            sync: true
        });
        var username = 'admin';
        var psd = $('#new_password').val();
        if($.isArray(g_requestVerificationToken)) {
            if(g_requestVerificationToken.length > 0) {
                if(g_password_type == '4') {
                    psd = base64encode(SHA256(username + base64encode(SHA256($('#new_password').val())) + g_requestVerificationToken[0]));
                } else {
                    psd = base64encode($('#new_password').val());
                }

            }
        } else {
            psd = base64encode($('#new_password').val());
        }
        var firstPostData = {
            Username: username,
            Password: psd,
            password_type: g_password_type
        };
        var firstXml = object2xml('request', firstPostData);
        saveAjaxData('api/user/login', firstXml, function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                quicksetup_postData();
            } else {
                g_quicksetup_saveDataOK = false;
            }
        }, {
           enc:true
        });
    }
}
function quicksetup_postData() {
    if(true == supportFeatureSwitch_flag) {
        quicksetup_postData_wifiMultiSSID();
    } else if (!g_module.multi_ssid_enabled) {
        quicksetup_postData_wifi();
    } else {
        if(g_quicksetup_wifiBasicData[0].WifiEnable != 0) {
            quicksetup_postData_wifiMultiSSID();
        }
    }
    if(g_auto_update_enable == '1'){
        var update_switch = $('[name="update_selection"]:checked').val();
        var request_autoUpdate = {
            auto_update: update_switch,
            ui_download: g_auto_update_ret.ui_download
        };
        var xmlstr_autoUpdate = object2xml('request', request_autoUpdate);
        saveAjaxData('api/online-update/autoupdate-config', xmlstr_autoUpdate, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret)) {
                g_quicksetup_saveDataOK = false;
                g_quicksetup_nochangepwd_saveDataOK = false;
            }
        });
    }
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

function quicksetup_first_postPassword() {
    if (true == g_scarm_login) {
        g_quicksetup_saveDataOK = true;
        g_quicksetup_savePasswordOK = true;
        var currentPassword = $('#current_password').val();
        var newPassword = $('#new_password').val();
        var request = {
            username: 'admin',
            currentpassword: XSSResolveCannotParseChar(currentPassword),
            newpassword: XSSResolveCannotParseChar(newPassword)
        };
        var xmlstr = object2xml('request', request);
        clearTimeout(g_decive_timer);
        saveAjaxData('api/user/password_scram', xmlstr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                quicksetup_login();
            } else if ('error' == ret.type) {
                g_quicksetup_savePasswordOK = false;
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
        getAjaxData("api/user/password", function($xml) {
            var password_ret = xml2object($xml);
                if(password_ret.type == "response") {
                    encryption_mode = password_ret.response.encryption_enable;
                }
        }, {
            sync: true
        });
        g_quicksetup_saveDataOK = true;
        g_quicksetup_savePasswordOK = true;
        var username = 'admin';
        var currentPassword = $('#current_password').val();
        var newPassword = $('#new_password').val();
        if(encryption_mode == 1 && $.isArray(g_requestVerificationToken) && g_requestVerificationToken.length > 0) {
            currentPassword = base64encode(SHA256(username + base64encode(SHA256(currentPassword)) + g_requestVerificationToken[0]));
        } else {
            currentPassword = base64encode(currentPassword);
        }
        newPassword = base64encode(newPassword);
        var request = {
            Username: username,
            CurrentPassword: currentPassword,
            NewPassword: newPassword,
            encryption_enable:encryption_mode
        };
        var xmlstr = object2xml('request', request);
        clearTimeout(g_decive_timer);
        saveAjaxData('api/user/password', xmlstr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                quicksetup_login();
            } else if ('error' == ret.type) {
                g_quicksetup_savePasswordOK = false;
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
    }
}

function doRedirect() {
        gotoPageWithoutHistory(HOME_PAGE_URL);
}

function quicksetup_finish() {
    clearAllErrorLabel();
    if(g_auto_update_enable == '1'){
        if (g_default_password_status == 0) {
            $('#new_password').focus();
            var bValid = vilidatePassword();
            if (!bValid) {
                return;
            }
        }
    }
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    setTimeout( function() {
        if(g_auto_update_enable == '1' && g_default_password_status == 0){
            quicksetup_first_postPassword();
        } else {
            quicksetup_postData();
        }
        setTimeout( function() {
            if(g_auto_update_enable == '1'){
                if (g_default_password_status == 0) {
                    if (!g_quicksetup_savePasswordOK) {
                        closeWaitingDialog();
                        return;
                    }
                }
                if( true == g_quicksetup_saveDataOK ||  true == g_quicksetup_nochangepwd_saveDataOK) {
                    if(g_setup_wizard_page == '1') {
                        var request_info = {
                            restore_default_status: 0,
                            autoupdate_guide_status: 0
                        };
                        var xmlstr_info = object2xml('request', request_info);
                        saveAjaxData('api/device/basic_information', xmlstr_info, function($xml) {
                            closeWaitingDialog();
                            showInfoDialog(common_success,false,doRedirect);
                        }, {
                            sync: true
                        });
                    } else {
                        closeWaitingDialog();
                        showInfoDialog(common_success,false,refresh);
                    }
                } else {
                    closeWaitingDialog();
                    showInfoDialog(common_failed,false,refresh);
                }
            } else {
                if(g_quicksetup_saveWlanDataOK) {
                    closeWaitingDialog();
                    showInfoDialog(common_success);
                } else {
                    closeWaitingDialog();
                    showInfoDialog(common_failed);
                }
            }
        }, 3000);
    }, 1000);
}

function quicksetup_bindButtonClick() {
    $('#ssid_wifiName').keyup( function() {
        checkInputSsidNameValid($(this).attr('id'),$.trim($(this).val()));
    });
    $("#modifyWlanPswOption_w1 input").click( function() {
        if($(this).prop('checked')) {
            $("#ssid_neworkKey1_error").removeClass('hidden');
            $("#ssid_neworkKey1").val('').focus();
        } else {
            $("tr.error_message").remove();
            $("#ssid_neworkKey1_error").addClass('hidden');
            $("#ssid_neworkKey1").val(g_quicksetup_wifiBasicData[0].WifiWepKey1);
        }
    });
    $("#showPswForW1").click( function() {
        if($(this).prop('checked')) {
            var tmpval = $("#ssid_neworkKey1").val();
            var tmpstr = "<input id='ssid_neworkKey1' type='text' autocomplete='off' class='input_style editordisable' maxlength='26'>";
            $("#ssid_neworkKey1").after(tmpstr).remove();
            $("#ssid_neworkKey1").val(tmpval);
        } else {
            var tmpval = $("#ssid_neworkKey1").val();
            var tmpstr = "<input id='ssid_neworkKey1' type='password' autocomplete='off' class='input_style editordisable' maxlength='26'>";
            $("#ssid_neworkKey1").after(tmpstr).remove();
            $("#ssid_neworkKey1").val(tmpval);
        }
    });
    $("#modifyWlanPswOption_w2 input").click( function() {
        if($(this).prop('checked')) {
            $("#ssid_wpa_key_error").removeClass('hidden');
            $("#ssid_wpa_key").val('').focus();
        } else {
            $("tr.error_message").remove();
            $("#ssid_wpa_key_error").addClass('hidden');
            $("#ssid_wpa_key").val(g_quicksetup_wifiBasicData[0].WifiWpapsk);
        }
    });
    $("#showPswForW2").click( function() {
        if($(this).prop('checked')) {
            var tmpval = $("#ssid_wpa_key").val();
            var tmpstr = "<input name='wpa_key' id='ssid_wpa_key' type='text' autocomplete='off' class='input_style editordisable' maxlength='63'>";
            $("#ssid_wpa_key").after(tmpstr).remove();
            $("#ssid_wpa_key").val(tmpval);
        } else {
            var tmpval = $("#ssid_wpa_key").val();
            var tmpstr = "<input name='wpa_key' id='ssid_wpa_key' type='password' autocomplete='off' class='input_style editordisable' maxlength='63'>";
            $("#ssid_wpa_key").after(tmpstr).remove();
            $("#ssid_wpa_key").val(tmpval);
        }
    });
    if(g_auto_update_enable == '1'){
        $('#step1_next').click( function() {
            if (!isButtonEnable('step1_next')) {
                return;
            }
            clearAllErrorLabel();
            if ((g_wifiFeatureSwitch.maxapnum == 2 && (g_quicksetup_wifiBasicData[1].WifiSsid == $.trim($("#ssid_wifiName").val()))) ||
            (g_wifiFeatureSwitch.maxapnum == 3 && ((g_quicksetup_wifiBasicData[1].WifiSsid == $.trim($("#ssid_wifiName").val())) ||
            (g_quicksetup_wifiBasicData[2].WifiSsid == $.trim($("#ssid_wifiName").val())))) || (g_wifiFeatureSwitch.maxapnum == 4 &&
            ((g_quicksetup_wifiBasicData[1].WifiSsid == $.trim($("#ssid_wifiName").val())) ||
            (g_quicksetup_wifiBasicData[2].WifiSsid == $.trim($("#ssid_wifiName").val())) ||
            (g_quicksetup_wifiBasicData[3].WifiSsid == $.trim($("#ssid_wifiName").val()))))) {
                showInfoDialog(multi_ssid_same_message);
                return;
            }
            if (g_quicksetup_wifiBasicData[0].WifiEnable != 0) {
                if(!quicksetup_validateSsid("ssid")) {
                    return;
                }
                if(!quicksetup_ValidateWifiSecurity("ssid")) {
                    return;
                }
                refreshData();
            }
            quicksetup_settings(SETUP_STEP2_UPDATE);
        });
    } else {
        $('#step_Wlan_finish').click( function() {
            if (!isButtonEnable('step_Wlan_finish')) {
                return;
            }
            clearAllErrorLabel();
            if ((g_wifiFeatureSwitch.maxapnum == 2 && (g_quicksetup_wifiBasicData[1].WifiSsid == $.trim($("#ssid_wifiName").val()))) ||
            (g_wifiFeatureSwitch.maxapnum == 3 && ((g_quicksetup_wifiBasicData[1].WifiSsid == $.trim($("#ssid_wifiName").val())) ||
            (g_quicksetup_wifiBasicData[2].WifiSsid == $.trim($("#ssid_wifiName").val())))) || (g_wifiFeatureSwitch.maxapnum == 4 &&
            ((g_quicksetup_wifiBasicData[1].WifiSsid == $.trim($("#ssid_wifiName").val())) ||
            (g_quicksetup_wifiBasicData[2].WifiSsid == $.trim($("#ssid_wifiName").val())) ||
            (g_quicksetup_wifiBasicData[3].WifiSsid == $.trim($("#ssid_wifiName").val()))))) {
                showInfoDialog(multi_ssid_same_message);
                return;
            }
            if (g_quicksetup_wifiBasicData[0].WifiEnable != 0) {
                if(!quicksetup_validateSsid("ssid")) {
                    return;
                }
                if(!quicksetup_ValidateWifiSecurity("ssid")) {
                    return;
                }
                refreshData();
            }
            quicksetup_finish();
        });
    }

    $('#step2_back,#step2_back_new').click( function() {
        quicksetup_settings(SETUP_STEP1_WLAN);
    });
    $('#step2_next').click( function() {
        if (!isButtonEnable('step2_next')) {
            return;
        }
        quicksetup_settings(SETUP_STEP3_PASSWORD);
        $('#current_password').focus();
    });
    $('#step3_back').click( function() {
        quicksetup_settings(SETUP_STEP2_UPDATE);
    });
    $('#step_Update_finish,#step_finish').click( function() {
        quicksetup_finish();
    });
    $("#new_password").live("keydown keypress keyup focus change", function(event) {
        if(("keydown" == event.type || "keypress" == event.type || "keyup" == event.type)
        && (37 == event.keyCode || 38 == event.keyCode || 39 == event.keyCode || 40 == event.keyCode)) {
            return;
        }
        if($("#new_password").val().length > 0) {
            setPWStrengthColor(checkPWStrength($.trim($("#new_password").val())));
        } else {
            setPWStrengthColor(0);
        }
    });
    $('#current_password, #new_password').bind('keydown', function(e) {
        if (e.which == 13) {
            var bValid = vilidatePassword();
            if (!bValid) {
                return;
            } else {
                quicksetup_finish();
            }
        }
    });
    $('#confirm_password').bind('keydown', function(e) {
        if (e.which == 13) {
            quicksetup_finish();
        }
    });
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

function main_executeBeforeDocumentReady() {
    if(g_auto_update_enable != '1'){
        getAjaxData("api/device/basic_information", function($xml) {
            var basic_ret = xml2object($xml);
            if('response' == basic_ret.type) {
                basic_infos = basic_ret.response;
                if(basic_infos.restore_default_status == '1') {
                    var request_info = {
                        restore_default_status: 0
                    };
                    var xmlstr_info = object2xml('request', request_info);
                    saveAjaxData('api/device/basic_information', xmlstr_info, function($xml) {
                    }, {
                        sync: true
                    });
                }
            }
        }, {
            sync: true
        });
    }
    var submitData = {
        PrsiteClear: 1,
        prsite_type: 3
    };
    var res = object2xml('request', submitData);
    saveAjaxData('api/prsite/clear', res, function($xml) {
        var return_ret = xml2object($xml);
        if (isAjaxReturnOK(return_ret)) {
            log.debug('redirect : send prsiteClearUpdataredirect success.');
        }
    }, {
        sync: true
    });
    getDefaultPass();
    if(g_auto_update_enable == '1'){
        getAjaxData('api/online-update/autoupdate-config', function($xml) {
            var ret = xml2object($xml);
            if(ret.type == 'response') {
                g_auto_update_ret = ret.response;
            }
        }, {
            sync: true
        });
    }
    if('' == g_wifiFeatureSwitch) {
        getAjaxData('api/wlan/wifi-feature-switch', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                supportFeatureSwitch_flag = true;
                g_wifiFeatureSwitch = ret.response;
            }
        }, {
            sync: true
        });
    } else {
        supportFeatureSwitch_flag = true;
    }
}
main_executeBeforeDocumentReady();
$(document).ready( function() {
    quicksetup_initPageData();
    quicksetup_bindButtonClick();
    setPWStrengthColor(0);
    getLoginStatus();
});
