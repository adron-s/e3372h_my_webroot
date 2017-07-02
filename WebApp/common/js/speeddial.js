var ok_flag = 0;
var add_flag = 0;
var SPEEDDIAL_MAX_NUM = 10;
function isVaildSpeeddial() {
    var flagEmpty = 0;
    var regDialNumber = /^\d{1,2}$/;
    var regRealNumber = /^[\d#*]{1,32}$/;
    var quickNumber = $.trim($('#input_speeddial_quicknumber').val());
    var destination = $.trim($('#input_speeddial_destination').val());
    var description = nbspToSpace($.trim($('#input_speeddial_description').val()));
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });
    if ('' != quickNumber) {
        if (!regDialNumber.test(quickNumber)) {
            showQtip('input_speeddial_quicknumber', IDS_VOIP_SpeedDialErrStr4);
            return false;
        } else {
            var ret = true;
            $('.user_add_line').each( function(i) {
                var number = $.trim($(this).children().eq(0).text());
                if (number == quickNumber) {
                    showQtip('input_speeddial_quicknumber', IDS_VOIP_SpeedDialErrStr8);
                    ret = false;
                    return false;
                }
            });
            if (false == ret) {
                return false;
            }
        }
    } else {
        showQtip('input_speeddial_quicknumber', IDS_VOIP_SpeedDialErrStr3);
        return false;
    }
    if ('' != destination) {
        if (!regRealNumber.test(destination)) {
            showQtip('input_speeddial_destination', IDS_VOIP_SpeedDialErrStr2);
            return false;
        }
    } else {
        showQtip('input_speeddial_destination', IDS_VOIP_SpeedDialErrStr5);
        return false;
    }
    if (false == checkInputChar(description)) {
        showQtip('input_speeddial_description', IDS_VOIP_SPEEDDIAL_DESCRIPTION);
        return false;
    }

    return true;
}

function addSpeeddiallist(insertNode) {
    var addLine = null;
    var i = 1;
    addLine = "<tr class=\"user_add_line\">";
    for ( i = 1; i < arguments.length; i++) {
        addLine += "<td style='word-break: break-all;'>" + arguments[i] + "</td>";
    }
    addLine += "<td class='user_options clr_blue_hover'> " +'<span class=\"button_edit_list clr_blue\">' + common_edit +
    '</span><span class=\"button_delete_list clr_blue\">'+ common_delete + "</span></td></tr>";

    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
}

function initPage() {
    getAjaxData('api/voice/speeddial', function($xml) {
        var ret = xml2object($xml);
        var speeddials = ret.response.speeddial;
        var lastSpeeddial;
        var index = 1;

        if (null != ret.response.speeddial) {
            var speeddial = CreateArray(ret.response.speeddial);
            var quicknumber = '';
            var destination = '';
            var description = '';
            $('.user_add_line').remove();
            $(speeddial).each( function(i) {
                quicknumber = XSSResolveCannotParseChar(speeddial[i].quicknumber);
                destination = XSSResolveCannotParseChar(speeddial[i].destination);
                description = spaceToNbsp(XSSResolveCannotParseChar(speeddial[i].description));
                addSpeeddiallist(
                $('#service_list tr'),
                quicknumber,
                destination,
                description
                );
                index++;
            });
            lastSpeeddial = speeddial[speeddial.length - 1];

            $('#input_speeddial_quicknumber').val(lastSpeeddial.quicknumber);
            $('#input_speeddial_destination').val(lastSpeeddial.destination);
            $('#input_speeddial_description').val(lastSpeeddial.description);
            if(speeddial.length >= SPEEDDIAL_MAX_NUM) {
                button_enable('add_item', '0');
            }
        } else {

            $('#input_speeddial_quicknumber').val("");
            $('#input_speeddial_destination').val("");
            $('#input_speeddial_description').val("");
        }
    });
}

function postData() {
    var submitObject = {};
    var speeddialArray = [];
    var speeddial_index = 1;
    $('.user_add_line').each( function() {
        var speeddial = {
            index : speeddial_index,
            quicknumber : XSSResolveCannotParseChar($(this).children().eq(0).text()),
            destination : XSSResolveCannotParseChar($(this).children().eq(1).text()),
            description : XSSResolveCannotParseChar(nbspToSpace($(this).children().eq(2).html()))
        };
        speeddial_index++;
        speeddialArray.push(speeddial);
    });
    submitObject = {
        speeddial : speeddialArray
    };
    var submitData = object2xml('request', submitObject);
    saveAjaxData('api/voice/speeddial', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            button_enable('apply', '0');
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    });
}

function openPortToCss() {
    if (($.browser.mozilla) || ($.browser.opera)) {
        $('#service_list').css
        ({
            'table-layout' : 'fixed',
            'word-break' : 'break-all',
            'word-wrap' : 'break-word'
        });
    }
}

$(document).ready( function() {
    button_enable("apply", "0");
    initPage();
    var currentAllVal = null;
    var index = null;
    //hide add item control
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        if ((1 == add_flag) || (1 == ok_flag)) {
            button_enable('apply', '1');
        }
    });
    $('#add_item').click( function() {
        if (isButtonEnable('add_item')) {
            $('.button_edit_list').val($('.user_add_line').length + 1);

            showAddItemControl();
            $('.add_item_control input').eq(0).focus();
            button_enable('apply', '0');
            if ($('.user_add_line').length >= SPEEDDIAL_MAX_NUM) {
                button_enable('add_item', '0');
            }
        }
    });
    $('#add_item_ok').live('click', function() {
        if (isVaildSpeeddial()) {
            var voipSpeeddialDialNumber = XSSResolveCannotParseChar($.trim($('#input_speeddial_quicknumber').val()));
            var voipSpeeddialRealNumber = XSSResolveCannotParseChar($.trim($('#input_speeddial_destination').val()));
            var voipSpeeddialNote = spaceToNbsp(XSSResolveCannotParseChar($.trim($('#input_speeddial_description').val())));
            hideAddItemControl();
            addSpeeddiallist($('#service_list tr'), voipSpeeddialDialNumber, voipSpeeddialRealNumber, voipSpeeddialNote);
            button_enable('apply', '1');
            if ($('.user_add_line').length >= SPEEDDIAL_MAX_NUM) {
                button_enable('add_item', '0');
            }
            add_flag = 1;
        }
    });
    $('#apply').click( function() {
        if (isButtonEnable('apply')) {
            showConfirmDialog(firewall_hint_submit_list_item, postData);

        }
    });
    $('.button_edit_list').live('click', function() {
        if (($(".add_item_control:hidden").size() > 0) && ($('#edit_item_ok').size() < 1)) {
            index = $('.button_edit_list').index(this);
            // save the value before user edit
            currentAllVal = $('.user_add_line').eq(index).html();
            var editSpeeddial = $(this).parent().siblings();
            var editQuickNumber = editSpeeddial.eq(0);
            var editDestination = editSpeeddial.eq(1);
            var editDescription = editSpeeddial.eq(2);
            editQuickNumber.html('<input type="text" value="' + editQuickNumber.html() + '" id="input_speeddial_quicknumber"  maxlength="2"/></td>');
            editDestination.html('<input type="text" value="' + editDestination.html() + '" id="input_speeddial_destination" maxlength="32"></td>');
            editDescription.html('<input type="text" value="' + nbspToSpace(editDescription.html()) + '" id="input_speeddial_description" maxlength="31"></td>');
            $(this).parent().html('<a class="clr_blue" id="edit_item_ok" href="javascript:void(0);">'+
            common_ok + '</a><a class="clr_blue" id="edit_item_cancel" href="javascript:void(0);">' + common_cancel + '</a>');
            hideAddItemControl();
            $('.user_add_line input').eq(0).focus();
            $('#edit_item_cancel').live('click', function() {
                $('.user_add_line').eq(index).html(currentAllVal);
                $('.qtip').qtip('destroy');
                if (!isButtonEnable('add_item')) {
                    button_enable('add_item', '1');
                    if ((1 == ok_flag) || (1 == add_flag)) {
                        button_enable('apply', '1');
                    }
                }
                if ($('.user_add_line').length >= SPEEDDIAL_MAX_NUM) {
                    button_enable('add_item', '0');
                }
            });
            button_enable('apply', '0');
            button_enable('add_item', '0');
        }
    });
    $(".button_delete_list").live("click", function() {
        if ($(".add_item_control:hidden").size() > 0) {
            var deleteIndex = $(".button_delete_list").index(this);
            call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
            $("#pop_OK").click( function() {
                deleteFilter(deleteIndex, $(".user_add_line"));
                clearDialog_table();
                postData();
                button_enable("add_item", "1");
            });
        }
    });
    $('#edit_item_ok').live('click', function() {
        if (isVaildSpeeddial()) {
            var voipSpeeddialDialNumber = XSSResolveCannotParseChar($.trim($('#input_speeddial_quicknumber').val()));
            var voipSpeeddialRealNumber = XSSResolveCannotParseChar($.trim($('#input_speeddial_destination').val()));
            var voipSpeeddialNote = spaceToNbsp(XSSResolveCannotParseChar($.trim($('#input_speeddial_description').val())));
            hideAddItemControl();
            var editSpeeddial = $(this).parent().siblings();
            editSpeeddial.eq(0).html(voipSpeeddialDialNumber);
            editSpeeddial.eq(1).html(voipSpeeddialRealNumber);
            editSpeeddial.eq(2).html(voipSpeeddialNote);
            $(this).parent().html('<span class=\"button_edit_list clr_blue\">' + common_edit +
            '</span><span class=\"button_delete_list clr_blue\">' + common_delete + '</span>');
            currentAllVal = $('.user_add_line').eq(index).html();
            button_enable('apply', '1');
            button_enable('add_item', '1');

            ok_flag = 1;
            if ($('.user_add_line').length >= SPEEDDIAL_MAX_NUM) {
                button_enable('add_item', '0');
            }
        }
    });
    openPortToCss();

});
