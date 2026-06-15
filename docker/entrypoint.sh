#!/bin/sh
set -e

node /app/replace-runtime-env.mjs
exec "$@"
