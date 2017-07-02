var DDNS_MAX_NUM = 8;
var ok_flag = 0;
var add_flag = 0;
var ddnsvendor = [[0,"DynDNS.org"],[1,"TZO"]];
var ddnsstatus = [[0,common_off],[1,common_on]];
var currpwdtype = null;

function addDdnslist(insertNode) {
    var addLine = null;
    var i = 1;
    addLine = "<tr class=\"user_add_line\">";
    for ( i = 1; i < arguments.length-1; i++ ) {
        addLine += "<td style='word-break: break-all;'>" + XSSResolveCannotParseChar(arguments[i]) + "</td>";
    }
    var pwdValue = XSSResolveCannotParseChar(arguments[arguments.length-1]);
    addLine += "<td style='word-break: break-all;'><input class='passtype' style='background:#f2f2f2;width:83px;' type='"+ currpwdtype + "'value='"+ pwdValue+"' autocomplete='off' disabled='disabled' maxlength='63'/></td>";
    addLine += "<td class='user_options clr_blue_hover'><span class=\"button_edit_list clr_blue\">" + common_edit + "</span><span class=\"button_delete_list clr_blue\">" + common_delete + "</span></td></tr>";

    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
}

function showQtipDdns(showTarget, content, delay) {
    content = display_SIMtoUIM(content);
    var $showTarget = $('#' + showTarget);
    if ($showTarget) {
        $showTarget.qtip({
            content: content,
            position: {
                corner: {
                    tooltip: 'topMiddle',
                    target: 'bottomMiddle'
                }

            },
            style: {
                width:300
            },
            show: {
                when: false,
                ready: true
            }
        });
        if (delay) {
            setTimeout( function() {
                $showTarget.qtip('destroy');
            }, delay);
        } else {
            setTimeout( function() {
                $showTarget.qtip('destroy');
            }, g_feature.tip_disapear);
        }
    }
    $showTarget.focus();
}

function initPage() {
    button_enable('apply', '0');
    $('.user_add_line').remove();
    getAjaxData('api/ddns/ddns-list', function($xml) {
        var ddns_list = null;
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            ddns_list = ret.response.ddnss.ddns;
        }
        var ddns_index = null;
        var ddns_stateIcon = '';
        var ddns_vendor = null;
        var ddns_status = null;
        var ddns_domain = null;
        var ddns_user = null;
        var ddns_pwd = null;
        var last_ddns = null;
        if (ddns_list) {
            if (ddns_list.length >= DDNS_MAX_NUM) {
                button_enable('add_item', '0');
            }
            currpwdtype = 'password';
            if ($.isArray(ddns_list)) {
                $(ddns_list).each( function(i) {
                    ddns_index = ddns_list[i].index;
                    ddns_vendor = ddns_list[i].provider;
                    ddns_status = getDArrayElement(ddnsstatus, ddns_list[i].status, 'value');
                    ddns_domain = ddns_list[i].domainname;
                    ddns_user = ddns_list[i].username;
                    ddns_pwd = ddns_list[i].password;

                    addDdnslist(
                    $('#service_list tr'),
                    ddns_index,
                    ddns_stateIcon,
                    ddns_vendor,
                    ddns_status,
                    ddns_domain,
                    ddns_user,
                    ddns_pwd
                    );
                });
                lastDdns = ddns_list[ddns_list.length - 1];

            } else {
                ddns_index = ddns_list.index;
                ddns_vendor = ddns_list.provider;
                ddns_status = getDArrayElement(ddnsstatus, ddns_list.status, 'value');
                ddns_domain = ddns_list.domainname;
                ddns_user = ddns_list.username;
                ddns_pwd = ddns_list.password;

                addDdnslist(
                $('#service_list tr'),
                ddns_index,
                ddns_stateIcon,
                ddns_vendor,
                ddns_status,
                ddns_domain,
                ddns_user,
                ddns_pwd
                );
                lastDdns = ddns_list;

            }

            var j;
            for (j = 0;j < $('.user_add_line').children().length;j++) {
                $('.user_add_line').eq(j).children().eq(0).hide();
                $('.user_add_line').eq(j).children().eq(1).html("<img src = '../res/not_connected.png'>");
            }
            $('#ddns_index').val(lastDdns.index);
            $('#ddns_domain').val(lastDdns.domainname);
            $('#ddns_user').val(lastDdns.username);
            $('#ddns_psd').val(lastDdns.password);
        } else {
            $('#ddns_index').val('');
            $('#ddns_domain').val('');
            $('#ddns_user').val('');
            $('#ddns_psd').val('');
        }
    });
}

function postData() {
    var submitObject = {};
    var DdnsListArray = [];
    $('.user_add_line').each( function(i) {
        var ddns_index = $(this).children().eq(0).text();
        var ddns_vendor = $(this).children().eq(2).text();
        var ddns_status = getDArrayElement(ddnsstatus, $(this).children().eq(3).text(), 'key');
        var ddns_domain = $(this).children().eq(4).text();
        var ddns_user = $(this).children().eq(5).text();
        var ddns_pwd = $(this).children().eq(6).children().val();
        ddns_pwd = resolveXMLEntityReference(ddns_pwd);
        var Dlist = {
            index: ddns_index,
            provider: ddns_vendor,
            status: ddns_status,
            domainname: ddns_domain,
            username: ddns_user,
            password: ddns_pwd
        };
        DdnsListArray.push(Dlist);
    });
    submitObject = {
        ddnss: {
            ddns: DdnsListArray
        }
    };
    var submitData = object2xml('request', submitObject);

    saveAjaxData('api/ddns/ddns-list', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            button_enable('apply', '0');
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    }, {
        enc:true
    });
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

function validEditSameDomain() {
    var validDomain = true;
    var ddns_valid_domain = $.trim($('#ddns_domain').val());
    var domain_List = $('.user_add_line');
    var i=0;
    for (i=0;i<domain_List.length;i++) {
        if (editIndex == i) {
            continue;
        }
        if (domain_List.eq(i).children().eq(4).html() == ddns_valid_domain) {
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

function isTValidName(name) {
    var i = 0;
    var unsafeString = "\"<>%\\^[]`\+\$\,='#&:;*/{} \t";
    for ( i = 0; i < name.length; i++ ) {
        for( j = 0; j < unsafeString.length; j++) {
            if ( (name.charAt(i)) == unsafeString.charAt(j) ) {
                return false;
            }
        }
    }
    return true;
}

function isValidValue() {
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });
    var ddns_valid_domain = $.trim($('#ddns_domain').val());

    var ddns_valid_user = $.trim($('#ddns_user').val());
    var ddns_valid_pwd = $.trim($('#ddns_psd').val());
    //valid domain name
    if (!isValidAscIICharset(ddns_valid_domain) || !isVaildDomainname(ddns_valid_domain)) {
        showQtipDdns('ddns_domain', IDS_security_urlfilter_error);
        return false;
    }
    if (!isStartWithChar(ddns_valid_domain) ||(ddns_valid_domain.indexOf(".") == -1 && ddns_valid_domain != "") ||(ddns_valid_domain.indexOf(".") != -1 && ddns_valid_domain.length == 1) ) {
        showQtipDdns('ddns_domain', IDS_security_ddns_domain_contain);
        return false;
    }
    if (/\.$/.exec(ddns_valid_domain) || /^\./.exec(ddns_valid_domain) || /-$/.exec(ddns_valid_domain)|| /^-/.exec(ddns_valid_domain)) {
        showQtipDdns('ddns_domain', IDS_security_domain_dot_char);
        return false;
    }
    if(!validEditSameDomain()) {
        showQtipDdns('ddns_domain', IDS_security_ddns_domain_diff);
        return false;
    }
    //valid username
    if (ddns_valid_user == "" || isValidAscIICharset(ddns_valid_user) == false) {
        showQtipDdns('ddns_user', IDS_security_ddns_user_char);
        return false;
    }
    if (isTValidName(ddns_valid_user) == false) {
        showQtipDdns('ddns_user', IDS_security_ddns_invalid_name);
        return false;
    }
    if (ddns_valid_pwd == "" || isValidAscIICharset(ddns_valid_pwd) == false) {
        showQtipDdns('ddns_psd', IDS_security_ddns_pwd_char);
        return false;
    }
    return true;
}

function showPassword(id,className) {
    var cbValue = $("#checkid").attr('checked');
    var strType = cbValue ? 'text' : 'password';
    currpwdtype = strType;
    var list = $('.'+className);
    var pwdValue = $('.user_add_line');
    var i=0;
    for (i=0;i<list.length;i++) {
        var valueP = pwdValue.eq(i).children().eq(6).children().val();
        valueP = XSSResolveCannotParseChar(valueP);
        $("<input type='"+ currpwdtype+"' autocomplete='off' class='passtype' style='background:#f2f2f2;' maxlength='63' value='"+valueP+"' disabled='disabled' />").replaceAll(list[i]);
    }
}

function checkBeforPostData() {
    return true;
}

var ddnsStatusList = null;
var ddns_stateIcon= null;
var g_corner = '';
function getDdnsStatusInfo() {
    getAjaxData('api/ddns/status', function($xml) {
        var ret = xml2object($xml);
        if(ret.type == 'response') {
            if(ret.response.ddnss.ddns) {
                ddnsStatusList = CreateArray(ret.response.ddnss.ddns);
                $(ddnsStatusList).each( function(i) {
                    if(ddnsStatusList[i].status >= -8 && ddnsStatusList[i].status <= -1) {
                        $('.user_add_line').eq(i).children().eq(1).html("<img src = '../res/connection_failed.png'>");
                        $('.user_add_line').eq(i).children().eq(1).qtip({
                            content: '<b>' + IDS_access_failed + '</b>',
                            position: {
                                corner: g_corner
                            }
                        });
                        setTimeout( function() {
                            $('.user_add_line').eq(i).children().eq(1).qtip('destroy');
                        }, 2000);
                    } else if (ddnsStatusList[i].status == 0) {
                        $('.user_add_line').eq(i).children().eq(1).html("<img src = '../res/not_connected.png'>");
                        $('.user_add_line').eq(i).children().eq(1).qtip({
                            content: '<b>' + dialup_label_disconnected + '</b>',
                            position: {
                                corner: g_corner
                            }
                        });
                        setTimeout( function() {
                            $('.user_add_line').eq(i).children().eq(1).qtip('destroy');
                        }, 2000);
                    } else if (ddnsStatusList[i].status == 1) {
                        $('.user_add_line').eq(i).children().eq(1).html("<img src = '../res/connection_success.png'>");
                        $('.user_add_line').eq(i).children().eq(1).qtip({
                            content: '<b>' + dialup_label_connected + '</b>',
                            position: {
                                corner: g_corner
                            }
                        });
                        setTimeout( function() {
                            $('.user_add_line').eq(i).children().eq(1).qtip('destroy');
                        }, 2000);
                    } else if (ddnsStatusList[i].status == 3) {
                        $('.user_add_line').eq(i).children().eq(1).html("<img src = '../res/connecting.png'>");
                        $('.user_add_line').eq(i).children().eq(1).qtip({
                            content: '<b>' + IDS_accessing_state + '</b>',
                            position: {
                                corner: g_corner
                            }
                        });
                        setTimeout( function() {
                            $('.user_add_line').eq(i).children().eq(1).qtip('destroy');
                        }, 2000);
                    }
                });
            }
        }
    });
}

function initStateTitleCorner() {
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il' || LANGUAGE_DATA.current_language == 'fa_fa') {
        g_corner = {
            tooltip: 'topLeft',
            target: 'bottomCenter'
        };
    } else {
        g_corner = {
            tooltip: 'topRight',
            target: 'bottomCenter'
        };
    }
}

initStateTitleCorner();
var editIndex = null;
$(document).ready( function() {
    button_enable("apply", "0");
    initPage();
    addStatusListener('getDdnsStatusInfo()');
    initSelectOption('ddns_vendor', ddnsvendor);
    initSelectOption('ddns_status', ddnsstatus);
    $('#checkid').live("click", function() {
        showPassword('checkid','passtype');
    });
    var currentAllVal = null;

    $('.button_edit_list').live('click', function() {
        if ($(".add_item_control:hidden").size() > 0 && $('#edit_item_ok').size() < 1) {
            $('#checkid').attr('disabled','disabled');
            editIndex = $('.button_edit_list').index(this);
            // save the value before user edit
            currentAllVal = $('.user_add_line').eq(editIndex).html();
            var editDdnslist = $(this).parent().siblings();
            var editNumber = editDdnslist.eq(0);
            var editVendor = editDdnslist.eq(2);
            var editStatus = editDdnslist.eq(3);
            var editDomain = editDdnslist.eq(4);
            var editName = editDdnslist.eq(5);
            var editPsd = editDdnslist.eq(6);
            var editpsdValue = editDdnslist.eq(6).children().val();
            var htmlVendor = editVendor.html();
            var htmlStatus = editStatus.html();
            editNumber.html('<label id="ddns_index">'+editNumber.text()+ '</label>');
            createSelect(editVendor, 'ddns_vendor', ddnsvendor);
            createSelect(editStatus, 'ddns_status', ddnsstatus);
            $('#ddns_vendor').val(getDArrayElement(ddnsvendor, htmlVendor, 'key'));
            $('#ddns_status').val(getDArrayElement(ddnsstatus, htmlStatus, 'key'));
            editDomain.html('<input type="text" style="width:86px;" value="' + XSSResolveHtmlReturnChar(editDomain.html()) + '" id="ddns_domain" maxlength="63">');
            editName.html('<input type="text" style="width:92px;" value="' + XSSResolveHtmlReturnChar(editName.html()) + '" id="ddns_user" maxlength="63">');
            editPsd.html('<input type="'+currpwdtype +'" autocomplete="off" style="width:83px;" class="passtype" value="' + XSSResolveHtmlReturnChar(editpsdValue) + '" id="ddns_psd" maxlength="63"/>');
            $(this).parent().html('<a class="clr_blue" id="edit_item_ok" href="javascript:void(0);">' + common_ok +
            '</a><a class="clr_blue" id="edit_item_cancel" href="javascript:void(0);">' + common_cancel + '</a>');

            hideAddItemControl();

            $('#edit_item_cancel').live('click', function() {
                $('.user_add_line').eq(editIndex).html(currentAllVal);
                $('.user_add_line').eq(editIndex).children().eq(6).children().val(editpsd_Value);
                $('.qtip').qtip('destroy');
                if (!isButtonEnable('add_item')) {
                    button_enable('add_item', '1');
                    if((1 == ok_flag) || (1 == add_flag)) {
                        button_enable('apply', '1');
                    }
                }
                if ($('.user_add_line').length >= DDNS_MAX_NUM) {
                    button_enable('add_item', '0');
                }
                $('#checkid').removeAttr('disabled');
            });
            button_enable('apply', '0');
            button_enable('add_item', '0');
        }

    });
    $('#edit_item_ok').live('click', function() {
        if (isValidValue()) {
            var ddnsindexAdd = $('#ddns_index').text();
            var vendorOption = $('#ddns_vendor option:selected').text();
            var statusOption = $('#ddns_status option:selected').text();
            var domain_name = $.trim($('#ddns_domain').val());
            var user_name = XSSResolveCannotParseChar($.trim($('#ddns_user').val()));
            var pass_word = $.trim($('#ddns_psd').val());
            pass_word = XSSResolveCannotParseChar(pass_word);
            hideAddItemControl();
            var editDdnslist = $(this).parent().siblings();
            editDdnslist.eq(0).html(ddnsindexAdd);
            editDdnslist.eq(2).html(vendorOption);
            editDdnslist.eq(3).html(statusOption);
            editDdnslist.eq(4).html(domain_name);
            editDdnslist.eq(5).html(user_name);
            editDdnslist.eq(6).html("<input class='passtype' type='" + currpwdtype + "' autocomplete='off' style='background:#f2f2f2;width:84px;' value='"+pass_word +"' disabled='disabled'/>");

            $(this).parent().html('<span class=\"button_edit_list clr_blue\">' + common_edit +
            '</span><span class=\"button_delete_list clr_blue\">' + common_delete + '</span>');

            currentAllVal = $('.user_add_line').eq(editIndex).html();
            button_enable('apply', '1');
            button_enable('add_item', '1');
            ok_flag = 1;
            if ($('.user_add_line').length >= DDNS_MAX_NUM) {
                button_enable('add_item', '0');
            }

            $('#checkid').removeAttr('disabled');
        }
    });
    $("#state_icon").qtip({
        content: '<b>' + dialup_label_disconnected + '</b>',
        position: {
            corner: g_corner
        }
    });
    $('#add_item_ok').live('click', function() {
        if (isValidValue()) {
            var addIndex = $('#ddns_add_index').text();
            var addStatus = '';
            var vendorOption = $('#ddns_vendor option:selected').text();
            var statusOption = $('#ddns_status option:selected').text();
            var domain_name = $.trim($('#ddns_domain').val());

            var user_name = $.trim($('#ddns_user').val());
            var pass_word = $.trim($('#ddns_psd').val());
            hideAddItemControl();
            addDdnslist($('#service_list tr'), addIndex, addStatus, vendorOption, statusOption, domain_name,user_name, pass_word);
            $('.user_add_line').eq($('.user_add_line').length-1).children().eq(0).hide();
            $('.user_add_line').eq($('.user_add_line').length-1).children().eq(1).html("<img src = '../res/not_connected.png'>");
            $('.user_add_line').eq($('.user_add_line').length-1).children().eq(1).qtip({
                content: '<b>' + dialup_label_disconnected + '</b>',
                position: {
                    corner: g_corner
                }
            });
            setTimeout( function() {
                $('.user_add_line').eq($('.user_add_line').length-1).children().eq(1).qtip('destroy');
            }, 2000);
            var pwdhtml = "<input  class='passtype'  type='"+currpwdtype+"' autocomplete='off' style='background:#f2f2f2;width:84px;' value='"+XSSResolveHtmlReturnChar(pass_word) +"' disabled='disabled' maxlength='63'/>";
            $('.user_add_line').eq($('.user_add_line').length-1).children().eq(6).html(pwdhtml);

            button_enable('apply', '1');
            if ($('.user_add_line').length >= DDNS_MAX_NUM) {
                button_enable('add_item', '0');
            }
            add_flag = 1;
            $('#checkid').removeAttr('disabled');
        }
        return false;
    });
    //hide add item control
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        if((1 == add_flag) || (1 == ok_flag)) {
            button_enable('apply', '1');
        }
        $('#checkid').removeAttr('disabled');
        return false;
    });
    //show add item control
    $('#add_item').click( function() {
        if (isButtonEnable('add_item')) {
            showAddItemControl();
            var leg = $('#service_list tr').eq($("#service_list tr").length - 2).children().eq(0).text();
            var addnewIndex;
            if ($("#service_list tr").length ==  2) {
                addnewIndex = 0;
                if ($('#checkid').attr('checked')) {
                    currpwdtype = 'text';
                } else {
                    currpwdtype = 'password';
                }

            } else {
                addnewIndex = parseInt(leg, 10) +1;
            }
            editIndex = -1;
            $('#ddns_add_index').html('<label>'+addnewIndex+'</label>');
            $('#ddns_domain').val('');
            $('#ddns_user').val('');
            $('#ddns_psd_label').html('<input id="ddns_psd" style="width:83px;" type="'+currpwdtype +'"  autocomplete="off" maxlength="63" val="" />');
            $('#ddns_vendor').val(0);
            $('#ddns_status').val(0);
            button_enable('apply', '0');
            $('#checkid').attr('disabled','disabled');
        }
    });
    //if there hasn't any add or delete button it won't work
    $(".button_delete_list").live("click", function() {
        if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1) {
            var deleteIndex = $(".button_delete_list").index(this);
            call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
            $("#pop_OK").click( function() {
                deleteFilter(deleteIndex, $(".user_add_line"));
                clearDialog_table();
                var i;
                for (i = parseInt(deleteIndex,10); i < $("#service_list tr").length; i++) {
                    $("#service_list tr").eq(i).children().eq(0).text(i-1);
                }
                button_enable("apply", "1");
                button_enable("add_item", "1");
            });
            $('#checkid').removeAttr('disabled');
        }
    });
    $('#apply').click( function() {
        if (isButtonEnable('apply')) {
            if(checkBeforPostData()) {
                showConfirmDialog(firewall_hint_submit_list_item, postData);
            }
        }
        ok_flag = 0;
        add_flag = 0;
    });
});