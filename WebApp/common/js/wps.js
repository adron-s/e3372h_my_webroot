var infomsg =
"<table cellpadding='0' align='center' cellspacing='0'>" +
"<tr height='32'>" +
"<td width='400' colspan='2'>" + IDS_wlan_message_n_mode_forbidden_wps + '</td>' +
'</tr>' +
'<tr>' +
"<td colspan='2'><hr/></td>" +
'</tr>' +
'<tr>' +
"<td width='200' class = 'wps_forbidden_message'>" + wlan_label_wlan_module + common_colon + '</td>' +
"<td width='200' class = 'wps_forbidden_message'>" + common_disable + '</td>' +
'</tr>' +
'<tr>' +
"<td width='200' class = 'wps_forbidden_message'>" + IDS_wlan_label_80211_authentication + common_colon + ' </td>' +
"<td width='200' class = 'wps_forbidden_message' id = 'wps_forbidden'> </td >" +
'</tr>' +
'<tr>' +
"<td width='200' class = 'wps_forbidden_message'>" + wlan_label_ssid_broadcast + common_colon + '</td>' +
"<td width='200' class = 'wps_forbidden_message'>" + common_disable + '</td>' +
'</tr>' +
'</table>'; 
var cancelWaiting =
"<tr>" +
"<td><div class='cancel_waitDIV'>"+
"<span class='button_wrapper wait_Cancel'>"+
"<input id='pop_Cancel' class='button_dialog' type='button' value='"+common_cancel+"'/></span>"+
"</div></td>"+
"</tr>"
var WPS_NOTICE_TIME = 20000;          
var mainssid2 = '';
var g_wps_dataVlaue = '';
var defult_wpsAp = null;
var WPS_VERIFY_PIN_1 = 1;
var WPS_VERIFY_PIN_3 = 3;
var PBC_CONNECT_FAILED = '0';
var PBC_CONNECTING = '1';
var PBC_CONNECT_SUCCESS = '2';
var PBC_GET_STATUS_INTERVAL = 5000;
var PBC_WAITING_TIMEOUT = 180000;
var pbcGetStatusTimer = null;
var pbcWaitingTimer = null;
var DOUBLECHIP = 1;
var g_wlan_secInfo_ex = [];
var g_wps_flag = false;
var g_wps_flag_2g = false;
var g_wps_flag_5g = false;
var defult_pincode = '';
var IDS_wlan_fre_0 = '2.4GHz';
var IDS_wlan_fre_1 = '5GHz';
var g_wlan_Data = [];
var g_wlanStatus = true;
var g_wlanStatus_5g = true;
var g_wps_basicData = [];
var g_security_modewep = 1;
var g_wpspin = 0;
var g_wpspbc = 0;
var g_wpsappin = 0;
var WPS_CONNECTSUCCEED = 117005;
var g_wps_config = '';
getDeviceConfig();

$(document).ready( function() {
    button_enable('apply_button', '1');
    $('input[name=connect_mode]').bind('change', function(e) {
        clearAllErrorLabel();
        if($('#pin_mode').get(0).checked) {
            $('.pbc_show').hide();
            $('.pin_show').show();
        } else if($('#pbc_mode').get(0).checked) {
            $('.pbc_show').show();
            $('.pin_show').hide();
        }

    });
    $('#input_WPSPin').live('click', function() {
        $('#pin_mode').get(0).checked=true;
        $('.pbc_show').hide();
        $('.pin_show').show();
    });
    wps_initPage();

    $('#select_frequency').live('change', function() {
        if($('#select_frequency').val() == 0) {
            if(g_wps_flag_2g) {
                button_enable('apply_button', '1');
                $("input[name=connect_mode]").removeAttr('disabled', true);
                $("#input_WPSPin").removeAttr('disabled', true);

            } else {
                button_enable('apply_button', '0');
                $("input[name=connect_mode]").attr('disabled', true);
                $("#input_WPSPin").attr('disabled', true);
                showErrorDialog();
            }
        }
        if($('#select_frequency').val() == 1) {
            if(g_wps_flag_5g) {
                button_enable('apply_button', '1');
                $("input[name=connect_mode]").removeAttr('disabled', true);
                $("#input_WPSPin").removeAttr('disabled', true);
            } else {
                button_enable('apply_button', '0');
                $("input[name=connect_mode]").attr('disabled', true);
                $("#input_WPSPin").attr('disabled', true);
                showErrorDialog();
            }
        }

    });
    $('input[name=radio]').live('click', function() {
        var wps_enable = '';
        if ($('#appinenable').get(0).checked) {
            wps_enable = 1;
        } else {
            wps_enable = 0;
            button_enable('default_button', '0');
            button_enable('rand_button', '0');
            button_enable('apply_button', '0');
            $('input:not(#appinenable,#appindisable)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
        }
        saveWpsEnable(wps_enable);
    });
    $("#pop_Cancel").live('click', function() {
        if (!isButtonEnable('pop_Cancel')) {
            return;
        }
        button_enable('pop_Cancel', '0');
        var cancelWps = {
                cancelwps: '1'
            };
        var wps_cancel = object2xml('request', cancelWps);
        saveAjaxData('api/wlan/wps-cancel', wps_cancel, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                clearTimeout(pbcGetStatusTimer);
                wps_pbc_connect_status();
            } else {
                clearTimeout(pbcGetStatusTimer);
                wps_pbc_connect_status();
            }
        });
    });
    $("#apply_button").live('click', function() {
        if (!isButtonEnable('apply_button')) {
            return;
        }
        wps_apply();
    });
});
function getDeviceConfig() {
    getConfigData('config/wifi/configure.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret) {
            g_wps_config = config_ret.wifiwps.wpspinpbc;
            if(g_wps_config == 0){
                g_wpspin = 1;
                g_wpspbc = 0;
                g_wpsappin = 0;
            } else if(g_wps_config == 1){
                g_wpspin = 1;
                g_wpspbc = 1;
                g_wpsappin = 0;
            } else if(g_wps_config == 2){
                g_wpspin = 0;
                g_wpspbc = 1;
                g_wpsappin = 0;
            } else if(g_wps_config == 3){
                g_wpspin = 0;
                g_wpspbc = 0;
                g_wpsappin = 1;
            } else if(g_wps_config == 4){
                g_wpspin = 1;
                g_wpspbc = 0;
                g_wpsappin = 1;
            } else if(g_wps_config == 5){
                g_wpspin = 1;
                g_wpspbc = 1;
                g_wpsappin = 1;
            } else if(g_wps_config == 6){
                g_wpspin = 0;
                g_wpspbc = 1;
                g_wpsappin = 1;
            }
        }
    }, {
        sync: true
    });
    if(null != g_wifiFeatureSwitch && DOUBLECHIP == g_wifiFeatureSwitch.isdoublechip) {
        getAjaxData('api/wlan/multi-security-settings-ex', function($xml) {
            var ret = xml2object($xml);
            var temp = ret.response.ssids.ssid;
            g_wlan_Data = CreateArray(temp);
            g_wlanStatus = g_wlan_Data[0].WifiEnable == '1' ? true : false;
            if (g_wifiFeatureSwitch != null && g_wifiFeatureSwitch.maxapnum == 2) {
                getAjaxData('api/wlan/multi-switch-settings', function($xml) {
                    var ret = xml2object($xml);
                    if ('response' == ret.type) {
                        g_wlan_multiSsidStatus = ret.response;
                        g_wlanStatus_5g = g_wlan_multiSsidStatus.multissidstatus == '1' ? true : false;
                    }
                }, {
                    sync: true                 
                });
            } else {
                var i = 0 ;
                for(i = 0; i<g_wlan_Data.length; i++) {
                    if( g_wlan_Data[i].WifiMode == "a/n/ac" || g_wlan_Data[i].WifiMode == "a/n" || g_wlan_Data[i].WifiMode == "a") {
                        g_wlanStatus_5g = g_wlan_Data[i].WifiEnable == '1' ? true : false;
                        break;
                    }
                }
            }
        }, {
            sync: true
        });
    }
}

function showErrorDialog() {
    if ('1' == g_wifiFeatureSwitch.opennonewps_enable) {
        showInfoDialog(infomsg,WPS_NOTICE_TIME);
        button_enable('apply_button', '0');
        $('#wps_forbidden').html(wlan_label_wep);
        g_security_modewep = 0;
    } else {
        showInfoDialog(infomsg,WPS_NOTICE_TIME);
        button_enable('apply_button', '0');
        $('#wps_forbidden').html(IDS_wlan_label_open + '/' + wlan_label_wep);
        g_security_modewep = 0;
    }
}

function wps_singleSSID_getConfig() {
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        if (0 == ret.response.WifiEnable || 1 == ret.response.WifiHide) {
            if (null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
                setTimeout( function() {
                    button_enable('apply_button', '0');
                    showInfoDialog(infomsg,WPS_NOTICE_TIME);
                    $('#wps_forbidden').html(wlan_label_wep);
                }, 500);
                g_security_modewep = 0;
                $('input:not(#lang)').attr('disabled', true);
                $('select:not(#lang)').attr('disabled', true);
                return;
            } else {
                setTimeout( function() {
                    button_enable('apply_button', '0');
                    showInfoDialog(infomsg,WPS_NOTICE_TIME);
                    $('#wps_forbidden').html(IDS_wlan_label_open + '/' + wlan_label_wep);
                }, 500);
                g_security_modewep = 0;
                $('input:not(#lang)').attr('disabled', true);
                $('select:not(#lang)').attr('disabled', true);
                return;
            }
        }
        getAjaxData('api/wlan/security-settings', function($xml) {
            var ret = xml2object($xml);
            if (null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
                if ('AUTO' == ret.response.WifiAuthmode || ('OPEN' == ret.response.WifiAuthmode && 'WEP' == ret.response.WifiBasicencryptionmodes) || 'SHARE' == ret.response.WifiAuthmode) {
                    setTimeout( function() {
                        button_enable('apply_button', '0');
                        showInfoDialog(infomsg,WPS_NOTICE_TIME);
                        $('#wps_forbidden').html(wlan_label_wep);
                    }, 500);
                    g_security_modewep = 0;
                    $('input:not(#lang)').attr('disabled', true);
                    $('select:not(#lang)').attr('disabled', true);
                    return;
                }
                button_enable('apply_button', '1');
            } else {
                if ('AUTO' == ret.response.WifiAuthmode || 'OPEN' == ret.response.WifiAuthmode || 'SHARE' == ret.response.WifiAuthmode) {
                    setTimeout( function() {
                        button_enable('apply_button', '0');
                        showInfoDialog(infomsg,WPS_NOTICE_TIME);
                        $('#wps_forbidden').html(IDS_wlan_label_open + '/' + wlan_label_wep);
                    }, 500);
                    g_security_modewep = 0;
                    $('input:not(#lang)').attr('disabled', true);
                    $('select:not(#lang)').attr('disabled', true);
                    return;
                }
            }
        });
    }, {
        sync: true
    }, {
        sync: true
    });
}

function wps_multiSSID_getConfig() {
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        var ret = xml2object($xml);
        if (0 == ret.response.WifiEnable) {
            if (null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
                button_enable('apply_button', '0');
                setTimeout( function() {
                    showInfoDialog(infomsg,WPS_NOTICE_TIME);
                    $('#wps_forbidden').html(wlan_label_wep);
                }, 500);
                g_security_modewep = 0;
                $('input:not(#lang)').attr('disabled', true);
                $('select:not(#lang)').attr('disabled', true);
                return;
            } else {
                button_enable('apply_button', '0');
                setTimeout( function() {
                    showInfoDialog(infomsg,WPS_NOTICE_TIME);
                    $('#wps_forbidden').html(IDS_wlan_label_open + '/' + wlan_label_wep);
                }, 500);
                g_security_modewep = 0;
                $('input:not(#lang)').attr('disabled', true);
                $('select:not(#lang)').attr('disabled', true);
                
                return;
            }
        }
        getAjaxData('api/wlan/multi-basic-settings', function($xml) {
            var ret = xml2object($xml);
            g_wps_basicData = CreateArray(ret.response.Ssids.Ssid);
            if(null != g_wifiFeatureSwitch){
                if(g_wifiFeatureSwitch.wps_switch_enable == 1 && g_wps_basicData[0].WifiWpsenbl == '0'){
                    $('#appindisable').get(0).checked = true;
                    $('input:not(#appinenable,#appindisable)').attr('disabled', true);
                    $('select:not(#lang)').attr('disabled', true);
                    button_enable('apply_button', '0');
                } else if(g_wifiFeatureSwitch.wps_switch_enable == 1 && g_wps_basicData[0].WifiWpsenbl == '1'){
                    $('#appinenable').get(0).checked = true;
                } 
            }
            
            if (null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
                if ('AUTO' == g_wps_basicData[0].WifiAuthmode || ('OPEN' == g_wps_basicData[0].WifiAuthmode && 'WEP' == g_wps_basicData[0].WifiBasicencryptionmodes) ||
                'SHARE' == g_wps_basicData[0].WifiAuthmode || (!(g_wps_basicData[0].WifiEnable == 1 && g_wps_basicData[0].WifiBroadcast == 0) ) ) {
                    button_enable('apply_button', '0');
                    setTimeout( function() {
                        showInfoDialog(infomsg,WPS_NOTICE_TIME);
                        $('#wps_forbidden').html(wlan_label_wep);
                    }, 500);
                    g_security_modewep = 0;
                    $('input:not(#lang)').attr('disabled', true);
                    $('select:not(#lang)').attr('disabled', true);
                    return;
                }
            } else {
                if ('AUTO' == g_wps_basicData[0].WifiAuthmode || 'OPEN' == g_wps_basicData[0].WifiAuthmode || 'SHARE' == g_wps_basicData[0].WifiAuthmode ||
                (!(g_wps_basicData[0].WifiEnable == 1 && g_wps_basicData[0].WifiBroadcast == 0) ) ) {
                    button_enable('apply_button', '0');
                    setTimeout( function() {
                        showInfoDialog(infomsg,WPS_NOTICE_TIME);
                        $('#wps_forbidden').html(IDS_wlan_label_open + '/' + wlan_label_wep);
                    }, 500);
                    g_security_modewep = 0;
                    $('input:not(#lang)').attr('disabled', true);
                    $('select:not(#lang)').attr('disabled', true);
                    return;
                }
            }
        }, {
            sync: true
        });
    }, {
        sync: true
    });
}

function wps_multiSSID_getConfig_ex() {
    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wps_basicData = CreateArray(ret.response.Ssids.Ssid);
        var ssidnum = g_wps_basicData.length;
        mainssid2 = g_wps_basicData.length/2;
        if(!(g_wlanStatus && g_wps_basicData[0].WifiBroadcast == 0) && !(g_wlanStatus_5g && g_wps_basicData[mainssid2].WifiBroadcast == 0)) {
            button_enable('apply_button', '0');
            g_security_modewep = 0;
            showInfoDialog(infomsg,WPS_NOTICE_TIME);
            $('input:not(#lang)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
        }

        if(null != g_wifiFeatureSwitch && '1' == g_wifiFeatureSwitch.opennonewps_enable) {
            if(g_wps_basicData[0].WifiEnable == 1 && g_wps_basicData[0].WifiBroadcast == 0
            && (g_wps_basicData[0].WifiAuthmode == 'WPA2-PSK'
            || g_wps_basicData[0].WifiAuthmode == 'WPA/WPA2-PSK'
            || ('OPEN' == g_wps_basicData[0].WifiAuthmode
            && 'NONE' == g_wps_basicData[0].WifiBasicencryptionmodes) ) ) {
                g_wps_flag_2g = true;
            }

            if(g_wlanStatus_5g == 1 && g_wps_basicData[mainssid2].WifiBroadcast == 0
            && (g_wps_basicData[mainssid2].WifiAuthmode == 'WPA2-PSK'
            || g_wps_basicData[mainssid2].WifiAuthmode == 'WPA/WPA2-PSK'
            || ('OPEN' == g_wps_basicData[mainssid2].WifiAuthmode
            && 'NONE' == g_wps_basicData[mainssid2].WifiBasicencryptionmodes) ) ) {
                g_wps_flag_5g = true;
            }
        } else {
            if(g_wps_basicData[0].WifiEnable == 1 && g_wps_basicData[0].WifiBroadcast == 0
            && (g_wps_basicData[0].WifiAuthmode == 'WPA2-PSK'
            || g_wps_basicData[0].WifiAuthmode == 'WPA/WPA2-PSK') ) {
                g_wps_flag_2g = true;
            }

            if(g_wlanStatus_5g == 1 && g_wps_basicData[mainssid2].WifiBroadcast == 0
            && (g_wps_basicData[mainssid2].WifiAuthmode == 'WPA2-PSK'
            || g_wps_basicData[mainssid2].WifiAuthmode == 'WPA/WPA2-PSK') ) {
                g_wps_flag_5g = true;
            }
        }
        if( !g_wps_flag_2g && g_wps_config != 3) {
            button_enable('apply_button', '0');
            $("input[name=connect_mode]").attr('disabled', true);
            $("#input_WPSPin").attr('disabled', true);
            showErrorDialog();
        }
        if(!g_wps_flag_2g && !g_wps_flag_5g) {
            showErrorDialog();
            $('input:not(#lang)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
        } else {
            g_wps_flag = true ;
        }
        if(g_wifiFeatureSwitch.wps_switch_enable == 1 && g_wps_basicData[0].WifiWpsenbl == '0'){
            $('#appindisable').get(0).checked = true;
            $('input:not(#appinenable,#appindisable)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
            button_enable('apply_button', '0');
        } else if(g_wifiFeatureSwitch.wps_switch_enable == 1 && g_wps_basicData[0].WifiWpsenbl == '1'){
            $('#appinenable').get(0).checked = true;
        }
    }, {
        sync: true
    });
}

function wps_initPage() {
    if (null != g_wifiFeatureSwitch && DOUBLECHIP != g_wifiFeatureSwitch.isdoublechip) {
        
        if(g_wifiFeatureSwitch.wps_switch_enable == 1){
            $('.appin_off_no').show();
        }else{
            $('.appin_off_no').hide();
        }
        
        if(1 == g_wpsappin){
            $('.appin_show').show();
        } else if(0 == g_wpsappin){
            $('.appin_show').hide();
        }
        if(1 == g_wpspin && 0 == g_wpspbc){
            $('.pbc_pin').show();
            $('.pbc_block').hide();
            $('.pbc_show').hide();
            $('.pin_show').show();
            $('#pin_mode').attr('checked', true);
        } else if (0 == g_wpspin && 1 == g_wpspbc){
            $('.pbc_pin').show();
            $('.pin_block').hide();
            $('#pbc_mode').attr('checked', true);
            $('.pbc_show').show();
            $('.pin_show').hide();
        } else if(1 == g_wpspin && 1 == g_wpspbc){
            $('.pbc_pin').show();
            $('#pin_mode').attr('checked', true);
            $('.pbc_show').hide();
            $('.pin_show').show();
        } else {
            $('.pbc_pin').hide();
        }
        $('.work_frequency').hide();
        wps_multiSSID_getConfig();
        getAjaxData('api/wlan/wps', function($xml) {
            var ret = xml2object($xml);
            if(ret.type == 'response'){
                g_wps_dataVlaue = ret.response;
                defult_pincode = g_wps_dataVlaue.WPSPin;
            }
        }, {
            sync: true
        });
        if(1 == g_wpsappin) {
            wpsget_initappin();
        }
    } else {
        if(g_wifiFeatureSwitch.wps_switch_enable == 1){
            $('.appin_off_no').show();
        }else{
            $('.appin_off_no').hide();
        }
        $('#select_frequency option').remove();
        $('#select_frequency').append("<option value='0'>" + IDS_wlan_fre_0 + "</option>");
        $('#select_frequency').append("<option value='1'>" + IDS_wlan_fre_1 + "</option>");
        
        if(1 == g_wpsappin){
            $('.appin_show').show();
        } else if(0 == g_wpsappin){
            $('.appin_show').hide();
        }
        if(1 == g_wpspin && 0 == g_wpspbc){
            $('.pbc_pin').show();
            $('.pbc_block').hide();
            $('.work_frequency').show();
            $('.pbc_show').hide();
            $('.pin_show').show();
            $('#pin_mode').attr('checked', true);
        } else if (0 == g_wpspin && 1 == g_wpspbc){
            $('.pbc_pin').show();
            $('.pin_block').hide();
            $('.work_frequency').show();
            $('#pbc_mode').attr('checked', true);
            $('.pbc_show').show();
            $('.pin_show').hide();
        } else if(1 == g_wpspin && 1 == g_wpspbc){
            $('.pbc_pin').show();
            $('.work_frequency').show();
            $('#pin_mode').attr('checked', true);
            $('.pbc_show').hide();
            $('.pin_show').show();
        } else {
            $('.pbc_pin').hide();
        }
        wps_multiSSID_getConfig_ex();
        getAjaxData('api/wlan/wps', function($xml) {
            var ret = xml2object($xml);
            if(ret.type == 'response'){
                g_wps_dataVlaue = ret.response;
                defult_pincode = g_wps_dataVlaue.WPSPin;
            }
        }, {
            sync: true
        });
        if(1 == g_wpsappin) {
            wpsget_initappin();
        }
    }
    getAjaxData('api/wlan/wps-pbc', function($xml) {
        var ret = xml2object($xml);
        if(ret.type == 'response'){
            if (PBC_CONNECTING == ret.response.State) {
                showWaitingDialog(common_waiting, pbc_label_connecting_network);
                if(g_wifiFeatureSwitch.wps_cancel_enable == 1){
                    $("#wait_table tr:last").before(cancelWaiting);
                }
                pbcWaitingTimer = setTimeout( function() {
                    clearTimeout(pbcGetStatusTimer);
                    closeWaitingDialog();
                    showInfoDialog(pbc_label_connect_failed);
                },
                PBC_WAITING_TIMEOUT);
                pbcGetStatusTimer = setTimeout('wps_pbc_connect_status()', PBC_GET_STATUS_INTERVAL);
            } 
        }
        
    }, {
        sync: true                 
    });
}

function wpsget_initappin(){
    getAjaxData('api/wlan/wps-appin', function($xml) {
        var ret = xml2object($xml);
        if(ret.type == 'response'){
            var g_wpsappibdataValue = ret.response;
            defult_wpsAp = g_wpsappibdataValue.wpsappin;
            $('.rand_button').show();
            $('.default_button').show();
            if((DOUBLECHIP != g_wifiFeatureSwitch.isdoublechip && g_wps_basicData[0].WifiWpsenbl == 1 && g_security_modewep == 1) || (DOUBLECHIP == g_wifiFeatureSwitch.isdoublechip && g_wps_basicData[0].WifiWpsenbl == 1 && g_wps_flag)) {	
                $('#wps_appin_code').text(defult_wpsAp);
                $('#wps_appin_code').fadeIn(3000);
                button_enable('default_button', '1');
                button_enable('rand_button', '1');
            } else {
                $('#wps_appin_code').text(common_unknown);
                button_enable('default_button', '0');
                button_enable('rand_button', '0');
            }
        } else if(ret.error.code == '100002'){
            $('.appin_button').hide();
            $('.rand_button').hide();
            $('.default_button').hide();
            if((DOUBLECHIP != g_wifiFeatureSwitch.isdoublechip && g_wps_basicData[0].WifiWpsenbl == 1 && g_security_modewep == 1) || (DOUBLECHIP == g_wifiFeatureSwitch.isdoublechip && g_wps_basicData[0].WifiWpsenbl == 1 && g_wps_flag)) {   
                $('#wps_appin_code').text('');
                defult_wpsAp = g_wps_dataVlaue.wpsappin;
                $('#wps_appin_code').text(defult_wpsAp);
            }else{
                $('#wps_appin_code').text(common_unknown);
            }
            
        } else {
            $('.rand_button').show();
            $('.default_button').show();
            $('#wps_appin_code').text(common_unknown);
            button_enable('default_button', '0');
            button_enable('rand_button', '0');
        }
    }, {
        sync: true
    });
}

function wps_verifyPIN(pin) {
    var accum = 0;
    pin = pin >>> 0;
    accum = accum >>> 0;
    accum += WPS_VERIFY_PIN_3 * ((pin / 10000000 | 0) % 10);
    accum += WPS_VERIFY_PIN_1 * ((pin / 1000000 | 0) % 10);
    accum += WPS_VERIFY_PIN_3 * ((pin / 100000 | 0) % 10);
    accum += WPS_VERIFY_PIN_1 * ((pin / 10000 | 0) % 10);
    accum += WPS_VERIFY_PIN_3 * ((pin / 1000 | 0) % 10);
    accum += WPS_VERIFY_PIN_1 * ((pin / 100 | 0) % 10);
    accum += WPS_VERIFY_PIN_3 * ((pin / 10 | 0) % 10);
    accum += WPS_VERIFY_PIN_1 * ((pin / 1 | 0) % 10);

    return (0 == (accum % 10));
}

function wps_validateInput() {
    var pin_val = $.trim($('#input_WPSPin').val());
    var patrn = /^[0-9]{4}$|[0-9]{8}$/;
    if (pin_val == '' || pin_val == ' ' || pin_val == null) {
        showErrorUnderTextbox('wps_pin_error', wlan_hint_wps_pin_valid_type);
        $('#input_WPSPin').focus();
        return false;
    }
    if (!patrn.exec(pin_val)) {
        showErrorUnderTextbox('wps_pin_error', wlan_hint_wps_pin_valid_type);
        $('#input_WPSPin').focus().select();
        return false;
    }
    if (pin_val.length == 8) {
        pin_val = parseInt(pin_val, 10);
        if (!wps_verifyPIN(pin_val)) {
            showErrorUnderTextbox('wps_pin_error', IDS_wps_pin_code_verify_error);
            $('#input_WPSPin').focus().select();
            return false;
        }
    }
    return true;
}

/*
 * E355需要的方法
 */

function wps_pin_radio() {
    $('#input_WPSPin').removeAttr('disabled');
}

function wps_pbc_radio() {
    $('#input_WPSPin').attr('disabled', 'disabled');
}

function wps_pbc_connect_status() {
    getAjaxData('api/wlan/wps-pbc', function($xml) {
        var ret = xml2object($xml);
        if (PBC_CONNECT_FAILED == ret.response.State) {
            clearTimeout(pbcWaitingTimer);
            closeWaitingDialog();
            button_enable('apply_button', '1');
            showInfoDialog(pbc_label_connect_failed);
        } else if (PBC_CONNECT_SUCCESS == ret.response.State) {
            clearTimeout(pbcWaitingTimer);
            closeWaitingDialog();
            button_enable('apply_button', '1');
            showInfoDialog(pbc_label_connect_success);
        } else {
            pbcGetStatusTimer = setTimeout(wps_pbc_connect_status, PBC_GET_STATUS_INTERVAL);
            return;
        }
    });
}

function saveWpsPin() {
    if (wps_validateInput()) {
        if( DOUBLECHIP != g_wifiFeatureSwitch.isdoublechip ) {
            g_wps_dataVlaue.WPSPin = $.trim($('#input_WPSPin').val());
        } else {
            g_wps_dataVlaue.WPSPin = $.trim($('#input_WPSPin').val());
            g_wps_dataVlaue.ssidindex = $.trim($('#select_frequency').val());
        }
        g_wps_dataVlaue.WPSPin = $.trim($('#input_WPSPin').val());
        var wps_xml = object2xml('request', g_wps_dataVlaue);
        clearDialog();
        button_enable('apply_button', '0');
        saveAjaxData('api/wlan/wps', wps_xml, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showWaitingDialog(common_waiting, pbc_label_connecting_network);
                if(g_wifiFeatureSwitch.wps_cancel_enable == 1){
                    $("#wait_table tr:last").before(cancelWaiting);
                }
                pbcWaitingTimer = setTimeout( function() {
                    clearTimeout(pbcGetStatusTimer);
                    closeWaitingDialog();
                    showInfoDialog(pbc_label_connect_failed);
                    button_enable('apply_button', '1');
                },
                PBC_WAITING_TIMEOUT);
                pbcGetStatusTimer = setTimeout('wps_pbc_connect_status()', PBC_GET_STATUS_INTERVAL);
                if( DOUBLECHIP != g_wifiFeatureSwitch.isdoublechip ) {
                    $('#input_WPSPin').val($.trim($('#input_WPSPin').val()));
                } else {
                    $('#input_WPSPin').val($.trim($('#input_WPSPin').val()));
                    $('#select_frequency').val($.trim($('#select_frequency').val()));
                }
                
            } else {
                if(ERROR_SYSTEM_BUSY == ret.error.code) {
                    showInfoDialog(common_system_busy);
                } else {
                    showInfoDialog(pbc_label_connect_failed);
                }
                button_enable('apply_button', '1');
                
            }
            
        });
    }
}
    
function saveWpsPbc() {
    if( DOUBLECHIP != g_wifiFeatureSwitch.isdoublechip ) {
        var pbcRequest = {
                WPSMode: '1'
            };
    } else {
        var select_fre = $.trim($('#select_frequency').val());
        var pbcRequest = {
            WPSMode: '1',
            ssidindex: select_fre
        };
    }
    
    var pbc_xml = object2xml('request', pbcRequest);
    clearDialog();
    button_enable('apply_button', '0');
    saveAjaxData('api/wlan/wps-pbc', pbc_xml, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showWaitingDialog(common_waiting, pbc_label_connecting_network);
            if(g_wifiFeatureSwitch.wps_cancel_enable == 1){
                $("#wait_table tr:last").before(cancelWaiting);
            }
            pbcWaitingTimer = setTimeout( function() {
                clearTimeout(pbcGetStatusTimer);
                closeWaitingDialog();
                showInfoDialog(pbc_label_connect_failed);
                button_enable('apply_button', '1');
            },
            PBC_WAITING_TIMEOUT);
            pbcGetStatusTimer = setTimeout('wps_pbc_connect_status()', PBC_GET_STATUS_INTERVAL);
        } else {
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(pbc_label_connect_failed);
            }
            button_enable('apply_button', '1');
            
        }
    });
}
function saveWpsApPin(wpsappintype) {
    $('#wps_appin_code').fadeOut(1000);
    var g_wpsappibdataValue = {
        wpsappintype: wpsappintype,
        wpsappin: defult_wpsAp
    };
    var wps_xml_ex = object2xml('request', g_wpsappibdataValue);
    saveAjaxData('api/wlan/wps-appin', wps_xml_ex, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            wpsget_initappin();
        } else {
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
            wpsget_initappin();
        }
        $('input[name=radio]').attr('disabled',false);
    });
    
}
function saveWpsEnable(wps_enable) {
    if ($.isArray(g_wps_basicData)) {
        $(g_wps_basicData).each( function(i) {
            g_wps_basicData[i].WifiWpsenbl = wps_enable;
        });
    } else {
        g_wps_basicData.WifiWpsenbl = wps_enable;
    }
    var postData = {
        Ssids: {
            Ssid: g_wps_basicData
        },
        WifiRestart: 0
    };
    var xmlStr = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret) && wps_enable == 0) {
            $('#wps_appin_code').text(common_unknown);
        } else if(isAjaxReturnOK(ret) && wps_enable == 1) {
            $('input').attr('disabled', false);
            $('select').attr('disabled', false);
            button_enable('default_button', '1');
            button_enable('rand_button', '1');
            button_enable('apply_button', '1');
            if(DOUBLECHIP == g_wifiFeatureSwitch.isdoublechip && (!g_wps_flag_2g && $('#select_frequency').val() == 0) || (!g_wps_flag_5g && $('#select_frequency').val() == 1)) {
                button_enable('apply_button', '0');
                $("input[name=connect_mode]").attr('disabled', true);
                $("#input_WPSPin").attr('disabled', true);
            } 
            wpsget_initappin();
        } else {
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
            getAjaxData('api/wlan/multi-basic-settings', function($xml) {
                var ret = xml2object($xml);
                g_wps_basicData = CreateArray(ret.response.Ssids.Ssid);
                if(g_wifiFeatureSwitch.wps_switch_enable == 1 && g_wps_basicData[0].WifiWpsenbl == '0') {
                    $('#appindisable').get(0).checked = false;
                    $('input:not(#appinenable,#appindisable)').attr('disabled', true);
                    $('select:not(#lang)').attr('disabled', true);
                    button_enable('default_button', '0');
                    button_enable('rand_button', '0');
                    button_enable('apply_button', '0');
                }  else if(g_wifiFeatureSwitch.wps_switch_enable == 1 && g_wps_basicData[0].WifiWpsenbl == '1') {
                    $('#appinenable').get(0).checked = true;
                    button_enable('default_button', '1');
                    button_enable('rand_button', '1');
                    button_enable('apply_button', '1');
                    $('input').attr('disabled', false);
                    $('select').attr('disabled', false);
                    if(DOUBLECHIP == g_wifiFeatureSwitch.isdoublechip && (!g_wps_flag_2g && $('#select_frequency').val() == 0) || (!g_wps_flag_5g && $('#select_frequency').val() == 1)) {
                        button_enable('apply_button', '0');
                        $("input[name=connect_mode]").attr('disabled', true);
                        $("#input_WPSPin").attr('disabled', true);
                    } 
                }
            });
        }
    });
}
function wps_apply() {
    if (!isButtonEnable('apply_button')) {
        return;
    }
    clearAllErrorLabel();
    if ($('#pin_mode').get(0).checked || (g_wpspin == 1 && g_wpspbc == 0)) {
        saveWpsPin();
    } else if($('#pbc_mode').get(0).checked || (g_wpspin == 0 && g_wpspbc == 1)) {
        saveWpsPbc();
    }
}

function rand_wps() {
    if (!isButtonEnable('rand_button')) {
        return;
    }
    button_enable('default_button', '0');
    button_enable('rand_button', '0');
    $('input[name=radio]').attr('disabled','disabled');
    var wpsappintype = 1;
    saveWpsApPin(wpsappintype);
}

function default_wps() {
    if (!isButtonEnable('default_button')) {
        return;
    }
    button_enable('default_button', '0');
    button_enable('rand_button', '0');
    $('input[name=radio]').attr('disabled','disabled');
    var wpsappintype = 0;
    saveWpsApPin(wpsappintype);
    
}

