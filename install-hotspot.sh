#!/bin/bash
$path=$(pwd)

mkdir tmp
cd tmp

sudo apt-get update
sudo apt-get full-upgrade
sudo reboot

curl -sL https://install.raspap.com | bash
sudo systemctl enable dnsmasq hostapd nodogsplash
sudo systemctl restart dnsmasq hostapd nodogsplash

sudo cp /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.original
sudo sed -i -e 's/server.port                 = 80/server.port                 = 8080/g' /etc/lighttpd/lighttpd.conf
sudo systemctl lighttpd

curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh

sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
sudo npm install -g pm2

sudo su - www-data -s /bin/bash -c "$PATH/npm install"
sudo su - www-data -s /bin/bash -c "$PATH/pm2 start server.js --name='Songbeamer'"
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u www-data --hp /var/www
sudo systemctl enable pm2-www-data

cd $path
rm -r tmp