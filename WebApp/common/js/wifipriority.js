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

/**************************WISPr***************************************/
var CURRENT_WISPRENABLE = 1;
var CURRENT_PROFILEENABLE = 1;
var g_current_index = -1;
var LENGHT_OF_INDEX = 8;
var SECURITY_MODE_NONE = "NONE";
var SECURITY_MODE_OPEN = 'OPEN';
var SECURITY_MODE_WEP = 'WEP';
var SECURITY_MODE_WPA_PSK = 'WPA-PSK';
var SECURITY_MODE_WPA2_PSK = 'WPA2-PSK';
var SECURITY_MODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
/**************************WISPr***************************************/
$(document).ready( function() {
    button_enable('wifi_priority_apply', '0');
    $('#wifipriority_setting').click( function() {
        if(g_module.cradle_enabled) {
            checkOffloadEnabled();
        }
    });
    $('#wifi_priority_apply').click( function() {
        apply();
    });
    $('.wifidelete').live("click", function() {
        if(!isCradleStatusOK()){
            return;
        }
        button_enable('wifi_priority_apply', '1');
        var string = $(this).parent().parent().attr("id");
        string = string.split("_");
        var Index = string[2];
        g_priority_wifi_ap_info_list.splice(Index,1);
        creatWifiPriorityList();
    });
    $('.wifiup').live("click", function() {
        button_enable('wifi_priority_apply', '1');
        var string = $(this).attr("id");
        string = string.split("_");
        var Index = string[2];
        Index = parseInt(Index, 10);
        change_list(Index,Index-1);
        creatWifiPriorityList();
    });
    $('.wifidown').live("click", function() {
        button_enable('wifi_priority_apply', '1');
        var string = $(this).attr("id");
        string = string.split("_");
        var Index = string[2];
        Index = parseInt(Index, 10);
        change_list(Index,Index+1);
        creatWifiPriorityList();
    });
    getWiFiPriorityAPinfo();
    /******************************************wispr*************************/
    $('input').live('change input paste cut keydown', function() {
        button_enable('wispr_Save', '1');
    });
    var a = !isButtonEnable('wispr_Save');
    $('.wifiedit').live("click", function() {
        if(!isCradleStatusOK()){
            return;
        }
        g_current_id  = $(this).parent().parent().attr("id");
        g_current_index = getWiFiIndex(g_current_id);
        wisprProfileSetting(g_current_index);
        button_enable('wispr_Save', '0');
        $('#wlan_password').val(g_priority_wifi_ap_info_list[g_current_index].WifiAuthSecret);
        $('#wispr_username').val(g_priority_wifi_ap_info_list[g_current_index].wifiwispruser);
        $('#wispr_password').val(g_priority_wifi_ap_info_list[g_current_index].wifiwisprpwd);
        $("input[name='wispr_mode'][value=" + g_priority_wifi_ap_info_list[g_current_index].profileenable + ']').attr('checked', true);
    });
    $('#wispr_Save').live("click", function() {
        if(!isCradleStatusOK()){
            $('.dialog').remove();
            $('.login_dialog').remove();
            return;
        }
        profile_apply(g_current_index);
    });
    $('#check_wpa_psk').live("click", function() {
        showPassword('wlan_password','check_wpa_psk');
    });
    $('#check_wispr_psk').live("click", function() {
        showPassword('wispr_password','check_wispr_psk');
    });
    $("[name='wispr_mode']").live("click", function() {
        updateProfilrStatus();
    });
    $('#pop_cancel').live('click', function() {
        if(!isButtonEnable('pop_cancel')) {
            return;
        }
        $('#div_wrapper').remove();
        $('.dialog').remove();
        $('.login_dialog').remove();
    });
    if(g_module.cradle_enabled) {
        checkOffloadEnabled();
    }
});
function change_list(obj,src) {
    var ap_priority_info_temp = {
        WifiSsid : null,
        WifiSecMode : null,
        Preset : null,
        Index : null,
        Order : null
    };

    ap_priority_info_temp = g_priority_wifi_ap_info_list[obj];
    g_priority_wifi_ap_info_list[obj] = g_priority_wifi_ap_info_list[src];
    g_priority_wifi_ap_info_list[src] = ap_priority_info_temp;
}

function apply() {
    if (!isButtonEnable('wifi_priority_apply')) {
        return;
    }
    if(!isCradleStatusOK()){
            return;
        }
        var tempValue = g_priority_wifi_ap_info_list;
        var i=0;
        for(i; i<tempValue.length; i++){
            tempValue[i].WifiSsid = wifiSsidResolveCannotParseChar(tempValue[i].WifiSsid);
            if(tempValue[i].WifiAuthSecret != 'undefined' && (tempValue[i].WifiAuthSecret != null) && (tempValue[i].WifiAuthSecret != "")){
                tempValue[i].WifiAuthSecret = wifiSsidResolveCannotParseChar(tempValue[i].WifiAuthSecret);
            }
	}
    var postData = {
        SsidLists: {
                        sidList: tempValue
        }
    };

	var priority_xml = object2xml('request', postData);
	saveAjaxData('api/wlan/wifiprofile', priority_xml, function($xml) {
		var ret = xml2object($xml);
		if(isAjaxReturnOK(ret)) {
			button_enable('wifi_priority_apply', '0');
			showInfoDialog(common_success);
			log.debug('api/wlan/wifiprofile ok');
		} else {
			if(ret.error.code == ERROR_SYSTEM_BUSY) {
				showInfoDialog(common_system_busy);
			} else {
				showInfoDialog(common_failed);
			}
			log.debug('api/wlan/wifiprofile error');
		}
		getWiFiPriorityAPinfo();
	},{
		enc:true
	});
}

function getWiFiPriorityAPinfo() {
    getAjaxData("api/wlan/wifiprofile", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            g_wifipriorityscanresult = ret.response.SsidLists.SsidList;
            $("#noavaiableap").remove();
            if($.isArray(g_wifipriorityscanresult) ||
            ((typeof (g_wifipriorityscanresult) != 'undefined') && g_wifipriorityscanresult != null && g_wifipriorityscanresult != '')) {
                setWiFiPriorityList();
            } else {
                $('.wifipriority_settings').after("<span id='noavaiableap'>" + IDS_wifi_message_priority_list_none + "</span>");
            }
        } else {
            g_wifipriorityscanresult = [];
            $('.wifipriority_settings').after("<span id='noavaiableap'>" + IDS_wifi_message_priority_list_none + "</span>");
            log.error("WiFi network: get api/wlan/profile-information data error");
        }
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
                Order : g_wifipriorityscanresult[i].Order,
                wifiwisprenable : g_wifipriorityscanresult[i].wifiwisprenable,
                wifiwispruser : g_wifipriorityscanresult[i].wifiwispruser,
                wifiwisprpwd : g_wifipriorityscanresult[i].wifiwisprpwd,
                WifiAuthSecret : g_wifipriorityscanresult[i].WifiAuthSecret,
                profileenable : g_wifipriorityscanresult[i].profileenable
            };
            g_priority_wifi_ap_info_list.push(ap_priority_info);
            creatWifiPriorityList();
        });
    } else {
        var ap_priority_info = {
            WifiSsid : g_wifipriorityscanresult.WifiSsid,
            WifiSecMode : g_wifipriorityscanresult.WifiSecMode,
            Preset : g_wifipriorityscanresult.Preset,
            Index : g_wifipriorityscanresult.Index,
            Order : g_wifipriorityscanresult.Order,
            wifiwisprenable : g_wifipriorityscanresult.wifiwisprenable,
            wifiwispruser : g_wifipriorityscanresult.wifiwispruser,
            wifiwisprpwd : g_wifipriorityscanresult.wifiwisprpwd,
            WifiAuthSecret : g_wifipriorityscanresult.WifiAuthSecret,
            profileenable : g_wifipriorityscanresult.profileenable
        };
        g_priority_wifi_ap_info_list.push(ap_priority_info);
        creatWifiPriorityList();
    }
}

function creatWifiPriorityList() {
    var wifiTableHtml = "";
    var i = 0;

    for(i; i < g_priority_wifi_ap_info_list.length; i++) {
        g_priority_wifi_ap_info_list[i].Index = i +1;
        var wifiTrId = "wifi_ap_" + i;
        var wifiUp = "wifi_up_" + i;
        var wifiDown = "wifi_down_" + i;
        var wifiDelete = "wifi_delete" + i;
        var SecurityMode = "";
        if (CURRENT_WISPRENABLE == g_priority_wifi_ap_info_list[i].wifiwisprenable) {
            SecurityMode = g_priority_wifi_ap_info_list[i].WifiSecMode + " " + common_comma +" "+ IDS_wlan_wispr_title;
        } else {
            SecurityMode = g_priority_wifi_ap_info_list[i].WifiSecMode;
        }
        wifiTableHtml += "<tr class='wifi_ap' id='" + wifiTrId + "'>";
        wifiTableHtml += "<td width='180'>";
        wifiTableHtml += "<div class='wifiName'><span>" + replaceSpaceOther(XSSResolveCannotParseChar(g_priority_wifi_ap_info_list[i].WifiSsid)) + "</span></div>";
        wifiTableHtml += "<div>" + XSSResolveCannotParseChar(SecurityMode) + "</div>";
        wifiTableHtml += "</td>";
        if(g_priority_wifi_ap_info_list[i].Preset != 1) {
            if(i<g_priority_wifi_ap_info_list.length-1) {
                if( !((i>0)&&(g_priority_wifi_ap_info_list[i-1].Preset != 1)) ) {
                    wifiTableHtml += "<td width='50' ><div  class='wifidown' id='" + wifiDown + "'><img src='../res/wifi_down.gif'></div></td>";
                } else {
                    wifiTableHtml += "<td width='50'><div  class='wifidown' id='" + wifiDown + "'><img src='../res/wifi_down.gif'></div></td>";
                }
            }
            else{
                wifiTableHtml += "<td width='50'></td>";  
            }
            if((i>0)&&(g_priority_wifi_ap_info_list[i-1].Preset != 1)) {
                if( !(i<g_priority_wifi_ap_info_list.length-1) ) {
                    wifiTableHtml += "<td width='50'><div  class='wifiup'  id='" +  wifiUp + "' ><img src='../res/wifi_up.gif'></div></td>";
                } else {
                    wifiTableHtml += "<td width='50'><div  class='wifiup'  id='" +  wifiUp + "' ><img src='../res/wifi_up.gif'></div></td>";
                }
            }
            else{
                wifiTableHtml += "<td width='50'></td>";  
            }
        } else {
            wifiTableHtml += "<td width='50'></td><td width='50'></td>";
        }
        if (typeof(g_priority_wifi_ap_info_list[i].profileenable) != 'undefined' && g_priority_wifi_ap_info_list[i].profileenable != '' ) {
            wifiTableHtml += "<td width='40'>";
            wifiTableHtml += "<label class = 'wifiedit'>";
            wifiTableHtml += "<img src='../res/editor.gif' alt='' />";
            wifiTableHtml += "</label>";
            wifiTableHtml += "</td>";
        }
        else{
            wifiTableHtml += "<td width='40'></td>";
        }
        if (g_priority_wifi_ap_info_list[i].Preset != 1) {
            wifiTableHtml += "<td width='30'>";
            wifiTableHtml += "<label class = 'wifidelete'>";
            wifiTableHtml += "<img src='../res/delete.gif' alt='' />";
            wifiTableHtml += "</label>";
            wifiTableHtml += "</td>";
        } else {
            wifiTableHtml += "<td width='30'></td>";
        }
    }
    $('.wifipriority_settings').html(wifiTableHtml);
}
/********************************************wispr*******************************************************/
function wisprProfileSetting(index) {
    // var dialogHtml = '';
    // dialogInfo = wispr_help_password;
    var wifiTableHtml = "";
    wifiTableHtml += "<div class='button_wrapper1 wispr_dialog_table'>";
    wifiTableHtml += " <table>";
    wifiTableHtml += "<tr id=''>";
    wifiTableHtml += "<td width='190px' height = '40px;'><p>" + wlan_label_ssid + common_colon + "</p></td>";
    wifiTableHtml += " <td width='290px'><span>" + replaceSpaceOther(g_priority_wifi_ap_info_list[index].WifiSsid) + "</span></td>";
    wifiTableHtml += "</tr>";
    wifiTableHtml += "<tr height = '45px'>";
    wifiTableHtml += "<td style = 'width:149px;'><p>" + firewall_label_status + common_colon + "</p></td>";
    wifiTableHtml += "<td class='show_password_style'><input type='radio' value='1' name='wispr_mode'/>";
    wifiTableHtml += "<span class = 'wispr_span'>" + common_turn_on + "</span> &nbsp;&nbsp;" + " <input type='radio' value='0' name='wispr_mode' />" ;
    wifiTableHtml += "<span class = 'wispr_span'>" + common_turn_off + "</span></td></tr>";
    wifiTableHtml += "<tr>";
    wifiTableHtml += "<tr><td class='cut_off_rule' colspan='3'></td></tr>";
    wifiTableHtml += "<tr id='authentication_div_1'>";
    wifiTableHtml += "<td width='190px' height = '40px;'><p>" + wlan_label_authentication + common_colon  + "</p></td>";
    if(SECURITY_MODE_NONE == g_priority_wifi_ap_info_list[index].WifiSecMode ) {
        wifiSecMode = wlan_label_open;
    } else {
        wifiSecMode = g_priority_wifi_ap_info_list[index].WifiSecMode ;
    }
    wifiTableHtml += " <td width='290px'><span>" + wifiSecMode + "</span></td>";
    if(SECURITY_MODE_NONE != g_priority_wifi_ap_info_list[index].WifiSecMode && (g_priority_wifi_ap_info_list[index].WifiSecMode.indexOf("EAP") == -1) && (g_priority_wifi_ap_info_list[index].Preset != 1)) {
        wifiTableHtml += '  </tr>';
        wifiTableHtml += "<td  width='149px'   height = '40px;'><p>" + common_password + common_colon  + "</p></td>";
        wifiTableHtml += "<td>";
        wifiTableHtml += "<input id='wlan_password' type='password' autocomplete='off' size='25'  maxlength='128'/></td>";
        wifiTableHtml += "<td></td>";
        wifiTableHtml += "</tr>";
        wifiTableHtml += "<tr>";
        wifiTableHtml += "<td  height = '30px;'>";
        wifiTableHtml += "</td>";
        wifiTableHtml += "<td class='show_password_style'><input type='checkbox'  id='check_wpa_psk' /><span>" + ' ' + common_show_password + "</span></td>";
        wifiTableHtml += "</tr>";
    }
    wifiTableHtml += "</div>";
    wifiTableHtml += "<div class = 'wispr_dialog_table'>";
    if (CURRENT_WISPRENABLE == g_priority_wifi_ap_info_list[index].wifiwisprenable) {
        wifiTableHtml += "<tr><td class='cut_off_rule' colspan='3'></td></tr>";
        wifiTableHtml += "<tr height = '40px'><td ><p>" + wlan_label_authentication + common_colon + "</p></td>";
        wifiTableHtml += "<td>" + 'WISPr' +"</td></tr>";
        wifiTableHtml += "<tr>";
        wifiTableHtml += "<td width='149px' height = '40px;'><p>" + dialup_label_user_name + common_colon  + "</p></td>";
        wifiTableHtml += "<td>";
        wifiTableHtml += "<input id='wispr_username' type='username' size='25'  maxlength='128'/></td>";
        wifiTableHtml += "<td></td>";
        wifiTableHtml += "</tr>";
        wifiTableHtml += "<tr>";
        wifiTableHtml += "<td  width='149px'   height = '40px;'><p>" + common_password + common_colon  + "</p></td>";
        wifiTableHtml += "<td>";
        wifiTableHtml += "<input id='wispr_password' type='password' autocomplete='off' size='25'  maxlength='128'/></td>";
        wifiTableHtml += "<td></td>";
        wifiTableHtml += "</tr>";
        wifiTableHtml += "<tr>";
        wifiTableHtml += "<td  height = '30px;'>";
        wifiTableHtml += "</td>";
        wifiTableHtml += "<td class='show_password_style'><input type='checkbox'  id='check_wispr_psk' /><span>" + ' ' + common_show_password + "</span></td>";
        wifiTableHtml += "</tr>";
    }
    wifiTableHtml += "</table>";
    wifiTableHtml += "</div>";
    call_dialog(common_edit, wifiTableHtml, common_save, 'wispr_Save',common_cancel,'pop_cancel');
    if (CURRENT_PROFILEENABLE != g_priority_wifi_ap_info_list[index].profileenable) {
        $('#wlan_password').attr('disabled', true);
        $('#wispr_username').attr('disabled', true);
        $('#wispr_password').attr('disabled', true);
        $('#check_wpa_psk').attr('disabled', true);
        $('#check_wispr_psk').attr('disabled', true);
    }
}
function profile_apply(index) {
    var wisprMame = $.trim($('#wispr_username').val());
    var  wisprPsd = $.trim($('#wispr_password').val());
    var wifiAuthSecret = $('#wlan_password').val();
    var  wisprMode= $("[name='wispr_mode']:checked").val();
    if (!isButtonEnable('wispr_Save')) {
        return;
    }
    var validElement = {
        Username: wisprMame,
        Password: wisprPsd
    };
    // g_current_index
    // var index = getWiFiIndex(g_current_id);
        var tempValue = g_priority_wifi_ap_info_list;
        var i=0;
        for(i; i<tempValue.length; i++) {
            tempValue[i].WifiSsid = wifiSsidResolveCannotParseChar(tempValue[i].WifiSsid);
            if(typeof(tempValue[i].WifiAuthSecret) != 'undefined'&& (tempValue[i].WifiAuthSecret != null) && (tempValue[i].WifiAuthSecret != "")){
                tempValue[i].WifiAuthSecret = wifiSsidResolveCannotParseChar(tempValue[i].WifiAuthSecret);
            }
        }
        var postData = {
            SsidLists: {
                sidList: tempValue
            }
        };
    if (g_priority_wifi_ap_info_list[g_current_index].Preset != 1 && typeof(wifiAuthSecret) != 'undefined') {
        if (checkWifiSecurity(wifiAuthSecret, g_priority_wifi_ap_info_list[g_current_index].WifiSecMode, 'wlan_password')) {
            postData.SsidLists.sidList[g_current_index].WifiAuthSecret = wifiSsidResolveCannotParseChar(wifiAuthSecret);
        }
        else{
            return; 
        }
    }
    if (CURRENT_WISPRENABLE == g_priority_wifi_ap_info_list[g_current_index].wifiwisprenable && $("[name='wispr_mode']:checked").val() != 0) {
            var be_valid = wispr_validInput(validElement, 'wispr_username','wispr_password');
            if (be_valid) {
                postData.SsidLists.sidList[g_current_index].wifiwispruser = wisprMame;
                postData.SsidLists.sidList[g_current_index].wifiwisprpwd = wisprPsd;
            }
        else{
            return;
        }
    }
        postData.SsidLists.sidList[g_current_index].profileenable = wisprMode;
        var priority_xml = object2xml('request', postData);
        saveAjaxData('api/wlan/wifiprofile', priority_xml, function($xml) {
            var ret = xml2object($xml);
            $('.dialog').remove();
            if(isAjaxReturnOK(ret)) {
                showInfoDialog(common_success);
            } else {
                showInfoDialog(common_failed);
                log.debug('api/wlan/wifiprofile error');
            }
            getWiFiPriorityAPinfo();
        },{
        	enc:true
        });
}
function getWiFiIndex(current_id) {
    var index = current_id.substring(LENGHT_OF_INDEX, current_id.length);
    return parseInt(index, 10);
}
function updateProfilrStatus () {
    if ($("[name='wispr_mode']:checked").val() == 0) {
        $('#wlan_password').attr('disabled', true);
        $('#wispr_username').attr('disabled', true);
        $('#wispr_password').attr('disabled', true);
        $('#check_wpa_psk').attr('disabled', true);
        $('#check_wispr_psk').attr('disabled', true);
        $('#wlan_password').val(g_priority_wifi_ap_info_list[g_current_index].WifiAuthSecret);
        $('#wispr_username').val(g_priority_wifi_ap_info_list[g_current_index].wifiwispruser);
        $('#wispr_password').val(g_priority_wifi_ap_info_list[g_current_index].wifiwisprpwd);
        $('.error_message').remove();
    } else {
        $('#wlan_password').removeAttr("disabled");
        $('#wispr_username').removeAttr("disabled");
        $('#wispr_password').removeAttr("disabled");
        $('#check_wpa_psk').removeAttr("disabled");
        $('#check_wispr_psk').removeAttr("disabled");
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
function isCradleStatusOK(){
    getCradleStatus();    
    if(g_module.cradle_enabled && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE != G_cradleStationStatus.connectionmode) {
        var offload_disabled_start = IDS_function_disabled.replace('%s1','cradle');
        var offload_disabled = offload_disabled_start.replace('%s2','offload');
        showInfoDialog(offload_disabled, false, disableEntirePage);        
        return false; 
    }
    return true;
}