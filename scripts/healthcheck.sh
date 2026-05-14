#!/bin/bash
# Simple script to check API health via curl
URL=${1:-"http://localhost/health"}

RESPONSE=$(curl -s -w "%{http_code}" $URL)
HTTP_CODE=${RESPONSE: -3}
BODY=${RESPONSE:0:${#RESPONSE}-3}

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Platform Healthy: $BODY"
  exit 0
else
  echo "❌ Platform Unhealthy (Code: $HTTP_CODE): $BODY"
  exit 1
fi
