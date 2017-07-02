
var g_cradledialInfo = null;
var g_cradlemacInfo = null;
var g_cradleconnStatus = null;
var g_cradleconnMode = null;

//Cradle Connection status
var CRADLE_CONNECTING = '900';
var CRADLE_CONNECTED = '901';
var CRADLE_DISCONNECTED = '902';
var CRADLE_DISCONNECTING = '903';
var CRADLE_CONNECTFAILED = '904';
var CRADLE_PPPOENOACCOUNT = '905';
var CRADLE_PPPOEERRORACCOUNT = '906';

var CONNECTIONSTATUS = {
    0: dialup_label_connecting,
    1: dialup_label_connected,
    2: dialup_label_disconnected,
    3: dialup_label_disconnecting,
    4: pbc_label_connect_failed,
    5: pbc_label_connect_failed,
    6: pbc_label_connect_failed
};

var CONNECTIONMODE = {
    0: common_auto,
    1: IDS_ethernet_pppoe_plus_dynamic,
    2: IDS_wan_setting_pppoe,
    3: IDS_wan_setting_dynamicip,
    4: IDS_ethernet_setting_staticip,
    5: IDS_ethernet_settings_mode_lan
};

var COMMONATUO = '0';
var LANONLY = '5';
var g_connectionStatusList = [[CRADLE_CONNECTING, CONNECTIONSTATUS[0]],[CRADLE_CONNECTED, CONNECTIONSTATUS[1]],[CRADLE_DISCONNECTED, CONNECTIONSTATUS[2]],[CRADLE_DISCONNECTING, CONNECTIONSTATUS[3]],
                             [CRADLE_CONNECTFAILED, CONNECTIONSTATUS[4]],[CRADLE_PPPOENOACCOUNT,CONNECTIONSTATUS[5]],[CRADLE_PPPOEERRORACCOUNT,CONNECTIONSTATUS[6]]]; 
var g_connectionModeList = [[0,CONNECTIONMODE[0]],[1,CONNECTIONMODE[1]],[2,CONNECTIONMODE[2]],[3,CONNECTIONMODE[3]],[4,CONNECTIONMODE[4]],[5,CONNECTIONMODE[5]]];

function wanstatus_initPage(){
    getAjaxData('api/cradle/status-info', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            G_cradleStationStatus = ret.response;
            g_cradleconnStatus = G_cradleStationStatus.connectstatus;
            g_cradleconnMode = G_cradleStationStatus.connectionmode;
            g_cradlemacInfo = G_cradleStationStatus.macaddress;
            
            if (G_cradleStationStatus.currenttime == null || G_cradleStationStatus.currenttime == '' ||isNaN(G_cradleStationStatus.currenttime)){
                G_cradleStationStatus.currenttime = 0;
            }
            var totalTime = getCurrentTime(G_cradleStationStatus.currenttime);
            $('#label_duration').text(totalTime);
            
            if (g_cradleconnStatus == null || g_cradleconnStatus == '' || isNaN(g_cradleconnStatus) 
            || g_cradleconnStatus > CRADLE_PPPOEERRORACCOUNT || g_cradleconnStatus < CRADLE_CONNECTING){
                $('#label_conn_status').text(dialup_label_disconnected);
            }else{
                $.each(g_connectionStatusList, function(n, value) {
                if (value[0] == g_cradleconnStatus){
                    $('#label_conn_status').text(value[1]);  
                }
                });
            }
            
            if (g_cradleconnMode == null || g_cradleconnMode == '' ||isNaN(g_cradleconnMode)
            || g_cradleconnMode > LANONLY || g_cradleconnMode < COMMONATUO ){
                $('#connection_mode').text(common_unknown);
            }else{
                $.each(g_connectionModeList, function(n, value) {
                if (value[0] == g_cradleconnMode){
                    $('#connection_mode').text(value[1]);
                }
                });
            }

            if (g_cradlemacInfo == null || g_cradlemacInfo == ''){
                $('#label_mac_address').text(common_unknown);
            }else{
                $('#label_mac_address').text(g_cradlemacInfo);
            }
            
            if (G_cradleStationStatus.ipaddress == null || G_cradleStationStatus.ipaddress == ''){
                $('#label_ip_address').text(common_unknown);
            }else{
                $('#label_ip_address').text(G_cradleStationStatus.ipaddress);
            }
            
            if (G_cradleStationStatus.netmask == null || G_cradleStationStatus.netmask == ''){
                $('#label_subnet_mask').text(common_unknown);
            }else{
                $('#label_subnet_mask').text(G_cradleStationStatus.netmask);
            }
            
            if (G_cradleStationStatus.gateway == null || G_cradleStationStatus.gateway == ''){
                $('#label_gateway_address').text(common_unknown);
            }else{
                $('#label_gateway_address').text(G_cradleStationStatus.gateway);
            }
            
            if (G_cradleStationStatus.primarydns == null || G_cradleStationStatus.primarydns == '' ){
                $('#primary_dns_id').text(common_unknown);
            }else{
                $('#primary_dns_id').text(G_cradleStationStatus.primarydns);
            }
            
            if (G_cradleStationStatus.secondarydns == null || G_cradleStationStatus.secondarydns == '' ){
                $('#secondary_dns_id').text(common_unknown);
            }else{
                $('#secondary_dns_id').text(G_cradleStationStatus.secondarydns);
            }
            
        }
        else{
            $('#label_duration').text(getCurrentTime(0));
            $('#label_conn_status').text(dialup_label_disconnected);
            $('#connection_mode').text(common_unknown);
            $('#label_mac_address').text(common_unknown);
            $('#label_ip_address').text(common_unknown);
            $('#label_subnet_mask').text(common_unknown);
            $('#label_gateway_address').text(common_unknown);
            $('#primary_dns_id').text(common_unknown);
            $('#secondary_dns_id').text(common_unknown);
            showInfoDialog(common_failed);
            log.error("REDIRECT:api/cradle/status-Info file failed");
        }
    }, {
        sync: true
    });
    
    setTimeout(wanstatus_initPage, g_feature.update_interval);
}

//redirectOnCondition(null, 'wanstatus');
/**********************************After loaded (common)************/
$(document).ready(function() {
    wanstatus_initPage();
});
