var edit_flag = false;
var editIndex = -1;
var chooseContent = "<div id='file_path_wrapper' class='file_path_wrapper'><p>" + sd_hint_select_a_folder + "</p><div id='file_tree_wrapper' class='file_tree_wrapper'><div id='file_tree_div' class='file_tree_div'></div></div></div>";
var ok_flag = 0;
var add_flag = 0;
var MAXLINENEMBER = 5;
var SHAREALLPATH_TYPE = '0';
var USERSHAREPATH_MAXLENGTH = 255;
var folder_path = {
    CurrentPath: ''
};
var web_sharing = {
    SDShareMode: '',
    SDCardShareStatus: '',
    SDShareFileMode: '',
    SDAccessType: '',
    SDSharePath: ''
};
var g_usermanege_Data = [];
var g_back_data = [];
var g_edit_number = [];
var g_add_number = [];

var root_path = '/';
var FILE_LIST_TYPE_FOLDER = '0';
var g_indexnew = 0;
var addIndex = 0;
var showpassword = 0;
function addUsermanegement(insertNode) {
   var accesstype =  null;
   var shareallpath = null;
    if(arguments[2] == '0'){
      accesstype = sd_label_read_only;
    
    }else{
      accesstype = sd_label_read_write;
    }
    
    if(arguments[3] == '1'){
      shareallpath =IDS_system_samba_share_allpath;
    
    }else{
     shareallpath = arguments[3];
    }
    
    var addLine = null;
    
    addLine = "<tr class=\"user_add_line\">";

    addLine += "<td  width='100px'  style='word-break: break-all;'>" + arguments[1] + "</td>";
    addLine += "<td>" + accesstype + "</td>";
    addLine += "<td>" + shareallpath + "</td>";
    addLine += "<td class='user_options'><span class=\"button_edit_list clr_blue\">" + common_edit + "</span><span class=\"button_urlfilter_delete_list clr_blue\">" + common_delete + "</span></td></tr>";
    if(edit_flag) {
        $('.user_add_line').eq(editIndex).remove();
        if(editIndex != 0) {

            $('.user_add_line').eq(editIndex-1).after(addLine);
        } else {
            $(insertNode).eq(0).after(addLine);
        }

    } else {
        var currentTrTotal = $(insertNode).size();
        $(insertNode).eq(currentTrTotal - 2).after(addLine);
    }

    if($('.user_add_line').size() >= MAXLINENEMBER) {
        button_enable('add_item', '0');

    } else {
        button_enable('add_item', '1');
    }
}

function addArry() {
    if(g_indexnew == 1){
        var usermanege_add = {
            index:'',
            accountname:'',
            accountpwd:'',
            sharepath:'',
            accesstype:'',
            shareallpath:''
            };
    } else{
        var usermanege_add = {
            accountname:'',
            accountpwd:'',
            sharepath:'',
            accesstype:'',
            shareallpath:''
        };
    }
    
    if(!edit_flag && g_indexnew == 1) {
        usermanege_add.index = arguments[0];
        usermanege_add.accountname = arguments[1];
        usermanege_add.accountpwd = arguments[2];
        usermanege_add.sharepath = arguments[3];
        usermanege_add.accesstype = arguments[4];
        usermanege_add.shareallpath = arguments[5];
        g_add_number.push(g_usermanege_Data.length);
        g_usermanege_Data.push(usermanege_add);
    } else if(!edit_flag && g_indexnew != 1){
        usermanege_add.accountname = arguments[0];
        usermanege_add.accountpwd = arguments[1];
        usermanege_add.sharepath = arguments[2];
        usermanege_add.accesstype = arguments[3];
        usermanege_add.shareallpath = arguments[4];
        g_add_number.push(g_usermanege_Data.length);
        g_usermanege_Data.push(usermanege_add);
    } else {
        g_usermanege_Data[editIndex].accountname = arguments[0];
        g_usermanege_Data[editIndex].accountpwd = arguments[1];
        g_usermanege_Data[editIndex].sharepath = arguments[2];
        g_edit_number.push(editIndex);
        g_usermanege_Data[editIndex].accesstype = arguments[3];
        g_usermanege_Data[editIndex].shareallpath = arguments[4];

    }

}

function usermanege_initpage() {
    g_usermanege_Data = [];
    g_edit_number = [];
    g_add_number = [];
    getAjaxData('api/sdcard/share-account', function($xml) {
        var ret = xml2object($xml);
        var temp = ret.response.accounts.account;
        if(typeof(temp) != 'undefined' && null != temp){
	        g_usermanege_Data = CreateArray(temp);
		g_back_data = CreateArray(temp);
		if (typeof(g_moduleswitch.encrypt_enabled) != 'undefined' && g_moduleswitch.encrypt_enabled == 1) {
		        $.each(g_usermanege_Data, function(i) {
		        	if (g_usermanege_Data[i].accountname != '' && g_usermanege_Data[i].accountname != null && typeof(g_usermanege_Data[i].accountname) != 'undefined') {	        		
					g_usermanege_Data[i].accountpwd = COMMON_PASSWORD_VALUE;
					g_back_data[i].accountpwd = COMMON_PASSWORD_VALUE;
		        	}
		        });
		}
	      }
    }, {
        sync : true
    });
    if(g_usermanege_Data.length > 0){
       showData();
  }
}
function displayCustomerTree(parent_id , root_path) {
    var current_path = root_path;
    var filter_path = '';
    var newList = '<ul>';

    if ('/' == current_path) {
        filter_path = '/';
    } else {
        filter_path = '/' + current_path.replace(/\*/g, '/');
    }
    folder_path.CurrentPath = filter_path;
    var send_xml = object2xml('request', folder_path);
    saveAjaxData('api/sdcard/sdfile', send_xml, function($xml) {
        var return_ret = xml2object($xml);
        if('/' == root_path) {
            $('#' + parent_id).empty();
        }
        if ('response' == return_ret.type) {
            var folder_lists = return_ret.response.FileList.File;
            if ($.isArray(folder_lists)) {
                var folder_count = 0;
                var folder_list_count = 0;
                $.each(folder_lists, function(i) {
                    if (FILE_LIST_TYPE_FOLDER == folder_lists[i].Type) {
                        folder_count++;
                    }
                });
                $.each(folder_lists, function(i) {
                    if (FILE_LIST_TYPE_FOLDER == folder_lists[i].Type) {
                        var folder_parent_id = '';
                        var folder_parent_path = '';
                        var folder_name = '';

                        if ('/' == root_path) {
                            folder_name = sd_resolveEntityReference(folder_lists[i].Name);
                            folder_parent_id = parent_id + i;
                            folder_parent_path = folder_name;
                        } else {
                            folder_name = sd_resolveEntityReference(folder_lists[i].Name);
                            folder_parent_id = parent_id + i;
                            folder_parent_path = current_path + '\*' + folder_name;

                        }
                        folder_parent_path = folder_parent_path.replace(/\'/g, '&#39;');
                        if ((folder_count - 1) > folder_list_count) {
                            newList += "<li id='" + folder_parent_id + "' class='sub_folder_li expandable'><div id='list_flag\*" + folder_parent_id + "' class='hitarea expandable-hitarea'></div><span  id='folder_" + folder_parent_path + "' class='folder_path_line'><a class='folder_name' href='javascript: void(0)'><pre>" + folder_name + '</pre></a></span></li>';
                        } else {
                            newList += "<li id='" + folder_parent_id + "' class='sub_folder_li expandable lastExpandable'><div id='list_flag\*" + folder_parent_id + "' class='hitarea expandable-hitarea lastExpandable-hitarea'></div><span id='folder_" + folder_parent_path + "' class='folder_path_line'><a class='folder_name' href='javascript: void(0)'><pre>" + folder_name + '</pre></a></span></li>';
                        }

                        folder_list_count++;
                    }
                });
                if ('<ul>' == newList) {
                    if ($('#' + parent_id).children('div').hasClass('lastExpandable-hitarea')) {
                        $('#' + parent_id).children('div').removeClass('hitarea').removeClass('lastExpandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder_last');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    } else {
                        $('#' + parent_id).removeClass('expandable').removeClass('collapsable').children('div').removeClass('hitarea').removeClass('expandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    }
                } else {
                    $('#' + parent_id).append(newList);
                }
            } else if (typeof(folder_lists) != 'undefined') {
                if (FILE_LIST_TYPE_FOLDER == folder_lists.Type) {
                    var folder_parent_id = '';
                    var folder_parent_path = '';
                    var folder_name = '';

                    if ('/' == root_path) {
                        folder_name = sd_resolveEntityReference(folder_lists.Name);
                        folder_parent_id = parent_id + '0';
                        folder_parent_path = folder_name;
                    } else {
                        folder_name = sd_resolveEntityReference(folder_lists.Name);
                        folder_parent_id = parent_id + '0';
                        folder_parent_path = current_path + '\*' + folder_name;
                    }
                    folder_parent_path = folder_parent_path.replace(/\'/g, '&#39;');
                    newList += "<li id='" + folder_parent_id + "' class='sub_folder_li expandable lastExpandable'><div id='list_flag\*" + folder_parent_id + "' class='hitarea expandable-hitarea lastExpandable-hitarea'></div><span id='folder_" + folder_parent_path + "' class='folder_path_line'><a class='folder_name' href='javascript: void(0)'><pre>" + folder_name + '</pre></a></span></li>';
                    $('#' + parent_id).append(newList);
                } else {
                    if ($('#' + parent_id).children('div').hasClass('lastExpandable-hitarea')) {
                        $('#' + parent_id).children('div').removeClass('hitarea').removeClass('lastExpandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder_last');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    } else {
                        $('#' + parent_id).removeClass('expandable').removeClass('collapsable').children('div').removeClass('hitarea').removeClass('expandable-hitarea').removeClass('collapsable-hitarea').addClass('noSubFolder');
                        $('#' + parent_id).children('span.folder_path_line').css({
                            'background': 'none'
                        });
                    }
                }
            } else {
                if ($('#' + parent_id).children('div').hasClass('lastExpandable-hitarea')) {
                    $('#' + parent_id).children('div').removeClass().addClass('noSubFolder_last');
                    $('#' + parent_id).children('span.folder_path_line').css({
                        'background': 'none'
                    });
                } else {
                    $('#' + parent_id).removeClass('expandable').removeClass('collapsable').children('div').removeClass().addClass('noSubFolder');
                    $('#' + parent_id).children('span.folder_path_line').css({
                        'background': 'none'
                    });
                }
            }
        }
    }, {
        timeout:3000000
    });
}

function setDisplayContent( web_share_obj) {
    root_path = web_share_obj.SDSharePath == '' ? '/' : web_share_obj.SDSharePath;

    $('#file_path_samba').html('<pre>' + XSSResolveCannotParseChar(root_path) + '</pre>');
}

function createSubFolderTree(obj_id) {
    if ($('#' + obj_id).hasClass('lastExpandable')) {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).addClass('lastCollapsable');
        $('#' + obj_id).removeClass('lastExpandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).addClass('loaded_sublist');
    } else {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).addClass('loaded_sublist');
    }
}

function showSubFolderTree(obj_id) {
    if ($('#' + obj_id).hasClass('lastExpandable')) {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).addClass('lastCollapsable');
        $('#' + obj_id).removeClass('lastExpandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'block'
        });
    } else {
        $('#' + obj_id).addClass('collapsable');
        $('#' + obj_id).removeClass('expandable');
        $('#' + obj_id).children('div').addClass('collapsable-hitarea');
        $('#' + obj_id).children('div').removeClass('expandable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'block'
        });
    }
}

function hideSubFolderTree(obj_id) {
    if ($('#' + obj_id).hasClass('lastCollapsable')) {
        $('#' + obj_id).addClass('expandable');
        $('#' + obj_id).removeClass('collapsable');
        $('#' + obj_id).addClass('lastExpandable');
        $('#' + obj_id).removeClass('lastCollapsable');
        $('#' + obj_id).children('div').addClass('expandable-hitarea');
        $('#' + obj_id).children('div').removeClass('collapsable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'none'
        });
    } else {
        $('#' + obj_id).addClass('expandable');
        $('#' + obj_id).removeClass('collapsable');
        $('#' + obj_id).children('div').addClass('expandable-hitarea');
        $('#' + obj_id).children('div').removeClass('collapsable-hitarea');
        $('#' + obj_id).children('ul').css({
            'display': 'none'
        });
    }
}

function checkName_pwd(usermanege_name, usermanege_password,confirm_password) {
    clearAllErrorLabel();
    var validate = true;

    if (usermanege_name == '') {
        showErrorUnderTextbox('usermanege_name', settings_hint_user_name_empty);
        $("#usermanege_name").val("");
 
        $("#usermanege_name").focus();
        return false;
    }
    if(edit_flag && showpassword ==0){
	    if (usermanege_password == '' && usermanege_name != '') {
	        showErrorUnderTextbox('usermanege_password', dialup_hint_password_empty);
	        $("#usermanege_password").val("");
	        $("#confirm_password").val("");
	        $("#usermanege_password").focus();
	        return false;
	    }
	   
	     if (!samba_checkusername(usermanege_name)) {
	        showErrorUnderTextbox("usermanege_name", IDS_share_samba_username_limit);
	        $("#usermanege_name").val("");
	
	        $("#usermanege_name").focus();
	        return false;
	    }
	   
	}else{
		if (usermanege_password == '' && usermanege_name != '') {
	        showErrorUnderTextbox('usermanege_password', dialup_hint_password_empty);
	        $("#usermanege_password").val("");
	        $("#confirm_password").val("");
	        $("#usermanege_password").focus();
	        return false;
	    }
	     if(confirm_password == ''){
	        showErrorUnderTextbox('confirm_password', system_hint_new_confirm_password_empty);
	        $("#confirm_password").focus();
	        
	        return false;
	    }
	    if(usermanege_password != confirm_password){
	        showErrorUnderTextbox('confirm_password', system_hint_new_and_confirm_pwd_same);
	        $("#usermanege_password").val("");
	        $("#confirm_password").val("");
	        $("#usermanege_password").focus();
	        return false;
	        
	    }
	     if (!samba_checkusername(usermanege_name)) {
	        showErrorUnderTextbox("usermanege_name", IDS_share_samba_username_limit);
	        $("#usermanege_name").val("");
	
	        $("#usermanege_name").focus();
	        return false;
	    }
	   if (!samba_checkpwd(usermanege_password)) {
	        showErrorUnderTextbox("usermanege_password", IDS_share_samba_password_limit);
	       
	        $("#usermanege_password").val("");
	        $("#confirm_password").val("");
	        $("#usermanege_password").focus();
	        return false;
	    }
	}
    if(!edit_flag){
    $(g_usermanege_Data).each( function(i) {
        if(usermanege_name == g_usermanege_Data[i].accountname) {
            showErrorUnderTextbox('usermanege_name', IDS_system_samba_userName_same);
            validate = false;
        }

    });
  }
    return validate;
}

function showData() {
    $('.user_add_line').remove();
   
    $(g_usermanege_Data).each( function(i) {
        var accountName = XSSResolveCannotParseChar(g_usermanege_Data[i].accountname);
        if(g_usermanege_Data[i].shareallpath == SHAREALLPATH_TYPE) {            
            var sharePath = XSSResolveCannotParseChar(g_usermanege_Data[i].sharepath);
            addUsermanegement($('#service_list tr'),accountName,g_usermanege_Data[i].accesstype,sharePath);
        } else {
            var shareAllPath = XSSResolveCannotParseChar(g_usermanege_Data[i].shareallpath);
            addUsermanegement($('#service_list tr'),accountName,g_usermanege_Data[i].accesstype,shareAllPath);
        }
    });

}
function checkaddData() {
    var usermanege_name = $.trim($('#usermanege_name').val());
    var usermanege_rigth = $('#usermanege_rigth option:selected').val();
    var usermanege_path = $('#usermanege_path option:selected').val();
    var usermanege_password = $('#usermanege_password').val();
    var confirm_password = $('#confirm_password').val();
    var userpath_selected = $('#file_path_samba').children().text();
    if(!checkName_pwd(usermanege_name,usermanege_password,confirm_password)) {
        return false;
    }
    if(usermanege_path == SHAREALLPATH_TYPE) {
        addUsermanegement($('#service_list tr'),usermanege_name,usermanege_rigth,userpath_selected);
    } else {
         if(usermanege_path.length>USERSHAREPATH_MAXLENGTH){
            usermanege_path = usermanege_path.substring(0,USERSHAREPATH_MAXLENGTH-1);
         }
        addUsermanegement($('#service_list tr'),usermanege_name,usermanege_rigth,usermanege_path);
    }

    hideAddItemControl();
    if(g_indexnew == 1 && !edit_flag){
        addArry(addIndex,usermanege_name,usermanege_password,userpath_selected,usermanege_rigth,usermanege_path);
    }else{
        addArry(usermanege_name,usermanege_password,userpath_selected,usermanege_rigth,usermanege_path);
    }
    edit_flag = false;
    showpassword = 0;
    button_enable('apply_button', '1');
    $('#userEdit').hide();
    return true;

}

function usermanege_validateuserName() {
    clearAllErrorLabel();
    var num = arguments[0];
    var name = arguments[1];
    var ret = true;
    $(g_usermanege_Data).each( function(i) {
        if(num != i &&  g_usermanege_Data[i].accountname == name) {
            showErrorUnderTextbox('usermanege_name', IDS_system_samba_userName_same);
            ret =  false;
        }

    });
    return ret;
}
function postData(){
    showWaitingDialog(common_waiting, updating_label_updating);
    var i = 0;
    var j = 0;
    var k = 0;
    var usermanege_Data_Array = g_usermanege_Data;
    if(g_usermanege_Data.length > 0){
        for(i = 0;i < g_usermanege_Data.length;i++){
            if(g_edit_number.length > 0){
                for(j = 0;j<g_edit_number.length;j++){
                    if(i == g_edit_number[j]){
                        if(g_usermanege_Data[i].shareallpath == SHAREALLPATH_TYPE){
                            usermanege_Data_Array[i].sharepath = g_usermanege_Data[i].sharepath;
                        }else{
                            usermanege_Data_Array[i].shareallpath = g_usermanege_Data[i].shareallpath;    
                        }    
                    }    
                }    
            }else{
                if(g_add_number.length > 0){
                    for(k = 0;k<g_add_number.length;k++){
                        if(i == g_add_number[k]){
                            if(g_usermanege_Data[i].shareallpath == SHAREALLPATH_TYPE){
                                usermanege_Data_Array[i].sharepath =  g_usermanege_Data[i].sharepath;
                            }else{
                                usermanege_Data_Array[i].shareallpath = g_usermanege_Data[i].shareallpath;    
                            }    
                        }    
                    }    
                }else{
                    if(g_usermanege_Data[i].shareallpath == SHAREALLPATH_TYPE){
                        usermanege_Data_Array[i].sharepath =  g_usermanege_Data[i].sharepath;
                    }else{
                        usermanege_Data_Array[i].shareallpath = g_usermanege_Data[i].shareallpath;    
                    }
                }    
            }              
        }
        for(i = 0;i < usermanege_Data_Array.length;i++){
            if(usermanege_Data_Array[i].shareallpath == SHAREALLPATH_TYPE){
                usermanege_Data_Array[i].sharepath = XSSResolveCannotParseChar(usermanege_Data_Array[i].sharepath);
            }else{
                usermanege_Data_Array[i].shareallpath = XSSResolveCannotParseChar(usermanege_Data_Array[i].shareallpath);    
            }
              
        }    
    }
    
    var submitObject = {
        accounts:{
            account:usermanege_Data_Array
        }
    };
    $.each(g_usermanege_Data, function(i) {
    	if(typeof(g_back_data[i]) != "undefined" && (typeof(g_back_data[i].accountpwd) !=  "undefined")){
    	    if (g_usermanege_Data[i].accountpwd == COMMON_PASSWORD_VALUE) {
	            delete submitObject.accounts.account[i].accountpwd;
	        }	
    	}
	});   
    var submitData = object2xml('request', submitObject);
    saveAjaxData('api/sdcard/share-account', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            closeWaitingDialog();
            showInfoDialog(common_success);
            button_enable('apply_button', '0');
            usermanege_initpage();
            } else {
				closeWaitingDialog();
				showInfoDialog(common_failed);
                usermanege_initpage();
            }
        },{
        	enc:true
        });


}

function samba_checkusername(str){
  var bRet = true;
  
  var  reg = new RegExp("^[\-a-zA-Z%\(\)#!\{\}][\-a-zA-Z0-9%\(\)#!_\{\}]{0,63}$");
   if(!(reg.test(str))){
   bRet =  false;
   
   }
   var sambausername = str.toLowerCase();
   if(sambausername == "root" || sambausername == "support" ||
    sambausername == "admin" || sambausername == "nobody" || sambausername == "anonymous"){
    bRet = false;
   
   }
 return bRet;
}
function samba_checkpwd(str){
    var bRet = true;
    var reg = new RegExp("^[a-zA-Z0-9_]{8,63}$");
    if(!(reg.test(str))){
         bRet =  false;
    }

    return bRet;
}



$(document).ready( function() {
	clickPasswordEvent('usermanege_password',0);
    openPortToCss('service_list');
    var currentAllVal = null;
	if(typeof(g_moduleswitch.encrypt_enabled) != 'undefined'){
	    g_indexnew = g_moduleswitch.encrypt_enabled;
	}
    usermanege_initpage();
    var editStatus = null;
    setDisplayContent(web_sharing);
    if($('.user_add_line').size()>= MAXLINENEMBER) {
        button_enable('add_item', '0');

    } else {
        button_enable('add_item', '1');
    }
    button_enable('apply_button', '0');
    $('#add_item').click( function() {
	    if(g_indexnew == 1){
	    	if(g_usermanege_Data.length == 0){
	    		addIndex = 0;
	    	}else{
	    		addIndex = parseInt(g_usermanege_Data[g_usermanege_Data.length - 1].index,10) + 1;
	    	}
	    }
        
        if (isButtonEnable('add_item')) {
            $('#userEdit').show();
            clearAllErrorLabel();
            $('#usermanege_name').val('');
            $('#usermanege_password').val('');
            $('#confirm_password').val('');
            showAddItemControl();
            $('#usermanege_name').focus();
            button_enable('apply_button', '0');
            if($('#usermanege_path').val() == SHAREALLPATH_TYPE) {
                $('#userpath_select').show();
                $('#userpath_note').show();
                $('#allpath_note').hide();
            } else {
                $('#userpath_select').hide();
                $('#userpath_note').hide();
                $('#allpath_note').show();
            }
        }
    });
    $('.button_edit_list').live('click', function() {
    	mousedownIndexList = [];
        clearAllErrorLabel();
        if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1) {
            $('#userEdit').show();
            editIndex = $('.button_edit_list').index(this);
            $(this).parent().html('<a id="edit_item_ok" class="clr_blue" href="javascript:void(0);">' + common_ok +
            '</a><a id="edit_item_cancel" class="clr_blue" href="javascript:void(0);">' + common_cancel + '</a>');
            $('#usermanege_name').val(g_usermanege_Data[editIndex].accountname);
            $('#usermanege_password').val(g_usermanege_Data[editIndex].accountpwd);
            $('#confirm_password').val(g_usermanege_Data[editIndex].accountpwd);
            $('#usermanege_rigth').val(g_usermanege_Data[editIndex].accesstype);
            $('#usermanege_path').val(g_usermanege_Data[editIndex].shareallpath);
            $('#file_path_samba').children().html(g_usermanege_Data[editIndex].sharepath);
            if($('#usermanege_path').val() == SHAREALLPATH_TYPE) {
                $('#userpath_select').show();
                $('#userpath_note').show();
                $('#allpath_note').hide();
            } else {
                $('#userpath_select').hide();
                $('#userpath_note').hide();
                $('#allpath_note').show();
            }
            hideAddItemControl();
            edit_flag = true;
            $('#usermanege_password,#confirm_password').live('mousedown focusin click',function(){
            	if(showpassword == 0){
            		$('#usermanege_password').val('');
            		$('#confirm_password').val('');
            		showpassword = 1;
            	}
            });
            $('#edit_item_cancel').live('click', function() {
                $('.user_add_line').eq(editIndex).html(currentAllVal);
                $('#userEdit').hide();
		showpassword = 0;
                if(editIndex == -1) {
                    return;
                }
                if(g_usermanege_Data[editIndex].shareallpath == '0') {
                    addUsermanegement($('#service_list tr'),g_usermanege_Data[editIndex].accountname,g_usermanege_Data[editIndex].accesstype,
                    g_usermanege_Data[editIndex].sharepath);
                } else {
                    addUsermanegement($('#service_list tr'),g_usermanege_Data[editIndex].accountname,g_usermanege_Data[editIndex].accesstype,
                    g_usermanege_Data[editIndex].shareallpath);
                }

            });
            button_enable('apply_button', '0');
            button_enable('add_item', '0');
        }

    });
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        $('#userEdit').hide();
        if((1 == add_flag) || (1 == ok_flag)) {
            button_enable('apply_button', '1');
        }

        return false;
    });
    $('#edit_item_ok').live('click', function() {
        if(usermanege_validateuserName(editIndex,$.trim($('#usermanege_name').val())) && checkaddData() ) {

            $(this).parent().html('<span class=\"button_edit_list clr_blue\">' + common_edit +
            '</span><span class=\"button_urlfilter_delete_list clr_blue\">' + common_delete + '</span>');

            // currentAllVal = $('.user_add_line').eq(editIndex).html();
            button_enable('apply_button', '1');
           if($('.user_add_line').size()>= MAXLINENEMBER) {
               button_enable('add_item', '0');

          } else {
              button_enable('add_item', '1');
          }
            ok_flag = 1;
            edit_flag = false;
            editIndex = -1;
        }
        
    });
    $('#add_item_ok').live('click', function() {
        editIndex = -1;
        edit_flag = false;
        checkaddData();
        add_flag = 1;

    });
    $('#usermanege_path').change( function() {
        $('#file_path_samba').children().html('/');
        if($('#usermanege_path').val() == SHAREALLPATH_TYPE) {
            $('#userpath_select').show();
            $('#userpath_note').show();
            $('#allpath_note').hide();
        } else {
            $('#userpath_select').hide();
            $('#userpath_note').hide();
            $('#allpath_note').show();
        }
    });
    $('#custom_path').click( function() {

        call_dialog(sd_hint_select_a_folder, chooseContent, common_ok, 'path_dialog_ok', common_cancel, 'path_dialog_cancel');
        displayCustomerTree('file_tree_div', '/');
        button_enable('path_dialog_ok', '0');
        button_enable('web_share_apply', '1');
    });
    $('#path_dialog_ok').live('click', function() {
        if (!isButtonEnable('path_dialog_ok')) {
            return;
        }
        var folder_path = $('a.focusfolder').closest('span').attr('id');
        if (typeof(folder_path) != 'undefined') {
            folder_path = folder_path.substring(folder_path.indexOf('_') + 1);
            folder_path = folder_path.replace(/\*/g, '/');
            folder_path = '/' + folder_path;
            $('.dialog, .info_dialog').fadeOut( function() {
                if ($('.info_dialog').size() == 0) {
                    $('#div_wrapper').hide();
                }
            });
            $('#file_path_samba').html('<pre>' + XSSResolveCannotParseChar(folder_path) + '</pre>');
            $('#wait_table').remove();
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
        } else {
            $('.dialog, .info_dialog').fadeOut( function() {
                if ($('.info_dialog').size() == 0) {
                    $('#div_wrapper').hide();
                }
            });
        }
    });
    //Close folder tree popup
    $('#path_dialog_cancel').live('click', function() {
        $('.dialog, .info_dialog').fadeOut( function() {
            if ($('.info_dialog').size() == 0) {
                $('#div_wrapper').hide();
            }
        });
    });
    $('a.folder_name').live('mouseover', function() {
        $(this).addClass('folder_hover');
    });
    $('a.folder_name').live('mouseout', function() {
        $(this).removeClass('folder_hover');
    });
    //Mouse click folder tree
    $('a.folder_name').live('click', function() {
        if ($(this).hasClass('focusfolder') == false) {
            $('a.focusfolder').removeClass('focusfolder');
            $(this).addClass('focusfolder');
        }
    });
    $('.sub_folder_li').live('click', function() {
        button_enable('path_dialog_ok', '1');
    });
    //Folder tree list click
    $('div.hitarea').live('click', function() {
        //var list_id_filter = "";
        var list_id = $(this).closest('li').attr('id');
        //var list_id_arr = list_id.split("");

        var list_path = $(this).next().attr('id');
        list_path = list_path.substring(list_path.indexOf('_') + 1);
        list_path = list_path.replace(/\&/g, '&amp;');
        //list_id = list_id_filter;

        if ($('#' + list_id).hasClass('expandable') && !$('#' + list_id).hasClass('loaded_sublist')) {
            displayCustomerTree(list_id, list_path);
            createSubFolderTree(list_id);
            if ($('#' + list_id).children('div').hasClass('noSubFolder')) {
                $('#' + list_id).children('span.folder_path_line').css({
                    'background': 'none'
                });
            } else {
                $('#' + list_id).children('span.folder_path_line').css({
                    'background': 'url(../res/treeview-default-line.gif) 0 0 repeat-y'
                });
            }
        } else if ($('#' + list_id).hasClass('expandable') && $('#' + list_id).hasClass('loaded_sublist')) {
            showSubFolderTree(list_id);
            $('#' + list_id).children('span.folder_path_line').css({
                'background': 'url(../res/treeview-default-line.gif) 0 0 repeat-y'
            });
        } else {
            hideSubFolderTree(list_id);
            $('#' + list_id).children('span.folder_path_line').css({
                'background': 'none'
            });
        }
    });
    $(".button_urlfilter_delete_list").live("click", function() {
        if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1) {
            var deleteIndex = $(".button_urlfilter_delete_list").index(this);
            call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
            $("#pop_OK").click( function() {
                deleteFilter(deleteIndex, $(".user_add_line"));
                g_usermanege_Data.splice(deleteIndex,1);
                clearDialog_table();
                button_enable("apply_button", "1");
                button_enable("add_item", "1");
            });
        }
    });
        $('#apply_button').click( function() {
        if (isButtonEnable('apply_button')) {
            showConfirmDialog(firewall_hint_submit_list_item, postData);
            edit_flag = false;
            editIndex = -1;
        }
        ok_flag = 0;
        add_flag = 0;
    });
    
    
    
});