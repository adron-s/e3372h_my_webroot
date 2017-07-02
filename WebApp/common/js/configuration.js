// JavaScript Document
/****************************************************restore (start)************************************/
function doSubmit() {
    document.forms[0].submit();
}

function gotoLoginWhileSystemUp() {
    log.debug('configruation : system is up.');
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
    ping_setPingAddress(DEFAULT_GATEWAY_IP);
    setTimeout(startPing, 1); 
    closeWaitingDialog();     
}

function restore() {
    cancelLogoutTimer();
    var current_date = new Date();
    var upload_date = {
        Year: current_date.getFullYear(),
        Month: current_date.getMonth() + 1,
        Day: current_date.getDate(),
        Hour: current_date.getHours(),
        Min: current_date.getMinutes(),
        Sec: current_date.getSeconds()
    };
    if($.isArray(g_requestVerificationToken)) { 
        if(g_requestVerificationToken.length > 0) {
             $('#csrf_token').val('csrf:' + g_requestVerificationToken[0]);
        } else {
            setTimeout(function () {
                    restore();
            }, 50)
            return;
        }
    }
    $('#cur_path').val($('#restore_file').val());
    $('#page').val('configuration.html');
    $('#upload_year').val(upload_date.Year);
    $('#upload_month').val(upload_date.Month);
    $('#upload_day').val(upload_date.Day);
    $('#upload_hours').val(upload_date.Hour);
    $('#upload_minutes').val(upload_date.Min);
    $('#upload_secondes').val(upload_date.Sec);
    $('#randomNum').val(Math.round(Math.random() * 10000));
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    setTimeout(function() {        
        gotoLoginWhileSystemUp();
    }, 60000);
    setTimeout(doSubmit, 20);
}

$(function() {
    
    var query_string = getQueryStringByName('result');
    if ('error' == query_string) {
        showInfoDialog(common_failed);
    }else if ('success' == query_string) {
        cancelLogoutTimer();
        showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
        setTimeout(function() {
            gotoLoginWhileSystemUp();
        }, 30000);
    }

    $('#save_button').bind('click', function() {
        if (!isButtonEnable('save_button')) {
            return;
        }

        //Object for store oprate number.
        var cfg_backup_request = {
            Control: 3
        };

        showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);

        var cfg_backup_xml = object2xml('request', cfg_backup_request);
        saveAjaxData('api/device/control', cfg_backup_xml, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                closeWaitingDialog();
                window.location.href = '../../nvram.bak';
            } else {
                closeWaitingDialog();
                showInfoDialog(common_failed);
            }
        });
    });
    button_enable('restore_button', '0');
    $('#restore_file').bind('change', function() {
        button_enable('restore_button', '0');
        var filename = this.value;
        var reg = /\.bak$/i;
        if (0 == filename.length) {
            clearAllErrorLabel();
            $('#restore_button').unbind('click');
        }else if (reg.test(filename)) {
            button_enable('restore_button', '1');
            clearAllErrorLabel();
            $('#restore_button').bind('click', function() {
                showConfirmDialog(system_hint_operation_restart_device, restore, function() {});
            });
        }else {
            clearAllErrorLabel();
            button_enable('restore_button', '0');
            showErrorUnderTextbox('restore_file', system_hint_file_name_empty);
            $('#restore_button').unbind('click');
        }
    });
});
/****************************************************restore (end)************************************/