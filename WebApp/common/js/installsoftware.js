// JavaScript Document
var g_notificationtry_items = {
};

var g_notificationtray_is_windows = false;
var g_notificationtray_is_mac = false;
var g_assistantConfig = null;
//Save pc assistant path
var g_notificationtray_pc_assistant_path = '';

//get operate system
function get_operateSystem() {
    var ua = navigator.userAgent.toLowerCase();
    g_notificationtray_is_windows = (ua.indexOf('windows') != -1 || ua.indexOf('win32') != -1); //Window operate
    g_notificationtray_is_mac = (ua.indexOf('macintosh') != -1 || ua.indexOf('mac os x') != -1); //Mac operate
}

function getPcAssistant() {
    getAjaxData('config/pcassistant/config.xml', function($xml) {
        var assistant_ret = xml2object($xml);

        if ('config' == assistant_ret.type)
        {
            g_assistantConfig = assistant_ret;
            get_operateSystem();
            if (g_notificationtray_is_mac)
            {
                g_notificationtray_pc_assistant_path = assistant_ret.config.macpath;
                g_notificationtray_pc_assistant_path = g_notificationtray_pc_assistant_path.replace('&amp;','&');
                $('#xpsp2_download_wrapper').hide();
            }
            else
            {
                g_notificationtray_pc_assistant_path = assistant_ret.config.winpath;
                g_notificationtray_pc_assistant_path = g_notificationtray_pc_assistant_path.replace('&amp;','&');
                //$("#xpsp2_download_wrapper").show();
            }
        }
        else
        {
            g_notificationtray_pc_assistant_path = '';
        }
    });
}

$(document).ready(function() {
    getPcAssistant();
    $('#pc_assistant_install').click(function() {
        if (!isButtonEnable('pc_assistant_install'))
        {
            return;
        }
        $('#index_istall_tray').attr('src', g_notificationtray_pc_assistant_path);
    });

    $('#windows_xpsp2_upgrade_button').click(function() {
        if (!isButtonEnable('windows_xpsp2_upgrade_button'))
        {
            return;
        }
        window.open(g_assistantConfig.config.upgradepath);
    });
});



