/*
Index page for hilink
Author cxcai
Initialization connection status.
Jugdment which page will be redirected follow pin, sim and connection status.
Load main menu
*/
// JavaScript Document

//
var MAX_INTERVAL_TIME = 10000;
var CURRENT_NETWORK_NO_SERVICE = 0;
var SERVICE_DOMAIN_NO_SERVICE = 0;
var SERVICE_STATUS_AVAIABLE = 2;
//Signal status
var MACRO_EVDO_LEVEL_ZERO = "0";
var MACRO_EVDO_LEVEL_ONE = "1";
var MACRO_EVDO_LEVEL_TWO = "2";
var MACRO_EVDO_LEVEL_THREE = "3";
var MACRO_EVDO_LEVEL_FOUR = "4";
var MACRO_EVDO_LEVEL_FIVE = "5";
var MACRO_CHECK_INTERVAL = 1000;

var g_index_wlan_basic_settings = null;
var g_wlan_security_settings = null;
var g_connection_status = null;
var g_isAutoConnect = false;
var g_dialup_action = {
    Action: '1'
};
var WIFI_STATUS_ON = '1';
var WIFI_STATUS_OFF = '0';
var g_MonitoringStatus = '';
var g_getHandover = '';
var g_manualflag = false;
var g_status_wanpolicy = -1;
var g_current_roamingStatus = '';
var g_handover_setting = {
    Handover: '1'
};

var G3_PREFER = 0;
var WIFI_PREFER = 2;
var g_stationInformation = null;
var g_mouse_on_out_event = 0;
var g_msisdn = '';
var g_updateRedirection = '';
/*
 g_connectionStatus_S1: previous connection status.
 g_connectionStatus_S2: present connection status.
 */
var g_connectionStatus_S1 = null;
var g_connectionStatus_S2 = null;

/*
 * save cradle connection status
 */
var g_cradleconnectionStatus = null;
//icon status
var g_homeSignalStrength = -11111;
var g_homeWifiSignal = -11111;
var g_allConnStatus = -1111;
var signal_strength = '';

var CONNECTIONMODES = {
    0: common_auto,
    1: IDS_ethernet_pppoe_plus_dynamic,
    2: IDS_wan_setting_pppoe,
    3: IDS_wan_setting_dynamicip,
    4: IDS_ethernet_setting_staticip,
    5: IDS_ethernet_settings_mode_lan
};

var g_connectionMode = [[0, CONNECTIONMODES[0]], [1, CONNECTIONMODES[1]], [2, CONNECTIONMODES[2]], [3, CONNECTIONMODES[3]], [4, CONNECTIONMODES[4]], [5, CONNECTIONMODES[5]]];

var g_cradleStatus = -1111;
var CRADLELANONLY = '5';
var cbs_temp = '';
var cbs_temp_index = '';

/*
 when the user clicks connect/disconnect button, UI should stop updating
 connection
 status for just one cycle interval(default 3s).
 */
var g_freezeConnectionUpdate = false;

var MACRO_OFFLOAD_DELAY_TIME = 1000;
var MACRO_NETWORK_COMMD = 'network_commd';
var MACRO_WLAN_COMMD = 'wlan_commd';
var MACRO_POWER_OFF = 'power_off';
var MACRO_NETWORK_ON = '1';
var MACRO_NETWORK_OFF = '0';
var g_multissid_enable = false;
var g_network_action = {
    dataswitch:'0'
};
var g_isEnableRedirection = false;
//Button connection or disconnection click effect
function index_clickDisconnectBtn() {
    g_is_disconnect_clicked = false;
    $('#disconnect_btn').removeClass('mouse_on');
    homebutton_enbled('disconnect_btn', '0');
    setConnectionLink(dialup_label_disconnecting);
    g_dialup_action.Action = '0';
    index_sendConnectionAction();
}

function index_clickConnectBtn() {
    g_is_connect_clicked = false;
    checkRoamWarn( function() {
        setConnectionLink(dialup_label_connecting);
        $('#connect_btn').removeClass('mouse_on');
        homebutton_enbled('connect_btn', '0');
        g_dialup_action.Action = '1';
        index_sendConnectionAction();
    });
}

function index_clickCancelBtn() {
    g_dialup_action.Action = '0';
    index_sendConnectionAction();
}

function checkRoamWarn(callback_func,option) {
    if(g_feature.roam_warn_enabled == 1 && parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 && (typeof option == "undefined" || option == MACRO_NETWORK_ON)) {
        if(G_MonitoringStatus.response.ConnectionStatus == '201') {

            showConfirmDialog(IDS_static_traffic_open_exceeded_limited+"<br/>"+home_hint_roam_connect_warning, callback_func, function() {
            });
        } else {
            showConfirmDialog(home_hint_roam_connect_warning, callback_func, function() {
            });
        }
    } else if(G_MonitoringStatus.response.ConnectionStatus == '201') {
        showConfirmDialog(IDS_static_traffic_open_exceeded_limited, callback_func, function() {
        });
    } else {
        callback_func();
    }
}

function index_sendConnectionAction() {

    var dialup_xml = object2xml('request', g_dialup_action);
    g_freezeConnectionUpdate = true;
    saveAjaxData('api/dialup/dial', dialup_xml, function($xml) {
        var dialup_ret = xml2object($xml);
        if (isAjaxReturnOK(dialup_ret)) {
            log.debug('api/dialup/dial ok');
        } else {
            log.debug('api/dialup/dial error');
        }
    });
}

function SetHotlinks() {
    var hotlinksHtml = '';
    var hasItem = false;

    var hotlinksurl = [];
    hotlinksurl = g_feature.hotlinks.items.item;

    if (typeof(hotlinksurl) == 'undefined') {
        return;
    }

    hotlinksHtml = '<table>';
    hotlinksHtml += " <tr  id = 'hotlink_hide'>";

    if (jQuery.isArray(hotlinksurl)) {
        $.each(hotlinksurl, function(n, value) {
            if (hotlinksurl[n] != "") {
                hotlinksHtml += '<td>';
                hotlinksHtml += '<span>';
                hotlinksHtml += "   <a id='hotlinks_" + n + "' href='" + XSSResolveCannotParseChar(value) + "'>";
                hotlinksHtml += '   </a>';
                hotlinksHtml += '</span>';
                hotlinksHtml += '</td>';
                hasItem = true;
            }
        });
    } else {
        hotlinksHtml += '<td>';
        hotlinksHtml += '<span>';
        hotlinksHtml += "   <a id='hotlinks_0' href='" + XSSResolveCannotParseChar(hotlinksurl) + "'></a>";
        hotlinksHtml += '</span>';
        hotlinksHtml += '</td>';
    }

    if(!hasItem) {
        $('.hot_links').attr('style', 'border-top:0px;');
    }

    hotlinksHtml += '  </tr>';
    hotlinksHtml += '</table>';

    $('.hotlinks').html(hotlinksHtml);

    /*
     * show hotlinks icon
     */
    if (jQuery.isArray(hotlinksurl)) {
        $.each(hotlinksurl, function(n, value) {
            var temp = '#hotlinks_' + n;
            $(temp).css({
                background: 'url(../res/hotlinks_' + n + '.gif) center 0 no-repeat'
            });
        });
    } else {
        $('#hotlinks_0').css({
            background: 'url(../res/hotlinks_0.gif) center 0 no-repeat'
        });
    }

}

/*function enable_connection_button(button_id, enable_status)
 {
 var parent = $("#" + button_id);
 if (enable_status == "1")
 {
 parent.removeClass("button_connecting");
 }
 else if(enable_status == "0")
 {
 parent.addClass("button_connecting");
 }
 }*/

/*
 update connection status, signal strength, connect button text ,etc
 */
function index_updateConnectionStatus() {
    /*
     when the user clicks connect/disconnect button, UI should stop updating
     connection
     status for just one cycle interval(default 3s).
     */
    if (g_freezeConnectionUpdate) {
        g_freezeConnectionUpdate = false;
        return;
    }
    var currentStatus = G_MonitoringStatus.response;
    var signal_strength = '';
    if (typeof(currentStatus.SignalIcon) != 'undefined' ||
    currentStatus.SignalIcon != null) {
        signal_strength = '0' + currentStatus.SignalIcon;
    } else {
        signal_strength = '0' + parseInt(currentStatus.SignalStrength / 20, 10).toString();
    }
    if (g_module.cradle_enabled) {
        getCradleData();
    }
    if (!((currentStatus.WifiConnectionStatus == WIFI_CONNECTED)
    || (g_module.cradle_enabled && G_cradleStationStatus.cradlestatus == CRADLE_NETLINE_EXIST && G_cradleStationStatus.connectionmode != CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)))) {
        /*
        * singal strength
        */
        //if(g_homeSignalStrength != signal_strength){
        if ( ( $.browser.msie && ($.browser.version == '6.0') )||  g_allConnStatus != signal_strength) {
            g_allConnStatus = signal_strength;
            if(G_MonitoringStatus.response.vsimactive == 1) {
                $('#status_img').html("<img  onload = 'fixPNG(this)'  src = '../res/Signal" + signal_strength + ".png'>");
            } else {
                $('#status_img').html("<img  onload = 'fixPNG(this)'  src = '../res/icon_signal_" + signal_strength + ".png'>");
            }

            // $('#status_img').css({
            // background: 'url(../res/icon_signal_' + signal_strength + '.gif) 0 0 no-repeat'
            // });
        }
        log.debug('INDEX : index_updateConnectionStatus(' + currentStatus.ConnectionStatus + ')');
        switch (currentStatus.ConnectionStatus) {
            case '2':
            case '3':
            case '5':
            case '8':
            case '20':
            case '21':
            case '23':
            case '27':
            case '28':
            case '29':
            case '30':
            case '31':
            case '32':
            case '33':
            case '65538':
            case '65539':
            case '65567':
            case '65568':
            case '131073':
            case '131074':
            case '131076':
            case '131078':
                // Connection failed. The profile is invalid, please contact your
                // Service Provider.
                if(!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on'))) {
                    $('#index_connection_status').html(dialup_label_connection_fail_wrong_param + ' ' + "<div id='profile_settings'><a href='profilesmgr.html'>" + dialup_label_profile_management + '</a></div>');
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    setConnectionLink(dialup_label_disconnected);
                }
                break;
            case '7':
            case '11':
            case '14':
            case '37':
            case '131079':
            case '131080':
            case '131081':
            case '131082':
            case '131083':
            case '131084':
            case '131085':
            case '131086':
            case '131087':
            case '131088':
            case '131089':
                // Connection failed. Network access not allowed, please contact your
                // Service Provider.
                if(!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on'))) {
                    setConnectionLink(dialup_label_connection_fail_network_unvisitable);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    setConnectionLink(dialup_label_disconnected);
                }
                break;
            case '905':
                // Connection failed. Network access not allowed, please contact your
                // Service Provider.
                if(!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on'))) {
                    setConnectionLink(IDS_connection_failed_signal_poor);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    setConnectionLink(dialup_label_disconnected);
                }
                break;
            case '201':
                if(!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on'))) {
                    setConnectionLink(IDS_static_traffic_exceeded_limited);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    setConnectionLink(IDS_static_traffic_exceeded_limited);
                }

                break;
            case '12':
            case '13':
                // Connection failed. Roaming not allowed, please contact your
                // Service Provider.
                if(!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on'))) {
                    setConnectionLink(dialup_label_connection_fail_roaming_unallowable);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    setConnectionLink(dialup_label_disconnected);
                }
                break;
            case MACRO_CONNECTION_CONNECTING:
                // connecting
                if ($('#connect_btn').size() == 0) {
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));

                }
                setConnectionLink(dialup_label_connecting);
                homebutton_enbled('connect_btn', '0');
                $('#connect_btn').removeClass('mouse_on');

                break;
            case MACRO_CONNECTION_DISCONNECTING:
                // disconnecting
                setConnectionLink(dialup_label_disconnecting);
                $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
                homebutton_enbled('disconnect_btn', '0');
                break;
            case MACRO_CONNECTION_CONNECTED:
                // connected
                setConnectionLink(dialup_label_connected);
                $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
                break;
            case MACRO_CONNECTION_DISCONNECTED:
                var connect_type = '';
                if (typeof(currentStatus.CurrentNetworkTypeEx) != 'undefined' &&
                currentStatus.CurrentNetworkTypeEx != '') {
                    connect_type = currentStatus.CurrentNetworkTypeEx;
                } else {
                    connect_type = currentStatus.CurrentNetworkType;
                }
                if ((connect_type == CURRENT_NETWORK_NO_SERVICE ||
                currentStatus.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
                currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE)&&
                (!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on')))
                ) {
                    // no coverage
                    setConnectionLink(hilink_label_connect_failed);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    // disconnected
                    setConnectionLink(dialup_label_disconnected);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                }
                break;
            case FORBID_AUTO_CONNECT_OPEN_DEVICE:
            case FORBID_RE_CONNECT_DROPLINE:
                // disconnected
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                break;
            case FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING:
            case FORBID_RE_CONNECT_DROPLINE_ROAMING:
                // Automation connect is disabled for roaming network.
                // You will have to manually connect the network.
                if (parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1
                && (!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on')))) {
                    if(g_module.dataswitch_enabled) {
                        setConnectionLink(IDS_label_roaming_auto_connection_forbid);
                    } else {
                        setConnectionLink(hilink_label_roaming_auto_connection_forbid);
                    }
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    //roaming status is 0
                    setConnectionLink(dialup_label_disconnected);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                }
                break;
            default:
                // Connection failed. Please try again later. If the problem
                // persists, please contact your Service Provider.
                if(!g_module.dataswitch_enabled || (g_module.dataswitch_enabled && $('#mobile_connect_btn').hasClass('mobile_connect_btn_on'))) {
                    setConnectionLink(hilink_label_connect_failed_common_tip);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                } else {
                    setConnectionLink(dialup_label_disconnected);
                    $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                }
                break;
        }
        if (connect_type == CURRENT_NETWORK_NO_SERVICE ||
        currentStatus.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
        currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE
        ) {
            $('#index_plmn_name').text(dialup_label_no_service);
        }
    } else if(currentStatus.WifiConnectionStatus == WIFI_CONNECTED) {
        getAjaxData("api/wlan/station-information", function($xml) {
            var ret = xml2object($xml);
            if (ret.type == "response") {
                g_stationInformation = ret.response;
                var wifi_Signal = setWifiSignal(g_stationInformation.SignalStrength);
                //if(g_homeWifiSignal!=wifi_Signal){
                if ( ( $.browser.msie && ($.browser.version == '6.0')) ||  g_allConnStatus != wifi_Signal) {
                    g_allConnStatus = wifi_Signal;
                    $('#status_img').html("<img onload = 'fixPNG(this)' src = '../res/wifi_station_" + wifi_Signal + ".png'>");
                }
            }
        }, {
            sync: true
        }
        );
        $('#index_connection_button').css("display","none");
        setConnectionLink(dialup_label_connected);

    } else if (g_module.cradle_enabled && G_cradleStationStatus.cradlestatus == CRADLE_NETLINE_EXIST && G_cradleStationStatus.connectionmode != CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        if (( $.browser.msie && ($.browser.version == '6.0')) ||  g_allConnStatus != G_cradleStationStatus.cradlestatus) {
            g_allConnStatus = G_cradleStationStatus.cradlestatus;
            $('#status_img').html("<img  onload = 'fixPNG(this)' src = '../res/cradle_0.png'>");
        }
        if (G_cradleStationStatus.connectstatus == CRADLE_CONNECTING) {
            setConnectionLink(dialup_label_connecting);
        } else if (G_cradleStationStatus.connectstatus == CRADLE_CONNECTED) {
            setConnectionLink(dialup_label_connected);
        } else if (G_cradleStationStatus.connectstatus == CRADLE_DISCONNECTED) {
            setConnectionLink(dialup_label_disconnected);
        } else if (G_cradleStationStatus.connectstatus == CRADLE_DISCONNECTING) {
            setConnectionLink(dialup_label_disconnecting);
        } else if (G_cradleStationStatus.connectstatus == CRADLE_CONNECTFAILED) {
            setConnectionLink(pbc_label_connect_failed);
        } else {
            setConnectionLink(pbc_label_connect_failed);
        }
        $('#index_connection_button').css('display', 'none');

    }

    // while ServiceStatus is not available, user can not click Connect Button
    if (currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE) {
        homebutton_enbled('connect_btn', '0');
    }
}

function createConnectionButton(button_dis, button_id) {
    if(g_module.dataswitch_enabled) {
        return;
    }
    getConnectionStautes();
    if (1 == g_mouse_on_out_event) {
        $('#index_connection_button').html("<span class='button_wrapper mouse_on" + "' id='" + button_id + "'>" + "<span class='button_left'>" + "<span class='button_right'>" + "<span class='button_center'>" + button_dis + '</span></span></span></span>');
        ieRadiusBorder();
    } else {
        $('#index_connection_button').html("<span class='button_wrapper' id='" + button_id + "'>" + "<span class='button_left'>" + "<span class='button_right'>" + "<span class='button_center'>" + button_dis + '</span></span></span></span>');
        ieRadiusBorder();
    }
    if (!g_isAutoConnect) {
        $('#index_connection_button').css("display","");
    } else {
        $('#index_connection_button').css("display","none");
        $('.trun_off_waln').css("margin-left","0px");
    }

}

function homebutton_enbled(button_id,enable) {
    var parent = $('#' + button_id);

    if (enable == '1') {
        parent.removeClass('connect_disable_btn');

    } else if (enable == '0') {
        parent.removeClass('connect_disable_btn');
        parent.addClass('connect_disable_btn');

    }
}

function ishomeButtonEnable(button_id) {
    var disable = true;
    var $button = $('#' + button_id);
    if ($button) {
        if ($button.children()) {
            disable = $button.hasClass('connect_disable_btn');
        }
    }
    return !disable;
}

function index_checkConnectionStatusChange() {
    var currentStatus = G_MonitoringStatus.response;

    if (g_connectionStatus_S2 == null) {
        g_connectionStatus_S1 = currentStatus.ConnectionStatus;
        if (currentStatus.ConnectionStatus == MACRO_CONNECTION_CONNECTED) {
            index_gotoOperatorHomePage(false);
            main_getAdvertisement();
        }
    } else {
        g_connectionStatus_S1 = g_connectionStatus_S2;
    }
    g_connectionStatus_S2 = currentStatus.ConnectionStatus;

    if (g_connectionStatus_S1 != MACRO_CONNECTION_CONNECTED &&
    g_connectionStatus_S2 == MACRO_CONNECTION_CONNECTED) {
        index_gotoOperatorHomePage(true);
        main_getAdvertisement();
    }
}

/*
 show new update available while new version come.
 */
function index_checkUpdate() {
    if (typeof(G_NotificationsStatus.OnlineUpdateStatus) == 'undefined' ||
    G_NotificationsStatus.OnlineUpdateStatus == null) {
        return;
    }

    if (G_NotificationsStatus.OnlineUpdateStatus == '12' ||
    G_NotificationsStatus.OnlineUpdateStatus == '50') {
        $('#new_version_notice').html(common_new_version);
        return false;
    } else {
        $('#new_version_notice').html('');
    }
}

/*
 update message icon depends on sms unread count
 */
function index_updateUnreadMessages() {
    if (G_NotificationsStatus != null) {
        var localUnRead = G_NotificationsStatus.UnreadMessage;
        var smsStorageFull = G_NotificationsStatus.SmsStorageFull;
        if (0 < localUnRead) {
            $('#new_messages').html(localUnRead);
            $('#new_messages').show();
        } else {
            $('#new_messages').html('');
            $('#new_messages').hide();
        }
        if (smsStorageFull == '1') {
            $('#sms_store_full_tip').html(sms_message_full);
        } else {
            $('#sms_store_full_tip').html('');
        }
    }
}

function GetPLMN() {
    var plmn_name = '';
    var connect_type = '';
    if (typeof(G_MonitoringStatus.response.CurrentNetworkTypeEx) != 'undefined' &&
    G_MonitoringStatus.response.CurrentNetworkTypeEx != '') {
        connect_type = G_MonitoringStatus.response.CurrentNetworkTypeEx;
    } else {
        connect_type = G_MonitoringStatus.response.CurrentNetworkType;
    }
    if (
    !(connect_type == CURRENT_NETWORK_NO_SERVICE ||
    G_MonitoringStatus.response.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
    G_MonitoringStatus.response.ServiceStatus != SERVICE_STATUS_AVAIABLE) &&(
    !(G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED ||
    (g_module.cradle_enabled && G_cradleStationStatus.cradlestatus == CRADLE_NETLINE_EXIST && G_cradleStationStatus.connectionmode != CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode))))
    ) {
        getAjaxData('api/net/current-plmn', function($xml) {
            var plmn_ret = xml2object($xml);
            if ('response' == plmn_ret.type) {
                if (null == plmn_ret ||
                '' == plmn_ret.response.State ||
                ' ' == plmn_ret.response.State ||
                null == plmn_ret.response.State) {
                    plmn_name = '';
                } else {
                    if (typeof(plmn_ret.response.ShortName) != 'undefined' &&
                    plmn_ret.response.ShortName.length > 0) {

                        plmn_name = plmn_ret.response.ShortName;

                        $('#index_plmn_name').text(plmn_name);
                    } else if (typeof(plmn_ret.response.FullName) != 'undefined' &&
                    plmn_ret.response.FullName.length > 0) {

                        plmn_name = plmn_ret.response.FullName;

                        $('#index_plmn_name').text(plmn_name);
                    } else {
                        plmn_name = '';
                    }
                }
                if (G_MonitoringStatus != null &&
                typeof(G_MonitoringStatus.response) != 'undefined' &&
                parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 &&
                parseInt(G_MonitoringStatus.response.ServiceStatus, 10) == SERVICE_STATUS_AVAIABLE) {
                    plmn_name += ' ';
                    plmn_name += IDS_dialup_label_roaming;
                }
                $('#index_plmn_name').text(plmn_name);
            }
        });
    }

    var rat = '';

    if (G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED) {
        plmn_name = g_stationInformation.NetworkName;
        $('#index_plmn_name').text(plmn_name);
        rat = wlan_lable_wifi;
    } else if (g_module.cradle_enabled && (G_cradleStationStatus.cradlestatus == CRADLE_NETLINE_EXIST) && G_cradleStationStatus.connectionmode != CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        $('#index_plmn_name').text(IDS_plmn_label_wx);
    } else {
        if (g_plmn_rat != 'undefined' && g_plmn_rat != '') {
            //plmn Status
            rat = g_plmn_rat;
        }
    }
    $("#status_img_rat").remove();
    $('#status_img').append('<p id = "status_img_rat">' + rat + '</p>');
}

/*
 update current operator name and generation
 */
function index_updatePLMN() {
    /*
     * if no signal, no need to get PLMN
     */

    GetPLMN();

}

/*
 update signal, new message icon, new update icon repeatly.
 */
function index_updatePageStatusListener() {
    index_getNetWorkConnectStatus();
    index_updateUnreadMessages();
    index_updateConnectionStatus();
    index_checkConnectionStatusChange();
    index_checkUpdate();
    initConnectionStatus();
    setHTMLByWlanBasicSetting();
    index_updatePLMN();
}

function getWlanBasicStatus() {
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response') {
            g_index_wlan_basic_settings = basic_ret.response;
        }
        setHTMLByWlanBasicSetting();
    });
}

function setHTMLByWlanBasicSetting() {
    var monitoring_status = G_MonitoringStatus;
    if(null != monitoring_status) {
        if(monitoring_status.response.WifiStatus == 1) {
            $('#CurrentWifiStatus').text(common_on);
            $('#CurrentWifiUser').html(monitoring_status.response.CurrentWifiUser);
            if(g_module.wifioffload_enable && typeof(monitoring_status.response.currenttotalwifiuser) != 'undefined') {
                if(monitoring_status.response.TotalWifiUser != monitoring_status.response.currenttotalwifiuser && g_status_wanpolicy == WIFI_PREFER) {
                    var BridgeModeStatus = 0;
                    if (checkLeftMenu(g_PageUrlTree.settings.security.bridgemode) && g_module.bridge_enabled) {
                        getAjaxData("api/security/bridgemode", function($xml) {
                            var ret = xml2object($xml);
                            if ('response' == ret.type) {
                                BridgeModeStatus = parseInt(ret.response.bridgemode, 10);
                            }
                        }, {
                            sync: true
                        });
                    }
                    if(0 == BridgeModeStatus) {
                        $('.wifinumberinfo').show();
                        $('#WifiNumberInfo').text(IDS_wifi_number_info.replace('%s', monitoring_status.response.currenttotalwifiuser));
                    } else {
                        $('.wifinumberinfo').hide();
                    }

                } else {
                    $('.wifinumberinfo').hide();
                }
            }
        } else {
            $('#CurrentWifiStatus').text(common_off);
            $('#CurrentWifiUser').html(wlan_label_no_users);
        }
        autoSetInfoBoxHeight();
    }
}

function autoSetInfoBoxHeight() {
    setTimeout( function() {
        var login_status_items = $('.login_info > div:visible');
        var height_temp = 0;
        if (login_status_items.size() >= 2 ) {
            $.each(login_status_items, function(i) {
                if(height_temp < $(this).height()) {
                    height_temp = $(this).height();
                }
            });
            login_status_items.css({
                height: height_temp
            });
            $('.login_box_info').css({  /* IE6 bug*/
                height: height_temp + 35
            });
        }
    },1);
}

function getLoginUitl(login_id, loginTrafficxml) {
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' ' + common_unit_tb);
    } else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' ' + common_unit_gb);
    } else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' ' + common_unit_mb);
    } else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' ' + common_unit_kb);
    } else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml), 2) + ' ' + common_unit_byte);
    }
}

function getLoginUitl1(login_id, loginTrafficxml) {
    loginTrafficxml *= 8;
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id + ' img').attr('src','../res/f.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' ' + common_unit_tbps); //TB
    } else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id + ' img').attr('src','../res/f.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' ' + common_unit_gbps); //GB
    } else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        var statistic_value = 0;
        statistic_value = (formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2));

        if(statistic_value < 30){
            $('#' + login_id + ' img').attr('src','../res/a1.gif');
        }else if(statistic_value == 30){
            $('#' + login_id + ' img').attr('src','../res/b.gif');
        }else if(statistic_value < 60){
            $('#' + login_id + ' img').attr('src','../res/b1.gif');
        }else if(statistic_value == 60){
            $('#' + login_id + ' img').attr('src','../res/c.gif');
        }else if(statistic_value < 90){
            $('#' + login_id + ' img').attr('src','../res/c1.gif');
        }else if(statistic_value == 90){
            $('#' + login_id + ' img').attr('src','../res/d.gif');
        }else if(statistic_value < 120){
            $('#' + login_id + ' img').attr('src','../res/d1.gif');
        }else if(statistic_value == 120){
            $('#' + login_id + ' img').attr('src','../res/e.gif');
        }else if(statistic_value < 150){
            $('#' + login_id + ' img').attr('src','../res/e1.gif');
        }else {
            $('#' + login_id + ' img').attr('src','../res/f.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' ' + common_unit_mbps); //MB
    } else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id + ' img').attr('src','../res/a1.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' ' + common_unit_kbps); //KB
    } else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        if(0 < loginTrafficxml){
            $('#' + login_id + ' img').attr('src','../res/a1.gif');
        }else{
            $('#' + login_id + ' img').attr('src','../res/a.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml), 2) + ' ' + common_unit_byteps);  //B
    }
}

function getLoginUitl2(login_id, loginTrafficxml) {
    loginTrafficxml *= 8;
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id + ' img').attr('src','../res/f_.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' ' + common_unit_tbps); //TB
    } else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id + ' img').attr('src','../res/f_.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' ' + common_unit_gbps); //GB
    } else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        var statistic_value = 0;
        statistic_value = (formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2));

        if(statistic_value < 10){
            $('#' + login_id + ' img').attr('src','../res/a1_.gif');
        }else if(statistic_value == 10){
            $('#' + login_id + ' img').attr('src','../res/b_.gif');
        }else if(statistic_value < 20){
            $('#' + login_id + ' img').attr('src','../res/b1_.gif');
        }else if(statistic_value == 20){
            $('#' + login_id + ' img').attr('src','../res/c_.gif');
        }else if(statistic_value < 30){
            $('#' + login_id + ' img').attr('src','../res/c1_.gif');
        }else if(statistic_value == 30){
            $('#' + login_id + ' img').attr('src','../res/d_.gif');
        }else if(statistic_value < 40){
            $('#' + login_id + ' img').attr('src','../res/d1_.gif');
        }else if(statistic_value == 40){
            $('#' + login_id + ' img').attr('src','../res/e_.gif');
        }else if(statistic_value < 50){
            $('#' + login_id + ' img').attr('src','../res/e1_.gif');
        }else {
            $('#' + login_id + ' img').attr('src','../res/f_.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' ' + common_unit_mbps); //MB
    } else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id + ' img').attr('src','../res/a1_.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' ' + common_unit_kbps); //KB
    } else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        if(0 < loginTrafficxml){
            $('#' + login_id + ' img').attr('src','../res/a1_.gif');
        }else{
            $('#' + login_id + ' img').attr('src','../res/a_.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml), 2) + ' ' + common_unit_byteps);  //B
    }
}

function getLoginUitl1Png(login_id, loginTrafficxml) {
    loginTrafficxml *= 8;
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id + ' img').attr('src','../res/f.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' ' + common_unit_tbps); //TB
    } else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id + ' img').attr('src','../res/f.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' ' + common_unit_gbps); //GB
    } else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        var statistic_value = 0;
        statistic_value = (formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2));
        if(statistic_value < 30){
            $('#' + login_id + ' img').attr('src','../res/a03.gif');
        }else if(statistic_value == 30){
            $('#' + login_id + ' img').attr('src','../res/b.gif');
        }else if(statistic_value < 60){
            $('#' + login_id + ' img').attr('src','../res/b03.gif');
        }else if(statistic_value == 60){
            $('#' + login_id + ' img').attr('src','../res/c.gif');
        }else if(statistic_value < 90){
            $('#' + login_id + ' img').attr('src','../res/c03.gif');
        }else if(statistic_value == 90){
            $('#' + login_id + ' img').attr('src','../res/d.gif');
        }else if(statistic_value < 120){
            $('#' + login_id + ' img').attr('src','../res/d03.gif');
        }else if(statistic_value == 120){
            $('#' + login_id + ' img').attr('src','../res/e.gif');
        }else if(statistic_value < 150){
            $('#' + login_id + ' img').attr('src','../res/e03.gif');
        }else {
            $('#' + login_id + ' img').attr('src','../res/f.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' ' + common_unit_mbps); //MB
    } else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id + ' img').attr('src','../res/a03.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' ' + common_unit_kbps); //KB
    } else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        if(0 < loginTrafficxml){
            $('#' + login_id + ' img').attr('src','../res/a03.gif');
        }else{
            $('#' + login_id + ' img').attr('src','../res/a.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml), 2) + ' ' + common_unit_byteps);  //B
    }
}

function getLoginUitl2Png(login_id, loginTrafficxml) {
    loginTrafficxml *= 8;
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id + ' img').attr('src','../res/f.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' ' + common_unit_tbps); //TB
    } else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id + ' img').attr('src','../res/f.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' ' + common_unit_gbps); //GB
    } else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        var statistic_value = 0;
        statistic_value = (formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2));
        if(statistic_value < 10){
            $('#' + login_id + ' img').attr('src','../res/a02.gif');
        }else if(statistic_value == 10){
            $('#' + login_id + ' img').attr('src','../res/b.gif');
        }else if(statistic_value < 20){
            $('#' + login_id + ' img').attr('src','../res/b02.gif');
        }else if(statistic_value == 20){
            $('#' + login_id + ' img').attr('src','../res/c.gif');
        }else if(statistic_value < 30){
            $('#' + login_id + ' img').attr('src','../res/c02.gif');
        }else if(statistic_value == 30){
            $('#' + login_id + ' img').attr('src','../res/d.gif');
        }else if(statistic_value < 40){
            $('#' + login_id + ' img').attr('src','../res/d02.gif');
        }else if(statistic_value == 40){
            $('#' + login_id + ' img').attr('src','../res/e.gif');
        }else if(statistic_value < 50){
            $('#' + login_id + ' img').attr('src','../res/e02.gif');
        }else {
            $('#' + login_id + ' img').attr('src','../res/f.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' ' + common_unit_mbps); //MB
    } else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id + ' img').attr('src','../res/a02.gif');
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' ' + common_unit_kbps); //KB
    } else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        if(0 < loginTrafficxml){
            $('#' + login_id + ' img').attr('src','../res/a02.gif');
        }else{
            $('#' + login_id + ' img').attr('src','../res/a.gif');
        }
        $('#' + login_id + ' label').text(formatFloat(parseFloat(loginTrafficxml), 2) + ' ' + common_unit_byteps);  //B
    }
}

function getLoginUitlRate(login_id, loginTrafficxml) {
    if (typeof(loginTrafficxml) != 'undefined' && loginTrafficxml != '') {
        $('#' + login_id).parent().parent().show();
    } else {
        $('#' + login_id).parent().parent().hide();
        return;
    }
    var bps = 'b/s';
    var kbps = 'Kb/s';
    var mbps = 'Mb/s';
    if (LANGUAGE_DATA.current_language == "ru_ru") {
        bps = 'бит/с';
        kbps = 'Кбит/с';
        mbps = 'Мбит/с';
    }
    loginTrafficxml *= 8;
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' Tb/s');
    } else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' Gb/s');
    } else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' ' + mbps);
    } else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' ' + kbps);
    } else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml), 2) + ' ' + bps);
    }
}

function getCradleData() {
    if (G_cradleStationStatus != null) {
        return;
    } else {
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
var g_agile_no_set_package_mobile = null;
function getTrafficStatusHome() {
    getAjaxData('api/monitoring/traffic-statistics', function($xml) {
        var traffic_ret = xml2object($xml);
        if (traffic_ret.type == 'response') {
            g_agile_no_set_package_mobile = traffic_ret.response;
        }
    }, {
        sync: true
    });
}
var maxdown = [];
var maxup = [];
function initConnectionStatus() {
    if (g_module.cradle_enabled) {
        getCradleData();
    }

    showMobileOrCradle();
    changeItemStatus();

    if (g_module.cradle_enabled && (CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus) && (CRADLELANONLY != G_cradleStationStatus.connectionmode) && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        if (CRADLE_CONNECTED == G_cradleStationStatus.connectstatus) {
            var totalCradleTimes = getCurrentTime(G_cradleStationStatus.currenttime);
            var g_cradleConnectMode = G_cradleStationStatus.connectionmode;
            $('#EthernetTotalConnectTime').text(totalCradleTimes);
            $.each(g_connectionMode, function(n, value) {
                if (value[0] == g_cradleConnectMode) {
                    $('#EthernetConnectionMode').text(value[1]);
                }
            });
            $('#EthernetIpAddress').text(G_cradleStationStatus.ipaddress);
        } else {
            G_cradleStationStatus.currenttime = 0;
            var totalCradleTime = getCurrentTime(G_cradleStationStatus.currenttime);
            $('#EthernetTotalConnectTime').text(totalCradleTime);

            var g_cradleConnMode = G_cradleStationStatus.connectionmode;
            if (g_cradleConnMode == null || g_cradleConnMode == '' || g_cradleConnMode > CRADLELANONLY || g_cradleConnMode < CRADLEAUTOMODE) {
                $('#EthernetConnectionMode').text(common_unknown);
            } else {
                $.each(g_connectionMode, function(n, value) {
                    if (value[0] == g_cradleConnMode) {
                        $('#EthernetConnectionMode').text(value[1]);
                    }
                });
            }
            var g_cradleIpaddress = G_cradleStationStatus.ipaddress;
            if (g_cradleIpaddress == null || g_cradleIpaddress == '') {
                $('#EthernetIpAddress').text(common_unknown);
            } else {
                $('#EthernetIpAddress').text(G_cradleStationStatus.ipaddress);
            }
        }
    } else if (g_module.wifioffload_enable && G_StationStatus != null && WIFI_CONNECTED == G_MonitoringStatus.response.WifiConnectionStatus) {
        var totalTimesArray = getCurrentTime(G_StationStatus.response.CurrentTime);
        getLoginUitl('TotalDownload', G_StationStatus.response.RxFlux);
        getLoginUitl('TotalUpload', G_StationStatus.response.TxFlux);
        $('#TotalConnectTime').text(totalTimesArray);
    } else {
		getTrafficStatusHome();
        getAjaxData('api/monitoring/traffic-statistics', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_login_function = ret.response;
                if (G_MonitoringStatus == null || MACRO_CONNECTION_CONNECTED != G_MonitoringStatus.response.ConnectionStatus) {
                    g_login_function.CurrentConnectTime = 0;
                    g_login_function.CurrentDownload = 0;
                    g_login_function.CurrentUpload = 0;
                    g_login_function.CurrentDownloadRate = 0;
                    g_login_function.CurrentUploadRate = 0;
					g_login_function.MaxUploadRate = 0;
					g_login_function.MaxDownloadRate = 0;
                }
                var totalTimesArray = getCurrentTime(g_login_function.CurrentConnectTime);
                getLoginUitl('TotalDownload', g_login_function.CurrentDownload);
                getLoginUitl('TotalUpload', g_login_function.CurrentUpload);
                getLoginUitl1('statistic_down', g_agile_no_set_package_mobile.CurrentDownloadRate);
                getLoginUitl2('statistic_up', g_agile_no_set_package_mobile.CurrentUploadRate);
                getLoginUitlRate('DownloadRate', g_login_function.CurrentDownloadRate);
                getLoginUitlRate('UploadRate', g_login_function.CurrentUploadRate);
                getLoginUitlRate('MaxDownloadRate', g_login_function.MaxDownloadRate);
                getLoginUitlRate('MaxUploadRate', g_login_function.MaxUploadRate);
                $('#TotalConnectTime').text(totalTimesArray);
				getLoginUitl1Png('statistic_downl', g_login_function.MaxDownloadRate);				
				getLoginUitl2Png('statistic_upl', g_login_function.MaxUploadRate);
            } else {
                log.error('Load traffic-statistics data failed');
            }
        });
    }
}

function showMobileOrCradle() {
    var cradleExistFlag = g_module.cradle_enabled &&
    CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus && CRADLELANONLY != G_cradleStationStatus.connectionmode && CRADLEAUTOMODE != G_cradleStationStatus.connectionmode;
    if (cradleExistFlag && g_module.wifi_enabled) {
        $('#wlan_connect_btn').hide();
        $('#ethernet_connection').show();
        $('#only_ethernet_connection').remove();
        $('#mobile_connection').hide();
        $('#hilink_connection').remove();
    } else if (cradleExistFlag && !g_module.wifi_enabled && !g_module.sdcard_enabled) {
        $('#ethernet_connection').remove();
        $('#only_ethernet_connection').show();
        $('#mobile_connection').remove();
        $('#hilink_connection').remove();
    } else if (!cradleExistFlag && !g_module.wifi_enabled && !g_module.sdcard_enabled) {
        $('#ethernet_connection').remove();
        $('#only_ethernet_connection').remove();
        $('#mobile_connection').remove();
        $('#hilink_connection').show();
    } else {
        $('#ethernet_connection').hide();
        $('#only_ethernet_connection').remove();
        $('#mobile_connection').show();
        $('#hilink_connection').remove();
    }
}

function index_getNetWorkConnectStatus() {
    if(!g_module.dataswitch_enabled) {
        return;
    }
    if (g_module.cradle_enabled && G_cradleStationStatus.cradlestatus == CRADLE_NETLINE_EXIST && G_cradleStationStatus.connectionmode != CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        $('#mobile_connect_btn').hide();
        $('#wlan_connect_btn').hide();
    } else {
        $('#mobile_connect_btn').show();
    }
    getAjaxData('api/dialup/mobile-dataswitch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response' && ret.response.dataswitch == MACRO_NETWORK_ON) {
            $('#mobile_connect_btn').addClass('mobile_connect_btn_on');
        } else {
            $('#mobile_connect_btn').removeClass('mobile_connect_btn_on');
        }
    }, {
        sync:true
    });
    if(g_module.wifioffload_enable) {
        $('#wlan_connect_btn').show();
        getAjaxData('api/wlan/handover-setting', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response' && WIFI_PREFER == ret.response.Handover) {
                $('#wlan_connect_btn').addClass('wlan_connect_btn_on');
            } else {
                $('#wlan_connect_btn').removeClass('wlan_connect_btn_on');
            }
        });
    }
}

function setNetWorkConnect(callback_func,commd) {
    if (g_needToLogin) {
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != '0') { //logout
                    g_destnation = null;
                    if(commd == MACRO_NETWORK_COMMD) {
                        g_is_network_connect = true;
                        g_is_wlan_connect  = false;
                    } else if(commd == MACRO_WLAN_COMMD) {
                        g_is_network_connect = false;
                        g_is_wlan_connect  = true;
                    } else if(commd == MACRO_POWER_OFF) {
                        g_is_power_off  = true;
                    }
                    showloginDialog();
                    return;
                } else {
                    callback_func();
                }
            } else {
                callback_func();
            }
        }, {
            sync: true
        });
    } else {
        callback_func();
    }
}

function index_sendNetWorkAction() {
    checkRoamWarn( function() {
        var dialup_xml = object2xml('request', g_network_action);
        saveAjaxData('api/dialup/mobile-dataswitch', dialup_xml, function($xml) {
            var dialup_ret = xml2object($xml);
            g_isPostAjax = false;
            if (isAjaxReturnOK(dialup_ret)) {
                if(MACRO_NETWORK_OFF == g_network_action.dataswitch) {
                    $('#mobile_connect_btn').removeClass('mobile_connect_btn_on');
                } else {
                    $('#mobile_connect_btn').addClass('mobile_connect_btn_on');
                }
                log.debug('api/dialup/mobile-dataswitch ok');
            } else {
                log.debug('api/dialup/mobile-dataswitch error');
                showInfoDialog(common_failed);
            }
        });
    },g_network_action.dataswitch);
}

function setPowerOff() {
    showConfirmDialog(IDS_setting_power_off, function() {
        var request = {
            Control: 4
        };
        var xmlstr = object2xml('request', request);
        saveAjaxData('api/device/control', xmlstr, function($xml) {
            var xmlstr = xml2object($xml);
            if (isAjaxReturnOK(xmlstr)) {
                log.debug('saveAjaxData successed!');
            } else {
                closeWaitingDialog();
                showInfoDialog(common_failed);
                return false;
            }
        });
    }, function() {
    });
}

function initConnectionButton() {
    if (!g_module.dataswitch_enabled) {
        $('#index_connection_button_old').show();
        if(g_module.wifioffload_enable) {
            $('.trun_on_off_waln').show();
        }
        $('#index_connection_button_new').hide();
    } else {
        $('#index_connection_button_old').hide();
        $('.trun_on_off_waln').hide();
        $('#index_connection_button_new').show();
        $('#mobile_connect_btn').live('click', function() {
            if(g_isPostAjax) {
                return;
            }
            if($(this).hasClass("mobile_connect_btn_on")) {
                g_network_action.dataswitch = MACRO_NETWORK_OFF;
            } else {
                g_network_action.dataswitch = MACRO_NETWORK_ON;
            }
            setNetWorkConnect( function() {
                g_isPostAjax = true;
                index_sendNetWorkAction();
            },MACRO_NETWORK_COMMD);
        });
        $("#mobile_connect_btn").attr("title", IDS_mobile_network );
        if(g_module.wifioffload_enable) {
            //    $('#wlan_connect_btn').show();
            $('#wlan_connect_btn').live('click', function() {
                if(g_isPostAjax) {
                    return;
                }
                if(g_multissid_enable) {
                    showInfoDialog(multi_wifiOffload_message);
                    return;
                }
                if($(this).hasClass("wlan_connect_btn_on")) {
                    g_handover_setting.Handover = G3_PREFER;
                } else {
                    g_handover_setting.Handover = WIFI_PREFER;
                }
                setNetWorkConnect( function() {
                    setHandoverSetting();
                },MACRO_WLAN_COMMD);
            });
            $("#wlan_connect_btn").attr("title", wlan_lable_Interntet_wlan );
        } else {
            $('#wlan_connect_btn').hide();
        }
        if(g_module.poweroff_enabled) {
            $('#power_off_btn').show();
            $('#power_off_btn').live('click', function() {
                setNetWorkConnect( function() {
                    setPowerOff();
                },MACRO_POWER_OFF);
            });
            $("#power_off_btn").attr("title", IDS_power_off_title);
        } else {
            $('#power_off_btn').hide();
        }
    }
}

function main_executeBeforeDocumentReady() {
    index_redirectPage();

    getConfigData('config/deviceinformation/config.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret) {
            g_msisdn = config_ret.msisdn;
        }
    }, {
        sync: true
    });

    getConfigData('config/webuicfg/config.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret) {
            g_updateRedirection = config_ret.dialog_new_version;
        }
    }, {
        sync: true
    });

}

main_executeBeforeDocumentReady();
function checkautoupdateStatus() {
    var autoupdate = false;
    getAjaxData('api/online-update/autoupdate-config', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            var auto_update = ret.response.auto_update;
            if(auto_update && auto_update == 1) {
                autoupdate = true;
            } else {
                autoupdate = false;
            }
        } else {
                autoupdate = false;
        }
    }, {
        sync: true
    });
    return autoupdate;
}

/*
 invoke while document is ready
 */
$(document).ready( function() {
    if($.browser.msie) {
        $('#index_connection_button_new div').remove();
        $('#index_connection_button_new').append("<span class='power_off_btn' id='power_off_btn'></span><span class='mobile_connect_btn' id='mobile_connect_btn'></span><span class='wlan_connect_btn' id='wlan_connect_btn' ></span>");
        if(parseInt($.browser.version,10) < 9) {
            $('.ieshow').slideDown(2000);
        }
    }
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
        $('.receivedsent').text(common_sent + '/' + dialup_label_received + common_colon);
    } else {
        if(LANGUAGE_DATA.current_language == 'ru_ru') {
            $('.receivedsent').text(dialup_label_received + '/' + dialup_label_sent + common_colon);
        } else {
            $('.receivedsent').text(dialup_label_received + '/' + common_sent + common_colon);
        }
    }
    initConnectionButton();
    if(g_module.wifioffload_enable) {
        getHandoverSetting();
        addStatusListener('getStatusWanPolicy()');
    }
    index_setPcHostInfo();
    addStatusListener('index_updatePageStatusListener()');

    index_getPcAssistant();

    if (g_module.ussd_enabled) {
        $('.index_appicon_ussd').show();
    }

    if (!g_feature.connection.enable) {
        $('.login_box_info').css({
            display: 'none'
        });
    }

    if (!g_feature.connection.connectionstatus) {
        $('.connection').css({
            display: 'none'
        });
    }
    if (g_module.sdcard_enabled) {
        $('#login_sharing_div').show();
        $('#view_SDCard_btn').bind('click', function() {
            window.location.href = 'sdcardsharing.html';
        });
    }

    if (!g_module.wifi_enabled) {
        $('.wlan_status').css({
            display: 'none'
        });
    }
    
    
    if ("1" == g_hilink_login_status) {
        $('#login_restore_div').show();
        $('#button_restore').live('click', function() {
            
            if (g_needToLogin) {
                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        if (ret.response.State != 0) { //logout
                            showRestoreDialog();
                        } else { //login
                            showConfirmDialog(system_hint_restore, restore, function() {});
                        }
                    }
                }, {
                    sync: true
                });
            } else {
                showConfirmDialog(system_hint_restore, restore, function() {});
            }
            return false;
        });
        
        $('#pop_restore').live('click', function() {
            restore();
            return false;
        });
        
    }

    getWlanBasicStatus();

    if (typeof(g_feature.hotlinks.enable) != 'undefined') {
        if (g_feature.hotlinks.enable) {
            SetHotlinks();
        } else {
            $('.hot_links').hide();
        }
    }

    if('1' == g_updateRedirection && !checkautoupdateStatus()) {
        checkNewVersionShowDialog();
    }
    //Button effect when mouseover and out
    $('#connect_btn, #disconnect_btn').live('mouseover', function() {

        if (!ishomeButtonEnable('connect_btn') || !ishomeButtonEnable('disconnect_btn')) {
            return;
        } else {
            $(this).addClass('mouse_on');
        }
        g_mouse_on_out_event = 1;
    });
    $('#connect_btn, #disconnect_btn').live('mouseout', function() {
        $(this).removeClass('mouse_on');
        g_mouse_on_out_event = 2;
    });
    $('#notification_tray').click( function() {
        if (!isButtonEnable('notification_tray')) {
            return;
        } else {
            gotoPageWithHistory('installsoftware.html');
        }
    });
    $('#trun_off_waln_check').live('click', function() {

        if (g_needToLogin) {
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.State != '0') { //logout
                        g_isTrunOffWlanChecked = true;
                        showloginDialog();
                    } else {
                        if($('.trun_on_off_waln :checked').size() > 0) {
                            g_handover_setting.Handover = '2';
                        } else {
                            g_handover_setting.Handover = '0';
                        }
                        setHandoverSetting();
                    }
                }
            }, {
                sync: true
            });
        } else {
            if($('.trun_on_off_waln :checked').size() > 0) {
                g_handover_setting.Handover = '2';
            } else {
                g_handover_setting.Handover = '0';
            }
            setHandoverSetting();
        }

    });
    $('.ieshowoff').live('click', function() {
        $('.ieshow').hide();
    });
    $('#connect_btn').live('click', function() {
        if (!ishomeButtonEnable('connect_btn')) {
            return;
        }
        g_is_connect_clicked = true;
        if (g_needToLogin) {
            //g_nav = $(this);
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.State != '0') { //logout
                        g_destnation = null;
                        //g_nav.children().first().attr("href",
                        // "javascript:void(0);");
                        showloginDialog();
                        return;
                    } else {
                        index_clickConnectBtn();
                    }

                } else {
                    index_clickConnectBtn();
                }
            }, {
                sync: true
            });
        } else {
            index_clickConnectBtn();
        }

    });
    $('#cancel_btn').live('click', function() {
        if (!isButtonEnable('cancel_btn')) {
            return;
        }
        g_is_disconnect_clicked = false;
        g_is_connect_clicked = false;
        g_isPostAjax = false;
        $('#cancel_btn').removeClass('mouse_on');
        button_enable('cancel_btn', '0');

        setConnectionLink(dialup_label_connecting);
        index_clickCancelBtn();
    });
    $('#disconnect_btn').live('click', function() {
        if (!ishomeButtonEnable('disconnect_btn')) {
            return;
        }
        g_is_disconnect_clicked = true;
        if (g_needToLogin) {
            //g_nav = $(this);
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.State != '0') { //logout
                        g_destnation = null;
                        //g_nav.children().first().attr("href",
                        // "javascript:void(0);");
                        showloginDialog();
                        return;
                    } else {
                        index_clickDisconnectBtn();
                    }

                } else {
                    index_clickDisconnectBtn();
                }
            }, {
                sync: true
            });
        } else {
            index_clickDisconnectBtn();
        }
    });
    if(g_module.cbs_enabled) {
        cbs_judge();
        setInterval(cbs_judge,MAX_INTERVAL_TIME);
    }
});
function cbs_judge() {
    //ticker.css("overflow", "hidden");
    var  value='';
    var  sbs_index='';
    getAjaxData('api/sms/get-cbsnewslist', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            value=ret.response.cbsnewslist;
            sbs_index=ret.response.timeid;
        }
        if(cbs_temp == '') {
            cbs_temp = value;
            cbs_temp_index = sbs_index;
            initValue();
        }
        if(sbs_index != cbs_temp_index) {
            cbs_temp = value;
            cbs_temp_index = sbs_index;
            $('#cbs_div').fadeOut(3000,initValue);
            $('#cbs_div').fadeIn(3000);
        }
    });
}

function initValue() {
    $('#cbs_div').text(cbs_temp);
}

/*
 goto autorun download page when found new autorun version on device.
 goto operator homepage according to /api/redirection/homepage
 */

function index_redirectPage() {
    var deviceVersion = '';
    var pcVersion = window.name;

    // get pc autorun version
    if (pcVersion == null || pcVersion.length <= 0 || pcVersion == 'null') {
        return;
    }
    var now = new Date();
    var temp =  now.getDate() + now.getSeconds();
    window.name = SHA256(temp.toString());
    // get device autorun version
    getAjaxData('api/device/autorun-version', function($xml) {
        var autorun_ver = xml2object($xml);
        if ('response' == autorun_ver.type) {
            deviceVersion = autorun_ver.response.Version;
        }
    }, {
        sync: true
    });

    var string1list = pcVersion.split('.');
    var string2list = deviceVersion.split('.');
    var isNewVersionFound = false;
    var isValidVersion = false;
    if(string1list.length == string2list.length) {
        var count;
        for(count = 0;count < string1list.length; count++) {
            if(isNaN(string1list[count]) || isNaN(string2list[count])) {
                break;
            }
        }
        if(string1list.length == count) {
            isValidVersion = true;
        }
    }
    if(isValidVersion) {
        if (parseInt(string1list[4], 10) != parseInt(string2list[4], 10)) {
            isNewVersionFound = true;
        }
        var i = 0;
        for (i; i < 4; i++) {
            if (string1list[i] < string2list[i]) {
                isNewVersionFound = true;
            } else if (string1list[i] > string2list[i]) {
                break;
            }
        }
    }
    if (isNewVersionFound) {
        gotoPageWithoutHistory('update_autorun.html');
    } else {
        /*
         redirect to carrier homepage when connected to internet
         */
        getAjaxData('api/monitoring/status', function($xml) {
            var status = xml2object($xml);
            if ('response' == status.type) {
                g_connectionStatus_S2 = status.response.ConnectionStatus;
                if (status.response.ConnectionStatus == MACRO_CONNECTION_CONNECTED) {
          index_gotoOperatorHomePage(false);    

                }
            }
        }, {
            sync: true
        });
        if (null == g_connectionStatus_S2) {
            g_connectionStatus_S2 = MACRO_CONNECTION_DISCONNECTED;
        }
    }
}

/*
 goto operator homepage
 */
function index_gotoOperatorHomePage(bNewWindow) {
    var flag = true;
    if (g_module.online_update_enabled) {
        if ( null == G_NotificationsStatus) {
            setTimeout(index_gotoOperatorHomePage, MACRO_CHECK_INTERVAL);
         return;
        } else {
            if (MACRO_NEWVERSIONFOUND == G_NotificationsStatus.OnlineUpdateStatus || MACRO_READYTOUPDATE == G_NotificationsStatus.OnlineUpdateStatus) {
                if(checkNewVerRemind()) {
                    flag = false;
                }
            }
        }
    }
    getAjaxData('api/redirection/homepage', function($xml) {
        var homepage_ret = xml2object($xml);
        if ('response' == homepage_ret.type) {
            /*
             EnableRedirection -- whether need to do the redirection.
             1 : yes      0 : no
             */
            g_isEnableRedirection = ('1' == homepage_ret.response.EnableRedirection);
            if (g_isEnableRedirection && flag) {
                /*
                 if carrier homepage url is begin with "http", just redirect to
                 this url
                 otherwise UI should insert "http://" prefix to this url before
                 redirection
                 */
                var homepage_url = null;
                if (homepage_ret.response.Homepage.length > 4 &&
                homepage_ret.response.Homepage.toLowerCase().substring(0, 4) == 'http') {
                    homepage_url = homepage_ret.response.Homepage;
                } else {
                    homepage_url = 'http://' + homepage_ret.response.Homepage;
                }

                if (bNewWindow) {
                    gotoPageWithHistory(homepage_url);
                } else {
                    gotoPageWithoutHistory(homepage_url);
                }
            }
        }
    }, {
        sync: true
    });
}

function clientTimeZone() {
    var munites = new Date().getTimezoneOffset();
    var hour = parseInt(munites / 60, 10);
    var munite = munites % 60;
    var prefix = 'GMT-';

    if (hour < 0 || munite < 0) {
        prefix = 'GMT+';
        hour = -hour;
        if (munite < 0) {
            munite = -munite;
        }
    }

    hour = hour + '';
    munite = munite + '';
    if (hour.length == 1) {
        hour = '0' + hour;
    }

    if (munite.length == 1) {
        munite = '0' + munite;
    }

    return prefix + hour + ':' + munite;
}

function index_setPcHostInfo() {
    // get Time
    var now = new Date();
    var str_year = now.getFullYear();
    var str_month = now.getMonth() + 1;
    if (str_month < 10) {
        str_month = '0' + str_month;
    }
    var str_day = now.getDate();
    if (str_day < 10) {
        str_day = '0' + str_day;
    }
    var str_hour = now.getHours();
    if (str_hour < 10) {
        str_hour = '0' + str_hour;
    }
    var str_min = now.getMinutes();
    if (str_min < 10) {
        str_min = '0' + str_min;
    }
    var str_sec = now.getSeconds();
    if (str_sec < 10) {
        str_sec = '0' + str_sec;
    }
    var str_time = str_year.toString() + str_month.toString() + str_day.toString() + str_hour.toString() + str_min.toString() + str_sec.toString();
    var str_timezone = clientTimeZone();
    // get Platform
    var host_info = {
        Time: str_time,
        Timezone: str_timezone,
        Platform: navigator.platform,
        PlatformVer: navigator.userAgent,
        Navigator: navigator.appVersion,
        NavigatorVer: navigator.userAgent
    };
    var str_xml = object2xml('request', host_info);
    saveAjaxData('api/host/info', str_xml);
}

function index_getPcAssistant() {
    if (g_module.assistant_enabled) {
        var ua = navigator.userAgent.toLowerCase();
        g_index_is_windows = (ua.indexOf('windows') != -1 || ua.indexOf('win32') != -1);
        // //Window operate
        g_index_is_mac = (ua.indexOf('macintosh') != -1 || ua.indexOf('mac os x') != -1);
        // //Mac operate
        g_index_is_linux = (ua.indexOf('linux') != -1);
        if (g_index_is_mac) {
            if ('' != g_assistant_ret.config.macpath &&
            ' ' != g_assistant_ret.config.macpath &&
            null != g_assistant_ret.config.macpath &&
            'undefind' != g_assistant_ret.config.macpath) {
                $('.new_msg').show();
                $('#notification_tray').show();
            }
        } else if (g_index_is_windows) {
            if ('' != g_assistant_ret.config.winpath &&
            ' ' != g_assistant_ret.config.winpath &&
            null != g_assistant_ret.config.winpath &&
            'undefind' != g_assistant_ret.config.winpath) {
                $('.new_msg').show();
                $('#notification_tray').show();
            }
        }
    } else {
        $('.new_msg').hide();
        $('#notification_tray').hide();

    }
}

function main_getAdvertisement() {
    if (g_feature.adcontent_enable) {
        $('#ad_div').show();
        $('#ad_iframe').get(0).src = 'adcontent.html';
    }
}

function setConnectionLink(connectType) {
    if (g_module.cradle_enabled && (G_cradleStationStatus.cradlestatus == CRADLE_NETLINE_EXIST) && G_cradleStationStatus.connectionmode != CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        $('#index_connection_status').html(connectType + "<div id='menu_connection_settings'><a href='ethernetsettings.html'>" + hilink_label_auto_connection_link + '</a></div>');
    } else if (G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED) {
        $('#index_connection_status').html(connectType + "<div id='menu_connection_settings'><a href='wifinetworks.html'>" + hilink_label_auto_connection_link + '</a></div>');
    } else if(g_module.vsim_enabled && (G_MonitoringStatus.response.vsimactive == 0 && (G_MonitoringStatus.response.ConnectionStatus==FORBID_RE_CONNECT_DROPLINE_ROAMING || G_MonitoringStatus.response.ConnectionStatus==FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING))) {
        $('#index_connection_status').html(connectType + "<div id='menu_connection_settings'><a href='vsim.html'>" + hilink_label_auto_connection_link + '</a></div>');
    } else {
        $('#index_connection_status').html(connectType + "<div id='menu_connection_settings'><a href='mobileconnection.html'>" + hilink_label_auto_connection_link + '</a></div>');
    }
}

function getConnectionStautes() {
    if(typeof(g_connection_status) == 'undefined' || g_connection_status == null || g_current_roamingStatus != G_MonitoringStatus.response.RoamingStatus) {
        getAjaxData('api/dialup/connection', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_connection_status = ret;
                g_current_roamingStatus = G_MonitoringStatus.response.RoamingStatus;
                if(('1' == g_connection_status.response.ConnectMode ||
                ('0' == g_connection_status.response.ConnectMode &&
                '0' == g_connection_status.response.RoamAutoConnectEnable &&
                '1' == G_MonitoringStatus.response.RoamingStatus)) &&
                G_MonitoringStatus.response.WifiConnectionStatus != WIFI_CONNECTED) {
                    g_isAutoConnect = false;
                } else {
                    g_isAutoConnect = true;
                }
            }
        }, {
            sync: true
        });
    }

}

function getStatusWanPolicy() {
    if(g_status_wanpolicy != G_MonitoringStatus.response.WanPolicy && g_manualflag == false && g_loginFlag && g_status_wanpolicy != '-1') {
        g_handover_setting.Handover = G_MonitoringStatus.response.WanPolicy;
        showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
        g_manualflag = true;
        g_getHandover = '';
        setTimeout( function() {
            getHandoverSuccessSetting();
        }, 1500);
    }
    g_status_wanpolicy = G_MonitoringStatus.response.WanPolicy;
}

function getHandoverSetting() {
    getAjaxData("api/wlan/handover-setting", function($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {
            if(WIFI_PREFER == ret.response.Handover) {
                g_status_wanpolicy = WIFI_PREFER;
                $('input[name=trun_off_waln]').attr('checked', 'checked');
            } else {
                g_status_wanpolicy = G3_PREFER;
                $('input[name=trun_off_waln]').removeAttr('checked');
            }
        } else {
            log.error("WiFi network: get api/wlan/handover-setting data error");
        }
        if(g_module.multi_ssid_enabled) {
            getAjaxData('api/wlan/multi-switch-settings', function($xml) {
                var ret = xml2object($xml);
                var mutil_ssid2Status = ret.response;
                if(mutil_ssid2Status.multissidstatus == "1") {
                    $('#trun_off_waln_check').attr("disabled",true);
                    $('#trun_off_waln_check').removeAttr("checked");
                    if(!g_module.dataswitch_enabled) {
                        $('.trun_on_off_waln').after("<div style='width:400px;'><span style='color:red;font-size:13px'>" + multi_wifiOffload_message + "</span></div>");
                    }
                    g_multissid_enable = true;
                } else {
                    $('#trun_off_waln_check').removeAttr("disabled");
                    g_multissid_enable = false;
                }
            });
        }
    });
}

function setHandoverSetting() {
    g_isPostAjax = true;
    var handDover_xml = object2xml('request', g_handover_setting);
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    saveAjaxData('api/wlan/handover-setting', handDover_xml, function($xml) {
        var ret = xml2object($xml);
        g_isPostAjax = false;
        if (isAjaxReturnOK(ret)) {
            log.debug('api/wlan/handover-setting ok');
            g_getHandover = '';
            g_manualflag = true;
            g_MonitoringStatus = '';
            setTimeout( function() {
                getHandoverSuccessSetting();
            }, MACRO_OFFLOAD_DELAY_TIME);
        } else {
            closeWaitingDialog();
            log.debug('api/wlan/handover-setting error');
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
            if(g_status_wanpolicy == WIFI_PREFER) {
                $('input[name=trun_off_waln]').attr('checked', 'checked');
            } else {
                $('input[name=trun_off_waln]').removeAttr('checked');
            }
        }
    }, {
        errorCB: function() {
            g_MonitoringStatus = '';
            setTimeout( function() {
                getHandoverSuccessSetting();
            }, MACRO_OFFLOAD_DELAY_TIME);
        }          
    });
}

function getHandoverSuccessSetting() {
    getAjaxData("api/monitoring/status", function($xml) {
        var gstatus_ret = xml2object($xml);
        if(gstatus_ret.type == "response") {
            g_MonitoringStatus = gstatus_ret;
        }
    });
    if( typeof(g_MonitoringStatus.response) != 'undefined' && WIFI_STATUS_ON == g_MonitoringStatus.response.WifiStatus) {
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
            }, MACRO_OFFLOAD_DELAY_TIME);
        } else {
            if(WIFI_PREFER == g_handover_setting.Handover) {
                g_status_wanpolicy = WIFI_PREFER;
                $('input[name=trun_off_waln]').attr('checked', 'checked');
            } else {
                g_status_wanpolicy = G3_PREFER;
                $('input[name=trun_off_waln]').removeAttr('checked');
            }
            closeWaitingDialog();
            g_manualflag = false;
        }
    } else {
        setTimeout( function() {
            getHandoverSuccessSetting();
        }, MACRO_OFFLOAD_DELAY_TIME);
    }

}

//Button connection or disconnection click effect
function index_clickTrunOnBtn() {

    $('#wifi_connection_button').html(create_button_html( common_turn_off + " " +wlan_label_wlan,"wifi_turnOff_button"));
    ieRadiusBorder();

}

function index_clickTurnOffBtn() {

    $('#wifi_connection_button').html(create_button_html(common_turn_on + " " +wlan_label_wlan,"wifi_turnOn_button"));
    ieRadiusBorder();
}

function setNewVerRemindStatus(setStatus) {
    var submitData = {
        messagebox:setStatus
    };
    var res = object2xml('request', submitData);
    saveAjaxData('api/online-update/upgrade-messagebox', res, function($xml) {
        var return_ret = xml2object($xml);
        if (isAjaxReturnOK(return_ret)) {
            log.debug('home : send setNewVerRemindStatus success.');
        }
    }, {
        sync: true
    });
}

function checkNewVerRemind() {
    var ret = false;
    getAjaxData('api/online-update/upgrade-messagebox', function($xml) {
        var res = xml2object($xml);
        if ('response' == res.type && "1" == res.response.messagebox) {
            ret = true;
        }
    }, {
        sync: true
    });
    return ret;
}

function checkNewVersionShowDialog() {
    if (g_module.online_update_enabled) {
        if ( null == G_NotificationsStatus) {
            setTimeout(checkNewVersionShowDialog, MACRO_CHECK_INTERVAL);
        } else {
            if (MACRO_NEWVERSIONFOUND == G_NotificationsStatus.OnlineUpdateStatus || MACRO_READYTOUPDATE == G_NotificationsStatus.OnlineUpdateStatus) {
                if(checkNewVerRemind()) {
                    showNewVersionDialog('update.html');
                }
            }
        }
    }
}

function update_displayNewVersionFoundInfo() {
        getAjaxData('api/online-update/url-list', function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response') {
                var g_update_value = update_ret.response;
                var g_updateComponent = g_update_value.ComponentList.Component;
                if (g_updateComponent) {
                    var list_info = '';
                    var changeLog = IDS_update_label_features + common_colon;
                    if ($.isArray(g_updateComponent)) {
                        $.each(g_updateComponent, function(i) {
                            list_info += "<tr><td width='100'>" + newversion_label_newversion + common_colon + "</td><td><label class='up_newversion'>" + XSSResolveCannotParseChar(g_updateComponent[i].Version) + '</label></td></tr>' +
                            '<tr><td >' + sd_label_size + common_colon + "</td><td class = 'up_size'><label class='up_release'>" + formatComponentSize(g_updateComponent[i].ComponentSize) + '</label></td></tr>';
                        });
                    } else {
                        list_info += "<tr><td width='100'>" + newversion_label_newversion + common_colon + "</td><td><label class='up_newversion'>" + XSSResolveCannotParseChar(g_updateComponent.Version) + '</label></td></tr>' +
                        '<tr><td >' + sd_label_size + common_colon + "</td><td class = 'up_size'><label class='up_release'>" + formatComponentSize(g_updateComponent.ComponentSize) + '</label></td></tr>';
                    }
                    var useDefault = true;
                    $($xml.find('language')).each( function() {
                        if ($(this).attr('name') == LANGUAGE_DATA.current_language.replace(/_/, '-')) {
                            useDefault = false;
                            $($(this).find('features').find('feature')).each( function() {
                                changeLog += '\n' + $(this).text();
                            });
                        }
                    });
                    $($xml.find('language')).each( function() {
                        if (useDefault) {
                            var defaultLanguage = $xml.find('default-language').attr('name');
                            if ($(this).attr('name') == defaultLanguage) {
                                $($(this).find('features').find('feature')).each( function() {
                                    changeLog += '\n' + $(this).text();
                                });
                            }
                        }
                    });
                    $('.cancel_table_home').html(list_info);
                    $('.update_textarea_home').val(changeLog);
                }
            }
        });
}
var g_TB = 1024 * 1024 * 1024 * 1024;
var g_GB = 1024 * 1024 * 1024;
var g_MB = 1024 * 1024;
var g_KB = 1024;
function formatComponentSize(bytes_number) {
    if (bytes_number >= g_TB) {
        return formatFloat((parseFloat(bytes_number / (g_TB))) , 2) + ' TB';
    }
    if (bytes_number >= g_GB && bytes_number < g_TB) {
        return formatFloat((parseFloat(bytes_number / (g_GB))) , 2) + ' GB';
    } else if (bytes_number >= g_MB && bytes_number < g_GB) {
        return formatFloat((parseFloat(bytes_number / (g_MB))) , 2) + ' MB';
    } else if (bytes_number >= g_KB && bytes_number < g_MB) {
        return formatFloat((parseFloat(bytes_number / (g_KB))) , 2) + ' KB';
    } else if (bytes_number < g_KB) {
        return formatFloat((parseFloat(bytes_number / (1))) , 2) + ' B';
    }
}
function clearNewVersionDialog() {
    $('.new_version_dialog, #div_wrapper_newVersion').remove();
    hiddenSelect(false);
    enableTabKey();
}

function update_onClickUpdateNow_update() {
    var updateStatus = parseInt(G_NotificationsStatus.OnlineUpdateStatus, 10);
    if (updateStatus != 30 && updateStatus != 60) {
        var submitData = {
            userAckNewVersion: 0
        };
        var res = object2xml('request', submitData);
        saveAjaxData('api/online-update/ack-newversion', res, function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response') {
                log.debug('update data successfull');
            } else if (update_ret.type == 'error') {
                if (update_ret.error.code == '110024') {
                    showInfoDialog(STRID_update_hint_battery_prower_low);
                    return;
                }else{
                    showInfoDialog(common_failed);
                    return;
                }
            }
        },{sync: true});
    } else {
        showInfoDialog(IDS_update_updateing_try_again);
        return;
    }
}

$("#firstRadioWrapUpdateDialog input,#firstRadioWrapUpdateDialog label").live('click', function() {
    $('#firstRadioWrapUpdateDialog').next().show();
})
$("#lastRadioWrapUpdateDialog input,#firstRadioWrapUpdateDialog label").live('click', function() {
    $('#lastRadioWrapUpdateDialog').prev().hide();
})
function showNewVersionDialog(destnation) {
    var dialogHtml = '';
    if ($('#div_wrapper_newVersion').size() < 1) {
        dialogHtml += "<div id='div_wrapper_newVersion'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='new_version_dialog'>";
    dialogHtml += "    <div class='login_dialog_content newVersionDialogOverall'>";
    dialogHtml += "        <div class='login_dialog_header noBorder'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_new_version + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_newversion_close_btn clr_gray' href='javascript:void(0);' title='' id='newVersion_close_btn'><canvas id='showNewVersionCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += "        </div>";
    if(g_auto_update_enable == '1'){
        dialogHtml += "        <div style='padding:10px 20px;box-sizing:border-box;-moz-box-sizing:border-box;' class='dialog_table noBorder' id='onlineupdate_prompt'>" + IDS_common_updateDialog_content + "</div>";
        dialogHtml += "        <div style='padding:10px 20px;box-sizing:border-box;-moz-box-sizing:border-box;' class='dialog_table noBorder' id='onlineupdate_radio'>" ;
        dialogHtml += "            <div style='position:relative;margin-bottom:5px;' id='firstRadioWrapUpdateDialog'><input type='radio' id='onlineUpdate_radio1' name='updateDialod_r' checked><label for='onlineUpdate_radio1'>"+IDS_common_updateDialog_radio1+"</label></div>";
        dialogHtml += "            <div style='position:relative;margin-bottom:5px;' id='firstRadioCheckbox'>";
        dialogHtml += "                <input type='checkbox' checked id='onlineUpdate_isDefault'><label for='onlineUpdate_isDefault'>"+IDS_common_updateDialog_checkE5+"</label>";
        dialogHtml += "            </div>";
        dialogHtml += "            <div style='position:relative;margin-bottom:5px;' id='lastRadioWrapUpdateDialog'>";
        dialogHtml += "                <input type='radio' id='onlineUpdate_radio2' name='updateDialod_r'><label for='onlineUpdate_radio2'>"+IDS_common_updateDialog_radioE5+"</label>";
        dialogHtml += "            </div>";
        dialogHtml += "        </div>";
    } else {
        dialogHtml += "        <div style='padding:10px 20px;box-sizing:border-box;-moz-box-sizing:border-box;' class='dialog_table noBorder' id='onlineupdate_prompt'>" + IDS_common_new_version_auto_update + "</div>";
    }
    dialogHtml += "        <div class='dialog_table_bottom noBorder' style='padding-top:10px;padding-right:0;'>";
    dialogHtml += "            <div class='dialog_table_r' style='padding-right:26px;padding-left:26px;'>";
    dialogHtml += "                <span class='button_wrapper newVersion_confirm'>";
    if(g_auto_update_enable == '1'){
        dialogHtml += "                    <input id='newVersion_confirm' class='button_dialog' type='button' value='"+common_apply+"'></span>";
    } else {
        dialogHtml += "                    <input id='newVersion_confirm' class='button_dialog' type='button' value='"+common_update_now+"'></span>";
    }
    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper newVersion_Cancel'>";
    dialogHtml += "                <input id='newVersion_Cancel' class='button_dialog' type='button' value='"+IDS_common_updateDialog_remindLater+"'/></span>";
    dialogHtml += "            </div>";
    dialogHtml += "        </div>";
    dialogHtml += "       <div class='check_table_home'>";
    dialogHtml += "           <table cellspacing='0' cellpadding='0' class='cancel_table_home' id='cancel_table_home'>";
    dialogHtml += "           </table>";
    dialogHtml += "           <div class='update_text_home'> ";
    dialogHtml += "               <textarea class='update_textarea_home' readonly='readonly'>";
    dialogHtml += "               </textarea>";
    dialogHtml += "           </div>";
    dialogHtml += "      </div>";
    dialogHtml += "    </div>";
    dialogHtml += "</div>";
    $('.body_bg').before(dialogHtml);
    update_displayNewVersionFoundInfo();
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("showNewVersionCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".login_dialog_header").css({
            "width":"420px",
            "height":"29px"
        });
        $(".login_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","1px");
        $(".dialog_newversion_close_btn").css("top","7px");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
    } else {
        var canvas = document.getElementById("showNewVersionCanvas");
        draw(canvas);
    }
    hiddenSelect(true);
    reputPosition($('.new_version_dialog'), $('#div_wrapper_newVersion'));
    g_main_displayingPromptStack.push('newVersion_confirm');
    disableTabKey();

    $('#newVersion_confirm, #newVersion_Cancel, #newVersion_close_btn').die('click');
    $('#newVersion_confirm').live('click', function() {
        if(g_auto_update_enable == '1'){
            var data= {
                'auto_update':($("#onlineUpdate_radio2").prop('checked')||$("#onlineUpdate_isDefault").prop('checked'))? 1:0,
                'ui_download':$("#onlineUpdate_radio1").prop('checked')? 1:0
            }
            var data_xml = object2xml('request', data);
            saveAjaxData('api/online-update/autoupdate-config',data_xml, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    if(!$("#onlineUpdate_radio2").prop('checked')) {
                        if(!g_not_need_login_update) {
                            getAjaxData('api/user/state-login', function($xml) {
                                var ret = xml2object($xml);
                                if (ret.type == 'response') {
                                    if (ret.response.State != '0') { 
                                        g_destnation = destnation;
                                        clearNewVersionDialog();
                                        showloginDialog();
                                    } else {
                                        clearNewVersionDialog();
                                        g_main_displayingPromptStack.pop();
                                        hiddenSelect(false);
                                        gotoPageWithoutHistory(destnation);
                                        return false;
                                    }
                                } else {
                                    clearNewVersionDialog();
                                    g_main_displayingPromptStack.pop();
                                    hiddenSelect(false);
                                    gotoPageWithoutHistory(destnation);
                                    return false;
                                }
                            });
                        } else {
                            clearNewVersionDialog();
                            g_main_displayingPromptStack.pop();
                            hiddenSelect(false);
                            update_onClickUpdateNow_update();
                            gotoPageWithoutHistory(destnation);
                            return false;
                        }
                    } else {
                        clearNewVersionDialog();
                    }
                } else {
                    clearNewVersionDialog();
                }
            });
        } else {
            if(!g_not_need_login_update) {
                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        if (ret.response.State != '0') { 
                            g_destnation = destnation;
                            clearNewVersionDialog();
                            showloginDialog();
                        } else {
                            clearNewVersionDialog();
                            g_main_displayingPromptStack.pop();
                            hiddenSelect(false);
                            gotoPageWithoutHistory(destnation);
                            return false;
                        }
                    } else {
                        clearNewVersionDialog();
                        g_main_displayingPromptStack.pop();
                        hiddenSelect(false);
                        gotoPageWithoutHistory(destnation);
                        return false;
                    }
                });
            } else {
                clearNewVersionDialog();
                g_main_displayingPromptStack.pop();
                hiddenSelect(false);
                update_onClickUpdateNow_update();
                gotoPageWithoutHistory(destnation);
                return false;
            }
        }
    });
    $('#newVersion_Cancel,#newVersion_close_btn').live('click', function() {
        clearNewVersionDialog();
        g_main_displayingPromptStack.pop();
        hiddenSelect(false);        
        getAjaxData('api/redirection/homepage', function($xml) {
            var homepage_ret = xml2object($xml);
            if ('response' == homepage_ret.type) {
                if (g_isEnableRedirection) {
                    var homepage_url = null;
                    if (homepage_ret.response.Homepage.length === 0) {
                        return;
                    }

                    if (homepage_ret.response.Homepage.length > 4 &&
                        homepage_ret.response.Homepage.toLowerCase().substring(0, 4) == 'http') {
                        homepage_url = homepage_ret.response.Homepage;
                    } else {
                        homepage_url = 'http://' + homepage_ret.response.Homepage;
                    }

                    gotoPageWithoutHistory(homepage_url);
                } else {
                    var randid = getQueryStringByName("randid");
                    if(randid != null && randid.length > 0) {
                        setTimeout( function() {
                        getAjaxData("api/prsite/getrandurl", function($xml) {
                            var ret = xml2object($xml);
                            if (ret.type == "response") {
                                var randinfos = CreateArray(ret.response.randinfos.randinfo);
                                var i = 0;
                                var newUrl = '';
                                for ( i = 0; i < randinfos.length; i++) {
                                    if(randinfos[i].id == randid) {
                                        newUrl = randinfos[i].url;
                                        break;
                                    }
                                }
                                var post_data = {
                                    "randid":randid
                                }
                                var post_xml = object2xml('request', post_data);
                                saveAjaxData('api/prsite/getrandurl',post_xml, function($xml) {
                                    if ('' != newUrl) {
                                        newUrl = 'http://' + newUrl;
                                        gotoPageWithoutHistory(newUrl);
                                    }
                                });
                            }
                        }, {
                            sync: true
                        });
                        },1000);
                    }
                }
            }
        }, {
            sync: true
        });
       
        return false;
    });
}
if ( LANGUAGE_DATA.current_language =="ru_ru"){ 
    var not_net_title = "Отсутствует подключение к интернету";
    var not_net_tiptitle = "Что делать?";
    var not_net_tips_0 = "Проверить уровень сигнала сети";
    var not_net_tips_1 = "Проверить, корректно ли установлена SIM-карта в устройство";
    var not_net_tips_2 = "Проверить, используется ли SIM-карта МТС";
}else{
    var not_net_title = "No internet connection";
    var not_net_tiptitle = "Try to follow these steps?";
    var not_net_tips_0 = "Check network signal strength";
    var not_net_tips_1 = "Check if SIM-card has been correctly installed into the device";
    var not_net_tips_2 = "Check whether MTS SIM card is used";
}
var left_content='\
            <div id="new_content_left">\
                <iframe src="https://lk.ssl.mts.ru/widgetoutward/iframe/my_internet/" width="300" height="425" align="left"  style="border:none;"  scrolling="no" id="home_left_iframe">\
                Ваш браузер не поддерживает плавающие фреймы!\
                </iframe>\
            </div>\
        ';

function creatHomeContent() {
	
		 if ( LANGUAGE_DATA.current_language =="ru_ru" && search == 'yandex') {
        $('#new_sub_logo').addClass('ru_sub_logo');
    }

    if(search != 'yandex') {
        $('#search_box_content').attr('style', 'border: none !important;');
        $('.search_t').addClass('search_t_noyandex').removeClass('search_t');
        $('img[src="../res/Button2.png"]').remove();
        $('.search_btn_text').addClass('search_btn_text_noyandex').removeClass('search_btn_text');
    }

    if(search == 'google') {
        $('#new_sub_logo').addClass('google_sub_logo');
    }
	
	//$('#new_body').html(left_content);
    //$('#new_body').append($('#new_content_left').detach());
    $('#new_content_right_top, #new_content_right_bottom').detach();
    $('#new_content_right').append($('#statistic_img').detach().css({position: 'relative', left: '25%', paddingTop: '45px'}));
    if(webui_mode == 'old' && force_new_home) {
        $('.login_box_info').after($('#new_content_right').detach().show());
    } else {
        if(webui_mode == 'new' && force_old_home) {
            $('.center_box script').detach();
            $('#new_body').append($('.center_box').detach());
            $('#new_body').append($('#new_content_right').detach().show());
        } else {
            $('#new_body').append($('#new_content_right').detach().show());
        }
    }
}
function setHomeIfarme() {
   if(G_MonitoringStatus.response.ConnectionStatus == '901') {
        if ($('#new_content_right_top iframe').length === 0) {
            $('#new_content_right_top').html('<iframe class="b-iframe_header_user" src="http://banners.adfox.ru/160701/mts/588107/place2.html" width="630" height="220" frameborder="0" scrolling="no" allowtransparency="true" style="overflow:hidden"></iframe>');
        }
        if ($('#new_content_right_bottom iframe').length === 0) {
            $('#new_content_right_bottom').html('<iframe class="b-iframe_header_user" src="http://banners.adfox.ru/160701/mts/588107/place1.html" width="630" height="220" frameborder="0" scrolling="no" allowtransparency="true" style="overflow:hidden"></iframe>');
        }
    } else {
        $('#new_content_right_top').html('');
        $('#new_content_right_bottom').html('');
    }

    setTimeout(setHomeIfarme, 2000);
}


$(document).ready(function () {

	if(typeof(user_config.force_new_home) != 'undefined') {
		force_new_home = user_config.force_new_home == 'true' ? true : false;
	}
	if(typeof(user_config.force_old_home) != 'undefined') {
		force_old_home = user_config.force_old_home == 'true' ? true : false;
	}

	if(typeof(user_config.search) != 'undefined') {
		search = user_config.search;
	}
	
	$('.search_btn_text').text(new_search_text);
	
	$('#search_button').bind('click', function() {
		var a = $('.search_t').val();
                var final_link
                if(search == 'yandex')
                    final_link = "https://yandex.ru/search/?text="+a+ "&clid=2288582";
		else if(search == 'google')
                    final_link = "https://google.com/search?q="+a;

	
        window.open (final_link,'_blank');
      });
      
      
    
    if(webui_mode == 'new') {
        $('#login_wrapper').css('display', 'none');
    }
    creatHomeContent();
    //setHomeIfarme();

    if(webui_mode == 'new' || force_new_home) {
        if(G_MonitoringStatus.response.ConnectionStatus != '901') {
            showInfoDialog('\
                <div">\
                    <div class="not-net-title">' + not_net_title + '</div>\
                    <div class="not-net-tiptitle">' + not_net_tiptitle + '</div>\
                    <ul  class="not-net-tips">\
                        <li>' + not_net_tips_0 + '</li>\
                        <li>' + not_net_tips_1 + '</li>\
                        <!--<li>' + not_net_tips_2 + '</li>-->\
                    </ul>\
                </div>\
        ', undefined, undefined, true);
    }
    }

});

var search = 'yandex';
var force_new_home = false;
var force_old_home = false;

if (LANGUAGE_DATA.current_language == 'ru_ru') {
    var dialup_label_download_upload_speed = 'Скорость загрузки/передачи';
    var dialup_label_max_download_upload_speed = 'Макс. скорость загр./перед.';
} else {
    var dialup_label_download_upload_speed = 'Download/upload speed';
    var dialup_label_max_download_upload_speed = 'Max down/up speed';
}
