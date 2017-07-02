var SETTING_DIALUP_MACRO_INVALID_SIM_CARD = '0';
//var NETWORK_REGISTERMODE_DEFAULT = "1";
var SETTING_DIALUP_AUTO_SEARCH_NET = 0;
var SETTING_DIALUP_MANUAL_SEARCH_NET = 1;
var SETTING_DIALUP_RAT_2G = 0;
var SETTING_DIALUP_RAT_3G = 2;
var SETTING_DIALUP_RAT_4G = 7;
var SETTING_DIALUP_PLMN = null;
var DEFAULT_DEVICE_NAME = 'default';
var AUTO_MODE = '0';
var NW_NULL_STRING = '';
var OLDINTERFACE = 0;
var NEWINTERFACE = 1;
var PLMN_USABLE = '1';
var PLMN_REGISTERED = '2';
var PLMN_FORBIDDEN = '3';
var networkband_enable = true;
var networksearch_enable = true;
var g_netsearchresponse = true;
var networksearch_hide = false;
var g_setting_netWork = {
    NetworkMode: null,
    NetworkBand: null
};
var g_networkband = {
    NetworkBands: null
};
var g_setting_register = {
    Mode: null,
    Plmn: null,
    Rat: null
};
var autoFlag=false;
var AUTO = [0, common_auto];
var GSM_ONLY = [1, dialup_label_2g_only];
var WCDMA_ONLY = [2, dialup_label_3g_only];
var GSM_PRE = [3, dialup_label_2g_preferred];
var WCDMA_PRE = [4, dialup_label_3g_preferred];
var LTE_only = [5, dialup_label_4g_only];
var LTE_PRE = [6, dialup_label_4g_preferred];
var NETWORKMODES = {
    0: common_auto,
    1: dialup_label_2g_only, //GSM only
    2: dialup_label_3g_only,//WCDMA only
    3: dialup_label_2g_preferred,//GSM Pre
    4: dialup_label_3g_preferred,//WCDMA Pre
    5: dialup_label_4g_only   //GSM only
};
var g_networknodes = {
    0: common_auto,          //auto
    1: "GSM"/*plmn_label_2g*/, //gsm
    2: "UMTS"/*plmn_label_3g*/, //wcdma
    3: "LTE"/*plmn_label_4g*/, //lte
    4: plmn_label_2g, //cdma 1x
    5: plmn_label_3g, //td-scdma
    6: plmn_label_3g, //wimax
    7: plmn_label_3g //cdma evdo
};
var g_NetworkNodesFlag = {
    0: common_auto,          //auto
    1: plmn_label_2g, //gsm
    2: plmn_label_3g, //wcdma
    3: plmn_label_4g, //lte
    4: plmn_label_2g, //cdma 1x
    5: plmn_label_3g, //td-scdma
    6: plmn_label_3g, //wimax
    7: plmn_label_3g //cdma evdo
};
var g_compoundnetworknodes = {
    1: 'GSM', //gsm
    2: 'UMTS', //wcdma
    3: 'LTE', //lte
    4: 'CDMA 1X', //cdma 1x
    5: 'TD-SCDMA', //td-scdma
    6: 'Wimax', //wimax
    7: 'EVDO' //cdma evdo
};
var g_net_mode_enable = OLDINTERFACE;
var g_network_list_empty = 1;
var g_setting_netWorkModeListIndex = [];
var g_setting_netWorkModeList = [[0, NETWORKMODES[0]],[1, NETWORKMODES[1]], [2, NETWORKMODES[2]]]; //default mode

var G850G1900 = 0x280000;
var GSM1900 = 0x200000;
var GSM1800 = 0x80;
var GSM900 = 0x300;
var GSM850 = 0x80000;
var W850W1900 = 0x4800000;
var W2100 = 0x400000;
var W1900 = 0x800000;
var W850 = 0x4000000;
var W900 = 0x2000000000000;

var g_arrNetworkBand = [];
g_arrNetworkBand.push([0x80, Label_CM_BAND_PREF_GSM_DCS_1800]);
g_arrNetworkBand.push([0x300, Label_CM_BAND_PREF_GSM_900]);
g_arrNetworkBand.push([0x200000, Label_CM_BAND_PREF_GSM_PCS_1900]);
g_arrNetworkBand.push([0x400000, Label_CM_BAND_PREF_WCDMA_I_IMT_2000]);
g_arrNetworkBand.push([0x800000, Label_CM_BAND_PREF_WCDMA_1900]);
g_arrNetworkBand.push([0x4000000, Label_CM_BAND_PREF_WCDMA_850]);
g_arrNetworkBand.push([0x40000000, Label_CM_BAND_PREF_NO_CHANGE]);
g_arrNetworkBand.push([0x4000000000000, Label_CM_BAND_PREF_WCDMA_IX_1700]);
g_arrNetworkBand.push([0x2000000000000, Label_CM_BAND_PREF_WCDMA_900]);
g_arrNetworkBand.push([0x80000, Label_CM_BAND_PREF_GSM_850]);
g_arrNetworkBand.push([0x00000001, Label_CM_BAND_PREF_BC0_A]);
g_arrNetworkBand.push([0x00000002, Label_CM_BAND_PREF_BC0_B]);
g_arrNetworkBand.push([0x00000004, Label_CM_BAND_PREF_BC1]);
g_arrNetworkBand.push([0x00000008, Label_CM_BAND_PREF_BC2]);
g_arrNetworkBand.push([0x00000010, Label_CM_BAND_PREF_BC3]);
g_arrNetworkBand.push([0x00000020, Label_CM_BAND_PREF_BC4]);
g_arrNetworkBand.push([0x00000040, Label_CM_BAND_PREF_BC5]);
g_arrNetworkBand.push([0x00000400, Label_CM_BAND_PREF_BC6]);
g_arrNetworkBand.push([0x00000800, Label_CM_BAND_PREF_BC7]);
g_arrNetworkBand.push([0x00001000, Label_CM_BAND_PREF_BC8]);
g_arrNetworkBand.push([0x00002000, Label_CM_BAND_PREF_BC9]);
g_arrNetworkBand.push([0x00004000, Label_CM_BAND_PREF_BC10]);
g_arrNetworkBand.push([0x00008000, Label_CM_BAND_PREF_BC11]);
g_arrNetworkBand.push([0x10000000, Label_CM_BAND_PREF_BC12]);
g_arrNetworkBand.push([0x20000000, Label_CM_BAND_PREF_BC14]);
g_arrNetworkBand.push([0x80000000, Label_CM_BAND_PREF_BC15]);

var vsim_status=0;

if(LANGUAGE_DATA.current_language == 'ru_ru') {
	var dialup_label_lte_bands = "Диапазоны LTE";
	var dialup_label_umts_gsm_bands = "Диапазоны UMTS и GSM";
	var dialup_label_bands_all = "Все поддерживаемые";
} else {
	var dialup_label_lte_bands = "LTE Bands";
	var dialup_label_umts_gsm_bands = "UMTS and GSM Bands";
	var dialup_label_bands_all = "All supported";
}

function transactionEnd() {
    button_enable('mobilensetting_apply', '1');
    g_netsearchresponse  = true;
}

function IsCDMAorAUTO(netmode) {
    if(false == networksearch_enable) {
        return;
    }
    if(MACRO_NET_SINGLE_MODE == g_net_mode_type) {
        return;
    }
    networksearch_hide = false;
    if(OLDINTERFACE == g_net_mode_enable) {
        if(AUTO_MODE == netmode) {
            networksearch_hide = true;
        }
    } else if(NEWINTERFACE == g_net_mode_enable) {
        if(null != netmode.match(/4|7/) || AUTO_MODE == netmode) {
            networksearch_hide = true;
        }
    } else {
        log.debug('Inteface Error');
    }
    if(true == networksearch_hide) {
        $('#networksearch h2').hide();
        $('#networksearch table').hide();
    } else {
        $('#networksearch h2').show();
        $('#networksearch table').show();
    }
}

function setting_dialup_getNetworkBand(device_name) {
    var band_list = '';
    var default_band_list = '';
    var networkBandList = [];
    var networkband_conf_file = 'config/network/networkband_' + device_name + '.xml';
    getConfigData(networkband_conf_file, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            g_networkband.NetworkBands = ret.config.NetworkBands.Band;
            jQuery.each(g_networkband.NetworkBands, function(index, value) {
                var str = getBandString(parseInt(value, 10));
                networkBandList[index] = [];
                networkBandList[index].push(value);
                networkBandList[index].push(str);
                log.debug('Band string = ' + str);
                if (str.length > 0) {
                    if (g_setting_netWork.NetworkBand == value) {
                        $('#band_select').val(str);
                        log.debug('current band = ' + str);
                    }
                }
            });
            $.each(networkBandList, function(n, value) {
                band_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
                $('#band_select').append(band_list);
            });
            /*
             $('#band_select').change(function() {
             button_enable('mobilensetting_apply', '1');
             });
             */
        }
    }, {
        sync: true
    });
}

function setNetWork() {
    getAjaxData('api/net/net-mode', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_setting_netWork.NetworkMode = parseInt(ret.response.NetworkMode, 10);
            IsCDMAorAUTO(NW_NULL_STRING + g_setting_netWork.NetworkMode);
            g_setting_netWork.NetworkBand = ret.response.NetworkBand;
            g_setting_netWork.LTEBand = ret.response.LTEBand;
            initBandSel();

            var i=0;
            var modeValidFlag = false;
            for(i=0; i < g_setting_netWorkModeList.length; i++) {
                if (g_setting_netWork.NetworkMode == g_setting_netWorkModeList[i][0]) {
                    $('#preferred_mode_select').val(g_setting_netWork.NetworkMode);
                    modeValidFlag = true;
                    break;
                }
            }
            if(false == modeValidFlag) {
                $('#preferred_mode_select').val(g_setting_netWorkModeList[0][0]);
            }
            var k=0;
            for(k=0; k < g_setting_netWorkModeList.length; k++) {
                if(g_setting_netWorkModeList[k][k] == 0) {
                    autoFlag=true;
                }
            }
            if(autoFlag) {
                if($('#preferred_mode_select').val() != 0) {
                    $('#mobile_network_note').show();
                } else {
                    $('#mobile_network_note').hide();
                }
            } else {
                $('#mobile_network_note').hide();
            }
        } else {
            log.error('MOBILENETWORKSETTING: get api/net/net-mode data error');
        }
    }, {
        errorCB: function() {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode file failed');
        }
    });

}

//a method includ 3 function
function setting_dialup_initVar() {
    this.getNetwork = function() {
        if(NEWINTERFACE == g_net_mode_enable) {
            setNetWork();
        } else {
            getAjaxData('api/net/network', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    g_setting_netWork.NetworkMode = ret.response.NetworkMode;
                    g_setting_netWork.NetworkBand = ret.response.NetworkBand;
                    var flag = 0;
                    $.each(g_setting_netWorkModeList, function(n, value) {
                        if(value[0] == g_setting_netWork.NetworkMode) {
                            flag = 1;
                            return;
                        }
                    });
                    if(1 == flag) {
                        $('#preferred_mode_select').val(g_setting_netWork.NetworkMode);
                    } else {
                        $('#preferred_mode_select').val(g_setting_netWorkModeList[0][0]);
                    }
                    var k=0;
                    for(k=0; k < g_setting_netWorkModeList.length; k++) {
                        if(g_setting_netWorkModeList[k][k] == 0) {
                            autoFlag=true;
                        }
                    }
                    if(autoFlag) {
                        if($('#preferred_mode_select').val() != 0) {
                            $('#mobile_network_note').show();
                        } else {
                            $('#mobile_network_note').hide();
                        }
                    } else {
                        $('#mobile_network_note').hide();
                    }
                    IsCDMAorAUTO(NW_NULL_STRING + parseInt($('#preferred_mode_select').val() ,10));
                } else {
                    log.error('MOBILENETWORKSETTING: get api/net/network data error');
                }
            }, {
                errorCB: function() {
                    log.error('MOBILENETWORKSETTING:get api/net/network file failed');
                }
            });

        }
    } ;//function 1 end
    this.getInfomation = function() {
        if(networkband_enable) {
            getAjaxData('api/device/information', function($xml) {
                var device_ret = xml2object($xml);
                var device_name = null;
                if (device_ret.type == 'response') {
                    device_name = getDeviceType(device_ret.response.DeviceName);
                    setting_dialup_getNetworkBand(device_name);
                } else {
                    log.error('MOBILENETWORKSETTING:get api/device/infomation data error');
                }
            }, {
                errorCB: function() {
                    log.error('MOBILENETWORKSETTING: get api/device/infomation file failed');
                }
            });
        }
    };
    this.getRegister = function() {
        getAjaxData('api/net/register', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_setting_register.Mode = parseInt(ret.response.Mode, 10);
                g_setting_register.Plmn = ret.response.Plmn;
                g_setting_register.Rat = ret.response.Rat;
                if(document.getElementById('network_select')) {
                    $('#network_select').val(g_setting_register.Mode);
                }
            } else {
                log.error('MOBILENETWORKSETTING:get api/net/register data error');
            }
        }, {
            errorCB: function() {
                log.error('MOBILENETWORKSETTING:get api/net/register file failed');
            }
        });
    };
}

function setNetWorkModeList(list) {
    var list_array = [];
    list_array = CreateArray(list);
    g_setting_netWorkModeList = [];
    $.each(list_array, function(n, value) {
        var string = "";
        var index = parseInt(value, 10);
        var i=0;
        if(value.length > 2) {
            var j = 0;
            for(j = 0; (j+1)*2 <= value.length; j++) {
                var subValue = value.substr( j * 2,  2);
                subValue = parseInt(subValue, 10);
                if(j > 0) {
                    string = string + '->';
                }
                if(g_networknodes[subValue] == g_NetworkNodesFlag[subValue]) {
                    string += g_compoundnetworknodes[subValue];
                } else {
                    string += g_networknodes[subValue];
                }
            }
        } else if(value.length == 2) {
            if(AUTO[0] == index) {
                string = g_networknodes[index];
            } else {
                string = IDS_dialup_label_only.replace('%s', g_networknodes[index]);
            }
        }
        g_setting_netWorkModeList.push([index, string]);
    });
}

var g_myInitVar = new setting_dialup_initVar();  //new  a method

function getNetWorkList() {
    getAjaxData('api/net/net-mode-list', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if(ret.response.AccessList.Access.indexOf("0302") == -1)
                ret.response.AccessList.Access.push("0302");
            if(ret.response.AccessList.Access.indexOf("0301") == -1)
                ret.response.AccessList.Access.push("0301");
            if(ret.response.AccessList.Access.indexOf("0201") == -1)
                ret.response.AccessList.Access.push("0201");
            g_network_list_empty = 0;
            //var accesslist = ret.response.AccessList.Access;
            g_setting_netWorkModeListIndex = ret.response.AccessList.Access;
            var bandList = ret.response.BandList.Band;
            var LTEBandList = ret.response.LTEBandList.LTEBand;
            if(oldornewnet == 1){
                setNetModeEnable(g_setting_netWorkModeListIndex);
                if( g_newnetmodelist.length == 2 && ((g_newnetmodelist[0] == '07' && g_newnetmodelist[1] == '04') || (g_newnetmodelist[0] == '04' && g_newnetmodelist[1] == '07'))){
                    setNetWorkModeList(g_setting_netWorkModeListIndex);
                }
            } else {
                setNetWorkModeList(g_setting_netWorkModeListIndex);
            }
        } else {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode data error');
        }
    }, {
        sync: true
    });
}

function getNetMode() {
    getAjaxData('api/net/net-mode', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_net_mode_enable = 1;
            g_setting_netWork = {
                NetworkMode: null,
                NetworkBand: null,
                LTEBand: null
            };
        } else {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode data error');
        }
    }, {
        sync: true
    }, {
        errorCB: function() {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode file failed');
        }
    });

}

function getNetworkConfig() {
    if(1 == g_net_mode_enable) {
        getNetWorkList();
    }
    getConfigData('config/network/networkmode.xml', function($xml) {
        var tempMode = [];
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            if (ret.config.networkband_enable == '0') {
                networkband_enable = false;
                $('#band_option').remove();
            }
            if(ret.config.networksearch == '0') {
                $('#networksearch h2').hide();
                $('#networksearch table').hide();
                networksearch_enable = false;
                networksearch_hide = true;
            }
            if(1 == g_network_list_empty) {
                if (ret.config.NetworkModes.Mode) {
                    ret = ret.config.NetworkModes.Mode;
                    if ($.isArray(ret)) {
                        tempMode = ret;
                    } else {
                        tempMode.push(ret);
                    }
                    g_setting_netWorkModeList = [];
                    $.each(tempMode, function(n, value) {
                        value = parseInt(value, 10);
                        if (value >= 0 && value <= 5) {
                            g_setting_netWorkModeList.push([value, NETWORKMODES[value]]);
                        }
                    });
                }
            }
        }
    }, {
        sync: true
    });
}

//    save user selected network (include mode and band)
function setting_dialup_saveVar() {
    if (!setting_dialup_gsmWcdmaNotMatch()) {
        return;
    }
    g_judgeApplyFlag = true;
    var api_post = '';
    if(1 == g_net_mode_enable) {
        if(oldornewnet == 1 && !(g_newnetmodelist.length == 2 && ((g_newnetmodelist[0] == '07' && g_newnetmodelist[1] == '04') || (g_newnetmodelist[0] == '04' && g_newnetmodelist[1] == '07')))){
            g_setting_netWork.NetworkMode = "0" + parseInt(lteenablestring, 10);
        } else {
            g_setting_netWork.NetworkMode = parseInt(g_setting_netWork.NetworkMode, 10);
            g_setting_netWork.NetworkMode = "0" + g_setting_netWork.NetworkMode;
        }
        adjustNetworkMode();
        api_post = 'api/net/net-mode';
    } else {
        api_post = 'api/net/network';
    }
    g_setting_netWork.LTEBand = g_lte_bands;
    g_setting_netWork.NetworkBand = g_umts_gsm_bands;
    var xmlstr = object2xml('request', g_setting_netWork);
    button_enable('mobilensetting_apply', '0');
    g_netsearchresponse = false;//start  transaction

    if (g_setting_register.Mode != SETTING_DIALUP_MANUAL_SEARCH_NET) {
        showWaitingDialog(common_waiting, setting_label_registering_network);
    } else if (g_setting_register.Mode == SETTING_DIALUP_MANUAL_SEARCH_NET) {
        showWaitingDialog(common_waiting, IDS_dialup_label_searching_network);
    }

    saveAjaxData(api_post, xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            //showInfoDialog(common_success);
            //if cdma, no need network search
            if(false == networksearch_hide) {
                setting_dialup_registerNetMode(g_setting_register.Mode);
            } else {
                closeWaitingDialog();
                showInfoDialog(common_success);
                transactionEnd();
            }
            readBack();
        } else {
            closeWaitingDialog();
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
            log.error('MOBILENETWORKSETTING:post api/net/network data error');
            transactionEnd();
            readBack();
        }
    }, {
        timeout: 45000,
        errorCB: function() {
            closeWaitingDialog();
            showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:post api/net/network filet filed');
            transactionEnd();
            readBack();
        }
    });
}

function setting_dialup_initSelectOption() {
    var mode_list = '';
    $.each(g_setting_netWorkModeList, function(n, value) {
        mode_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
        $('#preferred_mode_select').append(mode_list);
    });
    $('#preferred_mode_select').change( function() {
        var k=0;
        for(k=0; k < g_setting_netWorkModeList.length; k++) {
            if(g_setting_netWorkModeList[k][k] == 0) {
                autoFlag=true;
            }
        }
        if(autoFlag) {
            if($('#preferred_mode_select').val() != 0) {
                $('#mobile_network_note').show();
            } else {
                $('#mobile_network_note').hide();
            }
        } else {
            $('#mobile_network_note').hide();
        }
        g_setting_netWork.NetworkMode = $('#preferred_mode_select').val();
        g_setting_register.Mode = $('#network_select').val();
        if(true == networksearch_enable && MACRO_NET_DUAL_MODE == g_net_mode_type  ) {
            IsCDMAorAUTO(NW_NULL_STRING + parseInt($('#preferred_mode_select').val() ,10));
        }
    });
    var netWork_list = '';
    var searchNetWorkModeList = [[SETTING_DIALUP_AUTO_SEARCH_NET, common_auto],[SETTING_DIALUP_MANUAL_SEARCH_NET, common_manual]];
    if(document.getElementById('network_select')) {
        $.each(searchNetWorkModeList, function(n, value) {
            netWork_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
            $('#network_select').append(netWork_list);
        });
        $('#network_select').change( function() {
            match_plmn_name();
            setting_dialup_menuNetMode(parseInt(this.value, 10));
        });
    }

}

//
function BitwiseAndLarge(val1, val2) {
    var shift = 0, result = 0;
    var mask = ~ ((~ 0) << 30); // Gives us a bit mask like 01111..1 (30 ones)
    var divisor = 1 << 30; // To work with the bit mask, we need to clear bits at a time
    while ((val1 != 0) && (val2 != 0)) {
        var rs = (mask & val1) & (mask & val2);
        val1 = Math.floor(val1 / divisor); // val1 >>> 30
        val2 = Math.floor(val2 / divisor); // val2 >>> 30
        var i = shift++;
        for (i; i--;) {
            rs *= divisor; // rs << 30
        }
        result += rs;
    }
    return result;
}

function getBandString(band) {
    var bandstr = '';
    // band is any
    if (band == 0x3FFFFFFF) {
        bandstr = Label_CM_BAND_PREF_ANY;
    }
    // band is automatic
    else if (band == 0x680380) {
        bandstr = common_auto;
    } else {
        jQuery.each(g_arrNetworkBand, function(i, n) {
            if (BitwiseAndLarge(n[0], band) > 0) {
                if (bandstr.length > 0) {
                    bandstr += '/';
                }
                bandstr += n[1];
            }
        });
    }
    return bandstr;
}

function setting_dialup_registerNetMode(mode) {
    if (SETTING_DIALUP_AUTO_SEARCH_NET == mode) {
        g_setting_register.Plmn = '';
        g_setting_register.Rat = '';
        var xmlstr = object2xml('request', g_setting_register);
        saveAjaxData('api/net/register', xmlstr, function($xml) {
            var ret = xml2object($xml);
            closeWaitingDialog();
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(common_settings_successfull);
            } else {
                if(ERROR_SYSTEM_BUSY == ret.error.code) {
                    showInfoDialog(common_system_busy);
                } else {
                    showInfoDialog(common_failed);
                }
            }
            transactionEnd();
            g_myInitVar.getRegister();
        }, {
            timeout: 150000,
            errorCB: function() {
                closeWaitingDialog();
                showInfoDialog(common_failed);
                g_myInitVar.getRegister();
                transactionEnd();
                log.error('MOBILENETWORKSETTING:post api/net/register file failed');
            }
        });
        return;
    }
    //showWaitingDialog(common_waiting, IDS_dialup_label_searching_network);
    getAjaxData('api/net/plmn-list', function($xml) {
        var ret = xml2object($xml);
        var plmn_list = [];
        if (ret.type == 'response') {
            if (ret.response.Networks.Network) {
                if ($.isArray(ret.response.Networks.Network)) {
                    plmn_list = ret.response.Networks.Network;
                } else {
                    plmn_list.push(ret.response.Networks.Network);
                }
            }
            setting_dialup_showPlmnList(plmn_list);
        } else {
            startLogoutTimer();
            closeWaitingDialog();
            showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list data error');
            transactionEnd();
        }
    }, {
        timeout: 240000,
        errorCB: function(XMLHttpRequest, textStatus) {
            startLogoutTimer();
            closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            showInfoDialog(errorInfo);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list file failed');
            transactionEnd();
        }
    });
}

function setting_dialup_setNetMode(numeric, rat) {
    g_setting_register.Plmn = numeric;
    g_setting_register.Rat = rat;
}

function setting_dialup_menuNetMode(mode) {
    switch (mode) {
        case SETTING_DIALUP_AUTO_SEARCH_NET:
            g_setting_register.Mode = mode;
            $('#network_select').val(mode);
            break;
        case SETTING_DIALUP_MANUAL_SEARCH_NET:
            g_setting_register.Mode = mode;
            $('#network_select').val(mode);
            break;
        default:
            break;
    }
}

//
function setting_dialup_searchAndRegister(mode) {
    if (mode == SETTING_DIALUP_MANUAL_SEARCH_NET) {
        cancelLogoutTimer();
        g_setting_register.Plmn = '';
        g_setting_register.Rat = '';
        showWaitingDialog(common_waiting, common_searching);
    }

    if (mode == null) {
        showWaitingDialog(common_waiting, setting_label_registering_network);
    }

    xmlstr = object2xml('request', g_setting_register);
    saveAjaxData('api/net/register', xmlstr, function($xml) {
        var ret = xml2object($xml);        
        if (isAjaxReturnOK(ret)) {
            switch (mode) {
                case SETTING_DIALUP_MANUAL_SEARCH_NET:
                    setting_dialup_registerNetMode();
                    break;
                case SETTING_DIALUP_AUTO_SEARCH_NET:
                    showInfoDialog(common_success);
                    break;
                default:
                    startLogoutTimer();
                    closeWaitingDialog();
                    showInfoDialog(common_success);
                    //myInitVar.getRegister();
                    setting_dialup_getCurrPlmn();
                    break;
            }
            transactionEnd();
        }//return ok
        else // setting falid
        {
            startLogoutTimer();
            closeWaitingDialog();
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
            g_myInitVar.getRegister();
            transactionEnd();
            log.error('MOBILENETWORKSETTING:post api/net/register not return OK');
        }        
    }, {
        timeout: 240000,  // 2 minutes
        //sync:true,
        errorCB: function(XMLHttpRequest, textStatus) {
            startLogoutTimer();
            closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            showInfoDialog(errorInfo);
            g_myInitVar.getRegister();
            transactionEnd();
            log.error('MOBILENETWORKSETTING:post api/net/register file failed');
        }
    });//saveAjaxData end
}

function setting_dialup_getCurrPlmn() {
    getAjaxData('api/net/current-plmn', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            //$("#current_plmn").html(ret.response.ShortName).show().delay(15000).fadeOut();
            $('#current_plmn').css({
                display: 'none'
            });
        } else {
            //showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:get api/net/current-plmn data error');
        }
    }, {
        errorCB: function() {
            log.error('MOBILENETWORKSETTING:get api/net/current-plmn file failed');
        }
    });
}

function setting_dialup_showPlmnList(plmnList) {
    closeWaitingDialog();
    call_dialog(setting_label_listing_network, "<table id='plmn_list' class='plmn_list'></table>", common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    var plmn_li_list =[];

    if (plmnList.length > 0) {
        button_enable('pop_OK', '0');
        var ifChecked = '';
        $.each(plmnList, function(n, value) {
            var plmnState = null;
            switch (value.State) {
                case PLMN_USABLE:
                    plmnState = plmn_label_usable;
                    break;

                case PLMN_REGISTERED:
                    plmnState = plmn_label_registered;
                    break;

                case PLMN_FORBIDDEN:
                    plmnState = plmn_label_forbidden;
                    break;

                default:
                    plmnState = common_unknown;
                    break;
            }
            if (plmnState == plmn_label_registered) {
                ifChecked = 'checked';
                button_enable('pop_OK', '1');
            } else {
                ifChecked = '';
            }
            var net_mode;
            switch(parseInt(value.Rat,10)) {
                case SETTING_DIALUP_RAT_2G:
                    net_mode = plmn_label_2g;
                    break;
                case SETTING_DIALUP_RAT_3G:
                    net_mode = plmn_label_3g;
                    break;
                case SETTING_DIALUP_RAT_4G:
                    net_mode = plmn_label_4g;
                    break;
                default:
                    break;
            }
            plmn_li_list += "<tr height = '35'><td ><input type = 'radio' name='netMode' value = '" + n + "' " + ifChecked + " id='netMode_" + n + "'></td>" +
            "<td ><label for = 'netMode_" + n + "' >" +
            value.Numeric + ' ' +
            XSSResolveCannotParseChar(value.ShortName) + ' ' +
            net_mode + '</label><span>' + '&nbsp;' +
            ' (' + plmnState + ')' +
            '</span></td></tr>';
        });
        $('#pop_OK').bind('click', function() {
            if (!isButtonEnable('pop_OK')) {
                return;
            }
            $('#div_wrapper,.dialog').hide();
            var index = $('#plmn_list :checked').val();
            setting_dialup_setNetMode(plmnList[index].Numeric, plmnList[index].Rat);
            setting_dialup_searchAndRegister(null);
        });
    } else {
        plmn_li_list = '<tr><td>' + setting_label_no_network + '</td></tr>';
        $('#pop_Cancel').hide();
        $('#pop_OK').bind('click', function() {
            if (!isButtonEnable('pop_OK')) {
                return;
            }
            $('#div_wrapper,.dialog').hide();
            startLogoutTimer();
            g_myInitVar.getRegister();
        });
        transactionEnd();
    }
    $('#plmn_list').append(plmn_li_list);
    $('#pop_Cancel,.dialog_close_btn').bind('click', function() {
        $('#div_wrapper,.dialog').hide();
        transactionEnd();
        startLogoutTimer();
    });
    $(":radio").bind('click', function() {
        button_enable('pop_OK', '1');
    });
    reputPosition($('#sms_dialog'), $('#div_wrapper'));
}

function setting_dialup_connectionStatus() {
    if (false == g_netsearchresponse) {
        return;
    }
    var dialupStatus = G_MonitoringStatus.response.ConnectionStatus;
    var connectionIsUnFree = (
        MACRO_CONNECTION_CONNECTING == dialupStatus ||
        MACRO_CONNECTION_CONNECTED == dialupStatus ||
        MACRO_CONNECTION_DISCONNECTING == dialupStatus
    );
    if (connectionIsUnFree) {
        $(':input').attr('disabled', true);
        $('#pop_OK').addClass('disable_btn');
        $('#lang').attr('disabled', false);
        button_enable('mobilensetting_apply', '0');
    } else {
        $(':input').attr('disabled', false);
        $('#pop_OK').removeClass('disable_btn');
        button_enable('mobilensetting_apply', '1');
    }
}

function setting_dialup_gsmWcdmaNotMatch() {
    var cnnectType = g_setting_netWork.NetworkMode;
    var bandValue = g_setting_netWork.NetworkBand;
    if ((cnnectType == WCDMA_ONLY[0]) && (
    (bandValue == G850G1900) ||
    (bandValue == GSM1900) ||
    (bandValue == GSM1800) ||
    (bandValue == GSM900) ||
    (bandValue == GSM850))) {
        showInfoDialog(dialup_hint_wcdma_only_gsm_band);
        return false;
    } else if ((cnnectType == GSM_ONLY[0]) &&
    ((bandValue == W850W1900) ||
    (bandValue == W2100) ||
    (bandValue == W1900) ||
    (bandValue == W850) ||
    (bandValue == W900))) {
        showInfoDialog(dialup_hint_gsm_only_wcdma_band);
        return false;
    } else {
        return true;
    }
}

function getDeviceType(deviceName) {
    var szTmp = deviceName.split('-');
    var deviceType = null;
    deviceType = deviceName.match(/[a-zA-Z]+\d+/);
    if (2 == szTmp.length) {
        deviceType = deviceType + '-' + szTmp[1];
    }
    return deviceType;
}

function match_plmn_name() {
    getAjaxData('api/net/current-plmn', function($xml) {
        var currently_plmn = null;
        var current_plmn_ret = xml2object($xml);
        if (current_plmn_ret.type == 'response') {
            currently_plmn = current_plmn_ret;
        }
    }, {
        sync: true
    });
}

function getNetModeConfig() {
    function isValidType(inputType,defaultType) {
        if(typeof(inputType) == 'undefined' || '' == $.trim(inputType)) {
            return defaultType;
        } else {
            return inputType;
        }
    }

    var net_work1 = null;
    var net_work2 = null;
    var net_work3 = null;
    var net_work4 = null;
    var net_work5 = null;
    var net_mode1 = null;
    var net_mode2 = null;
    var net_mode3 = null;
    var net_mode4 = null;
    var net_mode5 = null;
    var net_mode6 = null;
    var net_mode7 = null;
    getConfigData('config/network/net-mode.xml', function($xml) {
        var ret =  xml2object($xml);
        if(ret.type == 'config') {
            var networkData = ret.config;
            net_work1 = networkData.net_works.net_work1;
            net_work2 = networkData.net_works.net_work2;
            net_work3 = networkData.net_works.net_work3;
            net_work4 = networkData.net_works.net_work4;
            net_work5 = networkData.net_works.net_work5;

            net_mode1 = networkData.net_modes.net_mode1;
            net_mode2 = networkData.net_modes.net_mode2;
            net_mode3 = networkData.net_modes.net_mode3;
            net_mode4 = networkData.net_modes.net_mode4;
            net_mode5 = networkData.net_modes.net_mode5;
            net_mode6 = networkData.net_modes.net_mode6;
            net_mode7 = networkData.net_modes.net_mode7;
        }

        NETWORKMODES[parseInt(net_work1.index,10)] = isValidType(net_work1.networktype, NETWORKMODES[parseInt(net_work1.index,10)]);
        NETWORKMODES[parseInt(net_work2.index,10)] = isValidType(net_work2.networktype, NETWORKMODES[parseInt(net_work2.index,10)]);
        NETWORKMODES[parseInt(net_work3.index,10)] = isValidType(net_work3.networktype, NETWORKMODES[parseInt(net_work3.index,10)]);
        NETWORKMODES[parseInt(net_work4.index,10)] = isValidType(net_work4.networktype, NETWORKMODES[parseInt(net_work4.index,10)]);
        NETWORKMODES[parseInt(net_work5.index,10)] = isValidType(net_work5.networktype, NETWORKMODES[parseInt(net_work5.index,10)]);

        g_networknodes[parseInt(net_mode1.index,10)] =  isValidType(net_mode1.networktype, g_networknodes[parseInt(net_mode1.index,10)]);
        g_networknodes[parseInt(net_mode2.index,10)] =  isValidType(net_mode2.networktype, g_networknodes[parseInt(net_mode2.index,10)]);
        g_networknodes[parseInt(net_mode3.index,10)] =  isValidType(net_mode3.networktype, g_networknodes[parseInt(net_mode3.index,10)]);
        g_networknodes[parseInt(net_mode4.index,10)] =  isValidType(net_mode4.networktype, g_networknodes[parseInt(net_mode4.index,10)]);
        g_networknodes[parseInt(net_mode5.index,10)] =  isValidType(net_mode5.networktype, g_networknodes[parseInt(net_mode5.index,10)]);
        g_networknodes[parseInt(net_mode6.index,10)] =  isValidType(net_mode6.networktype, g_networknodes[parseInt(net_mode6.index,10)]);
        g_networknodes[parseInt(net_mode7.index,10)] =  isValidType(net_mode7.networktype, g_networknodes[parseInt(net_mode7.index,10)]);
    }, {
        sync: true
    });
}

redirectOnCondition(null, 'mobilenetworksettings');
function main_executeBeforeDocumentReady() {
    getConfigData('config/network/networkmode.xml', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            if('1' != ret.config.networksearchwhenconnected) {
                addStatusListener('setting_dialup_connectionStatus()');
            }
        }
    }, {
        sync: true
    });
}

main_executeBeforeDocumentReady();
function dualModeCheck() {
    if(true == networksearch_enable && MACRO_NET_DUAL_MODE == g_net_mode_type && MACRO_NET_MODE_CHANGE == g_net_mode_change) {//config display and support double mode and mode change
        setNetWork();
        resetNetModeChange();
    }
}

function initVsim() {
    getAjaxData("api/vsim/operateswitch-vsim", function($xml) {
        var vsim_info = xml2object($xml);
        if("response" == vsim_info.type) {
            var g_vsim_info = vsim_info.response;
            vsim_status = g_vsim_info.vsim_status;
        }

    }, {
        sync: true
    });
}

var lte_band_1 = 0x1;
var lte_band_3 = 0x4;
var lte_band_7 = 0x40;
var lte_band_8 = 0x80;
var lte_band_20 = 0x80000;
var lte_band_38 = 0x2000000000;
var lte_band_40 = 0x8000000000;
var umts_band_1 = 0x400000;
var umts_band_8 = 0x2000000000000;
var umts_band_all = 0x2000000400000;
var gsm_band_850 = 0x80000;
var gsm_band_900 = 0x300;
var gsm_band_1800 = 0x80;
var gsm_band_1900 = 0x200000;
var gsm_band_all = 0x280380;

var g_lte_bands;
var g_umts_gsm_bands;

function initBandSel() {
    g_lte_bands = g_setting_netWork.LTEBand;

    if (g_lte_bands == "7FFFFFFFFFFFFFFF") {
        $('#LTE_All').get(0).checked = true;
        $('#LTE_B1').get(0).checked = false;
        $('#LTE_B3').get(0).checked = false;
        $('#LTE_B7').get(0).checked = false;
        $('#LTE_B8').get(0).checked = false;
        $('#LTE_B20').get(0).checked = false;
        $('#LTE_B38').get(0).checked = false;
        $('#LTE_B40').get(0).checked = false;
        $('#LTE_B1').attr('disabled','disabled');
        $('#LTE_B3').attr('disabled','disabled');
        $('#LTE_B7').attr('disabled','disabled');
        $('#LTE_B8').attr('disabled','disabled');
        $('#LTE_B20').attr('disabled','disabled');
        $('#LTE_B38').attr('disabled','disabled');
        $('#LTE_B40').attr('disabled','disabled');
    }
    else {
        $('#LTE_All').get(0).checked = false;
        var lbm = parseInt(g_lte_bands, 16);
        $('#LTE_B1').get(0).checked = (lbm & lte_band_1) != 0;
        $('#LTE_B3').get(0).checked = (lbm & lte_band_3) != 0;
        $('#LTE_B7').get(0).checked = (lbm & lte_band_7) != 0;
        $('#LTE_B8').get(0).checked = (lbm & lte_band_8) != 0;
        $('#LTE_B20').get(0).checked = (lbm & lte_band_20) != 0;
        $('#LTE_B38').get(0).checked = BitwiseAndLarge(lbm, lte_band_38) != 0;
        $('#LTE_B40').get(0).checked = BitwiseAndLarge(lbm, lte_band_40) != 0;
        $('#LTE_B1').removeAttr('disabled');
        $('#LTE_B3').removeAttr('disabled');
        $('#LTE_B7').removeAttr('disabled');
        $('#LTE_B8').removeAttr('disabled');
        $('#LTE_B20').removeAttr('disabled');
        $('#LTE_B38').removeAttr('disabled');
        $('#LTE_B40').removeAttr('disabled');
    }

    g_umts_gsm_bands = g_setting_netWork.NetworkBand;

    if (g_umts_gsm_bands == "3FFFFFFF") {
        $('#UMTS_GSM_All').get(0).checked = true;
        $('#UMTS_B1').get(0).checked = false;
        $('#UMTS_B8').get(0).checked = false;
        $('#GSM_850').get(0).checked = false;
        $('#GSM_900').get(0).checked = false;
        $('#GSM_1800').get(0).checked = false;
        $('#GSM_1900').get(0).checked = false;
        $('#UMTS_B1').attr('disabled','disabled');
        $('#UMTS_B8').attr('disabled','disabled');
        $('#GSM_850').attr('disabled','disabled');
        $('#GSM_900').attr('disabled','disabled');
        $('#GSM_1800').attr('disabled','disabled');
        $('#GSM_1900').attr('disabled','disabled');
    }
    else {
        $('#UMTS_GSM_All').get(0).checked = false;
        var ugbm = parseInt(g_umts_gsm_bands, 16);
        $('#UMTS_B1').get(0).checked = (ugbm & umts_band_1) != 0;
        $('#UMTS_B8').get(0).checked = BitwiseAndLarge(ugbm, umts_band_8) != 0;
        $('#GSM_850').get(0).checked = (ugbm & gsm_band_850) != 0;
        $('#GSM_900').get(0).checked = (ugbm & gsm_band_900) != 0;
        $('#GSM_1800').get(0).checked = (ugbm & gsm_band_1800) != 0;
        $('#GSM_1900').get(0).checked = (ugbm & gsm_band_1900) != 0;
        $('#UMTS_B1').removeAttr('disabled');
        $('#UMTS_B8').removeAttr('disabled');
        $('#GSM_850').removeAttr('disabled');
        $('#GSM_900').removeAttr('disabled');
        $('#GSM_1800').removeAttr('disabled');
        $('#GSM_1900').removeAttr('disabled');
    }
}

function adjustNetworkMode() {
    var net_mode = g_setting_netWork.NetworkMode;
    if (net_mode == "00")
        net_mode = "030201";
    
    if (g_lte_bands != "7FFFFFFFFFFFFFFF") {
        if (parseInt(g_lte_bands, 16) == 0) {
            net_mode = net_mode.replace("03", "");
            g_setting_netWork.NetworkMode = net_mode;
        }
    }
        
    if (g_umts_gsm_bands != "3FFFFFFF") {
        var ugbm = parseInt(g_umts_gsm_bands, 16);
        if (BitwiseAndLarge(ugbm, umts_band_all) == 0) {
            net_mode = net_mode.replace("02", "");
            g_setting_netWork.NetworkMode = net_mode;







        }
        if ((ugbm & gsm_band_all) == 0) {
            net_mode = net_mode.replace("01", "");
            g_setting_netWork.NetworkMode = net_mode;
        }
    }
}

function readBack() {
    getAjaxData('api/net/net-mode', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_setting_netWork.NetworkMode = parseInt(ret.response.NetworkMode, 10);
            g_setting_netWork.NetworkBand = ret.response.NetworkBand;
            g_setting_netWork.LTEBand = ret.response.LTEBand;
            $('#preferred_mode_select').val(g_setting_netWork.NetworkMode);
            initBandSel();
        } else {
        }
    }, {
        errorCB: function() {
        }
    });
}

$(document).ready( function() {

    if(MACRO_NET_DUAL_MODE == g_net_mode_type) {
        addStatusListener('dualModeCheck()');
    }
    getNewNetMode();
    getNetModeConfig();
    getNetMode();
    getNetworkConfig();
    if(oldornewnet == 1 && !(g_newnetmodelist.length == 2 && ((g_newnetmodelist[0] == '07' && g_newnetmodelist[1] == '04') || (g_newnetmodelist[0] == '04' && g_newnetmodelist[1] == '07')))){
        supportNetEnabled();
        g_myInitVar.getInfomation();
        g_myInitVar.getRegister();
        setting_dialup_enable();
    } else {
        g_myInitVar.getNetwork();
        g_myInitVar.getInfomation();
        g_myInitVar.getRegister();
        setting_dialup_initSelectOption();
    }
    
    if(g_moduleswitch.vsim_enabled == 1) {
        initVsim();
        if (vsim_status != 2) {
            button_enable('mobilensetting_apply', '0');
            $('input:not(#lang)').attr('disabled', true);
            $('select:not(#lang)').attr('disabled', true);
            showInfoDialog(IDS_vsim_function_show);
        }

    }
    $('#mobilensetting_apply').bind('click', function() {
        if (!isButtonEnable('mobilensetting_apply')) {
            return;
        }
        if(oldornewnet == 1 && !(g_newnetmodelist.length == 2 && ((g_newnetmodelist[0] == '07' && g_newnetmodelist[1] == '04') || (g_newnetmodelist[0] == '04' && g_newnetmodelist[1] == '07')))){
            if(onlteenable){
                ltenet();
            }else {
                net3gwork();
            }
        }
        getAjaxData("api/monitoring/status", function($xml) {
            var gstatus_ret = xml2object($xml);
            if(gstatus_ret.type == "response") {
                G_MonitoringStatus = gstatus_ret;
            }
        }, {
            sync: true
        });
        var dialupStatus = G_MonitoringStatus.response.ConnectionStatus;
        if(MACRO_CONNECTION_CONNECTED == dialupStatus) {
            showConfirmDialog(IDS_networksettings_search_hint, setting_dialup_saveVar, function() {
            });
        } else {
            setting_dialup_saveVar();
        }
    });
    $("input[name='LTE_Band']").click(function() {
        if ($('#LTE_All').get(0).checked) {
            g_lte_bands = "7FFFFFFFFFFFFFFF";
            $('#LTE_B1').attr('disabled','disabled');
            $('#LTE_B3').attr('disabled','disabled');
            $('#LTE_B7').attr('disabled','disabled');
            $('#LTE_B8').attr('disabled','disabled');
            $('#LTE_B20').attr('disabled','disabled');
            $('#LTE_B38').attr('disabled','disabled');
            $('#LTE_B40').attr('disabled','disabled');
        }
        else {
            var lbm = 0;
            if ($('#LTE_B1').get(0).checked)
                lbm += lte_band_1;
            if ($('#LTE_B3').get(0).checked)
                lbm += lte_band_3;
            if ($('#LTE_B7').get(0).checked)
                lbm += lte_band_7;
            if ($('#LTE_B8').get(0).checked)
                lbm += lte_band_8;
            if ($('#LTE_B20').get(0).checked)
                lbm += lte_band_20;
            if ($('#LTE_B38').get(0).checked)
                lbm += lte_band_38;
            if ($('#LTE_B40').get(0).checked)
                lbm += lte_band_40;
            g_lte_bands = lbm.toString(16).toUpperCase();
            $('#LTE_B1').removeAttr('disabled');
            $('#LTE_B3').removeAttr('disabled');
            $('#LTE_B7').removeAttr('disabled');
            $('#LTE_B8').removeAttr('disabled');
            $('#LTE_B20').removeAttr('disabled');
            $('#LTE_B38').removeAttr('disabled');
            $('#LTE_B40').removeAttr('disabled');
        }
    });
    $("input[name='UMTS_GSM_Band']").click(function() {
        if ($('#UMTS_GSM_All').get(0).checked) {
            g_umts_gsm_bands = "3FFFFFFF";
            $('#UMTS_B1').attr('disabled','disabled');
            $('#UMTS_B8').attr('disabled','disabled');
            $('#GSM_850').attr('disabled','disabled');
            $('#GSM_900').attr('disabled','disabled');
            $('#GSM_1800').attr('disabled','disabled');
            $('#GSM_1900').attr('disabled','disabled');
        }
        else {
            var ugbm = 0;
            if ($('#UMTS_B1').get(0).checked)
                ugbm += umts_band_1;
            if ($('#UMTS_B8').get(0).checked)
                ugbm += umts_band_8;
            if ($('#GSM_850').get(0).checked)
                ugbm += gsm_band_850;
            if ($('#GSM_900').get(0).checked)
                ugbm += gsm_band_900;
            if ($('#GSM_1800').get(0).checked)
                ugbm += gsm_band_1800;
            if ($('#GSM_1900').get(0).checked)
                ugbm += gsm_band_1900;
            g_umts_gsm_bands = ugbm.toString(16).toUpperCase();
            $('#UMTS_B1').removeAttr('disabled');
            $('#UMTS_B8').removeAttr('disabled');
            $('#GSM_850').removeAttr('disabled');
            $('#GSM_900').removeAttr('disabled');
            $('#GSM_1800').removeAttr('disabled');
            $('#GSM_1900').removeAttr('disabled');
        }
    });
    $('#mobile_network_note td:eq(1)').css({
        color: '#ff0000'
    });

});

function getNewNetMode() {
    getAjaxData('api/net/net-feature-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            oldornewnet = ret.response.net_premode_switch;
        } else {
            oldornewnet = 0;
        }
    }, {
        sync: true
    });

}
var onlteenable = false;
function setting_dialup_enable(){   
    for(var i=0;i<g_newnetmodelist.length ;i++){
        if(g_newnetmodelist[i] == '03'){
            onlteenable = true;
            break;
        } else {
            onlteenable = false;
        }
    }
    
    if(onlteenable){
        $('.net_lte_enable').show();
        $('.net_mode_select').hide();
        $('#mobile_network_note').hide();
        if(g_setting_netWork.NetworkMode == 0){
            $('#net_lte_enable').get(0).checked = true;
        } else {
            $('#net_lte_enable').get(0).checked = false;
        }
        if(g_newnetmodelist.length == 1 && g_newnetmodelist[0] == '03'){
            $('.dialup_label_network').hide();
            $('.net_lte_enable').hide();
        }
    } else {
        $('.net_3g_enable').show();
        $('.net_mode_select').hide();
        $('#mobile_network_note').hide();
        if(g_setting_netWork.NetworkMode == 0){
            $('#net3gwork').get(0).checked = true;
        } else {
            $('#net3gwork').get(0).checked = false;
        }
        if(g_newnetmodelist.length == '1'){
            $('.dialup_label_network').hide();
            $('.net_3g_enable').hide();
        } else if ((g_newnetmodelist[0] == '07' && g_newnetmodelist[1] == '02')||(g_newnetmodelist[0] == '02' && g_newnetmodelist[1] == '07')){
            $('.dialup_label_network').hide();
            $('.net_3g_enable').hide();
        }
    }
    var netWork_list = '';
    var searchNetWorkModeList = [[SETTING_DIALUP_AUTO_SEARCH_NET, common_auto],[SETTING_DIALUP_MANUAL_SEARCH_NET, common_manual]];
    if(document.getElementById('network_select')) {
        $.each(searchNetWorkModeList, function(n, value) {
            netWork_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
            $('#network_select').append(netWork_list);
        });
        $('#network_select').change( function() {
            match_plmn_name();
            setting_dialup_menuNetMode(parseInt(this.value, 10));
        });
    }
}

function supportNetEnabled(){
    getAjaxData('api/net/net-mode', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_setting_netWork.NetworkMode = parseInt(ret.response.NetworkMode, 10);
            IsCDMAorAUTO(NW_NULL_STRING + g_setting_netWork.NetworkMode);
            g_setting_netWork.NetworkBand = ret.response.NetworkBand;
            g_setting_netWork.LTEBand = ret.response.LTEBand;
            
        }
    }, {
            sync: true        
    });
}

var g_newnetmodelist = [];
var oldornewnet = 0;
function setNetModeEnable(list){
    var list_array = [];
    list_array = CreateArray(list);
    var g_netmodelist = [];
    $.each(list_array, function(n, value) {
        var subValue = "";
        var i=0;
        if(value.length > 2) {
            var j = 0;
            for(j = 0; (j+1)*2 <= value.length; j++) {
                subValue = value.substr( j * 2,  2);
                if(subValue != '00'){
                    g_netmodelist.push(subValue);
                }
            }
            
        } else if(value.length == 2) {
            if( value != '00'){
                g_netmodelist.push(value);
            }
        }
    });
    for(var i=0;i<g_netmodelist.length ;i++){ 
        for(var j=i+1;j<g_netmodelist.length;j++){ 
            if(g_netmodelist[i] == g_netmodelist[j]){ 
                j=++i; 
            } 
        } 
        g_newnetmodelist.push(g_netmodelist[i]); 
    }
}
var lteenablestring = '';
function ltenet(){
    if($('#net_lte_enable').get(0).checked){
        lteenablestring = '00';
    } else {
        var netmodesize = g_newnetmodelist.length;
        if(netmodesize == 2){
            $.each(g_newnetmodelist,function(n,value){
                if(g_newnetmodelist[n] == '01'){
                    lteenablestring = '01';
                }else{
                    lteenablestring = '02';
                }
            });
        } else if (netmodesize == 3){
            var oncdma = false;
            var ongps = false;
            for(var i=0;i<g_newnetmodelist.length ;i++){
                if(g_newnetmodelist[i] == '07'){
                    oncdma = true;
                } else if( g_newnetmodelist[i] == '01'){
                    ongps = true;
                }
            };
            if(oncdma){
                
                if(ongps){
                    lteenablestring = '040701';
                } else {
                    lteenablestring = '040702';
                }
            } else {
                lteenablestring = '0201';
            }
        } else if (netmodesize == 4){
            lteenablestring = '04070201';
        }
    }
}

function net3gwork(){
    if($('#net3gwork').get(0).checked){
        lteenablestring = '00';
    } else {
        lteenablestring ='01';
    }
}
