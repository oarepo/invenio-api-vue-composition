#!/bin/bash

source .venv/bin/activate

sleep 20    # wait for ES to start

export CLUSTER_SERVER_NAME="localhost:5000"

./bootstrap.sh &
./run.sh


