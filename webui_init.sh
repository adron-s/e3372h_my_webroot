#!/system/bin/busybox sh

ln -s /app/webroot/imei_generator /sbin

ln -s /app/webroot/backup_imei /sbin

ln -s /app/webroot/oping /sbin

ln -s /app/webroot/hspa_locker /sbin

busybox httpd -p 5080 -h /app/webroot/httpd_root

/app/webroot/add_param.sh

/app/webroot/modsettings.sh

/app/webroot/ussd_cmd_list.sh
