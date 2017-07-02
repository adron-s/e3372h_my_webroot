// JavaScript Document
/****************************************************bridgemode (start)************************************/

var BridgeModeStatus = 0;
var BridgeModeNewStatus = 0;

$(document).ready(function(){
    button_enable("apply", "0");
    BridgeModeInitPage();
    $("#bridgeModeCheckbox").click(function(){
         BridgeModeOnCheckBoxChange();
     });
     $("#button_apply").click(function(){
         BridgeModeOnApply();
     });
});

function BridgeModeOnCheckBoxChange()
{
    if (BridgeModeStatus == 0)
    {           
        if ($('#bridgeModeCheckbox').get(0).checked)
        {
            button_enable("apply", "1");
            BridgeModeNewStatus = 1;
        }
        else
        {
            button_enable("apply", "0");
            BridgeModeNewStatus = 0;
        }
    }
    else
    {
        if ($('#bridgeModeCheckbox').get(0).checked)
        {
            button_enable("apply", "0");
            BridgeModeNewStatus = 1;
        }
        else
        {
            button_enable("apply", "1");
            BridgeModeNewStatus = 0;
        }
    }
}
function BridgeModeInitPage()
{   
    getAjaxData("api/security/bridgemode", function($xml){
        var ret = xml2object($xml);
        BridgeModeStatus = parseInt(ret.response.bridgemode, 10);
        if (BridgeModeStatus == 1)
        {
           g_bridgeModeStatus = true;		
           $("#bridgeModeCheckbox").get(0).checked = true;
        }
        else
        {
           g_bridgeModeStatus = false;
           $("#bridgeModeCheckbox").get(0).checked = false;
        }
    });
}

function BridgeModeOnApply()
{
    if (!isButtonEnable("apply")){
        return;
    }
    
    var request = {
        bridgemode: BridgeModeNewStatus
    };
    var xmlstr = object2xml("request", request);
    saveAjaxData("api/security/bridgemode", xmlstr, function($xml){
        var rsp = xml2object($xml);
        if(isAjaxReturnOK(rsp))
        {
            button_enable("apply", "0");
            BridgeModeInitPage();
            showInfoDialog(common_success);
        }
        else
        {
            button_enable("apply", "0");
            BridgeModeInitPage();
            showInfoDialog(common_failed);
        }
    });
}
    


/****************************************************nat (end)************************************/