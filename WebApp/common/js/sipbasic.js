var SIP_FILTER_NUM = 1;
var index = null;
var editIndex = null;
var delIndex = null
var edIndex = null;
var offorno = 0;
var DELETE_SIPACCOUNT = 'api/voice/deletesipaccount';
var GET_SIPACCOUNT = 'api/voice/sipaccount';
var ADD_SIPACCOUNT = 'api/voice/addsipaccount';

function addSipBasicFilter(insertNode) {
    var addLine = null;
    var i = 1;
    addLine = "<tr class=\"user_add_line\">";

    addLine += "<td style='word-break: break-all;' >" + arguments[1] + "</td>"; /*account*/
    addLine += "<td style='word-break: break-all;'>" + arguments[2] + "</td>"; /*username*/
    addLine += "<td> <input type='password' autocomplete='off' style='background:#f2f2f2; word-break: break-all;width:115px;' readonly='true' value='' ></input></td>";/*password*/
    if ('0'==arguments[4]) {
        addLine += "<td style='background:#f2f2f2; word-break: break-all' readonly='true';> "+ IDS_VOIP_Status_U +"</td>";
    } else if ('1'==arguments[4]) {
        addLine += "<td style='background:#f2f2f2; word-break: break-all' readonly='true'> "+ IDS_VOIP_Status_I +"</td>";
    } else {
        addLine += "<td style='background:#f2f2f2; word-break: break-all' readonly='true'> "+ IDS_VOIP_Status_R +"</td>";
    }
    addLine += "<td class='user_options clr_blue_hover' width='20%'><span class=\"button_edit_list clr_blue\">" + common_edit + "</span><span class=\"button_delete_list clr_blue\">" + common_delete + "</span></td></tr>";

    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
    if ($('.user_add_line').length >= SIP_FILTER_NUM) {
        button_enable('add_item', '0');
    }
}

function adaptatSDK() {
    getAjaxData('api/voice/featureswitch', function($xml) {
        var sdk_ret = xml2object($xml);
        if ('response' == sdk_ret.type) {
            offorno = sdk_ret.response.specialcharenable;
        }
    }, {
        sync : true
    });
}

function initPage() {//callwaitingenable
    getAjaxData('api/voice/sipadvance', function($xml) {
        var cap_ret = xml2object($xml);
        if ('response' == cap_ret.type) {
            g_sipadvance = cap_ret.response;
            $('#callwaitingenable').val(g_sipadvance.callwaitingenable);
            if (1 == g_sipadvance.callwaitingenable) {
                $('#callwaitingenable').get(0).checked = true;
            } else {
                $('#callwaitingenable').get(0).checked = false;
            }
        }
    }, {
        sync : true
    });

    getAjaxData('api/voice/sipaccount', function($xml) {
        var ret = xml2object($xml);
        if(null!= ret.response.account ) {
            var filters = CreateArray(ret.response.account);
            if (typeof(g_moduleswitch.encrypt_enabled) != 'undefined' && g_moduleswitch.encrypt_enabled == 1) {
                $(filters).each( function(i) {
                    if (typeof(filters[i].username) != 'undefined' && filters[i].username != null && filters[i].username != '') {
                        filters[i].password = COMMON_PASSWORD_VALUE;
                    }
                });
            }
            if (filters.length >= SIP_FILTER_NUM) {
                button_enable('add_item', '0');
            }
            var account = '';
            var username = '';
            var password ='';
            var registerstatus='';
            $('.user_add_line').remove();
            $(filters).each( function(i) {
                index = filters[i].index;
                account = filters[i].directorynumber;
                username = spaceToNbsp(XSSResolveCannotParseChar(filters[i].username));
                password = spaceToNbsp(XSSResolveCannotParseChar(filters[i].password));  /*set password as g_init_password*/
                registerstatus=filters[i].registerstatus;
                addSipBasicFilter(
                $('#service_list tr'),
                account,
                username,
                password,
                registerstatus
                );

                if($('.user_add_line').length > 0) {
                    $('.user_add_line').each( function(i) {
                        $(this).children().eq(2).children().val(filters[i].password)
                    });
                }

            });
            var lastFilter = filters[filters.length - 1];
            $('#input_sip_account').val(lastFilter.directorynumber);
            $('#input_sip_username').val(lastFilter.username);
            $('#input_sip_password').val(lastFilter.password);
            $('#input_sip_registStatus').val(lastFilter.registerstatus);
        } else {
            $("#callwaitingenable").attr('disabled', 'disabled');
            $('#input_sip_account').val("");
            $('#input_sip_username').val("");
            $('#input_sip_password').val("");
            $('#input_sip_registStatus').val("");
        }
    });
}

function isVaildValue() {
    var sipAccount = nbspToSpace($.trim($('#input_sip_account').val()));
    var sipUsername = nbspToSpace($.trim($('#input_sip_username').val()));
    var sipPassword = nbspToSpace($.trim($('#input_sip_password').val()));
    //Valid sipAccount
    var reg = /^[A-Za-z0-9_.+]+$/g;
    var sipAccount = $.trim($('#input_sip_account').val());
    if(null == sipAccount.match(reg)) {
        showQtip('input_sip_account', IDS_VOIP_SipAccountErrStr5);
        return false;
    }
    //Valid sipUsername
    if(offorno == 0) {
        if ('' == sipUsername || false == checkInputChar(sipUsername)) {
            showQtip('input_sip_username',dialup_hilink_hint_username_invalidate);
            return false;
        }
    } else {
        if ('' == sipUsername || false == checkInputPPPoEChar(sipUsername)) {
            showQtip('input_sip_username',sip_account_username_invalidate);
            return false;
        }

    }

    //Valid sipPassword
    if(offorno == 0) {
        if ('' == sipPassword || false == checkInputChar(sipPassword)) {
            showQtip('input_sip_password',dialup_hilink_hint_password_invalidate);
            return false;
        }
    } else {
        if ('' == sipPassword || false == checkInputPPPoEChar(sipPassword)) {
            showQtip('input_sip_password',sip_account_password_invalidate);
            return false;
        }

    }

    return true;
}

function apply() {
    clearAllErrorLabel();

    if (true == $('#callwaitingenable').get(0).checked) {
        g_sipadvance.callwaitingenable = 1;
    } else {
        g_sipadvance.callwaitingenable = 0;
    }
    var newXmlString = object2xml('request', g_sipadvance);
    saveAjaxData('api/voice/sipadvance', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            initPage();
            showInfoDialog(common_success);
        } else {
            if ( typeof (ret.error) != 'undefined' && ret.error.code == ERROR_SYSTEM_BUSY) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_fail);
                initPage();
            }
        }
    });
}

function postData(temp) {
    var submitObject = {};
    var SipFilterArray = [];

    if($('.user_add_line').length > 0) {
        $('.user_add_line').each( function(i) {
            var sipAccount = '';
            var sipUsername = '';
            var sipPassword = '';
            var registerStatus='';
            sipAccount = $(this).children().eq(0).text();
            sipUsername = nbspToSpace($(this).children().eq(1).html());
            sipPassword = XSSResolveCannotParseChar(nbspToSpace($(this).children().eq(2).children().val()));
            registerStatus=$(this).children().eq(3).val();
            if(temp == GET_SIPACCOUNT) {
                var filter = {
                    directorynumber: sipAccount,
                    username: sipUsername,
                    password: sipPassword,
                    registerstatus:registerStatus,
                    index: editIndex
                };
                SipFilterArray.push(filter);
                submitObject = {
                    account: SipFilterArray
                };
            } else if(temp == ADD_SIPACCOUNT) {
                var filter = {
                    directorynumber: sipAccount,
                    username: sipUsername,
                    password: sipPassword,
                    registerstatus:registerStatus
                };
                SipFilterArray.push(filter);
                submitObject = {
                    account: SipFilterArray
                };
            } else {
                SipFilterArray.push(delIndex);
                submitObject = {
                    index: SipFilterArray
                };
            }
        });
    } else {
        SipFilterArray.push(delIndex);
        submitObject = {
            index: SipFilterArray
        };
    }
    if (temp == GET_SIPACCOUNT) {
        if (checkPostIndex(0)) {
            delete submitObject.account[editIndex - 1].password;
        }
    }
    var submitData = object2xml('request', submitObject);
    saveAjaxData(temp, submitData, function($xml) {
        mousedownIndexList = [];
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
        } else {
            showInfoDialog(common_failed);
            initPage();
        }
    }, {
        enc:true
    });
    button_enable('sip_refresh', '1');
}

$(document).ready( function() {
    clickPasswordEvent('input_sip_password',0);
    var currentAllVal = null;
    var sipAccount = null;
    var sipUsername = null;
    var sipPassword = null;
    var sipRegisterStatus=null;
    adaptatSDK();
    initPage();
    $("#callwaitingenable").click( function() {
        if (!isButtonEnable('callwaitingenable')) {
            return;
        }
        apply();
    });
    $('.button_edit_list').live('click', function() {
        button_enable('sip_refresh', '0');
        if (($(".add_item_control:hidden").size() > 0) && ($('#edit_item_ok').size() < 1)) {

            edIndex = $('.button_edit_list').index(this);
            editIndex = edIndex+1;
            currentAllVal = $('.user_add_line').eq(edIndex).html();
            var editSipFilter = $(this).parent().siblings();
            sipAccount = editSipFilter.eq(0);
            sipUsername = editSipFilter.eq(1);
            sipPassword = editSipFilter.eq(2);
            sipRegisterStatus=editSipFilter.eq(3);
            var password = sipPassword.children().val();
            sipAccount.html('<input type="text" style="width:116px;" value="' + XSSResolveHtmlReturnChar(sipAccount.html()) + '" id="input_sip_account" maxlength="31" ></td>');
            if(offorno == 1) {
                sipUsername.html('<input type="text" style="width:116px;" value="' + XSSResolveHtmlReturnChar(nbspToSpace(sipUsername.html())) + '" id="input_sip_username" maxlength="127" ></td>');
                sipPassword.html('<input type="password" autocomplete="off" style="width:116px;" value="" id="input_sip_password" maxlength="127"></td>');

            } else {
                sipUsername.html('<input type="text" style="width:116px;" value="' + XSSResolveHtmlReturnChar(sipUsername.html()) + '" id="input_sip_username" maxlength="32" ></td>');
                sipPassword.html('<input type="password" autocomplete="off" style="width:116px;" value="" id="input_sip_password" maxlength="32"></td>');

            }
            sipRegisterStatus.html('<input type="text" style="width:116px;" value="' + XSSResolveHtmlReturnChar(sipRegisterStatus.html()) + '" id="input_sip_registerStatus" readonly="true" style="background:#f2f2f2;"></td>');
            $(this).parent().html('<a class="clr_blue" id="edit_item_ok" href="javascript:void(0);">' + common_ok +
            '</a><a class="clr_blue" id="edit_item_cancel" href="javascript:void(0);">' + common_cancel + '</a>');
            hideAddItemControl();
            $('#input_sip_password').val(password);
            $('#edit_item_cancel').live('click', function() {
                button_enable('sip_refresh', '1');
                $('.user_add_line').eq(edIndex).html(currentAllVal);
                $('.qtip').qtip('destroy');
                if (!isButtonEnable('add_item')) {
                    button_enable('add_item', '1');
                }
                if ($('.user_add_line').length >= SIP_FILTER_NUM) {
                    button_enable('add_item', '0');
                }
            });
            $('#add_item').live('click', function() {
                button_enable('sip_refresh', '0');
                if (isButtonEnable('add_item')) {
                    $('.user_add_line').eq(edIndex).html(currentAllVal);
                    $('.qtip').qtip('destroy');
                }
            });
            button_enable('add_item', '0');
            $('#input_sip_account').focus();
        }

    });
    $('#edit_item_ok').live('click', function() {
        if (isVaildValue()) {
            var sipAccount = XSSResolveCannotParseChar($.trim($('#input_sip_account').val()));
            var sipUsername = spaceToNbsp(XSSResolveCannotParseChar($.trim($('#input_sip_username').val())));
            var sipPassword = XSSResolveCannotParseChar($.trim($('#input_sip_password').val()));
            var sipRegisterStatus=XSSResolveCannotParseChar($.trim($('#input_sip_registerStatus').val()));

            hideAddItemControl();
            var editSipFilter = $(this).parent().siblings();
            editSipFilter.eq(0).html(sipAccount);
            editSipFilter.eq(1).html(sipUsername);
            editSipFilter.eq(2).html('<input type="password" autocomplete="off" style="width:115px;" readonly="true" style="background:#f2f2f2;" value=""/>');
            editSipFilter.eq(3).html(sipRegisterStatus);
            editSipFilter.eq(2).children().val(sipPassword);
            $(this).parent().html('<span class=\"button_edit_list clr_blue\">' + common_edit +
            '</span><span class=\"button_delete_list clr_blue\">' + common_delete + '</span>');
            currentAllVal = $('.user_add_line').eq(edIndex).html();
            if ($('.user_add_line').length >= SIP_FILTER_NUM) {
                button_enable('add_item', '0');
            } else {
                button_enable('add_item', '1');
            }
            postData(GET_SIPACCOUNT);
        }
    });
    $(".button_delete_list").live("click", function() {
        if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1) {
            var deleteIndex = $(".button_delete_list").index(this);
            delIndex = deleteIndex+1;
            call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
            $("#pop_OK").click( function() {
                deleteFilter(deleteIndex, $(".user_add_line"));
                postData(DELETE_SIPACCOUNT);
                clearDialog_table();
                button_enable("add_item", "1");
                if ($('.user_add_line').length <1) {
                    $("#callwaitingenable").attr('disabled', 'disabled');
                }
            });
        }

    });
    $('#add_item').click( function() {
        if (isButtonEnable('add_item')) {
            getAjaxData('api/voice/sipserver', function($xml) {
                var cap_ret = xml2object($xml);
                if ('response' == cap_ret.type) {
                    g_server = cap_ret.response.sipserver;
                }
            }, {
                sync:true
            });

            if(null != g_server) {
                if('' == g_server.proxyserveraddress || '' == g_server.registerserveraddress) {
                    showInfoDialog(IDS_VOIP_Error_Message);
                } else {
                    button_enable('sip_refresh', '0');
                    showAddItemControl();
                    if(offorno == 1) {
                        $('#input_sip_username').attr('maxlength',127);
                        $('#input_sip_password').attr('maxlength',127);
                    }
                    $('.add_item_control input').eq(0).focus();
                    $('.add_item_control input').eq(3).val('');
                }
            }
        }
    });
    $('#add_item_ok').live('click', function() {
        if (isVaildValue()) {
            var sipAccount = $.trim($('#input_sip_account').val());
            var sipUsername = spaceToNbsp(XSSResolveCannotParseChar($.trim($('#input_sip_username').val())));
            var sipPassword = $.trim($('#input_sip_password').val());
            var sipRegisterStatus=$.trim($('#input_sip_registerStatus').val());
            hideAddItemControl();
            addSipBasicFilter($('#service_list tr'), sipAccount, sipUsername, XSSResolveCannotParseChar(sipPassword),'0');
            if($('.user_add_line').length > 0) {
                $('.user_add_line').each( function(i) {
                    if(i == ($('.user_add_line').length - 1)) {
                        $(this).children().eq(2).children().val(sipPassword)
                    }
                });
            }
            if ($('.user_add_line').length >= SIP_FILTER_NUM) {
                button_enable('add_item', '0');
            }
            postData(ADD_SIPACCOUNT);
            $("#callwaitingenable").removeAttr('disabled');
        }
        return false;
    });
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        $("#callwaitingenable").attr('disabled', '0');
        button_enable('sip_refresh', '1');
        return false;
    });
    $('#sip_refresh').bind('click', function() {
        initPage();
    });
});