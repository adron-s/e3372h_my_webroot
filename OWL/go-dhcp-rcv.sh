#!/bin/sh

basename=$(busybox basename $1)
while [ 1 ]; do
  echo "Ready for receive file $1"
  nc -l -p 1111 > /var/owl/$basename.gz
  echo "writing $basename.gz to ./$1.gz"
  cat /var/owl/$basename.gz > ./$1.gz
done
