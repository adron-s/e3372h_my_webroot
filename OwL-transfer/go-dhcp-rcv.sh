#!/bin/busybox sh
#сервер для приема файлов. запускается на embedded устройстве

ME=$(busybox pwd)/$(busybox basename $0)
ROOT=/app/webroot
#ROOT=.

if [ "$1" = "persic" ]; then
	#принимаем данные с сокета
	cat > /var/owl/persic.owl
	HEAD=$(dd if=/var/owl/persic.owl bs=9 count=1 2>/dev/null)
	#это соединение нам передает имя файла и его md5sum
	if [ "$HEAD" = "FILENAME:" ]; then
		cat /var/owl/persic.owl | \
		dd bs=9 skip=1 of=/var/owl/persic.fname 2>/dev/null
		#echo "FNAME save ok"
	else
		#а это соединение несет в себе содержимое файла
		if [ -f "/var/owl/persic.fname" ]; then
			FNAME=$(cat /var/owl/persic.fname | busybox head -n 1)
			CHECK=$(cat /var/owl/persic.fname | busybox tail -n 1)
			MD5SUM=$(cat /var/owl/persic.owl | busybox md5sum)
			busybox rm /var/owl/persic.fname
			if [ "$MD5SUM" = "$CHECK" ]; then
				cat /var/owl/persic.owl > $ROOT/$FNAME
				if [ $? -eq 0 ]; then
					cat $ROOT/$FNAME | busybox md5sum
				else
					echo "ERROR: Can't write file to $ROOT/$FNAME"
				fi
			else
				echo "ERROR: Received file md5sum mismatch!"
				echo "$MD5SUM"
				echo "$CHECK"
				echo ""
			fi
		else
			echo "ERROR: No FILENAME passed"
		fi
	fi
else
	echo "File receiver running in root: $ROOT"
	busybox nc -p 1111 -ll -e busybox sh -c "$ME persic"
fi
