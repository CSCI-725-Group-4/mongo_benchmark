#!/bin/zsh

echo "Starting the install for NoSQLBenchark 5..." \
&& sudo apt update && sudo apt upgrade -y \
&& sudo apt-get install openjdk-21-jdk openjdk-21-jre libfuse2 -y \
&& curl -L -O https://github.com/nosqlbench/nosqlbench/releases/latest/download/nb5 \
&& chmod +x nb5 \
&& ./nb5 --version \
&& curl -L -O https://github.com/nosqlbench/nosqlbench/releases/latest/download/nb5.jar \
&& java -jar nb5.jar --version \
&& echo "Finished downloading NoSQLBenchark!" \
&& echo "Starting the install for Docker..." \
&& for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done \
&& sudo apt-get update \
&& sudo apt-get install ca-certificates curl -y \
&& sudo install -m 0755 -d /etc/apt/keyrings \
&& sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \
&& sudo chmod a+r /etc/apt/keyrings/docker.asc \
&& echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \
&& sudo apt-get update \
&& sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y \
&& sudo usermod -aG docker $USER \
&& echo "Make sure to logout now, then log back in as your user."