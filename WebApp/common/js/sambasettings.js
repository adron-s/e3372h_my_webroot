var g_sambaData = '';
var g_printerenable = false;
var g_printerName = '';
var g_sdsharemode = -1;
var MAX_PRINTLIST_NUMBER = 8;
function initPage() {
	 getAjaxData('api/sdcard/sdcard', function($xml) {
        var ret = xml2object($xml);
        g_sdsharemode = ret.response.sdcard.SDShareMode;

     },{sync : true});

	
    getAjaxData('api/sdcard/sdcardsamba', function($xml) {
        var ret = xml2object($xml);
        g_sambaData = ret.response;
        $('#enable_sharing_samba').get(0).checked = (g_sambaData.enabled == 1) ? true : false;
        g_printerenable = (g_sambaData.printerenable == 1) ? true : false;
    },{sync : true});

}

function apply() {
        g_sambaData.enabled = $('#enable_sharing_samba').get(0).checked ? 1 : 0;
        var xmlstr_samba = object2xml('request', g_sambaData);
        saveAjaxData('api/sdcard/sdcardsamba', xmlstr_samba, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                button_enable('apply_button', '0');
                showInfoDialog(common_success);
            }
            else
            {
                showInfoDialog(common_failed);
               
            }
        });
}

$(document).ready(function() {
    initPage();
    if(g_sdsharemode == 1){
    showInfoDialog(IDS_share_samba_server_ennabled);
    $('#enable_sharing_samba').attr('disabled','disabled');
    
    }
    $('#enable_sharing_samba').click(function() {

        apply();
    });
     if(g_printerenable){
    
        $("#printerenable").text(IDS_system_samba_description_printer);
    
        $("#smaba_printer_server").show();
        
        getAjaxData('api/sdcard/printerlist', function($xml) {
            var ret = xml2object($xml);
            g_printerName = ret.response.printerlist;
            var tab_printer = '';
            var i = 1;
            for(i; i <= MAX_PRINTLIST_NUMBER; i++) {
                var printername = eval('g_printerName.printername' + i);
                if('undefined' != typeof(printername) && '' != printername && null != printername) {
                    tab_printer += "<tr><td height='32'  align='left' width='300px'>"+XSSResolveCannotParseChar(printername)+"</td></tr>";
                }
            }

            $("#printer_name").append(tab_printer)
        });
    }else{
        $("#printerenable").text(IDS_system_samba_description);
        $("#smaba_printer_server").hide();
    }
    
});