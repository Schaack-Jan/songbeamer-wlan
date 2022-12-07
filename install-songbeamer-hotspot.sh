#!/bin/bash
curl -sL https://install.raspap.com | sudo bash -s -- -y

sudo mv /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.raspap-orig
sudo sed 's/=[[:blank:]]80/= 8080/' /etc/lighttpd/lighttpd.conf.raspap-orig > /etc/lighttpd/lighttpd.conf
sudo service lighttpd restart

sudo apt-get install -y libmicrohttpd-dev

git clone https://github.com/nodogsplash/nodogsplash.git  -o /tmp/nodogsplash

# shellcheck disable=SC2164
cd /tmp/nodogsplash
make
sudo make install

sudo mv /etc/nodogsplash/nodogsplash.conf /etc/nodogsplash/nodogsplash.conf.orig
sudo cp /var/www/songbeamer-wlan/assets/nodogsplash.conf /etc/nodogsplash/nodogsplash.conf
sudo cp /var/www/songbeamer-wlan/assets/redirect-songbeamer.html  /etc/nodogsplash/htdocs/redirect-songbeamer.html

sudo cp /tmp/nodogsplash/debian/nodogsplash.service /lib/systemd/system/
sudo systemctl enable nodogsplash.service
sudo systemctl start nodogsplash.service

sudo cp /var/www/songbeamer-wlan/assets/080_captive_redirects.conf /etc/dnsmas.d/
sudo cp /var/www/songbeamer-wlan/assets/090_wlan0.conf /etc/dnsmasq.d/
sudo systemctl restart dnsmasq

sudo mv /etc/hostapd/hostapd.conf.orig
sudo cp /var/www/songbeamer-wlan/assets/hostapd.conf /etc/hostapd/hostapd.conf
sudo systemctl restart hostapd