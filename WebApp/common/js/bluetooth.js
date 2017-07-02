//bluetooth
var g_promptText =null;
var g_current_device = null;

var LENGHT_OF_INDEX = 8;

var g_bluetooth_ap_info_list = [];
var g_bluetooth_scanresult = [];

var BLUETOOTH_PREFER = 1;
var BLUETOOTH_SCAN_END = '0';
var BLUETOOTH_SCANING = '1';


var g_handover_setting = {
    btswitch : '0'
};

var g_bluetoothscan = {
    scan : '0'
};

var g_current_id = null;

$(document).ready( function() {
    getAjaxData('api/bluetooth/settings', function($xml) {
        var device_ret = xml2object($xml);
        if(device_ret.type == 'response') {
            var device_info = device_ret.response;
            if(typeof(device_info.devicename) != 'undefined' && device_info.devicename != "" && device_info.devicename != null) {              
                device_info.devicename = XSSResolveCannotParseChar(device_info.devicename);                
                device_info.macaddress = XSSResolveCannotParseChar(device_info.macaddress);
                g_current_device = IDS_current_device.replace("%s1",replaceSpaceOther(device_info.devicename)).replace("%s2",replaceSpaceOther(device_info.macaddress));                
            }else {
                g_current_device = "";                
            }
            $("div.default_dev_div").html(g_current_device);                        
        }
    });

    $('.wifi_ap').live('click', function() {
        g_current_id = this.id;
        var index = getBluetoothIndex(g_current_id);
        showDefaultDeviceConfirmDlg(index);
     });
   
     //getHandoverSetting();
    index_clickTurnOnBtn();
    //index_clickTurnOffBtn();

    $('#turnOff_button').live('click', function() {
        if(!isButtonEnable('turnOff_button')) {
            return;
        }
        g_handover_setting.btswitch = '0';
        $('#turnOff_button').removeClass('mouse_on');
        button_enable('turnOff_button', '0');
        setHandoverSetting();
    });
    $('#turnOn_button').live('click', function() {
        if(!isButtonEnable('turnOn_button')) {
            return;
        }
        g_handover_setting.btswitch = '1';
        $('#turnOn_button').removeClass('mouse_on');
        button_enable('turnOn_button', '0');
        setHandoverSetting();        
    });
   
    $('#scan_button').live('click', function() {
        if(!isButtonEnable('scan_button')) {
            return;
        }
        scanBluetooth();
    });

});

function index_clickTurnOnBtn() {

    scanBluetooth();
    $('#wifi_switch_button').html(create_button_html(common_turn_off, "turnOff_button"));
    ieRadiusBorder();
    $("#default_dev_div").show();
}

function index_clickTurnOffBtn() {

    $('#wifi_switch_button').html(create_button_html(common_turn_on, "turnOn_button"));
    ieRadiusBorder();
    $('#wifi_content').hide();
    $('#scan_div').hide();
    $("#default_dev_div").hide();
}

function getHandoverSetting() {
    getAjaxData("api/bluetooth/settings", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            if(BLUETOOTH_PREFER == ret.response.btswitch) {
                index_clickTurnOnBtn();
            } else {
                index_clickTurnOffBtn();
            }
        } else {
            log.error("get api/bluetooth/settings data error");
        }
    });
}

function setHandoverSetting() {
    var handDover_xml = object2xml('request', g_handover_setting);
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    saveAjaxData('api/bluetooth/settings', handDover_xml, function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            log.debug('api/bluetooth/settings ok');
            setTimeout( function() {
                getHandoverSuccessSetting();                
            }, 1000);
        } else {
            log.debug('api/bluetooth/settings error');
            if(ERROR_SYSTEM_BUSY == ret.error.code) {
                closeWaitingDialog();
                showInfoDialog(common_system_busy);
            } else {
                closeWaitingDialog();
                showInfoDialog(common_failed);
            }
            if(BLUETOOTH_PREFER == g_handover_setting.btswitch) {
                button_enable('turnOn_button',1);
            }else {
                button_enable('turnOff_button',1);
            }
        }
    },{
		errorCB: function() {
			setTimeout( function() {
			    //getHandoverSuccessSetting();
			    closeWaitingDialog();
				showInfoDialog(common_failed);
				if(BLUETOOTH_PREFER == g_handover_setting.btswitch) {
                    button_enable('turnOn_button',1);
                }else {
                    button_enable('turnOff_button',1);
                }
			}, 1000);
		}
    });
}

function getHandoverSuccessSetting() {
    if(BLUETOOTH_PREFER == g_handover_setting.btswitch) {                       
        index_clickTurnOnBtn();
    } else {
        index_clickTurnOffBtn();
    }
    closeWaitingDialog();
}

function scanBluetooth() {
	checkBluetoothScanStatue();
    $('#scan_div').show();
    $('#bluetooth_scan').show();

    $('#wifi_content').show();
    $('#bluetooth_settings').hide();
    $('#bluetooth_no_device').hide();

    button_enable('scan_button', '0');

    var scan_xml = object2xml('request', g_bluetoothscan);
    saveAjaxData('api/bluetooth/scan', scan_xml, function($xml) {
        var scan_ret = xml2object($xml);
        if(isAjaxReturnOK(scan_ret)) {
            g_bluetooth_ap_info_list = [];
            //checkBluetoothScanStatue
            checkBluetoothScanStatue();
        } else if(ERROR_SYSTEM_BUSY == scan_ret.error.code) {
            showInfoDialog(common_system_busy);
            $('#bluetooth_scan').hide();
            $('#bluetooth_no_device').show();
           
            button_enable('scan_button', '1');
        } else {
            log.debug('post api/bluetooth/bluetoothscan data error');
        }
    });
}

function checkBluetoothScanStatue() {
    getAjaxData("api/bluetooth/scan", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            if(BLUETOOTH_SCAN_END == ret.response.scanstatus) {
                getBluetoothDeviceinfo();
            } else if(BLUETOOTH_SCANING == ret.response.scanstatus) {
                setTimeout( function() {
                    checkBluetoothScanStatue();
                }, 1000);
            } else {
                $('#bluetooth_scan').hide();
            }
        } else {
            $('#bluetooth_scan').hide();
            $('#bluetooth_no_device').show();
            $('#bluetooth_settings').hide();
            g_bluetoothscanresult = [];

            
            button_enable('scan_button', '1');
            log.error("get api/bluetooth/bluetoothscan data error");
        }
    });
}

function getBluetoothDeviceinfo() {
    getAjaxData("api/bluetooth/scan", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            if(typeof(ret.response.devicelists) != 'undefined' && ret.response.devicelists != null && ret.response.devicelists != '') {
                g_bluetooth_scanresult = ret.response.devicelists.devicelist;            
                if($.isArray(g_bluetooth_scanresult) ||
                ((typeof (g_bluetooth_scanresult) != 'undefined') && g_bluetooth_scanresult != null && g_bluetooth_scanresult != '')) {
                    setBlueToothList();
                    //create list
                    createBlueToothList();
                    $('#bluetooth_scan').hide();
                    $('#bluetooth_no_device').hide();
                    $('#bluetooth_settings').show();
                } else {
                    $('#bluetooth_scan').hide();
                    $('#bluetooth_no_device').show();
                    $('#bluetooth_settings').hide();
                    g_bluetooth_scanresult = [];
    
                    button_enable('scan_button', '1');
                    log.error("get api/bluetooth/bluetoothscanresult datalists empty");                
                }
            }else {
                $('#bluetooth_scan').hide();
                $('#bluetooth_no_device').show();
                $('#bluetooth_settings').hide();
                g_bluetooth_scanresult = [];
        
                button_enable('scan_button', '1');
                log.error("get api/bluetooth/bluetoothscanresult data empty");              
            }            
        } else {
            $('#bluetooth_scan').hide();
            $('#bluetooth_no_device').show();
            $('#bluetooth_settings').hide();
            g_bluetooth_scanresult = [];

            button_enable('scan_button', '1');
            log.error("get api/bluetooth/bluetoothscanresult data error");
        }
    });
}

function setBlueToothList() {
    g_bluetooth_ap_info_list = [];
    if($.isArray(g_bluetooth_scanresult)) {
        $.each(g_bluetooth_scanresult, function(i) {
            var ap_info = {
                devicename : g_bluetooth_scanresult[i].devicename,
                macaddress : g_bluetooth_scanresult[i].macaddress
            };
            g_bluetooth_ap_info_list.push(ap_info);
        });
    } else {
        var ap_info = {
            devicename : g_bluetooth_scanresult.devicename,
            macaddress : g_bluetooth_scanresult[i].macaddress
        };
        g_bluetooth_ap_info_list.push(ap_info);        
    }
}

function createBlueToothList() {
    var blueToothTableHtml = "";
    var i = 0;
    for(i; i < g_bluetooth_ap_info_list.length; i++) {
        var wifiTrId = "wifi_ap_" + i;
        blueToothTableHtml  += "<tr class='wifi_ap' id='" + wifiTrId + "'>";
        blueToothTableHtml  += "<td width='240'>";
        blueToothTableHtml  += "<div class='wifiName'><span>" + replaceSpaceOther(XSSResolveCannotParseChar(g_bluetooth_ap_info_list[i].devicename)) + "</span></div>";
        blueToothTableHtml  += "<div>" +"MAC Address : " + XSSResolveCannotParseChar(g_bluetooth_scanresult[i].macaddress) + "</div>";
        blueToothTableHtml  += "</td>";
        blueToothTableHtml  += "</tr>";
    }
    $('.bluetooth_settings').html(blueToothTableHtml);
    button_enable('scan_button', '1');
}

function getBluetoothIndex(current_id) {
    var index = current_id.substring(LENGHT_OF_INDEX, current_id.length);
    return parseInt(index, 10);
}

function showDefaultDeviceConfirmDlg(index){
    var bluetoothname = XSSResolveCannotParseChar(g_bluetooth_ap_info_list[index].devicename);
    var bluetoothaddress = XSSResolveCannotParseChar(g_bluetooth_ap_info_list[index].macaddress);      
    g_promptText = IDS_connect_bluetooth.replace("%s1",replaceSpaceOther(bluetoothname)).replace("%s2",replaceSpaceOther(bluetoothaddress));
    g_current_device = IDS_current_device.replace("%s1",replaceSpaceOther(bluetoothname)).replace("%s2",replaceSpaceOther(bluetoothaddress));
    var current_device_info = {
        devicename: bluetoothname,
        macaddress: bluetoothaddress
    }
    var current_device_xml = object2xml('request', current_device_info);
    saveAjaxData('api/bluetooth/settings', current_device_xml, function($xml) {                       
    },{
        sync: true
    });
    showConfirmDialog(g_promptText, setDefaultDevice, cancelprompt);
    
}
function setDefaultDevice(){
    var connect_enabled = '';
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    getAjaxData("api/bluetooth/settings", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
             connect_enabled = ret.response.connection;
        } else {
            log.error("get api/bluetooth/settings data error");
        }
    });
    setTimeout( function() {
        closeWaitingDialog();                
        if(connect_enabled != '1') {
            showInfoDialog(common_failed);            
        }
        $("div.default_dev_div").html(g_current_device);
        g_promptText = "";
        g_current_device = "";
    },1000);    	
}
function cancelprompt(){  
    g_promptText = "";
    g_current_device = "";	
}

