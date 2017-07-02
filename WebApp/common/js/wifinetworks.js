var g_ssid_error_name = "";
var g_ssid_error_mode = "";
//Signal status
var MACRO_EVDO_LEVEL_ZERO = "0";
var MACRO_EVDO_LEVEL_ONE = "1";
var MACRO_EVDO_LEVEL_TWO = "2";
var MACRO_EVDO_LEVEL_THREE = "3";
var MACRO_EVDO_LEVEL_FOUR = "4";
var MACRO_EVDO_LEVEL_FIVE = "5";

var g_priority_wifi_ap_info_list = [];
var g_wifipriorityscanresult = [];
var WiFi_PRIORITY_NUM = 16;
var ap_priority_info = {
    WifiSsid : null,
    WifiSecMode : null,
    Preset : null,
    Index : null,
    Order : null
};
var LENGHT_OF_INDEX = 8;
var LENGTH_OF_ERRMSG = 35;

var ERROR_WRONG_PASSWORD = '117001';

var SECURITY_MODE_NONE = "NONE";

var DIAD_CONNECT = '1';
var DIAD_DISCONNECT = '0';
var WIFI_STATUS_ON = '1';
var WIFI_STATUS_OFF = '0';

var g_MonitoringStatus = '';
var SECURITY_MODE_OPEN = 'OPEN';
var SECURITY_MODE_WEP = 'WEP';
var SECURITY_MODE_WPA_PSK = 'WPA-PSK';
var SECURITY_MODE_WPA2_PSK = 'WPA2-PSK';
var SECURITY_MODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var SECURITY_MODE_WPA_EAP = 'WPA-EAP';
var SECURITY_MODE_WPA2_EAP = 'WPA2-EAP';
var SECURITY_MODE_WPA_WPA2_EAP = 'WPA/WPA2-EAP';
var SECURITY_MODE_WPA_ENTERPRISE = 'WPA_ENTERPRISE';
var SECURITY_MODE_WPA2_ENTERPRISE = 'WPA2_ENTERPRISE';

var g_wifi_ap_info_list = [];
var g_wifiscanresult = [];
var g_isConnecting = false;
var g_isFind = false;
var g_buttonEnabled = true;
var g_sync_connecting = false;

var WIFI_Not_CONNECTED = '-1';
var WIFI_CONNECTING = '900';
var WIFI_CONNECTED = '901';
var WIFI_DISCONNECTED = '902';
var WIFI_DISCONNECTING = '903';
var WIFI_CONNECT_ERROR = '904';

var G3_PREFER = 0;
var WIFI_PREFER = 2;
var WIFI_SCAN_END = '0';
var WIFI_SCANING = '1';

var WIFI_MODE_AUTO = '0';
var WIFI_MODE_MANUAL = '1';

var g_status_wanpolicy = -1;
var g_WifiConnectionStatus = -1;

var g_ap_info = {
    WifiSsid : null,
    WifiSignal : null,
    WifiAuthMode : null,
    WifiSecMode : null,
    WifiNeedPassword : null,
    WifiConnectStatue : WIFI_Not_CONNECTED
};

var g_handover_setting = {
    Handover : '1'
};

var g_wifiscan = {
    Wifiscan : '0'
};

var g_current_id = null;

var g_isNewProfile = false;
var g_isWrongPassWord = false;
var g_current_index = -1;
var g_getHandover = '';
var g_manualflag = false;
var g_checkSimcard_enable = '';

/******************************wispr***************************************************/
var CURRENT_PROFILEENABLE = 1;
var CURRENT_WISPRENABLE = 1;
var WifiWisprEnable ='';
var ERROR_WISPR_PASSWORD = '117004';
/*****************************************8wispr*******************************************/
function main_executeBeforeDocumentReady() {
    getAjaxData('api/wlan/sta-sim-relation', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_checkSimcard_enable = (ret.response.sim_relation == '1' ? true : false);
        }
    }, {
        sync: true
    });
    if(g_checkSimcard_enable) {
        redirectOnCondition(null, "wifinetworks");
    }
}

main_executeBeforeDocumentReady();

$(document).ready( function() {
    /*************************************************8wispr*******/
    $('#wispr_Save').live("click", function() {
        wispr_apply();
    });
    $('#check_wpa_psk').live("click", function() {
        showPassword('wispr_password','check_wpa_psk');
    });
    /*************************************************8wispr*******/
    getWiFiPriorityAPinfo();

    $('.wifi_ap').live('click', function() {
        if(!isCradleStatusOK()) {
            return;
        }
        getWiFiPriorityAPinfo();
        if(WIFI_CONNECTING == G_MonitoringStatus.response.WifiConnectionStatus) {
            return;
        }
        g_current_id = this.id;
        var index = getWiFiIndex(g_current_id);
        if (typeof(g_wifi_ap_info_list[index].profileenable) != 'undefined' && CURRENT_PROFILEENABLE != g_wifi_ap_info_list[index].profileenable) {
            return;
        }
        var WifiSsid = g_wifi_ap_info_list[index].WifiSsid;
        var WifiSecMode = g_wifi_ap_info_list[index].WifiSecMode;
        WifiWisprEnable = g_wifi_ap_info_list[index].wifiwisprenable;
        var wifiWisprUser = g_wifi_ap_info_list[index].wifiwispruser;
        var wifiWisprUwd = g_wifi_ap_info_list[index].wifiwisprpwd;
        refreshNeedPassWord(WifiSsid,WifiSecMode,index);
        if (checkLeftMenu(g_PageUrlTree.settings.internet.wifipriority) && !in_array(g_priority_wifi_ap_info_list,WifiSsid,WifiSecMode,WiFi_PRIORITY_NUM)) {
            var checkOut_Ssid = replaceSpaceOther(g_priority_wifi_ap_info_list[g_priority_wifi_ap_info_list.length-1].WifiSsid);
            var checkOut_SecMode = g_priority_wifi_ap_info_list[g_priority_wifi_ap_info_list.length-1].WifiSecMode;
            var checkOut_Priority ='SSID:'+ checkOut_Ssid + " and " + 'SecMode:' + checkOut_SecMode;
            showConfirmDialog(IDS_wifi_priority_delete_ssid.replace('%s',checkOut_Priority), do_connect, function() {
            });
            return false;
        } else if(typeof(g_wifi_ap_info_list[index].profileenable) != 'undefined' && g_wifi_ap_info_list[index].profileenable != ''
        && WifiWisprEnable == CURRENT_WISPRENABLE && (wifiWisprUser == '' || wifiWisprUwd == '')) {
            wisprSetting(index);
            return false;
        } else {
            //g_current_index = getWiFiIndex(g_current_id);
            if(WIFI_CONNECTED != g_wifi_ap_info_list[index].WifiConnectStatue && WIFI_CONNECTING
            != g_wifi_ap_info_list[index].WifiConnectStatue) {
                showConnectDialog(index);
            }
        }
    });
    $('#pop_connect').live('click', function() {
        if(!isButtonEnable('pop_connect')) {
            return;
        }
        if(!isCradleStatusOK()) {
            $('.dialog').remove();
            $('.login_dialog').remove();
            return;
        }
        if(!g_isWrongPassWord) {
            g_current_index = getWiFiIndex(g_current_id);
        }
        if(g_isWrongPassWord || g_wifi_ap_info_list[g_current_index].WifiNeedPassword) {
            var WifiAuthSecret = $('#wifi_password').val();
            //g_wifi_ap_info_list[g_current_index].WifiAuthSecret = WifiAuthSecret;
            if(checkWifiSecurity(WifiAuthSecret, g_wifi_ap_info_list[g_current_index].WifiSecMode, 'wifi_password')) {
                setWifi(WifiAuthSecret);
            }
        } else {
            setWifi('');
        }
    });
    addStatusListener('CheckWiFiConnectStatue()');

    getHandoverSetting();

    //getWiFiAPinfo();

    $('#turnOff_button').live('click', function() {
        if(!isButtonEnable('turnOff_button')) {
            return;
        }
        if(!isCradleStatusOK()) {
            return;
        }
        g_handover_setting.Handover = '0';
        $('#turnOff_button').removeClass('mouse_on');
        button_enable('turnOff_button', '0');
        setHandoverSetting();
    });
    $('#turnOn_button').live('click', function() {
        if(!isButtonEnable('turnOn_button')) {
            return;
        }
        if(!isCradleStatusOK()) {
            return;
        }
        g_handover_setting.Handover = '2';
        $('#turnOn_button').removeClass('mouse_on');
        button_enable('turnOn_button', '0');
        setHandoverSetting();
    });
    $('#pop_cancel').live('click', function() {
        if(!isButtonEnable('pop_cancel')) {
            return;
        }
        if(g_isNewProfile) {
            removeFromApinfoList(0);
            g_isNewProfile = false;
        }
        g_isWrongPassWord = false;
        promag_cancel();
    });
    $('#pop_authmode').live('change', function() {
        if(SECURITY_MODE_NONE == this.value || SECURITY_MODE_WPA_WPA2_EAP == this.value) {
            $('#password_wrapper').hide();
            $('#password_show').hide();
            $('.addwifi_dialog_table').css({
                height : 'auto'
            });
        } else {
            clearAllErrorLabel();
            $('#password_wrapper').show();
            $('#password_show').show();
            $('.addwifi_dialog_table').css({
                height : 'auto'
            });
        }
    });
    $('#password_show').live('click', function() {
        showPassword('add_wifi_password','check_wpa_psk');
    });
    $('#connect_password_show').live('click', function() {
        showPassword('wifi_password','check_wpa_psk');
    });
    $('#reenter_password_show').live('click', function() {
        showPassword('wifi_password','check_wpa_psk');
    });
    $('#pop_save').live('click', function() {
        if(!isButtonEnable('pop_save')) {
            return;
        }
        if(!isCradleStatusOK()) {
            $('.dialog').remove();
            $('.login_dialog').remove();
            return;
        }
        getWiFiPriorityAPinfo();
        var wifissid = $.trim($('#ssid_input').val());
        var wifiAuthMode = $('#pop_authmode').val();
        var WifiAuthSecret = $('#add_wifi_password').val();
        var index = -1;
        var i = 0;
        if(wifiProfile_validation_checkName(wifissid, WifiAuthSecret, wifiAuthMode)) {
            disconnectConnectedWiFi();
            var wifiProfile = {
                WifiSsid : wifissid,
                WifiAuthMode : '',
                WifiSecMode : wifiAuthMode,
                WifiAuthSecret : WifiAuthSecret
            };
            var g_ap_info = {
                WifiSsid : wifissid,
                WifiSignal : '1',
                WifiAuthMode : '',
                WifiSecMode : wifiAuthMode,
                WifiNeedPassword : false,
                WifiConnectStatue : WIFI_CONNECTING
            };
            for( i ; i < g_wifi_ap_info_list.length; i++) {
                if(wifissid == g_wifi_ap_info_list[i].WifiSsid &&
                wifiAuthMode == g_wifi_ap_info_list[i].WifiSecMode) {
                    index = i;
                    break;
                }
            }
            function isNewProfile() {
                if(-1 != index) {
                    wifiProfile = {
                        WifiSsid : g_wifi_ap_info_list[index].WifiSsid,
                        WifiAuthMode : g_wifi_ap_info_list[index].WifiAuthMode,
                        WifiSecMode : g_wifi_ap_info_list[index].WifiSecMode,
                        WifiAuthSecret : WifiAuthSecret
                    };
                    setProfileSetting(wifiProfile,index);
                } else {
                    g_isNewProfile = true;
                    addToApinfoList(g_ap_info);
                    g_current_index = 0;
                    setProfileSetting(wifiProfile, 0);
                }
                $('#wifi_scan').hide();
                $('#wifi_no_ap').hide();
                $('#wifioffload_setting').show();
                promag_cancel();
            }

            if(checkLeftMenu(g_PageUrlTree.settings.internet.wifipriority) && !in_array(g_priority_wifi_ap_info_list,g_ap_info.WifiSsid,g_ap_info.WifiSecMode,WiFi_PRIORITY_NUM)) {
                promag_cancel();
                var checkOut_Ssid = replaceSpaceOther(g_priority_wifi_ap_info_list[g_priority_wifi_ap_info_list.length-1].WifiSsid);
                var checkOut_SecMode = g_priority_wifi_ap_info_list[g_priority_wifi_ap_info_list.length-1].WifiSecMode;
                var checkOut_Priority ='SSID:'+ checkOut_Ssid + " and " + 'SecMode:' + checkOut_SecMode;
                showConfirmDialog(IDS_wifi_priority_delete_ssid.replace('%s',checkOut_Priority), function() {
                    do_add(wifissid,wifiAuthMode,WifiAuthSecret);
                }, function() {
                });
                return false;
            } else {
                isNewProfile();
            }
        }
        function do_add(wifissid,wifiAuthMode,WifiAuthSecret) {
            var wifiProfile = {
                WifiSsid : wifissid,
                WifiAuthMode : '',
                WifiSecMode : wifiAuthMode,
                WifiAuthSecret : WifiAuthSecret
            };
            var g_ap_info = {
                WifiSsid : wifissid,
                WifiSignal : '1',
                WifiAuthMode : null,
                WifiSecMode : wifiAuthMode,
                WifiNeedPassword : false,
                WifiConnectStatue : WIFI_CONNECTING
            };
            isNewProfile();
        }

    });
    $('#wifi_disconnect').live('click', function() {
        if(!isButtonEnable('wifi_disconnect')) {
            return;
        }
        disconnectWiFi(0);
    });
    $('#scan_button').live('click', function() {
        if(!isButtonEnable('scan_button')) {
            return;
        }
        if(!isCradleStatusOK()) {
            return;
        }
        scanWifi();
    });
    $('#addWiFI_button').live('click', function() {
        if(!isCradleStatusOK()) {
            return;
        }
        addNewWifi();
    });
    $('.dialog_close_btn, .pop_Cancel').live('click', function() {
        if(g_isNewProfile) {
            removeFromApinfoList(0);
            g_isNewProfile = false;
        }
        g_isWrongPassWord = false;
    });
    $('.dialog_close_btn').live('click', function() {
        if(g_isNewProfile) {
            removeFromApinfoList(0);
            g_isNewProfile = false;
        }
    });
});
function refreshNeedPassWord(WifiSsid,WifiSecMode,index) {
    for(i = 0;i < g_wifipriorityscanresult.length; i++) {
        if((g_wifipriorityscanresult[i].WifiSsid==WifiSsid)&&(g_wifipriorityscanresult[i].WifiSecMode==WifiSecMode)) {
            g_wifi_ap_info_list[index].WifiNeedPassword = false;
            return true;
        }
    }
}

function setWifi(WifiAuthSecret) {
    disconnectConnectedWiFi();
    var wifiProfile = {
        WifiSsid : g_wifi_ap_info_list[g_current_index].WifiSsid,
        WifiAuthMode : g_wifi_ap_info_list[g_current_index].WifiAuthMode,
        WifiSecMode : g_wifi_ap_info_list[g_current_index].WifiSecMode,
        WifiAuthSecret : WifiAuthSecret
    };
    g_isWrongPassWord = false;
    setProfileSetting(wifiProfile, g_current_index);
    promag_cancel();
}

function disconnectConnectedWiFi() {
    if(g_wifi_ap_info_list.length > 0) {
        if(WIFI_CONNECTING == g_wifi_ap_info_list[0].WifiConnectStatue || WIFI_CONNECTED == g_wifi_ap_info_list[0].WifiConnectStatue) {
            g_wifi_ap_info_list[0].WifiConnectStatue = WIFI_Not_CONNECTED;
            //disconnectWiFi(0);
        }
    }
}

function promag_cancel() {
    $('#div_wrapper').remove();
    $('.dialog').remove();
    $('.login_dialog').remove();
}

function disconnectWiFi(index) {
    var wifiDial = {
        DialAction : DIAD_DISCONNECT,
        WifiSsid : wifiSsidResolveCannotParseChar(g_wifi_ap_info_list[index].WifiSsid),
        WifiSecMode : g_wifi_ap_info_list[index].WifiSecMode
    };
    var isAddNewAP = false;
    if(WIFI_Not_CONNECTED == g_wifi_ap_info_list[index].WifiConnectStatue) {
        isAddNewAP = true;
    }
    var dial_xml = object2xml('request', wifiDial);
    saveAjaxData('api/wlan/wifidial', dial_xml, function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            log.debug('api/wlan/wifidial ok');
            if(!isAddNewAP) {
                g_wifi_ap_info_list[index].WifiConnectStatue = WIFI_DISCONNECTING;
                moveToTopOfApLsit(g_wifi_ap_info_list[index].WifiSsid,g_wifi_ap_info_list[index].WifiSecMode);
                creatWifiList();
            }
        } else {
            log.debug('api/wlan/wifidial error');
        }
    });
}

function connectWiFi(index) {
    var wifiDial = {
        DialAction : DIAD_CONNECT,
        WifiSsid : wifiSsidResolveCannotParseChar(g_wifi_ap_info_list[index].WifiSsid),
        WifiSecMode : g_wifi_ap_info_list[index].WifiSecMode
    };
    var i = 0;
    var dial_xml = object2xml('request', wifiDial);
    saveAjaxData('api/wlan/wifidial', dial_xml, function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            log.debug('api/wlan/wifidial ok');
            for( i ; i < g_wifi_ap_info_list.length; i++) {
                g_wifi_ap_info_list[i].WifiConnectStatue = WIFI_Not_CONNECTED;
            }
            moveToTopOfApLsit(g_wifi_ap_info_list[index].WifiSsid,g_wifi_ap_info_list[index].WifiSecMode);
            g_wifi_ap_info_list[0].WifiConnectStatue = WIFI_CONNECTING;
            creatWifiList();
            g_sync_connecting = true;
            setTimeout( function() {
                g_sync_connecting = false;
            }, 3000);
            g_current_index = 0;
        } else {
            log.debug('api/wlan/wifidial error');
        }
    }, {
        sync : true
    });

    getAjaxData('api/monitoring/status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            G_MonitoringStatus = ret;
        }
    }, {
        sync : true
    });
}

function setProfileSetting(wifiProfile, index) {

    wifiProfile.WifiSsid = wifiSsidResolveCannotParseChar(wifiProfile.WifiSsid);
    wifiProfile.WifiAuthSecret = wifiSsidResolveCannotParseChar(wifiProfile.WifiAuthSecret);
    var profile_xml = object2xml('request', wifiProfile);
    saveAjaxData('api/wlan/wifiaddprofile', profile_xml, function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            log.debug('api/wlan/wifiaddprofile ok');
            connectWiFi(index);
        } else if(ERROR_SYSTEM_BUSY == ret.error.code) {
            showInfoDialog(common_system_busy);
            $('#wifi_scan').hide();
            $('#wifi_no_ap').show();
            button_enable('addWiFI_button', '1');
            button_enable('scan_button', '1');
            g_buttonEnabled = true;
        } else {
            log.debug('api/wlan/wifiaddprofile error');
        }
    },{
    	enc:true
    });
}

function getWiFiIndex(current_id) {
    var index = current_id.substring(LENGHT_OF_INDEX, current_id.length);
    return parseInt(index, 10);
}

//Button connection or disconnection click effect
function index_clickTrunOnBtn() {

    if(g_module.cradle_enabled) {
    	$('#scan_div').show();
        checkOffloadScanEnabled();
    } else {
        scanWifi();
    }
    $('#wifi_switch_button').html(create_button_html(common_turn_off, "turnOff_button"));
    ieRadiusBorder();

}

function index_clickTurnOffBtn() {

    if(g_module.cradle_enabled) {
    	$('#scan_div').show();
        checkOffloadEnabled();
    }
    $('#wifi_switch_button').html(create_button_html(common_turn_on, "turnOn_button"));
    $('#wifi_content').hide();
    $('#scan_div').hide();
    ieRadiusBorder();

}

function getStatusWanPolicy() {
    if(g_status_wanpolicy != G_MonitoringStatus.response.WanPolicy && g_manualflag == false) {
        g_handover_setting.Handover = G_MonitoringStatus.response.WanPolicy;
        promag_cancel();
        showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
        g_manualflag = true;
        g_getHandover = '';
        g_status_wanpolicy = G_MonitoringStatus.response.WanPolicy;
        setTimeout( function() {
            getHandoverSuccessSetting();
        }, 1500);
    }
}

function getHandoverSetting() {
    getAjaxData("api/wlan/handover-setting", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            if(WIFI_PREFER == ret.response.Handover) {
                g_status_wanpolicy = WIFI_PREFER;
                index_clickTrunOnBtn();
            } else {
                g_status_wanpolicy = G3_PREFER;
                index_clickTurnOffBtn();
            }
        } else {
            log.error("WiFi network: get api/wlan/handover-setting data error");
        }
        if(g_module.multi_ssid_enabled) {
            getAjaxData('api/wlan/multi-switch-settings', function($xml) {
                var ret = xml2object($xml);
                var wlan_multiSsidStatus = ret.response;
                if(wlan_multiSsidStatus.multissidstatus == 1) {
                    button_enable('turnOff_button', '0');
                    button_enable('turnOn_button', '0');
                    showInfoDialog(multi_wifiOffload_message);
                } else {
                    addStatusListener('getStatusWanPolicy()');
                    button_enable('turnOff_button', '1');
                    button_enable('turnOn_button', '1');
                }
            });
        } else {
            addStatusListener('getStatusWanPolicy()');
        }
    });
}

function setHandoverSetting() {
    var handDover_xml = object2xml('request', g_handover_setting);
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    saveAjaxData('api/wlan/handover-setting', handDover_xml, function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            log.debug('api/wlan/handover-setting ok');
            g_getHandover = '';
            g_manualflag = true;
            setTimeout( function() {
                getHandoverSuccessSetting();
            }, 1000);
        } else {
            log.debug('api/wlan/handover-setting error');
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                closeWaitingDialog();
                showInfoDialog(common_system_busy);
            } else {
                closeWaitingDialog();
                showInfoDialog(common_failed);
            }
            if(g_status_wanpolicy == WIFI_PREFER) {
                button_enable('turnOff_button',1);
            } else {
                button_enable('turnOn_button',1);
            }
        }
    }, {
        errorCB: function() {
            setTimeout( function() {
                getHandoverSuccessSetting();
            }, 1000);
        }
    });

}

function getHandoverSuccessSetting() {
    getAjaxData("api/monitoring/status", function($xml) {
        var gstatus_ret = xml2object($xml);
        if(gstatus_ret.type == "response") {
            g_MonitoringStatus = gstatus_ret;
            if(('undefined' != typeof g_MonitoringStatus.response) && (null != g_MonitoringStatus.response.WifiStatus) && ('undefined' != typeof g_MonitoringStatus.response.WifiStatus)
            && ('' != g_MonitoringStatus.response.WifiStatus) && (WIFI_STATUS_ON == g_MonitoringStatus.response.WifiStatus)) {
                var handDover_xml = object2xml('request', g_handover_setting);
                saveAjaxData('api/wlan/handover-setting', handDover_xml, function($xml) {
                    var ret = xml2object($xml);
                    if(ret.type == "error") {
                        g_getHandover = ret.error.code;
                    } else {
                        g_getHandover = '';
                    }
                }, {
                    sync: true
                });
                if(g_getHandover == ERROR_SYSTEM_BUSY) {
                    setTimeout( function() {
                        getHandoverSuccessSetting();
                    }, 1000);
                } else {
                    if(WIFI_PREFER == g_handover_setting.Handover) {
                        g_status_wanpolicy = WIFI_PREFER;
                        index_clickTrunOnBtn();
                    } else {
                        g_status_wanpolicy = G3_PREFER;
                        index_clickTurnOffBtn();
                    }
                    closeWaitingDialog();
                    g_manualflag = false;
                }
            } else {
                setTimeout( function() {
                    getHandoverSuccessSetting();
                }, 1000);
            }
        }
    }, {
        errorCB: function() {
            setTimeout( function() {
                getHandoverSuccessSetting();
            }, 1000);
        },
        sync: true
    });
}

function scanWifi() {
    $('#scan_div').show();
    $('#wifi_scan').show();

    $('#wifi_content').show();
    $('#wifioffload_setting').hide();
    $('#wifi_no_ap').hide();

    button_enable('addWiFI_button', '0');
    button_enable('scan_button', '0');
    g_buttonEnabled = false;

    var scan_xml = object2xml('request', g_wifiscan);
    saveAjaxData('api/wlan/wifiscan', scan_xml, function($xml) {
        var scan_ret = xml2object($xml);
        if(isAjaxReturnOK(scan_ret)) {
            g_wifi_ap_info_list = [];
            checkWifiScanStatue();
        } else if(ERROR_SYSTEM_BUSY == scan_ret.error.code) {
            showInfoDialog(common_system_busy);
            $('#wifi_scan').hide();
            $('#wifi_no_ap').show();
            button_enable('addWiFI_button', '1');
            button_enable('scan_button', '1');
            g_buttonEnabled = true;
        } else {
            log.debug('WiFi network: post api/wlan/wifiscan error');
        }
    });
}

function checkWifiScanStatue() {
    getAjaxData("api/wlan/wifiscan", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            if(WIFI_SCAN_END == ret.response.Wifiscan) {
                getWiFiAPinfo();
            } else if(WIFI_SCANING == ret.response.Wifiscan) {
                setTimeout( function() {
                    checkWifiScanStatue();
                }, 1000);
            } else {
                $('#wifi_scan').hide();
            }
        } else {
            $('#wifi_scan').hide();
            $('#wifi_no_ap').show();
            $('#wifioffload_setting').hide();
            g_wifiscanresult = [];

            button_enable('addWiFI_button', '1');
            button_enable('scan_button', '1');
            g_buttonEnabled = true;
            log.error("WiFi network: get api/wlan/wifiscan  data error");
        }
    });
}

function getWiFiAPinfo() {
    getAjaxData("api/wlan/wifiscanresult", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            g_wifiscanresult = ret.response.SsidLists.SsidList;
            if($.isArray(g_wifiscanresult) ||
            ((typeof (g_wifiscanresult) != 'undefined') && g_wifiscanresult != null && g_wifiscanresult != '')) {
                setWiFiList();
                g_buttonEnabled = true;
                CheckWiFiConnectStatue();
                $('#wifi_scan').hide();
                $('#wifi_no_ap').hide();
                $('#wifioffload_setting').show();
            } else {
                $('#wifi_scan').hide();
                $('#wifi_no_ap').show();
                $('#wifioffload_setting').hide();
                g_wifiscanresult = [];

                button_enable('addWiFI_button', '1');
                button_enable('scan_button', '1');
                g_buttonEnabled = true;
                log.error("WiFi network: get api/wlan/wifiscanresult data empty");
            }
        } else {
            $('#wifi_scan').hide();
            $('#wifi_no_ap').show();
            $('#wifioffload_setting').hide();
            g_wifiscanresult = [];

            button_enable('addWiFI_button', '1');
            button_enable('scan_button', '1');
            g_buttonEnabled = true;
            log.error("WiFi network: get api/wlan/wifiscanresult data error");
        }
    });
}

function CheckWiFiConnectStatue() {
    /* if (G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED ||
    G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTING ||
    G_MonitoringStatus.response.WifiConnectionStatus == WIFI_DISCONNECTING )
    {*/
    //getAjaxData("api/wlan/station-information", function($xml) {
    if(true == g_sync_connecting) {
        return;
    }
    if(G_StationStatus == null || G_StationStatus == '') {
        getAjaxData('api/wlan/station-information', function($xml) {
            var ret_temp = xml2object($xml);
            G_StationStatus = ret_temp;
        }, {
            sync: true
        });
    }
    var ret = G_StationStatus;
    if(ret.type == "response") {
        if(g_wifi_ap_info_list.length > 0) {

            if(ret.response.NetworkName == '' || ret.response.NetworkName == null) {
                g_wifi_ap_info_list[0].WifiConnectStatue = WIFI_Not_CONNECTED;
            } else if(G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED && g_wifi_ap_info_list[0].WifiSsid == ret.response.NetworkName
            && g_wifi_ap_info_list[0].WifiSecMode == ret.response.CurrentSecMode) {
                g_wifi_ap_info_list[0].WifiSignal = ret.response.SignalStrength;
            } else if(!(ret.response.NetworkName == g_wifi_ap_info_list[0].WifiSsid && g_wifi_ap_info_list[0].WifiSecMode == ret.response.CurrentSecMode)) {
                g_wifi_ap_info_list[0].WifiConnectStatue = WIFI_Not_CONNECTED;
                moveToTopOfApLsit(ret.response.NetworkName,ret.response.CurrentSecMode);
                if(g_isFind && G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED) {
                    g_wifi_ap_info_list[0].WifiSignal = ret.response.SignalStrength;
                }
            }
            if(g_isNewProfile &&
            (WIFI_CONNECTING != G_MonitoringStatus.response.WifiConnectionStatus &&
            WIFI_CONNECTED != G_MonitoringStatus.response.WifiConnectionStatus) && g_isWrongPassWord != true) {
                g_isNewProfile = false;
                removeFromApinfoList(0);
                if(g_wifi_ap_info_list.length <= 0) {
                    $('#wifi_no_ap').show();
                    $('#wifioffload_setting').hide();

                    button_enable('addWiFI_button', '1');
                    button_enable('scan_button', '1');
                    g_buttonEnabled = true;
                }
            }
        }
        if (g_stationInfoFlag) {
            g_stationInfoFlag = false;
            return;
        }
        changeWiFiList(ret.response.NetworkName,ret.response.CurrentSecMode);
    } else {
        if(ret.type == 'error') {
            if(ERROR_WRONG_PASSWORD == ret.error.code) {
                g_isWrongPassWord = true;
                g_ssid_error_name = ret.error.message.substring(0,ret.error.message.lastIndexOf(','));
                g_ssid_error_mode = ret.error.message.substring(ret.error.message.lastIndexOf(',')+1,ret.error.message.length);
                if(g_current_index == -1) {
                    moveToTopOfApLsit(g_ssid_error_name,g_ssid_error_mode);
                    creatWifiList();
                    g_current_index = 0;
                    if(g_isFind) {
                        showPasswrodDiag();
                    }
                    g_isFind = false;
                } else {
                    showPasswrodDiag();
                }
            } else if (ERROR_WISPR_PASSWORD == ret.error.code) {
                wisprSetting(g_current_index);
            }
        }
        log.error("WiFi network: get api/wlan/station-information data error");
    }
}

function setWiFiList() {
    g_wifi_ap_info_list = [];
    if($.isArray(g_wifiscanresult)) {
        $.each(g_wifiscanresult, function(i) {
            var ap_info = {
                WifiSsid : g_wifiscanresult[i].WifiSsid,
                WifiSignal : g_wifiscanresult[i].WifiSignal,
                WifiAuthMode : g_wifiscanresult[i].WifiAuthMode,
                WifiSecMode : g_wifiscanresult[i].WifiSecMode,
                WifiNeedPassword : ('1' == g_wifiscanresult[i].WifiNeedPassword ? true : false),
                WifiConnectStatue : WIFI_Not_CONNECTED,
                wifiwisprenable : g_wifiscanresult[i].wifiwisprenable,
                wifiwispruser : g_wifiscanresult[i].wifiwispruser,
                profileenable : g_wifiscanresult[i].profileenable,
                wifiwispruwd : g_wifiscanresult[i].wifiwispruwd
            };
            g_wifi_ap_info_list.push(ap_info);
        });
    } else {
        var ap_info = {
            WifiSsid : g_wifiscanresult.WifiSsid,
            WifiSignal : g_wifiscanresult.WifiSignal,
            WifiAuthMode : g_wifiscanresult.WifiAuthMode,
            WifiSecMode : g_wifiscanresult.WifiSecMode,
            WifiNeedPassword : ('1' == g_wifiscanresult.WifiNeedPassword ? true : false),
            WifiConnectStatue : WIFI_Not_CONNECTED,
            wifiwisprenable : g_wifiscanresult.wifiwisprenable,
            wifiwispruser : g_wifiscanresult.wifiwispruser,
            profileenable : g_wifiscanresult.profileenable,
            wifiwispruwd : g_wifiscanresult.wifiwispruwd
        };
        g_wifi_ap_info_list.push(ap_info);
    }

}

function addToApinfoList(ap_info) {
    g_wifi_ap_info_list.unshift(ap_info);
}

function removeFromApinfoList(index) {
    g_wifi_ap_info_list.splice(index, 1);
}

function moveToTopOfApLsit(NetworkName,CurrentSecMode) {
    var i = 0;
    var index = -1;
    for(i; i < g_wifi_ap_info_list.length; i++) {
        if(NetworkName == g_wifi_ap_info_list[i].WifiSsid &&
        CurrentSecMode == g_wifi_ap_info_list[i].WifiSecMode) {
            index = i;
            break;
        }
    }
    if(-1 != index) {
        var wifi_ap_info = g_wifi_ap_info_list.splice(index, 1);
        g_wifi_ap_info_list.unshift(wifi_ap_info[0]);
        g_isFind = true;
    }
}

function changeWiFiList(NetworkName,CurrentSecMode) {
    if(g_wifi_ap_info_list.length > 0) {
        moveToTopOfApLsit(NetworkName,CurrentSecMode);
        if(g_isFind) {
            g_wifi_ap_info_list[0].WifiConnectStatue = G_MonitoringStatus.response.WifiConnectionStatus;
        } else {
            if(null != NetworkName && '' != NetworkName) {
                var apinfo = {
                    WifiSsid : G_StationStatus.response.NetworkName,
                    WifiSignal : G_StationStatus.response.SignalStrength,
                    WifiAuthMode : null,
                    WifiSecMode : G_StationStatus.response.CurrentSecMode,
                    WifiNeedPassword : false,
                    WifiConnectStatue : G_MonitoringStatus.response.WifiConnectionStatus
                };
                addToApinfoList(apinfo);
            } else {
                g_wifi_ap_info_list[0].WifiConnectStatue = WIFI_Not_CONNECTED;
            }
        }
        g_isFind = false;
        creatWifiList();
    }

}

function creatWifiList() {
    var wifiTableHtml = "";
    var i = 0;
    var wifiSignal = "";

    var isConnecting = false;

    for(i; i < g_wifi_ap_info_list.length; i++) {
        wifiSignal = setWifiSignal(g_wifi_ap_info_list[i].WifiSignal);
        var wifiTrId = "wifi_ap_" + i;
        var wifiSignalId = "wifi_signal_" + i;
        var SecurityMode = "";

        switch(g_wifi_ap_info_list[i].WifiConnectStatue) {
            case WIFI_CONNECTING:
                SecurityMode = dialup_label_connecting;
                break;
            case WIFI_CONNECTED:
                SecurityMode = dialup_label_connected;
                break;

            default:
                if(SECURITY_MODE_NONE == g_wifi_ap_info_list[i].WifiSecMode) {
                    SecurityMode = wlan_label_open;
                } else {
                    SecurityMode = wifi_label_Secure_mode.replace('%s', XSSResolveCannotParseChar(g_wifi_ap_info_list[i].WifiSecMode));
                }
                break;
        }

        var signal_photo = '';
        if(g_wifi_ap_info_list[i].WifiSecMode == SECURITY_MODE_NONE) {
            signal_photo = "../res/station_" + wifiSignal + ".png";
        } else {
            signal_photo = "../res/stationkey_" + wifiSignal + ".gif";
        }
        if ( 'undefined' !=typeof(g_wifi_ap_info_list[i].profileenable) && CURRENT_PROFILEENABLE != g_wifi_ap_info_list[i].profileenable) {
            wifiTableHtml += "<tr class='wifi_ap profile_disable_line' id='" + wifiTrId + "'>";
        } else {
            wifiTableHtml += "<tr class='wifi_ap' id='" + wifiTrId + "'>";
        }
        wifiTableHtml += "<td width='240'>";
        wifiTableHtml += "<div class='wifiName'><span>" + replaceSpaceOther(XSSResolveCannotParseChar(g_wifi_ap_info_list[i].WifiSsid)) + "</span></div>";
        wifiTableHtml += "<div>" + SecurityMode + "</div>";
        wifiTableHtml += "</td>";
        wifiTableHtml += "<td><div class='wifi_signal' ><img  onload = 'fixPNG(this)'  src = " + signal_photo + " /></div>";
        wifiTableHtml += "</td>";
        if ( 'undefined' != typeof(g_wifi_ap_info_list[i].profileenable) && CURRENT_PROFILEENABLE != g_wifi_ap_info_list[i].profileenable) {
            wifiTableHtml += "<td><div class = 'profile_disable'>"+ common_disabled + "</div></td>";
        } else {
            wifiTableHtml += "<td></td>";
        }
        wifiTableHtml += "</tr>";

    }
    $('.wifioffload_settings').html(wifiTableHtml);

    if(g_wifi_ap_info_list.length > 0 && WIFI_CONNECTING == g_wifi_ap_info_list[0].WifiConnectStatue) {
        g_isConnecting = true;
        $('#scan_button').removeClass('mouse_on');
        button_enable('scan_button', '0');
        $('#addWiFI_button').removeClass('mouse_on');
        button_enable('addWiFI_button', '0');
        button_enable('wifi_connect', '0');
    } else {
        g_isConnecting = false;
        if(true == g_buttonEnabled) {
            button_enable('scan_button', '1');
            button_enable('addWiFI_button', '1');

            button_enable('wifi_connect', '1');
        }
    }
}

function showConnectDialog(index) {
    var dialogHtml = '';
    var wifiSecMode = '';
    dialogHtml += "        <div class='addwifi_dialog_table'>";
    dialogHtml += "               <table width='370' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
    dialogHtml += "               <tr id='ssid_div'>";
    dialogHtml += "                   <td hight='32' colspan='2'><p>" + replaceSpaceOther(g_wifi_ap_info_list[index].WifiSsid) + "</p></td>";
    dialogHtml += '               </tr>';
    dialogHtml += '               </table>';
    dialogHtml += "               <table width='370' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
    dialogHtml += "               <tr id='authentication_div'>";
    dialogHtml += "                   <td width='180'><p>"+ wlan_label_authentication  + common_colon + "</p></td>";
    if(SECURITY_MODE_NONE == g_wifi_ap_info_list[index].WifiSecMode) {
        wifiSecMode = wlan_label_open;
    } else {
        wifiSecMode = g_wifi_ap_info_list[index].WifiSecMode;
    }
    dialogHtml += "                   <td><span>" + wifiSecMode + "</span></td>";
    dialogHtml += '               </tr>';
    if(g_wifi_ap_info_list[index].WifiNeedPassword) {
        dialogHtml += "               <tr id='password_wrapper'>";
        dialogHtml += "                   <td width='130'><p>" + common_password + common_colon + "</p></td>";
        dialogHtml += "                   <td><span><input type='password'  autocomplete='off' size='25' id='wifi_password' maxlength='64'/></span></td>";
        dialogHtml += '               </tr>';
        dialogHtml += "               <tr id='connect_password_show'>";
        dialogHtml += "                   <td width='130'>&nbsp;</td>";
        dialogHtml += "                   <td><p><input type='checkbox'  id='check_wpa_psk' style='vertical-align:middle;' />" + ' ' + common_show_password + "</p></td>";
        dialogHtml += '               </tr>';
    }
    dialogHtml += '               </table>';
    dialogHtml += '        </div>';

    showDialog(common_confirm,dialogHtml,common_connect,'pop_connect',common_cancel,'pop_cancel');
    $('#wifi_password').focus();
    if(g_wifi_ap_info_list[index].WifiNeedPassword) {
        $('.addwifi_dialog_table').css({
            height : 'auto'
        });
    } else {
        $('.addwifi_dialog_table').css({
            height : 'auto'
        });
    }
}

function addNewWifi() {
    if(!isButtonEnable('addWiFI_button')) {
        return;
    }
    showAddWiFiDialog();
}

function showAddWiFiDialog() {
    var dialogHtml = '';

    dialogHtml += "        <div class='addwifi_dialog_table'>";
    dialogHtml += "               <div id='ssid_div'>";
    dialogHtml += '                   <p>' + wlan_label_ssid + common_colon + '</p>';
    dialogHtml += "                   <span><input type='text' size='25'  id='ssid_input' maxlength='32'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='authentication_div'>";
    dialogHtml += '               <p>' + IDS_wifi_label_security + common_colon + '</p>';
    dialogHtml += "                   <span>";
    dialogHtml += "                       <select name='authentication_mode' id='pop_authmode'>";
    dialogHtml += "                        <option value='" + SECURITY_MODE_NONE + "'>" + IDS_wlan_label_open + '</option>';
    dialogHtml += "                        <option value='" + SECURITY_MODE_WEP + "'>" + wlan_label_wep + '</option>';
    dialogHtml += "                        <option value='" + SECURITY_MODE_WPA_WPA2_PSK + "'>" + wlan_label_wpa_wpa2_psk + '</option>';
    dialogHtml += '                       </select>';
    dialogHtml += "                   </span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='password_wrapper'>";
    dialogHtml += '                  <p>' + common_password + common_colon + '</p>';
    dialogHtml += "                   <span><input type='password' autocomplete='off' size='25'  id='add_wifi_password' maxlength='64'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='password_show'>";
    dialogHtml += '                  <p><input type="checkbox"  id="check_wpa_psk" style="vertical-align:middle;"/>' + " " + common_show_password + '</p>';
    dialogHtml += '               </div>';
    dialogHtml += '         </div>';

    showDialog(wifi_label_addwifi_network,dialogHtml,common_connect,'pop_save',common_cancel,'pop_cancel');
    $('#password_wrapper').hide();
    $('#password_show').hide();
    $('#ssid_input').focus();
    $('#ssid_input').keyup( function() {
        checkInputSsidNameValid($(this).attr('id'),$.trim($(this).val()));
    });
}

function wifiProfile_validation_checkName(wifissid, WifiAuthSecret, wifiAuthMode) {
    clearAllErrorLabel();
    var errMsg = null;
    var name = $.trim($('#ssid_input').val());
    if(g_wifiFeatureSwitch.chinesessid_enable == '1') {
        errMsg = checkInputSsidNameValid("ssid_input",name);
    } else {
        errMsg = validateSsid(name);
    }
    if(common_ok != errMsg) {
        showErrorUnderTextbox('ssid_input', errMsg);
        $('#ssid_input').focus();
        $('#ssid_input').select();
        return false;
    } else if(!checkWifiSecurity(WifiAuthSecret, wifiAuthMode, 'add_wifi_password')) {
        return false;
    }
    return true;
}

function showErrorUnderTextField(id,errMsg) {
    $.each($('.pro_wrong'), function(i) {
        $(this).remove();
    });
    var wrongHtml = "<tr class='pro_wrong'>";
    wrongHtml += '<td>&nbsp;</td>';
    wrongHtml += "<td colspan='2' class='pro_wrong_td clr_red' id='temp_wrong'>&nbsp;</td>";
    wrongHtml += '</tr>';
    $('#'+id).focus();
    $('#password_wrapper').after(wrongHtml);
    $('#temp_wrong').attr('id', 'pro_name_wrong');
    $('#pro_name_wrong').html(errMsg);
    if(errMsg.length > LENGTH_OF_ERRMSG) {
        $('.addwifi_dialog_table').css({
            height : 'auto'
        });
    } else {
        $('.addwifi_dialog_table').css({
            height : 'auto'
        });
    }

}

function showPasswrodDiag() {

    var dialogHtml = '';
    var dialogInfo = '';

    if(g_isWrongPassWord) {
        dialogInfo = wifi_label_wrong_passwrod_notice;
    } else {
        dialogInfo = wifi_label_passwrod_notice;
    }

    dialogHtml += "        <div class='password_dialog_table'>";
    dialogHtml += "               <table width='370' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
    dialogHtml += "               <div id='intput_password_wrapper'>";
    dialogHtml += "                  <tr><td width='20'>&nbsp;</td><td><p>" + dialogInfo + "</p></td></tr>";
    dialogHtml += "                   <tr id='password_wrapper'><td width='20'>&nbsp;</td><td><p><span><input type='password' autocomplete='off' size='25' id='wifi_password' maxlength='64'/></span></p></td></tr>";
    dialogHtml += "                   <tr ><td width='20'>&nbsp;</td><td><div id='reenter_password_show'><p><input type='checkbox'  id='check_wpa_psk' style='vertical-align:middle;'/>" +" "+ common_show_password + '</p></div></td></tr>';
    dialogHtml += '               </div>';
    dialogHtml += '               </table>';
    dialogHtml += '        </div>';

    showDialog(wlan_lable_notice,dialogHtml,common_connect,'pop_connect',common_cancel,'pop_cancel');
    $('#wifi_password').focus();

}

function getWiFiPriorityAPinfo() {
    getAjaxData("api/wlan/wifiprofile", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            if('undefined' != typeof (ret.response.SsidLists.SsidList)) {
                g_wifipriorityscanresult = CreateArray(ret.response.SsidLists.SsidList);
                if($.isArray(g_wifipriorityscanresult) ||
                ((typeof (g_wifipriorityscanresult) != 'undefined') && g_wifipriorityscanresult != null && g_wifipriorityscanresult != '')) {
                    setWiFiPriorityList();
                }
            } else {
                g_wifipriorityscanresult = [];
                log.error("WiFi network: get api/wlan/profile-information data error");
            }
        } else {
            g_wifipriorityscanresult = [];
            log.error("WiFi network: get api/wlan/profile-information data error");
        }
    }, {
        sync: true
    });
}

function setWiFiPriorityList() {
    g_priority_wifi_ap_info_list = [];
    if($.isArray(g_wifipriorityscanresult)) {
        $.each(g_wifipriorityscanresult, function(i) {
            var ap_priority_info = {
                WifiSsid : g_wifipriorityscanresult[i].WifiSsid,
                WifiSecMode : g_wifipriorityscanresult[i].WifiSecMode,
                Preset : g_wifipriorityscanresult[i].Preset,
                Index : g_wifipriorityscanresult[i].Index,
                Order : g_wifipriorityscanresult[i].Order
            };
            g_priority_wifi_ap_info_list.push(ap_priority_info);
        });
    } else {
        var ap_priority_info = {
            WifiSsid : g_wifipriorityscanresult.WifiSsid,
            WifiSecMode : g_wifipriorityscanresult.WifiSecMode,
            Preset : g_wifipriorityscanresult.Preset,
            Index : g_wifipriorityscanresult.Index,
            Order : g_wifipriorityscanresult.Order
        };
        g_priority_wifi_ap_info_list.push(ap_priority_info);
    }
}

function in_array(list,ssid,secmode,length) {
    var i;
    if(list.length<length) {
        return true;
    }
    for(i = 0;i < list.length; i++) {
        if((list[i].WifiSsid==ssid)&&(list[i].WifiSecMode==secmode)) {
            return true;
        }
    }
    return false;
}

function do_connect() {
    g_current_index = getWiFiIndex(g_current_id);
    if(g_wifi_ap_info_list[g_current_index].WifiNeedPassword) {
        /*showPasswrodDiag();*/
        var index = getWiFiIndex(g_current_id);
        if(WIFI_CONNECTED != g_wifi_ap_info_list[index].WifiConnectStatue && WIFI_CONNECTING != g_wifi_ap_info_list[index].WifiConnectStatue) {
            showConnectDialog(index);
        }
    } else {
        disconnectConnectedWiFi();
        var wifiProfile = {
            WifiSsid : g_wifi_ap_info_list[g_current_index].WifiSsid,
            WifiAuthMode : g_wifi_ap_info_list[g_current_index].WifiAuthMode,
            WifiSecMode : g_wifi_ap_info_list[g_current_index].WifiSecMode,
            WifiAuthSecret : ''
        };
        g_isNewProfile = false;
        setProfileSetting(wifiProfile, g_current_index);
    }
}

/*****************************************************wispr**********************************/
function wisprSetting(index) {
    var dialogHtml = '';
    var wifiSecMode = '';
    dialogHtml += "        <div class='addwifi_dialog_table'>";
    dialogHtml += "               <table width='370' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
    dialogHtml += "               <tr id='ssid_div'>";
    dialogHtml += "                   <td hight='32' colspan='2'><p>" + replaceSpaceOther(g_wifi_ap_info_list[index].WifiSsid) + "</p></td>";
    dialogHtml += '               </tr>';
    dialogHtml += '               </table>';
    dialogHtml += "               <table width='370' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
    dialogHtml += "               <tr id='authentication_div'>";
    dialogHtml += "                   <td width='180'><p>"+ wlan_label_authentication  + common_colon + "</p></td>";
    if(SECURITY_MODE_NONE == g_wifi_ap_info_list[index].WifiSecMode) {
        wifiSecMode = wlan_label_open  +" "+ common_comma +" " + IDS_wlan_wispr_title;
    } else {
        wifiSecMode = g_wifi_ap_info_list[index].WifiSecMode +" "+ common_comma +" " + IDS_wlan_wispr_title;
    }
    dialogHtml += "                   <td><span>" + wifiSecMode + "</span></td>";
    dialogHtml += '               </tr>';
    dialogHtml += "               <tr>";
    dialogHtml += "                   <td width='130'><p>" + dialup_label_user_name + common_colon + "</p></td>";
    dialogHtml += "                   <td><span><input type='username' size='25'  id='wispr_username' /></span></td>";
    dialogHtml += '               </tr>';
    dialogHtml += "               <tr>";
    dialogHtml += "                   <td width='130'><p>" + common_password + common_colon + "</p></td>";
    dialogHtml += "                   <td><span><input type='password'  autocomplete='off' size='25' id='wispr_password' /></span></td>";
    dialogHtml += '               </tr>';
    dialogHtml += "               <tr id='connect_password_show'>";
    dialogHtml += "                   <td width='130'>&nbsp;</td>";
    dialogHtml += "                   <td><p><input type='checkbox'  id='check_wpa_psk' style='vertical-align:middle;' />" + ' ' + common_show_password + "</p></td>";
    dialogHtml += '               </tr>';
    dialogHtml += '               </table>';
    dialogHtml += '        </div>';
    showDialog(common_confirm,dialogHtml,common_save,'wispr_Save',common_cancel,'pop_cancel');
    $('#wispr_username').focus();
    $('.addwifi_dialog_table').css({
        height : 'auto'
    });
}

function wispr_apply() {
    var wisprMame = $.trim($('#wispr_username').val());
    var  wisprPsd =$.trim($('#wispr_password').val());
    if (!isButtonEnable('wispr_Save')) {
        return;
    }
    var validElement = {
        Username: wisprMame,
        Password: wisprPsd
    };
    var be_valid = wispr_validInput(validElement, 'wispr_username','wispr_password');
    if (be_valid) {
        if(!g_isWrongPassWord) {
            g_current_index = getWiFiIndex(g_current_id);
        }
        var wifiProfile = {
            WifiSsid : wifiSsidResolveCannotParseChar(g_wifi_ap_info_list[g_current_index].WifiSsid),
            WifiAuthMode : g_wifi_ap_info_list[g_current_index].WifiAuthMode,
            WifiSecMode : g_wifi_ap_info_list[g_current_index].WifiSecMode,
            WifiAuthSecret : wifiSsidResolveCannotParseChar(g_wifi_ap_info_list[g_current_index].WifiAuthSecret),
            wifiwispruser : wisprMame,
            wifiwisprpwd : wisprPsd
        };
        var profile_xml = object2xml('request', wifiProfile);
        promag_cancel();
        saveAjaxData('api/wlan/wifiaddprofile', profile_xml, function($xml) {
            var ret = xml2object($xml);
            if(isAjaxReturnOK(ret)) {
                log.debug('api/wlan/wifiaddprofile ok');
                do_connect();

                //connectWiFi(index);
            } else if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
                $('#wifi_scan').hide();
                $('#wifi_no_ap').show();
                button_enable('addWiFI_button', '1');
                button_enable('scan_button', '1');
                g_buttonEnabled = true;
            } else {
                log.debug('api/wlan/wifiaddprofile error');
            }
        },{
        	enc:true
        });
    }
}

function checkOffloadScanEnabled() {
    if(!checkValueIsNull(G_cradleStationStatus)) {
        setTimeout(checkOffloadScanEnabled, 50);
        return;
    }
    if(g_module.cradle_enabled && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE != G_cradleStationStatus.connectionmode) {
        var offload_disabled_start = IDS_function_disabled.replace('%s1','cradle');
        var offload_disabled = offload_disabled_start.replace('%s2','offload');
        showInfoDialog(offload_disabled, false, disableEntirePage);
    } else {
        scanWifi();
    }
}

function getCradleStatus() {
    if (g_module.cradle_enabled) {
        getAjaxData('api/cradle/status-info', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                G_cradleStationStatus = ret.response;
            }
        }, {
            sync: true
        });
    }
}

function isCradleStatusOK() {
    getCradleStatus();
    if(g_module.cradle_enabled && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE != G_cradleStationStatus.connectionmode) {
        var offload_disabled_start = IDS_function_disabled.replace('%s1','cradle');
        var offload_disabled = offload_disabled_start.replace('%s2','offload');
        showInfoDialog(offload_disabled, false, disableEntirePage);
        button_enable('scan_button', '0');
        $('#wifi_content').hide();
        $('#addWiFI_button').hide();
        g_buttonEnabled = false;
        return false;
    }
    return true;
}