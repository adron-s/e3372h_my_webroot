var g_countryChannel = null;
var countryArray = null;
var g_modeArray = [];
var mode = [];
var modeLength = 100;
function getConfig() {
    getConfigData('config/wifi/countryChannel.xml', function($xml) {
        var i = 0;
        g_countryChannel = _xml2feature($xml);
        countryArray = [
        ['AL', g_countryChannel.al, wlan_country_al, g_countryChannel.al_mode],
        ['DZ', g_countryChannel.dz, wlan_country_dz,g_countryChannel.dz_mode],
        ['AR', g_countryChannel.ar, wlan_country_ar,g_countryChannel.ar_mode],
        ['AM', g_countryChannel.am, wlan_country_am, g_countryChannel.am_mode],
        ['AU', g_countryChannel.au, wlan_country_au, g_countryChannel.au_mode],
        ['AT', g_countryChannel.at, wlan_country_at, g_countryChannel.at_mode],
        ['AZ', g_countryChannel.az, wlan_country_az, g_countryChannel.az_mode],
        ['BH', g_countryChannel.bh, wlan_country_bh, g_countryChannel.bh_mode],
        ['BY', g_countryChannel.by, wlan_country_by, g_countryChannel.by_mode],
        ['BE', g_countryChannel.be, wlan_country_be, g_countryChannel.be_mode],
        ['BZ', g_countryChannel.bz, wlan_country_bz, g_countryChannel.bz_mode],
        ['BO', g_countryChannel.bo, wlan_country_bo, g_countryChannel.bo_mode],
        ['BR', g_countryChannel.br, wlan_country_br, g_countryChannel.br_mode],
        ['BN', g_countryChannel.bn, wlan_country_bn, g_countryChannel.bn_mode],
        ['BG', g_countryChannel.bg, wlan_country_bg, g_countryChannel.bg_mode],
        ['CA', g_countryChannel.ca, wlan_country_ca, g_countryChannel.ca_mode],
        ['CL', g_countryChannel.cl, wlan_country_cl, g_countryChannel.cl_mode],
        ['CN', g_countryChannel.cn, wlan_country_cn, g_countryChannel.cn_mode],
        ['CO', g_countryChannel.co, wlan_country_co, g_countryChannel.co_mode],
        ['CR', g_countryChannel.cr, wlan_country_cr, g_countryChannel.cr_mode],
        ['HR', g_countryChannel.hr, wlan_country_hr, g_countryChannel.hr_mode],
        ['CY', g_countryChannel.cy, wlan_country_cy, g_countryChannel.cy_mode],
        ['CZ', g_countryChannel.cz, wlan_country_cz, g_countryChannel.cz_mode],
        ['DK', g_countryChannel.dk, wlan_country_dk, g_countryChannel.dk_mode],
        ['DO', g_countryChannel.doy, wlan_country_do, g_countryChannel.doy_mode],
        ['EC', g_countryChannel.ec, wlan_country_ec, g_countryChannel.ec_mode],
        ['EG', g_countryChannel.eg, wlan_country_eg, g_countryChannel.eg_mode],
        ['SV', g_countryChannel.sv, wlan_country_sv, g_countryChannel.sv_mode],
        ['EE', g_countryChannel.ee, wlan_country_ee, g_countryChannel.ee_mode],
        ['FI', g_countryChannel.fi, wlan_country_fi, g_countryChannel.fi_mode],
        ['FR', g_countryChannel.fr, wlan_country_fr, g_countryChannel.fr_mode],
        ['DE', g_countryChannel.de, wlan_country_de, g_countryChannel.de_mode],
        ['GE', g_countryChannel.ge, wlan_country_ge, g_countryChannel.ge_mode],
        ['GR', g_countryChannel.gr, wlan_country_gr, g_countryChannel.gr_mode],
        ['GT', g_countryChannel.gt, wlan_country_gt, g_countryChannel.gt_mode],
        ['HN', g_countryChannel.hn, wlan_country_hn, g_countryChannel.hn_mode],
        ['HK', g_countryChannel.hk, wlan_country_hk, g_countryChannel.hk_mode],
        ['HU', g_countryChannel.hu, wlan_country_hu, g_countryChannel.hu_mode],
        ['IS', g_countryChannel.is, wlan_country_is, g_countryChannel.is_mode],
        ['IN', g_countryChannel.ind, wlan_country_in, g_countryChannel.ind_mode],
        ['ID', g_countryChannel.id, wlan_country_id, g_countryChannel.id_mode],
        ['IE', g_countryChannel.ie, wlan_country_ie, g_countryChannel.ie_mode],
        ['IL', g_countryChannel.il, wlan_country_il, g_countryChannel.il_mode],
        ['IT', g_countryChannel.it, wlan_country_it, g_countryChannel.it_mode],
        ['JP', g_countryChannel.jp, wlan_country_jp, g_countryChannel.jp_mode],
        ['JO', g_countryChannel.jo, wlan_country_jo, g_countryChannel.jo_mode],
        ['KZ', g_countryChannel.kz, wlan_country_kz, g_countryChannel.kz_mode],
        ['KR', g_countryChannel.kr, wlan_country_kr, g_countryChannel.kr_mode],
        ['KW', g_countryChannel.kw, wlan_country_kw, g_countryChannel.kw_mode],
        ['LB', g_countryChannel.lb, wlan_country_lb, g_countryChannel.lb_mode],
        ['LV', g_countryChannel.lv, wlan_country_lv, g_countryChannel.lv_mode],
        ['LI', g_countryChannel.li, wlan_country_li, g_countryChannel.li_mode],
        ['LT', g_countryChannel.lt, wlan_country_lt, g_countryChannel.lt_mode],
        ['LU', g_countryChannel.lu, wlan_country_lu, g_countryChannel.lu_mode],
        ['MA', g_countryChannel.ma, wlan_country_ma, g_countryChannel.ma_mode],
        ['MK', g_countryChannel.mk, wlan_country_mk, g_countryChannel.mk_mode],
        ['MY', g_countryChannel.my, wlan_country_my, g_countryChannel.my_mode],
        ['MO', g_countryChannel.mo, wlan_country_mo, g_countryChannel.mo_mode],
        ['MX', g_countryChannel.mx, wlan_country_mx, g_countryChannel.mx_mode],
        ['MC', g_countryChannel.mc, wlan_country_mc, g_countryChannel.mc_mode],
        ['NL', g_countryChannel.nl, wlan_country_nl, g_countryChannel.nl_mode],
        ['NZ', g_countryChannel.nz, wlan_country_nz, g_countryChannel.nz_mode],
        ['NO', g_countryChannel.no, wlan_country_no, g_countryChannel.no_mode],
        ['OM', g_countryChannel.om, wlan_country_om, g_countryChannel.om_mode],
        ['PK', g_countryChannel.pk, wlan_country_pk, g_countryChannel.pk_mode],
        ['PA', g_countryChannel.pa, wlan_country_pa, g_countryChannel.pa_mode],
        ['PE', g_countryChannel.pe, wlan_country_pe, g_countryChannel.pe_mode],
        ['PH', g_countryChannel.ph, wlan_country_ph, g_countryChannel.ph_mode],
        ['PL', g_countryChannel.pl, wlan_country_pl, g_countryChannel.pl_mode],
        ['PT', g_countryChannel.pt, wlan_country_pt, g_countryChannel.pt_mode],
        ['PR', g_countryChannel.pr, wlan_country_pr, g_countryChannel.pr_mode],
        ['QA', g_countryChannel.qa, wlan_country_qa, g_countryChannel.qa_mode],
        ['RO', g_countryChannel.ro, wlan_country_ro, g_countryChannel.ro_mode],
        ['RU', g_countryChannel.ru, wlan_country_ru, g_countryChannel.ru_mode],
        ['SA', g_countryChannel.sa, wlan_country_sa, g_countryChannel.sa_mode],
        ['SG', g_countryChannel.sg, wlan_country_sg, g_countryChannel.sg_mode],
        ['SK', g_countryChannel.sk, wlan_country_sk, g_countryChannel.sk_mode],
        ['SI', g_countryChannel.si, wlan_country_si, g_countryChannel.si_mode],
        ['ZA', g_countryChannel.za, wlan_country_za, g_countryChannel.za_mode],
        ['ES', g_countryChannel.es, wlan_country_es, g_countryChannel.es_mode],
        ['SE', g_countryChannel.se, wlan_country_se, g_countryChannel.se_mode],
        ['CH', g_countryChannel.ch, wlan_country_ch, g_countryChannel.ch_mode],
        ['TW', g_countryChannel.tw, wlan_country_tw, g_countryChannel.tw_mode],
        ['TH', g_countryChannel.th, wlan_country_th, g_countryChannel.th_mode],
        ['TT', g_countryChannel.tt, wlan_country_tt, g_countryChannel.tt_mode],
        ['TN', g_countryChannel.tn, wlan_country_tn, g_countryChannel.tn_mode],
        ['TR', g_countryChannel.tr, wlan_country_tr, g_countryChannel.tr_mode],
        ['UA', g_countryChannel.ua, wlan_country_ua, g_countryChannel.ua_mode],
        ['AE', g_countryChannel.ae, wlan_country_ae, g_countryChannel.ae_mode],
        ['GB', g_countryChannel.gb, wlan_country_gb, g_countryChannel.gb_mode],
        ['US', g_countryChannel.us, wlan_country_us, g_countryChannel.us_mode],
        ['UY', g_countryChannel.uy, wlan_country_uy, g_countryChannel.uy_mode],
        ['UZ', g_countryChannel.uz, wlan_country_uz, g_countryChannel.uz_mode],
        ['VE', g_countryChannel.ve, wlan_country_ve, g_countryChannel.ve_mode],
        ['VN', g_countryChannel.vn, wlan_country_vn, g_countryChannel.vn_mode],
        ['YE', g_countryChannel.ye, wlan_country_ye, g_countryChannel.ye_mode],
        ['ZW', g_countryChannel.zw, wlan_country_zw, g_countryChannel.zw_mode],
        ['EU', g_countryChannel.eu, wlan_country_eu, g_countryChannel.eu_mode],
        ['GH', g_countryChannel.gh, wlan_country_gh, g_countryChannel.gh_mode],
        ['LA', g_countryChannel.la, wlan_country_la, g_countryChannel.la_mode],
        ['ALL', g_countryChannel.all, IDS_wlan_country_all, g_countryChannel.all_mode]
        ];

        if('undefined' != typeof(g_countryChannel.mode)) {
            var j = 2;
            for(j; j < modeLength; j++) {
                mode[j] = eval('g_countryChannel.mode.mode_' + j);
                if('undefined' != typeof(mode[j])) {
                    if(String(mode[j]).indexOf(",") != -1) {
                        g_modeArray[j] = mode[j].split(',');
                    } else {
                        if('' == mode[j]) {
                            g_modeArray.push([]);
                        } else {
                            g_modeArray.push(CreateArray(mode[j]));
                        }
                    }
                }
            }
        }

        for(i;i < countryArray.length;i++) {
            if(typeof(countryArray[i][1]) == 'undefined' || countryArray[i][1] == '') {
                countryArray.splice(i,1);
                i--;
            }

        }
    }, {
        sync: true
    });
}

getConfig();