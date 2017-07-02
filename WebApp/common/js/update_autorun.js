// JavaScript Document
var g_index_pc_assistant_path = '';
var g_index_is_windows = false;
var g_index_is_mac = false;
var g_index_is_linux = false;
var g_dhcp_ipaddress = "";

function getPcAssistantOperateSystem() {
    var ua = navigator.userAgent.toLowerCase();
    g_index_is_windows = (ua.indexOf('windows') != -1 || ua.indexOf('win32') != -1); //Window operate
    g_index_is_mac = (ua.indexOf('macintosh') != -1 || ua.indexOf('mac os x') != -1); //Mac operate
    g_index_is_linux = (ua.indexOf('linux') != -1);

}

function getDhcpIPAddress()
{
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret;
        var dhcp_value;
        ret = xml2object($xml);
        log.debug('type= ' + ret.type);
        if (ret.type == 'response')
        {
            dhcp_value = ret.response;
            g_dhcp_ipaddress = dhcp_value.DhcpIPAddress;
        }
    }); 
    if ("" == g_dhcp_ipaddress) {
        getConfigData('config/lan/config.xml', function($xml) {
            var ret = xml2object($xml);
            if ('config' == ret.type) {
                g_dhcp_ipaddress = ret.config.dhcps.ipaddress;
            }
        }, {
            sync: true
        }
        );
    }
}

function getAutorun() {
    getAjaxData('config/pcassistant/updateautorun.xml', function($xml) {
        var assistant_ret = xml2object($xml);
        if ('config' == assistant_ret.type)
        {
            if (g_index_is_mac)
            {
                g_index_pc_assistant_path = assistant_ret.config.macpath;
            }
            else if (g_index_is_linux)
            {
                g_index_pc_assistant_path = assistant_ret.config.linuxpath;
            }
            else
            {
                g_index_pc_assistant_path = assistant_ret.config.winpath;
            }
        }
        else
        {
            g_index_pc_assistant_path = '';
        }
    },{sync: true});
    g_index_pc_assistant_path = "http://" + g_dhcp_ipaddress + g_index_pc_assistant_path;
}

$(document).ready(function() {
    getPcAssistantOperateSystem();
    getDhcpIPAddress();
    $('#pc_assistant_update_download').click(function() {
        if (!isButtonEnable('pc_assistant_update_download'))
        {
            return;
        }
        else
        {
            g_index_pc_assistant_path = '';
            getAutorun();
            if (null != g_index_pc_assistant_path &&
                '' != g_index_pc_assistant_path &&
                ' ' != g_index_pc_assistant_path)
            {
                g_index_pc_assistant_path += "?" + (new Date()).getTime().toString();                
                window.location.href = g_index_pc_assistant_path;            
            }
            else
            {
                showInfoDialog(common_failed);
            }
        }
    });
    if (1 == g_feature.continue_button) {
        $('#link_login').show();
    }
    else
    {
        $('#link_login').hide();
    }
    $('#link_login').click(function() {
        window.location = HOME_PAGE_URL;
    });


});