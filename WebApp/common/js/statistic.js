// JavaScript Document
var g_monitoring_traffic_statistics = null;
var g_wlan_security_settings = null;
var g_connection_trafficresponse = null;

var g_wlanMaxApnNum = 0;
var g_wlanClientInfo = [];
/*-------------------agile variable start-------------------------*/
var MACRO_NUMBER_TRUE = 1;
var MACRO_NUMBER_FALSE = 0;
var MACRO_PREFIX_TIMER = 1;

//default value:start date and throshled
var MACRO_VALUE_START_DATE = 1;
var MACRO_VALUE_THRESHOLD = 90;
//agile set monthly data paceake whether or not
var g_set_data_package = MACRO_NUMBER_FALSE;

var g_Monthly_volume = false;
//wlan staticstics whether or not
var g_prefix_wlan = false;

//tab page flag(1 mobile,0 wlan)
var g_tab_mobile = MACRO_NUMBER_TRUE;

//threshold area
var MIN_IDLE_THRESHOLD = 1;
var MAX_IDLE_THRESHOLD = 100;

//has not set the data package
var g_agile_no_set_package_mobile = null;
var g_agile_no_set_package_wlan = null;

//current month upload and download info
var g_current_month_mobile = {
    CurrentMonthDownload: '',
    CurrentMonthUpload: '',
    MonthDuration: '',
    MonthLastClearTime: ''
};
var g_current_month_wlan = {
    CurrentMonthDownload: '',
    CurrentMonthUpload: '',
    MonthDuration: '',
    MonthLastClearTime: ''
};

//monthly day and threshold info
var g_monthly_info_mobile = {
    start_date: '',
    data_limit: '',
    month_threshold: '',
    unit_select: '',
    set_data_flag: ''
};

var g_monthly_info_wlan = {
    start_date: '',
    data_limit: '',
    month_threshold: '',
    unit_select: '',
    set_data_flag: ''
};

var g_agile_startdata_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

var g_start_date_mobile = {
    current_date: 1,
    supportted_dates: []
};
var g_start_date_wlan = {
    current_date: 1,
    supportted_dates: []
};
var g_MacfilterData = null;
var blockCount = 0 ;
var MAX_BLACKLIST_COUNT = 10 ;
var macBlankItem =[] ;

//call_dialog string
var g_set_package_table_mobile = "<div id='statistics_mobile_name' class='agile_set_dialog'><h2>";
g_set_package_table_mobile += IDS_statistics_aglie_mobile_title + '</h2>';
g_set_package_table_mobile += '<table> <tbody> <tr> <td>';
g_set_package_table_mobile += IDS_statistics_aglie_set_start_date + common_colon + '</td>';
g_set_package_table_mobile += "<td> <select id='mobile_start_date_select'></select> </td> </tr>";
g_set_package_table_mobile += "<tr id='mobile_data_volume_tr'> <td>" + IDS_statistics_aglie_set_data_volume_mobile + common_colon + '</td>';
g_set_package_table_mobile += "<td> <input style='width:100px;' type='text' class='Arabic_dialupNumber'  id='mobile_data_volume' maxlength='6'>";
g_set_package_table_mobile += " <span><select id='mobile_data_nuit_select' style='width:60px;'><option value='MB'>";
g_set_package_table_mobile += common_unit_mb + '</option>';
g_set_package_table_mobile += '<option value="GB">' + common_unit_gb + '</option>';
g_set_package_table_mobile += '</select></span></input> </td> </tr>';
g_set_package_table_mobile += "<tr id='mobile_threshold_tr'> <td> ";
g_set_package_table_mobile += IDS_statistics_aglie_data_threshold + common_colon + '</td>';
g_set_package_table_mobile += "<td> <input style='width:50px;' class='Arabic_dialupNumber' id='mobile_threshold_select' maxlength='3'></input>";
g_set_package_table_mobile += ' %' + ' </td> </tr>';
g_set_package_table_mobile += '</tbody> </table>';
g_set_package_table_mobile += '</div>';

var g_set_package_table_wlan = "<div id='statistics_wifi_name' class='agile_set_dialog'><h2>";
g_set_package_table_wlan += IDS_statistics_aglie_wifi_title + '</h2>';
g_set_package_table_wlan += '<table> <tbody> <tr> <td>';
g_set_package_table_wlan += IDS_statistics_aglie_wifi_set_enable + common_colon + '</td>';
g_set_package_table_wlan += "<td> <select id='wifi_set_enable_select' value='Enable'><option value = ' + value + '>";
g_set_package_table_wlan += common_enable + '</option>';
g_set_package_table_wlan += "<option value = ' + value + '>" + common_disable + '</option>';
g_set_package_table_wlan += '</select> </td> </tr>';
g_set_package_table_wlan += '<tr><td>' + IDS_statistics_aglie_set_start_date + common_colon + '</td>';
g_set_package_table_wlan += "<td> <select id='wifi_start_date_select'></select> </td> </tr>";
g_set_package_table_wlan += "<tr id='wifi_data_volume_tr'> <td>" + IDS_statistics_aglie_set_data_volume_wlan + common_colon + '</td>';
g_set_package_table_wlan += "<td> <input style='width:100px;' type='text' class='Arabic_dialupNumber'  id='wifi_data_volume' maxlength='6'>";
g_set_package_table_wlan += " <span><select id='wifi_data_nuit_select' style='width:60px;'><option value = ' + value + '>";
g_set_package_table_wlan += common_unit_mb + '</option>';
g_set_package_table_wlan += "<option value = ' + value + '>" + common_unit_gb + '</option>';
g_set_package_table_wlan += '</select></span></input> </td> </tr>';
g_set_package_table_wlan += "<tr id='wifi_threshold_tr'> <td> ";
g_set_package_table_wlan += IDS_statistics_aglie_data_threshold + common_colon + '</td>';
g_set_package_table_wlan += "<td> <input class='Arabic_dialupNumber'  id='wifi_threshold_select' style='width:50px;' maxlength='3'></input>" + ' %' + ' </td> </tr>';
g_set_package_table_wlan += '</tbody> </table>';
g_set_package_table_wlan += '</div>';

/*-------------------agile variable end-------------------------*/

// check  input
function agile_setting_validInput() {

    function agile_error_message(currentID, message) {
        var wrongHtml = "<tr class='pro_wrong'>";
        wrongHtml += '<td>&nbsp;</td>';
        wrongHtml += "<td colspan='2' class='error_message' id='temp_wrong'>&nbsp;</td>";
        wrongHtml += '</tr>';
        var tmpID = currentID + '_wrong';
        $('#' + currentID).closest('tr').after(wrongHtml);
        $('#temp_wrong').attr('id', tmpID);
        $('#' + tmpID).html(message);
        $('#' + currentID).focus();
    }

    function agile_check_value(currentID) {
        var flag = true;
        var tmpValue = $.trim($('#' + currentID).val());
        if ((true == isNaN(tmpValue)) || ('' == tmpValue)) {
            flag = false;
            agile_error_message(currentID, IDS_statistics_aglie_number);
        } else if (0 == (tmpValue.indexOf('0')) && (0 != parseInt(tmpValue, 10))) {
            flag = false;
            agile_error_message(currentID, IDS_statistics_aglie_input_invalid);
        } else if (-1 != tmpValue.indexOf('.')) {
            flag = false;
            agile_error_message(currentID, IDS_statistics_aglie_input_invalid);
        } else if (('mobile_threshold_select' == currentID) || ('wifi_threshold_select' == currentID)) {
            if ((parseInt(tmpValue, 10) < MIN_IDLE_THRESHOLD) || (parseInt(tmpValue, 10) > MAX_IDLE_THRESHOLD)) {
                flag = false;
                agile_error_message(currentID, IDS_statistics_aglie_range);
            }
        } else if (parseInt(tmpValue, 10) < MIN_IDLE_THRESHOLD) {
            flag = false;
            agile_error_message(currentID, IDS_statistics_aglie_input_invalid);
        }

        if (flag) {
            $('#' + currentID).val(tmpValue);
        }
        return flag;
    }

    var retValue = false;
    $.each($('.pro_wrong'), function(i) {
        $(this).remove();
    });
    $.each($('input'), function() {
        $(this).blur();
    });
    retValue = agile_check_value('mobile_data_volume');
    retValue &= agile_check_value('mobile_threshold_select');
    if (g_prefix_wlan && g_module.wifioffload_enable) {
        retValue &= agile_check_value('wifi_data_volume');
        retValue &= agile_check_value('wifi_threshold_select');
    }
    return retValue;
}

function getTrafficInfo(bit) {
    var final_number = 0;
    var final_str = '';
    bit*=8;
    if (g_monitoring_dumeter_kb > bit) {
        final_number = formatFloat(parseFloat(bit), 2);
        final_str = final_number + ' ' + common_unit_byteps;
    } else if (g_monitoring_dumeter_kb <= bit && g_monitoring_dumeter_mb > bit) {
        final_number = formatFloat(parseFloat(bit) / g_monitoring_dumeter_kb, 2);
        final_str = final_number + ' ' + common_unit_kbps;
    } else if (g_monitoring_dumeter_mb <= bit && g_monitoring_dumeter_gb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_mb), 2);
        final_str = final_number + ' ' + common_unit_mbps;
    } else if (g_monitoring_dumeter_gb <= bit && g_monitoring_dumeter_tb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_gb), 2);
        final_str = final_number + ' ' + common_unit_gbps;
    } else {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_tb), 2);
        final_str = final_number + ' ' + common_unit_tbps;
    }
    return final_str;
}
function getTrafficInfo2(bit) {
    var final_number = 0;
    var final_str = '';
    if (g_monitoring_dumeter_kb > bit) {
        final_number = formatFloat(parseFloat(bit), 2);
        final_str = final_number + ' ' + common_unit_byte;
    } else if (g_monitoring_dumeter_kb <= bit && g_monitoring_dumeter_mb > bit) {
        final_number = formatFloat(parseFloat(bit) / g_monitoring_dumeter_kb, 2);
        final_str = final_number + ' ' + common_unit_kb;
    } else if (g_monitoring_dumeter_mb <= bit && g_monitoring_dumeter_gb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_mb), 2);
        final_str = final_number + ' ' + common_unit_mb;
    } else if (g_monitoring_dumeter_gb <= bit && g_monitoring_dumeter_tb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_gb), 2);
        final_str = final_number + ' ' + common_unit_gb;
    } else {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_tb), 2);
        final_str = final_number + ' ' + common_unit_tb;
    }
    return final_str;
}

function setTrafficHTML() {
    g_connection_trafficresponse = g_monitoring_traffic_statistics;
    if(g_connection_trafficresponse != null && g_connection_trafficresponse != '') {
        //profile table info
        //$('#current_upload').html(getTrafficInfo(g_connection_trafficresponse.CurrentUpload));
        //$('#current_download').html(getTrafficInfo(g_connection_trafficresponse.CurrentDownload));
        $('#current_upload').html(getTrafficInfo2(g_connection_trafficresponse.CurrentUpload));
        $('#current_download').html(getTrafficInfo2(g_connection_trafficresponse.CurrentDownload));
        $('#total_current').html(getTrafficInfo(parseInt(g_connection_trafficresponse.CurrentUpload, 10) + parseInt(g_connection_trafficresponse.CurrentDownload, 10)));
        var trafficTimesString = getCurrentTime(g_connection_trafficresponse.CurrentConnectTime);
        $('#current_duration').html(trafficTimesString);

        //total table info
        $('#history_upload').html(getTrafficInfo(g_connection_trafficresponse.TotalUpload));
        $('#history_download').html(getTrafficInfo(g_connection_trafficresponse.TotalDownload));
        $('#total_history').html(getTrafficInfo((parseInt(g_connection_trafficresponse.TotalUpload, 10) + parseInt(g_connection_trafficresponse.TotalDownload, 10))));
        var totalTimesString = getCurrentTime(g_connection_trafficresponse.TotalConnectTime, 10);
        $('#history_duration').html(totalTimesString);
    }
    //ap station info
    if (g_module.wifioffload_enable && G_StationStatus != null) {
        $('#wifi_current_download').html(getTrafficInfo(G_StationStatus.response.RxFlux));
        $('#wifi_current_upload').html(getTrafficInfo(G_StationStatus.response.TxFlux));
        $('#wifi_total_current').html(getTrafficInfo(parseInt(G_StationStatus.response.TxFlux, 10) + parseInt(G_StationStatus.response.RxFlux, 10)));
        $('#wifi_history_download').html(getTrafficInfo(G_StationStatus.response.TotalRxFlux));
        $('#wifi_history_upload').html(getTrafficInfo(G_StationStatus.response.TotalTxFlux));
        $('#wifi_total_history').html(getTrafficInfo(parseInt(G_StationStatus.response.TotalTxFlux, 10) + parseInt(G_StationStatus.response.TotalRxFlux, 10)));

        var wifi_trafficTimesString = getCurrentTime(G_StationStatus.response.CurrentTime);
        var wifi_totalTimesString = getCurrentTime(G_StationStatus.response.TotalTime);
        $('#wifi_current_duration').html(wifi_trafficTimesString);
        $('#wifi_history_duration').html(wifi_totalTimesString);
    }
}

// set volume
function agile_no_set_data_package() {

    //mobile info
    if ('' != g_agile_no_set_package_mobile) {
        var cur_volume = getTrafficInfo2(parseInt(g_agile_no_set_package_mobile.CurrentUpload, 10) + parseInt(g_agile_no_set_package_mobile.CurrentDownload, 10));
        var cur_duration = getCurrentTime(g_agile_no_set_package_mobile.CurrentConnectTime);
        var tot_volume = getTrafficInfo2(parseInt(g_agile_no_set_package_mobile.TotalUpload, 10) + parseInt(g_agile_no_set_package_mobile.TotalDownload, 10));
        var tot_duration = getCurrentTime(g_agile_no_set_package_mobile.TotalConnectTime);
		var cur_down_speed = getTrafficInfo(g_agile_no_set_package_mobile.CurrentDownloadRate);
		var cur_up_speed = getTrafficInfo(g_agile_no_set_package_mobile.CurrentUploadRate)+'&nbsp;&nbsp;';

        $('#mobile_current_volume').html(cur_volume);
        $('#mobile_current_duration').html(cur_duration);
        $('#new_mobile_current_duration').html(cur_duration);
        $('#mobile_history_volume').html(tot_volume);
        $('#mobile_history_duration').html(tot_duration);
		$('#mobile_current_down_speed').html(cur_down_speed);
		$('#mobile_current_up_speed').html(cur_up_speed);
		
        $('#last_clear_time').html(XSSResolveCannotParseChar(g_current_month_mobile.MonthLastClearTime));
    }

    //wlan info

}

function getTrafficStatus() {
    getAjaxData('api/monitoring/traffic-statistics', function($xml) {
        var traffic_ret = xml2object($xml);
        if (traffic_ret.type == 'response') {
            g_monitoring_traffic_statistics = traffic_ret.response;
            setTrafficHTML();

            //agile open no set data package
            g_agile_no_set_package_mobile = g_monitoring_traffic_statistics;
            //if (g_Monthly_volume && (MACRO_NUMBER_FALSE == g_set_data_package)) {
                agile_no_set_data_package();
            //}
        }
    });
}

function getApStationTrafficStatus() {
    getAjaxData('api/wlan/station-information', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            G_StationStatus = ret;
            setTrafficHTML();
        }
    });
}

function getWlanMultiSSIDStatus() {
    getAjaxData('api/wlan/wifi-feature-switch', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            g_wlanMaxApnNum = parseInt(ret.response.maxapnum,10);
        }
    }, {
        sync: true
    });
    if (g_wlanMaxApnNum >= 1 || g_module.multi_ssid_enabled) {
        getWlanMultiSSIDName();
    } else {
        getWlanBasicSSIDName();
    }

}

function getWlanBasicSSIDName() {
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response') {
            var wlan_basic_settings = basic_ret.response;
            var SsidInfo = {
                SsidName: wlan_basic_settings.WifiSsid,
                SsidNumber: 0
            };
            g_wlanClientInfo = [];
            g_wlanClientInfo.push(SsidInfo);
        }
    }, {
        sync: true
    });
}

function getWlanMultiSSIDName() {
    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response' && 'undefined' != typeof(basic_ret.response.Ssids.Ssid)) {
            var wlan_basic_settings = CreateArray(basic_ret.response.Ssids.Ssid);
            g_wlanClientInfo = [];
            $.each(wlan_basic_settings, function(i, value) {
                var SsidInfo = {
                    SsidName: "",
                    SsidNumber: 0
                };
                SsidInfo.SsidName=value.WifiSsid;
                g_wlanClientInfo.push(SsidInfo);
            });
        }
    }, {
        sync: true
    });
}

function getAuthenInfo() {
    getAjaxData('api/wlan/host-list', function($xml) {
        var wlan_ret = xml2object($xml);
        var listHosts = [];
        var new_line = [];
        var i = 0;
        if (wlan_ret.type == 'response') {
            $('#table_wifiClient > tbody > tr:gt(0)').remove();
            for(i = 0; i < g_wlanClientInfo.length; i++) {
                g_wlanClientInfo[i].SsidNumber = 0;
                new_line[i] = "";
            }
            listHosts = CreateArray(wlan_ret.response.Hosts.Host);
            if(listHosts.length < 1) {
                return;
            }
            $.each(listHosts, function(n, value) {
                var connectionDuration = getCurrentTime(value.AssociatedTime);
                for(i = 0; i < g_wlanClientInfo.length; i++) {
                    if(value.AssociatedSsid == g_wlanClientInfo[i].SsidName) {
                        g_wlanClientInfo[i].SsidNumber++;
                        new_line[i] += "<tr><td class='bottom_id'>" + value.ID + '</td>';
                        new_line[i] += "<td class='bottom_ip'>" + XSSResolveCannotParseChar(value.IpAddress) + '</td>';
                        new_line[i] += "<td class='bottom_host'>" + XSSResolveCannotParseChar(value.HostName) + '</td>';
                        new_line[i] += "<td class='bottom_mac'>" + XSSResolveCannotParseChar(value.MacAddress) + '</td>';
                        new_line[i] += "<td class='bottom_associat'>" + XSSResolveCannotParseChar(connectionDuration) + '</td>';
                        new_line[i] += "<td class='bottom_operation'><span class='operation_block'>" + IDS_statistic_operation_block + '<span></td></tr>';
                    }
                }
            });
            for(i = 0; i < g_wlanClientInfo.length; i++) {
                if(g_wlanClientInfo[i].SsidNumber > 0) {
                    if(g_wlanMaxApnNum > 1 || g_module.multi_ssid_enabled) {
                        new_line[i] = '<tr><td colspan="5" class="tr_bg">' + wlan_label_multi_ssid_clients + (i+1) + common_colon + ' '
                        + g_wlanClientInfo[i].SsidNumber + '</td></tr>' + new_line[i];
                    }
                    $('#table_wifiClient').append(new_line[i]);
                }
            }
        } else {
            log.error('Load host-list data failed');
        }
    });
}

function agile_print_start_date_mobile() {
    $('#mobile_start_date_select').val(g_monthly_info_mobile.start_date);
    $('#mobile_data_volume').val(g_monthly_info_mobile.data_limit);
    $('#mobile_threshold_select').val(g_monthly_info_mobile.month_threshold);
    if ('GB' == g_monthly_info_mobile.unit_select) {
        $('#mobile_data_nuit_select').val('GB');
    } else if ('MB' == g_monthly_info_mobile.unit_select) {
        $('#mobile_data_nuit_select').val('MB');
    }
}

function agile_print_start_date_wlan() {
    $('#wifi_start_date_select').val(g_monthly_info_wlan.start_date);
    $('#wifi_data_volume').val(g_monthly_info_wlan.data_limit);
    $('#wifi_threshold_select').val(g_monthly_info_wlan.month_threshold);
    if ('GB' == g_monthly_info_wlan.unit_select) {
        $('#wifi_data_nuit_select').val('GB');
    } else if ('MB' == g_monthly_info_wlan.unit_select) {
        $('#wifi_data_nuit_select').val('MB');
    }
    // need add wlan package settings enable
}

function agile_get_volume() {
    agile_get_mobile_volume();
    if (g_prefix_wlan && g_module.wifioffload_enable) {
        agile_get_wlan_volume();
    }
}

// get mobile start date
function agile_get_start_date_mobile(option,callback_func) {
    if(option == false) {
        option = false;
    } else {
        option = true;
    }
    getAjaxData('api/monitoring/start_date', function($xml) {
        var start_date_ret = xml2object($xml);
        if (start_date_ret.type == 'response') {
            var start_date = start_date_ret.response;

            var limit_length = start_date.DataLimit.length;
            if (0 == limit_length) {
                g_monthly_info_mobile.data_limit = 0;
                g_monthly_info_mobile.unit_select = 'GB';
            } else {
                var limit_value = start_date.DataLimit.substring(0, (limit_length - 2));
                var limit_unit_str = start_date.DataLimit.substring((limit_length - 2), limit_length);
                var limit_unit = limit_unit_str.toUpperCase();

                g_monthly_info_mobile.data_limit = parseInt(limit_value, 10);
                g_monthly_info_mobile.unit_select = limit_unit;
            }
            if (('0' == start_date.StartDay) || ('' == start_date.StartDay)) {
                g_monthly_info_mobile.start_date = MACRO_VALUE_START_DATE;
            } else {
                g_monthly_info_mobile.start_date = parseInt(start_date.StartDay, 10);
            }
            if (('0' == start_date.MonthThreshold) || ('' == start_date.MonthThreshold)) {
                g_monthly_info_mobile.month_threshold = MACRO_VALUE_THRESHOLD;
            } else {
                g_monthly_info_mobile.month_threshold = start_date.MonthThreshold;
            }
            g_monthly_info_mobile.set_data_flag = start_date.SetMonthData;
            g_set_data_package = parseInt(g_monthly_info_mobile.set_data_flag, 10);
        } else {
            log.error('agile_get_start_date_mobile failed');
        }
        if(typeof callback_func == 'function') {
            callback_func();
        }
    }, {
        sync: option
    });
}

// get wifi start date
function agile_get_start_date_wlan() {

    getAjaxData('api/monitoring/start_date_wlan', function($xml) {
        var start_date_ret = xml2object($xml);
        if (start_date_ret.type == 'response') {
            var start_date = start_date_ret.response;

            var limit_length = start_date.DataLimit.length;
            if (0 == limit_length) {
                g_monthly_info_wlan.data_limit = 0;
                g_monthly_info_wlan.unit_select = 'GB';
            } else {
                var limit_value = start_date.DataLimit.substring(0, (limit_length - 2));
                var limit_unit_str = start_date.DataLimit.substring((limit_length - 2), limit_length);
                var limit_unit = limit_unit_str.toUpperCase();

                g_monthly_info_wlan.data_limit = parseInt(limit_value, 10);
                g_monthly_info_wlan.unit_select = limit_unit;
            }
            if (('0' == start_date.StartDay) || ('' == start_date.StartDay)) {
                g_monthly_info_wlan.start_date = MACRO_VALUE_START_DATE;
            } else {
                g_monthly_info_wlan.start_date = parseInt(start_date.StartDay, 10);
            }
            if (('0' == start_date.MonthThreshold) || ('' == start_date.MonthThreshold)) {
                g_monthly_info_wlan.month_threshold = MACRO_VALUE_THRESHOLD;
            } else {
                g_monthly_info_wlan.month_threshold = start_date.MonthThreshold;
            }
            g_monthly_info_wlan.set_data_flag = start_date.SetMonthData;
            g_set_data_package = parseInt(g_monthly_info_wlan.set_data_flag, 10);
        } else {
            log.error('agile_get_start_date_wlan failed');
        }
    }, {
        sync: true
    });
}

//get start date which selected
function agile_get_start_date_selected(data_info, select_id, select_date) {
    var $select = $('#' + select_id);
    var start_dataList = '';
    if ($.isArray(data_info.supportted_dates)) {
        $.each(data_info.supportted_dates, function(n, value) {
            start_dataList += '<option value = ' + value + '>' + value + '</option>';
        });
    } else if ('undefined' != typeof(data_info.supportted_dates)) {
        var value = data_info.supportted_dates;
        if ($select) {
            $select.val(value);
        }
        start_dataList += '<option value = ' + value + '>' + value + '</option>';
    } else {
        log.error('Create start date list failed');
    }

    if (!$.isArray(data_info.supportted_dates)) {
        $select.hide();
        return;
    }
    $select.append(start_dataList);
    //prefix ie6
    setTimeout( function() {
        $select.val(select_date);
    }, MACRO_PREFIX_TIMER);
}

//start date list
function agile_init_start_date_list() {
    g_start_date_mobile.supportted_dates = g_agile_startdata_list;
    g_start_date_wlan.supportted_dates = g_agile_startdata_list;

    agile_get_start_date_mobile();
    agile_print_start_date_mobile();
    agile_get_start_date_selected(g_start_date_mobile, 'mobile_start_date_select', g_monthly_info_mobile.start_date);

    if (g_prefix_wlan && g_module.wifioffload_enable) {
        agile_get_start_date_wlan();
        agile_print_start_date_wlan();
        agile_get_start_date_selected(g_start_date_wlan, 'wifi_start_date_select', g_monthly_info_wlan.start_date);
    }
}

function getAllInfo() {
    getGMonitoringStatus();
    getTrafficStatus();

    if (g_module.wifioffload_enable) {
        getApStationTrafficStatus();
    }
    if (G_MonitoringStatus.response.CurrentWifiUser > 0) {
        getAuthenInfo();
        $('#table_wifiClient').show();
    } else {
        $('#table_wifiClient > tbody > tr:gt(0)').remove();
    }
    if (g_module.wifi_enabled) {
        showBlockList();
    }
    //agile open
    if (g_Monthly_volume) {
        agile_get_start_date_mobile(false,agile_get_volume());
    }
    setTimeout(getAllInfo, g_feature.update_interval);
}

function refreshTraffic() {
    var request = {
        ClearTraffic: 1
    };
    var xmlstr = object2xml('request', request);
    log.debug(xmlstr);
    saveAjaxData('api/monitoring/clear-traffic', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            getTrafficStatus();
            if (g_module.wifioffload_enable) {
                getApStationTrafficStatus();
            }
        } else {
            log.error('code = ' + ret.error.code);
            log.error('message = ' + ret.error.message);
        }
    });
}

function cancel_RefreshTraffic() {
    $('#div_wrapper').remove();
    $('.dialog').remove();
}

//click event
function agile_click_init(enable) {
    //
    function agile_setting_packages() {
        if (!isButtonEnable('button_set_package')) {
            return;
        }
        var g_set_package_table = '';
        g_set_package_table = g_set_package_table_mobile;
        if (g_prefix_wlan && g_module.wifioffload_enable) {
            g_set_package_table += g_set_package_table_wlan;
        }

        call_dialog(IDS_statistics_aglie_set_package_dialog, g_set_package_table, common_save, 'pop_Save', common_cancel, 'pop_Cancel');
        agile_init_start_date_list();
    }

    if (MACRO_NUMBER_TRUE == g_set_data_package) {
        agile_switch_to_edit();
    }

    //set data package
    $('#pop_Save').live('click', function() {
        if (!isButtonEnable('pop_Save')) {
            return;
        }

        var validata = false;
        validata = agile_setting_validInput();
        if (!validata) {
            return;
        }

        g_set_data_package = MACRO_NUMBER_TRUE;
        agile_save_data_settings();
        agile_switch_to_edit();
        agile_get_start_date_mobile();
    });
    $('#button_set_package').click( function() {
        agile_setting_packages();
    });
    //edit data package
    $('#agile_edit_volume').live('click', function() {
        agile_setting_packages();
    });
    $('#agile_ettab_mobile').mouseover( function() {
        if (!$('#agile_ettab_mobile').hasClass('pressed')) {
            $('#agile_ettab_mobile').removeClass('pressed').removeClass('normal').addClass('hover').addClass('clr_bold').removeClass('clr_white');
        }
    });
    $('#agile_ettab_mobile').mouseout( function() {
        if (!$('#agile_ettab_mobile').hasClass('pressed')) {
            $('#agile_ettab_mobile').removeClass('pressed').removeClass('hover').addClass('normal').addClass('clr_bold').removeClass('clr_white');
        }

    });
    $('#agile_ettab_wifi').mouseover( function() {
        if (!$('#agile_ettab_wifi').hasClass('pressed')) {
            $('#agile_ettab_wifi').removeClass('pressed').removeClass('normal').addClass('hover').addClass('clr_bold').removeClass('clr_white');
        }
    });
    $('#agile_ettab_wifi').mouseout( function() {
        if (!$('#agile_ettab_wifi').hasClass('pressed')) {
            $('#agile_ettab_wifi').removeClass('pressed').removeClass('hover').addClass('normal').addClass('clr_bold').removeClass('clr_white');
        }
    });
    //tab page click
    $('#agile_ettab_mobile').live('click', function() {
        if (!isButtonEnable('agile_ettab_mobile')) {
            return;
        }
        //tab in mobile
        g_tab_mobile = MACRO_NUMBER_TRUE;

        if (g_prefix_wlan && g_module.wifioffload_enable) {
            button_enable('agile_ettab_wifi', '1');
            $('#agile_ettab_wifi').removeClass('pressed').addClass('normal').addClass('clr_bold').removeClass('clr_white');
        }
        $('#agile_ettab_mobile').removeClass('normal').removeClass('hover').removeClass('clr_bold').addClass('clr_white').addClass('pressed');
        button_enable('agile_ettab_mobile', '0');
        agile_get_mobile_volume();
    });
    if (g_prefix_wlan && g_module.wifioffload_enable) {
        $('#agile_ettab_wifi').live('click', function() {
            if (!isButtonEnable('agile_ettab_wifi')) {
                return;
            }
            //tab in wlan
            g_tab_mobile = MACRO_NUMBER_FALSE;

            $('#agile_ettab_mobile').removeClass('pressed').addClass('normal').addClass('clr_bold').removeClass('clr_white');
            $('#agile_ettab_wifi').removeClass('normal').removeClass('hover').removeClass('clr_bold').addClass('clr_white').addClass('pressed');
            button_enable('agile_ettab_wifi', '0');
            button_enable('agile_ettab_mobile', '1');
            agile_get_wlan_volume();
        });
    }

}

//init monthly volume (no set data packages)
function agile_statistics_init(enable) {

    function agile_mobile_info_init() {
        agile_get_mobile_volume();
        agile_get_start_date_mobile();
        $('#last_clear_time').html(XSSResolveCannotParseChar(g_current_month_mobile.MonthLastClearTime));
    }

    g_Monthly_volume = g_module.monthly_volume_enabled;
    getTrafficStatus();
    //wifioffload enable
    if (enable) {
        if (!g_Monthly_volume) {
            $('.no_station').remove();
            $('.agile_station').remove();
            $('.agile_station_button').remove();
            $('.agile_clear_time').remove();
            $('.have_station').show();
        } else {
            $('.have_station').remove();
            $('.no_station').remove();

            //prefix ie8
            if (!g_agile_no_set_package_mobile) {
                setTimeout(agile_mobile_info_init, MACRO_PREFIX_TIMER);
            } else {
                agile_mobile_info_init();
            }
            if (MACRO_NUMBER_FALSE == g_set_data_package) {
                if (!g_prefix_wlan) {
                    $('#statistics_wifi').hide();
                }
                $('.agile_station').show();
                $('.agile_station_button').show();
            }
        }
    } else {
        if (!g_Monthly_volume) {
            $('.no_station').show();
            $('.agile_station').remove();
            $('.agile_station_button').remove();
            $('.agile_clear_time').remove();
            $('.have_station').remove();
        } else {
            $('.have_station').remove();
            $('.no_station').remove();

            //prefix ie8
            if (!g_agile_no_set_package_mobile) {
                setTimeout(agile_mobile_info_init, MACRO_PREFIX_TIMER);
            } else {
                agile_mobile_info_init();
            }
            if (MACRO_NUMBER_FALSE == g_set_data_package) {
                $('#statistics_wifi').hide();
                $('.agile_station').show();
                $('.agile_station_button').show();
            }
        }
    }

}

//
function agile_adapter_unit(value, value_unit) {
    var ret = 0;
    if ('B' == value_unit) {
        ret = value;
    } else if ('KB' == value_unit) {
        ret = g_monitoring_dumeter_kb * value;
    } else if ('MB' == value_unit) {
        ret = g_monitoring_dumeter_mb * value;
    } else if ('GB' == value_unit) {
        ret = g_monitoring_dumeter_gb * value;
    } else if ('TB' == value_unit) {
        ret = g_monitoring_dumeter_tb * value;
    }
    return ret;
}

var g_data_unit = null;
//set month volue
function agile_set_month_volue(multi_obj, mobile_flag, wlan_flag) {
    var totalSize = 0;
    var threshold = 0;
    var preFixDuration = 0;
    var preFixUsedValue = 0;

    $('#month_duration').html(getCurrentTime(multi_obj.MonthDuration));
    $('#month_used_value').html(getTrafficInfo2(parseInt(multi_obj.CurrentMonthDownload, 10) + parseInt(multi_obj.CurrentMonthUpload, 10)));
    if (mobile_flag) {
        var mUsedValue_mobile = parseInt(multi_obj.CurrentMonthDownload, 10) + parseInt(multi_obj.CurrentMonthUpload, 10);
        var tUsedValue_mobile = parseInt(g_agile_no_set_package_mobile.TotalUpload, 10) + parseInt(g_agile_no_set_package_mobile.TotalDownload, 10);
        preFixDuration = parseInt(g_agile_no_set_package_mobile.TotalConnectTime, 10) < parseInt(multi_obj.MonthDuration, 10) ? parseInt(multi_obj.MonthDuration, 10) : parseInt(g_agile_no_set_package_mobile.TotalConnectTime, 10);
        preFixUsedValue = mUsedValue_mobile > tUsedValue_mobile ? mUsedValue_mobile : tUsedValue_mobile;
        if (g_monthly_info_mobile.unit_select == 'GB') {
            g_data_unit = common_unit_gb;
        } else {
            g_data_unit = common_unit_mb;
        }
        $('#month_total_value').html(g_monthly_info_mobile.data_limit + ' ' + g_data_unit);
        $('#total_value_used').html(getTrafficInfo2(preFixUsedValue));
        $('#total_value_duration').html(getCurrentTime(preFixDuration));
        totalSize = agile_adapter_unit(g_monthly_info_mobile.data_limit, g_monthly_info_mobile.unit_select);
        threshold = g_monthly_info_mobile.month_threshold / MAX_IDLE_THRESHOLD;
    } else if (wlan_flag) {
        var mUsedValue_wlan = parseInt(multi_obj.CurrentMonthDownload, 10) + parseInt(multi_obj.CurrentMonthUpload, 10);
        var tUsedValue_wlan = parseInt(g_agile_no_set_package_wlan.TotalUpload, 10) + parseInt(g_agile_no_set_package_wlan.TotalDownload, 10);
        preFixDuration = parseInt(g_agile_no_set_package_wlan.TotalConnectTime, 10) < parseInt(multi_obj.MonthDuration, 10) ? parseInt(multi_obj.MonthDuration, 10) : parseInt(g_agile_no_set_package_wlan.TotalConnectTime, 10);
        preFixUsedValue = mUsedValue_wlan > tUsedValue_wlan ? mUsedValue_wlan : tUsedValue_wlan;
        if (g_monthly_info_mobile.unit_select == 'GB') {
            g_data_unit = common_unit_gb;
        } else {
            g_data_unit = common_unit_mb;
        }
        $('#month_total_value').html(g_monthly_info_wlan.data_limit + ' ' + g_data_unit);
        $('#total_value_used').html(getTrafficInfo2(preFixUsedValue));
        $('#total_value_duration').html(getCurrentTime(preFixDuration));
        totalSize = agile_adapter_unit(g_monthly_info_wlan.data_limit, g_monthly_info_wlan.unit_select);
        threshold = g_monthly_info_wlan.month_threshold / MAX_IDLE_THRESHOLD;
    }

    var usedSize = parseInt(multi_obj.CurrentMonthDownload, 10) + parseInt(multi_obj.CurrentMonthUpload, 10);
    if (MACRO_NUMBER_FALSE != totalSize) {
        var persent = usedSize / totalSize;
        var per_width = parseInt($('.agile_progress_bar').width(), 10);
        var img_persent = per_width * persent;
        if (persent > threshold) {
            var tmp_width = Math.min(img_persent, per_width);
            $('#agile_used_volume').hide();
            $('#agile_threshold').css({
                'width': tmp_width,
                'display': 'block'
            });
            $('#agile_threshold').show();
        } else {
            $('#agile_threshold').hide();
            $('#agile_used_volume').css({
                'width': img_persent
            });
            $('#agile_used_volume').show();
        }
    } else {
        $('#agile_used_volume').hide();
        $('#agile_threshold').hide();
    }
}

//getAjaxData  get  mobile info
function agile_get_mobile_volume() {
    if (g_tab_mobile) {
        getAjaxData('api/monitoring/month_statistics', function($xml) {
            var content_ret = xml2object($xml);
            if ('response' === content_ret.type) {
                var month_statistics_date = content_ret.response;
                g_current_month_mobile.MonthLastClearTime = month_statistics_date.MonthLastClearTime;
                $('#last_clear_time').html(XSSResolveCannotParseChar(g_current_month_mobile.MonthLastClearTime));
                agile_set_month_volue(month_statistics_date, true, false);
            } else {
                log.debug(content_ret.type);
            }
        });
    }
}

//getAjaxData  get  wifi info
function agile_get_wlan_volume() {
    if (!g_tab_mobile) {
        getAjaxData('api/monitoring/month_statistics_wlan', function($xml) {
            var content_ret = xml2object($xml);
            if ('response' === content_ret.type) {
                var month_statistics_date = content_ret.response;
                g_current_month_wlan.MonthLastClearTime = month_statistics_date.MonthLastClearTime;
                agile_set_month_volue(month_statistics_date, false, true);
            } else {
                log.debug(content_ret.type);
            }
        });
    }
}

//switch to deit (have set data packages)
function agile_switch_to_edit() {
    clearDialog();
    $('.agile_station').remove();
    $('.agile_station_button').remove();
    if (g_prefix_wlan && g_module.wifioffload_enable) {
        $('#agile_ettab_mobile').removeClass('hover').removeClass('normal').addClass('pressed').addClass('clr_white').removeClass('clr_bold');
        $('#agile_ettab_wifi').removeClass('hover').removeClass('pressed').addClass('normal').addClass('clr_bold').removeClass('clr_white');
    } else {
        $('.agile_lgtab_header').hide();
        $('#agile_ettab_mobile').removeClass('hover').removeClass('normal').addClass('pressed').addClass('clr_white').removeClass('clr_bold');
    }

    $('#agile_lgtab').css({
        'display': 'inline'
    });
    button_enable('agile_edit_volume', '1');

    //get edit info
    agile_get_mobile_volume();
    if (g_prefix_wlan && g_module.wifioffload_enable) {
        //agile_get_wlan_volume();
        log.debug('SDK does not suport this feature');
    }
}

//saveAjaxData set moblie info
function agile_mobile_set() {
    var DataVolume = $.trim($('#mobile_data_volume').val());
    var DateSelect = $.trim($('#mobile_start_date_select').val());
    var Alarm_value = $.trim($('#mobile_threshold_select').val());
    var DataUnit = $.trim($('#mobile_data_nuit_select').val());
    var DateSelected = parseInt(DateSelect, 10) < 10 ? ('0' + DateSelect) : DateSelect;

    if ('' == DataVolume) {
        DataVolume = 0;
    }
    var action = {
        StartDay: DateSelected,
        DataLimit: (DataVolume + DataUnit),
        MonthThreshold: Alarm_value,
        SetMonthData: MACRO_NUMBER_TRUE
    };

    var action_xml = object2xml('request', action);
    saveAjaxData('api/monitoring/start_date', action_xml, function($xml) {
        var return_ret = xml2object($xml);
        if (!isAjaxReturnOK(return_ret)) {
            log.error('Save data failed');
            return false;
        }

    }, {
        sync: true
    }
    );
}

//saveAjaxData set wlan info
function agile_wlan_set() {
    var SettingFlag = $.trim($('#wifi_set_enable_select').val());
    var DataVolume = $.trim($('#wifi_data_volume').val());
    var DateSelect = $.trim($('#wifi_start_date_select').val());
    var Alarm_value = $.trim($('#wifi_threshold_select').val());
    var DataUnit = $.trim($('#wifi_data_nuit_select').val());
    var DateSelected = parseInt(DateSelect, 10) < 10 ? ('0' + DateSelect) : DateSelect;

    if ('' == DataVolume) {
        DataVolume = 0;
    }
    var action = {
        SettingEnbale: SettingFlag,
        StartDay: DateSelected,
        DataLimit: (DataVolume + DataUnit),
        MonthThreshold: Alarm_value
    };

    var action_xml = object2xml('request', action);
    saveAjaxData('api/monitoring/start_date_wlan', action_xml, function($xml) {
        var return_ret = xml2object($xml);
        if (!isAjaxReturnOK(return_ret)) {
            log.error('Save data failed');
        }
    });
}

//save users setting info
function agile_save_data_settings() {
    var iRet = false;
    iRet = agile_mobile_set();
    if (iRet && g_prefix_wlan && g_module.wifioffload_enable) {
        agile_wlan_set();
    }
}

function getBlacklistData() {
    if(g_wifiFeatureSwitch != null && g_wifiFeatureSwitch != '') {
        getAjaxData('api/wlan/multi-macfilter-settings', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_MacfilterData = CreateArray(ret.response.Ssids.Ssid);
            }
        }, {
            sync: true
        });
    } else if(g_module.multi_ssid_enabled) {
        getAjaxData('api/wlan/multi-basic-settings', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_MacfilterData = CreateArray(ret.response.Ssids.Ssid);
            }
        }, {
            sync: true
        });
    } else {
        getAjaxData('api/wlan/mac-filter', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_MacfilterData = CreateArray(ret.response);
            }
        }, {
            sync: true
        });
    }
}

function loopMacFilter(filterValue) {
    var macFilterName = '';
    var macFilterMac = '';
    var contentMessage = '';
    blockCount = 0;
    var index = 1;
    $('#table_blacklists > tbody > tr:gt(0)').remove();
    for(i = 0;i<10;i++) {
        macFilterMac = XSSResolveCannotParseChar(eval('filterValue.WifiMacFilterMac' + i));
        macFilterName = XSSResolveCannotParseChar(eval('filterValue.wifihostname' + i));
        if(typeof macFilterMac == 'undefined') {
            break;
        }
        if(macFilterMac != null && macFilterMac != '') {
            contentMessage += "<tr><td class='bottom_id'>" + index + '</td>';
            contentMessage += "<td class='bottom_host'>" + macFilterName + '</td>';
            contentMessage += "<td class='bottom_mac'>" + macFilterMac + '</td>';
            contentMessage += "<td class='bottom_operation'><span class='operation_unblock'>" + common_delete + '</span></td></tr>';
            index++;
            blockCount++;
        } else {
            macBlankItem.push(i);
        }
    }
    $('#table_blacklists').append(contentMessage);
    $(".full_blacklist").remove();
    if(blockCount >= MAX_BLACKLIST_COUNT) {
        var error_full ="<span class='full_blacklist'>"+ "( "+IDS_statistic_blacklists_full+")"+"</span>";
        $("#blacklist_title").append(error_full);
    }
}

function showBlockList() {
    getBlacklistData();
    macBlankItem = [];
    $.each(g_MacfilterData, function(i, value) {
        if(value.WifiMacFilterStatus == 2) {
            loopMacFilter(g_MacfilterData[i]);
        } else {
            macBlankItem.push(0);
        }
    });
}

function saveBlockUser(currentUserMac,currentUserHostname) {
    var wifiMacFilterMac = null;
    var saveDataCount = macBlankItem[0];
    $.each(g_MacfilterData, function(i,value) {
        if(g_MacfilterData[i].WifiMacFilterStatus!=2) {
            g_MacfilterData[i].WifiMacFilterStatus = 2;
            for(var j = 0 ;j<10;j++) {
                wifiMacFilterMac = eval('g_MacfilterData[i].WifiMacFilterMac'+ j);
                if(typeof(wifiMacFilterMac) == 'undefined') {
                    break;
                }
                eval('g_MacfilterData[i].WifiMacFilterMac'+ j+ "= '';");
                eval('g_MacfilterData[i].wifihostname'+ j+ "= '';");
            }
        }
        eval('g_MacfilterData[i].wifihostname' + saveDataCount + ' = currentUserHostname;');
        eval('g_MacfilterData[i].WifiMacFilterMac' + saveDataCount + ' = currentUserMac;');
    });
}

function postBlockUserData(currentUserMac,currentUserHostname) {
    var sendData = null;
    var sendCmd = '';
    saveBlockUser(currentUserMac,currentUserHostname);
    if(g_wifiFeatureSwitch != null && g_wifiFeatureSwitch != '') {
        sendCmd = 'api/wlan/multi-macfilter-settings';
        sendData = {
            Ssids: {
                Ssid: g_MacfilterData
            }
        };
    } else if(g_module.multi_ssid_enabled) {
        sendCmd = 'api/wlan/multi-basic-settings';
        sendData = {
            Ssids: {
                Ssid: g_MacfilterData
            },
            WifiRestart: 1
        };
    } else {
        sendCmd = 'api/wlan/mac-filter';
        sendData = g_MacfilterData[0];
    }

    var newXmlString = object2xml('request', sendData);
    saveAjaxData(sendCmd, newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            showBlockList();
            getAuthenInfo();
        } else {
            if(typeof(ret.error) != 'undefined' && ret.error.code==ERROR_SYSTEM_BUSY) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
        }
    });
}

function saveUnblockUser(currentUserMac) {
    getBlacklistData();
    for(var i = 0; i< g_MacfilterData.length;i++) {
        for(var j =0 ;j<10;j++) {
            var currentUserMacAddress = eval('g_MacfilterData[i].WifiMacFilterMac' + j);
            if(currentUserMacAddress == currentUserMac) {
                eval('g_MacfilterData[i].WifiMacFilterMac' + j+ "= '';");
                eval('g_MacfilterData[i].wifihostname' + j + "= '';");
            }
        }
    }
}

function postUnBlockUserData(currentUserMac) {
    var sendData = null;
    var sendCmd = '';
    saveUnblockUser(currentUserMac);
    if(g_wifiFeatureSwitch != null && g_wifiFeatureSwitch != '') {
        sendCmd = 'api/wlan/multi-macfilter-settings';
        sendData = {
            Ssids: {
                Ssid: g_MacfilterData
            }
        };
    } else if(g_module.multi_ssid_enabled) {
        sendCmd = 'api/wlan/multi-basic-settings';
        sendData = {
            Ssids: {
                Ssid: g_MacfilterData
            },
            WifiRestart: 1
        };
    } else {
        sendCmd = 'api/wlan/mac-filter';
        sendData = g_MacfilterData[0];
    }

    var newXmlString = object2xml('request', sendData);
    saveAjaxData(sendCmd, newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            showBlockList();
        } else {
            if(typeof(ret.error) != 'undefined' && ret.error.code==ERROR_SYSTEM_BUSY) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_failed);
            }
        }
    });
}

function getSSIDStatus() {
    if('' == g_wifiFeatureSwitch) {
        getAjaxData('api/wlan/wifi-feature-switch', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_wifiFeatureSwitch = ret.response;
            }
        }, {
            sync: true
        });
    }

}

$(document).ready( function() {
    if(typeof(user_config.force_new_statistic) != 'undefined') {
        force_new_statistic = user_config.force_new_statistic == 'true' ? true : false;
    }
    if(typeof(user_config.force_old_statistic) != 'undefined') {
        force_old_statistic = user_config.force_old_statistic == 'true' ? true : false;
    }
    if(typeof(user_config.force_both_statistic) != 'undefined') {
        force_both_statistic = user_config.force_both_statistic == 'true' ? true : false;
    }

    if(force_both_statistic) {
        $('.content').show();
        $('#old_content').show();
    } else {
        if(webui_mode == 'new' && !force_old_statistic || webui_mode == 'old' && force_new_statistic) {
            $('.content').show();
            $('#old_content').hide();
        } else {
            if(webui_mode == 'old' && !force_new_statistic || webui_mode == 'new' && force_old_statistic) {
                $('.content').hide();
                $('#old_content').show();
            }
        }
    }

    // ap station open
    if (g_module.wifioffload_enable) {
        agile_statistics_init(MACRO_NUMBER_TRUE);
    } else {
        agile_statistics_init(MACRO_NUMBER_FALSE);
    }

    if (!g_module.wifi_enabled) {
        $('.status_title').remove();
        $('.wifi_table').remove();
    }
    getSSIDStatus();
    getWlanMultiSSIDStatus();
    getAllInfo();

    //Clear History
    $('#button_clear_history').click( function() {
        showConfirmDialog(dialup_hint_reset_data_counter, refreshTraffic, cancel_RefreshTraffic);
    });
    //agile open
    agile_get_start_date_mobile();
    if (g_Monthly_volume) {
        agile_click_init();
    }
    $(".operation_block").live('click', function() {
        var currentUserMac = $(this).parent('td').parent('tr').children('.bottom_mac').text();
        var currentUserHostname = $(this).parent('td').parent('tr').children('.bottom_host').text();
        currentUserMac = XSSResolveCannotParseChar(currentUserMac);
        currentUserHostname = XSSResolveCannotParseChar(currentUserHostname);
        var currentUserStatus = g_MacfilterData[0].WifiMacFilterStatus;
        if(blockCount >=  MAX_BLACKLIST_COUNT) {
            showInfoDialog(IDS_statistic_blacklists_already_full);
        } else if(currentUserStatus == 1) {
            showConfirmDialog(IDS_statistic_whitelist_fail, function() {
                postBlockUserData(currentUserMac,currentUserHostname);
            }, function() {
            });
        } else {
            showConfirmDialog(IDS_statistic_submit_blacklists, function() {
                postBlockUserData(currentUserMac,currentUserHostname);
            }, function() {
            });
        }
    });
    $(".operation_unblock").live('click', function() {
        var currentUserMac = $(this).parent('td').parent('tr').children('.bottom_mac').text();
        showConfirmDialog(IDS_statistic_restoration_user, function() {
            postUnBlockUserData(currentUserMac);
        }, function() {
        });
    });
});

var force_new_statistic = false;
var force_old_statistic = false;
var force_both_statistic = false;
