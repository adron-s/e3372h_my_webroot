#!/system/bin/busybox sh

echo "Content-type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

if busybox [ $QUERY_STRING = "cmd=get_list" ]; then

  if busybox [ $REQUEST_METHOD != "GET" ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  if busybox [ ! -f /data/userdata/ussd/ussd_cmd_list.json ]; then
    echo '{"error":{"code":"4","message":""}}'
    exit
  fi

  /system/bin/dd if=/data/userdata/ussd/ussd_cmd_list.json 2> /dev/null

elif busybox [ $QUERY_STRING = "cmd=save_list" ]; then

  if busybox [ $REQUEST_METHOD != "POST" ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  if busybox [ 0$CONTENT_LENGTH -eq 0 ]; then
    echo '{"error":{"code":"1","message":""}}'
    exit
  fi

  if busybox [ ! -d /data/userdata/ussd ]; then
    mkdir /data/userdata/ussd
  fi

  /system/bin/dd of=/data/userdata/ussd/ussd_cmd_list.json 2> /dev/null

  /app/webroot/ussd_cmd_list.sh

  echo '{"response":"OK"}'

else

  echo '{"error":{"code":"1","message":""}}'

fi
