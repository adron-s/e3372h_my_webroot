
var PBC_CONNECT_FAILED = '3';
var PBC_CONNECTING = '4';
var PBC_CONNECT_SUCCESS = '5';
var PBC_GET_STATUS_INTERVAL = 3000;
var PBC_WAITING_TIMEOUT = 180000;
var pbcGetStatusTimer = null;
var pbcWaitingTimer = null;
var pbcOffloadTimer = null;
var g_hasPopInfoDialog = false;
var g_hasWaitingDialog = false;
function find_wifi_offload_status() {
	getAjaxData('api/wlan/handover-setting', function($xml) {
		var ret = xml2object($xml);
		if ('2' == ret.response.Handover)
		{
			button_enable('button_connection', '1');
			g_hasPopInfoDialog = false;	
		} else {
			if(g_hasWaitingDialog) {		 
				closeWaitingDialog();
				g_hasWaitingDialog = false;
				clearTimeout(pbcWaitingTimer);
			    clearTimeout(pbcGetStatusTimer);
			    startLogoutTimer();
			    showInfoDialog(IDS_wps_connection);			
			}
			if (!g_hasPopInfoDialog) {				
				showInfoDialog(IDS_wps_connection);
				g_hasPopInfoDialog = true;				
			} 
			button_enable('button_connection', '0');
		}		
	});
	pbcOffloadTimer = setTimeout(find_wifi_offload_status, PBC_GET_STATUS_INTERVAL);
}

function stationwps_pbc_connect_status() {
    getAjaxData('api/wlan/wps-pbc', function($xml) {
        var ret = xml2object($xml);
        if (PBC_CONNECT_FAILED == ret.response.State) {
            closeWaitingDialog();
            g_hasWaitingDialog = false;
            clearTimeout(pbcWaitingTimer);
            button_enable('button_connection', '0');
            startLogoutTimer();
            showInfoDialog(pbc_label_connect_failed);
        } else if (PBC_CONNECT_SUCCESS == ret.response.State) {
            closeWaitingDialog();
            g_hasWaitingDialog = false;
            clearTimeout(pbcWaitingTimer);
            button_enable('button_connection', '0');
            startLogoutTimer();
            showInfoDialog(pbc_label_connect_success);    
        } else {
			pbcGetStatusTimer = setTimeout(stationwps_pbc_connect_status, PBC_GET_STATUS_INTERVAL);
            return;
        }     
    });
}

function savestationwpsPbc() {
    var pbcRequest = {
        WPSMode: '3'
    };
    var pbc_xml = object2xml('request', pbcRequest);
    button_enable('button_connection', '0');
    saveAjaxData('api/wlan/wps-pbc', pbc_xml, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            g_hasWaitingDialog = true;
            showWaitingDialog(common_waiting, pbc_label_connecting_network);
            pbcWaitingTimer = setTimeout( function() {
                closeWaitingDialog(); 
                g_hasWaitingDialog = false;
                startLogoutTimer();
                clearTimeout(pbcGetStatusTimer);               
                showInfoDialog(pbc_label_connect_failed);
                startLogoutTimer();
            },
            PBC_WAITING_TIMEOUT);
            pbcGetStatusTimer = setTimeout(stationwps_pbc_connect_status, PBC_GET_STATUS_INTERVAL);
        } else {
            if(ret.error.code==ERROR_SYSTEM_BUSY) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(pbc_label_connect_failed);
            }
        }        
    });
}
 
$(document).ready(function(){
	find_wifi_offload_status();
	$('#button_connection').click(function() {     
		if (!isButtonEnable('button_connection')) {
			return;
		}
		button_enable("button_connection", "0");
        showConfirmDialog(IDS_system_hint_connection, savestationwpsPbc, function() {});
        return false;
    });	
});