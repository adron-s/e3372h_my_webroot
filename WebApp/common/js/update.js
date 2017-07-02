var UPDATE_STATUS_IDLE = 10;
var UPDATE_STATUS_QUERYING = 11;
var UPDATE_NEWVERSION_FOUND = 12;
var UPDATE_STATUS_QUERYING_FAILED = 13;
var UPDATE_UP_TO_DATE = 14;
var UPDATE_DOWNLOAD_FAILED = 20;
var UPDATE_DOWNLOAD_PROGRESSING = 30;
var UPDATE_DOWNLOAD_PENDING = 31;
var UPDATE_DOWNLOAD_COMPLETE = 40;
var UPDATE_READYTO_UPDATE = 50;
var UPDATE_START_UPDATE = 52;
var UPDATE_PROGRESSING = 60;
var UPDATE_FAILED_HAVEDATA = 70;
var UPDATE_FAILED_NODATA = 80;
var UPDATE_SUCCESSFUL_HAVEDATA = 90;
var UPDATE_SUCCESSFUL_NODATA = 100;
var RELOAD_PAGE_DELAY = 600;
var UPDATE_STATUS_INTERVAL = 1000;
var ONLINE_UPDATE_STATUS_INTERVAL = 10000;
var UPDATE_STATUS_QUICK_INTERVAL = 50;
var BATTERY_LESSTHAN_HALF = '110024';
var g_status = null;
var g_update_value = null;
var g_updateComponent = null;
var g_TB = 1024 * 1024 * 1024 * 1024;
var g_GB = 1024 * 1024 * 1024;
var g_MB = 1024 * 1024;
var g_KB = 1024;
var g_install_processbar_enable = 1;
var g_install_processbar_speed = 1;
var g_install_progress = 0;
var g_install_quick_flag = true;
var g_install_quick_speed = 1;
var g_download_install = true;
var g_install_finshed = false;
var g_progress_interval = null;
var g_updateStatus = 0;
var g_force_update = false;
var g_forceDownload = '';
var g_click_update_flag = false;
var g_checkUpdate_intervl="";
var g_oldAutoUpdateStatus = "";
var g_oldManualUpdateStatus = '';
function reloadPage() {
    $("#div_wrapper,.update_dialog:visible").hide();
    setTimeout( function() {
        window.location.reload();
    },RELOAD_PAGE_DELAY);
}

function update_displayNoNewVersionInfo() {
    if (!g_isBridgeNotesOpened && $("#dialog:visible").length==0) {
        clearDialog();
    } else if($("#dialog:visible").length>0) {
        $("#div_wrapper").show();
    }
    $('#up_content').hide();
    $('#up_version').hide();
    $('#up_system').show();
}

function formatComponentSize(bytes_number) {
    if (bytes_number >= g_TB) {
        return formatFloat((parseFloat(bytes_number / (g_TB))) , 2) + ' TB';
    }
    if (bytes_number >= g_GB && bytes_number < g_TB) {
        return formatFloat((parseFloat(bytes_number / (g_GB))) , 2) + ' GB';
    } else if (bytes_number >= g_MB && bytes_number < g_GB) {
        return formatFloat((parseFloat(bytes_number / (g_MB))) , 2) + ' MB';
    } else if (bytes_number >= g_KB && bytes_number < g_MB) {
        return formatFloat((parseFloat(bytes_number / (g_KB))) , 2) + ' KB';
    } else if (bytes_number < g_KB) {
        return formatFloat((parseFloat(bytes_number / (1))) , 2) + ' B';
    }
}
function update_showDownloading() {
    if(g_download_install) {
        var current_progress = g_status.DownloadProgress;
        var persent = formatFloat(parseInt(current_progress, 10) / 100, 2);
        var update_width = $('.graph').width() - 8;
        update_width = parseInt(update_width * persent, 10);
        $('.press').css({
            'width': update_width + 'px'
        });
        if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
            $('#downloadProcess').html('%' + current_progress);
        } else {
            if (LANGUAGE_DATA.current_language == 'es_ar' || LANGUAGE_DATA.current_language == 'es_es') {
                $('#downloadProcess').html(current_progress + ' %');
            } else {
                $('#downloadProcess').html(current_progress + '%');
            }
        }
        cancelLogoutTimer();
        if (g_updateComponent) {
            if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
            var downloadProcess = get_label_get + '&nbsp;' + g_status.TotalComponents + of_label_of + eval(parseInt(g_status.CurrentComponentIndex, 10) + 1) + common_colon + '&nbsp;';
            } else {
                var downloadProcess = get_label_get + '&nbsp;' + eval(parseInt(g_status.CurrentComponentIndex, 10) + 1) + of_label_of + g_status.TotalComponents + common_colon + '&nbsp;';
            }
            if ($.isArray(g_updateComponent)) {
                downloadProcess += XSSResolveCannotParseChar(newversion_label_newversion) + '&nbsp;' + formatComponentSize(g_updateComponent[g_status.CurrentComponentIndex].ComponentSize);
            } else {
                downloadProcess += newversion_label_newversion + '&nbsp;' + formatComponentSize(g_updateComponent.ComponentSize);
            }
            $('#update_download .up_get').html(downloadProcess);
        }
        if ($('#div_wrapper').size() < 1) {
            $('.body_bg').before("<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>");
        } else {
            $('#div_wrapper').remove();
            $('.body_bg').before("<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>");
        }
        $(".update_dialog").hide();
        reputPosition($('#update_download'), $('#div_wrapper'));
        disableTabKey();
        if(current_progress == UPDATE_SUCCESSFUL_NODATA && g_install_processbar_enable && UPDATE_PROGRESSING == g_updateStatus ) {
            g_install_progress = 0;
            g_download_install = false;
            g_install_quick_flag = true;
            $('#update_download .dialog_header_left').html(IDS_update_title_installing);
            $('#update_download .up_get').html(IDS_update_label_installing);
            $('#DownloadProgressing_Cancel').css('display','none');
            clearTimeout(g_decive_timer);
            clearTimeout(g_simcard_timer);
            clearTimeout(g_heart_beat_timer);
            show_install_progress();
        }
    }
}

function show_install_progress() {
    if( g_install_progress < 100) {
        if(!(g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA )) {
            g_install_progress += g_install_processbar_speed;
        } else {
            g_install_progress += g_install_quick_speed;
        }
        if(g_updateStatus == UPDATE_PROGRESSING && g_install_progress >= 100) {
            g_install_progress = 99;
        } else if(!(g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA ) && g_install_progress >= 100) {
            g_install_progress = 99;
        } else if(g_install_progress > 100) {
            g_install_progress = 100;
        }
    }
    var persent = formatFloat(parseInt(g_install_progress, 10) / 100, 2);
    var update_width = $('.graph').width() - 8;
    update_width = parseInt(update_width * persent, 10);
    $('.press').css({
        'width': update_width + 'px'
    });
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
        $('#downloadProcess').html('%' + g_install_progress);
    } else {
        if (LANGUAGE_DATA.current_language == 'es_ar' || LANGUAGE_DATA.current_language == 'es_es') {
            $('#downloadProcess').html(g_install_progress + ' %');
        } else {
            $('#downloadProcess').html(g_install_progress + '%');
        }
    }
    if(g_install_progress < 100) {
        if(g_updateStatus == UPDATE_SUCCESSFUL_NODATA) {
            g_progress_interval = setTimeout(show_install_progress, UPDATE_STATUS_QUICK_INTERVAL);
        } else {
            g_progress_interval = setTimeout(show_install_progress, UPDATE_STATUS_INTERVAL);
        }
        g_install_finshed = false;
    } else {
        g_install_finshed = true;
        setTimeout(update_downloadSuccess, UPDATE_STATUS_INTERVAL);
    }
}

function update_displayNewVersionFoundInfo(isShowDownloading) {
    $('#up_content').hide();
    $('#up_version').show();
    $('#up_system').hide();
    $('#up_now').hide();
    if (g_update_value == null) {
        getAjaxData('api/online-update/url-list', function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response') {
                g_update_value = update_ret.response;
                g_updateComponent = g_update_value.ComponentList.Component;
                if (g_updateComponent) {
                    var list_info = '';
                    var changeLog = IDS_update_label_features + common_colon;
                    if ($.isArray(g_updateComponent)) {
                        $.each(g_updateComponent, function(i) {
                            list_info += "<tr><td width='100'>" + newversion_label_newversion + common_colon + "</td><td><label class='up_newversion'>" + XSSResolveCannotParseChar(g_updateComponent[i].Version) + '</label></td></tr>' +
                            '<tr><td >' + sd_label_size + common_colon + "</td><td class = 'up_size'><label class='up_release'>" + formatComponentSize(g_updateComponent[i].ComponentSize) + '</label></td></tr>';
                        });
                    } else {
                        list_info += "<tr><td width='100'>" + newversion_label_newversion + common_colon + "</td><td><label class='up_newversion'>" + XSSResolveCannotParseChar(g_updateComponent.Version) + '</label></td></tr>' +
                        '<tr><td >' + sd_label_size + common_colon + "</td><td class = 'up_size'><label class='up_release'>" + formatComponentSize(g_updateComponent.ComponentSize) + '</label></td></tr>';
                    }
                    var useDefault = true;
                    $($xml.find('language')).each( function() {
                        if ($(this).attr('name') == LANGUAGE_DATA.current_language.replace(/_/, '-')) {
                            useDefault = false;
                            $($(this).find('features').find('feature')).each( function() {
                                changeLog += '\n' + $(this).text();
                            });
                        }
                    });
                    $($xml.find('language')).each( function() {
                        if (useDefault) {
                            var defaultLanguage = $xml.find('default-language').attr('name');
                            if ($(this).attr('name') == defaultLanguage) {
                                $($(this).find('features').find('feature')).each( function() {
                                    changeLog += '\n' + $(this).text();
                                });
                            }
                        }
                    });
                    $('.cancel_table').html(list_info);
                    $('.update_textarea').val(changeLog);
                    if (isShowDownloading) {
                        update_showDownloading();
                    }
                }
            }
        });
    } else {
        if (isShowDownloading) {
            update_showDownloading();
        }
    }
}

function update_downloadSuccess() {
    if(g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA) {
        if(!g_install_processbar_enable ||(g_install_processbar_enable && g_install_finshed)) {
            $('.update_dialog').hide();
            reputPosition($('#upload_success'), $('#div_wrapper'));
        }
    }
}

function update_failed() {
    clearInterval(g_checkUpdate_intervl);
    $('.update_dialog').hide();
    reputPosition($('#update_failed'), $('#div_wrapper'));
}

function update_battery_low() {
    clearInterval(g_checkUpdate_intervl);
    $('.update_dialog').hide();
    reputPosition($('#update_battery_low'), $('#div_wrapper'));
}

function update_checkUpdateStatus() {
    getAjaxData('api/online-update/status', function($xml) {
        var update_ret = xml2object($xml);
        if (update_ret.type == 'response') {
            g_status = update_ret.response;
            g_updateStatus = parseInt(g_status.CurrentComponentStatus, 10);
            if (g_oldManualUpdateStatus == '') {
                g_oldManualUpdateStatus = g_updateStatus;
            }
            update_processStatus(g_updateStatus);
        }
    }, {
        errorCB: function() {
            setTimeout(update_checkUpdateStatus, ONLINE_UPDATE_STATUS_INTERVAL);
        }
    }
    );
}

function update_checkUpdatingStatus() {
    if (g_click_update_flag) {
        return;
    }
    getAjaxData('api/online-update/status', function($xml) {
        var update_ret = xml2object($xml);
        if (update_ret.type == 'response') {
            g_status = update_ret.response;
            g_updateStatus = parseInt(g_status.CurrentComponentStatus, 10);
            if(g_oldAutoUpdateStatus == '') {
                g_oldAutoUpdateStatus = g_updateStatus;
            }
            var upGradeType = -1;
            if(typeof(g_status.upgradetype) != 'undefined') {
                upGradeType = parseInt(g_status.upgradetype, 10);
            }
            if ((g_updateStatus == UPDATE_UP_TO_DATE && parseInt(g_status.DownloadProgress, 10) == 100 && upGradeType == 0) || (g_updateStatus != UPDATE_STATUS_QUERYING_FAILED && g_updateStatus != UPDATE_UP_TO_DATE && g_updateStatus >= UPDATE_NEWVERSION_FOUND && g_updateStatus <= UPDATE_SUCCESSFUL_NODATA && upGradeType == 0)) {
                $("#up_currentVersion").hide();
                update_processingStatus(g_updateStatus);
            }
        }
    }, {
        errorCB: function() {
            setTimeout(update_checkUpdatingStatus, ONLINE_UPDATE_STATUS_INTERVAL);
        }
    });
}

function update_processStatus(CurrentComponentStatus) {
    if(CurrentComponentStatus == UPDATE_DOWNLOAD_PROGRESSING && parseInt(g_status.DownloadProgress, 10) > 0) {
        button_enable('DownloadProgressing_Cancel', '1');
    } else {
        button_enable('DownloadProgressing_Cancel', '0');
    }
    switch (CurrentComponentStatus) {
        //The content in log debug is just for test, it can be ignored.
        case UPDATE_STATUS_IDLE:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_IDLE)');
            $('#online_update').show();
            //$('#uploadLocalFile').hide();
            $('#up_system').html('');
            $('#online_update h2').hide();
            update_displayNoNewVersionInfo();//Told user there hasn't new version.
            break;
        case UPDATE_STATUS_QUERYING:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING)');
            break;
        case UPDATE_NEWVERSION_FOUND:
            log.debug('online-update : update_processStatus(UPDATE_NEWVERSION_FOUND)');
            $('#update_download').hide('fast');
            if($("#dialog:visible").length==0) {
                $('#div_wrapper').hide('fast');
            }
            update_displayNewVersionFoundInfo();
            button_enable('update_now', '1');
            if (g_autoDownload_flag == '1') {
                g_autoDownload_flag = '0';
                $('#update_now').trigger('click');
            }
            return;
        case UPDATE_STATUS_QUERYING_FAILED:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING_FAILED)');
            if((G_MonitoringStatus.response.ConnectionStatus != '901') && (G_MonitoringStatus.response.WifiConnectionStatus != '901'))
            {
                $('#up_system').html(IDS_update_fail_no_internet);
            }
            update_displayNoNewVersionInfo();
            return;
        case UPDATE_UP_TO_DATE:
            log.debug('online-update : update_processStatus(UPDATE_UP_TO_DATE)');
            if (parseInt(g_status.DownloadProgress, 10) == 100) {
                $('#update_download,#div_wrapper').hide();
                $("#up_currentVersion").hide();
                $('#up_content').hide();
                $('#up_version').hide();
                $('#up_system').hide();
                $('#up_now').show();
                $('#online_update h2').hide();
                return;
            } else {
                $('#up_system').html(IDS_update_latest_version);
                $('#online_update h2').hide();
                update_displayNoNewVersionInfo();//Told user there hasn't new version.
            }
            return;
        case UPDATE_DOWNLOAD_FAILED:
            if(g_status.updatebatterystatus == '1') {
                log.debug('online-update : update_processStatus(UPDATE_BATTERY_LOW)');
                update_battery_low();
            } else if(g_oldManualUpdateStatus != UPDATE_DOWNLOAD_FAILED) {
                log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_FAILED)');
                update_failed();
            } else if(g_oldManualUpdateStatus == UPDATE_DOWNLOAD_FAILED && $("#update_download:visible").length>0) {
                log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_FAILED)');
                update_failed();
            }
            if($("#up_version:visible").length==0) {
                $("#up_currentVersion").show();
            }
            startLogoutTimer();
            return;
        case UPDATE_DOWNLOAD_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PROGRESSING');
            update_displayNewVersionFoundInfo(true);
            button_enable('update_now', '0');
            if (g_status.autodownload == '1'|| g_force_update && (g_forceDownload == '1')) {
                $('#auto_download_prompt').show();
                button_enable('DownloadProgressing_Cancel', '0');
            } else {
                $('#auto_download_prompt').hide();
                if(parseInt(g_status.DownloadProgress, 10) > 0) {
                    button_enable('DownloadProgressing_Cancel', '1');
                }
            }
            break;
        case UPDATE_DOWNLOAD_PENDING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PENDING)');
            update_displayNewVersionFoundInfo();
            button_enable('update_now', '0');
            return;
        case UPDATE_DOWNLOAD_COMPLETE:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_COMPLETE)');
            break;
        case UPDATE_READYTO_UPDATE:
            log.debug('online-update : update_processStatus(UPDATE_READYTO_UPDATE)');
            break;
        case UPDATE_START_UPDATE:
            $('#update_download,#div_wrapper').hide();
            $('#up_now').show();
            $('#online_update h2').hide();
            update_displayNoNewVersionInfo();
            return;
        case UPDATE_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_PROGRESSING)');
            $('#auto_download_prompt').hide();
            update_displayNewVersionFoundInfo(true);
            button_enable('update_now', '0');
            break;
        case UPDATE_FAILED_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_HAVEDATA)');
            update_failed();
            startLogoutTimer();
            return;
        case UPDATE_FAILED_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_NODATA)');
            update_failed();
            startLogoutTimer();
            return;
        case UPDATE_SUCCESSFUL_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_HAVEDATA)');
            update_downloadSuccess();
            startLogoutTimer();
            return;
        case UPDATE_SUCCESSFUL_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_NODATA)');
            update_downloadSuccess();
            startLogoutTimer();
            return;
        default:
            break;
    }
    setTimeout(update_checkUpdateStatus, UPDATE_STATUS_INTERVAL);
}
function update_processingStatus(CurrentComponentStatus) {
    if(CurrentComponentStatus == UPDATE_DOWNLOAD_PROGRESSING && parseInt(g_status.DownloadProgress, 10) > 0) {
        button_enable('DownloadProgressing_Cancel', '1');
    } else {
        button_enable('DownloadProgressing_Cancel', '0');
    }
    switch (CurrentComponentStatus) {
        //The content in log debug is just for test, it can be ignored.
        case UPDATE_STATUS_QUERYING:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING)');
            break;
        case UPDATE_NEWVERSION_FOUND:
            log.debug('online-update : update_processStatus(UPDATE_NEWVERSION_FOUND)');
            $('#update_download').hide('fast');
            if($("#dialog:visible").length==0) {
                $('#div_wrapper').hide('fast');
            }
            update_displayNewVersionFoundInfo();
            button_enable('update_now', '1');
            if (g_autoDownload_flag == '1') {
                g_autoDownload_flag = '0';
                $('#update_now').trigger('click');
            }
            return;
        case UPDATE_STATUS_QUERYING_FAILED:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING_FAILED)');
            if((G_MonitoringStatus.response.ConnectionStatus != '901') && (G_MonitoringStatus.response.WifiConnectionStatus != '901'))
            {
                $('#up_system').html(IDS_update_fail_no_internet);
            }
            update_displayNoNewVersionInfo();
            return;
        case UPDATE_UP_TO_DATE:
            log.debug('online-update : update_processStatus(UPDATE_UP_TO_DATE)');
            if (parseInt(g_status.DownloadProgress, 10) == 100) {
                $('#update_download,#div_wrapper').hide();
                $("#up_currentVersion").hide();
                $('#up_content').hide();
                $('#up_version').hide();
                $('#up_system').hide();
                $('#up_now').show();
                $('#online_update h2').hide();
                return;
            } else {
                $('#up_system').html(IDS_update_latest_version);
                $('#online_update h2').hide();
                update_displayNoNewVersionInfo();//Told user there hasn't new version.
            }
            return;
        case UPDATE_DOWNLOAD_FAILED:
            if(g_status.updatebatterystatus == '1') {
                log.debug('online-update : update_processStatus(UPDATE_BATTERY_LOW)');
                update_battery_low();
            } else if(g_oldAutoUpdateStatus != UPDATE_DOWNLOAD_FAILED) {
                log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_FAILED)');
                update_failed();
            } else if(g_oldAutoUpdateStatus == UPDATE_DOWNLOAD_FAILED && $("#update_download:visible").length>0) {
                log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_FAILED)');
                update_failed();
            }
            if($("#up_version:visible").length==0) {
                $("#up_currentVersion").show();
            }
            startLogoutTimer();
            return;
        case UPDATE_DOWNLOAD_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PROGRESSING');
            update_displayNewVersionFoundInfo(true);
            button_enable('update_now', '0');
            if (g_status.autodownload == '1'|| g_force_update && (g_forceDownload == '1')) {
                $('#auto_download_prompt').show();
                button_enable('DownloadProgressing_Cancel', '0');
            } else {
                $('#auto_download_prompt').hide();
                if(parseInt(g_status.DownloadProgress, 10) > 0) {
                    button_enable('DownloadProgressing_Cancel', '1');
                }
            }
            break;
        case UPDATE_DOWNLOAD_PENDING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PENDING)');
            update_displayNewVersionFoundInfo();
            button_enable('update_now', '0');
            return;
        case UPDATE_DOWNLOAD_COMPLETE:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_COMPLETE)');
            break;
        case UPDATE_READYTO_UPDATE:
            log.debug('online-update : update_processStatus(UPDATE_READYTO_UPDATE)');
            break;
        case UPDATE_START_UPDATE:
            $('#update_download,#div_wrapper').hide();
            $('#up_now').show();
            $('#online_update h2').hide();
            update_displayNoNewVersionInfo();
            return;
        case UPDATE_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_PROGRESSING)');
            $('#auto_download_prompt').hide();
            update_displayNewVersionFoundInfo(true);
            button_enable('update_now', '0');
            break;
        case UPDATE_FAILED_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_HAVEDATA)');
            if ($("#update_download:visible").length>0) {
                update_failed();
                startLogoutTimer();
            } else {
                $("#up_version").hide();
                $("#up_currentVersion").show();
            }
            return;
        case UPDATE_FAILED_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_NODATA)');
            if ($("#update_download:visible").length>0) {
                update_failed();
                startLogoutTimer();
            } else {
                $("#up_version").hide();
                $("#up_currentVersion").show();
            }
            return;
        case UPDATE_SUCCESSFUL_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_HAVEDATA)');
            if($("#up_version:visible").length==0) {
                $("#up_version").hide();
                $("#up_currentVersion").show();
            }
            return;

        case UPDATE_SUCCESSFUL_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_NODATA)');
            if($("#up_version:visible").length==0) {
                $("#up_version").hide();
                $("#up_currentVersion").show();
            }
            return;

        default:
            break;
    }
}
function update_checkNewVersion() {
    $("#up_currentVersion").hide();
    $('#up_content').show();
    $('#up_version').hide();
    $('#up_system').hide();
    $('#up_now').hide();
    saveAjaxData('api/online-update/check-new-version', '', function($xml) {
          update_checkUpdateStatus();
          var return_ret = xml2object($xml);
           if (isAjaxReturnOK(return_ret)) {
                 log.debug('online-update : send check-new-version success.');
            }
    });
}

function update_onClickUpdateNow() {
    var updateStatus = parseInt(G_NotificationsStatus.OnlineUpdateStatus, 10);
    if (updateStatus != UPDATE_DOWNLOAD_PROGRESSING && updateStatus != UPDATE_PROGRESSING && updateStatus != UPDATE_UP_TO_DATE) {
        clearAllErrorLabel();
        $('#update_now').unbind('click');
        var submitData = {
            userAckNewVersion: 0
        };
        var res = object2xml('request', submitData);
        saveAjaxData('api/online-update/ack-newversion', res, function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response') {
                update_checkUpdateStatus();
                g_download_install = true;
            } else if (update_ret.type == 'error') {
                if (update_ret.error.code == BATTERY_LESSTHAN_HALF) {
                    if(g_coulometer_status == '1'){
                        log.debug('the battery less than 20%');
                    }else{
                        log.debug('the battery less than 50%');
                    }
                    showInfoDialog(STRID_update_hint_battery_prower_low);
                    return;
                }
            }
        });
    } else {
        if (g_autoUpdate_flag == '1') {
            update_checkUpdateStatus();
        } else {
            getAjaxData('api/online-update/status', function($xml) {
                var update_ret = xml2object($xml);
                if (update_ret.type == 'response') {
                    g_status = update_ret.response;
                    g_updateStatus = parseInt(g_status.CurrentComponentStatus, 10);
                    if(g_updateStatus != UPDATE_NEWVERSION_FOUND) {
                        clearAllErrorLabel();
                        showErrorUnderTextbox('update_now', IDS_update_updateing_try_again);
                    }
                }
            });
        }
    }
}

function update_okDownloading() {
    if (isButtonEnable('DownloadProgressing_Cancel')) {
        $('#update_download,#div_wrapper').hide();
        saveAjaxData('api/online-update/cancel-downloading', '', function($xml) {
            var return_ret = xml2object($xml);
            if (return_ret.type == 'response') {
                log.debug('update data successfull');
            }
        }, {
                sync: true
        });
        saveAjaxData('api/online-update/check-new-version', '', function($xml) {
            var return_ret = xml2object($xml);
            if (isAjaxReturnOK(return_ret)) {
                 log.debug('online-update : send check-new-version success.');
            }
        }, {
                sync: true
        });
        reloadPage();
    }
}

var g_autoUpdate_flag = '';
var g_autoDownload_flag = '';
function getUpdateConfig() {
    getConfigData('config/webuicfg/config.xml', function($xml) {
        var update_config = _xml2feature($xml);
        g_install_processbar_enable = update_config.install_processbar_enable;
        g_install_processbar_speed = update_config.install_processbar_speed;
    }, {
        sync: true
    });
    getAjaxData('api/online-update/autoupdate-config', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_autoUpdate_flag = ret.response.auto_update;
            g_autoDownload_flag = ret.response.ui_download;
        }
    }, {
        sync: true
    });
}
function createCanvas(id,idcanvas){
    var div = $('#'+id+' span:eq(1) a');
    if($.browser.msie && (parseInt($.browser.version,10) < 9)){
        $(".dialog_header_left").css("margin-top","5");
        $(".dialog_header_right").css("margin-top","5");
        $(".dialog_header").css({"width":"500px","height":"29px"});
        $(".dialog_header").corner("top 5px");
        $(".dialog_table_bottom").corner("keep round br bl 3px cc:6a6a6a");
        var ahtml = "<img src='../res/new_del.png' title='' alt='' />";
        div.append(ahtml);
        div.css("margin-top","-12px");
    }else{
        var svg = "<canvas id='"+idcanvas+"' width='25px' height='25px'></canvas>";
        div.append(svg);
        var canvas = document.getElementById(idcanvas);
        draw(canvas);
    }
}
    

function update_executeBeforeDocumentReady() {
    getAjaxData('api/monitoring/status', function($xml) {
        log.debug('MAIN : getDeviceStatus() get monitoring success');
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            G_MonitoringStatus = ret;
        }
    }, {
        sync: true
    });

    if (g_module.cradle_enabled) {
        getAjaxData('api/cradle/status-info', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                G_cradleStationStatus = ret.response;
            }
        }, {
            sync: true
        });

    }
    if(WIFI_CONNECTED == G_MonitoringStatus.response.WifiConnectionStatus ||
    (g_module.cradle_enabled && CRADLE_NETLINE_EXIST == G_cradleStationStatus.cradlestatus &&
    G_cradleStationStatus.connectionmode != ETHERNET_LAN_MODE &&
    (G_cradleStationStatus.connectstatus != MACRO_CRADLE_CONNECTSTATUSNULL &&
    G_cradleStationStatus.connectstatus != MACRO_CRANDLE_CONNECTSTATUSERRO))||
    !(redirectOnCondition(null, 'update'))) {
        if(g_needToLogin == '1'&& !g_not_need_login_update) {
            checklogin();
        }
    }
    getUpdateConfig();
}
function initPage() {
    if(g_not_need_login_update){
        getAjaxData('api/device/basic_information', function($xml) {
            var ret = xml2object($xml);
            if(ret.type == 'response') {
                if(ret.response.SoftwareVersion != '' && typeof(ret.response.SoftwareVersion) != 'undefined') {
                    $(".software_version").text(ret.response.SoftwareVersion);
                } else {
                    $(".software_version").text(common_unknown);
                }
                if(ret.response.WebUIVersion != '' && typeof(ret.response.WebUIVersion) != 'undefined') {
                    $(".ui_version").text(ret.response.WebUIVersion);
                } else {
                    $(".ui_version").text(common_unknown);
                }
            }
        }, {
            sync: true
        });
    }else{
        getAjaxData('api/device/information', function($xml) {
            var ret = xml2object($xml);
            if(ret.type == 'response') {
                if(ret.response.SoftwareVersion != '' && typeof(ret.response.SoftwareVersion) != 'undefined') {
                    $(".software_version").text(ret.response.SoftwareVersion);
                } else {
                    $(".software_version").text(common_unknown);
                }
                if(ret.response.WebUIVersion != '' && typeof(ret.response.WebUIVersion) != 'undefined') {
                    $(".ui_version").text(ret.response.WebUIVersion);
                } else {
                    $(".ui_version").text(common_unknown);
                }
            }
        }, {
            sync: true
        });
    }
    if(g_coulometer_status == '-1'){
        getAjaxData('api/device/device-feature-switch', function($xml) {
            var coulometer_ret = xml2object($xml);
            if (coulometer_ret.type == 'response') {
                g_coulometer_status = coulometer_ret.response.coulometer_enabled;
            }
        }, {
            sync: true
        });
    }
    getAjaxData('api/online-update/configuration', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (typeof(ret.response.server_force_enable) != 'undefined' && ret.response.server_force_enable == '1') { //open auto update
                g_force_update = true;
            } else if (typeof(ret.response.server_force_enable) != 'undefined' && ret.response.server_force_enable == '0') {
                g_force_update = false;
            }else {
                g_force_update = false;
            }
        } else if (ret.type == 'error') {
            g_force_update = false;

        }
    }, {
        errorCB: function() {
            g_force_update = false;
        },
        sync: true
    });

    getAjaxData('api/online-update/url-list', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_forceDownload = ret.response.forced_update_status;
        }
    }, {
        sync: true
    });

    IDS_update_battery_low_warning = coulometerCheck(IDS_update_battery_low_warning);
    STRID_update_hint_battery_prower_low = coulometerCheck(STRID_update_hint_battery_prower_low);
    $('#battery_low_replace').text(IDS_update_battery_low_warning);
}
/**********************************After loaded (common)************/
function update_onClickInstallNow() {
    var updateStatus = parseInt(G_NotificationsStatus.OnlineUpdateStatus, 10);
    if (updateStatus != UPDATE_DOWNLOAD_PROGRESSING && updateStatus != UPDATE_PROGRESSING) {
        clearAllErrorLabel();
        $('#install_now').unbind('click');
        var submitData = {
            UserAckUpdate: 0
        };
        var res = object2xml('request', submitData);
        saveAjaxData('api/online-update/ack-readytoupdate', res, function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response') {
                update_checkUpdateStatus();
                g_download_install = true;
            } else if (update_ret.type == 'error') {
                if (update_ret.error.code == BATTERY_LESSTHAN_HALF) {
                    showInfoDialog(STRID_update_hint_battery_prower_low);
                }
            }
        });
    } else {
        showInfoDialog(IDS_update_updateing_try_again);
    }
}
function checkNewVersionForAutoClick() {
    var MACRO_CHECK_INTERVAL = 50;
    if (g_module.online_update_enabled) {
        if ( null == G_NotificationsStatus) {
            setTimeout(checkNewVersionForAutoClick, MACRO_CHECK_INTERVAL);
        } else if(MACRO_NEWVERSIONFOUND == G_NotificationsStatus.OnlineUpdateStatus || MACRO_READYTOUPDATE == G_NotificationsStatus.OnlineUpdateStatus) {
            $('#check_now').trigger('click');
        }
    }
}
update_executeBeforeDocumentReady();
$(document).ready( function() { 
    initPage();
    checkNewVersionForAutoClick(); 
    setTimeout( function() {
        if (getQueryStringByName('mode') == null || getQueryStringByName('mode').toLowerCase() != 'local') {
            update_checkUpdatingStatus();
            g_checkUpdate_intervl = setInterval(update_checkUpdatingStatus,UPDATE_STATUS_INTERVAL);
        }
    }, 50);
    $('#check_now').live('click', function() {
        if(!isButtonEnable("check_now")) {
             return;
        }
        update_checkNewVersion();
    });
    $('#update_now').live('click', function() {
        if(!isButtonEnable("update_now")) {
            return;
        }
        g_click_update_flag = true;
        update_onClickUpdateNow();
    });
    $('#install_now').live('click', function() {
        if(!isButtonEnable("install_now")) {
            return;
        }
        update_onClickInstallNow();
    });
    $('#DownloadProgressing_Cancel').bind('click', update_okDownloading);
    $('#query_again').bind('click', function() {
        update_checkNewVersion();
    });
    $('.dialog_close_btn, .pop_Cancel').live('click', function() {
        reloadPage();
    });
    $('#success_ok').live('click', function() {
        $('#upload_success,#div_wrapper').hide();
        reloadPage();
    });
});