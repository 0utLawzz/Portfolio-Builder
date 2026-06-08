#!/bin/bash
# Load .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi
node dist/index.mjs
