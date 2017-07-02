var CHARCODE_A = 65;
var CHARCODE_F = 70;
var CHARCODE_Z = 90;
var CHARCODE_a = 97;
var CHARCODE_f = 102;
var CHARCODE_z = 122;
var CHARCODE_0 = 48;
var CHARCODE_9 = 57;
var CHARCODE_DOT = 46;
var CHARCODE_UNDERLINE = 95;
var CHARCODE_SPACE = 32;
var CHARCODE_DASH = 45;
//Port value range
var MIN_PORT_RANGE = 1;
var MAX_PORT_RANGE = 65535;
//Filter status
var FILTER_DISABLED = 0;
var FILTER_ENABLED = 1;
//Protocol status
var PROTOCOL_BOTH = 0;
var PROTOCOL_IMCP = 1;
var PROTOCOL_TCP = 6;
var PROTOCOL_UDP = 17;

// verify IP Address
function isValidIpAddress(address) {
	var addrParts = address.split('.');
	if (addrParts.length != 4) {
		return false;
	}

	for (i = 0; i < 4; i++) {
		if (isNaN(addrParts[i]) == true)//isNaN  if not a number return true,else return false
		{
			return false;
		}

		if (addrParts[i] == '') {
			return false;
		}

		if (addrParts[i].indexOf(' ') != -1)//
		{
			return false;
		}

		if ((addrParts[i].indexOf('0') == 0) && (addrParts[i].length != 1)) {
			return false;
		}
	}

	if ((addrParts[0] <= 0 || addrParts[0] == 127 || addrParts[0] > 223) ||
	(addrParts[1] < 0 || addrParts[1] > 255) ||
	(addrParts[2] < 0 || addrParts[2] > 255) ||
	(addrParts[3] <= 0 || addrParts[3] >= 255)) {
		return false;
	}

	return true;
}

function validStaticIp(address) {
	var addrParts = address.split('.');
	if (addrParts.length != 4) {
		return false;
	}
	for (i = 0; i < 4; i++) {
		if (isNaN(addrParts[i]) == true) {
			return false;
		}
		if (addrParts[i] == '') {
			return false;
		}
		if (addrParts[i].indexOf(' ') != -1) {
			return false;
		}
		if ((addrParts[i].indexOf('0') == 0) && (addrParts[i].length != 1)) {
			return false;
		}
	}
	if ((addrParts[0] <= 0 || addrParts[0] == 127 || addrParts[0] > 223) ||
	(addrParts[1] < 0 || addrParts[1] > 255) ||
	(addrParts[2] < 0 || addrParts[2] > 255) ||
	(addrParts[3] < 0 || addrParts[3] > 255)) {
		return false;
	}
	return true;
}

function obverseMask(ip,mask) {
	var obverseMaskAndIp = '';
	var obvMask = '';
	var ipAddr = ip.split('.');
	var subMask = mask.split('.');
	for (i = 0; i < 4; i++) {
		obverseMaskAndIp += (255 - Number(subMask[i])) & Number(ipAddr[i]);
		obverseMaskAndIp = obverseMaskAndIp + ".";
		obvMask += 255 - (Number(subMask[i]));
		obvMask = obvMask + ".";
	}
	obverseMaskAndIp = obverseMaskAndIp.substring(0,obverseMaskAndIp.length-1);
	obvMask = obvMask.substring(0,obvMask.length-1);
	if (obverseMaskAndIp == '0.0.0.0' || obverseMaskAndIp == obvMask ) {
		return false;
	}
	return true;
}

// validate Mac Address
function isValidMacAddress(macAddress) {
	var c = '';
	var i = 0, j = 0;
	var OddVals = new Array("1", "3", "5", "7", "9", "b", "d", "f");

	if ('ff:ff:ff:ff:ff:ff' == macAddress) {
		return false;
	}

	var addrParts = macAddress.split(':');
	if (addrParts.length != 6) {
		return false;
	}
	for (i = 0; i < 6; i++) {
		if (addrParts[i].length != 2) {
			return false;
		}

		for (j = 0; j < addrParts[i].length; j++) {
			c = addrParts[i].toLowerCase().charAt(j);
			if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
				continue;
			} else {
				return false;
			}
		}
	}

	c = addrParts[0].toLowerCase().charAt(1);

	for (i = 0; i < OddVals.length; i++) {
		if (c == OddVals[i]) {
			return false;
		}
	}

	return true;
}

function isValidSubnetMask(mask) {
	var i = 0;
	var num = 0;
	var zeroBitPos = 0, oneBitPos = 0;
	var zeroBitExisted = false;

	if ('0.0.0.0' == mask) {
		return false;
	}

	if ('255.255.255.255' == mask) {
		return false;
	}

	var maskParts = mask.split('.');
	if (maskParts.length != 4) {
		return false;
	}

	for (i = 0; i < 4; i++) {
		if (true == isNaN(maskParts[i])) {
			return false;
		}
		if ('' == maskParts[i]) {
			return false;
		}
		if (maskParts[i].indexOf(' ') != -1) {
			return false;
		}

		if ((0 == maskParts[i].indexOf('0')) && (maskParts[i].length != 1)) {
			return false;
		}

		num = parseInt(maskParts[i],10);
		if (num < 0 || num > 255) {
			return false;
		}
		if (true == zeroBitExisted && 0 != num) {
			return false;
		}
		zeroBitPos = getLeftMostZeroBitPos(num);
		oneBitPos = getRightMostOneBitPos(num);
		if (zeroBitPos < oneBitPos) {
			return false;
		}
		if (zeroBitPos < 8) {
			zeroBitExisted = true;
		}
	}

	return true;
}

function isBroadcastOrMulticastIp(ipAddress) {
	var ip;
	ip = inetAton(ipAddress);
	ip = ip >>> 0;
	if((0xffffffff == ip) || (ip >= 0xe0000000 && ip <= 0xefffffff)) {
		return true;
	}
	return false;
}

function isPrivateIp(ipAddress) {
	var ip;
	ip = inetAton(ipAddress);
	ip = ip >>> 0;
	if((ip >= 0xa0000000 && ip <= 0xa0ffffff)
	|| (ip >= 0xac100000 && ip <= 0xac1fffff)
	|| (ip >= 0xc0a80000 && ip <= 0xc0a8ffff)) {
		return true;
	}
	return false;
}

// function for split port
function portPartsParse(_port) {
	var portArray = [];
	_port = $.trim(_port);
	if (_port.indexOf('-') == -1) {
		portArray = [_port, _port];
	} else {
		_port = _port.split('-');
		portArray = [$.trim(_port[0]), $.trim(_port[1])];
	}
	return portArray;
}

// function for join port
function portJoin(startPort, endPort) {
	var _port;
	var startPt = $.trim(startPort);
	var endPt = $.trim(endPort);

	if ( "" == startPt || "" == endPt || startPt == endPt ) {
		_port = startPort;
	} else {
		_port = startPort + "-" + endPort;
	}
	return _port;
}

function inetAton(a) {
	var n;

	n = a.split(/\./);
	if (n.length != 4) {
		return 0;
	}
	return ((n[0] << 24) | (n[1] << 16) | (n[2] << 8) | n[3]);
}

function getLeftMostZeroBitPos(num) {
	var i = 0;
	var numArr = [128, 64, 32, 16, 8, 4, 2, 1];

	for (i = 0; i < numArr.length; i++) {
		if ((num & numArr[i]) == 0) {
			return i;
		}
	}

	return numArr.length;
}

function getRightMostOneBitPos(num) {
	var i = 0;
	var numArr = [1, 2, 4, 8, 16, 32, 64, 128];

	for (i = 0; i < numArr.length; i++) {
		if (((num & numArr[i]) >> i) == 1) {
			return (numArr.length - i - 1);
		}
	}

	return -1;
}

function compareStartIpAndEndIp(startIp, endIp) {
	var ipStart = startIp.split(".");
	var ipEnd = endIp.split(".");

	for (i = 0; i < 4; i++) {
		if (parseInt(ipEnd[i],10) > parseInt(ipStart[i],10)) {
			break;
		} else if ((parseInt(ipEnd[i],10) == parseInt(ipStart[i],10)) && 3 != i) {
			continue;
		} else {
			return false;
		}
	}

	return true;
}

function isSameSubnetAddrs(ip1, ip2, mask) {
	var addrParts1 = ip1.split(".");
	var addrParts2 = ip2.split(".");
	var maskParts = mask.split(".");
	for (i = 0; i < 4; i++) {
		if (((Number(addrParts1[i])) & (Number(maskParts[i]))) != ((Number(addrParts2[i])) & (Number(maskParts[i])))) {
			return false;
		}
	}
	return true;
}

/*begin check the ip is in the ip range, w00166520*/
function IsIpInRange(ipAddress, startip, endip) {
	var ip;
	var MinIp;
	var MaxIp;
	ip = inetAton(ipAddress);
	ip = ip >>> 0;
	MinIp = inetAton(startip);
	MinIp = MinIp >>> 0;
	MaxIp = inetAton(endip);
	MaxIp = MaxIp >>> 0;
	if(ip >= MinIp && ip <= MaxIp) {
		return true;
	}
	return false;
}

/*end check the ip is in the ip range, w00166520*/

function isBroadcastOrNetworkAddress(ipAddress, netmask) {
	var ip;
	var mask;
	var netaddr;
	var broadaddr;

	ip = inetAton(ipAddress);
	mask = inetAton(netmask);
	netaddr = ip & mask;
	broadaddr = netaddr | ~ mask;

	if (netaddr == ip || ip == broadaddr) {
		return false;
	}
	return true;
}

function isVaildSpecialPort(port, showTarget) {
	var portParts = $.trim(port);
	var c = '';
	var i = 0;

	if ('' == portParts) {
		showQtip(showTarget, firewall_hint_port_empty);
		return false;
	}
	if ((portParts.indexOf('0') == 0) && (portParts.length != 1)) {
		showQtip(showTarget, firewall_hint_port_empty);
		return false;
	}

	for (i = 0; i < portParts.length; i++) {
		c = portParts.toLowerCase().charAt(i);
		if ((c >= '0') && (c <= '9')) {
			continue;
		} else {
			showQtip(showTarget, firewall_hint_port_empty);
			return false;
		}
	}

	if ((portParts < MIN_PORT_RANGE) || (portParts > MAX_PORT_RANGE)) {
		showQtip(showTarget, firewall_hint_port_number_valid_char);
		return false;
	}

	return true;
}

function isVaildPortForIPFilter(port, showTarget) {
	var portParts = $.trim(port);
	if ('' == portParts) {
		showQtip(showTarget, firewall_hint_port_empty);
		return false;
	}
	if (port < MIN_PORT_RANGE || port > MAX_PORT_RANGE) {
		showQtip(showTarget, firewall_hint_port_number_valid_char);
		return false;
	}
	var splitPort = portPartsParse(port);

	var i = 0;
	for (i = 0; i < splitPort.length; i++) {
		if (isNaN(splitPort[i])) {
			showQtip(showTarget, firewall_hint_port_empty);
			return false;
		}
	}
	portParts = $.trim(port);
	if (portParts.indexOf('-') == -1) {
		if (!isVaildSpecialPort(portParts, showTarget)) {
			return false;
		}
	} else {
		portParts = port.split('-');
		if (portParts.length == 2) {
			for (i = 0; i < 2; i++) {
				if (isNaN(portParts[i]) == true) {
					showQtip(showTarget, firewall_hint_port_empty);
					return false;
				}

				if (portParts[i] == '') {
					showQtip(showTarget, firewall_hint_port_empty);
					return false;
				}

				if (!isVaildSpecialPort(portParts[i], showTarget)) {
					return false;
				}
			}
			if (parseInt(portParts[0], 10) > parseInt(portParts[1], 10)) {
				showQtip(showTarget, firewall_hint_start_greater_end_port);
				return false;
			}
		} else {
			showQtip(showTarget, firewall_hint_port_empty);
			return false;
		}
	}
	return true;
}

function isHexString(str) {
	for (i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if ( !( (c >= CHARCODE_0 && c <= CHARCODE_9)
		||(c >= CHARCODE_A && c <= CHARCODE_F)
		||(c >= CHARCODE_a && c <= CHARCODE_f)
		)
		) {
			return false;
		}
	}
	return true;
}

function isAsciiString(str) {
	for (i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c <= 32 || c >= 127) {

			return false;
		}
	}
	return true;
}

function checkInputPPPoEChar(str) {
	var i;
	var char_i;
	var num_char_i;
	if (str == "") {
		return true;
	}
	for (i = 0; i < str.length; i++) {
		char_i = str.charAt(i);
		num_char_i = char_i.charCodeAt();
		if ((num_char_i > MACRO_SUPPORT_CHAR_MAX) || (num_char_i < MACRO_SUPPORT_CHAR_MIN)) {
			return false;
		} else {
			continue;
		}
	}
	return true;
}

function checkInputCharNew(unamepwd) {
	var reg = /^[a-zA-Z0-9_]+$/;
	var value = reg.test(unamepwd);
	return value;
}

function IsDigital(str) {
	return  !(null == str.match(/^[0-9]+$/));
}

function resolveXMLEntityReference(xmlStr) {
	return xmlStr.replace( /(\<|\>|\&|\'|\"|\/|\(|\))/g, function($0, $1) {
		return {
			"<" : "&lt;"
			,
			">" : "&gt;"
			,
			"&" : "&amp;"
			,
			"'" : "&#39;"
			,
			"\"": "&quot;"
			,
			'/' : '&#x2F;'
			,
            '(' : '&#40;'
            ,
            ')' : '&#41;'
		}[$1];
	}
	);
}

/******************************************************************
 *   Description:
 *           Trim whitespace characters like space, tab, etc. at head or tail of string
 *   Return:
 *           Trimed string.
 *   Remark:
 *           Calls trimWhitespace() as a member function of String.
 *
 *******************************************************************/
function XSS_UnescapesSpecialChar(xmlStr) {
    return xmlStr.replace(/(&lt;|&gt;|&amp;|&#39;|&quot;|&#x2F;|&#40;|&#41;)/g, function($0, $1) {
        return {
            "&lt;" : "<"
            ,
            "&gt;" : ">"
            ,
            "&amp;" : "&"
            ,
            "&#39;" : "'"
            ,
            "&quot;" : "\""
            ,
            '&#x2F;' : '/'
            ,
            '&#40;' : '('
            ,
            '&#41;' : ')'
        }[$1];
    }
    );
}
String.prototype.trimWhitespace = function() {
	return this.replace(/(^\s*)|(\s*$)/g,"");
} ;
function hasSpaceOrTabAtHead(str) {
	if(0 == str.indexOf(" ") || 0 == str.indexOf("\t")) {
		return true;
	} else {
		return false;
	}
}

function validateSsid(ssidName) {
	var errMsg = common_ok;
	if (0 == ssidName.length) {
		errMsg = wlan_hint_ssid_empty;
	} else if (hasSpaceOrTabAtHead(ssidName)) {
		errMsg = input_cannot_begin_with_space;
	} else if (32 < ssidName.length) {
		errMsg = wizard_help_name_ssid;
	} else {
		for (i = 0; i < ssidName.length; i++) {
			var c = ssidName.charAt(i);
			if (c >= 'a' && c <= 'z') {
				continue;
			} else if (c >= 'A' && c <= 'Z') {
				continue;
			} else if (c >= '0' && c <= '9') {
				continue;
			} else if (c == '-' || c == '_' || c == '.' || c == ' ') {
				continue;
			} else {
				errMsg = wlan_hint_ssid_valid_char;
			}
		}
	}
	return errMsg;
}

function wispr_validInput(validElement, userNameId,PassWordId) {
	var flag = true;
	var id = '';
	clearAllErrorLabel();
	//Valid Username
	if ('' == validElement.Username) {
		flag = false;
		id = userNameId;
		errMsg = settings_hint_user_name_empty;
		// showErrorUnderTextbox('wispr_username',settings_hint_user_name_empty);
	} else if ( false == checkInputChar(validElement.Username)) {
		flag = false;
		id = userNameId;
		errMsg = dialup_hilink_hint_username_invalidate;
		//     showErrorUnderTextbox('wispr_username',dialup_hilink_hint_username_invalidate);
	}
	//Vaild user password
	else if ('' == validElement.Password) {
		flag = false;
		id = PassWordId;
		errMsg = dialup_hint_password_empty;
		//  showErrorUnderTextbox('wispr_password',dialup_hint_password_empty);
	} else if (false == checkInputChar(validElement.Password)) {
		flag = false;
		id = PassWordId;
		errMsg = dialup_hilink_hint_password_invalidate;
		//  showErrorUnderTextbox('wispr_password',dialup_hilink_hint_password_invalidate);
	}
	if(!flag) {
		//showErrorUnderTextField(id,errMsg);
		showErrorUnderTextbox(id,errMsg);
	}
	$('#' + id).focus();
	$('#' + id).select();
	return flag;
}

function checkWifiSecurity(WifiAuthSecret, wifiAuthMode, id) {
	var strNetworkKey = WifiAuthSecret;
	var authMethod = wifiAuthMode;
	clearAllErrorLabel();
	if(SECURITY_MODE_WPA_PSK == authMethod || SECURITY_MODE_WPA2_PSK == authMethod || SECURITY_MODE_WPA_WPA2_PSK == authMethod) {
		return checkWpaPwd(WifiAuthSecret, id);
	} else if(SECURITY_MODE_WEP == authMethod) {
		return checkNWepKeyPwd(WifiAuthSecret, id);
	} else {
		return true;
	}
}

function checkNWepKeyPwd(password, id) {
	var pwdVal = password;
	var errMsg = null;
	var flag = false;
	if(0 == pwdVal.length) {
		errMsg = dialup_hint_password_empty;
	} else if(hasSpaceOrTabAtHead(pwdVal)) {
		errMsg = input_cannot_begin_with_space;
	} else if(10 == pwdVal.length || 26 == pwdVal.length) {
		if(!isHexString(pwdVal)) {
			errMsg = wifi_hint_64_or_128_bit_key;
		} else {
			flag = true;
		}
	} else if(5 == pwdVal.length || 13 == pwdVal.length) {
        if(g_wifiFeatureSwitch.chinesessid_enable == '1'){
            if(!checkInputSsidPasswordValid(pwdVal)) {
                errMsg = wlan_hint_ssid_valid_char_new;	
            } else {
                flag = true;
            }
        }else{
		if(!checkInputChar(pwdVal)) {
			errMsg = wlan_hint_wep_key_valid_type;
		} else {
			flag = true;
            }        
		}
	} else {
		errMsg = wifi_hint_64_or_128_bit_key;
	}
	if(!flag) {
		if(id == 'wifi_password') {
			showErrorUnderTextField(id,errMsg);
		} else {
			showErrorUnderTextbox(id,errMsg);
		}
		$('#' + id).focus();
		$('#' + id).select();
	}
	return flag;
}

function checkWpaPwd(password, id) {
	var pwdVal = password;
	var errMsg = null;
	var flag = false;
	if(0 == pwdVal.length) {
		errMsg = dialup_hint_password_empty;
	} else if(hasSpaceOrTabAtHead(pwdVal)) {
		errMsg = input_cannot_begin_with_space;
	} else if(64 == pwdVal.length) {
		if(!isHexString(pwdVal)) {
			errMsg = wifi_hint_wps_psk_valid_type;
		} else {
			flag = true;
		}
	} else if(pwdVal.length >= 8 && pwdVal.length <= 63) {
        if(g_wifiFeatureSwitch.chinesessid_enable == '1'){
            if(!checkInputSsidPasswordValid(pwdVal)) {
                errMsg = wlan_hint_ssid_valid_char_new;
            } else {
                flag = true;
            }
        }else{
		if(!checkInputChar(pwdVal)) {
			errMsg = wlan_hint_wps_psk_valid_char;
		} else {
			flag = true;
            }	
		}
	} else {
		errMsg = wifi_hint_wps_psk_valid_type;
	}
	if(!flag) {
		if(id == 'wifi_password') {
			showErrorUnderTextField(id,errMsg);
		} else {
			showErrorUnderTextbox(id,errMsg);
		}
		$('#' + id).focus();
		$('#' + id).select();
	}
	return flag;
}

function isWanAbcIpAddress(address) {
	if (isValidIpAddress(address) == false) {
		return false;
	}

	var addrParts = address.split('.');
	var num = 0;

	num = parseInt(addrParts[0], 10);
	if (num < 1 || num >= 224 || num == 127) {
		return false;
	}

	return true;
}
function checkInputSsidPasswordValid(str){
    var i;
	var char_i;
	var num_char_i;
	if (str == "") {
		return true;
	}
	for (i = 0; i < str.length; i++) {
		char_i = str.charAt(i);
		num_char_i = char_i.charCodeAt();
		if ((num_char_i > MACRO_SUPPORT_CHAR_MAX) || (num_char_i < MACRO_SUPPORT_CHAR_MIN)) {
			return false;
		}else {
			continue;
		}
	}
	return true;        
}

function checkInputSsidNameValid(id, ssidName){
    var errMsg = common_ok;
    var i ;
    var num_char_i;
    var reg =  /[\u4e00-\u9fa5]/;
    var number = 0;
    var ssidMaxlength = 32;
    var ssidLength = 0;
    if (0 == ssidName.length) {
        errMsg = wlan_hint_ssid_empty;
    }
    for(i = 0;i < ssidName.length ; i++){
        var c = ssidName.charAt(i);
        var value = reg.test(c);
        num_char_i = c.charCodeAt();        
        if ((num_char_i <= MACRO_SUPPORT_CHAR_MAX) && (num_char_i >= MACRO_SUPPORT_CHAR_MIN)) {
            number++;
            ssidLength++;     
        }else if(value){
            number += 3;
            if(number <= 32){
                ssidMaxlength -= 2;
            }
            ssidLength++;
        }else {
            errMsg = wlan_hint_ssid_valid_char_cn;
        }
        $('#'+ id).attr("maxlength",ssidMaxlength);
        if(number > 32){
            ssidLength--;    
            $('#'+ id).val(ssidName.substr(0,ssidLength));
            break;
        }
    }
    return errMsg;    
}
