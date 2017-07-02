var g_powerSaveMode = null;
var g_fastBoot = null;
var g_SNTPOperation = null;
var g_USBTethering = null;
function initPage() {
    if (g_module.powersave_enabled) {
        $('.power_save_mode').show();
        $('.power_save_mode_border').show();
        getAjaxData('api/device/powersaveswitch', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_powerSaveMode = ret.response;
                $('#checkbox_powersavemode').get(0).checked = (g_powerSaveMode.powersaveswitch == "1");
            }
        });
    } else {
        $('.power_save_mode').hide();
        $('.power_save_mode_border').hide();
    }

    if (g_module.fastboot_enabled) {
        $('.fast_boot').show();
        $('.fast_boot_border').show();
        getAjaxData('api/device/fastbootswitch', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_fastBoot = ret.response;
                $('#checkbox_fastboot').get(0).checked = (g_fastBoot.fastbootswitch == "1");
            }
        });
    } else {
        $('.fast_boot').hide();
        $('.fast_boot_border').hide();
    }

    if (g_module.sntp_enabled) {
        $('.sntp_operation').show();
        getAjaxData('api/sntp/sntpswitch', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_SNTPOperation = ret.response;
                $('#checkbox_sntpoperation').get(0).checked = (g_SNTPOperation.SntpSwitch == "1");
            }
        });
    } else {
        $('.sntp_operation').hide();
    }

    if (g_USBtetheringSwitch == USBTETHERING_ON) {
        $('.usb_tethering').show();
        getAjaxData('api/device/usb-tethering', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_USBTethering = ret.response;
                $('#checkbox_usb').get(0).checked = (g_USBTethering.tethering == "1");
            }
        });
    } else {
        $('.usb_tethering').hide();
    }
}

function onPowerSaveModeChange() {
    var powersaveswitch = $('#checkbox_powersavemode').get(0).checked ? 1 : 0;
    var request = {
        powersaveswitch : powersaveswitch
    };
    var xmlstr = object2xml('request', request);
    saveAjaxData('api/device/powersaveswitch', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    });
}

function onFastBootChange() {
    var fastbootswitch = $('#checkbox_fastboot').get(0).checked ? 1 : 0;
    var request_fastboot = {
        fastbootswitch : fastbootswitch
    };
    var xmlstr_fastboot = object2xml('request', request_fastboot);
    saveAjaxData('api/device/fastbootswitch', xmlstr_fastboot, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    });
}

function onSNTPOperationChange() {
    var SntpSwitch = $('#checkbox_sntpoperation').get(0).checked ? 1 : 0;
    var request_sntp = {
        SntpSwitch : SntpSwitch
    };
    var xmlstr_sntp = object2xml('request', request_sntp);
    saveAjaxData('api/sntp/sntpswitch', xmlstr_sntp, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    });
}

function onUSBOperationChange() {
    var usbSwitch = $('#checkbox_usb').get(0).checked ? 1 : 0;
    var request_usb = {
        tethering : usbSwitch
    };
    var xmlstr_usb = object2xml('request', request_usb);
    saveAjaxData('api/device/usb-tethering', xmlstr_usb, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    });
}

$(document).ready( function() {
    initPage();
    $("#checkbox_powersavemode").click( function() {
        onPowerSaveModeChange();
    });
    $("#checkbox_fastboot").click( function() {
        onFastBootChange();
    });
    $("#checkbox_sntpoperation").click( function() {
        onSNTPOperationChange();
    });
    $("#checkbox_usb").click( function() {
        onUSBOperationChange();
    });
});