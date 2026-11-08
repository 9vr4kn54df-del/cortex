#!/usr/bin/env bash
# Sets up claude-animation-skills (https://github.com/artemnovitckii/claude-animation-skills)
# for use as Claude Code skills (/graph, /map-route, /breakdown, /minimalistic-graphics,
# /stick-figure, /zach-d-films).
#
# Re-run after `git pull` in ~/claude-animation-skills to pick up new skills.
# On Linux, Chromium is served from the pre-installed path; set CHROME to override.
set -euo pipefail

REPO_DIR="${ANIMATION_SKILLS_DIR:-$HOME/claude-animation-skills}"
REPO_URL="https://github.com/artemnovitckii/claude-animation-skills.git"

say() { printf '\033[1m%s\033[0m\n' "$*"; }

# --- deps ---------------------------------------------------------------
if [[ "$(uname)" == "Darwin" ]]; then
  command -v ffmpeg >/dev/null || brew install ffmpeg
  command -v node   >/dev/null || brew install node
else
  if ! command -v ffmpeg >/dev/null || ! command -v node >/dev/null; then
    say "installing ffmpeg / nodejs via apt"
    apt-get install -y ffmpeg nodejs npm >/dev/null
  fi
fi

# --- clone or update ----------------------------------------------------
if [ -d "$REPO_DIR/.git" ]; then
  say "updating $REPO_DIR"
  git -C "$REPO_DIR" pull --ff-only
else
  say "cloning to $REPO_DIR"
  git clone "$REPO_URL" "$REPO_DIR"
fi

# --- install skills -----------------------------------------------------
# install.sh links skills and runs kit/setup.sh.
# On Linux the Playwright Chromium download is blocked by the network proxy;
# the kit's render scripts support a CHROME env var to use a pre-installed binary.
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
bash "$REPO_DIR/install.sh" || true  # allow playwright download failure

# --- GSAP vendor (cdnjs blocked on some envs) ---------------------------
VENDOR="$REPO_DIR/kit/vendor"
if [ ! -s "$VENDOR/gsap.min.js" ]; then
  say "fetching GSAP via npm (cdnjs fallback)"
  TMP=$(mktemp -d)
  (cd "$TMP" && npm install gsap@3.12.5 --no-save --silent)
  mkdir -p "$VENDOR"
  cp "$TMP/node_modules/gsap/dist/gsap.min.js" "$VENDOR/gsap.min.js"
  rm -rf "$TMP"
fi

# --- hyperframes --------------------------------------------------------
say "warming up HyperFrames"
(cd "$REPO_DIR/kit" && npx --yes hyperframes@0.8.34 --version >/dev/null 2>&1) \
  || echo "warning: hyperframes warmup failed; first render will retry"

say "done"
cat <<'EOF'

Usage notes
-----------
  /graph, /map-route, /breakdown, /minimalistic-graphics  — pure ffmpeg, no browser
  /stick-figure, /zach-d-films                            — render via headless Chromium

On Linux with a pre-installed Chromium (e.g. /opt/pw-browsers/chromium):
  export CHROME=/opt/pw-browsers/chromium
  CHROME=/opt/pw-browsers/chromium node render.mjs stills 1.5 out/

EOF
