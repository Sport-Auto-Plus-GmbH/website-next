#!/usr/bin/env bash
# Convenience wrapper for local workspaces that have the Datendrehscheibe repo
# checked out as a sibling folder (../Datendrehscheibe). Delegates to its own
# openapi-sync Node tool (tools/openapi-sync/) — this repo never needs to know
# Datendrehscheibe's internal module layout, only Datendrehscheibe does. That
# tool is plain Node, so it (and this sync) works the same on any OS; this
# bash wrapper is just a shortcut for macOS/Linux shells.
#
# Usage: ./scripts/sync-datendrehscheibe-openapi.sh
# Then review the diff, and run `pnpm generate:datendrehscheibe-types`.
set -euo pipefail

SYNC_TOOL="../Datendrehscheibe/tools/openapi-sync/sync.js"
DEST="openapi/datendrehscheibe"

if [ ! -f "$SYNC_TOOL" ]; then
  echo "error: $SYNC_TOOL not found — this script only works when the Datendrehscheibe repo" >&2
  echo "is checked out as a sibling folder. Ask a teammate for the current spec files" >&2
  echo "and copy them into $DEST manually instead." >&2
  exit 1
fi

node "$SYNC_TOOL" --domain vehicles --dest "$DEST"

echo "Review the diff, then run: pnpm generate:datendrehscheibe-types"
