# Starts a local n8n instance configured to pick up this package as a custom node.
#
# Companion to `npm run dev:node` (which runs `n8n-node dev --external-n8n`:
# it creates the symlink into the custom nodes folder and watches TypeScript).
#
# We run n8n from a global install instead of letting the CLI shell out to
# `npx --prefer-online n8n@latest`, which reinstalls ~2000 packages on every
# start and fails on Windows with `ECOMPROMISED / Lock compromised` under
# npm 11.6.x.

$ErrorActionPreference = 'Stop'

$userFolder = Join-Path $env:USERPROFILE '.n8n-node-cli'

# Must match the env the n8n-node CLI would have set for its own subprocess.
$env:N8N_DEV_RELOAD = 'true'
$env:DB_SQLITE_POOL_SIZE = '10'
$env:N8N_USER_FOLDER = $userFolder

Write-Host "Starting n8n with N8N_USER_FOLDER=$userFolder"
Write-Host "Editor will be available at http://localhost:5678"

n8n start
