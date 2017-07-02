#!/system/bin/busybox sh

echo "Content-type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

if busybox [ -n "$QUERY_STRING" ]; then
	echo -n '{"config":{"imei_generator":"'
	echo -n "$(/app/webroot/imei_generator -m $QUERY_STRING 2> /dev/null)"
	echo -n '"}}'
else
	echo -n '{"config":{"imei_generator":"'
	echo -n "$(/app/webroot/imei_generator 2> /dev/null)"
	echo -n '"}}'
fi
