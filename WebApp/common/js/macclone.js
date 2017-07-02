
var g_mac_addressData = null;
var current_MAC_Address = null;
var host_MAC_Address = null;
var g_default_mac_address = null;
function macclone_initPage(){
	 getAjaxData('api/cradle/mac-info', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_mac_addressData = ret.response;
            $('#ethernet_curr_mac_address').val(g_mac_addressData.currentmac);
            $('#ethernet_host_mac_address').val(g_mac_addressData.hostmac);
        }
        else{
            showInfoDialog(common_failed);
            log.error("REDIRECT : Load api/cradle/mac-info file failed");
            $('#ethernet_curr_mac_address').val('');
            $('#ethernet_host_mac_address').val('');
        }
	},{
        sync: true
    });
    
}
// validate format of mac address
function wan_isValidMacAddress(macAddress) {
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
			}
			else {
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
function macclone_checkMac() {
	var checkResult = true;
	var currMacAddress = $.trim($('#ethernet_curr_mac_address').val());
	
	if (0 == currMacAddress.length || currMacAddress == null){
		$('#ethernet_curr_mac_address').focus();
		$('#ethernet_curr_mac_address').val('');
		showErrorUnderTr('mac_error_msg',IDS_mac_clone_mac_address_empty);
		checkResult = false;
	}
	else if ((currMacAddress.length>0) && (!wan_isValidMacAddress(currMacAddress)))
	{
		$('#ethernet_curr_mac_address').focus();
		$('#ethernet_curr_mac_address').val('');
		showErrorUnderTr('mac_error_msg',wlan_hint_mac_address_invalid);
		checkResult = false;
	}
	return checkResult;
}

function macReset(){
	clearAllErrorLabel();
	getAjaxData('api/cradle/factory-mac', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_default_mac_address = ret.response;
            $('#ethernet_curr_mac_address').val(g_default_mac_address.factorymac);
        }
        else{
            showInfoDialog(common_failed);
            log.error("REDIRECT : Load api/cradle/factory-mac file failed");
            $('#ethernet_curr_mac_address').val('');
        }
	},{
        sync: true
    });
	button_enable('apply_button', '1');
}

function macClone(){
	clearAllErrorLabel();
	host_MAC_Address = $('#ethernet_host_mac_address').val();
	if ($.trim(host_MAC_Address).length <= 0){
		return;
	}
	else{
		$('#ethernet_curr_mac_address').val(host_MAC_Address);
	    button_enable('apply_button', '1');
	}
}

function macCloneApply(){
	
	if (!isButtonEnable('apply_button'))
    {
        return;
    }
    clearAllErrorLabel();
    var macValid = macclone_checkMac();
    if (!macValid){
        return;
    }
   
	var currentMac = $.trim($('#ethernet_curr_mac_address').val());
	var request = {
		currentmac : currentMac
	};
    button_enable('apply_button', '0');
	var xmlstr = object2xml('request', request);
	saveAjaxData('api/cradle/current-mac', xmlstr, function($xml) {
	var ret = xml2object($xml);
	if (isAjaxReturnOK(ret))
	{
		button_enable('apply_button', '0');
		$('#ethernet_curr_mac_address').val(currentMac);
		showInfoDialog(common_success);
	}
	else
	{
		showInfoDialog(common_failed);
		macclone_initPage();
		button_enable('apply', '1');
	}
	});
}
/**********************************After loaded (common)************/
$(document).ready(function() {
    button_enable('apply_button', '0');
	$('input').bind('change input paste cut keydown', function(e) {
		if(MACRO_KEYCODE != e.keyCode){
			button_enable('apply_button', '1');
		}
        
    });
    
	macclone_initPage();
	
	$('#reset_button').bind('click',macReset);
	$('#clone_button').bind('click',macClone);
	$('#apply_button').bind('click',macCloneApply);
});
