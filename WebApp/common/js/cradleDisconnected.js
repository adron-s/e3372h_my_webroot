var PPPOE_NOACCOUNT = '905';
var PPPOE_ERRORACCOUNT = '906';
var CRADLE_NETLINT_EXIST = '1';
function main_beforeready() {
    if (g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
        HOME_PAGE_URL = 'quicksetup.html';
    }
}
function initPage() {

    getAjaxData('api/cradle/status-info', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            if(CRADLE_NETLINT_EXIST == ret.response.cradlestatus) {
                if (PPPOE_NOACCOUNT != ret.response.connectstatus && PPPOE_ERRORACCOUNT != ret.response.connectstatus) {
               
                    gotoPageWithoutHistory(HOME_PAGE_URL);
                
                } else if (PPPOE_NOACCOUNT == ret.response.connectstatus) {
                    
                    var notes = IDS_ethernet_username_password_empty.replace("%s","PPPoE");
                    
                    $('#crandle_notes').html(notes);
                    $('#cradleusername').removeAttr('value');
                    $('#cradlepassword').removeAttr('value');
                } else if (PPPOE_ERRORACCOUNT == ret.response.connectstatus) {
                    var current_language = g_main_convergedStatus.CurrentLanguage;
					var support_language = [];
					support_language = CreateArray(LANGUAGE_DATA.usermanual_language_list.support_language.language);
					var supportFlag = false;
					if(typeof(support_language)!= 'undefined' && support_language != '') {
						var i = 0;
						for(i=0 ;i < support_language.length;i++) {
							if(current_language.replace(/_/,'-') == support_language[i].replace(/_/,'-')) {
								supportFlag = true;
							}
						}
					}
					if(supportFlag == false) {
						current_language = LANGUAGE_DATA.usermanual_language_list.default_language.replace(/_/,'-');
					}
                    var replace_info = "<span class='pppoe_help_link clr_blue_a clr_blue_hover'><a href='../usermanual/" + current_language + "/usermanual/faq_plugin/web_faq_task_00009.html'>"
                            + IDS_ethernet_pppoe_conn_help + "</a></span>";
                    var pppoe_dialup_failure = IDS_ethernet_pppoe_conn_fail.replace("%s",replace_info);
                    $('#crandle_notes').html(pppoe_dialup_failure); 
                }
            }else{
                gotoPageWithoutHistory(HOME_PAGE_URL);
            }
        }
        
    }, {
        sync:true
    });
}
/*function checkInputChar(unamepwd){
     var reg = /^[a-zA-Z0-9_]{1,63}$/g;
     var value = reg.test(unamepwd);
     return value;
}*/
function cradle_validateInput(username, password) {
   $('#crandleUsername_error').html('');
   $('#crandlePassword_error').html('');
    var validate = true;
    if (username == '') {
        $('#crandleUsername_error').html(settings_hint_user_name_empty).attr('class', 'error_message');
        $('#cradleusername').focus();
        $('#cradleusername').val('');
        button_enable('link_connetcioncradle', '0');
        return false;
    }
      if (!checkInputPPPoEChar(username)) {
          $('#crandleUsername_error').html(IDS_ethernet_pppoe_username).attr('class', 'error_message');
          $('#cradleusername').val('');
          $('#cradleusername').focus();
          $('#cradlepassword').val('');
          button_enable('link_connetcioncradle', '0');
          return false;
     } 
      if (!checkInputPPPoEChar(password)) {
          $('#crandlePassword_error').html(IDS_ethernet_pppoe_password).attr('class', 'error_message');
          $('#cradleusername').val('');
          $('#cradleusername').focus();
          $('#cradlepassword').val('');
          button_enable('link_connetcioncradle', '0');
          return false;
     } 
    if (password == '') {
        $('#crandlePassword_error').html(dialup_hint_password_empty).attr('class', 'error_message');
        $('#cradlepassword').focus();
        $('#cradlepassword').val('');
        button_enable('link_connetcioncradle', '0');
        return false;
    }
    return validate;
}


function onApply(){
    var name = $.trim($('#cradleusername').val());
    var psd = $.trim($('#cradlepassword').val());

    var valid = cradle_validateInput(name, psd);

     if(valid){
         var request = {
         pppoeuser: wifiSsidResolveCannotParseChar(name),
         pppoepwd: wifiSsidResolveCannotParseChar(psd)
         
         };
         var xmlstr = object2xml('request', request);
         log.debug('xmlstr = ' + xmlstr);
         button_enable('link_connetcioncradle', '0');
         saveAjaxData('api/cradle/basic-info', xmlstr, function($xml) {
         log.debug('api/cradle/basic-info successed!');
         var ret = xml2object($xml);
          
         window.location = HOME_PAGE_URL;

         },{
         	enc:true
         });
     }
  }
main_beforeready();
$(document).ready(function() {
    initPage();
    getLoginStatus();
    setLoginStatus('cradleDisconnected.html');
    $('#link_login_cradleDisconnection').click(function() {
        window.location = HOME_PAGE_URL;
    });
     button_enable('link_connetcioncradle', '0');
    $('#cradleusername').live('input change cut paste keydown keyup', function() {
        if($('#cradleusername').val()==""||$('#cradlepassword').val()==""){
            button_enable('link_connetcioncradle', '0');
        }else{
            button_enable('link_connetcioncradle', '1');
        }
        

    });
    $('#cradlepassword').live('input change cut paste keydown keyup', function(e) {
        if($('#cradleusername').val()==""||$('#cradlepassword').val()==""){
            button_enable('link_connetcioncradle', '0');
        }else{
            if(MACRO_KEYCODE != e.keyCode){
                 button_enable('link_connetcioncradle', '1');
            }
           
        }

    });
        
    $('#link_connetcioncradle').bind('click', function() {
        if (!isButtonEnable('link_connetcioncradle')) {
            return;
        }
        
        if (getLoginStatus(onApply, 'cradleDisconnected.html')) {
            onApply();
        }

    });
   
});
