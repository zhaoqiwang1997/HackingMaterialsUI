#!/bin/bash
set -Eeuxo pipefail
cd "$(git rev-parse --show-toplevel)/src/backend"
docker-compose down
docker-compose up -d
