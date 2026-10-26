#!/usr/bin/env bash
# Build a self-contained upload for a portal: tools/portal-zip.sh crazygames|poki  → dist/<portal>.zip
set -euo pipefail
P="${1:-crazygames}"; cd "$(dirname "$0")/.."
ART=1 OUT_DIR="public/portal/$P" node build.js "https://ba-khi.vercel.app/portal/$P/" en "$P"
rm -rf "dist/$P" && mkdir -p "dist/$P"
cp -r "public/portal/$P/." "dist/$P/" && cp -r public/img "dist/$P/img"
# the hosted edition reaches ../../img/; the zip carries img/ beside index.html
sed -i 's#"imgBase":"../../img/"#"imgBase":"img/"#' "dist/$P/config.js"
( cd "dist/$P" && rm -f "../$P.zip" && zip -qr "../$P.zip" . )
echo "dist/$P.zip $(du -h "dist/$P.zip" | cut -f1)"
