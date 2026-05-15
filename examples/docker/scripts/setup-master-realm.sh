#!/bin/sh
set -e

DIR="$(dirname "$0")"
"$DIR/wait-for-keycloak.sh"

/opt/keycloak/bin/kcadm.sh update realms/master -s sslRequired=NONE
