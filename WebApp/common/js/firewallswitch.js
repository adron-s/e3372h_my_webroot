var g_firewallSwitchData;
var isFirewallwanportpingswitch_enable = false;
$(document).ready(function() {
    button_enable('apply_button', '0');
    $("input[name='firewallswitch']").click(function() {
        button_enable('apply_button', '1');
        checked_ck();
    });
    initPage();
});

function initPage() {
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            g_firewallSwitchData = ret.response;
            $('#checkbox_FirewallMainSwitch').get(0).checked = (g_firewallSwitchData.FirewallMainSwitch == 1);
            $('#checkbox_FirewallIPFilterSwitch').get(0).checked = (g_firewallSwitchData.FirewallIPFilterSwitch == 1);
            $('#checkbox_FirewallWanPortPingSwitch').get(0).checked = (g_firewallSwitchData.FirewallWanPortPingSwitch == 0);
            $('#checkbox_urlfilter').get(0).checked = (g_firewallSwitchData.firewallurlfilterswitch == 1);
            if(g_module.fw_macfilter_enabled)
            {
                $('#checkbox_firewallmacfilterswitch').get(0).checked = (g_firewallSwitchData.firewallmacfilterswitch == 1);
            }
            checked_ck();
        }
    });
    
    setDisplay();
    checkURLfilter();
}
function setDisplay()
{
    if(!g_module.fw_macfilter_enabled)
    {
        $('#firewallmacfilter').remove();
    }
    getConfigData('config/webuicfg/config.xml', function($xml) {
        var ret = _xml2feature($xml);      
        if('0' == ret.firewallwanportpingswitch_enable)
        {
            $('#firewallWanPortPingSwitch').hide();
        }
        else {
            $('#firewallWanPortPingSwitch').show();            
        } 
    });
    
    
}

function checkURLfilter(){
	if(checkLeftMenu(g_PageUrlTree.settings.security.urlfilter)){
	$('#firewallurlfilter').show();
	//$("#firewallipfilter").show();
    $('#main_content_note').html(IDS_firewall_help_urlfilter);	
	}else{
		//$("#firewallipfilter").hide();	
		$('#firewallurlfilter').hide();
        $('#main_content_note').html(firewall_help_firewall_switch);	
	}
	
	
}


function apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button')) {
        return;
    }
    button_enable('apply_button', '0');    
    g_firewallSwitchData.FirewallMainSwitch = $('#checkbox_FirewallMainSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallIPFilterSwitch = $('#checkbox_FirewallIPFilterSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallWanPortPingSwitch = $('#checkbox_FirewallWanPortPingSwitch').get(0).checked ? 0 : 1;
    g_firewallSwitchData.firewallurlfilterswitch=$('#checkbox_urlfilter').get(0).checked ? 1 : 0;
    if(g_module.fw_macfilter_enabled)
    {
        g_firewallSwitchData.firewallmacfilterswitch=$('#checkbox_firewallmacfilterswitch').get(0).checked ? 1 : 0;
    }
    var xmlstr_security = object2xml('request', g_firewallSwitchData);
    saveAjaxData('api/security/firewall-switch', xmlstr_security, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            initPage();
        }
    });
}

//
function checked_ck() {
    if ($('#checkbox_FirewallMainSwitch').get(0).checked)
    {
        $('#checkbox_FirewallIPFilterSwitch').removeAttr('disabled');
        $('#checkbox_FirewallWanPortPingSwitch').removeAttr('disabled');
        
        $('#checkbox_urlfilter').removeAttr('disabled');
        if(g_module.fw_macfilter_enabled)
        {
            $('#checkbox_firewallmacfilterswitch').removeAttr('disabled');
        }
        $('#label_enable').css('color', '#000000');
        $('#label_disable').css('color', '#000000');
    }
    if (!$('#checkbox_FirewallMainSwitch').get(0).checked)
    {
        $('#checkbox_FirewallIPFilterSwitch').attr('disabled', 'disabled');
        $('#checkbox_FirewallWanPortPingSwitch').attr('disabled', 'disabled');
        $('#checkbox_urlfilter').attr('disabled','disabled');
        $('#checkbox_FirewallIPFilterSwitch').get(0).checked = (g_firewallSwitchData.FirewallIPFilterSwitch == 1);
        $('#checkbox_FirewallWanPortPingSwitch').get(0).checked = (g_firewallSwitchData.FirewallWanPortPingSwitch == 0);       
        $('#checkbox_urlfilter').get(0).checked = (g_firewallSwitchData.firewallurlfilterswitch == 1);     
        if(g_module.fw_macfilter_enabled)
        {
            $('#checkbox_firewallmacfilterswitch').attr('disabled','disabled');
            $('#checkbox_firewallmacfilterswitch').get(0).checked = (g_firewallSwitchData.firewallmacfilterswitch == 1); 
        }
        $('#label_enable').css('color', '#baaaaa');
        $('#label_disable').css('color', '#baaaaa');
    }

}
