// JavaScript Document
/***************************the common var******************/
var force_Update_CurrentComponentStatus = 0;
var force_Update_DownloadProgressStatus = 0;
var ONLINE_UPDATE_STATUS_INTERVAL = 10000;
var g_setup_wizard_page = '';
var g_default_password_status = -1;
var g_auto_update_enable = '';
var g_Driver_classify = '';
var g_not_need_login_update = false;
var g_set_cookie_flag = false;
var notLoginupdate_leftmenu = true;
var force_update_leftmenu = true;
var auto_update_leftmenu = true;
var g_hilink_login_status = 0;
var g_hilink_login_old_api = 0;
var g_nedd_login = 1;
var clearshow = null;
var g_logining_flag = false;
var g_login_checking_flag = false;
// Global Features
var g_copyright_year = '';
var g_sms_mode = '';
var g_isPad_status = false;
var g_copyright_enabled = null;
var g_coulometer_BatteryStatus = -11111;
var g_BatteryPercent = -11111;
var g_coulometer_status = '-1';
var g_up_connection_status = "0";
var g_down_connection_status = "0";
var g_up_down_connection_status = "0";
var g_disable_connection_status = "0";
var g_smallPage = false;
var g_feature = null;
var flag_focus = true;
var g_networktype = [];
var g_moduleswitch = null;
var g_module = null;
var g_wifi = null;
var g_dailup = null;
var g_destnation = null;
var g_nav = null;
var g_isReady = false;
var g_loginFlag = false;
var g_bridgeModeStatus = false;
var LOGOUT_TIMEOUT_MAIN = 1200000;
var SIMCARD_STATUS_REFRESH = 10000;
var SIMCARD_OK = 1;
var HEARTBEAT_TIMEOUT = 60000;
var g_logoutTimer = '';
var g_heart_beat_timer = '';
var g_pin_status_SimPukTimes = '';
var g_ProductCDMA = false;
var g_assistant_ret = null;
//Language list scroll control
var g_LANGUAGE_COUNT = 13;
var g_LANGUAGE_LIST_HEIGHT = '300px';
var g_decive_timer = null;
var g_simcard_timer = null;
// constant variable
var G_MonitoringStatus = null;
var G_NotificationsStatus = null;
var G_StationStatus = null;

var G_CradleStatus = null;
var G_cradleStationStatus = null;
//wifioffload variable
var g_stationInfo = '';
var g_stationInfoFlag = false;
var g_wifiStatusInfo = '';

var g_password_type = 0;

var MACRO_SHOW_POPUP = 1;
//PUK times 0
var PUK_TIMES_ZERO = '0';
//Pin status
var MACRO_NO_SIM_CARD = '255';
var MACRO_CPIN_FAIL = '256';
var MACRO_PIN_READY = '257';
var MACRO_PIN_DISABLE = '258';
var MACRO_PIN_VALIDATE = '259';
var MACRO_PIN_REQUIRED = '260';
var MACRO_PUK_REQUIRED = '261';
//restore to quicksetup
var basic_infos = null;
var checkDialogFlag = false;
//Connection status
var MACRO_CONNECTION_CONNECTING = '900';
var MACRO_CONNECTION_CONNECTED = '901';
var MACRO_CONNECTION_DISCONNECTED = '902';
var MACRO_CONNECTION_DISCONNECTING = '903';
var wanUpload = '';
var wanDownload = '';
var g_network_action = {
        dataswitch: '0'
    };
//wifi Connection status
var WIFI_CONNECTING = '900';
var WIFI_CONNECTED= '901';
var WIFI_DISCONNECTED = '902';
var WIFI_DISCONNECTING = '903';
var wifiUpload = '';
var wifiDownload = '';

//Cradle Connection status
var CRADLE_CONNECTING = '900';
var CRADLE_CONNECTED = '901';
var CRADLE_DISCONNECTED = '902';
var CRADLE_DISCONNECTING = '903';
var CRADLE_CONNECTFAILED = '904';
var CRADLE_CONNECTSTATUSNULL = '905';
var CRANDLE_CONNECTSTATUSERRO = '906';
var CRADLE_NETLINE_NOEXIST = 0;
var CRADLE_NETLINE_EXIST = 1;
var ETHERNET_LAN_MODE = '5';
var CRADLEAUTOMODE = '0';

var FORBID_AUTO_CONNECT_OPEN_DEVICE = '112';
var FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING = '113';
var FORBID_RE_CONNECT_DROPLINE = '114';
var FORBID_RE_CONNECT_DROPLINE_ROAMING = '115';
//SIM status
var MACRO_SIM_STATUS_USIM_N = '0';
var MACRO_SIM_STATUS_USIM_Y = '1';
var MACRO_SIM_STATUS_USIM_CS_N = '2';
var MACRO_SIM_STATUS_USIM_PS_N = '3';
var MACRO_SIM_STATUS_USIM_PS_CS_N = '4';
var MACRO_SIM_STATUS_ROMSIM = '240';
var MACRO_SIM_STATUS_USIM_NE = '255';
//Battery status
var MACRO_BATTERY_STATUS_NORMAL = '0';
var MACRO_BATTERY_STATUS_ELECT = '1';
var MACRO_BATTERY_STATUS_LOW = '-1';
var MACRO_BATTERY_STATUS_NOBATTERY = '2';
//Battery level
var MACRO_BATTERY_LEVEL_ZERO = '0';
var MACRO_BATTERY_LEVEL_ONE = '1';
var MACRO_BATTERY_LEVEL_TWO = '2';
var MACRO_BATTERY_LEVEL_THREE = '3';
var MACRO_BATTERY_LEVEL_FOUR = '4';
//Signal status
var MACRO_EVDO_LEVEL_ZERO = '0';
var MACRO_EVDO_LEVEL_ONE = '1';
var MACRO_EVDO_LEVEL_TWO = '2';
var MACRO_EVDO_LEVEL_THREE = '3';
var MACRO_EVDO_LEVEL_FOUR = '4';
var MACRO_EVDO_LEVEL_FIVE = '5';

//CurrentPlmn
var MACRO_CURRENT_NETWOORK_2G = '0';
var MACRO_CURRENT_NETWOORK_3G = '2';
var MACRO_CURRENT_NETWOORK_H = '5';
var MACRO_CURRENT_NETWOORK_4G = '7';

var SERVICE_STATUS_AVAIABLE = 2;

//CurrentNetworkType
var MACRO_NET_WORK_TYPE_NOSERVICE         = '0';          /* 无服务            */

var MACRO_NET_WORK_TYPE_GSM               = '1';          /* GSM模式           */
var MACRO_NET_WORK_TYPE_GPRS              = '2';          /* GPRS模式          */
var MACRO_NET_WORK_TYPE_EDGE              = '3';          /* EDGE模式          */

var MACRO_NET_WORK_TYPE_WCDMA             = '4';          /* WCDMA模式         */
var MACRO_NET_WORK_TYPE_HSDPA             = '5';          /* HSDPA模式         */
var MACRO_NET_WORK_TYPE_HSUPA             = '6';          /* HSUPA模式         */
var MACRO_NET_WORK_TYPE_HSPA              = '7';          /* HSPA模式          */
var MACRO_NET_WORK_TYPE_TDSCDMA           = '8';          /* TDSCDMA模式       */
var MACRO_NET_WORK_TYPE_HSPA_PLUS         = '9';          /* HSPA_PLUS模式     */
var MACRO_NET_WORK_TYPE_EVDO_REV_0        = '10';         /* EVDO_REV_0模式    */
var MACRO_NET_WORK_TYPE_EVDO_REV_A        = '11';         /* EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_EVDO_REV_B        = '12';         /* EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_1xRTT             = '13';         /* 1xRTT模式         */
var MACRO_NET_WORK_TYPE_UMB               = '14';         /* UMB模式           */
var MACRO_NET_WORK_TYPE_1xEVDV            = '15';         /* 1xEVDV模式        */
var MACRO_NET_WORK_TYPE_3xRTT             = '16';         /* 3xRTT模式         */
var MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM   = '17';         /* HSPA+64QAM模式    */
var MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO    = '18';          /* HSPA+MIMO模式     */

var MACRO_NET_WORK_TYPE_LTE               = '19';          /*LTE 模式*/

var MACRO_NET_WORK_TYPE_EX_NOSERVICE         = '0';          /* 无服务                   */
var MACRO_NET_WORK_TYPE_EX_GSM               = '1';          /* GSM模式                  */
var MACRO_NET_WORK_TYPE_EX_GPRS              = '2';          /* GPRS模式                 */
var MACRO_NET_WORK_TYPE_EX_EDGE              = '3';          /* EDGE模式                 */

var MACRO_NET_WORK_TYPE_EX_IS95A             = '21';         /* IS95A模式                */
var MACRO_NET_WORK_TYPE_EX_IS95B             = '22';         /* IS95B模式                */
var MACRO_NET_WORK_TYPE_EX_CDMA_1x           = '23';         /* CDMA1x模式               */
var MACRO_NET_WORK_TYPE_EX_EVDO_REV_0        = '24';         /* EVDO_REV_0模式           */
var MACRO_NET_WORK_TYPE_EX_EVDO_REV_A        = '25';         /* EVDO_REV_A模式           */
var MACRO_NET_WORK_TYPE_EX_EVDO_REV_B        = '26';         /* EVDO_REV_A模式           */
var MACRO_NET_WORK_TYPE_EX_HYBRID_CDMA_1x    = '27';         /* HYBRID_CDMA1x模式        */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0 = '28';         /* HYBRID_EVDO_REV_0模式    */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A = '29';         /* HYBRID_EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B = '30';         /* HYBRID_EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_EX_EHRPD_REL_0       = '31';         /* EHRPD_Rel_0模式          */
var MACRO_NET_WORK_TYPE_EX_EHRPD_REL_A       = '32';         /* EHRPD_Rel_A模式          */
var MACRO_NET_WORK_TYPE_EX_EHRPD_REL_B       = '33';         /* EHRPD_Rel_B模式          */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_0= '34';         /* HYBRID_EHRPD_Rel_0模式   */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_A= '35';         /* HYBRID_EHRPD_Rel_A模式   */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_B= '36';         /* HYBRID_EHRPD_Rel_B模式   */

var MACRO_NET_WORK_TYPE_EX_WCDMA             = '41';         /* WCDMA模式                */
var MACRO_NET_WORK_TYPE_EX_HSDPA             = '42';         /* HSDPA模式                */
var MACRO_NET_WORK_TYPE_EX_HSUPA             = '43';         /* HSUPA模式                */
var MACRO_NET_WORK_TYPE_EX_HSPA              = '44';         /* HSPA模式                 */
var MACRO_NET_WORK_TYPE_EX_HSPA_PLUS         = '45';         /* HSPA_PLUS模式            */
var MACRO_NET_WORK_TYPE_EX_DC_HSPA_PLUS      = '46';         /* DC_HSPA_PLUS模式         */

var MACRO_NET_WORK_TYPE_EX_TD_SCDMA          = '61';         /* TD_SCDMA模式             */
var MACRO_NET_WORK_TYPE_EX_TD_HSDPA          = '62';         /* TD_HSDPA模式             */
var MACRO_NET_WORK_TYPE_EX_TD_HSUPA          = '63';         /* TD_HSUPA模式             */
var MACRO_NET_WORK_TYPE_EX_TD_HSPA           = '64';         /* TD_HSPA模式              */
var MACRO_NET_WORK_TYPE_EX_TD_HSPA_PLUS      = '65';         /* TD_HSPA_PLUS模式         */

var MACRO_NET_WORK_TYPE_EX_802_16E           = '81';         /* 802.16E模式              */

var MACRO_NET_WORK_TYPE_EX_LTE               = '101';        /* LTE 模式                 */
var MACRO_KEYCODE    =      13 ;

//Wifi status
var MACRO_WIFI_OFF = '0';
var MACRO_WIFI_ON = '1';
var MACRO_WIFI_5G = '5G';

var AJAX_HEADER = '../';
var AJAX_TAIL = '';

var AJAX_TIMEOUT = 30000;
var LOGIN_STATES_SUCCEED = '0';
var LOGIN_STATES_FAIL = '-1';
var LOGIN_STATES_REPEAT = '-2';
var g_needToLogin = '';
var g_supportHeartBeat = false;
var g_needHelp = '';
var g_needFooter = '';
var g_isTrunOffWlanChecked = false;
var g_MainMenuNumber = 2;

var ERROR_SYSTEM_NO_SUPPORT = 100002;
var ERROR_SYSTEM_NO_RIGHTS = "100003";
var ERROR_SYSTEM_BUSY = 100004;
var ERROR_LOGIN_USERNAME_WRONG = 108001;
var ERROR_LOGIN_PASSWORD_WRONG = 108002;
var ERROR_LOGIN_ALREADY_LOGIN = 108003;
var ERROR_LOGIN_USERNAME_PWD_WRONG = 108006;
var ERROR_LOGIN_USERNAME_PWD_ORERRUN = 108007;
var ERROR_LOGIN_TOUCH_ALREADY_LOGIN = 108009;
var ERROR_VOICE_BUSY = 120001;
var ERROR_WRONG_TOKEN = 125001;
var ERROR_WRONG_SESSION = 125002;
var ERROR_WRONG_SESSION_TOKEN = 125003;

var MACRO_LOGIN = '1';
var MACRO_LOGOUT = '2';
var MACRO_NEWVERSIONFOUND = '12';
var MACRO_READYTOUPDATE = '50';

var MACRO_PASSWORD_LOW = 1;
var MACRO_PASSWORD_MID = 2;
var MACRO_PASSWORD_HIG = 3;
var MACRO_PASSWORD_REMIND_ON = "0";
var MACRO_PASSWORD_REMIND_OFF = "1";
var g_monitoring_dumeter_kb = 1024;
var g_monitoring_dumeter_mb = 1024 * 1024;
var g_monitoring_dumeter_gb = 1024 * 1024 * 1024;
var g_monitoring_dumeter_tb = 1024 * 1024 * 1024 * 1024;
var WIFI5G_ON = '1';
var wifi5g_icon_flag = "-1";
var wifion_icon_flag = "-1";
var g_wifiFeatureSwitch = '';
var g_wlanInfo = "";
var plmn_rat_index = {
    0 : 2,
    2 : 3
};
var g_judgeApplyFlag = false;
var g_isBridgeNotesOpened = false;
var g_is_connect_clicked = false;
var g_is_disconnect_clicked = false;
var g_is_network_connect = false;
var g_is_wlan_connect = false;
var g_is_power_off = false;
var g_new_switch = false;
var g_isPostAjax = false;
var g_base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

var g_is_login_opened = false;
// Aim to take all the prompt displaying on a page as a stack.
var g_main_displayingPromptStack = [];

var DATA_READY = {
    statusReady: false,
    apStationReady: false,
    notificationsReady: false,
    cradleReady:false
};
var USER_MANUAL_PATH = 'usermanual';
var USER_MANUAL_FILE_NAME = 'web_content_concept_00001.html';
var g_user_manual_url = '';
//If remove when show confirm dialog
var DIALOG_UNREMOVE = 0;
//Constant for initialization tooltip
var STATUS_BAR_ICON_STATUS = {
    sim_signal_tooltip_state: '',
    station_tooltip_state: '',
    wan_tooltip_state: '',
    wifi_tooltip_state: '',
    battery_tooltip_state: '',
    unread_sms_tooltip_state: '',
    wifi_indoor_tooltip_state: ''
};

var STATUS_LISTENER_FUN_LIST = [];
var g_lastBatteryStatus = null;
//
var header_icon_status = {
    ConnectionStatus: ' ',
    SignalStrength: ' ',
    BatteryStatus: ' ',
    BatteryLevel: ' ',
    BatteryPercent: ' ',
    SimStatus: ' ',
    WifiStatus: ' ',
    ServiceStatus: ' ',
    CurrentNetworkType: ' '
};

//Wifi station connection status
var WIFI_STATION_DISCONNECTED = '0';
var WIFI_STATION_CONNECTING = '1';
var WIFI_STATION_CONNECTED = '2';
var WIFI_STATION_DISCONNECTING = '3';
//icon status
var g_BatteryStatus = -11111;
var g_BatteryLevel = -11111;
var g_WifiStatus = -11111;
var g_ConnectionStatus = -11111;
var sign_enable = 1;
var g_SimStatus = -11111;
var g_hSimStatus = -11111;
var g_SignalStrength = -11111;
var g_WifiIndoorStatus = -11111;
var g_Monitoring_CradleConnectionStatus = -11111;

var g_headIconConnectionStatus = -11111;
var g_NotificationsOnlineUpdateStatus = -11111;
//URL to home page
var HOME_PAGE_URL = 'home.html';
var VOICE_BUSY_URL = 'voicebusy.html';

/*invialid page*/
var g_PageUrlTree = null;
var g_USBtetheringSwitch = null;
var USBTETHERING_ON = '1';
var g_PositionInfo = null;
var MACRO_NET_SINGLE_MODE = 1;
var MACRO_NET_DUAL_MODE = 2;
var MACRO_NET_MODE_CHANGE = 1;
var MACRO_NET_MODE_RESET = 0;
var MACRO_NET_MODE_C = 1;
var MACRO_NET_MODE_W = 2;
var g_net_mode_type = MACRO_NET_SINGLE_MODE;
var g_net_mode_change = MACRO_NET_MODE_RESET;
var g_net_mode_status = null;
var g_ussdLeftmenu = [];
var tabKeyflag = false;

/*not support char*/
var MACRO_SUPPORT_CHAR_MIN = 32;
var MACRO_SUPPORT_CHAR_MAX = 126;
var MACRO_NOT_SUPPORT_CHAR_COMMA = 44; //,
var MACRO_NOT_SUPPORT_CHAR_QUOTATION_MARK = 34; //"
var MACRO_NOT_SUPPORT_CHAR_COLON = 58; //:
var MACRO_NOT_SUPPORT_CHAR_SEMICOLON = 59; //;
var MACRO_NOT_SUPPORT_BACKSLASH_MARK = 92; //\
var MACRO_NOT_SUPPORT_CHAR_38 = 38; //&
var MACRO_NOT_SUPPORT_CHAR_37 = 37; //%
var MACRO_NOT_SUPPORT_CHAR_43 = 43; //+
var MACRO_NOT_SUPPORT_CHAR_39 = 39; //'
var MACRO_NOT_SUPPORT_CHAR_60 = 60; //<
var MACRO_NOT_SUPPORT_CHAR_62 = 62; //>
var MACRO_NOT_SUPPORT_CHAR_63 = 63; //?

/* ------------------------ Language ----------------------------------- */
var LANGUAGE_DATA = {
    current_language: 'en_us',
    supportted_languages: [],
    privacy_policy_list: {},
    usermanual_language_list: {}
};
var current_href = window.location.href;
var TOPMENU = {
    nav: [],
    have: false
};
var log = log4javascript.getNullLogger();
var _logEnable = getQueryStringByName('log');
var g_main_convergedStatus = null;
var g_plmn_rat = '';
var g_net_mode = '';
var g_scarm_login = false;
var g_scarm_salt = '';
var RSA_LOGIN_MODE = '1';
/******************************** DHCP ***************************************/
var DHCP_IP_ADDRESS_DEFAULT = '';
var DHCP_START_IP_ADDRESS_DEFAULT = '';
var DHCP_END_IP_ADDRESS_DEFAULT = '';
var DHCP_STATUS_DEFAULT = '1';
var DHCP_STATUS_DISABLED = '0';
var DHCP_LAN_NET_MASK_DEFAULT = '';
var DHCP_LEASE_TIME_DEFAULT = '0';
var dhcpLanIPAddress;
var dhcpLanNetmask;
var dhcpEnable;
var dhcpLanStartIP;
var dhcpLanEndIP;
var dhcpLeaseTime;
var firstTimeMontitoringStatusQuery = '0';
var alreadyStatusListnerExecuted = '0';
var dhcpPageVar = {
    DhcpIPAddress: DHCP_IP_ADDRESS_DEFAULT,
    DhcpLanNetmask: DHCP_LAN_NET_MASK_DEFAULT,
    DhcpStatus: DHCP_STATUS_DEFAULT,
    DhcpStartIPAddress: DHCP_START_IP_ADDRESS_DEFAULT,
    DhcpEndIPAddress: DHCP_END_IP_ADDRESS_DEFAULT,
    DHCPLeaseTime: DHCP_LEASE_TIME_DEFAULT
};
function initDhcp() {
    dhcpLanIPAddress = dhcpPageVar.DhcpIPAddress;
    dhcpLanNetmask = dhcpPageVar.DhcpLanNetmask;
    dhcpEnable = dhcpPageVar.DhcpStatus;
    dhcpLanStartIP = dhcpPageVar.DhcpStartIPAddress;
    dhcpLanEndIP = dhcpPageVar.DhcpEndIPAddress;
    dhcpLeaseTime = dhcpPageVar.DHCPLeaseTime;
}

/********************************function***************************************/

function matchLanguageExist(current_lang, lang_list_arr) {
    if ($.isArray(lang_list_arr)) {
        var lang_exsit = 0;
        $.each(lang_list_arr, function(i, v) {
            if (v.replace(/-/, '_') == current_lang.replace(/-/, '_')) {
                lang_exsit = i;
                return false;
            }
        });
        LANGUAGE_DATA.current_language = lang_list_arr[lang_exsit].replace(/-/, '_');
    } else if ('undefined' != typeof (lang_list_arr)) {
        LANGUAGE_DATA.current_language = lang_list_arr.replace(/-/, '_');
    } else {
        LANGUAGE_DATA.current_language = 'en_us';
    }
}

function reloadLeftMenu() {
    log.debug('start reloadLeftMenu');
    //reload left menu
    if($(".content").children().first().is(".main_left")) {
        if ($('.main_left').children().is('#settings_menu')) {
            log.debug('checking setting menu');
            if($.trim($('#settings_menu').html()) == '' || $('#settings_menu').html() == null) {
                log.debug('setting menu is null');
                showleftMenu();
            }
        } else if ($('.main_left').children().is('#sms_menu')) {
            log.debug('checking sms menu');
            if($.trim($('#sms_menu').html()) == '' || $('#sms_menu').html() == null) {
                log.debug('sms menu is null');
                showleftMenu();
            }
        } else if ($('.main_left').children().is('#ussd_setting_menu')) {
            log.debug('checking ussd menu');
            if($.trim($('#ussd_setting_menu').html()) == '' || $('#ussd_setting_menu').html() == null) {
                log.debug('ussd menu is null');
                showleftMenu();
            }
        } else if ($('.main_left').children().is('#sharingsamba_menu')) {
            if($.trim($('#sharingsamba_menu').html()) == '' || $('#sharingsamba_menu').html() == null) {
                showleftMenu();
            }
        }
    }

    //reLoad footer
    if (g_needFooter) {
        if($.trim($('#footer').html()) == '' || $('#footer').html() == null) {
            log.debug('footer is null');
            showFooter();
        }

    }

}

// load lang file

function loadLangFile() {
    var langFile = '../language/lang_' + LANGUAGE_DATA.current_language + '.js';

    if((window.navigator.appVersion.indexOf('Version/3.1')>0||window.navigator.appVersion.indexOf('Version/3.2')>0||window.navigator.appVersion.indexOf('Version/3.0')>0) && window.navigator.appVersion.indexOf('Safari')>0) {

        var head = document.getElementsByTagName("head")[0];
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', langFile, false);
        xmlHttp.send(null);
        var script = document.createElement( "script" );
        script.type = "text/javascript";
        script.text = xmlHttp.responseText;
        head.appendChild(script);
    } else {
        $.ajax({
            async: false,
            //cache: false,
            type: 'GET',
            timeout: '3000',
            url: langFile,
            dataType: 'script',
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                try {
                    log.error('MAIN : loadLangFile() error.');
                    log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                    log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                    log.error('MAIN : textStatus' + textStatus);
                    log.error('MAIN : errorThrown' + errorThrown);
                } catch (exception) {
                    log.error(exception);
                }
            },
            success: function(data) {
                log.debug('MAIN : loadLangFile() success.');
            }
        });
    }
}

/*
 For page load optimize, we use one request instead of 3 request
 api/monitoring/converged-status = api/pin/status + api/pin/simlock +
 api/language/current-language
 */
function main_getConvergedStatus() {
    getAjaxData('api/monitoring/converged-status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_main_convergedStatus = ret.response;
            matchLanguageExist(g_main_convergedStatus.CurrentLanguage, LANGUAGE_DATA.supportted_languages);

            // get language file
            loadLangFile();
        }
    }, {
        sync: true
    });

    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
        $('link').attr('href', '../css/main_Arabic.css');
    }

    $(document).ready( function() {
        $('#login_wrapper').show();
        document.onblur = function () {
            flag_focus = false;
        };
        document.onclick = function () {
            flag_focus = true;
        };
        g_simcard_timer = setTimeout(refreshSimcardStatus, SIMCARD_STATUS_REFRESH);
    });
}

function getLangList() {
    getConfigData('config/global/languagelist.xml', function($xml) {
        var lang_list_ret = xml2object($xml);
        if (lang_list_ret.type == 'config') {
            LANGUAGE_DATA.supportted_languages = lang_list_ret.config.languages.language;
            LANGUAGE_DATA.privacy_policy_list = lang_list_ret.config.privacy_policy_url;
            LANGUAGE_DATA.usermanual_language_list = lang_list_ret.config.usermanual_language;
        } else {
            log.error('Load language data failed');
        }
    }, {
        sync: true
    });
}

function initLanguage() {
    getLangList();
    main_getConvergedStatus();
}

function main_executeBeforeDocumentReady() {
    user_config = getUserConfig();
    if(typeof(user_config.webui_mode) != 'undefined') {
        webui_mode = user_config.webui_mode;
    }
    if(typeof(user_config.force_new_ussd) != 'undefined') {
        force_new_ussd = user_config.force_new_ussd == 'true' ? true : false;
    }
    if(typeof(user_config.force_old_ussd) != 'undefined') {
        force_old_ussd = user_config.force_old_ussd == 'true' ? true : false;
    }
    if(typeof(user_config.force_new_sms) != 'undefined') {
        force_new_sms = user_config.force_new_sms == 'true' ? true : false;
    }
    if(typeof(user_config.force_old_sms) != 'undefined') {
        force_old_sms = user_config.force_old_sms == 'true' ? true : false;
    }

    getDefaultPass();
    // initial logger
    if (_logEnable == 'debug') {
        log.setLevel(log4javascript.Level.DEBUG);
    } else if (_logEnable == 'trace') {
        log.setLevel(log4javascript.Level.TRACE);
    }
    log.debug('MAIN : entered ' + window.location.href);
    getGlobalFeatures();

    // get converged status to initial
    initLanguage();

    if ($.browser.msie && ($.browser.version == '6.0')) {
        try {
            document.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }
    }

    //var temp = current_href;
    if (current_href.indexOf('?url') > 0) {
        current_href = current_href.substring(0, current_href.indexOf('?url'));
        current_href = current_href.substring(current_href.lastIndexOf('/') + 1);
        current_href = current_href.substring(0, current_href.indexOf('.'));

    } else {
        current_href = current_href.substring(current_href.lastIndexOf('/') + 1);
        if (current_href.lastIndexOf('?') > 0) {
            current_href = current_href.substring(0, current_href.lastIndexOf('?'));
            current_href = current_href.substring(0, current_href.indexOf('.'));
            if (current_href == 'smsinbox') {
                current_href = location.search.substring(1);
            }
        } else {
            current_href = current_href.substring(0, current_href.lastIndexOf('.'));
        }
    }

    selectCur(g_PageUrlTree);
    checkUpdateNeedLogin();
    force_update_leftmenu_check();
    auto_update_leftmenu_check();
    checkModuleEnable(current_href);
    if (navigator.userAgent.indexOf('MSIE 6.') > -1) {
        window.attachEvent('onload', correctPNG);
    }
    getAjaxData('api/device/device-feature-switch', function($xml) {
        var coulometer_ret = xml2object($xml);
        if (coulometer_ret.type == 'response') {
            g_coulometer_status = coulometer_ret.response.coulometer_enabled;
        }
    });
    getAjaxData('api/user/state-login', function($xml) {
        var rets = xml2object($xml);
        if (rets.type == 'response') {
            if ('undefined' != typeof(rets.response.extern_password_type) && '1' == rets.response.extern_password_type) {
                g_scarm_login = true;
            } else {
                g_scarm_login = false;
            }
        }
    }, {
        sync: true
    });
}

function checkObjectExist() {
    var ret = true;
    var i = 0;
    var tempObject = arguments[0];
    if(typeof(tempObject) == 'object') {
        for(i = 1; i < arguments.length; i++) {
            if((typeof tempObject == "object") && (arguments[i] in tempObject)) {
                tempObject = tempObject[arguments[i]];
            } else {
                ret = false;
                break;
            }
        }
    }
    if($.trim(tempObject) == '') {
        ret = false;
    }
    return ret;
}

function checkGotoHome(enable) {
    if(!enable) {
        gotoPageWithoutHistory(HOME_PAGE_URL);
    }
}

function checkModuleEnable(current_page) {

    switch (current_page) {
        case "commend":
            g_smallPage = mainIsHandheldBrowser();
            checkGotoHome(g_smallPage && g_feature.commend_enable && checkObjectExist(g_PageUrlTree,"commend"));
            break;
        case "home":
            break;
	case "payment":
        case "update_autorun":
            gotoPageWithoutHistory(HOME_PAGE_URL);
            break;
        case "opennewwindow":
            break;
        case "statistic":
            checkGotoHome(g_module.statistic_enabled);
            break;
        case "smsinbox":
        case "smssent":
        case "smsdrafts":
            checkGotoHome(g_module.sms_enabled);
            if(g_sms_mode == 1) {
                gotoPageWithoutHistory(HOME_PAGE_URL);
            }
            break;
        case "smsandroid":
            checkGotoHome(g_module.sms_enabled);
            if(g_sms_mode != 1) {
                gotoPageWithoutHistory(HOME_PAGE_URL);
            }
            break;
        case "messagesettings":
            checkGotoHome(g_module.sms_enabled && checkObjectExist(g_PageUrlTree, "sms", "sms_center_number"));
            if(g_sms_mode == 1) {
                gotoPageWithoutHistory(HOME_PAGE_URL);
            }
            break;
        case "chatmessagesettings":
            checkGotoHome(g_module.sms_enabled && checkObjectExist(g_PageUrlTree, "sms", "sms_center_number_android"));
            if(g_sms_mode != 1) {
                gotoPageWithoutHistory(HOME_PAGE_URL);
            }
            break;
        case "phonebook":
            checkGotoHome(g_module.pb_enabled);
            break;
        case "ussd":
            checkGotoHome(g_module.ussd_enabled);
            break;
        case "update":
            //checkGotoHome(g_module.online_update_enabled && checkObjectExist(g_PageUrlTree, "settings", "setting_update"));
            checkGotoHome(g_module.local_update_enabled && checkObjectExist(g_PageUrlTree, "update", "update"));
            break;
        case "update_local":
            //checkGotoHome(g_module.local_update_enabled && checkObjectExist(g_PageUrlTree, "update", "update_local"));
            checkGotoHome(g_module.online_update_enabled && checkObjectExist(g_PageUrlTree, "settings", "setting_update"));
            break;
        case "dlna":
            checkGotoHome(g_module.dlna_enabled);
            break;
        case "ota":
            checkGotoHome(g_module.ota_enabled);
            break;
        case "sdcardsharing":
            checkGotoHome(g_module.sdcard_enabled);
            break;
        case "sambasettings":
            checkGotoHome(g_module.sambashare_enabled);
            break;
        case "stk":
            checkGotoHome(g_module.stk_enabled);
            break;
        case "installsoftware":
            checkGotoHome(g_module.assistant_enabled);
            break;
        case "wifinetworks":
            checkGotoHome(g_module.wifioffload_enable && checkObjectExist(g_PageUrlTree, "settings","internet"));
            break;
        case "wifipriority":
            checkGotoHome(g_module.wifioffload_enable && checkObjectExist(g_PageUrlTree, "settings","internet"));
            break;
        case "stationwps":
            checkGotoHome(g_module.wifioffload_enable && g_wifi.stawpsenabled && checkObjectExist(g_PageUrlTree, "settings","internet"));
            break;
        case "sambasharinguser":
            checkGotoHome(checkObjectExist(g_PageUrlTree, "sharing","sambasharinguser")&& g_module.sambashare_enabled);
            break;
        case "quicksetup":
            //g_PageUrlTree.settings.quick_setup
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "quick_setup"));
            break;
        case "sntp":
            //g_PageUrlTree.settings.sntp
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "sntp"));
            break;

        case "mobileconnection":
            //g_PageUrlTree.settings.dialup.mobileconnection
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "dialup", "mobileconnection"));
            break;
        case "profilesmgr":
            //g_PageUrlTree.settings.dialup.profilesmgr
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "dialup", "profilesmgr"));
            break;
        case "mobilenetworksettings":
            //g_PageUrlTree.settings.dialup.mobilenetworksettings
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "dialup", "mobilenetworksettings"));
            break;

        case "ethernetsettings":
            //g_PageUrlTree.settings.ethernet.ethernetsettings
            checkGotoHome(g_module.cradle_enabled && checkObjectExist(g_PageUrlTree, "settings", "ethernet", "ethernetsettings"));
            break;
        case "ethernetstatus":
            //g_PageUrlTree.settings.ethernet.ethernetstatus
            checkGotoHome(g_module.cradle_enabled && checkObjectExist(g_PageUrlTree, "settings", "ethernet", "ethernetstatus"));
            break;
        case "vpnstatus":
            //g_PageUrlTree.settings.vpn.vpnstatus
            checkGotoHome(g_module.vpn_enabled && checkObjectExist(g_PageUrlTree, "settings", "vpn", "vpnstatus"));
            break;
        case "vpnsettings":
            //g_PageUrlTree.settings.vpn.vpnsettings
            checkGotoHome(g_module.vpn_enabled && checkObjectExist(g_PageUrlTree, "settings", "vpn", "vpnsettings"));
            break;
        case "macclone":
            //g_PageUrlTree.settings.ethernet.macclone
            checkGotoHome(g_module.cradle_enabled && checkObjectExist(g_PageUrlTree, "settings", "ethernet", "macclone"));
            break;
        case "wlanbasicsettings":
            //g_PageUrlTree.settings.wlan.wlanbasicsettings
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "wlan", "wlanbasicsettings"));
            break;
        case "wlanadvanced":
            //g_PageUrlTree.settings.wlan.wlanadvanced
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "wlan", "wlanadvanced"));
            break;
        case "wlanmacfilter":
            //g_PageUrlTree.settings.wlan.wlanmacfilter
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "wlan", "wlanmacfilter"));
            break;
        case "wps":
            //g_PageUrlTree.settings.wlan.wps
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "wlan", "wps"));
            break;
        case "dhcp":
            //g_PageUrlTree.settings.wlan.dhcp
            //checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "wlan", "dhcp"));
            //g_PageUrlTree.settings.system.dhcp
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "dhcp"));
            break;
        case "serverbasic":
            //g_PageUrlTree.settings.voip.pincodeautovalidate
            checkGotoHome(g_module.voip_enabled && checkObjectExist(g_PageUrlTree, "settings", "voip", "serverbasic"));
            break;
        case "sipbasic":
            //g_PageUrlTree.settings.voip.sipbasic
            checkGotoHome(g_module.voip_enabled &&  checkObjectExist(g_PageUrlTree, "settings", "voip", "sipbasic"));
            break;
        case "speeddial":
            //g_PageUrlTree.settings.voip.speeddial
            checkGotoHome(g_module.voip_enabled && checkObjectExist(g_PageUrlTree, "settings", "voip", "speeddial"));
            break;
        case "pincodemanagement":
            //g_PageUrlTree.settings.security.pincodemanagement
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "pincodemanagement"));
            break;
        case "pincodeautovalidate":
            //g_PageUrlTree.settings.security.pincodeautovalidate
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "pincodeautovalidate"));
            break;
        case "firewallswitch":
            //g_PageUrlTree.settings.security.firewallswitch
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "firewallswitch"));
            break;
        case "macfilter":
            checkGotoHome(g_module.fw_macfilter_enabled && checkObjectExist(g_PageUrlTree, "settings", "security", "macfilter"));
            break;
        case "lanipfilter":
            //g_PageUrlTree.settings.security.lanipfilter
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "lanipfilter"));
            break;
        case "virtualserver":
            //g_PageUrlTree.settings.security.virtualserver
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "virtualserver"));
            break;
        case "specialapplication":
            //g_PageUrlTree.settings.security.specialapplication
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "specialapplication"));
            break;
        case "dmzsettings":
            //g_PageUrlTree.settings.security.dmzsettings
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "dmzsettings"));
            break;
        case "sipalgsettings":
            //g_PageUrlTree.settings.security.sipalgsettings
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "sipalgsettings"));
            break;
        case "upnp":
            //g_PageUrlTree.settings.security.upnp
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "upnp"));
            break;
        case "nat":
            //g_PageUrlTree.settings.security.nat
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "nat"));
            break;
        case "urlfilter":
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "security", "urlfilter"));
            break;
        case "ddns":
            //g_PageUrlTree.settings.security.nat
            checkGotoHome(g_module.ddns_enabled && checkObjectExist(g_PageUrlTree, "settings", "security", "ddns"));
            break;
        case "bridgemode":
            checkGotoHome(g_module.bridge_enabled && checkObjectExist(g_PageUrlTree, "settings", "security", "bridgemode"));
            break;
        case "deviceinformation":
            //g_PageUrlTree.system.system.deviceinformation
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "deviceinformation"));
            break;
        case "diagnosis":
            //g_PageUrlTree.system.system.diagnosis
            checkGotoHome(g_module.diagnosis_enabled && checkObjectExist(g_PageUrlTree, "settings", "system", "diagnosis"));
            break;
        case "configuration":
            //g_PageUrlTree.system.system.configuration
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "configuration"));
            break;
        case "modifypassword":
            //g_PageUrlTree.system.system.modifypassword
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "modifypassword"));
            break;
        case "restore":
            //g_PageUrlTree.system.system.restore
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "restore"));
            break;
        case "reboot":
            //g_PageUrlTree.system.system.reboot
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "reboot"));
            break;
        case "systemsettings":
            //g_PageUrlTree.settings.system.systemsettings
            checkGotoHome( isneedsystemsettings() && checkObjectExist(g_PageUrlTree, "settings", "system", "systemsettings"));
            break;
        case "updatesettings":
            checkGotoHome(g_module.online_update_enabled && checkObjectExist(g_PageUrlTree, "settings", "system", "updatesettings") && (notLoginupdate_leftmenu || auto_update_leftmenu));
            break;
        case "vsim":
            checkGotoHome(g_module.vsim_enabled && checkObjectExist(g_PageUrlTree, "settings", "vsim"));
            break;
        case "cbssettings":
            checkGotoHome(g_module.cbs_enabled && checkObjectExist(g_PageUrlTree, "settings", "cbssettings"));
            break;
        case "bluetooth":
            checkGotoHome(g_module.bluetooth_enabled &&  checkObjectExist(g_PageUrlTree, "settings", "bluetooth"));
            break;
        case "cradleDisconnected":
            checkGotoHome(g_module.cradle_enabled && g_feature.special_redirect == 1);
            break;
        case "nocard":
        case "pincoderequired":
        case "pukrequired":
        case "simlockrequired":
            checkGotoHome(g_feature.special_redirect == 1);
            break;
        case "switchDebugMode":
        case "switchProjectMode":
            checkGotoHome(g_feature.special_debug_page == 1);
            break;
        case "appmanagement":
            checkGotoHome(g_feature.appmanagements.enabled == 1 && checkObjectExist(g_PageUrlTree, "appmanagement"));
            break;
        case "voicebusy":
            checkGotoHome(g_module.voip_enabled || g_module.cs_enable);
            break;
        case "writtenoffer":
            break;
        case "modsettings":
            checkGotoHome(g_module.modsettings_enabled && checkObjectExist(g_PageUrlTree, "settings", "system", "modsettings"));
            break;
		   case "editfiles":
            checkGotoHome(checkObjectExist(g_PageUrlTree, "settings", "system", "editfiles"));
            break;
        default:
            gotoPageWithoutHistory(HOME_PAGE_URL);
            break;
    }
}

// document.write
function dw(text) {
    if (MACRO_NET_DUAL_MODE == g_net_mode_type) {
        if (text.indexOf('SIMLOCK')>-1) {
            document.write(text);
        } else {
            text = text.replace(/SIM/g, "UIM");
            document.write(text);
        }
    } else {
        document.write(text);
    }
}

// change lang
function changeLang(key, val) {

    var langObj = {
        CurrentLanguage: val
    };
    langObj.CurrentLanguage = langObj.CurrentLanguage.replace(/_/, '-');
    var res = object2xml('request', langObj);
    saveAjaxData('api/language/current-language', res, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            refresh();
        }
    });
}

function setMainMenu() {
    var MenuNumber = 0;
    if (current_href == 'pincoderequired' || current_href == 'pukrequired' || current_href == 'simlockrequired' || current_href == 'nocard' || current_href == 'connectionless' || current_href == 'opennewwindow') {
        $('#union_main_menu').hide();
        $('#logout_span').hide();
    } else {
        $('#home').children().text(common_home);
        $('#deviceinformation').children().text('?');
        $('#settings').children().text(common_settings);
        $('#payment').children().text(common_payment);
		
        MenuNumber = 2;
        if (g_module.statistic_enabled && MenuNumber < g_MainMenuNumber) {
            $('#statistic').children().text(connection_hilink_label_traffic_statistics);
            MenuNumber++;
        } else if(g_module.statistic_enabled && MenuNumber >= g_MainMenuNumber) {
            $('#menu_statistic').remove();
            MenuNumber++;
            Add_more_menu("statistic","statistic.html",connection_hilink_label_traffic_statistics);
        } else {
            $('#menu_statistic').remove();
        }

        if (g_module.sms_enabled && MenuNumber < g_MainMenuNumber) {
            if(!(force_new_sms && force_new_ussd))
                $('#sms').children().text(sms_lable_sms);
            else
                $('#sms').children().text(sms_lable_sms_ussd);
            MenuNumber++;
        } else if(g_module.sms_enabled && MenuNumber >= g_MainMenuNumber) {
            $('#menu_sms').remove();
            MenuNumber++;
            if(!(force_new_sms && force_new_ussd))
                Add_more_menu("sms","smsinbox.html",sms_lable_sms);
            else
                Add_more_menu("sms","smsinbox.html",sms_lable_sms_ussd);
        } else {
            $('#menu_sms').remove();
        }

        if (g_module.pb_enabled && MenuNumber < g_MainMenuNumber) {
            $('#pb').children().text(pb_label_phonebook);
            MenuNumber++;
        } else if(g_module.pb_enabled && MenuNumber >= g_MainMenuNumber) {
            $('#menu_pb').remove();
            MenuNumber++;
            Add_more_menu("pb","phonebook.html",pb_label_phonebook);
        } else {
            $('#menu_pb').remove();
        }

        if (g_module.ussd_enabled && MenuNumber < g_MainMenuNumber && !(force_new_sms && force_new_ussd)) {
            $('#ussd').children().text(ussd_label_ussd);
            MenuNumber++;
        } else if(g_module.ussd_enabled && MenuNumber >= g_MainMenuNumber && !(force_new_sms && force_new_ussd)) {
            $('#menu_ussd').remove();
            MenuNumber++;
            Add_more_menu("ussd","ussd.html",ussd_label_ussd);
        } else {
            $('#menu_ussd').remove();
        }

      /*  if (g_module.online_update_enabled && MenuNumber < g_MainMenuNumber) {
            $('#update').children().text(common_updates);
            MenuNumber++;
        } else if(g_module.online_update_enabled && MenuNumber >= g_MainMenuNumber) {
            $('#menu_update').remove();
            MenuNumber++;
            Add_more_menu("update","update.html",common_updates);
        } else {
            $('#menu_update').remove();
        }*/

        if (g_module.ota_enabled && MenuNumber < g_MainMenuNumber) {
            $('#ota').children().text(common_ota);
            MenuNumber++;
        } else if(g_module.ota_enabled && MenuNumber >= g_MainMenuNumber) {
            $('#menu_ota').remove();
            MenuNumber++;
            Add_more_menu("ota","ota.html",common_ota);
        } else {
            $('#menu_ota').remove();
        }

        if ((g_module.dlna_enabled || g_module.sdcard_enabled || g_module.sambashare_enabled) && MenuNumber < g_MainMenuNumber) {
            $('#sharing').children().text(sharing_label_sharing);
            MenuNumber++;
            if(g_module.sdcard_enabled) {
                $('#menu_sharing a').attr("href","sdcardsharing.html");
            } else if(g_module.sambashare_enabled) {
                $('#menu_sharing a').attr("href","sambasettings.html");
            } else {
                $('#menu_sharing a').attr("href","dlna.html");
            }
        } else if((g_module.dlna_enabled || g_module.sdcard_enabled || g_module.sambashare_enabled) && MenuNumber >= g_MainMenuNumber) {
            $('#menu_sharing').remove();
            MenuNumber++;
            if(g_module.sdcard_enabled) {
                Add_more_menu("sharing","sdcardsharing.html",sharing_label_sharing);
            } else if(g_module.sambashare_enabled) {
                Add_more_menu("sharing","sambasettings.html",sharing_label_sharing);
            } else {
                Add_more_menu("sharing","dlna.html",sharing_label_sharing);
            }
        } else {
            $('#menu_sharing').remove();
        }

        if (g_module.stk_enabled && MenuNumber < g_MainMenuNumber) {
            $('#stk').children().text(stk_label_stk);
            MenuNumber++;
        } else if(g_module.stk_enabled && MenuNumber >= g_MainMenuNumber) {
            $('#menu_stk').remove();
            MenuNumber++;
            Add_more_menu("stk","stk.html",stk_label_stk);
        } else {
            $('#menu_stk').remove();
        }

        if (g_feature.appmanagements.enabled == 1 && checkObjectExist(g_PageUrlTree, "appmanagement") && MenuNumber < g_MainMenuNumber) {
            $('#appmanagement').children().text(IDS_APP_MANAGEMENT);
            MenuNumber++;
        } else if(g_feature.appmanagements.enabled&& MenuNumber >= g_MainMenuNumber) {
            $('#menu_appmanagement').remove();
            MenuNumber++;
            Add_more_menu("appmanagement","appmanagement.html",IDS_APP_MANAGEMENT);
        } else {
            $('#menu_appmanagement').remove();
        }

        if ($("#more_dialog").size() < 1) {
            $('#menu_more').remove();
        } else {
            $('#more').die('click');
            $('#more').live('click', function() {
                MoreMenuCreate();
            });
            $(".main_menu:not(#more),div:not(#more_dialog)").mouseover( function() {
                $("#more_dialog").hide();
            });
            setTimeout( function() {
                var i;
                for(i = 1; i < $('#more_menu_ul').children().length + 1; i++) {
                    if($('#more_menu_ul li:nth-child(' + i +')').children().hasClass('active')) {
                        $('#more').addClass('active');
                    }
                }
            }, 500);
        }
        $('#union_main_menu').show();
        showCur(true);
    }
}

function Add_more_menu(MenuID,MenuAddress,MenuLabel) {
    var moreHtml = "";
    if ($("#more_dialog").size() < 1) {

        $('#more').children().text(common_more);
        moreHtml =  "<div  id='more_dialog' class='more_menu clr_white_more_menu'>";
        moreHtml += "    <ul id ='more_menu_ul'>";
        moreHtml += "    </ul>";
        moreHtml += "</div>";
        $("body").append(moreHtml);
    }
    moreHtml =  "<li id='menu_" + MenuID + "'>";
    moreHtml += "    <a id='" + MenuID +"'>";
    moreHtml += "        <span>" + MenuLabel + "</span>";
    moreHtml += "    </a>";
    moreHtml += "</li>";
    $("#more_menu_ul").append(moreHtml);
}

function MoreMenuCreate() {
    function StrLength(SourceStr) {
        var strleng = 0;
        var i;
        for(i=0;i<SourceStr.length;i++) {
            if(SourceStr.charCodeAt(i) > 0x3000 && SourceStr.charCodeAt(i) < 0xffff) {
                strleng += 3;
            } else {
                strleng++;
            }
        }
        return strleng;
    }

    if($("#more_dialog").size() >= 1) {
        var moreWidth = 0;
        var offset = $("#menu_more").offset();
        var scTop = offset.top;
        var scLeft = offset.left;
        var newTop = scTop + $("#menu_more").height();
        var newLeft = scLeft + 5;
        var i;
        for(i = 0; i < $('#more_menu_ul').children().length; i++) {
            var more_str_length = StrLength($('#more_menu_ul li:eq(' + i +')').children().children().text());
            if(more_str_length > moreWidth) {
                moreWidth = more_str_length;
            }
        }
        moreWidth = (moreWidth*11<$("#menu_more").width())?$("#menu_more").width():moreWidth*11;
        $(".more_menu").css({
            "width":moreWidth + "px"
        });
        $(".more_menu ul li").css({
            "width":moreWidth + "px"
        });
        if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
            newLeft = scLeft + $("#menu_more").width()+5;
            newLeft = newLeft - moreWidth;
        }
        $("#more_dialog").css({
            "position": "absolute",
            "left": newLeft + "px",
            "top": newTop + "px",
            "background-color":"#00FF00  no-repeat right center"
        }).show();

    }
}

function selectCur(obj) {
    $.each(obj, function(i, n) {
        if (!TOPMENU.have) {
            TOPMENU.nav.push(i);
        }
        if (typeof n == 'object') {
            selectCur(n);
        } else if (typeof n == 'string') {
            if (n == current_href || ((force_new_sms && force_new_ussd) && current_href == 'ussd' && n == 'smsinbox')) {
                TOPMENU.nav.push(n);
                TOPMENU.have = true;
            }
        }
        if (!TOPMENU.have) {
            TOPMENU.nav.pop();
        }
    });
}

var ispageExist = false;
function checkPageExist(obj, url) {
    ispageExist = false;
    if(url == 'ussd') {
        ispageExist = true;
    }
    $.each(obj, function(i, n) {
        if(ispageExist) {
            return false;
        }
        if (typeof n == 'object') {
            ispageExist = checkPageExist(n, url);
        } else if (typeof n == 'string') {
            if (n == url) {
                ispageExist = true;
                return false;
            }
        }
    });
    return ispageExist;
}

function showCur(noSubMenu) {
    if (noSubMenu) {
        $('#' + TOPMENU.nav[0]).addClass('active');
    } else {
     if("update" == current_href){
			$('#setting_update').addClass('click');
			var cName = ($('#setting_update').get(0)).className;
			
			if (cName.indexOf('nosub') > -1) {
				cName = cName.replace('nosub ', 'nosub');
			}
			$('#setting_update')[0].className = cName;
			/* $('#' + TOPMENU.nav[2]).addClass('subClick'); */
		}else{
        $('#' + TOPMENU.nav[1]).addClass('click');
        var cName = ($('#' + TOPMENU.nav[1]).get(0)).className;
        if (cName.indexOf('nosub') > -1) {
            cName = cName.replace('nosub ', 'nosub');
        }
        $('#' + TOPMENU.nav[1])[0].className = cName;
        //$("#" + TOPMENU.nav[1] + " ul li:eq(" + TOPMENU.nav[2] +
        // ")").addClass("subClick");
        $('#' + TOPMENU.nav[2]).addClass('subClick');
	}
    }
}

// new log object for debug page
function getQueryStringByName(item) {
    var svalue = location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
    return svalue ? svalue[1] : svalue;
}

function initUssdLeftMenu() {
    if (typeof(g_PageUrlTree.ussd.prepaid) != 'undefined') {
        $('#prepaidussd').removeClass('sub').addClass('sub click'); //import
        if (typeof(g_PageUrlTree.ussd.prepaid.pre_service_title) != 'undefined') {
            g_ussdLeftmenu[0] = 'pre' + g_PageUrlTree.ussd.prepaid.pre_service_title;
            $('#pre_service_title').addClass('subClick');
        } else if (typeof(g_PageUrlTree.ussd.prepaid.pre_fun_balanceInquiry) != 'undefined') {
            g_ussdLeftmenu[0] = 'pre' + g_PageUrlTree.ussd.prepaid.pre_fun_balanceInquiry;
            $('#pre_fun_balanceInquiry').addClass('subClick');
        } else if (typeof(g_PageUrlTree.ussd.prepaid.pre_fun_charge) != 'undefined') {
            g_ussdLeftmenu[0] = 'pre' + g_PageUrlTree.ussd.prepaid.pre_fun_charge;
            $('#pre_fun_charge').addClass('subClick');
        } else if (typeof(g_PageUrlTree.ussd.prepaid.pre_fun_general) != 'undefined') {
            g_ussdLeftmenu[0] = 'pre' + g_PageUrlTree.ussd.prepaid.pre_fun_general;
            $('#pre_fun_general').addClass('subClick');
        }
    } else if (typeof(g_PageUrlTree.ussd.postpaid) != 'undefined') {
        $('#postpaidussd').removeClass('sub').addClass('sub click');
        if (typeof(g_PageUrlTree.ussd.postpaid.post_service_title) != 'undefined') {
            g_ussdLeftmenu[0] = 'post' + g_PageUrlTree.ussd.postpaid.post_service_title;
            $('#post_service_title').addClass('subClick');
        } else if (typeof(g_PageUrlTree.ussd.postpaid.post_fun_balanceInquiry) != 'undefined') {
            g_ussdLeftmenu[0] = 'post' + g_PageUrlTree.ussd.postpaid.post_fun_balanceInquiry;
            $('#post_fun_balanceInquiry').addClass('subClick');
        } else if (typeof(g_PageUrlTree.ussd.postpaid.post_fun_charge) != 'undefined') {
            g_ussdLeftmenu[0] = 'post' + g_PageUrlTree.ussd.postpaid.post_fun_charge;
            $('#post_fun_charge').addClass('subClick');
        } else if (typeof(g_PageUrlTree.ussd.postpaid.post_fun_general) != 'undefined') {
            g_ussdLeftmenu[0] = 'post' + g_PageUrlTree.ussd.postpaid.post_fun_general;
            $('#post_fun_general').addClass('subClick');
        }
    }
}

//showUssdLeftMenu
function showUssdLeftMenu() {
    if($('.main_left').children().is('#ussd_setting_menu')) {
        log.debug('MAIN : Loading  leftmenu');
        initUssdLeftMenu();
        $('.main_left').load('leftmenu.html #ussd_setting_menu', function() {
            log.debug('MAIN : Load left ussd_setting_menu successfull');
            clickMenu('menu_settings');

            $("#ussd").addClass("active"); //import

            // prepaidussd
            if (checkLeftMenu(g_PageUrlTree.ussd.prepaid)) {
                $('#lable_prepaidussd').text(ussd_leftmenu_prepaid);

                if (checkLeftMenu(g_PageUrlTree.ussd.prepaid.pre_service_title)) {
                    $('#lable_pre_service_title').text(ussd_leftmenu_ActivateService);
                } else {
                    $('#pre_service_title').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.ussd.prepaid.pre_fun_balanceInquiry)) {
                    $('#lable_pre_fun_balanceInquiry').text(ussd_label_BalanceInquiry_title);
                } else {
                    $('#pre_fun_balanceInquiry').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.ussd.prepaid.pre_fun_charge)) {
                    $('#lable_pre_fun_charge').text(ussd_label_Charge_title);
                } else {
                    $('#pre_fun_charge').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.ussd.prepaid.pre_fun_general)) {
                    $('#lable_pre_fun_general').text(ussd_label_Universal_title);
                } else {
                    $('#pre_fun_general').remove();
                }

            } else {
                $('#prepaidussd').remove();
            }

            // postpaidussd
            if (checkLeftMenu(g_PageUrlTree.ussd.postpaid)) {
                $('#label_postpaidussd').text(ussd_leftmenu_postpaid);

                if (checkLeftMenu(g_PageUrlTree.ussd.postpaid.post_service_title)) {
                    $('#lable_post_service_title').text(ussd_leftmenu_ActivateService);
                } else {
                    $('#post_service_title').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.ussd.postpaid.post_fun_balanceInquiry)) {
                    $('#lable_post_fun_balanceInquiry').text(ussd_label_BalanceInquiry_title);
                } else {
                    $('#post_fun_balanceInquiry').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.ussd.postpaid.post_fun_charge)) {
                    $('#lable_post_fun_charge').text(ussd_label_Charge_title);
                } else {
                    $('#post_fun_charge').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.ussd.postpaid.post_fun_general)) {
                    $('#lable_post_fun_general').text(ussd_label_Universal_title);
                } else {
                    $('#post_fun_general').remove();
                }
            } else {
                $('#postpaidussd').remove();
            }
            initUssdLeftMenu();
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('#menu_detail_list').children().not('#quick_setup').hide();
            }
        });
    }

}

function checkLeftMenu(obj) {
    return typeof(obj) !='undefined' && $.trim(obj) !='';
}

function isneedsystemsettings() {
    if (g_module.powersave_enabled || g_module.fastboot_enabled || g_module.sntp_enabled || g_USBtetheringSwitch == USBTETHERING_ON) {
        return true;
    }
    return false;
}

//Set defferent menu for each device type
function showleftMenu() {
    log.debug('showleftMenu');
    if ($('.main_left').children().is('#sms_menu')) {
        $('.main_left').load('leftmenu.html #sms_menu', function() {
            log.debug('MAIN : Load left sms menu successful1');
            clickMenu('menu_sms');
            $('#lable_sms').text(sms_lable_sms);
            //$("#label_new_message").text(sms_label_new_message);
            $('#label_inbox').text(sms_label_inbox);
            $('#label_sent').text(sms_label_sent);
            $('#label_drafts').text(sms_label_drafts);
            if (checkLeftMenu(g_PageUrlTree.sms.sms_center_number)) {
                $('#label_sms_center_number').text(sms_label_sms_settings);
            } else {
                $('#sms_center_number').remove();
            }
            showCur(false);
            $('#label_inbox_status').text(g_sms_inbox_store_status);
            $('#label_sent_status').text(g_sms_outbox_store_status);
            $('#label_drafts_status').text(g_sms_draftbox_store_status);
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('#menu_detail_list').children().not('#quick_setup').hide();
            }
            // for IE
        });
    }
    if ($('.main_left').children().is('#sms_menu_android')) {
        $('.main_left').load('leftmenu.html #sms_menu_android', function() {
            log.debug('MAIN : Load left sms menu successful1');
            clickMenu('menu_sms');
            $('#label_android').text(sms_label_message);
            if (checkLeftMenu(g_PageUrlTree.sms.sms_center_number)) {
                $('#label_sms_center_number_android').text(sms_label_sms_settings);
            } else {
                $('#label_sms_center_number_android').remove();
            }
            showCur(false);
            $('#label_android_status').text(g_sms_android_store_status);
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('#menu_detail_list').children().not('#quick_setup').hide();
            }
            // for IE
        });
    }

    showUssdLeftMenu();

    if ($('.main_left').children().is('#settings_menu')) {
        log.debug('MAIN : Loading  leftmenu');
        $('.main_left').load('leftmenu.html #settings_menu', function() {
            log.debug('MAIN : Load left settings menu successfull');
            clickMenu('menu_settings');

            //quicksetup
            if (checkLeftMenu(g_PageUrlTree.settings.quick_setup)) {
                $('#label_quick_setup').attr('title', wizard_label_quick_setup);
                $('#label_quick_setup').text(wizard_label_quick_setup);
            } else {
                $('#quick_setup').remove();
            }

            //wifinetworks
            if (g_module.wifioffload_enable && checkLeftMenu(g_PageUrlTree.settings.internet)) {
                $('#label_internet').attr('title', wlan_lable_Interntet_wlan);
                $('#label_internet').text(wlan_lable_Interntet_wlan);
                if (checkLeftMenu(g_PageUrlTree.settings.internet.wifinetworks)) {
                    $('#label_wifinetworks').attr('title', wlan_lable_Interntet_wlan);
                    $('#label_wifinetworks').text(wlan_lable_Interntet_wlan);
                } else {
                    $('#wifinetworks').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.internet.wifipriority)) {
                    $('#label_wifiPriority').attr('title', IDS_label_text_wifiPriority);
                    $('#label_wifiPriority').text(IDS_label_text_wifiPriority);
                } else {
                    $('#wifipriority').remove();
                }
                if(g_wifi != null) {
                    if (g_wifi.stawpsenabled && checkLeftMenu(g_PageUrlTree.settings.internet.stationwps)) {
                        $('#label_stationwps').attr('title', IDS_system_label_stationwps_defaults);
                        $('#label_stationwps').text(IDS_system_label_stationwps_defaults);
                    } else {
                        $('#stationwps').remove();
                    }
                }
            } else {
                $('#internet').remove();
            }

            //dialup
            if (checkLeftMenu(g_PageUrlTree.settings.dialup)) {
                $('#label_dialup').attr('title', dialup_label_dialup);
                $('#label_dialup').text(dialup_label_dialup);

                if (checkLeftMenu(g_PageUrlTree.settings.dialup.mobileconnection)) {
                    $('#label_mobile_connection').attr('title', dialup_label_mobile_connection);
                    $('#label_mobile_connection').text(dialup_label_mobile_connection);
                } else {
                    $('#mobileconnection').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.dialup.mobilenetworksettings)) {
                    $('#label_mobile_network_settings').attr('title', dialup_label_mobile_network_settings);
                    $('#label_mobile_network_settings').text(dialup_label_mobile_network_settings);
                } else {
                    $('#mobilenetworksettings').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.dialup.profilesmgr)) {
                    $('#label_profile_management').attr('title', dialup_label_profile_management);
                    $('#label_profile_management').text(dialup_label_profile_management);
                } else {
                    $('#profilesmgr').remove();
                }

            } else {
                $('#dialup').remove();
            }

            //wlan
            if (checkLeftMenu(g_PageUrlTree.settings.wlan)) {
                $('#label_wlan').text(wlan_label_wlan);
                $('#label_wlan').attr('title', wlan_label_wlan);
                if (checkLeftMenu(g_PageUrlTree.settings.wlan.wlanbasicsettings)) {
                    $('#label_wlan_basic_settings').attr('title', wlan_label_wlan_basic_settings);
                    $('#label_wlan_basic_settings').text(wlan_label_wlan_basic_settings);
                } else {
                    $('#wlanbasicsettings').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.wlan.wlanadvanced)) {
                    $('#label_wlan_advanced_settings').attr('title', wlan_label_wlan_advanced_settings);
                    $('#label_wlan_advanced_settings').text(wlan_label_wlan_advanced_settings);
                } else {
                    $('#wlanadvanced').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.wlan.wlanmacfilter)) {
                    $('#label_wlan_mac_filter').attr('title', wlan_label_wlan_mac_filter);
                    $('#label_wlan_mac_filter').text(wlan_label_wlan_mac_filter);
                } else {
                    $('#wlanmacfilter').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.wlan.wps)) {
                    $('#wlan_label_wps_settings').attr('title', wlan_label_wps_settings);
                    $('#wlan_label_wps_settings').text(wlan_label_wps_settings);
                } else {
                    $('#wps').remove();
                }

                /*if (checkLeftMenu(g_PageUrlTree.settings.wlan.dhcp)) {
                    $('#label_dhcp').attr('title', dhcp_label_dhcp);
                    $('#label_dhcp').text(dhcp_label_dhcp);
                } else {
                    $('#dhcp').remove();
                }*/

            } else {
                $('#wlan').remove();
            }
            //internet ethernet
            if(checkLeftMenu(g_PageUrlTree.settings.ethernet)) {
                check_ethernet_display();
            } else {
                $('#ethernet').remove();
            }
            //vpn information and setting
            if(g_module.vpn_enabled) {
                if(checkLeftMenu(g_PageUrlTree.settings.vpn)) {
                    $('#label_vpn').attr('title', IDS_vpn);
                    $('#label_vpn').text(IDS_vpn);
                    if(checkLeftMenu(g_PageUrlTree.settings.vpn.vpnstatus)) {
                        $('#label_vpn_status').attr('title', IDS_vpn_label_vpn_status);
                        $('#label_vpn_status').text(IDS_vpn_label_vpn_status);
                    } else {
                        $('#vpnstatus').remove();
                    }
                    if(checkLeftMenu(g_PageUrlTree.settings.vpn.vpnsettings)) {
                        $('#label_vpn_setting').attr('title', IDS_vpn_label_setting);
                        $('#label_vpn_setting').text(IDS_vpn_label_setting);
                    } else {
                        $('#vpnsettings').remove();
                    }
                } else {
                    $('#vpn').remove();
                }
            } else {
                $('#vpn').remove();
            }
            //voip
            if (g_module.voip_enabled && checkLeftMenu(g_PageUrlTree.settings.voip)) {
                $('#label_voip').text(IDS_VOIP_menu_label_voip);
                $('#label_voip').attr('title', IDS_VOIP_menu_label_voip);

                if (checkLeftMenu(g_PageUrlTree.settings.voip.serverbasic)) {
                    $('#label_server_basic').attr('title', IDS_VOIP_menu_label_sipserver);
                    $('#label_server_basic').text(IDS_VOIP_menu_label_sipserver);
                } else {
                    $('#serverbasic').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.voip.sipbasic)) {
                    $('#label_sip_basic').attr('title', IDS_VOIP_menu_label_sipuser);
                    $('#label_sip_basic').text(IDS_VOIP_menu_label_sipuser);
                } else {
                    $('#sipbasic').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.voip.speeddial)) {
                    $('#label_speed_dial').attr('title', IDS_VOIP_menu_label_speeddial);
                    $('#label_speed_dial').text(IDS_VOIP_menu_label_speeddial);
                } else {
                    $('#speeddial').remove();
                }

            } else {
                $('#voip').remove();
            }

            //security
            if (checkLeftMenu(g_PageUrlTree.settings.security)) {
                if (checkLeftMenu(g_PageUrlTree.settings.security.pincodeautovalidate)) {
                    $('#label_pin_auto_validation').attr('title', dialup_label_pin_auto_validation);
                    $('#label_pin_auto_validation').text(dialup_label_pin_auto_validation);
                } else {
                    $('#pincodeautovalidate').remove();
                }
                // G_MonitoringStatus.response. SimStatus 为240则将ID pincodemanagement取消掉,不能进入PIN码管理页面。

                getGMonitoringStatus();
                if (checkLeftMenu(g_PageUrlTree.settings.security.pincodemanagement)) {
                    $('#label_pin_code_management').attr('title', dialup_label_pin_code_management);
                    $('#label_pin_code_management').text(dialup_label_pin_code_management);
                } else {
                    $('#pincodemanagement').remove();
                }

                $('#label_security').text(firewall_label_security);
                $('#label_security').attr('title', firewall_label_security);
                if (checkLeftMenu(g_PageUrlTree.settings.security.firewallswitch)) {
                    $('#label_firewall_switch').attr('title', firewall_label_firewall_switch);
                    $('#label_firewall_switch').text(firewall_label_firewall_switch);
                } else {
                    $('#firewallswitch').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.macfilter) && g_module.fw_macfilter_enabled) {
                    $('#label_mac_filter').attr('title', IDS_security_macfilter_label);
                    $('#label_mac_filter').text(IDS_security_macfilter_label);
                } else {
                    $('#macfilter').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.lanipfilter)) {
                    $('#label_lan_ip_filter').attr('title', firewall_label_lan_ip_filter);
                    $('#label_lan_ip_filter').text(firewall_label_lan_ip_filter);
                } else {
                    $('#lanipfilter').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.virtualserver)) {
                    $('#label_virtual_server').attr('title', firewall_label_virtual_server);
                    $('#label_virtual_server').text(firewall_label_virtual_server);
                } else {
                    $('#virtualserver').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.specialapplication)) {
                    $('#label_special_application').attr('title', firewall_label_special_application);
                    $('#label_special_application').text(firewall_label_special_application);
                } else {
                    $('#specialapplication').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.dmzsettings)) {
                    $('#label_dmz_settings').attr('title', firewall_label_dmz_settings);
                    $('#label_dmz_settings').text(firewall_label_dmz_settings);
                } else {
                    $('#dmzsettings').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.sipalgsettings)) {
                    $('#label_sip_alg_settings').attr('title', firewall_label_sip_alg_settings);
                    $('#label_sip_alg_settings').text(firewall_label_sip_alg_settings);
                } else {
                    $('#sipalgsettings').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.upnp)) {
                    $('#label_upnp_setting').attr('title', firewall_label_upnp_setting);
                    $('#label_upnp_setting').text(firewall_label_upnp_setting);
                } else {
                    $('#upnp').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.security.nat)) {
                    $('#label_nat_settings').attr('title', IDS_wlan_title_nat_settings);
                    $('#label_nat_settings').text(IDS_wlan_title_nat_settings);
                } else {
                    $('#nat').remove();
                }
                if(checkLeftMenu(g_PageUrlTree.settings.security.urlfilter)) {
                    $('#label_urlfilter_settings').attr('title', IDS_security_urlfilter_domain_name_filter);
                    $('#label_urlfilter_settings').text(IDS_security_urlfilter_domain_name_filter);

                } else {
                    $('#urlfilter').remove();

                }
                if (g_module.ddns_enabled && checkLeftMenu(g_PageUrlTree.settings.security.ddns)) {
                    if(g_module.ddns_enabled) {
                        $('#label_ddns_settings').attr('title', IDS_security_ddns);
                        $('#label_ddns_settings').text(IDS_security_ddns);
                    } else {
                        $('#ddns').remove();
                    }
                } else {
                    $('#ddns').remove();
                }
                if (checkLeftMenu(g_PageUrlTree.settings.security.bridgemode) && g_module.bridge_enabled) {
                    $('#label_bridgemode_settings').attr('title', IDS_system_bridge_mode);
                    $('#label_bridgemode_settings').text(IDS_system_bridge_mode);
                } else {
                    $('#bridgemode').remove();
                }
            } else {
                $('#security').remove();
            }
            //system
            if (checkLeftMenu(g_PageUrlTree.settings.system)) {
                $('#label_system').attr('title', system_label_system);
                $('#label_system').text(system_label_system);

                if (checkLeftMenu(g_PageUrlTree.settings.system.deviceinformation)) {
                    $('#label_device_information').attr('title', system_label_device_information);
                    $('#label_device_information').text(system_label_device_information);
                } else {
                    $('#deviceinformation').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.system.dhcp)) {
                    $('#label_dhcp').attr('title', dhcp_label_dhcp);
                    $('#label_dhcp').text(dhcp_label_dhcp);
                } else {
                    $('#dhcp').remove();
                }

                if (g_module.diagnosis_enabled && checkLeftMenu(g_PageUrlTree.settings.system.diagnosis)) {
                    $('#label_diagnosis').attr('title', system_label_diagnosis);
                    $('#label_diagnosis').text(system_label_diagnosis);
                } else {
                    $('#diagnosis').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.system.configuration)) {
                    $('#label_configuration').attr('title', system_label_backup_restore);
                    $('#label_configuration').text(system_label_backup_restore);
                } else {
                    $('#configuration').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.system.modifypassword) && ((g_hilink_login_old_api == 1 && (g_nedd_login == 0))|| g_nedd_login == 1)) {
                    $('#label_modify_password').attr('title', system_label_modify_password);
                    $('#label_modify_password').text(system_label_modify_password);
                } else {
                    $('#modifypassword').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.system.restore)) {
                    $('#label_restore_defaults').attr('title', system_label_restore_defaults);
                    $('#label_restore_defaults').text(system_label_restore_defaults);
                } else {
                    $('#restore').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.system.reboot)) {
                    $('#label_reboot').attr('title', system_label_reboot);
                    $('#label_reboot').text(system_label_reboot);
                } else {
                    $('#reboot').remove();
                }

                if (checkLeftMenu(g_PageUrlTree.settings.system.systemsettings)) {
                    if( isneedsystemsettings() ) {
                        $('#label_systemsettings').attr('title', IDS_systemsettings_topic);
                        $('#label_systemsettings').text(IDS_systemsettings_topic);
                    } else {
                        $('#systemsettings').remove();
                    }
                } else {
                    $('#systemsettings').remove();
                }

                if (g_module.modsettings_enabled && checkLeftMenu(g_PageUrlTree.settings.system.modsettings)) {
                    $('#label_modsettings').attr('title', system_label_modsettings);
                    $('#label_modsettings').text(system_label_modsettings);
                } else if(checkLeftMenu(g_PageUrlTree.settings.system.modsettings)) {
                    $('#modsettings').attr('data-disabled', true);
                    $('#modsettings a').attr('href', 'javascript:addWebUIInitDialog();void(0);');
                    $('#label_modsettings').attr('title', system_label_modsettings);
                    $('#label_modsettings').text(system_label_modsettings);
                } else {
                    $('#modsettings').remove();
                }              

                if (checkLeftMenu(g_PageUrlTree.settings.system.editfiles)) {
                    $('#label_edit_files').attr('title', system_label_edit_files);
                    $('#label_edit_files').text(system_label_edit_files);
                } else {
                    $('#editfiles').remove();
                }

                if (g_module.cbs_enabled && checkLeftMenu(g_PageUrlTree.settings.cbssettings)) {
                    $('#label_cbssettings').attr('title', IDS_CBS_Settings_setting);
                    $('#label_cbssettings').text(IDS_CBS_Settings_setting);
                } else {
                    $('#cbssettings').remove();
                }
                if (g_module.bluetooth_enabled && checkLeftMenu(g_PageUrlTree.settings.bluetooth)) {
                    $('#label_bluetooth').text(IDS_bluetooth);
                    $('#label_bluetooth').attr('title', IDS_bluetooth);
                } else {
                    $('#bluetooth').remove();
                }
                if (g_module.vsim_enabled && checkLeftMenu(g_PageUrlTree.settings.vsim)) {
                    $('#label_vsim').attr('title', IDS_tianjitong_text);
                    $('#label_vsim').text(IDS_tianjitong_text);
                } else {
                    $('#vsim').remove();
                }
                if (g_module.online_update_enabled&&checkLeftMenu(g_PageUrlTree.settings.system.updatesettings)&& (notLoginupdate_leftmenu || auto_update_leftmenu)) {
                    $('#label_update_settings').attr('title', IDS_update_settings);
                    $('#label_update_settings').text(IDS_update_settings);
                } else {
                    $('#updatesettings').remove();
                } 
            } else {
                $('#system').remove();
            }
			 //update
            if (g_module.online_update_enabled&&checkLeftMenu(g_PageUrlTree.settings.setting_update)) {
                $('#label_update_system').attr('title', common_updates);
                $('#label_update_system').text(common_updates);
            } else {
                $('#setting_update').remove();
            }

            showCur(false);
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('#menu_detail_list').children().not('#quick_setup').hide();
            }
        });
    }
    //show SD menu
    if ($('.main_left').children().is('#sharingsamba_menu')) {
        $('.main_left').load('leftmenu.html #sharingsamba_menu', function() {
            clickMenu('menu_sharingsamba');
            if (checkLeftMenu(g_PageUrlTree.sharing.sdcardsharing) && g_module.sdcard_enabled) {
                $('#label_sdcardsharing').text(sharing_label_sharing);
            } else {
                $('#sdcardsharing').remove();
            }
            if (checkLeftMenu(g_PageUrlTree.sharing.sambasettings) && g_module.sambashare_enabled ) {
                $('#label_sambasettings').text(IDS_system_samba_title);
            } else {
                $('#sambasettings').remove();
            }
            if (checkLeftMenu(g_PageUrlTree.sharing.sambasharinguser) && g_module.sambashare_enabled) {
                $('#label_sambasharinguser').text(IDS_system_samba_user_setting_title);
            } else {
                $('#sambasharinguser').remove();
            }
            if (g_module.dlna_enabled && checkLeftMenu(g_PageUrlTree.sharing.dlna)) {
                $('#label_dlna').text(common_dlna);
            } else {
                $('#dlna').remove();
            }
            showCur(false);
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('#menu_detail_list').children().not('#quick_setup').hide();
            }
        });
    }

    //show update menu
    if(g_module.local_update_enabled && checkLeftMenu(g_PageUrlTree.update.update_local)) {
        if ($('.main_left').children().is('#update_menu')) {
            $('.main_left').load('leftmenu.html #update_menu', function() {
                clickMenu('menu_update');
                if (checkLeftMenu(g_PageUrlTree.update.update_online)) {
                    $('#label_update_online').text(IDS_update_online_title);
                } else {
                    $('#update_online').remove();
                }
                if (g_module.local_update_enabled && checkLeftMenu(g_PageUrlTree.update.update_local)) {
                    $('#label_update_local').text(IDS_update_local_title);
                } else {
                    $('#update_local').remove();
                }
                showCur(false);
                if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                    $('#menu_detail_list').children().not('#quick_setup').hide();
                }
            });
        }
    } else if("update" == current_href || "update_local" == current_href) {
      /*  $('#left_menu_div').remove();
        $('.content_right').removeClass('content_right');//addClass('status_title');
        $('.maintitle').removeClass('maintitle').addClass('status_title');*/
    }
}

function setLangList() {
    if (!jQuery.isArray(LANGUAGE_DATA.supportted_languages)) {
        $('#lang').remove();
        return;
    }
    $('#lang').append(g_langList);
    $('#lang').show();

    $('#lang').change( function() {
        changeLang('lang', $('#lang').val());
    });
}

function showCurrentLanguage() {
    //show the current lang to the lang inputBox
    var lang = LANGUAGE_DATA.current_language.replace(/-/, '_');
    $('#lang').val(lang);
}

function showFooter() {
    //Load footer
    if (g_needFooter) {
        $('#footer').load('footer.html img, span, rightcorner', function() {
            var temp = copyrightReplace(common_copyright);
            $('#footer span').html('&nbsp;' + temp + "<div class='rightcorner'></div>");
            if ($.browser.msie && (parseInt($.browser.version,10) >= 9)) {
                $('#statement_main').css({
                    "margin-top": "3px"
                });
            }
            log.debug('MAIN : Load footer successful');
            $('#footer').prepend("<a id='pravacy_policy' class='clr_gray' target='_blank' style='top: 9px !important;border-left: solid 1px #b7b8b9 !important;border-right: solid 1px #b7b8b9 !important;'>Project Mode</a>");
            $('#footer').addClass("clr_blue_hover");
            getAjaxData('api/device/device-feature-switch', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    g_copyright_enabled = ret.response.copyright_enabled;
                    if(g_copyright_enabled == '1') {
                        $('#footer span').after("<span id='copyright_notice' style='position: static !important;'><a href='javascript:window.open(\"/html/switchDebugMode.html\");void(0);' class='clr_gray' style='top: 9px !important;border-left: solid 1px #b7b8b9 !important;border-right: solid 1px #b7b8b9 !important;'>Debug Mode</a></span>");
                    }
                }
            });
            $('#pravacy_policy').attr("href","javascript:window.open('/html/switchProjectMode.html');void(0);");
            //setPrivacyPolicyUrl('#pravacy_policy');
        });
    }
}

function setPrivacyPolicyUrl(obj) {
    if(typeof (LANGUAGE_DATA.privacy_policy_list) != "undefined" && checkLeftMenu(LANGUAGE_DATA.privacy_policy_list[LANGUAGE_DATA.current_language])) {
        $(obj).attr("href",LANGUAGE_DATA.privacy_policy_list[LANGUAGE_DATA.current_language]);
    } else if(typeof (LANGUAGE_DATA.privacy_policy_list) != "undefined" && checkLeftMenu(LANGUAGE_DATA.privacy_policy_list.default_url)) {
        $(obj).attr("href",LANGUAGE_DATA.privacy_policy_list.default_url);
    }
}

var g_requestVerificationToken = [];
function getAjaxToken() {
    var meta = $("meta[name=csrf_token]");
    var i = 0;

    if(meta.length > 0) {
        g_requestVerificationToken = [];
        for(i; i < meta.length; i++) {
            g_requestVerificationToken.push(meta[i].content);
        }
    } else {
        getAjaxData('api/webserver/token', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_requestVerificationToken = ret.response.token;
            }
        }, {
            sync: true
        });
    }

}

getAjaxToken();

var user_config = {};
var webui_mode = 'new';
var force_new_sms = false;
var force_old_sms = false;
var force_new_ussd = false;
var force_old_ussd = false;

main_executeBeforeDocumentReady();

function showConnectInfo() {
    if ($.browser.msie && ($.browser.version == '6.0')) // 兼容IE6
    {
        // 兼容阿语及希伯来语
        if (('ar_sa' == LANGUAGE_DATA.current_language) || ('he_il' == LANGUAGE_DATA.current_language) || ('fa_fa' == LANGUAGE_DATA.current_language)) {
            $('#center_box_main').css('marginRight', parseInt(g_PositionInfo.offset_ie6, 10) + 140);
        } else {
            $('#center_box_main').css('marginLeft', parseInt(g_PositionInfo.offset_ie6, 10) + 140);
        }
    } else {
        if (('ar_sa' == LANGUAGE_DATA.current_language) || ('he_il' == LANGUAGE_DATA.current_language) || ('fa_fa' == LANGUAGE_DATA.current_language)) {
            $('#center_box_main').css('marginRight', parseInt(g_PositionInfo.offset, 10) + 280);
        } else {
            $('#center_box_main').css('marginLeft', parseInt(g_PositionInfo.offset, 10) + 280);
        }
    }
}

function checkUpdateNeedLogin(){
    getAjaxData('api/webserver/white_list_switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            notLoginupdate_leftmenu = true;
            if (ret.response.whitelist_enable == '1') { //open auto update
                g_not_need_login_update = true;
            } else {
                g_not_need_login_update = false;
            }
        } else {
            g_not_need_login_update = false;
            notLoginupdate_leftmenu = false;
        }
    }, {
        errorCB: function() {
            g_not_need_login_update = false;
            notLoginupdate_leftmenu = false;
        },
        sync: true
    });
    
}
function force_update_leftmenu_check(){
    getAjaxData('api/online-update/configuration', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (typeof(ret.response.server_force_enable) != 'undefined' && ret.response.server_force_enable == '1'){
                force_update_leftmenu = true;
            }else if (typeof(ret.response.server_force_enable) != 'undefined' && ret.response.server_force_enable == '0'){
                force_update_leftmenu = true;
            }else {
                force_update_leftmenu = false;
            }        
        } else if (ret.type == 'error') {
            force_update_leftmenu = false;
        }
    }, {
        errorCB: function() {
            force_update_leftmenu = false;
        },
        sync: true
    });
}
function auto_update_leftmenu_check(){
    getAjaxData('api/online-update/autoupdate-config', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (typeof(ret.response.auto_update) != 'undefined' && ret.response.auto_update == '1'){
                auto_update_leftmenu = true;
            }else if (typeof(ret.response.auto_update) != 'undefined' && ret.response.auto_update == '0'){
                auto_update_leftmenu = true;
            }else {
                auto_update_leftmenu = false;
            }        
        } else if (ret.type == 'error') {
            auto_update_leftmenu = false;
        }
    }, {
        errorCB: function() {
            auto_update_leftmenu = false;
        },
        sync: true
    });
}
/**********************************After loaded (common)************/
$(document).ready( function() {
    //Display Title
    document.title = g_feature.title;

    // hide right mouse click menu
    document.oncontextmenu = new Function('return false');

    $('.hotlinkstring').show();
    //load header,
    if (g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1' && current_href != 'quicksetup' && current_href != 'pincoderequired' && current_href != 'pukrequired' && current_href != 'simlockrequired' && current_href != 'nocard'&& current_href != 'cradleDisconnected') {
        gotoPageWithoutHistory('quicksetup.html');
        return;
    }
    if (g_setup_wizard_page != '1' && g_default_password_status == 0 && current_href != 'modifypassword' && current_href != 'pincoderequired' && current_href != 'pukrequired' && current_href != 'simlockrequired' && current_href != 'nocard' && current_href != 'cradleDisconnected' && current_href != 'commend') {
        gotoPageWithoutHistory('modifypassword.html');
        return;
    }
    if (current_href == 'pincoderequired' || current_href == 'pukrequired' || current_href == 'simlockrequired' || current_href == 'nocard'  || current_href == 'cradleDisconnected'  || current_href == 'update_autorun'  || current_href == 'voicebusy' || current_href == 'opennewwindow') {
        loadHeaderRedirectPage();
    } else {
        loadHeader();
    }
    showConnectInfo();
    getSimPukTimes();
    addStatusListener('GetPLMN_main()');
    //load left menu
    if($(".content").children().first().is(".main_left")) {
        showleftMenu();
    }
    getDeviceStatus();
    showFooter();

    //Button effect when mouseover and out
    $('.button_wrapper:not(#login_btn,#connect_btn,#disconnect_btn,#cancel_btn)').live('mouseover', function() {
        $(this).addClass('mouse_on');
    });
    $('.button_wrapper').live('mouseout', function() {
        $(this).removeClass('mouse_on');
    });
    //Button effect when mousedown and mouseout
    $('.button_wrapper:not(#login_btn)').mousedown( function() {
        $(this).addClass('mouse_down');
    });
    $('.button_wrapper').mouseup( function() {
        $(this).removeClass('mouse_down');
    });
    //Drop down select, if there hasn't any drop down select, it won't work
    /*
    if ($("#lang").size() > 0) {
    drop_down_select($("#lang"), $(".lang_option").eq(0));//index page
    }
    */

    /******* Customlized dialog of which a button ID is "pop_OK" *****/
    $('#pop_OK').live('click', function() {
        if ('pop_OK' == g_main_displayingPromptStack[g_main_displayingPromptStack.length - 1]) {
            g_main_displayingPromptStack.pop();
        }
        enableTabKey();
    });
    /*************Function for close dialog**************/
    $('.dialog_close_btn, #pop_Cancel').live('click', function() {
        if (g_nav != null) {
            g_nav.children().first().attr('href', g_destnation);
            g_nav = null;
        }
        if(g_isTrunOffWlanChecked) {
            g_isTrunOffWlanChecked = false;
            $('#trun_off_waln_check').click();
        }
        if(g_is_disconnect_clicked || g_is_connect_clicked ||g_is_network_connect || g_is_wlan_connect || g_is_power_off || g_isPostAjax || g_new_switch) {
            g_is_disconnect_clicked = false;
            g_is_connect_clicked = false;
            g_is_network_connect = false;
            g_is_wlan_connect = false;
            g_is_power_off = false;
            g_isPostAjax = false;
            g_new_switch = false;
        }
        clearDialog();
        g_main_displayingPromptStack.pop();
        enableTabKey();
    });
    /*************Function for close dialog**************/
    /*$(window).resize(function(){
    windowResize($(".dialog"));
    });
    $("#div_wrapper").css({
    height: $(document).height()
    });*/

    /************* Key Event Handler **************/

    $(document).keydown(onKeyup);
    g_main_displayingPromptStack.length = 0;

    judgeBridgemode();
    g_smallPage = mainIsHandheldBrowser();
    var now = new Date();
    var temp =  now.getDate() + now.getSeconds();
    if('home' != current_href) {
        window.name = SHA256(temp.toString());
    }
    $('#settings').live('click', function() {
        setSettingMenu(g_PageUrlTree.settings);
    });
    $('#statistic').live('click', function() {
        $("#statistic").attr('href','statistic.html' );
    });
    $('#sms').live('click', function() {
        $("#sms").attr('href','smsinbox.html' );
    });
	$('#payment').live('click', function() {
        $("#payment").attr('href','payment.html' );
    });	
	$('#pb').live('click', function() {
        $("#pb").attr('href','phonebook.html' );
    });
    $('#ussd').live('click', function() {
        $("#ussd").attr('href','ussd.html' );
    });
    $('#update').live('click', function() {
        $("#update").attr('href','update.html' );
    });
    $('#ota').live('click', function() {
        $("#ota").attr('href','ota.html' );
    });
    $('#sharing').live('click', function() {
        if (g_module.dlna_enabled || g_module.sdcard_enabled || g_module.sambashare_enabled) {
            if(g_module.sdcard_enabled) {
                $('#menu_sharing a').attr("href","sdcardsharing.html");
            } else if(g_module.sambashare_enabled) {
                $('#menu_sharing a').attr("href","sambasettings.html");
            } else {
                $('#menu_sharing a').attr("href","dlna.html");
            }
        }
    });
    $('#stk').live('click', function() {
        $("#stk").attr('href','stk.html' );
    });
    $('#appmanagement').live('click', function() {
        $("#appmanagement").attr('href','appmanagement.html' );
    });
});
function judgeBridgemode() {
    var forbiddenPageOnBridegList = ['dhcp', 'dmzsettings','firewallswitch','lanipfilter','nat','sipalgsettings',
    'specialapplication', 'upnp', 'urlfilter', 'virtualserver', 'wifinetworks', 'wifipriority', 'home', 'systemsettings',
    'update', 'wlanbasicsettings','quicksetup','stationwps'];

    if ($.inArray(current_href, forbiddenPageOnBridegList)  > -1 && checkLeftMenu(g_PageUrlTree.settings.security.bridgemode)
    && g_module.bridge_enabled) {
        g_bridgeModeStatus = false;
        getAjaxData("api/security/bridgemode", function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                var BridgeModeStatus = parseInt(ret.response.bridgemode, 10);
                if (BridgeModeStatus == 1) {
                    g_bridgeModeStatus = true;
                    switch (current_href) {
                        case 'home':
                            $('#wlan_connect_btn').hide();
                            g_module.wifioffload_enable = false;
                            break;
                        case 'systemsettings':
                            $('.sntp_operation').hide();
                            g_module.sntp_enabled = false;
                            break;
                        case 'wlanbasicsettings':
                        case 'quicksetup':
                            if(typeof(g_wifiFeatureSwitch) != 'undefined') {
                                g_wifiFeatureSwitch.maxapnum = 1;
                            }

                            g_module.multi_ssid_enabled = false;
                            break;
                        case 'update':
                            g_isBridgeNotesOpened = true;
                            showInfoDialog(IDS_system_bridge_mode_warning, false, disableEntirePage);
                            break;
                        default:
                            showInfoDialog(IDS_system_bridge_mode_warning, false, disableEntirePage);
                    }
                } else {
                    g_bridgeModeStatus = false;
                }
            } else {
                g_bridgeModeStatus = false;
            }
        }, {
            sync: true
        });
    }
}

function disableEntirePage() {
    $('input:not(#lang)').attr('disabled', true);
    $('select:not(#lang)').attr('disabled', true);
    $('.button_edit_list').die();
    $('.button_edit_list').removeClass('clr_blue').addClass('clr_gray');
    $('.button_delete_list').die();
    $('.button_delete_list').removeClass('clr_blue').addClass('clr_gray');

    $('#query_again').remove();
    $('.wifiup').die();
    $('.wifidown').die();
    $('.wifidelete').die();
    $('.wifiedit').die();

    g_isBridgeNotesOpened = false;
    allButton_enable('0');
}

function setSettingMenu(obj) {

    $.each(obj, function(i, n) {
        if (typeof n == 'object' && !g_isReady) {
            setSettingMenu(n);
        } else if ((typeof n === 'string') && !g_isReady  && n != '') {
            $("#settings").attr('href', n + '.html' );
            g_isReady = true;
            log.debug('MAIN : setSettingMenu successful');

        }
    });
}

function changeItemStatus() {
    var login_status_items = $('.login_info > div:visible');
    if (login_status_items.size() > 2 ) {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '33.3%'
            });
        });
    } else if (login_status_items.size() == 2) {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '50%'
            });
        });
    } else if (login_status_items.size() == 1 && g_feature.connection.connectionstatus == 1) {
        $.each(login_status_items, function(i) {
            $('.login_box_info .connection').attr('style','background:none;width:100%;');
            $('.login_box_info h2').attr('style','width:95%;');
        });
    } else {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '50%'
            });
        });
    }
}

$(window).load( function() {

    $("#all_content").show();
    log.debug("MAIN : all_content show");

    changeItemStatus();
    setTimeout( function() {
        reloadLeftMenu();
    }, 1500);
    setTimeout( function() {
        if (current_href == 'pincoderequired' || current_href == 'pukrequired' || current_href == 'simlockrequired' || current_href == 'nocard'  || current_href == 'cradleDisconnected'  || current_href == 'update_autorun'  || current_href == 'voicebusy' || current_href == 'opennewwindow') {
            loadHeaderRedirectPage();
        } else {
            loadHeader();
        }
    }, 2000);
});
function loadHeaderRedirectPage() {
    if($.trim($('#header').html()) == '' || $('#header').html() == null) {
        $('#header').load('header.html', function() {
            $('.help').remove();
            $(".tools").remove();
            $("#union_main_menu").remove();
            $("#header_turnbg").removeClass('head_div');
            if (current_href == 'cradleDisconnected' || current_href == 'pincoderequired' || current_href == 'pukrequired'|| current_href == 'simlockrequired') {
                $('.logo').after("<div class='help'><span><select id='lang' style='display:none'></select></span><span class = 'clr_bold_a' style='display:none'><a id=help_url href='#' target='_blank'><span id='help_span'></span></a></span><span><span class='username'  id='username_span' style='display:none'></span></span><span>&nbsp;</span><span><span class='logout'><span id='logout_span'></span></span></span></div>");
            } else  if(current_href == 'update_autorun'){
                $('.logo').after("<div class='help'><span><select id='lang' style='display:none'></select></span></div>");
            }else {
                $('.logo').after("<div class='language'><span><select id='lang' style='display:none'></select></span></div>");
            }
            setLangList();
            showCurrentLanguage();
            if (g_needToLogin) {
                $('#logout_span').show();
                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        g_password_type = ret.response.password_type;
                        if (ret.response.State != 0) { //logout
                            $('#username_span').hide();
                            $('#logout_span').text(common_login);
                            cancelLogoutTimer();
                        } else //login
                        {
                            $('#username_span').text(ret.response.Username);
                            $('#username_span').show();
                            $('#logout_span').text(common_logout);
                            startLogoutTimer();
                        }
                    }
                }, {
                    sync: true
                });
            } else {
                $('.logout').hide();
                $('#logout_span').hide();
            }
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('.clr_white_header_hover').children().not('#menu_settings').hide();
            }
        });
    }
}

function loadHeader () {
    //reload left menu
    log.debug('checking header');
    if($.trim($('#header').html()) == '' || $('#header').html() == null) {
        log.debug('header is null');
        $('#header').load('header.html', function() {
            if($.browser.msie) {
                $('.help div').remove();
                $('.help').append(" <span><select id='lang' style='display:none'></select></span><span class = 'clr_bold_a'><a id=help_url href='#' target='_blank'><span id='help_span'></span></a></span>"+
                "<span><span class='username'  id='username_span' style='display:none'></span></span><span>&nbsp;</span>"+
                "<span><span class='logout'><span id='logout_span'></span></span></span>");
            }
            if(g_sms_mode == 1) {
                $('#sms').attr('href',"smsandroid.html");
                $('#tooltip_sms_full').attr('href',"smsandroid.html");
                $('#tooltip_sms').attr('href',"smsandroid.html");
            }
            getUserManualUrl();
            showCur(true);

            setMainMenu();

            if (g_needHelp) {
                $('#help_span').text(common_help);
            } else {
                $('#help_span').remove();
                $('#help_url').remove();
            }

            if (g_needToLogin) {
                $("#logout_span").show();
                /*
                 * display login status(login or logout) after check login state
                 */
                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        g_password_type = ret.response.password_type;
                        if (ret.response.State != 0) { //logout
                            $('#username_span').hide();
                            $('#logout_span').text(common_login);
                            cancelLogoutTimer();

                        } else //login
                        {
                            $('#username_span').text(ret.response.Username);
                            $('#username_span').show();
                            $('#logout_span').text(common_logout);
                            if ('home' == current_href) {
                                startLogoutTimer();
                            }

                        }

                    }
                }, {
                    sync: true
                });

            } else {
                $('.logout').hide();
                $('#logout_span').hide();
            }

            if (!g_module.wifi_enabled) {
                $('#wifi_gif').remove();
                $('#indoor_gif').remove();
            }
            if (!g_module.sms_enabled) {
                $('#sms_gif').remove();
            }

            if (!g_module.online_update_enabled) {
                $('#update_gif').remove();
            }

            if (!g_feature.battery_enabled) {
                $('#battery_gif').remove();
            }

            if ('undefined' != typeof(g_wifiFeatureSwitch)  && WIFI5G_ON != g_wifiFeatureSwitch.wifi5g_enabled) {
                $('#indoor_gif').remove();
            }
            initialStatusIcon();
            /*
             * show language list
             */

            setLangList();

            showCurrentLanguage();

            /*
             * login logout
             */
            $('#logout_span').live('click', function() {
                g_destnation = null;
                loginout();
            });
            $('#pop_login').die();
            $('#pop_login').live('click', function() {
                if ((null == g_destnation) && ('sdcardsharing' == current_href)) {
                    login(current_href + '.html');
                } else {
                    login(g_destnation);
                }
            });
            var menu_id = '#menu_statistic,#menu_sms,#menu_payment,#menu_connection_settings a,#menu_ussd,#menu_update,#menu_settings,.nav01,.nav02,#profile_settings a,#menu_pb,#menu_stk, #wifi_turnOff_button,#sambasettings,#sambasharinguser,#dlna,#menu_appmanagement,#update_local';
            if(!g_module.sdcard_enabled) {
                menu_id += ',#menu_sharing';
            }
            if(!g_not_need_login_update){
                menu_id += ',#menu_update,.nav01';
            }
            $(menu_id).live('click', function() {
                if (!g_needToLogin) {
                    return;
                }
                g_nav = $(this);
                if(g_nav.parent().attr("id") == "menu_connection_settings" || g_nav.parent().attr("id") == "profile_settings") {
                    g_nav = g_nav.parent();
                }

                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        if (ret.response.State != '0') {
                            if('undefined' != typeof(ret.response.firstlogin)) {
                                g_default_password_status = parseInt(ret.response.firstlogin,10);
                            }
                            if(g_default_password_status == 0 && g_Driver_classify != 'hilink') {
                                g_destnation = null;
                            } else {
                                g_destnation = g_nav.children().first().attr('href');
                            }
                            g_nav.children().first().attr('href', 'javascript:void(0);');
                            showloginDialog();
                        }

                    }
                }, {
                    sync: true
                });

            });
            //setSettingMenu(g_PageUrlTree.settings);
            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                $('.clr_white_header_hover').children().not('#menu_settings').hide();
            }
        });
    }
}

function setLoginStatus(redirectDes, callbackFunc) {
    if (g_needToLogin) {
        $('#logout_span').show();
        /*
         * display login status(login or logout) after check login state
         */
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != 0) { //logout
                    $('#username_span').hide();
                    $('#logout_span').text(common_login);
                    cancelLogoutTimer();

                } else //login
                {
                    $('#username_span').text(ret.response.Username);
                    $('#username_span').show();
                    $('#logout_span').text(common_logout);
                    if ('home' == current_href) {
                        startLogoutTimer(redirectDes);
                    }

                }

            }
        }, {
            sync: true
        });

    } else {
        $('.logout').hide();
        $('#logout_span').hide();
    }

    $('#logout_span').die();
    $('#logout_span').live('click', function() {
        g_destnation = null;
        loginout();
    });
    $('#pop_login').die();
    $('#pop_login').live('click', function() {
        login(g_destnation, callbackFunc, redirectDes);
    });
}

function getLoginStatus(callback, redirectDes) {
    var flag = true;
    if (g_needToLogin) {
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != 0) { //logout
                    $('#pop_login').die();
                    $('#pop_login').live('click', function() {
                        login(g_destnation, callback, redirectDes);
                    });
                    flag = false;
                    showloginDialog();
                }
            }
        }, {
            sync: true
        });
    }

    return flag;
}

function checkInputValue(str) {
    var flag = false;
    if(null != str && 'undefind' != typeof(str) && '' != str) {
        flag =  true;
    }
    return flag;

}

/********************Use Function  (end)************************/
/***********Function for create button*************/
function create_button(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        var disButtonClassName = "disable_btn clr_gray_disable_btn_center";
        if(buttonClassName == disButtonClassName) {
            button = "<span class='button_wrapper ' id='span_" + button_id + "'>";
            button +="<input id='" + button_id + "' class='" + buttonClassName + "' type='button' value='" + content + "'/></span>";
        } else {
            button = "<span class='button_wrapper ' id='span_" + button_id + "'>";
            button +="<input id='" + button_id + "' class='button_dialog " + buttonClassName + "' type='button' value='" + content + "'/></span>";
        }

    } else {
        button = "<span class='button_wrapper' id='span_" + button_id + "'>";
        button += "<input id='" + button_id + "' class='button_dialog ' type='button' value='" + content + "'/></span>";
    }

    document.write(button);
    ieRadiusBorder();

}

function ieRadiusBorder() {
    if($.browser.msie) {
        $("input[type=button]").css("outline", "none");
        $(".button_wrapper").css('border-radius', '3px');
        if ($.browser.msie && (parseInt($.browser.version,10) < 9)) {
            $(".button_wrapper").css('background', '#75ACD6');
            $(".button_wrapper").corner("3px");
            $(".button_wrapper input").css('padding-top', '1px');
            if ($.browser.msie && (parseInt($.browser.version,10) < 8)) {
                $("input[type=button]").css("padding", "0 8px");
            }

        }
    }
}

function create_button_html(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        var disButtonClassName = "disable_btn clr_gray_disable_btn_center";
        if(buttonClassName == disButtonClassName) {
            button = "<span class='button_wrapper '>";
            button +="<input id='" + button_id + "' class='" + buttonClassName + "' type='button' value='" + content + "'/></span>";
        } else {
            button = "<span class='button_wrapper '>";
            button +="<input id='" + button_id + "' class='button_dialog " + buttonClassName + "' type='button' value='" + content + "'/></span>";
        }

    } else {
        button = "<span class='button_wrapper'>";
        button += "<input id='" + button_id + "' class='button_dialog ' type='button' value='" + content + "'/></span>";
    }
    return button;
    ieRadiusBorder();

}

function isButtonEnable(button_id) {
    var disable = true;
    var $button = $('#' + button_id);
    if ($button) {
        disable = $button.hasClass('disable_btn');
    }
    return !disable;
}

/*************Function for append dialog**************/
function call_dialog(dialogTitle, content, button1_text, button1_id, button2_text, button2_id) {
    content = display_SIMtoUIM(content);
    $('#div_wrapper').remove();
    $('.dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog' id='sms_dialog'>";
    dialogHtml += "    <div class='sms_dialog_content'>";
    dialogHtml += "        <div class='sms_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + dialogTitle + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='close' class='dialog_close_btn clr_gray'><canvas id='callCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='sms_dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='sms_dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";

    dialogHtml += "              <span class='button_wrapper " + button1_id + "'>";
    dialogHtml += "                  <input id='"+button1_id+"' class='button_dialog' type='button' value='" + button1_text + "'/></span>";

    if (button2_text != '' && button2_text != ' ' && button2_text != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper " + button2_id + "'>";
        dialogHtml += "                  <input id='" + button2_id + "' class='button_dialog' type='button' value='" + button2_text + "'/></span>";
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);

    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("callCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".dialog_close_btn").css("top","7");
        $(".sms_dialog_header").css({
            "width":"609px",
            "height":"29px"
        });
        $(".sms_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        $(".sms_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".sms_dialog_header a").append(ahtml);
    } else {
        var canvas = document.getElementById("callCanvas");
        draw(canvas);
    }

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push(button1_id);

    $('a').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');
}

function showloginDialog() {
    $('#div_wrapper').remove();
    $('.login_dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_login + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='canvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table'>";
    dialogHtml += "               <div class='login'>";
    dialogHtml += "               <div id='initial_configuration_wrapper' style='display:none;'>";
    dialogHtml += "                   <p id='initial_configuration_tips'>" + IDS_initial_configuration_tips + "</p>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='username_wrapper'>";
    dialogHtml += '                   <p>' + dialup_label_user_name + common_colon + '</p>';
    dialogHtml += "                   <span><input type='text' class='input' id='username' maxlength='15' /></span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='login_password_wrapper'>";
    dialogHtml += '               <p>' + common_password + common_colon + '</p>';
    dialogHtml += "                   <span><input  type='password'  autocomplete='off' class='input' id='password' maxlength='15'/>&nbsp;&nbsp;</span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='forgot_pwd'>";
    dialogHtml += "                   <span id='forget_password_tab'>" + IDS_forget_password_tab + "</span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='forget_password_wrapper'>";
    dialogHtml += "                   <br><p id='forget_password_tips' style='display:none;'>" + IDS_forget_password_tips_hilink + "</p>";
    dialogHtml += '               </div>';
    dialogHtml += '               </div>';
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table_bottom'>";
    dialogHtml += "              <span class='button_wrapper pop_login'>";
    dialogHtml += "                  <input id='pop_login' class='button_dialog' type='button' value='"+common_login+"'/></span>";

    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
    dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='"+common_cancel+"'/></span>";

    dialogHtml += '       </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("canvas");
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
        $(".button_wrapper input").css("padding-top","2px");
        $(".login_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
        $(".dialog_close_btn").css("top","7px");
    } else {
        var canvas = document.getElementById("canvas");
        draw(canvas);
    }
    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('pop_login');

    //$('#username').focus();
    $('#username').val("admin");
    $('#password').focus();
    g_is_login_opened = true;

    disableTabKey();
    $('#forget_password_tab').click(function() {

		showRestoreDialog();
        /*var tipVal = $('#forget_password_tips');
        if (tipVal.attr('style')) {
            tipVal.removeAttr('style');
        } else {
            tipVal.attr('style', 'display:none;');
        }*/
    });
    if (g_setup_wizard_page == '1' && current_href == 'quicksetup' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
        $('#initial_configuration_wrapper').show();
    }
    $('#pop_Cancel,.dialog_close_btn').click( function() {
        if(g_setup_wizard_page == '1' && current_href == 'quicksetup' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
            button_enable('step1_next','0');
            button_enable('step_finish_new','0');
        } else {
            gotoPageWithoutHistory(HOME_PAGE_URL);
        }
    });
}

function draw(canvas) {
    var paint = canvas.getContext("2d");
    paint.beginPath();
    paint.clearRect(0,0,24,24);
    paint.fillStyle = "#595959";
    paint.strokeStyle = "#595959";
    paint.beginPath();
    paint.arc(12,12,11,0,Math.PI*2,true);
    paint.closePath();
    paint.lineWidth = 2;
    paint.fill();
    paint.stroke();

    var x = 12;
    y = 12;
    paint.strokeStyle = "red";
    paint.beginPath();
    paint.moveTo(6.4,6.4);
    paint.lineTo(17.6,17.6);
    paint.stroke();
    paint.closePath();

    paint.strokeStyle = "red";
    paint.beginPath();
    paint.moveTo(6.4,17.6);
    paint.lineTo(17.6,6.4);
    paint.stroke();
    paint.closePath();

}

function showConfirmDialog(content, okFunc, cancelFunc, removeable,removeFunc) {
    content = display_SIMtoUIM(content);
    if (DIALOG_UNREMOVE != removeable) {
        $('#div_wrapper').remove();
        $('.dialog').remove();
    }

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    if (content == common_warning_logout) {
        dialogHtml += "<div class='dialog' id='dialog'>";
    } else {
    dialogHtml += "<div class='dialog'>";
    }
    dialogHtml += "    <div class='dialog_content'>";
    dialogHtml += "        <div class='dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_confirm + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='dialog_close_btn clr_gray'><canvas id='confirmCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";
    dialogHtml += "              <span class='button_wrapper pop_confirm'>";
    dialogHtml += "                  <input id='pop_confirm' class='button_dialog' type='button' value='"+common_ok+"'/></span>";
    if (cancelFunc != '' && cancelFunc != ' ' && cancelFunc != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
        dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='"+common_cancel+"'/></span>";
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('#pop_confirm').live('click', function() {
        clearDialog();

        if (typeof (okFunc) == 'function') {
            okFunc();
        }
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
        hiddenSelect(false);
        return false;
    });
    $('#pop_Cancel').live('click', function() {
        if (typeof (cancelFunc) == 'function') {
            cancelFunc();
        }
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
        hiddenSelect(false);
        return false;
    });
    $(".dialog_close_btn").live("click", function() {
        if (typeof (removeFunc) == 'function') {
            removeFunc();
        }
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
    });
    $('.body_bg').before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("confirmCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".dialog_header").css({
            "width":"500px",
            "height":"29px"
        });
        $(".dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        $(".dialog_header a").css("top","7px");
        $(".button_wrapper input").css("padding-top","2px");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".dialog_header a").append(ahtml);

    } else {
        var canvas = document.getElementById("confirmCanvas");
        draw(canvas);
    }
    hiddenSelect(true);

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push('pop_confirm');

    disableTabKey();
}

//show info dialog
function showInfoDialog(tipsContent, isWiFi, closeFunc, notAutoCloss) {
    tipsContent = display_SIMtoUIM(tipsContent);
    if ($('.info_dialog').size() == 0) {
        var hideInfo;
        clearTimeout(hideInfo);
        var dialogHtml = '';
        if ($('#div_wrapper').size() < 1) {
            dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
        }
        dialogHtml += "<div class='info_dialog'>";
        dialogHtml += "    <div class='info_dialog_content'>";
        dialogHtml += "        <div class='info_dialog_header'>";
        dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_note + '</span>';
        dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='info_dialog_close_btn clr_gray'><canvas id='showInfoCanvas' width='25px' height='25px'></canvas></a></span>";
        dialogHtml += '        </div>';
        dialogHtml += "        <div class='info_dialog_table'><div class='info_content'>" + tipsContent + '</div></div>';
        dialogHtml += '    </div>';
        dialogHtml += '</div>';

        $('.body_bg').before(dialogHtml);
        if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
            $(".button_wrapper").css('border-radius', '3px');
            var canvas = document.getElementById("showInfoCanvas");
            draw(canvas);
        } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
            $(".dialog_header_left").css("margin-top","5");
            $(".info_dialog_header").css({
                "width":"500px",
                "height":"29px"
            });
            $(".info_dialog_header").corner("top 5px");
            $(".info_dialog_close_btn").css("top","7");
            var ahtml="<img src='../res/new_del.png' title='' alt='' />";
            $(".info_dialog_header a").append(ahtml);
        } else {
            var canvas = document.getElementById("showInfoCanvas");
            draw(canvas);
        }
        hiddenSelect(true);

        $('.info_dialog_close_btn').bind('click', function() {
            if (typeof (closeFunc) == 'function') {
                closeFunc();
            }
            closeFunc = null;
            clearTimeout(hideInfo);
            clearDialog();
        });
        reputPosition($('.info_dialog'), $('#div_wrapper'));
        disableTabKey();
        if (isWiFi) {
            if(isWiFi == 20000) {
                hideInfo = setTimeout( function() {
                    clearDialog();
                }, 20000);
            } else {
                $(".info_dialog_close_btn").remove();
                hideInfo = setTimeout( function() {
                    clearDialog();
                }, 6000);
            }
        } else {
            hideInfo = setTimeout( function() {
                if (typeof (closeFunc) == 'function') {
                    closeFunc();
                }
                closeFunc = null;
                clearDialog();
            }, g_feature.dialogdisapear);
        }
    }
}

//function for show jquery qtip
function showQtip(showTarget, content, delay) {
    content = display_SIMtoUIM(content);
    var $showTarget = $('#' + showTarget);
    $showTarget.qtip('destroy');
    if ($showTarget) {
        $showTarget.qtip({
            content: content,
            position: {
                corner: {
                    tooltip: 'topMiddle',
                    target: 'bottomMiddle'
                }
            },
            show: {
                when: false,
                ready: true
            }
        });
        if (delay) {
            if(clearshow != null) {
                clearTimeout(clearshow);
            }
            clearshow = setTimeout( function() {
                $showTarget.qtip('destroy');
            }, delay);
        } else {
            if(clearshow != null) {
                clearTimeout(clearshow);
            }
            clearshow = setTimeout( function() {
                $showTarget.qtip('destroy');
            }, g_feature.tip_disapear);
        }
    }
    $showTarget.focus();
}

function clearDialog() {
    $('.dialog:not(#upload_dialog), .info_dialog, .login_dialog, #div_wrapper').remove();
    hiddenSelect(false);
    enableTabKey();
    if (g_is_login_opened) {
        g_is_login_opened = false;
        getDeviceStatus();
    }
}
function clearDialog_table() {
    $('.dialog:not(#upload_dialog), .info_dialog, .login_dialog, #div_wrapper').hide();
    hiddenSelect(false);
    enableTabKey();
    if (g_is_login_opened) {
        g_is_login_opened = false;
        getDeviceStatus();
    }
}
/*************Function for ie6 png**************/
function correctPNG() {
    var i = 0;
    for (i = 0; i < document.images.length; i++) {
        var img = document.images[i];
        var imgName = img.src.toUpperCase();
        if (imgName.substring(imgName.length - 3, imgName.length) == 'PNG') {
            var imgID = (img.id) ? "id='" + img.id + "' " : '';
            var imgClass = (img.className) ? "class='" + img.className + "' " : '';
            var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
            var imgStyle = 'display:inline-block;' + img.style.cssText;
            if (img.align == 'left') {
                imgStyle = 'float:left;' + imgStyle;
            }

            if (img.align == 'right') {
                imgStyle = 'float:right;' + imgStyle;
            }

            if (img.parentNode.href) {
                imgStyle = 'cursor:hand;' + imgStyle;
            }

            var strNewHTML = '<span ' + imgID + imgClass + imgTitle + ' style=\"' + 'width:' + img.width + 'px; height:' + img.height + 'px;' + imgStyle + ';' + 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader' + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
            img.outerHTML = strNewHTML;
            i = i - 1;
        }
    }
}

function fixPNG(myImage) {
    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);
    if ((version >= 5.5) && (version < 7) && (document.body.filters)) {
        var imgID = (myImage.id) ? "id='" + myImage.id + "' " : "";
        var imgClass = (myImage.className) ? "class='" + myImage.className + "' " : "";
        var imgTitle = (myImage.title) ? "title='" + myImage.title  + "' " : "title='" + myImage.alt + "' ";
        var imgStyle = "display:inline-block;" + myImage.style.cssText;
        var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + myImage.width
        + "px; height:" + myImage.height
        + "px;" + imgStyle + ";"
        + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
        + "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>";
        myImage.outerHTML = strNewHTML;
    }
}

/***********************Function list (begin)***********************/

/***********Get and save data (begin)**********/
// internal use only
function _createNodeStr(nodeName, nodeValue) {
    return '<' + nodeName + '>' + nodeValue + '</' + nodeName + '>';
}

// internal use only
function _recursiveObject2Xml(name, obj) {
    var xmlstr = '';
    if (typeof (obj) == 'string' || typeof (obj) == 'number') {
        xmlstr = _createNodeStr(name, obj);
    } else if (jQuery.isArray(obj)) {
        jQuery.each(obj, function(idx, item) {
            xmlstr += _recursiveObject2Xml(name, item);
        });
    } else if (typeof (obj) == 'object') {
        xmlstr += '<' + name + '>';
        jQuery.each(obj, function(propName, propVal) {
            xmlstr += _recursiveObject2Xml(propName, propVal);
        });
        xmlstr += '</' + name + '>';
    }
    return xmlstr;
}

// convert an object to xml string.
// name: root tag name of XML
// obj:  object which is to be convert to XML
function object2xml(name, obj) {
    var xmlstr = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlstr += _recursiveObject2Xml(name, obj);
    return xmlstr;
}

// internal use only
function _recursiveXml2Object($xml) {
    if ($xml.children().size() > 0) {
        var _obj = {};
        $xml.children().each( function() {
            var _childObj = ($(this).children().size() > 0) ? _recursiveXml2Object($(this)) : $(this).text();
            if ($(this).siblings().size() > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            } else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    } else {
        return $xml.text();
    }
}

// convert XML string to an Object.
// $xml, which is an jQuery xml object.
function xml2object($xml) {
    var obj = {};
    if ($xml.find('response').size() > 0) {
        var _response = _recursiveXml2Object($xml.find('response'));
        obj.type = 'response';
        obj.response = _response;
    } else if ($xml.find('error').size() > 0) {
        var _code = $xml.find('code').text();
        var _message = $xml.find('message').text();
        log.warn('MAIN : error code = ' + _code);
        log.warn('MAIN : error msg = ' + _message);
        obj.type = 'error';
        obj.error = {
            code: _code,
            message: _message
        };
    } else if ($xml.find('config').size() > 0) {
        var _config = _recursiveXml2Object($xml.find('config'));
        obj.type = 'config';
        obj.config = _config;
    } else {
        obj.type = 'unknown';
    }
    return obj;
}

function getAvailableToken() {
    var token = '';
    if($.isArray(g_requestVerificationToken)) {
        if(g_requestVerificationToken.length > 0) {
            token =  g_requestVerificationToken[0];
        } else {

            token = '';
        }

    } else {
        token = g_requestVerificationToken;
    }

    return token;
}

/*************Get and save data (end)**************/
/***************Get and save data (begin)******/

// urlstr : URL of the Restful interface.
// callback_func : Callback function to handle response, this callback function
// have one parameter
// callback_func($xml) - $xml : a jQuery XML object which is successfully get
// from getAjaxData.
// options.sync
// options.timout
// options.errorCB
function getAjaxData(urlstr, callback_func, options) {
    var myurl = AJAX_HEADER + urlstr + AJAX_TAIL;
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }

        }
        errorCallback = options.errorCB;
    }

    var headers = {};
    if(!($.isArray(g_requestVerificationToken))) {
        headers['__RequestVerificationToken'] = g_requestVerificationToken;
    }
    if (true == g_scarm_login && (urlstr == 'api/wlan/multi-basic-settings' || urlstr == 'api/wlan/security-settings')) {
        headers['Login-Type'] = 'Scram';
    }
    if (g_set_cookie_flag && urlstr == 'api/monitoring/status') {
        g_set_cookie_flag = false;
        headers['Update-Cookie'] = 'UpdateCookie';
    }
    $.ajax({
        async: isAsync,
        headers: headers,
        //cache: false,
        type: 'GET',
        timeout: nTimeout,
        url: myurl,
        //dataType: ($.browser.msie) ? "text" : "xml",
        error: function(XMLHttpRequest, textStatus) {
            try {
                if (jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
                log.error('MAIN : getAjaxData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus ' + textStatus);
            } catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : getAjaxData(' + myurl + ') sucess.');
            log.trace(data);
            var xml;
            if (typeof data == 'string' || typeof data == 'number') {
                if((-1 != this.url.indexOf('/api/ussd/get') )&&( -1 != data.indexOf("content"))) {
                    data = smsContentDeleteWrongChar(data);
                }
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                } else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            } else {
                xml = data;
            }
            var ret = xml2object($(xml));
            if('error' == ret.type) {
                if(ERROR_WRONG_SESSION_TOKEN == ret.error.code) {
                    log.error('Main: getajax'+ this.url +'session token error');
                    gotoPageWithoutHistory(HOME_PAGE_URL);
                    return;
                }

                if(ERROR_WRONG_SESSION == ret.error.code) {
                    if(!g_login_checking_flag){
                    log.error('Main: getajax'+ this.url +'session  error');
                    gotoPageWithoutHistory(HOME_PAGE_URL);
             }
            return;
                }
            }
            if('error' == ret.type && ERROR_WRONG_TOKEN == ret.error.code) {
                getAjaxToken();
                getAjaxData(urlstr, callback_func, options);
            } else if (typeof callback_func == 'function') {
                callback_func($(xml));
            } else {
                log.error('callback_func is undefined or not a function');
            }
        }
    });
}

function sdResolveCannotParseChar(xmlStr) {
    if (typeof(xmlStr) != 'undefined' && xmlStr != null && xmlStr != '') {
        return xmlStr.replace(/(\&|\')/g, function($0, $1) {
            return {
                '&' : '&amp;' ,
                "'" : '&#39;'
            }[$1];
        }
        );
    }
    return '';
}

function wifiSsidResolveCannotParseChar(xmlStr) {
    if (typeof(xmlStr) != 'undefined' && xmlStr != null && xmlStr != '') {
        return xmlStr.replace(/(\&|\'|\"|\>|\<)/g, function($0, $1) {
            return {
                '&' : '&amp;',
                "'" : '&apos;',
                '"' : '&quot;',
                '<' : '&lt;',
                '>' : '&gt;'
            }[$1];
        }
        );
    }
    return '';
}

function XSSResolveCannotParseChar(xmlStr) {
    if (typeof(xmlStr) != 'undefined' && xmlStr != null && xmlStr != '') {
        return xmlStr.replace(/(\&|\'|\"|\>|\<|\/|\(|\))/g, function($0, $1) {
            return {
                '&' : '&amp;',
                "'" : '&#39;',
                '"' : '&quot;',
                '<' : '&lt;',
                '>' : '&gt;',
                '/' : '&#x2F;',
                '(' : '&#40;',
                ')' : '&#41;'
            }[$1];
        }
        );
    }
    return '';
}

function sd_resolveEntityReference(str) {
    if (typeof(str) != 'undefined' && str != null && str != '') {
        return str.replace( /(\%26|\%27|\%20|\%23|\%25|\%3B|\'|\&|\"|\>|\<|\/|\(|\))/g, function($0, $1) {
            return {
                '%26' : '&amp;',
                '%27' : '&#39;',
                '%20' : ' ',
                '%23' : '#',
                '%25' : '%',
                '%3B' : ';',
                "'" : '&#39;',
                '&' : '&amp;',
                '"' : '&quot;',
                '<' : '&lt;',
                '>' : '&gt;',
                '/' : '&#x2F;',
                '(' : '&#40;',
                ')' : '&#41;'
            }[$1];
        }
        );
    }
    return '';
}

function XSSResolveHtmlReturnChar(xmlStr) {
    if (typeof(xmlStr) != 'undefined' && xmlStr != null && xmlStr != '') {
        return xmlStr.replace(/(\'|\"|\/|\(|\))/g, function($0, $1) {
            return {
                "'" : '&apos;',
                '"' : '&quot;',
                '/' : '&#x2F;',
                '(' : '&#40;',
                ')' : '&#41;'
            }[$1];
        }
        );
    }
    return '';
}

function smsContentDeleteWrongChar(smsStr) {
    return smsStr.replace(/([\x00-\x08]|\x0b|\x0c|[\x0e-\x1f])/g, ' ');
}

function getTokenFromHeader(headers, tokenHeader) {
    var tokenindex = headers.indexOf(tokenHeader) + tokenHeader.length + 1;
    while(headers.substring(tokenindex, tokenindex + 1) == ' ') {
        tokenindex++;
    }
    return headers.substring(tokenindex, tokenindex + 32);
}

var g_encPublickey = {
    e: '',
    n: ''
};

getEncpubkey(false);
function getEncpubkey(issync) {
    if(typeof(g_moduleswitch.encrypt_enabled) == 'undefined' || g_moduleswitch.encrypt_enabled != 1){
        return;
    }
    
    var syncs =  true;
    if(typeof(issync) != 'undefined') {
        syncs = issync;
    }
    getAjaxData('api/webserver/publickey', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_encPublickey.e = ret.response.encpubkeye;
            g_encPublickey.n = ret.response.encpubkeyn;
            if(g_encPublickey.e == '') {
                getEncpubkey(syncs);
            }
        } else {
            getEncpubkey(syncs);
        }
    }, {
        sync: syncs
    }, {
        errorCB: function() {
            getEncpubkey(syncs);
        }
    });
}

function storagePubkey(rsa_n,rsa_e) {
    var storage = window.localStorage;
    if(rsa_e == "" || rsa_n == "") {
        return;
    }
    try {
        storage.setItem("atp", 'atp');
        storage.getItem("atp");
        storage.removeItem("atp");
        storage.removeItem("n");
        storage.removeItem("e");
        storage.setItem("n", rsa_n);
        storage.setItem("e", rsa_e);
    } catch (error) {
        var pubkey = "[rsa_n="+rsa_n+"&rsa_e="+rsa_e+"]";
        var namebk = window.name;
        var keylocation = namebk.indexOf("[rsa_n=");
        var defaultvalue = namebk;
        if(keylocation > 0) {
            defaultvalue = namebk.substr(0,keylocation);
        }
        window.name =  defaultvalue + pubkey;
    }
}

function getPubkey() {
    var storage = window.localStorage;
    try {
        storage.setItem("atp", 'atp');
        storage.getItem("atp");
        storage.removeItem("atp");
        return [storage.getItem("n"),storage.getItem("e")];
    } catch (error) {
        var namebk = window.name;
        var keylocation = namebk.indexOf("[rsa_n=");
        if(keylocation>=0) {
            var pubkey = namebk.substr(keylocation);
            var local_e = pubkey.indexOf("&rsa_e=");
            if(local_e > 0) {
                var e= pubkey.substring(local_e+7,pubkey.length-1);
                var n= pubkey.substring(7,local_e);
                return [n,e];
            }
        }
    }
    return ["",""];
}
function doRSAEncrypt(encstring) {
    if(encstring == '') {
        return '';
    }
    
    if(typeof(g_moduleswitch.encrypt_enabled) == 'undefined' || g_moduleswitch.encrypt_enabled != 1){
        return encstring;
    }
    
    if(g_encPublickey.e == '') {
        if (true == g_scarm_login) {
            var pubkeyArray = getPubkey();
            g_encPublickey.e = pubkeyArray[1];
            g_encPublickey.n = pubkeyArray[0];
        } else {
            getEncpubkey();
        }
    }
    var rsa = new RSAKey();
    rsa.setPublic(g_encPublickey.n, g_encPublickey.e);
    encstring = base64_encode(encstring);
    var num = encstring.length / 245;
    var restotal = '';
    for (i = 0; i < num; i++) {
        var encdata = encstring.substr(i * 245, 245);
        var res = rsa.encrypt(encdata);
        restotal += res;
    }
    if (restotal.length % 256 != 0) {
        restotal = doRSAEncrypt(encstring);
    }
    return restotal;
}

// urlstr : URL of the Restful interface.
// xml: xml string to be submit to server.
// callback_func : Callback function to handle response, this callback function
// have one parameter
// callback_func($xml) - $xml : a jQuery XML object which is successfully get
// from getAjaxData.
// options.sync
// options.timout
// options.errorCB
var g_LoopCount = 0;
function saveAjaxData(urlstr, xmlDate, callback_func, options) {
    var myurl = AJAX_HEADER + urlstr + AJAX_TAIL;
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    var headers = {};
    if($.isArray(g_requestVerificationToken)) {
        if(g_requestVerificationToken.length > 0) {
            headers['__RequestVerificationToken'] = g_requestVerificationToken[0];
            g_requestVerificationToken.splice(0, 1);
        } else {
            if(g_LoopCount++ > 20 && ('api/wlan/handover-setting' == urlstr)){
                refresh();
            }            
            setTimeout( function () {
                saveAjaxData(urlstr, xmlDate, callback_func, options);
            }, 50);
            return;
        }

    } else {
        headers['__RequestVerificationToken'] = g_requestVerificationToken;
    }
    g_LoopCount =0;
    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }
        }
        errorCallback = options.errorCB;
        if (options.enc && g_moduleswitch.encrypt_enabled == 1) {
            headers['encrypt_transmit'] = 'encrypt_transmit';
            xmlDate = doRSAEncrypt(xmlDate);
        } else if(options.enp && g_moduleswitch.encrypt_enabled == 1) {
            headers['part_encrypt_transmit'] = options.enpstring;
        }
    }

    $.ajax({
        async: isAsync,
        headers: headers,
        //cache: false,
        type: 'POST',
        timeout: nTimeout,
        url: myurl,
        // dataType: ($.browser.msie) ? "text" : "xml",
        data: xmlDate,
        error: function(XMLHttpRequest, textStatus) {
            try {
                if("12030" == XMLHttpRequest.status || "12031" == XMLHttpRequest.status || "12019" == XMLHttpRequest.status || "400" == XMLHttpRequest.status) {
                    saveAjaxData(urlstr, xmlDate, callback_func, options);
                    return;
                } else if(jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
                log.error('MAIN : saveAjaxData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus' + textStatus);
                g_isPostAjax = false;
            } catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : saveAjaxData(' + myurl + ') success.');
            log.trace(data);
            var xml;
            if (typeof data == 'string') {
                if (-1 != this.url.indexOf('/api/sms/sms-list') && -1 != data.indexOf('Messages')) {
                    data = smsContentDeleteWrongChar(data);
                }
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                } else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            } else {
                xml = data;
            }
            var xml_ret = xml2object($(xml));
            if(typeof xml_ret.error != 'undefined' && -1 == this.url.indexOf('/api/user/session')) {
                if(xml_ret.error.code == ERROR_SYSTEM_NO_RIGHTS && current_href != "home") {
                    gotoPageWithoutHistory(HOME_PAGE_URL);
                    return;
                }
                if(ERROR_VOICE_BUSY == xml_ret.error.code) {
                    gotoPageWithoutHistory(VOICE_BUSY_URL);
                    return;
                }

                if(ERROR_WRONG_TOKEN == xml_ret.error.code) {
                    getAjaxToken();
                    saveAjaxData(urlstr, xmlDate, callback_func, options);
                    return;
                }

                if(ERROR_WRONG_SESSION_TOKEN == xml_ret.error.code) {
                    log.error('Main: saveAjaxDate'+ this.url +'session token error');
                    gotoPageWithoutHistory(HOME_PAGE_URL);
                    return;
                }

                if(ERROR_WRONG_SESSION == xml_ret.error.code) {
                    if(!g_login_checking_flag){                   
                        log.error('Main: saveAjaxDate'+ this.url +'session  error');
                        gotoPageWithoutHistory(HOME_PAGE_URL);
                    }
                    return;    
                }
            } else if(isAjaxReturnOK(xml_ret) && -1 != this.url.indexOf('/api/user/login')) {
                log.debug('Main: login success, empty token list');
                if($.isArray(g_requestVerificationToken)) {
                    g_requestVerificationToken = [];
                }
            } else if(-1 != this.url.indexOf('/api/user/challenge_login') || -1 != this.url.indexOf('/api/user/authentication_login') || -1 != this.url.indexOf('/api/user/password_scram')) {
                if($.isArray(g_requestVerificationToken)) {
                    g_requestVerificationToken = [];
                }
            }

            if (typeof callback_func == 'function') {
                callback_func($(xml));
            } else {
                log.error('callback_func is undefined or not a function');
            }
        },
        complete: function(XMLHttpRequest, textStatus) {
            var headers = XMLHttpRequest.getAllResponseHeaders();
            if(headers.indexOf('__RequestVerificationTokenone') > 0) {
                g_requestVerificationToken.push(getTokenFromHeader(headers, '__RequestVerificationTokenone'));
                if(headers.indexOf('__RequestVerificationTokentwo') > 0) {
                    g_requestVerificationToken.push(getTokenFromHeader(headers, '__RequestVerificationTokentwo'));
                }
            } else if(headers.indexOf('__requestverificationtokenone') > 0) {
                g_requestVerificationToken.push(getTokenFromHeader(headers, '__requestverificationtokenone'));
                if(headers.indexOf('__requestverificationtokentwo') > 0) {
                    g_requestVerificationToken.push(getTokenFromHeader(headers, '__requestverificationtokentwo'));
                }
            } else if(headers.indexOf('__RequestVerificationToken') > 0) {
                g_requestVerificationToken.push(getTokenFromHeader(headers, '__RequestVerificationToken'));
            } else if(headers.indexOf('__requestverificationtoken') > 0) {
                g_requestVerificationToken.push(getTokenFromHeader(headers, '__requestverificationtoken'));
            } else {
                log.error('MAIN: saveAjaxData can not get response token');
            }
        }
    });
}

// return true if the AJAX response from server is <response>OK</response>
// obj: object came from $xml
function isAjaxReturnOK(obj) {
    var ret = false;
    if (obj) {
        if (typeof (obj.response) == 'string') {
            if (obj.response.toLowerCase() == 'ok') {
                ret = true;
            }
        }
    }
    return ret;
}

// options.sync
// options.timout
// options.errorCB
function getConfigData(urlstr, callback_func, options) {
    var myurl = '../' + urlstr + '';
    //var myurl = urlstr + "";
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }
        }
        errorCallback = options.errorCB;
    }

    $.ajax({
        async: isAsync,
        //cache: false,
        type: 'GET',
        timeout: nTimeout,
        url: myurl,
        //dataType: ($.browser.msie) ? "text" : "xml",
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            try {
                log.debug('MAIN : getConfigData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus ' + textStatus);
                if (jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
            } catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : getConfigData(' + myurl + ') success.');
            log.trace(data);
            var xml;
            if (typeof data == 'string' || typeof data == 'number') {
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                } else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            } else {
                xml = data;
            }
            if (typeof callback_func == 'function') {
                callback_func($(xml));
            } else {
                log.error('callback_func is undefined or not a function');
            }
        }
    });
}

/*************Get and save data (end)**************/
function _createFeatureNode(str) {
    if (typeof (str) == 'undefined' || str == null) {
        return null;
    }

    var isEmpt = $.trim(str);
    if(isEmpt == "") {
        return isEmpt;
    }
    if (isNaN(str)) {
        // not a number
        return str;
    } else {
        // is a number
        var value = parseInt(str, 10);
        return value;
    }
}

function _recursiveXml2Feature($xml) {
    if ($xml.children().size() > 0) {
        var _obj = {};
        $xml.children().each( function() {
            var _childObj = ($(this).children().size() > 0) ? _recursiveXml2Feature($(this)) : _createFeatureNode($(this).text());
            if ($(this).siblings().size() > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            } else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    } else {
        return _createFeatureNode($xml.text());
    }
}

// convert XML string to an Object.
// $xml, which is an jQuery xml object.
function _xml2feature($xml) {
    var obj = null;
    if ($xml.find('config').size() > 0) {
        var _config = _recursiveXml2Feature($xml.find('config'));
        obj = _config;
    }
    return obj;
}

/*
 POST api/global/module-switch HTTP/1.1
 返回报文：
 <?xml version="1.0" encoding="UTF-8"?>
 <response>
 <ussd-enabled>0</ussd-enabled>
 <online-update-enabled>1</online-update-enabled>
 <sms-enabled>1</sms-enabled>
 <sdcard-enabled >0</sdcard-enabled>
 <wifi-enabled>1</wifi-enabled>
 </response>
 */
function getGlobalFeatures() {

    getAjaxData('api/device/basic_information', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            basic_infos = ret.response;
            if('undefined' != typeof(ret.response.autoupdate_guide_status)){
                g_setup_wizard_page = ret.response.autoupdate_guide_status;
            }
            g_Driver_classify = ret.response.classify;
            g_ProductCDMA = ret.response.productfamily == "CDMA"?true:false;
            if(g_ProductCDMA) {
                g_net_mode_status = MACRO_NET_MODE_C;
            } else {
                g_net_mode_status = MACRO_NET_MODE_W;
            }
            if(ret.response.multimode == '1') {
                g_net_mode_type = MACRO_NET_DUAL_MODE;
            } else {
                g_net_mode_type = MACRO_NET_SINGLE_MODE;
            }
        } else {
            getAjaxData('api/device/information', function($xml) {
                var ret = xml2object($xml);
                if ('response' == ret.type) {
                    g_ProductCDMA = ret.response.ProductFamily == "CDMA"?true:false;
                    if(g_ProductCDMA) {
                        g_net_mode_status = MACRO_NET_MODE_C;
                    } else {
                        g_net_mode_status = MACRO_NET_MODE_W;
                    }
                    if(ret.response.MultiMode == '1') {
                        g_net_mode_type = MACRO_NET_DUAL_MODE;
                    } else {
                        g_net_mode_type = MACRO_NET_SINGLE_MODE;
                    }
                }
            }, {
                sync: true
            });
        }
    }, {
        sync: true
    });
    if (basic_infos != null && typeof(g_setup_wizard_page) == 'undefined') {
        getAjaxData('api/device/basic_information', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                basic_infos = ret.response;
                if('undefined' != typeof(ret.response.autoupdate_guide_status)){
                    g_setup_wizard_page = ret.response.autoupdate_guide_status;
                }
                g_Driver_classify = ret.response.classify;
                g_ProductCDMA = ret.response.productfamily == "CDMA"?true:false;
                if(g_ProductCDMA) {
                    g_net_mode_status = MACRO_NET_MODE_C;
                } else {
                    g_net_mode_status = MACRO_NET_MODE_W;
                }
                if(ret.response.multimode == '1') {
                    g_net_mode_type = MACRO_NET_DUAL_MODE;
                } else {
                    g_net_mode_type = MACRO_NET_SINGLE_MODE;
                }
            }
        }, {
            sync: true
        });
    }
    getAjaxData('api/online-update/configuration', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_auto_update_enable  = ret.response.auto_update_enable;
        }
    }, {
        sync: true
    });
    getConfigData('config/global/config.xml', function($xml) {
        g_feature = _xml2feature($xml);
        g_PageUrlTree = g_feature.menu;
        g_needToLogin = g_feature.login;
        g_nedd_login = g_feature.login;
        g_needFooter = g_feature.footer;
        g_MainMenuNumber = g_feature.menu_number;
        g_PositionInfo = g_feature.position_info;
        g_copyright_year = g_feature.copyright;
    }, {
        sync: true
    });
    if(g_needToLogin == 0) {
        getAjaxData('api/user/hilink_login', function($xml) {
            var res = xml2object($xml);
            if ('response' == res.type) {
                g_hilink_login_old_api = 1;
                g_hilink_login_status = res.response.hilink_login;
                g_needToLogin = parseInt(res.response.hilink_login,10) == 1 ? true : false;
            } else {
                g_hilink_login_old_api = 0;
            }
        }, {
            sync: true
        });
    }

    getConfigData('config/global/net-type.xml', function($xml) {
        var ret =  xml2object($xml);
        var networktype = ret.config.networktypes;
        if ($.isArray(networktype)) {
            var i=0;
            for(i=0;i<networktype.length;i++) {
                g_networktype[parseInt(networktype[i].index,10)] =  networktype[i].networktype;
            }
        }
    }, {
        sync: true
    });
    getAjaxData('api/global/module-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_moduleswitch = ret.response;
            g_module = {
                'ussd_enabled' : g_moduleswitch.ussd_enabled == '1' ? true : false,
                'sdcard_enabled' : g_moduleswitch.sdcard_enabled == '1' ? true : false,
                'online_update_enabled' : g_moduleswitch.bbou_enabled == '1' ? true : false,
                'wifi_enabled' : g_moduleswitch.wifi_enabled == '1' ? true : false,
                'sms_enabled' : g_moduleswitch.sms_enabled == '1' ? true : false,
                'pb_enabled' : g_moduleswitch.pb_enabled == '1' && isFirmwareSupportsModule('api/pb/pb-list') ? true : false,
                'autoapn_enabled' : g_feature.autoapn_enabled == '1' ? true : false,
                'statistic_enabled' : g_moduleswitch.statistic_enabled == '1' ? true : false,
                'checklogin_enabled' : g_feature.login == '1' ? true : false,
                'help_enabled' : g_moduleswitch.help_enabled == '1' ? true : false,
                'ap_station_enabled' : g_feature.ap_station_enabled == '1' ? true : false,
                'multi_ssid_enabled' : g_moduleswitch.multssid_enable == '1' ? true : false,
                'dlna_enabled' : g_moduleswitch.dlna_enabled == '1' ? true : false,
                'stk_enabled' : g_moduleswitch.stk_enabled == '1' && isFirmwareSupportsModule('api/stk/stk-get-main') ? true : false,
                'ota_enabled' : g_moduleswitch.ota_enabled == '1' ? true : false,
                'wifioffload_enable' : g_moduleswitch.wifioffload_enabled == '1' ? true : false,
                'cradle_enabled' : g_moduleswitch.cradle_enabled == '1' ? true : false,
                'vpn_enabled': g_moduleswitch.vpn_enabled == '1' ? true : false,
                'ipv6_enabled' : g_moduleswitch.ipv6_enabled == '1' ? true : false,
                'monthly_volume_enabled' : g_moduleswitch.monthly_volume_enabled == '1' ? true : false,
                'powersave_enabled' :g_moduleswitch.powersave_enabled == '1' ? true : false,
                'fastboot_enabled' :g_moduleswitch.fastboot_enabled == '1' ? true : false,
                'sntp_enabled' :g_moduleswitch.sntp_enabled == '1' ? true : false,
                'dataswitch_enabled' :g_moduleswitch.dataswitch_enabled == '1' ? true : false,
                'poweroff_enabled':g_moduleswitch.poweroff_enabled == '1' ? true : false,
                'ddns_enabled' :g_moduleswitch.ddns_enabled == '1' ? true : false,
                'sambashare_enabled' :g_moduleswitch.sambashare_enabled == '1' ? true : false,
                'bridge_enabled' : g_moduleswitch.bridge_enabled == '1' ? true : false,
                'local_update_enabled' : g_moduleswitch.localupdate_enabled == '1' ? true : false,
                'fw_macfilter_enabled' :g_moduleswitch.fw_macfilter_enabled == '1' ? true : false,
                'diagnosis_enabled':g_moduleswitch.diagnosis_enabled == '1' ? true : false,
                'voip_enabled':g_moduleswitch.voip_enabled == '1' ? true : false,
                'vsim_enabled':g_moduleswitch.vsim_enabled == '1' ? true : false,
                'cbs_enabled':g_moduleswitch.cbs_enabled == '1' ? true : false,
                'bluetooth_enabled':g_moduleswitch.bluetooth_enabled == '1' ? true : false,
                'cs_enable':g_moduleswitch.cs_enable == '1' ? true : false
            };

            g_needHelp = g_module.help_enabled;
            g_sms_mode = g_moduleswitch.session_sms_enabled;
        }
    }, {
        sync: true
    });
    g_module.modsettings_enabled = false;
    $.ajax({
        type: "GET",
        url: "/modsettings.json",
        success: function(data, textStatus, jqXHR) {
            if (typeof(data.config) != 'undefined')
                g_module.modsettings_enabled = true;
        },
        dataType: "json",
        async: false
    });
    if(g_module.wifi_enabled) {
        getAjaxData('api/wlan/wifi-feature-switch', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_wifiFeatureSwitch = ret.response;
                g_wifi = {
                    'stawpsenabled' : g_wifiFeatureSwitch.stawpsenabled == '1' ? true : false
                };
            }
        }, {
            sync: true
        });
    }
    getAjaxData('api/device/usb-tethering-switch', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            g_USBtetheringSwitch = ret.response.tetheringswitch;
        }
    }, {
        sync: true
    });
    getConfigData('config/pcassistant/config.xml', function($xml) {
        g_assistant_ret =  xml2object($xml);
        g_module.assistant_enabled = g_assistant_ret.config.enable == '1' ? true : false;
    }, {
        sync: true
    });
}

/********************Function formatFloat*********************/
function formatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

/*************************Function for current connection time in connection
 * page******************************/
function getCurrentTime(time) {
    var final_time = '';
    var times = parseInt(time, 10);

    //format time like : 02:15:38

    var hours = parseInt((times / 3600), 10);
    if (hours > 9) {
        final_time += hours + ':';
    } else if (hours >= 0) {
        final_time += '0' + hours + ':';
    }

    times = times - hours * 3600;

    var minutes = parseInt(times / 60, 10);
    if (minutes > 9) {
        final_time += minutes + ':';
    } else if (minutes > 0) {
        final_time += '0' + minutes + ':';
    } else if (minutes == 0) {
        final_time += '00' + ':';
    }
    times = times - minutes * 60;

    //handle second display
    if (times > 9) {
        final_time += times;
    } else if (times > 0) {
        final_time += '0' + times;
    } else if (times == 0) {
        final_time += '00';
    }

    return final_time;
}

function getCurrentTimeArray(time) {
    var times_array = [];
    var times = parseInt(time, 10);
    var days = parseInt((times / 3600) / 24, 10);
    times_array.push(days);
    times = times - days * 3600 * 24;
    var hours = parseInt(times / 3600, 10);
    times_array.push(hours);
    times = times - hours * 3600;
    var minutes = parseInt(times / 60, 10);
    times_array.push(minutes);
    var secondes = times - minutes * 60;
    times_array.push(secondes);
    return times_array;
}

/****************************Function list (end)*******************/

function clickMenu(menu) {
    var getEls = $('.' + menu + ' li ');

    $.each(getEls, function(i) {
        $(this).click( function() {
            if(!$(this).is('[data-disabled="true"]')) {
                if ($(this).hasClass('sub') && $(this).hasClass('click')) {
                    $(this).removeClass('click');
                } else if ($(this).hasClass('nosub')) {
                    return true;
                } else {
                    $(getEls).removeClass('click');
                    $(this).addClass('click');
                }
            }
        });
        if ("menu_pb" != menu) {
            $(this).mouseover( function() {
                $(this).addClass('menu_hover');
            });
            $(this).mouseout( function() {
                $(this).removeClass('menu_hover');
            });
        }
    });
}

//Judgement if the profile can be edit
function button_enable(button_id, enable) {
    var my = $('#' + button_id);

    if (enable == '1') {
        my.removeClass('disable_btn');
        my.removeClass('button_dialog');
        my.removeClass('clr_gray_disable_btn_center');
        my.addClass('button_dialog');

    } else if (enable == '0') {
        my.removeClass('disable_btn');
        my.removeClass('clr_gray_disable_btn_center');
        my.removeClass('button_dialog');
        my.addClass('disable_btn');
        my.addClass('clr_gray_disable_btn_center');
    }
}

function allButton_enable(enable) {
    var my = $('.button_wrapper input');

    if (enable == '1') {
        my.removeClass('disable_btn');
        my.removeClass('button_dialog');
        my.removeClass('clr_gray_disable_btn_center');
        my.addClass('button_dialog');

    } else if (enable == '0') {
        my.removeClass('disable_btn');
        my.removeClass('clr_gray_disable_btn_center');
        my.removeClass('button_dialog');
        my.addClass('disable_btn');
        my.addClass('clr_gray_disable_btn_center');
    }

}

// refresh current page
function refresh() {
    window.location.reload();
}

// goto page without history
function gotoPageWithoutHistory(url) {
    log.debug('MAIN : gotoPageWithoutHistory(' + url + ')');
    window.location.replace(url);
}

// goto page with history
function gotoPageWithHistory(url) {
    log.debug('MAIN : gotoPageWithHistory(' + url + ')');
    window.location.href = url;
}

function showPasswordStrength(idOfTextbox) {
    var strengthBar = '<div class="pwd_strength"><table><tr><td style="color:red;">' + IDS_psw_strength_label + common_colon + '</td>';
    strengthBar += '<td><table class="pwd_strength_tb" border="0" cellpadding="0" cellspacing="0"><tr><td id="pwd_strength_low" width="33.3%" align="center">' + IDS_psw_strength_low + '</td>';
    strengthBar += '<td id="pwd_strength_mid" width="33.3%" align="center">' + IDS_psw_strength_mid + '</td>';
    strengthBar += '<td id="pwd_strength_hig" width="33.3%" align="center">' + IDS_psw_strength_hig + '</td></tr></table></td></tr></table></div>';
    $('#' + idOfTextbox).after(strengthBar);
}

function clearPasswordStrength() {
    $('.pwd_strength').remove();
}

function setPWDStrengthColor(PWStrength) {
    if(MACRO_PASSWORD_LOW == PWStrength) {
        $('#pwd_strength_low').css({
            "background-color": "red"
        });
        $('#pwd_strength_mid, #pwd_strength_hig').css({
            "background-color": "gray"
        });
    } else if(MACRO_PASSWORD_MID == PWStrength) {
        $('#pwd_strength_low, #pwd_strength_mid').css({
            "background-color": "orange"
        });
        $('#pwd_strength_hig').css({
            "background-color": "gray"
        });
    } else if(MACRO_PASSWORD_HIG == PWStrength) {
        $('#pwd_strength_low, #pwd_strength_mid, #pwd_strength_hig').css({
            "background-color": "green"
        });
    } else {
        $('#pwd_strength_low, #pwd_strength_mid, #pwd_strength_hig').css({
            "background-color": "gray"
        });
    }
}

function showErrorUnderTextbox(idOfTextbox, errormsg, label_id) {

    var errorLabel = '';
    if (label_id != null && label_id != '' && label_id != ' ') {
        errorLabel = "<div class='error_message'><label id='" + label_id + "'>" + errormsg + '</label><div>';
    } else {
        errorLabel = "<div class='error_message'><label>" + errormsg + '</label><div>';
    }
    if (0 == $('#' + idOfTextbox).parent().children('.error_message').length) {
        $('#' + idOfTextbox).after(errorLabel);
    }
}

function showErrorUnderTr(idOfTr, errormsg, label_id) {
    var errorLabel = '';
    if (label_id != null && label_id != '' && label_id != ' ') {
        errorLabel = "<tr class='error_message'><td></td><td colspan='2'><label id='" + label_id + "'>" + errormsg + '</label></td></tr>';
    } else {
        errorLabel = "<tr class='error_message'><td></td><td colspan='2'><label>" + errormsg + '</label></td></tr>';
    }
    $('#' + idOfTr).after(errorLabel);
}

function showErrorUnderTrEx(idOfTr, errormsg, label_id) {
    var errorLabel = '';
    if (label_id != null && label_id != '' && label_id != ' ') {
        errorLabel = "<tr class='error_message'><td></td><td colspan='2'><label id='" + label_id + "'>" + errormsg + '</label></td></tr>';
    } else {
        errorLabel = "<tr class='error_message'><td></td><td colspan='2'><label>" + errormsg + '</label></td></tr>';
    }
    $('#' + idOfTr).parent().parent().after(errorLabel);
}

function showPassword(id,check_id) {
    var cbValue = $('#' + check_id).attr('checked');
    var strType = cbValue ? 'text' : 'password';
    var tempStr = $('#' + id).val();
    $("<input id= " + id + " type='" + strType + "'  autocomplete='off' size='25'  maxlength='64' />").replaceAll($('#' + id));
    $('#' + id).val(tempStr);
}

var COMMON_PASSWORD_VALUE = '********';
var mousedownIndexList = [];
function checkPostIndex(index) {
    if (!(typeof(g_moduleswitch.encrypt_enabled) != 'undefined' && g_moduleswitch.encrypt_enabled == 1)) {
        return false;
    }
    var checkIndexFlag = false;
    $.each(mousedownIndexList, function(n, arrvalue) {
        if(arrvalue == index) {
            checkIndexFlag = true;
        }
    });
    if (checkIndexFlag) {
        return false;
    } else {
        return true;
    }
}

function clickPasswordEvent(id,index) {
    if (!(typeof(g_moduleswitch.encrypt_enabled) != 'undefined' && g_moduleswitch.encrypt_enabled == 1)) {
        return false;
    }
    $('#' + id).live("mousedown focusin click", function(event) {
        var checkmousedown = false;
        $.each(mousedownIndexList, function(n, arrvalue) {
            if(arrvalue == index) {
                checkmousedown = true;
            }
        });
        if (checkmousedown) {
            return;
        } else {
            mousedownIndexList.push(index);
        }
        if($('#' + id).val().length > 0) {
            $('#' + id).attr('value','');
        }
    });
}

function clearAllErrorLabel() {
    $('.error_message').remove();
}

function showWaitingDialog(tipTitle, tipContent, callback_func) {
    tipContent = display_SIMtoUIM(tipContent);
    $('#div_wrapper').remove();
    var tab = "<table colspacing='0' cellspacing='0' id='wait_table' class='wait_table'>" + "<tr><td><div class='wait_table_header'><label class='wait_title'>" + tipTitle + "</label><span class='wait_dialog_btn' id='wait_dialog_btn' ><canvas id='showWaitingCanvas' width='25px' height='25px'></canvas></span></div></td></tr>" + "<tr><td><div class='wait_table_content clr_bold'><div class='wait_wrapper'><div class='wait_image'><img src='../res/waiting.gif' alt=''/></div><div class='wait_str clr_bold'>" + tipContent + '</div></div></div></td></tr>' + "<tr><td><div class='wait_table_bottom'></div></td></tr>" + '</table>';
    var wait_div = "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>" + tab;
    $('body').append(wait_div);
    if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".wait_table_header").css({
            "width":"377px",
            "height":"26px"
        });
        $(".wait_table_header").corner("top 5px");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".wait_table_header span").append(ahtml);
    } else {
        var canvas = document.getElementById("showWaitingCanvas");
        draw(canvas);
    }
    reputPosition($('#wait_table'), $('#div_wrapper'));
    $('#wait_dialog_btn').bind('click', function() {
        closeWaitingDialog();
    });
    if (typeof (callback_func) == 'function') {
        callback_func();
    }
    disableTabKey();
}

//
function closeWaitingDialog(callback_func) {

    if ($('.info_dialog').size() == 0) {
        $('#div_wrapper').remove();
    }
    $('#wait_table').remove();
    enableTabKey();
    if (typeof (callback_func) == 'function') {
        callback_func();
    }
}

function getGMonitoringStatus() {
    if(G_MonitoringStatus != null) {
        return;
    } else {
        getAjaxData("api/monitoring/status", function($xml) {
            var gstatus_ret = xml2object($xml);
            if(gstatus_ret.type == "response") {
                G_MonitoringStatus = gstatus_ret;
            }
        }, {
            sync: true
        });
    }
}

/*********************** header ************************/
function getDeviceStatus() {
    log.debug('MAIN : getDeviceStatus()');
    if (g_is_login_opened) {
        return;
    }
    //First time of api/monitoring/status query was failing due to multiple quieries,, so added synchronous query
    if(firstTimeMontitoringStatusQuery == '0') {
        firstTimeMontitoringStatusQuery = '1';
        if($.browser.opera && ($.browser.version == '11.00')) {
            getAjaxData('api/monitoring/status', function($xml) {
                log.debug('MAIN : getDeviceStatus() get monitoring success');
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    G_MonitoringStatus = ret;
                    DATA_READY.statusReady = true;
                    execEachFunList();
                    getPlmn();
                    if(MACRO_NET_DUAL_MODE == g_net_mode_type) {
                        getMainNetMode();
                    }
                    getAjaxData('api/monitoring/check-notifications', function($xml) {
                        G_NotificationsStatus = null;
                        var ret = xml2object($xml);
                        if (ret.type == 'response') {
                            if (g_module.online_update_enabled && ret.response.OnlineUpdateStatus == 30 && g_needToLogin == '0') {
                                if (window.location.href.toLowerCase().indexOf('update.html') < 0) {
                                    window.location.href = 'update.html';
                                }
                            }
                            G_NotificationsStatus = ret.response;
                            showNotification();
                            DATA_READY.notificationsReady = true;
                            execEachFunList();
                        }
                    });
                }
            });
        } else {
            getAjaxData('api/monitoring/status', function($xml) {
                log.debug('MAIN : getDeviceStatus() get monitoring success');
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    G_MonitoringStatus = ret;
                    DATA_READY.statusReady = true;
                    execEachFunList();
                    getPlmn();
                    if(MACRO_NET_DUAL_MODE == g_net_mode_type) {
                        getMainNetMode();
                    }
                    getAjaxData('api/monitoring/check-notifications', function($xml) {
                        G_NotificationsStatus = null;
                        var ret = xml2object($xml);
                        if (ret.type == 'response') {
                            if (g_module.online_update_enabled && ret.response.OnlineUpdateStatus == 30 && g_needToLogin == '0') {
                                if (window.location.href.toLowerCase().indexOf('update.html') < 0) {
                                    window.location.href = 'update.html';
                                }
                            }
                            G_NotificationsStatus = ret.response;
                            showNotification();
                            DATA_READY.notificationsReady = true;
                            execEachFunList();
                        }
                    });
                }
            }, {
                sync: true
            });
        }

    } else {
        getAjaxData('api/monitoring/status', function($xml) {
            log.debug('MAIN : getDeviceStatus() get monitoring success');
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                G_MonitoringStatus = ret;
                DATA_READY.statusReady = true;
                execEachFunList();
                getPlmn();
                if(MACRO_NET_DUAL_MODE == g_net_mode_type) {
                    getMainNetMode();
                }
                getAjaxData('api/monitoring/check-notifications', function($xml) {
                    G_NotificationsStatus = null;
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        if (g_module.online_update_enabled && ret.response.OnlineUpdateStatus == 30 && g_needToLogin == '0') {
                            if (window.location.href.toLowerCase().indexOf('update.html') < 0) {
                                window.location.href = 'update.html';
                            }
                        }
                        G_NotificationsStatus = ret.response;
                        showNotification();
                        DATA_READY.notificationsReady = true;
                        execEachFunList();
                    }
                });
            }
        });
    }
    if (g_module.wifioffload_enable) {
        getAjaxData('api/wlan/station-information', function($xml) {
            var ret = xml2object($xml);
            G_StationStatus = ret;
            if (G_StationStatus.type == 'response') {
                if (g_stationInfo != '' && G_StationStatus.response.NetworkName == g_stationInfo.response.NetworkName && G_StationStatus.response.CurrentSecMode == g_stationInfo.response.CurrentSecMode) {
                    if (G_MonitoringStatus != null && G_MonitoringStatus.type == 'response') {
                        if (g_wifiStatusInfo == G_MonitoringStatus.response.WifiConnectionStatus) {
                            g_stationInfoFlag = true;
                        } else {
                            g_wifiStatusInfo = G_MonitoringStatus.response.WifiConnectionStatus;
                        }
                    }
                }
                g_stationInfo = ret;
            }
            DATA_READY.apStationReady = true;
            execEachFunList();
        });
    }

    if (g_module.cradle_enabled) {
        getAjaxData('api/cradle/status-info', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                G_cradleStationStatus = ret.response;
            }
            DATA_READY.cradleReady = true;
            execEachFunList();
        });
    } else {
        $('#ethernet_connection').remove();
        $('#only_ethernet_connection').remove();
    }

    var strUrl = 'api/wlan/basic-settings';
    if (g_module.multi_ssid_enabled) {
        strUrl = 'api/wlan/multi-security-settings';
    }

    if(g_module.wifi_enabled && typeof(g_wifiFeatureSwitch) != 'undefined' && WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled) {
        getAjaxData(strUrl, function($xml) {
            var ret = xml2object($xml);
            if (ret.type != 'response') {
                return;
            }
            g_wlanInfo = ret.response;
        });
    }

    function execEachFunList() {
        if ((g_module.cradle_enabled && false == DATA_READY.cradleReady)||(g_module.wifioffload_enable && false == DATA_READY.apStationReady) || false == DATA_READY.statusReady || false == DATA_READY.notificationsReady) {
            return;
        }
        log.debug('MAIN : execFunList()');
        execFunList();
        DATA_READY.statusReady = false;
        DATA_READY.notificationsReady = false;
        DATA_READY.apStationReady = false;
        DATA_READY.cradleReady = false;
    }

    function execFunList() {
        alreadyStatusListnerExecuted = '1';
        $.each(STATUS_LISTENER_FUN_LIST, function(n, value) {
            log.debug('MAIN : execFunList() execute ' + value);
            eval(value);
        });
    }

    g_decive_timer = setTimeout(getDeviceStatus, g_feature.update_interval);
}

function getPlmn() {
    function isValidType(inputType,defaultType) {
        if(typeof(inputType) == 'undefined' || inputType == '' || inputType == ' ') {
            return defaultType;
        } else {
            return inputType;
        }
    }

    g_plmn_rat = "";
    if(G_MonitoringStatus.response.ServiceStatus == SERVICE_STATUS_AVAIABLE) {
        if (typeof(G_MonitoringStatus.response.CurrentNetworkTypeEx) != 'undefined' &&
        G_MonitoringStatus.response.CurrentNetworkTypeEx != '') {
            switch(G_MonitoringStatus.response.CurrentNetworkTypeEx) {
                case MACRO_NET_WORK_TYPE_EX_GSM:
                /*GSM模式*/
                case MACRO_NET_WORK_TYPE_EX_GPRS:
                /*GPRS模式*/
                case MACRO_NET_WORK_TYPE_EX_EDGE:
                /*EDGE模式*/
                case MACRO_NET_WORK_TYPE_EX_IS95A:
                case MACRO_NET_WORK_TYPE_EX_IS95B:
                case MACRO_NET_WORK_TYPE_EX_CDMA_1x:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_CDMA_1x:
                    g_plmn_rat = isValidType(g_networktype[parseInt(G_MonitoringStatus.response.CurrentNetworkTypeEx,10)],plmn_label_2g);
                    break;
                case MACRO_NET_WORK_TYPE_EX_EVDO_REV_0:
                case MACRO_NET_WORK_TYPE_EX_EVDO_REV_A:
                case MACRO_NET_WORK_TYPE_EX_EVDO_REV_B:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B:
                case MACRO_NET_WORK_TYPE_EX_EHRPD_REL_0:
                case MACRO_NET_WORK_TYPE_EX_EHRPD_REL_A:
                case MACRO_NET_WORK_TYPE_EX_EHRPD_REL_B:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_0:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_A:
                case MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_B:
                case MACRO_NET_WORK_TYPE_EX_WCDMA:
                case MACRO_NET_WORK_TYPE_EX_HSDPA:
                case MACRO_NET_WORK_TYPE_EX_HSUPA:
                case MACRO_NET_WORK_TYPE_EX_HSPA:
                case MACRO_NET_WORK_TYPE_EX_HSPA_PLUS:
                case MACRO_NET_WORK_TYPE_EX_DC_HSPA_PLUS:
                case MACRO_NET_WORK_TYPE_EX_TD_SCDMA:
                case MACRO_NET_WORK_TYPE_EX_TD_HSDPA:
                case MACRO_NET_WORK_TYPE_EX_TD_HSUPA:
                case MACRO_NET_WORK_TYPE_EX_TD_HSPA:
                case MACRO_NET_WORK_TYPE_EX_TD_HSPA_PLUS:
                    g_plmn_rat = isValidType(g_networktype[parseInt(G_MonitoringStatus.response.CurrentNetworkTypeEx,10)],plmn_label_3g);
                    break;
                case MACRO_NET_WORK_TYPE_EX_LTE:
                    g_plmn_rat = isValidType(g_networktype[parseInt(G_MonitoringStatus.response.CurrentNetworkTypeEx,10)],plmn_label_4g);
                    break;
                default:
                    break;
            }
        } else {
            switch(G_MonitoringStatus.response.CurrentNetworkType) {
                case MACRO_NET_WORK_TYPE_GSM:
                /*GSM模式*/
                case MACRO_NET_WORK_TYPE_GPRS:
                /*GPRS模式*/
                case MACRO_NET_WORK_TYPE_EDGE:
                /*EDGE模式*/
                case MACRO_NET_WORK_TYPE_1xRTT:
                case MACRO_NET_WORK_TYPE_1xEVDV:
                    g_plmn_rat = isValidType(g_networktype[parseInt(G_MonitoringStatus.response.CurrentNetworkType,10)],plmn_label_2g);
                    break;
                case MACRO_NET_WORK_TYPE_WCDMA:
                case MACRO_NET_WORK_TYPE_TDSCDMA:
                case MACRO_NET_WORK_TYPE_EVDO_REV_0:
                case MACRO_NET_WORK_TYPE_EVDO_REV_A:
                case MACRO_NET_WORK_TYPE_EVDO_REV_B:
                case MACRO_NET_WORK_TYPE_HSDPA:
                case MACRO_NET_WORK_TYPE_HSUPA:
                case MACRO_NET_WORK_TYPE_HSPA:
                case MACRO_NET_WORK_TYPE_HSPA_PLUS:
                case MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM:
                case MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO:
                    g_plmn_rat = isValidType(g_networktype[parseInt(G_MonitoringStatus.response.CurrentNetworkType,10)],plmn_label_3g);
                    break;
                case MACRO_NET_WORK_TYPE_LTE:
                    g_plmn_rat = isValidType(g_networktype[parseInt(G_MonitoringStatus.response.CurrentNetworkType,10)],plmn_label_4g);
                    break;
                default:
                    break;
            }
        }
    }
    if(g_plmn_rat == "" || typeof(g_plmn_rat) == 'undefined') {
        g_net_mode = dialup_label_no_service;
    } else {
        g_net_mode = g_plmn_rat;
    }
    return g_plmn_rat;
}

function getMainNetMode() {
    var newNetMode = null;
    if (typeof(G_MonitoringStatus.response.CurrentNetworkTypeEx) != 'undefined' &&
    G_MonitoringStatus.response.CurrentNetworkTypeEx != '') {
        switch(G_MonitoringStatus.response.CurrentNetworkTypeEx) {
            case MACRO_NET_WORK_TYPE_EX_IS95A:
            case MACRO_NET_WORK_TYPE_EX_IS95B:
            case MACRO_NET_WORK_TYPE_EX_CDMA_1x:
            case MACRO_NET_WORK_TYPE_EX_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EX_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EX_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_CDMA_1x:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_EX_EHRPD_REL_0:
            case MACRO_NET_WORK_TYPE_EX_EHRPD_REL_A:
            case MACRO_NET_WORK_TYPE_EX_EHRPD_REL_B:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_0:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_A:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_B:
                newNetMode = MACRO_NET_MODE_C;
                break;
            case MACRO_NET_WORK_TYPE_EX_GSM:
            case MACRO_NET_WORK_TYPE_EX_GPRS:
            case MACRO_NET_WORK_TYPE_EX_EDGE:
            case MACRO_NET_WORK_TYPE_EX_WCDMA:
            case MACRO_NET_WORK_TYPE_EX_HSDPA:
            case MACRO_NET_WORK_TYPE_EX_HSUPA:
            case MACRO_NET_WORK_TYPE_EX_HSPA:
            case MACRO_NET_WORK_TYPE_EX_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_EX_DC_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_EX_TD_SCDMA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSDPA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSUPA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSPA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_EX_LTE:
                newNetMode = MACRO_NET_MODE_W;
                break;
            default:
                break;
        }
    } else {
        switch(G_MonitoringStatus.response.CurrentNetworkType) {
            case MACRO_NET_WORK_TYPE_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_1xRTT:
            case MACRO_NET_WORK_TYPE_UMB:
            case MACRO_NET_WORK_TYPE_1xEVDV:
            case MACRO_NET_WORK_TYPE_3xRTT:
                newNetMode = MACRO_NET_MODE_C;
                break;
            case MACRO_NET_WORK_TYPE_GSM:
            case MACRO_NET_WORK_TYPE_GPRS:
            case MACRO_NET_WORK_TYPE_EDGE:
            case MACRO_NET_WORK_TYPE_WCDMA:
            case MACRO_NET_WORK_TYPE_HSDPA:
            case MACRO_NET_WORK_TYPE_HSUPA:
            case MACRO_NET_WORK_TYPE_HSPA:
            case MACRO_NET_WORK_TYPE_TDSCDMA:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO:
            case MACRO_NET_WORK_TYPE_LTE:
                newNetMode = MACRO_NET_MODE_W;
                break;
            default:
                break;
        }
    }

    if(newNetMode != null) {
        if(g_net_mode_status != newNetMode) {
            if(g_net_mode_status == MACRO_NET_MODE_W || g_net_mode_status == MACRO_NET_MODE_C) {
                if(!g_judgeApplyFlag) {
                    showInfoDialog(IDS_common_netmode_change);
                } else {
                    g_judgeApplyFlag = false;
                }
            }
            g_net_mode_status = newNetMode;
            g_net_mode_change = MACRO_NET_MODE_CHANGE;
        }
    }
}

function resetNetModeChange() {
    g_net_mode_change = MACRO_NET_MODE_RESET;
}

function checkOffloadEnabled() {
    if(!checkValueIsNull(G_cradleStationStatus)) {
        setTimeout(checkOffloadEnabled, 50);
        return;
    }
    if(g_module.cradle_enabled && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE != G_cradleStationStatus.connectionmode &&  (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        var offload_disabled_start = IDS_function_disabled.replace('%s1','cradle');
        var offload_disabled = offload_disabled_start.replace('%s2','offload');
        showInfoDialog(offload_disabled, false, disableEntirePage);
    }
}

function checkValueIsNull(value) {
    if(value == null || typeof(value) == 'undefined') {
        return false;
    } else {
        return true;
    }
}

function initialStatusIcon() {
    var corner = '';
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
        corner = {
            tooltip: 'topLeft',
            target: 'bottomCenter'
        };
    } else {
        corner = {
            tooltip: 'topRight',
            target: 'bottomCenter'
        };

    }
    addStatusListener('getIconStatus()');
    // First time of Status listner execution, getIconStatus() was missing, if SIM is not inserted.
    // So executing getIconStatus() if already Status listner is executed
    if(alreadyStatusListnerExecuted == '1') {
        getIconStatus();
    }

    if (g_module.sms_enabled) {
        $('#tooltip_sms').qtip({
            content: '<b>' + STATUS_BAR_ICON_STATUS.unread_sms_tooltip_state + '</b>',
            position: {
                corner:corner
            },
            style: {
                name: 'sms'
            }
        });
    }
    if (g_module.online_update_enabled) {
        $('#tooltip_update').qtip({
            content: '<b>' + common_new_version + '</b>',
            position: {
                corner:corner
            },
            style: {
                name: 'upd'
            }
        });
    }

    $('#sim_signal_gif').qtip({
        content: '<b style = "word-break:break-all;">' + STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            width: 130 ,
            name: 'sim'
        }
    });

    $('#wan_gif').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.wan_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'wan'
        }
    });

    $('#wifi_gif').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.wifi_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'wifi'
        }
    });

    $('#battery_gif').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.battery_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'battery'
        }
    });

    //tooltip_sms_full
    $('#tooltip_sms_full').qtip({
        content: '<b>' + sms_message_full + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'sms_full'
        }
    });

    $('#station_gif').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.station_tooltip_state + '</b>',
        position: {
            corner:corner
        },
        style: {
            name: 'station'
        }
    });

    $('#indoor_gif').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.wifi_indoor_tooltip_state + '</b>',
        position: {
            corner:corner
        },
        style: {
            name: 'indoor'
        }
    });

}

function refreshSimcardStatus() {
    getAjaxData('api/monitoring/converged-status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_main_convergedStatus = ret.response;
        }
    });
    g_simcard_timer = setTimeout(refreshSimcardStatus, SIMCARD_STATUS_REFRESH);
}

function qtps_signal() {
    var current_qtps_signal = "";
    var rssi = "";
    var sinr = "";
    var rsrp = "";
    var rsrq = "";
    var rscp = "";
    var ecio = "";
    getAjaxData('api/device/signal', function($xml) {
    	var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (ret.response.rssi != undefined)
    	        rssi = ret.response.rssi;
            if (ret.response.rsrp != undefined)
    	        rsrp = ret.response.rsrp;
            if (ret.response.rsrq != undefined)
                rsrq = ret.response.rsrq;
            if (ret.response.sinr != undefined)
                sinr = ret.response.sinr;
            if (ret.response.rscp != undefined)
                rscp = ret.response.rscp;
            if (ret.response.ecio != undefined)
                ecio = ret.response.ecio;
        }
    }, {
    	sync: true
    });
    if (rssi == "") {
        getAjaxData('api/net/signal-para', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response' && ret.response.Rssi != undefined)
                rssi = ret.response.Rssi;
        }, {
            sync: true
        });
    }
    if (rssi == "") {
        getConfigData('config/deviceinformation/add_param.xml', function($xml) {
            var ret = xml2object($xml);
        if (ret.config.rssi != undefined) {
            rssi = ret.config.rssi;
    	    if (rssi != "")
                rssi += "dBm";
        }
        }, {
            sync: true
        });
    }
    current_qtps_signal = "RSSI: " + (rssi != "" ? rssi : common_unknown);
    if (rsrp != "")
        current_qtps_signal += "\nRSRP: " + rsrp;
    if (rsrq != "")
        current_qtps_signal += "\nRSRQ : " + rsrq;
    if (sinr != "")
        current_qtps_signal += "\nSINR: " + sinr;
    if (rscp != "")
        current_qtps_signal += "\nRSCP: " + rscp;
    if (ecio != "")
        current_qtps_signal += "\nEc/Io: " + ecio;
    return current_qtps_signal;
}

function getIconStatus() {
    alreadyStatusListnerExecuted = '0';
    var g_connection_status = "0";
    var header_ret = G_MonitoringStatus;
    var station_ret = G_StationStatus;
    var g_cradle_change_status = '0';
    if (header_ret != null && header_ret.type == 'response') {
        header_icon_status.ConnectionStatus = header_ret.response.ConnectionStatus;

        if (g_module.cradle_enabled && checkValueIsNull(G_cradleStationStatus) && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus
        && ETHERNET_LAN_MODE != G_cradleStationStatus.connectionmode && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
            var cradle_ret = G_cradleStationStatus;
            header_icon_status.ConnectionStatus = G_cradleStationStatus.connectstatus;
        }
        /*if (header_ret.response.SignalStrength == 0) {
         header_icon_status.SignalStrength = 0;
         }
         else {
         var temp = parseInt(header_ret.response.SignalStrength, 10) / 20;
         header_icon_status.SignalStrength = (temp == 0) ? "1" : temp.toString();
         }*/

        if (typeof(header_ret.response.SignalIcon) != 'undefined' ||
        header_ret.response.SignalIcon != null) {
            header_icon_status.SignalStrength = header_ret.response.SignalIcon;
        } else {
            header_icon_status.SignalStrength = parseInt(header_ret.response.SignalStrength / 20, 10).toString();
        }

        header_icon_status.BatteryStatus = header_ret.response.BatteryStatus;
        header_icon_status.BatteryLevel = header_ret.response.BatteryLevel;
        header_icon_status.BatteryPercent = header_ret.response.BatteryPercent;
        header_icon_status.SimStatus = header_ret.response.SimStatus;
        header_icon_status.WifiStatus = header_ret.response.WifiStatus;

        if (typeof(header_ret.response.CurrentNetworkTypeEx) != 'undefined' &&
        header_ret.response.CurrentNetworkTypeEx != '') {
            header_icon_status.CurrentNetworkType = header_ret.response.CurrentNetworkTypeEx;
        } else {
            header_icon_status.CurrentNetworkType = header_ret.response.CurrentNetworkType;
        }
        //Battery Status
        if( ( $.browser.msie && ($.browser.version == '6.0')) || (g_BatteryStatus != header_icon_status.BatteryStatus)||(g_BatteryLevel != header_icon_status.BatteryLevel)||((g_coulometer_status == '1')&&(g_BatteryPercent != header_icon_status.BatteryPercent))) {
            if(g_BatteryStatus != header_icon_status.BatteryStatus ) {
                if(g_coulometer_status == '1') {
                    g_coulometer_BatteryStatus = null;
                    g_BatteryLevel = header_icon_status.BatteryLevel;
                } else {
                    g_BatteryLevel = null;
                }
                g_BatteryStatus = header_icon_status.BatteryStatus;
            }
            switch (header_icon_status.BatteryStatus) {
                case MACRO_BATTERY_STATUS_NORMAL:
                    if(g_coulometer_status == '1' && (g_BatteryPercent != header_icon_status.BatteryPercent || g_coulometer_BatteryStatus != header_icon_status.BatteryStatus)) {
                        g_BatteryPercent = header_icon_status.BatteryPercent;
                        g_coulometer_BatteryStatus = header_icon_status.BatteryStatus;
                        getBatteryLevel(header_icon_status.BatteryPercent);
                    } else if(( $.browser.msie && ($.browser.version == '6.0')) || g_BatteryLevel!=header_icon_status.BatteryLevel) {
                        g_BatteryLevel = header_icon_status.BatteryLevel;
                        getBatteryLevel(header_icon_status.BatteryLevel);
                    }
                    $('#battery_gif').show();
                    break;
                case MACRO_BATTERY_STATUS_LOW:
                    if(g_coulometer_status == '1') {
                        STATUS_BAR_ICON_STATUS.battery_tooltip_state = header_icon_status.BatteryPercent + '%';
                    } else {
                        STATUS_BAR_ICON_STATUS.battery_tooltip_state = battery_prower_low;
                    }
                    if (null != g_lastBatteryStatus && MACRO_BATTERY_STATUS_LOW == g_lastBatteryStatus) {
                        break;
                    }
                    $('#battery_gif').html("<img   src = '../res/battery_low.gif'  />");
                    $('#battery_gif').show();
                    break;
                case MACRO_BATTERY_STATUS_ELECT:
                    if(g_coulometer_status == '1') {
                        STATUS_BAR_ICON_STATUS.battery_tooltip_state = header_icon_status.BatteryPercent + '%';
                    } else {
                        STATUS_BAR_ICON_STATUS.battery_tooltip_state = battery_recharging;
                    }
                    if (null != g_lastBatteryStatus && MACRO_BATTERY_STATUS_ELECT == g_lastBatteryStatus) {
                        break;
                    }
                    $('#battery_gif').html("<img   src = '../res/battery_elect.gif' />");
                    $('#battery_gif').show();
                    break;
                case MACRO_BATTERY_STATUS_NOBATTERY:
                    $('#battery_gif').hide();
                    STATUS_BAR_ICON_STATUS.battery_tooltip_state = "";
                    break;
                default:
                    $('#battery_gif').show();
                    if(g_coulometer_status == '1') {
                        getBatteryLevel(header_icon_status.BatteryPercent);
                    } else {
                        STATUS_BAR_ICON_STATUS.battery_tooltip_state = common_battery;
                        $('#battery_gif').html("<img   src = '../res/battery_low.gif'  />");
                    }
                    break;
            }
            g_lastBatteryStatus = header_icon_status.BatteryStatus;
        }

        //WiFi Status
        if( ( $.browser.msie && ($.browser.version == '6.0')) || g_WifiStatus!=header_icon_status.WifiStatus) {
            g_WifiStatus = header_icon_status.WifiStatus;
            switch (header_icon_status.WifiStatus) {
                case MACRO_WIFI_OFF:
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)' src = '../res/wifi_" + MACRO_WIFI_OFF + ".png' 0 0 no-repeat>");
                    STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_off;
                    break;
                case MACRO_WIFI_ON:
                    if(typeof(G_MonitoringStatus.response.wififrequence)!=undefined) {
                        if((typeof(g_wifiFeatureSwitch) != 'undefined' )&&(WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled) &&(G_MonitoringStatus.response.wififrequence==WIFI5G_ON)) {
                            $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                        } else {
                            $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                        }
                    } else {
                        if((typeof(g_wifiFeatureSwitch) != 'undefined')&&(WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled) &&(g_wlanInfo.WifiMode=="a/n")) {
                            $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                        } else {
                            $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                        }
                    }
                    STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_on;
                    break;
                default:
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)' src = '../res/wifi_" + MACRO_WIFI_OFF + ".png' 0 0 no-repeat>");
                    STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_off;
                    break;
            }
        }
        if (g_WifiStatus == header_icon_status.WifiStatus  && MACRO_WIFI_ON == header_icon_status.WifiStatus) {
            if(typeof(G_MonitoringStatus.response.wififrequence) != 'undefined') {
                if((wifi5g_icon_flag == '-1') && (typeof(g_wifiFeatureSwitch) != 'undefined')&&(WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled) && (G_MonitoringStatus.response.wififrequence==WIFI5G_ON)) {
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                    wifi5g_icon_flag = 0;
                    wifion_icon_flag = -1;
                } else if ((wifion_icon_flag == '-1') && !((typeof(g_wifiFeatureSwitch) != 'undefined')&&(WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled)&&(G_MonitoringStatus.response.wififrequence==WIFI5G_ON))) {
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                    wifion_icon_flag = 0;
                    wifi5g_icon_flag = -1;
                }
            } else {
                if( (wifi5g_icon_flag == '-1') && (typeof(g_wifiFeatureSwitch) != 'undefined')&& (WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled)&&(g_wlanInfo.WifiMode=="a/n")) {
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                    wifi5g_icon_flag = 0;
                    wifion_icon_flag = -1;
                } else if (wifion_icon_flag == '-1' && !((typeof(g_wifiFeatureSwitch) != 'undefined')&&(WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled)&&(g_wlanInfo.WifiMode=="a/n"))) {
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_" + MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                    wifion_icon_flag = 0;
                    wifi5g_icon_flag = -1;
                }
            }
            STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_on;
        }

        //wifi indoor
        if( WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled && typeof(header_ret.response.wifiindooronly) != 'undefined') {
            if(g_WifiIndoorStatus != header_ret.response.wifiindooronly || ( $.browser.msie && ($.browser.version == '6.0'))) {
                g_WifiIndoorStatus = header_ret.response.wifiindooronly;
                if(1 == header_ret.response.wifiindooronly) {

                    $('#indoor_gif').html("<img onload = 'fixPNG(this)'  src = '../res/wifi_indoor.png' 0 0 no-repeat>");
                    STATUS_BAR_ICON_STATUS.wifi_indoor_tooltip_state = wlan_label_5gWifi_indoor;
                    $('#indoor_gif').show();
                } else {
                    $('#indoor_gif').hide();
                }
            }
        } else {
            $('#indoor_gif').hide();
        }

        //sim card or signal Status
        if((g_SimStatus != g_main_convergedStatus.SimState)||(g_hSimStatus != header_icon_status.SimStatus)) {
            g_SimStatus = g_main_convergedStatus.SimState;
            g_hSimStatus = header_icon_status.SimStatus;
            sign_enable = 0;
            if (MACRO_PIN_REQUIRED == g_main_convergedStatus.SimState) {
                $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/sim_disable" + (webui_mode == 'old' ? ".old" : "") + ".png' 0 0 no-repeat>");
                if(webui_mode() == 'old')
                    $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                $('#new_nav_signal_text').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                $('#status_img2').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_pin_code_required;
            } else if (MACRO_PUK_REQUIRED == g_main_convergedStatus.SimState) {
                if (PUK_TIMES_ZERO == g_pin_status_SimPukTimes) {
                    $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/sim_disable" + (webui_mode == 'old' ? ".old" : "") + ".png' 0 0 no-repeat>");
                    if(webui_mode == 'old')
                        $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                    $('#new_nav_signal_text').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                    $('#status_img2').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_help_puk_locked;
                } else {
                    $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/sim_disable" + (webui_mode == 'old' ? ".old" : "") + ".png' 0 0 no-repeat>");
                    if(webui_mode == 'old')
                        $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                    $('#new_nav_signal_text').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                    $('#status_img2').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_puk_code_required;
                }
            } else if ((MACRO_SIM_STATUS_USIM_N == header_icon_status.SimStatus) || (MACRO_SIM_STATUS_USIM_NE == header_icon_status.SimStatus)) {
                $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/sim_disable" + (webui_mode == 'old' ? ".old" : "") + ".png' 0 0 no-repeat>");
                if(webui_mode == 'old')
                    $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                $('#new_nav_signal_text').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                $('#status_img2').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_sim_invalid;
            } else if ('undefined' == header_icon_status.SimStatus) {
                $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/sim_disable" + (webui_mode == 'old' ? ".old" : "") + ".png' 0 0 no-repeat>");
                if(webui_mode == 'old')
                    $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                $('#new_nav_signal_text').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                $('#status_img2').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_sim_invalid;
            } else if (header_icon_status.SimlockStatus) {
                $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/sim_disable" + (webui_mode == 'old' ? ".old" : "") + ".png' 0 0 no-repeat>");
                if(webui_mode == 'old')
                    $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                $('#new_nav_signal_text').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                $('#status_img2').text(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_sim_invalid;
            } else {
                sign_enable = 1;
            }
        }

        if(sign_enable) {
	    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = qtps_signal();
	    //STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = g_net_mode;
            if(($.browser.msie && ($.browser.version == '6.0')) || g_SignalStrength!=header_icon_status.SignalStrength && (SIMCARD_OK == sign_enable) ) {
                //sign_enable is used to handle simcard status change with same signal.
                g_SignalStrength = header_icon_status.SignalStrength;
                switch (header_icon_status.SignalStrength) {
                    case MACRO_EVDO_LEVEL_ONE:
                    case MACRO_EVDO_LEVEL_TWO:
                    case MACRO_EVDO_LEVEL_THREE:
                        $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/signal_" + header_icon_status.SignalStrength + (webui_mode == 'old' ? ".old" : "") + ".png'0 0 no-repeat>");
                        if(webui_mode == 'old')
                            $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                        $('#new_nav_signal_text').text(g_net_mode);
                        $('#status_img2').text(g_net_mode);
                        break;

                    case MACRO_EVDO_LEVEL_FOUR:
                    case MACRO_EVDO_LEVEL_FIVE:
                        $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/signal_" + header_icon_status.SignalStrength + (webui_mode == 'old' ? ".old" : "") + ".png'0 0 no-repeat>");
                        if(webui_mode == 'old')
                            $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                        $('#new_nav_signal_text').text(g_net_mode);
                        $('#status_img2').text(g_net_mode);
                        break;
                    default:
                        $('#sim_signal_gif').html("<img " + (webui_mode == 'old' ? "style = 'width: auto !important;height: auto !important;margin: 0 !important;'" : "") + " onload = 'fixPNG(this)' src = '../res/signal_" + MACRO_EVDO_LEVEL_ZERO + (webui_mode == 'old' ? ".old" : "") + ".png'0 0 no-repeat>");
                        if(webui_mode == 'old')
                            $('#sim_signal_gif').attr('style', 'width: 36px !important;');
                        $('#new_nav_signal_text').text(g_net_mode);
                        $('#status_img2').text(g_net_mode);
                        break;
                }
            }
            if(g_module.local_update_enabled) {
                $('#menu_update a').attr("href","update.html");
            }
        } else {
            if(g_module.local_update_enabled &&
            !((G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED)||
            (g_module.cradle_enabled && checkValueIsNull(G_cradleStationStatus) && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus &&
            G_cradleStationStatus.connectionmode != ETHERNET_LAN_MODE &&
            (G_cradleStationStatus.connectstatus != CRADLE_CONNECTSTATUSNULL &&
            G_cradleStationStatus.connectstatus != CRANDLE_CONNECTSTATUSERRO)))) {
                $('#menu_update a').attr("href","update_local.html");
                if(g_not_need_login_update) {
                    $('#menu_update a').live('click', function() {
                        if (!g_needToLogin) {
                            return;
                        }
                        g_nav = $(this);
                        if(g_nav.parent().attr("id") == "menu_connection_settings" || g_nav.parent().attr("id") == "profile_settings") {
                            g_nav = g_nav.parent();
                        }
                        getAjaxData('api/user/state-login', function($xml) {
                            var ret = xml2object($xml);
                            if (ret.type == 'response') {
                                if (ret.response.State != '0') {
                                    if('undefined' != typeof(ret.response.firstlogin)) {
                                        g_default_password_status = parseInt(ret.response.firstlogin,10);
                                    }
                                    if(g_default_password_status == 0) {
                                        g_destnation = null;
                                    } else {
                                        g_destnation = 'update_local.html';
                                    }
                                    $('#update').attr('href', 'javascript:void(0);');
                                    showloginDialog();
                                }
                            }
                        }, {
                            sync: true
                        });
                    });
                }
            }
        }
    }

    //update Status
    if (g_module.online_update_enabled) {
        if(g_NotificationsOnlineUpdateStatus!=G_NotificationsStatus.OnlineUpdateStatus) {
            g_NotificationsOnlineUpdateStatus = G_NotificationsStatus.OnlineUpdateStatus;
            if (G_NotificationsStatus.OnlineUpdateStatus == MACRO_NEWVERSIONFOUND || G_NotificationsStatus.OnlineUpdateStatus == MACRO_READYTOUPDATE) {
                $('#update_gif').css({
                    'display' : 'block'
                });
                $('#tooltip_update').html("<img src = '../res/update_enable.gif'>");
            } else {
                $('#update_gif').css({
                    'display' : 'none'
                });
                $('#tooltip_update').html("<img src = '../res/update_disable.gif'>");
            }
        }
    }

    function ap_station_disabled() {
        //$("#station_gif").hide();
        switch (header_icon_status.ConnectionStatus) {
            case MACRO_CONNECTION_CONNECTED:
                g_connection_status = "1";
                var CurrentUpload = '';
                var CurrentDownload = '';
                if(( $.browser.msie && ($.browser.version == '6.0')) || $("#wan_gif").html().indexOf("wan_disable.png")<0) {
                    STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                }
                $('#wan_gif').show();
                getAjaxData('api/monitoring/traffic-statistics', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        CurrentUpload = ret.response.CurrentUpload;
                        CurrentDownload = ret.response.CurrentDownload;
                        if((wanUpload != '')&&(wanUpload != null) && (wanDownload != '')&&(wanDownload != null)) {
                            if((wanUpload != CurrentUpload) && (CurrentDownload == wanDownload)) {
                                if(g_up_connection_status == "0") {
                                    $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_up.png' 0 0 no-repeat>");
                                    g_disable_connection_status = "0";
                                    g_up_down_connection_status = "0";
                                    g_up_connection_status = "1";
                                    g_down_connection_status = "0";
                                }
                                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                            } else if((wanUpload == CurrentUpload) && (CurrentDownload != wanDownload)) {
                                if(g_down_connection_status == "0") {
                                    $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_down.png' 0 0 no-repeat>");
                                    g_disable_connection_status = "0";
                                    g_up_down_connection_status = "0";
                                    g_up_connection_status = "0";
                                    g_down_connection_status = "1";
                                }
                                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                            } else if((wanUpload != CurrentUpload) && (CurrentDownload != wanDownload)) {
                                if(g_up_down_connection_status == "0") {
                                    $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_up_down.png' 0 0 no-repeat>");
                                    g_disable_connection_status = "0";
                                    g_up_down_connection_status = "1";
                                    g_up_connection_status = "0";
                                    g_down_connection_status = "0";
                                }
                                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;

                            } else if((wanUpload == CurrentUpload) && (CurrentDownload == wanDownload)) {
                                if(g_disable_connection_status == "0") {
                                    $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_disable.png' 0 0 no-repeat>");
                                    g_disable_connection_status = "1";
                                    g_up_connection_status = "0";
                                    g_down_connection_status = "0";
                                    g_up_down_connection_status = "0";
                                }
                            }
                            wanUpload = CurrentUpload;
                            wanDownload = CurrentDownload;
                        } else {
                            if(g_disable_connection_status == "0") {
                                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_disable.png' 0 0 no-repeat>");
                                g_disable_connection_status = "1";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                                g_up_down_connection_status = "0";
                            }
                            wanUpload = CurrentUpload;
                            wanDownload = CurrentDownload;
                        }
                    }
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                break;
            default:
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_disconnect;
                break;
        }
    }

    //station
    if (WIFI_CONNECTED == G_MonitoringStatus.response.WifiConnectionStatus && g_module.wifioffload_enable) {
        if(station_ret != null
        && station_ret.type == "response" ) {
            g_connection_status = "1";
            var wifiCurrentUpload = '';
            var wifiCurrentDownload = '';
            if( ( $.browser.msie && ($.browser.version == '6.0')) ||  $("#wan_gif").html().indexOf("wan_disable.png")<0) {
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
            }
            $('#wan_gif').show();
            getAjaxData('api/wlan/station-information', function($xml) {
                var ret = xml2object($xml);
                G_StationStatus = ret;
                if (ret.type == 'response') {
                    wifiCurrentUpload = ret.response.TxFlux;
                    wifiCurrentDownload = ret.response.RxFlux;
                    if((wifiUpload != '') && (wifiDownload != '')) {
                        if((wifiUpload != wifiCurrentUpload) && (wifiCurrentDownload == wifiDownload)) {
                            if(g_up_connection_status == "0") {
                                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_up.png' 0 0 no-repeat>");
                                g_disable_connection_status = "0";
                                g_up_down_connection_status = "0";
                                g_up_connection_status = "1";
                                g_down_connection_status = "0";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                        } else if((wifiUpload == wifiCurrentUpload) && (wifiCurrentDownload != wifiDownload)) {
                            if(g_down_connection_status == "0") {
                                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_down.png' 0 0 no-repeat>");
                                g_disable_connection_status = "0";
                                g_up_down_connection_status = "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "1";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                        } else if((wifiUpload != wifiCurrentUpload) && (wifiCurrentDownload != wifiDownload)) {
                            if(g_up_down_connection_status == "0") {
                                $("#wan_gif").html("<img onload = 'fixPNG(this)' src = '../res/wan_up_down.png' 0 0 no-repeat>");
                                g_up_down_connection_status = "1";
                                g_disable_connection_status = "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                        } else if((wifiUpload == wifiCurrentUpload) && (wifiCurrentDownload == wifiDownload)) {
                            if(g_disable_connection_status == "0") {
                                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_disable.png' 0 0 no-repeat>");
                                g_disable_connection_status = "1";
                                g_up_down_connection_status = "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                            }
                        }
                        wifiUpload = wifiCurrentUpload;
                        wifiDownload = wifiCurrentDownload;
                    } else {
                        if(g_disable_connection_status == "0") {
                            $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_disable.png' 0 0 no-repeat>");
                            g_disable_connection_status = "1";
                            g_up_down_connection_status = "0";
                            g_up_connection_status = "0";
                            g_down_connection_status = "0";
                        }
                        wifiUpload = wifiCurrentUpload;
                        wifiDownload = wifiCurrentDownload;
                    }
                }
            });
            var apSignal = setWifiSignal(station_ret.response.SignalStrength);
            if( ( $.browser.msie && ($.browser.version == '6.0')) || typeof ($("#station_gif").html())=="undefined"||$("#station_gif").html().indexOf("station_" + apSignal + ".png")<0) {
                $("#station_gif").html("<img onload = 'fixPNG(this)' src = '../res/station_" + apSignal + ".png' 0 0 no-repeat>");
            }
            $("#station_gif").show();

        } else {
            /*$("#station_gif").css({background:"url(../res/station_0.gif) 0 0 no-repeat"});
             STATUS_BAR_ICON_STATUS.station_tooltip_state = common_sig_off;
             ap_station_disabled();*/
            $("#station_gif").hide();
            ap_station_disabled();
        }
        g_Monitoring_CradleConnectionStatus = -1111;
    } else if(g_module.cradle_enabled && checkValueIsNull(G_cradleStationStatus) && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE != G_cradleStationStatus.connectionmode && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)) {
        if(  ( $.browser.msie && ($.browser.version == '6.0')) ||  g_Monitoring_CradleConnectionStatus != G_cradleStationStatus.cradlestatus) {
            g_Monitoring_CradleConnectionStatus = G_cradleStationStatus.cradlestatus;
            $('#station_gif').html("<img onload = 'fixPNG(this)' src = '../res/cradle_1.png' 0 0 no-repeat>");
            $("#station_gif").show();
            STATUS_BAR_ICON_STATUS.station_tooltip_state = IDS_plmn_label_wx;
            g_cradle_change_status = '1';
            if(G_cradleStationStatus.connectstatus == CRADLE_CONNECTED) {
                g_connection_status = "1";
                $('#wan_gif').show();
                if(g_up_down_connection_status == "0") {
                    $("#wan_gif").html("<img onload = 'fixPNG(this)' src = '../res/wan_up_down.png' 0 0 no-repeat>");
                    g_up_down_connection_status = "1";
                    g_disable_connection_status = "0";
                    g_up_connection_status = "0";
                    g_down_connection_status = "0";
                }
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
            } else {
                ap_station_disabled();
            }
        } else {
            if(checkValueIsNull(G_cradleStationStatus) && G_cradleStationStatus.connectstatus == CRADLE_CONNECTED) {
                g_connection_status = "1";
                $('#wan_gif').show();
                if(g_up_down_connection_status == "0") {
                    $("#wan_gif").html("<img onload = 'fixPNG(this)' src = '../res/wan_up_down.png' 0 0 no-repeat>");
                    g_up_down_connection_status = "1";
                    g_disable_connection_status = "0";
                    g_up_connection_status = "0";
                    g_down_connection_status = "0";
                }
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
            }
            g_Monitoring_CradleConnectionStatus = G_cradleStationStatus.cradlestatus;
        }

    } else {
        g_Monitoring_CradleConnectionStatus = -1111;
        $("#station_gif").hide();
        ap_station_disabled();
    }
    if(G_cradleStationStatus != null) {
        if(g_module.cradle_enabled && (G_cradleStationStatus.cradlestatus == 1) &&(G_cradleStationStatus.connectionmode == 0 || G_cradleStationStatus.connectionmode == 1) && (g_cradle_change_status == '0')) {
            if(G_cradleStationStatus.connectstatus == CRADLE_CONNECTFAILED) {
                $('#station_gif').html("<img onload = 'fixPNG(this)' src = '../res/cradle_1.png' 0 0 no-repeat>");
            } else {
                $('#station_gif').html("<img onload = 'fixPNG(this)' src = '../res/cradle_twinkle.gif' 0 0 no-repeat>");
                g_Monitoring_CradleConnectionStatus = -1111;
            }
            $("#station_gif").show();
            STATUS_BAR_ICON_STATUS.station_tooltip_state = IDS_plmn_label_wx;
        }
    }
    if(g_connection_status == "0") {
        $('#wan_gif').hide();
    }
    //unread sms
    var unreadSmsSize = G_NotificationsStatus.UnreadMessage;
    STATUS_BAR_ICON_STATUS.unread_sms_tooltip_state = common_new_message + unreadSmsSize;
    changeTooltipContent();
}

function getBatteryLevel(str) {
    if(g_coulometer_status == '1') {
        STATUS_BAR_ICON_STATUS.battery_tooltip_state = str + '%';
        var strTemp = parseInt(str, 10);
        if(0 < strTemp &&  strTemp <= 10) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_1.png' 0 0 no-repeat>");
        } else if(10 < strTemp && strTemp <= 23) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_2.png' 0 0 no-repeat>");
        } else if(23 < strTemp && strTemp <= 34) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_3.png' 0 0 no-repeat>");
        } else if(34 < strTemp && strTemp <= 45) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_4.png' 0 0 no-repeat>");
        } else if(45 < strTemp && strTemp <= 56) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_5.png' 0 0 no-repeat>");
        } else if(56 < strTemp && strTemp <= 67) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_6.png' 0 0 no-repeat>");
        } else if(67 < strTemp && strTemp <= 78) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_7.png' 0 0 no-repeat>");
        } else if(78 < strTemp && strTemp <= 89) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_8.png' 0 0 no-repeat>");
        } else if(89 < strTemp && strTemp <= 100) {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_9.png' 0 0 no-repeat>");
        } else {
            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_0.png' 0 0 no-repeat>");
        }
    } else {
        switch (str) {
            case MACRO_BATTERY_LEVEL_ONE:
            case MACRO_BATTERY_LEVEL_TWO:
            case MACRO_BATTERY_LEVEL_THREE:
                var temp =(parseInt(str,10)*2).toString();
                $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_" + temp + ".png' 0 0 no-repeat>");
                break;
            case MACRO_BATTERY_LEVEL_FOUR:
                $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_9.png' 0 0 no-repeat>");
                break;
            default:
                $('#battery_gif').html("<img onload = 'fixPNG(this)' src = '../res/battery_level_" + str + ".png' 0 0 no-repeat>");
                break;
        }
        STATUS_BAR_ICON_STATUS.battery_tooltip_state = common_battery;
    }
}

function changeTooltipContent() {
    $('.qtip-sim').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state + '</b>');
    $('.qtip-station').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.station_tooltip_state + '</b>');
    $('.qtip-wan').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.wan_tooltip_state + '</b>');
    $('.qtip-wifi').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.wifi_tooltip_state + '</b>');
    $('.qtip-battery').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.battery_tooltip_state + '</b>');
    $('.qtip-indoor').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.wifi_indoor_tooltip_state + '</b>');
    $('.qtip-sms').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.unread_sms_tooltip_state + '</b>');
}

/******************************************************************************************************/
function addStatusListener(funName) {
    STATUS_LISTENER_FUN_LIST.push(funName);
    log.debug('MAIN : addStatusListener(' + funName + '), currently ' + STATUS_LISTENER_FUN_LIST.length + ' listener.');
    if (DATA_READY.statusReady && DATA_READY.notificationsReady) {
        log.debug('MAIN : DATA is Ready, execute in addStatusListener');
        eval(funName);
    }
}

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += g_base64EncodeChars.charAt(c1 >> 2);
            out += g_base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += '==';
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += g_base64EncodeChars.charAt(c1 >> 2);
            out += g_base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += g_base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += '=';
            break;
        }
        c3 = str.charCodeAt(i++);
        out += g_base64EncodeChars.charAt(c1 >> 2);
        out += g_base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += g_base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += g_base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64_encode (input) {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }
    return output;
}

function  _utf8_encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}

function validateInput(username, password) {
    clearAllErrorLabel();
    var validate = true;
    if (username == '') {
        showErrorUnderTextbox('username', settings_hint_user_name_empty);
        $("#username").focus();
        $("#username").val("");
        return false;
    }
    if (password == '' && username != '') {
        showErrorUnderTextbox('forget_password_tab', dialup_hint_password_empty);
        $("#password").focus();
        $("#password").val("");
        return false;
    }
    if (!checkInputChar(username)) {
        showErrorUnderTextbox("forget_password_tab", IDS_login_username_password_wrong);
        $("#username").focus();
        $("#username").val("");
        $("#password").val("");
        return false;
    }
    return validate;
}

function loginToQuicksetup() {
    if(current_href == 'quicksetup') {
        window.location.reload();
    }
}
function refreshToken() {
    getAjaxData('api/webserver/SesTokInfo', function($xml) {
        var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_requestVerificationToken = []; 
                g_requestVerificationToken.push(ret.response.TokInfo);
            }
    }, {
        sync: true
    });
}

function login(destnation, callback, redirectDes) {
    var name = $.trim($('#username').val());
    var psd = $('#password').val();
    var valid = validateInput(name, psd);
    if(!valid) {
        return;
    }
    if (g_logining_flag == true) {
        return;
    }
    g_logining_flag = true;
    refreshToken();
    if (true == g_scarm_login) {
        if($.isArray(g_requestVerificationToken)) {
            if(g_requestVerificationToken.length <= 0) {
                setTimeout( function () {
                    if(g_requestVerificationToken.length > 0) {
                        login(destnation, callback, redirectDes);
                    }
                }, 50)
                return;
            }
        }
        var scram = CryptoJS.SCRAM();
        var firstNonce = scram.nonce().toString();
        var firstPostData = {
            username: name,
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
                                getAjaxData('api/user/state-login', function($xml) {
                                    var ret = xml2object($xml);
                                    if (ret.type == 'response') {
                                        if('undefined' != typeof(ret.response.firstlogin)) {
                                            g_default_password_status = parseInt(ret.response.firstlogin,10);
                                        }
                                        $('#username_span').text(name);
                                        $('#username_span').show();
                                        $('#logout_span').text(common_logout);
                                        var passwordStr = $('#password').val();
                                        clearDialog();
                                        g_main_displayingPromptStack.pop();
                                        startLogoutTimer(redirectDes);
                                        if(checkPWRemind(passwordStr)) {
                                            checkDialogFlag = true;
                                            if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1'){
                                                if(current_href =='quicksetup'){
                                                    window.location.replace('quicksetup.html');
                                                }
                                            } else {
                                                showPWRemindDialog(destnation, callback);
                                            }
                                        } else {
                                            setTimeout( function() {
                                                if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1'){
                                                    if(current_href =='quicksetup'){
                                                        window.location.replace('quicksetup.html');
                                                    }
                                                }else{
                                                    loginSwitchDoing(destnation, callback);
                                                }
                                            }, 200);
                                        }
                                    }
                                });
                            } else {
                                showErrorUnderTextbox('username', IDS_login_fialed_prompt);
                                $('#username').focus();
                                $('#username').val('');
                                $('#password').val('');
                            }
                        } else {
                            showErrorUnderTextbox('username', IDS_login_fialed_prompt);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        }
                    } else {
                        if (ret.error.code == ERROR_LOGIN_USERNAME_PWD_ORERRUN) {
                            showErrorUnderTextbox('forget_password_tab', IDS_login_username_password_input_overrun);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        } else if (ret.error.code == ERROR_LOGIN_USERNAME_PWD_WRONG) {
                            showErrorUnderTextbox('forget_password_tab', IDS_login_username_password_wrong);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        }
                    }
                });
            } else {
                if (ret.error.code == ERROR_LOGIN_USERNAME_PWD_ORERRUN) {
                    showErrorUnderTextbox('forget_password_tab', IDS_login_username_password_input_overrun);
                    $('#username').focus();
                    $('#username').val('');
                    $('#password').val('');
                } else if (ret.error.code == ERROR_LOGIN_USERNAME_PWD_WRONG) {
                    showErrorUnderTextbox('forget_password_tab', IDS_login_username_password_wrong);
                    $('#username').focus();
                    $('#username').val('');
                    $('#password').val('');
                } else if (ret.error.code == ERROR_LOGIN_ALREADY_LOGIN) {
                    showErrorUnderTextbox('forget_password_tab', common_user_login_repeat);
                    $('#username').focus();
                    $('#username').val('');
                    $('#password').val('');
                }
            }
            g_logining_flag = false;
        });
    } else {
        if($.isArray(g_requestVerificationToken)) {
            if(g_requestVerificationToken.length > 0) {
                if(g_password_type == '4') {
                    psd = base64encode(SHA256(name + base64encode(SHA256($('#password').val())) + g_requestVerificationToken[0]));
                } else {
                    psd = base64encode($('#password').val());
                }

            } else {
                setTimeout( function () {
                    if(g_requestVerificationToken.length > 0) {
                        login(destnation, callback, redirectDes);
                    }
                }, 50)
                return;
            }
        } else {
            psd = base64encode($('#password').val());
        }

        var request = {
            Username: name,
            Password: psd,
            password_type: g_password_type
        };
        if (valid) {
            var xmlstr = object2xml('request', request);
            log.debug('xmlstr = ' + xmlstr);
            saveAjaxData('api/user/login', xmlstr, function($xml) {
                log.debug('api/user/login successed!');
                var ret = xml2object($xml);
                g_logining_flag = false;
                if (isAjaxReturnOK(ret)) {
                    /*
                     * show username when login successfully
                     */
                    getAjaxData('api/user/state-login', function($xml) {
                        var ret = xml2object($xml);
                        if (ret.type == 'response') {
                            if('undefined' != typeof(ret.response.firstlogin)) {
                                g_default_password_status = parseInt(ret.response.firstlogin,10);
                            }
                            $('#username_span').text(name);
                            $('#username_span').show();
                            $('#logout_span').text(common_logout);
                            var passwordStr = $('#password').val();
                            clearDialog();
                            g_main_displayingPromptStack.pop();
                            startLogoutTimer(redirectDes);
                            if(checkPWRemind(passwordStr)) {
                                checkDialogFlag = true;
                                if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1'){
                                    if(current_href =='quicksetup'){
                                        window.location.replace('quicksetup.html');
                                    }
                                } else {
                                    showPWRemindDialog(destnation, callback);
                                }
                            } else {
                                setTimeout( function() {
                                    if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1'){
                                        if(current_href =='quicksetup'){
                                            window.location.replace('quicksetup.html');
                                        }
                                    }else{
                                        loginSwitchDoing(destnation, callback);
                                    }
                                }, 200);
                            }
                        }
                    });
                } else {
                    if (ret.type == 'error') {
                        clearAllErrorLabel();
                        if (ret.error.code == ERROR_LOGIN_PASSWORD_WRONG) {
                            showErrorUnderTextbox('forget_password_tab', system_hint_wrong_password);
                            $('#password').val('');
                            $('#password').focus();
                        } else if (ret.error.code == ERROR_LOGIN_ALREADY_LOGIN) {
                            showErrorUnderTextbox('forget_password_tab', common_user_login_repeat);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        }else if (ret.error.code == ERROR_LOGIN_TOUCH_ALREADY_LOGIN) {
                            showErrorUnderTextbox('forget_password_tab', touch_user_login_repeat);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        } else if (ret.error.code == ERROR_LOGIN_USERNAME_WRONG) {
                            showErrorUnderTextbox('username', settings_hint_user_name_not_exist);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        } else if (ret.error.code == ERROR_LOGIN_USERNAME_PWD_WRONG) {
                            showErrorUnderTextbox('forget_password_tab', IDS_login_username_password_wrong);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        } else if (ret.error.code == ERROR_LOGIN_USERNAME_PWD_ORERRUN) {
                            showErrorUnderTextbox('forget_password_tab', IDS_login_username_password_input_overrun);
                            $('#username').focus();
                            $('#username').val('');
                            $('#password').val('');
                        }
                    }
                }
            }, {
                enc:true
            });
        }
    }
}

function loginSwitchDoing(destnation, callback) {
    if (typeof(destnation) != 'undefined' &&
    destnation != null) {
        window.location.href = destnation;
    }

    if (typeof (callback) == 'function') {
        callback();
        callback = null;
    }

    if(g_is_network_connect) {
        g_is_network_connect = false;
        index_sendNetWorkAction();
    } else if(g_is_wlan_connect) {
        g_is_wlan_connect = false;
        setHandoverSetting();
    } else if(g_is_power_off) {
        g_is_power_off = false;
        setPowerOff();
    }else if(g_new_switch)
    {
    	g_new_switch = false;
    	setNetConnect_New();
    }

    if (g_is_disconnect_clicked) {
        index_clickDisconnectBtn();
    } else if (g_is_connect_clicked) {
        index_clickConnectBtn();
    }
    if(g_isTrunOffWlanChecked) {
        if($('.trun_on_off_waln :checked').size() > 0) {
            g_handover_setting.Handover = '2';
        } else {
            g_handover_setting.Handover = '0';
        }
        g_isTrunOffWlanChecked = false;
        setHandoverSetting();
    }
    if(!checkDialogFlag) {
        loginToQuicksetup();
    }
}

function checkPWRemind(passValue) {
    var ret = false;
    if(checkPWStrength(passValue) == MACRO_PASSWORD_LOW) {
        getAjaxData('api/user/remind', function($xml) {
            var res = xml2object($xml);
            if ('response' == res.type && "0" == res.response.remindstate) {
                ret = true;
            }
        }, {
            sync: true
        });
    }
    return ret;
}

function setPWRemindStatus(setStatus) {
    var submitData = {
        remindstate:setStatus
    };
    var res = object2xml('request', submitData);
    saveAjaxData('api/user/remind', res, function($xml) {
        var return_ret = xml2object($xml);
        if (isAjaxReturnOK(return_ret)) {
            log.debug('main : send setPWRemindStatus success.');
        }
    }, {
        sync: true
    });
}

function checkPWStrength(passValue) {
    function charMode(iN) {
        if (iN>=48 && iN <=57) {
            return 1;
        } else if ((iN>=65 && iN <=90) || (iN>=97 && iN <=122)) {
            return 2;
        } else {
            return 4;
        }
    }

    function bitTotal(num) {
        var modes=0;
        var i = 0;
        for (i=0;i<3;i++) {
            if (num & 1) {
                modes++;
            }
            num>>>=1;
        }
        return modes;
    }

    var ret = 0;
    var sPWLength = passValue.length;
    var sPWModes = 0;
    var i= 0;
    for (i= 0; i < sPWLength; i++) {
        sPWModes|=charMode(passValue.charCodeAt(i));
    }
    sPWModes = bitTotal(sPWModes);

    if(sPWLength < 6 || (sPWModes == 1 && sPWLength < 10)) {
        ret = MACRO_PASSWORD_LOW;
    } else if((sPWModes == 2 && sPWLength >= 6) || (sPWModes == 1 && sPWLength >= 10)) {
        ret = MACRO_PASSWORD_MID;
    } else if(sPWModes == 3 && sPWLength >= 6) {
        ret = MACRO_PASSWORD_HIG;
    } else {
        ret = MACRO_PASSWORD_LOW;
    }
    return ret;
}

function showPWRemindDialog(destnation,callback) {
    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog'>";
    dialogHtml += "    <div class='dialog_content'>";
    dialogHtml += "        <div class='dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_note + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' id='psw_close_btn' href='javascript:void(0);' title='' ><canvas id='remindDialogCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += "        </div>";
    dialogHtml += "        <div class='dialog_table'>" + IDS_psw_login_remind  + "</div>";
    dialogHtml += "        <div class='dialog_table'><input type='checkbox'  id='check_pass_remind' /><span>&nbsp;" + IDS_psw_modify_remind + "</span></div>";
    dialogHtml += "        <div class='dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";
    dialogHtml += "                <span class='button_wrapper pop_confirm'>";
    dialogHtml += "                    <input id='psw_confirm' class='button_dialog' type='button' value='"+IDS_common_modify+"'/></span>";
    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper'>";
    dialogHtml += "                <input id='psw_Cancel' class='button_dialog' type='button' value='"+IDS_common_wait+"'/></span>";
    dialogHtml += "            </div>";
    dialogHtml += "        </div>";
    dialogHtml += "    </div>";
    dialogHtml += "</div>";

    $(".body_bg").before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("remindDialogCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".dialog_header").css({
            "width":"500px",
            "height":"29px"
        });
        $(".dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        $(".dialog_header a").css("top","7px");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".dialog_header a").append(ahtml);
    } else {
        var canvas = document.getElementById("remindDialogCanvas");
        draw(canvas);
    }
    $('#psw_confirm, #psw_Cancel, #psw_close_btn').die('click');
    $('#psw_confirm').live('click', function() {
        if($('#check_pass_remind').get(0).checked) {
            setPWRemindStatus(MACRO_PASSWORD_REMIND_OFF);
        }
        clearDialog();
        setTimeout( function() {
            loginSwitchDoing(destnation, callback);
            g_main_displayingPromptStack.pop();
            hiddenSelect(false);
            window.location.href = 'modifypassword.html';
            return false;
        }, 200);
    });
    $('#psw_Cancel,#psw_close_btn').live('click', function() {
        if($('#check_pass_remind').length != 0 && $('#check_pass_remind').get(0).checked) {
            setPWRemindStatus(MACRO_PASSWORD_REMIND_OFF);
        }
        clearDialog();
        setTimeout( function() {
            loginSwitchDoing(destnation, callback);
            g_main_displayingPromptStack.pop();
            hiddenSelect(false);
            if(checkDialogFlag) {
                loginToQuicksetup();
            }
            return false;
        }, 200);
    });
    hiddenSelect(true);
    reputPosition($('.dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('psw_confirm');
    disableTabKey();
}

function userOut(destnation) {
    var logOut = {
        Logout: 1
    };

    var submitData = object2xml('request', logOut);
    saveAjaxData('api/user/logout', submitData, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (isAjaxReturnOK(ret)) {
                $("#username_span").hide();
                $("#logout_span").text(common_login);
                if (checkInputValue(destnation)) {
                    gotoPageWithoutHistory(destnation);
                } else {
                    if(g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
                        if(!redirectOnCondition(null,null)) {
                            gotoPageWithoutHistory("quicksetup.html");
                        }
                    } else {
                        gotoPageWithoutHistory(HOME_PAGE_URL);
                    }
                }
            }
        }
    });
}

function getDefaultPass() {
    getAjaxData('api/user/state-login', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if('undefined' != typeof(ret.response.firstlogin)) {
                g_default_password_status = parseInt(ret.response.firstlogin,10);
            }
        }
    }, {
        sync: true
    });
}

function loginout() {
    getAjaxData('api/user/state-login', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (ret.response.State != 0) {
                if('undefined' != typeof(ret.response.firstlogin)) {
                    g_default_password_status = parseInt(ret.response.firstlogin,10);
                }
                showloginDialog();
            } else {
                showConfirmDialog(common_warning_logout, function() {
                    userOut();
                    cancelLogoutTimer();
                    return false;
                }, function() {
                });
            }
        }
    }, {
        sync: true
    });
}

function showNotification() {

    if (G_NotificationsStatus != null) {
        var unreadSmsSize = G_NotificationsStatus.UnreadMessage;
        var smsStorageFull = G_NotificationsStatus.SmsStorageFull;
        if (g_module.sms_enabled) {

            if (smsStorageFull == '1') {//sms full
                $('#sms_full').css({
                    'display' : 'block'
                });
                if($('#tooltip_sms_full').html()!=null) {
                    if($('#tooltip_sms_full').html().indexOf("message.gif")<0) {
                        $('#tooltip_sms_full').html("<img src = '../res/message.gif' alt='' />");
                    }
                }
                $('#sms_gif').css({
                    'display' : 'none'
                });
                $('#tooltip_sms').html('');
            } else {
                $('#sms_full').css({
                    'display' : 'none'
                });
                $('#tooltip_sms_full').html('');
                if (unreadSmsSize > 0) {
                    $('#sms_gif').css({
                        'display': 'block'
                    });
                    if($('#tooltip_sms').html()!=null) {
                        if($('#tooltip_sms').html().indexOf("unread_message.gif")<0) {
                            $('#tooltip_sms').html("<img src = '../res/unread_message.gif' alt='' />");
                        }
                    }

                } else {
                    $('#sms_gif').css({
                        'display': 'none'
                    });
                    $('#tooltip_sms').html('');
                }
            }
        }
    }
}

function getUserManualUrl() {
    if (g_needHelp) {
        var helpUrl = document.getElementById("help_url");
        var current_language = LANGUAGE_DATA.current_language;
        var usermanual_language_list = LANGUAGE_DATA.usermanual_language_list;
        var support_language = [];
        support_language = CreateArray(usermanual_language_list.support_language.language);
        var supportFlag = false;
        if(typeof(support_language)!= 'undefined' && support_language != '') {
            var i = 0;
            for(i=0 ;i < support_language.length;i++) {
                if(current_language == support_language[i].replace(/-/, '_')) {
                    supportFlag = true;
                }
            }
        }
        if(supportFlag == false) {
            current_language = usermanual_language_list.default_language.replace(/-/, '_');
        }
        current_language = current_language.replace('_', '-');
        g_user_manual_url = "../" + USER_MANUAL_PATH + "/" + current_language + "/"
        + USER_MANUAL_PATH + "/" + USER_MANUAL_FILE_NAME;
        if( typeof helpUrl != "undefined" && typeof helpUrl != null) {
            helpUrl.href = g_user_manual_url;
        }
    }
}

//for dialog
function mainIsHandheldBrowser() {
    var bRet = false;
    var hardwarePlatform = navigator.platform.toLowerCase();
    var agent = navigator.userAgent.toLowerCase();
    var isIpod = hardwarePlatform.indexOf("ipod") != -1;
    var isIphone = hardwarePlatform.indexOf("iphone") != -1;
    var isIpad =  hardwarePlatform.indexOf("ipad") != -1;
    g_isPad_status = isIpad;
    var isAndroid = agent.indexOf("android") !=-1;
    var isPsp = (agent.indexOf("playstation") != -1);

    log.debug("INDEX : hardwarePlatform = " + hardwarePlatform);
    log.debug("INDEX : agent = " + agent);

    if (isIphone || isIpod) {
        log.debug("INDEX : current browser is iphone or ipod.");
        bRet = true;
    } else if (isPsp) {
        log.debug("INDEX : current browser is psp.");
        bRet = true;
    } else if (isIpad) {
        log.debug("INDEX : current browser is ipad.");
        bRet = true;
    } else if (isAndroid) {
        log.debug("INDEX : current browser is android.");
        bRet = true;
    } else {
        log.debug("INDEX : screen.height = " + screen.height);
        log.debug("INDEX : screen.width = " + screen.width);
        if (screen.height <= 320 || screen.width <= 320) {
            bRet = true;
            log.debug("INDEX : current browser screen size is small.");
        }
    }
    log.debug("INDEX : isHandheldBrowser = " + bRet);
    return bRet;
}

function reputPosition($dialogElement, $dialogDiv) {
    var newTop = 0, newLeft = 0, scTop = 0, scLeft = 0;
    if ($dialogElement) {
        if(g_smallPage) {
            newLeft = (getWindowWidth() - $dialogElement.width()) / 2;
            if(g_isPad_status) {
                newTop = ((getWindowHeight() - $dialogElement.height()) / 2);
            } else {
                newTop = 0;
                $(document).scrollTop(0);
                $(document).scrollLeft((getWindowWidth() - $dialogElement.width()) / 2);
            }
        } else {
            newTop = (getWindowHeight() - $dialogElement.height()) / 2;
            newLeft = (getWindowWidth() - $dialogElement.width()) / 2;
            scTop = $(document).scrollTop();
            scLeft = $(document).scrollLeft();
            newTop = scTop + newTop > 0 ? scTop + newTop : 0;
            newLeft = scLeft + newLeft;
        }
        $dialogElement.css({
            left: newLeft,
            top: newTop
        }).show();
    }
    window.onscroll = function() {
        scTop = $(document).scrollTop();
        scLeft = $(document).scrollLeft();
    };
    window.onresize = function() {
        if (!$dialogElement.is(':visible')) {
            return;
        } else {
            $dialogElement.css({
                left: newLeft,
                top: newTop
            });
            if ($dialogDiv) {
                $dialogDiv.css({
                    'width' : 0,
                    'height' : 0
                });
            }
            if(g_smallPage) {
                if(g_isPad_status) {
                    $(document).scrollTop((getWindowHeight() - $dialogElement.height()) / 2);
                } else {
                    $(document).scrollTop(0);
                }
                $(document).scrollLeft((getWindowWidth() - $dialogElement.width()) / 2);
            } else {
                $(document).scrollTop(scTop);
                $(document).scrollLeft(scLeft);
            }
            reputPosition($dialogElement.last(), $dialogDiv);
        }
    };
    if ($dialogDiv) {
        var div_width = Math.max(getWindowWidth(), getDocumentWidth());
        var div_height = Math.max(getWindowHeight(), getDocumentHeight());
        $dialogDiv.css({
            'width' : div_width,
            'height' : div_height
        });
        $dialogDiv.show();
    }
    function getWindowHeight() {
        return document.documentElement.clientHeight;
    }

    function getWindowWidth() {
        return document.documentElement.clientWidth;
    }

    function getDocumentHeight() {
        if (!$dialogElement) {
            return document.body.scrollHeight;
        } else {
			if($dialogElement.position() != null){
				return Math.max($dialogElement.position().top + $dialogElement.height(), document.documentElement.scrollHeight);
			}
        }
    }

    function getDocumentWidth() {
        if (!$dialogElement) {
            return document.documentElement.scrollWidth;
        } else {
		    if($dialogElement.position() != null){
				return Math.max($dialogElement.position().left + $dialogElement.width(), document.documentElement.scrollWidth);
			}
        }
    }

}

function onKeyup(evt) {
    if (evt.ctrlKey || evt.altKey)// Exclude key press "CRTL+key" & "ALT+key"
    {
        return;
    }

    if (MACRO_KEYCODE == evt.keyCode && true == flag_focus)// Enter key
    {
        var targetID = '';
        var stackLen = g_main_displayingPromptStack.length;

        if (stackLen > 0) {
            targetID = g_main_displayingPromptStack[stackLen - 1];
        } else {
            if ('autoconnection' == current_href) {
                if(isButtonEnable('autocennect_apply')) {
                    targetID = 'autocennect_apply';
                }
            }
            $('input').blur();

            $('select').blur();
            if ('mobilenetworksettings' == current_href) {
                if(isButtonEnable('mobilensetting_apply')) {
                    targetID = 'mobilensetting_apply';
                }

            }

            if ('home' == current_href) {
	    var a = $('.search_t').val();
	   
	    if(a!=''){
                targetID = 'search_button';
		}
            }

            if ('pincodemanagement' == current_href) {
                targetID = $('.button_wrapper input').attr('id');
            }

            if ('pincoderequired' == current_href) {
                targetID = 'pinrequired_button_apply';
            }

            if ('pukrequired' == current_href) {
                targetID = 'pukrequired_apply';
            }

            if ('simlockrequired' == current_href) {
                targetID = 'simlock_button_apply';
            }

            if ('mobileconnection' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }

            }

            if ('pincodeautovalidate' == current_href) {
                if(isButtonEnable('validate_apply')) {
                    targetID = 'validate_apply';
                }
            }

            if ('modifypassword' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }

            }

            if ('wps' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }

            }

            if ('dhcp' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }

            }

            if ('sipalgsettings' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }
            }

            if ('profilesmgr' == current_href) {
                if(isButtonEnable('select_apply')) {
                    targetID = 'select_apply';
                }

            }
            if ('wlanbasicsettings' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }

            }

            if ('wlanadvanced' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }
            }

            if ('wlanmacfilter' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }

            }

            if ('firewallswitch' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }
            }

            if ('dmzsettings' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }
            }

            if ('upnp' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }
            }
            if ('update' == current_href) {
                if (!$('#success_ok').is(':hidden')) {
                    targetID = 'success_ok';
                }

                if (!$('#pop_Cancel').is(':hidden')) {
                    targetID = 'pop_Cancel';
                }
            }

            if ('ota' == current_href) {
                if (!$('#auto_apply').is(':hidden')) {
                    targetID = 'auto_apply';
                }
                if (!$('#ota_manual_otksl').is(':hidden')) {
                    targetID = 'ota_manual_otksl';
                }
                if (!$('#ota_manual_activate').is(':hidden')) {
                    targetID = 'ota_manual_activate';
                }
            }

            if ('sdcardsharing' == current_href) {
                if(isButtonEnable(g_sd_mode_id)) {
                    targetID = g_sd_mode_id;
                }

            }

            if ('ethernetsettings' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }

            }

            if ('macclone' == current_href) {
                if(isButtonEnable('apply_button')) {
                    targetID = 'apply_button';
                }
            }
            if ('ddns' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }
            }
            if ('cradleDisconnected' == current_href) {
                if(isButtonEnable('link_connetcioncradle')) {
                    targetID = 'link_connetcioncradle';
                }
            }
            if ('stationwps' == current_href) {
                if(isButtonEnable('button_connection')) {
                    targetID = 'button_connection';
                }
            }
            if ('serverbasic' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }
            }

            if ('sipbasic' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }
            }

            if ('speeddial' == current_href) {
                if(isButtonEnable('apply')) {
                    targetID = 'apply';
                }
            }
        }

        if ('' != targetID) {
            $('#' + targetID).trigger('click');
        }
    }
}

function enableTabKey() {
    $('a').attr('tabindex', '');
    $('input').attr('tabindex', '');
    $('select').attr('tabindex', '');
}

function disableTabKey() {
    $('a').attr('tabindex', '-1');
    $('input').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');

    $("#username").attr('tabindex','1');
    $("#password").attr('tabindex','2');
    if(!tabKeyflag) {
        $("#username").focusout( function() {
            disableTabKey();
        });
        $("#username").focusin( function() {
            enableTabKey();
        });
        tabKeyflag = true;
    }

}

function startLogoutTimer(destnation) {
    if (g_needToLogin) {
        clearTimeout(g_logoutTimer);
        g_logoutTimer = setTimeout( function () {
            userOut(destnation);
        }, LOGOUT_TIMEOUT_MAIN);
    }
}

function cancelLogoutTimer() {
    if (g_needToLogin) {
        clearTimeout(g_logoutTimer);
    }
}

function regURL ( str ) {
    var reg = "(((https|http|ftp|rtsp|mms):&#x2F;&#x2F;)|(www\\.)){1}[\41-\176]*";
    var matchURL=new RegExp(reg,"ig");
    str = XSSResolveCannotParseChar(str);
    return str.replace(matchURL, function($1) {
        $1_href = $1.indexOf("&#x2F;&#x2F;")==-1?"http://"+$1:$1;
        if($1_href.charAt($1_href.length-1)=="="&&$1_href.charAt($1_href.length-2)!="=") {
            $1_href=$1_href.substring(0,$1_href.length-1);
        }
        return "<a href='"+$1_href+"' style='text-decoration:underline;' target='_blank' onclick='javascript:stopBubble(event)'>"+$1+"</a>";
    });
}

function stopBubble( e ) {
    if ( e && e.stopPropagation ) {
        e.stopPropagation();
    } else {
        window.event.cancelBubble=true;
    }
}

function setWifiSignal(WifiSignal) {
    var signalIntension = null;
    switch (WifiSignal) {
        case MACRO_EVDO_LEVEL_ONE:
            signalIntension = MACRO_EVDO_LEVEL_ONE;
            break;
        case MACRO_EVDO_LEVEL_TWO:
            signalIntension = MACRO_EVDO_LEVEL_TWO;
            break;
        case MACRO_EVDO_LEVEL_THREE:
            signalIntension = MACRO_EVDO_LEVEL_THREE;
            break;
        case MACRO_EVDO_LEVEL_FOUR:
        case MACRO_EVDO_LEVEL_FIVE:
            signalIntension = MACRO_EVDO_LEVEL_FOUR;
            break;
        default:
            signalIntension = MACRO_EVDO_LEVEL_ZERO;
            break;
    }
    STATUS_BAR_ICON_STATUS.station_tooltip_state = wlan_lable_wifi;
    return signalIntension;
}

function replaceSpace(str) {
    var ss="";
    var i = 0;
    for (i=0; i < str.length; i++) {
        if(' '==str.charAt(i)) {
            str = str.replace(' ','&nbsp;');
        }
    }
    return str;
}

function replaceSpaceOther(str) {
    var ss="";
    var i = 0;
    for (i=0; i < str.length; i++) {
        if(' '==str.charAt(i)) {
            str = str.replace(' ','&nbsp;');
        }
    }
    while (str.indexOf('<') >= 0) {
        str = str.replace('<', '&lt;');
    }
    while (str.indexOf('>') >= 0) {
        str = str.replace('>', '&gt;');
    }
    return str;
}

function getSimPukTimes() {
    getAjaxData('api/pin/status', function($xml) {
        var pinstatus_ret = xml2object($xml);
        if (pinstatus_ret.type == 'response') {
            g_pin_status_SimPukTimes = pinstatus_ret.response.SimPukTimes;
        }
    });
}

function display_SIMtoUIM(str) {
    if (MACRO_NET_DUAL_MODE == g_net_mode_type) {
        if (str.indexOf('SIMLOCK')>-1) {
            return str;
        } else {
            str = str.replace(/SIM/g, "UIM");
            return str;
        }
    } else {
        return str;
    }
}

function hiddenSelect(flag) {
    if ($.browser.msie && ($.browser.version == 6.0)) {
        if (flag) {
            $("select").css("display","none");
        } else {
            $("select").css("display","inline");
            $("#select_WifiCountry_for_Idevice").css("display","none");
        }
    }
}

function check_ethernet_display() {
    if(g_module.cradle_enabled) {
        $('#label_ethernet').text(IDS_ethernet_label_Internet_ethernet);
        if(checkLeftMenu(g_PageUrlTree.settings.ethernet.ethernetsettings)) {
            $('#label_wan_setting').text(IDS_ethernet_label_setting);
        } else {
            $('#ethernetsettings').remove();
        }
        if(checkLeftMenu(g_PageUrlTree.settings.ethernet.ethernetstatus)) {
            $('#label_wan_status').text(IDS_ethernet_label_ethernet_status);
        } else {
            $('#ethernetstatus').remove();
        }
        if(checkLeftMenu(g_PageUrlTree.settings.ethernet.macclone)) {
            $('#label_mac_clone').text(IDS_ethernet_label_mac_clone);
        } else {
            $('#macclone').remove();
        }
    } else {
        $('#ethernet').remove();
    }
}

function getMonitoringStatus() {
    if(g_net_mode_status == null) {
        getAjaxData('api/monitoring/status', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                G_MonitoringStatus = ret;
                getMainNetMode();
            }
        }, {
            sync: true
        });

    }
}

function CreateArray(obj) {
    var tempArray = [];
    if($.isArray(obj)) {
        return obj;
    } else {
        if(typeof(obj) != 'undefined') {
            tempArray.push(obj);
        }
        return tempArray;
    }
}

function checkInputChar(str) {
    var i;
    var char_i;
    var num_char_i;

    if (str == "") {
        return true;
    }

    for (i = 0; i < str.length; i++) {
        char_i = str.charAt(i);
        num_char_i = char_i.charCodeAt();
        if ((num_char_i > MACRO_SUPPORT_CHAR_MAX) || (num_char_i < MACRO_SUPPORT_CHAR_MIN)) {
            return false;
        } else if ((MACRO_NOT_SUPPORT_CHAR_COMMA == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_QUOTATION_MARK == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_COLON == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_SEMICOLON == num_char_i) ||
        (MACRO_NOT_SUPPORT_BACKSLASH_MARK == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_38 == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_37 == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_43 == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_39 == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_60 == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_62 == num_char_i) ||
        (MACRO_NOT_SUPPORT_CHAR_63 == num_char_i)) {
            return false;
        } else {
            continue;
        }
    }
    return true;
}

function showDialog(common_title,content,button1_text,button1_Id,button2_text,button2_Id) {
    $('#div_wrapper').remove();
    $('.login_dialog').remove();
    var dialogHtml = '';
    if($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_title + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='showCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += content;
    dialogHtml += "        <div class='login_dialog_table_bottom'>";
    dialogHtml += "              <span class='button_wrapper pop_save'>";
    dialogHtml += "                  <input id='"+button1_Id+"' class='button_dialog' type='button' value='"+button1_text+"'/></span>";
    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper'>";
    dialogHtml += "                  <input id='"+button2_Id+"' class='button_dialog' type='button' value='"+button2_text+"'/></span>";
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';
    $('.body_bg').before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("showCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".login_dialog_content").css({
            "width":"420px",
            "height":"29px"
        });
        $(".login_dialog_content").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        $(".dialog_header_right a").css("top","7px");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
    } else {
        var canvas = document.getElementById("showCanvas");
        draw(canvas);
    }
    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push(button1_Id);
    disableTabKey();
}

function openPortToCss(tableID) {
    if(($.browser.mozilla) || ($.browser.opera)) {
        $('#'+tableID).css
        ({
            'table-layout':'fixed',
            'word-break':'break-all',
            'word-wrap':'break-word'
        });
    }
}

function spaceToNbsp(str) {
    var i = 0;
    for (i=0; i < str.length; i++) {
        if(' '==str.charAt(i)) {
            str = str.replace(' ','&nbsp;');
        }
    }
    return str;

}

function nbspToSpace(str) {
    return str.replace(/(\&nbsp;)/g, function($0, $1) {
        return {
            '&nbsp;' : ' '
        }[$1];
    }
    );
}

function profileNameValid(str) {
    var temp_status = true;
    var i = 0;
    for(i=0;i< str.length;i++) {
        if('"' == str.charAt(i) || '&' == str.charAt(i) || "'" == str.charAt(i) || '<' == str.charAt(i) || '>' == str.charAt(i)) {
            temp_status = false;
        }
    }
    return temp_status;
}

function coulometerCheck(str) {
    var temp ;
    if(g_coulometer_status == '1') {
        temp = str.replace(/50/g, "20");
    } else {
        temp = str;
    }
    return temp;
}

function copyrightReplace(str) {
    var temp = str.replace(/%s/g, g_copyright_year);
    return temp;
}

function SHA256(s) {

    var chrsz   = 8;
    var hexcase = 0;

    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S (X, n) {
        return ( X >>> n ) | (X << (32 - n));
    }

    function R (X, n) {
        return ( X >>> n );
    }

    function Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
    }

    function Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }

    function Sigma0256(x) {
        return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }

    function Sigma1256(x) {
        return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }

    function Gamma0256(x) {
        return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }

    function Gamma1256(x) {
        return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for ( var j = 0; j<64; j++) {
                if (j < 16)
                    W[j] = m[j + i];
                else
                    W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}

// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
    rng_pool[rng_pptr++] ^= x & 255;
    rng_pool[rng_pptr++] ^= (x >> 8) & 255;
    rng_pool[rng_pptr++] ^= (x >> 16) & 255;
    rng_pool[rng_pptr++] ^= (x >> 24) & 255;
    if(rng_pptr >= rng_psize)
        rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
    rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
    if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
        // Extract entropy (256 bits) from NS4 RNG if available
        var z = window.crypto.random(32);
        for(t = 0; t < z.length; ++t)
            rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
    }
    while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
        t = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t >>> 8;
        rng_pool[rng_pptr++] = t & 255;
    }
    rng_pptr = 0;
    rng_seed_time();
}
function rng_get_byte() {
    if(rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
            rng_pool[rng_pptr] = 0;
        rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}

function rng_get_bytes(ba) {
    var i;
    for(i = 0; i < ba.length; ++i)
        ba[i] = rng_get_byte();
}

function SecureRandom() {
}

SecureRandom.prototype.nextBytes = rng_get_bytes;
// prng4.js - uses Arcfour as a PRNG
function Arcfour() {
    this.i = 0;
    this.j = 0;
    this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
    var i, j, t;
    for(i = 0; i < 256; ++i)
        this.S[i] = i;
    j = 0;
    for(i = 0; i < 256; ++i) {
        j = (j + this.S[i] + key[i % key.length]) & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
}

function ARC4next() {
    var t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
    return new BigInteger(str,r);
}

function linebrk(s,n) {
    var ret = "";
    var i = 0;
    while(i + n < s.length) {
        ret += s.substring(i,i+n) + "\n";
        i += n;
    }
    return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
    if(b < 0x10)
        return "0" + b.toString(16);
    else
        return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
    if(n < s.length + 11) { // TODO: fix for utf-8
        alert("Message too long for RSA");
        return null;
    }
    var ba = new Array();
    var i = s.length - 1;
    while(i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if(c < 128) { // encode using utf-8
            ba[--n] = c;
        } else if((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        } else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = new Array();
    while(n > 2) { // random non-zero pad
        x[0] = 0;
        while(x[0] == 0)
            rng.nextBytes(x);
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
    if(N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N,16);
        this.e = parseInt(E,16);
    } else
        alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
    return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
    var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
    if(m == null)
        return null;
    var c = this.doPublic(m);
    if(c == null)
        return null;
    var h = c.toString(16);
    if((h.length & 1) == 0)
        return h;
    else
        return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
function RSAEncryptB64(text) {
    var h = this.encrypt(text);
    if(h)
        return hex2b64(h);
    else
        return null;
}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

//my encrypt function, using fixed mudulus
var modulus = "BEB90F8AF5D8A7C7DA8CA74AC43E1EE8A48E6860C0D46A5D690BEA082E3A74E1"
+"571F2C58E94EE339862A49A811A31BB4A48F41B3BCDFD054C3443BB610B5418B"
+"3CBAFAE7936E1BE2AFD2E0DF865A6E59C2B8DF1E8D5702567D0A9650CB07A43D"
+"E39020969DF0997FCA587D9A8AE4627CF18477EC06765DF3AA8FB459DD4C9AF3";
var publicExponent = "10001";
function MyRSAEncryptB64(text) {
    var rsa = new RSAKey();
    rsa.setPublic(modulus, publicExponent);
    return rsa.encrypt_b64(text);
}

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
    if(a != null)
        if("number" == typeof a)
            this.fromNumber(a,b,c);
        else if(b == null && "string" != typeof a)
            this.fromString(a,256);
        else
            this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() {
    return new BigInteger(null);
}

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
        var v = x*this[i++]+w[j]+c;
        c = Math.floor(v/0x4000000);
        w[j++] = v&0x3ffffff;
    }
    return c;
}

// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
        var l = this[i]&0x7fff;
        var h = this[i++]>>15;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
        w[j++] = l&0x3fffffff;
    }
    return c;
}

// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
        var l = this[i]&0x3fff;
        var h = this[i++]>>14;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
        c = (l>>28)+(m>>14)+xh*h;
        w[j++] = l&0xfffffff;
    }
    return c;
}

if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
} else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
} else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv)
    BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;

function int2char(n) {
    return BI_RM.charAt(n);
}

function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i)
        r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0)
        this[0] = x;
    else if(x < -1)
        this[0] = x+DV;
    else
        this.t = 0;
}

// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}

// (protected) set from string and radix
function bnpFromString(s,b) {
    var k;
    if(b == 16)
        k = 4;
    else if(b == 8)
        k = 3;
    else if(b == 256)
        k = 8; // byte array
    else if(b == 2)
        k = 1;
    else if(b == 32)
        k = 5;
    else if(b == 4)
        k = 2;
    else {
        this.fromRadix(s,b);
        return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
        var x = (k==8)?s[i]&0xff:intAt(s,i);
        if(x < 0) {
            if(s.charAt(i) == "-")
                mi = true;
            continue;
        }
        mi = false;
        if(sh == 0)
            this[this.t++] = x;
        else if(sh+k > this.DB) {
            this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
            this[this.t++] = (x>>(this.DB-sh));
        } else
            this[this.t-1] |= x<<sh;
        sh += k;
        if(sh >= this.DB)
            sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
        this.s = -1;
        if(sh > 0)
            this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi)
        BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c)
        --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
    if(this.s < 0)
        return "-"+this.negate().toString(b);
    var k;
    if(b == 16)
        k = 4;
    else if(b == 8)
        k = 3;
    else if(b == 2)
        k = 1;
    else if(b == 32)
        k = 5;
    else if(b == 4)
        k = 2;
    else
        return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) > 0) {
            m = true;
            r = int2char(d);
        }
        while(i >= 0) {
            if(p < k) {
                d = (this[i]&((1<<p)-1))<<(k-p);
                d |= this[--i]>>(p+=this.DB-k);
            } else {
                d = (this[i]>>(p-=k))&km;
                if(p <= 0) {
                    p += this.DB;
                    --i;
                }
            }
            if(d > 0)
                m = true;
            if(m)
                r += int2char(d);
        }
    }
    return m?r:"0";
}

// (public) -this
function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this,r);
    return r;
}

// (public) |this|
function bnAbs() {
    return (this.s<0)?this.negate():this;
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0)
        return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0)
        return (this.s<0)?-r:r;
    while(--i >= 0)
        if((r=this[i]-a[i]) != 0)
            return r;
    return 0;
}

// returns bit length of the integer x
function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) {
        x = t;
        r += 16;
    }
    if((t=x>>8) != 0) {
        x = t;
        r += 8;
    }
    if((t=x>>4) != 0) {
        x = t;
        r += 4;
    }
    if((t=x>>2) != 0) {
        x = t;
        r += 2;
    }
    if((t=x>>1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
    if(this.t <= 0)
        return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i)
        r[i+n] = this[i];
    for(i = n-1; i >= 0; --i)
        r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i)
        r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
        r[i+ds+1] = (this[i]>>cbs)|c;
        c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i)
        r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) {
        r.t = 0;
        return;
    }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
        r[i-ds-1] |= (this[i]&bm)<<cbs;
        r[i-ds] = this[i]>>bs;
    }
    if(bs > 0)
        r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
        c += this[i]-a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
    }
    if(a.t < this.t) {
        c -= a.s;
        while(i < this.t) {
            c += this[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
        }
        c += this.s;
    } else {
        c += this.s;
        while(i < a.t) {
            c -= a[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
        }
        c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1)
        r[i++] = this.DV+c;
    else if(c > 0)
        r[i++] = c;
    r.t = i;
    r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0)
        r[i] = 0;
    for(i = 0; i < y.t; ++i)
        r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s)
        BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0)
        r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
        var c = x.am(i,x[i],r,2*i,0,1);
        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
            r[i+x.t] -= x.DV;
            r[i+x.t+1] = 1;
        }
    }
    if(r.t > 0)
        r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0)
        return;
    var pt = this.abs();
    if(pt.t < pm.t) {
        if(q != null)
            q.fromInt(0);
        if(r != null)
            this.copyTo(r);
        return;
    }
    if(r == null)
        r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);  // normalize modulus
    if(nsh > 0) {
        pm.lShiftTo(nsh,y);
        pt.lShiftTo(nsh,r);
    } else {
        pm.copyTo(y);
        pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0)
        return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y); // "negative" y so we can replace sub with am later
    while(y.t < ys)
        y[y.t++] = 0;
    while(--j >= 0) {
        // Estimate quotient digit
        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {  // Try it out
            y.dlShiftTo(j,t);
            r.subTo(t,r);
            while(r[i] < --qd)
                r.subTo(t,r);
        }
    }
    if(q != null) {
        r.drShiftTo(ys,q);
        if(ts != ms)
            BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0)
        r.rShiftTo(nsh,r);    // Denormalize remainder
    if(ts < 0)
        BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        a.subTo(r,r);
    return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) {
    this.m = m;
}

function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0)
        return x.mod(this.m);
    else
        return x;
}

function cRevert(x) {
    return x;
}

function cReduce(x) {
    x.divRemTo(this.m,null,x);
}

function cMulTo(x,y,r) {
    x.multiplyTo(y,r);
    this.reduce(r);
}

function cSqrTo(x,r) {
    x.squareTo(r);
    this.reduce(r);
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
    if(this.t < 1)
        return 0;
    var x = this[0];
    if((x&1) == 0)
        return 0;
    var y = x&3;      // y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;    // y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;  // y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;   // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;      // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        this.m.subTo(r,r);
    return r;
}

// x/R mod m
function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
    while(x.t <= this.mt2)    // pad x so am has enough room later
        x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var j = x[i]&0x7fff;
        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
        // use am to combine the multiply-shift-add into one call
        j = i+this.m.t;
        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
        // propagate carry
        while(x[j] >= x.DV) {
            x[j] -= x.DV;
            x[++j]++;
        }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0)
        x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) {
    x.squareTo(r);
    this.reduce(r);
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) {
    x.multiplyTo(y,r);
    this.reduce(r);
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() {
    return ((this.t>0)?(this[0]&1):this.s) == 0;
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1)
        return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
        z.sqrTo(r,r2);
        if((e&(1<<i)) > 0)
            z.mulTo(r2,g,r);
        else {
            var t = r;
            r = r2;
            r2 = t;
        }
    }
    return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven())
        z = new Classic(m);
    else
        z = new Montgomery(m);
    return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
function force_Update_checkUpdateStatus() {
    getAjaxData('api/online-update/status', function($xml) {
        var update_ret = xml2object($xml);
        if (update_ret.type == 'response') {
            force_Update_CurrentComponentStatus = parseInt(update_ret.response.CurrentComponentStatus, 10);
            force_Update_DownloadProgressStatus = parseInt(update_ret.response.DownloadProgress, 10);
        }
    }, {
        errorCB: function() {
            setTimeout(force_Update_checkUpdateStatus, ONLINE_UPDATE_STATUS_INTERVAL);
        },
        sync: true
    }
    );
}
function creatHeader() {
    var headHtml = '\
    <div id="new_logo">\
        <a href="home.html" style="background: none !important;"><img src="../res/logo.gif"></a>\
    </div>\
    <div id="new_switch">\
        <div id="new_switch_title"></div>\
        <div id="new_switch_bg" class="new_switch_bg">\
            <div id="new_switch_point"></div>\
        </div>\
        <div id="new_switch_content"></div>\
    </div>\
    <div id="new_phone_number">\
    </div>\
    <div id="new_nav">\
        <ul class="new_nav">\
            <li id="new_nav_menu" style="position:relative;">\
                <span></span>\
                <span class="triangle"></span>\
				<div class="new_nav_sub">\
                <ul class="submenu">\
                    <li>\
                        <div id="new_nav_menu_home">\
                            <a class="goto" href="home.html"></a>\
                            <div class="new_nav_menu_bg"></div>\
                        </div>\
                    </li>\
                    <li>\
                        <div id="new_nav_menu_deviceinformation">\
                            <a href="deviceinformation.html"></a>\
                            <div class="new_nav_menu_bg"></div>\
                        </div>\
                    </li>\
                    <li>\
                        <div id="new_nav_menu_statistics">\
                            <a href="statistic.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_header_menu_statistics.png" width="34" height="34"/></div>\
                        </div>\
                    </li>\
                    <!--<li>\
                        <div id="new_nav_menu_wallet">\
                            <a href="payment.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_header_menu_wallet.png" width="34" height="34"/></div>\
                        </div>\
                    </li>-->\
                    <li>\
                        <div id="new_nav_menu_setting">\
                            <a href="mobileconnection.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_header_menu_setting.png" width="34" height="34"/></div>\
                        </div>\
                    </li>\
                    <li>\
                        <div id="new_nav_menu_sms">\
                            <a href="smsinbox.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_header_menu_sms.png" width="34" height="34"/></div>\
                        </div>\
                    </li>\
                    <li>\
                        <div id="new_nav_menu_pb">\
                            <a href="phonebook.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_header_nav_user.png" width="54" height="54" style="position: relative;top: -11px;left: -10px;"/></div>\
                        </div>\
                    </li>\
                    <li>\
                        <div id="new_nav_menu_ussd">\
                            <a href="ussd.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_sms_menu_ussd.png" width="34" height="34"/></div>\
                        </div>\
                    </li>\
                    <li>\
                        <div id="new_nav_menu_stk">\
                            <a href="stk.html"></a>\
                            <div class="new_nav_menu_bg"><img src="../res/new_header_menu_card.png" width="54" height="54" style="position: relative;top: -10px;left: -10px;"/></</div>\
                        </div>\
                    </li>\
                    <!--<li>\
                        <div id="new_nav_menu_mts_apps">\
                            <a class="goto" href="http://www.mts.ru/mob_connect/entertainment/all_for_tel/mtsapps/" target="_blank"></a>\
                            <div class="new_nav_menu_bg"></div>\
                        </div>\
                    </li>-->\
                </ul>\
				<!--<iframe width="240" height="360" frameborder="0" scrolling="no" style="border:none;border:0;background:none;background-color:transparent;position:absolute;top:50px;left:0;"></iframe>-->\
            </div>\
			</li>\
            <li id="sim_signal_gif" class="nav03" href="mobilenetworksettings.html"></li>\
            <li id="new_nav_signal_text" href="mobilenetworksettings.html"></li>\
            <li id="new_nav_change"  href="statistic.html">\
                <div class="new_nav_image"><img src="../res/new_header_nav_change.png" width="34" height="34"/></div>\
                <div class="new_nav_text">\
                    <span class="new_nav_text_top"></span>\
                    <span class="new_nav_text_bottom">\
                        <td id="revicedsent_date">\
                            <label class="list_right" id="TotalDownload" style="display:block;float:left;"></label>\
                            <label style="display:block;float:left;">/</label>\
                            <label class="list_right" id="TotalUpload"></label>\
                        </td>\
                    </span>\
                </div>\
            </li>\
            <li id="new_nav_up"  href="statistic.html">\
                <div class="new_nav_image"><img src="../res/new_header_nav_up.png" width="34" height="34"/></div>\
                <div class="new_nav_text">\
                    <span class="new_nav_text_top"></span>\
                    <span class="new_nav_text_bottom"></span>\
                </div>\
            </li>\
            <li id="new_nav_down"  href="statistic.html">\
                <div class="new_nav_image"><img src="../res/new_header_nav_down.png" width="34" height="34"/></div>\
                <div class="new_nav_text">\
                    <span class="new_nav_text_top"></span>\
                    <span class="new_nav_text_bottom"></span>\
                </div>\
            </li>\
            <li id="new_nav_email"  href="smsinbox.html">\
                <div class="new_nav_image"><img src="../res/new_header_nav_sms.png" width="34" height="34" class="img1"/></div>\
                <div class="new_nav_text">\
                    <span></span>\
                </div>\
            </li>\
            <li id="new_nav_full_sms"  href="smsinbox.html">\
                <div class="new_nav_image"><img src="../res/new_header_nav_sms_full.png" width="34" height="34" class="img1"/></div>\
                <div class="new_nav_text_sms">\
                    <span></span>\
                </div>\
            </li>\
        </ul>\
    </div>\
     ';
    $('#new_header').append(headHtml);

    if(!g_module.pb_enabled) {
        $('#new_nav_menu_pb').parent().hide();
    }

    if(!(webui_mode == 'new' && force_old_sms || webui_mode == 'new' && force_old_ussd)) {
        $('#new_nav_menu_ussd').parent().hide();
    }

    if(!g_module.stk_enabled) {
        $('#new_nav_menu_stk').parent().hide();
    }

    function setHelp() {
        var $help = $('#all_content .help').detach();
		if(current_href == 'nocard'){
			$help = $('#all_content .language').detach();
		}
        if ($help.get(0)) {
            $('#new_header').append($help);
        } else {
            setTimeout(setHelp, 100);
        }
    }
    if(webui_mode == 'new') {
        setTimeout(setHelp, 0);
    }

    if ( LANGUAGE_DATA.current_language =="ru_ru") {
        $('#new_logo a').addClass('ru_logo');
    }
}
//create footer 
function creatFooter() {
    // var footerHtml = '\
    // <div id="new_footer_statement"></div>\
    // ';
    // $('#new_footer').append(footerHtml);

    // $('#new_footer').prepend("<a id='pravacy_policy' class='clr_gray' target='_blank'>" + IDS_label_privacy_statement + "</a>");
    // $('#pravacy_policy').attr("href","http://consumer.huawei.com/en/privacy-policy/index.htm");
    // setPrivacyPolicyUrl('#pravacy_policy');

    getAjaxData('api/device/device-feature-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_copyright_enabled = ret.response.copyright_enabled;
            if(g_copyright_enabled == '1') {
                //$('#new_footer').append("<span id='copyright_notice'><a href='/html/OPEN_SOURCE_SOFTWARE_NOTICE.txt' class='clr_gray'>"+IDS_copyright_notice+"</a></span>");
                $('#new_footer').append("<span id='copyright_notice'><a href='javascript:window.open(\"/html/switchDebugMode.html\");void(0);' class='clr_gray'>Debug Mode</a></span>");

            }
        }
    });
}
function setMainText() {
    //$('#new_switch_title').text(new_header_switch_title);

    $('#new_nav_menu_home a').text(common_home);
    $('#new_nav_menu_deviceinformation a').text('?');
    $('#new_nav_menu_setting a').text(common_settings);
    if(webui_mode == 'new' && force_old_sms || webui_mode == 'new' && force_old_ussd) {
        $('#new_nav_menu_sms a').text(sms_lable_sms);
        $('#new_nav_menu_ussd a').text(ussd_label_ussd);
    } else {
        $('#new_nav_menu_sms a').text(sms_lable_sms_ussd);
    }
    $('#new_nav_menu_wallet a').text(common_payment);
    $('#new_nav_menu_statistics a').text(connection_hilink_label_traffic_statistics);
    $('#new_nav_menu_pb a').text(pb_label_phonebook);
    $('#new_nav_menu_stk a').text(stk_label_stk);
    $('#new_nav_menu_mts_apps a').text(new_header_nav_menu_mts_apps);
    $('#new_nav_menu_second_memory a').text(new_header_nav_menu_second_memory);

    $('#new_nav_menu span:first').text(new_header_nav_menu);
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
        $('#new_nav_change .new_nav_text_top').html(common_sent + ' / ' + dialup_label_received);
    } else {
                if(LANGUAGE_DATA.current_language == 'ru_ru')
                	{$('#new_nav_change .new_nav_text_top').html(dialup_label_received + ' / '+ '<br/>&nbsp;' +dialup_label_sent);}
		  else
		  	{
                     $('#new_nav_change .new_nav_text_top').html(dialup_label_received + ' / ' + common_sent);
		   	}
    }
    $('#new_nav_up .new_nav_text_top').text(dialup_label_upload_speed);
    $('#new_nav_down .new_nav_text_top').text(dialup_label_download_speed);
    //$('#new_nav_user .new_nav_text_top').text(wlan_label_current_wifi_user);
}
function addMainEvent() {
   /* var g_network_action = {
        dataswitch: '0'
    };*/

    $('#new_switch_bg').live('click', function() {
        if(g_isPostAjax) {
            return;
        }
        if($(this).hasClass("new_switch_bg_on")) {
            g_network_action.dataswitch = '0';
        } else {
            g_network_action.dataswitch = '1';
        }
        setNetConnect(g_network_action);
    });
    function setNetConnect(g_network_action) {
        if (g_needToLogin) {
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.State != '0') { //logout
                    	g_new_switch = true;
                        showloginDialog();
                    } else {
                        setNetConnect_New();
                    }
                }
            });
        }
       else{
       setNetConnect_New();
       }
    }


    $('#new_nav_menu a').live('click', function() {
        var self = this;
        if ($(self).first().hasClass('goto')) {
            return true;
        }

        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != '0') { //logout
                    g_destnation = $(self).first().attr('href');
                    showloginDialog();
                } else {
                    g_destnation = $(self).first().attr('href');
                    gotoPageWithoutHistory(g_destnation);
                }
            }
        }, {
            sync: true
        });
        return false;
    });

	$('#menu_detail_list a').live('click', function() {
        var self = this;
        if ($(self).first().hasClass('goto')) {
            return true;
        }
		if($(self).parent().attr("id") == "setting_update" && current_href=="update")
		{
			 return true;
		}
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != '0') { //logout
                    g_destnation = $(self).first().attr('href');
                    showloginDialog();
                } else {
                    g_destnation = $(self).first().attr('href');
                    gotoPageWithoutHistory(g_destnation);
                }
            }
        }, {
            sync: true
        });
        return false;
    });
    $('#new_nav > ul > li:gt(0)').css('cursor', 'pointer');
    $('#new_nav > ul > li:gt(0)').click(function() {
        var self = this;
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != '0') { //logout
                    // console.log($(self));
                    g_destnation = $(self).attr('href');
                    showloginDialog();
                } else {
                    g_destnation = $(self).attr('href');
                    gotoPageWithoutHistory(g_destnation);
                }
            }
        }, {
            sync: true
        });
        return false;
    });
}

function setNavData() {
    getAjaxData('api/dialup/mobile-dataswitch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response' && ret.response.dataswitch == '1') {
            $('#new_switch_bg').addClass('new_switch_bg_on');
        } else {
            $('#new_switch_bg').removeClass('new_switch_bg_on');

        }
        switch (G_MonitoringStatus.response.ConnectionStatus) {
            case '900':
                $('#new_switch_content').text(dialup_label_connecting);
                break;
            case '901':
                $('#new_switch_content').text(dialup_label_connected);
                break;
            case '902':
                $('#new_switch_content').text(dialup_label_disconnected);
                break;
            default:
                if ($('#new_switch_bg').hasClass('new_switch_bg_on')) {
                    $('#new_switch_content').text(pbc_label_connect_failed);
                } else {
                    $('#new_switch_content').text(dialup_label_disconnected);
                }
        }
    });


    if (g_module.wifioffload_enable && G_StationStatus != null && WIFI_CONNECTED == G_MonitoringStatus.response.WifiConnectionStatus) {
        var totalTimesArray = getCurrentTime(G_StationStatus.response.CurrentTime);
        getLoginUitl('TotalDownload', G_StationStatus.response.RxFlux);
        getLoginUitl('TotalUpload', G_StationStatus.response.TxFlux);
        $('#TotalConnectTime').text(totalTimesArray);
    } else {
        getAjaxData('api/monitoring/traffic-statistics', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_login_function = ret.response;
                if (G_MonitoringStatus == null || MACRO_CONNECTION_CONNECTED != G_MonitoringStatus.response.ConnectionStatus) {
                    g_login_function.CurrentConnectTime = 0;
                    g_login_function.CurrentDownload = 0;
                    g_login_function.CurrentUpload = 0;
                }
                var totalTimesArray = getCurrentTime(g_login_function.CurrentConnectTime);
                getLoginUitl('TotalDownload', g_login_function.CurrentDownload);
                getLoginUitl('TotalUpload', g_login_function.CurrentUpload);
                $('#TotalConnectTime').text(totalTimesArray);
            } else {
                log.error('Load traffic-statistics data failed');
            }
        });
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

    getAjaxData('api/monitoring/traffic-statistics', function($xml) {
        var traffic_ret = xml2object($xml);
        if ('response' == traffic_ret.type) {
            var trafficDown = traffic_ret.response.CurrentDownloadRate;
            var traffichUp = traffic_ret.response.CurrentUploadRate;
            $('#new_nav_down span.new_nav_text_bottom').text(getTrafficInfo(trafficDown));
            $('#new_nav_up span.new_nav_text_bottom').text(getTrafficInfo(traffichUp));
        }
    });

   /* if(G_MonitoringStatus.response.WifiStatus == 1) {
        $('#new_nav_user span.new_nav_text_bottom').html(G_MonitoringStatus.response.CurrentWifiUser);
    } else {
        $('#new_nav_user span.new_nav_text_bottom').html(wlan_label_no_users);
    }*/

   
    getAjaxData('api/monitoring/check-notifications', function($xml) {
			var NotificationsStatus = null;
			var ret = xml2object($xml);
			if (ret.type == 'response') {			       
				 NotificationsStatus = ret.response;
				 if(NotificationsStatus.SmsStorageFull == '1')
				 {
				 	
				     $('#new_nav_full_sms span').text(new_sms_full);
					//$('#new_nav_email .new_nav_image img').attr('src','../res/0.8s.gif');          
					$('#new_nav_full_sms .new_nav_image .img1').attr('src','../res/1020/bg.png');
					$('#new_nav_full_sms .new_nav_image').append(imgEle);
					
					 $('#new_nav_email').hide();
					 $('#new_nav_full_sms').show();
				   
				 }
				 else
				 {
			getAjaxData('api/sms/sms-count', function($xml) {
        			var sms_ret = xml2object($xml);
			        if ('response' == sms_ret.type) {
			            var smsUnread = sms_ret.response.LocalUnread;
			            $('#new_nav_email span').text(smsUnread);
			        }
					 $('#new_nav_email').show();
					 $('#new_nav_full_sms').hide();
			        if(smsUnread > 0){
			            //$('#new_nav_email .new_nav_image img').attr('src','../res/0.8s.gif');          
			            $('#new_nav_email .new_nav_image .img1').attr('src','../res/1020/bg.png');
			            $('#new_nav_email .new_nav_image').append(imgEle);
			        }else{
						$('#new_nav_email .new_nav_image .img1').attr('src','../res/new_header_nav_sms.png');
						if($('.email_img2')){
							$('.email_img2').remove();
						}
					}
    			});
				 }
			 }
	  });
 
    var mynumber = undefined;
    getAjaxData('api/device/information', function($xml) {
        var ret = xml2object($xml);
        if (('response' == ret.type) && (ret.response.Msisdn != '')) {
            mynumber = ret.response.Msisdn;
        }
    }, {
        sync: true
    });

    if (typeof(mynumber) != 'undefined') {
        $('#my_number').show();
        $('#MyNumber').text(mynumber);
        $('#new_phone_number').html('<center><table style="position: relative;top: -20px"><tr><td><img src="../res/new_header_nav_user.png" width="64" height="64"></td><td><span style="font-size: 13px;font-weight: bold;">' + system_label_my_number + common_colon + '</span><br><span style="font-size: 12px;">' + mynumber + '</span></td></tr></table></center>');
    } else {
        $('#my_number').hide();
    /*if(G_MonitoringStatus.response.ConnectionStatus == '901') {
        if ($('#new_phone_number iframe').length === 0) {
            $('#new_phone_number').html('<iframe class="b-iframe_header_user" src="http://login.mts.ru/profile/header?ref=http%3A//www.mts.ru/&scheme=http&service=lk&style=2015v3" width="296" height="80" frameborder="0" scrolling="no" allowtransparency="true" style="overflow:hidden"></iframe>');
            $('#new_phone_number').css('top','28px');
        }
    } else {*/
        $('#new_phone_number').html('');
    }

    setTimeout(setNavData, 2000);
}

//统一输入框宽高度
function input_area(e){
    e.css({
        'width':'240px',
        'height':'27px',
        'padding':'0',
        'paddingLeft':'10px',
        'backgroundColor':'transparent',
        'border':'none',
        'border':'1px solid #a1a1a1',
        'lineHeight':'100%'
    });
}

var imgEle = document.createElement('img');
    imgEle.setAttribute('src','../res/1020/msg.gif');
    imgEle.setAttribute('class','email_img2');
    imgEle.setAttribute('height','12px');
    imgEle.setAttribute('width','15px');
    $(imgEle).css({
        'position': 'absolute',
        'top': '50%',
        'margin-top': '-6px',
        'left': '17px'
    });

$(document).ready(function () {
    if(webui_mode == 'old') {
        $('head').append('<link type="text/css" rel="stylesheet" href="../css/main.old.css" />');
        $('#wrapper').attr('style', 'width: 956px !important;margin : 0 auto !important;border: none !important;');
    } else {
        $('body #all_content').before('<div id="new_webui"></div>');
        $('#new_webui').append('<div id="new_header"></div>');
        $('#new_webui').append('<div id="new_body"></div>');
        $('body').append('<div id="new_footer"></div>');

        $('#header').css('display', 'none');
        $('#footer').css('display', 'none');
    }

    creatHeader();
    setMainText();
   addMainEvent();

    setNavData();
// Uniform button style
    $('input[type="button"]').css({
       // 'backgroundColor':'#fff',
       // 'color':'rgb(227,5,16)',
       // 'border':'1px solid rgb(227,5,16)'
    });
 //The button mouseover style
    $('input[type="button"]').mouseover(function(){
        $(this).css({
         //   'backgroundColor':'rgb(227, 5, 16)',
         //   'color':'#fff',
         //   'border':'1px solid #fff'
        });
    });
    $('input[type="button"]').mouseout(function(){
        $(this).css({
          //  'backgroundColor':'#fff',
         //   'color':'rgb(227,5,16)',
         //   'border':'1px solid rgb(227,5,16)'
        });
    });
});
function getTrafficInfo(bit) {
    var final_number = 0;
    var final_str = '';
    bit *= 8;
    if (g_monitoring_dumeter_kb > bit) {
        final_number = formatFloat(parseFloat(bit), 2);
        final_str = final_number + ' ' + common_unit_byteps;
    } else if (g_monitoring_dumeter_kb <= bit && g_monitoring_dumeter_mb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_kb), 2);
        final_str = final_number + ' ' + common_unit_kbps;
    } else if (g_monitoring_dumeter_mb <= bit && g_monitoring_dumeter_gb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_mb), 2);
        final_str = final_number + ' ' + common_unit_mbps;
    } else if (g_monitoring_dumeter_gb <= bit && g_monitoring_dumeter_tb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_gb), 2);
        final_str = final_number + ' ' + common_unit_gbps;
    } else {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_tb), 2);
        final_str = final_number + ' ' + common_unit_tbps;
    }
    return final_str;
}

function setNetConnect_New ()
{
	
        	g_isPostAjax = true;
        	var dialup_xml = object2xml('request', g_network_action);
                        saveAjaxData('api/dialup/mobile-dataswitch', dialup_xml, function($xml) {
                            var dialup_ret = xml2object($xml);
                            g_isPostAjax = false;
                            if (isAjaxReturnOK(dialup_ret)) {
                                if('0' == g_network_action.dataswitch) {
                                    $('#new_switch_bg').removeClass('new_switch_bg_on');
                                } else {
                                    $('#new_switch_bg').addClass('new_switch_bg_on');
                                }
                                log.debug('api/dialup/mobile-dataswitch ok');
                            } else {
                                log.debug('api/dialup/mobile-dataswitch error');
                                showInfoDialog(common_failed);
                            }
                            if ($('#new_switch_bg').hasClass('new_switch_bg_on')) {
                                $('#new_switch_content').text(dialup_label_connecting);
                            } else {
                                $('#new_switch_content').text(dialup_label_disconnected);
                            }
                        });
        
}
function do_restore_unlogin() {
     var reg = null;
     var LimitText = /^([A-Z]|[a-z]|[\d])*$/;
    var sn_value = $.trim($("#txt_serial_number").val());
    clearAllErrorLabel();
    if(sn_value == "") {
        $('#txt_serial_number').val('');
        $('#txt_serial_number').focus();
        showErrorUnderTextbox('txt_serial_number', settings_hint_serial_number_empty);
        return;
    }
     if (!LimitText.test(sn_value) || typeof(sn_value) == 'undefined') {
          $('#txt_serial_number').val('');
        $('#txt_serial_number').focus();
          showErrorUnderTextbox('txt_serial_number', system_hint_wrong_serial_number);
        return;
     }
    var request = {
        SN: sn_value
    };
    var DEFAULT_GATEWAY_IP = '';
    // get current settings gateway address
    getConfigData('config/lan/config.xml', function($xml) {
        var ret = xml2object($xml);
        if ('config' == ret.type) {
            DEFAULT_GATEWAY_IP = ret.config.dhcps.ipaddress;
        }
    }, {
        sync: true
    }
    );
    var xmlstr = object2xml('request', request);
    log.debug('xmlstr = ' + xmlstr);
    saveAjaxData('api/device/restore-default', xmlstr, function($xml) {
        log.debug('saveAjaxData successed!');
        var xmlstr = xml2object($xml);
        if (isAjaxReturnOK(xmlstr)) {
            clearDialog();
            g_main_displayingPromptStack.pop();
            showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
            
            ping_setPingAddress(DEFAULT_GATEWAY_IP);
            setTimeout(startPing, 50000);
        } else {
            if (xmlstr.type == 'error') {
                if (xmlstr.error.code == "103024") {//SN check failed
                    showErrorUnderTextbox('txt_serial_number', system_hint_wrong_serial_number);
                    $('#txt_serial_number').val('');
                    $('#txt_serial_number').focus();
                } else if (xmlstr.error.code == "103025") {//SN check failed up to 3 times
                    showErrorUnderTextbox('txt_serial_number', system_hint_wrong_serial_number_max);
                    $('#txt_serial_number').focus();
                    $('#txt_serial_number').val('');
                } else if (xmlstr.error.code == "100005") {//SN check failed
                    showErrorUnderTextbox('txt_serial_number', system_hint_wrong_serial_number);
                    $('#txt_serial_number').focus();
                    $('#txt_serial_number').val('');
                } else {
                    showInfoDialog(common_failed);
                }
            }
            return false;
        }
    });
    //return false;
}

function do_restore() {
    clearDialog();
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    var request = {
        Control: 2
    };
    var DEFAULT_GATEWAY_IP = '';
    // get current settings gateway address
    getConfigData('config/lan/config.xml', function($xml) {
        var ret = xml2object($xml);
        if ('config' == ret.type) {
            DEFAULT_GATEWAY_IP = ret.config.dhcps.ipaddress;
        }
    }, {
        sync: true
    }
    );
    var xmlstr = object2xml('request', request);
    log.debug('xmlstr = ' + xmlstr);
    saveAjaxData('api/device/control', xmlstr, function($xml) {
        log.debug('saveAjaxData successed!');
        var xmlstr = xml2object($xml);
        if (isAjaxReturnOK(xmlstr)) {
            ping_setPingAddress(DEFAULT_GATEWAY_IP);
            setTimeout(startPing, 50000);
        } else {
            closeWaitingDialog();
            showInfoDialog(common_failed);
            return false;
        }
    });
    //return false;
}

function restore() {
    clearTimeout(g_decive_timer);
    clearTimeout(g_simcard_timer);
    clearTimeout(g_heart_beat_timer);
    /*After send "api/device/control" cmd, server will't response webui request.
     So delay 1 second.*/
    if (g_needToLogin) {
        getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != 0) { //logout
                    do_restore_unlogin();
                } else { //login
                    do_restore();
                }
            }
        }, {
            sync: true
        });
    } else {
        do_restore();
    }
}


function showRestoreDialog() {
    $('#div_wrapper').remove();
    $('.login_dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_restore + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='canvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table'>";
    dialogHtml += "               <div class='login'>";
    dialogHtml += "               <div id='username_wrapper_home'>";
    dialogHtml += '                   <p>' + system_label_serial_number + common_colon + '</p>';
    dialogHtml += "                   <span><input type='text' class='input' id='txt_serial_number'  maxlength='20'/></span>";
    dialogHtml += '               </div>';
    /* dialogHtml += "               <div>";
    dialogHtml += '                  <lable class="label_left" style="text-align:left">&nbsp;</lable><br/><lable class="label_left" style="text-align:left">&nbsp;</lable>';
    dialogHtml += '               </div>';  */
    dialogHtml += "               <div class='serial_number_style'>";
    dialogHtml += '               <lable class="label_left" style="text-align:left">' + common_restore_inform + '</lable>';
    dialogHtml += '               </div>';
    dialogHtml += '               </div>';
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table_bottom'>";
    dialogHtml += "              <span class='button_wrapper pop_login'>";
    dialogHtml += "                  <input id='pop_restore' class='button_dialog' type='button' value='"+common_restore+"'/></span>";

    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
    dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='"+common_cancel+"'/></span>";

    dialogHtml += '       </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("canvas");
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
        $(".button_wrapper input").css("padding-top","2px");
        $(".login_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml="<img src='../res/new_del.png' title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
        $(".dialog_close_btn").css("top","7px");
    } else {
        var canvas = document.getElementById("canvas");
        draw(canvas);
    }
    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('pop_login');

    $('#txt_serial_number').focus();

    disableTabKey();
}

function GetPLMN_main() {
    getAjaxData('api/net/current-plmn', function($xml) {
        var plmn_ret = xml2object($xml);
        var plmn_name = '';
        if ('response' == plmn_ret.type) {
            if (plmn_ret.response.ShortName.length > 0)
                plmn_name = plmn_ret.response.ShortName;
            else if (plmn_ret.response.FullName.length > 0)
                plmn_name = plmn_ret.response.FullName;
            if (G_MonitoringStatus != null &&
                typeof(G_MonitoringStatus.response) != 'undefined' &&
                parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 &&
                parseInt(G_MonitoringStatus.response.ServiceStatus, 10) == SERVICE_STATUS_AVAIABLE)
                plmn_name += " " + IDS_dialup_label_roaming;
        }
        $('#index_plmn_name_main').text(plmn_name);
        $('#new_switch_title').text(plmn_name);
    });
}

if(LANGUAGE_DATA.current_language == "ru_ru") {
	var system_label_modsettings = "Настройки модификаций";
	var system_label_add_webui_init = "Установка webui_init";
	var system_label_add_webui_init_desc = "Для правильной работы веб-интерфейса необходимо установить webui_init, в противном случае Вам будут доступны не все модификации.";
    var system_label_add_webui_init_os = "Операционная система";
    var system_label_add_webui_init_archive_notice = "Для распаковки GZip-архива под Windows можно использовать <a href=\"http://www.bandisoft.com/bandizip/ru/\">Bandizip (кликабельно)</a>.";
	var system_label_add_webui_init_download = "Скачать установщик";
} else {
	var system_label_modsettings = "Mod Settings";
	var system_label_add_webui_init = "webui_init installation";
	var system_label_add_webui_init_desc = "For the correct web interface work it is necessary to install webui_init, otherwise not all modifications will be available to you.";
    var system_label_add_webui_init_os = "Operating system";
    var system_label_add_webui_init_archive_notice = "For unpacking a GZip Archive under Windows it is possible to use <a href=\"http://www.bandisoft.com/bandizip/\">Bandizip (clickable)</a>.";
	var system_label_add_webui_init_download = "Download installer";
}

function isFirmwareSupportsModule(url) {
	var support = false;
	getAjaxData(url, function($xml) {
		var ret = xml2object($xml);
		if (ret.error.code != '100002') {
			support = true;
		}
	}, {
		sync: true
	});
	return support;
}

function addWebUIInitDialog() {
	call_dialog(system_label_add_webui_init, '<div>' + system_label_add_webui_init_desc + '</div><table width="570" border="0" cellpadding="0" cellspacing="0"><tr><td height="32">' + system_label_add_webui_init_os + common_colon + '</td><td><select id="add_webui_init_os" class="input_select"><option value="windows">Windows</option><option value="linux">Linux</option></select></td></tr></table><div>' + system_label_add_webui_init_archive_notice + '</div><a id="add_webui_init_download" style="display:none;"></a>', system_label_add_webui_init_download, 'pop_Download', common_close, 'pop_Close');
	if($('#add_webui_init_os').val() == 'windows') {
		$('#add_webui_init_download').attr('href', '/add_webui_init.exe.gz');
		$('#add_webui_init_download').attr('download', 'add_webui_init.exe.gz');
	} else if($('#add_webui_init_os').val() == 'linux') {
		$('#add_webui_init_download a').attr('href', '/add_webui_init.sh.gz');
		$('#add_webui_init_download a').attr('download', 'add_webui_init.sh.gz');
	}
	$('#add_webui_init_os').change(function() {
		if($(this).val() == 'windows') {
			$('#add_webui_init_download').attr('href', '/add_webui_init.exe.gz');
			$('#add_webui_init_download').attr('download', 'add_webui_init.exe.gz');
		} else if($(this).val() == 'linux') {
			$('#add_webui_init_download').attr('href', '/add_webui_init.sh.gz');
			$('#add_webui_init_download').attr('download', 'add_webui_init.sh.gz');
		}
	});
	$('#pop_Download').click(function() {
		document.querySelector('#add_webui_init_download').click();
	});
	$('#pop_Close').click(clearDialog);
}

function getUserConfig() {
	var config = {};
	getConfigData('config/global/user_config.xml', function($xml) {
		var ret = xml2object($xml);
		if (typeof(ret.config) != 'undefined')
			config = ret.config;
	}, {
		sync: true
	});
	getConfigData('config/global/user_config.data.xml', function($xml) {
		var ret = xml2object($xml);
		if (typeof(ret.config) != 'undefined')
			config = ret.config;
	}, {
		sync: true
	});
	return config;
}
