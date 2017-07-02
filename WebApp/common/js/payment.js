/*
function payment_initVar() {
        var mynumber = common_unknown;
        getAjaxData('api/device/information', function($xml) {
            var ret = xml2object($xml);
            if (('response' == ret.type) && (ret.response.Msisdn != '')) {
                mynumber = ret.response.Msisdn;
            }
        }, {
            sync: true
        });
        $('#input_payment_number').attr("value",mynumber);
}
*/

$(function() {
        var valueContent = '';
        if (LANGUAGE_DATA.current_language == 'ru_ru') {
            valueContent = 'Оплатить';
        } else {
            valueContent = 'Pay';
        }
        $('#button_pay').attr('value',valueContent);
    //payment_initVar();
	    $('#button_pay').click( function() {
        
     // var dialogHtml = '';
	 //dialogHtml += "<iframe src='https://pay.mts.ru/webportal/payments/3565' height='100%' width='100%' style='border-style: none;border:0px;' ></iframe>"; 
	 //$('#app_payment_format1').hide();  
	 //$('.payment_button').before(dialogHtml);   

            //动态添加action  URL
             var actionUrl = "https://pay.mts.ru/webportal/payments/3565/Moskva";

             /*var str = $('#input_payment_number').val();
             if(str.length>=10){
                var payment_number = str.substring(str.length - 10);
             }*/

             var payment_number = $('#input_payment_number').val();

             var payment_amount = $('#input_payment_amount').val();

             actionUrl += '?phone='+ payment_number +'&amount=' + payment_amount +'&channel=6';

             $('#myForm').attr('action',actionUrl);
	 
             $('#myForm').submit();

		});			
    });
