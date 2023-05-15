#!/usr/bin/env bash
GREEN='\033[0;32m'
NOCOL='\033[0m'

set -euxo pipefail
pprint() {
  printf "\n${GREEN}$1${NOCOL}\n"
}

pprint "1/6 Initialisation"
#git clone https://github.com/COMP90082-2022-SM2/HA-2022-SM2.git
export git_ha_root="$(git rev-parse --show-toplevel)"

pprint "2/6 Installing Docker"
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
sudo apt install build-essential -y
sudo mkdir -p /etc/apt/keyrings
sudo apt-get install ca-certificates curl gnupg lsb-release -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
sudo apt install python3-dev -y
sudo usermod -a -G docker $USER
sudo chmod 777 /var/run/docker.sock
sudo usermod -aG docker $USER
sudo apt install python3-pip -y
sudo service docker start

pprint "3/6 Creating HTTPS self-signed keys"
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt

pprint "4/6 Updating Hacking Materials code"
sudo cp /etc/ssl/private/nginx-selfsigned.key $git_ha_root/src/frontend/nginx/nginx-selfsigned.key
sudo cp /etc/ssl/certs/nginx-selfsigned.crt $git_ha_root/src/frontend/nginx/nginx-selfsigned.crt
sudo chown $USER:$USER  $git_ha_root/src/frontend/nginx/nginx-selfsigned.key
sudo chown $USER:$USER  $git_ha_root/src/frontend/nginx/nginx-selfsigned.crt
chmod 664 $git_ha_root/src/frontend/nginx/nginx-selfsigned.key
chmod 664 $git_ha_root/src/frontend/nginx/nginx-selfsigned.crt

pprint "5/6 Creating environment variables"
pprint "\t\t\t\t ENTER DOCKER ENVIRONMENT VALUES\n"
sleep 3
python3 $git_ha_root/src/backend/create_envs.py $git_ha_root

pprint "6/6 Starting containers"
cd "${git_ha_root}/src/backend/"
docker compose --profile backend --profile frontend up