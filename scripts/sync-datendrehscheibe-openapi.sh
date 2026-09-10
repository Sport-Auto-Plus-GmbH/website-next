#!/usr/bin/env bash
# Convenience script for local workspaces that have the Datendrehscheibe repo
# checked out as a sibling folder (../Datendrehscheibe). Not used in CI or by
# anyone without that checkout — the vendored copy in openapi/datendrehscheibe/
# is the source of truth for this repo either way.
#
# Usage: ./scripts/sync-datendrehscheibe-openapi.sh
# Then review the diff, and run `pnpm generate:datendrehscheibe-types`.
set -euo pipefail

SOURCE="../Datendrehscheibe/de.saplus.datahub.api.http/src/main/openapi"
DEST="openapi/datendrehscheibe"

if [ ! -d "$SOURCE" ]; then
  echo "error: $SOURCE not found — this script only works when the Datendrehscheibe repo" >&2
  echo "is checked out as a sibling folder. Ask a teammate for the current spec files" >&2
  echo "and copy them into $DEST manually instead." >&2
  exit 1
fi

cp "$SOURCE/api-vehicles-v1.0.yaml" "$DEST/api-vehicles-v1.0.yaml"
cp "$SOURCE/common/error.yaml" "$DEST/common/error.yaml"
cp "$SOURCE/common/security.yaml" "$DEST/common/security.yaml"

echo "Synced. Review the diff, then run: pnpm generate:datendrehscheibe-types"
