var g_vpn_settings = null;
var PRO_AUTHMODE_PAP = '2';
var PRO_AUTHMODE_CHAP = '1';
var g_VPN_ENABLE = 1;
var g_VPN_DISABLE = 0;

$(document).ready( function() {
	init_page();
	clickPasswordEvent('input_vpn_tunnel_password',0);
	clickPasswordEvent('input_vpn_ppppassword',1);
	$("#apply_button").click( function() {
		if (!isButtonEnable('apply_button')) {
			return;
		}
		apply();
	});
	$('#vpn_connection_type').change( function() {
		button_enable('apply_button', '1');
		show_hide_settings();
	});
	button_enable('apply_button', '0');
	$('.input_style').bind('input change cut paste keydown', function(e) {
		if (MACRO_KEYCODE != e.keyCode) {
			button_enable('apply_button', '1');
		}
	});
	$('#auth_type').bind('change', function(e) {
		button_enable('apply_button', '1');
	});
});
function get_data() {
	g_vpn_settings.enable = $('#vpn_connection_type').val();
	g_vpn_settings.lns_addr = $.trim($('#input_vpn_lns_address').val());
	g_vpn_settings.hostname = $.trim($('#input_vpn_hostname').val());
	g_vpn_settings.tunnel_password = $.trim($('#input_vpn_tunnel_password').val());
	g_vpn_settings.interval = $.trim($('#input_hello_interval').val());
	g_vpn_settings.ppp_username = $.trim($('#input_vpn_pppusername').val());
	g_vpn_settings.ppp_password = $.trim($('#input_vpn_ppppassword').val());
	g_vpn_settings.auth_type = $('#auth_type').val();
}

function apply() {
	clearAllErrorLabel();
	if (!check_vpn_input()) {
		return false;
	}
	get_data();
	button_enable('apply_button', '0');
	var tempData = g_vpn_settings;
	if (checkPostIndex(0)) {
        delete tempData.tunnel_password;
    }
    if (checkPostIndex(1)) {
        delete tempData.ppp_password;
    }
	var newXmlString = object2xml('request', tempData);
	saveAjaxData('api/vpn/l2tp_settings', newXmlString, function($xml) {
	    mousedownIndexList = [];
		var ret = xml2object($xml);
		if (isAjaxReturnOK(ret)) {
			showInfoDialog(common_success);
			init_page();
		} else {
			button_enable('apply_button','1');
			if ( typeof (ret.error) != 'undefined' && ret.error.code == ERROR_SYSTEM_BUSY) {
				showInfoDialog(common_system_busy);
			} else {
				showInfoDialog(common_fail);
			}
		}
	},{
		enc:true
	});
}

function set_data() {
	$('#input_vpn_lns_address').val(g_vpn_settings.lns_addr);
	$('#input_vpn_hostname').val(g_vpn_settings.hostname);
	$('#input_vpn_tunnel_password').val(g_vpn_settings.tunnel_password);
	$('#input_hello_interval').val(g_vpn_settings.interval);
	$('#input_vpn_pppusername').val(g_vpn_settings.ppp_username);
	$('#input_vpn_ppppassword').val(g_vpn_settings.ppp_password);
	$('#vpn_connection_type').val(g_vpn_settings.enable);
	if (g_VPN_ENABLE == g_vpn_settings.enable) {
		$("#option_table").show();
		g_vpn_settings.enable = g_VPN_ENABLE;
	} else {
		$("#option_table").hide();
		g_vpn_settings.enable = g_VPN_DISABLE;
	}
	if(g_vpn_settings.auth_type == PRO_AUTHMODE_CHAP) {
		$('#auth_type').val(PRO_AUTHMODE_CHAP);
	} else if(g_vpn_settings.auth_type == PRO_AUTHMODE_PAP) {
		$('#auth_type').val(PRO_AUTHMODE_PAP);
	} else {
		$('#auth_type').val('');
	}
}

function init_page() {
	getAjaxData('api/vpn/l2tp_settings', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			g_vpn_settings = ret.response;
			if (typeof(g_moduleswitch.encrypt_enabled) != 'undefined' && g_moduleswitch.encrypt_enabled == 1) {
				if (typeof(g_vpn_settings.ppp_username) != 'undefined' && g_vpn_settings.ppp_username != null && g_vpn_settings.ppp_username != '') {                
					g_vpn_settings.ppp_password = COMMON_PASSWORD_VALUE;
			        }
				g_vpn_settings.tunnel_password = COMMON_PASSWORD_VALUE;
			}
			set_data();
		}
	}, {
		sync : true
	});
}

function show_hide_settings() {
	if($('#vpn_connection_type').val()== g_VPN_ENABLE) {
		$("#option_table").show();
		g_vpn_settings.enable = g_VPN_ENABLE;
	} else {
		clearAllErrorLabel();
		$("#option_table").hide();
		$('#input_vpn_lns_address').val(g_vpn_settings.lns_addr);
		$('#input_vpn_hostname').val(g_vpn_settings.hostname);
		$('#input_vpn_tunnel_password').val(g_vpn_settings.tunnel_password);
		$('#input_hello_interval').val(g_vpn_settings.interval);
		$('#input_vpn_pppusername').val(g_vpn_settings.ppp_username);
		$('#input_vpn_ppppassword').val(g_vpn_settings.ppp_password);
		$('#auth_type').val(g_vpn_settings.auth_type);
		g_vpn_settings.enable = g_VPN_DISABLE;
	}

}

function check_vpn_input(type) {
	var vpnlnsaddress = $.trim($('#input_vpn_lns_address').val());
	if (false == isValidIpAddress(vpnlnsaddress)) {
		showErrorUnderTrEx('input_vpn_lns_address', IDS_VPN_Error_InvalidIP);
		$('#input_vpn_lns_address').focus();
		$('#input_vpn_lns_address').select();
		return false;
	}

	if (false == validateUsernameAndPassword()) {
		return false;
	}
	return true;
}

function validateHelloInterval() {
	var vpnhelloInterval = $.trim($('#input_hello_interval').val());
	if('' == vpnhelloInterval || null == vpnhelloInterval) {
		showErrorUnderTrEx('input_hello_interval', IDS_VPN_Error_interval_empty);
		$('#input_hello_interval').focus();
		$('#input_hello_interval').select();
		return false;
	} else {
		if (true == IsDigital(vpnhelloInterval)) {
			if(30 > vpnhelloInterval || vpnhelloInterval >3600) {
				showErrorUnderTrEx('input_hello_interval', IDS_VPN_Error_Ivalid_interval);
				$('#input_hello_interval').focus();
				$('#input_hello_interval').select();
				return false;
			}
		} else {
			showErrorUnderTrEx('input_hello_interval', IDS_VPN_Error_Ivalid_interval);
			$('#input_hello_interval').focus();
			$('#input_hello_interval').select();
			return false;
		}
	}
	return true;
}

function validateUsernameAndPassword() {
	clearAllErrorLabel();
	var hostName = $.trim($('#input_vpn_hostname').val());
	var tonnelpassword =  $.trim($('#input_vpn_tunnel_password').val());
	var username = $.trim($('#input_vpn_pppusername').val());
	var password =  $.trim($('#input_vpn_ppppassword').val());

	if(''==hostName || null == hostName) {
		showErrorUnderTrEx('input_vpn_hostname', IDS_VPN_Error_hostname_empty);
		$('#input_vpn_hostname').focus();
		$('#input_vpn_hostname').select();
		return false;
	} else if(hostName.length > 32 || hostName.length < 1) {
		showErrorUnderTrEx('input_vpn_hostname', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_hostname').focus();
		$('#input_vpn_hostname').select();
		return false;
	} else if(checkInputChar(hostName) == false) {
		showErrorUnderTrEx('input_vpn_hostname', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_hostname').focus();
		$('#input_vpn_hostname').select();
		return false;
	} else if ('' == tonnelpassword || null == tonnelpassword ) {
		showErrorUnderTrEx('input_vpn_tunnel_password', dialup_hint_password_empty);
		$('#input_vpn_tunnel_password').focus();
		$('#input_vpn_tunnel_password').select();
		return false;
	} else if(tonnelpassword.length > 32 || tonnelpassword.length < 1) {
		showErrorUnderTrEx('input_vpn_tunnel_password', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_tunnel_password').focus();
		$('#input_vpn_tunnel_password').select();
		return false;
	} else if (checkInputChar(tonnelpassword) == false) {
		showErrorUnderTrEx('input_vpn_tunnel_password', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_tunnel_password').focus();
		$('#input_vpn_tunnel_password').select();
		return false;
	} else if(validateHelloInterval() == false) {
		return false;
	} else if ('' == username || null == username ) {
		showErrorUnderTrEx('input_vpn_pppusername', settings_hint_user_name_empty);
		$('#input_vpn_pppusername').focus();
		$('#input_vpn_pppusername').select();
		return false;
	} else if(username.length > 32 || username.length < 1) {
		showErrorUnderTrEx('input_vpn_pppusername', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_pppusername').focus();
		$('#input_vpn_pppusername').select();
		return false;
	} else if (checkInputChar(username) == false) {
		showErrorUnderTrEx('input_vpn_pppusername', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_pppusername').focus();
		$('#input_vpn_pppusername').select();
		return false;
	} else if ('' == password || null == password ) {
		showErrorUnderTrEx('input_vpn_ppppassword', dialup_hint_password_empty);
		$('#input_vpn_ppppassword').focus();
		$('#input_vpn_ppppassword').select();
		return false;
	} else if(password.length > 32 || password.length < 1) {
		showErrorUnderTrEx('input_vpn_ppppassword', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_ppppassword').focus();
		$('#input_vpn_ppppassword').select();
		return false;
	} else if (checkInputChar(password) == false) {
		showErrorUnderTrEx('input_vpn_ppppassword', IDS_VPN_Error_input_invalidate);
		$('#input_vpn_ppppassword').focus();
		$('#input_vpn_ppppassword').select();
		return false;
	} else {
		return true;
	}
}