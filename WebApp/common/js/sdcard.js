// JavaScript Document
//Content of popup window
var dialogContent = "<iframe name='iframe_upload_file' style='display:none;'></iframe>";
dialogContent += "<table width='580' cellpadding='0' cellspacing='0'><tr height='32'><td width='185' height='42' align='center'>" + sd_label_upload_file + "</td><td width='15'></td><td class='td_upload_file'>";
dialogContent += "<form name='tF0' id='upload_file_form' method='post' action='/api/sdcard/fileupload' enctype='multipart/form-data' encoding='multipart/form-data' target='iframe_upload_file'>";
dialogContent += "<input type='hidden' name='csrf_token' id='csrf_token' value=''>";
dialogContent += "<input type='hidden' name='cur_path' id='cur_path' value=''>";

dialogContent += "<input type='hidden' name='page' id='page' value='sdcardsharing.html'>";
dialogContent += "<input type='file' name='uploadfile' id='fileField2' size='40' class='upload_file' contentEditable=false onfocus='setInputValue();' onchange='fileFieldChange()' value=''/>";
dialogContent += "<input type='hidden' id='upload_year' name='upload_year' value='' />";
dialogContent += "<input type='hidden' id='upload_month' name='upload_month' value='' />";
dialogContent += "<input type='hidden' id='upload_day' name='upload_day' value='' />";
dialogContent += "<input type='hidden' id='upload_hours' name='upload_hours' value='' />";
dialogContent += "<input type='hidden' id='upload_minutes' name='upload_minutes' value='' />";
dialogContent += "<input type='hidden' id='upload_secondes' name='upload_secondes' />";
dialogContent += '</form></td></tr></table>';

var NewFolder = "<table cellpadding='0' align='center' cellspacing='0'><tr id='sd_new_folder_tr' height='32'><td width='190' height='42' align='left' valign='center'>" + sd_label_input_new_folder_name + "</td><td width='290' align='left' valign='center'><input type='text' name='textfield' id='textfield' maxlength='64' size='40' class='input_style' /></td></tr></table>";

var chooseContent = "<div id='file_path_wrapper' class='file_path_wrapper'><p class='clr_bold'>" + sd_hint_select_a_folder + "</p><div id='file_tree_wrapper' class='file_tree_wrapper'><div id='file_tree_div' class='file_tree_div clr_bold_sd_folder_name'></div></div></div>";

var sd_card_share_status = "";
var SD_STATUS_DISABLE = '0';
var SD_NO_FORMATED = '2';
var SD_SHARE = '1';
var SD_NOSHARE = '0';
var SD_WEB_SHARE = '0';
var SD_USB_SHARE = '1';
var SD_ACCESS_READ = '0';
var SD_ACCESS_WRITE = '1';
var SD_SHARE_ALL_FILE = '0';
var SD_SHARE_CUSTOM_FILE = '1';
var SD_ROOT_DIRECTORY = 'tffs0b';
var FILE_LIST_TYPE_FOLDER = '0';
var FILE_LIST_TYPE_FILE = '1';
var LOGIN_STATE_NOMAL = '0';
var LOGIN_STATE_ERROR = '1';

//upload
var SD_FILE_UPLOAD_SUCCESS = 0;
var SD_FILE_UPLOAD_FAIL = 1;
var SD_FILE_UPLOADING = 2;
var SD_FILE_UPLOAD_FAIL_NOSPACE = 3;
var SD_FILE_UPLOAD_FAIL_NOSD = 4;
var SD_FILE_UPLOAD_FAIL_2GB = 5;
var SD_FILE_UPLOAD_FAILED_WRONG_FILENAME = 6;
var SD_FILE_UPLOAD_FAILED_SD_REMOVED = 7;
var SD_FILE_UPLOAD_FAILED_NAME_LONGER = 8;
var SD_FILE_UPLOAD_FAILED_ACCESS_RIGHTS = 9;
var g_status_req_sd = null;
var g_status_req_inited_sd = false;
var MACRO_FILE_EXIST = '114001';
var MACRO_FILE_SYSTEM_BUSY = '114003';
var MACRO_FILE_ROUTE_NOT_EXIST = '114004';
var MACRO_FILE_NAME_LONGERR = '114005';
var MACRO_NO_ACCESS_RIGHTS = '114006';
var href = window.location.href;
var stateArray = href.split('=');
var state = stateArray[1];
var upload_state = state;
var login_state = null;
var g_sd_card_status = 0;
var g_sd_mode_id = '';

//Setting
var web_sharing = {
    SDShareMode: '',
    SDCardShareStatus: '',
    SDShareFileMode: '',
    SDAccessType: '',
    SDSharePath: ''
};

//char count of root path
var ROOT_PATH_CHAR_PATH = 6;

var root_path = '/';
var g_customer_path = '/';
//Folder path
var folder_path = {
    CurrentPath: ''
};

//Store currently status
var g_currently_sd_mode = '3';
//Store currently mode
var g_currently_sd_status = '3';

//Store access type
var g_sd_card_access_type = '0';

//the last path when uploading file
var lastPath = '';

//SD card total size
var totalSize = 0;

function logout() {
    var request = {
        'Logout' : 1
    };

    var logoutXml = object2xml('request', request);
    saveAjaxData('api/user/logout', logoutXml, function($xml) {
        gotoPageWithoutHistory('home.html');
    });
}

function getUserStatus() {
    getAjaxData('api/user/state-login', function($xml) {
        var login_set = xml2object($xml);
        if ('response' == login_set.type) {
            login_state = login_set;
            //Start time out
            if (LOGIN_STATE_NOMAL == login_state.response.State) {
                startLogoutTimer();
            }
        } else {
            login_state = null;
        }
    }, {
        sync: true
    });
}

function rfc3986_url_ChangeBackSpecialChar(xmlStr) {
    return xmlStr.replace(/(%26|%27|%23|%25|%2F)/g, function($0, $1) {
        return {
            '%26' : '&amp;' ,
            '%27' : "'" ,
            '%23' : '#' ,
            '%25' : '%' ,
            '%2F' : '\/'
        }[$1];
    }
    );
}

function sd_getLastPath() {
    var pathIndex = window.location.href.indexOf('?');
    if (pathIndex != -1) {
        lastPath = window.location.href.substr(pathIndex + 1);
        lastPath = decodeURI(lastPath);
        lastPath = rfc3986_url_ChangeBackSpecialChar(lastPath);
    } else {
        lastPath = '';
    }
}

sd_getLastPath();
getUserStatus();

function rfc3986_url_resolveSpecialChar(xmlStr) {
    return xmlStr.replace(/(&#40;|&#41;|&apos;|&quot;|&lt;|&gt;|&#x2F;|&amp;|&#39;|\&|\'|\#|\%)/g, function($0, $1) {
        return {
            '&#40;' : '%28' ,
            '&#41;' : '%29' ,
            '&apos;' : '%27' ,
            '&quot;' : '%22' ,
            '&lt;' : '%3C' ,
            '&gt;' : '%3E' ,
            '&#x2F;' : '%2F' ,
            '&amp;' : '%26' ,
            '&#39;' : '%27' ,
            '&' : '%26' ,
            "'" : '%27' ,
            '#' : '%23' ,
            '%' : '%25'
        }[$1];
    }
    );
}

function switchFolderListCheckbox(login_obj, web_share_obj, fileArray) {

    var i = 0;
    if (null == fileArray || typeof fileArray == 'undefined') {
        return;
    }
    if (SD_ACCESS_READ == web_share_obj.SDAccessType &&
    LOGIN_STATE_NOMAL != login_obj.response.State) {
        var fileIndex = fileArray.length;
        $('input:checkbox').attr('disabled', 'disabled');
    }
}

function folderlists(now_path) {
    button_enable("button_sd_upload", "0");
    button_enable("sd_new_folder", "0");
    var temp_customer_path = g_customer_path.replace(/\&/g, "&amp;");
    if ('/' == now_path) {
        button_enable('sd_label_up', '0');
    } else if (LOGIN_STATE_NOMAL == login_state.response.State) {
        button_enable('sd_label_up', '1');
    } else if(temp_customer_path == now_path && LOGIN_STATE_NOMAL != login_state.response.State) {
        button_enable('sd_label_up', '0');
    } else {
        button_enable('sd_label_up', '1');
    }
    var currently_path = {
        CurrentPath: now_path
    };

    var path_xml = object2xml('request', currently_path);
    saveAjaxData('api/sdcard/sdfile', path_xml, function($xml) {
        var return_ret = xml2object($xml);
        if ('response' == return_ret.type) {
            var file_list_html = "<tr><th width='15'><input type='checkbox' name='checkbox' id='checkbox' /></th><th width='120'>" + firewall_label_name + "</th><th width='60'>" + sd_label_size + "</th><th width='100'>" + common_operation + '</th></tr>';
            var file_array = return_ret.response.FileList.File;
            $('#wait_table').remove();
            if ($.isArray(file_array)) {
                $.each(file_array, function(i) {
                    var fileName = null;
                    var fileHref = '';
                    var checkboxValue = '';
                    fileName = file_array[i].Name;
                    fileName = sd_resolveEntityReference(fileName);
                    checkboxValue = fileName;
                    if (FILE_LIST_TYPE_FOLDER == file_array[i].Type) {
                        file_list_html += "<tr><td width='38'><input type='checkbox' name='checkbox" + i + "' id='checkbox" + i + "' value='" + fileName + "' /></td><td width='160'><div class='sd_img_file'><a href='javascript:void(0)'><pre>" + fileName + "</pre></a></div></td><td width='60'>&nbsp;</td><td>&nbsp;</td></tr>";
                    } else {
                        var file_size = parseInt(file_array[i].Size, 10);
                        if (1024 <= file_size && (1024 * 1024) > file_size) {
                            file_size = formatFloat(file_size / 1024, 2) + ' KB';
                        } else if ((1024 * 1024) <= file_size && (1024 * 1024 * 1024) > file_size) {
                            file_size = formatFloat(file_size / (1024 * 1024), 2) + ' MB';
                        } else if ((1024 * 1024 * 1024) <= file_size && (1024 * 1024 * 1024 * 1024) > file_size) {
                            file_size = formatFloat(file_size / (1024 * 1024 * 1024), 2) + ' GB';
                        } else if ((1024 * 1024 * 1024 * 1024) <= file_size) {
                            file_size = formatFloat(file_size / (1024 * 1024 * 1024 * 1024), 2) + ' TB';
                        } else {
                            file_size = formatFloat(file_size / 1, 2) + ' B';
                        }
                        if (now_path === '/') {
                            fileHref = '/sdcard' + now_path + fileName;
                        } else {
                            fileHref = '/sdcard' + now_path + '/' + fileName;
                        }
                        fileHref = rfc3986_url_resolveSpecialChar(fileHref);
                        file_list_html += "<tr><td><input type='checkbox' name='checkbox" + i + "' id='checkbox" + i + "' value='" + fileName + "' /></td><td><div class='sd_img'><a class='downloadBtn' href='" + fileHref + "'><pre>" + fileName + '</pre></a></div></td><td class= "fileSize">' + file_size + "</td><td><a class='downloadBtn' href='" + fileHref + "' style='color:#12A5D6;text-decoration:underline;'>" + down_label_download + '</a></td></tr>';
                    }
                });
            } else if (typeof(file_array) != 'undefined') {
                var fileName = null;
                var checkboxValue = '';
                fileName = file_array.Name;
                fileName = sd_resolveEntityReference(fileName);
                checkboxValue = fileName;
                if (FILE_LIST_TYPE_FOLDER == file_array.Type) {
                    file_list_html += "<tr><td width='38'><input type='checkbox' name='checkbox" + fileName + "' id='checkbox" + fileName + "' value='" + fileName + "' /></td><td><div class='sd_img_file'><a href='javascript:void(0)'><pre>" + fileName + '</pre></a></div></td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                } else {
                    var file_size = parseInt(file_array.Size, 10);
                    if (1024 <= file_size && (1024 * 1024) > file_size) {
                        file_size = formatFloat(file_size / 1024, 2) + ' KB';
                    } else if ((1024 * 1024) <= file_size && (1024 * 1024 * 1024) > file_size) {
                        file_size = formatFloat(file_size / (1024 * 1024), 2) + ' MB';
                    } else if ((1024 * 1024 * 1024) <= file_size && (1024 * 1024 * 1024 * 1024) > file_size) {
                        file_size = formatFloat(file_size / (1024 * 1024 * 1024), 2) + ' GB';
                    } else if ((1024 * 1024 * 1024 * 1024) <= file_size) {
                        file_size = formatFloat(file_size / (1024 * 1024 * 1024 * 1024), 2) + ' TB';
                    } else {
                        file_size = formatFloat(file_size / 1, 2) + ' B';
                    }
                    if (now_path === '/') {
                        fileHref = '/sdcard' + now_path + fileName;
                    } else {
                        fileHref = '/sdcard' + now_path + '/' + fileName;
                    }
                    fileHref = rfc3986_url_resolveSpecialChar(fileHref);
                    file_list_html += "<tr><td width='38'><input type='checkbox' name='checkbox' id='checkbox" + fileName + "' value='" + fileName + "' /></td><td><div class='sd_img'><a class='downloadBtn' href='" + fileHref + "'><pre>" + fileName + '</pre></a></div></td><td>' + file_size + "</td><td><a class='downloadBtn' href='" + fileHref + "' style='color:#12A5D6;text-decoration:underline;'>" + down_label_download + '</a></td></tr>';
                }
            } else {
                file_list_html = '<tr>';
                file_list_html += "<td colspan='4'>" + IDS_share_no_content + "</td>";
                file_list_html += '</tr>';
            }
            $('#sd_list').html(file_list_html);
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
            $('.micro_sd').html('<pre>' + XSSResolveHtmlReturnChar(now_path) + '</pre>');
            switchFolderListCheckbox(login_state, web_sharing, file_array);
            button_enable("button_sd_upload", "1");
            button_enable("sd_new_folder", "1");
        } else {
            $('#wait_table').remove();
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
            $('#common_delete #button_sd_upload #sd_new_folder').addClass('disable_btn');
            if (MACRO_FILE_NAME_LONGERR == return_ret.error.code) {
                button_enable("button_sd_upload", "1");
                button_enable("sd_new_folder", "1");
                setTimeout( function() {
                    showInfoDialog(IDS_sd_file_name_longer);
                }, 600);
            } else if (MACRO_NO_ACCESS_RIGHTS == return_ret.error.code) {
                setTimeout( function() {
                    showInfoDialog(IDS_sd_no_access_rights);
                }, 600);
            } else if (LOGIN_STATE_NOMAL != login_state.response.State) {
                //$('#sd_list').remove();                
                    showInfoDialog(IDS_sd_message_sharing_folder_not_exist);
                    setTimeout(function (){
                        gotoPageWithHistory('sdcardsharing.html');
                    },2500);
            } else {
                //$('#sd_list').remove();                
                    showInfoDialog(common_failed);
                    setTimeout(function (){
                        gotoPageWithHistory('sdcardsharing.html');
                    },2500);                    
            }
        }
    }, {
        timeout:3000000
    });
}

function displayfileList(login_obj, web_share_obj) {
    if ('response' == login_obj.type) {
        if (SD_ACCESS_READ == web_share_obj.SDAccessType && LOGIN_STATE_NOMAL != login_obj.response.State) {
            $('#common_delete').hide();
            $('#button_sd_upload').hide();
            $('#sd_new_folder').hide();
        }
        if (lastPath.length > root_path.length) {
            folderlists(lastPath);

            lastPath = '';
        } else {
            var folder_path = root_path.replace(/\&/g, '&amp;');
            folderlists(folder_path);
        }
    } else {
        log.error('Load state-login failed');
    }
}

function setDisplayContent(login_obj, web_share_obj) {
    SD_ACCESS_READ == web_share_obj.SDAccessType ?
    $('#read_only').attr('checked', 'checked') :
    $('#read_write').attr('checked', 'checked');

    if (SD_SHARE_ALL_FILE == web_share_obj.SDShareFileMode) {
        $('#share_all').attr('checked', 'checked');
        button_enable('custom_path', '0');
    } else {
        $('#share_custom').attr('checked', 'checked');
        button_enable('custom_path', LOGIN_STATE_NOMAL == login_obj.response.State ?
        '1' : '0');
    }

    if (LOGIN_STATE_NOMAL == login_obj.response.State && SD_NO_FORMATED != g_sd_card_status) {
        $('table.sharing_mode input').removeAttr('disabled');
        root_path = '/';
    } else {
        $('table.sharing_mode input').attr('disabled', 'disabled');
        root_path = web_share_obj.SDSharePath == '' ? '/' : web_share_obj.SDSharePath;
    }

    $('#file_path').html('<pre>' + XSSResolveCannotParseChar(web_share_obj.SDSharePath) + '</pre>');
}

function setNoFormated() {
    if (SD_NO_FORMATED == g_sd_card_status) {
        $('#noformated').show();
    } else {
        $('#noformated').hide();
    }
}

function noSharing() {
    g_sd_mode_id = 'no_share_apply';
    if (LOGIN_STATE_NOMAL == login_state.response.State) {
        $('#sdcardshar2').hide();
        $('#webshare').hide();
        $('#noshare').show();
        $('#usbshare').hide();
        $('#no_share').attr('checked', 'checked');
        if (SD_NOSHARE == g_currently_sd_status) {
            $('#sdcardshar3').show();
            $('#sdcardshar3 > p').hide();
            $('.apply_button').hide();
            $('#sdcardshar1').show();
            $('.list_shared').show();
            $('.progress_bar_list').show();
            $('#sdcardshar1 h2').show();
        } else {
            $('#sdcardshar3').show();
            $('#sdcardshar3 > p').show();
            $('.apply_button').show();
            $('#sdcardshar1').hide();
        }
        $('#share_status').val(SD_NOSHARE);
    } else {
        $('#sdcardshar1').hide();
        $('#sdcardshar2').hide();
        $('#sdcardshar3').hide();
        $('#webshare').hide();
        $('#usbshare').hide();
        $('#no_share').attr('checked', 'checked');
        $('#noshare').show();
    }

    setNoFormated();
    $('p.comminute').hide();
    $('div.sdcard_sharing_apply_wrapper').hide();
    $('table.sharing_mode').hide();
    button_enable('web_share_apply', '0');
}

function webShareMode() {
    g_sd_mode_id = 'web_share_apply';
    $('#sdcardshar1').show();
    $('#sdcardshar2').hide();
    $('#sdcardshar3').hide();
    $('#web_share').attr('checked', 'checked');
    $('#webshare').show();
    $('#usbshare').hide();
    $('#noshare').hide();
    $('#share_status').val(SD_SHARE);
    if (SD_WEB_SHARE == g_currently_sd_mode) {
        $('.list_shared').show();
        $('.progress_bar_list').show();
        $('#sdcardshar1 h2').show();
        button_enable('web_share_apply', '0');
    } else {
        $('.list_shared').hide();
        $('table.sharing_mode').find('input').attr('disabled', 'disabled');
        button_enable('custom_path', '0');
        button_enable('web_share_apply', '1');
        $('.progress_bar_list').hide();
        $('#sdcardshar1 h2').hide();
    }
    setNoFormated();
    setDisplayContent(login_state, web_sharing);
    $('p.comminute').show();
    $('div.sdcard_sharing_apply_wrapper').show();
    $('table.sharing_mode').show();
}

function usbAccessmode() {
    g_sd_mode_id = 'usb_share_apply';
    $('#sdcardshar1').hide();
    $('#sdcardshar2').show();
    $('#sdcardshar3').hide();
    $('#webshare').hide();
    $('#usb_share').attr('checked', 'checked');
    $('#usbshare').show();
    $('#noshare').hide();
    $('#share_status').val(SD_SHARE);
    if (SD_USB_SHARE == g_currently_sd_mode) {

        $('#sdcardshar2 > p').hide();
        $('.apply_button').hide();
    } else {
        $('#sdcardshar2 > p').show();
        $('.apply_button').show();
    }
    setNoFormated();
}

function switchLoginTagContent(login_obj) {
    if ('response' == login_obj.type) {
        if (LOGIN_STATE_NOMAL == login_obj.response.State) {
            $('#logout_span').text(common_logout);
            $('div.sharing_mode input').removeAttr('disabled');
        } else {
            $('#logout_span').text(common_login);
            $('div.sharing_mode input').attr('disabled', 'disabled');
        }
    } else {
        log.error('Load state-login failed');
    }
}

function setShareInfo(sd_obj) {
    web_sharing.SDShareMode = sd_obj.response.sdcard.SDShareMode;
    web_sharing.SDCardShareStatus = sd_obj.response.sdcard.SDCardShareStatus;
    web_sharing.SDShareFileMode = sd_obj.response.sdcard.SDShareFileMode;
    web_sharing.SDAccessType = sd_obj.response.sdcard.SDAccessType;
    web_sharing.SDSharePath = sd_obj.response.sdcard.SDSharePath;
    return web_sharing;
}

function initSdCardStatus() {
    getAjaxData('api/sdcard/sdcard', function($xml) {
        var sd_ret = xml2object($xml);
        if (sd_ret.type == 'response') {
            g_sd_card_status = sd_ret.response.sdcard.SDCardStatus;
            sd_card_share_status = sd_ret.response.sdcard.SDCardShareStatus;
            g_sd_card_share_mode = sd_ret.response.sdcard.SDShareMode;
            var sd_card_share_mode = g_sd_card_share_mode;
            g_customer_path = sd_ret.response.sdcard.SDSharePath;
            //Set new web sharing object
            web_sharing = setShareInfo(sd_ret);

            if (SD_STATUS_DISABLE == g_sd_card_status) {
                g_currently_sd_status = g_sd_card_status;
                $('#share_status').val(sd_card_share_status);
                $('.sharing_mode').hide();
                $('#sdcardshar1').hide();
                $('#nosdcard').show();
            }
            /* else
              if(SD_NO_FORMATED == g_sd_card_status)
             {
             g_currently_sd_status = g_sd_card_status;
             $("#share_status").val(sd_card_share_status);
             $(".sharing_mode").show();
             $("div.list_shared").hide();
             $("table.sharing_mode").show();
             $("#noformated").show();
             button_enable("custom_path", "0");
             $("input[name='share_access_type']").attr("disabled","disabled");
             $("input[name='share_file_mode']").attr("disabled", "disabled");
             }*/
            else if (SD_NOSHARE == sd_card_share_status) {
                g_currently_sd_status = sd_card_share_status;
                noSharing();

                //Set page display
                if(LOGIN_STATE_NOMAL == login_state.response.State) {
                    setDisplayContent(login_state, web_sharing);
                    displayfileList(login_state, web_sharing);
                }
                button_enable('no_share_apply', '0');
            } else {
                g_currently_sd_mode = sd_card_share_mode;
                if (SD_WEB_SHARE == sd_card_share_mode) {
                    //Set share mode
                    webShareMode();

                    //Set page display
                    setDisplayContent(login_state, web_sharing);
                    displayfileList(login_state, web_sharing);
                    button_enable('web_share_apply', '0');
                } else if (SD_USB_SHARE == sd_card_share_mode) {
                    //Set share mode
                    usbAccessmode();
                    button_enable('usb_share_apply', '0');
                } else {
                    showInfoDialog(common_error);
                    $('#share_status').val(sd_card_share_status);
                }
            }
        } else {
            showInfoDialog(common_error);
        }

        //Switch login state
        switchLoginTagContent(login_state);

        //Display full page content after process done
        $('#process_control').show();
    }, {
        sync: true
    });
}

function initSdCardCapacity() {
    getAjaxData('api/sdcard/sdcapacity', function($xml) {
        var cap_ret = xml2object($xml);
        if ('response' == cap_ret.type) {
            var availableSize = parseInt(cap_ret.response.sdcapacity.AvailableSize, 10);
            totalSize = parseInt(cap_ret.response.sdcapacity.TotalSize, 10);

            var persent = availableSize / totalSize;
            var per_width = parseInt($('.progress_bar').width(), 10);
            var img_persent = per_width * (1 - persent);
            $('#used_space').css({
                'width': img_persent
            });
            var available2MB = availableSize / (1024 * 1024);
            if (1024 < available2MB) {
                available2MB = formatFloat(available2MB / 1024, 2);
                $('#availablesize').html(available2MB + ' GB');
            } else {
                $('#availablesize').html(formatFloat(available2MB, 2) + ' MB');
            }

            var totalsize2MB = totalSize / (1024 * 1024);
            if (1024 < totalsize2MB) {
                totalsize2MB = formatFloat(totalsize2MB / 1024, 2);
                $('#totalsize').html(totalsize2MB + ' GB');
            } else {
                $('#totalsize').html(formatFloat(totalsize2MB, 2) + ' MB');
            }

            if (0==totalSize && '1' != g_sd_card_share_mode) {
                $('#sdcardshar1').hide();
                $("#noformated").show();
            }
        }
    });
}

function getShareInfo() {
    web_sharing.SDShareMode = $('input[name=share_status]:checked').val();
    web_sharing.SDCardShareStatus = $('#share_status').val();
    web_sharing.SDShareFileMode = $('input[name=share_file_mode]:checked').val();
    web_sharing.SDAccessType = $('input[name=share_access_type]:checked').val();
    web_sharing.SDSharePath = ($('#file_path').children().html() == '' || null == $('#file_path').children().html() ? '/' : $('#file_path').children().html());
    return web_sharing;
}

function saveShareInfo() {
    var upload_obj = getShareInfo();
    var upload_xml = object2xml('request', upload_obj);
    saveAjaxData('api/sdcard/sdcard', upload_xml, function($xml) {
        var return_ret = xml2object($xml);
        if ('response' == return_ret.type && 'OK' == return_ret.response) {
            showInfoDialog(common_success);
            setTimeout( function() {
                gotoPageWithHistory('sdcardsharing.html');
            }, 2500);
        } else if(MACRO_FILE_SYSTEM_BUSY == return_ret.error.code) {
            showInfoDialog(IDS_sd_message_system_busy);
            setTimeout( function() {
                gotoPageWithHistory('sdcardsharing.html');
            }, 2500);
        } else if( MACRO_FILE_ROUTE_NOT_EXIST == return_ret.error.code) {
            showInfoDialog(IDS_sd_message_sharing_folder_not_exist_2);
            setTimeout( function() {
                gotoPageWithHistory('sdcardsharing.html');
            }, 2500);
        } else {
            showInfoDialog(common_failed);
            setTimeout( function() {
                gotoPageWithHistory('sdcardsharing.html');
            }, 2500);
        }
    });
}

//Get currently path
function shareAllFile() {
    getAjaxData('api/sdcard/getpath', function($xml) {
        var getpath_ret = xml2object($xml);
        if ('response' == getpath_ret.type) {
            folderlists(getpath_ret.response.path.rempath);
        }
    });
}

function createNewFolder(obj) {
    var new_folder_xml = object2xml('request', obj);
    saveAjaxData('api/sdcard/createdir', new_folder_xml, function($xml) {
        var return_ret = xml2object($xml);
        if ('response' == return_ret.type && 'OK' == return_ret.response) {
            initSdCardCapacity();
            showInfoDialog(common_success);
            folderlists(obj.CurrentPath);
        } else if ('114002' == return_ret.error.code) {
            showInfoDialog(IDS_sd_message_file_existed);
        } else if (MACRO_FILE_NAME_LONGERR == return_ret.error.code) {
            showInfoDialog(IDS_sd_file_name_longer);
        } else if (MACRO_NO_ACCESS_RIGHTS == return_ret.error.code) {
            showInfoDialog(IDS_sd_no_access_rights);
            setTimeout(function (){
                gotoPageWithHistory('sdcardsharing.html');
            },2500);
        } else {
            showInfoDialog(common_failed);
            log.error('Create new folder failed');
        }
    });
}

function deleteFileList(obj) {
    if (LOGIN_STATE_NOMAL == login_state.response.State) {
        cancelLogoutTimer();
    }
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    setTimeout( function() {
        var delete_xml = object2xml('request', obj);
        saveAjaxData('api/sdcard/deletefile', delete_xml, function($xml) {
            var return_ret = xml2object($xml);
            if (LOGIN_STATE_NOMAL == login_state.response.State) {
                startLogoutTimer();
            }
            closeWaitingDialog();
            if ('response' == return_ret.type && 'OK' == return_ret.response) {
                initSdCardCapacity();
                showInfoDialog(common_success);
                folderlists(obj.CurrentPath);
                button_enable('common_delete', '0');
            } else if (MACRO_NO_ACCESS_RIGHTS == return_ret.error.code) {
                showInfoDialog(IDS_sd_no_access_rights);
				setTimeout(function (){
				    gotoPageWithHistory('sdcardsharing.html');
				},2500);
            } else if(MACRO_FILE_SYSTEM_BUSY == return_ret.error.code) {
                showInfoDialog(IDS_sd_message_system_busy);
				setTimeout(function (){
				    gotoPageWithHistory('sdcardsharing.html');
				},2500);
            } else {
                showInfoDialog(common_failed);
				setTimeout(function (){
				    gotoPageWithHistory('sdcardsharing.html');
				},2500);
                log.error('Delete file failed');
            }
        }, {
            timeout: 1800000
        });
    }, 1000);
}

//Coustmer setting
function displayCustomerTree(parent_id , root_path) {
    var current_path = root_path;
    var filter_path = '';
    var newList = '<ul>';

    if ('/' == current_path) {
        filter_path = '/';
    } else {
        filter_path = '/' + current_path.replace(/\*/g, '/');
    }
    folder_path.CurrentPath = filter_path;
    var send_xml = object2xml('request', folder_path);
    saveAjaxData('api/sdcard/sdfile', send_xml, function($xml) {
        var return_ret = xml2object($xml);
        if('/' == root_path) {
            $('#' + parent_id).empty();
        }
        if ('response' == return_ret.type) {
            var folder_lists = return_ret.response.FileList.File;
            if ($.isArray(folder_lists)) {
                var folder_count = 0;
                var folder_list_count = 0;
                $.each(folder_lists, function(i) {
                    if (FILE_LIST_TYPE_FOLDER == folder_lists[i].Type) {
                        folder_count++;
                    }
                });
                $.each(folder_lists, function(i) {
                    if (FILE_LIST_TYPE_FOLDER == folder_lists[i].Type) {
                        var folder_parent_id = '';
                        var folder_parent_path = '';
                        var folder_name = '';

                        if ('/' == root_path) {
                            folder_name = sd_resolveEntityReference(folder_lists[i].Name);
                            folder_parent_id = parent_id + i;
                            folder_parent_path = folder_name;
                        } else {
                            folder_name = sd_resolveEntityReference(folder_lists[i].Name);
                            folder_parent_id = parent_id + i;
                            folder_parent_path = current_path + '\*' + folder_name;

                        }
                        folder_parent_path = folder_parent_path.replace(/\'/g, '&#39;');
                        if ((folder_count - 1) > folder_list_count) {
                            newList += "<li id='" + folder_parent_id + "' class='sub_folder_li expandable'><div id='list_flag\*" + folder_parent_id + "' class='hitarea expandable-hitarea'></div><span  id='folder_" + folder_parent_path + "' class='folder_path_line'><a class='folder_name' href='javascript: void(0)' title='"+folder_name+"'><pre>"+ folder_name + "</pre></a></span></li>";
                        } else {
                            newList += "<li id='" + folder_parent_id + "' class='sub_folder_li expandable lastExpandable'><div id='list_flag\*" + folder_parent_id + "' class='hitarea expandable-hitarea lastExpandable-hitarea'></div><span id='folder_" + folder_parent_path + "' class='folder_path_line'><a class='folder_name' href='javascript: void(0)'title='"+ folder_name + "'><pre>" + folder_name + "</pre></a></span></li>";
                        }

                        folder_list_count++;
                    }
                });
                if ('<ul>' == newList) {
                    if ($('#' + parent_id).children('div').hasClass('lastExpandable-hitarea')) {
                        $('#' + parent_id).children('div').removeClass('hitarea').removeClass('lastExpandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder_last');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    } else {
                        $('#' + parent_id).removeClass('expandable').removeClass('collapsable').children('div').removeClass('hitarea').removeClass('expandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    }
                } else {
                    $('#' + parent_id).append(newList);
                }
            } else if (typeof(folder_lists) != 'undefined') {
                if (FILE_LIST_TYPE_FOLDER == folder_lists.Type) {
                    var folder_parent_id = '';
                    var folder_parent_path = '';
                    var folder_name = '';

                    if ('/' == root_path) {
                        folder_name = sd_resolveEntityReference(folder_lists.Name);
                        folder_parent_id = parent_id + '0';
                        folder_parent_path = folder_name;
                    } else {
                        folder_name = sd_resolveEntityReference(folder_lists.Name);
                        folder_parent_id = parent_id + '0';
                        folder_parent_path = current_path + '\*' + folder_name;
                    }
                    folder_parent_path = folder_parent_path.replace(/\'/g, '&#39;');
                    newList += "<li id='" + folder_parent_id + "' class='sub_folder_li expandable lastExpandable'><div id='list_flag\*" + folder_parent_id + "' class='hitarea expandable-hitarea lastExpandable-hitarea'></div><span id='folder_" + folder_parent_path + "' class='folder_path_line'><a class='folder_name' href='javascript: void(0)'title="+folder_name+"><pre>" + folder_name + '</pre></a></span></li>';
                    $('#' + parent_id).append(newList);
                } else {
                    if ($('#' + parent_id).children('div').hasClass('lastExpandable-hitarea')) {
                        $('#' + parent_id).children('div').removeClass('hitarea').removeClass('lastExpandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder_last');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    } else {
                        $('#' + parent_id).removeClass('expandable').removeClass('collapsable').children('div').removeClass('hitarea').removeClass('expandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    }
                }
            } else {
                if ($('#' + parent_id).children('div').hasClass('lastExpandable-hitarea')) {
                    $('#' + parent_id).children('div').removeClass().addClass('noSubFolder_last');
                    $('#' + parent_id).children('span.folder_path_line').css({
                        'background': 'none'
                    });
                } else {
                    $('#' + parent_id).removeClass('expandable').removeClass('collapsable').children('div').removeClass().addClass('noSubFolder');
                    $('#' + parent_id).children('span.folder_path_line').css({
                        'background': 'none'
                    });
                }
            }
        }
    }, {
        timeout:3000000
    });
}

function createSubFolderTree(obj_id) {
    if ($('#' + obj_id).hasClass('lastExpandable')) {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).addClass('lastCollapsable');
        $('#' + obj_id).removeClass('lastExpandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).addClass('loaded_sublist');
    } else {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).addClass('loaded_sublist');
    }
}

function showSubFolderTree(obj_id) {
    if ($('#' + obj_id).hasClass('lastExpandable')) {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).addClass('lastCollapsable');
        $('#' + obj_id).removeClass('lastExpandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'block'
        });
    } else {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'block'
        });
    }
}

function hideSubFolderTree(obj_id) {
    if ($('#' + obj_id).hasClass('lastCollapsable')) {
        $('#' + obj_id).addClass('expandable');
        $('#' + obj_id).removeClass('collapsable');
        $('#' + obj_id).addClass('lastExpandable');
        $('#' + obj_id).removeClass('lastCollapsable');
        $('#' + obj_id).children('div').addClass('expandable-hitarea');
        $('#' + obj_id).children('div').removeClass('collapsable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'none'
        });
    } else {
        $('#' + obj_id).addClass('expandable');
        $('#' + obj_id).removeClass('collapsable');
        $('#' + obj_id).children('div').addClass('expandable-hitarea');
        $('#' + obj_id).children('div').removeClass('collapsable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'none'
        });
    }
}

function fileFieldChange() {
    if ($('#fileField2').val().length > 0) {
        button_enable('pop_Upload', 1);
    } else {
        button_enable('pop_Upload', 0);
    }
}

function callUploadDialog(dialogTitle, content, button1_text, button1_id, button2_text, button2_id) {
    $('#div_wrapper').remove();
    $('.dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'></div>";
    }

    dialogHtml += "<div class='dialog' id='upload_dialog'>";
    dialogHtml += "    <div class='upload_dialog_content'>";
    dialogHtml += "        <div class='upload_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + dialogTitle + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='close' class='dialog_close_btn clr_gray'><canvas id='callUploadCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='upload_dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='upload_dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";

    dialogHtml += "              <span class='button_wrapper " + button1_id + "'>";
    dialogHtml += "                  <input id='" + button1_id + "' class='button_dialog' type='button' value='"+button1_text+"'/></span>";

    if (button2_text != '' && button2_text != ' ' && button2_text != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper " + button2_id + "'>";
        dialogHtml += "                  <input id='" + button2_id + "' class='button_dialog' class='button_dialog' type='button' value='"+ button2_text +"'/></span>";
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("callUploadCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".upload_dialog_header").css({
            "width":"609px",
            "height":"29px"
        });
        $(".upload_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".dialog_close_btn").css("top","7px");
        var ahtml="<img src='../res/dialog_close_btn.png' title='' alt='' />";
        $(".upload_dialog_header a").append(ahtml);
    } else {
        var canvas = document.getElementById("callUploadCanvas");
        draw(canvas);
    }
    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push(button1_id);

    disableTabKey();
}

function resolveXMLEntityReference(xmlStr) {
    return xmlStr.replace(/(\&|\')/g, function($0, $1) {
        return {
            '&' : '&amp;' ,
            "'" : '&#39;'
        }[$1];
    }
    );
}

function setPcHostInfo() {
    // get Time
    var now = new Date();
    var str_year = now.getFullYear();
    var str_month = now.getMonth() + 1;
    if (str_month < 10) {
        str_month = '0' + str_month;
    }
    var str_day = now.getDate();
    if (str_day < 10) {
        str_day = '0' + str_day;
    }
    var str_hour = now.getHours();
    if (str_hour < 10) {
        str_hour = '0' + str_hour;
    }
    var str_min = now.getMinutes();
    if (str_min < 10) {
        str_min = '0' + str_min;
    }
    var str_sec = now.getSeconds();
    if (str_sec < 10) {
        str_sec = '0' + str_sec;
    }
    var str_time = str_year.toString() + str_month.toString() + str_day.toString() + str_hour.toString() + str_min.toString() + str_sec.toString();

    // get Platform
    var host_info = {
        Time: str_time,
        Platform: navigator.platform,
        PlatformVer: navigator.userAgent,
        Navigator: navigator.appVersion,
        NavigatorVer: navigator.userAgent
    };
    var str_xml = object2xml('request', host_info);
    saveAjaxData('api/host/info', str_xml);
}

$(document).ready( function() {
    $('#process_control').hide();
    button_enable('common_delete', '0');
    button_enable('sd_label_up', '0');
    if(null != login_state){
        if (LOGIN_STATE_NOMAL == login_state.response.State){
            $('#login_prompt').hide();
        }
    }
    setPcHostInfo();
    //Get setting status
    initSdCardStatus();
    //Get capacity
    initSdCardCapacity();

    //Effect
    //Choose no share effect

    var initSdCardWeb = $('#web_share').get(0).checked;
    var initSdCardUsb = $('#usb_share').get(0).checked;
    var initSdCardNo = $('#no_share').get(0).checked;

    $('#no_share').click( function() {
        if(initSdCardNo && 0==totalSize) {
            $('#sdcardshar1').hide();
            $('#sdcardshar2').hide();
            $('#webshare').hide();
            $('#usbshare').hide();
            $('#noshare').show();
            $("#noformated").show();
        } else {
            noSharing();
        }
    });
    //Choose Web share effect
    $('#web_share').click( function() {
        if(initSdCardWeb && 0==totalSize) {
            $('#sdcardshar2').hide();
            $('#sdcardshar3').hide();
            $('#webshare').show();
            $('#usbshare').hide();
            $('#noshare').hide();
            $("#noformated").show();
        } else {
            webShareMode();
        }

    });
    //Choose USB share effect
    $('#usb_share').click( function() {
        usbAccessmode();
    });
    //Choose share all radio button effect
    $('#share_all').click( function() {
        button_enable('custom_path', '0');
        button_enable('web_share_apply', '1');
        $('#file_path').css({
            color: '999999'
        }).html('/');
    });
    //Save USB share setting
    $('#usb_share_apply').click( function() {
        if (!isButtonEnable('usb_share_apply')) {
            return;
        }
        button_enable('usb_share_apply', '0');
        
        saveShareInfo();
		
        //showConfirmDialog_sdcard(IDS_sd_sitch_share,saveShareInfo,function(){
		    //gotoPageWithHistory('sdcardsharing.html');
		//});
        
    });
    //Save without share setting
    $('#no_share_apply').click( function() {
        if (!isButtonEnable('no_share_apply')) {
            return;
        }
        button_enable('no_share_apply', '0');
        if(g_sd_card_share_mode == 1) {
            showConfirmDialog_sdcard(IDS_sd_sitch_share,saveShareInfo,function(){
                gotoPageWithHistory('sdcardsharing.html');
            });
        } else {
            saveShareInfo();
        }
    });
    //Save web share setting
    $('#web_share_apply').click( function() {
        if (!isButtonEnable('web_share_apply')) {
            return;
        }
        button_enable('web_share_apply', '0');
		//if(g_sd_card_share_mode == 1 || sd_card_share_status == 0){
        if(g_sd_card_share_mode == 1){
		    showConfirmDialog_sdcard(IDS_sd_sitch_share,saveShareInfo,function(){
		        gotoPageWithHistory('sdcardsharing.html');
		    });
		}else{
		    saveShareInfo();
		}
    });
    //Customer radio click effect
    $('#share_custom').click( function() {
        button_enable('custom_path', '1');
        button_enable('web_share_apply', '1');
        $('#file_path').css({
            color: '000000'
        });
        $('.dialog_close_btn').die('click');
        call_dialog(sd_hint_select_a_folder, chooseContent, common_ok, 'path_dialog_ok', common_cancel, 'path_dialog_cancel');
        displayCustomerTree('file_tree_div', '/');
        button_enable('path_dialog_ok', '0');
    });
    //Customer folder button click effect
    $('#custom_path').click( function() {
        if (!isButtonEnable('custom_path')) {
            return;
        }
        $('.dialog_close_btn').die('click');
        call_dialog(sd_hint_select_a_folder, chooseContent, common_ok, 'path_dialog_ok', common_cancel, 'path_dialog_cancel');
        displayCustomerTree('file_tree_div', '/');
        button_enable('path_dialog_ok', '0');
        button_enable('web_share_apply', '1');
    });
    //Access radio radio click effect
    $('#read_write, #read_only').click( function() {
        if ($(this).attr('checked')) {
            button_enable('web_share_apply', '1');
        } else {
            button_enable('web_share_apply', '0');
        }
    });
    //Folder of folder tree clicked
    $('.sub_folder_li').live('click', function() {
        button_enable('path_dialog_ok', '1');
    });
    //Folder tree list click
    $('div.hitarea').live('click', function() {
        //var list_id_filter = "";
        var list_id = $(this).closest('li').attr('id');
        //var list_id_arr = list_id.split("");

        var list_path = $(this).next().attr('id');
        list_path = list_path.substring(list_path.indexOf('_') + 1);
        list_path = list_path.replace(/\&/g, '&amp;');
        //list_id = list_id_filter;

        if ($('#' + list_id).hasClass('expandable') && !$('#' + list_id).hasClass('loaded_sublist')) {
            displayCustomerTree(list_id, list_path);
            createSubFolderTree(list_id);
            if ($('#' + list_id).children('div').hasClass('noSubFolder')) {
                $('#' + list_id).children('span.folder_path_line').css({
                    'background': 'none'
                });
            } else {
                if(('ar_sa' == $('#lang').val()) || ('he_il' == $('#lang').val()) || ('fa_fa' == $('#lang').val())) {
                    $('#' + list_id).children('span.folder_path_line').css({
                        'background': 'url(../res/treeview-default-line-a.gif) right 0 repeat-y'
                    });
                } else {
                    $('#' + list_id).children('span.folder_path_line').css({
                        'background': 'url(../res/treeview-default-line.gif) 0 0 repeat-y'
                    });
                }
            }
        } else if ($('#' + list_id).hasClass('expandable') && $('#' + list_id).hasClass('loaded_sublist')) {
            showSubFolderTree(list_id);
            if(('ar_sa' == $('#lang').val()) || ('he_il' == $('#lang').val()) || ('fa_fa' == $('#lang').val())) {
                $('#' + list_id).children('span.folder_path_line').css({
                    'background': 'url(../res/treeview-default-line-a.gif) right 0 repeat-y'
                });
            } else {
                $('#' + list_id).children('span.folder_path_line').css({
                    'background': 'url(../res/treeview-default-line.gif) 0 0 repeat-y'
                });
            }
        } else {
            hideSubFolderTree(list_id);
            $('#' + list_id).children('span.folder_path_line').css({
                'background': 'none'
            });
        }
    });
    //Mouseover folder tree
    $('a.folder_name').live('mouseover', function() {
        $(this).addClass('folder_hover');
    });
    $('a.folder_name').live('mouseout', function() {
        $(this).removeClass('folder_hover');
    });
    //Mouse click folder tree
    $('a.folder_name').live('click', function() {
        if ($(this).hasClass('focusfolder') == false) {
            $('a.focusfolder').removeClass('focusfolder');
            $(this).addClass('focusfolder');
        }
    });
    //Confirm folder which is customer folder path
    $('#path_dialog_ok').live('click', function() {
        if (!isButtonEnable('path_dialog_ok')) {
            return;
        }
        var folder_path = $('a.focusfolder').closest('span').attr('id');
        if (typeof(folder_path) != 'undefined') {
            folder_path = folder_path.substring(folder_path.indexOf('_') + 1);
            folder_path = folder_path.replace(/\*/g, '/');
            folder_path = '/' + folder_path;
            $('.dialog, .info_dialog').fadeOut( function() {
                if ($('.info_dialog').size() == 0) {
                    $('#div_wrapper').hide();
                }
            });
            $('#file_path').html('<pre>' + XSSResolveCannotParseChar(folder_path) + '</pre>');
            $('#wait_table').remove();
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
        } else {
            $('.dialog, .info_dialog').fadeOut( function() {
                if ($('.info_dialog').size() == 0) {
                    $('#div_wrapper').hide();
                }
            });
        }
    });
    //Close folder tree popup
    $('#path_dialog_cancel').live('click', function() {
        $('.dialog, .info_dialog').fadeOut( function() {
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
        });
    });
    //Upload file
    $('#button_sd_upload').click( function() {
        if (!isButtonEnable('button_sd_upload')) {
            return;
        }
        $('#sd_upload').fadeIn();
        $('.dialog_close_btn').die('click');
        callUploadDialog(sd_label_upload_file, dialogContent);
        var buttonHtml = create_button_html(sd_label_upload, 'pop_Upload') + '&nbsp;&nbsp;&nbsp;&nbsp;' +
        create_button_html(common_cancel, 'pop_cancel', 'pop_cancel');
        $('.dialog_table_r').html(buttonHtml);
        ieRadiusBorder();
        $('#div_wrapper').css({
            height: $(document).height()
        });
        button_enable('pop_Upload', 0);
    });
    //Create an new folder
    $('#sd_new_folder').click( function() {
        if (!isButtonEnable('sd_new_folder')) {
            return;
        }
        $('#div_wrapper').css({
            height: $(window).height()
        }).show();
        //Load popup window
        $('.dialog_close_btn').die('click');
        call_dialog(sd_label_new_folder, NewFolder, common_ok, 'pop_OK', common_cancel, 'pop_cancel');
        $('#div_wrapper').css({
            height: $(document).height()
        });
        $('#textfield').focus();
    });
    //Popup cancel effect
    $('#pop_cancel, .dialog_close_btn').live('click', function() {
        $('.dialog, .info_dialog').fadeOut( function() {
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
        });
    });
    //Mouse over and mouse out on folder
    $('.sd_img_file').live('mouseover', function() {
        $(this).children().addClass('menu_hover');
    });
    $('.sd_img_file').live('mouseout', function() {
        $(this).children().removeClass('menu_hover');
    });
    //Mouse over and mouse out on file
    $('.sd_img').live('mouseover', function() {
        $(this).children().addClass('menu_hover');
    });
    $('.sd_img').live('mouseout', function() {
        $(this).children().removeClass('menu_hover');
    });
    //Click on folder
    $('.sd_img_file').live('click', function() {
        var current_path = $(this).children().children().html();
        var parent_path = $('.micro_sd').children().html();
        if ('' == parent_path || '/' == parent_path) {
            current_path = parent_path + current_path;
        } else {
            current_path = parent_path + '/' + current_path;
        }
        showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
        button_enable('common_delete', '0');
        folderlists(current_path);
    });
    //Click up level button
    $('#sd_label_up').click( function() {
        if (!isButtonEnable('sd_label_up')) {
            return;
        }
        var uplevel_file_name = $('.micro_sd').children().html();
        uplevel_file_name = uplevel_file_name.substring(0, uplevel_file_name.lastIndexOf('/'));
        uplevel_file_name = ('' == uplevel_file_name) ? '/' : uplevel_file_name;
        showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
        button_enable('common_delete', '0');
        folderlists(uplevel_file_name);
    });
    //Checkbox for check all files list
    $('#sd_list :checkbox').live('click', function() {
        var $allCheckBox = $("#sd_list :checkbox");
        var checkedCount ,allChecked;
        if(this == $allCheckBox[0]) {
            $allCheckBox.attr("checked",this.checked);
        } else {
            checkedCount = $allCheckBox.filter(":not(:first)").filter(":checked").length;
            allChecked = checkedCount+1 == $allCheckBox.length;
            $allCheckBox[0].checked = allChecked;
        }
        checkedCount = $allCheckBox.filter(":not(:first)").filter(":checked").length;
        button_enable("common_delete",checkedCount>0);
    });
    //Check box for single file check
    $('input[type=checkbox]:not(#checkbox)').live('click', function() {

        var ischeck = false;
        var check_obj = $('input[type=checkbox]');
        $.each(check_obj, function(i) {
            if (check_obj.eq(i).attr('checked')) {
                ischeck = true;
            } else {
                $('#checkbox').attr('checked', false);
            }
        });
        if (ischeck) {
            button_enable('common_delete', '1');
        } else {
            button_enable('common_delete', '0');
        }
    });
    //Delete button
    $('#common_delete').click( function() {
        if (!isButtonEnable('common_delete')) {
            return;
        }
        var checkbox_checked = $('input[type=checkbox]:checked');
        var checkbox_value = '';
        var sharePath = $('#file_path').children().html();
        var delete_path = $('.micro_sd').children().html();
        var temp_path = '';
        var delete_obj = {
            CurrentPath: '',
            DeleteFileList: ''
        };

        $.each(checkbox_checked, function(i) {
            if ('on' != checkbox_checked.eq(i).val()) {
                if (0 != i && '' != checkbox_value) {
                    checkbox_value += ':';
                }
                checkbox_value += checkbox_checked.eq(i).val();
                temp_path = ('/' == delete_path) ? delete_path + checkbox_checked.eq(i).val() : delete_path + '/' + checkbox_checked.eq(i).val();
                if (sharePath.indexOf(temp_path) == 0) {
                    $('#file_path').children().html(XSSResolveCannotParseChar(g_customer_path));
                    button_enable('web_share_apply', 0);
                }
            }
        });
        delete_obj.CurrentPath = delete_path;
        delete_obj.DeleteFileList = resolveXMLEntityReference(checkbox_value);
        deleteFileList(delete_obj);
    });
    //Create an new folder in popup
    $('#pop_OK').live('click', function() {
        clearAllErrorLabel();
        var isfilename = /[\/\\\?\|\<\>\:\*\"]+/;
        var new_folder = $.trim($('#textfield').val());
        var full_path = $(".micro_sd pre").html()+"/"+new_folder;
        var full_path_length = full_path.replace(/\//g,"").length;
        if (isfilename.exec(new_folder)) {
            showErrorUnderTr("sd_new_folder_tr", IDS_common_file_name_illegal_chars);
            g_main_displayingPromptStack.push('pop_OK');
            $('#textfield').val('');
        } else if("." == new_folder || 0 == new_folder.indexOf(".")) {
            showErrorUnderTr("sd_new_folder_tr", IDS_sd_file_name_error);
            g_main_displayingPromptStack.push('pop_OK');
            $("#textfield").val("");
        } else if(new_folder.length == 0) {
            showErrorUnderTr("sd_new_folder_tr", IDS_sd_file_name_empty);
            g_main_displayingPromptStack.push('pop_OK');
        } else if(255 < full_path_length) {
            showErrorUnderTr("sd_new_folder_tr", IDS_sd_file_name_limit);
            g_main_displayingPromptStack.push('pop_OK');
        } else {
            var create_path = $('.micro_sd').children().html();
            var currentTime = new Date();
            create_path = create_path == '' ? '/' : create_path;
            new_folder = resolveXMLEntityReference(new_folder);
            var create_folder = {
                CurrentPath: create_path,
                FileName: new_folder,
                Time: {
                    Year: currentTime.getFullYear(),
                    Month: currentTime.getMonth() + 1,
                    Day: currentTime.getDate(),
                    Hour: currentTime.getHours(),
                    Min: currentTime.getMinutes(),
                    Sec: currentTime.getSeconds()
                }
            };
            clearDialog();
            createNewFolder(create_folder);
        }
    });
    //Upload button effect
    $('#pop_Upload').live('click', function() {
        if (!isButtonEnable('pop_Upload')) {
            return;
        }
        var upload_file_name = $('#fileField2').val();
        if ('' == upload_file_name || ' ' == upload_file_name || null == upload_file_name) {
            return;
        } else {
            uploadfile();
        }
    });
    $('.downloadBtn').live('click', function() {
        var myability = 1;
        getAjaxData('api/sdcard/download-capability', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                myability = ret.response.capability;
            }
            if (myability == 0) {                
                $('.downloadBtn').attr('href', 'javascript:void(0);');               
                showInfoDialog(IDS_Prompt_max_download, false, refresh);
            } 
        }, {
            sync: true
        });
    });
});
function setInputValue() {
    var isOpera = (navigator.userAgent.indexOf('Opera') >= 0);
    if(isOpera) {
        document.getElementById("sd_file_input").focus();
        document.getElementById("sd_file_input").value=document.getElementById("uploadfile").value;
    }
}
function showConfirmDialog_sdcard(content, okFunc, cancelFunc, removeable,removeFunc) {
    content = display_SIMtoUIM(content);
    if (DIALOG_UNREMOVE != removeable) {
        $('#div_wrapper').remove();
        $('.dialog').remove();
    }

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog'>";
    dialogHtml += "    <div class='dialog_content'>";
    dialogHtml += "        <div class='dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + common_confirm + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='dialog_close_btn clr_gray'><canvas id='confirmCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";
    dialogHtml += "              <span class='button_wrapper pop_confirm'>";
    dialogHtml += "                  <input id='pop_confirm' class='button_dialog' type='button' value='"+common_yes+"'/></span>";
    if (cancelFunc != '' && cancelFunc != ' ' && cancelFunc != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
        dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='"+common_no+"'/></span>";
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('#pop_confirm').live('click', function() {
        clearDialog();

        if (typeof (okFunc) == 'function') {
            okFunc();
        }
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
        hiddenSelect(false);
        return false;
    });
    $('#pop_Cancel').live('click', function() {
        if (typeof (cancelFunc) == 'function') {
            cancelFunc();
        }
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
        hiddenSelect(false);
        return false;
    });
    $(".dialog_close_btn").live("click", function() {
        if (typeof (removeFunc) == 'function') {
            removeFunc();
        }
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
    });
    if("home" == current_href){
        $('.body_bg_home').before(dialogHtml);
    }
    else{
        $('.body_bg').before(dialogHtml);
    }
    if($.browser.msie && (parseInt($.browser.version,10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("confirmCanvas");
        draw(canvas);
    } else if($.browser.msie && (parseInt($.browser.version,10) < 9)) {
        $(".dialog_header_left").css("margin-top","5");
        $(".dialog_header").css({
            "width":"500px",
            "height":"29px"
        });
        $(".dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#75ACD6');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top","2px");
        $(".dialog_header a").css("top","7px");
        $(".button_wrapper input").css("padding-top","2px");
        var ahtml="<img src='../res/dialog_close_btn.png' title='' alt='' />";
        $(".dialog_header a").append(ahtml);

    } else {
        var canvas = document.getElementById("confirmCanvas");
        draw(canvas);
    }
    hiddenSelect(true);

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push('pop_confirm');

    disableTabKey();
}
