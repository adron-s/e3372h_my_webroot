#!/bin/bash
#клиент для передачи файлов

#корень! для абфускации полного пути файла чтобы остались только суб директории относительно корня.
ROOT="/home/prog/android/huawey/work/dumps/e3372h-fs/app/webroot"
HOST="10.255.183.252"
#HOST="127.0.0.1"

BD_FNAME=$(pwd | sed -e "s;$ROOT/;;")/$1
FN_TAIL=".gz"

echo "$BD_FNAME" | grep ".cgi" && {
	echo "Gzipping disabled!"
	#не нужно паковать *.cgi фкрипты!
	FN_TAIL=""
}

CAT="cat"
[ "$FN_TAIL" = ".gz" ] && {
	CAT="gzip -c"
}

PWD=$(pwd | sed -e "s;$ROOT;;")
FILE="$ROOT/$BD_FNAME"
[ -f "$FILE" ] || {
	echo "File !$FILE! does not exists!"
	exit 100
}
check=$($CAT $FILE | md5sum)
#передаем имя файла
echo -e "FILENAME:$BD_FNAME$FN_TAIL\n$check" | nc $HOST 1111 -q 1
#передаем его загзипованное содержимое
ret=$($CAT $FILE | nc $HOST 1111 -q 1)

[ "$ret" = "$check" ] && {
	echo "Transfer file '$BD_FNAME' OK"
	exit 0
}

echo "Transfer file '$FILE' FAILED !!!"
echo "$ret"
echo "$check"
