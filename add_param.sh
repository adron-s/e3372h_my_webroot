#!/bin/sh

if busybox [ ! -f /app/webroot/add_param ]; then
  exit
fi

/app/webroot/add_param &

if busybox [ ! -f /system/xbin/atc ]; then
  if busybox [ ! -f /app/bin/atc ]; then
    if busybox [ ! -f /app/webroot/atc ]; then
      exit
    fi
  fi
fi

busybox ln -s /app/webroot/atc.sh /sbin/atc
