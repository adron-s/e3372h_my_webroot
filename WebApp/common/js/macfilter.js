var FWMACFILTER_POLICY_DISABLED = 0;
var FWMACFILTER_POLICY_ALLOW = 1;
var FWMACFILTER_POLICY_DENY = 2;
var MAX_MAC_FILTER_NUM = 10;

var g_MacfilterData = 
{
	policy: FWMACFILTER_POLICY_DISABLED,
	macInfo: []
};

function initPage() {
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            firewall_status = ret.response;
        }
    }, {
        sync: true
    });

    getAjaxData('api/security/mac-filter', function($xml) {
		var ret = xml2object($xml);
		var policy = ret.response.policy;
        var filters = ret.response.macfilters.macfilter;
		
		if(0 == policy) {
			g_MacfilterData.policy = FWMACFILTER_POLICY_DENY;
		} else if(1 == policy) {
			g_MacfilterData.policy = FWMACFILTER_POLICY_ALLOW;
		} else {
			g_MacfilterData.policy = FWMACFILTER_POLICY_DISABLED;
		}
		
        if (filters) {
			g_MacfilterData.macInfo = CreateArray(filters);
			
			if(filters.length == 0 || 0 == g_MacfilterData.macInfo[0].status) {
				g_MacfilterData.policy = FWMACFILTER_POLICY_DISABLED;
			}
        } else {
			g_MacfilterData.policy = FWMACFILTER_POLICY_DISABLED;
		}

        setData();

        if (firewall_status != null && firewall_status.FirewallMainSwitch == 0) {
			$('#fw_mac_policy').attr('disabled', 'disabled');
			$('#fw_mac_list :input').attr('disabled', 'disabled');
            showInfoDialog(IDS_security_message_firewall_disabled);
            return false;
        }
        if (firewall_status != null && firewall_status.firewallmacfilterswitch == 0) {
			$('#fw_mac_policy').attr('disabled', 'disabled');
			$('#fw_mac_list :input').attr('disabled', 'disabled');
            showInfoDialog(IDS_security_macfilter_message_disabled);
            return false;
        }
    }, {
        sync: true
    });
}

// disable/enable MAC address
function fwmacfilter_SetInputAttr() {
    var selectedStatus = $('#fw_mac_policy').val();
    if (selectedStatus == FWMACFILTER_POLICY_DISABLED) {
        clearData();
        $('#fw_mac_list :input').attr('disabled', 'disabled');
    } else {
        $('#fw_mac_list :input').removeAttr('disabled');
    }
}

function clearData() {
    $('#fw_mac_list :input').val('');
}

function setData()
{
	var i = 0;

	$('#fw_mac_policy').val(g_MacfilterData.policy); 

	if(FWMACFILTER_POLICY_DISABLED != g_MacfilterData.policy) {
		for(i; MAX_MAC_FILTER_NUM > i; i++) {
			if(g_MacfilterData.macInfo.length > i) {
				$('#input_fwMacFilterMac' + i).val(g_MacfilterData.macInfo[i].value);
			} else {
				$('#input_fwMacFilterMac' + i).val('');
			}
		}
	}
	
	fwmacfilter_SetInputAttr();
}

function getData() {
    var i = 0;
    g_MacfilterData.policy = $('#fw_mac_policy').val();
	g_MacfilterData.macInfo = [];
	
	if (FWMACFILTER_POLICY_DISABLED == g_MacfilterData.policy) {
		return;
	}
	
	for(i; MAX_MAC_FILTER_NUM > i; i++) {
		var macValue = $.trim($('#input_fwMacFilterMac' + i).val());
		if('' == macValue) {
			continue;
		}
		
		var filter =
		{
			value: macValue,
			status: 1
		};
		g_MacfilterData.macInfo.push(filter);
	}
}

// validate format of mac address
function isValidMacAddress(macAddress) {
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

function checkAllMac() {
    var checkResult = true;
    var emptyMacCount = 0;
    $('#fw_mac_list :input').each( function(i) {
        if ((($.trim($(this).val()).length > 0) && (!isValidMacAddress($(this).val())))
        || (0 == $.trim($(this).val()).length && $(this).val().length > 0)) {
            $(this).focus();
            showErrorUnderTextbox('input_fwMacFilterMac' + i, wlan_hint_mac_address_invalid);
            checkResult = false;
        } else if (0 == $(this).val().length) {
            emptyMacCount++;
        }
    });
    if (10 == emptyMacCount) {
        var macFilterStatus = $('#fw_mac_policy').val();
        if (FWMACFILTER_POLICY_DISABLED != macFilterStatus) {
            showInfoDialog(wlan_hint_mac_address_invalid);
            if (!$.browser.msie) {
                $('#input_fwMacFilterMac0').focus();
            }
            checkResult = false;
        }
    }
    return checkResult;
}

function onApply() {
    clearAllErrorLabel();
    //function for check all mac address
    if (checkAllMac()) {
        showConfirmDialog(firewall_hint_submit_list_item, postData, function() {
        });
    }
		
}

function postData() {
    var submitObject = {};
	var MACFilterArray = [];
	var macfltStatus = 0;
	var i = 0;
	
	getData();
	
	if(FWMACFILTER_POLICY_DISABLED != g_MacfilterData.policy)
	{
		macfltStatus = 1;
	}

	for(i; MAX_MAC_FILTER_NUM > i && g_MacfilterData.macInfo.length > i; i++) {
		var filter =
		{
			value: g_MacfilterData.macInfo[i].value,
			status: macfltStatus
		};
		MACFilterArray.push(filter);
	}
	
	submitObject = {
		policy: g_MacfilterData.policy,
		macfilters: 
		{
			macfilter: MACFilterArray
		}
	};
	
	var submitData = object2xml('request', submitObject);

	saveAjaxData('api/security/mac-filter', submitData, function($xml) {
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

function checkRepeat(){
     clearAllErrorLabel();
     var ssid_mac_lists = [];
     var g_MacfilterMac = '';
     var g_MacfilterFlag = true;
     for(var i = 0 ; i< 10 ; i++ ){
         g_MacfilterMac = $.trim($('#input_fwMacFilterMac'+i).val()).toLowerCase();
         ssid_mac_lists.push(g_MacfilterMac);
     }
     for(var i =0 ;i< ssid_mac_lists.length;i++){
         for(var j = i+1 ;j< ssid_mac_lists.length ; j++){
             var strFirst = ssid_mac_lists[i];
    	  	 var strSecond = ssid_mac_lists[j];
    		 if(strFirst == strSecond && strFirst.length > 0 && strSecond.length > 0){
    			showErrorUnderTextbox('input_fwMacFilterMac' + j, wlan_label_mac_address_exist);
    			$(('#input_fwMacFilterMac'+j)).focus();
    			g_MacfilterFlag = false;
    			return;
    		}
    	}
    }
    return g_MacfilterFlag;
}
$(document).ready( function() { 
    button_enable('apply', '0');
    $('#fw_mac_list :input').val('');  
    $('#fw_mac_list :input').removeAttr('disabled');
    
    initPage();

    // Judgement if the mac filter can be edit
    $('#fw_mac_list :input').bind('input change cut paste keydown', function(e) {
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('apply', '1');
        }
    });
    
    $('#apply').click( function() {
        if (!isButtonEnable('apply')) {
            return;
        }
        if(checkRepeat()){
        	onApply();
        }
    });
        
    $('#fw_mac_policy').bind('change', function() {
        var selectedStatus = $('#fw_mac_policy').val();
        fwmacfilter_SetInputAttr();
        $('.error_message').remove();

        if (selectedStatus == g_MacfilterData.policy)
        {
            setData();
            button_enable('apply', '0');
        }
        else
        {
            clearData();
            button_enable('apply', '1');
        }
    });
});