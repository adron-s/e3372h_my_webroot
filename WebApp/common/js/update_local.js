//update_local.js
var g_updateStatus = 0;
var UPDATE_STATUS_INTERVAL = 3000;
var UPDATE_DOWNLOAD_FAILED = 20;
var UPDATE_DOWNLOAD_PROGRESSING = 30;
var UPDATE_BATTERY_LOW = 51;
var UPDATE_PROGRESSING = 60;
var UPDATE_FAILED_HAVEDATA = 70;
var UPDATE_FAILED_NODATA = 80;
var UPDATE_SUCCESSFUL_HAVEDATA = 90;
var UPDATE_SUCCESSFUL_NODATA = 100;
var ONLINE_UPDATE_STATUS_INTERVAL = 10000;

function update_uploadFile() {
    if($.isArray(g_requestVerificationToken)) {
        if(g_requestVerificationToken.length > 0) {
            $('#csrf_token').val('csrf:' + g_requestVerificationToken[0]);
        } else {
            setTimeout( function () {
                update_uploadFile();
            }, 50)
            return;
        }
    }
    cancelLogoutTimer();
    showWaitingDialog(common_updates, STRID_update_hint_dont_close_browse);
    var optionst = {
        url: '../api/filemanager/upload',
        success: function(responseText, statusText) {
            if(typeof responseText == "string") {
                var responseString = responseText.toLowerCase();
                if (responseString.indexOf('ok') == -1 ) {
                    closeWaitingDialog();
                    showConfirmDialog(update_label_failed);
                    startLogoutTimer();
                }
            }

        }
    };
    $('#form_update').ajaxSubmit(optionst);
    clearTimeout(g_decive_timer);
    clearTimeout(g_simcard_timer);
    clearTimeout(g_heart_beat_timer);
    setTimeout(localUploadStatus, UPDATE_STATUS_INTERVAL*2);
}

function checkGoHome() {
    getAjaxData('api/user/state-login', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (ret.response.State != 0) {
                gotoPageWithoutHistory('home.html');
            }
        }
    }, {
        sync: true
    });
}

function localUploadStatus() {
    getAjaxData('api/monitoring/check-notifications', function($xml) {
        var localUpdate_ret = xml2object($xml);
        if (localUpdate_ret.type == 'response') {
            G_NotificationsStatus = localUpdate_ret.response;
            g_updateStatus = parseInt(G_NotificationsStatus.OnlineUpdateStatus, 10);
            if (g_updateStatus == UPDATE_FAILED_HAVEDATA || g_updateStatus == UPDATE_FAILED_NODATA || g_updateStatus == UPDATE_DOWNLOAD_FAILED) {
                closeWaitingDialog();
                showConfirmDialog(update_label_failed,checkGoHome);
                startLogoutTimer();
                return;
            }
            if (g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA || g_updateStatus == UPDATE_SUCCESSFUL_NODATA) {
                closeWaitingDialog();
                showConfirmDialog(system_up_to_date,checkGoHome);
                startLogoutTimer();
                return;
            }
            if(g_updateStatus == UPDATE_BATTERY_LOW) {
                closeWaitingDialog();
                showConfirmDialog(IDS_update_battery_low_warning,checkGoHome);
                startLogoutTimer();
                return;
            }
        }
        setTimeout(localUploadStatus, UPDATE_STATUS_INTERVAL);
    }, {
        errorCB: function() {
            setTimeout(localUploadStatus, ONLINE_UPDATE_STATUS_INTERVAL);
        }
    });
}

function checkUploadFileName() {
    var uploadFileName = $('#up_nodite').val();
    var reg = /\.bin$|\.zip$/i;
    if (reg.test(uploadFileName)) {
        clearAllErrorLabel();
        button_enable('local_update', '1');
    } else {
        clearAllErrorLabel();
        showErrorUnderTextbox('up_nodite', system_hint_file_name_empty);
        button_enable('local_update', '0');
    }
}

function update_executeBeforeDocumentReady() {
    if(g_coulometer_status == '-1') {
        getAjaxData('api/device/device-feature-switch', function($xml) {
            var coulometer_ret = xml2object($xml);
            if (coulometer_ret.type == 'response') {
                g_coulometer_status = coulometer_ret.response.coulometer_enabled;
            }
        }, {
            sync: true
        });
    }
    IDS_update_battery_low_warning = coulometerCheck(IDS_update_battery_low_warning);
    STRID_update_hint_battery_prower_low = coulometerCheck(STRID_update_hint_battery_prower_low);
    if('1' == g_feature.battery_enabled) {
        STRID_update_hint_dont_close_browse += STRID_update_hint_battery_prower_low;
    }
}

update_executeBeforeDocumentReady();
$(document).ready( function() {
    button_enable('local_update', '0');
    $('#up_nodite').val('');
    $('#up_nodite').change( function() {
        var uploadFileName = $('#up_nodite').val();
        if (uploadFileName.indexOf('\\') > -1) {
            uploadFileName = uploadFileName.substring(uploadFileName.lastIndexOf('\\') + 1);
        }
        $('#textbox_path').val('OU:' + uploadFileName);
        checkUploadFileName();
    });
    $('#local_update').click( function() {
    	getAjaxData("api/monitoring/status", function($xml) {
            var gstatus_ret = xml2object($xml);
            if(gstatus_ret.type == "response") {
                G_MonitoringStatus = gstatus_ret;
            }
        }, {
            sync: true
        });	
    	if(G_MonitoringStatus.response.voice_busy == 1){
    		gotoPageWithoutHistory(VOICE_BUSY_URL);
    		return;
    	}
        if (isButtonEnable('local_update')) {
            if (G_NotificationsStatus.OnlineUpdateStatus == UPDATE_DOWNLOAD_PROGRESSING || G_NotificationsStatus.OnlineUpdateStatus == UPDATE_PROGRESSING) {
                showInfoDialog(IDS_update_updateing_try_again);
            } else {
                update_uploadFile();
            }
        }
    });
});