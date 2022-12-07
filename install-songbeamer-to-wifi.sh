#!/bin/bash
sudo raspi-config nonint do_wifi_country DE
sudo sudo rfkill unblock wifi

sudo apt update && sudo apt full-upgrade -y
sudo apt --purge autoremove -y
sudo apt install -y git
sudo mkdir /var/www

sudo git clone https://gitlab.lighthouse-rbg.de/lighthouse/songbeamer-wlan.git /var/www/songbeamer-wlan

/bin/bash /var/www/songbeamer-wlan/install-songbeamer-hotspot.sh

sudo cp /etc/sysctl.conf /etc/sysctl.conf.orig
# shellcheck disable=SC2024
sudo echo net.ipv4.ip_unprivileged_port_start=80 >> /etc/sysctl.conf
sudo sysctl -w net.ipv4.ip_unprivileged_port_start=80
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs

sudo chown -R www-data: /var/www/

sudo -u www-data npm --prefix /var/www/songbeamer-wlan/ install /var/www/songbeamer-wlan/
sudo cp /var/www/songbeamer-wlan/assets/songbeamer.service /etc/systemd/system/songbeamer.service
sudo systemctl enable songbeamer
sudo systemctl start songbeamer

sudo reboot