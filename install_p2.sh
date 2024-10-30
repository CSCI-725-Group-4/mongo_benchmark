#!/bin/zsh

docker run hello-world \
&& echo "Finished downloading Docker!" \
&& echo "Starting the install for MongoDB..." \
&& docker pull mongo:latest \
&& docker run -d -p 27017:27017 --name mongodb mongo:latest \
&& echo "Finished downloading MongoDB!"