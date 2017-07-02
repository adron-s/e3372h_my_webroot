// JavaScript Document
function showUploadStatus(upload_state) {
    var message = '';
    if (SD_FILE_UPLOAD_SUCCESS == upload_state) {
        message = sd_hint_upload_file_success;
        initSdCardCapacity();
        folderlists(folder_path.CurrentPath);
        showInfoDialog(message);
        return;
    }
    else if (SD_FILE_UPLOAD_FAIL == upload_state) {
        message = sd_hint_upload_file_failed;
    }
    else if (SD_FILE_UPLOAD_FAIL_NOSPACE == upload_state) {
        message = sd_hint_not_enough_space_available;
    }
    else if (SD_FILE_UPLOAD_FAIL_NOSD == upload_state) {
        message = sd_label_no_sd_card;
    }
    else if (SD_FILE_UPLOAD_FAIL_2GB == upload_state) {
        message = sd_hint_file_size_over_2gb;
    }
    else if (SD_FILE_UPLOAD_FAILED_WRONG_FILENAME == upload_state) {
        message = sd_hint_wrong_file_name;
    }
    else if (SD_FILE_UPLOAD_FAILED_SD_REMOVED == upload_state) {
        message = sd_hint_sd_card_removed;
    }
    else if (SD_FILE_UPLOAD_FAILED_NAME_LONGER == upload_state) {
        message = IDS_sd_file_name_longer;
    }
    else if (SD_FILE_UPLOAD_FAILED_ACCESS_RIGHTS == upload_state) {
        message = IDS_sd_no_access_rights;
    }
    else {
        message = sd_hint_upload_file_failed;
    }

    initSdCardCapacity();
    showInfoDialog(message);
	setTimeout(function (){
	    gotoPageWithHistory('sdcardsharing.html');
	},2500);
}

function showUploadProgressDialog(UploadProgress,repaint_flag)
{
    var dialogHtml = '';
    if(repaint_flag){
        $('#div_wrapper').remove();
        if ($('#div_wrapper').size() < 1) {
            dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
        }
        dialogHtml += "<div class='dialog'>";
        dialogHtml += "    <div class='dialog_content'>";
        dialogHtml += "        <div class='dialog_header'>";
        dialogHtml += "            <span class='dialog_header_left clr_white'>" + sd_label_upload + '</span>';
        dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='dialog_close_btn clr_gray'><canvas id='sdUploadFileCanvas' width='25px' height='25px'></canvas></a></span>";
        dialogHtml += "        </div>";
        dialogHtml += "        <div class='dialog_table'>" ;
        dialogHtml += "            <table cellspacing='0' cellpadding='0' class='get_table' width='400'>" ;  
        dialogHtml += "                <tr>";
        dialogHtml += "                    <td><span id='uploadInfo'></span></td>";
        dialogHtml += "                </tr>";
        dialogHtml += "                <tr>";
        dialogHtml += "                    <td>";
        dialogHtml += "                        <div class='graph'>";
        dialogHtml += "                            <div class='persent_download'><img src='../res/persent_download.jpg' class='press'/></div>";
        dialogHtml += "                        </div>";
        dialogHtml += "                    </td>";
        dialogHtml += "                </tr>";
        dialogHtml += "                <tr>";
        dialogHtml += "                    <td><span id='downloadProcess'></span></td>";
        dialogHtml += "                </tr>";
        dialogHtml += "            </table>";	
        dialogHtml += "        </div>";
        dialogHtml += "        <div class='dialog_table_bottom'>";
        dialogHtml += "            <div class='dialog_table_r'>";
        dialogHtml += "                <span class='button_wrapper pop_Cancel'>";
        dialogHtml += "                    <input id='pop_Cancel' class='button_dialog' type='button' value='"+common_cancel+"'/></span>";
        dialogHtml += "            </div>";
        dialogHtml += "        </div>";
        dialogHtml += "    </div>";
        dialogHtml += "</div>";

        $('.dialog_close_btn,#pop_Cancel').live('click', function() {
            window.location.href = 'sdcardsharing.html?' + rfc3986_url_resolveSpecialChar(folder_path.CurrentPath).replace(/\//g, '%2F');
        });
        $('.body_bg').before(dialogHtml);
        if($.browser.msie && (parseInt($.browser.version,10) == 9)){
            $(".button_wrapper").css('border-radius', '3px');
            var canvas = document.getElementById("sdUploadFileCanvas");
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
            var ahtml="<img src='../res/dialog_close_btn.png' title='' alt='' />";
            $(".dialog_header a").append(ahtml);
        } else {
            var canvas = document.getElementById("sdUploadFileCanvas");
            draw(canvas);
        }
        $('#uploadInfo').html(sd_label_uploading);
        hiddenSelect(true);
        reputPosition($('.dialog'), $('#div_wrapper'));
        disableTabKey();
    }
    var current_progress = UploadProgress;
    var persent = formatFloat(parseInt(current_progress, 10) / 100, 2);
    var update_width = $('.graph').width() - 8;
    update_width = parseInt(update_width * persent, 10);
    $('.press').css({'width': update_width + 'px'});
    $('#downloadProcess').html(UploadProgress + '%');
	if(parseInt(current_progress, 10) < 100){
        button_enable('pop_Cancel', '1');
    }else{
        button_enable('pop_Cancel', '0');
	}
    setTimeout(function(){getUploadState(false); }, 2000);
}


function getUploadState(repaint_flag) {
    getAjaxData('api/sdcard/sdfilestate', function($xml) {
        var filestate_ret = xml2object($xml);
        if ('response' == filestate_ret.type) {
            var upload_state = filestate_ret.response.sduploadstatus.State;
            var upload_progress = filestate_ret.response.sduploadstatus.UploadProgress;
            if (SD_FILE_UPLOADING == upload_state) {
                showUploadProgressDialog(upload_progress,repaint_flag);
            }else {
                //window.location.replace("sdcardsharing.html?result="+upload_state);
                clearDialog();
                showUploadStatus(upload_state);
                /* if (SD_FILE_UPLOAD_SUCCESS == upload_state) {
                    folderlists(folder_path.CurrentPath);
                } */
                if (LOGIN_STATE_NOMAL == login_state.response.State) {
                    startLogoutTimer();
                }
                $('#upload_dialog').remove();
            }
        }
    },
    {
        errorCB: function()
        {
            clearDialog();
            showInfoDialog(sd_hint_upload_file_failed);
            if (LOGIN_STATE_NOMAL == login_state.response.State) {
                startLogoutTimer();
            }
            $('#upload_dialog').remove();
        }
    });
}

function doUploadFile() {
    if (LOGIN_STATE_NOMAL == login_state.response.State) {
        cancelLogoutTimer();  
    }
    if($.isArray(g_requestVerificationToken)) { 
        if(g_requestVerificationToken.length > 0) {
             $('#csrf_token').val('csrf:' + g_requestVerificationToken[0]);
        } else {
            setTimeout(function () {
                doUploadFile();
            }, 50)
            return;
        }
    }
    var current_date = new Date();
    var upload_date = {
        Year: current_date.getFullYear(),
        Month: current_date.getMonth() + 1,
        Day: current_date.getDate(),
        Hour: current_date.getHours(),
        Min: current_date.getMinutes(),
        Sec: current_date.getSeconds()
    };
    $('#wait_dialog_btn').show().bind('click', function() {
        //window.location.reload();
        window.location.href = 'sdcardsharing.html?' + rfc3986_url_resolveSpecialChar(folder_path.CurrentPath).replace(/\//g, '%2F');
    });
    
    $('#cur_path').val('<' + folder_path.CurrentPath + '>');
    $('#page').val('sdcardsharing.html');
    $('#upload_year').val(upload_date.Year);
    $('#upload_month').val(upload_date.Month);
    $('#upload_day').val(upload_date.Day);
    $('#upload_hours').val(upload_date.Hour);
    $('#upload_minutes').val(upload_date.Min);
    $('#upload_secondes').val(upload_date.Sec);
    $('#upload_file_form').submit();
    getUploadState(true);
}

function cancle_upload()
{
    getAjaxData("api/sdcard/Check_file_exist");
}

function confirm_exist(obj) {
    $('#upload_dialog').css({'z-index': '-1000'}).hide();
    folder_path.CurrentPath = $('.micro_sd').children().html();
    var upload_xml = object2xml('request', obj);
    saveAjaxData('api/sdcard/Check_file_exist', upload_xml, function($xml) {
        var exist_state = xml2object($xml);
        if ('response' == exist_state.type) {
            if ('OK' == exist_state.response) {
                doUploadFile();
            }
            else {
                showInfoDialog(common_failed);
                return false;
            }
        }
        else if ('error' == exist_state.type && '114001' == exist_state.error.code) {
            $('.dialog_close_btn').live('click',function() {
                getAjaxData("api/sdcard/Check_file_exist");
            });
            $("#pop_confirm").die("click");
            $("#pop_Cancel").die("click");
            showConfirmDialog(sd_hint_overwrite_existed_file, doUploadFile, cancle_upload, 0);
        }
        else {
            showInfoDialog(common_failed);
            return false;
        }
    });
}

function getFileName(szFile) {
    var szFileName = '';
    var fIndex = 0;

    fIndex = szFile.lastIndexOf('\\');
    if (fIndex > 0) {
        szFileName = szFile.substr(fIndex + 1);
    }
    else {
        fIndex = szFile.lastIndexOf('/');
        if (fIndex > 0) {
            szFileName = szFile.substr(fIndex + 1);
        }
        else {
            return szFile;
        }
    }

    return szFileName;
}

function uploadfile() {
    var upload_path = $('.micro_sd').children().html();
    upload_path = upload_path == '' ? '/' : upload_path;
    var upload_file = $('#fileField2').val();
    upload_file = getFileName(upload_file);
    upload_file = resolveXMLEntityReference(upload_file);
    var upload_folder = {
        CurrentPath: upload_path,
        FileName: upload_file
    };
    getAjaxData('api/sdcard/uploadflag', function($xml) {
        var res = xml2object($xml);
        if ('response' == res.type && 0 == res.response.Uploadflag)
        {
            confirm_exist(upload_folder);
        }
        else
        {
            showInfoDialog(IDS_sd_message_uploading_file_conflict);
            return false;
        }
    });
}
