#!/system/bin/busybox sh

echo "Content-type: text/plain"
echo "Access-Control-Allow-Origin: *"
echo ""

if busybox [ $REQUEST_METHOD != "POST" ]; then
  echo "LOGIC BUG! GET method not supported! Use POST instead"
  exit
fi

do_file_op(){
	local op=${1}
	local	file_id=${2}
	local fname;
	case "$file_id" in
		"0000")
			fname="/system/mstp/conf/mstp0.conf" ;;
		"0001")
			fname="/system/etc/dhcps.owl.templ" ;;
		*)
			echo "ERROR: Unknown file_id !$file_id!"
			exit
	esac
	[ -f "$fname" ] || {
		echo "ERROR: File does not exist!"
		exit
	}
	[ "$op" = "save" ] && {
		busybox mount -o remount,rw /system
		cat > $fname || {
			echo "Write file '$fname' FAILED!"
			busybox mount -o remount,ro /system
			exit
		}
		busybox mount -o remount,ro /system
	}
	cat "$fname"
}

CMD=$(dd bs=4 count=1)
F_ID=$(dd bs=4 count=1)

if [ $CMD = "load" ]; then
	do_file_op "$CMD" "$F_ID"
elif [ $CMD = "save" ]; then
	do_file_op "$CMD" "$F_ID"
else
  echo "ERROR: unknown cmd!"
fi

exit
