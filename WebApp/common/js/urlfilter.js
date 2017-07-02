var URL_FILTER_NUM = 16;
var ok_flag = 0;
var add_flag = 0;
var MAX_NUMBER = 63;
var filterStatusArray = [
[FILTER_DISABLED, common_off],
[FILTER_ENABLED, common_on]
];

var g_source_num = 0;
var firewall_status = null;
function addDomainNameFilter(insertNode) {
    var addLine = null;

    addLine = "<tr class=\"user_add_line\">";

    addLine += "<td  width='420'  style='word-break: break-all;'>" + arguments[1] + "</td>";
    addLine += "<td>" + arguments[2] + "</td>";
    addLine += "<td class='user_options'><span class=\"button_edit_list clr_blue\">" + common_edit + "</span><span class=\"button_delete_list clr_blue\">" + common_delete + "</span></td></tr>";

    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
}

function isVaildValue() {
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });
    var domainNameFilter = $.trim($('#input_domain_name').val());
    if('' == domainNameFilter ) {
        showQtip('input_domain_name', IDS_security_urlfilter_isnull);
        return false;

    }

    if (!isValidAscIICharset(domainNameFilter) || !isVaildDomainname(domainNameFilter)) {
        showQtip('input_domain_name', IDS_security_urlfilter_error);
        return false;
    }
    if (!isStartWithChar(domainNameFilter) ||(domainNameFilter.indexOf(".") == -1 && domainNameFilter != "") ||(domainNameFilter.indexOf(".") != -1 && domainNameFilter.length == 1) ) {
        showQtip('input_domain_name', IDS_security_ddns_domain_contain);
        return false;
    }
    if (/\.$/.exec(domainNameFilter) || /^\./.exec(domainNameFilter) || /-$/.exec(domainNameFilter)|| /^-/.exec(domainNameFilter)) {
        showQtip('input_domain_name', IDS_security_domain_dot_char);
        return false;
    }
    if(!validEditSameDomain()) {
        showQtip('input_domain_name', IDS_security_ddns_domain_diff);
        return false;
    }
    return true;
}

function validEditSameDomain() {
    var validDomain = true;
    var ddns_valid_domain = $.trim($('#input_domain_name').val());
    var domain_List = $('.user_add_line');
    var i=0;
    for (i=0;i<domain_List.length;i++) {
        if (domain_List.eq(i).children().eq(0).html() == ddns_valid_domain) {
            validDomain = false;
        }
    }
    return validDomain;
}

function isStartWithChar(str) {
    var reg = /^[a-zA-Z]/;
    var value = reg.test(str);
    return value;
}

function isVaildDomainname(val) {
    if (val == '') {
        return false;
    }
    for (j = 0; j < val.length; j++) {
        var c = val.charAt(j);
        if (c >= 'a' && c <= 'z') {
            continue;
        } else if (c >= 'A' && c <= 'Z') {
            continue;
        } else if (c >= '0' && c <= '9') {
            continue;
        } else if (c == '-' || c == '.') {
            continue;
        } else {
            return false;
        }
    }
    return true;
}

function isValidAscIICharset(str) {
    var i=0;
    for(i = 0; i < str.length; i++) {
        if(!(str.charCodeAt(i) >= 33 && str.charCodeAt(i) <= 126)) {
            return false;
        }
    }
    return true;
}

function initPage() {
    button_enable('apply', '0');

    $('.user_add_line').remove();
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            firewall_status = ret.response;
        }
    }, {
        sync: true
    });

    if (firewall_status != null && firewall_status.FirewallMainSwitch == 0) {
        button_enable('add_item', '0');
        $('#service_list').attr('disabled', true);
        showInfoDialog(IDS_security_message_firewall_disabled);
        // return false;
    }
    if (firewall_status != null &&
    firewall_status.firewallurlfilterswitch == 0) {
        button_enable('add_item', '0');
        $('#service_list').attr('disabled', true);
        showInfoDialog(IDS_security_urlfilter_disabled);
    }
    getAjaxData('api/security/url-filter', function($xml) {
        var status = '';
        var domainName = '';
        var ret = xml2object($xml);
        var filters = ret.response.urlfilters.urlfilter;
        if (filters) {
            if (filters.length >= URL_FILTER_NUM) {
                button_enable('add_item', '0');
            }
            if($.isArray(filters)) {
                $(filters).each( function(i) {
                    domainName = XSSResolveCannotParseChar(filters[i].value);
                    status = getDArrayElement(filterStatusArray, filters[i].status, 'value');
                    addDomainNameFilter($('#service_list tr'),domainName,status);
                });
            } else {
                domainName = XSSResolveCannotParseChar(filters.value);
                status = getDArrayElement(filterStatusArray, filters.status, 'value');
                addDomainNameFilter($('#service_list tr'),domainName,status);

            }
        }
    });
}

$(document).ready( function() {
    URL_FILTER_NUM = parseInt(g_config_firewall.urlfilter.number,10);
    initPage();
    openPortToCss('service_list');
    // $('.user_options').attr('width','105');
    var currentAllVal = null;
    var editIndex = null;
    var editStatus = null;
    $('.button_edit_list').live('click', function() {
        if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1
        && ((firewall_status != null && firewall_status.FirewallMainSwitch == 1) && (firewall_status != null && firewall_status.firewallurlfilterswitch == 1))) {
            editIndex = $('.button_edit_list').index(this);
            // save the value before user edit
            currentAllVal = $('.user_add_line').eq(editIndex).html();
            var editDomainNameFilter = $(this).parent().siblings();

            var editDomainName = editDomainNameFilter.eq(0);
            editStatus=editDomainNameFilter.eq(1);

            editDomainName.html('<input type="text" value="' + XSSResolveHtmlReturnChar(editDomainName.html()) + '" id="input_domain_name"  maxlength="63"></td>');
            var htmlStatus = editStatus.html();

            createSelect(editStatus, 'select_status', filterStatusArray);
            $('#select_status').val(getDArrayElement(filterStatusArray, htmlStatus, 'key'));
            $(this).parent().html('<a id="edit_item_ok" class="clr_blue" href="javascript:void(0);">' + common_ok +
            '</a><a id="edit_item_cancel" class="clr_blue" href="javascript:void(0);">' + common_cancel + '</a>');

            hideAddItemControl();
            $('.user_add_line input').eq(0).focus();

            $('#edit_item_cancel').live('click', function() {
                $('.user_add_line').eq(editIndex).html(currentAllVal);
                $('.qtip').qtip('destroy');
                if (!isButtonEnable('add_item')) {
                    button_enable('add_item', '1');
                    if((1 == ok_flag) || (1 == add_flag)) {
                        button_enable('apply', '1');
                    }
                }
                if ($('.user_add_line').length >= URL_FILTER_NUM) {
                    button_enable('add_item', '0');
                }
            });
            button_enable('apply', '0');
            button_enable('add_item', '0');
        }

    });
    $('#edit_item_ok').live('click', function() {
        if (isVaildValue()) {
            var domain_name = XSSResolveCannotParseChar($.trim($('#input_domain_name').val()));
            var statusOption = $('#select_status option:selected').text();

            hideAddItemControl();
            var editDNFilter = $(this).parent().siblings();

            editDNFilter.eq(0).html(domain_name);
            editDNFilter.eq(1).html(statusOption);

            $(this).parent().html('<span class=\"button_edit_list clr_blue\">' + common_edit +
            '</span><span class=\"button_delete_list clr_blue\">' + common_delete + '</span>');

            // currentAllVal = $('.user_add_line').eq(editIndex).html();
            button_enable('apply', '1');
            button_enable('add_item', '1');
            ok_flag = 1;
            if ($('.user_add_line').length >=  URL_FILTER_NUM) {
                button_enable('add_item', '0');
            }
        }
    });
    $('#add_item_ok').live('click', function() {
        if (isVaildValue()) {
            var domain_name = $.trim($('#input_domain_name').val());
            var statusOption = $('#select_status option:selected').text();
            hideAddItemControl();

            addDomainNameFilter($('#service_list tr'),domain_name,statusOption);

            button_enable('apply', '1');

            if ($('.user_add_line').length >= URL_FILTER_NUM) {
                button_enable('add_item', '0');
            }
            add_flag = 1;
        }
        return false;
    });
    //hide add item control
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        if((1 == add_flag) || (1 == ok_flag)) {
            button_enable('apply', '1');
        }
        return false;
    });
    //show add item control
    $('#add_item').click( function() {
        if (isButtonEnable('add_item')) {
            showAddItemControl();
            $('.add_item_control input').eq(0).focus();
            button_enable('apply', '0');
            $('#input_domain_name').removeAttr('disabled');
        }
    });
    //if there hasn't any add or delete button it won't work
    $(".button_delete_list").live("click", function() {
        if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1
        && ((firewall_status != null && firewall_status.FirewallMainSwitch == 1) && (firewall_status != null && firewall_status.firewallurlfilterswitch == 1))) {
            var deleteIndex = $(".button_delete_list").index(this);
            call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
            $("#pop_OK").click( function() {
                deleteFilter(deleteIndex, $(".user_add_line"));
                clearDialog_table();
                button_enable("apply", "1");
                button_enable("add_item", "1");
            });
        }
    });
    function postData() {
        var submitObject = {};
        var domain_urlfilter = [];
        var filter = [];
        var submitServerValue = '';
        var submitServerStatus = '';
        $('.user_add_line').each( function(i) {
            submitServerValue = $(this).children().eq(0).text();
            submitServerStatus = getDArrayElement(filterStatusArray, $(this).children().eq(1).text(), 'key');

            filter = {
                value: submitServerValue,
                status: submitServerStatus
            };
            domain_urlfilter.push(filter);
        });
        submitObject = {
            urlfilters: {
                urlfilter: domain_urlfilter
            }
        };
        var submitData = object2xml('request', submitObject);

        saveAjaxData('api/security/url-filter', submitData, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(common_success);
                button_enable('apply', '0');
            } else {
                initPage();
            }
        });
    }

    $('#apply').click( function() {
        if (isButtonEnable('apply')) {
            showConfirmDialog(firewall_hint_submit_list_item, postData);
        }
        ok_flag = 0;
        add_flag = 0;
    });
    initSelectOption('select_status', filterStatusArray);

});