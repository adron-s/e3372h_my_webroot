// JavaScript Document
var g_timerReboot = 1000;

function gotoLoginWhileSystemUp() {

    if (DATA_READY.statusReady) {
        log.debug('Reboot : system is up.');
        gotoPageWithoutHistory('home.html');
    } else {
        log.debug('Reboot : system is down.');
    }
}

function do_reboot() {
    var request = {
        Control: 1
    };
    var DEFAULT_GATEWAY_IP = '';
    // get current settings gateway address
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            DEFAULT_GATEWAY_IP = ret.response.DhcpIPAddress;
        }
    }, {
        sync: true
    }
    );
    var xmlstr = object2xml('request', request);
    log.debug('xmlstr = ' + xmlstr);
    saveAjaxData('api/device/control', xmlstr, function($xml) {
        log.debug('saveAjaxData successed!');
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            ping_setPingAddress(DEFAULT_GATEWAY_IP);
            setTimeout(startPing, 50000);
        } else {
            closeWaitingDialog();
            showInfoDialog(common_failed);
            return false;
        }
    });
}

function reboot() {
    showWaitingDialog(common_waiting, update_label_device_waiting);
    clearTimeout(g_decive_timer);
    clearTimeout(g_simcard_timer);
    clearTimeout(g_heart_beat_timer);
    /*After send "api/device/control" cmd, server will't response webui request.
     So delay 1 second.*/
    setTimeout(do_reboot, g_timerReboot);
}

$( function() {
    $('#reboot_apply_button').bind('click', function() {
        if (!isButtonEnable('reboot_apply_button')) {
            return;
        }
        button_enable('reboot_apply_button', '0');
        showConfirmDialog(system_setting_reboot, reboot, function() {
            button_enable('reboot_apply_button', '1');
        },null, function() {
            button_enable('reboot_apply_button', '1');
        });
        return false;
    });
});