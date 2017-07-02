var g_connectionData = null;
var connectionstatus = null;
var vsim_status = '';

var g_vsim_info = '';
var vsim_checkhealth_info='';
var vsim_check_status='';

var g_timerReboot = 1000;
var roamAutoConnectEnable =0;
var vsimStatus ='';
var cradle_connect_status ='';

function updateVsimRadioStatus(vsim_status) {
	if (vsim_status == 0) {
		$("#vsimstatus").val(0);
    }else if (vsim_status == 1){
    	$("#vsimstatus").val(1);
    }else{
    	$("#vsimstatus").val(2);
    }
}

function setRoamStatus(_enable) {
    if (_enable == 1) {
    	$("[name='roam_switch']").get(0).checked=1;
    }
}


function initPage() {
    // get dialup connection
    getAjaxData('api/dialup/connection', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_connectionData = ret.response;
            roamAutoConnectEnable=g_connectionData.RoamAutoConnectEnable;
        }

    }, {
        sync: true
    });
    setRoamStatus(parseInt(g_connectionData.RoamAutoConnectEnable,10));
}

function initVsim() {   
    getAjaxData("api/vsim/operateswitch-vsim", function($xml) {
        var vsim_info = xml2object($xml);
        if("response" == vsim_info.type) {
            g_vsim_info = vsim_info.response;
            vsim_status = g_vsim_info.vsim_status;
            updateVsimRadioStatus(vsim_status);
        } else {
            showInfoDialog(common_error);
            return false;
        }
    }, {
        sync: true
    });  
}

function initCrableStatus(){
	getAjaxData("api/cradle/status-info", function($xml) {
		var cradle_info = xml2object($xml);
		if(cradle_info.type == 'response') {
            var crable_connect = cradle_info.response;
            cradle_connect_status = crable_connect.connectstatus;
        } 
        
    }, {
        sync: true
    });  
}

function initVsimStatus() {   
    getAjaxData("api/vsim/checkhealth-vsim", function($xml) {
        var vsim_checkhealth_info = xml2object($xml);
        if(vsim_checkhealth_info.type == 'response') {
            var g_vsim_checkhealth_info = vsim_checkhealth_info.response;
            vsim_check_status = g_vsim_checkhealth_info.vsim_health;
        } 
        
    }, {
        sync: true
    });  
}

function getMobile_dataswitch() {
    getAjaxData('api/monitoring/status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            var g_mobile_connectionstatus = ret.response;
            connectionstatus=g_mobile_connectionstatus.ConnectionStatus;
            
            if(connectionstatus=='901'){
	    		initVsimStatus();
	    		if(vsim_check_status!='' && vsim_check_status=='1'){
	    			closeWaitingDialog();
	    			showInfoDialog(IDS_vsim_check_status1);
	    		}else{
	    			closeWaitingDialog();
	    			showInfoDialog(IDS_vsim_check_status0);
	    		}
		}else{
			
			if(g_module.cradle_enabled ){
				initCrableStatus();
				if (cradle_connect_status == '901') {
					initVsimStatus();
					if(vsim_check_status!='' && vsim_check_status=='1'){
		    				closeWaitingDialog();
		    				showInfoDialog(IDS_vsim_check_status1);
		    			}else{
		    				closeWaitingDialog();
		    				showInfoDialog(IDS_vsim_check_status0);
		    			}
				}
				else{
					closeWaitingDialog();
	    				showInfoDialog(IDS_connection_status);
				}
				
			}else {
				closeWaitingDialog();
	    			showInfoDialog(IDS_connection_status);
			}
        }
       }
       	}, {
        errorCB: function(XMLHttpRequest, textStatus) {
            closeWaitingDialog();
		    showInfoDialog(IDS_connection_status);
            log.error('MOBILENETWORKSETTING:get api/monitoring/status file failed');
            
        }
    });
}

//Button connection or disconnection click effect

function postMoblieconnection() {
    g_connectionData.RoamAutoConnectEnable = $("[name='roam_switch']").get(0).checked ? 1 : 0;
    var newXmlString = object2xml('request', g_connectionData);
    saveAjaxData('api/dialup/connection', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            postVsim();
        }else{
            showInfoDialog(common_fail);
            initPage(); 
        }
    });
}

function postData() {
    g_connectionData.RoamAutoConnectEnable = $("[name='roam_switch']").get(0).checked ? 1 : 0;
    var newXmlString = object2xml('request', g_connectionData);
    saveAjaxData('api/dialup/connection', newXmlString, function($xml) {
        var ret = xml2object($xml);
        clearDialog();
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            vsimStatus=$("#vsimstatus").val();
            roamAutoConnectEnable=$("[name='roam_switch']").get(0).checked ? 1 : 0;
            button_enable('apply_button', '0');
        }else{
            showInfoDialog(common_fail);
            initPage(); 
        }
    });
}


function postVsim(){
	
    g_vsim_info.vsim_status = $("#vsimstatus").val();
    var send_xml = object2xml('request', g_vsim_info);
    saveAjaxData('api/vsim/operateswitch-vsim', send_xml, function($xml) {
        var ret = xml2object($xml);
        clearDialog();
		startLogoutTimer();
        if ("response" == ret.type && "OK" == ret.response) {
        	showWaitingDialog(common_waiting, update_label_device_waiting);
            do_reboot();
            button_enable('apply_button', '0');
        } else {
            showInfoDialog(common_failed);
        }
    }, {
    	
        timeout: 120000,
        errorCB: function(XMLHttpRequest, textStatus) {
            startLogoutTimer();
            closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            showInfoDialog(errorInfo);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list file failed');
            
        }
    });
}

function do_reboot() {
    var request = {
        Control: 1
    };
     // get current settings gateway address
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            var DEFAULT_GATEWAY_IP = ret.response.DhcpIPAddress;
            ping_setPingAddress(DEFAULT_GATEWAY_IP);
            setTimeout(startPing, 50000);
        }
    }, {
        sync: true
    }
    );
}

function checkHeal() {
	showWaitingDialog(common_waiting, IDS_vsim_checking_status);
	getMobile_dataswitch();
	
}

$(document).ready( function() {
    
    initVsim();
    initPage();
    button_enable('apply_button', '0');
    vsimStatus=$("#vsimstatus").val();
   if (vsimStatus==0) {
    	$("#roam_on").hide();
    }else if(vsimStatus==1){
    	$("#roam_on").hide();
    	$("#description_auto").hide();
    }else if(vsimStatus==2){
    	$("#description_auto").hide();
    }
    
    $("#vsimstatus,[name='roam_switch']").change( function() {
        button_enable('apply_button', '1');
        if(($("#vsimstatus").val()=='2')){
        	$("#description_auto").hide();
        	$("#roam_on").show();
        }else if($("#vsimstatus").val()=='0'){
        	$("#roam_on").hide();
        	$("#description_auto").show();
        }else if($("#vsimstatus").val()=='1'){
        	$("#roam_on").hide();
        	$("#description_auto").hide();
        }
        
        if($("#vsimstatus").val()==vsimStatus && (($("[name='roam_switch']").get(0).checked ? 1 : 0)==roamAutoConnectEnable || vsimStatus == 0 || vsimStatus == 1)){
			button_enable('apply_button', '0');
		}		
    });
  
    $("#button_vsim_check").click(function(){
    	if(!isButtonEnable("button_vsim_check")) {
				return;
		} 
    	checkHeal();
    });     
   	$('#apply_button').bind('click',function() {
			if(!isButtonEnable("apply_button")) {
				return;
				
			} else if($("#vsimstatus").val()!=vsimStatus && ($("#vsimstatus").val()==0 || $("#vsimstatus").val()==1)) {
				showConfirmDialog(system_hint_operation_restart_device, postVsim, function() {});
			
			} else if($("#vsimstatus").val()!=vsimStatus && ($("#vsimstatus").val()==2 && $("[name='roam_switch']").get(0).checked ? 1 : 0!=roamAutoConnectEnable)){
				showConfirmDialog(system_hint_operation_restart_device, postMoblieconnection, function() {});
				
			} else if($("#vsimstatus").val()!=vsimStatus && ($("#vsimstatus").val()==2 && ($("[name='roam_switch']").get(0).checked ? 1 : 0)==roamAutoConnectEnable)){
				showConfirmDialog(system_hint_operation_restart_device, postVsim, function() {});
			
			}else if($("#vsimstatus").val()==vsimStatus && vsimStatus==2 && $("[name='roam_switch']").get(0).checked==1){
				showConfirmDialog(dialup_hint_roam_auto_connect, postData, function() {});
				
			} else if($("#vsimstatus").val()==vsimStatus && vsimStatus==2 && $("[name='roam_switch']").get(0).checked==0){
				showConfirmDialog(firewall_hint_submit_list_item, postData, function() {});
			}
	});
});