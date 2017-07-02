var CBS_MAX_NUM = 100;
var arrayList = [];
var station = '';
var addList = [];

function addCbssettingslist(insertNode) {
    var addLine = null;
    var i = 1;
    addLine = "<tr class=\"user_add_line\">";
    for ( i = 1; i < arguments.length; i++ ) {
        addLine += "<td style='word-break: break-all;'>" + arguments[i] + "</td>";
    }
    addLine += "<td class='user_options clr_blue_hover'> " + "<span class=\"button_delete_list clr_blue\" style='float:none; padding:0;'>" + common_delete + "</span></td></tr>";

    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
}

function initPage() {
    var index = 0;
    button_enable('apply', '0');
    $('.user_add_line').remove();
    getAjaxData('api/sms/get-cbschannellist', function($xml) {
        var cbssettings = null;
        var cbssettings_list = [];
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            cbssettings = $.trim(ret.response.channellist);
            if((cbssettings != null) && (cbssettings != '')) {
                cbssettings_list = cbssettings.split(',');
            }
        }
        var cbssettings_index = null;
        var cbssettings_channel = null;
        if (cbssettings_list.length >= CBS_MAX_NUM) {
            button_enable('add_item', '0');
        }
        if((cbssettings != null) && (cbssettings != '')) {
            if ($.isArray(cbssettings_list)) {
                $(cbssettings_list).each( function(i) {
                    cbssettings_index = index++;
                    cbssettings_channel= cbssettings_list[i];
                    cbssettings_channel = XSSResolveCannotParseChar(cbssettings_channel);
                    addCbssettingslist(
                    $('#service_list tr'),
                    cbssettings_index,
                    cbssettings_channel
                    );
                });
            } else {
                cbssettings_index = index;
                cbssettings_channel = cbssettings_list;
                cbssettings_channel = XSSResolveCannotParseChar(cbssettings_channel);
                addCbssettingslist(
                $('#service_list tr'),
                cbssettings_index,
                cbssettings_channel
                );
            }
        }
    });
}

function postData() {
    var submitObject = {};
    var str = "";
    if(addList.length>1) {
        for(var i=0;i<addList.length-1;i++) {
            str+=addList[i]+',';
        }
        str+=addList[addList.length-1];
        arrayList.push(str);
    }
    if(addList.length == 1) {
        str+=addList[addList.length-1]+"";
        arrayList.push(str);
    }
    submitObject = {
        type: station,
        channel: arrayList
    };
    var submitData = object2xml('request', submitObject);

    saveAjaxData('api/sms/operate-cbschannel', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            button_enable('apply', '0');
        } else {
            showInfoDialog(common_failed);
        }
        arrayList = [];
        addList = [];
        initPage();
    });
}

function isValidValue() {
    var reg =/^[0-9]+$/g;
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });
    var cbssettings_channel = $.trim($('#cbssettings_channel').val());
    if (cbssettings_channel == "" || cbssettings_channel == null) {
        showQtip('cbssettings_channel', IDS_CBS_Settings_channel_not_null);
        return false;
    } else {
        if(cbssettings_channel.indexOf('-') == -1) {
            if((cbssettings_channel!='0')&&((cbssettings_channel.charAt(0))=='0')) {
                showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                return false;
            }
            if(null != cbssettings_channel.match(reg)) {
                if((parseInt(cbssettings_channel, 10)<0||parseInt(cbssettings_channel, 10)>65535)) {
                    showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                    return false;
                } else {
                    var temp = 0;
                    $('.user_add_line').each( function(i) {
                        var channel = $.trim($(this).children().eq(1).text());
                        if(channel==cbssettings_channel) {
                            showQtip('cbssettings_channel', IDS_CBS_Settings_cue_iterance);
                            temp = 1;
                            return false;
                        }
                    });
                    if(temp == 1) {
                        return false;
                    }
                }
            } else {
                showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                return false;
            }
        } else {
            var sum = 0;
            for(var i=0;i<cbssettings_channel.length;i++) {
                if((cbssettings_channel.charAt(i))=='-') {
                    sum+= 1;
                }
            }
            if((sum>1)||(cbssettings_channel.indexOf('-')== 0)||(cbssettings_channel.indexOf('-')== cbssettings_channel.length-1)) {
                showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                return false;
            } else {
                var index = cbssettings_channel.indexOf('-');
                var str1 = $.trim(cbssettings_channel.substring(0,index));
                var str2 = $.trim(cbssettings_channel.substring(index+1));
                if((str1!='0')&&(str1.charAt(0)=='0')||(str2!='0')&&(str2.charAt(0)=='0')) {
                    showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                    return false;
                }
                if((null != str1.match(reg))&&(null != str2.match(reg))) {
                    if(parseInt(str1, 10)<0||parseInt(str1, 10)>65535||parseInt(str2, 10)<0||parseInt(str2, 10)>65535) {
                        showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                        return false;
                    } else {
                        if(parseInt(str1, 10) >= parseInt(str2, 10)) {
                            showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_little);
                            return false;
                        } else {
                            var temp = 0;
                            $('.user_add_line').each( function(i) {
                                var channel = $.trim($(this).children().eq(1).text());
                                var indexChannel=channel.indexOf('-');
                                var channel1 = $.trim(channel.substring(0,indexChannel));
                                var channel2 = $.trim(channel.substring(indexChannel+1));
                                if((channel1 == str1) && (channel2 == str2)) {
                                    showQtip('cbssettings_channel', IDS_CBS_Settings_cue_iterance);
                                    temp = 1;
                                    return false;
                                }
                            });
                            if(temp == 1) {
                                return false;
                            }
                        }
                    }
                } else {
                    showQtip('cbssettings_channel', IDS_CBS_Settings_channel_cue_figure);
                    return false;
                }
            }
        }
    }
    return true;
}

function openPortToCss() {
    if(($.browser.mozilla) || ($.browser.opera)) {
        $('#service_list').css
        ({
            'table-layout':'fixed',
            'word-break':'break-all',
            'word-wrap':'break-word'
        });
    }
}

redirectOnCondition(null, "cbssettings");
var editIndex = null;
$(document).ready( function() {
    button_enable("apply", "0");
    initPage();
    var currentAllVal = null;
    $('#add_item_ok').live('click', function() {
        if (isValidValue()) {
            var cbssettings_index = $('.user_add_line').length;
            var cbssettings_channel = $.trim($('#cbssettings_channel').val());
            hideAddItemControl();
            addCbssettingslist($('#service_list tr'),cbssettings_index,cbssettings_channel);
            button_enable('apply', '1');
            if (($('.user_add_line').length >= CBS_MAX_NUM)||(addList.length>=49)) {
                button_enable('add_item', '0');
            }
            addList.push(cbssettings_channel);
            station = '0';
        }
        return false;
    });
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        return false;
    });
    $('#add_item').click( function() {
        if (isButtonEnable('add_item')) {
            $('#cbssettings_index').val($('.user_add_line').length);
            $('#cbssettings_channel').val('');
            showAddItemControl();
            $('.add_item_control input').eq(1).focus();
            button_enable('apply', '0');
            if($('.user_add_line').length>=CBS_MAX_NUM) {
                button_enable('add_item', '0');
            }
        }
    });
    //if there hasn't any add or delete button it won't work
    $(".button_delete_list").live("click", function() {
        if($(".add_item_control:hidden").size() > 0) {
            var deleteIndex = $(".button_delete_list").index(this);
            var channel = $("#service_list tr").eq(deleteIndex+1).children().eq(1).text();
            call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
            $("#pop_OK").click( function() {
                deleteFilter(deleteIndex, $(".user_add_line"));
                clearDialog_table();
                station = '1';
                arrayList.push(channel);
                postData();
                button_enable("add_item", "1");
            });
        }
    });
    $('#apply').click( function() {
        if (isButtonEnable('apply')) {
            showConfirmDialog(firewall_hint_submit_list_item, postData);
        }
    });
    openPortToCss();
});