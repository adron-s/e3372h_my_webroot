// JavaScript Document
/***********************************************dhcp (start)**********************/

var dhcp_value = null;
var g_DHCP_SERVER_ENABLE = 1;
var g_DHCP_SERVER_DISABLE = 0;
var DHCP_PING_INTERVA = 50000;
var DHCP_MIN_LEASE_TIME = 86400;
var DHCP_MAX_LEASE_TIME = 604800;
var DHCP_DEFAULT_LEASE_TIME = 86400;
var g_dhcpSubmark = '';
function createIpDialogHtml(){
	var startIpDialogHtml ="<input type='text'  id='input_dhcp_startip'  size='4' maxlength='3'/>"; 
	var endIpDialogHtml = "<input type='text'  id='input_dhcp_endip'  size='4' maxlength='3'/>";
    var inputDhcp1 = dhcp_label_dhcp_ip_address_range.replace('%s1','') ;
    var inputDhcp = inputDhcp1.replace('%s2','') ;
    var ipDialogHtml = startIpDialogHtml + inputDhcp + endIpDialogHtml;
    $("#input_dhcp_ip").append(ipDialogHtml);
}
function enableDHCP() {
    var dhcpStartIPAddressTmp = '';
    var dhcpEndIPAddressTmp = '';
    var dhcpLeaseTimeTmp = '';
    if ('' != dhcp_value.DhcpStartIPAddress && '0' != dhcp_value.DhcpStartIPAddress && '0.0.0.0' != dhcp_value.DhcpStartIPAddress)
    {
        dhcpStartIPAddressTmp = dhcp_value.DhcpStartIPAddress;
    }
    else
    {
       dhcpStartIPAddressTmp = dhcp_value.DhcpIPAddress.slice(0, dhcp_value.DhcpIPAddress.lastIndexOf('.')) + '.100';
    }
    if ('' != dhcp_value.DhcpEndIPAddress && '0' != dhcp_value.DhcpEndIPAddress && '0.0.0.0' != dhcp_value.DhcpEndIPAddress)
    {
        dhcpEndIPAddressTmp = dhcp_value.DhcpEndIPAddress;
    }
    else
    {
       dhcpEndIPAddressTmp = dhcp_value.DhcpIPAddress.slice(0, dhcp_value.DhcpIPAddress.lastIndexOf('.')) + '.200';
    }
    if ('' != dhcp_value.DhcpLeaseTime && '0' != dhcp_value.DhcpLeaseTime)
    {
        dhcpLeaseTimeTmp = dhcp_value.DhcpLeaseTime;
    }
    else
    {
        dhcpLeaseTimeTmp = 'DHCP_DEFAULT_LEASE_TIME';
    }
    var dhcpStartIPAddressList = dhcpStartIPAddressTmp.split('.');
    var dhcpEndIPAddressList = dhcpEndIPAddressTmp.split('.');
    var dhcpIPRange1 = dhcp_label_dhcp_ip_address_range.replace('%s1',dhcpStartIPAddressTmp) ;
    var dhcpIPRange = dhcpIPRange1.replace('%s2',dhcpEndIPAddressTmp) ;
    $('#input_dhcp_startip').val(dhcpStartIPAddressList[3]).attr('disabled', false);
    $('#input_dhcp_endip').val(dhcpEndIPAddressList[3]).attr('disabled', false);
    $('#input_dhcp_leasetime').val(dhcpLeaseTimeTmp).attr('disabled', false);
    $('#dhcp_ip_range').text(dhcpIPRange);
    dhcp_value.DhcpStatus = g_DHCP_SERVER_ENABLE;
}

function disabledDHCP() {
    clearAllErrorLabel();
    if(g_DHCP_SERVER_ENABLE == dhcp_value.DhcpStatus){
       var dhcp_text = g_feature.title;
       var close_dhcp = dhcp_label_dhcp_server_close.replace('%s', dhcp_text);
       showConfirmDialog(close_dhcp,function(){
          disabledDHCPInit();
          return false;
       },function(){
          enableDHCP();
          $("input[name='radio_dhcp_status'][value=" + dhcp_value.DhcpStatus + ']').attr('checked', true);
       },0,function(){
          enableDHCP();
          $("input[name='radio_dhcp_status'][value=" + dhcp_value.DhcpStatus + ']').attr('checked', true);
       });        
       dhcp_value.DhcpStatus = g_DHCP_SERVER_DISABLE;
    }
}
function disabledDHCPInit() {
    clearAllErrorLabel();
    $('#input_dhcp_startip').val('').attr('disabled', true);
    $('#input_dhcp_endip').val('').attr('disabled', true);
    $('#dhcp_ip_range').text('');
    $('#input_dhcp_leasetime').val('').attr('disabled', true);
}


function initPageData() {
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret;
        ret = xml2object($xml);
        log.debug('type= ' + ret.type);
        if (ret.type == 'response')
        {
            dhcp_value = ret.response;
            dhcp_value.DhcpStatus = parseInt(dhcp_value.DhcpStatus, 10);
            g_dhcpSubmark = dhcp_value.DhcpLanNetmask;
            var dhcpIPAddress = dhcp_value.DhcpIPAddress;
            var dhcpIPAddresslists = dhcpIPAddress.split(".");
            $('#input_dhcp_ipaddr_first').val(dhcpIPAddresslists[0]);
            $('#input_dhcp_ipaddr_second').val(dhcpIPAddresslists[1]);
            $('#input_dhcp_ipaddr_third').val(dhcpIPAddresslists[2]);
            $('#input_dhcp_ipaddr_forth').val(dhcpIPAddresslists[3]);
            $("input[name='radio_dhcp_status'][value=" + dhcp_value.DhcpStatus + ']').attr('checked', true);
            if (g_DHCP_SERVER_ENABLE == dhcp_value.DhcpStatus)
            {
                enableDHCP();
            }
            else
            {
                disabledDHCPInit();
            }
        }
    });
}

function postData() {
     var dhcpIPAddresssFirst = $('#input_dhcp_ipaddr_first').val();
     var dhcpIPAddresssSecond = $('#input_dhcp_ipaddr_second').val();
     var dhcpIPAddresssThird = $('#input_dhcp_ipaddr_third').val();
     var dhcpIPAddresssForth = $('#input_dhcp_ipaddr_forth').val();
    dhcp_value.DhcpIPAddress = dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' + dhcpIPAddresssForth; 
    dhcp_value.DhcpLanNetmask = g_dhcpSubmark;
    dhcp_value.DhcpStatus = $("input[name='radio_dhcp_status']:checked").val();
    dhcp_value.DhcpStartIPAddress =dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' +  $('#input_dhcp_startip').val();
    dhcp_value.DhcpEndIPAddress = dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' + $('#input_dhcp_endip').val();
    dhcp_value.DhcpLeaseTime = $.trim($('#input_dhcp_leasetime').val());
    dhcp_value.PrimaryDns = '0.0.0.0';
    dhcp_value.SecondaryDns = '0.0.0.0';
    button_enable('apply', '0');
    var xmlstr = object2xml('request', dhcp_value);
    saveAjaxData('api/dhcp/settings', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {
            });
             ping_setPingAddress(dhcp_value.DhcpIPAddress);
             setTimeout(startPing, DHCP_PING_INTERVA);
        }
        else
        {
            initPageData();
        }
    });
}

function isBetweenStartIPAndEndIP(ipAddress, startIP, endIP) {
    var num = 0;
    var numStart = 0;
    var numEnd = 0;
    var maskParts = ipAddress.split('.');
    var maskStartIPParts = startIP.split('.');
    var maskEndIPParts = endIP.split('.');

    num = Number(maskParts[0])*256*256*256 + Number(maskParts[1])*256*256 + Number(maskParts[2])*256 + Number(maskParts[3]);
    numStart = Number(maskStartIPParts[0])*256*256*256 + Number(maskStartIPParts[1])*256*256 + Number(maskStartIPParts[2])*256 + Number(maskStartIPParts[3]);
    numEnd = Number(maskEndIPParts[0])*256*256*256 + Number(maskEndIPParts[1])*256*256 + Number(maskEndIPParts[2])*256 + Number(maskEndIPParts[3]);

    if ((num >= numStart) && (num <= numEnd))
    {
        return true;
    }
        else
    {
        return false;
    }
}

function verifyUserInput() {
	var dhcpIPAddresssFirst = $('#input_dhcp_ipaddr_first').val();
	var dhcpIPAddresssSecond = $('#input_dhcp_ipaddr_second').val();
	var dhcpIPAddresssThird = $('#input_dhcp_ipaddr_third').val();
	var dhcpIPAddresssForth = $('#input_dhcp_ipaddr_forth').val();
    var dhcpIPAddresss = dhcpIPAddresssFirst + '.'  + dhcpIPAddresssSecond + '.'  + dhcpIPAddresssThird + '.'  + dhcpIPAddresssForth;
    var dhcpStartIPAddress = dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' +  $('#input_dhcp_startip').val();
    var dhcpEndIPAddress = dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' + $('#input_dhcp_endip').val();
	var dhcpLanNetmask = g_dhcpSubmark;
	var dhcpStatus = $("input[name='radio_dhcp_status']:checked").val();
	var dhcpLeaseTime = $('#input_dhcp_leasetime').val();
	clearAllErrorLabel();
	 if (!isValidIpAddress(dhcpIPAddresss))
    {
        showErrorUnderTextbox('input_dhcp_ipaddr', dialup_hint_ip_address_empty);
        if(dhcpIpAddressNum == 1){
            $('#input_dhcp_ipaddr_first').focus();
        }else if(dhcpIpAddressNum == 2){
            $('#input_dhcp_ipaddr_second').focus();
	}else if(dhcpIpAddressNum == 3){
            $('#input_dhcp_ipaddr_third').focus();
        }else if(dhcpIpAddressNum == 4){
            $('#input_dhcp_ipaddr_forth').focus();
        }
        return false;
    }
    if (!isBroadcastOrNetworkAddress(dhcpIPAddresss, dhcpLanNetmask))
    {
        showErrorUnderTextbox('input_dhcp_ipaddr', dialup_hint_ip_address_empty);
        if(dhcpIpAddressNum == 1){
            $('#input_dhcp_ipaddr_first').focus();
        }else if(dhcpIpAddressNum == 2){
            $('#input_dhcp_ipaddr_second').focus();
	}else if(dhcpIpAddressNum == 3){
            $('#input_dhcp_ipaddr_third').focus();
        }else if(dhcpIpAddressNum == 4){
            $('#input_dhcp_ipaddr_forth').focus();
        }
        return false;
    }
//enable DHCP server
    if (1 == dhcpStatus)
    {
        if ((!isValidIpAddress(dhcpStartIPAddress)) || (dhcpIPAddresss == dhcpStartIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_start_ip_address_invalid);
            $('#input_dhcp_startip').focus();
            return false;
        }
        if (!isBroadcastOrNetworkAddress(dhcpStartIPAddress, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_start_ip_address_invalid);
            $('#input_dhcp_startip').focus();
            return false;
        }
        if ((!isValidIpAddress(dhcpEndIPAddress)) || (dhcpIPAddresss == dhcpEndIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_end_ip_address_invalid);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (!isBroadcastOrNetworkAddress(dhcpEndIPAddress, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_end_ip_address_invalid);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (!isSameSubnetAddrs(dhcpStartIPAddress, dhcpIPAddresss, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_start_ip_address_same_subnet);
            $('#input_dhcp_startip').focus();
            return false;
        }
        if (!isSameSubnetAddrs(dhcpEndIPAddress, dhcpIPAddresss, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_end_ip_address_same_subnet);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (!compareStartIpAndEndIp(dhcpStartIPAddress, dhcpEndIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_ip', dhcp_hint_end_ip_greater_start_ip);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (-1 != dhcpLeaseTime.indexOf('.'))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_integer);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if (true == isNaN(dhcpLeaseTime))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_number);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if ((0 == dhcpLeaseTime.indexOf('0')) && (0 != dhcpLeaseTime))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_invalid);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if ((dhcpLeaseTime < DHCP_MIN_LEASE_TIME) || (dhcpLeaseTime > DHCP_MAX_LEASE_TIME))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_range);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if (isBetweenStartIPAndEndIP(dhcpIPAddresss, dhcpStartIPAddress, dhcpEndIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_ipaddr', dhcp_message_ip_address_in_start_end);
            $('#input_dhcp_ipaddr_forth').focus();
            return false;
        }
    }
    return true;
}
function onApply() {
    if (!isButtonEnable('apply'))
    {
        return;
    }
    if(verifyUserInput())
    {
		showConfirmDialog(system_hint_operation_restart_device, postData, function() {});
    }
}

var dhcpIpAddressNum = 0;
$(document).ready(function() {
	$('#all_content').show();
    createIpDialogHtml();
    initPageData();

    $('input').bind('change input paste cut keydown', function(e) {
        if(MACRO_KEYCODE != e.keyCode){
            button_enable('apply', '1');
       }
    });
    button_enable('apply', '0');
    
    $('#apply').click(function() {
        onApply();
    });

    $('#input_dhcp_ipaddr_first').bind('blur',function(e){
       if(g_DHCP_SERVER_ENABLE == dhcp_value.DhcpStatus){
           getDhcpIPAddressRange();
       }
       dhcpIpAddressNum = 1;
    });
    $('#input_dhcp_ipaddr_second').bind('blur',function(e){
       if(g_DHCP_SERVER_ENABLE == dhcp_value.DhcpStatus){
           getDhcpIPAddressRange();
       }
       dhcpIpAddressNum = 2;
    });
    $('#input_dhcp_ipaddr_third').bind('blur',function(e){
       if(g_DHCP_SERVER_ENABLE == dhcp_value.DhcpStatus){
           getDhcpIPAddressRange();
       }
       dhcpIpAddressNum = 3;
    });
     $('#input_dhcp_ipaddr_forth').bind('blur',function(e){
       dhcpIpAddressNum = 4;
    });
    $('#input_dhcp_startip').bind('blur',function(e){
       getDhcpIPAddressRange();
    });
    $('#input_dhcp_endip').bind('blur',function(e){
       getDhcpIPAddressRange();
    });
    
});

function getDhcpIPAddressRange(){
	var dhcpIPAddresssFirst = $('#input_dhcp_ipaddr_first').val();
	var dhcpIPAddresssSecond = $('#input_dhcp_ipaddr_second').val();
	var dhcpIPAddresssThird = $('#input_dhcp_ipaddr_third').val();
    var dhcpStartIPAddress = dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' +  $('#input_dhcp_startip').val();
    var dhcpEndIPAddress = dhcpIPAddresssFirst + '.' + dhcpIPAddresssSecond + '.' + dhcpIPAddresssThird + '.' + $('#input_dhcp_endip').val();
	var dhcpIPRange1 = dhcp_label_dhcp_ip_address_range.replace('%s1',dhcpStartIPAddress) ;
    var dhcpIPRange = dhcpIPRange1.replace('%s2',dhcpEndIPAddress) ;
    $('#dhcp_ip_range').text(dhcpIPRange);
}
