var g_wlan_basicData = [];    //xml list of basic settings
var g_backup_pwd = [];
var WIFIAUTHMODE_AUTO = 'AUTO';
var WIFIAUTHMODE_OPEN = 'OPEN';
var WIFIAUTHMODE_SHARE = 'SHARE';
var WIFIAUTHMODE_WPA_PSK = 'WPA-PSK';
var WIFIAUTHMODE_WPA2_PSK = 'WPA2-PSK';
var WIFIAUTHMODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var WIFIADVENCRYPMODE_AES = 'AES';
var WIFIADVENCRYPMODE_MIX = 'MIX';
var WIFIBASICENCRYPMODE_NONE = 'NONE';
var WIFIBASICENCRYPMODE_WEP = 'WEP';
var WIFIBASICENCRYPMODE_WEP64 = 'WEP64';
var WIFIBASICENCRYPMODE_WEP128 = 'WEP128';
var DISPLAY_PASSWORD_ON = '1';
var DISPLAY_PASSWORD_OFF = '0';
var g_WifiFeature = null;
var g_ssid2_wifiOffload = null;
var g_wlan_multiSsidStatus = null;
var g_wlan_show_password = null;
var g_wlan_Ssidpassword_config = '';
var g_editIndex = 0;
var g_editFlag = -1;
var g_logoutTimer = null;
var g_wlan_basicData_old = null;
var g_wlan_securityData_old = null;
var g_doubleSSID_enable = -1;
var g_multissidstatus  = -1;
var g_ssid2wifioffload = false;
var g_workband = null;
var g_wlan_basicSetting_ex = [];
var IDS_wlan_fre_0 = '2.4GHz';
var IDS_wlan_fre_1 = '5GHz';
var g_wlanStatus = true;
var g_isChangeSecurityMode = false;
var initWlanValue = '';
var postWlanValue = '';
function wlanbasicsettings_networkKey(key, ssid) {
    $('#' + ssid + '_neworkKey1').val(g_wlan_basicData[g_editIndex].WifiWepKey1);
    $('#' + ssid + '_neworkKey2').val(g_wlan_basicData[g_editIndex].WifiWepKey2);
    $('#' + ssid + '_neworkKey3').val(g_wlan_basicData[g_editIndex].WifiWepKey3);
    $('#' + ssid + '_neworkKey4').val(g_wlan_basicData[g_editIndex].WifiWepKey4);

    if (key == WIFIAUTHMODE_OPEN) {
        $('#' + ssid + '_network_key').hide();
    } else if (key == WIFIAUTHMODE_SHARE || key == WIFIAUTHMODE_AUTO) {
        $('#' + ssid + '_network_key').show();
        $('#' + ssid + '_current_network_key').val(g_wlan_basicData[g_editIndex].WifiWepKeyIndex);
    } else {
        log.debug("key is error");
    }
}
function getDAesString(encrypted,key,iv) {
    var key  = CryptoJS.enc.Hex.parse(key);
    var iv   = CryptoJS.enc.Hex.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted,key, {
        iv:iv,
        mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Latin1);
}
function wlanbasicsettings_initPage() {
    if(checkLeftMenu(g_PageUrlTree.settings.wlan.wps)) {
        if (null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
            $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion_wpa);
        } else {
            $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion_open_wep);
        }
    } else {
        $('#wpsbasic_p').html(setting_IDS_wlan_message_encryption_catuion_nowps);
    }
    if (1 == g_wlan_Ssidpassword_config) {
        $('#wlan_device_password_enable').show();
        wlanbasicsettings_getSSIDPassword_DisplayEnable();
    } else {
        $('#wlan_device_password_enable').hide();
    }
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_basicData_old = ret.response;
    }, {
        sync: true
    });
    getAjaxData('api/wlan/security-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_securityData_old = ret.response;
        if (true == g_scarm_login) {
            var scram = CryptoJS.SCRAM();
            var wifiNonce = scram.nonce().toString();
            var wifiSalt = scram.nonce().toString();
            var nonceStr = wifiNonce + wifiSalt;
            var nonceData = doRSAEncrypt(nonceStr);
            var requestData = {
                module: 'wlan',
                nonce: nonceData
            };
            var postXml = object2xml('request', requestData);
            saveAjaxData('api/user/pwd', postXml, function($xml) {
                var returnData = xml2object($xml);
                if (returnData.type == 'response') {
                    var wifiEncrypted = returnData.response.pwd;
                    var salt = CryptoJS.enc.Hex.parse(wifiSalt);
                    var iter = returnData.response.iter;
                    var saltedStr = scram.saltedPassword(wifiNonce, salt, iter);
                    saltedStr = saltedStr.toString();
                    var aesKey = saltedStr.substring(0,32);
                    var aesIV = saltedStr.substring(32,48);
                    var hmacKey = saltedStr.substring(48,64);
                    var hashData = scram.signature(CryptoJS.enc.Hex.parse(wifiEncrypted), CryptoJS.enc.Hex.parse(hmacKey));
                    hashData = hashData.toString();
                    if (returnData.response.hash == hashData) {
                        var encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(wifiEncrypted));
                        var decryptedData = getDAesString(encrypted,aesKey,aesIV);
                        decryptedData = XSS_UnescapesSpecialChar(decryptedData.substring(decryptedData.indexOf('<response>')));
                        var xmls;
                        if (typeof decryptedData == 'string' || typeof decryptedData == 'number') {
                            if (!window.ActiveXObject) {
                                var parser = new DOMParser();
                                xmls = parser.parseFromString(decryptedData, 'text/xml');
                            } else {
                                xmls = new ActiveXObject('Microsoft.XMLDOM');
                                xmls.async = false;
                                xmls.loadXML(decryptedData);
                            }
                        } else {
                            xmls = decryptedData;
                        }
                        var rets = xml2object($(xmls));
                        if (rets.type == 'response') {
                            temp = rets.response.Ssids.Ssid;
                            var secretKeyArray = CreateArray(temp);
                            $(g_wlan_securityData_old).each( function(i) {
                                g_wlan_securityData_old[i].WifiWpapsk = secretKeyArray[i].WifiWpapsk;
                                g_wlan_securityData_old[i].MixWifiWpapsk = secretKeyArray[i].MixWifiWpapsk;
                                g_wlan_securityData_old[i].WifiWepKey1 = secretKeyArray[i].WifiWepKey1;
                                g_wlan_securityData_old[i].WifiWepKey2 = secretKeyArray[i].WifiWepKey2;
                                g_wlan_securityData_old[i].WifiWepKey3 = secretKeyArray[i].WifiWepKey3;
                                g_wlan_securityData_old[i].WifiWepKey4 = secretKeyArray[i].WifiWepKey4;
                            });
                        }
                    }
                }
            }, {
                sync:true
            });
        }
    }, {
        sync:true
    });

    list_wifiBasicData = {
        'WifiSsid' : g_wlan_basicData_old.WifiSsid,
        'WifiEnable' : g_wlan_basicData_old.WifiEnable,
        'WifiBroadcast' : g_wlan_basicData_old.WifiHide,
        'WifiIsolate' :  g_wlan_basicData_old.WifiIsolate,
        'WifiAuthmode' : g_wlan_securityData_old.WifiAuthmode,
        'WifiWepKey1' : g_wlan_securityData_old.WifiWepKey1,
        'WifiWepKey2' : g_wlan_securityData_old.WifiWepKey2,
        'WifiWepKey3' : g_wlan_securityData_old.WifiWepKey3,
        'WifiWepKey4' : g_wlan_securityData_old.WifiWepKey4,
        'WifiWepKeyIndex' : g_wlan_securityData_old.WifiWepKeyIndex,
        'WifiWpaencryptionmodes' : g_wlan_securityData_old.WifiWpaencryptionmodes,
        'WifiBasicencryptionmodes' : g_wlan_securityData_old.WifiBasicencryptionmodes,
        'WifiWpapsk' : g_wlan_securityData_old.WifiWpapsk
    };
    g_wlan_basicData.push(list_wifiBasicData);
    g_wlanStatus = g_wlan_basicData[0].WifiEnable == '1' ? true : false;
    $("input[name='wlan_turn_on'][value=" + g_wlan_basicData[0].WifiEnable + ']').attr('checked', true);
    var wifiAuthMode = g_wlan_basicData[0].WifiAuthmode;
    var wifiEncryptionMode = "";
    if (wifiAuthMode == WIFIAUTHMODE_WPA2_PSK ||
    wifiAuthMode == WIFIAUTHMODE_WPA_WPA2_PSK) {
        wifiEncryptionMode = g_wlan_basicData[0].WifiWpaencryptionmodes;
    } else if (wifiAuthMode == WIFIAUTHMODE_OPEN || wifiAuthMode == WIFIAUTHMODE_AUTO) {
        wifiEncryptionMode = g_wlan_basicData[0].WifiBasicencryptionmodes;
    }
    $(".ssid_table").remove();
    g_isChangeSecurityMode = change2SecurityMode();
    addSSID(
    g_wlan_basicData[0].WifiSsid,
    g_wlan_basicData[0].WifiAuthmode,
    g_wlan_basicData[0].WifiEnable
    );
}

function wlanbasicsettings_getSSIDPassword_DisplayEnable() {
    getAjaxData('api/wlan/oled-showpassword', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            g_wlan_show_password = ret.response;
            if ("1" == g_wlan_show_password.oledshowpassword) {
                $('#wlan_wps_password_disply_input').attr('checked', 'checked');
            } else {
                $('#wlan_wps_password_disply_input').removeAttr('checked');
            }
        } else if (ret.error.code == ERROR_SYSTEM_BUSY) {
            showInfoDialog(common_system_busy);
        } else {
            showInfoDialog(common_fail);
        }
    }, {
        sync:true
    });
}

function addSSID() {
    var addLine = null;
    var i = 1;
    var j = 0;
    addLine = "<tr class='ssid_table'>";
    for (i = 0; i < arguments.length; i++) {
        if(i == 0) {
            arguments[i] = spaceToNbsp(XSSResolveCannotParseChar(arguments[i]));
            addLine += "<td width='118px' height = '30px' align = 'middle' style='word-break: break-all;'>" + arguments[i] + "</td>";
        } else if (2 == i) {
            if ('0' == arguments[i]) {
                addLine += "<td width='115px' align = 'middle'><span class ='ssid_table'>" + common_off + "</span></td>";
            } else {
                addLine += "<td width='115px' align = 'middle'><span class ='ssid_table'>" + common_on + "</span></td>";
            }
        } else {
            addLine += "<td width='115px' align = 'middle'>" + XSSResolveCannotParseChar(arguments[i]) + "</td>";
        }
    }
    addLine += "<td width='83px' align = 'middle'>" + "<span class= 'button_edit_list clr_blue' style='float:none; padding:0;' >" + common_edit + "</span></td></tr>";
    //var currentTrTotal = $(insertNode).size();
    //$(insertNode).eq(currentTrTotal - 2).after(addLine);
    $("#ssid_list tr:last").after(addLine);
}

function wlan_multiSsid_initPage() {
    if(checkLeftMenu(g_PageUrlTree.settings.wlan.wps)) {
        if (null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
            $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion_wpa);
        } else {
            $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion_open_wep);
        }
    } else {
        $('#wpsbasic_p').html(setting_IDS_wlan_message_encryption_catuion_nowps);
    }
    var temp = null;
    g_editFlag = -1;
    if (1 == g_wlan_Ssidpassword_config) {
        $('#wlan_device_password_enable').show();
        wlanbasicsettings_getSSIDPassword_DisplayEnable();
    } else {
        $('#wlan_device_password_enable').hide();
    }

    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        temp = ret.response.Ssids.Ssid;
        g_wlan_basicData = CreateArray(temp);
        if (true == g_scarm_login) {
            var scram = CryptoJS.SCRAM();
            var wifiNonce = scram.nonce().toString();
            var wifiSalt = scram.nonce().toString();
            var nonceStr = wifiNonce + wifiSalt;
            var nonceData = doRSAEncrypt(nonceStr);
            var requestData = {
                module: 'wlan',
                nonce: nonceData
            };
            var postXml = object2xml('request', requestData);
            saveAjaxData('api/user/pwd', postXml, function($xml) {
                var returnData = xml2object($xml);
                if (returnData.type == 'response') {
                    var wifiEncrypted = returnData.response.pwd;
                    var salt = CryptoJS.enc.Hex.parse(wifiSalt);
                    var iter = returnData.response.iter;
                    var saltedStr = scram.saltedPassword(wifiNonce, salt, iter);
                    saltedStr = saltedStr.toString();
                    var aesKey = saltedStr.substring(0,32);
                    var aesIV = saltedStr.substring(32,48);
                    var hmacKey = saltedStr.substring(48,64);
                    var hashData = scram.signature(CryptoJS.enc.Hex.parse(wifiEncrypted), CryptoJS.enc.Hex.parse(hmacKey));
                    hashData = hashData.toString();
                    if (returnData.response.hash == hashData) {
                        var encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(wifiEncrypted));
                        var decryptedData = getDAesString(encrypted,aesKey,aesIV);
                        decryptedData = XSS_UnescapesSpecialChar(decryptedData.substring(decryptedData.indexOf('<response>')));
                        var xmls;
                        if (typeof decryptedData == 'string' || typeof decryptedData == 'number') {
                            if (!window.ActiveXObject) {
                                var parser = new DOMParser();
                                xmls = parser.parseFromString(decryptedData, 'text/xml');
                            } else {
                                xmls = new ActiveXObject('Microsoft.XMLDOM');
                                xmls.async = false;
                                xmls.loadXML(decryptedData);
                            }
                        } else {
                            xmls = decryptedData;
                        }
                        var rets = xml2object($(xmls));
                        if (rets.type == 'response') {
                            temp = rets.response.Ssids.Ssid;
                            var secretKeyArray = CreateArray(temp);
                            $(g_wlan_basicData).each( function(i) {
                                g_wlan_basicData[i].WifiWpapsk = secretKeyArray[i].WifiWpapsk;
                                g_wlan_basicData[i].MixWifiWpapsk = secretKeyArray[i].MixWifiWpapsk;
                                g_wlan_basicData[i].WifiWepKey1 = secretKeyArray[i].WifiWepKey1;
                                g_wlan_basicData[i].WifiWepKey2 = secretKeyArray[i].WifiWepKey2;
                                g_wlan_basicData[i].WifiWepKey3 = secretKeyArray[i].WifiWepKey3;
                                g_wlan_basicData[i].WifiWepKey4 = secretKeyArray[i].WifiWepKey4;
                            });
                        }
                    }
                }
            }, {
                sync:true
            });
        }
        g_backup_pwd = [];
        $(g_wlan_basicData).each( function(i) {
            var backup = {};
            backup.WifiWpapsk = g_wlan_basicData[i].WifiWpapsk;
            backup.MixWifiWpapsk = g_wlan_basicData[i].MixWifiWpapsk;
            backup.WifiWepKey1 = g_wlan_basicData[i].WifiWepKey1;
            backup.WifiWepKey2 = g_wlan_basicData[i].WifiWepKey2;
            backup.WifiWepKey3 = g_wlan_basicData[i].WifiWepKey3;
            backup.WifiWepKey4 = g_wlan_basicData[i].WifiWepKey4;
            g_backup_pwd.push(backup);
            delete  g_wlan_basicData[i].WifiWep128Key1;
            delete  g_wlan_basicData[i].WifiWep128Key2;
            delete  g_wlan_basicData[i].WifiWep128Key3;
            delete  g_wlan_basicData[i].WifiWep128Key4;
        });
        if((null != g_wifiFeatureSwitch) && ('1' == g_wifiFeatureSwitch.wifi24g_switch_enable)) {
            g_wlanStatus = g_wlan_basicData[0].wifitotalswitch == '1' ? true : false;
            $("input[name='wlan_turn_on'][value=" + g_wlan_basicData[0].wifitotalswitch + ']').attr('checked', true);
        } else {
            g_wlanStatus = g_wlan_basicData[0].WifiEnable == '1' ? true : false;
            $("input[name='wlan_turn_on'][value=" + g_wlan_basicData[0].WifiEnable + ']').attr('checked', true);
        }
    }, {
        sync:true
    });
    if((null != g_wifiFeatureSwitch) && ('1' == g_wifiFeatureSwitch.wifi24g_switch_enable)) {
        initWlanValue = g_wlan_basicData[0].wifitotalswitch;
    } else {
        initWlanValue = g_wlan_basicData[0].WifiEnable;
    }
    if (null == g_wifiFeatureSwitch || (null != g_wifiFeatureSwitch && 1 != g_wifiFeatureSwitch.maxapnum)) {
        multiSsidOnOffStatus();
        if((g_wifiFeatureSwitch != null && g_wifiFeatureSwitch.maxapnum == 2) || (g_wifiFeatureSwitch == null && g_module.multi_ssid_enabled)) {
            g_doubleSSID_enable = g_wlan_basicData[1].WifiEnable;
            getAjaxData('api/wlan/multi-switch-settings', function($xml) {
                var ret = xml2object($xml);
                if ('response' == ret.type) {
                    g_wlan_multiSsidStatus = ret.response;
                    g_multissidstatus = g_wlan_multiSsidStatus.multissidstatus ;
                    g_wlan_basicData[1].WifiEnable = g_wlan_multiSsidStatus.multissidstatus ;
                }
            }, {
                sync:true
            });
        }
    }
    g_isChangeSecurityMode = change2SecurityMode();
    addData();
}

function change2SecurityMode() {
    var changeFlag = false;
    $(g_wlan_basicData).each( function(i) {
        var wifiAuthMode = g_wlan_basicData[i].WifiAuthmode;
        var wifimode = '';
        switch (wifiAuthMode) {
            case WIFIAUTHMODE_SHARE:
                g_wlan_basicData[i].WifiAuthmode = WIFIAUTHMODE_AUTO;
                g_wlan_basicData[i].WifiBasicencryptionmodes = WIFIBASICENCRYPMODE_WEP;
                changeFlag = true;
                break;
            case WIFIAUTHMODE_OPEN:
                if(WIFIBASICENCRYPMODE_WEP == g_wlan_basicData[i].WifiBasicencryptionmodes) {
                    g_wlan_basicData[i].WifiAuthmode = WIFIAUTHMODE_AUTO;
                    g_wlan_basicData[i].WifiBasicencryptionmodes = WIFIBASICENCRYPMODE_WEP;
                    changeFlag = true;
                }
                break;
            case WIFIAUTHMODE_WPA_PSK:
                g_wlan_basicData[i].WifiAuthmode =  WIFIAUTHMODE_WPA_WPA2_PSK;
                g_wlan_basicData[i].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_MIX;
                changeFlag = true;
                break;
            case WIFIAUTHMODE_WPA2_PSK:
                if(WIFIADVENCRYPMODE_AES != g_wlan_basicData[i].WifiWpaencryptionmodes) {
                    g_wlan_basicData[i].WifiAuthmode = WIFIAUTHMODE_WPA_WPA2_PSK;
                    g_wlan_basicData[i].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_MIX;
                    changeFlag = true;
                }
                break;
            case WIFIAUTHMODE_WPA_WPA2_PSK:
                if(WIFIADVENCRYPMODE_MIX != g_wlan_basicData[i].WifiWpaencryptionmodes) {
                    g_wlan_basicData[i].WifiAuthmode =  WIFIAUTHMODE_WPA_WPA2_PSK;
                    g_wlan_basicData[i].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_MIX;
                    changeFlag = true;
                }
                break;
            default:
                break;
        }
    });
    return changeFlag;
}

function addData() {
    $('.ssid_table').remove();
    $(g_wlan_basicData).each( function(i) {
        var wifiAuthMode = g_wlan_basicData[i].WifiAuthmode;
        var wifimode = '';
        if(WIFIAUTHMODE_OPEN == wifiAuthMode) {
            wifimode = IDS_wlan_label_open;
        } else if (WIFIAUTHMODE_AUTO == wifiAuthMode) {
            wifimode = wlan_label_wep;
        } else if (WIFIAUTHMODE_WPA2_PSK == wifiAuthMode) {
            wifimode = wlan_label_wpa2_psk;
        } else if (WIFIAUTHMODE_WPA_WPA2_PSK == wifiAuthMode) {
            wifimode = wlan_label_wpa_wpa2_psk;
        }
        addSSID(
        g_wlan_basicData[i].WifiSsid,
        wifimode,
        g_wlan_basicData[i].WifiEnable
        );
    });
}

function updateArraData(clickIndex) {
    g_editIndex = clickIndex;
    if(null != g_wlan_basicData[g_editIndex].WifiBroadcast) {
        if(1 == g_wlan_basicData[g_editIndex].WifiBroadcast) {
            $("#color").css("color","red");
        } else {
            $("#color").css("color","black");
        }
    }
    if ((1 == g_module.multi_ssid_enabled) && (1 == g_wifiFeatureSwitch.isdoublechip)) {
        var g_workband_ex = g_wlan_basicSetting_ex[g_editIndex].WifiMode;
        if (g_workband_ex == 'a/n' || g_workband_ex == 'a' || g_workband_ex == 'a/n/ac') {
            $('#band_text').html(IDS_wlan_fre_1);
        } else {
            $('#band_text').html(IDS_wlan_fre_0);
        }
    } else {
        $('#ssid_workband').hide();
    }
    refreshData();
    addData();
    $('.button_edit_list').eq(g_editIndex).removeClass('clr_blue').addClass('editing').addClass('clr_gray');
    showEditData();
}

function refreshData() {
    g_wlan_basicData[g_editFlag].WifiEnable = $("[name='ssid_status']:checked").val();
    g_wlan_basicData[g_editFlag].WifiSsid = $('#ssid_wifiName').val();
    g_wlan_basicData[g_editFlag].WifiBroadcast = $('[name=ssid_wifiBroadcast]:checked').val();
    var wifiAuthMode = $('#ssid_authentication').val();
    g_wlan_basicData[g_editFlag].WifiAuthmode = wifiAuthMode;
    g_wlan_basicData[g_editFlag].WifiRestart = 1;
    if (wifiAuthMode == WIFIAUTHMODE_WPA2_PSK) {
        g_wlan_basicData[g_editFlag].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_AES;
        g_wlan_basicData[g_editFlag].WifiWpapsk = $('#ssid_wpa_key').val();
    } else if(wifiAuthMode == WIFIAUTHMODE_WPA_WPA2_PSK) {
        g_wlan_basicData[g_editFlag].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_MIX;
        g_wlan_basicData[g_editFlag].WifiWpapsk = $('#ssid_wpa_key').val();
    } else if (wifiAuthMode == WIFIAUTHMODE_AUTO) {
        g_wlan_basicData[g_editFlag].WifiWepKey1 = $('#ssid_neworkKey1').val();
        g_wlan_basicData[g_editFlag].WifiWepKey2 = $('#ssid_neworkKey2').val();
        g_wlan_basicData[g_editFlag].WifiWepKey3 = $('#ssid_neworkKey3').val();
        g_wlan_basicData[g_editFlag].WifiWepKey4 = $('#ssid_neworkKey4').val();
        g_wlan_basicData[g_editFlag].WifiWepKeyIndex = $('#ssid_current_network_key').val();
        g_wlan_basicData[g_editFlag].WifiBasicencryptionmodes = WIFIBASICENCRYPMODE_WEP;
    } else if (wifiAuthMode == WIFIAUTHMODE_OPEN) {
        g_wlan_basicData[g_editFlag].WifiBasicencryptionmodes = WIFIBASICENCRYPMODE_NONE;
    } else {
        log.debug("wifiAuthmode is error");
    }
}

function showEditData() {
    g_ssid2wifioffload = false;
    button_enable('apply_button', '1');
    $("#SSID").show();
    $(':input').removeAttr('disabled');
    $('.select_input').removeAttr('disabled');
    g_editFlag = g_editIndex;
    if((null != g_wifiFeatureSwitch) && ('' != g_wifiFeatureSwitch)) {
        if('1' == g_wifiFeatureSwitch.wifi24g_switch_enable) {
            $('#ssid_enable').show();
        } else {
            if(0 == g_editIndex) {
                $('#ssid_enable').hide();
            } else {
                $('#ssid_enable').show();
            }
        }
    }

    $("#ssid_authentication").empty();
    $('#ssid_authentication').prepend("<option value='WPA/WPA2-PSK'>" + wlan_label_wpa_wpa2_psk + '</option>');
    $('#ssid_authentication').prepend("<option value='WPA2-PSK'>" + wlan_label_wpa2_psk + '</option>');
    $('#ssid_authentication').prepend("<option value='AUTO'>" + wlan_label_wep + '</option>');
    $('#ssid_authentication').prepend("<option value='OPEN'>" + IDS_wlan_label_open + '</option>');
    $('.button_edit_list').eq(g_editIndex).removeClass('clr_blue').addClass('editing').addClass('clr_gray');
    $("input[name='ssid_status'][value=" + g_wlan_basicData[g_editIndex].WifiEnable+ ']').attr('checked', true);
    $("input[name='ssid_wifiBroadcast'][value=" + g_wlan_basicData[g_editIndex].WifiBroadcast+ ']').attr('checked', true);
    $("#ssid_wifiName").val(g_wlan_basicData[g_editIndex].WifiSsid);
    $("#ssid_authentication").val(g_wlan_basicData[g_editIndex].WifiAuthmode);
    $('#ssid_current_network_key').val(g_wlan_basicData[g_editIndex].WifiWepKeyIndex);
    $('#ssid_encryption_mode_wpa').val(g_wlan_basicData[g_editIndex].WifiWpaencryptionmodes);
    $('#ssid_wpa_key').val(g_wlan_basicData[g_editIndex].WifiWpapsk);
    if (WIFIAUTHMODE_OPEN == g_wlan_basicData[g_editIndex].WifiAuthmode) {
        $('#ssid_authentication_open_wep').show();
        $('#ssid_authentication_open_wep').html(wlan_hint_use_encryption);
        $('#div_ssid_encrypt_way1').hide();
        $('#div_ssid_encrypt_way2').hide();
        $('#ssid_encryption_mode_basic').val(g_wlan_basicData[g_editIndex].WifiBasicencryptionmodes);
        wifiAuthMode = WIFIAUTHMODE_OPEN;
    } else if(WIFIAUTHMODE_AUTO == g_wlan_basicData[g_editIndex].WifiAuthmode) {
        $('#ssid_authentication_open_wep').show();
        $('#ssid_authentication_open_wep').html(wlan_hint_use_safe_encryption);
        $('#ssid_encryption_mode_basic').val(g_wlan_basicData[g_editIndex].WifiBasicencryptionmodes);
        $('#div_ssid_encrypt_way1').show();
        $('#div_ssid_encrypt_way2').hide();
        $('#ssid_network_key').show();
        $('#ssid_caution').show();
        wlanbasicsettings_networkKey(g_wlan_basicData[g_editIndex].WifiAuthmode, 'ssid');
        $('#check_wpa_psk').removeAttr('checked');
        wlanbasicsettings_showPassword('#check_wpa_psk');
        wifiAuthMode = WIFIAUTHMODE_AUTO;
        $("#ssid_authentication").val(WIFIAUTHMODE_AUTO);
    } else if(WIFIAUTHMODE_WPA2_PSK == g_wlan_basicData[g_editIndex].WifiAuthmode) {
        $('#ssid_authentication_open_wep').hide();
        $('#div_ssid_encrypt_way2').show();
        $('#div_ssid_encrypt_way1').hide();
        $('#ssid_encryption_mode_basic').val(WIFIADVENCRYPMODE_AES);
        $('#check_wpa_psk_02').removeAttr('checked');
        wlanbasicsettings_showPassword('#check_wpa_psk_02');
        wifiAuthMode = WIFIAUTHMODE_WPA2_PSK;
    } else if(WIFIAUTHMODE_WPA_WPA2_PSK == g_wlan_basicData[g_editIndex].WifiAuthmode) {
        $('#ssid_authentication_open_wep').hide();
        $('#div_ssid_encrypt_way2').show();
        $('#div_ssid_encrypt_way1').hide();
        $('#ssid_encryption_mode_basic').val(WIFIADVENCRYPMODE_MIX);
        $('#check_wpa_psk_02').removeAttr('checked');
        wlanbasicsettings_showPassword('#check_wpa_psk_02');
        wifiAuthMode = WIFIAUTHMODE_WPA_WPA2_PSK;
    }
    if(g_ssid2_wifiOffload != null && g_ssid2_wifiOffload.Handover == 2 && g_editIndex != 0) {
        $("#ssid_turn_on").attr("disabled","disabled");
        $("#ssid_turn_off").attr("disabled","disabled");
        $('#SSID :input').attr('disabled','disabled');
        if(!g_ssid2wifioffload) {
            button_enable('apply_button', '0');
            showInfoDialog(multi_ssidStatus_message);
            g_ssid2wifioffload = true;
        }
    } else {
        if ('0' == $("[name='ssid_status']:checked").val() || !g_wlanStatus) {
            $('#SSID :input').attr('disabled','disabled');
            $('.select_input').removeAttr('disabled','disabled');
            if(g_wlanStatus) {
                $('#ssid_turn_on').removeAttr('disabled');
                $('#ssid_turn_off').removeAttr('disabled');
            }
        } else if(!g_wlanStatus) {
            $(':input').removeAttr('disabled');
            $('.select_input').removeAttr('disabled');
        }
    }
    if(null != g_wlan_basicData[g_editIndex].WifiBroadcast) {
        if(1 == g_wlan_basicData[g_editIndex].WifiBroadcast) {
            $("#color").css("color","red");
        } else {
            $("#color").css("color","black");
        }
    }
    if ((1 == g_module.multi_ssid_enabled) && (1 == g_wifiFeatureSwitch.isdoublechip)) {
        var g_workband_ex = g_wlan_basicSetting_ex[g_editIndex].WifiMode;
        if (g_workband_ex == 'a/n' || g_workband_ex == 'a' || g_workband_ex == 'a/n/ac') {
            $('#band_text').html(IDS_wlan_fre_1);
        } else {
            $('#band_text').html(IDS_wlan_fre_0);
        }
    } else {
        $('#ssid_workband').hide();
    }
    if((1 == g_module.multi_ssid_enabled) && (1 == g_wifiFeatureSwitch.isdoublechip) && (4 == g_wifiFeatureSwitch.maxapnum)) {
        if((1 == g_editIndex) && ('0' == g_wlan_basicData[0].WifiEnable)) {
            $('#SSID :input').attr('disabled','disabled');
            g_wlan_basicData[1].WifiEnable = '0';
        }
        if((3 == g_editIndex) && ('0' == g_wlan_basicData[2].WifiEnable)) {
            $('#SSID :input').attr('disabled','disabled');
            g_wlan_basicData[3].WifiEnable = '0';
        }
    }
}

function wlanbasicsettings_authentication(lable, ssid) {
    if (lable == WIFIAUTHMODE_AUTO) {
        $('#div_' + ssid + '_encrypt_way1').show();
        $('#div_' + ssid + '_encrypt_way2').hide();
        wlanbasicsettings_networkKey(WIFIAUTHMODE_AUTO, ssid);
        $('#ssid_caution').show();
    } else if (lable == WIFIAUTHMODE_OPEN) {
        $('#div_' + ssid + '_encrypt_way1').hide();
        $('#div_' + ssid + '_encrypt_way2').hide();
    } else if (lable == WIFIAUTHMODE_WPA2_PSK) {
        $('#div_' + ssid + '_encrypt_way2').show();
        $('#div_' + ssid + '_encrypt_way1').hide();
        $('#ssid_caution').hide();
        $('#' + ssid + '_encryption_mode_wpa').val(WIFIADVENCRYPMODE_AES);
    } else if (lable == WIFIAUTHMODE_WPA_WPA2_PSK) {
        $('#div_' + ssid + '_encrypt_way2').show();
        $('#div_' + ssid + '_encrypt_way1').hide();
        $('#ssid_caution').hide();
        $('#' + ssid + '_encryption_mode_wpa').val(WIFIADVENCRYPMODE_MIX);
    } else {
        log.debug("lable is error");
    }
}

function writeInArra() {
    var wifiAuthMode = '';
    g_wlan_basicData[g_editIndex].WifiSsid = $.trim($('#ssid_wifiName').val());
    g_wlan_basicData[g_editIndex].WifiBroadcast = $('[name=ssid_wifiBroadcast]:checked').val();
    wifiAuthMode = $('#ssid_authentication').val();
    g_wlan_basicData[g_editIndex].WifiAuthmode = wifiAuthMode;
    if(WIFIAUTHMODE_WPA2_PSK == wifiAuthMode) {
        g_wlan_basicData[g_editIndex].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_AES;
        g_wlan_basicData[g_editIndex].WifiWpapsk = $('#ssid_wpa_key').val();
        g_wlan_basicData[g_editIndex].WifiAuthmode = WIFIAUTHMODE_WPA2_PSK;
    } else if (WIFIAUTHMODE_WPA_WPA2_PSK == wifiAuthMode) {
        g_wlan_basicData[g_editIndex].WifiWpaencryptionmodes = WIFIADVENCRYPMODE_MIX;
        g_wlan_basicData[g_editIndex].WifiWpapsk = $('#ssid_wpa_key').val();
        g_wlan_basicData[g_editIndex].WifiAuthmode = WIFIAUTHMODE_WPA_WPA2_PSK;
    } else if (WIFIAUTHMODE_AUTO == wifiAuthMode) {
        g_wlan_basicData[g_editIndex].WifiAuthmode = WIFIAUTHMODE_AUTO;
        g_wlan_basicData[g_editIndex].WifiWepKey1 = $('#ssid_neworkKey1').val();
        g_wlan_basicData[g_editIndex].WifiWepKey2 = $('#ssid_neworkKey2').val();
        g_wlan_basicData[g_editIndex].WifiWepKey3 = $('#ssid_neworkKey3').val();
        g_wlan_basicData[g_editIndex].WifiWepKey4 = $('#ssid_neworkKey4').val();
        g_wlan_basicData[g_editIndex].WifiWepKeyIndex = $('#ssid_current_network_key').val();
        g_wlan_basicData[g_editIndex].WifiBasicencryptionmodes = WIFIBASICENCRYPMODE_WEP;
    } else if (WIFIAUTHMODE_OPEN == wifiAuthMode) {
        g_wlan_basicData[g_editIndex].WifiAuthmode = WIFIAUTHMODE_OPEN;
        g_wlan_basicData[g_editIndex].WifiBasicencryptionmodes = WIFIBASICENCRYPMODE_NONE;
    } else {
        log.debug("wifiAuthmode is error");
    }
}

function wlanbasicsettings_postData(doNotShowDialogFlag) {
    writeInArra();
    g_wlan_basicData_old.WifiEnable = g_wlan_basicData[0].WifiEnable;
    g_wlan_basicData_old.WifiSsid = $.trim(g_wlan_basicData[0].WifiSsid);
    g_wlan_basicData_old.WifiHide = g_wlan_basicData[0].WifiBroadcast;
    g_wlan_basicData_old.WifiRestart = 0;
    g_wlan_basicData_old.WifiIsolate = g_wlan_basicData[0].WifiIsolate;
    var xmlStr = object2xml('request', g_wlan_basicData_old);
    if(!doNotShowDialogFlag) {
        button_enable('apply_button', '0');
    }
    $(':input:not(#lang)').attr('disabled', 'disabled');
    saveAjaxData('api/wlan/basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').removeAttr('disabled');
        $('#SSID').hide();
        if (isAjaxReturnOK(ret)) {
            button_enable('apply_button', '0');
            //showInfoDialog(common_success);
            setTimeout( function () {
                security_set(doNotShowDialogFlag);
            }, 500);
        } else {
            if(ret.error.code==ERROR_SYSTEM_BUSY) {
                if(!doNotShowDialogFlag) {
                    showInfoDialog(common_system_busy);
                }
            } else {
                if(!doNotShowDialogFlag) {
                    showInfoDialog(common_fail);
                }
            }
            if(!doNotShowDialogFlag) {
                button_enable('apply_button', '1');
            }
        }
    }, {
        sync: true
    });
}

function security_set(doNotShowDialogFlag) {
    // save authentication and encryption
    g_wlan_securityData_old.WifiAuthmode = g_wlan_basicData[0].WifiAuthmode;
    g_wlan_securityData_old.WifiWpaencryptionmodes = g_wlan_basicData[0].WifiWpaencryptionmodes;
    g_wlan_securityData_old.WifiBasicencryptionmodes = g_wlan_basicData[0].WifiBasicencryptionmodes;
    if(WIFIAUTHMODE_AUTO == g_wlan_securityData_old.WifiAuthmode) {
        g_wlan_securityData_old.WifiWepKey1 = g_wlan_basicData[0].WifiWepKey1;
        g_wlan_securityData_old.WifiWepKey2 = g_wlan_basicData[0].WifiWepKey2;
        g_wlan_securityData_old.WifiWepKey3 = g_wlan_basicData[0].WifiWepKey3;
        g_wlan_securityData_old.WifiWepKey4 = g_wlan_basicData[0].WifiWepKey4;
        g_wlan_securityData_old.WifiWepKeyIndex = g_wlan_basicData[0].WifiWepKeyIndex;
    } else if (WIFIAUTHMODE_WPA2_PSK == g_wlan_securityData_old.WifiAuthmode
    || WIFIAUTHMODE_WPA_WPA2_PSK == g_wlan_securityData_old.WifiAuthmode) {
        g_wlan_securityData_old.WifiWpapsk = g_wlan_basicData[0].WifiWpapsk;
    }

    g_wlan_securityData_old.WifiRestart = 1;
    button_enable('apply_button', '0');
    xmlStr = object2xml('request', g_wlan_securityData_old);
    saveAjaxData('api/wlan/security-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').removeAttr('disabled');
        if (isAjaxReturnOK(ret)) {
            if(!doNotShowDialogFlag) {
                button_enable('apply_button', '0');
                showInfoDialog(common_success);
                wlanbasicsettings_initPage();
            }
        } else {
            if(ret.error.code==ERROR_SYSTEM_BUSY) {
                if(!doNotShowDialogFlag) {
                    showInfoDialog(common_system_busy);
                }
            } else {
                if(!doNotShowDialogFlag) {
                    showInfoDialog(common_fail);
                }
            }
            if(!doNotShowDialogFlag) {
                button_enable('apply_button', '1');
            }
        }
    }, {
        enc:true
    });
}

function wlanbasicsettings_checkName(ssid) {
    var name = $.trim($('#' + ssid + '_wifiName').val());
    var errMsg = null;
    if(g_wifiFeatureSwitch.chinesessid_enable == '1') {
        errMsg = checkInputSsidNameValid(ssid + '_wifiName',name);
    } else {
        errMsg = validateSsid(name);
    }
    if (common_ok != errMsg) {
        showErrorUnderTextbox(ssid + '_wifiName', errMsg);
        $('#' + ssid + '_wifiName').focus();
        $('#' + ssid + '_wifiName').select();
        return false;
    } else {
        return true;
    }
}

function wlanbasicsettings_checkNetworkKeyPwd(password) {
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
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }
    return ret;
}

function wlanbasicsettings_checkWapPwd(password) {
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
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function wlanbasicsettings_checkWifiSecurity(ssid) {
    var strNetworkKey = $('#' + ssid + '_current_network_key').val();
    var authMethod = $('#' + ssid + '_authentication').val();
    var bscEncptMode = $('#' + ssid + '_encryption_mode_basic').val();

    if (authMethod == WIFIAUTHMODE_WPA2_PSK ||
    authMethod == WIFIAUTHMODE_WPA_WPA2_PSK) {
        return wlanbasicsettings_checkWapPwd(ssid + '_wpa_key');
    } else if (authMethod == WIFIAUTHMODE_AUTO) {
        if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey1')) {
            return false;
        }
        if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey2')) {
            return false;
        }
        if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey3')) {
            return false;
        }
        if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey4')) {
            return false;
        }
    }
    return true;
}

function wlanbasicsettings_showPwdStrength(networkKey) {
    $('#' + networkKey).live("keydown keypress keyup focus change", function(event) {
        if(("keydown" == event.type || "keypress" == event.type || "keyup" == event.type)
        && (37 == event.keyCode || 38 == event.keyCode || 39 == event.keyCode || 40 == event.keyCode)) {
            return;
        }
        if($('#' + networkKey).val().length > 0) {
            clearPasswordStrength();
            showPasswordStrength(networkKey);
            setPWDStrengthColor(checkPWStrength($('#' + networkKey).val()));
        } else {
            setPWDStrengthColor(0);
        }
    });
}

function wlanbasicsettings_showPassword(str) {
    var cbValue = $(str).attr('checked');
    var strType = cbValue ? 'text' : 'password';
    if(cbValue) {
        $('#check_wpa_psk_02').get(0).checked = true;
        $('#check_wpa_psk').get(0).checked = true;
    } else {
        $('#check_wpa_psk').get(0).checked = false;
        $('#check_wpa_psk_02').get(0).checked = false;
    }
    $.each($('input[name=ssid_key_name]'), function(i) {
        var tempStr = $(this).val();
        var tempID = $(this).attr('id');
        $("<input id='" + $(this).attr('id') + "' name='ssid_key_name' type='" + strType + "' autocomplete='off' class='input_style' maxlength='"+$(this).attr('maxlength') + "' />")
        .replaceAll($('#' + $(this).attr('id')));
        $('#' + tempID).val(tempStr);
    });
}

function fourSsid_postData(doNotshowDialogFlag) {
    var g_doubleSSID = '';
    var ret = "";
    if (g_editFlag != -1) {
        writeInArra();
    }
    var enpstring = '';
    if ($.isArray(g_wlan_basicData)) {
        $(g_wlan_basicData).each( function(i) {
            g_wlan_basicData[i].WifiSsid = wifiSsidResolveCannotParseChar(g_wlan_basicData[i].WifiSsid);
            if(g_backup_pwd[i].WifiWpapsk == g_wlan_basicData[i].WifiWpapsk) {
                delete g_wlan_basicData[i].WifiWpapsk;
            } else {
                g_wlan_basicData[i].WifiWpapsk = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData[i].WifiWpapsk));
                enpstring +=  'WifiWpapsk,';
            }
            if(g_backup_pwd[i].MixWifiWpapsk == g_wlan_basicData[i].MixWifiWpapsk) {
                delete g_wlan_basicData[i].MixWifiWpapsk;
            } else {
                g_wlan_basicData[i].MixWifiWpapsk = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData[i].MixWifiWpapsk));
                enpstring += 'MixWifiWpapsk,';
            }
            if(g_backup_pwd[i].WifiWepKey1 == g_wlan_basicData[i].WifiWepKey1) {
                delete g_wlan_basicData[i].WifiWepKey1;
            } else {
                g_wlan_basicData[i].WifiWepKey1 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData[i].WifiWepKey1));
                enpstring += 'WifiWepKey1,';
            }
            if(g_backup_pwd[i].WifiWepKey2 == g_wlan_basicData[i].WifiWepKey2) {
                delete g_wlan_basicData[i].WifiWepKey2;
            } else {
                g_wlan_basicData[i].WifiWepKey2 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData[i].WifiWepKey2));
                enpstring += 'WifiWepKey2,';
            }
            if(g_backup_pwd[i].WifiWepKey3 == g_wlan_basicData[i].WifiWepKey3) {
                delete g_wlan_basicData[i].WifiWepKey3;
            } else {
                g_wlan_basicData[i].WifiWepKey3 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData[i].WifiWepKey3));
                enpstring += 'WifiWepKey3,';
            }
            if(g_backup_pwd[i].WifiWepKey4 == g_wlan_basicData[i].WifiWepKey4) {
                delete g_wlan_basicData[i].WifiWepKey4;
            } else {
                g_wlan_basicData[i].WifiWepKey4 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData[i].WifiWepKey4));
                enpstring +=  'WifiWepKey4,';
            }
        });
    } else {
        g_wlan_basicData.WifiSsid = wifiSsidResolveCannotParseChar(g_wlan_basicData.WifiSsid);
        g_wlan_basicData.WifiWpapsk = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData.WifiWpapsk));
        g_wlan_basicData.MixWifiWpapsk = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData.MixWifiWpapsk));
        g_wlan_basicData.WifiWepKey1 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData.WifiWepKey1));
        g_wlan_basicData.WifiWepKey2 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData.WifiWepKey2));
        g_wlan_basicData.WifiWepKey3 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData.WifiWepKey3));
        g_wlan_basicData.WifiWepKey4 = doRSAEncrypt(wifiSsidResolveCannotParseChar(g_wlan_basicData.WifiWepKey4));
    }
    var enptype = false;
    if(enpstring != '') {
        enptype = true;
    }
    var postData = {
        Ssids: {
            Ssid: g_wlan_basicData
        },
        WifiRestart: 1
    };
    if((null != g_wifiFeatureSwitch) && ('1' == g_wifiFeatureSwitch.wifi24g_switch_enable)) {
        postWlanValue = g_wlan_basicData[0].wifitotalswitch;
    } else {
        postWlanValue = g_wlan_basicData[0].WifiEnable;
    }
    button_enable('apply_button', '0');
    $(':input:not(#lang)').attr('disabled', 'disabled');
    if((null != g_wifiFeatureSwitch && g_wifiFeatureSwitch.maxapnum == 2)||(null == g_wifiFeatureSwitch && g_module.multi_ssid_enabled)) {
        if(('undefined' == g_wifiFeatureSwitch.wifi24g_switch_enable) || (('undefined' != g_wifiFeatureSwitch.wifi24g_switch_enable)
        && (initWlanValue == postWlanValue))) {
            if((g_ssid2_wifiOffload == null || (g_ssid2_wifiOffload != null && g_ssid2_wifiOffload.Handover != 2))
            && g_multissidstatus != '-1' && g_multissidstatus != g_wlan_basicData[1].WifiEnable) {
                postData = {
                    Ssids: {
                        Ssid: g_wlan_basicData
                    },
                    WifiRestart: 0
                };
            }
            g_doubleSSID = g_wlan_basicData[1].WifiEnable;
        }
    }
    if(null != g_wifiFeatureSwitch && (g_wifiFeatureSwitch.doubleap5g_enable == 0) && (g_wifiFeatureSwitch.maxapnum == 2) && (g_wifiFeatureSwitch.isdoublechip == 0) && (g_doubleSSID == 1) && (g_wifiFeatureSwitch.wifi5g_enabled == 1) && (g_wlanInfo.WifiMode == "a/n" || g_wlanInfo.WifiMode == "a/n/ac")) {
        showInfoDialog(IDS_5G_doubleSsid);
        button_enable('apply_button', '1');
        return;
    }
    var errorFlag = false;
    var xmlStr = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').removeAttr('disabled');
        if (isAjaxReturnOK(ret)) {
            if(!doNotshowDialogFlag) {
                showInfoDialog(common_success);
                g_editFlag = -1;
                button_enable('apply_button', '0');
            }
        } else {
            if(ret.error.code==ERROR_SYSTEM_BUSY) {
                if(!doNotshowDialogFlag) {
                    showInfoDialog(common_system_busy);
                }
            } else {
                if(!doNotshowDialogFlag) {
                    showInfoDialog(common_fail);
                }
            }
            errorFlag = true;
            button_enable('apply_button', '1');
        }
    }, {
        sync:true,
        enp:enptype,
        enpstring:enpstring
    });

    if((null != g_wifiFeatureSwitch && g_wifiFeatureSwitch.maxapnum == 2)||(null == g_wifiFeatureSwitch && g_module.multi_ssid_enabled)) {
        if(('undefined' == g_wifiFeatureSwitch.wifi24g_switch_enable) || (('undefined' != g_wifiFeatureSwitch.wifi24g_switch_enable)
        && (initWlanValue == postWlanValue))) {
            g_wlan_basicData[1].WifiEnable = g_doubleSSID;
            if((g_ssid2_wifiOffload == null || (g_ssid2_wifiOffload != null && g_ssid2_wifiOffload.Handover != 2))
            && g_multissidstatus != '-1' && g_multissidstatus != g_wlan_basicData[1].WifiEnable) {
                g_wlan_multiSsidStatus.multissidstatus = g_wlan_basicData[1].WifiEnable;
                var xmlStrs = object2xml('request', g_wlan_multiSsidStatus);
                saveAjaxData('api/wlan/multi-switch-settings', xmlStrs, function($xml) {
                    var ret = xml2object($xml);
                    if (isAjaxReturnOK(ret)) {
                        wlan_multiSsid_initPage();
                        showEditData();
                        button_enable('apply_button', '0');
                        log.info("api/wlan/multi-switch-settings  response OK");
                    } else {
                        if(ret.error.code==ERROR_SYSTEM_BUSY) {
                            showInfoDialog(common_system_busy);
                        } else {
                            showInfoDialog(common_fail);
                        }
                        button_enable('apply_button', '1');
                    }
                }, {
                    sync:true
                });
            } else {
                wlan_multiSsid_initPage();
                showEditData();
                if(!errorFlag) {
                    button_enable('apply_button', '0');
                }
            }
        } else {
            wlan_multiSsid_initPage();
            showEditData();
            if(!errorFlag) {
                button_enable('apply_button', '0');
            }
        }
    } else {
        wlan_multiSsid_initPage();
        showEditData();
        if(!errorFlag) {
            button_enable('apply_button', '0');
        }
    }
}

function quicksetup_validateSsidName() {
    var num = arguments[0];
    var name = arguments[1];
    var ret = true;
    $(g_wlan_basicData).each( function(i) {
        if(num != i && g_wlan_basicData[i].WifiSsid == name) {
            showInfoDialog(multi_ssid_same_message);
            ret = false;
        }
    });
    return ret;
}

function fourSsid_apply() {
    var auth = $('#ssid_authentication').val();
    if(g_editFlag != -1 && g_wlan_basicData[g_editFlag].WifiEnable != '0') {
        if (!wlanbasicsettings_checkName('ssid')) {
            return;
        }
        if (!wlanbasicsettings_checkWifiSecurity('ssid')) {
            return;
        }
        if(!quicksetup_validateSsidName( g_editIndex, $.trim( $('#ssid_wifiName').val() ) ) ) {
            return;
        }
    }
    fourSsid_postData();
    $('#ssid_wifiName').val($.trim($('#ssid_wifiName').val()));
}

function wlanbasicsettings_apply() {
    clearAllErrorLabel();
    clearPasswordStrength();
    if (!isButtonEnable('apply_button')) {
        return;
    }
    if (null != g_wifiFeatureSwitch) {
        fourSsid_apply();
    } else {
        if (!g_module.multi_ssid_enabled) {
            var auth = $('#ssid_authentication').val();
            if (wlanbasicsettings_checkName('ssid') && wlanbasicsettings_checkWifiSecurity('ssid')) {
                wlanbasicsettings_postData();
            }
        } else {
            fourSsid_apply();
        }
    }
}

function wifiConfigDataDisplay() {
    if(g_WifiFeature.wifidisplayenable =='1') {
        $('#wlan_module').show();
    } else {
        $('#wlan_module').hide();
    }
    var varItem_aes = '<option value= ' + WIFIADVENCRYPMODE_AES + '\>' + wlan_label_aes + '</option>';
    var varItem_mix = '<option value= ' + WIFIADVENCRYPMODE_MIX + '\>' + wlan_label_aes_tkip + '</option>';
    $('#ssid_encryption_mode_wpa').append(varItem_aes);
}

function multiSsidOnOffStatus() {
    if(g_module.wifioffload_enable) {
        getAjaxData("api/wlan/handover-setting", function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_ssid2_wifiOffload = ret.response;
                if(g_ssid2_wifiOffload.Handover == 2 && g_editIndex != 0) {
                    $("#ssid_turn_on").attr("disabled","disabled");
                    $("#ssid_turn_off").attr("disabled","disabled");
                    $('#SSID :input').attr('disabled', 'disabled');
                    if(g_editIndex != -1 && !g_ssid2wifioffload) {
                        showInfoDialog(multi_ssidStatus_message);
                        showEditData();
                        g_ssid2wifioffload = true;
                    }
                } else if($("[name='ssid_status']:checked").val() != '0' && g_wlanStatus) {
                    $("#ssid_turn_on").removeAttr("disabled");
                    $("#ssid_turn_off").removeAttr("disabled");
                    $(':input').removeAttr('disabled');
                }
            }
        }, {
            sync:true
        });
    }
    setTimeout(multiSsidOnOffStatus, 3000);
}

function main_executeBeforeDocumentReady() {
    getConfigData('config/wifi/configure.xml', function($xml) {
        g_WifiFeature = _xml2feature($xml);
        if (DISPLAY_PASSWORD_ON == g_WifiFeature.ssidpasswordenable) {
            g_wlan_Ssidpassword_config = g_WifiFeature.ssidpasswordenable;
        } else {
            g_wlan_Ssidpassword_config = DISPLAY_PASSWORD_OFF;
        }
    }, {
        sync: true
    });
}

function getApNum() {
    if(null == g_wifiFeatureSwitch) {
        getAjaxData('api/wlan/wifi-feature-switch', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_wifiFeatureSwitch = ret.response;
            }
        }, {
            sync: true
        });
    }
}

main_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready( function() {
    var current_language = g_main_convergedStatus.CurrentLanguage;
    var support_language = [];
    support_language = CreateArray(LANGUAGE_DATA.usermanual_language_list.support_language.language);
    var supportFlag = false;
    if(typeof(support_language)!= 'undefined' && support_language != '') {
        var i = 0;
        for(i=0 ;i < support_language.length;i++) {
            if(current_language.replace(/_/,'-') == support_language[i].replace(/_/,'-')) {
                supportFlag = true;
            }
        }
    }
    if(supportFlag == false) {
        current_language = LANGUAGE_DATA.usermanual_language_list.default_language.replace(/_/,'-');
    }
    var replace_info = "<span class='broadcast_help_link clr_blue_a clr_blue_hover'><a href='../usermanual/" + current_language + "/usermanual/WLAN_plugin/web_wlan_task_00004.html' target= '_blank'>"
    + common_help + "</a></span>";
    var broadcast = IDS_wlan_broadcast_notes.replace("%s",replace_info);
    $('#color').html(broadcast);
    wifiConfigDataDisplay();
    getApNum();
    if ((1 == g_module.multi_ssid_enabled) && (1 == g_wifiFeatureSwitch.isdoublechip)) {
        getAjaxData("api/wlan/multi-security-settings-ex", function($xml) {
            var ret = xml2object($xml);
            var g_wlan_basic_ex = ret.response.ssids.ssid;
            g_wlan_basicSetting_ex = CreateArray(g_wlan_basic_ex);
        }, {
            sync:true
        });
    } else {
        $('#ssid_workband').hide();
    }
    openPortToCss('ssid_list');
    $('input[type=checkbox]').removeAttr("checked");
    $('#tooltips_ico_help').qtip({
        content: '<b>' + wlan_label_encryption_mode + '</b>:' + wlan_label_aes + ',' + wlan_label_aes_tkip,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });

    button_enable('apply_button', '0');
    //Password Strength Tips
    wlanbasicsettings_showPwdStrength('ssid_wpa_key');
    wlanbasicsettings_showPwdStrength('ssid_neworkKey1');
    wlanbasicsettings_showPwdStrength('ssid_neworkKey2');
    wlanbasicsettings_showPwdStrength('ssid_neworkKey3');
    wlanbasicsettings_showPwdStrength('ssid_neworkKey4');
    $('input[type=text]').live('keydown click', function(e) {//change input paste cut
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('apply_button', '1');
        }
    });
    $('input[type=radio]').live('keydown click', function(e) {//change input paste cut
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('apply_button', '1');
        }
    });
    $('input[type=password]').live('keydown click', function(e) {//change input paste cut
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('apply_button', '1');
        }
    });
    $('#check_wpa_psk').click( function() {
        wlanbasicsettings_showPassword('#check_wpa_psk');
    });
    $('#check_wpa_psk_02').click( function() {
        wlanbasicsettings_showPassword('#check_wpa_psk_02');
    });
    $('#ssid_current_network_key').change( function() {
        clearPasswordStrength();
        button_enable('apply_button', '1');
    });
    $('#ssid_authentication').change( function() {
        clearPasswordStrength();
        if (WIFIAUTHMODE_OPEN == $('#ssid_authentication').val()) {
            $('#ssid_authentication_open_wep').show();
            $('#ssid_authentication_open_wep').html(wlan_hint_use_encryption);
        } else if (WIFIAUTHMODE_AUTO == $('#ssid_authentication').val()) {
            $('#ssid_authentication_open_wep').show();
            $('#ssid_authentication_open_wep').html(wlan_hint_use_safe_encryption);
        } else if (WIFIAUTHMODE_WPA2_PSK == $('#ssid_authentication').val() || WIFIAUTHMODE_WPA_WPA2_PSK == $('#ssid_authentication').val()) {
            $('#ssid_authentication_open_wep').hide();
        }
        button_enable('apply_button', '1');
        wlanbasicsettings_authentication(this.value, 'ssid');
    });
    $('#ssid_encryption_mode_wpa,  #ssid_wifiIsolate').change( function() {
        clearPasswordStrength();
        button_enable('apply_button', '1');
    });
    $('#wlan_wps_password_disply_input').live('click', function() {
        clearPasswordStrength();
        g_wlan_show_password.oledshowpassword = ($("#wlan_wps_password_disply_input:checked").val())?1:0;
        var xmlStr = object2xml('request', g_wlan_show_password);
        saveAjaxData('api/wlan/oled-showpassword', xmlStr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(sd_hint_wait_a_few_moments,true);
            } else {
                wlanbasicsettings_getSSIDPassword_DisplayEnable();
            }
        });
    });
    if (null == g_wifiFeatureSwitch || '' == g_wifiFeatureSwitch) {
        if (!g_module.multi_ssid_enabled) {
            wlanbasicsettings_initPage();
        } else {
            wlan_multiSsid_initPage();
        }
    } else {
        wlan_multiSsid_initPage();
    }

    if(g_isChangeSecurityMode) {
        if (null != g_wifiFeatureSwitch) {
            fourSsid_postData(true);
        } else {
            if (!g_module.multi_ssid_enabled) {
                wlanbasicsettings_postData(true);
            } else {
                fourSsid_postData(true);
            }
        }
    }
    showEditData();
    button_enable('apply_button', '0');
    $(".button_edit_list").live("click", function() {
        if(null != g_wlan_basicData[g_editIndex].WifiBroadcast) {
            if(1 == g_wlan_basicData[g_editIndex].WifiBroadcast) {
                $("#color").css("color","red");
            } else {
                $("#color").css("color","black");
            }
        }

        if($(this).hasClass('editing')) {
            return;
        }
        clearAllErrorLabel();
        clearPasswordStrength();

        var clickIndex = $('.button_edit_list').index(this);

        if (-1 != g_editFlag && g_editFlag != clickIndex ) {
            if(g_wlan_basicData[g_editFlag].WifiEnable != '0' && g_wlanStatus) {
                if(!wlanbasicsettings_checkName('ssid')) {
                    return;
                }
                if(!wlanbasicsettings_checkWifiSecurity('ssid')) {
                    return;
                }
                if(!quicksetup_validateSsidName(g_editFlag,$('#ssid_wifiName').val())) {
                    return;
                }
            }

            g_editIndex = clickIndex;
            refreshData();
            $('.ssid_table').remove();
            addData();
            $('.button_edit_list').eq(g_editIndex).removeClass('clr_blue').addClass('editing').addClass('clr_gray');
            if(null != g_wlan_basicData[g_editIndex].WifiBroadcast) {
                if(1 == g_wlan_basicData[g_editIndex].WifiBroadcast) {
                    $("#color").css("color","red");
                } else {
                    $("#color").css("color","black");
                }
            }
        }
        g_editIndex = clickIndex;
        if(null != g_wlan_basicData[g_editIndex].WifiBroadcast) {
            if(1 == g_wlan_basicData[g_editIndex].WifiBroadcast) {
                $("#color").css("color","red");
            } else {
                $("#color").css("color","black");
            }
        }
        if((1 == g_module.multi_ssid_enabled) && (1 == g_wifiFeatureSwitch.isdoublechip)) {
            var g_workband_ex = g_wlan_basicSetting_ex[g_editIndex].WifiMode;
            if (g_workband_ex == 'a/n' || g_workband_ex == 'a' || g_workband_ex == 'a/n/ac') {
                $('#band_text').html(IDS_wlan_fre_1);
            } else {
                $('#band_text').html(IDS_wlan_fre_0);
            }
        } else {
            $('#ssid_workband').hide();
        }
        showEditData();
    });
    $('#ssid_turn_on').click( function() {
        $("#ssid_turn_off").removeAttr("checked");
        g_wlan_basicData[g_editIndex].WifiEnable = $("[name='ssid_status']:checked").val();
        $(':input').removeAttr('disabled');
        $('.select_input').removeAttr('disabled');
    });
    $('#ssid_turn_off').click( function() {
        clearPasswordStrength();
        $('#check_wpa_psk_02').removeAttr('checked');
        $('#check_wpa_psk').removeAttr('checked');
        if (WIFIAUTHMODE_AUTO == g_wlan_basicData[g_editIndex].WifiAuthmode) {
            wlanbasicsettings_showPassword('#check_wpa_psk');
        } else if (WIFIAUTHMODE_WPA2_PSK == g_wlan_basicData[g_editIndex].WifiAuthmode
        || WIFIAUTHMODE_WPA_WPA2_PSK == g_wlan_basicData[g_editIndex].WifiAuthmode) {
            wlanbasicsettings_showPassword('#check_wpa_psk_02');
        }
        $(".error_message").remove();
        g_wlan_basicData[g_editIndex].WifiEnable = $("[name='ssid_status']:checked").val();
        showEditData();
    });
    $('#wlan_turn_on').click( function() {
        button_enable('apply_button', '1');
        for(i = 0;i < g_wifiFeatureSwitch.maxapnum;i++) {
            if((null != g_wifiFeatureSwitch) && ('1' == g_wifiFeatureSwitch.wifi24g_switch_enable)) {
                g_wlan_basicData[i].wifitotalswitch = '1';
                g_wlan_basicData[i].WifiEnable = '1';
            } else {
                g_wlan_basicData[i].WifiEnable = '1';
            }
        }
        g_wlanStatus = true;
        if(g_editFlag != -1) {
            showEditData();
        }
    });
    $('#wlan_turn_off').click( function() {
        button_enable('apply_button', '1');
        clearAllErrorLabel();
        clearPasswordStrength();
        for(i = 0;i < g_wifiFeatureSwitch.maxapnum;i++) {
            if((null != g_wifiFeatureSwitch) && ('1' == g_wifiFeatureSwitch.wifi24g_switch_enable)) {
                g_wlan_basicData[i].wifitotalswitch = '0';
                g_wlan_basicData[i].WifiEnable = '0';
            } else {
                g_wlan_basicData[i].WifiEnable = '0';
            }
        }
        g_wlanStatus = false;
        if(g_editFlag != -1) {
            showEditData();
        }
    });
    $('#color_turn_on').click( function() {
        $("#color_turn_off").removeAttr("checked");
        button_enable('apply_button', '1');
        clearPasswordStrength();
        g_wlan_basicData[g_editIndex].WifiBroadcast = '0';
        $("#color").css("color","black");
    });
    $('#color_turn_off').click( function() {
        button_enable('apply_button', '1');
        clearAllErrorLabel();
        clearPasswordStrength();
        g_wlan_basicData[g_editIndex].WifiBroadcast = '1';
        $("#color").css("color","red");
    });
    $('#ssid_wifiName').keyup( function() {
        checkInputSsidNameValid($(this).attr('id'),$.trim($(this).val()));
    });
    $('#ssid_wifiName').click( function() {
        clearPasswordStrength();
    });
    hideList();
});
function hideList() {
    if (null == g_wifiFeatureSwitch || '' == g_wifiFeatureSwitch) {
        if (!g_module.multi_ssid_enabled) {
            $('#ssid_list').hide();
        }
    } else {
        if(g_wifiFeatureSwitch.maxapnum == 1) {
            $('#ssid_list').hide();
        }
    }
}