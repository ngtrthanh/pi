#!/usr/bin/env sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec "$HERE/pi" --extension "$HERE/examples/extensions/risk-pdca/index.ts" "$@"
