#!/bin/bash
curl -sL https://install.raspap.com | sudo bash -s -- -y

sudo mv /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.raspap-orig
sudo sed 's/=[[:blank:]]80/= 8181/' /etc/lighttpd/lighttpd.conf.raspap-orig > /etc/lighttpd/lighttpd.conf
sudo service lighttpd restart

sudo apt-get install -y libmicrohttpd-dev

git clone https://github.com/nodogsplash/nodogsplash.git /tmp/nodogsplash

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

sudo cp /var/www/songbeamer-wlan/assets/080_captive_redirects.conf /etc/dnsmasq.d/
sudo cp /var/www/songbeamer-wlan/assets/090_wlan0.conf /etc/dnsmasq.d/
sudo systemctl restart dnsmasq

sudo cp /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.orig
sudo sed -i 's/wpa_key_mgmt=WPA-PSK/wpa_key_mgmt=NONE/g' /etc/hostapd/hostap.conf
sudo sed -i 's/ssid=raspi-webgui/ssid=Songbeamer/g' /etc/hostapd/hostap.conf
sudo sed -i 's/country_code=GB/country_code=DE/g' /etc/hostapd/hostap.conf
sudo systemctl restart hostapd

sudo rm -R /tmp/nodogsplash