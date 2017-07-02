#!/system/bin/busybox sh

if [ -f /data/userdata/ussd/ussd_cmd_list.json ]; then
  /system/bin/dd if=/data/userdata/ussd/ussd_cmd_list.json of=/var/ussd_cmd_list.json 2> /dev/null
else
  echo -n '{"config":{"add_cmd_list":[],"rem_def_cmd_list":[]}}' > /var/ussd_cmd_list.json
fi
