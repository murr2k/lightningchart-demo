#!/bin/bash
source ~/projects/mcp-servers/mcp-helpers.sh
TOKEN=$(get_secret cloudflare api_token)
echo "Token length: ${#TOKEN}"
curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'