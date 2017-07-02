// JavaScript Document
var g_device_array = [];
var g_device_config = {};
var g_device_info = {};
var g_device_single = '';
var g_device_mode_2g = 0;
var g_device_mode_3g = 2;
var g_device_mode_4g = 7;
var g_device_single = '';
var g_device_mode = '';

String.prototype.addLeadZeroes = function(digits) {
    var zeroes = "";
    for (i = this.length; i < digits; i++)
        zeroes += "0";
    return zeroes + this;
}

var nc_cnt = 0;
var prev_cnt = 0;

if(LANGUAGE_DATA.current_language == "ru_ru") {
	var IDS_system_label_band = "Диапазон";
} else {
	var IDS_system_label_band = "Band";

}

function getDeviceInfo() {
	getAjaxData('api/monitoring/status', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			G_MonitoringStatus = ret;
		}
	}, {
		sync: true
	});
	getAjaxData('api/device/signal', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			g_device_single = ret ;
			g_device_mode = parseInt(g_device_single.response.mode, 10) ;
		}
	}, {
		sync: true
	});

        var rssi2 = "";
        var lac = undefined;
        var cell_id2 = "";
        getAjaxData('api/net/signal-para', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                lac = ret.response.Lac;
                if (ret.response.Rssi != undefined)
                    rssi2 = ret.response.Rssi;
                if (ret.response.CellID != undefined)
                    cell_id2 = ret.response.CellID;
            }
        }, {
            sync: true
        });

        var ext_par = {};
        getConfigData('config/deviceinformation/add_param.xml', function($xml) {
	    var ret = xml2object($xml);
            ext_par = ret.config;
            if (ext_par.cnt != undefined) {
                cnt = parseInt(ext_par.cnt);
                if (cnt != prev_cnt) {
                    nc_cnt = 0;
                    prev_cnt = cnt;
                }
                else {
                    if (nc_cnt + 1 == 5) {
                        for (p in ext_par)
                            ext_par[p] = "";
                    }
                    else
                        nc_cnt++;
                }
            }
        }, {
            sync: true
        });

        var webui_ver = undefined;
        getConfigData('config/version.xml', function($xml) {
	    var ret = xml2object($xml);
            if(typeof(ret.config.webui) != 'undefined')
                webui_ver = ret.config.webui;
        }, {
            sync: true
        });

        if ((lac == undefined || lac == "") && (ext_par.lac != undefined && ext_par.lac != ""))
		lac = ext_par.lac;

	getAjaxData('api/device/information', function($xml) {
		var device_ret = xml2object($xml);
		if (device_ret.type == 'response') {
			g_device_info = device_ret.response;
                        if(typeof(user_config.device_name) != 'undefined' && user_config.device_name != '')
                            g_device_info.DeviceName = user_config.device_name;
                        else if(g_device_info.HardwareVersion.search(/CL2E3372HM/) != -1)
                            g_device_info.DeviceName = 'E3372h';
                        else if(g_device_info.HardwareVersion.search(/CL1E3372SM/) != -1)
                                g_device_info.DeviceName = 'E3372s';
                        if(typeof(webui_ver) != 'undefined' && webui_ver != '')
                            g_device_info.WebUIVersion = webui_ver;
                        g_device_info.WanIPAddress = G_MonitoringStatus.response.WanIPAddress;
                        g_device_info.WanIPv6Address = G_MonitoringStatus.response.WanIPv6Address;
                        var s1 = G_MonitoringStatus.response.PrimaryDns;
                        if (s1 == "")
                            s1 = common_unknown;
                        var s2 = G_MonitoringStatus.response.SecondaryDns;
                        if (s2 == "")
                            s2 = common_unknown;
                        g_device_info.PrimaryDns = s1 + " / " + s2;
			if (g_device_info.Iccid != "")
				g_device_info.Iccid = g_device_info.Iccid.replace("F", "").replace("F", "");
                        if (g_device_mode == g_device_mode_2g || g_device_mode == g_device_mode_3g || g_device_mode == g_device_mode_4g)
                            var s = g_device_single.response.rssi;
                            if (s == "") {
                                s = rssi2;
                                if (s == "" && ext_par.rssi != undefined) {
                                    s = ext_par.rssi;
                                    if (s != "")
                                        s += "dBm";
                                }
                            }
                            g_device_info.rssi = s;
			if (g_device_mode == g_device_mode_3g) {
                            g_device_info.rscp = g_device_single.response.rscp;
                            g_device_info.ecio = g_device_single.response.ecio;
                            g_device_info.sc = g_device_single.response.sc;
                        }
			if (g_device_mode == g_device_mode_4g) {
                            g_device_info.rsrp = g_device_single.response.rsrp;
                            g_device_info.rsrq = g_device_single.response.rsrq;
                            g_device_info.sinr = g_device_single.response.sinr;
                        }
                        if (g_device_mode == g_device_mode_2g || g_device_mode == g_device_mode_3g || g_device_mode == g_device_mode_4g) {
                            if (lac != undefined) {
                                if (lac != "")
                                    lac += " / " + parseInt("0x" + lac);
                                g_device_info.lac = lac;
                            }
                            var s = g_device_single.response.cell_id;
                            if (s != undefined && s != "")
                                s = Number(s).toString(16).toUpperCase().addLeadZeroes(7);
                            else {
                                if (cell_id2 != "")
                                    s = cell_id2;
                                else {       
                                    if (ext_par.cell_id != undefined)
                                        s = ext_par.cell_id;
                                }
                            }
                            if (s != "") {
                                if (g_device_mode == g_device_mode_2g)
                                    s =  s.slice(-4);
                                else 
                                    s =  s.slice(-7);
                                s += " / " + parseInt("0x" + s);
                            }
                            g_device_info.cell_id = s;
                        }
                        if (g_device_mode == g_device_mode_4g)
                        {
                            g_device_info.pci = g_device_single.response.pci;
                            if (ext_par.band != undefined) {
                                if (ext_par.band != "")
                                    g_device_info.band = "B" + ext_par.band;
                            }
                            if (ext_par.earfcn1 != undefined && ext_par.earfcn2 != undefined) {
                                if (ext_par.earfcn1 != "" && ext_par.earfcn2 != "")
                                    g_device_info.earfcn = ext_par.earfcn1 + " / " + ext_par.earfcn2;
                            }
                            if (ext_par.freq1 != undefined && ext_par.freq2 != undefined) {
                                if (ext_par.freq1 != "" && ext_par.freq2 != "") {
                                    var v1 = parseInt(ext_par.freq1) / 10;
                                    var v2 = parseInt(ext_par.freq2) / 10;
                                    g_device_info.freq = v1.toFixed(1) + " / " + v2.toFixed(1)  + " MHz";
                                }
                            }
                            if (ext_par.bandwidth1 != undefined && ext_par.bandwidth2 != undefined) {
                                if (ext_par.bandwidth1 != "" && ext_par.bandwidth2 != "") {
                                    var v1 = parseInt(ext_par.bandwidth1) / 1000;
                                    var v2 = parseInt(ext_par.bandwidth1) / 1000;
                                    g_device_info.bandwidth = v1 + " / " + v2  + " MHz";
                                }
                            }
                        }
		} else {
			log.error('Error, no data');
		}
	}, {
		sync: true
	});
}

function getDeviceConfig() {
	getConfigData('config/deviceinformation/config.xml', function($xml) {
		var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret)
        {
			g_device_config = config_ret;
		}
	}, {
		sync: true
	});
}

function createListForDevice(_name, _value) {
	var tdName = '';
	var values = common_unknown;
	var row = '';
	switch (_name) {
		case 'DeviceName':
			tdName = system_label_device_name;
			//_value = system_label_pro_name;
			break;

		case 'SerialNumber':
			tdName = system_label_serial_number;
			break;

		case 'Imei':
			if (g_net_mode_status == MACRO_NET_MODE_W ) {
				if (g_device_info.Imei != '') {
					tdName =system_label_imei;
				}
			}
			break;

		case 'Imsi':
			tdName = device_information_imsi;
			break;

		case 'HardwareVersion':
			tdName = system_label_hardware_version;
			break;

		case 'SoftwareVersion':
			tdName = system_label_software_version;
			break;

		case 'WebUIVersion':
			tdName = system_label_webui_version;
			break;
		case 'MacAddress1':
			tdName = wlan_label_lan_mac_address;
			break;
		case 'MacAddress2':
			if (g_device_info.MacAddress2 != '') {
				tdName = wlan_label_wan_mac_address;
			}
			break;
		case 'Iccid':
			tdName = system_label_iccid;
			break;
		case 'Msisdn':
			tdName = system_label_my_number;
			break;
		case 'ProductFamily':
			tdName = system_label_product_family;
			break;
		case 'Classify':
			tdName = system_label_classify;
			break;
		case 'WanIPAddress':
			tdName = system_label_wanip_address;
			break;
		case 'PrimaryDns':
			tdName = "DNS 1 / DNS 2";
			break;
		case 'SecondaryDns':
			tdName = "DNS 2";
			break;
		case 'Esn' :
			if (g_net_mode_status == MACRO_NET_MODE_C ) {
				if (g_device_info.Esn != '') {
					tdName = system_label_esn;
				}
			}
			break;
		case 'Meid' :
			if (g_net_mode_status == MACRO_NET_MODE_C ) {
				if(g_device_info.Esn != '' && g_device_info.Esn.charAt(0) == '8' && g_device_info.Esn.charAt(1) == '0' ) {
					tdName = system_label_meid;
				}
			}

			break;
		case 'WanIPv6Address':
			tdName = system_label_wan_IPv6_addr;
			break;
		/************************************* ******device_single */

		case 'pci':
			if(g_device_mode == g_device_mode_4g) {
				tdName = IDS_system_label_pci;
			}
			break;
		case 'sc':
			if (g_device_mode == g_device_mode_3g) {
				tdName = IDS_system_label_sc;
			}
			break;
		case 'lac':
			tdName = "LAC (hex/dec)";
			break;
		case 'cell_id':
                        if (g_device_mode == g_device_mode_2g || g_device_mode == g_device_mode_3g || g_device_mode == g_device_mode_4g) {
                        	tdName = "Cell ID (hex/dec)";
                        }               
			break;
		case 'rsrq':
			if(g_device_mode == g_device_mode_4g) {
				tdName = IDS_system_label_rsrq;
			}
			break;
		case 'rsrp':
			if(g_device_mode == g_device_mode_4g) {
				tdName = IDS_system_label_rsrp;
			}
			break;
		case 'rssi':
			if (g_device_mode == g_device_mode_2g || g_device_mode == g_device_mode_3g || g_device_mode == g_device_mode_4g) {
				tdName = IDS_system_label_rssi;
			}
			break;
		case 'sinr':
			if(g_device_mode == g_device_mode_4g) {
				tdName = IDS_system_label_sinr;
			}
			break;
		case 'rscp':
			if (g_device_mode == g_device_mode_3g) {
				tdName = IDS_system_label_rscp;
			}
			break;
		case 'ecio':
			if (g_device_mode == g_device_mode_3g) {
				tdName = "Ec/Io"/*IDS_system_label_ecio*/;
			}
			break;
		case 'band':
			if (g_device_mode == g_device_mode_4g) {
                                tdName = IDS_system_label_band;
			}
			break;
		case 'earfcn':
			if (g_device_mode == g_device_mode_4g) {
                                tdName = "EARFCN (Down/Up)";
			}
			break;
		case 'freq':
			if (g_device_mode == g_device_mode_4g) {
                                tdName = "Frequency (Down/Up)";
			}
			break;
		case 'bandwidth':
			if (g_device_mode == g_device_mode_4g) {
                                tdName = "Bandwidth (Down/Up)";
			}
			break;
		default:
			break;
	}
	if (tdName == '') {
		return row;
	}	
    if (tdName == system_label_my_number || tdName == wlan_label_lan_mac_address || tdName == wlan_label_wan_mac_address)
    {
		row = '<tr><td>' + tdName + common_colon + "</td><td class='info_value success_phone_number'>" + (_value == '' ? values : _value) + '</td></tr>';
    }
    else
    {
		row = '<tr><td>' + tdName + common_colon + "</td><td class='info_value'>" + (_value == '' ? values : _value) + '</td></tr>';
	}
	return row;

}

//Switch device info to display refrence device configuration xml
function setDeviceDisplay(_device_config, _device_info) {
	var list_content = '';
	var p = '';
	for (p in _device_info) {
		if (_device_config[p.toLowerCase()]) {
			if (typeof(_device_info[p]) != 'undefinded') {
				list_content += createListForDevice(p, _device_info[p]);
            }
            else {
				log.error("device dosen't exsited");
			}
		}
	}
	$('.diviceInfo_table').html(list_content);
}

function updateDeviceInfo () {
	if(g_net_mode_change ==  MACRO_NET_MODE_CHANGE) {
		getDeviceInfo();
		setDeviceDisplay(g_device_config, g_device_info);
		resetNetModeChange();
	}
}

function updateDeviceInfo_() {
	getDeviceInfo(); 
	setDeviceDisplay(g_device_config, g_device_info);
	setTimeout(updateDeviceInfo_, 3000);
}

getDeviceConfig();

$(document).ready( function() {
	creatFooter();

	updateDeviceInfo_();
	//getDeviceInfo();
	//setDeviceDisplay(g_device_config, g_device_info);
	if(g_net_mode_type == MACRO_NET_DUAL_MODE) {
		addStatusListener('updateDeviceInfo ()');
	}
	$('#refresh').bind('click', function() {
		getDeviceInfo();
		setDeviceDisplay(g_device_config, g_device_info);
	});
	$('#refresh_button').hide();
});
