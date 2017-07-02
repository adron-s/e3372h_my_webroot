var g_appmanagement = null;
var g_language = null;
var domestic = null;
var foreign = null;
var windowsOS = null;
var macOS = null;
var linuxOS =null;
var numDoctor = 0;

function initAppPage() {
    getAjaxData('api/language/current-language', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_language = ret.response.CurrentLanguage;
        }
    }, {
        sync: true
    });
    getConfigData('config/global/config.xml', function($xml) {
        var g_feature = _xml2feature($xml);
        g_appmanagement = g_feature.appmanagements;
        domestic = $.trim(g_appmanagement.hilink.domestic);
        foreign = $.trim(g_appmanagement.hilink.foreign);
        windowsOS = $.trim(g_appmanagement.mobileDoctor.windowsOS);
        macOS = $.trim(g_appmanagement.mobileDoctor.macOS);
        linuxOS = $.trim(g_appmanagement.mobileDoctor.linuxOS);
    }, {
        sync: true
    });
    if(g_language == "zh-cn") {
        $("#domestic_address").show();
    } else {
        $("#foreign_address").show();
    }
    if(g_language == "zh-cn") {
        document.getElementById("app_href_address").href = domestic;
        $("#app_span").text(domestic);
    } else {
        document.getElementById("app_href_address").href = foreign;
        $("#app_span").text(foreign);
    }
    if(g_language == "zh-cn") {
        linuxOS = linuxOS.replace('/en/','/cn/');
        macOS =  macOS.replace('/en/','/cn/');
        windowsOS = windowsOS.replace('/en/','/cn/');
    }
    document.getElementById("Linux_href_address").href = linuxOS;
    $("#Linux_span").text(linuxOS);
    document.getElementById("MAC_href_address").href = macOS;
    $("#MAC_span").text(macOS);
    document.getElementById("Windows_href_address").href = windowsOS;
    $("#Windows_span").text(windowsOS);
}

function judgeDoctorStatus() {
    if(windowsOS.length > 0) {
        $("#app_doctor_windows").show();
        numDoctor += 1;
    }
    if(macOS.length > 0) {
        $("#app_doctor_mac").show();
        numDoctor += 1;
    }
    if(linuxOS.length > 0) {
        $("#app_doctor_linux").show();
        numDoctor += 1;
    }
    if(numDoctor == 0) {
        $("#app_doctor_all").hide();
    }
}

$(document).ready( function() {
    initAppPage();
    judgeDoctorStatus();
});