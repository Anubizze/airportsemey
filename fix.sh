#!/usr/bin/env bash
# Restore the two verified Docker routes when Docker starts on the airport VPS.
set -euo pipefail

if [[ $(id -u) != 0 ]]; then
  echo 'Run this installer as root.' >&2
  exit 1
fi

for tool in ip systemctl systemd-analyze install mktemp grep cp; do
  command -v "$tool" >/dev/null || { echo "Missing command: $tool" >&2; exit 1; }
done
systemctl is-active --quiet docker.service || { echo 'Docker is not active.' >&2; exit 1; }

# Refuse to install fixed routes on a host with different Docker subnets.
ip -4 -o addr show dev docker0 | grep -Fq 'inet 172.17.0.1/16 ' || {
  echo 'Unexpected docker0 address; no configuration changed.' >&2
  exit 1
}
ip -4 -o addr show dev docker_gwbridge | grep -Fq 'inet 172.18.0.1/16 ' || {
  echo 'Unexpected docker_gwbridge address; no configuration changed.' >&2
  exit 1
}

work_dir=$(mktemp -d /tmp/airport-docker-routes.XXXXXXXX)
candidate="$work_dir/airport-docker-routes.service"
cleanup() {
  rm -f -- "$candidate"
  rmdir -- "$work_dir"
}
trap cleanup EXIT

cat > "$candidate" <<'UNIT'
[Unit]
Description=Restore airport Docker routes
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target
PartOf=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
Restart=on-failure
RestartSec=5
ExecStart=/usr/bin/env ip route replace 172.17.0.0/16 dev docker0 src 172.17.0.1
ExecStart=/usr/bin/env ip route replace 172.18.0.0/16 dev docker_gwbridge src 172.18.0.1

[Install]
WantedBy=docker.service
UNIT

# Validate before installing. Preserve any existing copy, including a manual draft.
systemd-analyze verify "$candidate"
unit_path=/etc/systemd/system/airport-docker-routes.service
if [[ -e "$unit_path" || -L "$unit_path" ]]; then
  if [[ -L "$unit_path" || ! -f "$unit_path" ]]; then
    echo 'Existing unit is not a regular file; no configuration changed.' >&2
    exit 1
  fi
  backup=$(mktemp /etc/systemd/system/airport-docker-routes.service.backup.XXXXXXXX)
  cp -p -- "$unit_path" "$backup"
  echo "Previous unit saved to $backup"
fi
install -m 0644 -- "$candidate" "$unit_path"
systemctl daemon-reload
systemctl enable --now airport-docker-routes.service
# Reapply if the service was already active during a repeated installation.
systemctl restart airport-docker-routes.service
systemctl is-enabled airport-docker-routes.service
systemctl is-active airport-docker-routes.service
echo 'Docker route restoration is installed. Website data was not modified.'
