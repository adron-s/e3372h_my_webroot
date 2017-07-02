var ForcedUpdate_flat  = false;
var AutoUpdate_flat  = false;
var autoUpdateInterval  = '';
var auto_update_enable  = '';
var server_force_enable  = '';
var auto_update  = '';
var ui_download  = '';

function postForcedUpdate(flat){
    var online_up_config = {
        'autoUpdateInterval':autoUpdateInterval,
        'auto_update_enable':auto_update_enable,
        'server_force_enable':''
    };
    if(flat == 1) {
        online_up_config.server_force_enable = 1;
    } else {
        online_up_config.server_force_enable = 0;
    }
    var res = object2xml('request', online_up_config);
    saveAjaxData('api/online-update/configuration', res, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            log.debug('api/online-update/configuration success.');
        }else{
            showInfoDialog(common_failed);
            log.debug('api/online-update/configuration failed.');
        }
        setTimeout( function() {
            getSwitchStatus();
        }, g_feature.dialogdisapear);
    }, {
        sync: true
    });
}
function postAutoUpdate(flat){
    var autoupdate_config = {
        'auto_update':auto_update,
        'ui_download':ui_download
    };
    if(flat == 1) {
        autoupdate_config.auto_update = 1;
    } else {
        autoupdate_config.auto_update = 0;
    }
    var res = object2xml('request', autoupdate_config);
    saveAjaxData('api/online-update/autoupdate-config', res, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            log.debug('api/online-update/autoupdate-config success.');
        }else{
            showInfoDialog(common_failed);
            log.debug('api/online-update/autoupdate-config failed.');
        }
        setTimeout( function() {
            getSwitchStatus();
        }, g_feature.dialogdisapear);
    }, {
        sync: true
    });
}
function getSwitchStatus(){
    getAjaxData('api/webserver/white_list_switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            $('.notlogin_update_switch :input').removeAttr('disabled');
            if (ret.response.whitelist_enable == '1') { 
                $("input[name='notlogin_report']").get(0).checked = true;
            } else {
                $("input[name='notlogin_report']").get(1).checked = true;
            }
        } else if (ret.type == 'error'){
            $('.notlogin_update_switch :input').attr('disabled','disabled');
            $('.notlogin_update_switch').hide();
        }
    }, {
        errorCB: function() {
            $('.notlogin_update_switch :input').attr('disabled','disabled');
            $('.notlogin_update_switch').hide();
        },
        sync: true
    });
    getAjaxData('api/online-update/configuration', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            autoUpdateInterval  = ret.response.autoUpdateInterval;
            auto_update_enable  = ret.response.auto_update_enable;
            server_force_enable  = ret.response.server_force_enable;
            $('.forced_update_switch :input').removeAttr('disabled');
            if (typeof(ret.response.server_force_enable) != 'undefined' && ret.response.server_force_enable == '1') { 
                ForcedUpdate_flat  = true;
                $("input[name='forced_usesreport']").get(0).checked = true;
            } else if (typeof(ret.response.server_force_enable) != 'undefined' && ret.response.server_force_enable == '0') {
                ForcedUpdate_flat  = false;
                $("input[name='forced_usesreport']").get(1).checked = true;
            }else {
                ForcedUpdate_flat  = false;
                $('.forced_update_switch :input').attr('disabled','disabled');
                $('.forced_update_switch').hide();
            }
        } else if (ret.type == 'error') {
            ForcedUpdate_flat  = false;
            $('.forced_update_switch :input').attr('disabled','disabled');
            $('.forced_update_switch').hide();
        }
    }, {
        errorCB: function() {
            ForcedUpdate_flat  = false;
            $('.forced_update_switch :input').attr('disabled','disabled');
            $('.forced_update_switch').hide();
        },
        sync: true
    });
    getAjaxData('api/online-update/autoupdate-config', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            auto_update  = ret.response.auto_update;
            ui_download  = ret.response.ui_download;
            $('.auto_update_switch :input').removeAttr('disabled');
            if (typeof(ret.response.auto_update) != 'undefined' && ret.response.auto_update == '1') { 
                $("input[name='auto_usesreport']").get(0).checked = true;
                AutoUpdate_flat  = true;
            } else if (typeof(ret.response.auto_update) != 'undefined' && ret.response.auto_update == '0') {
                $("input[name='auto_usesreport']").get(1).checked = true;
                AutoUpdate_flat  = false;
            }else {
                AutoUpdate_flat  = false;
                $('.auto_update_switch :input').attr('disabled','disabled');
                $('.auto_update_switch').hide();

            }
        } else if (ret.type == 'error') {
            AutoUpdate_flat  = false;
            $('.auto_update_switch :input').attr('disabled','disabled');
            $('.auto_update_switch').hide();
        }
    }, {
        errorCB: function() {
            AutoUpdate_flat  = false;
                $('.auto_update_switch :input').attr('disabled','disabled');
                $('.auto_update_switch').hide();
        },
        sync: true
    });
}
function setnotloginupdateSwitch(){
    var notlogin_update= {
        whitelist_enable:0
    };
    notlogin_update.whitelist_enable = $("[name='notlogin_report']:checked").val();
    var res = object2xml('request', notlogin_update);
    saveAjaxData('api/webserver/white_list_switch', res, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            log.debug('api/webserver/white_list_switch success.');
        }else{
            showInfoDialog(common_failed);
            log.debug('api/webserver/white_list_switch failed.');
        }
        setTimeout( function() {
            getSwitchStatus();
        }, g_feature.dialogdisapear);
    }, {
        sync: true
    });
}
function setforcedupdateSwitch(){
    var forcedenable_ret = $("[name='forced_usesreport']:checked").val();
    if(forcedenable_ret == '0' && ForcedUpdate_flat){
        force_Update_checkUpdateStatus();
        if (force_Update_CurrentComponentStatus == 30) {
            showConfirmDialog(IDS_common_updateSystemConfirmLoading, function() {
                postForcedUpdate(0);
                ForcedUpdate_flat = false;
            }, function() {
                $("input[name='forced_usesreport']").get(0).checked = true;
            }, null, function() {
                $("input[name='forced_usesreport']").get(0).checked = true;
            });
        } else if (force_Update_CurrentComponentStatus == 14 && force_Update_DownloadProgressStatus == 100) {
            showConfirmDialog(IDS_common_updateSystemConfirmFinish, function() {
                postForcedUpdate(0);
                ForcedUpdate_flat = false;
            }, function() {
                $("input[name='forced_usesreport']").get(0).checked = true;
            }, null, function() {
                $("input[name='forced_usesreport']").get(0).checked = true;
            });
        } else {
            postForcedUpdate(0);
            ForcedUpdate_flat = false;
        }
    } else if (forcedenable_ret == '0' && !ForcedUpdate_flat) {
        postForcedUpdate(0);
        ForcedUpdate_flat = false;
    }else {
        postForcedUpdate(1);
        ForcedUpdate_flat = true;
    }
}
function setautoupdateSwitch(){
    var autoenable_ret = $("[name='auto_usesreport']:checked").val();
    if(autoenable_ret == '0' && AutoUpdate_flat){
        force_Update_checkUpdateStatus();
        if (force_Update_CurrentComponentStatus == 30) {
            showConfirmDialog(IDS_auto_updateSystemConfirmLoading, function() {
                postAutoUpdate(0);
                AutoUpdate_flat = false;
            }, function() {
                $("input[name='auto_usesreport']").get(0).checked = true;
            }, null, function() {
                $("input[name='auto_usesreport']").get(0).checked = true;
            });
        } else if (force_Update_CurrentComponentStatus == 14 && force_Update_DownloadProgressStatus == 100) {
            showConfirmDialog(IDS_auto_updateSystemConfirmFinish, function() {
                postAutoUpdate(0);
                AutoUpdate_flat = false;
            }, function() {
                $("input[name='auto_usesreport']").get(0).checked = true;
            }, null, function() {
                $("input[name='auto_usesreport']").get(0).checked = true;
            });
        } else {
            postAutoUpdate(0);
            AutoUpdate_flat = false;
        }
    } else if (autoenable_ret == '0' && !AutoUpdate_flat) {
        postAutoUpdate(0);
        AutoUpdate_flat = false;
    }else {
        postAutoUpdate(1);
        AutoUpdate_flat = true;
    }
}
$(document).ready( function() {
    getSwitchStatus();
    $("input[name='notlogin_report']").bind('change input paste cut keydown',setnotloginupdateSwitch);
    $("input[name='forced_usesreport']").bind('change input paste cut keydown',setforcedupdateSwitch);
    $("input[name='auto_usesreport']").bind('change input paste cut keydown',setautoupdateSwitch);
});



