var g_ethernet_dialmode_display = '0';
var g_wan_select_mode = null;
var g_wan_dial_mode = null;
var g_ethernet_select_mode = null;
var g_ethernet_dial_mode = null;
var WANSETTING_AUTO = '0';
var WANSETTING_PPPOE_DYNAMICIP = '1';
var WANSETTING_PPPOE = '2';
var WANSETTING_DYNAMICIP = '3';
var WANSETTING_STATICIP = '4';
var WANSETTING_LAN = '5';

var g_cradledialInfo = null;

var CONNECTIONMODE = {
    0: common_auto,
    1: IDS_ethernet_pppoe_plus_dynamic,
    2: IDS_wan_setting_pppoe,
    3: IDS_wan_setting_dynamicip,
    4: IDS_ethernet_setting_staticip,
    5: IDS_ethernet_settings_mode_lan
};

var DIALINGMODE = {
    0: common_auto,
    1: IDS_ethernet_dialing_ondemand
};

var DIALING_AUTO = '0';
var DIALING_ONDEMAND = '1';

var g_setting_connMode = null;
var g_setting_dialMode = null;

var g_setting_connectionModeList = [[0, CONNECTIONMODE[0]], [1, CONNECTIONMODE[1]], [2, CONNECTIONMODE[2]], [3, CONNECTIONMODE[3]],[4, CONNECTIONMODE[4]],[5, CONNECTIONMODE[5]] ];

var g_setting_dialModeList = [[0,DIALINGMODE[0]],[1,DIALINGMODE[1]]];

var MIN_SIZE_RANGE = 576;
var DEFAULT_PPPOE_SIZE = 1480;
var MAX_PPPOE_SIZE = 1492;
var MAX_DYNAMIC_STATIC_SIZE = 1500;

var MIN_CONN_TIME = 30;
var MAX_CONN_TIME = 7200;
var dhcp_data = null;
var dhcp_ipaddress = null;
var dhcp_netmask = null;

function getDhcpData(){
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            dhcp_data = ret.response;
            dhcp_netmask = dhcp_data.DhcpLanNetmask;
            dhcp_ipaddress = dhcp_data.DhcpIPAddress;
        }
    });
}
function verifyIpInput() {
    clearAllErrorLabel();
    var ipaddress = $('#input_ip_address').val();
    var subnetMask = $('#input_subnet_mask').val();
    var defaultGateway = $('#input_gate_way').val();
    var primaryDnsServer = $('#input_dns_server').val();
    var secondaryDnsServer = $('#input_spare_server').val();
    
    var plusMask = ipPlusip(subnetMask,dhcp_netmask);
    var plusIp = ipPlusip(ipaddress,plusMask);
    var plusDhcp = ipPlusip(dhcp_ipaddress,plusMask);
    var plusGateway = ipPlusip(defaultGateway,plusMask);
    var plusDnsserver = ipPlusip(primaryDnsServer,plusMask);
    var plusSparedns = ipPlusip(secondaryDnsServer,plusMask);
    if (!validStaticIp(ipaddress))
    {
        showErrorUnderTr('ip_address', dialup_hint_ip_address_empty);
        $('#input_ip_address').focus();
        $('#input_ip_address').val('');
        return false;
    }
    if (!isValidSubnetMask(subnetMask)){
        showErrorUnderTr('subnet_mask', IDS_ethernet_subnet_mask_error);
        $('#input_subnet_mask').focus();
        $('#input_subnet_mask').val('');
        return false;
    }
    if (plusIp == plusDhcp){
        showErrorUnderTr('ip_address', IDS_ethernet_vefify_ipdhcpip);
        $('#input_ip_address').focus();
        $('#input_ip_address').val('');
        return false;
    }
    if (!obverseMask(ipaddress,subnetMask)) {
        showErrorUnderTr('ip_address', dialup_hint_ip_address_empty);
        $('#input_ip_address').focus();
        $('#input_ip_address').val('');
        return false;
    }
    if (!validStaticIp(defaultGateway)){
    	showErrorUnderTr('gate_way', IDS_ethernet_gateway_address_error);
    	$('#input_gate_way').focus();
    	$('#input_gate_way').val('');
    	return false;
    }
    if (plusGateway == plusDhcp){
        showErrorUnderTr('gate_way',IDS_ethernet_vefify_gatewaydhcpip );
        $('#input_gate_way').focus();
        $('#input_gate_way').val('');
        return false;
    }
    if (!obverseMask(defaultGateway,subnetMask)) {
    	showErrorUnderTr('gate_way', IDS_ethernet_gateway_address_error);
        $('#input_gate_way').focus();
        $('#input_gate_way').val('');
        return false;
    }
    if (!isSameSubnetAddrs(ipaddress,defaultGateway,subnetMask)){
        showErrorUnderTr('gate_way', IDS_ethernet_verify_ipgateway);
        $('#input_gate_way').focus();
        $('#input_gate_way').val('');
        return false;
    }
 
    if ('' != primaryDnsServer && '0.0.0.0' != primaryDnsServer) {
	    if (!validStaticIp(primaryDnsServer)){
	            showErrorUnderTr('dns_server', IDS_ethernet_primary_dns);
	        $('#input_dns_server').focus();
	        $('#input_dns_server').val('');
	        return false;
	    }
	    if (plusDnsserver == plusDhcp){
	        showErrorUnderTr('dns_server', IDS_ethernet_vefify_dnsdhcip);
	        $('#input_dns_server').focus();
	        $('#input_dns_server').val('');
	        return false;
	    }
    }
    if ('' != secondaryDnsServer && '0.0.0.0' != secondaryDnsServer) {
	    if (!validStaticIp(secondaryDnsServer)){
	        showErrorUnderTr('spare_dns_server', IDS_ethernet_secondary_dns);
	        $('#input_spare_server').focus();
	        $('#input_spare_server').val('');
	        return false;
	    }
	    if (plusSparedns == plusDhcp){
	        showErrorUnderTr('spare_dns_server', IDS_ethernet_vefify_sparednsdhcip);
	        $('#input_spare_server').focus();
	        $('#input_spare_server').val('');
	        return false;
	    }
    }
    return true;
}

function ipPlusip(part1,part2){
    var result = '';
    var partOne = part1.split('.');
    var partTwo = part2.split('.');
    for (i = 0; i < 4; i++)
    {
        result += Number(partOne[i]) & Number(partTwo[i]);
        result = result+".";
    }
    result = result.substring(0,result.length-1);
    return result;
}
function validDynamicDns() {
    clearAllErrorLabel();
    var dynamicDns = $.trim($('#dynamic_dns_server').val());
    var dynamicSpareDns = $.trim($('#dynamic_spare_server').val());
    if (WANSETTING_AUTO == g_ethernet_select_mode || WANSETTING_PPPOE_DYNAMICIP == g_ethernet_select_mode || WANSETTING_DYNAMICIP == g_ethernet_select_mode) {
        if ($('#dynamic_manual').attr('checked')) {
            if (!validStaticIp(dynamicDns)) {
                showErrorUnderTr('set_primary_dns', IDS_ethernet_primary_dns);
                $('#dynamic_dns_server').focus();
                $('#dynamic_dns_server').val('');
                return false;
            }
            if ('' != dynamicSpareDns && '0.0.0.0' != dynamicSpareDns) {
                if (!validStaticIp(dynamicSpareDns)) {
                    showErrorUnderTr('set_spare_dns', IDS_ethernet_secondary_dns);
                    $('#dynamic_spare_server').focus();
                    $('#dynamic_spare_server').val('');
                    return false;
                }
            }
        } else {
            return true;
        }
    }
    return true;
}
function validMtusize(){
    clearAllErrorLabel();
    var pppoeMtuSize = $.trim($('#input_mtu_size').val());
    var dynamciMtuSize = $.trim($('#dynamic_mtu_size').val());
    var staticMtuSize = $.trim($('#static_mtu_size').val());
    var pppoeMtuMsg = IDS_ethernet_mtu_size_range.replace('%d',MIN_SIZE_RANGE).replace('%e',MAX_PPPOE_SIZE);
    var dynamicMtuMsg = IDS_ethernet_mtu_size_range.replace('%d',MIN_SIZE_RANGE).replace('%e',MAX_DYNAMIC_STATIC_SIZE);

    if (WANSETTING_AUTO == g_ethernet_select_mode || WANSETTING_PPPOE_DYNAMICIP == g_ethernet_select_mode || WANSETTING_PPPOE == g_ethernet_select_mode){
        if (!IsDigital(pppoeMtuSize) || pppoeMtuSize < MIN_SIZE_RANGE || pppoeMtuSize > MAX_PPPOE_SIZE) 
        {
            $('#ondemand_mtuinfo').hide();
            showErrorUnderTr('ondemand_mtusize', pppoeMtuMsg);
            $('#input_mtu_size').focus();
            $('#input_mtu_size').val('');
            return false;
        }
    }

    if (WANSETTING_AUTO == g_ethernet_select_mode || WANSETTING_PPPOE_DYNAMICIP == g_ethernet_select_mode || WANSETTING_DYNAMICIP == g_ethernet_select_mode){
        if (!IsDigital(dynamciMtuSize) ||dynamciMtuSize < MIN_SIZE_RANGE || dynamciMtuSize > MAX_DYNAMIC_STATIC_SIZE) 
        {
            $('#dynamic_mtuinfo').hide();
            showErrorUnderTr('dynamic_mtusize', dynamicMtuMsg);
            $('#dynamic_mtu_size').focus();
            $('#dynamic_mtu_size').val('');
            return false;
        }
    }

    if (WANSETTING_STATICIP == g_ethernet_select_mode){
        if (!IsDigital(staticMtuSize) ||staticMtuSize < MIN_SIZE_RANGE || staticMtuSize > MAX_DYNAMIC_STATIC_SIZE) 
        {
            $('#static_mtuinfo').hide();
            showErrorUnderTr('static_mtusize', dynamicMtuMsg);
            $('#static_mtu_size').focus();
            $('#static_mtu_size').val('');
            return false;
        }
    }
    return true;
}

function validateUsernameAndPassword() {
    clearAllErrorLabel();
    var username = $.trim($('#input_ethernet_username').val());
    var password = $.trim($('#input_ethernet_password').val());

    if ('' == username || null == username ) {
        showErrorUnderTr('ondemand_username', settings_hint_user_name_empty);
        $('#input_ethernet_username').focus();
        $('#input_ethernet_username').val('');
        return false;
    } else if (checkInputPPPoEChar(username) == false) {
        showErrorUnderTr('ondemand_username', IDS_ethernet_pppoe_username);
        $('#input_ethernet_username').focus();
        $('#input_ethernet_username').val('');
        return false;

    } else if ('' == password || null == password ) {
        showErrorUnderTr('ondemand_password', dialup_hint_password_empty);
        $('#input_ethernet_password').focus();
        $('#input_ethernet_password').val('');
        return false;
    } else if (checkInputPPPoEChar(password) == false) {
        showErrorUnderTr('ondemand_password', IDS_ethernet_pppoe_password);
        $('#input_ethernet_password').focus();
        $('#input_ethernet_password').val('');
        return false;
    } else {
        return true;
    }
}

function validateTime(){
    clearAllErrorLabel();
    var time = $.trim($('#input_disconn_time').val());
    var timeErrorMsg = IDS_ethernet_idle_time.replace("%d",MIN_CONN_TIME).replace("%e",MAX_CONN_TIME);
    if (!IsDigital(time) || time < MIN_CONN_TIME || time > MAX_CONN_TIME){
        showErrorUnderTr('auto_disconnect', timeErrorMsg);
        $('#input_disconn_time').focus();
        $('#input_disconn_time').val('');
        return false;
    }
    return true;
}

function ethernetSettingApply(){
    if (!isButtonEnable('apply_button'))
    {
        return;
    }
    clearAllErrorLabel();
    g_ethernet_select_mode = $('#select_wan_connection_mode').val();
    g_ethernet_dial_mode = $('#select_wan_dialing_mode').val();

    var mtuValid;
    var timeValid;
    var bValid;
    var optionValid;
    var request = null;
    if (WANSETTING_AUTO == g_ethernet_select_mode || WANSETTING_PPPOE_DYNAMICIP == g_ethernet_select_mode || WANSETTING_PPPOE == g_ethernet_select_mode){
        bValid = validateUsernameAndPassword();
        if(!bValid){
            return;
        }
        if (g_ethernet_dial_mode == DIALING_ONDEMAND){
            timeValid = validateTime();
            if (!timeValid){
                return;
            }
        }
        mtuValid = validMtusize();
        if (!mtuValid){
            return;
        }
        if (WANSETTING_PPPOE != g_ethernet_select_mode) {
            optionValid = validDynamicDns();
            if (!optionValid) {
                return;
            }
        }
    }else if(WANSETTING_DYNAMICIP == g_ethernet_select_mode){
        mtuValid = validMtusize();
        if (!mtuValid){
            return;
        }
        optionValid = validDynamicDns();
        if (!optionValid) {
            return;
        }
    }else if (WANSETTING_STATICIP == g_ethernet_select_mode){
        var ipValid = verifyIpInput();
        if (!ipValid){
            return;
        }
        mtuValid = validMtusize();
        if (!mtuValid){
            return;
        }
    }else if (WANSETTING_LAN == g_ethernet_select_mode){
        g_ethernet_select_mode = $('#select_wan_connection_mode').val();
    }
    var usernameBefore = $.trim($('#input_ethernet_username').val());
    var username = wifiSsidResolveCannotParseChar(usernameBefore);
    var psdBefore = $.trim($('#input_ethernet_password').val());
    var psd = wifiSsidResolveCannotParseChar(psdBefore);
    var time = $.trim($('#input_disconn_time').val());
    var pppoeMtu = $.trim($('#input_mtu_size').val());
    var dynamicMtu = $.trim($('#dynamic_mtu_size').val());
    var staticMtu = $.trim($('#static_mtu_size').val());
    var ipAddress = $.trim($('#input_ip_address').val());
    var subnetMask = $.trim($('#input_subnet_mask').val());
    var gateWay = $.trim($('#input_gate_way').val());
    if (gateWay == '' || gateWay == '0.0.0.0'){
        gateWay = '0.0.0.0';
    }
    var dnsServer = $.trim($('#input_dns_server').val());
    if (dnsServer == '' || dnsServer == '0.0.0.0'){
        dnsServer = '0.0.0.0';
    }
    var spareDns = $.trim($('#input_spare_server').val());
    if (spareDns == '' || spareDns == '0.0.0.0'){
        spareDns = '0.0.0.0';
    }
    var primaryDns = $.trim($('#dynamic_dns_server').val());
    var secondaryDns = $.trim($('#dynamic_spare_server').val());
    if ($('#dynamic_manual').attr('checked')){
        setDynamicDns = '1'; 
        if ('' == secondaryDns ){
            secondaryDns ='0.0.0.0';
        } 
    } else{
        setDynamicDns = '0';
        primaryDns = '0.0.0.0';
        secondaryDns = '0.0.0.0';
    }
    request = {
        connectionmode: g_ethernet_select_mode,
        pppoeuser: username,
        pppoepwd: psd,
        dialmode: g_ethernet_dial_mode,
        maxidletime: time,
        pppoemtu: pppoeMtu,
        dynamicipmtu: dynamicMtu,
        ipaddress: ipAddress,
        netmask: subnetMask,
        gateway: gateWay,
        primarydns: dnsServer,
        secondarydns: spareDns,
        staticipmtu: staticMtu,
        dynamicsetdnsmanual: setDynamicDns,
        dynamicprimarydns: primaryDns,
        dynamicsecondarydns: secondaryDns
    };
    button_enable('apply_button','0');
    if (checkPostIndex(0)) {
        delete request.pppoepwd;
    }
    var xmlconnData = object2xml('request', request);
    saveAjaxData('api/cradle/basic-info', xmlconnData, function($xml) {
        mousedownIndexList = [];
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            showInfoDialog(common_success);
            button_enable('apply_button','0');
            initEthernet();
        }
        else
        {
            showInfoDialog(common_failed);
            log.error("CradleSettings:api/cradle/basic-info file failed");
            button_enable('apply_button', '1');
        }
    },{
    	enc:true
    });
}

function wan_setting_initSelectOption() {
    var mode_list = '';
    $.each(g_setting_connectionModeList, function(n, value) {
        mode_list = '<option style="vertical-align:middle;" value = ' + value[0] + '>' + value[1] + '</option>';
        $('#select_wan_connection_mode').append(mode_list);
    });

    var dialMode_list = '';
    $.each(g_setting_dialModeList, function(n, value) {
        dialMode_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
        $('#select_wan_dialing_mode').append(dialMode_list);
    });
}
function initEthernet(){
    
    getAjaxData('api/cradle/basic-info', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_cradledialInfo = ret.response;
	    if (typeof(g_moduleswitch.encrypt_enabled) != 'undefined' && g_moduleswitch.encrypt_enabled == 1) {
	            if (typeof(g_cradledialInfo.pppoeuser) != 'undefined' && g_cradledialInfo.pppoeuser != null && g_cradledialInfo.pppoeuser != '') {                
			g_cradledialInfo.pppoepwd = COMMON_PASSWORD_VALUE;
	            }
	    }
            init_select_value();
            wansetting_select_mode();
        }
        else{
            showInfoDialog(common_failed);
            log.error("CradleInit:api/cradle/basic-info file failed");
        }
    }, {
        sync: true
    });
}

function init_ethernet_value(){
    $('#select_wan_dialing_mode').val(g_cradledialInfo.dialmode);
    $('#input_ethernet_username').val(g_cradledialInfo.pppoeuser);
    $('#input_ethernet_password').val(g_cradledialInfo.pppoepwd);
    $('#input_disconn_time').val(g_cradledialInfo.maxidletime);
    $('#input_ip_address').val(g_cradledialInfo.ipaddress);
    $('#input_subnet_mask').val(g_cradledialInfo.netmask);
    $('#input_gate_way').val(g_cradledialInfo.gateway);
    $('#input_dns_server').val(g_cradledialInfo.primarydns);
    $('#input_spare_server').val(g_cradledialInfo.secondarydns);
    $('#static_mtu_size').val(g_cradledialInfo.staticipmtu);
    $('#dynamic_mtu_size').val(g_cradledialInfo.dynamicipmtu);
    if (g_cradledialInfo.dynamicsetdnsmanual == '1') {
        $('#dynamic_manual').attr('checked',true);
        $('#dynamic_dns_server').removeAttr('disabled');
        $('#dynamic_spare_server').removeAttr('disabled');
    } else {
        $('#dynamic_manual').attr('checked',false);
        $('#dynamic_dns_server').attr('disabled',true);
        $('#dynamic_spare_server').attr('disabled',true);
    }
    $('#dynamic_dns_server').val(g_cradledialInfo.dynamicprimarydns);
    $('#dynamic_spare_server').val(g_cradledialInfo.dynamicsecondarydns);
    $('#input_mtu_size').val(g_cradledialInfo.pppoemtu);
    $('#ondemand_mtuinfo').show();
    $('#dynamic_mtuinfo').show();
    $('#static_mtuinfo').show();
}

function init_select_value(){
    $('#select_wan_connection_mode').val(g_cradledialInfo.connectionmode);
    g_setting_connMode = $('#select_wan_connection_mode').val();
    init_ethernet_value();
}

function wansetting_select_mode(){
    clearAllErrorLabel();
    $('#pppoe_cut_line').hide();
    $('#user_table').hide();
    $('#static_table').hide();
    $('#dynamic_mtu_line').hide();
    $('#dynamic_mtu_table').hide();
    $('.set_dns_manual').hide();
    
    var pppoe_mtu_info = IDS_ethernet_default_mtu.replace("%d",DEFAULT_PPPOE_SIZE);
    $('#pppoe_default_mtu').text(pppoe_mtu_info);
    var dynamic_static_mtu = IDS_ethernet_default_mtu.replace("%d",MAX_DYNAMIC_STATIC_SIZE);
    $('#dynamic_default_mtu').text(dynamic_static_mtu);
    $('#static_default_mtu').text(dynamic_static_mtu);
    if (WANSETTING_AUTO == g_setting_connMode || WANSETTING_PPPOE_DYNAMICIP == g_setting_connMode){
        $('#pppoe_cut_line').show();
        $('#user_table').show();
        $('#dynamic_mtu_line').show();
        $('#dynamic_mtu_table').show();
        $('.set_dns_manual').show();
        if (WANSETTING_AUTO == g_setting_connMode){
            $('#option_change_showinfo').html(IDS_ethernet_auto_clew_msg);
        }
        else if (WANSETTING_PPPOE_DYNAMICIP == g_setting_connMode){
            $('#option_change_showinfo').html(IDS_ethernet_pppoe_dynamic_clew_msg);
        }
    }
    else if (WANSETTING_PPPOE == g_setting_connMode){
        $('#user_table').show();
        $('#option_change_showinfo').html(IDS_ethernet_pppoe_clew_msg);	
    }
    else if (WANSETTING_DYNAMICIP == g_setting_connMode){
        $('#option_change_showinfo').html(IDS_ethernet_dynamic_clew_msg);
        $('#dynamic_mtu_table').show();
        $('.set_dns_manual').show();
    } else if (WANSETTING_STATICIP == g_setting_connMode) {
        $('#option_change_showinfo').html(IDS_ethernet_static_clew_msg);
        $('#static_table').show();
    }
    else if (WANSETTING_LAN == g_setting_connMode){
        $('#option_change_showinfo').html(IDS_ethernet_lan_clew_msg);
    }
   $('#select_wan_dialing_mode').val(g_cradledialInfo.dialmode);	
    wanSetting_dialMode(g_cradledialInfo.dialmode);
}

function wanSetting_dialMode(mode){
    clearAllErrorLabel();
    if (mode == DIALING_ONDEMAND){
        $('#input_disconn_time').val(g_cradledialInfo.maxidletime);	
    }else if (mode == DIALING_AUTO){
        $('#auto_disconnect').hide();
    }
}

function initDnsSetup() {
    clearAllErrorLabel();
    if ($('#dynamic_manual').attr('checked')) {
        $('#dynamic_dns_server').removeAttr('disabled');
        $('#dynamic_spare_server').removeAttr('disabled');
        $('#dynamic_dns_server').val(g_cradledialInfo.dynamicprimarydns);
        $('#dynamic_spare_server').val(g_cradledialInfo.dynamicsecondarydns);
        
    } else {
        $('#dynamic_dns_server').attr('disabled',true);
        $('#dynamic_spare_server').attr('disabled',true);
        $('#dynamic_dns_server').val('0.0.0.0');
        $('#dynamic_spare_server').val('0.0.0.0');
        
    }
}
/**********************************After loaded (common)************/
$(document).ready(function() {
    clickPasswordEvent('input_ethernet_password',0);
    button_enable('apply_button', '0');
    
    $('input').bind('change input paste cut keydown', function(e) {
        if(MACRO_KEYCODE != e.keyCode){
            button_enable('apply_button', '1');
        }
        
    });
    wan_setting_initSelectOption();
    initEthernet();
    getAjaxData('api/cradle/feature-switch', function($xml) {
		var ret = xml2object($xml);
		if(ret.type == 'response') {
			g_ethernet_dialmode_display = ret.response.dialmode_display;
			if ('1' == g_ethernet_dialmode_display) {
				$('#dial').show();
				if(g_cradledialInfo.dialmode == '1'){
        			$('#auto_disconnect').show();		
        		}
			} else {
				$('#dial').hide();
				$('#auto_disconnect').hide();
			}	
		}		
	});
    $('#select_wan_connection_mode').change(function() {
        g_setting_connMode = $('#select_wan_connection_mode').val();
        init_ethernet_value();
        wansetting_select_mode();
        if(g_cradledialInfo.dialmode == '1' && g_ethernet_dialmode_display == '1'){
        	$('#auto_disconnect').show();		
        }
        button_enable('apply_button', '1');
    });
    $('#select_wan_dialing_mode').change(function(){
    	if(this.value == 1){
        	$('#auto_disconnect').show();		
        }
        wanSetting_dialMode(this.value);
        button_enable('apply_button', '1');
    });
    $('#dynamic_manual').bind('click',initDnsSetup);
    getDhcpData();
    $('#apply_button').bind('click',ethernetSettingApply);
    
});