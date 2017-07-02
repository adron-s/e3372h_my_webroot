#!/system/bin/busybox sh

if busybox [ -e /dev/appvcom1 ]; then
	PORT=/dev/appvcom1
elif busybox [ -e /dev/appvcom ]; then
	PORT=/dev/appvcom
fi
if busybox [ -f /data/userdata/global/user_config.xml ]; then
	user_config="$(cat /data/userdata/global/user_config.xml)"
elif busybox [ -f /app/webroot/WebApp/config/global/user_config.xml ]; then
	user_config="$(cat /app/webroot/WebApp/config/global/user_config.xml)"
fi
datalock="$(echo $user_config | busybox sed -r 's/.*<datalock>(.*)<\/datalock>.*/\1/g')"
imei_generator_model="$(echo $user_config | busybox sed -r 's/.*<imei_generator_model>(.*)<\/imei_generator_model>.*/\1/g')"
backup_imei="$(echo $user_config | busybox sed -r 's/.*<backup_imei>(.*)<\/backup_imei>.*/\1/g')"
autorun_imei_generator="$(echo $user_config | busybox sed -r 's/.*<autorun_imei_generator>(.*)<\/autorun_imei_generator>.*/\1/g')"
hspa_locker="$(echo $user_config | busybox sed -r 's/.*<hspa_locker>(.*)<\/hspa_locker>.*/\1/g')"

get_mod() {
  if busybox [ -e "$2" ]; then
    if busybox [ $mods_num -gt 0 ]; then
      echo -n ','
    fi
    echo -n "\"$1\":\""
    echo -n "$(/system/bin/dd if="$2" 2> /dev/null)"
    echo -n '"'
    mods_num=$((mods_num+1))
  fi
}

config() {
  echo -n '{"config":{'

  mods_num=0

  get_mod fix_ttl /system/etc/fix_ttl

  get_mod autoswitch /system/etc/autoswitch

  get_mod autoswitch_dly /system/etc/autoswitch_dly

  get_mod datalock /dev/null

  get_mod serial_number /dev/null

  get_mod imei /dev/null

  get_mod imei_generator /dev/null

  get_mod imei_generator_model /dev/null

  get_mod backup_imei /dev/null

  get_mod autorun_imei_generator /dev/null

  get_mod hspa_locker /dev/null

  echo -n '}}'
}

config > /var/modsettings.json

if busybox [ $autorun_imei_generator = true ]; then
	busybox [ -n "$datalock" ] && echo -e "AT^DATALOCK=\"$datalock\"\r" > $PORT
	if busybox [ -n "$imei_generator_model" ]; then
		echo -e "AT^CIMEI=\"$(/app/webroot/imei_generator -m $imei_generator_model)\"\r" > $PORT
	else
		echo -e "AT^CIMEI=\"$(/app/webroot/imei_generator)\"\r" > $PORT
	fi
	case $backup_imei in
		nvbackup) echo -e "AT^NVBACKUP\r" > $PORT;;
		inforbu) echo -e "AT^INFORBU\r" > $PORT;;
		backup_imei) /app/webroot/backup_imei;;
        esac
fi

if busybox [ $hspa_locker = true ]; then
	/app/webroot/hspa_locker start
fi
