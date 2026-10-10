#!/bin/bash
# Run the Cloudflare Pages build locally with wrangler state kept out of the checkout.
# Plain `wrangler pages dev` writes .wrangler/ (SQLite files) next to wrangler.toml,
# which a cloud-synced checkout (OneDrive, Google Drive) then uploads on every write.
set -euo pipefail
cd "$(dirname "$0")/.."
PERSIST_DIR="${WRANGLER_PERSIST_DIR:-$HOME/Local-Infra/app-data/ensign-connect-navigator/.wrangler/state}"
mkdir -p "$PERSIST_DIR"
exec npx wrangler pages dev public --persist-to "$PERSIST_DIR" "$@"
