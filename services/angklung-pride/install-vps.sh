#!/usr/bin/env bash
set -euo pipefail
cd /home/maxis/angklung-pride
test -f production.env
test -f public/flyer.jpg
mkdir -p data
chmod 700 data
chmod 600 production.env
node --test test.mjs
sudo -n install -m 600 production.env /etc/angklung-pride.env
sudo -n restorecon /etc/angklung-pride.env
sudo -n cp angklung-pride.service /etc/systemd/system/angklung-pride.service
sudo -n systemctl daemon-reload
sudo -n systemctl enable angklung-pride.service
sudo -n systemctl reset-failed angklung-pride.service
sudo -n systemctl restart angklung-pride.service
for attempt in 1 2 3 4 5; do
    if curl --fail --silent http://127.0.0.1:3002/undangan/angklung-pride/ >/dev/null; then break; fi
    sleep 1
done
curl --fail --silent http://127.0.0.1:3002/undangan/angklung-pride/ >/dev/null
sudo -n python3 - <<'PY'
from pathlib import Path
from datetime import datetime, timezone
config = Path('/etc/nginx/conf.d/lembur-udjo.conf')
text = config.read_text()
snippet = Path('/home/maxis/angklung-pride/nginx-location.conf').read_text()
if 'location ^~ /undangan/angklung-pride/' not in text:
    marker = '    location / {'
    if text.count(marker) != 1:
        raise SystemExit('Unexpected Nginx layout; original config preserved.')
    backup = config.with_name(config.name + '.before-pride-' + datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S'))
    backup.write_text(text)
    config.write_text(text.replace(marker, snippet + '\n' + marker, 1))
    Path('/home/maxis/angklung-pride/nginx-backup-path.txt').write_text(str(backup))
PY
if sudo -n nginx -t; then
    sudo -n systemctl reload nginx
else
    if test -f nginx-backup-path.txt; then
        sudo -n cp "$(cat nginx-backup-path.txt)" /etc/nginx/conf.d/lembur-udjo.conf
        sudo -n nginx -t
    fi
    exit 1
fi
sudo -n systemctl is-active angklung-pride.service
