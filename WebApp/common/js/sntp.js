// JavaScript Document
/****************************************************SNTP (start)************************************/

var g_sntp_status;
var g_new_status;

$(document).ready(function(){
     button_enable("apply", "0");
    $("#sntp_enable").click(function(){
        onRadioChange();
    });
    $("#sntp_disable").click(function(){
        onRadioChange();
    });
    $("#button_apply").click(function(){
        onApply();
    });
    initPageData();
});

function initPageData()
{   
    getAjaxData("api/sntp/sntpswitch", function($xml){
        var sntp_ret = xml2object($xml);
        if (sntp_ret.type == 'response') {
        g_sntp_status = sntp_ret.response.SntpSwitch;
                }
        if (g_sntp_status == 0)
        {
            $("#sntp_disable").get(0).checked = true;
            $("#sntp_enable").get(0).checked = false;
        }
        else
        {
            $("#sntp_disable").get(0).checked = false;
            $("#sntp_enable").get(0).checked = true;
        }
    });
}


function onRadioChange()
{
    if ($("#sntp_enable").get(0).checked)
    {
        g_new_status = 1;
    }
    else
    {
        g_new_status = 0;
    }
    if (g_new_status == g_sntp_status)
    {
        button_enable("apply", "0");
    }
    else
    {
        button_enable("apply", "1");
    }
}

function onApply()
{
    if (!isButtonEnable("apply")){
        return;
    }

    g_sntp_status = g_new_status;
    var request = {
        SntpSwitch: g_sntp_status
    };
    var xmlstr = object2xml("request", request);
    button_enable('apply', '0');
    saveAjaxData("api/sntp/sntpswitch", xmlstr, function($xml){
        var rsp = xml2object($xml);
        if(isAjaxReturnOK(rsp))
        {
            button_enable("apply", "0");
            showInfoDialog(common_success);
        }
        else
        {
            initPageData();
        }
    });
}
    


/****************************************************SNTP (end)************************************/