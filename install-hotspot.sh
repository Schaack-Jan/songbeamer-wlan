#!/bin/bash
curDir=$(pwd)

mkdir tmp
# shellcheck disable=SC2164
cd tmp

sudo apt-get update
sudo apt-get full-upgrade
sudo apt-get install libmicrohttpd-dev -y

curl -sL https://install.raspap.com | bash
sudo systemctl enable dnsmasq hostapd
sudo systemctl restart dnsmasq hostapd

git clone https://github.com/nodogsplash/nodogsplash.git
# shellcheck disable=SC2164
cd nodogsplash
make
sudo make install
# shellcheck disable=SC2164
cd "$curDir"/tmp

sudo mv /etc/nodogsplash/nodogsplash.conf /etc/nodogsplash/nodogsplash.conf.original
sudo cp "$curDir"/src/confs/nodogsplash.conf /etc/nodogsplash/nodogsplash.conf

sudo "$curDir"/nodogsplash/debian/nodogsplash.service /lib/systemd/system/
sudo systemctl enable nodogsplash
sudo systemctl restart nodogsplash

sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.original
sudo cp "$curDir"/src/confs/dnsmasq.conf /etc/dnsmasq.conf
sudo cp "$curDir"/src/confs/090_raspap.conf /etc/dnsmasq.d/090_raspap.conf
sudo cp "$curDir"/src/confs/090_wlan0.conf /etc/dnsmasq.d/090_wlan0.conf
sudo systemctl restart dnsmasq

sudo mv /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.original
sudo cp "$curDir"/src/confs/hostapd.conf /etc/hostapd/hostapd.conf
sudo systemctl restart hostapd

# shellcheck disable=SC2129
echo "10.3.141.1  clients3.google.com" >> /etc/hosts
echo "10.3.141.1  apple.com" >> /etc/hosts
echo "10.3.141.1  www.apple.com" >> /etc/hosts

sudo cp /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.original
sudo sed -i -e 's/server.port                 = 80/server.port                 = 8080/g' /etc/lighttpd/lighttpd.conf
sudo systemctl restart lighttpd

curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh

sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
sudo npm install -g pm2

sudo su - www-data -s /bin/bash -c "$PATH/npm install"
sudo su - www-data -s /bin/bash -c "$PATH/pm2 start server.js --name='Songbeamer'"
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u www-data --hp /var/www
sudo systemctl enable pm2-www-data

sudo chown -R www-data:www-data /var/www/songbeamer-wlan
sudo chown -R www-data:www-data /var/www/raspap

sudo cp "$curDir"/src/confs/hotspot-startup-script.sh /usr/local/bin/hotspot-startup-script.sh
sudo chown root:root /usr/local/bin/hotspot-startup-script.sh
sudo chmod 744 /usr/local/bin/hotspot-startup-script.sh

sudo cp "$curDir"/src/confs/hotspot-startup-script.service /etc/systemd/system/hotspot-startup-script.service
sudo chmod 664 /etc/systemd/system/hotspot-startup-script.service

sudo systemctl daemon-reload
sudo systemctl enable hotspot-startup-script.service

# shellcheck disable=SC2164
cd "$curDir"
rm -r tmp