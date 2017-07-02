var g_vpnstatusInfo = null;
var g_vpnconnstatus = null;
var g_vpnconntype = null;

var VPNCONNECTIONSTATUS = {
	0: common_unknown,
	1: dialup_label_connected,
	2:dialup_label_disconnected
};

var VPNCONNECTIONTYPE = {
	1: vpn_connect_type_L2Tp,
	2: vpn_connect_type_ppp,
	3: vpn_connect_type_ipsec
};

var g_vpnconnectionStatusList = [[0, VPNCONNECTIONSTATUS[0]],[1, VPNCONNECTIONSTATUS[1]],[2, VPNCONNECTIONSTATUS[2]]];
var g_vpnconnectionTypeList = [[1,VPNCONNECTIONTYPE[1]],[2,VPNCONNECTIONTYPE[2]],[3,VPNCONNECTIONTYPE[3]]];

function vpnstatus_initPage() {
	getAjaxData('api/vpn/status', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			g_vpnstatusInfo = ret.response;
			g_vpnconnstatus = g_vpnstatusInfo.connection_status;
			g_vpnconntype = g_vpnstatusInfo.connection_type;

			if (g_vpnconnstatus == null || g_vpnconnstatus == '') {
				$('#label_conn_status').text(common_unknown);
			} else {
				$.each(g_vpnconnectionStatusList, function(n, value) {
					if (value[0] == g_vpnconnstatus) {
						$('#label_conn_status').text(value[1]);
					}
				});
			}

			if (g_vpnconntype == null || g_vpnconntype == '') {
				$('#label_conn_type').text(common_unknown);
			} else {
				$.each(g_vpnconnectionTypeList, function(n, value) {
					if (value[0] == g_vpnconntype) {
						$('#label_conn_type').text(value[1]);
					}
				});
			}

			if (g_vpnstatusInfo.ipaddr == null || g_vpnstatusInfo.ipaddr == '') {
				$('#label_ip_address').text(common_unknown);
			} else {
				$('#label_ip_address').text(g_vpnstatusInfo.ipaddr);
			}

			if (g_vpnstatusInfo.defaultgateway == null || g_vpnstatusInfo.defaultgateway == '') {
				$('#label_default_gateway').text(common_unknown);
			} else {
				$('#label_default_gateway').text(g_vpnstatusInfo.defaultgateway);
			}

			if (g_vpnstatusInfo.primary_dns == null || g_vpnstatusInfo.primary_dns == '') {
				$('#label_primary_dns').text(common_unknown);
			} else {
				$('#label_primary_dns').text(g_vpnstatusInfo.primary_dns);
			}

			if (g_vpnstatusInfo.second_dns == null || g_vpnstatusInfo.second_dns == '') {
				$('#label_secondary_dns').text(common_unknown);
			} else {
				$('#label_secondary_dns').text(g_vpnstatusInfo.second_dns);
			}

		} else {
			$('#label_conn_status').text(vpn_disconnected);
			$('#label_conn_type').text(common_unknown);
			$('#label_ip_address').text(common_unknown);
			$('#label_default_gateway').text(common_unknown);
			$('#label_primary_dns').text(common_unknown);
			$('#label_secondary_dns').text(common_unknown);
			log.error("REDIRECT:api/vpn/status file failed");
		}
	}, {
		sync: true
	});

	setTimeout(vpnstatus_initPage, g_feature.update_interval);
}

/**********************************After loaded (common)************/
$(document).ready( function() {
	vpnstatus_initPage();
});