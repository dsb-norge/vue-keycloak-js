#!/bin/sh
set -e

REALM=""
USERNAME=""
EMAIL=""
PASSWORD=""
EMAIL_VERIFIED="false"
FIRSTNAME=""
LASTNAME=""

while [ $# -gt 0 ]; do
  case "$1" in
    --realm) REALM="$2"; shift 2 ;;
    --realm=*) REALM="${1#*=}"; shift ;;
    --username) USERNAME="$2"; shift 2 ;;
    --username=*) USERNAME="${1#*=}"; shift ;;
    --email) EMAIL="$2"; shift 2 ;;
    --email=*) EMAIL="${1#*=}"; shift ;;
    --password) PASSWORD="$2"; shift 2 ;;
    --password=*) PASSWORD="${1#*=}"; shift ;;
    --email-verified) EMAIL_VERIFIED="$2"; shift 2 ;;
    --email-verified=*) EMAIL_VERIFIED="${1#*=}"; shift ;;
    --firstname) FIRSTNAME="$2"; shift 2 ;;
    --firstname=*) FIRSTNAME="${1#*=}"; shift ;;
    --lastname) LASTNAME="$2"; shift 2 ;;
    --lastname=*) LASTNAME="${1#*=}"; shift ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [ -z "$REALM" ] || [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
  echo "Usage: $0 --realm R --username U --password P [--email E] [--email-verified true|false] [--firstname F] [--lastname L]" >&2
  exit 1
fi

DIR="$(dirname "$0")"
"$DIR/wait-for-keycloak.sh"

EXISTING=$(/opt/keycloak/bin/kcadm.sh get users -r "$REALM" -q username="$USERNAME" --fields id --format csv --noquotes 2>/dev/null | tail -n +2 | head -n 1 || true)

if [ -n "$EXISTING" ]; then
  echo "User '$USERNAME' already exists in realm '$REALM', skipping."
  exit 0
fi

/opt/keycloak/bin/kcadm.sh create users -r "$REALM" \
  -s username="$USERNAME" \
  -s email="$EMAIL" \
  -s emailVerified="$EMAIL_VERIFIED" \
  -s firstName="$FIRSTNAME" \
  -s lastName="$LASTNAME" \
  -s enabled=true

/opt/keycloak/bin/kcadm.sh set-password -r "$REALM" \
  --username "$USERNAME" --new-password "$PASSWORD"

echo "Created user '$USERNAME' in realm '$REALM'."
