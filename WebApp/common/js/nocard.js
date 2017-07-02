// JavaScript Document
function main_beforeready() {
    if (g_setup_wizard_page == '1' && g_Driver_classify != 'hilink' && g_auto_update_enable == '1') {
        HOME_PAGE_URL = 'quicksetup.html';
    }
}
function initPage() {

    getAjaxData('api/pin/status', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type)
        {
            if (MACRO_NO_SIM_CARD != ret.response.SimState)
            {
                if (MACRO_PUK_REQUIRED == ret.response.SimState)
                {
                    gotoPageWithoutHistory('pukrequired.html');
                }
                else if (MACRO_PIN_REQUIRED == ret.response.SimState)
                {
                    gotoPageWithoutHistory('pincoderequired.html');
                }
                else
                {
                    gotoPageWithoutHistory(HOME_PAGE_URL);
                }
            }
        }
    });
}

main_beforeready();
$(document).ready(function() {
    if (1 == g_feature.continue_button) {
        $('#link_login_nocard').show();
    }
    else
    {
        $('#link_login_nocard').hide();
    }

    initPage();
    $('#link_login_nocard').click(function() {
        window.location = HOME_PAGE_URL;
    });
});
