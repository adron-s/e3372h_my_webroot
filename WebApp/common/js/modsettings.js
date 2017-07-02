var modsettings = {};

if(LANGUAGE_DATA.current_language == 'ru_ru') {
	var modsettings_label_modes_false = "Выкл";
	var modsettings_label_modes_true = "Вкл";
	var modsettings_label_modes_other = "другое (поддерживается не всеми прошивками)";
	var modsettings_label_ttl_fix = "Фиксация TTL";
	var modsettings_label_ttl_fix_modes_turn_off = "отключить фиксацию TTL";
	var modsettings_label_ttl_fix_modes_turn_on_64 = "включить фиксацию TTL 64";
	var modsettings_label_ttl_fix_modes_turn_on_128 = "включить фиксацию TTL 128 (поддерживается не всеми прошивками)";
	var modsettings_label_autoswitch = "Автопереключение";
	var modsettings_label_autoswitch_modes_none = "нет автопереключения";
	var modsettings_label_autoswitch_modes_work_rndis = "рабочий режим (RNDIS)";
	var modsettings_label_autoswitch_modes_work_cdc = "рабочий режим (CDC, не для Windows!)";
	var modsettings_label_autoswitch_modes_gateway = "gateway mode";
	var modsettings_label_autoswitch_modes_gateway_ncm = "gateway mode с сетевой картой";
	var modsettings_label_autoswitch_modes_debug = "debug mode";
	var modsettings_label_autoswitch_delay = "Отсрочка автопереключения (с)";
	var modsettings_label_datalock = "Код DATALOCK";
	var modsettings_label_imei_generator_model = "Модель случайного IMEI (первые 8 цифр IMEI модели)";
	var modsettings_label_imei_generator = "Случайный IMEI";
	var modsettings_label_backup_imei = "Закрепитель IMEI";
	var modsettings_label_backup_imei_modes_none = "Нет";
	var modsettings_label_autorun_imei_generator = "Автозапуск генератора IMEI";
	var modsettings_label_webui_mode = "Режим веб-интерфейса";
	var modsettings_label_webui_mode_new = "Новый";
	var modsettings_label_webui_mode_old = "Старый";
	var modsettings_label_search = "Поиск";
	var modsettings_label_search_yandex = "Яндекс";
	var modsettings_label_force_new = "Всегда новое";
	var modsettings_label_force_old = "Всегда старое";
	var modsettings_label_force_both = "Всегда оба";
} else {
	var modsettings_label_modes_false = "Off";
	var modsettings_label_modes_true = "On";
	var modsettings_label_modes_other = "Other (it's supported not by all firmwares)";
	var modsettings_label_ttl_fix = "TTL fix";
	var modsettings_label_ttl_fix_modes_turn_off = "Turn off TTL fix";
	var modsettings_label_ttl_fix_modes_turn_on_64 = "Turn on TTL fix 64";
	var modsettings_label_ttl_fix_modes_turn_on_128 = "Turn on TTL fix 128 (it's supported not by all firmwares)";
	var modsettings_label_autoswitch = "Autoswitch";
	var modsettings_label_autoswitch_modes_none = "No autoswitch";
	var modsettings_label_autoswitch_modes_work_rndis = "Work Mode (RNDIS)";
	var modsettings_label_autoswitch_modes_work_cdc = "Work Mode (CDC, not for Windows!)";
	var modsettings_label_autoswitch_modes_gateway = "Gateway Mode";
	var modsettings_label_autoswitch_modes_gateway_ncm = "Gateway Mode with network card";
	var modsettings_label_autoswitch_modes_debug = "Debug Mode";
	var modsettings_label_autoswitch_delay = "Autoswitch delay (seconds)";
	var modsettings_label_datalock = "DATALOCK code";
	var modsettings_label_imei_generator_model = "Generated IMEI model (first 8 digits of model's IMEI)";
	var modsettings_label_imei_generator = "Generated IMEI";
	var modsettings_label_backup_imei = "Backup IMEI";
	var modsettings_label_backup_imei_modes_none = "None";
	var modsettings_label_autorun_imei_generator ="Аutorun IMEI generator";
	var modsettings_label_webui_mode = "WebUI mode";
	var modsettings_label_webui_mode_new = "New";
	var modsettings_label_webui_mode_old = "Old";
	var modsettings_label_search = "Search";
	var modsettings_label_search_yandex = "Yandex";
	var modsettings_label_force_new = "Force new";
	var modsettings_label_force_old = "Force old";
	var modsettings_label_force_both = "Force both";
}
var modsettings_label_hspa_locker = "HSPA Locker";

function initPageData() {
	modsettings = getModSettings();
	getAjaxData('api/device/information', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			if(ret.response.DeviceName == 'E3372') {
				$('#autoswitch').find('option[value="5"]').hide();
				$('#backup_imei').find('option[value="nvbackup"]').hide();
			}
			else if(ret.response.DeviceName == 'E3272' || ret.response.DeviceName == 'E3276') {
				$('#autoswitch').find('option[value="3"], option[value="4"]').hide();
				$('#backup_imei').find('option[value="inforbu"], option[value="backup_imei"]').hide();
			}
			if(ret.response.HardwareVersion.search(/CL2E3372HM/) != -1)
				ret.response.DeviceName = 'E3372h';
			else if(ret.response.HardwareVersion.search(/CL1E3372SM/) != -1)
				ret.response.DeviceName = 'E3372s';
			if(user_config.device_name == '')
				user_config.device_name = ret.response.DeviceName;
			if(modsettings.serial_number == '')
				modsettings.serial_number = ret.response.SerialNumber;
			if(modsettings.imei == '')
				modsettings.imei = ret.response.Imei;
		}
	}, {
		sync: true
	});
	if(modsettings.imei_generator == '')
		modsettings.imei_generator = getIMEIGenerator();
	getData('modsettings', modsettings);
	getData('user_config', user_config);
}

function getData(dataName, data) {
	$.each(data, function(n, subValue) {
		if(typeof(subValue) != 'undefined') {
			$('#tr_' + n).show();
			if($('#' + n).is('span'))
				$('#' + n).text(subValue);
			else if($('#' + n).is('input[type="checkbox"]'))
				$('#' + n).attr('checked', subValue == 'true');
			else
				$('#' + n).val(subValue);
			$('#' + n).attr('data-' + dataName, true);
			if($('#' + n).is('select') && !document.querySelector('#' + n).querySelector('option[value="' + subValue + '"]') && subValue != '')
				$('#' + n).replaceWith('<input id="' + n + '" data-' + dataName + '="true" type="text" size="25" value="' + subValue + '"/>');
		}
	});

}

function postData() {
	button_enable('apply', '0');
	setModSettings(modsettings);
	applyModSettings(function(data, textStatus, jqXHR) {
		if (isAjaxReturnOK(data))
			showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {});
		else
			initPageData();
	});
}

function postUserConfig(successDialog, reload) {
	saveUserConfig(user_config, function(data, textStatus, jqXHR) {
		var ret = xml2object($(data));
		if(isAjaxReturnOK(ret)) {
			modsettings.imei_generator = getIMEIGenerator();
			$('#imei_generator').text(modsettings.imei_generator);
			if(successDialog !== false)
				showInfoDialog(common_success);
		} else {
			showInfoDialog(common_failed);
		}
		if(reload === true)
			setTimeout("location.reload(true)", 3000);
	});
}

function getModSettings() {
	var settings = [];
	$.ajax({
		type: "GET",
		url: "/modsettings.json",
		success: function(data, textStatus, jqXHR) {
			if (typeof(data.config) != 'undefined')
				settings = data.config;
		},
		dataType: "json",
		async: false
	});
	return settings;
}

function setModSettings(settings, callback) {
	$.each(settings, function(n, subValue) {
		$.ajax({
			type: "POST",
			url: "http://" + location.hostname + ":5080/cgi-bin/modsettings.cgi?cmd=set&mod=" + n,
			data: subValue,
			processData: false,
			success: function(data, textStatus, jqXHR) {
				if(typeof(callback) == 'function')
					callback(data, textStatus, jqXHR);
			},
			dataType: "json",
			async: false
		});
	});
}

function applyModSettings(callback) {
	$.ajax({
		type: "GET",
		url: "http://" + location.hostname + ":5080/cgi-bin/modsettings.cgi?cmd=apply",
		success: function(data, textStatus, jqXHR) {
			if(typeof(callback) == 'function')
				callback(data, textStatus, jqXHR);
		},
		dataType: "json",
		async: false
	});

}

function getIMEIGenerator() {
	var imei = undefined;
	$.ajax({
		type: "GET",
		url: "http://" + location.hostname + ":5080/cgi-bin/imei_generator.cgi?" + user_config.imei_generator_model,
		success: function(data, textStatus, jqXHR) {
			if (typeof(data.config) != 'undefined')
				if (typeof(data.config.imei_generator) != 'undefined')
					imei = data.config.imei_generator;
		},
		dataType: "json",
		async: false
	});
	return imei;
}

function saveUserConfig(config, callback) {
	$.ajax({
		type: "POST",
		url: "http://" + location.hostname + ":5080/cgi-bin/user_config.cgi?cmd=save_config",
		data: object2xml('config', config),
		processData: false,
		success: function(data, textStatus, jqXHR) {
			if(typeof(callback) == 'function')
				callback(data, textStatus, jqXHR);
		},
		dataType: "xml",
		async: false
	});
}


function apply() {
	if (!isButtonEnable('apply_button'))
	{
	    return;
	}
	showConfirmDialog(system_hint_operation_restart_device, postData, function() {});
}

$(document).ready(function() {
	initPageData();
	$('[data-modsettings="true"], [data-user_config="true"]').live('change input paste cut keydown blur', function(e) {
		if(MACRO_KEYCODE != e.keyCode){
			if($(this).is('select') && $(this).val() == 'other')
				$(this).replaceWith('<input id="' + $(this).attr('id') + '" ' + ($(this).is('[data-modsettings="true"]') ? 'data-modsettings="true"' : '') + ' ' + ($(this).is('[data-user_config="true"]') ? 'data-user_config="true"' : '') + ' type="text" size="25" value="' + modsettings[$(this).attr('id')] + '"/>');
			else {
				if($(this).is('[data-modsettings="true"]') && e.type != 'focusout') {
					modsettings[$(this).attr('id')] = String($(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val());
					button_enable('apply_button', '1');
				}
				if($(this).is('[data-user_config="true"]') && ($(this).is('input[type="text"]') && e.type == 'focusout' || (!$(this).is('input[type="text"]') && e.type != 'focusout'))) {
					user_config[$(this).attr('id')] = String($(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val());
					postUserConfig(!$(this).is('[data-modsettings="true"]'), $(this).is('[data-reload="true"]'));
				}
			}
		}
	});
	button_enable('apply_button', '0');

	$('#apply_button').click(function() {
		apply();
	});
});
