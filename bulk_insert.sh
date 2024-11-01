#!/bin/zsh

if [[ $(docker ps --filter "name=mongodb" --filter "status=running" --format "{{.Names}}") == "mongodb" ]]; then
    echo "MongoDB is already running."
else
    echo "MongoDB is not running. Starting the MongoDB container..."
    
    # Try to start the MongoDB container
    docker start mongodb
    
    # Check if it started successfully
    if [[ $(docker ps --filter "name=mongodb" --filter "status=running" --format "{{.Names}}") == "mongodb" ]]; then
        echo "MongoDB container started successfully."
    else
        echo "Failed to start the MongoDB container. Please check if the container exists."
        exit 1
    fi
fi

echo "Running NoSQLBench..."
./nb5 ~/mongo_benchmark/activities/mongodb_insert_16.yaml rampup-cycles=16000