#!/system/bin/busybox sh

echo "Content-type: text/xml"
echo "Access-Control-Allow-Origin: *"
echo ""

if busybox [ $QUERY_STRING = "cmd=get_config" ]; then

  if busybox [ $REQUEST_METHOD != "GET" ]; then
    echo "<error><code>1</code><message></message></error>"
    exit
  fi

  if busybox [ ! -f /data/userdata/global/user_config.xml ]; then
    echo "<error><code>4</code><message></message></error>"
    exit
  fi

  /system/bin/dd if=/data/userdata/global/user_config.xml 2> /dev/null

elif busybox [ $QUERY_STRING = "cmd=save_config" ]; then

  if busybox [ $REQUEST_METHOD != "POST" ]; then
    echo "<error><code>1</code><message></message></error>"
    exit
  fi

  if busybox [ 0$CONTENT_LENGTH -eq 0 ]; then
    echo "<error><code>1</code><message></message></error>"
    exit
  fi

  if busybox [ ! -d /data/userdata/global ]; then
    mkdir /data/userdata/global
  fi

  /system/bin/dd of=/data/userdata/global/user_config.xml 2> /dev/null

  echo "<response>OK</response>"

else

  echo "<error><code>1</code><message></message></error>"

fi
