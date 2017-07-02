#!/system/bin/busybox sh

echo "Content-type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

if busybox [ -e /dev/appvcom1 ]; then
  PORT=/dev/appvcom1
elif busybox [ -e /dev/appvcom ]; then
  PORT=/dev/appvcom
fi

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

set_mod() {
  if busybox [ ! -f "$1" ]; then
    echo '{"error":{"code":"4","message":""}}'
    exit
  fi

  busybox mount -o remount,rw /system /system 2> /dev/null
  /system/bin/dd of="$1" 2> /dev/null
  busybox mount -o remount,ro /system /system 2> /dev/null
}

if busybox [ $QUERY_STRING = "cmd=get" ]; then

  if busybox [ $REQUEST_METHOD != "GET" ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

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

elif echo $QUERY_STRING | busybox grep -q '^cmd=set&'; then

  if busybox [ $REQUEST_METHOD != "POST" ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  if busybox [ 0$CONTENT_LENGTH -eq 0 ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  if busybox [ ! -n "$PORT" -o ! -e "$PORT" ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  case $QUERY_STRING in
    "cmd=set&mod=fix_ttl") set_mod /system/etc/fix_ttl;;
    "cmd=set&mod=autoswitch") set_mod /system/etc/autoswitch;;
    "cmd=set&mod=autoswitch_dly") set_mod /system/etc/autoswitch_dly;;
    "cmd=set&mod=datalock") echo -e "AT^DATALOCK=\"$(/system/bin/dd 2> /dev/null)\"\r" > $PORT 2> /dev/null;;
    "cmd=set&mod=serial_number") echo -e "AT^SN=$(/system/bin/dd 2> /dev/null)\r" > $PORT 2> /dev/null;;
    "cmd=set&mod=imei") echo -e "AT^CIMEI=\"$(/system/bin/dd 2> /dev/null)\"\r" > $PORT 2> /dev/null;;
    "cmd=set&mod=backup_imei")
        case $(/system/bin/dd 2> /dev/null) in
            nvbackup) echo -e "AT^NVBACKUP\r" > $PORT 2> /dev/null;;
            inforbu) echo -e "AT^INFORBU\r" > $PORT 2> /dev/null;;
            backup_imei) /app/webroot/backup_imei &> /dev/null;;
        esac
        ;;
    *)
      echo '{"error":{"code":"1","message":""}}'
      exit
      ;;
  esac

  echo '{"response":"OK"}'

elif busybox [ $QUERY_STRING = "cmd=apply" ]; then

  if busybox [ ! -n "$PORT" -o ! -e "$PORT" ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  echo '{"response":"OK"}'

  echo -e 'AT^RESET\r' > $PORT 2> /dev/null

else

  echo '{"error":{"code":"1","message":""}}'

fi
