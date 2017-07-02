var g_server = null;

$(document).ready(function() {

    init_server();

    show_hide_snd();

    $("#apply").click(function() {
        if (!isButtonEnable('apply')) {
            return;
        }
        apply();
    });
    $("#check_snd").click(function() {
    	button_enable('apply', '1');
        show_hide_snd();
    });
    button_enable('apply', '0');
    $('.input_style').bind('input change cut paste keydown', function(e) {
        if (MACRO_KEYCODE != e.keyCode) {
            button_enable('apply', '1');
        }
    });
});
function get_data() {

    g_server.proxyserveraddress = $.trim($('#input_proxyserveradd').val());
    g_server.proxyserverport = $.trim($('#input_proxyserverport').val());
    g_server.registerserveraddress = $.trim($('#input_regserveradd').val());
    g_server.registerserverport = $.trim($('#input_regserverport').val());
    g_server.sipserverdomain = $.trim($('#input_regserverdoma').val());
    if ($('#check_snd').get(0).checked == 1) {
    	g_server.secondproxyserveraddress = $.trim($('#input_snd_proxyserveradd').val());
    	g_server.secondproxyserverport = $.trim($('#input_snd_proxyserverport').val());
    	g_server.secondregisterserveraddress = $.trim($('#input_snd_regserveradd').val());
    	g_server.secondregisterserverport = $.trim($('#input_snd_regserverport').val());
    	g_server.secondsipserverdomain = $.trim($('#input_snd_regserverdoma').val());
    } else {
    	g_server.secondproxyserveraddress = '';
    	g_server.secondregisterserveraddress = '';
    	g_server.secondsipserverdomain = '';
    }

}

function set_data() {

    $('#input_proxyserveradd').val(g_server.proxyserveraddress);
    $('#input_proxyserverport').val(g_server.proxyserverport);
    $('#input_regserveradd').val(g_server.registerserveraddress);
    $('#input_regserverport').val(g_server.registerserverport);
    $('#input_regserverdoma').val(g_server.sipserverdomain);

    $('#input_snd_proxyserveradd').val(g_server.secondproxyserveraddress);
    $('#input_snd_proxyserverport').val(g_server.secondproxyserverport);
    $('#input_snd_regserveradd').val(g_server.secondregisterserveraddress);
    $('#input_snd_regserverport').val(g_server.secondregisterserverport);
    $('#input_snd_regserverdoma').val(g_server.secondsipserverdomain);

    if (('' != g_server.secondproxyserveraddress) 
    || ('' != g_server.secondregisterserveraddress) 
    || ('' != g_server.secondsipserverdomain)) {
        $('#check_snd').get(0).checked = 1;
    } else {
        $('#check_snd').get(0).checked = 0;
    }
}

function apply() {
    clearAllErrorLabel();

    if (!check_server()) {
        return false;
    }
    get_data();
    button_enable('apply', '0');

    var sendata = {
        sipserver : g_server
    }
    var newXmlString = object2xml('request', sendata);
    saveAjaxData('api/voice/sipserver', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            init_server();
            showInfoDialog(common_success);
        } else {
        	button_enable('apply','1');
            if ( typeof (ret.error) != 'undefined' && ret.error.code == ERROR_SYSTEM_BUSY) {
                showInfoDialog(common_system_busy);
            } else {
                showInfoDialog(common_fail);
            }
        }
    });
}

function init_server() {
    getAjaxData('api/voice/sipserver', function($xml) {
        var cap_ret = xml2object($xml);
        if ('response' == cap_ret.type) {
            g_server = cap_ret.response.sipserver;
            set_data();
        }
    }, {
        sync : true
    });
}

function show_hide_snd() {
    if (1 == $('#check_snd').get(0).checked) {
        $('#tr_snd_proxyserveradd').show();
        $("#tr_snd_proxyserverport").show();
        $("#tr_snd_regserveradd").show();
        $("#tr_snd_regserverport").show();
        $("#tr_snd_regserverdoma").show();
    } else {
        clearAllErrorLabel();
        $("#tr_snd_proxyserveradd").hide();
        $("#tr_snd_proxyserverport").hide();
        $("#tr_snd_regserveradd").hide();
        $("#tr_snd_regserverport").hide();
        $("#tr_snd_regserverdoma").hide();
    }
}

function check_port(port) {
    if ( !IsDigital( port ) )
    {
        return false;
    }
    if (1 > port || port > 65535) {
        return false;
    }

    return true;
}

function isValidAscIICharset(str) {
    var i = 0;
    for ( i = 0; i < str.length; i++) {
        if (!(str.charCodeAt(i) >= 33 && str.charCodeAt(i) <= 126)) {
            return false;
        }
    }
    return true;
}

function isVaildDomainNameChar(val) {
    if (val == '') {
        return false;
    }
    for ( j = 0; j < val.length; j++) {
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

function isStartWithChar(str) {
    var reg = /^[a-zA-Z]/;
    var value = reg.test(str);
    return value;
}

function isValidDomainName(value) {
    var flag = '';
    if (!isValidAscIICharset(value) || !isVaildDomainNameChar(value)) {
        flag = false;
    } else if ((value.indexOf(".") == -1 && value != "") || (value.indexOf(".") != -1 && value.length == 1)) {
        flag = false;
    } else if (/\.$/.exec(value) || /^\./.exec(value) || /-$/.exec(value) || /^-/.exec(value)) {
        flag = false;
    } else {
        flag = true;
    }
    return flag;

}
function isInteger(value)
{
    if (/^(\+|-)?\d+$/.test(value))
    {
       return true;
    }
    else
    {
        return false;
    }
}

function isPlusInteger(value)
{
    if (isInteger(value) && parseInt(value, 10) >= 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isIpFormat(str)
{
    var addrParts = str.split('.');
    if (addrParts.length != 4 )
        return false;

    for(var i=0;i<addrParts.length;i++)
    {
        if (isPlusInteger(addrParts[i]) == false)
        {
            return false;
        }
    }

    return true;
}

function isValid_IpAddress(address) {
   var i = 0;

    if ( address == '0.0.0.0' ||
            address == '255.255.255.255' )
    {
        return false;
    }

    var addrParts = address.split('.');
    if ( addrParts.length != 4 )
    {
        return false;
    }
   for (i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) || addrParts[i] ==""
          || addrParts[i].charAt(0) == '+' ||  addrParts[i].charAt(0) == '-'
          || (addrParts[i].charAt(0) == '0' && addrParts[i].length > 1))
        {
            return false;
        }
      if (addrParts[i].length > 3 || addrParts[i].length < 1)
      {
          return false;
      }
      if (!isInteger(addrParts[i]) || addrParts[i] < 0)
      {
          return false;
      }
      num = parseInt(addrParts[i], 10);
      if (i == 0 && num == 0)
      {
          return false;
      }
        if ( num < 0 || num > 255 )
        {
            return false;
        }
   }
   return true;
}

function isWanAbc_IpAddress(address)
{
    if (isValid_IpAddress(address) == false)
    {
        return false;
    }

    var addrParts = address.split('.');
    var num = 0;

    num = parseInt(addrParts[0], 10);
    if (num < 1 || num >= 224 || num == 127)
    {
        return false;
    }

    return true;
}

function is_ValidUrl(url)
{
    var result = url.match("^[https:\/]*([^\/]*)");
    if(result[1])
    {
        var domain = result[1].match("^([A-Za-z0-9-_]+\.){1,}([A-Za-z]+)$"); 
        try{return domain[0]}catch(e){};
    }
    return false;
}

function Check_IsValidDomain(str,maxLength)
{
    if(str.length=0||str.length>maxLength)
    {
        return false;
    }
    if(isValidDomainName(str)==false)
    {
          return false;
    }
    return true;
}

function CheckisValidIPDomain(ipStr, maxLength) {
    if ('' == ipStr) {
        return false;
    }
    if (isIpFormat(ipStr)) {
        if (isWanAbc_IpAddress(ipStr) == false) {
            return false;
        }
    } else {
        if (Check_IsValidDomain(ipStr, maxLength) == false) {
            return false;
        }

    }
    return true;
}

function check_server(type) {
    var proxyserveradd = $.trim($('#input_proxyserveradd').val());
    if (false == CheckisValidIPDomain(proxyserveradd)) {
        showErrorUnderTrEx('input_proxyserveradd', IDS_VOIP_SipServerErrStr3);
        return false;
    }
    if (!check_port($.trim($('#input_proxyserverport').val()))) {
        showErrorUnderTrEx('input_proxyserverport', IDS_VOIP_SipServerErrStr5);
        return false;
    }

    var regserveradd = $.trim($('#input_regserveradd').val());
    if (false == CheckisValidIPDomain(regserveradd)) {
        showErrorUnderTrEx('input_regserveradd', IDS_VOIP_SipServerErrStr1);
        return false;
    }
    if (!check_port($.trim($('#input_regserverport').val()))) {
        showErrorUnderTrEx('input_regserverport', IDS_VOIP_SipServerErrStr2);
        return false;
    }
    if ($.trim($('#input_regserverport').val()) == $.trim(g_server.useragentport)) {
        showErrorUnderTrEx('input_regserverport', IDS_VOIP_VoiceAdvanceErrStr10);
        return false;
    }
    var regserverdoma = $.trim($('#input_regserverdoma').val());
    if ('' != regserverdoma 
        && (!isValidAscIICharset(regserverdoma) || !isVaildDomainNameChar(regserverdoma))) {
        showErrorUnderTrEx('input_regserverdoma', IDS_security_urlfilter_error);
        return false;
    }
	
	 if ((regserverdoma.indexOf(".") == -1 && regserverdoma != "") ||(regserverdoma.indexOf(".") != -1 && regserverdoma.length == 1) ) {
        showErrorUnderTrEx('input_regserverdoma', IDS_security_sip_domain_contain);
        return false;
    }
    if (/\.$/.exec(regserverdoma) || /^\./.exec(regserverdoma) || /-$/.exec(regserverdoma)|| /^-/.exec(regserverdoma)) {
        showErrorUnderTrEx('input_regserverdoma', IDS_security_domain_dot_char);
        return false;
    }
    
    //send
    if ($('#check_snd').get(0).checked == 1) {
    	var snd_proxyserveradd = $.trim($('#input_snd_proxyserveradd').val());
	    if( '' != snd_proxyserveradd 
	    && false == CheckisValidIPDomain( snd_proxyserveradd )) {
	        showErrorUnderTrEx('input_snd_proxyserveradd', IDS_VOIP_SipServerErrStr3);
	        return false;
	    }
	
	    if (!check_port($.trim($('#input_snd_proxyserverport').val()))) {
	        showErrorUnderTrEx('input_snd_proxyserverport', IDS_VOIP_SipServerErrStr5);
	        return false;
	    }
	
	    var snd_regserveradd = $.trim($('#input_snd_regserveradd').val());
	    if( '' != snd_regserveradd
	    && false ==  CheckisValidIPDomain( snd_regserveradd )) {
	        showErrorUnderTrEx('input_snd_regserveradd', IDS_VOIP_SipServerErrStr1);
	        return false;
	    }
	    if ($.trim($('#input_regserveradd').val()) == $.trim($('#input_snd_regserveradd').val())) {
	        showErrorUnderTrEx('input_snd_regserveradd', IDS_VOIP_SipServerErrStr9);
	        return false;
	    }
	
	    if (!check_port($.trim($('#input_snd_regserverport').val()))) {
	        showErrorUnderTrEx('input_snd_regserverport', IDS_VOIP_SipServerErrStr2);
	        return false;
	    }
	
	    var snd_regserverdoma = $.trim($('#input_snd_regserverdoma').val());
	    if ( '' != snd_regserverdoma 
	    && (!isValidAscIICharset(snd_regserverdoma) || !isVaildDomainNameChar(snd_regserverdoma))) {
	        showErrorUnderTrEx('input_snd_regserverdoma', IDS_security_urlfilter_error);
	        return false;
	    }
	    
	    if ((snd_regserverdoma.indexOf(".") == -1 && snd_regserverdoma != "") ||(snd_regserverdoma.indexOf(".") != -1 && snd_regserverdoma.length == 1) ) {
	        showErrorUnderTrEx('input_snd_regserverdoma', IDS_security_sip_domain_contain);
	        return false;
	    }
	    if (/\.$/.exec(snd_regserverdoma) || /^\./.exec(snd_regserverdoma) || /-$/.exec(snd_regserverdoma)|| /^-/.exec(snd_regserverdoma)) {
	        showErrorUnderTrEx('input_snd_regserverdoma', IDS_security_domain_dot_char);
	        return false;
	    }
	
	    if ($.trim($('#input_snd_regserverdoma').val()) == $.trim($('#input_regserverdoma').val())
	        && '' !=  $.trim($('#input_snd_regserverdoma').val())  ) {
	        showErrorUnderTrEx('input_snd_regserverdoma', IDS_VOIP_SipServerErrStr9);
	        return false;
	    }

    } 

    return true;
}