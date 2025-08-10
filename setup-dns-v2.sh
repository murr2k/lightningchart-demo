#!/bin/bash

# Load MCP helpers
source ~/projects/mcp-servers/mcp-helpers.sh

# Get Cloudflare credentials
CLOUDFLARE_API_KEY=$(get_secret cloudflare global_api_key)
CLOUDFLARE_EMAIL="murr2k@gmail.com"  # Your email from CLAUDE.md

if [ -z "$CLOUDFLARE_API_KEY" ]; then
    echo "Error: Could not retrieve Cloudflare API key"
    exit 1
fi

echo "✅ Retrieved Cloudflare credentials"

# Get zone ID for linknode.com
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=linknode.com" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ -z "$ZONE_ID" ] || [ "$ZONE_ID" = "null" ]; then
    echo "Error: Could not retrieve zone ID for linknode.com"
    echo "Debug: Attempting to list all zones..."
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones" \
      -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
      -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
      -H "Content-Type: application/json" | jq '.result[] | {name, id}'
    exit 1
fi

echo "✅ Found zone ID: $ZONE_ID"

# Check if CNAME record already exists
EXISTING_RECORD=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=lc.linknode.com" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ -n "$EXISTING_RECORD" ] && [ "$EXISTING_RECORD" != "null" ]; then
    echo "⚠️  CNAME record already exists, updating..."
    
    # Update existing record
    RESULT=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$EXISTING_RECORD" \
      -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
      -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
      -H "Content-Type: application/json" \
      --data '{
        "type": "CNAME",
        "name": "lc",
        "content": "m2w1r6m.lightning-chart.fly.dev",
        "ttl": 3600,
        "proxied": true
      }' | jq -r '.success')
    
    if [ "$RESULT" = "true" ]; then
        echo "✅ Successfully updated CNAME record for lc.linknode.com"
    else
        echo "❌ Failed to update CNAME record"
        exit 1
    fi
else
    echo "📝 Creating new CNAME record..."
    
    # Create new CNAME record
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
      -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
      -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
      -H "Content-Type: application/json" \
      --data '{
        "type": "CNAME",
        "name": "lc",
        "content": "m2w1r6m.lightning-chart.fly.dev",
        "ttl": 3600,
        "proxied": true
      }')
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    
    if [ "$SUCCESS" = "true" ]; then
        echo "✅ Successfully created CNAME record for lc.linknode.com"
        RECORD_ID=$(echo "$RESPONSE" | jq -r '.result.id')
        echo "   Record ID: $RECORD_ID"
    else
        echo "❌ Failed to create CNAME record"
        echo "Error details:"
        echo "$RESPONSE" | jq '.errors'
        exit 1
    fi
fi

echo ""
echo "🎉 DNS configuration complete!"
echo "📍 Your app will be available at: https://lc.linknode.com"
echo "⏱️  DNS propagation may take 5-10 minutes"
echo ""
echo "Test with: curl -I https://lc.linknode.com/health"