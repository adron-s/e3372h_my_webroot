var WANLMACFILTER_FILTER_STATUS_DISABLED = 0;
var WANLMACFILTER_FILTER_STATUS_ALLOW = 1;
var WANLMACFILTER_FILTER_STATUS_DENY = 2;
var g_MacfilterData = [];
var DOUBLE_CHIP = 1;

function showData(ssids)
{
    $('#ssid_input_WifiMacFilterMac0').val(g_MacfilterData[0].WifiMacFilterMac0);
    $('#ssid_input_WifiMacFilterMac1').val(g_MacfilterData[0].WifiMacFilterMac1);
    $('#ssid_input_WifiMacFilterMac2').val(g_MacfilterData[0].WifiMacFilterMac2);
    $('#ssid_input_WifiMacFilterMac3').val(g_MacfilterData[0].WifiMacFilterMac3);
    $('#ssid_input_WifiMacFilterMac4').val(g_MacfilterData[0].WifiMacFilterMac4);
    $('#ssid_input_WifiMacFilterMac5').val(g_MacfilterData[0].WifiMacFilterMac5);
    $('#ssid_input_WifiMacFilterMac6').val(g_MacfilterData[0].WifiMacFilterMac6);
    $('#ssid_input_WifiMacFilterMac7').val(g_MacfilterData[0].WifiMacFilterMac7);
    $('#ssid_input_WifiMacFilterMac8').val(g_MacfilterData[0].WifiMacFilterMac8);
    $('#ssid_input_WifiMacFilterMac9').val(g_MacfilterData[0].WifiMacFilterMac9);
    
    $('#ssid_select_service').val(g_MacfilterData[0].WifiMacFilterStatus);
    wlanmacfilter_ssid_setDisabled();
}

function getSSIDStatus() {
    if('' == g_wifiFeatureSwitch) {
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

function initPage() {
    if(g_wifiFeatureSwitch != null && g_wifiFeatureSwitch != '') {
        getAjaxData('api/wlan/multi-macfilter-settings', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_MacfilterData = CreateArray(ret.response.Ssids.Ssid);
            }
        }, {
            sync: true
        });
    } else if(g_module.multi_ssid_enabled) {
        getAjaxData('api/wlan/multi-basic-settings', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_MacfilterData = CreateArray(ret.response.Ssids.Ssid);
                //g_SSIDBasicData = g_MacfilterData;
            }
        }, {
            sync: true
        });
    } else {    
        getAjaxData('api/wlan/mac-filter', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_MacfilterData = CreateArray(ret.response);
            }
        }, {
            sync: true
        });
    }
    showData();
}

// disable/enable MAC address FOR SSID1
function wlanmacfilter_ssid_setDisabled() {
    var selectedStatus = $('#ssid_select_service').val();
    if (selectedStatus == WANLMACFILTER_FILTER_STATUS_DISABLED) {
        clearData();
        $('#ssid_mac_list :input').attr('disabled', 'disabled');
    } else {
        $('#ssid_mac_list :input').removeAttr('disabled');
    }
}

function clearData() {
    $('#ssid_mac_list :input').val('');
}

function getData() {
    var i = 0;
    var WifiMacFilterStatus = $('#ssid_select_service').val();
    if (WANLMACFILTER_FILTER_STATUS_DISABLED == $('#ssid_select_service').val()) {
        for(i; i < g_MacfilterData.length; i++) {
            g_MacfilterData[i].WifiMacFilterMac0 = '';
            g_MacfilterData[i].WifiMacFilterMac1 = '';
            g_MacfilterData[i].WifiMacFilterMac2 = '';
            g_MacfilterData[i].WifiMacFilterMac3 = '';
            g_MacfilterData[i].WifiMacFilterMac4 = '';
            g_MacfilterData[i].WifiMacFilterMac5 = '';
            g_MacfilterData[i].WifiMacFilterMac6 = '';
            g_MacfilterData[i].WifiMacFilterMac7 = '';
            g_MacfilterData[i].WifiMacFilterMac8 = '';
            g_MacfilterData[i].WifiMacFilterMac9 = '';
            g_MacfilterData[i].WifiMacFilterStatus = WifiMacFilterStatus;
        }
    } else {
        for(i; i < g_MacfilterData.length; i++) {
            g_MacfilterData[i].WifiMacFilterMac0 = $.trim($('#ssid_input_WifiMacFilterMac0').val());
            g_MacfilterData[i].WifiMacFilterMac1 = $.trim($('#ssid_input_WifiMacFilterMac1').val());
            g_MacfilterData[i].WifiMacFilterMac2 = $.trim($('#ssid_input_WifiMacFilterMac2').val());
            g_MacfilterData[i].WifiMacFilterMac3 = $.trim($('#ssid_input_WifiMacFilterMac3').val());
            g_MacfilterData[i].WifiMacFilterMac4 = $.trim($('#ssid_input_WifiMacFilterMac4').val());
            g_MacfilterData[i].WifiMacFilterMac5 = $.trim($('#ssid_input_WifiMacFilterMac5').val());
            g_MacfilterData[i].WifiMacFilterMac6 = $.trim($('#ssid_input_WifiMacFilterMac6').val());
            g_MacfilterData[i].WifiMacFilterMac7 = $.trim($('#ssid_input_WifiMacFilterMac7').val());
            g_MacfilterData[i].WifiMacFilterMac8 = $.trim($('#ssid_input_WifiMacFilterMac8').val());
            g_MacfilterData[i].WifiMacFilterMac9 = $.trim($('#ssid_input_WifiMacFilterMac9').val());
            g_MacfilterData[i].WifiMacFilterStatus = WifiMacFilterStatus;
        }
    }
}

function setData() {
    $('#ssid_input_WifiMacFilterMac0').val(g_MacfilterData[0].WifiMacFilterMac0);
    $('#ssid_input_WifiMacFilterMac1').val(g_MacfilterData[0].WifiMacFilterMac1);
    $('#ssid_input_WifiMacFilterMac2').val(g_MacfilterData[0].WifiMacFilterMac2);
    $('#ssid_input_WifiMacFilterMac3').val(g_MacfilterData[0].WifiMacFilterMac3);
    $('#ssid_input_WifiMacFilterMac4').val(g_MacfilterData[0].WifiMacFilterMac4);
    $('#ssid_input_WifiMacFilterMac5').val(g_MacfilterData[0].WifiMacFilterMac5);
    $('#ssid_input_WifiMacFilterMac6').val(g_MacfilterData[0].WifiMacFilterMac6);
    $('#ssid_input_WifiMacFilterMac7').val(g_MacfilterData[0].WifiMacFilterMac7);
    $('#ssid_input_WifiMacFilterMac8').val(g_MacfilterData[0].WifiMacFilterMac8);
    $('#ssid_input_WifiMacFilterMac9').val(g_MacfilterData[0].WifiMacFilterMac9);
    //bind selected item for filter status
    setTimeout( function() {
        $('#ssid_select_service').val(g_MacfilterData[0].WifiMacFilterStatus);
    }, 1);
}

// validate format of mac address
function wlanmacfilter_isValidMacAddress(macAddress) {
    macAddress = $.trim(macAddress);
    macAddress = macAddress.toLowerCase();
    var c = 0;
    var i = 0, j = 0;
    if ('ff:ff:ff:ff:ff:ff' == macAddress || '00:00:00:00:00:00' == macAddress) {
        return false;
    }

    var addrParts = macAddress.split(':');
    if (addrParts.length != 6) {
        return false;
    }
    for (i = 0; i < 6; i++) {
        if (addrParts[i].length != 2) {
            return false;
        }
        for (j = 0; j < addrParts[i].length; j++) {
            c = addrParts[i].charAt(j);
            if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
                continue;
            } else {
                return false;
            }
        }
    }
    c = parseInt(addrParts[0].charAt(1), 16);
    if (c % 2)/*the first number of mac address must be even*/
    {
        return false;
    }
    return true;
}

function wlanmacfilert_checkAllMac() {
    var checkResult = true;
    var emptyMacCount = 0;
    $('#ssid_mac_list :input').each( function(i) {
        if ((($.trim($(this).val()).length > 0) && (!wlanmacfilter_isValidMacAddress($(this).val())))
        || (0 == $.trim($(this).val()).length && $(this).val().length > 0)) {
            $(this).focus();
            showErrorUnderTextbox('ssid_input_WifiMacFilterMac' + i, wlan_hint_mac_address_invalid);
            checkResult = false;
        } else if (0 == $(this).val().length) {
            emptyMacCount++;
        }
    });
    if (10 == emptyMacCount) {
        var macFilterStatus = $('#ssid_select_service').val();
        if (WANLMACFILTER_FILTER_STATUS_DISABLED != macFilterStatus) {
            showInfoDialog(wlan_hint_mac_address_invalid);
            if (!$.browser.msie) {
                $('#ssid_input_WifiMacFilterMac0').focus();
            }
            checkResult = false;
        }
    }
    return checkResult;
}

function wlanmacfilert_onApply() {
    clearAllErrorLabel();
    //function for check all mac address
    if (wlanmacfilert_checkAllMac()) {
        showConfirmDialog(firewall_hint_submit_list_item, postData, function() {
        });
    }
}

function postData() {
    var sendData = null;
    var sendCmd = '';
    getData();
    if(g_wifiFeatureSwitch != null && g_wifiFeatureSwitch != '') {
        sendCmd = 'api/wlan/multi-macfilter-settings';
        sendData = {
            Ssids: {
                Ssid: g_MacfilterData
            }
        };
    } else if(g_module.multi_ssid_enabled) {
        sendCmd = 'api/wlan/multi-basic-settings';
        sendData = {
            Ssids: {
                Ssid: g_MacfilterData
            },
            WifiRestart: 1
        };
    } else {
        sendCmd = 'api/wlan/mac-filter';
        sendData = g_MacfilterData[0];
    }

    var newXmlString = object2xml('request', sendData);
    button_enable('apply', '0');
    saveAjaxData(sendCmd, newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            $('#macfilter_input').hide();
            initPage();
            showInfoDialog(common_success);
            button_enable('apply', '0');
        } else {
            if(typeof(ret.error) != 'undefined' && ret.error.code==ERROR_SYSTEM_BUSY) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_fail);
            }
        }
    });
}

function getOffloadStatus() {
    getAjaxData('api/wlan/handover-setting', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            g_wlan_handover = ret.response.Handover == '2' ? true : false;
        }
    });
}

function checkRepeat(){
    clearAllErrorLabel();
    var ssid_mac_lists = [];
    var g_MacfilterMac = '';
    var g_MacfilterFlag = true;
    for(var i = 0 ; i< 10 ; i++ ){
        g_MacfilterMac = $.trim($('#ssid_input_WifiMacFilterMac'+i).val()).toLowerCase();
        ssid_mac_lists.push(g_MacfilterMac);
    }
    for(var i =0 ;i< ssid_mac_lists.length;i++){
        for(var j = i+1 ;j< ssid_mac_lists.length ; j++){
            var strFirst = ssid_mac_lists[i];
    	  	var strSecond = ssid_mac_lists[j];
    		if(strFirst == strSecond && strFirst.length > 0 && strSecond.length > 0){
    			showErrorUnderTextbox('ssid_input_WifiMacFilterMac' + j, wlan_label_mac_address_exist);
    			$(('#ssid_input_WifiMacFilterMac'+j)).focus();
    			g_MacfilterFlag = false;
    			return;
    		}
    	}
    }
    return g_MacfilterFlag;
}
$(document).ready( function() {
    button_enable('apply', '0');
    $('#ssid_mac_list :input').val('');
    $('#ssid_mac_list :input').removeAttr('disabled');

    getSSIDStatus();

    initPage();

    // Judgement if the mac filter can be edit
    $('#ssid_mac_list :input').bind('input change cut paste keydown', function(e) {
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('apply', '1');
        }
    });
    $('#apply').click( function() {
        if (!isButtonEnable('apply')) {
            return;
        }

        if(checkRepeat()) {
            wlanmacfilert_onApply();
        }
    });
    $('#ssid_select_service').bind('change', function() {
        var selectedStatus = $('#ssid_select_service').val();
        wlanmacfilter_ssid_setDisabled();
        $('.error_message').remove();

        if (selectedStatus == g_MacfilterData[0].WifiMacFilterStatus) {
            setData();
            button_enable('apply', '0');
        } else {
            clearData();
            button_enable('apply', '1');
        }
    });
    if(null != g_wifiFeatureSwitch || g_module.multi_ssid_enabled) {
        getAjaxData('api/wlan/multi-basic-settings', function($xml) {
            var ret = xml2object($xml);
            var multissid = 0;
            if ('response' == ret.type) {
                multissid= CreateArray(ret.response.Ssids.Ssid);
                var ssid5g = multissid.length/2;
                if(null != g_wifiFeatureSwitch && g_wifiFeatureSwitch.isdoublechip == DOUBLE_CHIP){
                    if('1' == g_wifiFeatureSwitch.wifi24g_switch_enable) {
                        if(multissid[0].WifiEnable == 0 && multissid[ssid5g].WifiEnable == 0){
                            showInfoDialog(IDS_wlan_off);
                            $('select:not(#lang)').attr('disabled', 'disabled');
                            $('input:not(#lang)').attr('disabled', 'disabled');
                        } else if (multissid[0].wifitotalswitch == 0) {
                            showInfoDialog(IDS_wlan_off);
                            $('select:not(#lang)').attr('disabled', 'disabled');
                            $('input:not(#lang)').attr('disabled', 'disabled');
                        }

                    } else {
                        if(multissid[0].WifiEnable == 0){
                            $('input:not(#lang)').attr('disabled', true);
                            $('select:not(#lang)').attr('disabled', true);
                            showInfoDialog(IDS_wlan_off);
                        }
                    }
                } else {
                    if(multissid[0].WifiEnable == 0) {
                        $('input:not(#lang)').attr('disabled', true);
                        $('select:not(#lang)').attr('disabled', true);
                        showInfoDialog(IDS_wlan_off);
                    }
                }
            }
        }, {
            sync: true
        });

    } else {
        getAjaxData('api/wlan/basic-settings', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                var basicData = CreateArray(ret.response);
                if(basicData[0].WifiEnable == 0) {
                    showInfoDialog(IDS_wlan_off);
                    $('input:not(#lang)').attr('disabled',true);
                    $('select:not(#lang)').attr('disabled',true);
                }
            }
        }, {
            sync: true
        });
    }
});