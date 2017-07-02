// STK JavaScript Document

/*
 * Global Features
 */
var g_STK_TIMEOUT = 30000;
var g_STK_AUTOBACKMAINTIMEOUT = 5000;

/*
 * Define Globe Variable
 */

var g_stk_title = '';                      /* STK标题 */
var g_stk_pageIndex = 1;                   /* 当前页码 */
var g_stk_pageIndexBak = 1;                /* 当前页码备份 */
var g_stk_curTotalPage = 0;                /* 当前菜单总页数 */
var g_stk_curMenuTotal = 0;                /* 当前菜单项总数 */
var g_stk_curMenuLevel = 255;              /* 当前菜单所在层级 */
var g_stk_cmdTypeSDKReturnMenu = 0;        /* 菜单类型返回的CmdType */
var g_stk_cmdIndexSDKReturnMenu = 0;       /* 菜单类型返回的CmdIndex */
var g_stk_cmdTypeSDKReturnDialog = 0;      /* 对话框类型返回的CmdType */
var g_stk_cmdIndexSDKReturnDialog = 0;     /* 对话框类型返回的CmdIndex */
var g_stk_durationTime = 3;                /* 文本信息计时器 */
var g_stk_clearTime = 0;                   /* 由SetTimeout()返回的ID值 */
var g_stk_clearGetStatusTime = 0;          /* 由SetTimeout()返回的ID值 */
var g_stk_getInputRspFormat = '';          /* Get Input操作时SDK返回的RspFormat */
var g_stk_getInputMin = 1;                 /* Get Input操作时SDK返回的SizeMin */
var g_stk_getInputMax = 1;                 /* Get Input操作时SDK返回的SizeMax */
var g_stk_getInputPackMode = '0';          /* Get Input操作时SDK返回的PackMode */
var g_stk_getInkeyMin = 1;                 /* Get Inkey操作输入框输入最短的字符串长度 */
var g_stk_getInkeyMax = 255;               /* Get Inkey操作输入框输入最长的字符串长度 */
var g_stk_getInkeyRspFormat = '';          /* Get Inkey操作时SDK返回的RspFormat */
var g_stk_getInkeyPackMode = '0';          /* 默认为0 */
var g_stk_cmdType = 0;                     /* 选择菜单时记录CmdType */
var g_stk_cmdIndex = 0;                    /* 选择菜单时记录CmdIndex */
var g_stk_result = 1;                      /* 选择菜单时记录result */
var g_stk_dataType = 0;                    /* 选择菜单时记录dataType */
var g_stk_data = 0;                        /* 选择菜单时记录data */
var g_stk_menuLevel = 0;                   /* 选择菜单时记录menuLevel */
var g_stk_pageIndexBack = 1;               /* 选择菜单时记录pageIndex */
var g_stk_callDialogFlag = false;          /* 调用call_dialog函数的标志位 */
var g_stk_jumpPageFlag = false;            /* 跳转页码标志位 */
var g_stk_showSightlessDialogFlag = false; /* 调用showSightlessDialog函数标志位 */
var RspFormatGSM7MaxLen = 289;             /* GSM7最大字符个数 */
var RspFormatNumMaxLen = 253;              /* 数字最大字符个数 */
var RspFormatUCS2MaxLen = 126;             /* UCS2最大字符个数 */
var RspFormatYesNoMaxLen = 289;            /* YesNo最大字符个数 */
var g_stk_menuListArray = [];              /* 记录当前菜单列表 */
var g_stk_back_cmdType = [];               /* 用于回退操作 */
var g_stk_back_cmdIndex = [];              /* 用于回退操作 */
var g_stk_cmdTypeArray = [];               /* 用于菜单的翻页 */
var g_stk_cmdIndexArray = [];              /* 用于菜单的翻页 */
var g_stk_resultArray = [];                /* 用于菜单的翻页 */
var g_stk_dataTypeArray = [];              /* 用于菜单的翻页 */
var g_stk_dataArray = [];                  /* 用于菜单的翻页 */
var g_stk_menuLevelArray = [];             /* 用于菜单的翻页 */
var g_stk_pageIndexArray = [];             /* 用于回退操作 */
var g_stk_MenuInfArray = [];               /* 记录每层菜单的菜单信息 */

// STK配置项信息
var g_stk_feature = {
    page_size: 0                           /* 一页显示多少条菜单列表 */
};

// 获取主菜单发送SDK的数据(xml字段)
var g_stk_main_request = {
    CmdType: 0,                        /* 命令类型 */
    CmdIndex: 0,                       /* 命令索引*/
    Result: 15,                        /* 终端响应类型 */
    DataType: 0,                       /* Data的种类 */
    /* 1.Data为数字 */
    /* 2.Data为字符串 */
    /* 15. Data无含义 */
    Data: 0,                           /* 菜单标示符或用户输入内容 */
    MenuLevel: g_stk_curMenuLevel,     /* 菜单所在层级数 */
    PageIndex: g_stk_pageIndex,        /* 主菜单读取页面索引*/
    ReadCount: g_stk_feature.page_size,/* 主菜单读取一页显示的最多菜单项数*/
    IsJumpPage: 0                      /* 是否执行翻页操作 */
};

// 获取子级数据发送SDK的数据(xml字段)
var g_stk_sub_request = {
    CmdType: 0,                        /* 命令类型 */
    CmdIndex: 0,                       /* 命令索引*/
    Result: 0,                         /* 终端响应类型 */
    DataType: 0,                       /* Data的种类 */
    /* 1.Data为数字 */
    /* 2.Data为字符串 */
    /* 15. Data无含义 */
    Data: 0,                           /* 菜单标示符或用户输入内容 */
    MenuLevel: g_stk_curMenuLevel,     /* 菜单所在层级数 */
    PageIndex: g_stk_pageIndex,        /* 子菜单读取页面索引*/
    ReadCount: g_stk_feature.page_size,/* 子菜单读取一页显示的最多菜单项数*/
    IsJumpPage: 0                      /* 是否执行翻页操作 */
};

// STK操作类型枚举
var g_stk_cmd_type = {
    StkTypeSetupMenu: 0,               /* Setup Menu操作 */
    StkTypeDisplayText: 1,             /* Display Text操作 */
    StkTypeGetInkey: 2,                /* Get Inkey操作 */
    StkTypeGetInput: 3,                /* Get Input操作 */
    StkTypeSetupCall: 4,               /* Setup Call操作 */
    StkTypePlayTone: 5,                /* Play Tone操作 */
    StkTypeSelItem: 6,                 /* Sel Item操作 */
    StkTypeRefresh: 7,                 /* Refresh操作 */
    StkTypeSendSs: 8,                  /* Send SS操作 */
    StkTypeSendSms: 9,                 /* Send SMS操作 */
    StkTypeSendUssd: 10,               /* Send USSD操作 */
    StkTypeLaunchBrowser: 11,          /* Launch Browser操作 */
    StkTypeIdleModeText: 12,           /* Set up idle mode text操作 */
    StkTypeEndSession: 99              /* End Session操作 */
};

// 终端响应类型
var g_stk_terminal_response = {
    StkTerminalResponseEndSession: 0,  /* 用户终止会话 */
    StkTerminalResponseOK: 1,          /* 执行用户功能动作*/
    StkTerminalResponseHelp: 2,        /* 用户要求的帮助信息*/
    StkTerminalResponseBack: 3,        /* 返回上一层菜单*/
    StkTerminalResponseNotSupport: 4,  /* 表示ME不支持*/
    StkTerminalResponseNoMeaning: 15   /* 无含义 */
};

// 发送SDK的数据中DataType取值范围
var g_stk_data_type = {
    StkDataTypeNumber: 0,              /* 数据类型为数字 */
    StkDataTypeString: 1,              /* 数据类型为字符串 */
    StkDataTypeDataNoEffect: 15        /* 数据类型无意义 */
};

// 主动命令超时
var g_stk_cmd_timeout = {
    CmdIsNotTimeout: 0,               /* 主动命令没有超时 */
    CmdIsTimeout: 1                   /* 主动命令已经超时 */
};

// GetInkey操作返回的rspFormat
var g_stk_getInkey_rspFormat = {
    GetInkeyRspFormatGSM7: 0,         /* GSM7编码 */
    GetInkeyRspFormatYesNo: 1,        /* YES NO编码 */
    GetInkeyRspFormatNum: 2,          /* 数字 （0-9，*，#，+）*/
    GetInkeyRspFormatUCS2: 3          /* UCS2 */
};

// GetInput操作返回的rspFormat
var g_stk_getInput_rspFormat = {
    GetInputRspFormatGSM7: 0,         /* GSM7编码 */
    GetInputRspFormatNum: 2,          /* 数字 （0-9，*，#，+）*/
    GetInputRspFormatUCS2: 3          /* UCS2 */
};

/*
 * 初始化页面
 */
function stk_initPage() {
    stk_clearPage();
    stk_showSightlessDialog();
    stk_dataInit();
    stk_getMain('enter_main');
}

/*
 * 定时查询SIM卡上报数据状态，超时返回主菜单
 */
function stk_getStkStatus() {
    stk_queryStatus();
    g_stk_clearGetStatusTime = setTimeout( function() {
        stk_getStkStatus();
    }, g_STK_AUTOBACKMAINTIMEOUT);
}

/*
 * 超时返回主菜单时，数据初始化
 */
function stk_dataInit() {
    var i = 0;
    var j = 0;
    g_stk_title = '';
    g_stk_pageIndex = 1;
    g_stk_pageIndexBak = 1;
    g_stk_curTotalPage = 0;
    g_stk_curMenuTotal = 0;
    g_stk_curMenuLevel = 255;
    g_stk_cmdTypeSDKReturnMenu = 0;
    g_stk_cmdIndexSDKReturnMenu = 0;
    g_stk_cmdTypeSDKReturnDialog = 0;
    g_stk_cmdIndexSDKReturnDialog = 0;
    g_stk_durationTime = 3;
    g_stk_clearTime = 0;
    g_stk_getInputRspFormat = '';
    g_stk_getInputMin = 1;
    g_stk_getInputMax = 1;
    g_stk_getInputPackMode = '0';
    g_stk_getInkeyMin = 1;
    g_stk_getInkeyMax = 255;
    g_stk_getInkeyRspFormat = '';
    g_stk_getInkeyPackMode = '0';
    g_stk_cmdType = 0;
    g_stk_cmdIndex = 0;
    g_stk_result = 1;
    g_stk_dataType = 0;
    g_stk_data = 0;
    g_stk_menuLevel = 0;
    g_stk_pageIndexBack = 1;
    RspFormatGSM7MaxLen = 289;
    RspFormatNumMaxLen = 253;
    RspFormatUCS2MaxLen = 126;
    RspFormatYesNoMaxLen = 289;

    g_stk_callDialogFlag = false;
    g_stk_jumpPageFlag = false;
    g_stk_showSightlessDialogFlag = false;
    g_stk_menuListArray = [];
    g_stk_back_cmdType = [];
    g_stk_back_cmdIndex = [];
    g_stk_cmdTypeArray = [];
    g_stk_cmdIndexArray = [];
    g_stk_resultArray = [];
    g_stk_dataTypeArray = [];
    g_stk_dataArray = [];
    g_stk_menuLevelArray = [];
    g_stk_pageIndexArray = [];
    g_stk_MenuInfArray = [];

    for(i = 0;i < 255;i ++) {
        g_stk_MenuInfArray[i]=[];
        for(j = 0;j < 255;j ++) {
            g_stk_MenuInfArray[i].push('undefined');
        }
    }

    g_stk_main_request.CmdType = 0;
    g_stk_main_request.CmdIndex = 0;
    g_stk_main_request.Result = 15;
    g_stk_main_request.DataType = 0;
    g_stk_main_request.Data = 0;
    g_stk_main_request.MenuLevel = g_stk_curMenuLevel;
    g_stk_main_request.PageIndex = g_stk_pageIndex;
    g_stk_main_request.ReadCount = g_stk_feature.page_size;
    g_stk_main_request.IsJumpPage = 0;
    g_stk_sub_request.CmdType = 0;
    g_stk_sub_request.CmdIndex = 0;
    g_stk_sub_request.Result = 0;
    g_stk_sub_request.DataType = 0;
    g_stk_sub_request.Data = 0;
    g_stk_sub_request.MenuLevel = g_stk_curMenuLevel;
    g_stk_sub_request.PageIndex = g_stk_pageIndex;
    g_stk_sub_request.ReadCount = g_stk_feature.page_size;
    g_stk_sub_request.IsJumpPage = 0;
}

/*
 * 清除页面内容
 */
function stk_clearPage() {
    $('#stk_head_inf').hide();
    $('#list_stk_menu').empty();
    $('.stk_pagination span').hide();
    $('#stk_back_page').hide();
    $('.status_title').hide();
    $('#stk_unsupported').empty();
}

/*
 * 组包发送SDK的数据
 */
function stk_dataPackage($case,
CmdType, CmdIndex, Result, DataType, Data, MenuLevel) {
    // 组包发送SDK的数据
    switch ($case) {
        case 'back_main':
        case 'enter_main':
        case 'others_main':
            g_stk_main_request.CmdType = CmdType;
            g_stk_main_request.CmdIndex = CmdIndex;
            g_stk_main_request.Result = Result;
            g_stk_main_request.DataType = DataType;
            g_stk_main_request.Data = Data;
            g_stk_main_request.MenuLevel = MenuLevel;
            g_stk_main_request.PageIndex = g_stk_pageIndex;
            g_stk_main_request.ReadCount = g_stk_feature.page_size;
            g_stk_main_request.IsJumpPage = 0;
            break;
        case 'jump_page_main':
            g_stk_main_request.CmdType = CmdType;
            g_stk_main_request.CmdIndex = CmdIndex;
            g_stk_main_request.Result = Result;
            g_stk_main_request.DataType = DataType;
            g_stk_main_request.Data = Data;
            g_stk_main_request.MenuLevel = MenuLevel;
            g_stk_main_request.PageIndex = g_stk_pageIndex;
            g_stk_main_request.ReadCount = g_stk_feature.page_size;
            g_stk_main_request.IsJumpPage = 1;
            break;
        case 'back_sub':
        case 'enter_sub':
        case 'others_sub':
            g_stk_sub_request.CmdType = CmdType;
            g_stk_sub_request.CmdIndex = CmdIndex;
            g_stk_sub_request.Result = Result;
            g_stk_sub_request.DataType = DataType;
            g_stk_sub_request.Data = Data;
            g_stk_sub_request.MenuLevel = MenuLevel;
            g_stk_sub_request.PageIndex = g_stk_pageIndex;
            g_stk_sub_request.ReadCount = g_stk_feature.page_size;
            g_stk_sub_request.IsJumpPage = 0;
            break;
        case 'jump_page_sub':
            g_stk_sub_request.CmdType = CmdType;
            g_stk_sub_request.CmdIndex = CmdIndex;
            g_stk_sub_request.Result = Result;
            g_stk_sub_request.DataType = DataType;
            g_stk_sub_request.Data = Data;
            g_stk_sub_request.MenuLevel = MenuLevel;
            g_stk_sub_request.PageIndex = g_stk_pageIndex;
            g_stk_sub_request.ReadCount = g_stk_feature.page_size;
            g_stk_sub_request.IsJumpPage = 1;
            break;
        default:
            break;
    }
}

/*
 * 按键事件绑定
 */
function stk_initBtnClick() {
    // 点击"确定"按钮操作
    $('#pop_OK').live('click', function() {
        if (!isButtonEnable('pop_OK')) {
            // 确定按钮灰化不可用，对话框还存在
            if (0 == g_main_displayingPromptStack.length) {
                g_main_displayingPromptStack.push('pop_OK');
            }
            return;
        }

        // 根据SDK返回的数据封装CmdType与CmdIndex
        var CmdType = g_stk_cmdTypeSDKReturnDialog;
        var CmdIndex = g_stk_cmdIndexSDKReturnDialog;
        // 用户响应动作
        var Result = g_stk_terminal_response.StkTerminalResponseOK;
        // 封装Data为字符串类型
        var DataType = g_stk_data_type.StkDataTypeDataNoEffect;
        var Data = 0;
        var MenuLevel = g_stk_curMenuLevel;
        var StkGetInputTextValue = '';
        var StkGetInkeyTextValue = '';
        var rgExp = /^[+*#0123456789][+*#0123456789]*$/;

        // Get Inkey操作点击OK按钮
        if (g_stk_cmd_type.StkTypeGetInkey == parseInt(CmdType, 10)) {
            StkGetInkeyTextValue = $('#stk_get_inkey_text').val();

            if (g_stk_getInkeyMax < StkGetInkeyTextValue.length) {
                if (0 == g_main_displayingPromptStack.length) {
                    g_main_displayingPromptStack.push('pop_OK');
                }
                $('#stk_get_inkey_text').focus().select();
                clearAllErrorLabel();
                showErrorUnderTextbox("stk_get_inkey_text", IDS_sms_hint_content_too_long);
                return;
            }

            if(g_stk_getInkey_rspFormat.GetInkeyRspFormatNum != g_stk_getInkeyRspFormat) {
                DataType = g_stk_data_type.StkDataTypeString;
                Data =
                g_stk_getInkeyRspFormat +
                g_stk_getInkeyPackMode +
                StkGetInkeyTextValue;
                Data = resolveXMLEntityReference(Data);
            } else {
                if (StkGetInkeyTextValue.match(rgExp)) {
                    DataType = g_stk_data_type.StkDataTypeString;
                    Data =
                    g_stk_getInkeyRspFormat +
                    g_stk_getInkeyPackMode +
                    StkGetInkeyTextValue;
                    Data = resolveXMLEntityReference(Data);
                } else {
                    // 对话框提示号码错误信息，对话框还存在
                    if (0 == g_main_displayingPromptStack.length) {
                        g_main_displayingPromptStack.push('pop_OK');
                    }
                    $('#stk_get_inkey_text').focus().select();
                    clearAllErrorLabel();
                    showErrorUnderTextbox("stk_get_inkey_text", stk_input_format_invalid);
                    return;
                }
            }
        }
        // Get Input操作点击ok操作
        else if (g_stk_cmd_type.StkTypeGetInput == parseInt(CmdType, 10)) {
            StkGetInputTextValue = $('#stk_get_input_text').val();
            if (g_stk_getInputMax < StkGetInputTextValue.length) {
                if (0 == g_main_displayingPromptStack.length) {
                    g_main_displayingPromptStack.push('pop_OK');
                }
                $('#stk_get_input_text').focus().select();
                clearAllErrorLabel();
                showErrorUnderTextbox("stk_get_input_text", IDS_sms_hint_content_too_long);
                return;
            }
            if(g_stk_getInput_rspFormat.GetInputRspFormatNum != g_stk_getInputRspFormat) {
                DataType = g_stk_data_type.StkDataTypeString;
                Data =
                g_stk_getInputRspFormat +
                g_stk_getInputPackMode +
                StkGetInputTextValue;
                Data = resolveXMLEntityReference(Data);
            } else {
                if (StkGetInputTextValue.match(rgExp)) {
                    DataType = g_stk_data_type.StkDataTypeString;
                    Data =
                    g_stk_getInputRspFormat +
                    g_stk_getInputPackMode +
                    StkGetInputTextValue;
                    Data = resolveXMLEntityReference(Data);
                } else {
                    // 对话框提示号码错误信息，对话框还存在
                    if (0 == g_main_displayingPromptStack.length) {
                        g_main_displayingPromptStack.push('pop_OK');
                    }
                    $('#stk_get_input_text').focus().select();
                    clearAllErrorLabel();
                    showErrorUnderTextbox("stk_get_input_text", stk_input_format_invalid);
                    return;
                }
            }
        }
        // 文本信息框点击ok操作
        else {
            DataType = g_stk_data_type.StkDataTypeNumber;
            Data = 0;
        }

        clearDialog();
        clearTimeout(g_stk_clearTime);
        stk_showSightlessDialog();
        g_stk_callDialogFlag = false;

        if (255 == MenuLevel) {
            stk_dataPackage('others_main',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getMain('others_main');
        } else {
            stk_dataPackage('others_sub',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getSub('others_sub');
        }
    });
    // 点击"取消"按钮操作
    $('#pop_Cancel').live('click', function() {
        var CmdType = g_stk_cmdTypeSDKReturnDialog;
        var CmdIndex = g_stk_cmdIndexSDKReturnDialog;
        // 用户终止操作
        var Result = g_stk_terminal_response.StkTerminalResponseEndSession;
        var DataType = g_stk_data_type.StkDataTypeNumber;
        var Data = 0;
        var MenuLevel = g_stk_curMenuLevel;

        clearDialog();
        clearTimeout(g_stk_clearTime);
        stk_showSightlessDialog();
        g_stk_callDialogFlag = false;

        if (255 == MenuLevel) {
            stk_dataPackage('others_main',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getMain('others_main');
        } else {
            stk_dataPackage('others_sub',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getSub('others_sub');
        }
    });
    // 点击"关闭"按钮
    $('.dialog_close_btn').live('click', function() {
        // 防止失败提示框"关闭"按钮触发此事件
        if (false == g_stk_callDialogFlag) {
            return;
        }
        g_stk_callDialogFlag = false;

        var CmdType = g_stk_cmdTypeSDKReturnDialog;
        var CmdIndex = g_stk_cmdIndexSDKReturnDialog;
        // 用户终止操作
        var Result = g_stk_terminal_response.StkTerminalResponseEndSession;
        var DataType = g_stk_data_type.StkDataTypeNumber;
        var Data = 0;
        var MenuLevel = g_stk_curMenuLevel;

        clearTimeout(g_stk_clearTime);
        stk_showSightlessDialog();

        if (255 == MenuLevel) {
            stk_dataPackage('others_main',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getMain('others_main');
        } else {
            stk_dataPackage('others_sub',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getSub('others_sub');
        }
    });
    // 选择菜单操作
    $('#list_stk_menu a').live('click', function() {
        if (true == g_stk_showSightlessDialogFlag) {
            return;
        }
        button_enable('stk_back_page', '0');
        clearTimeout(g_stk_clearTime);
        var CmdType = g_stk_cmdTypeSDKReturnMenu;
        var CmdIndex = g_stk_cmdIndexSDKReturnMenu;
        // 用户响应动作
        var Result = g_stk_terminal_response.StkTerminalResponseOK;
        var DataType = g_stk_data_type.StkDataTypeNumber;
        var Data = $(this).attr('value');
        var MenuLevel = g_stk_curMenuLevel;

        g_stk_cmdType = CmdType;
        g_stk_cmdIndex = CmdIndex;
        g_stk_result = Result;
        g_stk_dataType = DataType;
        g_stk_data = Data;
        g_stk_menuLevel = MenuLevel;
        g_stk_pageIndexBack = g_stk_pageIndex;
        g_stk_pageIndexBak = g_stk_pageIndex;
        g_stk_pageIndex = 1;

        stk_showSightlessDialog();
        stk_dataPackage('enter_sub',
        CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
        stk_getSub('enter_sub');
    });
    // 回退操作
    $('#stk_back_page').live('click', function() {
        if (0 >= g_stk_curMenuLevel) {
            return;
        }
        clearTimeout(g_stk_clearTime);

        var CmdType = g_stk_back_cmdType.pop();
        var CmdIndex = g_stk_back_cmdIndex.pop();
        // 用户回退操作
        var Result = g_stk_terminal_response.StkTerminalResponseBack;
        var DataType = g_stk_data_type.StkDataTypeNumber;
        var Data = 0;
        var MenuLevel = g_stk_curMenuLevel;
        g_stk_pageIndexBak = g_stk_pageIndex;
        g_stk_pageIndex = g_stk_pageIndexArray.pop();

        g_stk_back_cmdType.push(CmdType);
        g_stk_back_cmdIndex.push(CmdIndex);
        g_stk_pageIndexArray.push(g_stk_pageIndex);
        stk_showSightlessDialog();
        // 隐藏回退按钮，防止用户连击
        button_enable('stk_back_page', '0');

        if (1 == MenuLevel) {
            // 获取主菜单列表
            stk_dataPackage('back_main',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            stk_getMain('back_main');
        } else {
            // 组包发给SDK的数据
            stk_dataPackage('back_sub',
            CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
            // 获取子级数据
            stk_getSub('back_sub');
        }
    });
}

/*
 * 获取主菜单列表
 */
function stk_getMain($case) {
    var submitData = '';
    var cmdType = '';
    // Object结构转换为xml结构
    submitData = object2xml('request', g_stk_main_request);
    // 将xml下发至SDK
    saveAjaxData('api/stk/stk-get-main', submitData, function($xml) {
        // 将SDK上发的xml转换为object
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            cmdType = parseInt(ret.response.CmdType, 10);
            switch (cmdType) {
                case g_stk_cmd_type.StkTypeSetupMenu:
                case g_stk_cmd_type.StkTypeDisplayText:
                case g_stk_cmd_type.StkTypeGetInkey:
                case g_stk_cmd_type.StkTypeGetInput:
                case g_stk_cmd_type.StkTypeSelItem:
                case g_stk_cmd_type.StkTypeLaunchBrowser:
                case g_stk_cmd_type.StkTypeRefresh:
                case g_stk_cmd_type.StkTypeEndSession:
                    // 根据CmdType做出不同的操作
                    stk_operateByCmdType($case, cmdType, ret);
                    //stk_clearSightlessDialog();
                    break;
                default:
                    log.error('STK: post api/stk/stk-get-sub file failed');
                    break;
            }
        } else {
            g_stk_pageIndex = g_stk_pageIndexBak;
            stk_clearSightlessDialog();
            button_enable('stk_back_page', '1');
            showInfoDialog(common_failed);
            log.error('STK: post api/stk/stk-get-main data error');
        }
    }, {
        timeout: g_STK_TIMEOUT,
        errorCB: function() {
            g_stk_pageIndex = g_stk_pageIndexBak;
            stk_clearSightlessDialog();
            button_enable('stk_back_page', '1');
            showInfoDialog(common_failed);
            log.error('STK: post api/stk/stk-get-main file failed');
        }
    });
}

/*
 * 获取子级数据
 */
function stk_getSub($case) {
    var submitData = '';
    var cmdType = '';
    // Object结构转换为xml结构
    submitData = object2xml('request', g_stk_sub_request);
    // 将xml发送至SDK
    saveAjaxData('api/stk/stk-get-sub', submitData, function($xml) {
        // 将SDK返回的xml转换为object
        var ret = xml2object($xml);
        // 销毁透明框
        if (ret.type == 'response') {
            cmdType = parseInt(ret.response.CmdType, 10);
            switch (cmdType) {
                case g_stk_cmd_type.StkTypeSetupMenu:
                case g_stk_cmd_type.StkTypeDisplayText:
                case g_stk_cmd_type.StkTypeGetInkey:
                case g_stk_cmd_type.StkTypeGetInput:
                case g_stk_cmd_type.StkTypeSelItem:
                case g_stk_cmd_type.StkTypeLaunchBrowser:
                case g_stk_cmd_type.StkTypeRefresh:
                case g_stk_cmd_type.StkTypeEndSession:
                    // 根据CmdType做出不同的操作
                    stk_operateByCmdType($case, cmdType, ret);
                    //  stk_clearSightlessDialog();
                    break;
                default:
                    log.error('STK: post api/stk/stk-get-sub file failed');
                    break;
            }
        } else {
            g_stk_pageIndex = g_stk_pageIndexBak;
            stk_clearSightlessDialog();
            button_enable('stk_back_page', '1');
            showInfoDialog(common_failed);
            log.error('STK: post api/stk/stk-get-sub data error');
        }
    }, {
    	enc:true,
        timeout: g_STK_TIMEOUT,
        errorCB: function() {
            g_stk_pageIndex = g_stk_pageIndexBak;
            stk_clearSightlessDialog();
            button_enable('stk_back_page', '1');
            showInfoDialog(common_failed);
            log.error('STK: post api/stk/stk-get-sub file failed');
        }
    });
}

/*
 * 根据不同的CmdType做出不同的操作
 */
function stk_operateByCmdType($case, cmdType, ret) {
    cmdType = parseInt(cmdType, 10);
    switch (cmdType) {
        // Setup Menu操作
        case g_stk_cmd_type.StkTypeSetupMenu:
            stk_setupMenu($case, ret);
            break;
        // Display Text操作
        case g_stk_cmd_type.StkTypeDisplayText:
            stk_displayText($case, ret);
            break;
        // Get Inkey操作
        case g_stk_cmd_type.StkTypeGetInkey:
            stk_getInkey($case, ret);
            break;
        // Get Input操作
        case g_stk_cmd_type.StkTypeGetInput:
            stk_getInput($case, ret);
            break;
        // Play Tone操作
        case g_stk_cmd_type.StkTypePlayTone:
            break;
        // Set Item操作
        case g_stk_cmd_type.StkTypeSelItem:
            stk_selItem($case, ret);
            break;
        // Refresh操作
        case g_stk_cmd_type.StkTypeRefresh:
            stk_refresh($case, ret);
            break;
        // Launch Browser操作
        case g_stk_cmd_type.StkTypeLaunchBrowser:
            stk_launchBrowser($case, ret);
            break;
        // Idle Mode Text操作
        case g_stk_cmd_type.StkTypeIdleModeText:
            break;
        // End Session操作
        case g_stk_cmd_type.StkTypeEndSession:
            stk_endSession($case, ret);
            break;
        // default
        default:
            break;
    }
}

/*
 *Setup Menu操作
 */
function stk_setupMenu($case, ret) {
    var i = 0;
    var j = 0;
    var elementsInArrayFlag = false;

    g_stk_menuListArray = [];
    if ($.isArray(ret.response.STKData.Field)) {
        g_stk_menuListArray = ret.response.STKData.Field;
    } else {
        g_stk_menuListArray.push(ret.response.STKData.Field);
    }

    stk_clearPage();
    g_stk_curMenuTotal = ret.response.DataTotal;
    g_stk_cmdTypeSDKReturnMenu = ret.response.CmdType;
    g_stk_cmdIndexSDKReturnMenu = ret.response.CmdIndex;

    switch ($case) {
        case 'enter_main':
        case 'others_main':
            if (0 == g_stk_curMenuTotal) {
                g_stk_curMenuLevel = 0;
                $('#stk_unsupported').html(resolveXMLEntityReference(stk_label_unsupported).replace(/\s/g, '&nbsp;'));
                clearTimeout(g_stk_clearTime);
                clearTimeout(g_stk_clearGetStatusTime);
            } else {
                g_stk_curMenuLevel = 0;
                $.each(g_stk_menuListArray, function(n, Field) {
                    g_stk_MenuInfArray[0][i] = Field.Name;
                    i ++;
                });
                $('.status_title').show();
            }
            break;
        case 'back_main':
            for (i = 0; i < 255; i ++) {
                g_stk_MenuInfArray[g_stk_curMenuLevel][i] = 'undefined';
            }
            g_stk_curMenuLevel--;
            g_stk_back_cmdType.pop();
            g_stk_back_cmdIndex.pop();
            g_stk_cmdTypeArray.pop();
            g_stk_cmdIndexArray.pop();
            g_stk_resultArray.pop();
            g_stk_dataTypeArray.pop();
            g_stk_dataArray.pop();
            g_stk_menuLevelArray.pop();
            g_stk_pageIndexArray.pop();
            $('.status_title').show();
            break;
        case 'jump_page_main':
            // 判断此层菜单总数
            while ('undefined' != g_stk_MenuInfArray[0][i]) {
                i ++;
            }
            $.each(g_stk_menuListArray, function(n, Field) {
                if (0 != Field.Value) {
                    for (j = 0; j < i; j ++) {
                        if (Field.Name == g_stk_MenuInfArray[0][j]) {
                            elementsInArrayFlag = true;
                        }
                    }
                }
            });
            // 翻页获取的菜单不存在数组g_stk_MenuInfArray里
            if (false == elementsInArrayFlag) {
                $.each(g_stk_menuListArray, function(n, Field) {
                    g_stk_MenuInfArray[0][i] = Field.Name;
                    i ++;
                });
            }
            $('.status_title').show();
            break;
        case 'others_sub':
            break;
        default:
            break;
    }

    // 初始化翻页，回退按钮并备份数据
    g_stk_pageIndexBak = g_stk_pageIndex;
    g_stk_jumpPageFlag = false;
    stk_showMenuList();
    stk_initPagination();
    stk_initBackButton();
    stk_clearSightlessDialog();
    button_enable('stk_back_page', '1');
}

/*
 * Sel Item操作
 */
function stk_selItem($case, ret) {
    var i = 0;
    var j = 0;
    var k = 255;
    var elementsInArrayFlag = false;

    g_stk_menuListArray = [];
    if ($.isArray(ret.response.STKData.Field)) {
        g_stk_menuListArray = ret.response.STKData.Field;
    } else {
        g_stk_menuListArray.push(ret.response.STKData.Field);
    }

    stk_clearPage();
    g_stk_curMenuTotal = ret.response.DataTotal;
    g_stk_cmdTypeSDKReturnMenu = ret.response.CmdType;
    g_stk_cmdIndexSDKReturnMenu = ret.response.CmdIndex;

    switch ($case) {
        case 'enter_main':
        case 'others_main':
            if (0 == g_stk_curMenuTotal) {
                g_stk_curMenuLevel = 0;
                $('#stk_unsupported').html(resolveXMLEntityReference(stk_label_unsupported).replace(/\s/g, '&nbsp;'));
                clearTimeout(g_stk_clearTime);
                clearTimeout(g_stk_clearGetStatusTime);
            } else {
                g_stk_curMenuLevel = 0;
                $.each(g_stk_menuListArray, function(n, Field) {
                    g_stk_MenuInfArray[0][i] = Field.Name;
                    i ++;
                });
                $('.status_title').show();
            }
            break;
        case 'jump_page_main':
        case 'jump_page_sub':
            // 判断此层菜单总数
            while ('undefined' != g_stk_MenuInfArray[g_stk_curMenuLevel][i]) {
                i ++;
            }
            $.each(g_stk_menuListArray, function(n, Field) {
                if (0 != Field.Value) {
                    for (j = 0; j < i; j ++) {
                        if (Field.Name == g_stk_MenuInfArray[g_stk_curMenuLevel][j]) {
                            elementsInArrayFlag = true;
                        }
                    }
                }
            });
            // 翻页获取的菜单不存在数组g_stk_MenuInfArray里
            if (false == elementsInArrayFlag) {
                $.each(g_stk_menuListArray, function(n, Field) {
                    g_stk_MenuInfArray[g_stk_curMenuLevel][i] = Field.Name;
                    i ++;
                });
            }
            $('.status_title').show();
            break;
        case 'others_sub':
        case 'enter_sub':
            if (true == g_stk_jumpPageFlag) {
                // 判断此层菜单总数
                while ('undefined' != g_stk_MenuInfArray[g_stk_curMenuLevel][i]) {
                    i ++;
                }
                $.each(g_stk_menuListArray, function(n, Field) {
                    if (0 != Field.Value) {
                        for (j = 0; j < i; j ++) {
                            if (Field.Name == g_stk_MenuInfArray[g_stk_curMenuLevel][j]) {
                                elementsInArrayFlag = true;
                            }
                        }
                    }
                });
                // 翻页获取的菜单不存在数组g_stk_MenuInfArray里
                if (false == elementsInArrayFlag) {
                    $.each(g_stk_menuListArray, function(n, Field) {
                        g_stk_MenuInfArray[g_stk_curMenuLevel][i] = Field.Name;
                        i ++;
                    });
                }
            } else {
                $.each(g_stk_menuListArray, function(n, Field) {
                    if (0 != Field.Value) {
                        for (i = 0; i <= g_stk_curMenuLevel; i ++) {
                            for (j = 0; j < 255; j ++) {
                                if (Field.Name == g_stk_MenuInfArray[i][j]) {
                                    k = i;
                                }
                            }
                        }
                    }
                });
                i = 0;
                j = 0;
                if (k > g_stk_curMenuLevel) {
                    g_stk_curMenuLevel++;
                    g_stk_back_cmdType.push(g_stk_cmdTypeSDKReturnMenu);
                    g_stk_back_cmdIndex.push(g_stk_cmdIndexSDKReturnMenu);
                    g_stk_cmdTypeArray.push(g_stk_cmdType);
                    g_stk_cmdIndexArray.push(g_stk_cmdIndex);
                    g_stk_resultArray.push(g_stk_result);
                    g_stk_dataTypeArray.push(g_stk_dataType);
                    g_stk_dataArray.push(g_stk_data);
                    g_stk_menuLevelArray.push(g_stk_menuLevel);
                    g_stk_pageIndexArray.push(g_stk_pageIndexBack);
                    $.each(g_stk_menuListArray, function(n, Field) {
                        g_stk_MenuInfArray[g_stk_curMenuLevel][i] = Field.Name;
                        i ++;
                    });
                } else {
                    for (j = g_stk_curMenuLevel; j > k; j --) {
                        for (i = 0; i < 255; i ++) {
                            g_stk_MenuInfArray[g_stk_curMenuLevel][i] = 'undefined';
                        }
                        g_stk_curMenuLevel--;
                        g_stk_back_cmdType.pop();
                        g_stk_back_cmdIndex.pop();
                        g_stk_cmdTypeArray.pop();
                        g_stk_cmdIndexArray.pop();
                        g_stk_resultArray.pop();
                        g_stk_dataTypeArray.pop();
                        g_stk_dataArray.pop();
                        g_stk_menuLevelArray.pop();
                        g_stk_pageIndexArray.pop();
                    }
                }
            }
            $('.status_title').show();
            break;
        case 'back_main':
        case 'back_sub':
            for (i = 0; i < 255; i ++) {
                g_stk_MenuInfArray[g_stk_curMenuLevel][i] = 'undefined';
            }
            g_stk_curMenuLevel--;
            g_stk_back_cmdType.pop();
            g_stk_back_cmdIndex.pop();
            g_stk_cmdTypeArray.pop();
            g_stk_cmdIndexArray.pop();
            g_stk_resultArray.pop();
            g_stk_dataTypeArray.pop();
            g_stk_dataArray.pop();
            g_stk_menuLevelArray.pop();
            g_stk_pageIndexArray.pop();
            $('.status_title').show();
            break;
        default:
            break;
    }

    // 初始化翻页，回退按钮，并备份数据
    g_stk_pageIndexBak = g_stk_pageIndex;
    g_stk_jumpPageFlag = false;
    stk_showMenuList();
    stk_initPagination();
    stk_initBackButton();
    button_enable('stk_back_page', '1');
    stk_clearSightlessDialog();
}

/*
 * Display Text操作
 */
function stk_displayText($case, ret) {
    var TextInfo = resolveXMLEntityReference(ret.response.STKData.TextInfo);
    var TextFormat = ret.response.STKData.TextFormat;
    var TextClearMode = ret.response.STKData.ClearMode;
    var TextInfoHtml =
    "<div id='stk_text_info'>" + TextInfo + '</div>';

    // 保存SDK返回的数据
    g_stk_cmdTypeSDKReturnDialog = ret.response.CmdType;
    g_stk_cmdIndexSDKReturnDialog = ret.response.CmdIndex;
    g_stk_durationTime = ret.response.STKData.DurationTime;

    if (1 == TextClearMode) {
        // 等待用户清除显示的文本信息
        call_dialog(common_confirm, TextInfoHtml,
        common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
        g_stk_callDialogFlag = true;
        button_enable('pop_OK', '1');
        return;
    } else {
        // 在一段延时之后清显示的文本信息
        call_dialog(common_confirm, TextInfoHtml, "", 'pop_OK', common_cancel, 'pop_Cancel');
        g_stk_callDialogFlag = true;
        button_enable('pop_OK', '1');
        if (0 == g_stk_durationTime) {
            g_stk_durationTime = 3;
        }
        // 文本信息框一段时间后自动关闭并触发"确定"按钮操作
        stk_setTextTimeout();
    }
}

/*
 * Get Inkey操作
 */
function stk_getInkey($case, ret) {
    var TextInfo = resolveXMLEntityReference(ret.response.STKData.TextInfo);
    g_stk_getInkeyRspFormat = ret.response.STKData.RspFormat;
    stk_GetInputOrInkeyCharacterNumber(g_stk_cmd_type.StkTypeGetInkey);

    var GetInkeyHtml =
    "<div id='stk_inkey_text_info'>" + TextInfo + '</div>' +
    "<table id='stk_inkey_table'>" +
    '<tr>' +
    '<td>' +
    "<input type='text'" +
    "class='stk_get_inkey' id='stk_get_inkey_text'" +
    "maxlength='" + g_stk_getInkeyMax + "'" +
    '</td>' +
    '</tr>' +
    '</table>';

    // 保存SDK返回的数据
    g_stk_cmdTypeSDKReturnDialog = ret.response.CmdType;
    g_stk_cmdIndexSDKReturnDialog = ret.response.CmdIndex;

    // 弹出Get Inkey文本信息框
    call_dialog(common_confirm, GetInkeyHtml,
    common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    $('#stk_get_inkey_text').focus();
    button_enable('pop_OK', '0');
    g_stk_callDialogFlag = true;

    $('input').bind('change input paste cut keydown keyup', function() {
        stk_checkButtonEnable(g_stk_getInkeyMin, 'GetInkey');
    });
}

/*
 * Get Input操作
 */
function stk_getInput($case, ret) {
    var TextInfo = resolveXMLEntityReference(ret.response.STKData.TextInfo);

    g_stk_getInputRspFormat = ret.response.STKData.RspFormat;
    g_stk_getInputMax = ret.response.STKData.SizeMax;
    g_stk_getInputMax = parseInt(g_stk_getInputMax, 10);
    g_stk_getInputMin = ret.response.STKData.SizeMin;
    g_stk_getInputMin = parseInt(g_stk_getInputMin, 10);
    stk_GetInputOrInkeyCharacterNumber(g_stk_cmd_type.StkTypeGetInput);

    var GetInputHtml = '';
    GetInputHtml +=
    "<div id='stk_input_text_info'>" + TextInfo + '</div>' +
    "<table id='stk_input_table'>" +
    '<tr>' +
    '<td>';
    if(ret.response.STKData.EchoMode == '0') {
        GetInputHtml +=
        "<input type='password'" +
        "class='stk_get_input' autocomplete='off' id='stk_get_input_text'" +
        "maxlength='" + g_stk_getInputMax + "'";
    } else {
        GetInputHtml +=
        "<input type='text'" +
        "class='stk_get_input' id='stk_get_input_text'" +
        "maxlength='" + g_stk_getInputMax + "'";
    }
    GetInputHtml +=
    '</td>' +
    '</tr>' +
    '</table>';

    // 保存SDK返回的数据
    g_stk_cmdTypeSDKReturnDialog = ret.response.CmdType;
    g_stk_cmdIndexSDKReturnDialog = ret.response.CmdIndex;
    g_stk_getInputPackMode = ret.response.STKData.PackMode;

    // 弹出Get Input文本信息框
    call_dialog(common_confirm, GetInputHtml,
    common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    $('#stk_get_input_text').focus();
    button_enable('pop_OK', '0');
    g_stk_callDialogFlag = true;

    $('input').bind('change input paste cut keydown keyup', function() {
        stk_checkButtonEnable(g_stk_getInputMin, 'GetInput');
    });
}

/*
 * 计算GetInput和GetInkey操作输入的实际字符数
 */

function stk_GetInputOrInkeyCharacterNumber($case) {
    if (g_stk_cmd_type.StkTypeGetInput == $case) {
        if (g_stk_getInput_rspFormat.GetInputRspFormatGSM7 == g_stk_getInputRspFormat) {
            g_stk_getInputMax = (g_stk_getInputMax / 7) * 8;
            g_stk_getInputMax = parseInt(g_stk_getInputMax, 10);
            g_stk_getInputMin = (g_stk_getInputMin / 7) * 8;
            g_stk_getInputMin = parseInt(g_stk_getInputMin, 10);
            if (g_stk_getInputMax > RspFormatGSM7MaxLen) {
                g_stk_getInputMax = RspFormatGSM7MaxLen;
            }
            if (g_stk_getInputMin > RspFormatGSM7MaxLen) {
                g_stk_getInputMin = RspFormatGSM7MaxLen;
            }
        } else if (g_stk_getInput_rspFormat.GetInputRspFormatNum == g_stk_getInputRspFormat) {
            g_stk_getInputMax = parseInt(g_stk_getInputMax, 10);
            g_stk_getInputMin = parseInt(g_stk_getInputMin, 10);
            if (g_stk_getInputMax > RspFormatNumMaxLen) {
                g_stk_getInputMax = RspFormatNumMaxLen;
            }
            if (g_stk_getInputMin > RspFormatNumMaxLen) {
                g_stk_getInputMin = RspFormatNumMaxLen;
            }
        } else {
            g_stk_getInputMax = (g_stk_getInputMax / 2);
            g_stk_getInputMax = parseInt(g_stk_getInputMax, 10);
            g_stk_getInputMin = (g_stk_getInputMin / 2);
            g_stk_getInputMin = parseInt(g_stk_getInputMin, 10);
            if (0 == g_stk_getInputMax) {
                g_stk_getInputMax = 1;
            }
            if (0 == g_stk_getInputMin) {
                g_stk_getInputMin = 1;
            }
            if (g_stk_getInputMax > RspFormatUCS2MaxLen) {
                g_stk_getInputMax = RspFormatUCS2MaxLen;
            }
            if (g_stk_getInputMin > RspFormatUCS2MaxLen) {
                g_stk_getInputMin = RspFormatUCS2MaxLen;
            }
        }
    } else {
        if (g_stk_getInkey_rspFormat.GetInkeyRspFormatGSM7 == g_stk_getInkeyRspFormat) {
            g_stk_getInkeyMax = RspFormatGSM7MaxLen;
        } else if (g_stk_getInkey_rspFormat.GetInkeyRspFormatYesNo == g_stk_getInkeyRspFormat) {
            g_stk_getInkeyMax = RspFormatYesNoMaxLen;
        } else if (g_stk_getInkey_rspFormat.GetInkeyRspFormatNum == g_stk_getInkeyRspFormat) {
            g_stk_getInkeyMax = RspFormatNumMaxLen;
        } else {
            g_stk_getInkeyMax = RspFormatUCS2MaxLen;
        }
    }
}

/*
 * 控制GetInput操作和GetInput操作时按钮的可用性
 */
function stk_checkButtonEnable(sizeMin, $case) {
    var stkGetInputLen = 0;
    var stkGetInkeyLen = 0;
    switch ($case) {
        case 'GetInput':
            stkGetInputLen = ($('#stk_get_input_text').val()).length;
            if (stkGetInputLen >= sizeMin) {
                button_enable('pop_OK', '1');
            } else {
                button_enable('pop_OK', '0');
            }
            break;
        case 'GetInkey':
            stkGetInkeyLen = ($('#stk_get_inkey_text').val()).length;
            if (stkGetInkeyLen >= sizeMin) {
                button_enable('pop_OK', '1');
            } else {
                button_enable('pop_OK', '0');
            }
            break;
        default:
            break;
    }
}

/*
 * 打开URL操作
 */
function stk_launchBrowser($case, ret) {
    var URL = ret.response.STKData.URL;

    if ($.browser.safari) {
        var a = $("<a href='" + URL + "' target='_blank'></a>").get(0);
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        a.dispatchEvent(e);
    } else {
        window.open(URL);
    }
    g_stk_pageIndex = g_stk_pageIndexBak;
    stk_clearSightlessDialog();
    button_enable('stk_back_page', '1');

    var CmdType = ret.response.CmdType;
    var CmdIndex = ret.response.CmdIndex;
    var Result = g_stk_terminal_response.StkTerminalResponseOK;
    var DataType = g_stk_data_type.StkDataTypeString;
    var Data = "0";
    var MenuLevel = g_stk_curMenuLevel;
    stk_dataPackage('enter_sub',
    CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
    stk_getSub('enter_sub');
}

/*
 * Refresh操作
 */
function stk_refresh($case, ret) {
    g_stk_pageIndex = g_stk_pageIndexBak;
    stk_clearSightlessDialog();
    button_enable('stk_back_page', '1');
}

/*
 * End Session操作
 */
function stk_endSession($case, ret) {
    stk_showSightlessDialog();
    stk_dataInit();
    stk_getMain('enter_main');
}

/*
 * 显示菜单列表
 */
function stk_showMenuList() {
    var stk_title = '';
    $('#list_stk_menu').empty();
    $.each(g_stk_menuListArray, function(n, Field) {
        var html =
        "<li href='%href%'>" +
        '<div>' +
        "<a value='%value%' title='%MenuTitle%'" +
        "href='javascript:void(0);'>" +
        '%MenuName%' +
        '</a>' +
        '</div>' +
        '</li>';
        if (0 == n) {
            // 记录菜单的标题
            g_stk_title = Field.Name;
        } else {
            // 显示菜单列表
            html = stk_replaceStkInf(html, Field);
            html = html.replace('%href%', n);
            $('#list_stk_menu').append(html);
        }
    });
    // 显示菜单标题
    stk_title = resolveXMLEntityReference(g_stk_title).replace(/\s/g, '&nbsp;');
    $('#stk_head_inf').html(stk_title);
    $('#stk_head_inf').show();
}

/*
 * 初始化菜单翻页
 */
function stk_initPagination() {
    var ReadCount =
    0 == g_stk_curMenuLevel ?
    g_stk_main_request.ReadCount :
    g_stk_sub_request.ReadCount;
    // 如果菜单总数大于每页最多显示的菜单数，则显示翻页；否则不显示翻页
    if (g_stk_curMenuTotal > ReadCount) {
        g_stk_curTotalPage = Math.ceil(g_stk_curMenuTotal / ReadCount);
        g_stk_pageIndex = Math.min(g_stk_pageIndex, g_stk_curTotalPage);
        stk_createPageNav();
        $('.stk_pagination span').show();
    }
}

/*
 * 创建菜单翻页
 */
function stk_createPageNav() {
    var page_number = '';
    var aContent = 0;

    // to begin or end href
    var pageBeginHref = '';
    var pageLastHref = '';
    pageBeginHref =
    g_stk_pageIndex == 1 ?
    'javascript:void(0);' :
    "javascript:stk_pageNav('first')";
    pageLastHref =
    g_stk_pageIndex >= g_stk_curTotalPage ?
    'javascript:void(0);' :
    "javascript:stk_pageNav('last')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
        $('#pageBegin').attr('href', pageLastHref);
        $('#pageLast').attr('href', pageBeginHref);
    } else {
        $('#pageBegin').attr('href', pageBeginHref);
        $('#pageLast').attr('href', pageLastHref);
    }

    // to previous or next page
    var prePageHref = '';
    var nextPageHref = '';
    prePageHref =
    g_stk_pageIndex == 1 ?
    'javascript:void(0);' :
    "javascript:stk_pageNav('prePage')";
    nextPageHref =
    g_stk_pageIndex >= g_stk_curTotalPage ?
    'javascript:void(0);' :
    "javascript:stk_pageNav('nextPage')";
    if('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
        $('#prePage').attr('href', nextPageHref);
        $('#nextPage').attr('href', prePageHref);
    } else {
        $('#prePage').attr('href', prePageHref);
        $('#nextPage').attr('href', nextPageHref);
    }

    // to make page index number
    var beginPage = 0, endPage = 0, pageSize = 5;
    g_stk_pageIndex = parseInt(g_stk_pageIndex, 10);
    if (g_stk_pageIndex + parseInt(pageSize / 2, 10) >= g_stk_curTotalPage) {
        endPage = g_stk_curTotalPage;
        beginPage = endPage - pageSize + 1 > 1 ? endPage - pageSize + 1 : 1;
    } else if (g_stk_pageIndex <= parseInt(pageSize / 2, 10)) {
        beginPage = 1;
        endPage =
        beginPage + pageSize - 1 > g_stk_curTotalPage ?
        g_stk_curTotalPage :
        beginPage + pageSize - 1;
    } else {
        beginPage =
        g_stk_pageIndex - parseInt(pageSize / 2, 10) > 1 ?
        g_stk_pageIndex - parseInt(pageSize / 2, 10) :
        1;
        endPage =
        g_stk_pageIndex + parseInt(pageSize / 2, 10) > g_stk_curTotalPage ?
        g_stk_curTotalPage :
        g_stk_pageIndex + parseInt(pageSize / 2, 10);
    }
    var i = 0;
    if ('ar_sa' == LANGUAGE_DATA.current_language ||'he_il' == LANGUAGE_DATA.current_language || 'fa_fa' == LANGUAGE_DATA.current_language) {
        for (i = endPage; i >= beginPage; i--) {
            aHref =
            i == g_stk_pageIndex ?
            ' href=\"javascript:void(0);\"' :
            " href=\"javascript:stk_pageNav('" + i + "')\" " +
            ' style=\"text-decoration:underline\"';
            page_number += '<a ' + aHref + '>' + i + '</a>';
        }
    } else {
        for (i = beginPage; i <= endPage; i++) {
            aHref =
            i == g_stk_pageIndex ?
            ' href=\"javascript:void(0);\"' :
            " href=\"javascript:stk_pageNav('" + i + "')\" " +
            ' style=\"text-decoration:underline\"';
            page_number += '<a ' + aHref + '>' + i + '</a>';
        }
    }

    $('#page_num').html(page_number);
}

/*
 * 跳转到菜单指定页
 */
function stk_pageNav(to) {
    var CmdType = 0;
    var CmdIndex = 0;
    var Result = 15;
    var DataType = 1;
    var Data = 0;
    var MenuLevel = 0;

    switch (to) {
        case 'first':
            g_stk_pageIndex = 1;
            break;
        case 'last':
            g_stk_pageIndex = g_stk_curTotalPage;
            break;
        case 'prePage':
            g_stk_pageIndex--;
            break;
        case 'nextPage':
            g_stk_pageIndex++;
            break;
        default:
            g_stk_pageIndex = to;
            break;
    }

    $(document).scrollTop(0);
    stk_showSightlessDialog();
    button_enable('stk_back_page', '0');
    g_stk_jumpPageFlag = true;

    if (0 == g_stk_curMenuLevel) {
        // 获取主菜单指定页列表
        CmdType = 0;
        CmdIndex = 0;
        Result = 15;
        DataType = 1;
        Data = 0;
        MenuLevel = 0;
        stk_dataPackage('jump_page_main',
        CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
        stk_getMain('jump_page_main');
    } else {
        CmdType = g_stk_back_cmdType[g_stk_curMenuLevel - 1];
        CmdIndex = g_stk_back_cmdIndex[g_stk_curMenuLevel - 1];
        Result = g_stk_resultArray[g_stk_curMenuLevel - 1];
        DataType = g_stk_dataTypeArray[g_stk_curMenuLevel - 1];
        Data = g_stk_dataArray[g_stk_curMenuLevel - 1];
        MenuLevel = g_stk_menuLevelArray[g_stk_curMenuLevel - 1];
        stk_dataPackage('jump_page_sub',
        CmdType, CmdIndex, Result, DataType, Data, MenuLevel);
        stk_getSub('jump_page_sub');
    }
}

/*
 * 初始化菜单回退按钮
 */
function stk_initBackButton() {
    // 如果为主菜单，则隐藏回退按钮；否则显示回退按钮
    if (0 < g_stk_curMenuLevel) {
        $('#stk_back_page').show();
    } else {
        $('#stk_back_page').hide();
    }
}

/*
 *  填充菜单项信息
 */
function stk_replaceStkInf(src, Field) {
    var dest = src;

    // 菜单项表示符
    if (Field.Value) {
        dest = dest.replace('%value%', Field.Value);
    } else {
        dest = dest.replace('%value%', '');
    }

    // 菜单项名称
    if (Field.Name) {
        dest = dest.replace('%MenuName%',
        resolveXMLEntityReference(Field.Name).replace(/\s/g, '&nbsp;'));
        dest = dest.replace('%MenuTitle%',
        resolveXMLEntityReference(Field.Name).replace(/\s/g, '&nbsp;'));
    } else {
        dest = dest.replace('%MenuName%', '');
        dest = dest.replace('%MenuTitle%', '');
    }

    return dest;
}

/*
 * 文本信息框设立定时器
 */
function stk_setTextTimeout() {
    g_stk_clearTime = setTimeout( function() {
        stk_setTextTimeout();
    }, 1000);
    if (0 == g_stk_durationTime) {
        // 定时时间到，则触发文本信息对话框的OK按钮
        $('#pop_OK').trigger('click');
        return;
    } else {
        var stk_btnOK =
        (common_ok.replace(/(^\s*)|(\s*$)/g, '') +  ' = ' + g_stk_durationTime);
        //var stk_btnCancel =
        //(common_cancel.replace(/(^\s*)|(\s*$)/g, ''));
        $('#pop_OK').val(stk_btnOK);
        //$('#pop_Cancel').val(stk_btnCancel);
        g_stk_durationTime--;
    }
}

/*
 * 弹出透明框，此时不可执行用户功能动作
 */
function stk_showSightlessDialog() {
    $('#stk_div_wrapper').remove();
    $('.stk_dialog').remove();

    var dialogHtml = '';
    if ($('#stk_div_wrapper').size() < 1) {
        dialogHtml += "<div id='stk_div_wrapper'></div>";
    }
    dialogHtml += "<div class='stk_dialog'></div>";
    $('.body_bg').before(dialogHtml);
    reputPosition($('.stk_dialog'), $('#stk_div_wrapper'));
    g_stk_showSightlessDialogFlag = true;
}

/*
 * 销毁透明框，避免透明框二次弹出
 */
function stk_clearSightlessDialog() {
    $('.stk_dialog').fadeOut( function() {
        $('#stk_div_wrapper').remove();
        $('.stk_dialog').remove();
    });
    g_stk_showSightlessDialogFlag = false;
}

/*
 * 查询SIM卡上报的信息
 */
function stk_queryStatus() {
    var IsTimeout = g_stk_cmd_timeout.CmdIsNotTimeout;
    getAjaxData('api/stk/stk-query', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            IsTimeout = parseInt(ret.response.IsTimeout, 10);
            if (g_stk_cmd_timeout.CmdIsTimeout == IsTimeout) {
                clearDialog();
                clearTimeout(g_stk_clearTime);
                stk_showSightlessDialog();
                button_enable('stk_back_page', '0');
                stk_dataInit();
                stk_getMain('enter_main');
            }
        } else {
            log.error('STK: api/stk/stk-query data error');
        }
    }, {
        sync: true,
        timeout: g_STK_TIMEOUT,
        errorCB: function() {
            log.error('STK: get api/stk/stk-query file failed');
        }
    });
}

/*
 *获取STK配置信息
 */
function stk_getConfig() {
    getConfigData('config/stk/config.xml', function($xml) {
        var stk_feature = _xml2feature($xml);
        $.extend(g_stk_feature, stk_feature); //合并配置参数
    }, {
        sync: true
    });
    redirectOnCondition(null, 'stk');
}

/*
 *页面初始化前，获取STK配置信息
 */
stk_getConfig();

$(document).ready( function() {
    stk_initPage();
    stk_initBtnClick();
    stk_getStkStatus();
});