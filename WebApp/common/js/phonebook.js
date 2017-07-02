// JavaScript Document

/*
 * Global Features
 */
var g_PB_TIMEOUT_LONG = 60000;
var g_PB_TIMEOUT_SHORT = 30000;
var g_PB_TIMEOUT_IMPORT = 600000;
/*
 * Define Globe Variable
 */
var g_pb_pageIndex = 1;                     /* 当前页 */
var g_pb_totalPbPage = 0;                   /* 总页数 */
var g_pb_curContactSum = 0;                 /* 当前群组联系人总条数 */
var g_pb_curGroupId = 0;                    /* 当前群组ID */
var g_pb_curPhoneBook = '';                 /* 当前新增或修改的联系人详细信息 */
var g_pb_curGroupCount = 0;                 /* 当前群组数量 */
var g_pb_selectListNum = '';                /* 联系人选择下标 */
var g_pb_contactListArray = [];             /* 联系人详细信息列表 */
var g_pb_groupListArray = [];               /* 群组详细信息列表 */
var g_pb_fieldMap = [];
var g_pb_fieldCount = 0;
var g_pb_editgroupID = 0;                   /* 编辑群组ID */
var g_pb_editgroupFlag = false;             /* 编辑群组标志位 */
var g_pb_nameLength = 0;
var g_pb_nameNumber = 0;
var afterSubstrName = '';
var g_pb_status = 0;
// 本地电话本配置项信息
var g_pb_feature = {
    page_size: 0,                        /* 一页显示多少条联系人列表 */
    max_name_size: 0,                    /* 新建联系人姓名最大字节数 */
    max_phone_size: 0,                   /* 新建联系人电话号码最大字节数 */
    max_email_size: 0,                   /* 新建联系人邮件最大字节数 */
    max_search_size: 0,                  /* 检索字段最大字符数 */
    max_group_size: 0,                   /* 新建群组最大数量 */
    max_group_name_size: 0,              /* 新建群组名最大字节数 */
    export_csv_path: '',                 /* 导出联系人CSV文件单板路径 */
    export_vcard_path: ''                /* 导出联系人VCARD文件单板路径 */
};

// 本地电话本数量(XML字段)
var g_pb_local_count = {
    LocalUsed: 0,                       /* 本地电话本记录条数  */
    SimUsed: 0,                         /* SIM卡电话本记录条数  */
    LocalMax: 0,                        /* 本地电话本最大存储量  */
    SimMax: 0                           /* SIM卡电话本最大存储量  */
};

// 获取本地电话本联系人列表请求(XML字段)
var g_pb_local_contact_list_request = {
    GroupID: 0,                         /* 群组ID */
    PageIndex: g_pb_pageIndex,          /* 当前读取页面索引  */
    ReadCount: g_pb_feature.page_size,  /* 每页读取的数量  */
    SaveType: 0,                        /* 0：本地电话本；1：SIM电话本  */
    SortType: 1,                       /* 排序字段 0：按索引；1：按姓名  */
    Ascending: 1,                       /* 升序降序 0：降序；1：升序  */
    KeyWord: ''                         /* 查询关键字  */
};

// 获取本地电话本群组列表请求(XML字段)
var g_pb_local_group_list_request = {
    PageIndex: 1,                       /* 当前读取页面索引  */
    ReadCount: g_pb_feature.max_group_size,  /* 每页读取的数量  */
    SortType: 2,                       /* 排序字段 0：按索引；1：按姓名  */
    Ascending: 1                        /* 升序降序 0：降序；1：升序  */
};

/*
 * 获取电话本配置信息
 */
function pb_getConfig() {
    getConfigData('config/pb/config.xml', function($xml) {
        var pb_feature = _xml2feature($xml);
        $.extend(g_pb_feature, pb_feature); //合并配置参数
    }, {
        sync: true
    });
    redirectOnCondition(null, 'phonebook');
}

//页面初始化前，获取电话本配置信息
pb_getConfig();

/*
 * 初始化页面
 */
function pb_initPage(initialize) {
    pb_clearPage('clear_all');
    pb_controlBtnShow('hide_all');
    pb_getLocalCount();
    if (initialize) {
        pb_getLocalGroupList();
    } else {
        pb_getLocalGroupList('count_only');
    }
    /*若SDK未初始化完pb-count值，重新从SDK获取pb-count值*/
    if (0 == g_pb_local_count.SimUsed || 0 == g_pb_local_count.LocalUsed
    || 0 == g_pb_local_count.LocalMax || 0 == g_pb_local_count.SimMax) {
        setTimeout( function() {
            pb_getLocalCount();
        }, 1500);
    }
    pb_getLocalContactList();
}

/*
 * 清除页面数据
 */
function pb_clearPage($case) {
    switch ($case) {
        case 'clear_all':
            g_pb_selectListNum = '';
            $('.pb_pagination div').hide();
            $('#list_contacts').empty();
            $('#div_local_detail').empty();
            $('#pb_check_all').removeAttr('checked');
            button_enable('btn_del_contact', '0');
            button_enable('btn_send_msg', '0');
            button_enable('btn_move_to_group', '0');
            break;
        case 'clear_search':
            g_pb_pageIndex = 1;
            g_pb_selectListNum = '';
            $('.pb_pagination div').hide();
            $('#list_contacts').empty();
            $('#pb_check_all').removeAttr('checked');
            button_enable('btn_del_contact', '0');
            button_enable('btn_send_msg', '0');
            button_enable('btn_move_to_group', '0');
            break;
        case 'clear_group':
            g_pb_curGroupId = 0;
            g_pb_pageIndex = 1;
            g_pb_selectListNum = '';
            $('#pb_add_group').empty();
            $('#pb_search').val(common_search);
            $('#pb_search').removeClass('pb_search_init');
            $('#pb_search').addClass('pb_search_init');
            $('#pb_search').addClass('clr_gray');
            $('.pb_pagination div').hide();
            $('#list_contacts').empty();
            $('#div_local_detail').empty();
            $('#pb_check_all').removeAttr('checked');
            button_enable('btn_del_contact', '0');
            button_enable('btn_send_msg', '0');
            button_enable('btn_move_to_group', '0');
            break;
        case 'clear_edit_group':
            g_pb_curGroupId = 0;
            g_pb_pageIndex = 1;
            g_pb_selectListNum = '';
            $('#pb_add_group').empty();
            $('.pb_pagination div').hide();
            $('#list_contacts').empty();
            $('#div_local_detail').empty();
            $('#pb_check_all').removeAttr('checked');
            button_enable('btn_del_contact', '0');
            button_enable('btn_send_msg', '0');
            button_enable('btn_move_to_group', '0');
            break;
        default:
            break;
    }
}

/*
 * 按钮事件绑定处理
 */
function pb_new_contactClick() {
	$('#btn_new_contact').click( function() {
        if (parseInt(g_pb_local_count.LocalUsed, 10) >=
        parseInt(g_pb_local_count.LocalMax, 10)) {
            showInfoDialog(strid_pb_hint_no_room);
            return;
        }
        pb_localShowAddContact();
        pb_controlBtnShow('show_edit');
    });
}
function pb_import_Click() {
	$('#btn_pb_import').click( function() {
        pb_localCopySimContact();
        return false;
    });
}
function pb_initBtnClick() {
    $('#btn_new_contact').click( function() {
        if (parseInt(g_pb_local_count.LocalUsed, 10) >=
        parseInt(g_pb_local_count.LocalMax, 10)) {
            showInfoDialog(strid_pb_hint_no_room);
            return;
        }
        pb_localShowAddContact();
        pb_controlBtnShow('show_edit');
    });
    $('#btn_del_contact').click( function() {
        if (!isButtonEnable('btn_del_contact')) {
            return;
        }
        button_enable('btn_del_contact', 0);
        $('#pop_confirm').die('click');
        showConfirmDialog(common_confirm_delete_list_item, function() {
            pb_clearDialog();
            pb_localDeleteContact();
        }, function() {
            button_enable('btn_del_contact', 1);
        });
        $('.dialog_close_btn').bind('click', function() {
            button_enable('btn_del_contact', 1);
        });
    });
    $('#btn_send_msg').click( function() {
        if (!isButtonEnable('btn_send_msg')) {
            return;
        }
        button_enable('btn_send_msg', 0);
        pb_localSendMsg();
    });
    $('.pb_table_details img').live('click', function() {
        var pre = $(this).parents('pre');
        pb_localSendMsg($(pre).text());
    });
    $('#btn_move_to_group').click( function() {
        if (!isButtonEnable('btn_move_to_group')) {
            return;
        }
        pb_showLocalMoveToGroup();
    });
    $('#btn_del_contact_b').click( function() {
        if (!isButtonEnable('btn_del_contact_b')) {
            return;
        }
        button_enable('btn_del_contact_b', 0);
        $('#pop_confirm').die('click');
        showConfirmDialog(common_confirm_delete_list_item, function() {
            pb_clearDialog();
            var n = $('#hiddenNum').val();
            var index = -1 == n ?
            g_pb_curPhoneBook.Index : g_pb_contactListArray[n].Index;
            pb_localDeleteContact(index);
        }, function() {
            button_enable('btn_del_contact_b', 1);
        });
        $('.dialog_close_btn').bind('click', function() {
            button_enable('btn_del_contact_b', 1);
        });
    });
    $('#btn_edit_contact').click( function() {
        pb_localShowEditContact($('#hiddenNum').val());
        pb_controlBtnShow('show_edit');
    });
    $('#btn_save_contact').click( function() {
        if (!isButtonEnable('btn_save_contact')) {
            return;
        }
        button_enable('btn_save_contact', 0);
        if ($('#hiddenIndex').val()) {
            pb_localEditContact();
        } else {
            pb_localAddContact();
        }
    });
    $('#pb_check_all').click( function() {
        var allCheckBox = $('#list_contacts :checkbox');
        var checkedCount = 0;
        allCheckBox.attr('checked', this.checked);
        checkedCount = allCheckBox.filter(':checked').length;
        button_enable('btn_del_contact', checkedCount > 0);
        button_enable('btn_send_msg', checkedCount > 0);
        if (g_pb_groupListArray.length > 0) {
            button_enable('btn_move_to_group', checkedCount > 0);
        }
    });
    $('#list_contacts li').live('mouseover', function() {
        var css = 'li_hover';
        if (css != $(this).attr('class')) {
            $(this).removeClass(css);
            $(this).addClass(css);
        }
    });
    $('#list_contacts li').live('mouseout', function() {
        $(this).removeAttr('class');
    });
    $('#list_contacts li').live('click', function(event) {
        var checkBox = $(this).find('input:checkbox');
        if (('pb_checkbox' != $(event.target).attr('id')) &&
        ('div_checkbox' != $(event.target).attr('id'))) {
            $(checkBox).attr('checked', 'checked');
            checkBox = $('#list_contacts :checkbox').not($(checkBox));
            checkBox.removeAttr('checked');
        } else if ('div_checkbox' == $(event.target).attr('id')) {
            $(checkBox).attr('checked', !$(checkBox).attr('checked'));
        }

        var allCheckBox = $('#list_contacts :checkbox');
        var checkedCount = 0;
        checkedCount = allCheckBox.filter(':checked').length;
        $('#pb_check_all').attr('checked', allCheckBox.length == checkedCount);
        button_enable('btn_del_contact', checkedCount > 0);
        button_enable('btn_send_msg', checkedCount > 0);
        if (g_pb_groupListArray.length > 0) {
            button_enable('btn_move_to_group', checkedCount > 0);
        }

        pb_showLocalContactsDetail(pb_getLocalHrefNum(this));
        pb_controlBtnShow('show_detail');
    });
    $('#btn_cancel_contact').click( function() {
        if ('' == g_pb_selectListNum) {
            if (0 == g_pb_contactListArray.length) {
                $('#div_local_detail').empty();
                pb_controlBtnShow('hide_all');
            } else {
                pb_showLocalContactsDetail(0);
                pb_controlBtnShow('show_detail');
            }
        } else {
            pb_showLocalContactsDetail(g_pb_selectListNum);
            pb_controlBtnShow('show_detail');
        }
    });
    $('#jump_page').click( function() {
        var pb_pageIndex = parseInt($.trim($('#jump_page_index').val()), 10);
        if (isNaN(pb_pageIndex) || pb_pageIndex < 1 || pb_pageIndex > g_pb_totalPbPage) {
            showQtip('jump_page_index', sms_hint_wrong_page_num);
            $('#jump_page_index').select();
        } else {
            pb_pageNav(pb_pageIndex);
        }
    });
    // 检索处理
    $('#pb_search').val(common_search); /* 为检索赋初值 */
    $('#pb_search').attr('maxlength', g_pb_feature.max_search_size);

    $('#pb_search').keydown( function(event) {
        // Enter Key
        if (13 == event.keyCode) {
            pb_clearPage('clear_search');
            pb_getLocalContactList();
            $('#div_local_detail').empty();
            pb_controlBtnShow('hide_all');
        }
    });
    $('#pb_img_search').click( function() {
        pb_clearPage('clear_search');
        pb_getLocalContactList();
        $('#div_local_detail').empty();
        pb_controlBtnShow('hide_all');
    });
    $('#pb_search').focus( function() {
        if ($('#pb_search').hasClass('pb_search_init')) {
            this.className = '';
            this.value = '';
        }
    });
    $('#pb_search').blur( function() {
        if (this.value == '') {
            this.className = 'pb_search_init clr_gray';
            this.value = common_search;
        }
    });
    // 创建群组
    $('#pb_new_group').click( function() {
        $('#btn_new_contact').unbind('click');
        $('#btn_pb_import').unbind('click');
        g_pb_status = 0;
        if (!$('.menu_group input').size()) {
            pb_localShowNewGroup();            
        }
    });
    $('#pb_new_group').live('mouseover', function() {
        $(this).css({
            color: '#12A5D6'
        });
    });
    $('#pb_new_group').live('mouseout', function() {
        $(this).css({
            color: '#000'
        });
    });
    $('#pb_group_list li').live('click', function() {
        $(this).removeClass('click');
        $(this).addClass('click');
        if (true == g_pb_editgroupFlag) {
            pb_clearPage('clear_edit_group');
        } else {
            pb_clearPage('clear_group');
        }
        g_pb_editgroupFlag = false;
        pb_controlBtnShow('hide_all');

        g_pb_curGroupId = pb_getLocalHrefNum(this);
        if (0 == g_pb_curGroupId) {
            $('#cur_group_type').html(pb_label_all_contacts);
        } else {
            var groupNum = $('#txtEditorGroup').length;
            if (0 == groupNum) {
                var span = $(this).find('span');
                var num = pb_getLocalHrefNum(span);
                $('#cur_group_type').html(resolveXMLEntityReference(g_pb_groupListArray[num].GroupName).replace(/\s/g, '&nbsp;'));
            } else {
                $('#cur_group_type').html(resolveXMLEntityReference($('#txtEditorGroup').val()).replace(/\s/g, '&nbsp;'));
            }
        }

        pb_getLocalContactList();
    });
    $('#pb_delete_group').live('click', function() {
        var groupID = pb_getLocalHrefNum($(this).parents('li'));
        $('#pop_confirm').die('click');
        showConfirmDialog(common_confirm_delete_list_item, function() {
            pb_clearDialog();
            pb_deleteGroup(groupID);
        }, function() {
        });
    });
    $('#pb_editor_group').live('click', function() {
        if (!$('.menu_group input').size()) {
            $('#btn_new_contact').unbind('click');
            $('#btn_pb_import').unbind('click');
            pb_localShowEditorGroup(this);
        }
    });
    /*$('#btn_more').click(function() {
     pb_showMoreOption();
     return false;
     });*/

    $('#btn_pb_import').click( function() {
        pb_localCopySimContact();
        return false;
    });
    // 保存电话本记录，支持快捷键Enter
    $('#txtFormattedName, #txtMobilePhone, #txtHomePhone, #txtWorkPhone, #txtWorkEmail')
    .live('keydown', function(event) {
        // Enter Key
        if (13 == event.keyCode) {
            pb_checkName($('#txtFormattedName'));
            $('#btn_save_contact').trigger('click');
        }
    });
}

/*
 * UI向SDK传递电话本记录各个字段的最大长度
 */
function pb_sent_record_maxlength() {
    //下发pb-import-length命令，向SDK传递各字段长度;
    var maxLength = {
        Field_FormattedName: g_pb_feature.max_name_size,
        Field_MobilePhone: g_pb_feature.max_phone_size,
        Field_HomePhone: g_pb_feature.max_phone_size,
        Field_WorkPhone: g_pb_feature.max_phone_size,
        Field_WorkEmail: g_pb_feature.max_email_size
    };
    var submitData = pb_local_object2xml('request', maxLength);
    submitData = submitData.replace(/(Value)/g, 'Length');
    saveAjaxData('api/pb/pb-import-length', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            return;
        } else {
            log.error('PB: post api/pb/pb-import-length data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            log.error('PB: post api/pb/pb-import-length file failed');
        }
    });
}

/*
 * 控制按钮的显示隐藏
 */
function pb_controlBtnShow($case) {
    switch ($case) {
        case 'show_detail':
            $('#span_btn_save_contact').hide();
            $('#span_btn_del_contact_b').show();
            button_enable('btn_del_contact_b', 1);
            $('#span_btn_edit_contact').show();
            $('#span_btn_cancel_contact').hide();
            break;
        case 'hide_all':
            $('#span_btn_save_contact').hide();
            $('#span_btn_del_contact_b').hide();
            $('#span_btn_edit_contact').hide();
            $('#span_btn_cancel_contact').hide();
            break;
        case 'show_edit':
            $('#span_btn_save_contact').show();
            $('#span_btn_del_contact_b').hide();
            $('#span_btn_edit_contact').hide();
            $('#span_btn_cancel_contact').show();
            break;
        default:
            break;
    }
}

/*
 * 初始化翻页
 */
function pb_initPagination() {
    if (g_pb_curContactSum > 0) {
        g_pb_totalPbPage = Math.ceil(g_pb_curContactSum / g_pb_local_contact_list_request.ReadCount);
        g_pb_pageIndex = Math.min(g_pb_pageIndex, g_pb_totalPbPage);
        var curPbPage = g_pb_pageIndex + '/' + g_pb_totalPbPage;
        $('#curPbPage').text(curPbPage);
        pb_createPageNav();
        $('.pb_pagination div').show();
    } else {
        $('.pb_pagination div').hide();
    }
}

/*
 * 创建翻页
 */
function pb_createPageNav() {
    var page_number = '';
    var aContent = 0;

    //to begin or end href
    var pageBeginHref = '';
    var pageLastHref = '';
    pageBeginHref = g_pb_pageIndex == 1 ? 'javascript:void(0);' : "javascript:pb_pageNav('first')";
    pageLastHref = g_pb_pageIndex >= g_pb_totalPbPage ? 'javascript:void(0);' : "javascript:pb_pageNav('last')";
    $('#pageBegin').attr('href', pageBeginHref);
    $('#pageLast').attr('href', pageLastHref);
    //to previous or next page
    var prePageHref = '';
    var nextPageHref = '';
    prePageHref = g_pb_pageIndex == 1 ? 'javascript:void(0);' : "javascript:pb_pageNav('prePage')";
    nextPageHref = g_pb_pageIndex >= g_pb_totalPbPage ? 'javascript:void(0);' : "javascript:pb_pageNav('nextPage')";
    $('#prePage').attr('href', prePageHref);
    $('#nextPage').attr('href', nextPageHref);

    // to make page index number
    var beginPage = 0, endPage = 0, pageSize = 5;
    g_pb_pageIndex = parseInt(g_pb_pageIndex, 10);
    if (g_pb_pageIndex + parseInt(pageSize / 2, 10) >= g_pb_totalPbPage) {
        endPage = g_pb_totalPbPage;
        beginPage = endPage - pageSize + 1 > 1 ? endPage - pageSize + 1 : 1;
    } else if (g_pb_pageIndex <= parseInt(pageSize / 2, 10)) {
        beginPage = 1;
        endPage = beginPage + pageSize - 1 > g_pb_totalPbPage ? g_pb_totalPbPage : beginPage + pageSize - 1;
    } else {
        beginPage =
        g_pb_pageIndex - parseInt(pageSize / 2, 10) > 1 ? g_pb_pageIndex - parseInt(pageSize / 2, 10) : 1;
        endPage =
        g_pb_pageIndex + parseInt(pageSize / 2, 10) > g_pb_totalPbPage ? g_pb_totalPbPage : g_pb_pageIndex + parseInt(pageSize / 2, 10);
    }

    var i = 0;
    if ('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
        for (i = endPage; i >= beginPage; i--) {
            aHref = i == g_pb_pageIndex ? ' href=\"javascript:void(0);\"' : " href=\"javascript:pb_pageNav('" + i + "')\" style=\"text-decoration:underline\"";
            page_number += '<a ' + aHref + '>' + i + '</a>';
        }
    } else {
        for (i = beginPage; i <= endPage; i++) {
            aHref = i == g_pb_pageIndex ? ' href=\"javascript:void(0);\"' : " href=\"javascript:pb_pageNav('" + i + "')\" style=\"text-decoration:underline\"";
            page_number += '<a ' + aHref + '>' + i + '</a>';
        }
    }

    $('#page_num').html(page_number);
}

/*
 * 跳转到指定页
 */
function pb_pageNav(to) {
    switch (to) {
        case 'first':
            g_pb_pageIndex = 1;
            break;
        case 'last':
            g_pb_pageIndex = g_pb_totalPbPage;
            break;
        case 'prePage':
            g_pb_pageIndex--;
            break;
        case 'nextPage':
            g_pb_pageIndex++;
            break;
        default:
            g_pb_pageIndex = to;
            break;
    }
    $(document).scrollTop(0);
    pb_initPage();
    $('#jump_page_index').val('');
}

/*
 * 查询本地电话本联系人数量
 */
function pb_getLocalCount() {
    getAjaxData('api/pb/pb-count', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_pb_local_count.LocalUsed = ret.response.LocalUsed;
            g_pb_local_count.SimUsed = ret.response.SimUsed;
            g_pb_local_count.LocalMax = ret.response.LocalMax;
            g_pb_local_count.SimMax = ret.response.SimMax;
            $('#all_contacts_count').text(g_pb_local_count.LocalUsed);
        } else {
            showInfoDialog(common_error);
            log.error('PB: get api/pb/pb-count data error');
        }
        $('#all_contacts_count').text(g_pb_local_count.LocalUsed);
    }, {
        sync: true,
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_error);
            log.error('PB: get api/pb/pb-count file failed');
        }
    });
}

/*
 * 查询群组列表
 */
function pb_getLocalGroupList($case) {
    var submitData = '';
    g_pb_local_group_list_request.ReadCount = g_pb_feature.max_group_size;
    submitData = object2xml('request', g_pb_local_group_list_request);
    saveAjaxData('api/pb/group-list', submitData, function($xml) {
        var ret = xml2object($xml);
        g_pb_groupListArray = [];
        if (ret.type == 'response') {
            if (ret.response.Groups.Group) {
                if ($.isArray(ret.response.Groups.Group)) {
                    g_pb_groupListArray = ret.response.Groups.Group;
                } else {
                    g_pb_groupListArray.push(ret.response.Groups.Group);
                }
            }
            if ($case != 'not_update_count') {
                g_pb_curGroupCount = ret.response.Count;
            }
        } else {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/group-list data error');
        }
        if ($case == 'count_only') {
            pb_updateLocalGroupContactNum();
        } else {
            pb_showLocalGroupList($case);
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/group-list file failed');
            pb_showLocalGroupList($case);
        }
    });
}

/*
 * 查询电话本记录列表
 */
function pb_getLocalContactList() {
    var submitData = '';
    g_pb_local_contact_list_request.GroupID = g_pb_curGroupId;
    g_pb_local_contact_list_request.PageIndex = g_pb_pageIndex;
    g_pb_local_contact_list_request.ReadCount = g_pb_feature.page_size;
    if (!$('#pb_search').hasClass('pb_search_init')) {
        var searchKey = $.trim($('#pb_search').val());
        g_pb_local_contact_list_request.KeyWord =
        resolveXMLEntityReference(searchKey);
        $('#pb_search').val(searchKey);
    } else {
        g_pb_local_contact_list_request.KeyWord = '';
    }
    submitData = object2xml('request', g_pb_local_contact_list_request);
    saveAjaxData('api/pb/pb-list', submitData, function($xml) {
        var ret = pb_local_xml2object($xml);
        if (ret.type == 'response') {
            g_pb_contactListArray = [];
            if (ret.response.Phonebooks.Phonebook) {
                if ($.isArray(ret.response.Phonebooks.Phonebook)) {
                    g_pb_contactListArray = ret.response.Phonebooks.Phonebook;
                } else {
                    g_pb_contactListArray.push(ret.response.Phonebooks.Phonebook);
                }
                pb_showLocalContactList();
            } else {
                //showInfoDialog(common_failed);
                log.error('PB: post api/pb/pb-list file failed');
            }
            g_pb_curContactSum = ret.response.SumSize;
            pb_initPagination();
        } else {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-list data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-list file failed');
        }
    });
}

/*
 * 本地电话本新增联系人
 */
function pb_localAddContact() {
    if (!pb_checkContactDetail()) {
        button_enable('btn_save_contact', 1);
        return false;
    }

    var phonebook = {
        GroupID: $('#hiddenGroupID').val(),
        SaveType: 0,
        Field_FormattedName: resolveXMLEntityReference($('#txtFormattedName').val()),
        Field_MobilePhone: $('#txtMobilePhone').val(),
        Field_HomePhone: $('#txtHomePhone').val(),
        Field_WorkPhone: $('#txtWorkPhone').val(),
        Field_WorkEmail: resolveXMLEntityReference($('#txtWorkEmail').val())
    };

    var submitData = pb_local_object2xml('request', phonebook);
    saveAjaxData('api/pb/pb-new', submitData, function($xml) {
        var ret = pb_local_xml2object($xml);
        if (ret.type == 'response') {
            pb_initPage();
            // 回显联系人信息
            g_pb_curPhoneBook = ret.response;
            pb_showLocalContactsDetail(-1);
            pb_controlBtnShow('show_detail');
        } else {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-new data error');
        }
        button_enable('btn_save_contact', 1);
        startLogoutTimer();
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-new file failed');
            button_enable('btn_save_contact', 1);
        }
    });
}

/*
 * 本地电话本修改联系人
 */
function pb_localEditContact() {
    if (!pb_checkContactDetail()) {
        button_enable('btn_save_contact', 1);
        return false;
    }

    var phonebook = {
        GroupID: $('#hiddenGroupID').val(),
        Index: $('#hiddenIndex').val(),
        SaveType: 0,
        Field_FormattedName: resolveXMLEntityReference($('#txtFormattedName').val()),
        Field_MobilePhone: $('#txtMobilePhone').val(),
        Field_HomePhone: $('#txtHomePhone').val(),
        Field_WorkPhone: $('#txtWorkPhone').val(),
        Field_WorkEmail: resolveXMLEntityReference($('#txtWorkEmail').val())
    };

    var submitData = pb_local_object2xml('request', phonebook);
    saveAjaxData('api/pb/pb-update', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            // 回显联系人信息
            g_pb_curPhoneBook = {
                GroupID: phonebook.GroupID,
                Index: phonebook.Index,
                SaveType: 0,
                FormattedName: $('#txtFormattedName').val(),
                MobilePhone: phonebook.Field_MobilePhone,
                HomePhone: phonebook.Field_HomePhone,
                WorkPhone: phonebook.Field_WorkPhone,
                WorkEmail: $('#txtWorkEmail').val()
            };
            pb_initPage();
            pb_showLocalContactsDetail(-1);
            pb_controlBtnShow('show_detail');
        } else {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-update data error');
        }
        button_enable('btn_save_contact', 1);
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-update file failed');
            button_enable('btn_save_contact', 1);
        }
    });
}

/*
 * 本地电话本删除联系人
 */
function pb_localDeleteContact(index) {
    var checkedList = '';
    var delCount = 0;
    var allCheckBox = $('#list_contacts :checkbox');

    if (index) {
        delCount++;
        checkedList += '<Index>' + index + '</Index>';
    } else {
        allCheckBox.filter(':checked').each( function() {
            delCount++;
            checkedList += '<Index>' + this.value + '</Index>';
        });
    }

    var submitData = object2xml('request', checkedList);
    saveAjaxData('api/pb/pb-delete', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            if ((delCount == allCheckBox.length) && (g_pb_pageIndex > 1)) {
                g_pb_pageIndex = Math.min(g_pb_pageIndex, g_pb_totalPbPage - 1);
            }
        }
        pb_initPage();
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            button_enable('btn_del_contact', 1);
            button_enable('btn_del_contact_b', 1);
            log.error('PB: post api/pb/pb-delete file failed');
        }
    });
}

/*
 * 本地电话本发送短信
 */
function pb_localSendMsg(number) {
    var numberFlag = false;
    var url;
    if(g_sms_mode == 1) {
        url = 'smsandroid.html?url&number=';
    } else {
        url = 'smsinbox.html?url&number=';
    }
    var split = ';';
    var allCheckBox = $('#list_contacts :checkbox');

    if (number) {
        url += number + split;
        numberFlag = true;
    } else {
        allCheckBox.filter(':checked').each( function() {
            var li = $(this).parents('li');
            var phonebook = g_pb_contactListArray[pb_getLocalHrefNum(li)];
            if (phonebook.MobilePhone) {
                numberFlag = true;
                url += phonebook.MobilePhone.substr(0,g_pb_feature.max_phone_size) + split;
            } else if (phonebook.HomePhone) {
                numberFlag = true;
                url += phonebook.HomePhone.substr(0,g_pb_feature.max_phone_size) + split;
            } else if (phonebook.WorkPhone) {
                numberFlag = true;
                url += phonebook.WorkPhone.substr(0,g_pb_feature.max_phone_size) + split;
            }
        });
    }
    if(numberFlag) {
        if (url.match('#')) {
            url = url.replace(/\#/g, '%23');
        }
        //window.open(url);
        window.location.href = url;
        button_enable('btn_send_msg', 1);
    } else {
        showInfoDialog(IDS_pb_send_sms);
    }
}

/*
 * 复制SIM卡联系人
 */
function pb_localCopySimContact() {
    if (0 == g_pb_local_count.SimUsed) {
        pb_getLocalCount();
    }
    if (0 == g_pb_local_count.SimUsed) {
        showInfoDialog(strid_pb_hint_import_none);
        return;
    }
    if (parseInt(g_pb_local_count.LocalUsed, 10) >=
    parseInt(g_pb_local_count.LocalMax, 10)) {
        showInfoDialog(strid_pb_hint_no_room);
        return;
    }

    $('#pop_confirm').die('click');
    showConfirmDialog(strid_pb_hint_import_sim_conform, function() {
        $('.dialog').remove();
        var groupID = 0;
        var Class = $('#pb_group_list :first-child').attr('class');
        if ('' == $.trim(Class)) {
            var span = $('#pb_group_list .click').find('span');
            var num = pb_getLocalHrefNum(span);
            groupID = g_pb_groupListArray[num].GroupID;
        }
        pb_showWaitingDialog(common_waiting, strid_pb_hint_import_sim_doing.replace('%d', g_pb_local_count.SimUsed));
        var request = {
            GroupID: groupID
        };
        var submitData = object2xml('request', request);
        saveAjaxData('api/pb/pb-copySIM', submitData, function($xml) {
            var ret = xml2object($xml);
            pb_closeWaitingDialog();
            if (ret.type == 'response') {
                var totalNum = parseInt(ret.response.TotalNum, 10);
                var succeedNum = parseInt(ret.response.SucceedNum, 10);
                var failedNum = totalNum - succeedNum;
                var copyResultDialogHtml = '';
                if (0 == ret.response.FULL) {
                    copyResultDialogHtml =
                    pb_copy_complete + '&nbsp;' + succeedNum + '&nbsp;' + common_succeed + common_comma + failedNum + '&nbsp;' + common_failed;
                } else {
                    copyResultDialogHtml = pb_local_full + '&nbsp;' + succeedNum + '&nbsp;' + common_succeed + common_comma + failedNum + '&nbsp;' + common_failed;
                }
                showInfoDialog(copyResultDialogHtml);
            } else {
                showInfoDialog(common_failed);
            }
            pb_initPage();
        }, {
            timeout: g_PB_TIMEOUT_LONG,
            errorCB: function() {
                pb_closeWaitingDialog();
                showInfoDialog(common_failed);
            }
        });
    }, function() {
    });
}

/*
 * 导出联系人
 */
function pb_localExportContact(exportAll) {
    var checkedList = '';
    var exportCount = 0;
    if (exportAll) {
        if (0 == g_pb_local_count.LocalUsed) {
            showInfoDialog(common_no_record);
            return;
        }
        checkedList += '<Indexs>all</Indexs>';
        exportCount = g_pb_local_count.LocalUsed;
    } else {
        var checkedBox = $('#list_contacts :checkbox').filter(':checked');
        if (0 == checkedBox.length) {
            showInfoDialog(common_no_record_selected);
            return;
        }
        checkedList += '<Indexs>';
        checkedBox.each( function() {
            checkedList += '<Index>' + this.value + '</Index>';
        });
        checkedList += '</Indexs>';
        exportCount = checkedBox.length;
    }
    checkedList += '<SaveType>0</SaveType>';
    checkedList += '<FileType>csv</FileType>';

    $('#pop_confirm').die('click');
    showConfirmDialog((exportAll ? pb_export_all_contacts_confirm : pb_export_sel_contacts_confirm), function() {
        $('.dialog').remove();
        pb_showWaitingDialog(common_waiting, strid_pb_hint_export_doing.replace('%d', exportCount));
        var submitData = object2xml('request', checkedList);
        saveAjaxData('api/pb/pb-export', submitData, function($xml) {
            var ret = xml2object($xml);
            pb_closeWaitingDialog();
            if (isAjaxReturnOK(ret)) {
                if ($.browser.mozilla) {
                    window.open(g_pb_feature.export_csv_path);
                } else {
                    window.location.href = g_pb_feature.export_csv_path;
                }
            } else {
                showInfoDialog(common_failed);
            }
        }, {
            timeout: g_PB_TIMEOUT_LONG,
            errorCB: function() {
                pb_closeWaitingDialog();
                showInfoDialog(common_failed);
            }
        });
    }, function() {
    });
}

/*
 * 导入文件
 */
function pb_importFile() {
    var groupID = 0; //0为群组根节点
    var Class = $('#pb_group_list :first-child').attr('class');
    if ('' == $.trim(Class)) {
        var span = $('#pb_group_list .click').find('span');
        var num = pb_getLocalHrefNum(span);
        groupID = g_pb_groupListArray[num].GroupID;
    }

    var importFile = {
        GroupID: groupID,
        SaveType: 0,
        FileType: 'csv'
    };
    var submitData = object2xml('request', importFile);
    saveAjaxData('api/pb/pb-import', submitData, function($xml) {
        var ret = xml2object($xml);
        pb_closeWaitingDialog();
        if (ret.type == 'response') {
            var totalNum = ret.response.TotalNum;
            var succeedNum = ret.response.SucceedNum;
            var copyResultDialogHtml = '';
            if (0 == ret.response.FULL) {
                copyResultDialogHtml =
                pb_copy_complete + '&nbsp;' + pb_total_count + '&nbsp;' + totalNum + pb_success_count + '&nbsp;' + succeedNum;
            } else {
                copyResultDialogHtml = pb_local_full + '&nbsp;' + pb_success + '&nbsp;' + succeedNum;
            }
            showInfoDialog(copyResultDialogHtml);
        } else {
            showInfoDialog(common_failed);
        }
        pb_initPage();
    }, {
        timeout: g_PB_TIMEOUT_IMPORT,
        errorCB: function() {
            pb_closeWaitingDialog();
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb_import File failed');
            pb_initPage();
        }
    });
}

function pb_matchFieldMap() {
    //下发pb-import-match命令，并根据得到的反馈结果，进行导出的操作;
    var matchResult = {
        Field_FormattedName: g_pb_fieldMap[0],
        Field_MobilePhone: g_pb_fieldMap[1],
        Field_HomePhone: g_pb_fieldMap[2],
        Field_WorkPhone: g_pb_fieldMap[3],
        Field_WorkEmail: g_pb_fieldMap[4]
    };
    var submitData = pb_local_object2xml('request', matchResult);
    submitData = submitData.replace(/(Value)/g, 'ImportName');
    saveAjaxData('api/pb/pb-import-match', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            pb_showWaitingDialog(strid_sms_label_import, strid_pb_hint_import_file_doing);
            pb_importFile();
            return;
        } else {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-import-match data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/pb-import-match file failed');
        }
    });
}

function pb_showFieldMapDlg() {
    var i = 0;
    var listli = "<option value=''></option>";
    var mapName = g_pb_fieldMap[0];
    var mapMPhone = g_pb_fieldMap[1];
    var mapHPhone = g_pb_fieldMap[2];
    var mapOPhone = g_pb_fieldMap[3];
    var mapEmail = g_pb_fieldMap[4];

    for (i = 0; i < g_pb_fieldCount; i++) {
        if ('' != g_pb_fieldMap[i]) {
            listli = listli + "<option value='" + g_pb_fieldMap[i] + "'>" + g_pb_fieldMap[i] + '</option>';
        }
    }
    var fieldmaphtml = "<div id='field_map_title' height='25px'>" + pb_field_tips + '</div>' +
    "<table id='pb_import_field'>" +
    "<tr height='50px'><td  class='pb_field_match'>" + common_name + ':</td>' +
    "<td><select id='name_map_select' class='input_select'>" +
    listli +
    '</select>' +
    '</td></tr>' +

    "<tr height='50px'><td class='pb_field_match'>" + pb_label_mobile_phone + ':</td>' +
    "<td><select id='mphone_map_select' class='input_select'>" +
    listli +
    '</select>' +
    '</td></tr>' +

    "<tr height='50px'><td class='pb_field_match'>" + pb_label_home_phone + ':</td>' +
    "<td><select id='hphone_map_select' class='input_select'>" +
    listli +
    '</select>' +
    '</td></tr>' +

    "<tr height='50px'><td class='pb_field_match'>" + pb_label_office_phone + ':</td>' +
    "<td><select id='ophone_map_select' class='input_select'>" +
    listli +
    '</select>' +
    '</td></tr>' +

    "<tr height='50px'><td class='pb_field_match'>" + pb_label_email + ':</td>' +
    "<td><select id='email_map_select' class='input_select'>" +
    listli +
    '</select>' +
    '</td></tr>' +

    '</table>' +
    "<div height='20px'>&nbsp;</div>" +
    "<div height='20px'>&nbsp;</div>";

    cancelLogoutTimer();
    call_dialog(pb_field_map, fieldmaphtml, common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    $('#name_map_select').val(mapName);
    $('#mphone_map_select').val(mapMPhone);
    $('#hphone_map_select').val(mapHPhone);
    $('#ophone_map_select').val(mapOPhone);
    $('#email_map_select').val(mapEmail);

    $('#pop_OK').bind('click', function() {
        if (!isButtonEnable('pop_OK')) {
            return;
        }
        startLogoutTimer();
        g_pb_fieldMap[0] = $('#name_map_select').val();
        g_pb_fieldMap[1] = $('#mphone_map_select').val();
        g_pb_fieldMap[2] = $('#hphone_map_select').val();
        g_pb_fieldMap[3] = $('#ophone_map_select').val();
        g_pb_fieldMap[4] = $('#email_map_select').val();
        $('#div_wrapper,.dialog').hide();
        pb_matchFieldMap();
    });
    $('#pop_Cancel').bind('click', function() {
        startLogoutTimer();
    });
}

function pb_importMap() {
    getAjaxData('api/pb/pb-import-field', function($xml) {
        var ret = xml2object($xml);
        pb_closeWaitingDialog();
        if (ret.type == 'response') {
            if (1 == ret.response.FieldMatch) {
                pb_showWaitingDialog(strid_sms_label_import, strid_pb_hint_import_file_doing);
                pb_importFile();
                return;
            } else {
                g_pb_fieldCount = ret.response.Fields.Count;
                g_pb_fieldMap = [];
                var i = 0;
                for (i = 0; i < g_pb_fieldCount; i++) {
                    g_pb_fieldMap[i] = ret.response.Fields.Name[i];
                }
                if (1 == g_pb_fieldCount) {
                    g_pb_fieldMap[0] = ret.response.Fields.Name;
                }
                if (5 > g_pb_fieldCount) {
                    for (i = g_pb_fieldCount; i < 5; i++) {
                        g_pb_fieldMap[i] = '';
                    }
                }
                pb_showFieldMapDlg();
            }
        } else {
            showInfoDialog(common_error);
            log.error('PB: get api/pb/pb-import-field data error');
        }
        $('#all_contacts_count').text(g_pb_local_count.LocalUsed);
    }, {
        sync: true,
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            pb_closeWaitingDialog();
            showInfoDialog(common_error);
            log.error('PB: get api/pb/pb-import-field file failed');
        }
    });
}

/*
 * 上传文件
 */
function pb_uploadFile() {
    pb_showWaitingDialog(common_waiting, pb_hint_get_mapfield);
    var optionst = {
        url: '../api/filemanager/upload',
        success: function(responseText, statusText) {
            if ('success' == statusText) {
                pb_importMap();
            } else {
                pb_closeWaitingDialog();
                showInfoDialog(common_error);
            }
        },
        error: function() {
            pb_closeWaitingDialog();
            showInfoDialog(common_error);
            log.error('PB: pb_uploadFile failed!');
        }
    };
    $('#form_update').ajaxSubmit(optionst);
}

/*
 * 新建群组
 */
function pb_newGroup() {
    if ('' == $.trim($('#txtNewGroup').val())) {
        showInfoDialog(pb_group_empty);
        $('#pb_add_group').empty();
        g_pb_curGroupCount--;
        setTimeout( function () {
            $('#btn_new_contact').bind('click',pb_new_contactClick());
        },1000);
        setTimeout( function () {
            $('#btn_pb_import').bind('click',pb_import_Click());
        },1000);
        return;
    }

    var group = {
        GroupName: ($.trim($('#txtNewGroup').val()))
    };

    if (pb_checkGroupExist(group.GroupName, 0)) {
        showInfoDialog(strid_pb_hint_group_exist);
        $('#pb_add_group').empty();
        g_pb_curGroupCount--;
        setTimeout( function () {
            $('#btn_new_contact').bind('click',pb_new_contactClick());
        },1000);
        setTimeout( function () {
            $('#btn_pb_import').bind('click',pb_import_Click());
        },1000);
        return;
    }

    group.GroupName = resolveXMLEntityReference(group.GroupName);
    var submitData = object2xml('request', group);
    saveAjaxData('api/pb/group-new', submitData, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            pb_clearPage('clear_group');
            pb_getLocalContactList();
            pb_getLocalGroupList('not_update_count');
        } else {
            showInfoDialog(common_failed);
            $('#pb_add_group').empty();
            g_pb_curGroupCount--;
            log.error('PB: post api/pb/group-new data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            $('#pb_add_group').empty();
            g_pb_curGroupCount--;
            log.error('PB: post api/pb/group-new file failed');
        }
    });
    $('#btn_new_contact').bind('click',pb_new_contactClick());
    $('#btn_pb_import').bind('click',pb_import_Click());
}

/*
 * 更新群组
 */
function pb_updateGroup(li, groupName) {
    var group = {
        GroupID: pb_getLocalHrefNum(li),
        GroupName: $.trim($('#txtEditorGroup').val())
    };

    if ('' == group.GroupName) {
        showInfoDialog(pb_group_empty);
        $('#txtEditorGroup').select();
        group.GroupName = groupName;
    }

    if (pb_checkGroupExist(group.GroupName, group.GroupID)) {
        showInfoDialog(strid_pb_hint_group_exist);
        if(window.navigator.userAgent.indexOf("Firefox")>0) {
            setTimeout( function() {
                $('#txtEditorGroup').focus();
            },0);
            $('.dialog_close_btn').click( function() {
                setTimeout( function() {
                    $('#txtEditorGroup').focus();
                },0);
            });
        } else {
            $('#txtEditorGroup').focus();
            $('.dialog_close_btn').click( function() {
                $('#txtEditorGroup').focus();
            });
        }
        return;
    }

    group.GroupName = resolveXMLEntityReference(group.GroupName);
    g_pb_editgroupID = group.GroupID;
    var submitData = object2xml('request', group);
    saveAjaxData('api/pb/group-update', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            pb_getLocalGroupList('edit_group');
        } else {
            showInfoDialog(common_failed);
            $('#txtEditorGroup').select();
            log.error('PB: post api/pb/group-delete data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            $('#txtEditorGroup').select();
            log.error('PB: post api/pb/group-delete file failed');
        }
    });
    $('btn_new_contact').bind('click',pb_new_contactClick());
    $('btn_pb_import').bind('click',pb_import_Click());
}

/*
 * 删除群组
 */
function pb_deleteGroup(groupID) {
    var request = {
        GroupID: groupID
    };
    var submitData = object2xml('request', request);
    saveAjaxData('api/pb/group-delete', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            pb_clearPage('clear_group');
            pb_getLocalContactList();
            pb_getLocalGroupList();
            pb_initPage();
        } else {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/group-delete data error');
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('PB: post api/pb/group-delete file failed');
        }
    });
}

/*
 * 移动联系人
 */
function pb_moveToGroup(groupId) {
    var checkedList = '';
    var moveCount = 0;
    var checkedBox = $('#list_contacts :checkbox').filter(':checked');
    checkedList += '<Indexs>';
    checkedBox.each( function() {
        checkedList += '<Index>' + this.value + '</Index>';
    });
    checkedList += '</Indexs>';
    checkedList += '<SaveType>0</SaveType>';
    checkedList += '<GroupID>' + groupId + '</GroupID>';

    var submitData = object2xml('request', checkedList);
    saveAjaxData('api/pb/pb-move', submitData, function($xml) {
        // 显示移动后的群组
        pb_getLocalGroupList('count_only');
        if (0 == groupId) {
            $('#pb_group_list li').eq(0).click();
        } else {
            $('#pb_group_list li').eq(pb_getLocalGroupListNum(groupId) + 1).click();
        }
    }, {
        timeout: g_PB_TIMEOUT_SHORT,
        errorCB: function() {
            pb_closeWaitingDialog();
            showInfoDialog(common_failed);
        }
    });

}

/*
 * 扩展菜单
 */
/*function pb_showMoreOption()
 {
 var btnList = [
 {id: 'btn_copy_from_sim', text: pb_copy_contacts_from_sim},
 {id: 'btn_import_contact', text: pb_import_contacts},
 {id: 'btn_export_sel_contact', text: pb_export_sel_contacts},
 {id: 'btn_export_all_contact', text: pb_export_all_contacts}
 ];
 var trList = '';
 $.each(btnList, function(n, btn)
 {
 trList +=
 "<tr height='30px' ><td>" +
 "   <span class='button_wrapper' id='" + btn.id + "'>" +
 "   <span class='button_left pb_button_left'>" +
 "   <span class='button_right pb_button_right'>" +
 "   <span class='button_center pb_button_center'>" +
 "   <a href='javascript:void(0);' title='" + btn.text + "'>" + btn.text + '</a>' +
 '   </span></span></span></span>' +
 '</td></tr>';
 });
 var html = "<div height='70px'>&nbsp;</div>" +
 "<table align='center'>" + trList + '</table>';

 call_dialog(common_more, html, '', 'pop_Cancel');
 $('#pop_Cancel').hide();

 $('#btn_copy_from_sim').click(function() {
 $('#pop_Cancel').click();
 pb_localCopySimContact();
 return false;
 });

 $('#btn_import_contact').click(function() {
 $('#pop_Cancel').click();
 pb_localShowImportContact();
 return false;
 });

 $('#btn_export_sel_contact').click(function() {
 $('#pop_Cancel').click();
 pb_localExportContact(false);
 return false;
 });

 $('#btn_export_all_contact').click(function() {
 $('#pop_Cancel').click();
 pb_localExportContact(true);
 return false;
 });
 }*/

/*
 * 获取链接中的数字
 */
function pb_getLocalHrefNum(_this) {
    var strHref = $(_this).attr('href');
    return strHref.match(/\d*/);
}

/*
 * 查找群组列表下标
 */
function pb_getLocalGroupListNum(groupId) {
    var i = 0;
    var num = 0;
    for (i = 0; i < g_pb_groupListArray.length; i++) {
        if (groupId == g_pb_groupListArray[i].GroupID) {
            num = i;
            break;
        }
    }
    return num;
}

/*
 * 显示联系人列表
 */
function pb_showLocalContactList() {
    $('#list_contacts').empty();
    $.each(g_pb_contactListArray, function(n, phonebook) {
        var html = vLocalShowContactList;
        html = pb_local_replaceVLocalShowContactList(html, phonebook);
        html = replaceString(html,'%href%', n);
        $('#list_contacts').append(html);
    });
    if (g_pb_contactListArray.length > 0 &&
    '' == $('#div_local_detail').html()) {
        pb_showLocalContactsDetail(0);
        pb_controlBtnShow('show_detail');
    }
}

/*
 * 更新群组联系人条数
 */
function pb_updateLocalGroupContactNum() {
    $('#pb_group_list label').each( function(n) {
        $(this).text(g_pb_groupListArray[n].Number);
    });
}

/*
 * 显示移动联系人
 */
function pb_showLocalMoveToGroup() {
    var groupList = '';
    var Class = $('#pb_group_list :first-child').attr('class');
    if ('' == $.trim(Class)) {
        groupList += vMoveAllContacts;
    }
    $.each(g_pb_groupListArray, function(n, group) {
        if (g_pb_curGroupId != group.GroupID) {
            groupList += pb_local_replaceVLocalShowMoveToGroup(vLocalShowMoveToGroup, group);
        }
    });
    var html = "<div id='pb_move_pop_title' height='25px'>" + pb_move_sel_contacts_to + '</div>' +
    "<table align='center' class='pb_move_pop_table'>" + groupList + '</table>' +
    "<div height='25px'>&nbsp;</div>";
    call_dialog(common_move, html, common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    button_enable('pop_OK', '0');
    $('input[name=radioGroup]').bind('click', function() {
        button_enable('pop_OK', '1');
    });
    // 移动联系人
    $('#pop_OK').live('click', function() {
        if (!isButtonEnable('pop_OK')) {
            return;
        }
        $('#div_wrapper,.dialog').hide();
        pb_moveToGroup($('input[name=radioGroup]:checked').val());
        return false;
    });
}

/*
 * 显示群组列表
 */
function pb_showLocalGroupList($case) {
    $('#pb_group_list').empty();
    $('#pb_group_list').append(vLocalAllContacts);
    $('#all_contacts_count').text(g_pb_local_count.LocalUsed);
    if ('edit_group' != $case) {
        $('#cur_group_type').html(pb_label_all_contacts);
        $('#pb_group_list li').removeClass('click');
        $('#pb_group_list li').addClass('click');
    }
    $.each(g_pb_groupListArray, function(n, group) {
        var html = pb_local_replaceVLocalShowGroupList(vLocalShowGroupList, group);
        html = replaceString(html,'%NumberVLocalShowGroupList%', n);
        $('#pb_group_list').append(html);
    });
    if ('edit_group' == $case) {
        g_pb_editgroupFlag = true;
        $('#pb_group_list li.margin_b').eq(pb_getLocalGroupListNum(g_pb_editgroupID)).click();
    }
    g_pb_editgroupFlag = false;
    clickMenu('menu_pb');

    $('#pb_group_list img').hide(); /* For 阿拉伯语 */
    $('#pb_group_list li').bind('mouseover', function() {
        $(this).find('label').hide();
        $(this).find('img').fadeTo('normal', 1, function() {
            $(this).find('img').show();
        });
    });
    $('#pb_group_list li').bind('mouseleave', function() {
        $(this).find('img').hide();
        $(this).find('label').show();
    });
}

/*
 * 显示联系人详细信息
 */
function pb_showLocalContactsDetail(n) {
    var html = pb_localFillContactInfo(n, vLocalShowContact);
    html = replaceString(html,'%Num%', n);
    g_pb_selectListNum = n;
    $('#div_local_detail').html(html);
    $('.pb_table_details img').hide(); /* For 阿拉伯语 */
    $('.pb_pre').each( function() {
        if ('' != $.trim($(this).text())) {
            $(this).find('img').show();
            $(this).find('a').show();
        }
    });
}

/*
 * 显示添加联系人
 */
function pb_localShowAddContact() {
    var html = '';
    $('#div_local_detail').html(get_vLocalAddContact());
    var Class = $('#pb_group_list :first-child').attr('class');
    if ('' == $.trim(Class)) {
        var groupID = $('#pb_group_list .click').attr('href');
        $('#hiddenGroupID').attr('value', groupID);
    }
    $('#txtFormattedName').focus();
}

/*
 * 显示编辑联系人
 */
function pb_localShowEditContact(n) {
    var phonebook = -1 == n ? g_pb_curPhoneBook : g_pb_contactListArray[n];
    var html = pb_local_replaceVLocalModifyContact(get_vLocalModifyContact(), phonebook);
    $('#div_local_detail').html(html);
    /*
     * 防止替换时发生错误
     */
    if(phonebook.WorkEmail.length <= g_pb_feature.max_email_size) {
        $('#txtWorkEmail').val(phonebook.WorkEmail);
    } else {
        $('#txtWorkEmail').val((phonebook.WorkEmail).substr(0,g_pb_feature.max_email_size));
    }

    $('#txtFormattedName').focus();

    g_pb_nameLength = utf8_strlen(phonebook.FormattedName);
    if(g_pb_nameLength <= g_pb_feature.max_name_size) {
        $('#txtFormattedName').val(phonebook.FormattedName);
    } else {
        g_pb_nameNumber = utf8_str_id(phonebook.FormattedName,g_pb_feature.max_name_size);

        $('#txtFormattedName').val((phonebook.FormattedName).substr(0,g_pb_nameNumber) );
    }

}

/*
 * 填充联系人信息
 */
function pb_localFillContactInfo(n, src) {
    var phonebook = -1 == n ? g_pb_curPhoneBook : g_pb_contactListArray[n];
    return pb_local_replaceVLocalShowContact(src, phonebook);
}

/*
 * 显示导入联系人
 */
function pb_localShowImportContact() {
    if (parseInt(g_pb_local_count.LocalUsed, 10) >=
    parseInt(g_pb_local_count.LocalMax, 10)) {
        showInfoDialog(strid_pb_hint_no_room);
        return;
    }

    call_dialog(strid_import_contacts, vLocalImportContact,
    strid_sms_label_import, 'pop_OK',
    common_cancel, 'pop_Cancel');
    button_enable('pop_OK', '0');

    $('#pop_OK').bind('click', function() {
        if (!isButtonEnable('pop_OK')) {
            return;
        }
        $('#div_wrapper,.dialog').hide();
        /*
         var uploadFileName = $("#up_nodite").val();
         if(uploadFileName.indexOf("\\") > -1)
         {
         uploadFileName = uploadFileName.substring(uploadFileName.lastIndexOf("\\")+1);
         }
         */
        $('#hilink_uploadpath').val('FS:' + 'contacts.csv');
        pb_uploadFile();
    });
}

/*
 * 显示新建群组
 */
function pb_localShowNewGroup() {
    if (parseInt(g_pb_curGroupCount, 10) >=
    parseInt(g_pb_feature.max_group_size, 10)) {
        showInfoDialog(strid_pb_group_hint_no_room);
        setTimeout( function () {
            $('#btn_new_contact').bind('click',pb_new_contactClick());
        },1000);
        setTimeout( function () {
            $('#btn_pb_import').bind('click',pb_import_Click());
        },1000);
        return;
    }
    g_pb_curGroupCount++; // 防止因网络延时引起的群组数量大于最大值

    $('#pb_add_group').append(get_vLocalNewGroup());
    $('#txtNewGroup').select();
    $('#txtNewGroup').focus();
    $('#txtNewGroup').bind('blur', function() {
        if(g_pb_status == 0 ) {
            pb_newGroup();
            g_pb_status = 1;
        }

    });
    $('#txtNewGroup').bind('keydown', function(event) {
        // Enter Key
        if (13 == event.keyCode) {
            if(g_pb_status == 0 ) {
                pb_newGroup();
                g_pb_status = 1;
            }
        }
    });
}

/*
 * 显示编辑群组
 */
function pb_localShowEditorGroup(_this) {
    var li = $(_this).parents('li');
    var span = li.find('span');
    var num = pb_getLocalHrefNum(span);
    var groupName = g_pb_groupListArray[num].GroupName;

    $(span).empty();
    $(li.find('a')).remove();
    $(li.find('p')).remove(); // 清除编辑按钮
    $(li).append(get_vLocalEditorGroup());
    $('#txtEditorGroup').val(groupName);
    $('#txtEditorGroup').focus();
    $('#txtEditorGroup').select();

    $('#txtEditorGroup').bind('blur', function() {
        pb_updateGroup(li, groupName);
    });
    $('#txtEditorGroup').bind('keydown', function(event) {
        // Enter Key
        if (13 == event.keyCode) {
            pb_updateGroup(li, groupName);
        }
    });
}

/*
 * 将对话框销毁（规避对话框二次弹出）
 */
function pb_clearDialog() {
    $('.dialog').fadeOut( function() {
        $('.dialog').remove();
    });
}

/*
* Local PhoneBook Check Valid Interface.
*/
// 通用验证函数
function pb_checkRgExp(str, rgExp, maxLength) {
    var bRet = true;
    if (maxLength) {
        if (str.length > maxLength) {
            bRet = false;
            return bRet;
        }
    }
    if ((0 == str.length) || (!str.match(rgExp))) {
        bRet = false;
    }
    return bRet;
}

// 计算UTF8字符串占用字节数(传入的字符串必须是UTF8编码)
function utf8_strlen(str) {
    var iLength = 0;
    var i = 0;
    for (i = 0; i < str.length; i++) {
        var value = str.charCodeAt(i);
        if (value < 0x080) {
            iLength += 1;
        } else if (value < 0x0800) {
            iLength += 2;
        } else {
            iLength += 3;
        }
    }
    return iLength;
}

// 姓名验证
function pb_checkName(_this) {
    return;
    /*
     var value = $(_this).val();
     var size = 0;
     for (var i = 0; i< value.length; i++)
     {
     var c = value.charAt(i);
     size += utf8_strlen(c);
     if (size > g_pb_feature.max_name_size)
     {
     $(_this).val(value.substr(0,i));
     return;
     }
     }
     */
}

// 姓名长度验证
function pb_checkNameLength(_this) {
    $('#' + $(_this).attr('id') + '_error').text('');
    var value = $.trim($(_this).val());
    var sizeName = 0;
    var i = 0;
    $(_this).val(value);
    for (i = 0; i < value.length; i++) {
        var c = value.charAt(i);
        sizeName += utf8_strlen(c);
    }
    if (g_pb_feature.max_name_size < sizeName) {
        $('#' + $(_this).attr('id') + '_error').text(IDS_sms_hint_content_too_long);
        $(_this).focus();
        return false;
    }
    if (value.indexOf(';') != -1) {
        $('#' + $(_this).attr('id') + '_error').text(IDS_pb_name_valid_char);
        $(_this).focus();
        return false;
    }
    return true;
}

// 电话号码验证
function pb_checkPhoneNumber(_this) {
    $('#' + $(_this).attr('id') + '_error').text('');
    $(_this).val($.trim($(_this).val()));
    if ('' == $(_this).val()) {
        return true;
    }

    var rgExp = /^[+]{0,1}[*#0123456789]*$/;
    var maxLength = g_pb_feature.max_phone_size;
    if (!pb_checkRgExp($(_this).val(), rgExp, maxLength)) {
        $('#' + $(_this).attr('id') + '_error').text(pb_hint_number_format.replace("%d", maxLength));
        $(_this).focus();
        return false;
    }

    return true;
}

// 电子邮箱地址验证
function pb_checkEmail(_this) {
    $('#' + $(_this).attr('id') + '_error').text('');
    $(_this).val($.trim($(_this).val()));
    if ('' == $(_this).val()) {
        return true;
    }

    var rgExp = /^[\x00-\x7F]*@[\x00-\x7F]*$/;
    var maxLength = g_pb_feature.max_email_size;
    if (!pb_checkRgExp($(_this).val(), rgExp, maxLength)) {
        $('#' + $(_this).attr('id') + '_error').text(pb_hint_email_format);
        $(_this).focus();
        return false;
    }

    return true;
}

// 验证联系人详细信息
function pb_checkContactDetail() {
    if ('' == $.trim($('#txtFormattedName').val())) {
        $('#txtFormattedName').val($.trim($('#txtFormattedName').val()));
    }
    if (!pb_checkNameLength($('#txtFormattedName')) |
    !pb_checkEmail($('#txtWorkEmail')) |
    !pb_checkPhoneNumber($('#txtWorkPhone')) |
    !pb_checkPhoneNumber($('#txtHomePhone')) |
    !pb_checkPhoneNumber($('#txtMobilePhone'))) {
        return false;
    }
    if ('' == $('#txtFormattedName').val()) {
        if ('' != $('#txtMobilePhone').val()) {
            $('#txtFormattedName').val($('#txtMobilePhone').val().substr(0, g_pb_feature.max_name_size));
        } else if ('' != $('#txtHomePhone').val()) {
            $('#txtFormattedName').val($('#txtHomePhone').val().substr(0, g_pb_feature.max_name_size));
        } else if ('' != $('#txtWorkPhone').val()) {
            $('#txtFormattedName').val($('#txtWorkPhone').val().substr(0, g_pb_feature.max_name_size));
        } else {
            showInfoDialog(strid_pb_input_contact);
            $('#txtFormattedName').focus();
            return false;
        }
    }
    return true;
}

// 验证上传文件
function pb_checkUploadFileName() {
    var uploadFileName = $('#up_nodite').val();
    var rgExp = /\.csv$/i;
    if (rgExp.test(uploadFileName)) {
        clearAllErrorLabel();
        button_enable('pop_OK', '1');
    } else {
        clearAllErrorLabel();
        showErrorUnderTextbox('up_nodite', system_hint_file_name_empty);
        button_enable('pop_OK', '0');
    }
}

// 验证群组名是否重复
function pb_checkGroupExist(groupName, groupId) {
    var i = 0;
    for (i = 0; i < g_pb_groupListArray.length; i++) {
        if ((groupName == g_pb_groupListArray[i].GroupName) &&
        (groupId != g_pb_groupListArray[i].GroupID)) {
            return true;
        }
    }
    return false;
}

/*
 * Local PhoneBook API For XML Transformation.
 */
/*
 * 将电话本记录列表(XML字段)转化为对象
 */
function pb_local_xml2object($xml) {
    var obj = {};
    if ($xml.find('response').size() > 0) {
        var _response = pb_local_recursiveXml2Object($xml.find('response'));
        obj.type = 'response';
        obj.response = _response;
    } else if ($xml.find('error').size() > 0) {
        var _code = $xml.find('code').text();
        var _message = $xml.find('message').text();
        log.warn('MAIN : error code = ' + _code);
        log.warn('MAIN : error msg = ' + _message);
        obj.type = 'error';
        obj.error = {
            code: _code,
            message: _message
        };
    } else {
        obj.type = 'unknown';
    }
    return obj;
}

function pb_local_recursiveXml2Object($xml) {
    if ($xml.children().size() > 0) {
        var _obj = {};
        $xml.children().each( function() {
            if ('Field' != this.tagName) {
                var _childObj = ($(this).children().size() > 0) ?
                pb_local_recursiveXml2Object($(this)) : $(this).text();
                if (($(this).siblings().size() > 0) &&
                ($(this).siblings().get(0).tagName == this.tagName)) {
                    if (_obj[this.tagName] == null) {
                        _obj[this.tagName] = [];
                    }
                    _obj[this.tagName].push(_childObj);
                } else {
                    _obj[this.tagName] = _childObj;
                }
            } else {
                // 遍历Field节点（由Name项和Value项组成）
                _obj[$(this).find('Name').text()] =
                $(this).find('Value').text();
            }
        });
        return _obj;
    } else {
        return $xml.text();
    }
}

/*
 * 将电话本记录对象转化为XML字段
 */
function pb_local_object2xml(name, obj) {
    var xmlstr = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlstr += pb_local_recursiveObject2Xml(name, obj);
    return xmlstr;
}

function pb_local_recursiveObject2Xml(name, obj) {
    var xmlstr = '';
    if (typeof(obj) == 'string' || typeof(obj) == 'number') {
        xmlstr = _createNodeStr(name, obj);
    } else if (jQuery.isArray(obj)) {
        jQuery.each(obj, function(idx, item) {
            xmlstr += pb_local_recursiveObject2Xml(name, item);
        });
    } else if (typeof(obj) == 'object') {
        xmlstr += '<' + name + '>';
        jQuery.each(obj, function(propName, propVal) {
            var rgExp = /^Field_(.*)$/;
            if (propName.match(rgExp)) {
                xmlstr +=
                pb_local_createNodeStr(propName.replace(rgExp, '$1'), propVal);
            } else {
                xmlstr +=
                pb_local_recursiveObject2Xml(propName, propVal);
            }
        });
        xmlstr += '</' + name + '>';
    }
    return xmlstr;
}

function pb_local_createNodeStr(nodeName, nodeValue) {
    return '<Field><Name>' + nodeName + '</Name><Value>' + nodeValue + '</Value></Field>';
}

/*
 * 替换vLocalModifyContact信息
 */
function pb_local_replaceVLocalModifyContact(src, phonebook) {
    var dest = src;
    // 移动电话
    if (phonebook.MobilePhone) {
        if(phonebook.MobilePhone.length <= g_pb_feature.max_phone_size) {

            dest = replaceString(dest,'%MobilePhone%', phonebook.MobilePhone);
        } else {
            dest = replaceString(dest,'%MobilePhone%', (phonebook.MobilePhone).substr(0,g_pb_feature.max_phone_size));
        }

    } else {
        dest = replaceString(dest,'%MobilePhone%', '');
    }

    // 住宅电话
    if (phonebook.HomePhone) {
        if(phonebook.HomePhone.length <= g_pb_feature.max_phone_size) {
            dest = replaceString(dest,'%HomePhone%', phonebook.HomePhone);
        } else {
            dest = replaceString(dest,'%HomePhone%', (phonebook.HomePhone).substr(0,g_pb_feature.max_phone_size));
        }

    } else {
        dest = replaceString(dest,'%HomePhone%', '');
    }

    // 办公电话
    if (phonebook.WorkPhone) {
        if(phonebook.WorkPhone.length <= g_pb_feature.max_phone_size) {
            dest = replaceString(dest,'%WorkPhone%', phonebook.WorkPhone);
        } else {
            dest = replaceString(dest,'%WorkPhone%', (phonebook.WorkPhone).substr(0,g_pb_feature.max_phone_size));
        }

    } else {
        dest = replaceString(dest,'%WorkPhone%', '');
    }

    // 群组ID
    if (phonebook.GroupID) {
        dest = replaceString(dest,'%GroupID%', phonebook.GroupID);
    } else {
        dest = replaceString(dest,'%GroupID%', '0');
    }

    // 索引
    if (phonebook.Index) {
        dest = replaceString(dest,'%Index%', phonebook.Index);
    } else {
        dest = replaceString(dest,'%Index%', '');
    }

    return dest;
}

/*
 * 替换vLocalShowContactList信息
 */
function pb_local_replaceVLocalShowContactList(src, phonebook) {
    var dest = src;

    // 索引
    if (phonebook.Index) {
        dest = replaceString(dest,'%Index%', phonebook.Index);
    } else {
        dest = replaceString(dest,'%Index%', '');
    }

    // 姓名
    if (phonebook.FormattedName) {
        g_pb_nameLength = utf8_strlen(phonebook.FormattedName);
        if(g_pb_nameLength <= g_pb_feature.max_name_size) {
            dest = replaceString(dest,'%FormattedNameTwo%', resolveXMLEntityReference(phonebook.FormattedName).replace(/\s/g, '&nbsp;'));
        } else {
            g_pb_nameNumber = utf8_str_id(phonebook.FormattedName,g_pb_feature.max_name_size);
            afterSubstrName = (phonebook.FormattedName).substr(0,g_pb_nameNumber);
            dest = replaceString(dest,'%FormattedNameTwo%', resolveXMLEntityReference(afterSubstrName).replace(/\s/g, '&nbsp;'));
        }
    } else {
        dest = replaceString(dest,'%FormattedNameTwo%', '');
    }

    return dest;
}

function utf8_str_id(str,num) {
    var iLength = 0;
    var i = 0;
    for (i = 0; i < str.length; i++) {
        var value = str.charCodeAt(i);

        if (value < 0x080) {
            iLength += 1;
        } else if (value < 0x0800) {
            iLength += 2;
        } else {
            iLength += 3;
        }

        if(iLength > num) {
            break;
        }

    }
    return i;
}

/*
 * 替换vLocalShowContact信息
 */
function pb_local_replaceVLocalShowContact(src, phonebook) {
    var dest = src;

    // 姓名
    if (phonebook.FormattedName) {
        g_pb_nameLength = utf8_strlen(phonebook.FormattedName);
        if(g_pb_nameLength <= g_pb_feature.max_name_size) {
            dest = replaceString(dest,'%FormattedNameOne%', resolveXMLEntityReference(phonebook.FormattedName).replace(/\s/g, '&nbsp;'));
        } else {
            g_pb_nameNumber = utf8_str_id(phonebook.FormattedName,g_pb_feature.max_name_size);
            afterSubstrName = (phonebook.FormattedName).substr(0,g_pb_nameNumber);
            dest = replaceString(dest,'%FormattedNameOne%', resolveXMLEntityReference(afterSubstrName).replace(/\s/g, '&nbsp;'));
        }

    } else {
        dest = replaceString(dest,'%FormattedNameOne%', '');
    }

    // 移动电话
    if (phonebook.MobilePhone) {
        if(phonebook.MobilePhone.length <= g_pb_feature.max_phone_size) {
            dest = replaceString(dest,'%MobilePhone%', phonebook.MobilePhone);
        } else {
            dest = replaceString(dest,'%MobilePhone%', (phonebook.MobilePhone).substr(0,g_pb_feature.max_phone_size));
        }

    } else {
        dest = replaceString(dest,'%MobilePhone%', '');
    }

    // 住宅电话
    if (phonebook.HomePhone) {
        if(phonebook.HomePhone.length <= g_pb_feature.max_phone_size) {
            dest = replaceString(dest,'%HomePhone%', phonebook.HomePhone);
        } else {
            dest = replaceString(dest,'%HomePhone%', (phonebook.HomePhone).substr(0,g_pb_feature.max_phone_size));
        }

    } else {
        dest = replaceString(dest,'%HomePhone%', '');
    }

    // 办公电话
    if (phonebook.WorkPhone) {
        if(phonebook.WorkPhone.length <= g_pb_feature.max_phone_size) {
            dest = replaceString(dest,'%WorkPhone%', phonebook.WorkPhone);
        } else {
            dest = replaceString(dest,'%WorkPhone%', (phonebook.WorkPhone).substr(0,g_pb_feature.max_phone_size));
        }

    } else {
        dest = replaceString(dest,'%WorkPhone%', '');
    }

    // 电子邮箱
    if (phonebook.WorkEmail) {
        if(phonebook.WorkEmail.length <= g_pb_feature.max_email_size) {
            dest = replaceString(dest,'%WorkEmail%', resolveXMLEntityReference(phonebook.WorkEmail).replace(/\s/g, '&nbsp;'));
        } else {
            dest = replaceString(dest,'%WorkEmail%', resolveXMLEntityReference((phonebook.WorkEmail).substr(0,g_pb_feature.max_email_size)).replace(/\s/g, '&nbsp;'));
        }

    } else {
        dest = replaceString(dest,'%WorkEmail%', '');
    }

    return dest;
}

/*
 * 替换vLocalShowMoveToGroup信息
 */
function pb_local_replaceVLocalShowMoveToGroup(src, group) {
    var dest = src;

    // 群组ID
    if (group.GroupID) {
        dest = replaceString(dest,'%GroupID%', group.GroupID);
        dest = replaceString(dest,'%MoveGroupID%', group.GroupID);
    } else {
        dest = replaceString(dest,'%GroupID%', '');
        dest = replaceString(dest,'%MoveGroupID%', '');
    }

    // 群组名
    if (group.GroupName) {
        dest = replaceString(dest,'%GroupNameOne%', resolveXMLEntityReference(group.GroupName).replace(/\s/g, '&nbsp;'));
    } else {
        dest = replaceString(dest,'%GroupNameOne%', '');
    }

    return dest;
}

/*
 * 替换vLocalShowGroupList信息
 */
function pb_local_replaceVLocalShowGroupList(src, group) {
    var dest = src;

    // 群组ID
    if (group.GroupID) {
        dest = replaceString(dest,'%GroupID%', group.GroupID);
    } else {
        dest = replaceString(dest,'%GroupID%', '');
    }

    // 群组名
    if (group.GroupName) {
        dest = replaceString(dest,'%GroupNameTwo%', resolveXMLEntityReference(group.GroupName).replace(/\s/g, '&nbsp;'));
    } else {
        dest = replaceString(dest,'%GroupNameTwo%', '');
    }

    // 该群组中电话本记录条数
    if (group.Number) {
        dest = replaceString(dest,'%Number%', group.Number);
    } else {
        dest = replaceString(dest,'%Number%', '0');
    }

    return dest;
}

/*
* Local PhoneBook UI Interface.
*/
// 本地电话本添加联系人
function get_vLocalAddContact() {
    var vLocalAddContact =
    "<table class='pb_table_details' border='0' cellpadding='0' cellspacing='0'>" +
    "  <tr height='30px'>" +
    '    <th>' + common_name + common_colon + '</th>' +
    "    <td><input class='pb_input_style' type='text' id='txtFormattedName' tabindex='1' onchange='pb_checkName(this)'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtFormattedName_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_mobile_phone + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtMobilePhone' tabindex='2' maxlength='" + g_pb_feature.max_phone_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtMobilePhone_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_home_phone + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtHomePhone' tabindex='3' maxlength='" + g_pb_feature.max_phone_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtHomePhone_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_office_phone + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtWorkPhone' tabindex='4' maxlength='" + g_pb_feature.max_phone_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtWorkPhone_error'></label></td>" +
    '  </tr>' +
    '  <tr>' +
    '    <th>' + pb_label_email + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtWorkEmail' tabindex='5' maxlength='" + g_pb_feature.max_email_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtWorkEmail_error'></label></td>" +
    '  </tr>' +
    "  <input type='hidden' id='hiddenGroupID' value='0'/>" +
    '</table>';
    return vLocalAddContact;
}

// 本地电话本修改联系人
function get_vLocalModifyContact() {
    var vLocalModifyContact =
    "<table class='pb_table_details' border='0' cellpadding='0' cellspacing='0'>" +
    "  <tr height='30px'>" +
    '    <th>' + common_name + common_colon + '</th>' +
    '    <td>' +
    "      <input class='pb_input_style' type='text' id='txtFormattedName' tabindex='1' onchange='pb_checkName(this)'/>" +
    '    </td>' +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtFormattedName_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_mobile_phone + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtMobilePhone' tabindex='2' value='%MobilePhone%' maxlength='" + g_pb_feature.max_phone_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtMobilePhone_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_home_phone + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtHomePhone' tabindex='3' value='%HomePhone%' maxlength='" + g_pb_feature.max_phone_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtHomePhone_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_office_phone + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtWorkPhone' tabindex='4' value='%WorkPhone%' maxlength='" + g_pb_feature.max_phone_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtWorkPhone_error'></label></td>" +
    '  </tr>' +
    "  <tr height='30px'>" +
    '    <th>' + pb_label_email + common_colon + '</th>' +
    "    <td><input class='pb_input_style success_phone_number' type='text' id='txtWorkEmail' tabindex='5' maxlength='" + g_pb_feature.max_email_size + "'/></td>" +
    '  </tr>' +
    "  <tr height='20px'>" +
    '    <th></th>' +
    "    <td valign='top' class='pb_error_message'><label id='txtWorkEmail_error'></label></td>" +
    '  </tr>' +
    "  <input type='hidden' id='hiddenGroupID' value='%GroupID%'/>" +
    "  <input type='hidden' name='hiddenIndex' id='hiddenIndex' value='%Index%'>" +
    '</table>';
    return vLocalModifyContact;
}

// 本地电话本显示联系人详细信息
var vLocalShowContact =
"<table class='pb_table_details' border='0' cellpadding='0' cellspacing='0'>" +
"  <tr height='50px'>" +
"    <th valign='top'>" + common_name + common_colon + '</th>' +
"    <td valign='top'><pre class='pb_pre'>%FormattedNameOne%</pre></td>" +
'  </tr>' +
"  <tr height='50px'>" +
"    <th valign='top'>" + pb_label_mobile_phone + common_colon + '</th>' +
"    <td valign='top'><pre class='pb_pre success_phone_number'>%MobilePhone%<img src='../res/msg.gif'/></pre></td>" +
'  </tr>' +
"  <tr height='50px'>" +
"    <th valign='top'>" + pb_label_home_phone + common_colon + '</th>' +
"    <td valign='top'><pre class='pb_pre success_phone_number'>%HomePhone%<img src='../res/msg.gif'/></pre></td>" +
'  </tr>' +
"  <tr height='50px'>" +
"    <th valign='top'>" + pb_label_office_phone + common_colon + '</th>' +
"    <td valign='top'><pre class='pb_pre success_phone_number'>%WorkPhone%<img src='../res/msg.gif'/></pre></td>" +
'  </tr>' +
"  <tr height='50px'>" +
"    <th valign='top'>" + pb_label_email + common_colon + '</th>' +
"    <td valign='top'><pre class='pb_pre success_phone_number'>%WorkEmail%</pre></td>" +
'  </tr>' +
"  <input type='hidden' name='hiddenNum' id='hiddenNum' value='%Num%'>" +
'</table>';

// 本地电话本显示联系人列表
var vLocalShowContactList =
"<li href='%href%'>" +
"  <div id='div_checkbox'>&nbsp;&nbsp;&nbsp;<input type='checkbox' id='pb_checkbox' name='pb_checkbox' value='%Index%'/></div>" +
"  <div style='width: 163px; overflow: hidden; white-space: nowrap;'><a title='%FormattedNameTwo%' herf='javascript:void(0);'>&nbsp;&nbsp;&nbsp;%FormattedNameTwo%</a></div>" +
'</li>';

// 本地电话本显示联系人列表
var vLocalAllContacts =
"<li href='0'><a>" +
"  <span style='width:175px'>" + pb_label_all_contacts + '</span>' +
"  <p><b id='all_contacts_count'></b>&nbsp;&nbsp;&nbsp;</p>" +
'</a></li>';

// 本地电话本显示群组列表
var vLocalShowGroupList =
"<li class='margin_b' href='%GroupID%'><a title='%GroupNameTwo%'>" +
"  <span style='width:175px;overflow:hidden;white-space:nowrap' href='%NumberVLocalShowGroupList%'>%GroupNameTwo%</span>" +
"  <p><label>%Number%</label><img id='pb_editor_group' src='../res/editor.gif'/>&nbsp;&nbsp;&nbsp;<img id='pb_delete_group' src='../res/delete.gif'/></p>" +
'</a></li>';

// 本地电话本显示新建群组
function get_vLocalNewGroup() {
    var vLocalNewGroup =
    "<li><span><input type='text' maxlength=" + g_pb_feature.max_group_name_size + " id='txtNewGroup' value=''/></span></li>";
    return vLocalNewGroup;
}

// 本地电话本显示编辑群组
function get_vLocalEditorGroup() {
    var vLocalEditorGroup = "<input type='text' maxlength=" + g_pb_feature.max_group_name_size + " id='txtEditorGroup'/>";
    return vLocalEditorGroup;
}

// 本地电话显示导入联系人
var vLocalImportContact =
"<form id='form_update' enctype='multipart/form-data' method='post'>" +
"  <table align='center'><tr>" +
"    <td><input type='hidden' id='hilink_uploadpath' name='hilink_uploadpath' value=''></td>" +
"    <td class='up_nodite'><input type='file' id='up_nodite' name='up_nodite'  class='pb_up_file' size='55' onChange='pb_checkUploadFileName()'/></td>" +
'  </tr></table>' +
'</form>';

// 显示移动联系人
var vLocalShowMoveToGroup =
'<tr><td>' +
"<input class='radio' type='radio' name='radioGroup' value='%GroupID%'><span value='%MoveGroupID%'>%GroupNameOne%</span>" +
'</td></tr>';

var vMoveAllContacts =
"<tr'><td>" +
"<input class='radio' type='radio' name='radioGroup' value='0'><span value='0'>" +
pb_label_all_contacts +
'</span></td></tr>';

// 显示等待对话框
function pb_showWaitingDialog(tipTitle, tipContent) {
    cancelLogoutTimer();
    showWaitingDialog(tipTitle, tipContent);
}

// 关闭等待对话框
function pb_closeWaitingDialog() {
    startLogoutTimer();
    closeWaitingDialog();
}

/*
 Javascript replace()方法的replacement中的 $ 字符具有特定的含义。而联系人姓名，邮箱和群组名$为合法字符，
 重写Javascript replace()方法。
 */
function replaceString(str,s1,s2) {
    var idx = 0;
    var rec = str;
    // 字符串第一次出现的s1替换为s2
    if ('%href%' == s1) {
        idx = rec.indexOf(s1);
        if(idx >= 0) {
            rec = rec.substring(0, idx) + s2 + rec.substr(idx+s1.length);
        }
    }
    // 字符串出现两个s1替换为s2
    else if (('%FormattedNameTwo%' == s1) || ('%GroupNameTwo%' == s1)) {
        idx = rec.indexOf(s1);
        if (idx >= 0) {
            rec = rec.substring(0, idx) + s2 + rec.substr(idx+s1.length);
        }
        idx = rec.lastIndexOf(s1);
        if (idx >= 0) {
            rec = rec.substring(0, idx) + s2 + rec.substr(idx+s1.length);
        }
    }
    // 字符串最后出现的s1替换为s2
    else {
        idx = rec.lastIndexOf(s1);
        if (idx > 0) {
            rec = rec.substring(0, idx) + s2 + rec.substr(idx+s1.length);
        }
    }

    return rec;
}

$(document).ready( function() {
    pb_initPage(true);
    pb_initBtnClick();
    pb_sent_record_maxlength();
});