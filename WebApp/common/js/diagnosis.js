// JavaScript Document
/****************************************************wlanadvanced (start)************************************/
// SubmitForm

var g_ping_info = {} ;
var g_traceroute_info = {};
var MAX_PACKET_SIZE = 9000;
var MAX_TIMEOUT = 10;
var MIN_TIMEOUT = 1;
var MIN_HOPS = 1;
var MAX_HOPS = 100;
var TRACEROUT_SEARCHING = 2;
var MIN_TIMEOUT_TRACE = 2;
var MAX_TIMEOUT_TRACE = 10;
var g_isPingSelected = true;
var g_isPingResult = false;
var g_isTracerouteResult = false;
var g_diagnosis_result_pass = 1;
var g_diagnosis_result_fail = 0;
var TIMEOUT = 3000;

function show_ping_detail() {
	$("#id_ping").show();
	$("#id_traceroute").hide();

	if(!g_isPingResult) {
		$("#id_diagnosis_result").hide();
	} else {
		$("#id_diagnosis_result").show();
		if(g_ping_info.result == g_diagnosis_result_pass) {
			$('#id_pass_or_fail').text(common_success);
		} else {
			$('#id_pass_or_fail').text(common_failed);
		}
		$('#id_result_Detail').html(XSSResolveCannotParseChar(g_ping_info.resultdetail));
	}
}

function show_traceroute_detail() {
	$("#id_ping").hide();
	$("#id_traceroute").show();
	$("#trace_maxhops").val(30);
	$("#trace_timeout").val(4);
	if(!g_isTracerouteResult) {
		$("#id_diagnosis_result").hide();
	} else {
		$("#id_diagnosis_result").show();
		if(g_traceroute_info.result == g_diagnosis_result_pass) {
			$('#id_pass_or_fail').text(common_success);
		} else {
			$('#id_pass_or_fail').text(common_failed);
		}
		$('#id_result_Detail').html(XSSResolveCannotParseChar(g_traceroute_info.resultdetail));
	}
}

function diagnosis_initPage() {
	
	$("#select_diagnosis_mode").val('ping');
	show_ping_detail();	
	$("#ping_target_ip").val('');
	$("#ping_packetsize").val(32);
	$("#ping_timeout").val(4);
}

function check_ping() {

	clearAllErrorLabel();
	var target = $.trim($('#ping_target_ip').val());
	if( '' == target) {
		showErrorUnderTr("ping_target_ip_tr",IDS_diagnosis_target_empty);
		return false;
	}

	var ret1 = /^[\.-]/;
	if (ret1.test(target)) {
		showErrorUnderTr("ping_target_ip_tr", IDS_diagnosis_target_invalid1);
		return false;
	}
	var ret2 = /^[A-Za-z0-9\.-]*$/;
	if (!ret2.test(target)) {
		showErrorUnderTr("ping_target_ip_tr", IDS_diagnosis_target_invalid);
		return false;
	}

	var packetsize = $.trim($('#ping_packetsize').val());
	if( '' == packetsize) {
		showErrorUnderTr("ping_packetsize_tr",IDS_diagnosis_packetsize_empty);
		return false;
	}
	if (!IsDigital(packetsize)) {
		showErrorUnderTr("ping_packetsize_tr", IDS_diagnosis_packetsize_invalid);
		return false;
	}
	try {
		packetsize = parseInt(packetsize, 10);
		if (packetsize <= 0 || packetsize > MAX_PACKET_SIZE) {
			showErrorUnderTr("ping_packetsize_tr", IDS_diagnosis_packetsize_invalid);
			return false;
		}
	} catch (exception) {
		showErrorUnderTr("ping_packetsize_tr", IDS_diagnosis_packetsize_invalid);
		return false;
	}
	var timeout = $.trim($('#ping_timeout').val());
	if( '' == timeout) {
		showErrorUnderTr("ping_timeout_tr",IDS_diagnosis_timeout_empty);
		return false;
	}
	if (!IsDigital(timeout)) {
		showErrorUnderTr("ping_timeout_tr", IDS_diagnosis_ping_timeout_invalid);
		return false;
	}
	try {
		timeout = parseInt(timeout, 10);
		if (timeout < MIN_TIMEOUT || timeout > MAX_TIMEOUT) {
			showErrorUnderTr("ping_timeout_tr", IDS_diagnosis_ping_timeout_invalid);
			return false;
		}
	} catch (e) {
		showErrorUnderTr("ping_timeout_tr", IDS_diagnosis_ping_timeout_invalid);
		return false;
	}

	return true;

}

function check_traceroute() {

	clearAllErrorLabel();
	var target = $.trim($('#traceroute_target_ip').val());
	if( '' == target) {
		showErrorUnderTr("traceroute_target_ip_tr",IDS_diagnosis_target_empty);
		return false;
	}

	var ret1 = /^[\.-]/;
	if (ret1.test(target)) {
		showErrorUnderTr("traceroute_target_ip_tr", IDS_diagnosis_target_invalid1);
		return false;
	}
	
	var ret2 = /^[A-Za-z0-9\.-]*$/;
	if (!ret2.test(target)) {
		showErrorUnderTr("traceroute_target_ip_tr", IDS_diagnosis_target_invalid);
		return false;
	}

	var maxhops = $.trim($('#trace_maxhops').val());
	if( '' == maxhops) {
		showErrorUnderTr("trace_maxhops_tr",IDS_diagnosis_maxhops_empty);
		return false;
	}
	if (!IsDigital(maxhops)) {
		showErrorUnderTr("trace_maxhops_tr", IDS_diagnosis_maxhops_invalid);
		return false;
	}
	try {
		maxhops = parseInt(maxhops, 10);
		if (maxhops < MIN_HOPS || maxhops > MAX_HOPS) {
			showErrorUnderTr("trace_maxhops_tr", IDS_diagnosis_maxhops_invalid);
			return false;
		}
	} catch (exception) {
		showErrorUnderTr("trace_maxhops_tr", IDS_diagnosis_maxhops_invalid);
		return false;
	}
	var timeout = $.trim($('#trace_timeout').val());
	if( '' == timeout) {
		showErrorUnderTr("trace_timeout_tr",IDS_diagnosis_timeout_empty);
		return false;
	}
	if (!IsDigital(timeout)) {
		showErrorUnderTr("trace_timeout_tr", IDS_diagnosis_traceroute_timeout_invalid);
		return false;
	}
	try {
		timeout = parseInt(timeout, 10);
		if (timeout < MIN_TIMEOUT_TRACE || timeout > MAX_TIMEOUT_TRACE) {
			showErrorUnderTr("trace_timeout_tr", IDS_diagnosis_traceroute_timeout_invalid);
			return false;
		}
	} catch (e) {
		showErrorUnderTr("trace_timeout_tr", IDS_diagnosis_traceroute_timeout_invalid);
		return false;
	}

	return true;
}

function ping_apply() {

	if(false == check_ping()) {
		return false;
	}
	var target = $.trim($('#ping_target_ip').val());
	var pcksz = $.trim($('#ping_packetsize').val());
	var timeout = $.trim($('#ping_timeout').val());
	var fragmt = $('#ping_fragment').get(0).checked ? 1 : 0;

	var request = {
		target : target,
		packetsize: pcksz,
		timeout: timeout,
		fragment:fragmt
	};

	var PingXml = object2xml('request', request);
	button_enable('apply', '0');
	showWaitingDialog(common_waiting, IDS_diagnosis_pinging_info);
	saveAjaxData('api/diagnosis/ping', PingXml, function($xml) {
		var ret = xml2object($xml);

		if(ret.type == 'response') {
			g_ping_info = ret.response;
			g_ping_info.result = ret.response.result;
			g_ping_info.resultdetail = ret.response.resultdetail;
			closeWaitingDialog();
			button_enable('apply', '1');
			$("#id_diagnosis_result").show();
			if(g_ping_info.result == g_diagnosis_result_pass)
			{
				$('#id_pass_or_fail').text(common_success);
			}
			else
			{
				$('#id_pass_or_fail').text(common_failed);
			}
			if ($.browser.msie){
				g_ping_info.resultdetail = g_ping_info.resultdetail.replace(/\n/g, '<br/>');
			} else {
				g_ping_info.resultdetail = g_ping_info.resultdetail.replace(/\n/g, "\r\n");
			}
			$('#id_result_Detail').html(XSSResolveCannotParseChar(g_ping_info.resultdetail));
			g_isPingResult = true;

		} else {
			button_enable('apply', '1');
			closeWaitingDialog();
			showInfoDialog(common_fail);
			log.error('Error, no data');
		}
	}, {
		sync: false
	}, {
		errorCB: function() {
			button_enable('apply', '1');
			closeWaitingDialog();
			log.error(':api/diagnosis/ping failed');
		}
	}
	);

	return true;
}

function traceroute_apply() {

	if(false == check_traceroute()) {
		return false;
	}
	var target = $.trim($('#traceroute_target_ip').val());
	var maxhops = $.trim($('#trace_maxhops').val());
	var timeout = $.trim($('#trace_timeout').val());
	var request = {
		target : target,
		maxhops: maxhops,
		timeout: timeout
	};

	var TracerouteXml = object2xml('request', request);
	button_enable('apply', '0');
	cancelLogoutTimer();
	showWaitingDialog(common_waiting, IDS_diagnosis_tracerouting_info);
	saveAjaxData('api/diagnosis/traceroute', TracerouteXml, function($xml) {
		var ret = xml2object($xml);
		if(ret.type == 'response') {
			setTimeout( function() {
				getTracerouteStatues();
					}, TIMEOUT);
		} else {
			button_enable('apply', '1');
			closeWaitingDialog();
			showInfoDialog(common_fail);
			startLogoutTimer();
			log.error('Error, no data');
		}
	}, {
		sync: false
	});

	return true;
}

function getTracerouteStatues () {
	
	 getAjaxData('api/diagnosis/tracerouteresult', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
               if(TRACEROUT_SEARCHING == ret.response.result) {
					 setTimeout( function() {
						getTracerouteStatues();
					}, TIMEOUT);
			   }
			   else {
					g_traceroute_info = ret.response;
					g_traceroute_info.result = ret.response.result;
					g_traceroute_info.resultdetail = ret.response.resultdetail;
					closeWaitingDialog();
					button_enable('apply', '1');
					startLogoutTimer();
					$("#id_diagnosis_result").show();
			       if(g_traceroute_info.result == g_diagnosis_result_pass)
			       {
				       $('#id_pass_or_fail').text(common_success);
			       }
			       else
			       {
				       $('#id_pass_or_fail').text(common_failed);
			       }
			       if ($.browser.msie){
			           g_traceroute_info.resultdetail = g_traceroute_info.resultdetail.replace(/\n/g, "<br/>");
				   } else {
				       g_traceroute_info.resultdetail = g_traceroute_info.resultdetail.replace(/\n/g, "\r\n");
			       }
			       $('#id_result_Detail').html(XSSResolveCannotParseChar(g_traceroute_info.resultdetail));
					g_isTracerouteResult = true;
			   }
            }
        });

}

/**********************************After loaded (common)************/
$(document).ready( function() {

	diagnosis_initPage();

	$('#select_diagnosis_mode').change( function() {
		if($(this).val() == 'ping') {
			g_isPingSelected = true;
			show_ping_detail();
		} 
		if($(this).val() == 'traceroute'){
			g_isPingSelected = false;
			show_traceroute_detail();
		}
	});
	$('#apply').click( function() {
		if(g_isPingSelected) {
			ping_apply();
		} else {
			traceroute_apply();
		}
	});
});
