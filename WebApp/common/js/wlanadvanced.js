// JavaScript Document
/****************************************************wlanadvanced (start)************************************/
var WLAN_CHANNEL_AUTO = '0';
var WIFI5G_CHANNEL_MODE0 = '0';
var WORKINGBAND_2_4G = '2.4';
var WORKINGBAND_5G = '5';
var WIFI5G_ON = '1';
var WIFI_AUTOCOUNTRY_ON = '1';
var g_wlan_dataInfo = ''; //Data of WiFi Basic or security Setting
var g_WifiFeature = null;
var g_currentWorkingBand = '';
var g_currentWifiMode = "";
var g_autoSwitch = '';
var g_featureSwitch = null;
var AN_MODE = "802.11a/n";
var g_ap_isolation = 0;
var wlan_basicData = [];
var ap_isalation_flag = false;
var g_unsupportedCountry = "";
var g_wifi_unsupportedCountry = "";
var g_indoorOnlyChannel = [];
var DOUBLE_CHIP = '1';
var g_wlan_dataInfo_ex = [];
var is_24G_first = true;
var is_5G_first = true;
var IDS_wlan_fre_0 = '2.4GHz';
var IDS_wlan_fre_1 = '5GHz';
var wlan_label_80211a = "802.11a";
var wlan_label_80211an = "802.11a/n";
var wlan_label_80211anac = "802.11a/n/ac";
var g_isChangeWiFiMode = false;
var g_temp_select_WifiWorkingBand = '';
var g_wlan_doubleSsidStatus = null;
var pinstatus_ret = '';
var ssid5g = '';
function wlanadvanced_initChannel(channel_max,channel_min) {
    $('#select_WifiChannel').empty();
    $("#5Gwifi_notes").empty();
    $("#5Gwifi_notes_tr").hide();
    $('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
    if(!channel_min) {
        var i = 0;
        for (i = 1; i <= channel_max; i++) {
            $('#select_WifiChannel').append('<option value=' + i + '>' + i + '</option>');
        }
    } else {
        var m = parseInt(channel_min,10);
        var n = parseInt(channel_max,10);
        var j = 0;
        for (j=m; j <= n; j++) {
            $('#select_WifiChannel').append('<option value=' + j + '>' + j + '</option>');
        }
    }

}

function wlanadvanced_addChannel(channel_max, channel_min) {

    $("#5Gwifi_notes").empty();
    $("#5Gwifi_notes_tr").hide();
    if(!channel_min) {
        var i = 0;
        for (i = 1; i <= channel_max; i++) {
            $('#select_WifiChannel').append('<option value=' + i + '>' + i + '</option>');
        }
    } else {
        var m = parseInt(channel_min,10);
        var n = parseInt(channel_max,10);
        var j = 0;
        for (j=m; j <= n; j++) {
            $('#select_WifiChannel').append('<option value=' + j + '>' + j + '</option>');
        }
    }

}

function  wlanadvanced_splitChannel(channelDetail) {
    if(String(channelDetail).indexOf(",")<0) {
        if(String(channelDetail).indexOf("-")<0) {
            wlanadvanced_initChannel(channelDetail);
        } else {
            var contryChannel = String(channelDetail).split("-");
            wlanadvanced_initChannel(contryChannel[1],contryChannel[0]);
        }
    } else {
        $('#select_WifiChannel').empty();
        $('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
        var contryChannelArrey = channelDetail.split(',');
        $.each(contryChannelArrey, function(n, value) {
            if(String(value).indexOf("-")<0) {
                wlanadvanced_addChannel(value, value);
            } else {
                var contryChannel = String(value).split("-");
                wlanadvanced_addChannel(contryChannel[1],contryChannel[0]);
            }
        });
    }

}

function wlanadvanced_initChannel_2g(channel_max,channel_min) {
    $('#select_WifiChannel_2g').empty();
    $('#select_WifiChannel_2g').append("<option value='0'>" + common_auto + '</option>');
    if(!channel_min) {
        var i = 0;
        for (i = 1; i <= channel_max; i++) {
            $('#select_WifiChannel_2g').append('<option value=' + i + '>' + i + '</option>');
        }
    } else {
        var m = parseInt(channel_min,10);
        var n = parseInt(channel_max,10);
        var j = 0;
        for (j=m; j <= n; j++) {
            $('#select_WifiChannel_2g').append('<option value=' + j + '>' + j + '</option>');
        }
    }

}

function wlan_initWifiMode_singleWorkingBand() {
    $('#select_WifiMode').empty();
    $('#select_WifiMode').append('<option value="b/g/n">'+ wlan_label_80211bgn + '</option>');
}

function wlan_initWifiMode_singleWorkingBand_2g() {
    $('#select_WifiMode_2g').empty();
    $('#select_WifiMode_2g').append('<option value="b/g/n">'+ wlan_label_80211bgn + '</option>');
}

function wlan_initWifiMode_singleWorkingBand_5g() {
    $('#select_WifiMode_5g').empty();
    if('1' == g_featureSwitch.acmode_enable) {
        $('#select_WifiMode_5g').append('<option value="a/n/ac">'+ wlan_label_80211anac + '</option>');
    } else {
        $('#select_WifiMode_5g').append('<option value="a/n">'+ AN_MODE + '</option>');
    }
}

function wlan_initWifiMode(workingBand) {
    $('#select_WifiMode').empty();
    if ((WIFI5G_ON == g_featureSwitch.wifi5g_enabled) && (WORKINGBAND_5G == workingBand)) {
        if('1' == g_featureSwitch.acmode_enable) {
            $('#select_WifiMode').append('<option value="a/n/ac">'+ wlan_label_80211anac + '</option>');

        } else {
            $('#select_WifiMode').append('<option value="a/n">'+ AN_MODE + '</option>');

        }
    } else {
        $('#select_WifiMode').append('<option value="b/g/n">'+ wlan_label_80211bgn + '</option>');
    }
}

function wlanadvanced_wifi5G_initChannel(country) {
    $('#select_WifiChannel').empty();
    $("#5Gwifi_notes").empty();
    $("#5Gwifi_notes_tr").hide();
    $('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
    wlanadvance_wifi5G_countryChannel(country);
}

function wlanadvanced_wifi5G_initChannel_5g(country) {
    $('#select_WifiChannel_5g').empty();
    $('#select_WifiChannel_5g').append("<option value='0'>" + common_auto + '</option>');
    wlanadvance_wifi5G_countryChannel_5g(country);
}

function wlanadvanced_support2Band_initChannel(country,channelModeArray) {
    $('#select_WifiWorkingBand').empty();
    $('#select_WifiWorkingBand').append('<option value = "2.4">'+IDS_wlan_fre_0+'</script></option>');
    $('#select_WifiWorkingBand').append('<option value = "5">'+IDS_wlan_fre_1+'</script></option>');
    if(($.browser.msie) && ($.browser.version == 6.0)) {
        setTimeout( function() {
            $('#select_WifiWorkingBand').val(g_currentWorkingBand);
        }, 1);
        wlan_initWifiMode(g_currentWorkingBand);
        setTimeout( function() {
            $('#select_WifiMode').val(g_currentWifiMode);
        }, 5);
        if(WORKINGBAND_5G == g_currentWorkingBand) {
            for (i = 0; i < channelModeArray.length; i++) {
                $('#select_WifiChannel').append('<option value=' + channelModeArray[i] + '>' + channelModeArray[i] + '</option>');
            }
        } else {
            setTimeout( function() {
                wifiCountry_channel(country);
            }, 1);
        }
    } else {
        $('#select_WifiWorkingBand').val(g_currentWorkingBand);
        wlan_initWifiMode(g_currentWorkingBand);
        setTimeout( function() {
            $('#select_WifiMode').val(g_currentWifiMode);
        }, 5);
        if(WORKINGBAND_5G == g_currentWorkingBand) {
            for (i = 0; i < channelModeArray.length; i++) {
                $('#select_WifiChannel').append('<option value=' + channelModeArray[i] + '>' + channelModeArray[i] + '</option>');
            }
        } else {
            wifiCountry_channel(country);
        }
    }
}

function wlanadvanced_support2Band_initChannel_5g(country,channelModeArray) {

    for (i = 0; i < channelModeArray.length; i++) {
        $('#select_WifiChannel_5g').append('<option value=' + channelModeArray[i] + '>' + channelModeArray[i] + '</option>');
    }
}

function wlanadvance_wifi5G_countryChannel(country) {
    var i = 0;
    for (i = 0; i < countryArray.length; i++) {
        if (countryArray[i][0] == country) {
            if (WIFI5G_CHANNEL_MODE0 == countryArray[i][3]) {
                $('#select_WifiWorkingBand').empty();
                $('#select_WifiWorkingBand').append('<option value = "2.4">'+IDS_wlan_fre_0+'</script></option>');
                if(String(countryArray[i][1]).indexOf("-")<0) {
                    wlanadvanced_initChannel(countryArray[i][1]);
                } else {
                    var contryChannel = String(countryArray[i][1]).split("-");
                    wlanadvanced_initChannel(contryChannel[1],contryChannel[0]);
                }
                $('#select_WifiWorkingBand').val(WORKINGBAND_2_4G);
                wlan_initWifiMode(WORKINGBAND_2_4G);
            }
            var j = 2;
            for( j = 2; j < modeLength; j++) {
                if (j == countryArray[i][3]) {
                    wlanadvanced_support2Band_initChannel(country,g_modeArray[j]);
                }
            }
            break;
        }

        if ('AUTO' == country) {
            $('#select_WifiWorkingBand').empty();
            $('#select_WifiWorkingBand').append('<option value = "2.4">'+IDS_wlan_fre_0+'</script></option>');
            wlan_initWifiMode(WORKINGBAND_2_4G);
            $('#select_WifiMode').val('b/g/n');
        }
    }
}

function wlanadvance_wifi5G_countryChannel_5g(country) {
    var i = 0;
    for (i = 0; i < countryArray.length; i++) {
        if (countryArray[i][0] == country) {
            var j = 2;
            for(j = 2; j < modeLength; j++) {
                if (j == countryArray[i][3]) {
                    wlanadvanced_support2Band_initChannel_5g(country,g_modeArray[j]);
                }
            }
            break;
        }
    }
}

function wifiCountry_channel(country) {
    $.each(countryArray, function(n, value) {
        if (value[0] == country) {
            wlanadvanced_splitChannel(value[1]);
            return;
        }
    });
}

function wifiCountry_channel_2g(country) {
    $.each(countryArray, function(n, value) {
        if (value[0] == country) {
            if(String(value[1]).indexOf("-")<0) {
                wlanadvanced_initChannel_2g(value[1]);
            } else {
                var contryChannel = String(value[1]).split("-");
                wlanadvanced_initChannel_2g(contryChannel[1],contryChannel[0]);
            }
            if ($('#select_WifiChannel_2g').val() > value[1]) {
                setTimeout( function() {
                    $('#select_WifiChannel_2g').val(WLAN_CHANNEL_AUTO);
                }, 2);
            }
            return;
        }
    });
}

function wlanadvanced_initCountry() {
    $('#select_WifiChannel').unbind('click');
    $('#select_WifiCountry').empty();

    if (null == g_featureSwitch) {
        $('#select_WifiCountry').append("<option value='AUTO'>" + common_auto + '</option>');
    }
    g_wifi_unsupportedCountry = g_countryChannel.unsupport_wifi_country_list;
    var i = 0;
    for (i = 0; i < countryArray.length; i++) {
        if ((g_wifi_unsupportedCountry.indexOf(countryArray[i][0].toLowerCase())) == -1) {
            $('#select_WifiCountry').append('<option value=' + countryArray[i][0] + '>' + countryArray[i][2] + '</option>');
        }
    }
}

function wlanadvanced_initCountry_for_Idevice() {
    var $countryList = $('#select_WifiCountry_for_Idevice')[0].options;
    $.each(countryArray, function(n, value) {
        if ((g_wifi_unsupportedCountry.indexOf(value[0].toLowerCase())) == -1) {
            $countryList.add(new Option(value[2], value[0]));
        }
    });
}

function wlanadvanced_ifWifioffenable(enable) {
    if(enable=='0') {
        $('#select_WifiAutooffTime').attr('disabled', 'disabled');
    } else {
        $('#select_WifiAutooffTime').removeAttr('disabled');
    }
}

function setDataToComponentIE6() {
    // set wifi channel
    setTimeout( function() {
        $('#select_WifiChannel').val( g_wlan_dataInfo.WifiChannel );
        $("#5Gwifi_notes").empty();
        $("#5Gwifi_notes_tr").hide();
        var i = 0;
        for(i; i<=g_indoorOnlyChannel.length; i++) {
            if( g_indoorOnlyChannel[i] == $("#select_WifiChannel").val()) {
                $("#5Gwifi_notes_tr").show();
                $("#5Gwifi_notes").html(wlan_label_5gWifi_indoor);
            }
        }
        if($("#select_WifiChannel").val() >= 100 && $("#select_WifiChannel").val() <=140) {
            $("#5Gwifi_notes_tr").show();
            $("#5Gwifi_notes").html(wlan_label_5gWifi_check);
        }
    }, 1);
    // set wifi Mode
    setTimeout( function() {
        $('#select_WifiMode').val( g_wlan_dataInfo.WifiMode );
    }, 1);
    // set wifi Isolate
    if(g_module.multi_ssid_enabled || null != g_featureSwitch ) {

        setTimeout( function() {
            $('#select_WifiIsolate_between').val(g_ap_isolation);
        }, 1);
    } else {
        setTimeout( function() {
            $('#select_WifiIsolate_between').val( g_wlan_dataInfo.WifiIsolate );
        }, 1);
    }

    //set wifi wifioffenable
    setTimeout( function() {
        $('#select_WifiAutooffStatus').val( g_wlan_dataInfo.Wifioffenable );
    }, 1);
    setTimeout( function() {
        $('#select_WifiAutooffTime').val( g_wlan_dataInfo.Wifiofftime );
    }, 1);
    setTimeout( function() {
        $('#select_wifiBandWidth').val(g_wlan_dataInfo.wifibandwidth);
    }, 1);
    setTimeout( function() {
        wlanadvanced_ifWifioffenable(g_wlan_dataInfo.Wifioffenable);
    }, 1);
    $("input[name='radio_autocountry'][value='"+g_wlan_dataInfo.wifiautocountryswitch+"']").attr('checked', true);
}

function change2MixWifiMode() {
    if (null != g_featureSwitch && WIFI5G_ON != g_featureSwitch.wifi5g_enabled) {
        if(g_wlan_dataInfo.WifiMode != 'b/g/n') {
            g_wlan_dataInfo.WifiMode = 'b/g/n';
            g_isChangeWiFiMode = true;
        }
    }
}

function wlanadvanced_initPage() {
    if(null != g_featureSwitch) {
        if('1' == g_featureSwitch.wifi_country_enable) {
            if ($.browser.ipad) {
                $('#select_WifiCountry_for_Idevice').show();
                wlanadvanced_initCountry_for_Idevice();
            } else {
                $('#select_WifiCountry').show();
                if($('#select_WifiCountry').children().size() <= 1) {
                    wlanadvanced_initCountry();
                }
            }
        } else if('0' == g_featureSwitch.wifi_country_enable) {
            $('#autoCountry').remove();
            $('#wlan_country').hide();
        } else if('undefined' == typeof(g_featureSwitch.wifi_country_enable)) {
            if(g_featureSwitch.isdoublechip != DOUBLE_CHIP) {
                if ($.browser.ipad) {
                    $('#select_WifiCountry_for_Idevice').show();
                    wlanadvanced_initCountry_for_Idevice();
                } else {
                    $('#select_WifiCountry').show();
                    if($('#select_WifiCountry').children().size() <= 1) {
                        wlanadvanced_initCountry();
                    }
                }
            }
        }
    }

    var strUrl = 'api/wlan/basic-settings';

    if (g_module.multi_ssid_enabled || null != g_featureSwitch) {
        if( DOUBLE_CHIP == g_featureSwitch.isdoublechip ) {

            strUrl = 'api/wlan/multi-security-settings-ex';

        } else {

            strUrl = 'api/wlan/multi-security-settings';
        }
    }
    if(null != g_featureSwitch || g_module.multi_ssid_enabled) {
        getAjaxData('api/wlan/multi-basic-settings', function($xml) {
            var ret = xml2object($xml);
            wlan_basicData = CreateArray(ret.response.Ssids.Ssid);
            ssid5g = wlan_basicData.length/2;
            $(wlan_basicData).each( function(i) {
                delete wlan_basicData[i].WifiWpapsk;
                delete  wlan_basicData[i].MixWifiWpapsk;
                delete  wlan_basicData[i].WifiWep128Key1;
                delete  wlan_basicData[i].WifiWep128Key2;
                delete  wlan_basicData[i].WifiWep128Key3;
                delete  wlan_basicData[i].WifiWep128Key4;
                delete	wlan_basicData[i].WifiWepKey1;
                delete  wlan_basicData[i].WifiWepKey2;
                delete   wlan_basicData[i].WifiWepKey3;
                delete   wlan_basicData[i].WifiWepKey4;
                if(wlan_basicData[i].WifiIsolate == 1) {
                    g_ap_isolation = 1;
                    ap_isalation_flag = true;
                    return;
                }

            });
        }, {
            sync:true
        });

    }

    if( null != g_featureSwitch && DOUBLE_CHIP != g_featureSwitch.isdoublechip) {
        getAjaxData(strUrl, function($xml) {
            var ret = xml2object($xml);
            if (ret.type != 'response') {
                return;
            }
            g_wlan_dataInfo = ret.response;

            if ("a/n" == g_wlan_dataInfo.WifiMode || "a/n/ac" == g_wlan_dataInfo.WifiMode) {
                g_currentWorkingBand = WORKINGBAND_5G;
            } else {
                g_currentWorkingBand = WORKINGBAND_2_4G;
            }

            //setting bandwith
            change2MixWifiMode(g_wlan_dataInfo.WifiMode);

            // set country
            if ($.browser.ipad) {
                setTimeout( function() {
                    $('#select_WifiCountry_for_Idevice').val(g_wlan_dataInfo.WifiCountry);
                }, 1);
                var country = g_wlan_dataInfo.WifiCountry;

                if (null != g_featureSwitch && WIFI5G_ON == g_featureSwitch.wifi5g_enabled) {
                    wlanadvanced_wifi5G_initChannel(country);
                } else {
                    wlan_initWifiMode_singleWorkingBand();
                    wifiCountry_channel(country);
                    $('#select_WifiCountry').removeAttr('disabled');
                }

                $('#select_WifiCountry_for_Idevice').bind('change', function() {
                    country = $('#select_WifiCountry_for_Idevice').val();
                    wifiCountry_channel(country);
                    button_enable('apply_button', '1');
                });
            } else {
                var i = 0;
                setTimeout( function() {
                    $('#select_WifiCountry').val(g_wlan_dataInfo.WifiCountry);
                }, 1);
                if (null != g_featureSwitch && WIFI5G_ON == g_featureSwitch.wifi5g_enabled) {
                    wlanadvanced_wifi5G_initChannel(g_wlan_dataInfo.WifiCountry);
                } else {
                    $('#select_WifiCountry').removeAttr('disabled');
                    $('#select_WifiWorkingBand').hide();
                    wlan_initWifiMode_singleWorkingBand();
                    for (i = 0; i < countryArray.length; i++) {
                        if (countryArray[i][0] == g_wlan_dataInfo.WifiCountry) {
                            $('#select_WifiChannel').show();
                            wlanadvanced_splitChannel(countryArray[i][1]);

                            break;
                        }
                    }
                }
            }

            if('undefined' != typeof(g_countryChannel.indoor_only_channel_list) || '' != g_countryChannel.indoor_only_channel_list.trim()) {
                if(isNaN(g_countryChannel.indoor_only_channel_list)) {
                    g_indoorOnlyChannel = g_countryChannel.indoor_only_channel_list.split(",");
                } else {
                    g_indoorOnlyChannel.push(g_countryChannel.indoor_only_channel_list);
                }
            }
            if(($.browser.msie) && ($.browser.version == 6.0)) {
                setDataToComponentIE6();
            } else {

                setTimeout( function() {
                    // set wifi channel
                    $('#select_WifiChannel').val(g_wlan_dataInfo.WifiChannel);
                    $("#5Gwifi_notes").empty();
                    $("#5Gwifi_notes_tr").hide();
                    var i = 0;
                    for(i; i <= g_indoorOnlyChannel.length; i++) {
                        if( g_indoorOnlyChannel[i]== $("#select_WifiChannel").val()) {
                            $("#5Gwifi_notes_tr").show();
                            $("#5Gwifi_notes").html(wlan_label_5gWifi_indoor);
                            break;
                        }
                    }
                    if($("#select_WifiChannel").val() >= 100 && $("#select_WifiChannel").val() <=140) {
                        $("#5Gwifi_notes_tr").show();
                        $("#5Gwifi_notes").html(wlan_label_5gWifi_check);
                    }

                    // set wifi Mode
                    $('#select_WifiMode').val(g_wlan_dataInfo.WifiMode);
                }, 1);
                // set wifi Isolate
                if (g_module.multi_ssid_enabled || null != g_featureSwitch  ) {
                    $('#select_WifiIsolate_between').val(g_ap_isolation);
                } else {
                    $('#select_WifiIsolate_between').val(g_wlan_dataInfo.WifiIsolate);
                }

                //set wifi wifioffenable
                $('#select_WifiAutooffStatus').val(g_wlan_dataInfo.Wifioffenable);
                $('#select_WifiAutooffTime').val(g_wlan_dataInfo.Wifiofftime);
                //set wifi bandwith

                if( "0" != g_wlan_dataInfo.wifibandwidth  && "20" != g_wlan_dataInfo.wifibandwidth ) {
                    setTimeout( function() {
                        $('#select_wifiBandWidth').val('0');
                    }, 3);
                } else if( "0" == g_wlan_dataInfo.wifibandwidth ) {
                    setTimeout( function() {
                        $('#select_wifiBandWidth').val(g_wlan_dataInfo.wifibandwidth);
                    }, 3);
                } else {
                    setTimeout( function() {
                        $('#select_wifiBandWidth').val(g_wlan_dataInfo.wifibandwidth);
                    }, 3);
                }

                $("input[name='radio_autocountry'][value='"+g_wlan_dataInfo.wifiautocountryswitch+"']").attr('checked', true);

                wlanadvanced_ifWifioffenable(g_wlan_dataInfo.Wifioffenable);
            }

            g_autoSwitch = $("input[name='radio_autocountry']:checked").val();
            $('#select_WifiCountry').removeAttr('disabled');
            $('#select_WifiWorkingBand').removeAttr('disabled');
            $("#select_WifiMode").removeAttr('disabled');
            $("#select_WifiChannel").removeAttr('disabled');
            $("#select_WifiAutooffStatus").removeAttr('disabled');
            $("#select_wifiBandWidth").removeAttr('disabled');

            if (null != g_featureSwitch && WIFI_AUTOCOUNTRY_ON == g_featureSwitch.wifiautocountry_enabled) {
                if ('1' == g_autoSwitch) {
                    setTimeout( function() {
                        $('#select_WifiCountry').attr('disabled', 'disabled');
                    },5);
                } else {
                    $('#select_WifiCountry').removeAttr('disabled');
                }
            }
            if(g_isChangeWiFiMode) {
                setTimeout( function() {
                    ifWifioffenable_apply(true);
                }, 1000);
            }
            getStatus();
            if(null != g_featureSwitch && '1' == g_featureSwitch.wifi_dfs_enable &&
            (WIFI5G_ON == g_featureSwitch.wifi5g_enabled) && (WORKINGBAND_5G == g_currentWorkingBand)) {
                $('#autoCountry_turn_on').attr('disabled', 'disabled');
                $('#autoCountry_turn_off').attr('disabled', 'disabled');
                $('#select_WifiCountry').attr('disabled', 'disabled');
                $('#autoCountry_turn_on').attr('checked', true);
            } else {
                $('#autoCountry_turn_on').removeAttr('disabled');
                $('#autoCountry_turn_off').removeAttr('disabled');
                if(null != $("#autoCountry_turn_off").attr("checked")) {
                    $('#select_WifiCountry').removeAttr('disabled');
                }
            }
            if(null != g_featureSwitch && '1' == g_featureSwitch.wifi_dfs_enable
            && (255 == G_MonitoringStatus.response.SimStatus || 1 == G_MonitoringStatus.response.SimlockStatus || 2 == G_MonitoringStatus.response.cellroam
            || 260 == pinstatus_ret.SimState || 261 == pinstatus_ret.SimState)) {
                $('#select_WifiWorkingBand').attr('disabled','disabled');
                $('#select_WifiChannel').attr('disabled','disabled');
                $('#autoCountry_turn_on').attr('disabled', 'disabled');
                $('#autoCountry_turn_off').attr('disabled', 'disabled');
                $('#select_WifiCountry').attr('disabled', 'disabled');
                $('#select_WifiWorkingBand').val('2.4');
                $('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
                $('#autoCountry_turn_on').attr('checked', true);
            } else {
                if(WORKINGBAND_2_4G == g_currentWorkingBand) {
                    $('#select_WifiWorkingBand').removeAttr('disabled');
                    if(G_MonitoringStatus.response.WifiConnectionStatus == '901') {
                        $('#select_WifiChannel').attr('disabled','disabled');
                    } else {
                        $('#select_WifiChannel').removeAttr('disabled');
                    }

                    $('#autoCountry_turn_on').removeAttr('disabled');
                    $('#autoCountry_turn_off').removeAttr('disabled');
                    if(null != $("#autoCountry_turn_off").attr("checked")) {
                        $('#select_WifiCountry').removeAttr('disabled');
                    }
                }
            }
        }, {
            sync: true
        });
    } else {
        getAjaxData(strUrl, function($xml) {

            var ret = xml2object($xml);
            g_wlan_dataInfo_ex = CreateArray(ret.response.ssids.ssid);

            $(g_wlan_dataInfo_ex).each( function(i) {

                // set wifi Isolate
                if ( null != g_featureSwitch  ) {
                    if(ap_isalation_flag) {
                        $('#select_WifiIsolate_band').val(g_ap_isolation);
                    } else {
                        $('#select_WifiIsolate_band').val(0);
                    }

                } else {
                    $('#select_WifiIsolate_band').val(g_wlan_dataInfo_ex[i].WifiIsolationBetween);
                }

                var country = g_wlan_dataInfo_ex[i].WifiCountry ;
                //setting 2.4G security data

                if( (g_wlan_dataInfo_ex[i].WifiMode != "a/n" || g_wlan_dataInfo_ex[i].WifiMode != "a" || g_wlan_dataInfo_ex[i].WifiMode != "a/n/ac") && (is_24G_first == true) ) {

                    is_24G_first  = false;

                    //setting select_mode
                    wlan_initWifiMode_singleWorkingBand_2g();
                    setTimeout( function() {
                        $('#select_WifiMode_2g').val(g_wlan_dataInfo_ex[i].WifiMode);
                    }, 3);
                    //setting bandwith
                    wifiCountry_channel_2g( country );
                    setTimeout( function() {
                        $('#select_WifiChannel_2g').val(g_wlan_dataInfo_ex[i].WifiChannel);
                    }, 3);
                    if( "0" != g_wlan_dataInfo_ex[i].wifibandwidth  && "20" != g_wlan_dataInfo_ex[i].wifibandwidth ) {
                        setTimeout( function() {
                            $('#select_wifiBandWidth_2g').val('0');
                        }, 3);
                    } else if( "0" == g_wlan_dataInfo_ex[i].wifibandwidth ) {
                        setTimeout( function() {
                            $('#select_wifiBandWidth_2g').val(g_wlan_dataInfo_ex[i].wifibandwidth);
                        }, 3);
                    } else {
                        setTimeout( function() {
                            $('#select_wifiBandWidth_2g').val(g_wlan_dataInfo_ex[i].wifibandwidth);
                        }, 3);
                    }

                } else if( (g_wlan_dataInfo_ex[i].WifiMode == "a/n" || g_wlan_dataInfo_ex[i].WifiMode == "a" || g_wlan_dataInfo_ex[i].WifiMode == "a/n/ac") && (is_5G_first == true)) {

                    is_5G_first  = false;

                    //setting select_mode
                    wlan_initWifiMode_singleWorkingBand_5g();
                    if( null != g_featureSwitch && g_featureSwitch.acmode_enable != 1) {
                        $("#select_WifiMode_5g option[value='a/n/ac']").remove();
                    }

                    setTimeout( function() {
                        $('#select_WifiMode_5g').val(g_wlan_dataInfo_ex[i].WifiMode);
                    }, 3);
                    //setting bandwith

                    //set countryChannel

                    wlanadvanced_wifi5G_initChannel_5g(country);
                    setTimeout( function() {
                        $('#select_WifiChannel_5g').val(g_wlan_dataInfo_ex[i].WifiChannel);
                    }, 3);
                    if( "0" != g_wlan_dataInfo_ex[i].wifibandwidth  && "20" != g_wlan_dataInfo_ex[i].wifibandwidth ) {
                        setTimeout( function() {
                            $('#select_wifiBandWidth_5g').val('0');
                        }, 3);
                    } else if( "0" == g_wlan_dataInfo_ex[i].wifibandwidth ) {
                        setTimeout( function() {
                            $('#select_wifiBandWidth_5g').val(g_wlan_dataInfo_ex[i].wifibandwidth);
                        }, 3);
                    } else {
                        setTimeout( function() {
                            $('#select_wifiBandWidth_5g').val(g_wlan_dataInfo_ex[i].wifibandwidth);
                        }, 3);
                    }
                }

            });
            getStatus_5g();
        });
    }
}

function refresh_5G() {
    if(null == G_MonitoringStatus) {
        return;
    }
    if(null != $('#select_WifiWorkingBand').attr('disabled')) {
        return;
    }
    if(255 == G_MonitoringStatus.response.SimStatus || 1 == G_MonitoringStatus.response.SimlockStatus || 2 == G_MonitoringStatus.response.cellroam
    || 260 == pinstatus_ret.SimState || 261 == pinstatus_ret.SimState) {
        refresh();
    }
}

function wlanadvanced_changeChannel() {
    var i = 0;
    var wifiCountry = $.trim($('#select_WifiCountry').val());
    var channelIndex = 0;
    var channelEnd = 0;
    for (i = 0; i < countryArray.length; i++) {
        log.debug('country:' + countryArray[i][2]);
        if (countryArray[i][0] == wifiCountry) {
            wlanadvanced_splitChannel(countryArray[i][1]);
            break;
        }
    }
}

function ifWifioffenable_apply(doNotshowDialogFlag) {
    if (!doNotshowDialogFlag && !isButtonEnable('apply_button')) {
        return;
    }
    if(null != g_featureSwitch && '0' == g_featureSwitch.wifi_country_enable) {
        $('#autoCountry').remove();
        $('#wlan_country').hide();
    } else if(null != g_featureSwitch && '1' == g_featureSwitch.wifi_country_enable) {
        // set wifi country
        if ($.browser.ipad) {
            g_wlan_dataInfo.WifiCountry = $('#select_WifiCountry_for_Idevice').val();
        } else {
            g_wlan_dataInfo.WifiCountry = $('#select_WifiCountry').val();
        }
    } else if('undefined' == typeof(g_featureSwitch.wifi_country_enable)) {
        if( null != g_featureSwitch && DOUBLE_CHIP != g_featureSwitch.isdoublechip ) {
            // set wifi country
            if ($.browser.ipad) {
                g_wlan_dataInfo.WifiCountry = $('#select_WifiCountry_for_Idevice').val();
            } else {
                g_wlan_dataInfo.WifiCountry = $('#select_WifiCountry').val();
            }
        }
    }

    if( null != g_featureSwitch && DOUBLE_CHIP != g_featureSwitch.isdoublechip ) {
        g_wlan_dataInfo.WifiChannel = $('#select_WifiChannel').val();
        if (null != g_featureSwitch && WIFI5G_ON == g_featureSwitch.wifi5g_enabled) {
            if($('#select_WifiWorkingBand').children().size() >= 1) {
                var WifiWorkingBand = $("#select_WifiWorkingBand").val();
            }

            if('5' == WifiWorkingBand) {
                if('1' == g_featureSwitch.acmode_enable) {
                    g_wlan_dataInfo.WifiMode = "a/n/ac";
                } else {
                    g_wlan_dataInfo.WifiMode = "a/n";
                }
            } else {
                g_wlan_dataInfo.WifiMode = "b/g/n";
            }
            if('1' == g_featureSwitch.wifi_dfs_enable) {
                $("#wlan_channel").show();
            }
        } else {
            g_wlan_dataInfo.WifiMode = "b/g/n";
        }

        // set wifi auto off enable status
        g_wlan_dataInfo.Wifioffenable = $('#select_WifiAutooffStatus').val();

        // set WiFi AP isolate
        g_ap_isolation = $('#select_WifiIsolate_between').val();
        if (g_module.multi_ssid_enabled || null != g_featureSwitch) {
            g_wlan_dataInfo.WifiIsolationBetween = g_ap_isolation;

        } else {
            g_wlan_dataInfo.WifiIsolate = g_ap_isolation;
        }

        // set wifi auto off time
        g_wlan_dataInfo.Wifiofftime = $('#select_WifiAutooffTime').val();

        g_wlan_dataInfo.wifibandwidth = $('#select_wifiBandWidth').val();
        g_wlan_dataInfo.wifiautocountryswitch = $("[name='radio_autocountry']:checked").val();

        // post data

        if(g_module.multi_ssid_enabled || null != g_featureSwitch) {
            $(wlan_basicData).each( function(i) {
                wlan_basicData[i].WifiIsolate = g_ap_isolation;
                wlan_basicData[i].WifiSsid = wifiSsidResolveCannotParseChar(wlan_basicData[i].WifiSsid);

            });
            var postData = {
                Ssids: {
                    Ssid: wlan_basicData
                },
                WifiRestart: 0
            };
            if(!doNotshowDialogFlag) {
                var xmlStr = object2xml('request', postData);
                saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
                    var ret = xml2object($xml);
                    if (isAjaxReturnOK(ret)) {
                        button_enable('apply_button', '0');
                    } else {
                        wlanadvanced_initPage();
                        button_enable('apply_button', '0');
                        if(ret.error.code==ERROR_SYSTEM_BUSY) {
                            showInfoDialog(common_system_busy);
                        } else {
                            showInfoDialog(common_fail);
                        }
                    }
                }, {
                    sync:true
                });
            }

        }
        var strUrl = 'api/wlan/basic-settings';

        if (g_module.multi_ssid_enabled || null != g_featureSwitch) {
            strUrl = 'api/wlan/multi-security-settings';
        }
        g_wlan_dataInfo.WifiRestart = 1;
        var xmlstr = object2xml('request', g_wlan_dataInfo);
        button_enable('apply_button', '0');
        g_ap_isolation = 0;
        saveAjaxData(strUrl, xmlstr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                if(!doNotshowDialogFlag) {
                    wlanadvanced_initPage();
                    button_enable('apply_button', '0');
                    showInfoDialog(common_success);
                } else {
                    g_isChangeWiFiMode = false;
                }
            } else {
                if(!doNotshowDialogFlag) {
                    wlanadvanced_initPage();
                    button_enable('apply_button', '0');
                } else {
                    g_isChangeWiFiMode = false;
                }
                if(ret.error.code==ERROR_SYSTEM_BUSY) {
                    if(!doNotshowDialogFlag) {
                        showInfoDialog(common_system_busy);
                    } else {
                        g_isChangeWiFiMode = false;
                    }
                } else {
                    if(!doNotshowDialogFlag) {
                        showInfoDialog(common_fail);
                    } else {
                        g_isChangeWiFiMode = false;
                    }
                }

            }
        });
    } else {

        var isolate = $('#select_WifiIsolate_band').val();
        var wifi_Mode_2g = 'b/g/n';
        var wifiChannel_2g = $('#select_WifiChannel_2g').val();
        var wifiBandWidth_2g = $('#select_wifiBandWidth_2g').val();
        var wifi_Mode_5g = '';
        if('1' == g_featureSwitch.acmode_enable) {
            wifi_Mode_5g = "a/n/ac";
        } else {
            wifi_Mode_5g = "a/n";
        }
        var wifiChannel_5g = $('#select_WifiChannel_5g').val();
        var wifiBandWidth_5g = $('#select_wifiBandWidth_5g').val();

        $(g_wlan_dataInfo_ex).each( function(i) {
            if( g_wlan_dataInfo_ex[i].WifiMode != "a/n" && g_wlan_dataInfo_ex[i].WifiMode != "a/n/ac" ) {
                g_wlan_dataInfo_ex[i].WifiIsolationBetween = isolate ;
                g_wlan_dataInfo_ex[i].WifiMode = wifi_Mode_2g;
                g_wlan_dataInfo_ex[i].WifiChannel = wifiChannel_2g;
                g_wlan_dataInfo_ex[i].wifibandwidth = wifiBandWidth_2g;

            } else {

                g_wlan_dataInfo_ex[i].WifiIsolationBetween = isolate ;
                g_wlan_dataInfo_ex[i].WifiMode = wifi_Mode_5g;
                g_wlan_dataInfo_ex[i].WifiChannel = wifiChannel_5g;
                g_wlan_dataInfo_ex[i].wifibandwidth = wifiBandWidth_5g;
            }
        });
        if(g_module.multi_ssid_enabled || null != g_featureSwitch) {
            $(wlan_basicData).each( function(i) {
                wlan_basicData[i].WifiIsolate = g_ap_isolation;
                wlan_basicData[i].WifiSsid = wifiSsidResolveCannotParseChar(wlan_basicData[i].WifiSsid);
            });
            var postBasicData = {
                Ssids: {
                    Ssid: wlan_basicData
                },
                WifiRestart: 0
            };
            var xmlBasicStr = object2xml('request', postBasicData);
            saveAjaxData('api/wlan/multi-basic-settings', xmlBasicStr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    button_enable('apply_button', '0');
                } else {
                    wlanadvanced_initPage();
                    button_enable('apply_button', '0');
                    if(typeof ret.error != 'undefined' && ret.error.code==ERROR_SYSTEM_BUSY) {
                        showInfoDialog(common_system_busy);
                    } else {
                        showInfoDialog(common_fail);
                    }
                }
            }, {
                sync:true
            });

            var postData_ex = {
                ssids: {
                    ssid: g_wlan_dataInfo_ex
                },
                WifiRestart: 1
            };
            button_enable('apply_button', '0');
            var xmlStr_ex = object2xml('request', postData_ex);
            saveAjaxData('api/wlan/multi-security-settings-ex', xmlStr_ex, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    wlanadvanced_initPage();
                    button_enable('apply_button', '0');
                    showInfoDialog(common_success);
                } else {
                    wlanadvanced_initPage();
                    button_enable('apply_button', '1');
                    if( typeof ret.error != 'undefined' && ret.error.code==ERROR_SYSTEM_BUSY) {
                        showInfoDialog(common_system_busy);
                    } else {
                        showInfoDialog(common_fail);
                    }
                }
            }, {
                sync:true
            });

        }

    }
}

function setDisplay () {

    if (DOUBLE_CHIP != g_featureSwitch.isdoublechip) {
        if (g_feature.battery_enabled) {
            $('#wifiAutooffStatus').show();
            $('#wifiAutooffTime').show();
        } else {
            $('#wifiAutooffStatus').hide();
            $('#wifiAutooffTime').hide();
        }
    }
}

function getStatus() {

    getGMonitoringStatus();

    if(G_MonitoringStatus.type=='response') {
        if(null != g_featureSwitch && '1' == g_featureSwitch.wifi_dfs_enable
        && (255 == G_MonitoringStatus.response.SimStatus || 1 == G_MonitoringStatus.response.SimlockStatus || 2 == G_MonitoringStatus.response.cellroam
        || 260 == pinstatus_ret.SimState || 261 == pinstatus_ret.SimState)) {
            $('#select_WifiWorkingBand').attr('disabled','disabled');
            $('#select_WifiChannel').attr('disabled','disabled');
            $('#autoCountry_turn_on').attr('disabled', 'disabled');
            $('#autoCountry_turn_off').attr('disabled', 'disabled');
            $('#select_WifiCountry').attr('disabled', 'disabled');
            $('#select_WifiWorkingBand').val('2.4');
            $('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
            $('#autoCountry_turn_on').attr('checked', true);
            $('#select_WifiMode').removeAttr('disabled');
            $('#select_WifiIsolate_between').removeAttr('disabled');
            $('#select_WifiAutooffStatus').removeAttr('disabled');
        } else if(G_MonitoringStatus.response.WifiConnectionStatus == '901') {
            $('#select_WifiCountry').attr('disabled', 'disabled');
            $('#select_WifiChannel').attr('disabled', 'disabled');
            $('#select_WifiMode').removeAttr('disabled');
            $('#select_WifiIsolate_between').removeAttr('disabled');
            $('#select_WifiAutooffStatus').removeAttr('disabled');
            if(WORKINGBAND_2_4G == g_currentWorkingBand) {
                $('#select_WifiWorkingBand').removeAttr('disabled');
                $('#autoCountry_turn_on').removeAttr('disabled');
                $('#autoCountry_turn_off').removeAttr('disabled');
                if(null != $("#autoCountry_turn_off").attr("checked")) {
                    $('#select_WifiCountry').removeAttr('disabled');
                }
            }

        } else {
            if (null != g_featureSwitch && WIFI_AUTOCOUNTRY_ON == g_featureSwitch.wifiautocountry_enabled) {
                if ("1" == $("[name='radio_autocountry']:checked").val()) {
                    $('#select_WifiCountry').attr('disabled', 'disabled');
                } else {
                    if('1' != g_featureSwitch.wifi_dfs_enable) {
                        $('#select_WifiCountry').removeAttr('disabled');
                    }
                }
            } else {
                if('1' != g_featureSwitch.wifi_dfs_enable) {
                    $('#select_WifiCountry').removeAttr('disabled');
                }
            }

            $('#select_WifiChannel').removeAttr('disabled');
            $('#select_WifiMode').removeAttr('disabled');
            $('#select_WifiIsolate_between').removeAttr('disabled');
            $('#select_WifiAutooffStatus').removeAttr('disabled');
            if(WORKINGBAND_2_4G == g_currentWorkingBand) {
                $('#select_WifiWorkingBand').removeAttr('disabled');
                $('#autoCountry_turn_on').removeAttr('disabled');
                $('#autoCountry_turn_off').removeAttr('disabled');
            }
        }
    }

    if(null != g_featureSwitch || g_module.multi_ssid_enabled) {
        if(wlan_basicData[0].WifiEnable == 0) {
            $('select:not(#lang)').attr('disabled', 'disabled');
            $('input:not(#lang)').attr('disabled', 'disabled');
        }

    } else {
        if(g_wlan_dataInfo_ex[0].WifiEnable == 0) {
            $('select:not(#lang)').attr('disabled', 'disabled');
            $('input:not(#lang)').attr('disabled', 'disabled');

        }

    }

}

function getStatus_5g() {

    getGMonitoringStatus();

    if(G_MonitoringStatus.type=='response') {
        if(G_MonitoringStatus.response.WifiConnectionStatus == '901') {
            $('#select_WifiChannel_2g').attr('disabled', 'disabled');
            $('#select_WifiMode_2g').removeAttr('disabled');
            $('#select_WifiChannel_5g').attr('disabled', 'disabled');
            $('#select_WifiMode_5g').removeAttr('disabled');
        } else {

            $('#select_WifiChannel_2g').removeAttr('disabled');
            $('#select_WifiMode_2g').removeAttr('disabled');
            $('#select_WifiChannel_5g').removeAttr('disabled');
            $('#select_WifiMode_5g').removeAttr('disabled');
        }
    }
    if('1' == g_wifiFeatureSwitch.wifi24g_switch_enable) {
        if(wlan_basicData[0].WifiEnable == 0 && wlan_basicData[ssid5g].WifiEnable == 1) {
            $('#select_WifiChannel_2g').attr('disabled', 'disabled');
            $('#select_wifiBandWidth_2g').attr('disabled', 'disabled');
        } else if(wlan_basicData[0].WifiEnable == 1 && wlan_basicData[ssid5g].WifiEnable == 0) {
            $('#select_WifiChannel_5g').attr('disabled', 'disabled');
            $('#select_wifiBandWidth_5g').attr('disabled', 'disabled');
        } else if(wlan_basicData[0].WifiEnable == 0 && wlan_basicData[ssid5g].WifiEnable == 0) {
            $('select:not(#lang)').attr('disabled', 'disabled');
            $('input:not(#lang)').attr('disabled', 'disabled');
        } else if(wlan_basicData[0].wifitotalswitch == 0) {
            $('select:not(#lang)').attr('disabled', 'disabled');
            $('input:not(#lang)').attr('disabled', 'disabled');
        }

    } else {
        if(wlan_basicData[0].WifiEnable == 0) {
            $('select:not(#lang)').attr('disabled', 'disabled');
            $('input:not(#lang)').attr('disabled', 'disabled');
        } else if(wlan_basicData[0].WifiEnable == 1 && wlan_basicData[ssid5g].WifiEnable ==0 ) {
            $('#select_WifiChannel_5g').attr('disabled', 'disabled');
            $('#select_wifiBandWidth_5g').attr('disabled', 'disabled');
        }

    }
}

function main_executeBeforeDocumentReady() {
    getConfigData('config/wifi/configure.xml', function($xml) {
        g_WifiFeature = _xml2feature($xml);
    }, {
        sync: true
    });
}

main_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready( function() {
    if(g_WifiFeature.wifiBandWidthenable == 1) {
        $("#wifiBandWidth").show();
    } else {
        $("#wifiBandWidth").hide();
    }

    getAjaxData('api/wlan/wifi-feature-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type != 'response') {
            return;
        }
        g_featureSwitch = ret.response;
    }, {
        sync: true
    });
    getAjaxData('api/wlan/multi-switch-settings', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            g_wlan_doubleSsidStatus = ret.response;
        }
    }, {
        sync:true
    });
    getAjaxData('api/pin/status', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            pinstatus_ret = ret.response;
        }
    }, {
        sync:true
    });
    getAjaxData('api/device/information', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            var Classify_ret = ret.response;
            if('cpe' == Classify_ret.Classify) {
                if(DOUBLE_CHIP != g_featureSwitch.isdoublechip) {
                    $('#select_wifiBandWidth').append('<option value = "0">'+(common_auto+common_default)+'</script></option>');
                    $('#select_wifiBandWidth').append('<option value = "20">'+IDS_bandwidth_util_MHz.replace('%d',20)+'</script></option>');
                } else {
                    $('#select_wifiBandWidth_2g').append('<option value = "0">'+(common_auto+common_default)+'</script></option>');
                    $('#select_wifiBandWidth_2g').append('<option value = "20">'+IDS_bandwidth_util_MHz.replace('%d',20)+'</script></option>');
                    $('#select_wifiBandWidth_5g').append('<option value = "0">'+(common_auto+common_default)+'</script></option>');
                    $('#select_wifiBandWidth_5g').append('<option value = "20">'+IDS_bandwidth_util_MHz.replace('%d',20)+'</script></option>');
                }
            } else {
                if(DOUBLE_CHIP != g_featureSwitch.isdoublechip) {
                    $('#select_wifiBandWidth').append('<option value = "0">'+common_auto+'</script></option>');
                    $('#select_wifiBandWidth').append('<option value = "20">'+(IDS_bandwidth_util_MHz.replace('%d',20)+common_default)+'</script></option>');
                } else {
                    $('#select_wifiBandWidth_2g').append('<option value = "0">'+common_auto+'</script></option>');
                    $('#select_wifiBandWidth_2g').append('<option value = "20">'+(IDS_bandwidth_util_MHz.replace('%d',20)+common_default)+'</script></option>');
                    $('#select_wifiBandWidth_5g').append('<option value = "0">'+common_auto+'</script></option>');
                    $('#select_wifiBandWidth_5g').append('<option value = "20">'+(IDS_bandwidth_util_MHz.replace('%d',20)+common_default)+'</script></option>');
                }
            }
        }
    }, {
        sync: true
    });
    if( null != g_featureSwitch && g_featureSwitch.isdoublechip != DOUBLE_CHIP ) {

        $("#advanced_2g").hide();
        $("#advanced_5g").hide();
        $("#wlan_list_ap").hide();
        $("#wlan_singlechip").show();
        $("#work_band_2g").hide();
        $("#work_band_5g").hide();

        if(g_WifiFeature.wifiBandWidthenable == 1) {
            $("#wifiBandWidth").show();
        } else {
            $("#wifiBandWidth").hide();
        }

    } else {

        $("#advanced_2g").show();
        $("#advanced_5g").show();
        $("#wlan_singlechip").hide();

        if(g_WifiFeature.wifiBandWidthenable == 1) {
            $("#wifiBandWidth_2g").show();
            $("#wifiBandWidth_5g").show();
        } else {
            $("#wifiBandWidth_2g").hide();
            $("#wifiBandWidth_5g").hide();
        }
    }

    $("#main_content_change").hide();
    wlanadvanced_initPage();
    setTimeout( function() {
        $("#main_content_change").show();
    },1);
    if(g_module.wifioffload_enable==true) {
        if( null != g_featureSwitch && g_featureSwitch.isdoublechip == DOUBLE_CHIP ) {
            addStatusListener('getStatus_5g()');
        } else {
            addStatusListener('getStatus()');
        }
    }
    button_enable('apply_button', '0');
    $('input').bind('change input paste cut keydown', function(e) {
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('apply_button', '1');
        }

    });
    $('#select_WifiCountry').change( function() {
        button_enable('apply_button', '1');
        var currentCountry = $.trim($('#select_WifiCountry').val());
        if (null != g_featureSwitch && WIFI5G_ON == g_featureSwitch.wifi5g_enabled) {
            if($('#select_WifiWorkingBand').children().size() >= 1) {
                g_currentWorkingBand = $("#select_WifiWorkingBand").val();
            }
            g_currentWifiMode = $("#select_WifiMode").val();
            $('#select_WifiWorkingBand').empty();
            wlanadvanced_wifi5G_initChannel(currentCountry);
            $('#select_WifiChannel').val(WLAN_CHANNEL_AUTO);
        } else {
            wlanadvanced_changeChannel();
        }
        if($('#select_WifiWorkingBand').children().size() >= 1) {
            g_currentWorkingBand = $("#select_WifiWorkingBand").val();
        }
        g_currentWifiMode = $("#select_WifiMode").val();
    });
    $('#select_WifiIsolate_band,#select_WifiMode_2g, #select_WifiMode_5g, #select_WifiChannel_2g, #select_WifiChannel_5g, #select_wifiBandWidth_2g, #select_wifiBandWidth_5g, #select_WifiChannel, #select_WifiMode, #select_WifiIsolate_between, #select_WifiAutooffTime, #select_WifiRate,#select_wifiBandWidth, #select_WifiWorkingBand').live('change', function() {
        button_enable('apply_button', '1');
    });
    $('#select_WifiAutooffStatus').change( function() {
        button_enable('apply_button', '1');
        wlanadvanced_ifWifioffenable(this.value);
    });
    $('#select_WifiWorkingBand').change( function() {
        var currentCountry = $('#select_WifiCountry').val();
        if($('#select_WifiWorkingBand').children().size() >= 1) {
            g_currentWorkingBand = $.trim($('#select_WifiWorkingBand').val());
        }
        if(g_featureSwitch.doubleap5g_enable == 0 && (g_featureSwitch.maxapnum == 2) && (g_wlan_doubleSsidStatus.multissidstatus == 1) && (WORKINGBAND_5G == g_currentWorkingBand) && (g_featureSwitch.isdoublechip == 0)) {
            showInfoDialog(IDS_doubleSsid_5G);
            $('#select_WifiWorkingBand').val(g_temp_select_WifiWorkingBand);
            return;
        }
        if(null != g_featureSwitch && '1' == g_featureSwitch.wifi_dfs_enable) {
            if (WORKINGBAND_5G == g_currentWorkingBand) {
                wlanadvanced_wifi5G_initChannel(currentCountry);
                wlan_initWifiMode(WORKINGBAND_5G);
                setTimeout( function() {
                    $('#select_WifiMode').val(g_wlan_dataInfo.WifiMode);
                }, 2);
                $('#autoCountry_turn_on').attr('disabled', 'disabled');
                $('#autoCountry_turn_off').attr('disabled', 'disabled');
                $('#select_WifiCountry').attr('disabled', 'disabled');
                $('#autoCountry_turn_on').attr('checked', true);
                $('#wlan_country').hide();
                $("#wlan_channel").hide();
            } else {
                wlan_initWifiMode(WORKINGBAND_2_4G);
                setTimeout( function() {
                    $('#select_WifiMode').val("b/g/n");
                }, 2);
                wifiCountry_channel(currentCountry);
                $('#autoCountry_turn_on').removeAttr('disabled');
                $('#autoCountry_turn_off').removeAttr('disabled');
                if(null != $("#autoCountry_turn_off").attr("checked")) {
                    $('#select_WifiCountry').removeAttr('disabled');
                }
                $('#autoCountry_turn_off').click( function() {
                    $('#select_WifiCountry').removeAttr("disabled");
                });
                $("#wlan_channel").show();
            }
        } else {
            if (WORKINGBAND_5G == g_currentWorkingBand) {
                wlanadvanced_wifi5G_initChannel(currentCountry);
                wlan_initWifiMode(WORKINGBAND_5G);
                setTimeout( function() {
                    $('#select_WifiMode').val(g_wlan_dataInfo.WifiMode);
                }, 2);
            } else {
                wlan_initWifiMode(WORKINGBAND_2_4G);
                setTimeout( function() {
                    $('#select_WifiMode').val("b/g/n");
                }, 2);
                wifiCountry_channel(currentCountry);
            }
        }
    });
    $("#select_WifiChannel").change( function() {
        $("#5Gwifi_notes").empty();
        $("#5Gwifi_notes_tr").hide();
        var i = 0;
        for(i; i <= g_indoorOnlyChannel.length; i++) {
            if( g_indoorOnlyChannel[i]== $("#select_WifiChannel").val()) {
                $("#5Gwifi_notes_tr").show();
                $("#5Gwifi_notes").html(wlan_label_5gWifi_indoor);
                return;
            }
        }
        if($("#select_WifiChannel").val() >= 100 && $("#select_WifiChannel").val() <=140) {
            $("#5Gwifi_notes_tr").show();
            $("#5Gwifi_notes").html(wlan_label_5gWifi_check);
        }
    });
    if(('1' != g_featureSwitch.wifi_dfs_enable) || (('1' == g_featureSwitch.wifi_dfs_enable) && (WORKINGBAND_2_4G == g_currentWorkingBand))) {
        var currentCountry = $('#select_WifiCountry').val();
        if($('#select_WifiWorkingBand').children().size() >= 1) {
            g_currentWorkingBand = $.trim($('#select_WifiWorkingBand').val());
        }
        $('#autoCountry_turn_on').click( function() {
            $("#autoCountry_turn_off").removeAttr("checked");
            $('#select_WifiCountry').attr("disabled", "disabled");
        });
        $('#autoCountry_turn_off').click( function() {
            $("#autoCountry_turn_on").removeAttr("checked");
            if(G_MonitoringStatus.type=='response' && G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED) {
                $('#select_WifiCountry').attr("disabled", "disabled");
            } else {
                $('#select_WifiCountry').removeAttr("disabled");
            }
        });
    }

    setDisplay();

    if (null != g_featureSwitch) {
        if (WIFI5G_ON == g_featureSwitch.wifi5g_enabled) {
            $('#wifi_workingBand').show();
        } else {
            $('#wifi_workingBand').hide();
        }
    }

    if(g_WifiFeature.wifiap_isolation_enable == '0') {
        $("#wifi_APIsolate").hide();
        $("#wlan_list_ap").hide();
    }
    if($('#select_WifiWorkingBand').children().size() >= 1) {
        g_temp_select_WifiWorkingBand = $.trim($('#select_WifiWorkingBand').val());
    }
    if(null != g_featureSwitch && '1' == g_featureSwitch.wifi_dfs_enable) {
        setInterval( function() {
            refresh_5G();
        },10000);
    }
    wifiadvancedisable();
});
function wifiadvancedisable () {
    if(null != g_wifiFeatureSwitch && g_featureSwitch.isdoublechip == DOUBLE_CHIP) {
        if('1' == g_wifiFeatureSwitch.wifi24g_switch_enable) {
            if(wlan_basicData[0].WifiEnable == 0 && wlan_basicData[ssid5g].WifiEnable == 1) {
                $('#select_WifiChannel_2g').attr('disabled', 'disabled');
                $('#select_wifiBandWidth_2g').attr('disabled', 'disabled');
            } else if(wlan_basicData[0].WifiEnable == 1 && wlan_basicData[ssid5g].WifiEnable == 0) {
                $('#select_WifiChannel_5g').attr('disabled', 'disabled');
                $('#select_wifiBandWidth_5g').attr('disabled', 'disabled');
            } else if(wlan_basicData[0].WifiEnable == 0 && wlan_basicData[ssid5g].WifiEnable == 0) {
                showInfoDialog(IDS_wlan_off);
                $('select:not(#lang)').attr('disabled', 'disabled');
                $('input:not(#lang)').attr('disabled', 'disabled');
            } else if(wlan_basicData[0].wifitotalswitch == 0) {
                showInfoDialog(IDS_wlan_off);
                $('select:not(#lang)').attr('disabled', 'disabled');
                $('input:not(#lang)').attr('disabled', 'disabled');
            }

        } else {
            if(wlan_basicData[0].WifiEnable == 0) {
                showInfoDialog(IDS_wlan_off);
                $('select:not(#lang)').attr('disabled', 'disabled');
                $('input:not(#lang)').attr('disabled', 'disabled');
            } else if(wlan_basicData[0].WifiEnable == 1 && wlan_basicData[ssid5g].WifiEnable ==0 ) {
                $('#select_WifiChannel_5g').attr('disabled', 'disabled');
                $('#select_wifiBandWidth_5g').attr('disabled', 'disabled');
            }

        }
    } else {
        if(null != g_featureSwitch || g_module.multi_ssid_enabled) {
            if(wlan_basicData[0].WifiEnable == 0) {
                showInfoDialog(IDS_wlan_off);
                $('select:not(#lang)').attr('disabled', 'disabled');
                $('input:not(#lang)').attr('disabled', 'disabled');
            }

        } else {
            if(g_wlan_dataInfo_ex[0].WifiEnable == 0) {
                showInfoDialog(IDS_wlan_off);
                $('select:not(#lang)').attr('disabled', 'disabled');
                $('input:not(#lang)').attr('disabled', 'disabled');

            }

        }
    }
}